import{i as e,t}from"./react-sySUN5R7.js";import{k as n}from"./sculpture-dark-CKiqtzhU.js";var r=e(t(),1),i=n(),a=24e5,o=4,s=8,c=90,l=`#version 300 es
const vec2 corners[3] = vec2[3](vec2(-1.0, -1.0), vec2(3.0, -1.0), vec2(-1.0, 3.0));
void main() {
  gl_Position = vec4(corners[gl_VertexID], 0.0, 1.0);
}`,u=`#version 300 es
precision highp float;
uniform sampler2D uPrev;
uniform vec2 uSize;
uniform vec2 uCss;
uniform vec2 uFrom;
uniform vec2 uTo;
uniform vec2 uPush;
uniform float uRadius;
uniform float uDecay;
out vec4 fragColor;

void main() {
  vec2 cell = gl_FragCoord.xy / uSize;
  vec2 p = vec2(cell.x, 1.0 - cell.y) * uCss;
  vec2 seg = uTo - uFrom;
  float len2 = max(dot(seg, seg), 1e-6);
  float h = clamp(dot(p - uFrom, seg) / len2, 0.0, 1.0);
  vec2 gap = p - uFrom - seg * h;
  vec2 delta = uPush * exp(-dot(gap, gap) / (uRadius * uRadius));
  vec2 src = p - delta;
  vec2 prev = texture(uPrev, vec2(src.x / uCss.x, 1.0 - src.y / uCss.y)).xy;
  fragColor = vec4((prev + delta) * uDecay, 0.0, 1.0);
}`,d=`#version 300 es
precision highp float;
uniform vec2 uCss;
uniform vec2 uCanvas;
uniform float uBlock;
uniform float uFlow;
uniform float uSpin;
uniform vec2 uOffset;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform float uContrast;
uniform float uLighting;
uniform float uSwirl;
uniform float uScale;
uniform int uDetail;
uniform sampler2D uField;
uniform float uFieldOn;
uniform vec4 uTwirls[${o}];
uniform float uReveal;
uniform float uLight;
uniform float uOpacity;
out vec4 fragColor;

vec3 paint(vec2 screenSize, vec2 coords) {
  vec2 uv = (coords - 0.5 * screenSize) / length(screenSize) - uOffset;
  float radius = length(uv);
  float speed = uSpin + 302.2;
  float angle = atan(uv.y, uv.x) + speed - 20.0 * (uSwirl * radius + (1.0 - uSwirl));
  vec2 mid = (screenSize / length(screenSize)) / 2.0;
  uv = vec2(radius * cos(angle) + mid.x, radius * sin(angle) + mid.y) - mid;

  uv *= 30.0 / uScale;
  speed = uFlow;
  vec2 uv2 = vec2(uv.x + uv.y);
  for (int i = 0; i < 8; i++) {
    if (i >= uDetail) break;
    uv2 += sin(max(uv.x, uv.y)) + uv;
    uv += 0.5 * vec2(cos(5.1123314 + 0.353 * uv2.y + speed * 0.131121), sin(uv2.x - 0.113 * speed));
    uv -= cos(uv.x + uv.y) - sin(uv.x * 0.711 - uv.y);
  }

  float contrastMod = 0.25 * uContrast + 0.5 * uSwirl + 1.2;
  float amount = min(2.0, max(0.0, length(uv) * 0.035 * contrastMod));
  float c1 = max(0.0, 1.0 - contrastMod * abs(1.0 - amount));
  float c2 = max(0.0, 1.0 - contrastMod * abs(amount));
  float c3 = 1.0 - min(1.0, c1 + c2);
  float light = (uLighting - 0.2) * max(c1 * 5.0 - 4.0, 0.0) + uLighting * max(c2 * 5.0 - 4.0, 0.0);
  vec3 gap = uLight > 0.5 ? mix(uColor3, vec3(1.0), 0.9) : uColor3;
  float base = 0.3 / uContrast;
  vec3 color = base * uColor1 + (1.0 - base) * (uColor1 * c1 + uColor2 * c2 + gap * c3) + light;
  return mix(gap, color, uReveal);
}

void main() {
  vec2 cell = floor(gl_FragCoord.xy) + 0.5;
  vec2 p = vec2(cell.x, uCanvas.y - cell.y) * uBlock;
  if (uFieldOn > 0.5) {
    p -= texture(uField, vec2(p.x / uCss.x, 1.0 - p.y / uCss.y)).xy;
  }
  for (int i = 0; i < ${o}; i++) {
    vec4 twirl = uTwirls[i];
    if (twirl.w <= 0.0) continue;
    vec2 rel = p - twirl.xy;
    float turn = twirl.z * exp(-dot(rel, rel) / (twirl.w * twirl.w));
    float c = cos(turn);
    float s = sin(turn);
    p = twirl.xy + vec2(c * rel.x - s * rel.y, s * rel.x + c * rel.y);
  }
  vec3 color = paint(uCss, vec2(p.x, uCss.y - p.y));
  float grain = (fract(52.9829189 * fract(dot(cell, vec2(0.06711056, 0.00583715)))) - 0.5) / 255.0;
  color = clamp(color + grain, 0.0, 1.0);
  fragColor = vec4(color * uOpacity, uOpacity);
}`,f=`#version 300 es
precision highp float;
uniform sampler2D uPaint;
uniform vec2 uCanvas;
uniform vec2 uSource;
uniform float uDevice;
uniform float uCrt;
out vec4 fragColor;

float smoother(float edge0, float edge1, float x) {
  float t = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

void main() {
  vec2 device = vec2(gl_FragCoord.x, uCanvas.y - gl_FragCoord.y);
  vec2 cell = floor(device / uDevice);
  vec4 texel = texture(uPaint, vec2((cell.x + 0.5) / uSource.x, 1.0 - (cell.y + 0.5) / uSource.y));
  vec3 color = texel.rgb;
  float glow = dot(color, vec3(0.2126, 0.7152, 0.0722));
  float period = max(uDevice, 3.0);
  float row = fract(device.y / period);
  float line = smoother(0.5, 0.92, row) * (1.0 - smoother(0.92, 1.0, row));
  color *= 1.0 - uCrt * 0.34 * line * (1.0 - 0.7 * glow);
  vec2 screen = gl_FragCoord.xy / uCanvas;
  float edge = smoother(0.0, 0.18, screen.x) * smoother(0.0, 0.18, 1.0 - screen.x);
  edge *= smoother(0.0, 0.24, screen.y) * smoother(0.0, 0.24, 1.0 - screen.y);
  color *= mix(1.0, 0.78 + 0.22 * edge, uCrt);
  color *= 1.0 + uCrt * 0.1;
  fragColor = vec4(min(color, vec3(texel.a)), texel.a);
}`,p=(e,t,n)=>Math.min(n,Math.max(t,e)),m=e=>{let t=String(e||``).trim(),n=/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(t);if(n){let e=n[1].length===3?n[1].replace(/./g,e=>e+e):n[1];return[0,2,4].map(t=>parseInt(e.slice(t,t+2),16)/255)}let r=/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i.exec(t);return r?[r[1],r[2],r[3]].map(e=>p(parseFloat(e)/255,0,1)):null},h=(e,t,n)=>{let r=e.createShader(t);return r?(e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(console.error(e.getShaderInfoLog(r)),e.deleteShader(r),null)):null},g=(e,t)=>{let n=h(e,e.VERTEX_SHADER,l),r=h(e,e.FRAGMENT_SHADER,t),i=n&&r?e.createProgram():null;if(!n||!r||!i)return n&&e.deleteShader(n),r&&e.deleteShader(r),null;if(e.attachShader(i,n),e.attachShader(i,r),e.linkProgram(i),e.deleteShader(n),e.deleteShader(r),!e.getProgramParameter(i,e.LINK_STATUS))return console.error(e.getProgramInfoLog(i)),e.deleteProgram(i),null;let a={},o=e.getProgramParameter(i,e.ACTIVE_UNIFORMS);for(let t=0;t<o;t++){let n=e.getActiveUniform(i,t);n&&(a[n.name.replace(/\[0\]$/,``)]=e.getUniformLocation(i,n.name))}return{program:i,uniforms:a}},_=e=>{let t=p(e,0,1);return t*t*t*(t*(t*6-15)+10)},v=({color1:e=`#DE443B`,color2:t=`#006BB4`,color3:n=`#162325`,contrast:l=3.5,lighting:h=.4,swirl:v=.25,speed:y=1,rotationSpeed:b=0,scale:x=1,detail:S=5,offset:C=[0,0],pixelSize:w=1.5,crt:T=0,mouseInteraction:E=!0,mouseStrength:D=1,clickSwirl:O=!0,intro:k=!0,lightMode:A=!1,opacity:j=1,maxDevicePixelRatio:M=2,className:N=``,style:P})=>{let F=(0,r.useRef)(null),I=(0,r.useRef)(null),L=(0,r.useRef)(null),[R,z]=(0,r.useState)(0),B={color1:m(e)||[.871,.267,.231],color2:m(t)||[0,.42,.706],color3:m(n)||[.086,.137,.145],contrast:p(l,.5,10),lighting:p(h,0,1.5),swirl:p(v,0,1),speed:Math.max(0,y),rotation:p(b,-10,10),scale:p(x,.2,5),detail:p(Math.round(S),1,8),offset:Array.isArray(C)?[Number(C[0])||0,Number(C[1])||0]:[0,0],pixelSize:p(w,0,24),crt:p(T,0,1),mouse:E,strength:p(D,0,3),clickSwirl:O,intro:k,light:A,opacity:p(j,0,1),maxRatio:p(M,.5,3)},V=(0,r.useRef)(B);return V.current=B,(0,r.useEffect)(()=>{L.current?.()}),(0,r.useEffect)(()=>{let e=F.current,t=I.current;if(!e||!t)return;let n=t.getContext(`webgl2`,{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1,powerPreference:`high-performance`}),r=n?g(n,d):null,i=n?g(n,f):null;if(!n||!r||!i)return;let l=n.getExtension(`EXT_color_buffer_float`)||n.getExtension(`EXT_color_buffer_half_float`)?g(n,u):null,m=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,h=n.createVertexArray(),v={cssWidth:1,cssHeight:1,block:1,device:1,width:1,height:1,crt:!1},y={texture:n.createTexture(),framebuffer:n.createFramebuffer(),width:0,height:0},b={width:0,height:0,targets:[],energy:0},x={x:0,y:0,lastX:0,lastY:0,vx:0,inside:!1,ready:!1},S={value:0},C=[],w=new Float32Array(16),T=14,E=0,D=V.current.intro&&!m&&R===0?0:1,O=0,k=0,A=!0,j=document.visibilityState!==`hidden`,M=!1,N=(e,t)=>{let r=n.createTexture();n.bindTexture(n.TEXTURE_2D,r),n.texImage2D(n.TEXTURE_2D,0,n.RG16F,e,t,0,n.RG,n.HALF_FLOAT,null),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MAG_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE);let i=n.createFramebuffer();return n.bindFramebuffer(n.FRAMEBUFFER,i),n.framebufferTexture2D(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,r,0),n.clearColor(0,0,0,0),n.clear(n.COLOR_BUFFER_BIT),n.bindFramebuffer(n.FRAMEBUFFER,null),{texture:r,framebuffer:i}},P=()=>{b.targets.forEach(e=>{n.deleteTexture(e.texture),n.deleteFramebuffer(e.framebuffer)}),b.targets=[],b.width=0,b.height=0,b.energy=0},B=()=>{let r=V.current,i=e.getBoundingClientRect(),o=Math.max(1,i.width),c=Math.max(1,i.height),u=Math.min(window.devicePixelRatio||1,r.maxRatio),d=Math.ceil(Math.sqrt(o*c*u*u/a)-.05),f=Math.max(r.pixelSize>0?Math.round(r.pixelSize*u):1,d,1),m=Math.max(1,Math.ceil(o*u/f)),h=Math.max(1,Math.ceil(c*u/f)),g=r.crt>0,_=g?m*f:m,x=g?h*f:h;if((t.width!==_||t.height!==x)&&(t.width=_,t.height=x),t.style.width=`${m*f/u}px`,t.style.height=`${h*f/u}px`,t.style.imageRendering=!g&&r.pixelSize>0&&f>=2?`pixelated`:`auto`,g&&(y.width!==m||y.height!==h)&&(n.bindTexture(n.TEXTURE_2D,y.texture),n.texImage2D(n.TEXTURE_2D,0,n.RGBA8,m,h,0,n.RGBA,n.UNSIGNED_BYTE,null),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MAG_FILTER,n.NEAREST),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE),n.bindFramebuffer(n.FRAMEBUFFER,y.framebuffer),n.framebufferTexture2D(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,y.texture,0),n.bindFramebuffer(n.FRAMEBUFFER,null),y.width=m,y.height=h),v.cssWidth=o,v.cssHeight=c,v.block=f/u,v.device=f,v.width=m,v.height=h,v.crt=g,!l)return;let S=p(Math.ceil(o/s),8,320),C=p(Math.ceil(c/s),8,320);(S!==b.width||C!==b.height)&&(P(),b.width=S,b.height=C,b.targets=[N(S,C),N(S,C)])},ee=(e,t,r,i,a,o,s)=>{if(!l)return;let[u,d]=b.targets;n.bindFramebuffer(n.FRAMEBUFFER,d.framebuffer),n.viewport(0,0,b.width,b.height),n.useProgram(l.program),n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,u.texture);let f=l.uniforms;n.uniform1i(f.uPrev,0),n.uniform2f(f.uSize,b.width,b.height),n.uniform2f(f.uCss,v.cssWidth,v.cssHeight),n.uniform2f(f.uFrom,e,t),n.uniform2f(f.uTo,r,i),n.uniform2f(f.uPush,a,o),n.uniform1f(f.uRadius,c),n.uniform1f(f.uDecay,s),n.drawArrays(n.TRIANGLES,0,3),b.targets=[d,u]},H=e=>{if(O=0,M)return;let a=V.current,o=p((e-k)/1e3||0,0,.05);k=Math.max(k,e);let s=m?.2:1;T+=o*a.speed*7*s,E+=o*a.rotation*.2*s,D<1&&(D=Math.min(1,D+o/2.2));let u=a.mouse&&x.inside,d=u?(x.x/v.cssWidth-.5)*.35*a.strength:0;if(S.value+=(d-S.value)*(1-Math.exp(-o/.8)),n.bindVertexArray(h),l&&b.targets.length){let e=x.x-x.lastX,t=x.y-x.lastY,r=u&&x.ready&&(e!==0||t!==0),i=Math.exp(-o/1.6);if(r||b.energy>.05){let o=.85*a.strength*(m?.4:1),s=r?Math.hypot(e,t)*o:0,l=Math.max(1,Math.ceil(s/(c*.3)));for(let n=0;n<l;n++){let a=n/l,s=(n+1)/l;ee(x.lastX+e*a,x.lastY+t*a,x.lastX+e*s,x.lastY+t*s,r?e*(s-a)*o:0,r?t*(s-a)*o:0,n===l-1?i:1)}b.energy=b.energy*i+s,b.energy<=.05&&b.targets.forEach(e=>{n.bindFramebuffer(n.FRAMEBUFFER,e.framebuffer),n.clearColor(0,0,0,0),n.clear(n.COLOR_BUFFER_BIT)})}}x.lastX=x.x,x.lastY=x.y;for(let e=C.length-1;e>=0;e--)C[e].age+=o,C[e].age>=3.2&&C.splice(e,1);w.fill(0),C.forEach((e,t)=>{let n=e.age,r=_(n/.25),i=1-_((n-.25)/2.95);w[t*4]=e.x,w[t*4+1]=e.y,w[t*4+2]=e.direction*1.9*r*i,w[t*4+3]=150*(1+.6*_(n/3.2))});let f=1-(1-(1-D)**3);n.bindFramebuffer(n.FRAMEBUFFER,v.crt?y.framebuffer:null),n.viewport(0,0,v.width,v.height),n.useProgram(r.program);let g=r.uniforms;if(n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,b.targets.length?b.targets[0].texture:null),n.uniform1i(g.uField,0),n.uniform1f(g.uFieldOn,b.targets.length&&b.energy>.05?1:0),n.uniform2f(g.uCss,v.cssWidth,v.cssHeight),n.uniform2f(g.uCanvas,v.width,v.height),n.uniform1f(g.uBlock,v.block),n.uniform1f(g.uFlow,T),n.uniform1f(g.uSpin,-.4+E+S.value+2.6*f*f),n.uniform2f(g.uOffset,a.offset[0],a.offset[1]),n.uniform3f(g.uColor1,a.color1[0],a.color1[1],a.color1[2]),n.uniform3f(g.uColor2,a.color2[0],a.color2[1],a.color2[2]),n.uniform3f(g.uColor3,a.color3[0],a.color3[1],a.color3[2]),n.uniform1f(g.uContrast,a.contrast),n.uniform1f(g.uLighting,a.lighting),n.uniform1f(g.uSwirl,Math.min(1,a.swirl+.55*f)),n.uniform1f(g.uScale,a.scale),n.uniform1i(g.uDetail,a.detail),n.uniform4fv(g.uTwirls,w),n.uniform1f(g.uReveal,_(D/.45)),n.uniform1f(g.uLight,+!!a.light),n.uniform1f(g.uOpacity,a.opacity),n.drawArrays(n.TRIANGLES,0,3),v.crt){n.bindFramebuffer(n.FRAMEBUFFER,null),n.viewport(0,0,t.width,t.height),n.useProgram(i.program);let e=i.uniforms;n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,y.texture),n.uniform1i(e.uPaint,0),n.uniform2f(e.uCanvas,t.width,t.height),n.uniform2f(e.uSource,v.width,v.height),n.uniform1f(e.uDevice,v.device),n.uniform1f(e.uCrt,a.crt),n.drawArrays(n.TRIANGLES,0,3)}let N=Math.abs(d-S.value)>5e-4||b.energy>.05||C.length>0;(a.speed>0||a.rotation!==0||D<1||N)&&A&&j&&(O=requestAnimationFrame(H))},U=()=>{!O&&!M&&A&&j&&(k=performance.now(),O=requestAnimationFrame(H))};L.current=()=>{B(),U()};let W=t=>{let n=e.getBoundingClientRect();return{x:t.clientX-n.left,y:t.clientY-n.top,inside:t.clientX>=n.left&&t.clientX<=n.right&&t.clientY>=n.top&&t.clientY<=n.bottom}},G=e=>{let t=W(e);(!x.ready||!x.inside)&&(x.lastX=t.x,x.lastY=t.y),x.vx=t.x-x.x,x.x=t.x,x.y=t.y,x.inside=t.inside,x.ready=!0,U()},K=e=>{let t=V.current,n=W(e);n.inside&&t.clickSwirl&&!m&&(C.push({x:n.x,y:n.y,age:0,direction:x.vx<0?1:-1}),C.length>o&&C.shift(),U())},q=()=>{x.inside=!1,U()},J=e=>{e.pointerType!==`mouse`&&q()};window.addEventListener(`pointermove`,G,{passive:!0}),window.addEventListener(`pointerdown`,K,{passive:!0}),window.addEventListener(`pointerup`,J,{passive:!0}),window.addEventListener(`pointercancel`,J,{passive:!0}),document.documentElement.addEventListener(`pointerleave`,q);let Y=e=>{e.preventDefault(),M=!0,cancelAnimationFrame(O),O=0},X=()=>z(e=>e+1);t.addEventListener(`webglcontextlost`,Y),t.addEventListener(`webglcontextrestored`,X);let Z=new ResizeObserver(()=>{B(),U()});Z.observe(e);let Q=new IntersectionObserver(e=>{A=e.some(e=>e.isIntersecting),U()});Q.observe(e);let $=()=>{j=document.visibilityState!==`hidden`,U()};return document.addEventListener(`visibilitychange`,$),B(),U(),()=>{cancelAnimationFrame(O),L.current=null,Z.disconnect(),Q.disconnect(),window.removeEventListener(`pointermove`,G),window.removeEventListener(`pointerdown`,K),window.removeEventListener(`pointerup`,J),window.removeEventListener(`pointercancel`,J),document.documentElement.removeEventListener(`pointerleave`,q),document.removeEventListener(`visibilitychange`,$),t.removeEventListener(`webglcontextlost`,Y),t.removeEventListener(`webglcontextrestored`,X),n.isContextLost()||(P(),n.deleteTexture(y.texture),n.deleteFramebuffer(y.framebuffer),n.deleteVertexArray(h),n.deleteProgram(r.program),n.deleteProgram(i.program),l&&n.deleteProgram(l.program))}},[R]),(0,i.jsx)(`div`,{ref:F,className:`relative h-full w-full overflow-hidden ${N}`.trim(),style:P,children:(0,i.jsx)(`canvas`,{ref:I,className:`absolute inset-0 block h-full w-full`,"aria-hidden":`true`})})};export{v as default};