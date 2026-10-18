import{i as e,t}from"./react-sySUN5R7.js";import{O as n}from"./sculpture-dark-Cfb-XN1r.js";import{a as r,i,n as a,r as o,t as s}from"./Triangle-CxvaD6kv.js";var c=e(t(),1),l=n(),u={bulge:0,pinch:1,swirl:2},ee=1600,d=1.6,f=4,p=`#version 300 es
in vec2 position;
in vec2 uv;
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`,m=`#version 300 es
precision highp float;

uniform sampler2D uTextTexture;
uniform vec2 uResolution;
uniform vec2 uPointer;
uniform float uPointerActive;
uniform float uTime;
uniform float uWarpStrength;
uniform float uWarpScale;
uniform float uSpeed;
uniform float uPointerInfluence;
uniform float uPointerStrength;
uniform float uRefraction;
uniform float uChromatic;
uniform float uRipple;
uniform float uMotion;
uniform float uLens;
uniform float uIntro;
uniform float uReveal;
uniform float uBackdrop;
uniform vec4 uClicks[4];

in vec2 vUv;
out vec4 fragColor;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);

  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));

  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 4; i++) {
    value += amplitude * noise(p);
    p *= 2.02;
    amplitude *= 0.5;
  }
  return value;
}

vec4 sampleText(vec2 uv) {
  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
    return vec4(0.0);
  }
  return texture(uTextTexture, uv);
}

void main() {
  vec2 uv = vUv;
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  float time = uTime * uSpeed;
  float scale = max(uWarpScale, 0.001);

  vec2 drift = vec2(time * 0.055, -time * 0.045);
  float n1 = fbm(uv * scale * 3.1 + drift);
  float n2 = fbm((uv + 19.17) * scale * 3.4 - drift.yx);
  vec2 ambient = (vec2(n1, n2) - 0.5) * (uWarpStrength * 0.045 * uMotion + uIntro * 0.18);

  vec2 pointerDelta = uv - uPointer;
  vec2 aspectDelta = vec2(pointerDelta.x * aspect, pointerDelta.y);
  float dist = length(aspectDelta);
  float radius = max(uPointerInfluence, 0.001);
  float t = clamp(dist / radius, 0.0, 1.0);
  float lens = smoothstep(radius, 0.0, dist) * uPointerActive;
  float bulge = t * (1.0 - t) * (1.0 - t) * 6.75 * uPointerActive;
  vec2 dir = dist > 0.0001 ? vec2(aspectDelta.x / aspect, aspectDelta.y) / dist : vec2(0.0);

  float rippleWave = sin(dist * 28.0 - time * 4.2) * 0.5 + 0.5;
  float rippleRing = (rippleWave - 0.5) * uRipple;
  vec2 pointerWarp = dir * rippleRing * bulge * uPointerStrength * 0.016;

  if (uLens > 1.5) {
    float twist = (1.0 - t) * (1.0 - t) * uPointerActive * uPointerStrength * 2.4;
    float s = sin(twist);
    float c = cos(twist);
    vec2 turned = vec2(aspectDelta.x * c - aspectDelta.y * s, aspectDelta.x * s + aspectDelta.y * c);
    pointerWarp += vec2(turned.x / aspect, turned.y) - pointerDelta;
  } else {
    float side = uLens > 0.5 ? -1.0 : 1.0;
    pointerWarp -= dir * side * bulge * uPointerStrength * 0.045;
  }

  vec2 shock = vec2(0.0);
  float shockLight = 0.0;
  for (int i = 0; i < 4; i++) {
    vec4 click = uClicks[i];
    if (click.w <= 0.0) continue;
    vec2 clickDelta = uv - click.xy;
    vec2 clickAspect = vec2(clickDelta.x * aspect, clickDelta.y);
    float clickDist = length(clickAspect);
    float age = click.z;
    float offset = (clickDist - age * 0.9) / (0.06 + age * 0.06);
    float fade = 1.0 - smoothstep(0.0, 1.6, age);
    float energy = exp(-offset * offset) * fade * smoothstep(0.0, 0.08, age) * click.w;
    vec2 clickDir = clickDist > 0.0001 ? vec2(clickAspect.x / aspect, clickAspect.y) / clickDist : vec2(0.0);
    shock -= clickDir * offset * energy * 0.09;
    shockLight += energy;
  }

  vec2 bend = pointerWarp + shock;
  vec2 rest = uv + ambient;
  vec2 splitDir = ambient + bend;
  float splitLen = length(splitDir);
  splitDir = splitLen > 0.00001 ? splitDir / splitLen : vec2(0.7071, 0.7071);
  vec2 split = splitDir * uRefraction * 0.16 * (0.35 + lens * 1.65 + uIntro * 3.0);
  float dispersion = uChromatic * 0.5;

  vec3 ink = vec3(0.0);
  vec3 cover = vec3(0.0);
  vec3 weight = vec3(0.0);
  for (int i = 0; i < 7; i++) {
    float k = 1.0 - float(i) / 3.0;
    vec4 tap = sampleText(rest + bend * (1.0 + dispersion * k) + split * k);
    vec3 band = vec3(max(k, 0.0), 1.0 - abs(k), max(-k, 0.0));
    ink += tap.rgb * band;
    cover += tap.a * band;
    weight += band;
  }
  ink /= weight;
  cover /= weight;
  float a = max(max(cover.r, cover.g), cover.b);
  vec3 color = ink + (a - cover) * uBackdrop;
  color = min(color + (lens + shockLight * 0.5) * cover.g * 0.055, vec3(a));
  fragColor = vec4(color, a) * uReveal;
}
`,h=e=>typeof e==`number`?`${e}px`:e,g=e=>e*e*(3-2*e),_=e=>{let t=document.createElement(`canvas`);t.width=1,t.height=1;let n=t.getContext(`2d`,{willReadFrequently:!0});if(!n)return 1;n.fillStyle=e,n.fillRect(0,0,1,1);let[r,i,a]=n.getImageData(0,0,1,1).data;return(.2126*r+.7152*i+.0722*a)/255},v=(e,t,n)=>{let r=Array.from(t);return r.reduce((t,n)=>t+e.measureText(n).width,0)+Math.max(0,r.length-1)*n},y=(e,t,n,r,i)=>{let a=Array.from(t),o=n-v(e,t,i)/2;a.forEach((t,n)=>{e.fillText(t,o,r),o+=e.measureText(t).width+(n===a.length-1?0:i)})},b=({container:e,width:t,height:n,dpr:r,props:i})=>{let a=document.createElement(`canvas`);a.width=Math.max(1,Math.floor(t*r)),a.height=Math.max(1,Math.floor(n*r));let o=a.getContext(`2d`);if(!o)return{canvas:a,ink:i.color};let s=document.createElement(`span`);s.textContent=i.text,Object.assign(s.style,{position:`absolute`,visibility:`hidden`,pointerEvents:`none`,whiteSpace:`pre`,inset:`0 auto auto 0`,color:i.color,fontFamily:i.fontFamily,fontSize:h(i.fontSize),fontWeight:String(i.fontWeight),letterSpacing:h(i.letterSpacing),lineHeight:typeof i.lineHeight==`number`?String(i.lineHeight):i.lineHeight}),e.appendChild(s);let c=window.getComputedStyle(s),l=parseFloat(c.fontSize)||96,u=c.color||i.color,ee=c.fontFamily||`sans-serif`,d=c.fontWeight||String(i.fontWeight),f=c.letterSpacing===`normal`?0:parseFloat(c.letterSpacing)||0,p=parseFloat(c.lineHeight);Number.isFinite(p)||(p=l*(typeof i.lineHeight==`number`?i.lineHeight:.92)),s.remove(),o.setTransform(r,0,0,r,0,0),o.clearRect(0,0,t,n),o.textAlign=`left`,o.textBaseline=`middle`,o.fillStyle=u,o.imageSmoothingEnabled=!0,o.imageSmoothingQuality=`high`;let m=String(i.text||``).split(`
`),g=()=>{o.font=`${d} ${l}px ${ee}`};g();let _=t*.86,b=n*.78,x=Math.max(...m.map(e=>v(o,e,f)),1),S=Math.max(p*m.length,1),C=Math.min(1,_/x,b/S);C<1&&(l*=C,f*=C,p*=C,g());let w=n/2-p*(m.length-1)/2;return m.forEach((e,n)=>y(o,e,t/2,w+n*p,f)),{canvas:a,ink:u}},x=(e,t)=>{let n=e.uniforms;n.uWarpStrength.value=t.warpStrength,n.uWarpScale.value=t.warpScale,n.uSpeed.value=t.speed,n.uPointerInfluence.value=t.pointerInfluence,n.uPointerStrength.value=t.pointerStrength,n.uRefraction.value=t.refraction,n.uChromatic.value=t.chromatic,n.uRipple.value=+!!t.ripple,n.uLens.value=u[t.lens]??0},S=({text:e=`Bend the moment`,color:t=`currentColor`,warpStrength:n=.08,warpScale:v=1.7,speed:y=.55,pointerInfluence:S=.42,pointerStrength:C=.38,refraction:w=.018,chromatic:T=0,ripple:E=!0,clickRipple:D=!0,idleDrift:O=.2,lens:k=`bulge`,intro:A=!0,fontSize:j=`clamp(3rem, 10vw, 9rem)`,fontWeight:M=800,fontFamily:N=`inherit`,letterSpacing:P=`-0.06em`,lineHeight:F=.9,className:I=``,style:L})=>{let R=(0,c.useRef)(null),z=(0,c.useRef)({text:e,color:t,fontSize:j,fontWeight:M,fontFamily:N,letterSpacing:P,lineHeight:F,warpStrength:n,warpScale:v,speed:y,pointerInfluence:S,pointerStrength:C,refraction:w,chromatic:T,ripple:E,clickRipple:D,idleDrift:O,lens:k,intro:A}),B=(0,c.useRef)(null),[V,H]=(0,c.useState)(!1);return(0,c.useEffect)(()=>{z.current={text:e,color:t,fontSize:j,fontWeight:M,fontFamily:N,letterSpacing:P,lineHeight:F,warpStrength:n,warpScale:v,speed:y,pointerInfluence:S,pointerStrength:C,refraction:w,chromatic:T,ripple:E,clickRipple:D,idleDrift:O,lens:k,intro:A},B.current&&x(B.current.program,z.current)},[e,t,j,M,N,P,F,n,v,y,S,C,w,T,E,D,O,k,A]),(0,c.useEffect)(()=>{B.current?.rasterize()},[e,t,j,M,N,P,F]),(0,c.useEffect)(()=>{let e=R.current;if(!e||typeof window>`u`)return;let t,n,c,l,h,v,y=null,S=null,C=0,w=!1,T=!1,E=!0,D=!document.hidden,O=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches??!1,k=0,A=!1,j=z.current.intro&&!O?0:1,M=0,N=0,P=``,F={x:.5,y:.5,tx:.5,ty:.5,active:0,activeTarget:0},I=Array.from({length:f},()=>[.5,.5,0,0]),L=0,V=performance.now();try{t=new i({webgl:2,alpha:!0,premultipliedAlpha:!0,antialias:!0,dpr:Math.min(window.devicePixelRatio||1,2)}),n=t.gl}catch(e){console.warn(`WarpText: WebGL could not be initialized.`,e),H(!0);return}n.clearColor(0,0,0,0);let U=n.canvas;U.style.position=`absolute`,U.style.inset=`0`,U.style.width=`100%`,U.style.height=`100%`,U.style.display=`block`,U.setAttribute(`aria-hidden`,`true`),e.appendChild(U),v=new a(n,{generateMipmaps:!1,premultiplyAlpha:!0,minFilter:n.LINEAR,magFilter:n.LINEAR,wrapS:n.CLAMP_TO_EDGE,wrapT:n.CLAMP_TO_EDGE}),l=new s(n),c=new r(n,{vertex:p,fragment:m,transparent:!0,depthTest:!1,depthWrite:!1,uniforms:{uTextTexture:{value:v},uResolution:{value:new Float32Array([1,1])},uPointer:{value:new Float32Array([.5,.5])},uPointerActive:{value:0},uTime:{value:0},uWarpStrength:{value:z.current.warpStrength},uWarpScale:{value:z.current.warpScale},uSpeed:{value:z.current.speed},uPointerInfluence:{value:z.current.pointerInfluence},uPointerStrength:{value:z.current.pointerStrength},uRefraction:{value:z.current.refraction},uChromatic:{value:z.current.chromatic},uRipple:{value:+!!z.current.ripple},uMotion:{value:+!O},uLens:{value:u[z.current.lens]??0},uIntro:{value:0},uReveal:{value:0},uBackdrop:{value:0},uClicks:{value:I}}}),h=new o(n,{geometry:l,program:c});let W=()=>{w||T||t.render({scene:h})},G=async()=>{let t=++k;if(document.fonts?.ready)try{await document.fonts.ready}catch{}if(w||T||t!==k)return;let n=e.getBoundingClientRect();if(n.width<=0||n.height<=0)return;let r=Math.min(window.devicePixelRatio||1,2);P=window.getComputedStyle(e).color;let i=b({container:e,width:n.width,height:n.height,dpr:r,props:z.current});v.image=i.canvas,v.needsUpdate=!0,c.uniforms.uBackdrop.value=+(_(i.ink)<.5),A=!0,W()},K=()=>{if(w||T)return;let r=e.getBoundingClientRect();r.width<=0||r.height<=0||(t.dpr=Math.min(window.devicePixelRatio||1,2),t.setSize(r.width,r.height),c.uniforms.uResolution.value[0]=n.drawingBufferWidth,c.uniforms.uResolution.value[1]=n.drawingBufferHeight,G())},q=e=>{if(e.pointerType===`touch`)return;let t=U.getBoundingClientRect();t.width<=0||t.height<=0||(F.tx=(e.clientX-t.left)/t.width,F.ty=1-(e.clientY-t.top)/t.height,F.activeTarget=1)},J=()=>{F.activeTarget=0},Y=e=>{if(!z.current.clickRipple)return;let t=U.getBoundingClientRect();if(t.width<=0||t.height<=0)return;let n=I[L];L=(L+1)%I.length,n[0]=(e.clientX-t.left)/t.width,n[1]=1-(e.clientY-t.top)/t.height,n[2]=0,n[3]=O?.35:1},X=e=>{e.preventDefault(),T=!0,C&&cancelAnimationFrame(C),C=0,H(!0)},Z=()=>{D=!document.hidden,D&&E&&!C&&(C=requestAnimationFrame($)),!D&&C&&(cancelAnimationFrame(C),C=0)},Q=window.matchMedia?.(`(prefers-reduced-motion: reduce)`),te=e=>{O=e.matches,O&&(j=1),c.uniforms.uMotion.value=+!O,W()},$=t=>{if(w||T)return;let n=(t-V)*.001,r=M?Math.min(t-M,50):16;M=t,N+=1,A&&j<1&&(j=Math.min(1,j+r/ee));let i=1-j;A&&N%15==0&&window.getComputedStyle(e).color!==P&&G();let a=Math.min(Math.max(z.current.idleDrift,0),1),o=F.activeTarget>0,s=.5+Math.sin(n*.33)*(.08+a*.2),l=.5+Math.cos(n*.27)*(.06+a*.2),u=1-Math.exp(-r/(o?130:470));F.x+=((o?F.tx:s)-F.x)*u,F.y+=((o?F.ty:l)-F.y)*u,F.active+=((o?1:a)-F.active)*(1-Math.exp(-r/270)),I.forEach(e=>{e[3]<=0||(e[2]+=r/1e3,e[2]>d&&(e[3]=0))}),c.uniforms.uPointer.value[0]=F.x,c.uniforms.uPointer.value[1]=F.y,c.uniforms.uPointerActive.value=O?F.active*.35:F.active,c.uniforms.uTime.value=O?0:n,c.uniforms.uIntro.value=i*i*i,c.uniforms.uReveal.value=A?g(Math.min(1,j/.45)):0,W(),C=requestAnimationFrame($)};return y=new ResizeObserver(K),y.observe(e),S=new IntersectionObserver(([e])=>{E=e.isIntersecting,E&&D&&!C&&(C=requestAnimationFrame($)),!E&&C&&(cancelAnimationFrame(C),C=0)},{threshold:0}),S.observe(e),U.addEventListener(`pointermove`,q),U.addEventListener(`pointerleave`,J),U.addEventListener(`pointerdown`,Y),U.addEventListener(`webglcontextlost`,X,!1),document.addEventListener(`visibilitychange`,Z),Q?.addEventListener(`change`,te),x(c,z.current),B.current={program:c,rasterize:G},K(),C=requestAnimationFrame($),()=>{if(w=!0,B.current=null,C&&cancelAnimationFrame(C),y?.disconnect(),S?.disconnect(),U.removeEventListener(`pointermove`,q),U.removeEventListener(`pointerleave`,J),U.removeEventListener(`pointerdown`,Y),U.removeEventListener(`webglcontextlost`,X),document.removeEventListener(`visibilitychange`,Z),Q?.removeEventListener(`change`,te),!T)try{v?.texture&&n.deleteTexture(v.texture),l?.remove?.(),c?.remove?.(),n.getExtension(`WEBGL_lose_context`)?.loseContext()}catch{}U.parentNode===e&&e.removeChild(U)}},[]),(0,l.jsx)(`div`,{ref:R,className:`relative block min-h-[220px] w-full overflow-hidden isolate rounded-[inherit] ${I}`.trim(),style:L,role:`img`,"aria-label":e,children:V&&(0,l.jsx)(`span`,{className:`absolute inset-0 flex items-center justify-center whitespace-pre-line px-[7%] text-center`,"aria-hidden":`true`,style:{color:t,fontFamily:N,fontWeight:M,fontSize:h(j),letterSpacing:h(P),lineHeight:F},children:e})})};export{S as default};