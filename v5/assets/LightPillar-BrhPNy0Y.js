import{i as e,t}from"./react-sySUN5R7.js";import{O as n}from"./sculpture-dark-Cfb-XN1r.js";var r=e(t(),1),i=n(),a=`#version 300 es
in vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`,o=`#version 300 es
precision highp float;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uTarget;
uniform vec2 uRot;
uniform vec2 uPillarRot;
uniform vec2 uWave;
uniform float uShift;
uniform float uPillarWidth;
uniform float uPillarHeight;
uniform int uDetail;
uniform vec3 uTopColor;
uniform vec3 uBottomColor;
uniform float uGlowAmount;
uniform float uWidthNorm;
out vec4 outColor;

void main() {
  vec2 vUv = gl_FragCoord.xy / uTarget;
  vec2 uv = (vUv * 2.0 - 1.0) * vec2(uResolution.x / uResolution.y, 1.0);
  uv.x -= uShift;
  uv = vec2(uPillarRot.x * uv.x - uPillarRot.y * uv.y, uPillarRot.y * uv.x + uPillarRot.x * uv.y);

  vec3 ro = vec3(0.0, 0.0, -10.0);
  vec3 rd = normalize(vec3(uv, 1.0));
  vec3 origin = vec3(uRot.x * ro.x - uRot.y * ro.z, ro.y, uRot.y * ro.x + uRot.x * ro.z);
  vec3 dir = vec3(uRot.x * rd.x - uRot.y * rd.z, rd.y, uRot.y * rd.x + uRot.x * rd.z);

  float glow = 0.0;
  float lift = 0.0;
  float t = 0.1;
  for (int i = 0; i < 80; i++) {
    vec3 p = origin + dir * t;
    vec3 q = p;
    q.y = p.y * uPillarHeight + uTime;

    float freq = 1.0;
    float amp = 1.0;
    for (int j = 0; j < 6; j++) {
      if (j >= uDetail) break;
      q.xz = vec2(uWave.y * q.x - uWave.x * q.z, uWave.x * q.x + uWave.y * q.z);
      q += cos(q.zxy * freq - uTime * float(j) * 2.0) * amp;
      freq *= 2.0;
      amp *= 0.5;
    }

    float d = length(cos(q.xz)) - 0.2;
    float bound = length(p.xz) - uPillarWidth;
    float h = max(4.0 - abs(d - bound), 0.0);
    d = max(d, bound) + h * h * 0.015625;
    d = abs(d) * 0.15 + 0.01;

    float weight = 1.0 / d;
    glow += weight;
    lift += clamp((15.0 - p.y) / 30.0, 0.0, 1.0) * weight;

    t += d;
    if (t > 50.0) break;
  }

  vec3 col = tanh((uBottomColor * glow + (uTopColor - uBottomColor) * lift) * uGlowAmount / uWidthNorm);
  float peak = max(col.r, max(col.g, col.b));
  outColor = vec4(col, smoothstep(0.62, 1.0, peak));
}`,s=`#version 300 es
precision highp float;
uniform sampler2D uField;
uniform vec2 uFieldSize;
uniform vec2 uView;
uniform vec2 uAspect;
uniform vec2 uPillarRot;
uniform float uShift;
uniform float uIntensity;
uniform float uNoiseIntensity;
uniform float uLightMode;
uniform float uNeutral;
uniform float uBloom;
uniform float uFade;
uniform float uReveal;
uniform float uFlare;
uniform vec4 uPulses[3];
out vec4 outColor;

vec3 tap(vec2 uv) {
  return textureLod(uField, uv, 0.0).rgb;
}

vec3 bicubic(vec2 uv) {
  vec2 position = uv * uFieldSize;
  vec2 center = floor(position - 0.5) + 0.5;
  vec2 f = position - center;
  vec2 w0 = f * (-0.5 + f * (1.0 - 0.5 * f));
  vec2 w1 = 1.0 + f * f * (-2.5 + 1.5 * f);
  vec2 w2 = f * (0.5 + f * (2.0 - 1.5 * f));
  vec2 w3 = f * f * (-0.5 + 0.5 * f);
  vec2 w12 = w1 + w2;
  vec2 t0 = (center - 1.0) / uFieldSize;
  vec2 t3 = (center + 2.0) / uFieldSize;
  vec2 t12 = (center + w2 / w12) / uFieldSize;
  vec3 result = vec3(0.0);
  result += tap(vec2(t0.x, t0.y)) * w0.x * w0.y;
  result += tap(vec2(t12.x, t0.y)) * w12.x * w0.y;
  result += tap(vec2(t3.x, t0.y)) * w3.x * w0.y;
  result += tap(vec2(t0.x, t12.y)) * w0.x * w12.y;
  result += tap(vec2(t12.x, t12.y)) * w12.x * w12.y;
  result += tap(vec2(t3.x, t12.y)) * w3.x * w12.y;
  result += tap(vec2(t0.x, t3.y)) * w0.x * w3.y;
  result += tap(vec2(t12.x, t3.y)) * w12.x * w3.y;
  result += tap(vec2(t3.x, t3.y)) * w3.x * w3.y;
  return max(result, 0.0);
}

float smootherstep01(float t) {
  t = clamp(t, 0.0, 1.0);
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uView;
  vec3 col = bicubic(uv);

  if (uBloom > 0.0) {
    vec4 l3 = textureLod(uField, uv, 3.0);
    vec4 l4 = textureLod(uField, uv, 4.0);
    vec4 l5 = textureLod(uField, uv, 5.0);
    vec4 l6 = textureLod(uField, uv, 6.0);
    float halo = l3.a * 0.3 + l4.a * 0.3 + l5.a * 0.25 + l6.a * 0.15;
    vec3 tint = l4.rgb + l5.rgb;
    tint /= max(max(tint.r, max(tint.g, tint.b)), 0.001);
    vec3 glow = clamp(tint * halo * uBloom * 1.1, 0.0, 1.0);
    col = 1.0 - (1.0 - clamp(col, 0.0, 1.0)) * (1.0 - glow);
  }

  vec2 p = (uv * 2.0 - 1.0) * uAspect;
  p.x -= uShift;
  float axis = uPillarRot.y * p.x + uPillarRot.x * p.y;

  float boost = 0.0;
  for (int i = 0; i < 3; i++) {
    vec4 pulse = uPulses[i];
    if (pulse.y <= 0.0) continue;
    float offset = (axis - pulse.x) / 0.24;
    boost += exp(-offset * offset) * pulse.y;
  }
  float head = (axis - uReveal + 0.35) / 0.3;
  boost += exp(-head * head) * uFlare;
  float lum = max(col.r, max(col.g, col.b));
  col += mix(col, vec3(lum), 0.45) * boost * 1.8;

  col -= fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) / 15.0 * uNoiseIntensity;
  vec3 result = clamp(col * uIntensity, 0.0, 1.0);

  float mask = smoothstep(uReveal, uReveal - 0.9, axis);
  float edge = uFade * 0.5;
  if (edge > 0.0) {
    mask *= smootherstep01(uv.x / edge) * smootherstep01((1.0 - uv.x) / edge);
    mask *= smootherstep01(uv.y / edge) * smootherstep01((1.0 - uv.y) / edge);
  }

  if (uLightMode > 0.5) {
    float energy = max(result.r, max(result.g, result.b));
    vec3 hue = result / max(energy, 0.001);
    float coverage = smoothstep(0.025, 0.95, energy);
    hue = pow(clamp(hue, 0.0, 1.0), vec3(1.25));
    vec3 tinted = mix(vec3(1.0), hue, coverage * 0.94 * mask);
    vec3 ink = vec3(1.0) - pow(result, vec3(1.6)) * 0.85 * mask;
    result = mix(tinted, ink, uNeutral);
  } else {
    result *= mask;
  }
  outColor = vec4(result, 1.0);
}`,c={low:.35,medium:.5,high:.6},l=2.1,u=1.4,d=.25,f=(e,t,n)=>Math.min(n,Math.max(t,e)),p=e=>1-(1-e)**3,m=e=>e*e*e*(e*(e*6-15)+10),h=(e,t,n)=>{let r=e.createShader(t);return r?(e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(e.deleteShader(r),null)):null},g=(e,t)=>{let n=h(e,e.VERTEX_SHADER,a),r=h(e,e.FRAGMENT_SHADER,t),i=e.createProgram();if(!n||!r||!i)return null;if(e.attachShader(i,n),e.attachShader(i,r),e.bindAttribLocation(i,0,`aPosition`),e.linkProgram(i),e.deleteShader(n),e.deleteShader(r),!e.getProgramParameter(i,e.LINK_STATUS))return e.deleteProgram(i),null;let o={},s=e.getProgramParameter(i,e.ACTIVE_UNIFORMS);for(let t=0;t<s;t++){let n=e.getActiveUniform(i,t);n&&(o[n.name.replace(/\[0\]$/,``)]=e.getUniformLocation(i,n.name))}return{program:i,uniforms:o}},_=({topColor:e=`#5227FF`,bottomColor:t=`#FF9FFC`,intensity:n=1,rotationSpeed:a=.3,flow:h=1,interactive:_=!0,clickPulse:v=!0,glowAmount:y=.002,bloom:b=.5,pillarWidth:x=3,pillarHeight:S=.4,pillarRotation:C=25,twist:w=.4,detail:T=4,noiseIntensity:E=.5,fade:D=0,intro:O=!0,mixBlendMode:k=`screen`,quality:A=`high`,resolution:j,lightMode:M=!1,paused:N=!1,className:P=``,style:F})=>{let I=(0,r.useRef)(null),L=(0,r.useRef)(null),R=(0,r.useRef)(null),z=(0,r.useRef)(null),[B,V]=(0,r.useState)(0);return z.current={topColor:String(e),bottomColor:String(t),intensity:Math.max(0,n),rotationSpeed:a,flow:h,interactive:_,clickPulse:v,glowAmount:Math.max(0,y),bloom:Math.max(0,b),pillarWidth:Math.max(.05,x),pillarHeight:S,pillarRotation:C,twist:w,detail:Math.round(f(T,1,6)),noiseIntensity:Math.max(0,E),fade:f(D,0,1),intro:O,scale:f(j??c[A]??c.high,d,2),lightMode:M,paused:N},(0,r.useEffect)(()=>{let e=I.current,t=L.current,n=t?.getContext(`webgl2`,{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1,powerPreference:`high-performance`});if(!e||!t||!n)return;let r=!!n.getExtension(`EXT_color_buffer_float`),i=g(n,o),a=g(n,s);if(!i||!a)return;let c=e=>{e.preventDefault()},h=()=>V(e=>e+1);t.addEventListener(`webglcontextlost`,c),t.addEventListener(`webglcontextrestored`,h);let _=n.createBuffer(),v=n.createVertexArray();n.bindVertexArray(v),n.bindBuffer(n.ARRAY_BUFFER,_),n.bufferData(n.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),n.STATIC_DRAW),n.enableVertexAttribArray(0),n.vertexAttribPointer(0,2,n.FLOAT,!1,0,0);let y=null,b=n.createFramebuffer(),x={width:0,height:0},S=(e,t)=>{if(x.width===e&&x.height===t)return;x.width=e,x.height=t,y&&n.deleteTexture(y),y=n.createTexture(),n.bindTexture(n.TEXTURE_2D,y);let i=Math.floor(Math.log2(Math.max(e,t)))+1;n.texStorage2D(n.TEXTURE_2D,i,r?n.RGBA16F:n.RGBA8,e,t),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR_MIPMAP_LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MAG_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE),n.bindFramebuffer(n.FRAMEBUFFER,b),n.framebufferTexture2D(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,y,0)},C=document.createElement(`canvas`).getContext(`2d`,{willReadFrequently:!0}),w=new Map,T=e=>{if(w.has(e))return w.get(e);let t=[1,1,1];if(C){C.clearRect(0,0,1,1),C.fillStyle=`#ffffff`,C.fillStyle=e,C.fillRect(0,0,1,1);let[n,r,i]=C.getImageData(0,0,1,1).data;t=[n/255,r/255,i/255]}return w.set(e,t),t},E=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches??!1,D={width:1,height:1,ratio:1},O={x:0,y:0,inside:!1},k=[],A=new Float32Array(12),j={clock:0,intro:z.current.intro&&!E?0:1,touch:0,spin:0,lean:0,shift:0,governor:1,slow:0,quick:0},M=0,N=0,P=!0,F=(e,t,n)=>{let r=D.width/D.height,i=(e/D.width*2-1)*r-j.shift,a=1-t/D.height*2;return Math.sin(n)*i+Math.cos(n)*a},B=()=>{let e=z.current,r=Math.max(d,e.scale*j.governor),o=Math.max(1,Math.round(D.width*r)),s=Math.max(1,Math.round(D.height*r));S(o,s);let c=m(j.intro),l=p(j.intro),h=(e.pillarRotation+j.lean)*Math.PI/180,g=j.clock*.3+j.spin,_=e.pillarWidth*(.3+.7*c);n.bindVertexArray(v);let C=i.uniforms;n.bindFramebuffer(n.FRAMEBUFFER,b),n.viewport(0,0,x.width,x.height),n.useProgram(i.program),n.uniform1f(C.uTime,j.clock*e.flow),n.uniform2f(C.uResolution,D.width,D.height),n.uniform2f(C.uTarget,x.width,x.height),n.uniform2f(C.uRot,Math.cos(g),Math.sin(g)),n.uniform2f(C.uPillarRot,Math.cos(h),Math.sin(h)),n.uniform2f(C.uWave,Math.sin(e.twist),Math.cos(e.twist)),n.uniform1f(C.uShift,j.shift),n.uniform1f(C.uPillarWidth,_),n.uniform1f(C.uPillarHeight,e.pillarHeight),n.uniform1i(C.uDetail,e.detail),n.uniform3fv(C.uTopColor,T(e.topColor)),n.uniform3fv(C.uBottomColor,T(e.bottomColor)),n.uniform1f(C.uGlowAmount,e.glowAmount),n.uniform1f(C.uWidthNorm,_/3),n.drawArrays(n.TRIANGLES,0,3),n.bindTexture(n.TEXTURE_2D,y),e.bloom>0&&n.generateMipmap(n.TEXTURE_2D),A.fill(0),k.forEach((e,t)=>{A.set([e.axis+e.age*1.7,Math.exp(-e.age/(u*.45)),0,0],t*4)});let w=a.uniforms;n.bindFramebuffer(n.FRAMEBUFFER,null),n.viewport(0,0,t.width,t.height),n.useProgram(a.program),n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,y),n.uniform1i(w.uField,0),n.uniform2f(w.uFieldSize,x.width,x.height),n.uniform2f(w.uView,t.width,t.height),n.uniform2f(w.uAspect,D.width/D.height,1),n.uniform2f(w.uPillarRot,Math.cos(h),Math.sin(h)),n.uniform1f(w.uShift,j.shift),n.uniform1f(w.uIntensity,e.intensity*(.15+.85*l)*(1+.12*j.touch)),n.uniform1f(w.uNoiseIntensity,e.noiseIntensity),n.uniform1f(w.uLightMode,+!!e.lightMode);let E=e=>Math.max(...e)-Math.min(...e),O=Math.max(E(T(e.topColor)),E(T(e.bottomColor)));n.uniform1f(w.uNeutral,1-f((O-.08)/.12,0,1)),n.uniform1f(w.uBloom,e.bloom),n.uniform1f(w.uFade,e.fade);let M=D.width/D.height+1.2;n.uniform1f(w.uReveal,j.intro>=1?1e4:-M+l*(M*2+1.2)),n.uniform1f(w.uFlare,j.intro>=1?0:(1-l)*1.3*Math.min(1,j.intro*8)),n.uniform4fv(w.uPulses,A),n.drawArrays(n.TRIANGLES,0,3)},H=e=>{e>1/40?(j.slow+=1,j.quick=0):e<1/55&&(j.quick+=1,j.slow=0),j.slow>20?(j.governor=Math.max(.5,j.governor*.85),j.slow=0):j.quick>180&&j.governor<1&&(j.governor=Math.min(1,j.governor*1.1),j.quick=0)},U=e=>{if(M=0,!P||document.hidden)return;let t=z.current,n=N?Math.min(.05,(e-N)/1e3):1/60;N&&H((e-N)/1e3),N=e;let r=!t.paused&&!E&&t.rotationSpeed!==0;r&&(j.clock+=n*.96*t.rotationSpeed),!t.intro||E?j.intro=1:j.intro<1&&(j.intro=Math.min(1,j.intro+n/l));let i=t.interactive&&O.inside&&!E,a=i?O.x/D.width-.5:0,o=1-Math.exp(-n*2.4);j.spin+=(a*1.4-j.spin)*o,j.lean+=(a*9-j.lean)*o,j.shift+=(a*.35*(D.width/D.height)-j.shift)*o,j.touch+=(+!!i-j.touch)*(1-Math.exp(-n*3));for(let e=k.length-1;e>=0;e--)k[e].age+=n,k[e].age>u*2.2&&k.splice(e,1);B();let s=j.intro<1||k.length>0||Math.abs(a*1.4-j.spin)>5e-4||Math.abs(+!!i-j.touch)>.002;r||s?M=requestAnimationFrame(U):N=0},W=()=>{!M&&P&&!document.hidden&&(M=requestAnimationFrame(U))},G=()=>{let n=Math.max(1,e.clientWidth),r=Math.max(1,e.clientHeight),i=Math.min(window.devicePixelRatio||1,2);D.width=n,D.height=r,D.ratio=i,t.width=Math.max(1,Math.round(n*i)),t.height=Math.max(1,Math.round(r*i)),M||B(),W()},K=t=>{let n=e.getBoundingClientRect(),r=t.clientX-n.left,i=t.clientY-n.top;return{x:r,y:i,inside:r>=0&&i>=0&&r<=n.width&&i<=n.height}},q=e=>{let t=K(e);O.x=t.x,O.y=t.y,O.inside=t.inside,W()},J=e=>{let t=z.current;if(!t.clickPulse||E)return;let n=K(e);if(!n.inside)return;let r=(t.pillarRotation+j.lean)*Math.PI/180;k.push({axis:F(n.x,n.y,r),age:0}),k.length>3&&k.shift(),W()},Y=()=>{O.inside=!1,W()},X=()=>{N=0,W()},Z=new ResizeObserver(G);Z.observe(e);let Q=new IntersectionObserver(e=>{P=e.some(e=>e.isIntersecting),P&&(N=0,W())});return Q.observe(e),window.addEventListener(`pointermove`,q,{passive:!0}),window.addEventListener(`pointerdown`,J,{passive:!0}),document.documentElement.addEventListener(`pointerleave`,Y),document.addEventListener(`visibilitychange`,X),G(),R.current=()=>{M||B(),W()},()=>{cancelAnimationFrame(M),R.current=null,t.removeEventListener(`webglcontextlost`,c),t.removeEventListener(`webglcontextrestored`,h),Z.disconnect(),Q.disconnect(),window.removeEventListener(`pointermove`,q),window.removeEventListener(`pointerdown`,J),document.documentElement.removeEventListener(`pointerleave`,Y),document.removeEventListener(`visibilitychange`,X),y&&n.deleteTexture(y),n.deleteFramebuffer(b),n.deleteProgram(i.program),n.deleteProgram(a.program),n.deleteBuffer(_),n.deleteVertexArray(v),n.isContextLost()||n.getExtension(`WEBGL_lose_context`)?.loseContext()}},[B]),(0,r.useEffect)(()=>{R.current?.()}),(0,i.jsx)(`div`,{ref:I,className:`absolute top-0 left-0 w-full h-full overflow-hidden ${P}`,style:{mixBlendMode:k,...F},children:(0,i.jsx)(`canvas`,{ref:L,className:`absolute inset-0 block w-full h-full`,"aria-hidden":`true`})})};export{_ as default};