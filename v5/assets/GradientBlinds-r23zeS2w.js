import{i as e,t}from"./react-sySUN5R7.js";import{O as n}from"./sculpture-dark-Cfb-XN1r.js";var r=e(t(),1),i=n(),a=8,o=4,s=1.8,c=1.6,l=`#version 300 es
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`,u=`#version 300 es
precision highp float;
precision highp int;

uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uMouse;
uniform float uAngle;
uniform float uNoise;
uniform float uBlindCount;
uniform float uSpotlightRadius;
uniform float uSpotlightSoftness;
uniform float uSpotlightOpacity;
uniform float uMirror;
uniform float uDistort;
uniform float uShineFlip;
uniform vec3 uColors[8];
uniform int uColorCount;
uniform float uLightMode;
uniform float uShine;
uniform float uRelief;
uniform float uGlow;
uniform float uSway;
uniform float uSwayTime;
uniform float uHover;
uniform vec4 uWaves[4];
uniform float uIntro;
uniform float uGrainTime;
uniform vec3 uLightColor;
uniform float uPerspective;
uniform float uGradientShift;

out vec4 outColor;

float hash(vec2 p) {
  vec3 q = fract(vec3(p.xyx) * 0.1031);
  q += dot(q, q.yzx + 33.33);
  return fract((q.x + q.y) * q.z);
}

vec2 rotate2D(vec2 p, float a) {
  float c = cos(a);
  float s = sin(a);
  return mat2(c, -s, s, c) * p;
}

vec2 blindSpace(vec2 uv0) {
  float aspect = uResolution.x / uResolution.y;
  vec2 p = uv0 * 2.0 - 1.0;
  p.x *= aspect;
  vec2 pr = rotate2D(p, uAngle);
  pr.x /= aspect;
  vec2 uv = pr * 0.5 + 0.5;
  if (abs(uPerspective) > 0.001) {
    float k = uPerspective * 2.2;
    uv.x = (exp(k * uv.x) - 1.0) / (exp(k) - 1.0);
  }
  if (uDistort > 0.0) {
    float a = uv.y * 6.0;
    float b = uv.x * 6.0;
    float w = 0.01 * uDistort;
    uv.x += sin(a) * w;
    uv.y += cos(b) * w;
  }
  return uv;
}

vec3 gradientColor(float t) {
  float tt = clamp(t, 0.0, 1.0);
  int count = max(uColorCount, 2);
  float scaled = tt * float(count - 1);
  int seg = min(int(floor(scaled)), count - 2);
  float f = scaled - float(seg);
  if (tt >= 1.0) return uColors[count - 1];
  return mix(uColors[seg], uColors[seg + 1], f);
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec2 uv0 = frag / uResolution;
  vec2 uvMod = blindSpace(uv0);

  float count = max(uBlindCount, 1.0);
  float stripePhase = uvMod.x * count;
  float pixel = max(fwidth(stripePhase), 1e-5);

  float t = uvMod.x;
  if (uGradientShift != 0.0) {
    t = 1.0 - abs(1.0 - fract((t + uGradientShift) * 0.5) * 2.0);
  }
  if (uMirror > 0.5) {
    t = 1.0 - abs(1.0 - 2.0 * fract(t));
  }
  vec3 base = gradientColor(t);

  vec2 offset = uMouse / uResolution;
  float d = length(uv0 - offset);
  float r = max(uSpotlightRadius, 1e-4);
  float spot = (1.0 - 2.0 * pow(d / r, uSpotlightSoftness)) * uSpotlightOpacity;

  float slat = floor(stripePhase);
  float s = stripePhase - slat;
  float stripeAA = clamp(count * 1.25 / min(uResolution.x, uResolution.y), 0.001, 0.12);
  float edgeBlend = 1.0 - smoothstep(0.0, stripeAA, min(s, 1.0 - s));
  float across = mix(s, 0.5, edgeBlend);
  float ramp = uShineFlip > 0.5 ? 1.0 - across : across;

  float unit = min(uResolution.x, uResolution.y);
  float reach = max(uSpotlightRadius, 0.05) * unit;
  vec2 toLight = uMouse - frag;
  float nearLight = exp(-dot(toLight, toLight) / (reach * reach));

  float tilt = 0.0;
  float pulse = 0.0;
  if (uSway > 0.0) {
    tilt += uSway * 0.5 * sin(uSwayTime * 0.9 + slat * 0.55) * (0.6 + 0.4 * sin(uSwayTime * 0.37 + slat * 0.21));
  }
  tilt += uHover * nearLight * 0.7;
  float aspect = uResolution.x / uResolution.y;
  for (int i = 0; i < 4; i++) {
    vec4 wave = uWaves[i];
    if (wave.w <= 0.0) continue;
    float age = uTime - wave.z;
    if (age < 0.0 || age > ${c.toFixed(2)}) continue;
    float life = age / ${c.toFixed(2)};
    vec2 origin = blindSpace(wave.xy / uResolution);
    float slats = abs(slat + 0.5 - origin.x * count);
    float front = age * max(count, 4.0) * 0.95;
    float k = (slats - front) / (0.8 + life * 1.2);
    float along = (uvMod.y - origin.y) / max(0.42 + life * 0.5, 0.01);
    float fade = (1.0 - life) * (1.0 - life);
    float ring = exp(-k * k) * exp(-along * along) * fade * smoothstep(0.0, 0.2, age);
    tilt += ring * 0.9;
    pulse += ring;
  }
  if (uIntro < 1.0) {
    float settle = smoothstep(0.0, 1.0, clamp(uIntro * 1.5 - uv0.x * 0.5, 0.0, 1.0));
    tilt -= (1.0 - settle) * 1.2;
  }

  float edge = ramp;
  float calm = 1.0 - 0.6 * clamp(spot, 0.0, 1.0);
  ramp = pow(clamp(ramp, 0.0, 1.0), exp(tilt * 0.9));
  ramp *= 1.0 - 0.3 * min(pulse, 1.0) * calm;
  float crease = uRelief * 0.38 * smoothstep(0.62, 1.0, ramp);
  float sheen = uShine * exp(-pow((edge - 0.035) / 0.07, 2.0)) * (0.3 + 0.7 * nearLight) * (1.0 - edgeBlend);

  vec3 lit = spot > 0.0 ? uLightColor * spot : vec3(spot);
  lit += uLightColor * min(pulse, 1.0) * 0.35 * calm;
  vec3 revealSignal = lit + base - vec3(ramp + crease);

  vec3 col;
  if (uLightMode > 0.5) {
    vec3 luma = vec3(0.2126, 0.7152, 0.0722);
    float peak = max(base.r, max(base.g, base.b));
    float low = min(base.r, min(base.g, base.b));
    float chroma = (peak - low) / max(peak, 0.0001);
    vec3 hue = base / max(peak, 0.0001);
    hue = clamp(mix(vec3(dot(hue, luma)), hue, 1.3), 0.0, 1.0);
    hue *= mix(1.0, 0.82, smoothstep(0.55, 0.9, dot(hue, luma)));
    vec3 tint = mix(base, hue, smoothstep(0.06, 0.28, chroma));
    vec3 revealed = clamp(revealSignal, 0.0, 1.0);
    float coverage = max(revealed.r, max(revealed.g, revealed.b));
    float stroke = 1.0 - smoothstep(pixel, pixel * 2.2, edge);
    col = mix(vec3(1.0), tint, 0.72 * smoothstep(0.0, 1.0, coverage));
    col = mix(col, tint * 0.85, stroke * clamp(coverage * 1.5, 0.0, 1.0) * 0.7);
    col = mix(col, vec3(1.0), clamp(sheen, 0.0, 1.0) * 0.5);
    float grain = max(0.5 * (hash(frag + uGrainTime) + hash(frag.yx + uGrainTime * 1.7)) - 0.5, 0.0);
    col = clamp(col - vec3(grain * uNoise * 0.12 * coverage), 0.0, 1.0);
  } else {
    vec3 haze = base * uGlow * 0.4 * smoothstep(0.0, 1.0, spot) * (0.4 + 0.6 * ramp);
    col = revealSignal + haze + mix(base, uLightColor, 0.45) * sheen * 0.7;
    vec3 over = max(col - 0.8, 0.0);
    col = min(col, vec3(0.8)) + 0.2 * (1.0 - exp(-over / 0.2));
    float luma = dot(clamp(col, 0.0, 1.0), vec3(0.2126, 0.7152, 0.0722));
    float grain = 0.5 * (hash(frag + uGrainTime) + hash(frag.yx + uGrainTime * 1.7)) - 0.5;
    col += grain * uNoise * (0.45 + 0.55 * smoothstep(0.0, 0.5, luma));
  }

  float presence = smoothstep(0.0, 0.65, uIntro);
  col = uLightMode > 0.5 ? mix(vec3(1.0), col, presence) : col * presence;
  outColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}`,d=(e,t,n)=>Math.min(n,Math.max(t,e)),f=(e,t,n)=>{let r=e.createShader(t);return r?(e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(e.deleteShader(r),null)):null},p=e=>{let t=f(e,e.VERTEX_SHADER,l),n=f(e,e.FRAGMENT_SHADER,u),r=e.createProgram();if(!t||!n||!r)return null;if(e.attachShader(r,t),e.attachShader(r,n),e.linkProgram(r),e.deleteShader(t),e.deleteShader(n),!e.getProgramParameter(r,e.LINK_STATUS))return e.deleteProgram(r),null;let i={},a=e.getProgramParameter(r,e.ACTIVE_UNIFORMS);for(let t=0;t<a;t++){let n=e.getActiveUniform(r,t);if(!n)continue;let a=n.name.replace(/\[0\]$/,``);i[a]=e.getUniformLocation(r,a)}return{program:r,uniforms:i}},m=e=>{let t=String(e||``).replace(`#`,``).padEnd(6,`0`),n=parseInt(t.slice(0,2),16)/255,r=parseInt(t.slice(2,4),16)/255,i=parseInt(t.slice(4,6),16)/255;return[n||0,r||0,i||0]},h=e=>{let t=(e&&e.length?e:[`#FF9FFC`,`#5227FF`]).slice(0,a);for(t.length===1&&t.push(t[0]);t.length<a;)t.push(t[t.length-1]);let n=new Float32Array(24);for(let e=0;e<a;e++)n.set(m(t[e]),e*3);return{flat:n,count:Math.max(2,Math.min(a,e?.length??2))}},g=({className:e=``,style:t,dpr:n,paused:a=!1,gradientColors:l,angle:u=0,noise:f=.3,blindCount:g=16,blindMinWidth:_=60,mouseDampening:v=.15,mirrorGradient:y=!1,spotlightRadius:b=.5,spotlightSoftness:x=1,spotlightOpacity:S=1,distortAmount:C=0,shineDirection:w=`left`,lightColor:T=`#ffffff`,perspective:E=0,gradientSpeed:D=0,shine:O=.4,relief:k=.5,glow:A=.4,sway:j=.35,speed:M=1,hoverTilt:N=.6,clickEffect:P=`ripple`,idle:F=`drift`,intro:I=!0,mixBlendMode:L=`lighten`,lightMode:R=!1})=>{let z=(0,r.useRef)(null),B=(0,r.useRef)(null),V=(0,r.useRef)(null),H={paused:a,colorKey:(l&&l.length?l:[`#FF9FFC`,`#5227FF`]).join(`,`),gradientColors:l,angle:u,noise:d(f,0,2),blindCount:Math.max(1,g||1),blindMinWidth:_,mouseDampening:Math.max(0,v),mirrorGradient:y,spotlightRadius:b,spotlightSoftness:x,spotlightOpacity:S,distortAmount:C,shineDirection:w,lightColor:T,perspective:d(E,-1,1),gradientSpeed:D,shine:d(O,0,2),relief:d(k,0,1),glow:d(A,0,2),sway:d(j,0,1),speed:d(M,0,4),hoverTilt:d(N,0,1.5),clickEffect:P,idle:F,intro:I,lightMode:R,dpr:n},U=(0,r.useRef)(H);return U.current=H,(0,r.useEffect)(()=>{let e=z.current,t=B.current,n=t?.getContext(`webgl2`,{alpha:!1,antialias:!1,depth:!1,stencil:!1,premultipliedAlpha:!1});if(!e||!t||!n)return;let r=p(n);if(!r)return;let i=r.uniforms,a=n.createVertexArray(),l=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches??!1,u={width:1,height:1,ratio:1,count:1},f={x:0,y:0,inside:!1},g={x:0,y:0,vx:0,vy:0,tx:0,ty:0,ready:!1},_=new Float32Array(16),v=0,y=0,b=0,x=0,S=0,C=0,w=U.current.intro&&!l?0:1,T=``,E=h(U.current.gradientColors),D=0,O=0,k=!0,A=e=>{if(e.blindMinWidth&&e.blindMinWidth>0){let t=Math.max(1,Math.floor(u.width/e.blindMinWidth));return Math.max(1,e.blindCount?Math.min(e.blindCount,t):t)}return Math.max(1,e.blindCount)},j=()=>{let e=U.current;T!==e.colorKey&&(E=h(e.gradientColors),T=e.colorKey),n.viewport(0,0,t.width,t.height),n.useProgram(r.program),n.bindVertexArray(a),n.uniform2f(i.uResolution,t.width,t.height),n.uniform1f(i.uTime,b),n.uniform2f(i.uMouse,g.x*u.ratio,(u.height-g.y)*u.ratio),n.uniform1f(i.uAngle,e.angle*Math.PI/180),n.uniform1f(i.uNoise,e.noise),n.uniform1f(i.uBlindCount,A(e)),n.uniform1f(i.uSpotlightRadius,e.spotlightRadius),n.uniform1f(i.uSpotlightSoftness,e.spotlightSoftness),n.uniform1f(i.uSpotlightOpacity,e.spotlightOpacity),n.uniform1f(i.uMirror,+!!e.mirrorGradient),n.uniform1f(i.uDistort,e.distortAmount),n.uniform1f(i.uShineFlip,+(e.shineDirection===`right`)),n.uniform3fv(i.uColors,E.flat),n.uniform1i(i.uColorCount,E.count),n.uniform1f(i.uLightMode,+!!e.lightMode),n.uniform1f(i.uShine,e.shine),n.uniform1f(i.uRelief,e.relief),n.uniform1f(i.uGlow,e.glow),n.uniform1f(i.uSway,l?0:e.sway),n.uniform1f(i.uSwayTime,x),n.uniform1f(i.uHover,y*e.hoverTilt),n.uniform4fv(i.uWaves,_),n.uniform1f(i.uIntro,w),n.uniform1f(i.uGrainTime,C),n.uniform3fv(i.uLightColor,m(e.lightColor||`#ffffff`)),n.uniform1f(i.uPerspective,e.perspective),n.uniform1f(i.uGradientShift,S),n.drawArrays(n.TRIANGLES,0,3),n.bindVertexArray(null)},M=e=>{f.inside?(g.tx=f.x,g.ty=f.y):e.idle===`center`?(g.tx=u.width/2,g.ty=u.height/2):e.idle===`drift`&&!l&&(g.tx=u.width*(.5+.22*Math.sin(x*.23)+.05*Math.sin(x*.61+1.3)),g.ty=u.height*(.5+.16*Math.sin(x*.31+.7)+.04*Math.sin(x*.83)))},N=(e,t)=>{let n=e.mouseDampening;if(n<=0){g.x=g.tx,g.y=g.ty,g.vx=0,g.vy=0;return}let r=2.4/n,i=r*r,a=2*r,o=Math.max(1,Math.ceil(t/.008)),s=t/o;for(let e=0;e<o;e++)g.vx+=(i*(g.tx-g.x)-a*g.vx)*s,g.vy+=(i*(g.ty-g.y)-a*g.vy)*s,g.x+=g.vx*s,g.y+=g.vy*s},P=()=>{let n=U.current;u.width=Math.max(1,e.clientWidth),u.height=Math.max(1,e.clientHeight),u.ratio=Math.min(n.dpr||window.devicePixelRatio||1,2),t.width=Math.max(1,Math.round(u.width*u.ratio)),t.height=Math.max(1,Math.round(u.height*u.ratio)),g.ready||(g.ready=!0,g.x=g.tx=u.width/2,g.y=g.ty=u.height/2),j(),I()},F=e=>{if(D=0,!k||document.hidden)return;let t=U.current,n=O?d((e-O)/1e3,.001,1/20):1/60;if(O=e,!t.paused){b+=n,l||(x+=n*t.speed,S=(S+n*t.gradientSpeed*.06)%2),C=Math.floor(b*24)*17.13,w<1&&(w=Math.min(1,w+n/s)),y+=(+!!f.inside-y)*(1-Math.exp(-n/.35)),M(t),N(t,n);for(let e=0;e<o;e++)_[e*4+3]>0&&b-_[e*4+2]>c&&(_[e*4+3]=0);j(),(Math.abs(g.tx-g.x)>.05||Math.abs(g.ty-g.y)>.05||Math.abs(g.vx)+Math.abs(g.vy)>.05||Math.abs(+!!f.inside-y)>.002||w<1||_.some((e,t)=>t%4==3&&e>0)||!l&&(t.noise>0||t.gradientSpeed!==0||t.sway>0&&t.speed>0||t.idle===`drift`&&!f.inside))&&(D=requestAnimationFrame(F))}};function I(){!D&&k&&!document.hidden&&(O=0,D=requestAnimationFrame(F))}let L=t=>{let n=e.getBoundingClientRect(),r=t.clientX-n.left,i=t.clientY-n.top;return{x:r,y:i,inside:r>=0&&i>=0&&r<=n.width&&i<=n.height}},R=e=>{let{x:t,y:n,inside:r}=L(e);f.x=t,f.y=n,f.inside=r,r&&I()},H=e=>{let t=U.current,{x:n,y:r,inside:i}=L(e);if(!i||l||t.clickEffect!==`ripple`)return;let a=v*4;_[a]=n*u.ratio,_[a+1]=(u.height-r)*u.ratio,_[a+2]=b,_[a+3]=1,v=(v+1)%o,I()},W=()=>{f.inside=!1,I()},G=()=>{O=0,I()},K=new ResizeObserver(P);K.observe(e);let q=new IntersectionObserver(e=>{k=e.some(e=>e.isIntersecting),k&&I()});return q.observe(e),window.addEventListener(`pointermove`,R,{passive:!0}),window.addEventListener(`pointerdown`,H,{passive:!0}),document.documentElement.addEventListener(`pointerleave`,W),document.addEventListener(`visibilitychange`,G),P(),V.current=I,()=>{cancelAnimationFrame(D),V.current=null,K.disconnect(),q.disconnect(),window.removeEventListener(`pointermove`,R),window.removeEventListener(`pointerdown`,H),document.documentElement.removeEventListener(`pointerleave`,W),document.removeEventListener(`visibilitychange`,G),n.deleteVertexArray(a),n.deleteProgram(r.program),n.getExtension(`WEBGL_lose_context`)?.loseContext()}},[]),(0,r.useEffect)(()=>{V.current?.()}),(0,i.jsx)(`div`,{ref:z,className:[`relative h-full w-full overflow-hidden`,e].filter(Boolean).join(` `),style:{...!R&&L?{mixBlendMode:L}:null,...t},children:(0,i.jsx)(`canvas`,{ref:B,className:`absolute inset-0 block h-full w-full`,"aria-hidden":`true`})})};export{g as default};