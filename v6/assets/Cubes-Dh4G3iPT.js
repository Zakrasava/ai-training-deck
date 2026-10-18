import{i as e,t}from"./react-sySUN5R7.js";import{k as n}from"./sculpture-dark-CKiqtzhU.js";var r=e(t(),1),i=n(),a=`#version 300 es
in vec3 aPosition;
in vec3 aNormal;
in vec2 aUv;
in vec2 aCenter;
in vec4 aRotation;
in vec2 aState;
uniform mat4 uProjection;
uniform float uSize;
out vec3 vNormal;
out vec2 vUv;
out float vFlash;

vec3 turn(vec4 q, vec3 v) {
  return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v);
}

void main() {
  vec3 local = turn(aRotation, aPosition * uSize * aState.y);
  vNormal = turn(aRotation, aNormal);
  vUv = aUv;
  vFlash = aState.x;
  gl_Position = uProjection * vec4(vec3(aCenter, 0.0) + local, 1.0);
}`,o=`#version 300 es
precision highp float;
in vec3 vNormal;
in vec2 vUv;
in float vFlash;
uniform vec3 uFace;
uniform vec3 uEdge;
uniform vec3 uRipple;
uniform vec3 uLight;
uniform float uShading;
uniform float uEdgeWidth;
uniform float uStyle;
uniform float uMarks;
uniform float uOpacity;
out vec4 outColor;

void main() {
  vec2 span = max(fwidth(vUv), vec2(0.00001));
  vec2 border = min(vUv, 1.0 - vUv) / span;
  bool vertical = border.x < border.y;
  float distance = min(border.x, border.y);
  float halfWidth = uEdgeWidth * 0.5;
  float cover = 1.0 - smoothstep(halfWidth - 0.5, halfWidth + 0.5, distance);
  float along = vertical ? vUv.y : vUv.x;
  float phase = along * uMarks;
  float step = max(vertical ? span.y : span.x, 0.00001) * uMarks;
  float offset = abs(fract(phase + 0.5) - 0.5);
  if (uStyle > 0.5 && uStyle < 1.5) {
    cover *= 1.0 - smoothstep(0.25 - step, 0.25 + step, offset);
  } else if (uStyle > 1.5 && uStyle < 2.5) {
    float radius = max(uEdgeWidth * 0.9, 1.0);
    float dot = length(vec2(offset / step, distance));
    cover = 1.0 - smoothstep(radius - 0.75, radius + 0.75, dot);
  } else if (uStyle > 2.5) {
    cover = 0.0;
  }
  vec3 normal = normalize(vNormal);
  cover *= smoothstep(0.06, 0.28, abs(normal.z));
  float side = clamp(1.0 - normal.z, 0.0, 1.0);
  float toward = clamp(0.6 + 0.6 * dot(normalize(normal.xy + vec2(0.00001)), normalize(uLight.xy)), 0.0, 1.0);
  vec3 face = mix(uFace, uEdge, side * mix(0.12, 0.42, toward) * uShading);
  face = mix(face, uRipple, vFlash * 0.22);
  vec3 edge = mix(uEdge, uRipple, vFlash);
  vec3 color = mix(face, edge, cover);
  float alpha = mix(uOpacity, 1.0, cover);
  outColor = vec4(color * alpha, alpha);
}`,s=[[0,0,1,1,0,0,0,1,0],[0,0,-1,-1,0,0,0,1,0],[1,0,0,0,0,-1,0,1,0],[-1,0,0,0,0,1,0,1,0],[0,1,0,1,0,0,0,0,-1],[0,-1,0,1,0,0,0,0,1]],c=()=>{let e=[],t=[];return s.forEach(([n,r,i,a,o,s,c,l,u],d)=>{[[0,0],[1,0],[1,1],[0,1]].forEach(([t,d])=>{e.push(n*.5+(t-.5)*a+(d-.5)*c,r*.5+(t-.5)*o+(d-.5)*l,i*.5+(t-.5)*s+(d-.5)*u,n,r,i,t,d)});let f=d*4;t.push(f,f+1,f+2,f,f+2,f+3)}),{vertices:new Float32Array(e),indices:new Uint16Array(t)}},l={solid:0,dashed:1,dotted:2,none:3},u=1.1,d=(e,t,n)=>Math.min(n,Math.max(t,e)),f=(e,t,n)=>{let r=e.createShader(t);return r?(e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(e.deleteShader(r),null)):null},p=e=>{let t=f(e,e.VERTEX_SHADER,a),n=f(e,e.FRAGMENT_SHADER,o),r=e.createProgram();if(!t||!n||!r)return null;if(e.attachShader(r,t),e.attachShader(r,n),[`aPosition`,`aNormal`,`aUv`,`aCenter`,`aRotation`,`aState`].forEach((t,n)=>e.bindAttribLocation(r,n,t)),e.linkProgram(r),e.deleteShader(t),e.deleteShader(n),!e.getProgramParameter(r,e.LINK_STATUS))return e.deleteProgram(r),null;let i={},s=e.getProgramParameter(r,e.ACTIVE_UNIFORMS);for(let t=0;t<s;t++){let n=e.getActiveUniform(r,t);n&&(i[n.name]=e.getUniformLocation(r,n.name))}return{program:r,uniforms:i}},ee=(e,t,n,r)=>{let i=Math.hypot(e,t);if(i<1e-6){n[r]=0,n[r+1]=0,n[r+2]=0,n[r+3]=1;return}let a=Math.sin(i/2)/i;n[r]=e*a,n[r+1]=t*a,n[r+2]=0,n[r+3]=Math.cos(i/2)},te=(e,t,n,r)=>{let[i,a,o,s]=e,[c,l,u,d]=t;n[r]=s*c+i*d+a*u-o*l,n[r+1]=s*l-i*u+a*d+o*c,n[r+2]=s*u+i*l-a*c+o*d,n[r+3]=s*d-i*c-a*l-o*u},m=(e,t,n,r)=>{let i=e/2/n,a=t/2/n,o=Math.max(i,a)*4+4;if(r<=.001)return new Float32Array([1/i,0,0,0,0,1/a,0,0,0,0,-1/o,0,0,0,0,1]);let s=(8+r*52)*Math.PI/180,c=a/Math.tan(s/2),l=Math.max(.1,c-o),u=c+o,d=1/Math.tan(s/2),f=i/a;return new Float32Array([d/f,0,0,0,0,d,0,0,0,0,(u+l)/(l-u),-1,0,0,2*u*l/(l-u)-(u+l)/(l-u)*c,c])},h=({gridSize:e=10,gap:t=.18,faceColor:n=`#120F17`,edgeColor:a=`#ffffff`,edgeWidth:o=1,edgeStyle:s=`solid`,faceOpacity:f=1,shading:h=.6,maxAngle:g=45,radius:_=3,speed:v=1,bounce:y=.4,brush:b=1,perspective:x=0,autoAnimate:S=!0,rippleOnClick:C=!0,rippleColor:w=`#ffffff`,rippleSpeed:T=1,intro:E=!0,paused:D=!1,dpr:O,className:k=``,...A})=>{let j=(0,r.useRef)(null),M=(0,r.useRef)(null),N=(0,r.useRef)(null),P={gridSize:Math.round(d(e,1,40)),gap:d(t,0,.9),faceColor:String(n),edgeColor:String(a),edgeWidth:Math.max(0,o),edgeStyle:s,faceOpacity:d(f,0,1),shading:Math.max(0,h),maxAngle:g,radius:Math.max(.5,_),speed:Math.max(.05,v),bounce:d(y,0,1),brush:Math.max(0,b),perspective:d(x,0,1),autoAnimate:S,rippleOnClick:C,rippleColor:String(w),rippleSpeed:Math.max(.05,T),intro:E,paused:D,dpr:O},F=(0,r.useRef)(P);return F.current=P,(0,r.useEffect)(()=>{let e=j.current,t=M.current,n=t?.getContext(`webgl2`,{alpha:!0,premultipliedAlpha:!0,antialias:!0,depth:!0,stencil:!1});if(!e||!t||!n)return;let r=p(n);if(!r)return;let i=c(),a=n.createVertexArray();n.bindVertexArray(a);let o=n.createBuffer();n.bindBuffer(n.ARRAY_BUFFER,o),n.bufferData(n.ARRAY_BUFFER,i.vertices,n.STATIC_DRAW),n.enableVertexAttribArray(0),n.vertexAttribPointer(0,3,n.FLOAT,!1,32,0),n.enableVertexAttribArray(1),n.vertexAttribPointer(1,3,n.FLOAT,!1,32,12),n.enableVertexAttribArray(2),n.vertexAttribPointer(2,2,n.FLOAT,!1,32,24);let s=n.createBuffer();n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,s),n.bufferData(n.ELEMENT_ARRAY_BUFFER,i.indices,n.STATIC_DRAW);let f=n.createBuffer();n.bindBuffer(n.ARRAY_BUFFER,f),[[3,2,0],[4,4,8],[5,2,24]].forEach(([e,t,r])=>{n.enableVertexAttribArray(e),n.vertexAttribPointer(e,t,n.FLOAT,!1,32,r),n.vertexAttribDivisor(e,1)});let h=document.createElement(`canvas`).getContext(`2d`,{willReadFrequently:!0}),g=new Map,_=e=>{let t=g.get(e);if(t)return t;let n=[1,1,1];if(h){h.clearRect(0,0,1,1),h.fillStyle=`#ffffff`,h.fillStyle=e,h.fillRect(0,0,1,1);let[t,r,i]=h.getImageData(0,0,1,1).data;n=[t/255,r/255,i/255]}return g.set(e,n),n},v=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches??!1,y={width:1,height:1,ratio:1,scale:1},b={x:0,y:0,inside:!1,moved:0},x={x:0,y:0,vx:0,vy:0,weight:0,primed:!1},S={size:0,count:0},C=new Float32Array,w=new Float32Array,T=new Float32Array,E=new Float32Array,D=new Float32Array,O=[],k=new Float32Array,A=new Float32Array,P=0,I=F.current.intro&&!v?0:99,L=0,R=0,z=!0,B=e=>{if(S.size===e)return;S.size=e,S.count=e*e,C=new Float32Array(S.count),w=new Float32Array(S.count),T=new Float32Array(S.count),E=new Float32Array(S.count),D=new Float32Array(S.count),k=new Float32Array(S.count),A=new Float32Array(S.count*8);let t=(e-1)/2;for(let n=0;n<S.count;n++){let r=n%e,i=Math.floor(n/e);k[n]=Math.hypot(r-t,i-t)/Math.max(1,e/2)}},ne=e=>{let t=S.size,n=(t-1)/2;return[e%t-n,n-Math.floor(e/t)]},V=(e,t)=>[(e-y.width/2)/y.scale,(y.height/2-t)/y.scale],re=(e,t)=>{if(!F.current.rippleOnClick||v)return;let[n,r]=V(e,t);O.push({x:n,y:r,born:P}),O.length>6&&O.shift(),G()},H=()=>{let e=F.current,i=t.width,o=t.height;if(n.viewport(0,0,i,o),n.clearColor(0,0,0,0),n.clear(n.COLOR_BUFFER_BIT|n.DEPTH_BUFFER_BIT),!S.count)return;n.useProgram(r.program),n.bindVertexArray(a),n.bindBuffer(n.ARRAY_BUFFER,f),n.bufferData(n.ARRAY_BUFFER,A,n.DYNAMIC_DRAW);let s=r.uniforms;n.uniformMatrix4fv(s.uProjection,!1,m(y.width,y.height,y.scale,e.perspective)),n.uniform1f(s.uSize,1-e.gap),n.uniform3fv(s.uFace,_(e.faceColor)),n.uniform3fv(s.uEdge,_(e.edgeColor)),n.uniform3fv(s.uRipple,_(e.rippleColor));let c=[-.42,.55,.72],u=Math.hypot(...c);n.uniform3f(s.uLight,c[0]/u,c[1]/u,c[2]/u),n.uniform1f(s.uShading,e.shading),n.uniform1f(s.uEdgeWidth,e.edgeWidth*y.ratio),n.uniform1f(s.uStyle,l[e.edgeStyle]??0);let d=(1-e.gap)*y.scale,p=e.edgeStyle===`dotted`?Math.max(4,e.edgeWidth*4):Math.max(6,e.edgeWidth*6);n.uniform1f(s.uMarks,Math.max(1,Math.round(d/p))),n.uniform1f(s.uOpacity,e.faceOpacity),n.enable(n.DEPTH_TEST),n.enable(n.CULL_FACE),n.enable(n.BLEND),n.blendFunc(n.ONE,n.ONE_MINUS_SRC_ALPHA),e.faceOpacity>=.999?(n.depthMask(!0),n.cullFace(n.BACK),n.drawElementsInstanced(n.TRIANGLES,36,n.UNSIGNED_SHORT,0,S.count)):(n.depthMask(!1),n.cullFace(n.FRONT),n.drawElementsInstanced(n.TRIANGLES,36,n.UNSIGNED_SHORT,0,S.count),n.cullFace(n.BACK),n.drawElementsInstanced(n.TRIANGLES,36,n.UNSIGNED_SHORT,0,S.count),n.depthMask(!0))},U=e=>{let t=F.current;B(t.gridSize),P+=e,I<99&&(I+=e);let n=t.autoAnimate&&!v&&(!b.inside||P-b.moved>3),r=x.x,i=x.y,a=!1;if(b.inside&&P-b.moved<=3)[r,i]=V(b.x,b.y),a=!0;else if(n){let e=S.size*.42;r=Math.sin(P*.37)*e*Math.cos(P*.11),i=Math.sin(P*.53+1.2)*e,a=!0}!x.primed&&a&&(x.x=r,x.y=i,x.primed=!0);let o=1-Math.exp(-e*18),s=x.x,c=x.y;x.x+=(r-x.x)*o,x.y+=(i-x.y)*o;let l=1-Math.exp(-e*10);x.vx+=((x.x-s)/Math.max(e,.001)-x.vx)*l,x.vy+=((x.y-c)/Math.max(e,.001)-x.vy)*l,x.weight+=(+!!a-x.weight)*(1-Math.exp(-e*(a?6:2.5)));let f=160*t.speed*t.speed,p=2*(1-.82*t.bounce)*Math.sqrt(f),m=t.maxAngle*Math.PI/180,h=8*t.rippleSpeed,g=Math.exp(-e*3.2),_=S.size*1.5+2;for(let e=O.length-1;e>=0;e--)(P-O[e].born)*h>_&&O.splice(e,1);let y=Math.hypot(x.vx,x.vy),j=y>1e-4?-x.vy/y:0,M=y>1e-4?x.vx/y:0,N=v?0:Math.min(y,40)*t.brush*1.6,L=!1;for(let n=0;n<S.count;n++){let[r,i]=ne(n),a=r-x.x,o=i-x.y,s=Math.hypot(a,o),c=s/t.radius,l=c<1?(1-c*c)*(1-c*c)*x.weight:0,_=0,y=0;if(l>0&&s>1e-4){let e=m*l*(s/Math.hypot(s,.8));_=o/s*e,y=-a/s*e}l>0&&N>0&&(T[n]+=j*N*l*e*4,E[n]+=M*N*l*e*4),D[n]*=g;for(let t=0;t<O.length;t++){let a=O[t],o=r-a.x,s=i-a.y,c=Math.hypot(o,s),l=(P-a.born)*h;if(c>l||c<=l-h*e||c<1e-4)continue;let u=Math.exp(-c/(S.size*.8));T[n]-=s/c*13*u,E[n]+=o/c*13*u,D[n]=Math.max(D[n],u)}D[n]>.01&&(L=!0),v?(C[n]=_,w[n]=y,T[n]=0,E[n]=0):(T[n]+=(f*(_-C[n])-p*T[n])*e,E[n]+=(f*(y-w[n])-p*E[n])*e,C[n]+=T[n]*e,w[n]+=E[n]*e),(Math.abs(_-C[n])+Math.abs(y-w[n])>5e-4||Math.abs(T[n])+Math.abs(E[n])>5e-4)&&(L=!0);let b=1,F=0;if(I<99){let e=d((I-k[n]*.55)/u,0,1),t=1-(1-e)**3;b=t,F=(1-t)*(Math.PI/2),e<1&&(L=!0)}let R=[0,0,0,1];ee(C[n],w[n],R,0);let z=[Math.sin(F/2),0,0,Math.cos(F/2)],B=n*8;A[B]=r,A[B+1]=i,te(R,z,A,B+2),A[B+6]=D[n],A[B+7]=b}return I>=1.7000000000000002&&I<99&&(I=99),L||n||O.length>0||a&&y>.01||Math.abs(+!!a-x.weight)>.002},W=e=>{if(L=0,!z||document.hidden)return;let t=F.current,n=R?Math.min(.05,(e-R)/1e3):1/60;R=e;let r=!t.paused&&U(n);H(),r?L=requestAnimationFrame(W):R=0},G=()=>{!L&&z&&!document.hidden&&(L=requestAnimationFrame(W))},K=()=>{let n=F.current,r=Math.max(1,e.clientWidth),i=Math.max(1,e.clientHeight);y.ratio=Math.min(n.dpr||window.devicePixelRatio||1,2),y.width=r,y.height=i,y.scale=Math.min(r,i)/(n.gridSize+.9),t.width=Math.max(1,Math.round(r*y.ratio)),t.height=Math.max(1,Math.round(i*y.ratio)),B(n.gridSize),L||(U(0),H()),G()},q=t=>{let n=e.getBoundingClientRect();b.x=t.clientX-n.left,b.y=t.clientY-n.top,b.inside=b.x>=0&&b.y>=0&&b.x<=n.width&&b.y<=n.height,b.inside&&(b.moved=P),G()},J=()=>{b.inside=!1,G()},Y=t=>{let n=e.getBoundingClientRect();re(t.clientX-n.left,t.clientY-n.top)},X=()=>{R=0,G()},Z=new ResizeObserver(K);Z.observe(e);let Q=new IntersectionObserver(e=>{z=e.some(e=>e.isIntersecting),z&&(R=0,G())});Q.observe(e),window.addEventListener(`pointermove`,q,{passive:!0}),document.documentElement.addEventListener(`pointerleave`,J),e.addEventListener(`pointerdown`,Y),document.addEventListener(`visibilitychange`,X),K();let $=F.current.gridSize,ie=F.current.dpr;return N.current=()=>{let e=F.current;e.gridSize!==$||e.dpr!==ie?($=e.gridSize,ie=e.dpr,K()):(L||(U(0),H()),G())},()=>{cancelAnimationFrame(L),N.current=null,Z.disconnect(),Q.disconnect(),window.removeEventListener(`pointermove`,q),document.documentElement.removeEventListener(`pointerleave`,J),e.removeEventListener(`pointerdown`,Y),document.removeEventListener(`visibilitychange`,X),n.deleteBuffer(o),n.deleteBuffer(s),n.deleteBuffer(f),n.deleteVertexArray(a),n.deleteProgram(r.program)}},[]),(0,r.useEffect)(()=>{N.current?.()}),(0,i.jsx)(`div`,{ref:j,className:[`relative h-full w-full touch-pan-y overflow-hidden`,k].filter(Boolean).join(` `),...A,children:(0,i.jsx)(`canvas`,{ref:M,className:`absolute inset-0 block h-full w-full`,"aria-hidden":`true`})})};export{h as Cubes,h as default};