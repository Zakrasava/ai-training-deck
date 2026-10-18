import{i as e,t}from"./react-sySUN5R7.js";import{k as n}from"./sculpture-dark-CKiqtzhU.js";var r=e(t(),1),i=n(),a={solid:0,dashed:1},o=12,s=4,c=2.2,l=640,u=64,d=u*Math.sqrt(Math.PI/2)/l,f=16e5,p=`#version 300 es
precision highp float;
precision highp int;
uniform vec2 uView;
uniform float uRatio;
uniform vec2 uAxis;
uniform float uSpacing;
uniform float uStep;
uniform vec2 uStart;
uniform float uAmplitude;
uniform vec2 uFrequency;
uniform vec2 uDrift;
uniform float uTwist;
uniform uint uSeed;
uniform sampler2D uField;
uniform ivec2 uFieldSize;
uniform float uCell;
uniform float uLimit;
uniform float uReach;
uniform float uReveal;
uniform float uBand;
out float vAcross;
out float vAlong;
out float vEnergy;
out float vShow;
out float vPhase;

const vec2 GRADIENTS[12] = vec2[12](
  vec2(1.0, 1.0), vec2(-1.0, 1.0), vec2(1.0, -1.0), vec2(-1.0, -1.0),
  vec2(1.0, 0.0), vec2(-1.0, 0.0), vec2(1.0, 0.0), vec2(-1.0, 0.0),
  vec2(0.0, 1.0), vec2(0.0, -1.0), vec2(0.0, 1.0), vec2(0.0, -1.0)
);

vec2 gradient(vec2 cell) {
  uvec2 q = uvec2(ivec2(cell) + 65536) + uvec2(uSeed * 7919u, uSeed * 104729u);
  q = 1103515245u * ((q >> 1u) ^ q.yx);
  uint n = 1103515245u * (q.x ^ (q.y >> 3u));
  return GRADIENTS[(n >> 16u) % 12u];
}

float ease(float t) {
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

float perlin(vec2 p) {
  vec2 i = floor(p);
  vec2 f = p - i;
  float n00 = dot(gradient(i), f);
  float n10 = dot(gradient(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0));
  float n01 = dot(gradient(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0));
  float n11 = dot(gradient(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0));
  vec2 u = vec2(ease(f.x), ease(f.y));
  return mix(mix(n00, n10, u.x), mix(n01, n11, u.x), u.y);
}

vec2 node(ivec2 cell) {
  return texelFetch(uField, clamp(cell, ivec2(0), uFieldSize - 1), 0).xy;
}

void weights(float f, out vec4 w, out vec4 d) {
  float g = 1.0 - f;
  float f2 = f * f;
  float f3 = f2 * f;
  w = vec4(g * g * g, 3.0 * f3 - 6.0 * f2 + 4.0, -3.0 * f3 + 3.0 * f2 + 3.0 * f + 1.0, f3) / 6.0;
  d = vec4(-g * g, 3.0 * f2 - 4.0 * f, -3.0 * f2 + 2.0 * f + 1.0, f2) * 0.5;
}

vec2 field(vec2 point, out mat2 slope) {
  vec2 t = point / uCell;
  vec2 base = floor(t);
  vec2 f = t - base;
  vec4 wx;
  vec4 dx;
  vec4 wy;
  vec4 dy;
  weights(f.x, wx, dx);
  weights(f.y, wy, dy);
  ivec2 origin = ivec2(base) - 1;
  vec2 value = vec2(0.0);
  vec2 alongX = vec2(0.0);
  vec2 alongY = vec2(0.0);
  for (int j = 0; j < 4; j++) {
    vec2 row = vec2(0.0);
    vec2 rowSlope = vec2(0.0);
    for (int i = 0; i < 4; i++) {
      vec2 tap = node(origin + ivec2(i, j));
      row += tap * wx[i];
      rowSlope += tap * dx[i];
    }
    value += row * wy[j];
    alongX += rowSlope * wy[j];
    alongY += row * dy[j];
  }
  float size = length(value);
  float scale = size > 0.0001 ? uLimit * tanh(size / uLimit) / size : 1.0;
  slope = mat2(alongX, alongY) * (scale / uCell);
  return value * scale;
}

vec2 wave(vec2 rest) {
  float turn = perlin(rest * uFrequency + uDrift) * 12.0 * uTwist;
  vec2 local = rest + vec2(cos(turn), sin(turn) * 0.5) * uAmplitude;
  return uView * 0.5 + vec2(local.x * uAxis.x - local.y * uAxis.y, local.x * uAxis.y + local.y * uAxis.x);
}

void main() {
  int index = gl_VertexID >> 1;
  float side = float(gl_VertexID & 1) * 2.0 - 1.0;
  float u = uStart.x + float(gl_InstanceID) * uSpacing;
  float v = uStart.y + float(index) * uStep;
  vec2 flowing = wave(vec2(u, v));
  vec2 bend = wave(vec2(u, v + uStep)) - wave(vec2(u, v - uStep));
  mat2 slope;
  vec2 shift = field(flowing, slope);
  vec2 point = flowing + shift;
  float energy = length(shift);
  vec2 tangent = bend + slope * bend;
  float span = max(length(tangent), 0.0001);
  vec2 normal = vec2(-tangent.y, tangent.x) / span;
  vec2 corner = point + normal * side * uReach / uRatio;
  vAcross = side * uReach;
  vAlong = v;
  vEnergy = energy;
  vShow = clamp((uReveal - abs(u)) / uBand, 0.0, 1.0);
  uint line = uint(gl_InstanceID) * 747796405u + uSeed * 2891336453u + 1u;
  line = ((line >> ((line >> 28u) + 4u)) ^ line) * 277803737u;
  vPhase = float((line >> 22u) ^ line) / 4294967295.0;
  vec2 clip = corner / uView * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
}`,m=`#version 300 es
precision highp float;
uniform vec2 uView;
uniform float uRatio;
uniform float uHalf;
uniform float uThin;
uniform int uStyle;
uniform float uPeriod;
uniform float uFlow;
uniform vec3 uColor;
uniform vec3 uAccent;
uniform float uBase;
uniform float uHeat;
uniform float uFade;
uniform float uOpacity;
in float vAcross;
in float vAlong;
in float vEnergy;
in float vShow;
in float vPhase;
out vec4 outColor;

float smootherstep(float edge, float x) {
  float t = clamp(x / max(edge, 0.0001), 0.0, 1.0);
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

void main() {
  float coverage = clamp(uHalf + 0.5 - abs(vAcross), 0.0, 1.0) * uThin;
  if (uStyle == 1) {
    float phase = (vAlong + uFlow) / uPeriod + vPhase;
    float blur = max(fwidth(phase), 0.0001);
    coverage *= clamp((0.25 - abs(fract(phase) - 0.5)) / blur + 0.5, 0.0, 1.0);
  }
  float heat = smoothstep(0.0, uHeat, vEnergy);
  vec2 uv = gl_FragCoord.xy / (uView * uRatio);
  float edge = uFade * 0.5;
  float mask = smootherstep(edge, uv.x) * smootherstep(edge, 1.0 - uv.x) * smootherstep(edge, uv.y) * smootherstep(edge, 1.0 - uv.y);
  float alpha = coverage * mix(uBase, 1.0, heat) * mask * vShow * uOpacity;
  outColor = vec4(mix(uColor, uAccent, heat) * alpha, alpha);
}`,h=(e,t,n)=>Math.min(n,Math.max(t,e)),g=e=>{let t=h(e,0,1);return t*t*t*(t*(t*6-15)+10)},_=(e,t,n)=>{let r=e.createShader(t);return r?(e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(e.deleteShader(r),null)):null},v=e=>{let t=_(e,e.VERTEX_SHADER,p),n=_(e,e.FRAGMENT_SHADER,m),r=e.createProgram();if(!t||!n||!r)return null;if(e.attachShader(r,t),e.attachShader(r,n),e.linkProgram(r),e.deleteShader(t),e.deleteShader(n),!e.getProgramParameter(r,e.LINK_STATUS))return e.deleteProgram(r),null;let i={},a=e.getProgramParameter(r,e.ACTIVE_UNIFORMS);for(let t=0;t<a;t++){let n=e.getActiveUniform(r,t);n&&(i[n.name]=e.getUniformLocation(r,n.name))}return{program:r,uniforms:i}},y=({lineColor:e=`#ffffff`,accentColor:t,backgroundColor:n=`transparent`,lineStyle:p=`solid`,spacing:m=10,lineWidth:_=1,rotation:y=0,amplitude:b=32,scale:x=1,twist:S=1,speed:C=1,variation:w=0,mouseInteraction:T=!0,mouseRadius:E=175,mouseStrength:D=1,bounce:O=.5,returnDuration:k=1.4,clickRipple:A=!0,intro:j=!0,fade:M=0,opacity:N=1,lightMode:P=!1,paused:F=!1,dpr:I,className:L=``,style:R})=>{let z=(0,r.useRef)(null),B=(0,r.useRef)(null),V=(0,r.useRef)(null),H={lineColor:String(e),accentColor:t?String(t):``,lineStyle:a[p]??0,spacing:Math.max(2,m),lineWidth:Math.max(.25,_),rotation:y,amplitude:Math.max(0,b),scale:Math.max(.05,x),twist:Math.max(0,S),speed:C,variation:Math.max(0,Math.round(w)),mouseInteraction:T,mouseRadius:Math.max(20,E),mouseStrength:Math.max(0,D),bounce:h(O,0,1),returnDuration:Math.max(.2,k),clickRipple:A,intro:j,fade:h(M,0,1),opacity:h(N,0,1),lightMode:P,paused:F,dpr:I},U=(0,r.useRef)(H);return U.current=H,(0,r.useEffect)(()=>{let e=z.current,t=B.current,n=t?.getContext(`webgl2`,{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1});if(!e||!t||!n)return;let r=v(n);if(!r)return;let i=r.uniforms,a=n.createVertexArray(),p=n.createTexture();n.bindTexture(n.TEXTURE_2D,p),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MAG_FILTER,n.NEAREST),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE),n.pixelStorei(n.UNPACK_ALIGNMENT,1);let m=document.createElement(`canvas`).getContext(`2d`,{willReadFrequently:!0}),_=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches??!1,y=new Map,b=e=>{let t=y.get(e);if(t)return t;let n=[1,1,1];if(m){m.clearRect(0,0,1,1),m.fillStyle=`#ffffff`,m.fillStyle=e,m.fillRect(0,0,1,1);let[t,r,i]=m.getImageData(0,0,1,1).data;n=[t/255,r/255,i/255]}return y.set(e,n),n},x=e=>{let t=e.map(e=>e**2.2),n=.2126*t[0]+.7152*t[1]+.0722*t[2],r=Math.min(1,.045/Math.max(n,1e-4));return t.map(e=>(e*r)**(1/2.2))},S={width:1,height:1,ratio:1},C={cols:0,rows:0,shift:new Float32Array,speed:new Float32Array,top:0,bottom:-1,left:0,right:-1},w={x:0,y:0,sx:0,sy:0,vx:0,vy:0,inside:!1},T=[],E={flow:0,intro:U.current.intro&&!_?0:1},D=0,O=0,k=!0,A=e=>Math.max(12,e.mouseRadius*.5),j=()=>{C.cols=Math.ceil(S.width/o)+2,C.rows=Math.ceil(S.height/o)+2,C.shift=new Float32Array(C.cols*C.rows*2),C.speed=new Float32Array(C.cols*C.rows*2),C.top=0,C.bottom=-1,C.left=0,C.right=-1,n.bindTexture(n.TEXTURE_2D,p),n.texImage2D(n.TEXTURE_2D,0,n.RG32F,C.cols,C.rows,0,n.RG,n.FLOAT,C.shift)},M=(e,t,n,r)=>{let i=h(Math.floor(e/o),0,C.cols-1),a=h(Math.ceil(n/o),0,C.cols-1),s=h(Math.floor(t/o),0,C.rows-1),c=h(Math.ceil(r/o),0,C.rows-1),l=C.bottom<C.top;C.top=l?s:Math.min(C.top,s),C.bottom=l?c:Math.max(C.bottom,c),C.left=l?i:Math.min(C.left,i),C.right=l?a:Math.max(C.right,a)},N=e=>{let t=U.current,r=1-Math.exp(-e/.045),i=w.sx+(w.x-w.sx)*r,a=w.sy+(w.y-w.sy)*r,s=1-Math.exp(-e/.06);w.vx+=((i-w.sx)/e-w.vx)*s,w.vy+=((a-w.sy)/e-w.vy)*s,w.sx=i,w.sy=a;let c=1-.85*t.bounce,f=4/(c*t.returnDuration),m=t.mouseRadius,h=Math.hypot(w.vx,w.vy),v=t.mouseInteraction&&w.inside&&!_?26e3*Math.tanh(h/1400)*t.mouseStrength:0;v>1&&M(w.sx-m,w.sy-m,w.sx+m,w.sy+m);let y=[];for(let t=T.length-1;t>=0;t--){let n=T[t];n.age+=e;let r=n.age*l,i=1-r/n.range;if(i<=0){T.splice(t,1);continue}let a=r+192;M(n.x-a,n.y-a,n.x+a,n.y+a),y.push({x:n.x,y:n.y,front:r,power:150*f*i*Math.sqrt(i)/d})}if(C.bottom<C.top)return!1;let b=f*f,x=2*c*f,S=Math.min(16,Math.max(1,Math.ceil(e/Math.min(1/120,.6/f)))),E=e/S,D=h>.001?w.vx/h:0,O=h>.001?w.vy/h:0,{cols:k,shift:A,speed:j,left:N,right:P}=C,F=0;for(let e=C.top;e<=C.bottom;e++){let t=e*o;for(let n=N;n<=P;n++){let r=n*o,i=(e*k+n)*2,a=0,s=0;if(v>1){let e=Math.hypot(r-w.sx,t-w.sy);if(e<m){let t=g(1-e/m)*v;a+=D*t,s+=O*t}}for(let e of y){let n=r-e.x,i=t-e.y,o=Math.hypot(n,i),c=(o-e.front)/u;if(o>.001&&Math.abs(c)<3){let t=e.power*Math.exp(-c*c*2)*g(o/56);a+=n/o*t,s+=i/o*t}}let c=A[i],l=A[i+1],d=j[i],f=j[i+1];for(let e=0;e<S;e++)d+=(a-b*c-x*d)*E,f+=(s-b*l-x*f)*E,c+=d*E,l+=f*E;A[i]=c,A[i+1]=l,j[i]=d,j[i+1]=f,F=Math.max(F,Math.abs(c)+Math.abs(l)+(Math.abs(d)+Math.abs(f))*.05)}}let I=C.top,L=C.bottom-C.top+1;if(F<.02&&v<=1&&!y.length){for(let e=C.top;e<=C.bottom;e++)A.fill(0,(e*k+N)*2,(e*k+P+1)*2),j.fill(0,(e*k+N)*2,(e*k+P+1)*2);C.top=0,C.bottom=-1}return n.bindTexture(n.TEXTURE_2D,p),n.texSubImage2D(n.TEXTURE_2D,0,0,I,k,L,n.RG,n.FLOAT,A.subarray(I*k*2,(I+L)*k*2)),C.bottom>=C.top},P=()=>{let e=U.current,c=e.rotation*Math.PI/180,l=Math.cos(c),u=Math.sin(c),d=A(e),m=e.amplitude*1.1+d+e.spacing*2+8,v=(S.width*Math.abs(l)+S.height*Math.abs(u))/2+m,y=(S.width*Math.abs(u)+S.height*Math.abs(l))/2+m,w=Math.ceil(v/e.spacing),T=w*2+1,D=s,O=Math.ceil(y*2/D)+1;T*O*2>f&&(O=Math.max(16,Math.floor(f/(T*2))),D=y*2/(O-1));let k=e.lineWidth*S.ratio,j=Math.max(.5,k/2),M=j+1,N=E.intro,P=e.intro&&!_?(1-(1-h(N/.7,0,1))**3)*v*1.3:1e6,F=e.intro&&!_?g((N-.1)/.9):1,I=b(e.lineColor),L=e.lightMode?x(I):I,R=e.accentColor?b(e.accentColor):L,z=E.flow+e.variation*37.1;n.viewport(0,0,t.width,t.height),n.clearColor(0,0,0,0),n.clear(n.COLOR_BUFFER_BIT),n.enable(n.BLEND),n.blendFunc(n.ONE,n.ONE_MINUS_SRC_ALPHA),n.useProgram(r.program),n.bindVertexArray(a),n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,p),n.uniform1i(i.uField,0),n.uniform2f(i.uView,S.width,S.height),n.uniform1f(i.uRatio,S.ratio),n.uniform2f(i.uAxis,l,u),n.uniform1f(i.uSpacing,e.spacing),n.uniform1f(i.uStep,D),n.uniform2f(i.uStart,-w*e.spacing,-y),n.uniform1f(i.uAmplitude,e.amplitude*F),n.uniform2f(i.uFrequency,.002/e.scale,.0015/e.scale),n.uniform2f(i.uDrift,z*.025,z*.0075),n.uniform1f(i.uTwist,e.twist),n.uniform1ui(i.uSeed,e.variation),n.uniform2i(i.uFieldSize,C.cols,C.rows),n.uniform1f(i.uCell,o),n.uniform1f(i.uLimit,d),n.uniform1f(i.uReach,M),n.uniform1f(i.uReveal,P),n.uniform1f(i.uBand,Math.max(1,v*.3)),n.uniform1f(i.uHalf,j),n.uniform1f(i.uThin,Math.min(1,k)),n.uniform1i(i.uStyle,e.lineStyle),n.uniform1f(i.uPeriod,e.spacing*2.6),n.uniform1f(i.uFlow,E.flow*16%(e.spacing*2.6)),n.uniform3fv(i.uColor,L),n.uniform3fv(i.uAccent,R),n.uniform1f(i.uBase,.62),n.uniform1f(i.uHeat,d*.55),n.uniform1f(i.uFade,e.fade),n.uniform1f(i.uOpacity,e.opacity),n.drawArraysInstanced(n.TRIANGLE_STRIP,0,O*2,T)},F=e=>{if(D=0,!k||document.hidden)return;let t=U.current,n=O?h((e-O)/1e3,5e-4,.05):1/60;if(O=e,t.paused){E.intro=1,P(),O=0;return}_||(E.flow+=n*t.speed),!t.intro||_?E.intro=1:E.intro<1&&(E.intro=Math.min(1,E.intro+n/c));let r=N(n);P();let i=w.inside&&t.mouseInteraction&&Math.hypot(w.vx,w.vy)>1;!_||r||i||T.length||E.intro<1?D=requestAnimationFrame(F):O=0},I=()=>{!D&&k&&!document.hidden&&(D=requestAnimationFrame(F))},L=()=>{let n=U.current,r=Math.max(1,e.clientWidth),i=Math.max(1,e.clientHeight),a=Math.min(n.dpr||window.devicePixelRatio||1,2);S.width=r,S.height=i,t.width=Math.max(1,Math.round(r*a)),t.height=Math.max(1,Math.round(i*a)),S.ratio=t.width/r,j(),P(),I()},R=(t,n)=>{let r=e.getBoundingClientRect(),i=t.clientX-r.left,a=t.clientY-r.top,o=i>=0&&a>=0&&i<=r.width&&a<=r.height;return(n||o&&!w.inside)&&(w.sx=i,w.sy=a,w.vx=0,w.vy=0),w.inside=o,w.x=i,w.y=a,{x:i,y:a,rect:r,inside:o}},H=e=>{R(e,!1),U.current.paused||I()},W=e=>{let t=U.current,{x:n,y:r,rect:i,inside:a}=R(e,e.pointerType!==`mouse`);a&&t.clickRipple&&!t.paused&&!_&&(T.push({x:n,y:r,age:0,range:Math.max(360,Math.hypot(i.width,i.height)*.55)}),T.length>6&&T.shift()),I()},G=e=>{e.pointerType!==`mouse`&&(w.inside=!1)},K=()=>{w.inside=!1,I()},q=()=>{O=0,I()},J=new ResizeObserver(L);J.observe(e);let Y=new IntersectionObserver(e=>{k=e.some(e=>e.isIntersecting),k&&(O=0,I())});Y.observe(e),window.addEventListener(`pointermove`,H,{passive:!0}),window.addEventListener(`pointerdown`,W,{passive:!0}),window.addEventListener(`pointerup`,G,{passive:!0}),window.addEventListener(`pointercancel`,G,{passive:!0}),document.documentElement.addEventListener(`pointerleave`,K),document.addEventListener(`visibilitychange`,q),L();let X=U.current.dpr;return V.current=()=>{let e=U.current;e.dpr===X?(D||P(),I()):(X=e.dpr,L())},()=>{cancelAnimationFrame(D),V.current=null,J.disconnect(),Y.disconnect(),window.removeEventListener(`pointermove`,H),window.removeEventListener(`pointerdown`,W),window.removeEventListener(`pointerup`,G),window.removeEventListener(`pointercancel`,G),document.documentElement.removeEventListener(`pointerleave`,K),document.removeEventListener(`visibilitychange`,q),n.deleteProgram(r.program),n.deleteVertexArray(a),n.deleteTexture(p),n.getExtension(`WEBGL_lose_context`)?.loseContext()}},[]),(0,r.useEffect)(()=>{V.current?.()}),(0,i.jsx)(`div`,{ref:z,className:[`absolute inset-0 overflow-hidden`,L].filter(Boolean).join(` `),style:{backgroundColor:n,...R},children:(0,i.jsx)(`canvas`,{ref:B,className:`absolute inset-0 block h-full w-full`,"aria-hidden":`true`})})};export{y as default};