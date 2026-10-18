import{i as e,t}from"./react-sySUN5R7.js";import{O as n}from"./sculpture-dark-Cfb-XN1r.js";var r=e(t(),1),i=n(),a=1.8,o=`#version 300 es
in vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`,s=`#version 300 es
precision highp float;
uniform vec2 uResolution;
uniform vec2 uCenter;
uniform float uScale;
uniform float uRatio;
uniform float uTime;
uniform float uDrift;
uniform vec2 uSteer;
uniform float uBend;
uniform float uCount;
uniform float uSwing;
uniform float uWave;
uniform float uWidth;
uniform float uPulseWidth;
uniform float uHead;
uniform float uTail;
uniform float uChance;
uniform float uSpacing;
uniform float uPulseSpeed;
uniform float uFlow;
uniform float uHalo;
uniform float uGlow;
uniform float uBrightness;
uniform float uVariance;
uniform float uBody;
uniform float uFadeNear;
uniform float uFadeFar;
uniform vec3 uCable;
uniform vec3 uPulse;
uniform vec3 uTunnel;
uniform vec3 uSurge;
uniform float uReveal;
uniform float uGrain;
uniform float uSeed;
uniform float uLight;
uniform float uOpacity;
out vec4 outColor;

const float TAU = 6.2831853;

vec3 inkOf(vec3 color, float depthOfInk) {
  float luma = dot(color, vec3(0.2126, 0.7152, 0.0722));
  float peak = max(color.r, max(color.g, color.b));
  float chroma = (peak - min(color.r, min(color.g, color.b))) / max(peak, 0.001);
  return color * min(1.0, mix(depthOfInk, depthOfInk * 1.7, chroma) / max(luma, 0.001));
}

float hash(float n) {
  return fract(sin(n * 127.1 + uSeed * 311.7) * 43758.5453);
}

vec2 bendAt(float depth) {
  float reach = 1.0 - exp(-max(depth, 0.0) * 0.55);
  vec2 wobble = vec2(sin(uDrift * 0.37 + depth * 0.31), cos(uDrift * 0.29 + depth * 0.23)) * uBend;
  return (wobble + uSteer) * reach;
}

void main() {
  vec2 p = (gl_FragCoord.xy - 0.5 * uResolution - uCenter) / uScale;
  float depth = -log(max(length(p), 1e-5));
  vec2 q = p;
  for (int i = 0; i < 4; i++) {
    q = p - bendAt(depth);
    depth = -log(max(length(q), 1e-5));
  }
  float r = length(q);
  float px = r * uScale;
  float turn = atan(q.y, q.x) / TAU;
  float s = turn - uSwing - uWave * sin(depth * 1.2 + uDrift * 0.5);
  float cell = floor(s * uCount);
  float spacing = TAU * px / uCount;
  float near = smoothstep(0.55, 1.25, r);
  float width = uWidth * (1.0 + near * 1.2);
  float soft = uRatio * (0.55 + near * 0.9);
  float tight = uRatio * uHalo * (1.0 + near);
  float wide = tight * 4.5;

  float lines = 0.0;
  float body = 0.0;
  vec3 glow = vec3(0.0);
  float strokes = 0.0;
  for (int k = -3; k <= 3; k++) {
    float i = cell + float(k);
    float id = mod(i, uCount);
    float h1 = hash(id);
    float h2 = hash(id + 17.0);
    float h3 = hash(id + 41.0);
    float h4 = hash(id + 73.0);
    float center = (i + 0.5 + (h1 - 0.5) * 0.55) / uCount;
    center += 0.12 * sin(depth * (0.8 + h2 * 0.9) + uDrift * (0.4 + h3 * 0.5) + h4 * TAU) / uCount;
    float d = abs(s - center) * TAU * px;
    float shade = 1.0 + uVariance * (h3 - 0.5) * 0.9;
    float reach = smoothstep(spacing * 2.4, spacing * 1.4, d);

    lines += smoothstep(width + soft, width - soft, d) * shade;
    body += exp(-d / max(spacing * 0.22, 0.001)) * shade * reach;

    float x = depth * uSpacing + uTime * uPulseSpeed * (0.55 + h2 * 0.6) * uFlow + h4 * 7.0;
    float lead = (fract(x) - 0.5) / uSpacing * uFlow;
    float lit = step(hash(id * 3.7 + floor(x) * 13.1), uChance);
    float limit = 0.5 / uSpacing;
    float head = exp(-pow(max(-lead, 0.0) / uHead, 2.0)) * smoothstep(-limit, -limit * 0.8, lead);
    float tail = exp(-max(lead, 0.0) / uTail) * smoothstep(limit, limit * 0.55, lead);
    float pulse = (lead < 0.0 ? head : tail) * lit;
    float ring = uSurge.y * exp(-pow((depth - uSurge.x) / uSurge.z, 2.0));
    pulse = max(pulse, ring);
    float hot = pulse * (lead < 0.0 ? 1.0 : exp(-max(lead, 0.0) / (uTail * 0.35)));

    float core = uPulseWidth * width + 0.35 * uRatio;
    float stroke = smoothstep(core + soft, core - soft, d);
    float bloom = (exp(-d / tight) * 0.7 + exp(-d / wide) * 0.18) * uGlow * reach;
    vec3 tint = mix(uPulse, vec3(1.0), hot * 0.55 * (1.0 - uLight));
    glow += tint * pulse * (stroke * 1.5 + bloom) * shade;
    strokes += pulse * stroke * shade;
  }

  float lod = smoothstep(4.0, 1.2, spacing);
  float average = min(2.0 * uWidth / max(spacing, 0.001), 1.0);
  lines = mix(lines, average, lod);
  glow = mix(glow, uPulse * average * 0.6 * uChance, lod);
  strokes = mix(strokes, average * 0.6 * uChance, lod);
  body = mix(body, 1.0, lod) * uBody;

  float rr = r * 0.25;
  float fade = smoothstep(0.0, uFadeNear, rr) * smoothstep(uFadeFar, uFadeFar * 0.55, rr);
  fade *= smoothstep(uReveal - 0.6, uReveal, depth);

  float grain = 1.0;
  if (uGrain > 0.0) {
    grain += (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233)) + uTime * 7.0) * 43758.5453) - 0.5) * uGrain * 4.0;
  }

  if (uLight > 0.5) {
    float hairline = clamp(lines * 0.26 + body * 0.2, 0.0, 1.0);
    float stroke = clamp(strokes * 1.6, 0.0, 1.0);
    float haze = clamp(length(glow) * 0.12, 0.0, 0.25);
    float ink = clamp(hairline + stroke + haze, 0.0, 1.0) * fade * uOpacity * grain;
    vec3 tone = mix(inkOf(uCable, 0.3), inkOf(uPulse, 0.16), clamp(stroke + haze * 2.0, 0.0, 1.0));
    tone = mix(tone, inkOf(uTunnel, 0.3), clamp(body * uBody, 0.0, 1.0) * 0.5);
    outColor = vec4(tone * ink, ink);
    return;
  }

  vec3 light = (uCable * lines * 0.12 + uTunnel * body * 0.35 + glow) * uBrightness * fade * grain;
  vec3 mapped = (1.0 - exp(-light * 1.4)) * uOpacity;
  outColor = vec4(mapped, max(mapped.r, max(mapped.g, mapped.b)));
}`,c=(e,t,n)=>Math.min(n,Math.max(t,e)),l=(e,t,n)=>{let r=e.createShader(t);return r?(e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(e.deleteShader(r),null)):null},u=e=>{let t=l(e,e.VERTEX_SHADER,o),n=l(e,e.FRAGMENT_SHADER,s),r=e.createProgram();if(!t||!n||!r)return null;if(e.attachShader(r,t),e.attachShader(r,n),e.bindAttribLocation(r,0,`aPosition`),e.linkProgram(r),e.deleteShader(t),e.deleteShader(n),!e.getProgramParameter(r,e.LINK_STATUS))return e.deleteProgram(r),null;let i={},a=e.getProgramParameter(r,e.ACTIVE_UNIFORMS);for(let t=0;t<a;t++){let n=e.getActiveUniform(r,t);n&&(i[n.name]=e.getUniformLocation(r,n.name))}return{program:r,uniforms:i}},d=({cableColor:e=`#ffffff`,pulseColor:t=`#ffffff`,tunnelColor:n=`#ffffff`,tunnelOpacity:o=0,speed:s=.1,flowDirection:l=`inward`,pulseSpeed:d=2,pulseLength:f=.28,pulseBlend:p=.6,pulseWidth:m=1,pulseDensity:h=.5,cableCount:g=56,thickness:_=.35,rimWidth:v=.15,waviness:y=.3,sway:b=.5,bend:x=.4,size:S=1,centerX:C=0,centerY:w=0,glow:T=1,fadeNear:E=.5,fadeFar:D=2,brightness:O=1,colorVariance:k=!0,grain:A=!1,grainIntensity:j=.05,opacity:M=1,mouseInteraction:N=!0,mouseStrength:P=.1,clickSurge:F=!0,intro:I=!0,variation:L=0,lightMode:R=!1,dpr:z,className:B=``,style:V,...H})=>{let U=(0,r.useRef)(null),W=(0,r.useRef)(null),G=(0,r.useRef)(null),K={cableColor:e,pulseColor:t,tunnelColor:n,tunnelOpacity:c(o,0,1),speed:Math.max(0,s),flow:l===`outward`?1:-1,pulseSpeed:Math.max(0,d),pulseLength:c(f,.02,1),pulseBlend:c(p,0,1),pulseWidth:c(m,.1,3),pulseDensity:c(h,0,1),cableCount:c(Math.round(g),4,200),thickness:c(_,.05,2),rimWidth:c(v,0,1),waviness:Math.max(0,y),sway:Math.max(0,b),bend:Math.max(0,x),size:Math.max(.05,S),centerX:C,centerY:w,glow:Math.max(0,T),fadeNear:Math.max(.001,E),fadeFar:Math.max(.01,D),brightness:Math.max(0,O),colorVariance:k,grain:A,grainIntensity:Math.max(0,j),opacity:c(M,0,1),mouseInteraction:N,mouseStrength:Math.max(0,P),clickSurge:F,intro:I,variation:L,lightMode:R,dpr:z},q=(0,r.useRef)(K);return q.current=K,(0,r.useEffect)(()=>{let e=U.current,t=W.current,n=t?.getContext(`webgl2`,{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1});if(!e||!t||!n)return;let r=u(n);if(!r)return;let i=r.uniforms,o=n.createBuffer(),s=n.createVertexArray();n.bindVertexArray(s),n.bindBuffer(n.ARRAY_BUFFER,o),n.bufferData(n.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),n.STATIC_DRAW),n.enableVertexAttribArray(0),n.vertexAttribPointer(0,2,n.FLOAT,!1,0,0);let l=document.createElement(`canvas`).getContext(`2d`,{willReadFrequently:!0}),d=new Map,f=(e,t)=>{if(!e)return t;let n=String(e),r=d.get(n);if(r)return r;let i=t;if(l){l.clearRect(0,0,1,1),l.fillStyle=`#000000`,l.fillStyle=n,l.fillRect(0,0,1,1);let[e,t,r]=l.getImageData(0,0,1,1).data;i=[e/255,t/255,r/255]}return d.set(n,i),i},p=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches??!1,m={x:0,y:0,inside:!1},h={x:0,y:0},g={age:10},_=0,v=0,y=q.current.intro&&!p?0:1,b=0,x=0,S=!0,C=()=>{let a=q.current,o=t.width,c=t.height,l=o/Math.max(1,e.clientWidth),u=Math.min(o,c),d=a.flow,p=g.age*2.6,m=d>0?3.4-p:-.6+p,b=g.age<2.4?Math.min(1,g.age/.12)*Math.exp(-g.age*1.1):0,x=y*y*(3-2*y);n.viewport(0,0,o,c),n.useProgram(r.program),n.bindVertexArray(s),n.uniform2f(i.uResolution,o,c),n.uniform2f(i.uCenter,a.centerX*u,a.centerY*u),n.uniform1f(i.uScale,u*.5*a.size),n.uniform1f(i.uRatio,l),n.uniform1f(i.uTime,_),n.uniform1f(i.uDrift,v),n.uniform2f(i.uSteer,h.x,h.y),n.uniform1f(i.uBend,a.bend*.45),n.uniform1f(i.uCount,a.cableCount),n.uniform1f(i.uSwing,Math.sin(v*.9)*a.sway*.5/(Math.PI*2)),n.uniform1f(i.uWave,a.waviness*.15),n.uniform1f(i.uWidth,(.25+a.thickness*1.5)*l),n.uniform1f(i.uPulseWidth,.6+a.pulseWidth*.9);let S=a.pulseLength*1.2;n.uniform1f(i.uHead,S*(.08+a.pulseBlend*.22)),n.uniform1f(i.uTail,S*(.5+a.pulseBlend*.7)),n.uniform1f(i.uChance,a.pulseDensity),n.uniform1f(i.uSpacing,.4),n.uniform1f(i.uPulseSpeed,a.pulseSpeed*4),n.uniform1f(i.uFlow,d),n.uniform1f(i.uHalo,1.2+a.rimWidth*8),n.uniform1f(i.uGlow,a.glow),n.uniform1f(i.uBrightness,a.brightness),n.uniform1f(i.uVariance,+!!a.colorVariance),n.uniform1f(i.uBody,a.tunnelOpacity),n.uniform1f(i.uFadeNear,a.fadeNear),n.uniform1f(i.uFadeFar,a.fadeFar),n.uniform3fv(i.uCable,f(a.cableColor,[1,1,1])),n.uniform3fv(i.uPulse,f(a.pulseColor,[1,1,1])),n.uniform3fv(i.uTunnel,f(a.tunnelColor,[1,1,1])),n.uniform3f(i.uSurge,m,b,.22),n.uniform1f(i.uReveal,1.7-x*3.6),n.uniform1f(i.uGrain,a.grain?a.grainIntensity:0),n.uniform1f(i.uSeed,a.variation),n.uniform1f(i.uLight,+!!a.lightMode),n.uniform1f(i.uOpacity,a.opacity),n.drawArrays(n.TRIANGLES,0,3)},w=e=>{if(b=0,!S||document.hidden)return;let t=q.current,n=x?c((e-x)/1e3,5e-4,.05):1/60;x=e;let r=+!p;_+=n*t.speed*r,v+=n*(t.speed+.2)*r,g.age+=n,t.intro&&!p&&y<1?y=Math.min(1,y+n/a):(!t.intro||p)&&(y=1);let i=t.mouseInteraction&&m.inside&&!p,o=t.mouseStrength*2.5,s=i?[m.x*o,m.y*o]:[0,0],l=1-Math.exp(-n/.6);h.x+=(s[0]-h.x)*l,h.y+=(s[1]-h.y)*l,C();let u=Math.abs(s[0]-h.x)<5e-4&&Math.abs(s[1]-h.y)<5e-4;r>0||!u||y<1||g.age<2.4?b=requestAnimationFrame(w):x=0},T=()=>{!b&&S&&!document.hidden&&(b=requestAnimationFrame(w))},E=()=>{let n=q.current,r=Math.max(1,e.clientWidth),i=Math.max(1,e.clientHeight),a=Math.min(n.dpr||window.devicePixelRatio||1,2);t.width=Math.max(1,Math.round(r*a)),t.height=Math.max(1,Math.round(i*a)),C(),T()},D=t=>{let n=e.getBoundingClientRect(),r=t.clientX-n.left,i=t.clientY-n.top;m.inside=r>=0&&i>=0&&r<=n.width&&i<=n.height;let a=Math.min(n.width,n.height)*.5;m.x=(r-n.width/2)/Math.max(1,a),m.y=(n.height/2-i)/Math.max(1,a)},O=e=>{D(e),T()},k=e=>{D(e),m.inside&&q.current.clickSurge&&!p&&(g.age=0,T())},A=e=>{e.pointerType!==`mouse`&&(m.inside=!1)},j=()=>{m.inside=!1},M=()=>{x=0,T()},N=new ResizeObserver(E);N.observe(e);let P=new IntersectionObserver(e=>{S=e.some(e=>e.isIntersecting),S&&(x=0,T())});P.observe(e),window.addEventListener(`pointermove`,O,{passive:!0}),window.addEventListener(`pointerdown`,k,{passive:!0}),window.addEventListener(`pointerup`,A,{passive:!0}),window.addEventListener(`pointercancel`,A,{passive:!0}),document.documentElement.addEventListener(`pointerleave`,j),document.addEventListener(`visibilitychange`,M),E();let F=q.current.dpr;return G.current=()=>{let e=q.current;e.dpr===F?(b||C(),T()):(F=e.dpr,E())},()=>{cancelAnimationFrame(b),G.current=null,N.disconnect(),P.disconnect(),window.removeEventListener(`pointermove`,O),window.removeEventListener(`pointerdown`,k),window.removeEventListener(`pointerup`,A),window.removeEventListener(`pointercancel`,A),document.documentElement.removeEventListener(`pointerleave`,j),document.removeEventListener(`visibilitychange`,M),n.deleteProgram(r.program),n.deleteBuffer(o),n.deleteVertexArray(s),n.getExtension(`WEBGL_lose_context`)?.loseContext()}},[]),(0,r.useEffect)(()=>{G.current?.()}),(0,i.jsx)(`div`,{ref:U,className:[`relative h-full w-full overflow-hidden`,B].filter(Boolean).join(` `),style:V,...H,children:(0,i.jsx)(`canvas`,{ref:W,className:`absolute inset-0 block h-full w-full`,"aria-hidden":`true`})})};export{d as default};