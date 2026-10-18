import{i as e,t}from"./react-sySUN5R7.js";import{k as n}from"./sculpture-dark-CKiqtzhU.js";var r=e(t(),1),i=n(),a=`relative h-full w-full overflow-hidden`,o=`absolute inset-0 block h-full w-full`,s=`#version 300 es
in vec2 aPosition;
out vec2 vUv;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`,c=`#version 300 es
precision highp float;
uniform vec2 uResolution;
uniform float uTime;
uniform vec3 uColor;
uniform vec2 uMouse;
uniform float uAmplitude;
uniform float uScale;
uniform float uRotation;
uniform int uDetail;
uniform float uWarp;
uniform float uHue;
uniform float uSaturation;
uniform float uBrightness;
uniform float uContrast;
uniform float uGrain;
uniform float uSeed;
uniform float uFade;
uniform float uOpacity;
uniform sampler2D uField;
uniform float uStir;
uniform vec3 uPointer;
uniform float uSheen;
uniform vec4 uSwirls[6];
in vec2 vUv;
out vec4 outColor;

vec3 hueRotate(vec3 c, float angle) {
  const vec3 k = vec3(0.57735027);
  float ca = cos(angle);
  return c * ca + cross(k, c) * sin(angle) + k * dot(k, c) * (1.0 - ca);
}

float smootherstep(float edge, float x) {
  float t = clamp(x / edge, 0.0, 1.0);
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

float hash(vec2 p) {
  p = fract(p * vec2(443.897, 441.423));
  p += dot(p, p.yx + 19.19);
  return fract((p.x + p.y) * p.x);
}

void main() {
  float mr = min(uResolution.x, uResolution.y);
  vec2 aspect = uResolution / mr;
  vec2 st = vUv - texture(uField, vUv).rg * uStir;

  for (int k = 0; k < 6; k++) {
    vec4 swirl = uSwirls[k];
    if (swirl.w == 0.0) continue;
    vec2 delta = (st - swirl.xy) * aspect;
    float angle = swirl.w * exp(-dot(delta, delta) / (swirl.z * swirl.z));
    float ca = cos(angle);
    float sa = sin(angle);
    st = swirl.xy + vec2(ca * delta.x - sa * delta.y, sa * delta.x + ca * delta.y) / aspect;
  }

  vec2 uv = (st * 2.0 - 1.0) * aspect;
  float c = cos(uRotation);
  float s = sin(uRotation);
  uv = mat2(c, -s, s, c) * uv / uScale;
  uv += (uMouse - vec2(0.5)) * uAmplitude;

  float d = -uTime * 0.5;
  float a = 0.0;
  for (int i = 0; i < 24; i++) {
    if (i >= uDetail) break;
    float fi = float(i);
    a += cos(fi - d - a * uv.x * uWarp);
    d += sin(uv.y * fi + a);
  }
  d += uTime * 0.5;
  vec3 col = vec3(cos(uv * vec2(d, a)) * 0.6 + 0.4, cos(a + d) * 0.5 + 0.5);
  col = cos(col * cos(vec3(d, a, 2.5)) * 0.5 + 0.5) * uColor;

  vec2 toPointer = (vUv - uPointer.xy) * aspect;
  col += col * uPointer.z * uSheen * 0.8 * exp(-dot(toPointer, toPointer) / 0.09);

  col = hueRotate(col, uHue);
  float luma = dot(col, vec3(0.2126, 0.7152, 0.0722));
  col = mix(vec3(luma), col, uSaturation);
  col = (col - 0.5) * uContrast + 0.5;
  col *= uBrightness;
  col += (hash(gl_FragCoord.xy + uSeed) - 0.5) * uGrain * 0.12;
  col = clamp(col, 0.0, 1.0);

  float alpha = uOpacity;
  if (uFade > 0.0) {
    vec2 px = vUv * uResolution;
    float edge = uFade * mr * 0.5;
    alpha *= smootherstep(edge, px.x) * smootherstep(edge, uResolution.x - px.x);
    alpha *= smootherstep(edge, px.y) * smootherstep(edge, uResolution.y - px.y);
  }
  outColor = vec4(col * alpha, alpha);
}`,l=48,u=6,d=3.2,f=(e,t,n)=>Math.min(n,Math.max(t,e)),p=(e,t,n)=>{let r=e.createShader(t);return r?(e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(e.deleteShader(r),null)):null},m=({color:e=[1,1,1],speed:t=1,amplitude:n=.1,mouseReact:m=!0,scale:h=1,detail:g=8,rotation:_=0,warp:v=1,hueShift:y=0,saturation:b=1,brightness:x=1.5,contrast:S=1,stir:C=.5,sheen:w=.3,clickSwirl:T=!0,grain:E=0,fade:D=0,opacity:O=1,resolution:k=1,paused:A=!1,className:j=``,style:M})=>{let N=(0,r.useRef)(null),P=(0,r.useRef)(null),F=(0,r.useRef)(null),I={colorKey:Array.isArray(e)?e.join(`,`):String(e),color:e,speed:t,amplitude:n,mouseReact:m,scale:Math.max(.05,h),detail:f(Math.round(g),1,24),rotation:_,warp:v,hueShift:y,saturation:Math.max(0,b),brightness:Math.max(0,x),contrast:Math.max(0,S),stir:Math.max(0,C),sheen:Math.max(0,w),clickSwirl:T,grain:f(E,0,1),fade:f(D,0,1),opacity:f(O,0,1),resolution:f(k,.1,2),paused:A},L=(0,r.useRef)(I);return L.current=I,(0,r.useEffect)(()=>{let e=N.current,t=P.current,n=t?.getContext(`webgl2`,{alpha:!0,premultipliedAlpha:!0,antialias:!1});if(!e||!t||!n)return;let r=p(n,n.VERTEX_SHADER,s),i=p(n,n.FRAGMENT_SHADER,c),a=n.createProgram();if(!r||!i||!a||(n.attachShader(a,r),n.attachShader(a,i),n.linkProgram(a),!n.getProgramParameter(a,n.LINK_STATUS)))return;n.useProgram(a);let o=n.createBuffer();n.bindBuffer(n.ARRAY_BUFFER,o),n.bufferData(n.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),n.STATIC_DRAW);let m=n.getAttribLocation(a,`aPosition`);n.enableVertexAttribArray(m),n.vertexAttribPointer(m,2,n.FLOAT,!1,0,0);let h={};for(let e of[`uResolution`,`uTime`,`uColor`,`uMouse`,`uAmplitude`,`uScale`,`uRotation`,`uDetail`,`uWarp`,`uHue`,`uSaturation`,`uBrightness`,`uContrast`,`uGrain`,`uSeed`,`uFade`,`uOpacity`,`uField`,`uStir`,`uPointer`,`uSheen`,`uSwirls`])h[e]=n.getUniformLocation(a,e);let g=n.createTexture();n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,g),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MAG_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE),n.uniform1i(h.uField,0);let _=document.createElement(`canvas`);_.width=1,_.height=1;let v=_.getContext(`2d`,{willReadFrequently:!0}),y=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches??!1,b={x:.5,y:.5,px:0,py:0,inside:!1,tracked:!1},x={width:1,height:1,phase:0,mouse:[.5,.5],presence:0,color:[1,1,1],colorKey:``,cols:0,rows:0,field:new Float32Array,scratch:new Float32Array,fieldActive:!1,swirls:[],seed:0},S=new Float32Array(24),C=0,w=0,T=!0,E=!0,D=e=>{if(e.colorKey===x.colorKey)return;if(x.colorKey=e.colorKey,Array.isArray(e.color)){let t=e.color;x.color=[0,1,2].map(e=>f(Number(t[e]??1),0,1));return}if(!v)return;v.clearRect(0,0,1,1),v.fillStyle=`#ffffff`,v.fillStyle=String(e.color),v.fillRect(0,0,1,1);let[t,n,r]=v.getImageData(0,0,1,1).data;x.color=[t/255,n/255,r/255]},O=()=>{let e=l,t=f(Math.round(e*x.height/x.width),6,96);(e!==x.cols||t!==x.rows)&&(x.cols=e,x.rows=t,x.field=new Float32Array(e*t*2),x.scratch=new Float32Array(e*t*2),n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,g),n.texImage2D(n.TEXTURE_2D,0,n.RG16F,e,t,0,n.RG,n.FLOAT,x.field))},k=(e,t,n,r)=>{let{cols:i,rows:a,field:o}=x,s=.22,c=x.width/x.height,l=Math.max(0,Math.floor((e-s/c)*i)),u=Math.min(i-1,Math.ceil((e+s/c)*i)),d=Math.max(0,Math.floor((t-s)*a)),f=Math.min(a-1,Math.ceil((t+s)*a));for(let p=d;p<=f;p++)for(let d=l;d<=u;d++){let l=((d+.5)/i-e)*c,u=(p+.5)/a-t,f=1-(l*l+u*u)/(s*s);if(f<=0)continue;let m=(p*i+d)*2,h=o[m]+n*f*f*3.2,g=o[m+1]+r*f*f*3.2,_=Math.hypot(h,g),v=.4,y=_>0?v*Math.tanh(_/v)/_:0;o[m]=h*y,o[m+1]=g*y}x.fieldActive=!0},A=e=>{let{cols:t,rows:n,field:r,scratch:i}=x,a=Math.exp(-e*1.4),o=0;for(let e=0;e<n;e++)for(let s=0;s<t;s++){let c=(e*t+s)*2,l=(e*t+Math.max(0,s-1))*2,u=(e*t+Math.min(t-1,s+1))*2,d=(Math.max(0,e-1)*t+s)*2,f=(Math.min(n-1,e+1)*t+s)*2;for(let e=0;e<2;e++){let t=(r[c+e]*12+r[l+e]+r[u+e]+r[d+e]+r[f+e])/16;i[c+e]=t*a,o=Math.max(o,Math.abs(i[c+e]))}}r.set(i),o<4e-4&&(r.fill(0),x.fieldActive=!1)},j=()=>{let e=L.current;D(e),O(),n.viewport(0,0,t.width,t.height),n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,g),n.texSubImage2D(n.TEXTURE_2D,0,0,0,x.cols,x.rows,n.RG,n.FLOAT,x.field),S.fill(0),x.swirls.forEach((e,t)=>{let n=.21*(1+.4*e.age),r=Math.exp(-e.age*1.35)-Math.exp(-e.age*10),i=Math.min(1,(d-e.age)/.8);S.set([e.x,e.y,n,3*r*i*(.21/n)**2],t*4)}),n.uniform2f(h.uResolution,x.width,x.height),n.uniform1f(h.uTime,x.phase),n.uniform3f(h.uColor,x.color[0],x.color[1],x.color[2]),n.uniform2f(h.uMouse,x.mouse[0],x.mouse[1]),n.uniform1f(h.uAmplitude,e.amplitude),n.uniform1f(h.uScale,e.scale),n.uniform1f(h.uRotation,e.rotation*Math.PI/180),n.uniform1i(h.uDetail,e.detail),n.uniform1f(h.uWarp,e.warp),n.uniform1f(h.uHue,e.hueShift*Math.PI/180),n.uniform1f(h.uSaturation,e.saturation),n.uniform1f(h.uBrightness,e.brightness),n.uniform1f(h.uContrast,e.contrast),n.uniform1f(h.uGrain,e.grain),n.uniform1f(h.uSeed,x.seed),n.uniform1f(h.uFade,e.fade),n.uniform1f(h.uOpacity,e.opacity),n.uniform1f(h.uStir,e.mouseReact?e.stir:0),n.uniform3f(h.uPointer,b.x,b.y,e.mouseReact?x.presence:0),n.uniform1f(h.uSheen,e.sheen),n.uniform4fv(h.uSwirls,S),n.clearColor(0,0,0,0),n.clear(n.COLOR_BUFFER_BIT),n.drawArrays(n.TRIANGLES,0,3)},M=e=>{if(C=0,!E||!T)return;let t=L.current,n=w?Math.min(.05,(e-w)/1e3):1/60;w=e;let r=!t.paused&&!y;r&&(x.phase+=n*t.speed);let i=t.mouseReact&&b.tracked?[b.x,b.y]:[.5,.5],a=1-Math.exp(-n*5);x.mouse[0]+=(i[0]-x.mouse[0])*a,x.mouse[1]+=(i[1]-x.mouse[1])*a,x.presence+=(+!!b.inside-x.presence)*(1-Math.exp(-n*4)),x.fieldActive&&A(n),x.swirls=x.swirls.filter(e=>(e.age+=n)<d),t.grain>0&&r&&(x.seed=Math.floor(e/42)%997),j();let o=Math.abs(i[0]-x.mouse[0])>5e-4||Math.abs(i[1]-x.mouse[1])>5e-4||Math.abs(+!!b.inside-x.presence)>.002;r||o||x.fieldActive||x.swirls.length?C=requestAnimationFrame(M):w=0},I=()=>{!C&&E&&T&&(C=requestAnimationFrame(M))},R=t=>{let n=e.getBoundingClientRect();return{x:(t.clientX-n.left)/Math.max(1,n.width),y:1-(t.clientY-n.top)/Math.max(1,n.height)}},z=e=>{let t=L.current,{x:n,y:r}=R(e),i=n>=0&&n<=1&&r>=0&&r<=1;i&&t.mouseReact&&!y&&b.inside&&t.stir>0&&k(n,r,n-b.x,r-b.y),b.x=n,b.y=r,b.inside=i,i&&(b.tracked=!0),I()},B=()=>{b.inside=!1,I()},V=e=>{if(!L.current.clickSwirl||y)return;let{x:t,y:n}=R(e);if(!(t<0||t>1||n<0||n>1)){if(x.swirls.length>=u){if(x.swirls[0].age<2.8000000000000003)return;x.swirls.shift()}x.swirls.push({x:t,y:n,age:0}),I()}},H=()=>{let n=L.current,r=Math.min(window.devicePixelRatio||1,2)*n.resolution;x.width=Math.max(1,e.clientWidth),x.height=Math.max(1,e.clientHeight),t.width=Math.max(1,Math.round(x.width*r)),t.height=Math.max(1,Math.round(x.height*r)),j(),I()};F.current=()=>{let e=Math.min(window.devicePixelRatio||1,2)*L.current.resolution;t.width===Math.max(1,Math.round(x.width*e))?C||j():H(),I()};let U=new ResizeObserver(H);U.observe(e);let W=new IntersectionObserver(e=>{T=e.some(e=>e.isIntersecting),T&&(w=0,I())});return W.observe(e),window.addEventListener(`pointermove`,z,{passive:!0}),window.addEventListener(`pointerdown`,V,{passive:!0}),document.documentElement.addEventListener(`pointerleave`,B),H(),()=>{E=!1,cancelAnimationFrame(C),F.current=null,U.disconnect(),W.disconnect(),window.removeEventListener(`pointermove`,z),window.removeEventListener(`pointerdown`,V),document.documentElement.removeEventListener(`pointerleave`,B),n.deleteTexture(g),n.deleteBuffer(o),n.deleteProgram(a),n.deleteShader(r),n.deleteShader(i)}},[]),(0,r.useEffect)(()=>{F.current?.()}),(0,i.jsx)(`div`,{ref:N,className:`${a}${j?` ${j}`:``}`,style:M,children:(0,i.jsx)(`canvas`,{ref:P,className:o,"aria-hidden":`true`})})};export{m as default};