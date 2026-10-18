import{i as e,t}from"./react-sySUN5R7.js";import{O as n}from"./sculpture-dark-Cfb-XN1r.js";var r=e(t(),1),i=n(),a=24e5,o=14e4,s=32,c=256,l=`#version 300 es
const vec2 corners[3] = vec2[3](vec2(-1.0, -1.0), vec2(3.0, -1.0), vec2(-1.0, 3.0));
out vec2 vUv;
void main() {
  vUv = corners[gl_VertexID] * 0.5 + 0.5;
  gl_Position = vec4(corners[gl_VertexID], 0.0, 1.0);
}`,u=`#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUv;
out vec4 fragColor;
uniform vec2 uTexel;
`,d=`${u}
uniform sampler2D uVelocity;
uniform vec2 uSize;
uniform vec4 uSegment;
uniform vec2 uForce;
uniform float uRadius;

float segment(vec2 p, vec2 a, vec2 b) {
  vec2 ab = b - a;
  float t = clamp(dot(p - a, ab) / max(dot(ab, ab), 1e-4), 0.0, 1.0);
  return length(p - a - ab * t);
}

void main() {
  float d = segment(vUv * uSize, uSegment.xy, uSegment.zw) / uRadius;
  vec2 velocity = texture(uVelocity, vUv).xy + uForce * exp(-d * d * 6.0);
  fragColor = vec4(velocity, 0.0, 1.0);
}`,f=`${u}
uniform sampler2D uVelocity;
uniform float uAmount;

void main() {
  vec2 center = texture(uVelocity, vUv).xy;
  vec2 around =
    texture(uVelocity, vUv - vec2(uTexel.x, 0.0)).xy +
    texture(uVelocity, vUv + vec2(uTexel.x, 0.0)).xy +
    texture(uVelocity, vUv - vec2(0.0, uTexel.y)).xy +
    texture(uVelocity, vUv + vec2(0.0, uTexel.y)).xy;
  fragColor = vec4(mix(center, around * 0.25, uAmount), 0.0, 1.0);
}`,p=`${u}
uniform sampler2D uVelocity;
uniform float uWalls;

void main() {
  vec2 center = texture(uVelocity, vUv).xy;
  float left = texture(uVelocity, vUv - vec2(uTexel.x, 0.0)).x;
  float right = texture(uVelocity, vUv + vec2(uTexel.x, 0.0)).x;
  float down = texture(uVelocity, vUv - vec2(0.0, uTexel.y)).y;
  float up = texture(uVelocity, vUv + vec2(0.0, uTexel.y)).y;
  float edge = uWalls > 0.5 ? -1.0 : 0.0;
  if (vUv.x - uTexel.x < 0.0) left = edge * center.x;
  if (vUv.x + uTexel.x > 1.0) right = edge * center.x;
  if (vUv.y - uTexel.y < 0.0) down = edge * center.y;
  if (vUv.y + uTexel.y > 1.0) up = edge * center.y;
  fragColor = vec4(0.5 * (right - left + up - down), 0.0, 0.0, 1.0);
}`,m=`
uniform float uWalls;

float pressureAt(sampler2D field, vec2 uv) {
  vec2 inside = step(vec2(0.0), uv) * step(uv, vec2(1.0));
  return texture(field, uv).x * mix(inside.x * inside.y, 1.0, uWalls);
}
`,h=`${u}
uniform sampler2D uPressure;
uniform sampler2D uDivergence;
${m}
void main() {
  vec2 reach = uTexel * 2.0;
  float sum =
    pressureAt(uPressure, vUv - vec2(reach.x, 0.0)) +
    pressureAt(uPressure, vUv + vec2(reach.x, 0.0)) +
    pressureAt(uPressure, vUv - vec2(0.0, reach.y)) +
    pressureAt(uPressure, vUv + vec2(0.0, reach.y));
  fragColor = vec4(sum * 0.25 - texture(uDivergence, vUv).x, 0.0, 0.0, 1.0);
}`,g=`${u}
uniform sampler2D uPressure;
uniform sampler2D uVelocity;
${m}
void main() {
  float left = pressureAt(uPressure, vUv - vec2(uTexel.x, 0.0));
  float right = pressureAt(uPressure, vUv + vec2(uTexel.x, 0.0));
  float down = pressureAt(uPressure, vUv - vec2(0.0, uTexel.y));
  float up = pressureAt(uPressure, vUv + vec2(0.0, uTexel.y));
  vec2 velocity = texture(uVelocity, vUv).xy - 0.5 * vec2(right - left, up - down);
  fragColor = vec4(velocity, 0.0, 1.0);
}`,_=`${u}
uniform sampler2D uVelocity;
uniform vec2 uStep;
uniform float uKeep;
uniform float uWalls;

vec2 at(vec2 uv) {
  vec2 outside = max(-uv, uv - 1.0) / uTexel;
  float open = clamp(1.0 - max(outside.x, outside.y) / 1.5, 0.0, 1.0);
  return texture(uVelocity, uv).xy * mix(open, 1.0, uWalls);
}

void main() {
  vec2 start = vUv - at(vUv) * uStep;
  vec2 back = start + at(start) * uStep;
  vec2 corrected = vUv - (back - vUv) * 0.5;
  vec2 origin = corrected - at(corrected) * uStep;
  vec2 a = at(origin + vec2(-0.5, -0.5) * uTexel);
  vec2 b = at(origin + vec2(0.5, -0.5) * uTexel);
  vec2 c = at(origin + vec2(-0.5, 0.5) * uTexel);
  vec2 d = at(origin + vec2(0.5, 0.5) * uTexel);
  vec2 velocity = clamp(at(origin), min(min(a, b), min(c, d)), max(max(a, b), max(c, d)));
  fragColor = vec4(velocity * uKeep, 0.0, 1.0);
}`,ee=`${u}
uniform sampler2D uVelocity;
uniform sampler2D uPalette;
uniform vec2 uSimSize;
uniform float uSpeedScale;
uniform float uLight;
uniform vec4 uBackground;

vec2 velocityAt(vec2 uv) {
  vec2 st = uv * uSimSize - 0.5;
  vec2 i = floor(st);
  vec2 f = st - i;
  vec2 f2 = f * f;
  vec2 f3 = f2 * f;
  vec2 w0 = (-f3 + 3.0 * f2 - 3.0 * f + 1.0) / 6.0;
  vec2 w1 = (3.0 * f3 - 6.0 * f2 + 4.0) / 6.0;
  vec2 w2 = (-3.0 * f3 + 3.0 * f2 + 3.0 * f + 1.0) / 6.0;
  vec2 w3 = f3 / 6.0;
  vec2 g0 = w0 + w1;
  vec2 g1 = w2 + w3;
  vec2 h0 = (i - 0.5 + w1 / g0) / uSimSize;
  vec2 h1 = (i + 1.5 + w3 / g1) / uSimSize;
  vec2 a = texture(uVelocity, vec2(h0.x, h0.y)).xy;
  vec2 b = texture(uVelocity, vec2(h1.x, h0.y)).xy;
  vec2 c = texture(uVelocity, vec2(h0.x, h1.y)).xy;
  vec2 d = texture(uVelocity, vec2(h1.x, h1.y)).xy;
  return g0.y * (g0.x * a + g1.x * b) + g1.y * (g0.x * c + g1.x * d);
}

void main() {
  float speed = length(velocityAt(vUv)) * uSpeedScale;
  float level = speed < 0.75 ? speed : 0.75 + 0.25 * tanh((speed - 0.75) * 4.0);
  vec3 ink = texture(uPalette, vec2(level, 0.5)).rgb;
  float alpha = level;
  if (uLight > 0.5) {
    float hollow = smoothstep(0.7, 1.6, speed);
    alpha = smoothstep(0.08, 0.5, level) * mix(0.85, 0.1, hollow);
  } else {
    float hot = 1.0 - exp(-max(speed - 0.75, 0.0) * 1.2);
    ink = mix(ink, min(ink * 1.8 + 0.06, vec3(1.0)), hot);
  }
  vec3 color = ink * alpha + uBackground.rgb * uBackground.a * (1.0 - alpha);
  float coverage = alpha + uBackground.a * (1.0 - alpha);
  float grain = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));
  color += (grain - 0.5) / 255.0 * step(0.002, coverage);
  fragColor = vec4(clamp(color, vec3(0.0), vec3(coverage)), coverage);
}`,v=(e,t,n)=>Math.min(n,Math.max(t,e)),y=(e,t)=>.5**(t/(.35+e*e*12)),b=e=>{let t=String(e||``).trim(),n=/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(t);if(n){let e=n[1].length===3?n[1].replace(/./g,e=>e+e):n[1];return[0,2,4].map(t=>parseInt(e.slice(t,t+2),16)/255)}let r=/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i.exec(t);return r?[r[1],r[2],r[3]].map(e=>v(parseFloat(e)/255,0,1)):null},x=e=>e<=.04045?e/12.92:((e+.055)/1.055)**2.4,te=e=>{let t=[];e.forEach(e=>{let n=b(e);n&&t.push(n)}),t.length||t.push([1,1,1]);let n=t.map(e=>e.map(x)),r=new Uint8Array(c*4);for(let e=0;e<c;e++){let t=v(e/255*n.length-.5,0,n.length-1),i=Math.min(Math.floor(t),Math.max(n.length-2,0)),a=Math.min(i+1,n.length-1),o=t-i,s=o*o*(3-2*o);for(let t=0;t<3;t++){let o=n[i][t]+(n[a][t]-n[i][t])*s;r[e*4+t]=Math.round(v(o,0,1)*255)}r[e*4+3]=255}return r},S=(e,t,n)=>{let r=e.createShader(t);return r?(e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(console.error(e.getShaderInfoLog(r)),e.deleteShader(r),null)):null},C=(e,t)=>{let n=S(e,e.VERTEX_SHADER,l),r=S(e,e.FRAGMENT_SHADER,t),i=n&&r?e.createProgram():null;if(!n||!r||!i)return n&&e.deleteShader(n),r&&e.deleteShader(r),null;if(e.attachShader(i,n),e.attachShader(i,r),e.linkProgram(i),e.deleteShader(n),e.deleteShader(r),!e.getProgramParameter(i,e.LINK_STATUS))return console.error(e.getProgramInfoLog(i)),e.deleteProgram(i),null;let a={},o=e.getProgramParameter(i,e.ACTIVE_UNIFORMS);for(let t=0;t<o;t++){let n=e.getActiveUniform(i,t);n&&(a[n.name]=e.getUniformLocation(i,n.name))}return{program:i,uniforms:a}},w=({colors:e=[`#5227FF`,`#FF9FFC`,`#B497CF`],intensity:t=1,mouseForce:n=20,cursorSize:l=100,persistence:u=.75,viscosity:m=0,resolution:x=.5,bounceEdges:S=!1,clickBurst:w=!0,autoDemo:T=!0,autoSpeed:E=.5,autoIntensity:D=2.2,autoResumeDelay:O=1e3,intro:k=!0,lightMode:A=!1,backgroundColor:j=`transparent`,maxDevicePixelRatio:M=2,className:N=``,style:P})=>{let F=(0,r.useRef)(null),ne=(0,r.useRef)(null),I=(0,r.useRef)(null),[L,re]=(0,r.useState)(0),R=Array.isArray(e)?e:[e],z=j===`transparent`?null:b(j),B={colors:R,paletteKey:R.join(`,`),intensity:Math.max(0,t),force:Math.max(0,n),radius:v(l,4,600),persistence:v(u,0,1),viscosity:v(m,0,1),resolution:v(x,.05,1),walls:S,clickBurst:w,autoDemo:T,autoSpeed:Math.max(0,E),autoIntensity:Math.max(0,D),autoResumeDelay:Math.max(0,O),intro:k,light:A,background:z?[...z,1]:[0,0,0,0],maxRatio:v(M,.5,3)},V=(0,r.useRef)(B);return V.current=B,(0,r.useEffect)(()=>{I.current?.()}),(0,r.useEffect)(()=>{let e=F.current,t=ne.current;if(!e||!t)return;let n=t.getContext(`webgl2`,{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1,powerPreference:`high-performance`});if(!n||!n.getExtension(`EXT_color_buffer_float`)&&!n.getExtension(`EXT_color_buffer_half_float`))return;let r={splat:C(n,d),smooth:C(n,f),divergence:C(n,p),pressure:C(n,h),project:C(n,g),advect:C(n,_),display:C(n,ee)};if(Object.values(r).some(e=>!e))return;let i=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,l=n.createVertexArray(),u={width:1,height:1},m={width:0,height:0},b={},x={x:0,y:0,fromX:0,fromY:0,dx:0,dy:0,inside:!1,ready:!1,moved:!1,last:0},S={phase:Math.random()*100,x:0,y:0,ready:!1,ramp:0},w={active:V.current.intro&&!i&&L===0,time:0},T=[],E=[],D=1,O=-1/0,k=0,A=0,j=!0,M=document.visibilityState!==`hidden`,N=!1,P=``,R=n.createTexture();n.bindTexture(n.TEXTURE_2D,R),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MAG_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE);let z=e=>{e.paletteKey!==P&&(P=e.paletteKey,n.bindTexture(n.TEXTURE_2D,R),n.texImage2D(n.TEXTURE_2D,0,n.RGBA8,c,1,0,n.RGBA,n.UNSIGNED_BYTE,te(e.colors)))},B=(e,t,r)=>{let i=n.createTexture();n.bindTexture(n.TEXTURE_2D,i),n.texImage2D(n.TEXTURE_2D,0,r===2?n.RG16F:n.R16F,e,t,0,r===2?n.RG:n.RED,n.HALF_FLOAT,null),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MAG_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE);let a=n.createFramebuffer();return n.bindFramebuffer(n.FRAMEBUFFER,a),n.framebufferTexture2D(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,i,0),n.clearColor(0,0,0,0),n.clear(n.COLOR_BUFFER_BIT),{texture:i,framebuffer:a}},H=()=>{Object.keys(b).forEach(e=>{n.deleteTexture(b[e].texture),n.deleteFramebuffer(b[e].framebuffer),delete b[e]})},U=()=>{let r=V.current,i=e.getBoundingClientRect(),s=Math.max(1,i.width),c=Math.max(1,i.height),l=Math.min(window.devicePixelRatio||1,r.maxRatio,Math.sqrt(a/(s*c))),d=Math.max(1,Math.round(s*l)),f=Math.max(1,Math.round(c*l));(t.width!==d||t.height!==f)&&(t.width=d,t.height=f),u.width=s,u.height=c;let p=r.resolution*.5,h=p*Math.min(1,Math.sqrt(o/(s*c*p*p))),g=v(Math.round(s*h),16,1024),_=v(Math.round(c*h),16,1024);(g!==m.width||_!==m.height)&&(H(),m.width=g,m.height=_,b.velocity=B(g,_,2),b.velocityNext=B(g,_,2),b.divergence=B(g,_,1),b.pressure=B(g,_,1),b.pressureNext=B(g,_,1),n.bindFramebuffer(n.FRAMEBUFFER,null))},W=(e,t)=>{let n=b[e];b[e]=b[t],b[t]=n},G=(e,t,r)=>{n.activeTexture(n.TEXTURE0+e),n.bindTexture(n.TEXTURE_2D,t),n.uniform1i(r,e)},K=(e,t,r)=>{n.useProgram(e.program),n.uniform2f(e.uniforms.uTexel,1/m.width,1/m.height),r(e.uniforms),n.bindFramebuffer(n.FRAMEBUFFER,t?t.framebuffer:null),n.drawArrays(n.TRIANGLES,0,3)},ie=(e,t)=>{n.viewport(0,0,m.width,m.height);let i=+!!e.walls;T.forEach(e=>{K(r.splat,b.velocityNext,t=>{G(0,b.velocity.texture,t.uVelocity),n.uniform2f(t.uSize,u.width,u.height),n.uniform4f(t.uSegment,e.ax,e.ay,e.bx,e.by),n.uniform2f(t.uForce,e.vx,e.vy),n.uniform1f(t.uRadius,e.radius)}),W(`velocity`,`velocityNext`)}),T.length=0;let a=Math.ceil(e.viscosity*4);for(let t=0;t<a;t++)K(r.smooth,b.velocityNext,r=>{G(0,b.velocity.texture,r.uVelocity),n.uniform1f(r.uAmount,Math.min(1,e.viscosity*4-t)*.9)}),W(`velocity`,`velocityNext`);K(r.divergence,b.divergence,e=>{G(0,b.velocity.texture,e.uVelocity),n.uniform1f(e.uWalls,i)});for(let e=0;e<s;e++)K(r.pressure,b.pressureNext,e=>{G(0,b.pressure.texture,e.uPressure),G(1,b.divergence.texture,e.uDivergence),n.uniform1f(e.uWalls,i)}),W(`pressure`,`pressureNext`);K(r.project,b.velocityNext,e=>{G(0,b.pressure.texture,e.uPressure),G(1,b.velocity.texture,e.uVelocity),n.uniform1f(e.uWalls,i)}),W(`velocity`,`velocityNext`),K(r.advect,b.velocityNext,r=>{G(0,b.velocity.texture,r.uVelocity),n.uniform2f(r.uStep,t/u.width,t/u.height),n.uniform1f(r.uKeep,y(e.persistence,t)),n.uniform1f(r.uWalls,i)}),W(`velocity`,`velocityNext`)},ae=e=>{n.viewport(0,0,t.width,t.height),K(r.display,null,t=>{G(0,b.velocity.texture,t.uVelocity),G(1,R,t.uPalette),n.uniform2f(t.uSimSize,m.width,m.height),n.uniform1f(t.uSpeedScale,1.25*e.intensity/(.84*Math.max(u.width,u.height))),n.uniform1f(t.uLight,+!!e.light),n.uniform4f(t.uBackground,e.background[0],e.background[1],e.background[2],e.background[3])})},oe=e=>{let t=.62*Math.sin(e*.83+1.3)+.38*Math.sin(e*1.71+.4),n=.6*Math.sin(e*1.07+2.1)+.4*Math.cos(e*.61+.7);return[(.5+.41*t)*u.width,(.5+.41*n)*u.height]},q=e=>{let t=1-(1-v(e/1.4,0,1))**3,n=-.6+t*3.6,r=.08+.3*t;return[(.5+Math.cos(n)*r*1.1)*u.width,(.5+Math.sin(n)*r*(u.width/u.height)*.75)*u.height]},J=(e,t,n,r,i)=>{T.push({ax:e[0],ay:e[1],bx:t[0],by:t[1],vx:v((t[0]-e[0])/n*r,-6e3,6e3),vy:v((t[1]-e[1])/n*r,-6e3,6e3),radius:i})},Y=e=>{if(k=0,N)return;let t=V.current;z(t);let r=v((e-A)/1e3||0,0,1/30);A=Math.max(A,e);let a=Math.min(1,r*60),o=e-O>t.autoResumeDelay&&!x.inside;if(w.active&&r>0){let e=q(w.time);w.time+=r;let n=Math.sin(Math.min(1,w.time/1.4)*Math.PI);J(e,q(w.time),r,.2*n,t.radius),D=1,w.time>1.4&&(w.active=!1)}else if(t.autoDemo&&!i&&o&&r>0){S.ramp=Math.min(1,S.ramp+r/.8),S.phase+=r*t.autoSpeed*1.6;let e=oe(S.phase);if(S.ready){let n=.3+.7*(.5+.5*Math.sin(S.phase*2.6))**2,i=t.force/20*.45*t.autoIntensity*S.ramp*S.ramp*n*a;J([S.x,S.y],e,r,i,t.radius)}S.x=e[0],S.y=e[1],S.ready=!0,D=1}else S.ramp=0;if(x.moved&&r>0){x.moved=!1;let n=Math.max(e-x.last,8)/1e3;J([x.fromX,x.fromY],[x.x,x.y],n,t.force/20*.15*a,t.radius),x.fromX=x.x,x.fromY=x.y,x.last=e,D=1}let s=E.shift();s&&T.push(s),n.bindVertexArray(l),n.disable(n.BLEND),r>0&&ie(t,r),ae(t),D*=y(t.persistence,r),(w.active||t.autoDemo&&!i||D>.002||E.length>0||x.moved)&&j&&M&&(k=requestAnimationFrame(Y))},X=()=>{!k&&!N&&j&&M&&(A=performance.now(),k=requestAnimationFrame(Y))};I.current=()=>{U(),X()};let Z=t=>{let n=e.getBoundingClientRect();return{x:t.clientX-n.left,y:n.bottom-t.clientY,inside:t.clientX>=n.left&&t.clientX<=n.right&&t.clientY>=n.top&&t.clientY<=n.bottom}},se=e=>{let t=Z(e);if(x.inside=t.inside,!t.inside){x.ready=!1;return}O=performance.now(),w.active=!1,x.ready||(x.fromX=t.x,x.fromY=t.y,x.x=t.x,x.y=t.y,x.last=O,x.ready=!0);let n=t.x-x.x,r=t.y-x.y;Math.hypot(n,r)>.5&&(x.dx=x.dx*.7+n*.3,x.dy=x.dy*.7+r*.3),x.x=t.x,x.y=t.y,x.moved=!0,X()},ce=e=>{let t=V.current,n=Z(e);if(!n.inside||(O=performance.now(),!t.clickBurst||i))return;let r=Math.hypot(x.dx,x.dy)>1?Math.atan2(x.dy,x.dx):Math.random()*Math.PI*2,a=Math.cos(r),o=Math.sin(r),s=t.radius*.5,c=1400*(t.force/20);E.push({ax:n.x-a*s,ay:n.y-o*s,bx:n.x+a*s,by:n.y+o*s,vx:a*c,vy:o*c,radius:t.radius*.9}),E.length>4&&E.shift(),D=1,X()},Q=()=>{x.inside=!1,x.ready=!1},$=e=>{e.pointerType!==`mouse`&&Q()};window.addEventListener(`pointermove`,se,{passive:!0}),window.addEventListener(`pointerdown`,ce,{passive:!0}),window.addEventListener(`pointerup`,$,{passive:!0}),window.addEventListener(`pointercancel`,$,{passive:!0}),document.documentElement.addEventListener(`pointerleave`,Q);let le=e=>{e.preventDefault(),N=!0,cancelAnimationFrame(k),k=0},ue=()=>re(e=>e+1);t.addEventListener(`webglcontextlost`,le),t.addEventListener(`webglcontextrestored`,ue);let de=new ResizeObserver(()=>{U(),X()});de.observe(e);let fe=new IntersectionObserver(e=>{j=e.some(e=>e.isIntersecting),X()});fe.observe(e);let pe=()=>{M=document.visibilityState!==`hidden`,X()};return document.addEventListener(`visibilitychange`,pe),U(),X(),()=>{cancelAnimationFrame(k),I.current=null,de.disconnect(),fe.disconnect(),window.removeEventListener(`pointermove`,se),window.removeEventListener(`pointerdown`,ce),window.removeEventListener(`pointerup`,$),window.removeEventListener(`pointercancel`,$),document.documentElement.removeEventListener(`pointerleave`,Q),document.removeEventListener(`visibilitychange`,pe),t.removeEventListener(`webglcontextlost`,le),t.removeEventListener(`webglcontextrestored`,ue),n.isContextLost()||(H(),n.deleteTexture(R),n.deleteVertexArray(l),Object.values(r).forEach(e=>n.deleteProgram(e.program)))}},[L]),(0,i.jsx)(`div`,{ref:F,className:`relative h-full w-full overflow-hidden ${N}`.trim(),style:P,children:(0,i.jsx)(`canvas`,{ref:ne,className:`absolute inset-0 block h-full w-full`,"aria-hidden":`true`})})};export{w as default};