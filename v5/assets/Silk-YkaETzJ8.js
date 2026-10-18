import{i as e,t}from"./react-sySUN5R7.js";import{O as n}from"./sculpture-dark-Cfb-XN1r.js";var r=e(t(),1),i=n(),a=`#version 300 es
in vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`,o=`
uniform vec2 uView;
uniform float uScale;
uniform float uRotation;
uniform float uTime;
uniform float uWave;
uniform float uRipple;
uniform float uFold;
uniform vec2 uShift;
uniform vec4 uPointer;
uniform vec2 uDrag;
uniform vec4 uWaves[4];

const float e = 2.71828182845904523536;

float noise(vec2 texCoord) {
  float G = e;
  vec2 r = (G * sin(G * texCoord));
  return fract(r.x * r.y * (1.0 + texCoord.x));
}

vec2 rotateUvs(vec2 uv, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  mat2 rot = mat2(c, -s, s, c);
  return rot * uv;
}

vec2 bend(vec2 uv) {
  vec2 aspect = vec2(uView.x / uView.y, 1.0);
  vec2 offset = (uv - uPointer.xy) * aspect;
  float touch = uPointer.z * exp(-dot(offset, offset) / (uPointer.w * uPointer.w));
  uv -= uDrag * touch;
  for (int i = 0; i < 4; i++) {
    vec4 wave = uWaves[i];
    if (wave.w <= 0.0) continue;
    vec2 q = (uv - wave.xy) * aspect;
    float dist = length(q);
    float front = dist - wave.z;
    float ring = exp(-front * front * 60.0) * wave.w;
    uv += q / max(dist, 0.0001) / aspect * ring * 0.034 * sin(front * 34.0);
  }
  return uv;
}

float silk(vec2 vUv) {
  vec2 uv = rotateUvs(vUv * uScale, uRotation);
  vec2 tex = uv * uScale + uShift;
  float tOffset = uTime;
  tex.y += 0.03 * uWave * sin(8.0 * tex.x - tOffset);
  return 0.6 + 0.4 * uFold * sin(5.0 * (tex.x + tex.y + cos(3.0 * tex.x + 5.0 * tex.y) + 0.02 * tOffset) + uRipple * sin(20.0 * (tex.x + tex.y - 0.1 * tOffset)));
}
`,s=`#version 300 es
precision highp float;
${o}
out vec4 outColor;

void main() {
  vec2 vUv = gl_FragCoord.xy / uView;
  float pattern = silk(bend(vUv));
  float n = clamp((pattern - 0.2) / 0.8, 0.0, 1.0);
  outColor = vec4(pow(n, 6.0), 0.0, 0.0, 1.0);
}`,c=`#version 300 es
precision highp float;
${o}
uniform sampler2D uBloom;
uniform vec3 uColor;
uniform vec3 uSheenColor;
uniform float uNoiseIntensity;
uniform float uDepth;
uniform float uSheen;
uniform float uGlow;
uniform float uLightMode;
uniform vec3 uLight;
uniform vec2 uStep;
uniform float uPresence;
uniform float uFade;
out vec4 outColor;

float smootherstep01(float t) {
  t = clamp(t, 0.0, 1.0);
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

vec3 softClip(vec3 c) {
  vec3 over = max(c - 0.75, 0.0);
  return min(c, 0.75) + 0.25 * (1.0 - exp(-over * 4.0));
}

void main() {
  vec2 vUv = gl_FragCoord.xy / uView;
  vec2 coord = bend(vUv);
  float pattern = silk(coord);
  float rnd = noise(gl_FragCoord.xy);
  float n = clamp((pattern - 0.2) / 0.8, 0.0, 1.0);

  float gx = silk(coord + vec2(uStep.x, 0.0)) - pattern;
  float gy = silk(coord + vec2(0.0, uStep.y)) - pattern;
  vec3 normal = normalize(vec3(-gx * 26.0, -gy * 26.0, 1.0));
  vec3 toLight = normalize(vec3(uLight.xy, 0.85));
  float relief = 1.0 + (dot(normal, toLight) - toLight.z) * 1.8 * uDepth;
  vec3 halfway = normalize(toLight + vec3(0.0, 0.0, 1.0));
  float gloss = pow(max(dot(normal, halfway), 0.0), 48.0) * smoothstep(0.25, 0.85, n);
  float crest = pow(n, 5.0);
  float shine = (gloss * 0.85 + crest * 0.4) * uSheen * (1.0 + uLight.z * 0.6);

  float bloom = 0.0;
  if (uGlow > 0.0) {
    bloom += textureLod(uBloom, vUv, 1.0).r * 0.35;
    bloom += textureLod(uBloom, vUv, 2.0).r * 0.3;
    bloom += textureLod(uBloom, vUv, 3.0).r * 0.2;
    bloom += textureLod(uBloom, vUv, 4.0).r * 0.15;
  }

  vec3 result;
  if (uLightMode > 0.5) {
    float fold = smoothstep(0.28, 0.9, pattern);
    float specular = smoothstep(0.72, 0.98, pattern);
    vec3 shadowColor = uColor * (0.72 - 0.12 * uDepth);
    vec3 bodyColor = min(uColor * 1.18, vec3(1.0));
    vec3 lightBase = mix(shadowColor, bodyColor, fold) * mix(1.0, relief, 0.6);
    lightBase = mix(lightBase, vec3(1.0), clamp(specular * 0.92 + shine * 0.22 + bloom * uGlow * 0.2, 0.0, 1.0));
    float fineNoise = noise(gl_FragCoord.xy * 0.63 + vec2(17.0, 41.0));
    float grainSignal = (rnd + fineNoise - 1.0);
    float grainStrength = clamp(uNoiseIntensity * 0.038, 0.0, 0.16);
    result = clamp(lightBase + grainSignal * grainStrength, 0.0, 1.0);
  } else {
    float grain = rnd / 15.0 * uNoiseIntensity;
    float floorValue = mix(0.2, 0.03, uDepth);
    float curve = uDepth > 0.0 ? pow(n, 1.0 + 1.4 * uDepth) : n;
    float shade = uDepth > 0.0 ? floorValue + (1.0 - floorValue) * curve : pattern;
    vec3 tone = mix(uColor, pow(uColor, vec3(1.45)), (1.0 - n) * uDepth);
    vec3 lit = tone * shade * relief - vec3(grain);
    vec3 tint = mix(uColor, uSheenColor, 0.8);
    vec3 extra = tint * (shine + bloom * uGlow * 0.55);
    float blend = clamp((uSheen + uGlow) * 4.0, 0.0, 1.0);
    result = mix(clamp(lit, 0.0, 1.0), clamp(softClip(lit + extra), 0.0, 1.0), blend);
  }

  float edge = uFade * 0.5;
  float mask = 1.0;
  if (edge > 0.0) {
    mask = smootherstep01(vUv.x / edge) * smootherstep01((1.0 - vUv.x) / edge);
    mask *= smootherstep01(vUv.y / edge) * smootherstep01((1.0 - vUv.y) / edge);
  }
  float alpha = uPresence * mask;
  outColor = vec4(result * alpha, alpha);
}`,l=2.2,u=1.6,d=1.6,f=[-.55,.7],p=Math.hypot(f[0],f[1]),m=(e,t,n)=>Math.min(n,Math.max(t,e)),h=e=>e*e*e*(e*(e*6-15)+10),g=e=>{let t=Number(e)||0;if(!t)return[0,0];let n=e=>{let n=Math.sin(t*12.9898+e*78.233)*43758.5453;return n-Math.floor(n)-.5};return[n(1)*6,n(2)*6]},_=(e,t,n)=>{let r=e.createShader(t);return r?(e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(e.deleteShader(r),null)):null},v=(e,t)=>{let n=_(e,e.VERTEX_SHADER,a),r=_(e,e.FRAGMENT_SHADER,t),i=e.createProgram();if(!n||!r||!i)return null;if(e.attachShader(i,n),e.attachShader(i,r),e.bindAttribLocation(i,0,`aPosition`),e.linkProgram(i),e.deleteShader(n),e.deleteShader(r),!e.getProgramParameter(i,e.LINK_STATUS))return e.deleteProgram(i),null;let o={},s=e.getProgramParameter(i,e.ACTIVE_UNIFORMS);for(let t=0;t<s;t++){let n=e.getActiveUniform(i,t);n&&(o[n.name.replace(/\[0\]$/,``)]=e.getUniformLocation(i,n.name))}return{program:i,uniforms:o}},y=({speed:e=5,scale:t=1,color:n=`#7B7481`,sheenColor:a=`#ffffff`,noiseIntensity:o=1.5,rotation:_=0,sheen:y=.5,depth:b=.5,glow:x=.3,ripple:S=1,wave:C=1,variation:w=0,mouseInteraction:T=!0,interactionStrength:E=1,clickRipple:D=!0,intro:O=!0,fade:k=0,lightMode:A=!1,paused:j=!1,dpr:M,className:N=``,style:P})=>{let F=(0,r.useRef)(null),I=(0,r.useRef)(null),L=(0,r.useRef)(null),R=(0,r.useRef)(null);return R.current={speed:e,scale:t,color:String(n),sheenColor:String(a),noiseIntensity:Math.max(0,o),rotation:_,sheen:Math.max(0,y),depth:m(b,0,1),glow:Math.max(0,x),ripple:Math.max(0,S),wave:Math.max(0,C),variation:w,mouseInteraction:T,interactionStrength:Math.max(0,E),clickRipple:D,intro:O,fade:m(k,0,1),lightMode:A,paused:j,dpr:M},(0,r.useEffect)(()=>{let e=F.current,t=I.current,n=t?.getContext(`webgl2`,{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1,powerPreference:`high-performance`});if(!e||!t||!n)return;let r=v(n,s),i=v(n,c);if(!r||!i)return;let a=n.createBuffer(),o=n.createVertexArray();n.bindVertexArray(o),n.bindBuffer(n.ARRAY_BUFFER,a),n.bufferData(n.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),n.STATIC_DRAW),n.enableVertexAttribArray(0),n.vertexAttribPointer(0,2,n.FLOAT,!1,0,0);let _=n.createTexture(),y=n.createFramebuffer(),b={width:0,height:0},x=(e,t)=>{(b.width!==e||b.height!==t)&&(b.width=e,b.height=t,n.bindTexture(n.TEXTURE_2D,_),n.texImage2D(n.TEXTURE_2D,0,n.RGBA8,e,t,0,n.RGBA,n.UNSIGNED_BYTE,null),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR_MIPMAP_LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MAG_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE),n.bindFramebuffer(n.FRAMEBUFFER,y),n.framebufferTexture2D(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,_,0))},S=document.createElement(`canvas`).getContext(`2d`,{willReadFrequently:!0}),C=new Map,w=e=>{if(C.has(e))return C.get(e);let t=[1,1,1];if(S){S.clearRect(0,0,1,1),S.fillStyle=`#ffffff`,S.fillStyle=e,S.fillRect(0,0,1,1);let[n,r,i]=S.getImageData(0,0,1,1).data;t=[n/255,r/255,i/255]}return C.set(e,t),t},T=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches??!1,E={width:1,height:1,ratio:1},D={x:0,y:0,inside:!1},O=[],k=new Float32Array(16),A={flow:0,intro:R.current.intro&&!T?0:1,touch:0,x:0,y:0,dragX:0,dragY:0,lightX:f[0],lightY:f[1]},j=0,M=0,N=!0,P=(e,t,r,i,a)=>{let[o,s]=g(i.variation);n.uniform2f(e.uView,t,r),n.uniform1f(e.uScale,i.scale),n.uniform1f(e.uRotation,i.rotation),n.uniform1f(e.uTime,A.flow-u*(1-a)),n.uniform1f(e.uWave,i.wave),n.uniform1f(e.uRipple,i.ripple),n.uniform1f(e.uFold,.25+.75*a),n.uniform2f(e.uShift,o,s),n.uniform4f(e.uPointer,A.x/E.width,1-A.y/E.height,A.touch*i.interactionStrength,.32),n.uniform2f(e.uDrag,A.dragX,A.dragY),n.uniform4fv(e.uWaves,k)},z=()=>{let e=R.current,a=h(A.intro),s=1-(1-A.intro)**3;n.bindVertexArray(o),k.fill(0),O.slice(-4).forEach((e,t)=>{k.set([e.x,e.y,e.age*.6,Math.exp(-e.age/(d*.45))],t*4)}),e.glow>0&&(x(Math.max(1,Math.round(t.width/4)),Math.max(1,Math.round(t.height/4))),n.bindFramebuffer(n.FRAMEBUFFER,y),n.viewport(0,0,b.width,b.height),n.useProgram(r.program),P(r.uniforms,b.width,b.height,e,a),n.drawArrays(n.TRIANGLES,0,3),n.bindTexture(n.TEXTURE_2D,_),n.generateMipmap(n.TEXTURE_2D));let c=i.uniforms;n.bindFramebuffer(n.FRAMEBUFFER,null),n.viewport(0,0,t.width,t.height),n.useProgram(i.program),P(c,t.width,t.height,e,a),n.uniform3fv(c.uColor,w(e.color)),n.uniform3fv(c.uSheenColor,w(e.sheenColor)),n.uniform1f(c.uNoiseIntensity,e.noiseIntensity),n.uniform1f(c.uDepth,e.depth),n.uniform1f(c.uSheen,e.sheen),n.uniform1f(c.uGlow,e.glow),n.uniform1f(c.uLightMode,+!!e.lightMode),n.uniform3f(c.uLight,A.lightX,A.lightY,A.touch*e.interactionStrength),n.uniform2f(c.uStep,E.ratio/t.width,E.ratio/t.height),n.uniform1f(c.uPresence,s),n.uniform1f(c.uFade,e.fade),n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,_),n.uniform1i(c.uBloom,0),n.drawArrays(n.TRIANGLES,0,3)},B=e=>{if(j=0,!N||document.hidden)return;let t=R.current,n=M?Math.min(.05,(e-M)/1e3):1/60;M=e;let r=!t.paused&&!T&&t.speed!==0;r&&(A.flow+=n*.1*t.speed),!t.intro||T?A.intro=1:A.intro<1&&(A.intro=Math.min(1,A.intro+n/l));let i=t.mouseInteraction&&D.inside&&!T;i&&A.touch<.01&&(A.x=D.x,A.y=D.y);let a=1-Math.exp(-n*10),o=A.x,s=A.y;A.x+=(D.x-A.x)*a,A.y+=(D.y-A.y)*a;let c=(A.x-o)/Math.max(n,.001)/E.height,u=(A.y-s)/Math.max(n,.001)/E.height,h=1-Math.exp(-n*4);A.dragX+=(m(c*.03,-.06,.06)-A.dragX)*h,A.dragY+=(m(-u*.03,-.06,.06)-A.dragY)*h,A.touch+=(+!!i-A.touch)*(1-Math.exp(-n*(i?3.5:1.4)));let g=f[0],_=f[1];if(i){let e=(D.x/E.width-.5)*(E.width/E.height),t=.5-D.y/E.height,n=Math.hypot(e,t);n>.04?(g=e/n*p,_=t/n*p):(g=A.lightX,_=A.lightY)}let v=1-Math.exp(-n*3);A.lightX+=(g-A.lightX)*v,A.lightY+=(_-A.lightY)*v;for(let e=O.length-1;e>=0;e--)O[e].age+=n,O[e].age>d*2.5&&O.splice(e,1);z();let y=A.intro<1||O.length>0||Math.abs(+!!i-A.touch)>.002||Math.abs(A.dragX)+Math.abs(A.dragY)>2e-4||Math.abs(D.x-A.x)+Math.abs(D.y-A.y)>.3||Math.abs(g-A.lightX)+Math.abs(_-A.lightY)>.001;r||y?j=requestAnimationFrame(B):M=0},V=()=>{!j&&N&&!document.hidden&&(j=requestAnimationFrame(B))},H=()=>{let n=R.current,r=Math.max(1,e.clientWidth),i=Math.max(1,e.clientHeight),a=Math.min(n.dpr||window.devicePixelRatio||1,2);E.width=r,E.height=i,E.ratio=a,t.width=Math.max(1,Math.round(r*a)),t.height=Math.max(1,Math.round(i*a)),j||z(),V()},U=t=>{let n=e.getBoundingClientRect(),r=t.clientX-n.left,i=t.clientY-n.top;return{x:r,y:i,inside:r>=0&&i>=0&&r<=n.width&&i<=n.height}},W=e=>{let t=U(e);D.x=t.x,D.y=t.y,D.inside=t.inside,V()},G=e=>{if(!R.current.clickRipple||T)return;let t=U(e);t.inside&&(O.push({x:t.x/E.width,y:1-t.y/E.height,age:0}),O.length>4&&O.shift(),V())},K=()=>{D.inside=!1,V()},q=()=>{M=0,V()},J=new ResizeObserver(H);J.observe(e);let Y=new IntersectionObserver(e=>{N=e.some(e=>e.isIntersecting),N&&(M=0,V())});Y.observe(e),window.addEventListener(`pointermove`,W,{passive:!0}),window.addEventListener(`pointerdown`,G,{passive:!0}),document.documentElement.addEventListener(`pointerleave`,K),document.addEventListener(`visibilitychange`,q),H();let X=R.current.dpr;return L.current=()=>{let e=R.current;e.dpr===X?(j||z(),V()):(X=e.dpr,H())},()=>{cancelAnimationFrame(j),L.current=null,J.disconnect(),Y.disconnect(),window.removeEventListener(`pointermove`,W),window.removeEventListener(`pointerdown`,G),document.documentElement.removeEventListener(`pointerleave`,K),document.removeEventListener(`visibilitychange`,q),n.deleteTexture(_),n.deleteFramebuffer(y),n.deleteProgram(r.program),n.deleteProgram(i.program),n.deleteBuffer(a),n.deleteVertexArray(o),n.getExtension(`WEBGL_lose_context`)?.loseContext()}},[]),(0,r.useEffect)(()=>{L.current?.()}),(0,i.jsx)(`div`,{ref:F,className:`relative w-full h-full overflow-hidden ${N}`,style:P,children:(0,i.jsx)(`canvas`,{ref:I,className:`absolute inset-0 block w-full h-full`,"aria-hidden":`true`})})};export{y as default};