import{i as e,t}from"./react-sySUN5R7.js";import{k as n}from"./sculpture-dark-CKiqtzhU.js";var r=e(t(),1),i=n(),a=8,o=24,s=4,c=1.3,l=.06,u=2.6,d=1.6,f=[`#120f17`,`#2a0f0a`,`#9a3412`,`#f97316`,`#fed7aa`],p={linear:0,radial:1},ee=.2,m=`#version 300 es
out vec2 vUv;
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  vUv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`,te=`#version 300 es
precision highp float;
precision highp int;
uniform float uAspect;
uniform float uTime;
uniform vec3 uRamp[8];
uniform int uCount;
uniform int uType;
uniform vec2 uDir;
uniform float uExtent;
uniform float uBands;
uniform float uSoftness;
uniform float uFlow;
uniform float uScale;
uniform float uSilk;
uniform vec4 uStir[24];
uniform float uStirWeight[24];
uniform vec4 uTwirl[4];
uniform vec2 uSeed;
uniform float uContrast;
uniform float uSaturation;
uniform float uSettle;
uniform float uReveal;
in vec2 vUv;
out vec4 outColor;

vec2 hash2(vec2 p) {
  vec3 q = fract(vec3(p.xyx) * vec3(0.1031, 0.103, 0.0973));
  q += dot(q, q.yzx + 33.33);
  return fract((q.xx + q.yz) * q.zy) * 2.0 - 1.0;
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  float a = dot(hash2(i), f);
  float b = dot(hash2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0));
  float c = dot(hash2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0));
  float d = dot(hash2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0));
  return 0.5 + 0.5 * mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

vec2 drift(vec2 p, float t) {
  vec2 w1 = vec2(
    noise(p * 0.85 + vec2(t * 0.11, t * 0.07)),
    noise(p * 0.85 + vec2(4.1, 1.7) - vec2(t * 0.08, t * 0.12))
  );
  vec2 w2 = vec2(
    noise(p * 1.55 + w1 * 1.8 + vec2(1.3, 7.1) + t * 0.05),
    noise(p * 1.55 + w1 * 1.8 + vec2(6.4, 2.2) - t * 0.06)
  );
  return (w1 - 0.5) * 1.1 + (w2 - 0.5) * 0.55;
}

vec2 warp(vec2 p) {
  vec2 q = p / uScale;
  if (uType == 1) {
    float turn = uTime * 0.35;
    q = mat2(cos(turn), sin(turn), -sin(turn), cos(turn)) * q;
  } else {
    q += vec2(-uDir.y, uDir.x) * uTime * 0.45;
  }
  return p + drift(q + uSeed, uTime) * uFlow * uScale * uSettle;
}

float coord(vec2 p) {
  vec2 w = warp(p);
  return uType == 1 ? 1.0 - length(w) * 1.1 : dot(w, uDir) / uExtent + 0.5;
}

vec3 labToRgb(vec3 lab) {
  float l = lab.x + 0.3963377774 * lab.y + 0.2158037573 * lab.z;
  float m = lab.x - 0.1055613458 * lab.y - 0.0638541728 * lab.z;
  float s = lab.x - 0.0894841775 * lab.y - 1.2914855480 * lab.z;
  l = l * l * l;
  m = m * m * m;
  s = s * s * s;
  return vec3(
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s
  );
}

vec3 encode(vec3 c) {
  c = clamp(c, 0.0, 1.0);
  return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c));
}

void main() {
  vec2 p = (vUv - 0.5) * vec2(uAspect, 1.0);
  for (int i = 0; i < 24; i++) {
    float w = uStirWeight[i];
    if (w <= 0.0) continue;
    vec2 d = p - uStir[i].xy;
    p -= uStir[i].zw * w * exp(-dot(d, d) / 0.045);
  }
  for (int i = 0; i < 4; i++) {
    float angle = uTwirl[i].z;
    if (angle == 0.0) continue;
    vec2 d = p - uTwirl[i].xy;
    float a = angle * exp(-dot(d, d) / (uTwirl[i].w * uTwirl[i].w));
    float c = cos(a);
    float s = sin(a);
    p = uTwirl[i].xy + mat2(c, -s, s, c) * d;
  }
  float raw = coord(p);
  float s = raw;
  if (uBands > 1.0) {
    s *= uBands;
    float cycle = floor(s);
    s = fract(s);
    if (mod(cycle, 2.0) > 0.5) s = 1.0 - s;
  }
  s = clamp(s, 0.0, 1.0);
  float scaled = s * float(uCount - 1);
  int index = int(min(floor(scaled), float(uCount - 2)));
  float f = scaled - float(index);
  float edge = max(uSoftness * 0.5, fwidth(scaled) * 0.75);
  float shaped = smoothstep(0.5 - edge, 0.5 + edge, f);
  vec3 from = uRamp[0];
  vec3 to = uRamp[1];
  for (int i = 0; i < 7; i++) {
    if (i == index) {
      from = uRamp[i];
      to = uRamp[i + 1];
    }
  }
  vec3 lab = mix(from, to, shaped);
  if (uSilk > 0.0) {
    vec2 grad = vec2(coord(p + vec2(0.004, 0.0)) - raw, coord(p + vec2(0.0, 0.004)) - raw) / 0.004;
    vec2 slope = grad * sin(3.14159265 * clamp(raw, 0.0, 1.0) * uBands) * uSilk * 4.0;
    vec3 normal = normalize(vec3(-slope, 1.0));
    vec3 light = normalize(vec3(-uDir.y, uDir.x, 1.2));
    float diffuse = dot(normal, light) - light.z;
    lab = uRamp[0] + (lab - uRamp[0]) * (1.0 + (diffuse * 0.35 + max(diffuse, 0.0) * diffuse * 0.6) * uSilk);
  }
  lab = mix(uRamp[0], lab, smoothstep(0.0, 1.0, uReveal * 1.5 - length(vUv - 0.5) * 0.6));
  lab.x = (lab.x - 0.55) * uContrast + 0.55;
  lab.yz *= uSaturation;
  outColor = vec4(encode(labToRgb(lab)), 1.0);
}`,ne=`#version 300 es
precision highp float;
uniform sampler2D uField;
uniform float uGrain;
uniform float uGrainSize;
uniform float uFrame;
in vec2 vUv;
out vec4 outColor;

float hash(vec2 p) {
  vec3 q = fract(vec3(p.xyx) * 0.1031);
  q += dot(q, q.yzx + 33.33);
  return fract((q.x + q.y) * q.z);
}

float clump(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

void main() {
  vec3 color = texture(uField, vUv).rgb;
  vec2 pixel = gl_FragCoord.xy + uFrame * vec2(17.0, 59.0);
  float fine = hash(pixel) + hash(pixel + 7.13) - 1.0;
  float coarse = (clump(pixel / max(uGrainSize, 1.0)) - 0.5) * 2.0;
  float grain = mix(fine, coarse, clamp(uGrainSize - 1.0, 0.0, 1.0) * 0.8);
  float luma = dot(color, vec3(0.2126, 0.7152, 0.0722));
  color += grain * uGrain * (0.45 + 2.2 * luma * (1.0 - luma));
  outColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}`,h=(e,t,n)=>Math.min(n,Math.max(t,e)),g=e=>e<=.04045?e/12.92:((e+.055)/1.055)**2.4,re=([e,t,n])=>{let r=g(e),i=g(t),a=g(n),o=Math.cbrt(.4122214708*r+.5363325363*i+.0514459929*a),s=Math.cbrt(.2119034982*r+.6806995451*i+.1073969566*a),c=Math.cbrt(.0883024619*r+.2817188376*i+.6299787005*a);return[.2104542553*o+.793617785*s-.0040720468*c,1.9779984951*o-2.428592205*s+.4505937099*c,.0259040371*o+.7827717662*s-.808675766*c]},_=(e,t,n)=>{let r=e.createShader(t);return r?(e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(e.deleteShader(r),null)):null},v=(e,t)=>{let n=_(e,e.VERTEX_SHADER,m),r=_(e,e.FRAGMENT_SHADER,t),i=e.createProgram();if(!n||!r||!i)return null;if(e.attachShader(i,n),e.attachShader(i,r),e.linkProgram(i),e.deleteShader(n),e.deleteShader(r),!e.getProgramParameter(i,e.LINK_STATUS))return e.deleteProgram(i),null;let a={},o=e.getProgramParameter(i,e.ACTIVE_UNIFORMS);for(let t=0;t<o;t++){let n=e.getActiveUniform(i,t);if(!n)continue;let r=n.name.replace(/\[0\]$/,``);a[r]=e.getUniformLocation(i,r)}return{program:i,uniforms:a}},y=({colors:e=f,type:t=`linear`,angle:n=55,bands:m=1,speed:g=1,flow:_=.8,scale:y=1,softness:b=1,silk:x=.35,grainAmount:S=.08,grainSize:C=1.2,grainAnimated:w=!0,contrast:T=1,saturation:E=1,variation:D=0,interactive:O=!0,stir:k=1,clickSwirl:A=!0,intro:j=!0,lightMode:M=!1,dpr:N,className:P=``,style:F,...I})=>{let L=(0,r.useRef)(null),R=(0,r.useRef)(null),z=(0,r.useRef)(null),B=(Array.isArray(e)&&e.length?e:f).slice(0,a),V={colors:B.length>1?B:[B[0],B[0]],type:p[t]??0,angle:n,bands:h(m,1,8),speed:Math.max(0,g),flow:h(_,0,3),scale:h(y,.25,3),softness:h(b,0,1),silk:h(x,0,1),grainAmount:h(S,0,.5),grainSize:h(C,.5,4),grainAnimated:w,contrast:h(T,.2,2),saturation:h(E,0,2),variation:Math.max(0,D),interactive:O,stir:h(k,0,2),clickSwirl:A,intro:j,lightMode:M,dpr:N},H=(0,r.useRef)(V);return H.current=V,(0,r.useEffect)(()=>{let e=L.current,t=R.current,n=t?.getContext(`webgl2`,{alpha:!1,antialias:!1,depth:!1,stencil:!1});if(!e||!t||!n)return;let r=v(n,te),i=v(n,ne);if(!r||!i)return;let a=r.uniforms,f=i.uniforms,p=n.createVertexArray(),m=n.createTexture();n.bindTexture(n.TEXTURE_2D,m),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MAG_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE);let g=n.createFramebuffer(),_={width:0,height:0},y=document.createElement(`canvas`).getContext(`2d`,{willReadFrequently:!0}),b=new Map,x=e=>{let t=String(e),n=b.get(t);if(n)return n;let r=[0,0,0];if(y){y.clearRect(0,0,1,1),y.fillStyle=`#000000`,y.fillStyle=t,y.fillRect(0,0,1,1);let[e,n,i]=y.getImageData(0,0,1,1).data;r=[e/255,n/255,i/255]}return b.set(t,r),r},S=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches??!1,C={width:1,height:1,ratio:1},w=new Float32Array(24),T=new Float32Array(96),E=new Float32Array(o),D=new Float32Array(16),O=[],k=[],A={x:.5,y:.5,sx:.5,sy:.5,vx:0,inside:!1,fresh:!0},j=``,M=0,N=H.current.intro&&!S?0:1,P=0,F=0,I=0,B=0,V=!0,ie=()=>{let e=H.current,t=`${e.colors.join(`,`)}|${e.lightMode}`;if(t===j)return;j=t;let n=e.colors.map(e=>re(x(e)));if(!e.lightMode)n.forEach((e,t)=>w.set(e,t*3));else{let e=n.map(([e])=>Math.abs(e-n[0][0])<.1),t=n.filter((t,n)=>!e[n]).reverse();n.forEach((n,r)=>{let[i,a,o]=e[r]?[1,0,0]:t.shift();w.set([i+(1-i)*ee,a*.8,o*.8],r*3)})}},U=()=>{let e=H.current,o=C.width/C.height;ie(),n.bindVertexArray(p),n.disable(n.BLEND),n.bindFramebuffer(n.FRAMEBUFFER,g),n.viewport(0,0,_.width,_.height),n.useProgram(r.program),n.uniform1f(a.uAspect,o),n.uniform1f(a.uTime,M),n.uniform3fv(a.uRamp,w),n.uniform1i(a.uCount,e.colors.length);let s=e.angle*Math.PI/180;n.uniform1i(a.uType,e.type),n.uniform2f(a.uDir,Math.sin(s),Math.cos(s)),n.uniform1f(a.uExtent,o*Math.abs(Math.sin(s))+Math.abs(Math.cos(s))),n.uniform1f(a.uBands,e.bands),n.uniform1f(a.uSoftness,e.softness),n.uniform1f(a.uFlow,e.flow),n.uniform1f(a.uScale,e.scale),n.uniform1f(a.uSilk,e.silk),n.uniform4fv(a.uStir,T),n.uniform1fv(a.uStirWeight,E),n.uniform4fv(a.uTwirl,D),n.uniform2f(a.uSeed,e.variation*3.17,e.variation*1.91),n.uniform1f(a.uContrast,e.contrast),n.uniform1f(a.uSaturation,e.saturation),n.uniform1f(a.uSettle,N*N*(3-2*N)),n.uniform1f(a.uReveal,N),n.drawArrays(n.TRIANGLES,0,3),n.bindFramebuffer(n.FRAMEBUFFER,null),n.viewport(0,0,t.width,t.height),n.useProgram(i.program),n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,m),n.uniform1i(f.uField,0),n.uniform1f(f.uGrain,e.grainAmount),n.uniform1f(f.uGrainSize,e.grainSize*C.ratio),n.uniform1f(f.uFrame,P),n.drawArrays(n.TRIANGLES,0,3)},W=()=>{let r=H.current;C.width=Math.max(1,e.clientWidth),C.height=Math.max(1,e.clientHeight),C.ratio=Math.min(r.dpr||window.devicePixelRatio||1,2),t.width=Math.max(1,Math.round(C.width*C.ratio)),t.height=Math.max(1,Math.round(C.height*C.ratio));let i=Math.max(1,Math.round(t.width/2)),a=Math.max(1,Math.round(t.height/2));(i!==_.width||a!==_.height)&&(_.width=i,_.height=a,n.bindTexture(n.TEXTURE_2D,m),n.texImage2D(n.TEXTURE_2D,0,n.RGBA8,i,a,0,n.RGBA,n.UNSIGNED_BYTE,null),n.bindFramebuffer(n.FRAMEBUFFER,g),n.framebufferTexture2D(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,m,0),n.bindFramebuffer(n.FRAMEBUFFER,null)),U(),K()},ae=(e,t)=>{let n=H.current,r=1-Math.exp(-e/.06),i=A.sx,a=A.sy;A.sx+=(A.x-A.sx)*r,A.sy+=(A.y-A.sy)*r;let d=(A.sx-i)/e*t,f=(A.sy-a)/e;A.vx=d;let p=O[0];if(O.forEach(t=>{t.done&&(t.age+=e)}),n.interactive&&A.inside&&Math.hypot(d,f)>.02&&!S){(!p||p.done)&&(O.unshift({x:0,y:0,vx:0,vy:0,age:0,grow:0,done:!1}),O.length>o&&O.pop());let n=O[0];n.x=(A.sx-.5)*t,n.y=A.sy-.5,n.vx=d,n.vy=f,n.grow=Math.min(1,n.grow+e/l),n.done=n.grow>=1}else p&&(p.done=!0);for(;O.length&&O[O.length-1].age>c;)O.pop();for(let e=0;e<o;e++){let t=O[e];if(!t){E[e]=0;continue}let r=1-t.age/c,i=Math.min(1,2.2/Math.max(Math.hypot(t.vx,t.vy),.001));T.set([t.x,t.y,t.vx*i,t.vy*i],e*4),E[e]=r*r*t.grow*n.stir*.05}for(k.forEach(t=>{t.age+=e});k.length&&k[k.length-1].age>u;)k.pop();for(let e=0;e<s;e++){let t=k[e];if(!t){D[e*4+2]=0;continue}let n=t.age/u,r=Math.min(1,t.age/.18)*(1-n)*(1-n);D.set([t.x,t.y,t.direction*2.4*r,.16+.1*Math.min(1,t.age/.5)],e*4)}},G=e=>{if(I=0,!V||document.hidden)return;let t=H.current,n=B?h((e-B)/1e3,.001,.05):1/60;B=e,S||(M+=n*t.speed*.16),N<1&&(N=Math.min(1,N+n/d)),F+=n,t.grainAnimated&&!S&&F>1/24&&(F=0,P=(P+1)%97),ae(n,C.width/C.height),U(),!S&&(t.speed>0||t.grainAnimated)||N<1||O.length>0||k.length>0?I=requestAnimationFrame(G):B=0};function K(){!I&&V&&!document.hidden&&(I=requestAnimationFrame(G))}let q=t=>{let n=e.getBoundingClientRect(),r=(t.clientX-n.left)/Math.max(1,n.width),i=1-(t.clientY-n.top)/Math.max(1,n.height);A.inside=r>=0&&r<=1&&i>=0&&i<=1,A.x=r,A.y=i,(A.fresh||!A.inside)&&(A.sx=r,A.sy=i,A.fresh=!1)},J=e=>{q(e),(A.inside||O.length)&&K()},Y=e=>{q(e);let t=H.current;A.inside&&t.clickSwirl&&!S&&(k.unshift({x:(A.x-.5)*(C.width/C.height),y:A.y-.5,age:0,direction:A.vx<0?1:-1}),k.length>s&&k.pop(),K())},X=()=>{A.inside=!1},Z=()=>{B=0,K()},Q=new ResizeObserver(W);Q.observe(e);let $=new IntersectionObserver(e=>{V=e.some(e=>e.isIntersecting),V&&(B=0,K())});return $.observe(e),window.addEventListener(`pointermove`,J,{passive:!0}),window.addEventListener(`pointerdown`,Y,{passive:!0}),document.documentElement.addEventListener(`pointerleave`,X),document.addEventListener(`visibilitychange`,Z),W(),z.current=K,()=>{cancelAnimationFrame(I),z.current=null,Q.disconnect(),$.disconnect(),window.removeEventListener(`pointermove`,J),window.removeEventListener(`pointerdown`,Y),document.documentElement.removeEventListener(`pointerleave`,X),document.removeEventListener(`visibilitychange`,Z),n.deleteTexture(m),n.deleteFramebuffer(g),n.deleteVertexArray(p),n.deleteProgram(r.program),n.deleteProgram(i.program),n.getExtension(`WEBGL_lose_context`)?.loseContext()}},[]),(0,r.useEffect)(()=>{z.current?.()}),(0,i.jsx)(`div`,{ref:L,className:[`relative h-full w-full overflow-hidden`,P].filter(Boolean).join(` `),style:F,...I,children:(0,i.jsx)(`canvas`,{ref:R,className:`absolute inset-0 block h-full w-full`,"aria-hidden":`true`})})};export{y as default};