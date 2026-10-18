import{i as e,t}from"./react-sySUN5R7.js";import{k as n}from"./sculpture-dark-CKiqtzhU.js";var r=e(t(),1),i=n(),a=`relative h-full w-full overflow-hidden`,o=`absolute inset-0 block h-full w-full`,s=6,c=16,l=8,u=.06,d=.9,f=1.8,p=2.4,m=.4,h={molten:.5,ember:.3,frost:.7},g=`#version 300 es
in vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`,_=`#version 300 es
precision highp float;
uniform vec2 uResolution;
uniform float uTime;
uniform float uClock;
uniform float uScale;
uniform float uDetail;
uniform float uGlow;
uniform float uThickness;
uniform float uSwirl;
uniform float uFold;
uniform float uBlackPoint;
uniform float uBrightness;
uniform float uBalance;
uniform float uGrain;
uniform float uOpacity;
uniform vec2 uOffset;
uniform vec2 uRotation;
uniform vec2 uDrift;
uniform vec3 uColors[${s}];
uniform int uColorCount;
uniform vec3 uBackground;
uniform float uOpaque;
uniform float uLight;
uniform vec3 uReveal;
uniform vec4 uTrail[${c}];
uniform float uTrailWeight[${c}];
uniform int uTrailCount;
uniform vec4 uFlares[${l}];
uniform int uFlareCount;
uniform vec4 uHeat;
out vec4 outColor;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

vec3 palette(float g) {
  if (uColorCount <= 1) return uColors[0];
  float t = g < uBalance ? 0.5 * g / uBalance : 0.5 + 0.5 * (g - uBalance) / (1.0 - uBalance);
  float scaled = t * float(uColorCount - 1);
  int index = int(min(floor(scaled), float(uColorCount - 2)));
  return mix(uColors[index], uColors[index + 1], smoothstep(0.0, 1.0, scaled - float(index)));
}

float warmth(float age, float weight, vec2 offset) {
  float life = clamp(age / ${d.toFixed(2)}, 0.0, 1.0);
  vec2 spread = offset / (uHeat.z * (1.0 + 0.8 * life));
  return weight * (1.0 - life) * (1.0 - life) * exp(-dot(spread, spread));
}

float trailHeat(vec2 q) {
  float heat = 0.0;
  for (int k = 0; k < ${c}; k++) {
    if (k >= uTrailCount) break;
    vec4 a = uTrail[k];
    float weight = uTrailWeight[k];
    heat = max(heat, warmth(a.z, weight, q - a.xy));
    int next = min(k + 1, 15);
    if (next == k || next >= uTrailCount) continue;
    vec4 b = uTrail[next];
    float older = uTrailWeight[next];
    vec2 ab = b.xy - a.xy;
    float span = dot(ab, ab);
    float t = span > 1e-10 ? clamp(dot(q - a.xy, ab) / span, 0.0, 1.0) : 0.0;
    float even = smoothstep(0.0, uHeat.z, sqrt(span));
    float age = mix(min(a.w, b.z), mix(a.w, b.z, t), even);
    float strength = mix(max(weight, older), mix(weight, older, t), even);
    heat = max(heat, warmth(age, strength, q - a.xy - ab * t));
  }
  return heat;
}

float flareHeat(vec2 q) {
  float heat = 0.0;
  for (int k = 0; k < ${l}; k++) {
    if (k >= uFlareCount) break;
    vec4 f = uFlares[k];
    float life = clamp(f.z / ${f.toFixed(2)}, 0.0, 1.0);
    float rise = 1.0 - exp(-f.z / 0.07);
    float fall = exp(-3.0 * life) * (1.0 - life) * (1.0 - life);
    vec2 offset = (q - f.xy) / (uHeat.z * (0.9 + 1.6 * sqrt(life)));
    heat += rise * fall * exp(-dot(offset, offset));
  }
  return heat;
}

void main() {
  float time = uTime;
  vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / uResolution.y;
  vec2 q = uv - uOffset;
  vec2 view = vec2(q.x * uRotation.x - q.y * uRotation.y, q.x * uRotation.y + q.y * uRotation.x);
  vec2 p = uScale * view - 0.5;
  p += uDrift;

  float heat = 0.0;
  float flare = 0.0;
  if (uHeat.w > 0.5) {
    heat = trailHeat(uv) * uHeat.x;
    flare = flareHeat(uv) * uHeat.y;
  }
  float power = uThickness * (1.0 + (heat + flare) * 0.45);

  vec2 i = p;
  float c = 0.0;
  float blurred = 0.0;
  float r = length(p + vec2(sin(time), sin(time * 0.3 + 5.0)) * 0.5);
  float d = length(p);
  float rot = d + time + p.x * uSwirl;
  float cosRot = cos(rot);
  mat2 warp = mat2(cos(rot - sin(time / 5.0)), sin(rot), -sin(cosRot - time), cosRot) * uFold;
  float layers = ceil(uDetail);

  for (float n = 0.0; n < 8.0; n++) {
    if (n >= layers) break;
    p *= warp;
    float t = r - time / (n + 3.0);
    i -= p + vec2(cos(t - i.x - r) + sin(t + i.y), sin(t - i.y) + cos(t + i.x) + r);
    float l = length(vec2(sin(i.x + t), cos(i.y + t)));
    float footprint = 0.5 * length(vec2(dFdx(l), dFdy(l)));
    l = sqrt(l * l + footprint * footprint);
    float weight = clamp(uDetail - n, 0.0, 1.0);
    c += weight * uGlow / (power == 1.0 ? l : pow(max(l, 1e-6), power));
    if (uReveal.y > 0.5) blurred += weight * uGlow / sqrt(l * l + 0.0025);
  }

  c /= 6.0;
  c *= 1.0 + heat * 0.25 + flare * 0.6;

  float reveal = 1.0;
  float front = 0.0;
  if (uReveal.y > 0.5) {
    float level = log(max(blurred / 6.0, 1e-5)) - uReveal.x;
    reveal = smoothstep(-1.0, 1.0, level) * smoothstep(0.0, 0.08, uReveal.z);
    front = 0.2 * exp(-level * level * 1.5) * smoothstep(-2.6, -0.6, uReveal.x);
  }

  float g = clamp(max(c - uBlackPoint, 0.0) * uBrightness + front, 0.0, 1.0);
  vec3 col = palette(g);
  float noise = hash(gl_FragCoord.xy + fract(uClock) * 97.0) - 0.5;
  float a;
  if (uLight < 0.5) {
    a = g + noise * uGrain;
  } else {
    float lift = max(g - 0.03, 0.0) / 0.97;
    a = (1.0 - exp(-6.0 * lift)) / (1.0 - exp(-6.0)) + noise * uGrain * g;
  }
  a = clamp(a + noise / 255.0, 0.0, 1.0) * reveal * uOpacity;

  if (uOpaque > 0.5) {
    outColor = vec4(mix(uBackground, col, a), 1.0);
  } else {
    outColor = vec4(col * a, a);
  }
}`,v=(e,t,n)=>Math.min(n,Math.max(t,e)),y=null,b=(e,t)=>{if(e===`transparent`)return null;if(typeof document>`u`||(y||(y=document.createElement(`canvas`).getContext(`2d`)),!y))return t;y.fillStyle=`#000000`,y.fillStyle=e;let n=y.fillStyle;if(n.startsWith(`#`)){let e=parseInt(n.slice(1),16);return[(e>>16&255)/255,(e>>8&255)/255,(e&255)/255]}let r=/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?/.exec(n);return r?r[4]!==void 0&&Number(r[4])===0?null:[Number(r[1])/255,Number(r[2])/255,Number(r[3])/255]:t},x=(e,t,n)=>{let r=e.createShader(t);return r?(e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(e.deleteShader(r),null)):null},S=()=>typeof window<`u`&&(window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches??!1);function C({colors:e=[`#5227FF`,`#FF9FFC`],coreColor:t=`#FFFFFF`,backgroundColor:n=`transparent`,lightMode:s=!1,speed:y=.35,scale:C=4,detail:w=3,glow:T=1.6,thickness:E=1,swirl:D=1,turbulence:O=.2,haze:k=.75,brightness:A=1.3,colorMode:j=`molten`,rotation:M=0,offsetX:N=0,offsetY:P=0,drift:F=.3,grain:I=.05,opacity:L=1,intro:R=!0,mouseInteraction:z=!0,mouseStrength:B=.5,flareOnClick:V=!0,paused:H=!1,dpr:U=2,className:W=``,style:G}){let K=(0,r.useRef)(null),q=[...e.slice(0,5),t].join(`|`),J={palette:(0,r.useMemo)(()=>q.split(`|`).map(e=>b(e,[1,1,1])??[1,1,1]),[q]),paper:(0,r.useMemo)(()=>b(n,null),[n]),lightMode:s,speed:y,scale:Math.max(.1,C),detail:v(w,1,8),glow:Math.max(0,T),thickness:v(E,.2,3),swirl:D,fold:-O,blackPoint:.2*(1-v(k,0,1)),brightness:Math.max(0,A),balance:h[j]??.5,rotation:M*Math.PI/180,offset:[N,P],drift:Math.max(0,F),grain:typeof I==`number`?Math.max(0,I):I?.05:0,opacity:v(L,0,1),intro:R,mouseInteraction:z,mouseStrength:v(B,0,1),flareOnClick:V,paused:H,dpr:Math.max(.5,U)},Y=(0,r.useRef)(J);return Y.current=J,(0,r.useEffect)(()=>{let e=K.current;if(!e)return;let t=document.createElement(`canvas`);t.className=o,e.appendChild(t);let n=t.getContext(`webgl2`,{alpha:!0,antialias:!1,depth:!1,stencil:!1,premultipliedAlpha:!0,powerPreference:`high-performance`});if(!n){t.remove();return}let r=x(n,n.VERTEX_SHADER,g),i=x(n,n.FRAGMENT_SHADER,_),a=n.createProgram();if(!r||!i||!a){t.remove();return}if(n.attachShader(a,r),n.attachShader(a,i),n.bindAttribLocation(a,0,`aPosition`),n.linkProgram(a),n.deleteShader(r),n.deleteShader(i),!n.getProgramParameter(a,n.LINK_STATUS)){n.deleteProgram(a),t.remove();return}let s=`uResolution.uTime.uClock.uScale.uDetail.uGlow.uThickness.uSwirl.uFold.uBlackPoint.uBrightness.uBalance.uGrain.uOpacity.uOffset.uRotation.uDrift.uColors.uColorCount.uBackground.uOpaque.uLight.uReveal.uTrail.uTrailWeight.uTrailCount.uFlares.uFlareCount.uHeat`.split(`.`),h={};s.forEach(e=>{h[e]=n.getUniformLocation(a,e)});let y=n.createVertexArray();n.bindVertexArray(y);let b=n.createBuffer();n.bindBuffer(n.ARRAY_BUFFER,b),n.bufferData(n.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),n.STATIC_DRAW),n.enableVertexAttribArray(0),n.vertexAttribPointer(0,2,n.FLOAT,!1,0,0),n.useProgram(a);let C=new Float32Array(18),w=new Float32Array(64),T=new Float32Array(c),E=new Float32Array(32),D={width:1,height:1,time:m,clock:0,last:0,raf:0,visible:!1,introAt:-1,pointer:[.5,.5],inside:!1,presence:0,drift:[0,0],trail:[],flares:[],quiet:0,seen:null},O=()=>{let n=Y.current,r=Math.min(window.devicePixelRatio||1,n.dpr),i=Math.max(1,Math.round(e.clientWidth*r)),a=Math.max(1,Math.round(e.clientHeight*r));(i!==D.width||a!==D.height)&&(D.quiet=0,D.width=i,D.height=a,t.width=i,t.height=a)},k=e=>[(e[0]-.5)*(D.width/Math.max(D.height,1)),.5-e[1]],A=(e,t)=>!e.intro||t||D.introAt<0?1:v((D.clock-D.introAt)/p,0,1),j=e=>{let t=Y.current,r=A(t,e),i=D.width/Math.max(D.height,1);n.viewport(0,0,D.width,D.height),n.uniform2f(h.uResolution,D.width,D.height),n.uniform1f(h.uTime,D.time),n.uniform1f(h.uClock,D.clock),n.uniform1f(h.uScale,t.scale),n.uniform1f(h.uDetail,t.detail),n.uniform1f(h.uGlow,t.glow*.1),n.uniform1f(h.uThickness,t.thickness),n.uniform1f(h.uSwirl,t.swirl),n.uniform1f(h.uFold,t.fold),n.uniform1f(h.uBlackPoint,t.blackPoint),n.uniform1f(h.uBrightness,t.brightness),n.uniform1f(h.uBalance,t.balance),n.uniform1f(h.uGrain,t.grain),n.uniform1f(h.uOpacity,t.opacity),n.uniform2f(h.uOffset,t.offset[0]*i,-t.offset[1]),n.uniform2f(h.uRotation,Math.cos(t.rotation),Math.sin(t.rotation)),n.uniform2f(h.uDrift,D.drift[0],D.drift[1]),C.fill(0),t.palette.forEach((e,t)=>C.set(e,t*3)),n.uniform3fv(h.uColors,C),n.uniform1i(h.uColorCount,t.palette.length);let a=t.paper??[0,0,0];n.uniform3f(h.uBackground,a[0],a[1],a[2]),n.uniform1f(h.uOpaque,+!!t.paper),n.uniform1f(h.uLight,+!!t.lightMode),n.uniform3f(h.uReveal,Math.log(1.6)+Math.log(.01/1.6)*r,+(r<1),r),w.fill(0),T.fill(0),D.trail.forEach((e,t)=>{let[n,r]=k(e.at);w.set([n,r,D.clock-e.time,D.clock-e.arrive],t*4),T[t]=e.weight}),n.uniform4fv(h.uTrail,w),n.uniform1fv(h.uTrailWeight,T),n.uniform1i(h.uTrailCount,D.trail.length),E.fill(0),D.flares.forEach((e,t)=>{let[n,r]=k(e.at);E.set([n,r,D.clock-e.time,1],t*4)}),n.uniform4fv(h.uFlares,E),n.uniform1i(h.uFlareCount,D.flares.length);let o=D.trail.length>0||D.flares.length>0;n.uniform4f(h.uHeat,t.mouseStrength*2,3.2,.2,+!!o),n.bindFramebuffer(n.FRAMEBUFFER,null),n.clearColor(0,0,0,0),n.clear(n.COLOR_BUFFER_BIT),n.drawArrays(n.TRIANGLES,0,3)},M=(e,t)=>{let n=e.mouseInteraction&&D.inside&&e.mouseStrength>0;D.presence+=(+!!n-D.presence)*(1-Math.exp(-t/.25)),D.trail=D.trail.filter(e=>e.live||D.clock-e.time<d);let r=D.trail[0];if(!n)return r?.live&&(r.live=!1),D.trail.length>0;if(!r?.live)D.trail.unshift({at:[...D.pointer],time:D.clock,arrive:D.clock,weight:D.presence,live:!0});else{if(r.at[0]!==D.pointer[0]||r.at[1]!==D.pointer[1]){let e=D.trail[1],t=e?Math.hypot(e.at[0]-r.at[0],e.at[1]-r.at[1]):1/0,n=D.clock-r.arrive>u;t>.004&&(!e||n||D.clock-e.time>=u)&&D.trail.splice(1,0,{...r,at:[...r.at],time:D.clock,live:!1}),r.at=[...D.pointer],r.arrive=D.clock}r.time=D.clock,r.weight=D.presence}return D.trail.length>c&&(D.trail.length=c),D.trail.length>0},N=e=>{if(D.raf=requestAnimationFrame(N),!D.visible||document.hidden){D.last=e;return}let t=Y.current,n=D.last?Math.min((e-D.last)/1e3,.1):0;D.last=e;let r=S();D.clock+=n,D.introAt<0&&(D.introAt=D.clock),!t.paused&&!r&&(D.time+=n*t.speed);let i=t.mouseInteraction&&D.inside&&!r,a=i?(D.pointer[0]-.5)*t.drift*2:0,o=i?(.5-D.pointer[1])*t.drift*2:0,s=1-Math.exp(-n/.33);D.drift[0]+=(a-D.drift[0])*s,D.drift[1]+=(o-D.drift[1])*s;let c=Math.abs(a-D.drift[0])+Math.abs(o-D.drift[1])>5e-4,l=M(t,n);D.flares=D.flares.filter(e=>D.clock-e.time<f);let u=t.paused||r,d=l||c||D.flares.length>0||A(t,r)<1;D.seen!==t||d||!u?D.quiet=0:D.quiet+=1,D.seen=t,!(D.quiet>3)&&(O(),j(r))},P=t=>{let n=e.getBoundingClientRect();return{x:(t.clientX-n.left)/Math.max(n.width,1),y:(t.clientY-n.top)/Math.max(n.height,1),inside:t.clientX>=n.left&&t.clientX<=n.right&&t.clientY>=n.top&&t.clientY<=n.bottom}},F=e=>{let t=P(e);D.inside=t.inside,t.inside&&(D.pointer=[t.x,t.y])},I=()=>{D.inside=!1},L=e=>{if(!Y.current.flareOnClick||e.button!==0||S()||e.target instanceof Element&&e.target.closest(`a, button, input, textarea, select, label, [role="button"]`))return;let t=P(e);t.inside&&(D.flares.push({at:[t.x,t.y],time:D.clock}),D.flares.length>l&&D.flares.shift())},R=new IntersectionObserver(e=>{D.visible=e.some(e=>e.isIntersecting)});R.observe(e);let z=new ResizeObserver(O);return z.observe(e),O(),window.addEventListener(`pointermove`,F,{passive:!0}),window.addEventListener(`pointerdown`,L),document.documentElement.addEventListener(`pointerleave`,I),D.raf=requestAnimationFrame(N),()=>{cancelAnimationFrame(D.raf),R.disconnect(),z.disconnect(),window.removeEventListener(`pointermove`,F),window.removeEventListener(`pointerdown`,L),document.documentElement.removeEventListener(`pointerleave`,I),n.deleteProgram(a),n.deleteBuffer(b),n.deleteVertexArray(y),n.getExtension(`WEBGL_lose_context`)?.loseContext(),t.remove()}},[]),(0,i.jsx)(`div`,{ref:K,className:[a,W].filter(Boolean).join(` `),style:G})}export{C as default};