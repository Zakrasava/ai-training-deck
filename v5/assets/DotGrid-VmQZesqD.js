import{i as e,t}from"./react-sySUN5R7.js";import{O as n}from"./sculpture-dark-Cfb-XN1r.js";var r=e(t(),1),i=n(),a=`#version 300 es
precision highp float;

layout(location = 0) in vec2 aCorner;
layout(location = 1) in vec4 aMotion;
layout(location = 2) in vec2 aState;

uniform vec2 uResolution;
uniform float uSize;
uniform float uSwell;
uniform float uStretch;
uniform float uGlow;

out vec2 vLocal;
out vec2 vPoint;
out float vLength;
out float vRadius;
out float vEnergy;

void main() {
  float energy = aState.x;
  float radius = 0.5 * uSize * aState.y * (1.0 + uSwell * energy);
  float speed = length(aMotion.zw);
  float angle = speed > 0.001 ? atan(aMotion.w, aMotion.z) : 0.0;
  float axis = floor(angle / 1.5707963 + 0.5) * 1.5707963;
  angle = axis + (angle - axis) * smoothstep(8.0, 70.0, speed);
  vec2 dir = vec2(cos(angle), sin(angle));
  float halfLength = min(uSize * 2.0, speed * uStretch * 0.02);
  float pad = radius * (1.0 + uGlow * energy * 2.5) + 2.0;
  vec2 local = aCorner * vec2(halfLength + pad, pad);
  vec2 point = aMotion.xy + dir * local.x + vec2(-dir.y, dir.x) * local.y;
  vLocal = local;
  vPoint = point;
  vLength = halfLength;
  vRadius = radius;
  vEnergy = energy;
  vec2 clip = point / uResolution * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
}
`,o=`#version 300 es
precision highp float;

in vec2 vLocal;
in vec2 vPoint;
in float vLength;
in float vRadius;
in float vEnergy;

uniform vec2 uResolution;
uniform vec3 uBase;
uniform vec3 uActive;
uniform float uGlow;
uniform float uOpacity;
uniform float uFade;
uniform int uShape;

out vec4 outColor;

float smootherstep01(float t) {
  t = clamp(t, 0.0, 1.0);
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

void main() {
  float d;
  if (uShape == 1) {
    float corner = vRadius * 0.3;
    vec2 q = abs(vLocal) - vec2(vLength + vRadius, vRadius) + corner;
    d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - corner;
  } else {
    d = length(vec2(max(abs(vLocal.x) - vLength, 0.0), vLocal.y)) - vRadius;
  }
  float aa = max(fwidth(d), 0.0001);
  float body = clamp(0.5 - d / aa, 0.0, 1.0);
  float halo = uGlow * vEnergy * 0.5 * exp(-max(d, 0.0) / max(vRadius * 1.3, 0.6));
  float alpha = body + (1.0 - body) * halo;
  vec3 color = mix(uBase, uActive, clamp(vEnergy * 1.2, 0.0, 1.0));
  float fade = 1.0;
  if (uFade > 0.0) {
    vec2 edge = min(vPoint, uResolution - vPoint) / (uFade * 0.4 * min(uResolution.x, uResolution.y));
    fade = smootherstep01(edge.x) * smootherstep01(edge.y);
  }
  alpha *= uOpacity * fade;
  outColor = vec4(color * alpha, alpha);
}
`,s=e=>{let t=/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(String(e).trim());if(!t)return[1,1,1];let n=t[1].length===3?t[1].replace(/./g,e=>e+e):t[1];return[0,2,4].map(e=>parseInt(n.slice(e,e+2),16)/255)},c=e=>{let t=Math.min(1,Math.max(0,e));return t*t*t*(t*(t*6-15)+10)},l=e=>{let t=e-1;return 1+t*t*(2.9*t+1.9)},u=(e,t,n)=>{let r=e.createShader(t);return e.shaderSource(r,n),e.compileShader(r),r},d=({dotSize:e=5,gap:t=18,baseColor:n=`#3a3446`,activeColor:d=`#ffffff`,proximity:f=140,strength:p=1,bounce:m=.6,tension:h=.4,returnDuration:g=.8,shockRadius:_=320,shockStrength:v=5,swell:y=.8,stretch:b=.5,glow:x=.5,shape:S=`circle`,fade:C=0,opacity:w=1,intro:T=!0,mouseInteraction:E=!0,clickShock:D=!0,paused:O=!1,dpr:k,className:A=``,style:j})=>{let M=(0,r.useRef)(null),N=(0,r.useRef)(null),P={dotSize:e,gap:t,baseColor:n,activeColor:d,proximity:f,strength:p,bounce:m,tension:h,returnDuration:g,shockRadius:_,shockStrength:v,swell:y,stretch:b,glow:x,shape:S,fade:C,opacity:w,intro:T,mouseInteraction:E,clickShock:D,paused:O,dpr:k},F=(0,r.useRef)(P);return F.current=P,(0,r.useEffect)(()=>{let e=M.current;if(!e)return;let t=e.getContext(`webgl2`,{alpha:!0,premultipliedAlpha:!0,antialias:!1});if(!t)return;let n=t.createProgram();if(t.attachShader(n,u(t,t.VERTEX_SHADER,a)),t.attachShader(n,u(t,t.FRAGMENT_SHADER,o)),t.linkProgram(n),!t.getProgramParameter(n,t.LINK_STATUS))return;let r={};for(let e of[`uResolution`,`uSize`,`uSwell`,`uStretch`,`uGlow`,`uBase`,`uActive`,`uOpacity`,`uFade`,`uShape`])r[e]=t.getUniformLocation(n,e);let i=t.createVertexArray();t.bindVertexArray(i);let d=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,d),t.bufferData(t.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),t.STATIC_DRAW),t.enableVertexAttribArray(0),t.vertexAttribPointer(0,2,t.FLOAT,!1,0,0);let f=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,f),t.enableVertexAttribArray(1),t.vertexAttribPointer(1,4,t.FLOAT,!1,24,0),t.vertexAttribDivisor(1,1),t.enableVertexAttribArray(2),t.vertexAttribPointer(2,2,t.FLOAT,!1,24,16),t.vertexAttribDivisor(2,1),t.bindVertexArray(null);let p=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,m={width:0,height:0,left:0,top:0,ratio:1},h={count:0,cols:1,rows:1,cell:1,centerX:0,centerY:0,reach:1},g=new Float32Array,_=new Float32Array,v=new Float32Array,y=new Float32Array,b=new Float32Array,x=new Float32Array,S=new Float32Array,C=new Float32Array,w={x:0,y:0,vx:0,vy:0,time:0,inside:!1,presence:0},T=[],E=F.current.intro&&!p?-1:null,D=!0,O=0,k=0,A=()=>{let{dotSize:e,gap:n}=F.current,r=Math.max(2,e+n),i=Math.max(1,Math.floor((m.width+n)/r)),a=Math.max(1,Math.floor((m.height+n)/r)),o=(m.width-(i*r-n))/2+e/2,s=(m.height-(a*r-n))/2+e/2,c=i*a;g=new Float32Array(c*2),_=new Float32Array(c*2),v=new Float32Array(c*2),y=new Float32Array(c*2),b=new Float32Array(c*2),x=new Float32Array(c*4),S=new Float32Array(c),C=new Float32Array(c*6);for(let e=0;e<a;e++)for(let t=0;t<i;t++){let n=(e*i+t)*2;g[n]=o+t*r,g[n+1]=s+e*r}Object.assign(h,{count:c,cols:i,rows:a,cell:r,centerX:m.width/2,centerY:m.height/2,reach:Math.hypot(m.width,m.height)/2}),t.bindBuffer(t.ARRAY_BUFFER,f),t.bufferData(t.ARRAY_BUFFER,C.byteLength,t.DYNAMIC_DRAW)},j=()=>{let t=e.getBoundingClientRect(),n=Math.min(F.current.dpr??window.devicePixelRatio??1,2),r=Math.max(1,Math.round(t.width)),i=Math.max(1,Math.round(t.height));Object.assign(m,{width:r,height:i,left:t.left,top:t.top,ratio:n}),e.width=Math.round(r*n),e.height=Math.round(i*n),A(),I(performance.now())},P=(e,t)=>{let n=F.current,r=+!p,i=1-.85*Math.min(1,Math.max(0,n.bounce)),a=4/(i*Math.max(.2,n.returnDuration)),o=a*a,s=2*i*a,l=Math.max(1,n.proximity),u=Math.hypot(w.vx,w.vy),d=n.mouseInteraction&&w.inside?6500*Math.tanh(u/900)*n.strength*r:0,f=u>.001?w.vx/u:0,m=u>.001?w.vy/u:0,C=h.cell*1.4,E=T.map(e=>{let i=(t-e.start)/1e3*650,a=c(1-i/Math.max(1,n.shockRadius));return{...e,front:i,amplitude:a*n.shockStrength*h.cell*.24*r}}),D=(Math.max(0,n.tension)*900)**2/(h.cell*h.cell),O=Math.sqrt(D)*.06,k=Math.sqrt(o+8*D)+s+8*O,A=Math.min(24,Math.max(1,Math.ceil(e/Math.min(1/120,1.2/k)))),j=e/A;for(let e=0;e<h.count;e++){let t=e*2,n=g[t],r=g[t+1],i=0,a=0;if(d>0){let e=n+_[t]-w.x,o=r+_[t+1]-w.y,s=Math.hypot(e,o);if(s<l){let t=c(1-s/l)*d,n=s>.001?e/s:0,r=s>.001?o/s:0;i+=t*(f+n*.6),a+=t*(m+r*.6)}}let s=0,u=0,p=0,h=0;for(let e of E){if(e.amplitude<=0)continue;let t=n-e.x,c=r-e.y,l=Math.hypot(t,c),d=(l-e.front)/C;if(Math.abs(d)<3&&l>.001){let n=t/l,r=c/l,f=Math.exp(-d*d),m=e.amplitude*f,g=e.amplitude*2*d*f/C*650;s+=n*m,u+=r*m,p+=n*g,h+=r*g,i+=n*m*o*.35,a+=r*m*o*.35}}y[t]=i,y[t+1]=a;let v=e*4;x[v]=s,x[v+1]=u,x[v+2]=p,x[v+3]=h}let{cols:M,rows:N}=h,P=M*2;for(let e=0;e<A;e++){for(let e=0;e<N;e++)for(let t=0;t<M;t++){let n=(e*M+t)*2,r=y[n]-o*_[n]-s*v[n],i=y[n+1]-o*_[n+1]-s*v[n+1];if(D>0){let a=-4*_[n],o=-4*_[n+1],s=-4*v[n],c=-4*v[n+1];t>0&&(a+=_[n-2],o+=_[n-1],s+=v[n-2],c+=v[n-1]),t<M-1&&(a+=_[n+2],o+=_[n+3],s+=v[n+2],c+=v[n+3]),e>0&&(a+=_[n-P],o+=_[n-P+1],s+=v[n-P],c+=v[n-P+1]),e<N-1&&(a+=_[n+P],o+=_[n+P+1],s+=v[n+P],c+=v[n+P+1]),r+=D*a+O*s,i+=D*o+O*c}b[n]=v[n]+r*j,b[n+1]=v[n+1]+i*j}for(let e=0;e<_.length;e++)v[e]=b[e],_[e]+=v[e]*j}for(let e=0;e<h.count;e++){let t=e*2,n=e*4;S[e]=Math.min(1,Math.hypot(v[t]+x[n+2],v[t+1]+x[n+3])/380*.85+Math.hypot(_[t]+x[n],_[t+1]+x[n+1])/(h.cell*2.2)*.35)}for(let e=T.length-1;e>=0;e--)E[e].front>n.shockRadius+C*3&&T.splice(e,1);let I=1-Math.exp(-e/.08);w.vx-=w.vx*I,w.vy-=w.vy*I;let L=n.mouseInteraction&&w.inside?1:0;w.presence+=(L-w.presence)*(1-Math.exp(-e/.2))},I=a=>{let o=F.current,u=Math.max(1,o.proximity),d=(E===null?1/0:E<0?0:(a-E)/1e3)*h.reach*1.25,y=h.cell*4;for(let e=0;e<h.count;e++){let t=e*2,n=e*4,r=g[t]+_[t]+x[n],i=g[t+1]+_[t+1]+x[n+1],a=S[e];if(w.presence>.001){let e=Math.hypot(r-w.x,i-w.y);e<u&&(a=Math.max(a,c(1-e/u)*.4*w.presence))}let o=1;if(E!==null){let e=Math.hypot(g[t]-h.centerX,g[t+1]-h.centerY),n=Math.min(1,Math.max(0,(d-e)/y));o=n>=1?1:Math.max(0,l(n)),a=Math.max(a,Math.sin(n*Math.PI)*.6)}let s=e*6;C[s]=r,C[s+1]=i,C[s+2]=v[t]+x[n+2],C[s+3]=v[t+1]+x[n+3],C[s+4]=a,C[s+5]=o}let b=s(o.baseColor),T=s(o.activeColor);t.viewport(0,0,e.width,e.height),t.clearColor(0,0,0,0),t.clear(t.COLOR_BUFFER_BIT),t.enable(t.BLEND),t.blendFunc(t.ONE,t.ONE_MINUS_SRC_ALPHA),t.useProgram(n),t.uniform2f(r.uResolution,m.width,m.height),t.uniform1f(r.uSize,Math.max(.5,o.dotSize)),t.uniform1f(r.uSwell,p?0:Math.max(0,o.swell)),t.uniform1f(r.uStretch,p?0:Math.max(0,o.stretch)),t.uniform1f(r.uGlow,Math.max(0,o.glow)),t.uniform3f(r.uBase,b[0],b[1],b[2]),t.uniform3f(r.uActive,T[0],T[1],T[2]),t.uniform1f(r.uOpacity,Math.min(1,Math.max(0,o.opacity))),t.uniform1f(r.uFade,Math.min(1,Math.max(0,o.fade))),t.uniform1i(r.uShape,+(o.shape===`square`)),t.bindVertexArray(i),t.bindBuffer(t.ARRAY_BUFFER,f),t.bufferSubData(t.ARRAY_BUFFER,0,C),t.drawArraysInstanced(t.TRIANGLE_STRIP,0,4,h.count),t.bindVertexArray(null)},L=e=>{if(T.length)return!1;if(E!==null){if(E<0||(e-E)/1e3<1.6)return!1;E=null}if(Math.abs(w.vx)+Math.abs(w.vy)>1)return!1;let t=F.current.mouseInteraction&&w.inside?1:0;if(Math.abs(t-w.presence)>.002)return!1;for(let e=0;e<_.length;e++)if(Math.abs(_[e])>.02||Math.abs(v[e])>.5)return!1;return!0},R=e=>{if(O=0,F.current.paused||!D)return;E!==null&&E<0&&(E=e);let t=Math.min(.05,(e-k)/1e3||0);k=e,P(t,e),I(e),L(e)||(O=requestAnimationFrame(R))},z=()=>{O||F.current.paused||!D||(k=performance.now(),O=requestAnimationFrame(R))},B=t=>{let n=e.getBoundingClientRect();return m.left=n.left,m.top=n.top,[t.clientX-n.left,t.clientY-n.top]},V=e=>{if(!F.current.mouseInteraction)return;let[t,n]=B(e),r=t>=0&&n>=0&&t<=m.width&&n<=m.height,i=e.timeStamp||performance.now();if(r&&w.inside&&w.time){let e=Math.max(4,i-w.time)/1e3,r=(t-w.x)/e,a=(n-w.y)/e;w.vx+=(r-w.vx)*.6,w.vy+=(a-w.vy)*.6}else w.vx=0,w.vy=0;w.x=t,w.y=n,w.time=i,(r!==w.inside||r)&&(w.inside=r,z())},H=()=>{w.inside=!1,w.time=0,z()},U=e=>{e.relatedTarget||H()},W=e=>{if(!F.current.clickShock||p)return;let[t,n]=B(e);t<0||n<0||t>m.width||n>m.height||(T.push({x:t,y:n,start:performance.now()}),T.length>6&&T.shift(),z())};window.addEventListener(`pointermove`,V,{passive:!0}),window.addEventListener(`pointerdown`,W,{passive:!0}),window.addEventListener(`pointerout`,U),window.addEventListener(`blur`,H);let G=new ResizeObserver(()=>{j(),z()});G.observe(e);let K=new IntersectionObserver(([e])=>{D=e.isIntersecting,D&&z()});K.observe(e);let q=()=>{document.hidden?(cancelAnimationFrame(O),O=0):z()};return document.addEventListener(`visibilitychange`,q),j(),z(),N.current={rebuild:()=>{A(),I(performance.now()),z()},refresh:()=>{I(performance.now()),z()}},()=>{cancelAnimationFrame(O),G.disconnect(),K.disconnect(),window.removeEventListener(`pointermove`,V),window.removeEventListener(`pointerdown`,W),window.removeEventListener(`pointerout`,U),window.removeEventListener(`blur`,H),document.removeEventListener(`visibilitychange`,q),t.deleteBuffer(d),t.deleteBuffer(f),t.deleteVertexArray(i),t.deleteProgram(n),N.current=null}},[]),(0,r.useEffect)(()=>{N.current?.rebuild()},[e,t]),(0,r.useEffect)(()=>{N.current?.refresh()},[n,d,y,b,x,S,C,w,O,f,E]),(0,i.jsx)(`div`,{className:`relative h-full w-full ${A}`.trim(),style:j,children:(0,i.jsx)(`canvas`,{ref:M,className:`pointer-events-none absolute inset-0 block h-full w-full`})})};export{d as default};