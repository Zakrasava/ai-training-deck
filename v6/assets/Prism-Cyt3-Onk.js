import{i as e,t}from"./react-sySUN5R7.js";import{k as n}from"./sculpture-dark-CKiqtzhU.js";var r=e(t(),1),i=n(),a=1.4,o=64,s=[.299,.587,.114,.299,.587,.114,.299,.587,.114],c=[.701,-.587,-.114,-.299,.413,-.114,-.3,-.588,.886],l=[.168,-.331,.5,.328,.035,-.5,-.497,.296,.201],u=`#version 300 es
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`,d=`#version 300 es
precision highp float;
uniform vec2 uResolution;
uniform mat3 uRay;
uniform float uGlow;
uniform vec2 uOffset;
uniform float uColorFreq;
uniform float uCenterShift;
uniform float uInvBaseHalf;
uniform float uInvHeight;
uniform float uMinAxis;
uniform float uPxScale;
uniform sampler2D uPalette;
uniform int uUsePalette;
uniform float uTime;
uniform float uNoise;
uniform float uSaturation;
uniform mat3 uHue;
uniform int uUseHue;
uniform float uLight;
uniform float uNeutral;
out vec4 outColor;

const vec4 PHASE_COS = vec4(1.0, 0.5403023058681398, -0.4161468365471424, -0.9899924966004454);
const vec4 PHASE_SIN = vec4(0.0, 0.8414709848078965, 0.9092974268256817, 0.1411200080598672);

float rand(vec2 co) {
  return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453123);
}

float pyramid(vec3 p) {
  vec3 q = vec3(abs(p.x) * uInvBaseHalf, abs(p.y) * uInvHeight, abs(p.z) * uInvBaseHalf);
  return max((q.x + q.y + q.z - 1.0) * uMinAxis * 0.5773502691896258, -p.y);
}

vec3 grade(vec3 col, vec2 seed) {
  col += (rand(seed) - 0.5) * uNoise;
  col = clamp(col, 0.0, 1.0);
  float L = dot(col, vec3(0.2126, 0.7152, 0.0722));
  col = clamp(mix(vec3(L), col, uSaturation), 0.0, 1.0);
  if (uUseHue == 1) col = clamp(uHue * col, 0.0, 1.0);
  return col;
}

void main() {
  vec2 f = (gl_FragCoord.xy - 0.5 * uResolution - uOffset) * uPxScale;
  vec3 origin = uRay * vec3(f, 0.0);
  vec3 axis = uRay[2];
  float z = 5.0;
  vec4 o = vec4(0.0);
  for (int i = 0; i < 100; i++) {
    vec3 p = origin + axis * z;
    float d = 0.1 + 0.2 * abs(pyramid(p + vec3(0.0, uCenterShift, 0.0)));
    z -= d;
    float phase = (p.y + z) * uColorFreq;
    vec4 band = sin(phase) * PHASE_COS + cos(phase) * PHASE_SIN + 1.0;
    if (uUsePalette == 1) band.rgb = texture(uPalette, vec2(phase * 0.15915494309189535, 0.5)).rgb * 2.0;
    o += band / d;
  }
  vec4 raw = o * o * uGlow / 1e5;
  vec4 e = exp(2.0 * raw);
  vec4 mapped = (e - 1.0) / (e + 1.0);
  vec2 seed = gl_FragCoord.xy + vec2(uTime);
  if (uLight > 0.5) {
    float peak = max(raw.r, max(raw.g, raw.b));
    vec3 hue = grade(raw.rgb / max(peak, 1e-6), seed);
    vec3 ink = pow(hue, vec3(1.5)) * mix(0.86, 0.32, uNeutral);
    float strength = max(mapped.r, max(mapped.g, mapped.b)) * mapped.a;
    float cover = clamp(strength * 0.95 + (rand(seed.yx) - 0.5) * uNoise * 0.5, 0.0, 1.0);
    outColor = vec4(ink * cover, cover);
  } else {
    outColor = vec4(grade(mapped.rgb, seed) * mapped.a, mapped.a);
  }
}`,f=(e,t,n)=>Math.min(n,Math.max(t,e)),p=(e,t,n)=>{let r=e.createShader(t);return r?(e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(e.deleteShader(r),null)):null},m=e=>{let t=p(e,e.VERTEX_SHADER,u),n=p(e,e.FRAGMENT_SHADER,d),r=e.createProgram();if(!t||!n||!r)return null;if(e.attachShader(r,t),e.attachShader(r,n),e.linkProgram(r),e.deleteShader(t),e.deleteShader(n),!e.getProgramParameter(r,e.LINK_STATUS))return e.deleteProgram(r),null;let i={},a=e.getProgramParameter(r,e.ACTIVE_UNIFORMS);for(let t=0;t<a;t++){let n=e.getActiveUniform(r,t);n&&(i[n.name]=e.getUniformLocation(r,n.name))}return{program:r,uniforms:i}},h=(e,t,n)=>{let r=Math.cos(e),i=Math.sin(e),a=Math.cos(t),o=Math.sin(t),s=Math.cos(n),c=Math.sin(n);return[r*s+i*o*c,a*c,-i*s+r*o*c,-r*c+i*o*s,a*s,i*c+r*o*s,i*a,-o,r*a]},g=(e,t)=>{let n=Array(9);for(let r=0;r<3;r++)for(let i=0;i<3;i++)n[r*3+i]=e[i]*t[r*3]+e[3+i]*t[r*3+1]+e[6+i]*t[r*3+2];return n},_=({height:e=3.5,baseWidth:t=5.5,animationType:n=`rotate`,glow:u=1,offset:d,noise:p=0,scale:_=3.6,hueShift:v=0,colorFrequency:y=1,colors:b,saturation:x=1.5,timeScale:S=.5,interactive:C=!0,hoverStrength:w=2,inertia:T=.05,intro:E=!0,resolution:D=.5,lightMode:O=!1,dpr:k,className:A=``,style:j,...M})=>{let N=(0,r.useRef)(null),P=(0,r.useRef)(null),F=(0,r.useRef)(null),I=Array.isArray(b)?b.filter(Boolean).slice(0,8):[],L={height:Math.max(.1,e),baseWidth:Math.max(.1,t),animationType:n===`rotate3d`?`3drotate`:n,glow:Math.max(0,u),offsetX:d?.x??0,offsetY:d?.y??0,noise:Math.max(0,p),scale:Math.max(.1,_),hueShift:(v||0)*Math.PI/180,colorFrequency:Math.max(0,y),colors:I,saturation:Math.max(0,x),timeScale:Math.max(0,S),interactive:C,hoverStrength:Math.max(0,w),inertia:f(T,.001,1),intro:E,resolution:f(D,.25,1),lightMode:O,dpr:k},R=(0,r.useRef)(L);return R.current=L,(0,r.useEffect)(()=>{let e=N.current,t=P.current,n=t?.getContext(`webgl2`,{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1});if(!e||!t||!n)return;let r=m(n);if(!r)return;let i=r.uniforms,u=n.createVertexArray(),d=n.createTexture();n.bindTexture(n.TEXTURE_2D,d),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MAG_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.REPEAT),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE),n.texImage2D(n.TEXTURE_2D,0,n.RGBA8,o,1,0,n.RGBA,n.UNSIGNED_BYTE,null);let p=document.createElement(`canvas`).getContext(`2d`,{willReadFrequently:!0}),_=e=>{if(!p)return[255,255,255];p.clearRect(0,0,1,1),p.fillStyle=`#000000`,p.fillStyle=String(e),p.fillRect(0,0,1,1);let[t,n,r]=p.getImageData(0,0,1,1).data;return[t,n,r]},v=``,y=0,b=e=>{let t=e.join(`,`);if(t===v||(v=t,y=0,!e.length))return;let r=e.map(_);y=1-r.reduce((e,[t,n,r])=>{let i=Math.max(t,n,r);return e+(i>0?(i-Math.min(t,n,r))/i:0)},0)/r.length;let i=new Uint8Array(256);for(let e=0;e<o;e++){let t=e/o*r.length,n=Math.floor(t),a=r[n%r.length],s=r[(n+1)%r.length],c=t-n,l=c*c*(3-2*c);for(let t=0;t<3;t++)i[e*4+t]=Math.round(a[t]+(s[t]-a[t])*l);i[e*4+3]=255}n.bindTexture(n.TEXTURE_2D,d),n.texSubImage2D(n.TEXTURE_2D,0,0,0,o,1,n.RGBA,n.UNSIGNED_BYTE,i)},x=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches??!1,S={width:1,height:1,scale:1},C={yaw:0,pitch:0,roll:0},w={x:0,y:0,inside:!1},T=0,E=R.current.intro&&!x?0:1,D=0,O=0,k=!0,A=e=>{let t=h(C.yaw,C.pitch,C.roll);if(e.animationType===`rotate`){let n=T*e.timeScale,r=Math.cos(n),i=Math.cos(n+33);return g(t,[r,0,Math.cos(n+11),0,1,0,i,0,r])}if(e.animationType===`3drotate`){let n=T*e.timeScale;return g(t,h(n*.55,Math.sin(n*.6+.6)*.6,Math.sin(n*.35+1.9)*.5))}return t},j=()=>{let e=R.current;b(e.colors);let a=e.baseWidth*.5,o=E*E*(3-2*E),f=Math.cos(e.hueShift),p=Math.sin(e.hueShift);n.bindVertexArray(u),n.viewport(0,0,t.width,t.height),n.useProgram(r.program),n.uniform2f(i.uResolution,t.width,t.height),n.uniformMatrix3fv(i.uRay,!1,A(e)),n.uniform1f(i.uGlow,e.glow*o*o),n.uniform2f(i.uOffset,e.offsetX*S.scale,-e.offsetY*S.scale),n.uniform1f(i.uColorFreq,e.colorFrequency),n.uniform1f(i.uCenterShift,e.height*.25),n.uniform1f(i.uInvBaseHalf,1/a),n.uniform1f(i.uInvHeight,1/e.height),n.uniform1f(i.uMinAxis,Math.min(a,e.height)),n.uniform1f(i.uPxScale,1/(t.height*.1*e.scale)),n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,d),n.uniform1i(i.uPalette,0),n.uniform1i(i.uUsePalette,+!!e.colors.length),n.uniform1f(i.uTime,T),n.uniform1f(i.uNoise,e.noise),n.uniform1f(i.uSaturation,e.saturation),n.uniformMatrix3fv(i.uHue,!1,s.map((e,t)=>e+c[t]*f+l[t]*p)),n.uniform1i(i.uUseHue,+(Math.abs(e.hueShift)>1e-4)),n.uniform1f(i.uLight,+!!e.lightMode),n.uniform1f(i.uNeutral,y),n.drawArrays(n.TRIANGLES,0,3)},M=()=>{let n=R.current;S.width=Math.max(1,e.clientWidth),S.height=Math.max(1,e.clientHeight),S.scale=Math.min(n.dpr||window.devicePixelRatio||1,2)*n.resolution,t.width=Math.max(1,Math.round(S.width*S.scale)),t.height=Math.max(1,Math.round(S.height*S.scale)),j(),L()},I=e=>{if(D=0,!k||document.hidden)return;let n=R.current;if(Math.round(S.width*Math.min(n.dpr||window.devicePixelRatio||1,2)*n.resolution)!==t.width){M();return}let r=O?f((e-O)/1e3,.001,.05):1/60;O=e,x||(T+=r),E<1&&(E=Math.min(1,E+r/a));let i=n.animationType===`hover`,o=w.inside&&!x&&(i||n.interactive),s=(i?.6:.09)*n.hoverStrength,c=o?-w.x*s:0,l=o?w.y*s:0,u=1-(1-n.inertia)**(r*60);C.yaw+=(c-C.yaw)*u,C.pitch+=(l-C.pitch)*u,C.roll+=(0-C.roll)*(1-.9**(r*60)),j();let d=Math.abs(c-C.yaw)+Math.abs(l-C.pitch)+Math.abs(C.roll)>1e-4;!x&&!i&&n.animationType!==`static`&&n.timeScale>0||d||E<1||!x&&n.noise>0?D=requestAnimationFrame(I):O=0};function L(){!D&&k&&!document.hidden&&(D=requestAnimationFrame(I))}let z=t=>{let n=e.getBoundingClientRect(),r=(t.clientX-n.left)/Math.max(1,n.width)*2-1,i=(t.clientY-n.top)/Math.max(1,n.height)*2-1;w.inside=Math.abs(r)<=1&&Math.abs(i)<=1,w.x=f(r,-1,1),w.y=f(i,-1,1);let a=R.current;(a.interactive||a.animationType===`hover`)&&L()},B=()=>{w.inside=!1,L()},V=()=>{O=0,L()},H=new ResizeObserver(M);H.observe(e);let U=new IntersectionObserver(e=>{k=e.some(e=>e.isIntersecting),k&&(O=0,L())});return U.observe(e),window.addEventListener(`pointermove`,z,{passive:!0}),window.addEventListener(`blur`,B),document.documentElement.addEventListener(`pointerleave`,B),document.addEventListener(`visibilitychange`,V),M(),F.current=L,()=>{cancelAnimationFrame(D),F.current=null,H.disconnect(),U.disconnect(),window.removeEventListener(`pointermove`,z),window.removeEventListener(`blur`,B),document.documentElement.removeEventListener(`pointerleave`,B),document.removeEventListener(`visibilitychange`,V),n.deleteTexture(d),n.deleteVertexArray(u),n.deleteProgram(r.program),n.getExtension(`WEBGL_lose_context`)?.loseContext()}},[]),(0,r.useEffect)(()=>{F.current?.()}),(0,i.jsx)(`div`,{ref:N,className:[`relative h-full w-full overflow-hidden`,A].filter(Boolean).join(` `),style:j,...M,children:(0,i.jsx)(`canvas`,{ref:P,className:`absolute inset-0 block h-full w-full`,"aria-hidden":`true`})})};export{_ as default};