import{i as e,t}from"./react-sySUN5R7.js";import{k as n}from"./sculpture-dark-CKiqtzhU.js";var r=e(t(),1),i=n(),a=1.1,o=3.2,s=`#version 300 es
in vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`,c=`#version 300 es
precision highp float;
uniform vec2 uResolution;
uniform float uTime;
uniform float uRotation;
uniform vec2 uReach;
uniform float uNear;
uniform float uAwake;
uniform vec3 uBackground;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform float uScale;
uniform float uWobble;
uniform float uGlow;
uniform float uBleed;
uniform float uHighlight;
uniform float uSwirl;
uniform float uOrbit;
uniform vec2 uEcho;
uniform float uReveal;
uniform float uOpacity;
uniform float uTrail;
uniform vec2 uTilt;
out vec4 outColor;

vec3 hash33(vec3 p3) {
  p3 = fract(p3 * vec3(0.1031, 0.11369, 0.13787));
  p3 += dot(p3, p3.yxz + 19.19);
  return -1.0 + 2.0 * fract(vec3(p3.x + p3.y, p3.x + p3.z, p3.y + p3.z) * p3.zyx);
}

float snoise3(vec3 p) {
  const float K1 = 0.333333333;
  const float K2 = 0.166666667;
  vec3 i = floor(p + (p.x + p.y + p.z) * K1);
  vec3 d0 = p - (i - (i.x + i.y + i.z) * K2);
  vec3 e = step(vec3(0.0), d0 - d0.yzx);
  vec3 i1 = e * (1.0 - e.zxy);
  vec3 i2 = 1.0 - e.zxy * (1.0 - e);
  vec3 d1 = d0 - (i1 - K2);
  vec3 d2 = d0 - (i2 - K1);
  vec3 d3 = d0 - 0.5;
  vec4 h = max(0.6 - vec4(dot(d0, d0), dot(d1, d1), dot(d2, d2), dot(d3, d3)), 0.0);
  vec4 n = h * h * h * h * vec4(dot(d0, hash33(i)), dot(d1, hash33(i + i1)), dot(d2, hash33(i + i2)), dot(d3, hash33(i + 1.0)));
  return dot(vec4(31.316), n);
}

float light1(float intensity, float attenuation, float dist) {
  return intensity / (1.0 + dist * attenuation);
}

float light2(float intensity, float attenuation, float dist) {
  return intensity / (1.0 + dist * dist * attenuation);
}

vec4 draw(vec2 uv) {
  float rawLen = length(uv);
  vec2 dir = rawLen > 0.0001 ? uv / rawLen : vec2(1.0, 0.0);
  float reachAmount = length(uReach);
  vec2 reachDir = reachAmount > 0.00001 ? uReach / reachAmount : vec2(1.0, 0.0);
  float facing = exp((dot(dir, reachDir) - 1.0) * 3.2);
  float len = max(rawLen - reachAmount * facing * smoothstep(0.25, 0.65, rawLen), 0.0);
  uv = dir * len;
  float ang = atan(dir.y, dir.x);
  float invLen = len > 0.0 ? 1.0 / len : 0.0;
  float near = facing * uNear;
  float bgLuminance = dot(uBackground, vec3(0.299, 0.587, 0.114));

  float n0 = snoise3(vec3(uv * 0.65, uTime * 0.5)) * 0.5 + 0.5;
  float r0 = mix(0.8 - 0.04 * uWobble, 0.8 + 0.04 * uWobble, n0);
  float d0 = distance(uv, (r0 * invLen) * uv);
  float v0 = light1(1.0, 10.0 / uGlow, d0);
  v0 *= smoothstep(r0 * 1.05, r0, len);
  float reach = max(uBleed, 0.04);
  float innerFade = smoothstep(r0 * (1.0 - 0.2 * reach), r0 * (1.0 - 0.05 * reach), len);
  v0 *= mix(innerFade, 1.0, bgLuminance * 0.7 * min(uBleed, 1.0));
  float body = smoothstep(0.8 - 0.2 * reach, 0.8, len);
  float cl = cos(ang + uSwirl) * 0.5 + 0.5;

  vec2 pos = vec2(cos(uOrbit), sin(uOrbit)) * r0;
  float d = distance(uv, pos);
  vec2 head = vec2(cos(uOrbit), sin(uOrbit));
  float lag = atan(head.x * dir.y - head.y * dir.x, dot(dir, head));
  float trail = uTrail > 0.0 ? smoothstep(0.0, 0.35, lag) * exp(-max(lag, 0.0) * 2.6 / uTrail) : 0.0;
  float v1 = (light2(1.5, 5.0, d) + trail * 0.6) * uHighlight;
  v1 *= light1(1.0, 50.0, d0);
  float band = v0 * smoothstep(1.0, mix(0.6, 1.0, n0 * 0.5), len) * body;
  float heat = pow(clamp(band / 0.82, 0.0, 1.0), 3.0);
  float bloom = light2(1.0, 160.0 / uGlow, max(len - r0, 0.0)) * smoothstep(0.4, 0.0, len - r0) * step(r0, len);

  float v2 = smoothstep(1.0, mix(0.6, 1.0, n0 * 0.5), len);
  float v3 = body;

  vec3 colBase = mix(uColor1, uColor2, cl);
  float fadeAmount = mix(1.0, 0.1, bgLuminance);

  float echoD = abs(len - r0 - uEcho.x);
  float echo = light1(1.0, 60.0, echoD) * smoothstep(0.12, 0.0, echoD) * uEcho.y;

  vec3 darkCol = mix(uColor3, colBase, v0);
  darkCol = (darkCol + v1) * v2 * v3 * (1.0 + uAwake + near * 0.35) + mix(colBase, vec3(1.0), 0.25) * heat * (0.28 + near * 0.3);
  darkCol = clamp(darkCol + colBase * (bloom * 0.1 + echo), 0.0, 1.0);

  vec3 lightCol = (colBase + v1) * mix(1.0, v2 * v3, fadeAmount);
  lightCol = mix(uBackground, lightCol, clamp(v0 + echo, 0.0, 1.0));
  lightCol = mix(lightCol, colBase, clamp(v0, 0.0, 1.0) * clamp(near * 0.4 + uAwake, 0.0, 0.6));
  lightCol = clamp(mix(lightCol, vec3(1.0), clamp(v1 * 0.35, 0.0, 0.6)), 0.0, 1.0);

  vec3 finalCol = mix(darkCol, lightCol, bgLuminance);
  float alpha = max(max(finalCol.r, finalCol.g), finalCol.b);
  return vec4(finalCol / (alpha + 1e-5), alpha);
}

vec2 toPlane(vec2 p, out float hit) {
  float cx = cos(uTilt.x);
  float sx = sin(uTilt.x);
  float cy = cos(uTilt.y);
  float sy = sin(uTilt.y);
  vec3 ex = vec3(cy, 0.0, -sy);
  vec3 ey = vec3(sy * sx, cx, cy * sx);
  vec3 normal = vec3(sy * cx, -sx, cy * cx);
  vec3 origin = vec3(0.0, 0.0, ${o.toFixed(1)});
  vec3 ray = vec3(p, -${o.toFixed(1)});
  float denom = dot(normal, ray);
  float t = -dot(normal, origin) / (abs(denom) > 0.00001 ? denom : -0.00001);
  hit = t > 0.0 ? 1.0 : 0.0;
  vec3 q = origin + ray * t;
  return vec2(dot(q, ex), dot(q, ey));
}

void main() {
  vec2 uv = (gl_FragCoord.xy - uResolution * 0.5) / min(uResolution.x, uResolution.y) * 2.0;
  uv *= uScale;
  float hit = 1.0;
  if (abs(uTilt.x) + abs(uTilt.y) > 0.0001) uv = toPlane(uv, hit);

  float s = sin(uRotation);
  float c = cos(uRotation);
  uv = vec2(c * uv.x - s * uv.y, s * uv.x + c * uv.y);

  vec4 col = draw(uv);
  float dither = (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) / 255.0;
  float alpha = clamp(col.a * hit * uReveal * uOpacity + dither, 0.0, 1.0);
  outColor = vec4(col.rgb * alpha * alpha, alpha);
}`,l=(e,t,n)=>Math.min(n,Math.max(t,e)),u=(e,t,n)=>{let r=e.createShader(t);return r?(e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(e.deleteShader(r),null)):null},d=e=>{let t=u(e,e.VERTEX_SHADER,s),n=u(e,e.FRAGMENT_SHADER,c),r=e.createProgram();if(!t||!n||!r)return null;if(e.attachShader(r,t),e.attachShader(r,n),e.bindAttribLocation(r,0,`aPosition`),e.linkProgram(r),e.deleteShader(t),e.deleteShader(n),!e.getProgramParameter(r,e.LINK_STATUS))return e.deleteProgram(r),null;let i={},a=e.getProgramParameter(r,e.ACTIVE_UNIFORMS);for(let t=0;t<a;t++){let n=e.getActiveUniform(r,t);n&&(i[n.name]=e.getUniformLocation(r,n.name))}return{program:r,uniforms:i}},f=({colors:e=[`#9c43fe`,`#4cc2e9`,`#101499`],hue:t=0,backgroundColor:n=`#000000`,size:s=1,glow:c=1,bleed:u=1,wobble:f=1,highlight:p=1,trail:m=1,tiltX:h=0,tiltY:g=0,speed:_=1,hoverIntensity:v=1,rotateOnHover:y=!0,forceHoverState:b=!1,followCursor:x=!0,clickPulse:S=!0,intro:C=!0,opacity:w=1,paused:T=!1,dpr:E,className:D=``,style:O})=>{let k=(0,r.useRef)(null),A=(0,r.useRef)(null),j=(0,r.useRef)(null),M=Array.isArray(e)?e:[],N={colors:[M[0]??`#9c43fe`,M[1]??M[0]??`#4cc2e9`,M[2]??`#101499`].map(String),hue:t,backgroundColor:String(n),size:l(s,.1,3),glow:l(c,.1,5),bleed:l(u,0,4),wobble:Math.max(0,f),highlight:Math.max(0,p),trail:Math.max(0,m),tiltX:l(h,-70,70),tiltY:l(g,-70,70),speed:_,hoverIntensity:Math.max(0,v),rotateOnHover:y,forceHoverState:b,followCursor:x,clickPulse:S,intro:C,opacity:l(w,0,1),paused:T,dpr:E},P=(0,r.useRef)(N);return P.current=N,(0,r.useEffect)(()=>{let e=k.current,t=A.current,n=t?.getContext(`webgl2`,{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1});if(!e||!t||!n)return;let r=d(n);if(!r)return;let i=r.uniforms,s=n.createBuffer(),c=n.createVertexArray();n.bindVertexArray(c),n.bindBuffer(n.ARRAY_BUFFER,s),n.bufferData(n.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),n.STATIC_DRAW),n.enableVertexAttribArray(0),n.vertexAttribPointer(0,2,n.FLOAT,!1,0,0);let u=document.createElement(`canvas`).getContext(`2d`,{willReadFrequently:!0}),f=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches??!1,p=new Map,m=e=>{let t=p.get(e);if(t)return t;let n=[0,0,0];if(u){u.clearRect(0,0,1,1),u.fillStyle=`#000000`,u.fillStyle=e,u.fillRect(0,0,1,1);let[t,r,i,a]=u.getImageData(0,0,1,1).data;n=a?[t/255,r/255,i/255]:[0,0,0]}return p.set(e,n),n},h=(e,t)=>{if(!t)return e;let n=t*Math.PI/180,r=Math.cos(n),i=Math.sin(n),[a,o,s]=e,c=.299*a+.587*o+.114*s,l=.596*a-.274*o-.322*s,u=.211*a-.523*o+.312*s,d=l*r-u*i,f=l*i+u*r;return[c+.956*d+.621*f,c-.272*d-.647*f,c-1.106*d+1.703*f]},g={width:1,height:1},_={x:0,y:0,inside:!1},v={time:0,swirl:0,orbit:0,echo:1,rotation:0,hover:0,near:0,reachX:0,reachY:0,reachSpeedX:0,reachSpeedY:0,pulse:0,pulseSpeed:0,kick:P.current.intro&&!f?2.5:0,reveal:P.current.intro&&!f?0:1},y=0,b=0,x=!0,S=(e,t)=>{let n=P.current,r=Math.min(g.width,g.height),i=1/(n.size*(1+v.pulse)),a=(e-g.width/2)/r*2*i,s=(g.height/2-t)/r*2*i;if(n.tiltX||n.tiltY){let e=-n.tiltX*Math.PI/180,t=n.tiltY*Math.PI/180,[r,i,c,l]=[Math.cos(e),Math.sin(e),Math.cos(t),Math.sin(t)],u=[l*r,-i,c*r],d=[a,s,-3.2],f=u[0]*d[0]+u[1]*d[1]+u[2]*d[2],p=-(u[2]*o)/(Math.abs(f)>1e-5?f:-1e-5);if(p<=0)return[99,99];let m=[d[0]*p,d[1]*p,o+d[2]*p];a=m[0]*c-m[2]*l,s=m[0]*l*i+m[1]*r+m[2]*c*i}let c=Math.sin(v.rotation),l=Math.cos(v.rotation);return[l*a-c*s,c*a+l*s]},C=()=>{let e=P.current,[a,o,s]=e.colors.map(t=>h(m(t),e.hue)),l=v.reveal,u=l-1,d=1+2.2*u*u*u+1.2*u*u;n.viewport(0,0,t.width,t.height),n.useProgram(r.program),n.bindVertexArray(c),n.uniform2f(i.uResolution,t.width,t.height),n.uniform1f(i.uTime,v.time),n.uniform2f(i.uReach,v.reachX,v.reachY),n.uniform1f(i.uNear,v.near),n.uniform1f(i.uAwake,v.hover*e.hoverIntensity*.18),n.uniform1f(i.uRotation,v.rotation),n.uniform3fv(i.uBackground,m(e.backgroundColor)),n.uniform3fv(i.uColor1,a),n.uniform3fv(i.uColor2,o),n.uniform3fv(i.uColor3,s),n.uniform1f(i.uScale,1/(e.size*(1+v.pulse)*(.62+.38*d))),n.uniform1f(i.uWobble,e.wobble),n.uniform1f(i.uGlow,e.glow),n.uniform1f(i.uBleed,e.bleed),n.uniform1f(i.uHighlight,e.highlight),n.uniform2f(i.uEcho,v.echo*.55,v.echo<1?(1-v.echo)*(1-v.echo):0),n.uniform1f(i.uSwirl,v.swirl),n.uniform1f(i.uOrbit,v.orbit),n.uniform1f(i.uReveal,Math.min(1,l/.55)*Math.min(1,l/.55)*(3-2*Math.min(1,l/.55))),n.uniform1f(i.uOpacity,e.opacity),n.uniform1f(i.uTrail,e.trail),n.uniform2f(i.uTilt,-e.tiltX*Math.PI/180,e.tiltY*Math.PI/180),n.drawArrays(n.TRIANGLES,0,3)},w=e=>{if(y=0,!x||document.hidden)return;let t=P.current,n=b?l((e-b)/1e3,5e-4,.05):1/60;if(b=e,t.paused){v.reveal=1,C(),b=0;return}let r=+!f,[i,o]=S(_.x,_.y),s=Math.hypot(i,o),c=_.inside&&r?l((1.45-s)/.4,0,1):0,u=c*c*(3-2*c),d=u*l((s-.15)/.45,0,1),p=u>.5,m=t.forceHoverState?1:u;v.hover+=(m-v.hover)*(1-Math.exp(-n/.16));let h=.075*t.hoverIntensity*d,g=s>1e-4?i/s*h:0,T=s>1e-4?o/s*h:0;v.reachSpeedX+=(70*(g-v.reachX)-7*v.reachSpeedX)*n,v.reachSpeedY+=(70*(T-v.reachY)-7*v.reachSpeedY)*n,v.reachX+=v.reachSpeedX*n,v.reachY+=v.reachSpeedY*n,v.near+=(d*t.hoverIntensity-v.near)*(1-Math.exp(-n/.12));let E=n*t.speed*r;v.time+=E,v.swirl+=E*2*(1+v.kick),v.echo=Math.min(1,v.echo+n/1.2),t.rotateOnHover&&(v.rotation+=n*.3*v.hover*r);let D=Math.atan2(o,i);if(t.followCursor&&p&&r){let e=Math.atan2(Math.sin(D-v.orbit),Math.cos(D-v.orbit));v.orbit+=e*(1-Math.exp(-n*6))}else v.orbit-=E;v.orbit=Math.atan2(Math.sin(v.orbit),Math.cos(v.orbit)),v.pulseSpeed+=(-170*v.pulse-11*v.pulseSpeed)*n,v.pulse+=v.pulseSpeed*n,v.kick*=Math.exp(-n*2.5),!t.intro||f?v.reveal=1:v.reveal<1&&(v.reveal=Math.min(1,v.reveal+n/a)),C(),y=requestAnimationFrame(w)},T=()=>{!y&&x&&!document.hidden&&(y=requestAnimationFrame(w))},E=()=>{let n=P.current,r=Math.max(1,e.clientWidth),i=Math.max(1,e.clientHeight),a=Math.min(n.dpr||window.devicePixelRatio||1,2);g.width=r,g.height=i,t.width=Math.max(1,Math.round(r*a)),t.height=Math.max(1,Math.round(i*a)),C(),T()},D=t=>{let n=e.getBoundingClientRect();_.x=t.clientX-n.left,_.y=t.clientY-n.top,_.inside=_.x>=0&&_.y>=0&&_.x<=n.width&&_.y<=n.height},O=e=>{D(e),P.current.paused||T()},M=e=>{let t=P.current;if(D(e),!_.inside||!t.clickPulse||t.paused||f)return;let[n,r]=S(_.x,_.y);Math.hypot(n,r)>1||(v.pulseSpeed+=.9,v.kick=2.2,v.echo=0,T())},N=e=>{e.pointerType!==`mouse`&&(_.inside=!1)},F=()=>{_.inside=!1},I=()=>{b=0,T()},L=new ResizeObserver(E);L.observe(e);let R=new IntersectionObserver(e=>{x=e.some(e=>e.isIntersecting),x&&(b=0,T())});R.observe(e),window.addEventListener(`pointermove`,O,{passive:!0}),window.addEventListener(`pointerdown`,M,{passive:!0}),window.addEventListener(`pointerup`,N,{passive:!0}),window.addEventListener(`pointercancel`,N,{passive:!0}),document.documentElement.addEventListener(`pointerleave`,F),document.addEventListener(`visibilitychange`,I),E();let z=P.current.dpr;return j.current=()=>{let e=P.current;e.dpr===z?(y||C(),T()):(z=e.dpr,E())},()=>{cancelAnimationFrame(y),j.current=null,L.disconnect(),R.disconnect(),window.removeEventListener(`pointermove`,O),window.removeEventListener(`pointerdown`,M),window.removeEventListener(`pointerup`,N),window.removeEventListener(`pointercancel`,N),document.documentElement.removeEventListener(`pointerleave`,F),document.removeEventListener(`visibilitychange`,I),n.deleteProgram(r.program),n.deleteBuffer(s),n.deleteVertexArray(c),n.getExtension(`WEBGL_lose_context`)?.loseContext()}},[]),(0,r.useEffect)(()=>{j.current?.()}),(0,i.jsx)(`div`,{ref:k,className:[`relative z-0 h-full w-full overflow-hidden`,D].filter(Boolean).join(` `),style:O,children:(0,i.jsx)(`canvas`,{ref:A,className:`absolute inset-0 block h-full w-full`,"aria-hidden":`true`})})};export{f as default};