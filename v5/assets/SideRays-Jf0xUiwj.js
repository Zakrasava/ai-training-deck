import{i as e,t}from"./react-sySUN5R7.js";import{O as n}from"./sculpture-dark-Cfb-XN1r.js";var r=e(t(),1),i=n(),a=24e5,o=Math.PI*2,s={"top-right":{flipX:0,flipY:0,side:0},"top-left":{flipX:1,flipY:0,side:0},"bottom-right":{flipX:0,flipY:1,side:0},"bottom-left":{flipX:1,flipY:1,side:0},right:{flipX:0,flipY:0,side:1},left:{flipX:1,flipY:0,side:1}},c=`#version 300 es
const vec2 corners[3] = vec2[3](vec2(-1.0, -1.0), vec2(3.0, -1.0), vec2(-1.0, 3.0));
void main() {
  gl_Position = vec4(corners[gl_VertexID], 0.0, 1.0);
}`,l=`#version 300 es
precision highp float;
uniform vec2 uResolution;
uniform float uTime;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uBlend;
uniform float uIntensity;
uniform float uSpread;
uniform float uDensity;
uniform float uSharpness;
uniform float uFalloff;
uniform float uGlow;
uniform float uSaturation;
uniform float uDust;
uniform float uOpacity;
uniform float uReveal;
uniform float uLight;
uniform vec3 uFrame;
uniform float uAim;
uniform vec3 uFocus;
uniform float uSway;
out vec4 fragColor;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = p - i;
  vec2 w = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, w.x), mix(c, d, w.x), w.y);
}

float shafts(float u, float t, float seed, float aa) {
  float sway = (0.4 * sin(t * 0.31 + seed) + 0.24 * sin(t * 0.17 + seed * 2.3)) * uSway;
  float n = 0.7 * noise(vec2(u + sway + seed, t * 0.3)) + 0.3 * noise(vec2(u * 2.4 + sway * 1.5 + seed * 1.7, t * 0.45 + 3.0));
  float width = mix(0.5, 0.1, uSharpness);
  float s = mix(smoothstep(0.5 - width, 0.5 + width, n), 0.5, aa);
  return mix(0.05, 1.0, s);
}

float motes(vec2 p, float cell, float t, float seed) {
  p += vec2(t * 0.021, -t * 0.013) + seed * 7.31;
  vec2 grid = p / cell;
  vec2 id = floor(grid);
  vec2 f = grid - id;
  float h = hash(id + seed);
  if (h > 0.5) return 0.0;
  vec2 center = 0.25 + 0.5 * vec2(hash(id + 1.7 + seed), hash(id + 3.1 + seed));
  center += 0.1 * vec2(sin(t * 0.7 + h * 31.0), cos(t * 0.6 + h * 23.0));
  float size = mix(0.035, 0.09, hash(id + 5.3 + seed));
  float edge = length(fwidth(grid)) * 0.7;
  float twinkle = 0.55 + 0.45 * sin(t * 1.9 + h * 41.0);
  return (1.0 - smoothstep(size - edge, size + edge, length(f - center))) * twinkle;
}

void main() {
  float aspect = uResolution.x / uResolution.y;
  vec2 q = (gl_FragCoord.xy - 0.5 * uResolution) / uResolution.y;
  if (uFrame.x > 0.5) q.x = -q.x;
  if (uFrame.y > 0.5) q.y = -q.y;
  vec2 source = uFrame.z > 0.5 ? vec2(aspect * 0.5 + 0.42, 0.3) : vec2(aspect * 0.5 + 0.1, 0.62);
  float heading = (uFrame.z > 0.5 ? 3.42 : -2.48) + uAim + 0.035 * sin(uTime * 0.21) * uSway;
  vec2 v = q - source;
  float r = length(v);
  float angle = mod(atan(v.y, v.x) - heading + 3.14159265, 6.28318531) - 3.14159265;
  float t = uTime;
  float u = angle * uDensity;
  float aa = smoothstep(0.12, 0.45, fwidth(u));
  float offset = uSpread * 0.22;
  float fanA = exp(-pow((angle + offset) / uSpread, 2.0) * 1.4);
  float fanB = exp(-pow((angle - offset) / (uSpread * 1.15), 2.0) * 1.4);
  float focus = 1.0 + uFocus.z * exp(-pow((angle - uFocus.x) / uFocus.y, 2.0));
  float lightA = fanA * shafts(u, t, 0.0, aa) * focus;
  float lightB = fanB * shafts(u * 0.83, t * 0.6, 17.0, aa) * focus;
  float reach = 1.0 / (1.0 + pow(r / 0.4, uFalloff));
  vec3 glowColor = mix(uColorA, uColorB, uBlend);
  vec3 light = (uColorA * lightA * (1.0 - uBlend) + uColorB * lightB * uBlend) * 2.0 * reach;
  light += glowColor * uGlow * exp(-pow(r / 0.4, 2.0));
  if (uDust > 0.0) {
    float sparkle = motes(q, 0.06, t, 0.0) + 0.7 * motes(q, 0.038, t * 0.8, 9.0);
    light += mix(glowColor, vec3(1.0), 0.6) * sparkle * (lightA + lightB) * reach * uDust * 2.5;
  }
  light *= uIntensity * (1.0 - smoothstep(uReveal * 2.6 - 0.45, uReveal * 2.6, r)) * smoothstep(0.0, 0.35, uReveal);
  float gray = dot(light, vec3(0.2126, 0.7152, 0.0722));
  light = max(mix(vec3(gray), light, uSaturation), 0.0);
  float peak = max(light.r, max(light.g, light.b));
  float grain = (fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715)))) - 0.5) / 255.0;
  if (uLight > 0.5) {
    vec3 ink = pow(light / max(peak, 1e-4), vec3(2.0)) * 0.75;
    float alpha = clamp(pow(1.0 - exp(-peak * 2.6), 2.5) * 0.9 * uOpacity + grain, 0.0, 1.0);
    fragColor = vec4(pow(ink, vec3(1.0 / 2.2)) * alpha, alpha);
    return;
  }
  float mapped = 1.0 - exp(-peak);
  vec3 tone = light * (mapped / max(peak, 1e-4));
  tone = mix(tone, vec3(mapped), smoothstep(0.7, 1.0, mapped) * 0.55);
  vec3 shown = clamp(tone * uOpacity, 0.0, 1.0);
  float alpha = max(shown.r, max(shown.g, shown.b));
  vec3 color = clamp(shown * alpha + grain, 0.0, 1.0);
  fragColor = vec4(min(color, vec3(alpha)), alpha);
}`,u=(e,t,n)=>Math.min(n,Math.max(t,e)),d=e=>((e+Math.PI)%o+o)%o-Math.PI,f=e=>{let t=String(e||``).trim(),n=/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(t);if(n){let e=n[1].length===3?n[1].replace(/./g,e=>e+e):n[1];return[0,2,4].map(t=>parseInt(e.slice(t,t+2),16)/255)}let r=/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i.exec(t);return r?[r[1],r[2],r[3]].map(e=>u(parseFloat(e)/255,0,1)):[1,1,1]},p=(e,t)=>({source:e.side?[t*.5+.42,.3]:[t*.5+.1,.62],heading:e.side?3.42:-2.48}),m=(e,t,n)=>{let r=e.createShader(t);return r?(e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(console.error(e.getShaderInfoLog(r)),e.deleteShader(r),null)):null},h=e=>{let t=m(e,e.VERTEX_SHADER,c),n=m(e,e.FRAGMENT_SHADER,l),r=t&&n?e.createProgram():null;if(!t||!n||!r)return t&&e.deleteShader(t),n&&e.deleteShader(n),null;if(e.attachShader(r,t),e.attachShader(r,n),e.linkProgram(r),e.deleteShader(t),e.deleteShader(n),!e.getProgramParameter(r,e.LINK_STATUS))return console.error(e.getProgramInfoLog(r)),e.deleteProgram(r),null;let i={},a=e.getProgramParameter(r,e.ACTIVE_UNIFORMS);for(let t=0;t<a;t++){let n=e.getActiveUniform(r,t);n&&(i[n.name]=e.getUniformLocation(r,n.name))}return{program:r,uniforms:i}},g=({rayColor1:e=`#FFC46B`,rayColor2:t=`#96c8ff`,blend:n=.6,origin:o=`top-right`,speed:c=2.5,intensity:l=2,spread:m=2,density:g=5,sharpness:_=.5,tilt:v=0,falloff:y=1.6,glow:b=1,saturation:x=1,dust:S=0,followMouse:C=!0,mouseInfluence:w=.5,intro:T=!0,lightMode:E=!1,opacity:D=1,maxDevicePixelRatio:O=2,className:k=``,style:A})=>{let j=(0,r.useRef)(null),M=(0,r.useRef)(null),N=(0,r.useRef)(null),[P,F]=(0,r.useState)(0),I={colorA:f(e),colorB:f(t),blend:u(n,0,1),frame:s[o]??s[`top-right`],speed:Math.max(0,c)*.4,intensity:Math.max(0,l)*.75,spread:u(m,.1,8)*.225,density:u(g,1,40),sharpness:u(_,0,1),tilt:u(v,-180,180)*Math.PI/180,falloff:u(y,.2,6),glow:Math.max(0,b)*1.2,saturation:Math.max(0,x),dust:u(S,0,1),followMouse:C,mouseInfluence:u(w,0,1),intro:T,light:E,opacity:u(D,0,1),maxRatio:u(O,.5,3)},L=(0,r.useRef)(I);return L.current=I,(0,r.useEffect)(()=>{N.current?.()}),(0,r.useEffect)(()=>{let e=j.current,t=M.current;if(!e||!t)return;let n=t.getContext(`webgl2`,{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1,powerPreference:`high-performance`}),r=n?h(n):null;if(!n||!r)return;let i=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,o=n.createVertexArray(),s={width:1,height:1},c={x:0,y:0,inside:!1},l={value:0,velocity:0},f={angle:0,strength:0},m=Math.random()*100,g=L.current.intro&&!i&&P===0?0:1,_=0,v=0,y=!0,b=document.visibilityState!==`hidden`,x=!1,S=()=>{let n=L.current,r=e.getBoundingClientRect(),i=Math.max(1,r.width),o=Math.max(1,r.height),c=Math.min(window.devicePixelRatio||1,n.maxRatio,Math.sqrt(a/(i*o))),l=Math.max(1,Math.round(i*c)),u=Math.max(1,Math.round(o*c));(t.width!==l||t.height!==u)&&(t.width=l,t.height=u),s.width=i,s.height=o},C=e=>{let t=(c.x-s.width/2)/s.height,n=(s.height/2-c.y)/s.height;e.frame.flipX&&(t=-t),e.frame.flipY&&(n=-n);let{source:r,heading:i}=p(e.frame,s.width/s.height);return d(Math.atan2(n-r[1],t-r[0])-i-e.tilt)},w=e=>{if(_=0,x)return;let a=L.current,s=u((e-v)/1e3||0,0,.05);v=Math.max(v,e),m+=s*a.speed*(i?.3:1),g<1&&(g=Math.min(1,g+s/1.6));let d=a.followMouse&&c.inside&&!i,p=d?C(a):0,h=d?u(p,-a.spread,a.spread)*a.mouseInfluence:0,S=d?a.mouseInfluence:0,T=1-Math.exp(-s*6);d&&(f.angle+=(u(p-l.value,-a.spread*1.5,a.spread*1.5)-f.angle)*T),f.strength+=(S-f.strength)*T;let E=2*Math.sqrt(18);l.velocity+=((h-l.value)*18-l.velocity*E)*s,l.value+=l.velocity*s,n.viewport(0,0,t.width,t.height),n.useProgram(r.program),n.bindVertexArray(o);let D=r.uniforms;n.uniform2f(D.uResolution,t.width,t.height),n.uniform1f(D.uTime,m),n.uniform3f(D.uColorA,a.colorA[0],a.colorA[1],a.colorA[2]),n.uniform3f(D.uColorB,a.colorB[0],a.colorB[1],a.colorB[2]),n.uniform1f(D.uBlend,a.blend),n.uniform1f(D.uIntensity,a.intensity),n.uniform1f(D.uSpread,a.spread),n.uniform1f(D.uDensity,a.density),n.uniform1f(D.uSharpness,a.sharpness),n.uniform1f(D.uFalloff,a.falloff),n.uniform1f(D.uGlow,a.glow),n.uniform1f(D.uSaturation,a.saturation),n.uniform1f(D.uDust,a.dust),n.uniform1f(D.uOpacity,a.opacity),n.uniform1f(D.uReveal,1-(1-g)**3),n.uniform1f(D.uLight,+!!a.light),n.uniform3f(D.uFrame,a.frame.flipX,a.frame.flipY,a.frame.side),n.uniform1f(D.uAim,a.tilt+l.value),n.uniform3f(D.uFocus,f.angle,Math.max(.06,a.spread*.25),f.strength*1.4),n.uniform1f(D.uSway,+!i),n.drawArrays(n.TRIANGLES,0,3);let O=Math.abs(h-l.value)>1e-4||Math.abs(l.velocity)>1e-4||Math.abs(S-f.strength)>.001;(a.speed>0&&!i||g<1||O)&&y&&b&&(_=requestAnimationFrame(w))},T=()=>{!_&&!x&&y&&b&&(v=performance.now(),_=requestAnimationFrame(w))};N.current=()=>{S(),T()};let E=t=>{let n=e.getBoundingClientRect();c.x=t.clientX-n.left,c.y=t.clientY-n.top,c.inside=t.clientX>=n.left&&t.clientX<=n.right&&t.clientY>=n.top&&t.clientY<=n.bottom,T()},D=()=>{c.inside=!1,T()},O=e=>{e.pointerType!==`mouse`&&D()};window.addEventListener(`pointermove`,E,{passive:!0}),window.addEventListener(`pointerup`,O,{passive:!0}),window.addEventListener(`pointercancel`,O,{passive:!0}),document.documentElement.addEventListener(`pointerleave`,D);let k=e=>{e.preventDefault(),x=!0,cancelAnimationFrame(_),_=0},A=()=>F(e=>e+1);t.addEventListener(`webglcontextlost`,k),t.addEventListener(`webglcontextrestored`,A);let I=new ResizeObserver(()=>{S(),T()});I.observe(e);let R=new IntersectionObserver(e=>{y=e.some(e=>e.isIntersecting),T()});R.observe(e);let z=()=>{b=document.visibilityState!==`hidden`,T()};return document.addEventListener(`visibilitychange`,z),S(),T(),()=>{cancelAnimationFrame(_),N.current=null,I.disconnect(),R.disconnect(),window.removeEventListener(`pointermove`,E),window.removeEventListener(`pointerup`,O),window.removeEventListener(`pointercancel`,O),document.documentElement.removeEventListener(`pointerleave`,D),document.removeEventListener(`visibilitychange`,z),t.removeEventListener(`webglcontextlost`,k),t.removeEventListener(`webglcontextrestored`,A),n.isContextLost()||(n.deleteVertexArray(o),n.deleteProgram(r.program))}},[P]),(0,i.jsx)(`div`,{ref:j,className:`pointer-events-none relative h-full w-full overflow-hidden ${k}`.trim(),style:A,children:(0,i.jsx)(`canvas`,{ref:M,className:`absolute inset-0 block h-full w-full`,"aria-hidden":`true`})})};export{g as default};