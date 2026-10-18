import{i as e,t}from"./react-sySUN5R7.js";import{k as n}from"./sculpture-dark-CKiqtzhU.js";var r=e(t(),1),i=n(),a=9e6,o=12e4,s={grid:0,hex:1,spiral:2,scatter:3},c=Math.PI*(3-Math.sqrt(5)),l=`#version 300 es
precision highp float;
layout(location = 0) in vec4 aDot;
uniform vec2 uSize;
uniform float uPixel;
uniform float uRadius;
uniform float uCell;
uniform vec4 uLens;
uniform vec2 uWarp;
uniform vec3 uGlow;
uniform vec3 uFrom;
uniform vec3 uTo;
uniform vec4 uGlowColor;
uniform vec3 uGradient;
uniform float uTime;
uniform float uWave;
uniform float uSparkle;
uniform float uFocus;
uniform float uBase;
uniform float uLight;
out vec2 vLocal;
out float vRadius;
out float vBlur;
out float vHalo;
out float vHaloWidth;
out vec3 vColor;
out float vAlpha;

vec3 toRgb(vec3 lab) {
  float l = lab.x + 0.3963377774 * lab.y + 0.2158037573 * lab.z;
  float m = lab.x - 0.1055613458 * lab.y - 0.0638541728 * lab.z;
  float s = lab.x - 0.0894841775 * lab.y - 1.291485548 * lab.z;
  vec3 lms = vec3(l * l * l, m * m * m, s * s * s);
  vec3 lin = clamp(vec3(
    4.0767416621 * lms.x - 3.3077115913 * lms.y + 0.2309699292 * lms.z,
    -1.2684380046 * lms.x + 2.6097574011 * lms.y - 0.3413193965 * lms.z,
    -0.0041960863 * lms.x - 0.7034186147 * lms.y + 1.707614701 * lms.z
  ), 0.0, 1.0);
  return mix(lin * 12.92, 1.055 * pow(lin, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, lin));
}

vec3 blend(vec3 a, vec3 b, float t) {
  vec2 ab = mix(a.yz, b.yz, t);
  float chroma = mix(length(a.yz), length(b.yz), t);
  float len = length(ab);
  return vec3(mix(a.x, b.x, t), len > 1e-5 ? ab * (chroma / len) : ab);
}

vec3 wave(vec2 p, float t) {
  float ay = p.x * 0.018 + t + 1.1 * sin(p.y * 0.016 - t * 0.4);
  float ax = p.y * 0.021 + t * 0.7 + 1.3 * sin(p.x * 0.013 + t * 0.3);
  float spread = cos(ay) * 0.0176 * cos(p.y * 0.016 - t * 0.4) + 0.5 * cos(ax) * 0.0169 * cos(p.x * 0.013 + t * 0.3);
  return uWave * vec3(0.5 * sin(ax), sin(ay), spread);
}

void main() {
  vec2 corner = vec2(float(gl_VertexID & 1), float(gl_VertexID >> 1)) * 2.0 - 1.0;
  vec2 center = uSize * 0.5;
  vec3 swell = wave(aDot.xy, uTime);
  vec2 source = center + (aDot.xy - center) * mix(1.12, 1.0, uFocus) + swell.xy;

  vec2 rel = source - uLens.xy;
  float x = length(rel) / uLens.z;
  float y = clamp(1.0 - x * x, 0.0, 1.0);
  float w = y * y * y;
  float k = uWarp.x * uLens.w;
  float grow = 1.0 + k * w;
  float spread = 1.0 + k * (w - 6.0 * x * x * y * y);
  float theta = uWarp.y * uLens.w * w;
  vec2 turn = vec2(cos(theta), sin(theta));
  vec2 display = uLens.xy + vec2(turn.x * rel.x - turn.y * rel.y, turn.y * rel.x + turn.x * rel.y) * grow;
  float scale = sqrt(max(grow * spread, 0.02));

  float spark = 0.0;
  if (uSparkle > 0.0) {
    float phase = 0.5 + 0.5 * sin(uTime * (0.55 + aDot.w * 0.9) + aDot.z * 6.2831853);
    spark = pow(phase, 48.0) * step(0.72, fract(aDot.z * 7.31 + aDot.w * 3.17)) * uSparkle;
  }

  float pool = 0.0;
  if (uGlow.x > 0.0) {
    float g = length(display - uLens.xy) / uGlow.x;
    float q = clamp(1.0 - g * g, 0.0, 1.0);
    pool = q * q * uGlow.y * uLens.w;
  }

  float radius = uRadius * (1.0 + 0.7 * spark);
  float device = radius * scale * uPixel;
  float fade = 1.0;
  if (device < 0.75) {
    fade = device * device / 0.5625;
    radius = 0.75 / (scale * uPixel);
  }
  float blur = (1.0 - uFocus) * uCell * 0.42;
  float energy = pow(radius / (radius + blur), 1.15);
  float halo = pool * uGlow.z;
  float haloWidth = 2.0 + radius * 1.5;
  float pad = radius + blur * 1.2 + 1.5 / (scale * uPixel) + (halo > 0.0 ? haloWidth * 2.5 : 0.0);

  float t = clamp(dot(aDot.xy - center, uGradient.xy) / uGradient.z + 0.5, 0.0, 1.0);
  vec3 tone = blend(uFrom, uTo, t);
  vec3 deep = vec3(tone.x * 0.72, tone.yz * 1.3);
  vec3 base = toRgb(tone);
  vec3 lit = toRgb(mix(deep, uGlowColor.xyz, uGlowColor.w));
  vec3 color = mix(base, lit, clamp(pool, 0.0, 1.0) * 0.8);
  color = mix(color, uLight > 0.5 ? color * 0.6 : vec3(1.0), spark * 0.55);

  vLocal = corner * pad;
  vRadius = radius + blur;
  vBlur = blur * 0.7;
  vHalo = halo;
  vHaloWidth = haloWidth;
  vColor = color;
  float shade = clamp(1.0 - swell.z * 2.5, 0.4, 1.6);
  vAlpha = mix(min(uBase * shade, 1.0), 1.0, clamp(max(pool, spark), 0.0, 1.0)) * fade * energy * smoothstep(0.0, 0.25, uFocus + 0.08);
  vec2 point = display + corner * pad * scale;
  gl_Position = vec4(point.x / uSize.x * 2.0 - 1.0, 1.0 - point.y / uSize.y * 2.0, 0.0, 1.0);
}`,u=`#version 300 es
precision highp float;
uniform float uOpacity;
in vec2 vLocal;
in float vRadius;
in float vBlur;
in float vHalo;
in float vHaloWidth;
in vec3 vColor;
in float vAlpha;
out vec4 fragColor;

void main() {
  float dist = length(vLocal);
  float d = dist - vRadius;
  float edge = max(fwidth(dist), 1e-4) + vBlur;
  float cover = 1.0 - smoothstep(-0.5 * edge, 0.5 * edge, d);
  float glow = vHalo * exp(-max(d, 0.0) / vHaloWidth) * 0.5;
  float alpha = min(cover + glow, 1.0) * vAlpha * uOpacity;
  if (alpha < 0.002) discard;
  fragColor = vec4(vColor * alpha, alpha);
}`,d=(e,t,n)=>Math.min(n,Math.max(t,e)),f=e=>{let t=String(e||``).trim(),n=/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(t);if(n){let e=n[1].length===3?n[1].replace(/./g,e=>e+e):n[1];return[0,2,4].map(t=>parseInt(e.slice(t,t+2),16)/255)}let r=/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i.exec(t);return r?[r[1],r[2],r[3]].map(e=>d(parseFloat(e)/255,0,1)):null},p=e=>e<=.04045?e/12.92:((e+.055)/1.055)**2.4,m=e=>{let[t,n,r]=e.map(p),i=Math.cbrt(.4122214708*t+.5363325363*n+.0514459929*r),a=Math.cbrt(.2119034982*t+.6806995451*n+.1073969566*r),o=Math.cbrt(.0883024619*t+.2817188376*n+.6299787005*r);return[.2104542553*i+.793617785*a-.0040720468*o,1.9779984951*i-2.428592205*a+.4505937099*o,.0259040371*i+.7827717662*a-.808675766*o]},h=(e,t,n)=>{let r=m(f(e)||t);if(!n)return r;let i=Math.atan2(r[2],r[1])*180/Math.PI,a=d(1-Math.abs(i-85)/40,0,1),o=.6+.16*a*a*(3-2*a);if(r[0]<=o)return r;let s=1+(r[0]-o)*1.6;return[o,r[1]*s,r[2]*s]},g=e=>{let t=m(f(e)||[1,1,1]);return Math.hypot(t[1],t[2])},_=(e,t,n)=>{let r=Math.imul(e,374761393)+Math.imul(t,668265263)+Math.imul(n,1274126177)|0;return r=Math.imul(r^r>>>13,1274126177),r^=r>>>16,(r>>>0)/4294967296},v=(e,t,n)=>{let r=0;for(let i=1;i<48;i++){let a=i/48,o=(1-a*a)**3,s=a*e,c=1+t*o,l=n*o;r=Math.max(r,Math.hypot(s*(c*Math.cos(l)-1),s*c*Math.sin(l)))}return r},y=(e,t,n,r,i)=>{let a=e/2,o=t/2,l=-i,u=e+i,d=-i,f=t+i,p=[],m=(e,t,n,r)=>{e>=l&&e<=u&&t>=d&&t<=f&&p.push(e,t,n,r)};if(r===s.spiral){let r=n/Math.sqrt(Math.PI),s=Math.hypot(e/2+i,t/2+i),l=Math.ceil((s/r)**2);for(let e=0;e<l;e++){let t=r*Math.sqrt(e+.5),n=e*c;m(a+t*Math.cos(n),o+t*Math.sin(n),_(e,0,3),_(e,0,4))}}else{let c=r===s.hex?n*Math.sqrt(3)/2:n,l=Math.ceil((e/2+i)/n)+1,u=Math.ceil((t/2+i)/c)+1;for(let e=-u;e<=u;e++)for(let t=-l;t<=l;t++){let i=a+t*n+(r===s.hex&&e&1?n/2:0),l=o+e*c;r===s.scatter&&(i+=(_(t,e,1)-.5)*n*.8,l+=(_(t,e,2)-.5)*n*.8),m(i,l,_(t,e,3),_(t,e,4))}}return new Float32Array(p)},b=(e,t,n)=>{let r=e.createShader(t);return r?(e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(console.error(e.getShaderInfoLog(r)),e.deleteShader(r),null)):null},x=e=>{let t=b(e,e.VERTEX_SHADER,l),n=b(e,e.FRAGMENT_SHADER,u),r=t&&n?e.createProgram():null;if(!t||!n||!r)return t&&e.deleteShader(t),n&&e.deleteShader(n),null;if(e.attachShader(r,t),e.attachShader(r,n),e.linkProgram(r),e.deleteShader(t),e.deleteShader(n),!e.getProgramParameter(r,e.LINK_STATUS))return console.error(e.getProgramInfoLog(r)),e.deleteProgram(r),null;let i={},a=e.getProgramParameter(r,e.ACTIVE_UNIFORMS);for(let t=0;t<a;t++){let n=e.getActiveUniform(r,t);n&&(i[n.name]=e.getUniformLocation(r,n.name))}return{program:r,uniforms:i}},S=({dotRadius:e=1.5,dotSpacing:t=14,pattern:n=`grid`,gradientFrom:c=`#5227FF`,gradientTo:l=`#FF9FFC`,gradientAngle:u=135,cursorRadius:f=240,bulgeStrength:p=.6,twist:m=0,glowColor:_=`#ffffff`,glowRadius:b=160,glowIntensity:S=.8,baseOpacity:C=.55,waveAmplitude:w=0,sparkle:T=!1,speed:E=1,interactive:D=!0,holdToZoom:O=!0,intro:k=!0,lightMode:A=!1,opacity:j=1,maxDevicePixelRatio:M=2,className:N=``,style:P})=>{let F=(0,r.useRef)(null),I=(0,r.useRef)(null),L=(0,r.useRef)(null),[R,z]=(0,r.useState)(0),B=d(e,.25,12),V=B*2+d(t,1,200),H=u*Math.PI/180,U={radius:B,step:V,pattern:s[n]??s.grid,from:h(c,[.32,.15,1],A),to:h(l,[1,.62,.99],A),glowColor:h(_,[1,1,1],A),glowWeight:A?d((g(_)-.02)/.06,0,1):1,direction:[Math.sin(H),-Math.cos(H)],lensRadius:d(f,20,2e3),strength:d(p,-1,1),twist:d(m,-360,360)*Math.PI/180,glowRadius:Math.max(0,b),glowIntensity:d(S,0,2),base:d(C,0,1),wave:d(w,0,60),sparkle:+!!T,speed:Math.max(0,E),interactive:D,holdToZoom:O,intro:k,light:A,opacity:d(j,0,1),maxRatio:d(M,.5,3)},W=(0,r.useRef)(U);return W.current=U,(0,r.useEffect)(()=>{L.current?.()}),(0,r.useEffect)(()=>{let e=F.current,t=I.current;if(!e||!t)return;let n=t.getContext(`webgl2`,{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1,powerPreference:`high-performance`}),r=n?x(n):null;if(!n||!r)return;let i=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,s=n.createVertexArray(),c=n.createBuffer();n.bindVertexArray(s),n.bindBuffer(n.ARRAY_BUFFER,c),n.enableVertexAttribArray(0),n.vertexAttribPointer(0,4,n.FLOAT,!1,16,0),n.vertexAttribDivisor(0,1),n.bindVertexArray(null);let l={width:1,height:1,ratio:1},u={x:0,y:0,inside:!1,down:!1},f={x:0,y:0,vx:0,vy:0,presence:0,zoom:0,ready:!1},p=``,m=0,h=Math.random()*100,g=W.current.intro&&!i&&R===0?0:1,_=0,b=0,S=!0,C=document.visibilityState!==`hidden`,w=!1,T=(e,t)=>d((e.strength>=0?e.strength*1.2:e.strength*.7)*(1+t*.6),-.85,1.45),E=()=>{let e=W.current,t=v(e.lensRadius,T(e,+!!e.holdToZoom),e.twist*(e.holdToZoom?1.6:1)),r=Math.ceil(t+e.wave+e.step*2),i=(l.width+r*2)*(l.height+r*2),a=Math.max(e.step,Math.sqrt(i/o)),s=`${l.width}|${l.height}|${a}|${e.pattern}|${r}`;if(s===p)return;p=s;let u=y(l.width,l.height,a,e.pattern,r);m=u.length/4,n.bindBuffer(n.ARRAY_BUFFER,c),n.bufferData(n.ARRAY_BUFFER,u,n.STATIC_DRAW)},D=()=>{let n=W.current,r=e.getBoundingClientRect(),i=Math.max(1,r.width),o=Math.max(1,r.height),s=Math.min(window.devicePixelRatio||1,n.maxRatio,Math.sqrt(a/(i*o))),c=Math.max(1,Math.round(i*s)),u=Math.max(1,Math.round(o*s));(t.width!==c||t.height!==u)&&(t.width=c,t.height=u),l.width=i,l.height=o,l.ratio=c/i,E()},O=e=>{if(_=0,w)return;let a=W.current,o=d((e-b)/1e3||0,0,.05);b=Math.max(b,e),i||(h+=o*a.speed),g<1&&(g=Math.min(1,g+o/1.8));let c=a.interactive&&u.inside;if(c&&(!f.ready||f.presence<.01)&&(f.x=u.x,f.y=u.y,f.vx=0,f.vy=0,f.ready=!0),f.ready){let e=1+2*o*18,t=o*324,n=o*t,r=1/(e+n),i=(e*f.x+o*f.vx+n*u.x)*r,a=(e*f.y+o*f.vy+n*u.y)*r;f.vx=(f.vx+t*(u.x-f.x))*r,f.vy=(f.vy+t*(u.y-f.y))*r,f.x=i,f.y=a}let p=+!!c;f.presence+=(p-f.presence)*(1-Math.exp(-o/(c?.18:.4)));let v=c&&u.down&&a.holdToZoom?1:0;f.zoom+=(v-f.zoom)*(1-Math.exp(-o/.14));let y=g<.5?4*g*g*g:1-(-2*g+2)**3/2,x=f.presence*f.presence*(3-2*f.presence),E=Math.abs(l.width*a.direction[0])+Math.abs(l.height*a.direction[1]);n.viewport(0,0,t.width,t.height),n.clearColor(0,0,0,0),n.clear(n.COLOR_BUFFER_BIT),n.enable(n.BLEND),n.blendFunc(n.ONE,n.ONE_MINUS_SRC_ALPHA),n.useProgram(r.program),n.bindVertexArray(s);let D=r.uniforms;n.uniform2f(D.uSize,l.width,l.height),n.uniform1f(D.uPixel,l.ratio),n.uniform1f(D.uRadius,a.radius),n.uniform1f(D.uCell,a.step),n.uniform4f(D.uLens,f.x,f.y,a.lensRadius*(1+f.zoom*.12),x),n.uniform2f(D.uWarp,T(a,f.zoom),a.twist*(1+f.zoom*.6)),n.uniform3f(D.uGlow,a.glowRadius*(1+f.zoom*.1),a.glowIntensity*(1+f.zoom*.25),+!a.light),n.uniform3f(D.uFrom,a.from[0],a.from[1],a.from[2]),n.uniform3f(D.uTo,a.to[0],a.to[1],a.to[2]),n.uniform4f(D.uGlowColor,a.glowColor[0],a.glowColor[1],a.glowColor[2],a.glowWeight),n.uniform3f(D.uGradient,a.direction[0],a.direction[1],Math.max(E,1)),n.uniform1f(D.uTime,h),n.uniform1f(D.uWave,a.wave),n.uniform1f(D.uSparkle,a.sparkle),n.uniform1f(D.uFocus,y),n.uniform1f(D.uBase,a.light?Math.min(1,a.base*1.3):a.base),n.uniform1f(D.uLight,+!!a.light),n.uniform1f(D.uOpacity,a.opacity),m&&n.drawArraysInstanced(n.TRIANGLE_STRIP,0,4,m);let k=Math.abs(u.x-f.x)+Math.abs(u.y-f.y)>.05||Math.hypot(f.vx,f.vy)>.5,A=Math.abs(p-f.presence)>.002||Math.abs(v-f.zoom)>.002||f.presence>.002&&k,j=!i&&a.speed>0&&(a.wave>0||a.sparkle>0);(g<1||A||j)&&S&&C&&(_=requestAnimationFrame(O))},k=()=>{!_&&!w&&S&&C&&(b=performance.now(),_=requestAnimationFrame(O))};L.current=()=>{D(),k()};let A=t=>{let n=e.getBoundingClientRect();return{x:t.clientX-n.left,y:t.clientY-n.top,inside:t.clientX>=n.left&&t.clientX<=n.right&&t.clientY>=n.top&&t.clientY<=n.bottom}},j=e=>{let t=A(e);u.x=t.x,u.y=t.y,u.inside=t.inside,k()},M=e=>{let t=A(e);u.x=t.x,u.y=t.y,u.inside=t.inside,u.down=t.inside,k()},N=()=>{u.inside=!1,u.down=!1,k()},P=e=>{u.down=!1,e.pointerType!==`mouse`&&(u.inside=!1),k()};window.addEventListener(`pointermove`,j,{passive:!0}),window.addEventListener(`pointerdown`,M,{passive:!0}),window.addEventListener(`pointerup`,P,{passive:!0}),window.addEventListener(`pointercancel`,P,{passive:!0}),document.documentElement.addEventListener(`pointerleave`,N);let B=e=>{e.preventDefault(),w=!0,cancelAnimationFrame(_),_=0},V=()=>z(e=>e+1);t.addEventListener(`webglcontextlost`,B),t.addEventListener(`webglcontextrestored`,V);let H=new ResizeObserver(()=>{D(),k()});H.observe(e);let U=new IntersectionObserver(e=>{S=e.some(e=>e.isIntersecting),k()});U.observe(e);let G=()=>{C=document.visibilityState!==`hidden`,k()};return document.addEventListener(`visibilitychange`,G),D(),k(),()=>{cancelAnimationFrame(_),L.current=null,H.disconnect(),U.disconnect(),window.removeEventListener(`pointermove`,j),window.removeEventListener(`pointerdown`,M),window.removeEventListener(`pointerup`,P),window.removeEventListener(`pointercancel`,P),document.documentElement.removeEventListener(`pointerleave`,N),document.removeEventListener(`visibilitychange`,G),t.removeEventListener(`webglcontextlost`,B),t.removeEventListener(`webglcontextrestored`,V),n.isContextLost()||(n.deleteBuffer(c),n.deleteVertexArray(s),n.deleteProgram(r.program))}},[R]),(0,i.jsx)(`div`,{ref:F,className:`relative h-full w-full overflow-hidden ${N}`.trim(),style:P,children:(0,i.jsx)(`canvas`,{ref:I,className:`absolute inset-0 block h-full w-full`,"aria-hidden":`true`})})};export{S as default};