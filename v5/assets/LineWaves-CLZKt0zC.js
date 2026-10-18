import{i as e,t}from"./react-sySUN5R7.js";import{O as n}from"./sculpture-dark-Cfb-XN1r.js";var r=e(t(),1),i=n(),a=24e5,o=4,s=`#version 300 es
const vec2 corners[3] = vec2[3](vec2(-1.0, -1.0), vec2(3.0, -1.0), vec2(-1.0, 3.0));
void main() {
  gl_Position = vec4(corners[gl_VertexID], 0.0, 1.0);
}`,c=`#version 300 es
precision highp float;
uniform vec2 uResolution;
uniform float uPixel;
uniform float uTime;
uniform float uLines;
uniform float uWidth;
uniform float uGlow;
uniform float uBrightness;
uniform float uHighlight;
uniform float uHighlightWidth;
uniform float uWarp;
uniform float uScale;
uniform float uRotation;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform float uCycle;
uniform float uEdge;
uniform vec4 uMouse;
uniform vec4 uRipples[${o}];
uniform float uReveal;
uniform float uLight;
uniform float uOpacity;
out vec4 fragColor;

vec2 rotate(vec2 p, float a) {
  float c = cos(a);
  float s = sin(a);
  return vec2(c * p.x - s * p.y, s * p.x + c * p.y);
}

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = p - i;
  vec2 w = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), w.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), w.x), w.y);
}

float smootherstep(float edge0, float edge1, float x) {
  float t = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

float bend(vec2 p, float t) {
  vec2 q = p * 2.0 / uScale;
  float w = 0.6 * sin(q.x * 0.55 + t * 0.4 + 0.6 * sin(q.y * 0.9 - t * 0.28));
  w += 0.21 * sin(q.x * 1.3 - t * 0.33 + q.y * 0.8 + 1.3);
  w += 0.12 * sin(q.y * 2.3 + q.x * 0.9 - t * 0.37 + 0.4);
  return w * uWarp * uScale * 0.46;
}

float river(vec2 p, float y, float t) {
  float drift = 0.7 * (0.18 * sin(p.x * 1.6 - t * 0.33 + 0.7) + 0.1 * sin(p.x * 3.1 + t * 0.21));
  float center = 0.5 * (0.2 * sin(t * 0.17) + 0.08 * sin(t * 0.29 + 1.3));
  float width = 0.13 * uHighlightWidth;
  float near = (y - center - drift) / width;
  float far = (y + 0.22 * sin(t * 0.13 + 2.0) - drift * 0.6 + 0.3) / (width * 0.55);
  return max(exp(-near * near), exp(-far * far) * 0.7);
}

vec3 palette(float x) {
  x = fract(x) * 3.0;
  if (x < 1.0) return mix(uColor1, uColor2, smoothstep(0.0, 1.0, x));
  if (x < 2.0) return mix(uColor2, uColor3, smoothstep(1.0, 2.0, x));
  return mix(uColor3, uColor1, smoothstep(2.0, 3.0, x));
}

void main() {
  float aspect = uResolution.x / uResolution.y;
  vec2 uv = gl_FragCoord.xy / uResolution;
  vec2 p = rotate((gl_FragCoord.xy - 0.5 * uResolution) / uResolution.y, uRotation);
  float t = uTime;

  vec2 mouse = rotate(uMouse.xy, uRotation);
  vec2 toMouse = p - mouse;
  float lens = exp(-dot(toMouse, toMouse) / (uMouse.w * uMouse.w));
  p.y -= (p.y - mouse.y) * lens * uMouse.z;

  float ring = 0.0;
  for (int i = 0; i < ${o}; i++) {
    vec4 ripple = uRipples[i];
    if (ripple.w <= 0.0) continue;
    float x = (length(p - rotate(ripple.xy, uRotation)) - ripple.z * 0.6) / 0.08;
    float fade = exp(-ripple.z * 1.3) * smoothstep(0.0, 0.12, ripple.z);
    float bump = exp(-x * x);
    p.y -= x * bump * 0.07 * fade;
    ring += bump * fade;
  }

  float w = bend(p, t);
  float y = p.y + w;
  float phi = y * uLines;
  float fw = max(fwidth(phi), 1e-5);
  float crowd = smoothstep(0.18, 0.5, fw);

  float fold = smoothstep(1.3, 2.2, fw * uResolution.y / uLines);
  float shimmer = mix(1.0, smoothstep(0.15, 0.85, noise(vec2(y * 1.6 + t * 0.07, p.x * 0.55 - t * 0.22))), 0.5);
  float lit = max(river(p, y, t), fold * 0.9) * shimmer;
  float light = mix(1.0, 0.07 + 0.93 * lit, uHighlight);
  light += (1.0 - light) * min(lens * step(0.0001, uMouse.z) * 0.9 + ring * 0.6, 1.0);

  float dist = abs(fract(phi + 0.5) - 0.5) / fw;
  float width = uWidth * uPixel * (1.0 + mix(1.5, 0.6, uLight) * lit * uHighlight);
  float cover = clamp(min(dist + width * 0.5, 0.5) - max(dist - width * 0.5, -0.5), 0.0, 1.0);
  cover = mix(cover, min(width * fw, 1.0), crowd);
  float halo = exp(-dist / (2.2 * uPixel)) * (1.0 - crowd) * uGlow;
  float thread = mix(1.0, 0.55 + 0.45 * hash(vec2(floor(phi + 0.5), 7.3)), 0.45 * (1.0 - crowd));

  float span = 0.5 * sqrt(aspect * aspect + 1.0);
  float sweep = -span + (2.0 * span + 0.6) * uReveal;
  float reveal = 1.0 - smoothstep(sweep - 0.6, sweep, p.x);

  float edge = 1.0;
  if (uEdge > 0.0) {
    float ex = min(uv.x, 1.0 - uv.x) * aspect;
    float ey = min(uv.y, 1.0 - uv.y);
    edge = smootherstep(0.0, uEdge * 0.5, ex) * smootherstep(0.0, uEdge * 0.5, ey);
  }

  vec3 tint = palette(y * 0.3 + p.x * 0.2 + uCycle);
  float grain = (fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715)))) - 0.5) / 255.0;

  if (uLight > 0.5) {
    float low = min(tint.r, min(tint.g, tint.b));
    float chroma = max(tint.r, max(tint.g, tint.b)) - low;
    vec3 hue = (tint - low) / max(chroma, 1e-3);
    vec3 ink = mix(vec3(0.08), hue * 0.56 + 0.06, smoothstep(0.04, 0.2, chroma));
    float alpha = (cover + halo * 0.35) * thread * light * uBrightness * reveal * edge * 0.78 * uOpacity;
    alpha = clamp(alpha + grain, 0.0, 1.0);
    fragColor = vec4(ink * alpha, alpha);
    return;
  }

  float strength = (cover + halo) * thread * light * uBrightness * reveal * edge;
  vec3 color = clamp(tint * strength * uOpacity, 0.0, 1.0);
  float alpha = max(color.r, max(color.g, color.b));
  color = clamp(color + grain, 0.0, 1.0);
  fragColor = vec4(min(color, vec3(alpha)), alpha);
}`,l=(e,t,n)=>Math.min(n,Math.max(t,e)),u=e=>{let t=String(e||``).trim(),n=/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(t);if(n){let e=n[1].length===3?n[1].replace(/./g,e=>e+e):n[1];return[0,2,4].map(t=>parseInt(e.slice(t,t+2),16)/255)}let r=/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i.exec(t);return r?[r[1],r[2],r[3]].map(e=>l(parseFloat(e)/255,0,1)):[1,1,1]},d=(e,t,n)=>{let r=e.createShader(t);return r?(e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(console.error(e.getShaderInfoLog(r)),e.deleteShader(r),null)):null},f=e=>{let t=d(e,e.VERTEX_SHADER,s),n=d(e,e.FRAGMENT_SHADER,c),r=t&&n?e.createProgram():null;if(!t||!n||!r)return t&&e.deleteShader(t),n&&e.deleteShader(n),null;if(e.attachShader(r,t),e.attachShader(r,n),e.linkProgram(r),e.deleteShader(t),e.deleteShader(n),!e.getProgramParameter(r,e.LINK_STATUS))return console.error(e.getProgramInfoLog(r)),e.deleteProgram(r),null;let i={},a=e.getProgramParameter(r,e.ACTIVE_UNIFORMS);for(let t=0;t<a;t++){let n=e.getActiveUniform(r,t);n&&(i[n.name.replace(/\[0\]$/,``)]=e.getUniformLocation(r,n.name))}return{program:r,uniforms:i}},p=({color1:e=`#ffffff`,color2:t=`#ffffff`,color3:n=`#ffffff`,colorCycleSpeed:s=1,speed:c=.3,lineCount:d=72,lineWidth:p=1.3,glow:m=.6,brightness:h=1,highlight:g=1,highlightWidth:_=1,warpIntensity:v=1,warpScale:y=1,rotation:b=-33,edgeFade:x=0,enableMouseInteraction:S=!0,mouseInfluence:C=2,clickRipple:w=!0,intro:T=!0,lightMode:E=!1,opacity:D=1,maxDevicePixelRatio:O=2,className:k=``,style:A})=>{let j=(0,r.useRef)(null),M=(0,r.useRef)(null),N=(0,r.useRef)(null),[P,F]=(0,r.useState)(0),I={color1:u(e),color2:u(t),color3:u(n),cycleSpeed:s,speed:Math.max(0,c),lines:l(d,2,400),width:l(p,.25,12),glow:Math.max(0,m),brightness:Math.max(0,h),highlight:l(g,0,1),highlightWidth:l(_,.2,5),warp:l(v,0,3),scale:l(y,.2,4),rotation:b*Math.PI/180,edge:l(x,0,1),mouse:S,influence:l(C,0,3),clickRipple:w,intro:T,light:E,opacity:l(D,0,1),maxRatio:l(O,.5,3)},L=(0,r.useRef)(I);return L.current=I,(0,r.useEffect)(()=>{N.current?.()}),(0,r.useEffect)(()=>{let e=j.current,t=M.current;if(!e||!t)return;let n=t.getContext(`webgl2`,{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1,powerPreference:`high-performance`}),r=n?f(n):null;if(!n||!r)return;let i=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,s=n.createVertexArray(),c={width:1,height:1,ratio:1},u={x:0,y:0,inside:!1},d={x:0,y:0,presence:0,ready:!1},p=[],m=new Float32Array(16),h=Math.random()*60,g=0,_=L.current.intro&&!i&&P===0?0:1,v=0,y=0,b=!0,x=document.visibilityState!==`hidden`,S=!1,C=()=>{let n=L.current,r=e.getBoundingClientRect(),i=Math.max(1,r.width),o=Math.max(1,r.height),s=Math.min(window.devicePixelRatio||1,n.maxRatio,Math.sqrt(a/(i*o))),l=Math.max(1,Math.round(i*s)),u=Math.max(1,Math.round(o*s));(t.width!==l||t.height!==u)&&(t.width=l,t.height=u),c.width=i,c.height=o,c.ratio=l/i},w=(e,t)=>[(e-c.width/2)/c.height,(c.height/2-t)/c.height],T=e=>{if(v=0,S)return;let a=L.current,o=l((e-y)/1e3||0,0,.05);y=Math.max(y,e),h+=o*a.speed*2.5*(i?.25:1),g+=o*a.speed*a.cycleSpeed*.05,_<1&&(_=Math.min(1,_+o/1.8));let f=a.mouse&&u.inside&&!i;if(f){let[e,t]=w(u.x,u.y);d.ready||(d.x=e,d.y=t,d.ready=!0);let n=1-Math.exp(-o*10);d.x+=(e-d.x)*n,d.y+=(t-d.y)*n}let C=+!!f;d.presence+=(C-d.presence)*(1-Math.exp(-o*5)),d.presence<.002&&!f&&(d.ready=!1);for(let e=p.length-1;e>=0;e--)p[e].age+=o,p[e].age>2.6&&p.splice(e,1);m.fill(0),p.forEach((e,t)=>{m[t*4]=e.x,m[t*4+1]=e.y,m[t*4+2]=e.age,m[t*4+3]=1});let E=1-(1-_)**3;n.viewport(0,0,t.width,t.height),n.useProgram(r.program),n.bindVertexArray(s);let D=r.uniforms;n.uniform2f(D.uResolution,t.width,t.height),n.uniform1f(D.uPixel,c.ratio),n.uniform1f(D.uTime,h),n.uniform1f(D.uLines,a.lines),n.uniform1f(D.uWidth,a.width),n.uniform1f(D.uGlow,a.glow),n.uniform1f(D.uBrightness,a.brightness),n.uniform1f(D.uHighlight,a.highlight),n.uniform1f(D.uHighlightWidth,a.highlightWidth),n.uniform1f(D.uWarp,a.warp*(.25+.75*E)),n.uniform1f(D.uScale,a.scale),n.uniform1f(D.uRotation,a.rotation),n.uniform3f(D.uColor1,a.color1[0],a.color1[1],a.color1[2]),n.uniform3f(D.uColor2,a.color2[0],a.color2[1],a.color2[2]),n.uniform3f(D.uColor3,a.color3[0],a.color3[1],a.color3[2]),n.uniform1f(D.uCycle,g),n.uniform1f(D.uEdge,a.edge),n.uniform4f(D.uMouse,d.x,d.y,d.presence*a.influence*.16,.2),n.uniform4fv(D.uRipples,m),n.uniform1f(D.uReveal,E),n.uniform1f(D.uLight,+!!a.light),n.uniform1f(D.uOpacity,a.opacity),n.drawArrays(n.TRIANGLES,0,3);let O=Math.abs(C-d.presence)>.002;(a.speed>0&&!i||_<1||O||p.length>0||f)&&b&&x&&(v=requestAnimationFrame(T))},E=()=>{!v&&!S&&b&&x&&(y=performance.now(),v=requestAnimationFrame(T))};N.current=()=>{C(),E()};let D=t=>{let n=e.getBoundingClientRect();return{x:t.clientX-n.left,y:t.clientY-n.top,inside:t.clientX>=n.left&&t.clientX<=n.right&&t.clientY>=n.top&&t.clientY<=n.bottom}},O=e=>{let t=D(e);u.x=t.x,u.y=t.y,u.inside=t.inside,E()},k=e=>{let t=L.current,n=D(e);if(!n.inside||!t.clickRipple||i)return;let[r,a]=w(n.x,n.y);p.push({x:r,y:a,age:0}),p.length>o&&p.shift(),E()},A=()=>{u.inside=!1,E()},I=e=>{e.pointerType!==`mouse`&&A()};window.addEventListener(`pointermove`,O,{passive:!0}),window.addEventListener(`pointerdown`,k,{passive:!0}),window.addEventListener(`pointerup`,I,{passive:!0}),window.addEventListener(`pointercancel`,I,{passive:!0}),document.documentElement.addEventListener(`pointerleave`,A);let R=e=>{e.preventDefault(),S=!0,cancelAnimationFrame(v),v=0},z=()=>F(e=>e+1);t.addEventListener(`webglcontextlost`,R),t.addEventListener(`webglcontextrestored`,z);let B=new ResizeObserver(()=>{C(),E()});B.observe(e);let V=new IntersectionObserver(e=>{b=e.some(e=>e.isIntersecting),E()});V.observe(e);let H=()=>{x=document.visibilityState!==`hidden`,E()};return document.addEventListener(`visibilitychange`,H),C(),E(),()=>{cancelAnimationFrame(v),N.current=null,B.disconnect(),V.disconnect(),window.removeEventListener(`pointermove`,O),window.removeEventListener(`pointerdown`,k),window.removeEventListener(`pointerup`,I),window.removeEventListener(`pointercancel`,I),document.documentElement.removeEventListener(`pointerleave`,A),document.removeEventListener(`visibilitychange`,H),t.removeEventListener(`webglcontextlost`,R),t.removeEventListener(`webglcontextrestored`,z),n.isContextLost()||(n.deleteVertexArray(s),n.deleteProgram(r.program))}},[P]),(0,i.jsx)(`div`,{ref:j,className:`relative h-full w-full overflow-hidden ${k}`.trim(),style:A,children:(0,i.jsx)(`canvas`,{ref:M,className:`absolute inset-0 block h-full w-full`,"aria-hidden":`true`})})};export{p as default};