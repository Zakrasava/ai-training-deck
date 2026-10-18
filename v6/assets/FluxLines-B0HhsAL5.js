import{i as e,t}from"./react-sySUN5R7.js";import{k as n}from"./sculpture-dark-CKiqtzhU.js";var r=e(t(),1),i=n(),a=8,o=1.8,s={up:[0,1],down:[0,-1],left:[-1,0],right:[1,0]},c=`#version 300 es
in vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`,l=`#version 300 es
precision highp float;
precision highp int;
uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uFlow;
uniform float uSpeed;
uniform float uScale;
uniform float uTurbulence;
uniform float uFluidity;
uniform float uRimWidth;
uniform float uSharpness;
uniform float uShimmer;
uniform float uGlow;
uniform float uLine;
uniform float uMaxHalf;
uniform vec3 uColors[${a}];
uniform int uColorCount;
uniform vec4 uMagnet;
uniform vec4 uSwirl;
uniform float uReveal;
uniform float uLight;
uniform float uOpaque;
uniform vec3 uBackground;
uniform float uOpacity;
out vec4 outColor;

float hash(vec3 p3) {
  p3 = fract(p3 * 0.1031);
  p3 += dot(p3, p3.zyx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float smin(float a, float b, float k) {
  float r = exp2(-a / k) + exp2(-b / k);
  return -k * log2(r);
}

float sinlerp(float a, float b, float w) {
  return mix(a, b, (sin(w * 3.14159265 - 3.14159265 / 2.0) + 1.0) / 2.0);
}

float vn(vec2 p, float s, float seed) {
  vec2 cellp = floor(p / s);
  vec2 relp = mod(p, s);
  float g1 = hash(vec3(cellp, seed));
  float g2 = hash(vec3(cellp.x + 1.0, cellp.y, seed));
  float g3 = hash(vec3(cellp.x + 1.0, cellp.y + 1.0, seed));
  float g4 = hash(vec3(cellp.x, cellp.y + 1.0, seed));
  float bx = sinlerp(g1, g2, relp.x / s);
  float tx = sinlerp(g4, g3, relp.x / s);
  return sinlerp(bx, tx, relp.y / s);
}

float dbn(vec2 p, float s, float seed) {
  float o = s / 2.0;
  float n0 = vn(p, s, seed);
  float n1 = vn(p + vec2(o, o), s, seed + 0.1);
  float n2 = vn(p + vec2(-o, o), s, seed + 0.2);
  float n3 = vn(p + vec2(o, -o), s, seed + 0.3);
  float n4 = vn(p + vec2(-o, -o), s, seed + 0.4);
  return (2.0 * n0 + 1.5 * n1 + 1.25 * n2 + 1.125 * n3 + n4) / 7.0;
}


vec3 palette(float h) {
  float x = clamp(h, 0.0, 1.0) * float(uColorCount - 1);
  int i = int(floor(x));
  int j = min(i + 1, uColorCount - 1);
  return mix(uColors[i], uColors[j], smoothstep(0.0, 1.0, x - float(i)));
}

void main() {
  float ref = 700.0 / max(uScale, 0.05);
  vec2 frag = gl_FragCoord.xy;
  vec2 toMagnet = (frag - uMagnet.xy) / uResolution.y;
  float pull = uMagnet.z * exp(-dot(toMagnet, toMagnet) / (uMagnet.w * uMagnet.w));
  if (pull > 0.001) {
    float angle = pull * 0.55;
    float c = cos(angle);
    float s = sin(angle);
    frag = uMagnet.xy + mat2(c, s, -s, c) * (frag - uMagnet.xy);
  }
  if (uSwirl.w > 0.0) {
    vec2 d = frag - uSwirl.xy;
    float reach = uSwirl.z;
    float angle = uSwirl.w * exp(-dot(d, d) / (reach * reach));
    float c = cos(angle);
    float s = sin(angle);
    frag = uSwirl.xy + mat2(c, s, -s, c) * d;
  }
  vec2 p = frag / uResolution.y * ref;

  float spd = 200.0 * uSpeed;
  float t = uTime;
  vec2 dir = uFlow;
  vec2 perp = vec2(-dir.y, dir.x);
  float distort1 = vn(p + perp * (t * spd), 60.0, 10.0) * 50.0 * uTurbulence;
  float distort2 = vn(p - perp * (t * spd), 120.0, 15.0) * 100.0 * uTurbulence;
  float peaks = dbn(p + distort1 + dir * (t * spd * 0.5), 40.0, 1.0);
  float peaks2 = dbn(p + distort2 - dir * (t * spd * 0.5), 40.0, 0.0);
  float field = smin(peaks, peaks2, max(uFluidity, 0.001));

  float slope = length(vec2(dFdx(field), dFdy(field)));
  float gap = abs(field - 0.4);
  float pixels = gap / max(slope, 1e-6);
  float halfBand = max(uRimWidth, 0.001) * 0.5;
  float across = max(gap / halfBand, pixels / uMaxHalf);
  float band = 5.0 * uRimWidth * (1.0 - across);
  float reveal = smoothstep(0.2, 0.85, pull);
  float shimmer = vn(p + dir * (t * spd * 0.5), 60.0, 12.0) * uShimmer * (1.0 - reveal * 0.75);
  float lit = clamp(band - shimmer, 0.0, 1.0);
  float glow = pow(lit, uSharpness) * uGlow * (1.0 + reveal * 0.25);
  float core = uLine > 0.0 ? smoothstep(uLine + 0.75, uLine - 0.75, pixels) * max(smoothstep(0.08, 0.6, glow), reveal) : 0.0;
  float shine = clamp(glow, 0.0, 1.0);
  float energy = max(shine * shine, core * 0.85) * uReveal;

  float h = clamp(0.5 + (peaks - peaks2) * 0.8, 0.0, 1.0);
  vec3 tint = palette(h);

  if (uLight > 0.5) {
    float chroma = max(tint.r, max(tint.g, tint.b)) - min(tint.r, min(tint.g, tint.b));
    vec3 ink = mix(vec3(0.07, 0.07, 0.08), tint * 0.55, clamp(chroma * 1.6, 0.0, 1.0));
    float cover = energy * uOpacity;
    outColor = uOpaque > 0.5 ? vec4(mix(uBackground, ink, cover), 1.0) : vec4(ink * cover, cover);
    return;
  }

  vec3 light = tint * energy * uOpacity;
  outColor = uOpaque > 0.5 ? vec4(uBackground + light, 1.0) : vec4(light, max(light.r, max(light.g, light.b)));
}`,u=(e,t,n)=>Math.min(n,Math.max(t,e)),d=(e,t,n)=>{let r=e.createShader(t);return r?(e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(e.deleteShader(r),null)):null},f=e=>{let t=d(e,e.VERTEX_SHADER,c),n=d(e,e.FRAGMENT_SHADER,l),r=e.createProgram();if(!t||!n||!r)return null;if(e.attachShader(r,t),e.attachShader(r,n),e.bindAttribLocation(r,0,`aPosition`),e.linkProgram(r),e.deleteShader(t),e.deleteShader(n),!e.getProgramParameter(r,e.LINK_STATUS))return e.deleteProgram(r),null;let i={},a=e.getProgramParameter(r,e.ACTIVE_UNIFORMS);for(let t=0;t<a;t++){let n=e.getActiveUniform(r,t);n&&(i[n.name.replace(`[0]`,``)]=e.getUniformLocation(r,n.name))}return{program:r,uniforms:i}},p=({colors:e=[`#ffffff`,`#ffffff`,`#ffffff`],speed:t=.5,scale:n=1.6,turbulence:c=1,fluidity:l=.1,rimWidth:d=.2,sharpness:p=2.5,shimmer:m=1.5,glow:h=2,lineWidth:g=1,flowDirection:_=`down`,opacity:v=1,mouseInteraction:y=!0,mouseStrength:b=1,mouseRadius:x=.35,mouseDampening:S=.15,clickSwirl:C=!0,intro:w=!0,lightMode:T=!1,transparent:E=!0,backgroundColor:D,paused:O=!1,dpr:k,mixBlendMode:A,className:j=``,style:M,...N})=>{let P=(0,r.useRef)(null),F=(0,r.useRef)(null),I=(0,r.useRef)(null),L={colors:Array.isArray(e)&&e.length?e.slice(0,a):[`#ffffff`],speed:t,scale:Math.max(.05,n),turbulence:c,fluidity:Math.max(.001,l),rimWidth:Math.max(.001,d),sharpness:Math.max(.1,p),shimmer:Math.max(0,m),glow:Math.max(0,h),lineWidth:Math.max(0,g),flow:s[_]??s.down,opacity:u(v,0,1),mouseInteraction:y,mouseStrength:Math.max(0,b),mouseRadius:Math.max(.01,x),mouseDampening:Math.max(0,S),clickSwirl:C,intro:w,lightMode:T,transparent:E,backgroundColor:D,paused:O,dpr:k},R=(0,r.useRef)(L);return R.current=L,(0,r.useEffect)(()=>{let e=P.current,t=F.current,n=t?.getContext(`webgl2`,{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1});if(!e||!t||!n)return;let r=f(n);if(!r)return;let i=r.uniforms,a=n.createBuffer(),s=n.createVertexArray();n.bindVertexArray(s),n.bindBuffer(n.ARRAY_BUFFER,a),n.bufferData(n.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),n.STATIC_DRAW),n.enableVertexAttribArray(0),n.vertexAttribPointer(0,2,n.FLOAT,!1,0,0);let c=document.createElement(`canvas`).getContext(`2d`,{willReadFrequently:!0}),l=new Map,d=(e,t)=>{if(!e)return t;let n=String(e),r=l.get(n);if(r)return r;let i=t;if(c){c.clearRect(0,0,1,1),c.fillStyle=`#000000`,c.fillStyle=n,c.fillRect(0,0,1,1);let[e,t,r]=c.getImageData(0,0,1,1).data;i=[e/255,t/255,r/255]}return l.set(n,i),i},p=new Float32Array(24),m=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches??!1,h={x:0,y:0,inside:!1},g={x:0,y:0,active:0},_={x:0,y:0,age:10},v=0,y=R.current.intro&&!m?0:1,b=0,x=0,S=!0,C=()=>{let a=R.current,o=t.width/Math.max(1,e.clientWidth);a.colors.forEach((e,t)=>p.set(d(e,[1,1,1]),t*3));let c=Math.min(1,y);n.viewport(0,0,t.width,t.height),n.useProgram(r.program),n.bindVertexArray(s),n.uniform2f(i.uResolution,t.width,t.height),n.uniform1f(i.uTime,v),n.uniform2f(i.uFlow,a.flow[0],a.flow[1]),n.uniform1f(i.uSpeed,a.speed),n.uniform1f(i.uScale,a.scale),n.uniform1f(i.uTurbulence,a.turbulence),n.uniform1f(i.uFluidity,a.fluidity),n.uniform1f(i.uRimWidth,a.rimWidth),n.uniform1f(i.uSharpness,a.sharpness),n.uniform1f(i.uShimmer,a.shimmer),n.uniform1f(i.uGlow,a.glow),n.uniform1f(i.uLine,a.lineWidth*o*.5),n.uniform1f(i.uMaxHalf,28*o),n.uniform3fv(i.uColors,p),n.uniform1i(i.uColorCount,a.colors.length),n.uniform4f(i.uMagnet,g.x,g.y,g.active*a.mouseStrength,a.mouseRadius);let l=_.age,u=1.9*Math.min(1,l/.23)*Math.exp(-Math.max(0,l-.23)*1.1);n.uniform4f(i.uSwirl,_.x,_.y,t.height*.22*(1+l*.5),l<6?u:0),n.uniform1f(i.uReveal,c*c*(3-2*c)),n.uniform1f(i.uLight,+!!a.lightMode),n.uniform1f(i.uOpaque,+!a.transparent),n.uniform3fv(i.uBackground,d(a.backgroundColor,a.lightMode?[1,1,1]:[.0706,.0588,.0902])),n.uniform1f(i.uOpacity,a.opacity),n.drawArrays(n.TRIANGLES,0,3)},w=e=>{if(b=0,!S||document.hidden)return;let t=R.current,n=x?u((e-x)/1e3,5e-4,.05):1/60;x=e;let r=t.paused||m?0:1;v+=n*r,_.age+=n,t.intro&&!m&&y<1?y=Math.min(1,y+n/o):(!t.intro||m)&&(y=1);let i=t.mouseInteraction&&h.inside,a=t.mouseDampening>0?1-Math.exp(-n/t.mouseDampening):1;i&&(g.x+=(h.x-g.x)*a,g.y+=(h.y-g.y)*a);let s=+!!i;g.active+=(s-g.active)*(1-Math.exp(-n/.3)),Math.abs(s-g.active)<.001&&(g.active=s),C(),r>0||g.active!==s||y<1||_.age<6?b=requestAnimationFrame(w):x=0},T=()=>{!b&&S&&!document.hidden&&(b=requestAnimationFrame(w))},E=()=>{let n=R.current,r=Math.max(1,e.clientWidth),i=Math.max(1,e.clientHeight),a=Math.min(n.dpr||window.devicePixelRatio||1,2);t.width=Math.max(1,Math.round(r*a)),t.height=Math.max(1,Math.round(i*a)),C(),T()},D=n=>{let r=e.getBoundingClientRect(),i=n.clientX-r.left,a=n.clientY-r.top,o=t.width/Math.max(1,r.width);h.inside=i>=0&&a>=0&&i<=r.width&&a<=r.height,h.x=i*o,h.y=(r.height-a)*o},O=e=>{let t=h.inside;D(e),h.inside&&!t&&g.active<.05&&(g.x=h.x,g.y=h.y),T()},k=e=>{O(e),h.inside&&R.current.clickSwirl&&!m&&(_.x=h.x,_.y=h.y,_.age=0,T())},A=e=>{e.pointerType!==`mouse`&&(h.inside=!1)},j=()=>{h.inside=!1},M=()=>{x=0,T()},N=new ResizeObserver(E);N.observe(e);let L=new IntersectionObserver(e=>{S=e.some(e=>e.isIntersecting),S&&(x=0,T())});L.observe(e),window.addEventListener(`pointermove`,O,{passive:!0}),window.addEventListener(`pointerdown`,k,{passive:!0}),window.addEventListener(`pointerup`,A,{passive:!0}),window.addEventListener(`pointercancel`,A,{passive:!0}),document.documentElement.addEventListener(`pointerleave`,j),document.addEventListener(`visibilitychange`,M),E();let z=R.current.dpr;return I.current=()=>{let e=R.current;e.dpr===z?(b||C(),T()):(z=e.dpr,E())},()=>{cancelAnimationFrame(b),I.current=null,N.disconnect(),L.disconnect(),window.removeEventListener(`pointermove`,O),window.removeEventListener(`pointerdown`,k),window.removeEventListener(`pointerup`,A),window.removeEventListener(`pointercancel`,A),document.documentElement.removeEventListener(`pointerleave`,j),document.removeEventListener(`visibilitychange`,M),n.deleteProgram(r.program),n.deleteBuffer(a),n.deleteVertexArray(s),n.getExtension(`WEBGL_lose_context`)?.loseContext()}},[]),(0,r.useEffect)(()=>{I.current?.()}),(0,i.jsx)(`div`,{ref:P,className:[`relative h-full w-full overflow-hidden`,j].filter(Boolean).join(` `),style:A?{...M,mixBlendMode:A}:M,...N,children:(0,i.jsx)(`canvas`,{ref:F,className:`absolute inset-0 block h-full w-full`,"aria-hidden":`true`})})};export{p as default};