import{i as e,t}from"./react-sySUN5R7.js";import{O as n}from"./sculpture-dark-Cfb-XN1r.js";var r=e(t(),1),i=n(),a=`#version 300 es
in vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`,o=`#version 300 es
precision highp float;
const float PI = 3.14159265;
const float TAU = 6.28318531;
const float HALF_PI = 1.5707963;
`,s=`
uniform vec2 uView;
uniform vec2 uOffset;
uniform float uRotation;
uniform float uFocalLength;
uniform float uTime;
uniform float uSpeed1;
uniform float uSpeed2;
uniform float uDir2;
uniform float uBend1;
uniform float uBend2;
uniform float uThickness;
uniform vec3 uHeat;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform float uCore;
uniform float uRange;

vec4 traceLight(vec2 pixel) {
  vec2 coord = pixel + uOffset - 0.5 * uView;
  float c = cos(uRotation);
  float sn = sin(uRotation);
  coord = mat2(c, -sn, sn, c) * coord;
  vec3 u = normalize(vec3(coord / uView.y, uFocalLength));
  vec3 o = vec3(0.0, 0.0, -7.0);
  float t = uTime * PI;
  float t1 = t * 0.7;
  float t2 = t * 0.9;
  float tSpeed1 = t * uSpeed1;
  float tSpeed2 = t * uSpeed2 * uDir2;
  float s = 1.0;
  float d = 0.0;
  vec2 k = vec2(0.0);
  for (int i = 0; i < 14; ++i) {
    vec3 p = o + u * d;
    p.x -= 15.0;
    float px = p.x;
    float swell = uHeat.y * exp(-pow((px - uHeat.x) / uHeat.z, 2.0));
    float wob1 = uBend1 + swell * (0.16 + 0.2 * uBend1) + sin(t1 + px * 0.8) * 0.1;
    float wob2 = uBend2 + swell * (0.16 + 0.2 * uBend2) + cos(t2 + px * 1.1) * 0.1;
    vec2 a = sin(vec2(px, px + HALF_PI) + tSpeed1) * wob1;
    vec2 b = cos(vec2(px, px + HALF_PI) + tSpeed2) * wob2;
    float cut = px + uThickness;
    k.x = max(cut, length(p.yz - a) - uThickness);
    k.y = max(cut, length(p.yz - b) - uThickness);
    s = min(s, min(k.x, k.y));
    if (s < 0.001 || d > 300.0) break;
    d += s * 0.7;
  }
  vec3 raw = max(cos(d * TAU) - s * sqrt(d) - vec3(k, 0.0), 0.0);
  float field = max(raw.r, max(raw.g, raw.b));
  raw.gb += 0.1;
  raw = raw * 0.4 + raw.brg * 0.6 + raw * raw;
  float lum = dot(raw, vec3(0.299, 0.587, 0.114));
  float w1 = max(0.0, 1.0 - k.x * 2.0) + 0.0001;
  float w2 = max(0.0, 1.0 - k.y * 2.0) + 0.0001;
  vec3 base = (uColor1 * w1 + uColor2 * w2) / (w1 + w2);
  float soft = smoothstep(0.03, 0.36, field);
  float hot = smoothstep(0.32, 0.8, field);
  vec3 light = base * lum * 2.6 * soft + mix(base, vec3(1.0), 0.55) * hot * uCore * 2.0;
  return vec4(light * uRange, field);
}
`,c=`${o}
${s}
uniform vec2 uScale;
out vec4 outColor;
void main() {
  outColor = traceLight(gl_FragCoord.xy * uScale);
}`,l=`${o}
${s}
uniform vec2 uScale;
uniform sampler2D uCoarse;
uniform vec2 uCoarseSize;
uniform vec2 uFineSize;
out vec4 outColor;
void main() {
  vec2 uv = gl_FragCoord.xy / uFineSize;
  vec2 pos = uv * uCoarseSize - 0.5;
  ivec2 cell = ivec2(floor(pos));
  ivec2 last = ivec2(uCoarseSize) - 1;
  float a = texelFetch(uCoarse, clamp(cell, ivec2(0), last), 0).a;
  float b = texelFetch(uCoarse, clamp(cell + ivec2(1, 0), ivec2(0), last), 0).a;
  float c = texelFetch(uCoarse, clamp(cell + ivec2(0, 1), ivec2(0), last), 0).a;
  float d = texelFetch(uCoarse, clamp(cell + ivec2(1, 1), ivec2(0), last), 0).a;
  float high = max(max(a, b), max(c, d));
  float low = min(min(a, b), min(c, d));
  if (high > 0.02 && low < 0.4) outColor = traceLight(gl_FragCoord.xy * uScale);
  else outColor = texture(uCoarse, uv);
}`,u=`${o}
uniform sampler2D uSource;
uniform vec2 uTexel;
uniform vec2 uTarget;
out vec4 outColor;
void main() {
  vec2 uv = gl_FragCoord.xy / uTarget;
  vec4 sum = texture(uSource, uv) * 4.0;
  sum += texture(uSource, uv - uTexel);
  sum += texture(uSource, uv + uTexel);
  sum += texture(uSource, uv + vec2(uTexel.x, -uTexel.y));
  sum += texture(uSource, uv - vec2(uTexel.x, -uTexel.y));
  outColor = sum / 8.0;
}`,d=`${o}
uniform sampler2D uSource;
uniform sampler2D uBase;
uniform vec2 uTexel;
uniform vec2 uTarget;
out vec4 outColor;
void main() {
  vec2 uv = gl_FragCoord.xy / uTarget;
  vec2 h = uTexel * 0.5;
  vec4 sum = texture(uSource, uv + vec2(-h.x * 2.0, 0.0));
  sum += texture(uSource, uv + vec2(h.x * 2.0, 0.0));
  sum += texture(uSource, uv + vec2(0.0, -h.y * 2.0));
  sum += texture(uSource, uv + vec2(0.0, h.y * 2.0));
  sum += texture(uSource, uv + vec2(-h.x, h.y)) * 2.0;
  sum += texture(uSource, uv + h) * 2.0;
  sum += texture(uSource, uv + vec2(h.x, -h.y)) * 2.0;
  sum += texture(uSource, uv - h) * 2.0;
  outColor = sum / 12.0 + texture(uBase, uv);
}`,f=`${o}
uniform sampler2D uLight;
uniform sampler2D uBloom;
uniform vec2 uResolution;
uniform float uExposure;
uniform float uGlow;
uniform float uCore;
uniform float uPresence;
uniform float uGrain;
uniform float uFade;
uniform float uOpacity;
uniform float uTime;
uniform float uLightMode;
uniform vec3 uLens;
out vec4 outColor;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float smootherstep(float edge, float x) {
  float t = clamp(x / max(edge, 0.0001), 0.0, 1.0);
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  vec2 offset = gl_FragCoord.xy - uLens.xy;
  float lens = uLens.z * exp(-dot(offset, offset) / (uResolution.y * uResolution.y * 0.045));
  vec4 source = texture(uLight, uv);
  vec3 hdr = source.rgb * uExposure * uPresence * (1.0 + lens * 0.35);
  hdr += texture(uBloom, uv).rgb * uExposure * uPresence * uGlow * (0.18 + lens * 0.08);
  float edge = uFade * 0.5;
  float mask = smootherstep(edge, uv.x) * smootherstep(edge, 1.0 - uv.x) * smootherstep(edge, uv.y) * smootherstep(edge, 1.0 - uv.y);
  float grain = (hash(gl_FragCoord.xy + fract(uTime * 7.31) * 113.0) - 0.5) * uGrain;
  float peak = max(hdr.r, max(hdr.g, hdr.b));
  if (uLightMode > 0.5) {
    vec3 hue = hdr / max(peak, 0.0001);
    float tone = dot(hue, vec3(0.2126, 0.7152, 0.0722));
    vec3 ink = pow(clamp(hue * min(1.0, 0.6 / max(tone, 0.001)), 0.0, 1.0), vec3(1.0 / 2.2));
    float feather = max(fwidth(source.a) * 1.25, 0.02);
    float body = smoothstep(0.15 - feather, 0.15 + feather, source.a) * uPresence;
    vec3 color = mix(ink, vec3(1.0), smoothstep(12.0, 26.0, peak) * uCore);
    float halo = (1.0 - exp(-peak * 0.5)) * 0.3 * min(uGlow, 1.5);
    float alpha = clamp(body * 0.92 + (1.0 - body) * halo, 0.0, 1.0) * mask * uOpacity;
    color = mix(ink, color, body);
    outColor = vec4(clamp(color + grain, 0.0, 1.0) * alpha, alpha);
  } else {
    vec3 mapped = 1.0 - exp(-hdr);
    float level = max(mapped.r, max(mapped.g, mapped.b));
    mapped = clamp(mapped + grain * level, 0.0, 1.0) * mask * uOpacity;
    outColor = vec4(mapped, max(mapped.r, max(mapped.g, mapped.b)));
  }
}`,p=4,m=3,h=1.8,g=24e5,_=(e,t,n)=>Math.min(n,Math.max(t,e)),v=(e,t,n)=>{let r=e.createShader(t);return r?(e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(e.deleteShader(r),null)):null},y=(e,t)=>{let n=v(e,e.VERTEX_SHADER,a),r=v(e,e.FRAGMENT_SHADER,t),i=e.createProgram();if(!n||!r||!i)return null;if(e.attachShader(i,n),e.attachShader(i,r),e.bindAttribLocation(i,0,`aPosition`),e.linkProgram(i),e.deleteShader(n),e.deleteShader(r),!e.getProgramParameter(i,e.LINK_STATUS))return e.deleteProgram(i),null;let o={},s=e.getProgramParameter(i,e.ACTIVE_UNIFORMS);for(let t=0;t<s;t++){let n=e.getActiveUniform(i,t);n&&(o[n.name]=e.getUniformLocation(i,n.name))}return{program:i,uniforms:o}};function b({colors:e=[`#A855F7`,`#06B6D4`],speed:t=1,speed1:n=.05,speed2:a=.05,dir2:o=1,bend1:s=1,bend2:v=.5,thickness:b=.3,focalLength:x=1.25,rotationDeg:S=0,xOffset:C=0,yOffset:w=0,brightness:T=1,glow:E=1,core:D=.6,grain:O=.03,quality:k=1,mouseInteraction:A=!0,intro:j=!0,fade:M=0,opacity:N=1,lightMode:P=!1,paused:F=!1,dpr:I,className:L=``,...R}){let z=(0,r.useRef)(null),B=(0,r.useRef)(null),V=(0,r.useRef)(null),H={color1:String(e?.[0]??`#A855F7`),color2:String(e?.[1]??e?.[0]??`#06B6D4`),speed:t,speed1:n,speed2:a,dir2:o,bend1:s,bend2:v,thickness:Math.max(.02,b),focalLength:Math.max(.05,x),rotation:S*Math.PI/180,xOffset:C,yOffset:w,brightness:Math.max(0,T),glow:Math.max(0,E),core:_(D,0,1),grain:Math.max(0,O),quality:_(k,.25,1),mouseInteraction:A,intro:j,fade:_(M,0,1),opacity:_(N,0,1),lightMode:P,paused:F,dpr:I},U=(0,r.useRef)(H);return U.current=H,(0,r.useEffect)(()=>{let e=z.current,t=B.current,n=t?.getContext(`webgl2`,{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1,powerPreference:`high-performance`});if(!e||!t||!n)return;let r=!!n.getExtension(`EXT_color_buffer_float`),i=r?1:.25,a={coarse:y(n,c),fine:y(n,l),down:y(n,u),up:y(n,d),composite:y(n,f)};if(Object.values(a).some(e=>!e))return;let o=n.createBuffer(),s=n.createVertexArray();n.bindVertexArray(s),n.bindBuffer(n.ARRAY_BUFFER,o),n.bufferData(n.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),n.STATIC_DRAW),n.enableVertexAttribArray(0),n.vertexAttribPointer(0,2,n.FLOAT,!1,0,0);let v=()=>({texture:n.createTexture(),framebuffer:n.createFramebuffer(),width:0,height:0}),b=(e,t,i)=>{(e.width!==t||e.height!==i)&&(e.width=t,e.height=i,n.bindTexture(n.TEXTURE_2D,e.texture),r?n.texImage2D(n.TEXTURE_2D,0,n.RGBA16F,t,i,0,n.RGBA,n.HALF_FLOAT,null):n.texImage2D(n.TEXTURE_2D,0,n.RGBA,t,i,0,n.RGBA,n.UNSIGNED_BYTE,null),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MAG_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE),n.bindFramebuffer(n.FRAMEBUFFER,e.framebuffer),n.framebufferTexture2D(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,e.texture,0))},x=v(),S=v(),C=Array.from({length:5},v),w=Array.from({length:p},v),T=document.createElement(`canvas`).getContext(`2d`,{willReadFrequently:!0}),E=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches??!1,D=new Map,O=e=>{let t=D.get(e);if(t)return t;let n=[1,1,1];if(T){T.clearRect(0,0,1,1),T.fillStyle=`#000000`,T.fillStyle=e,T.fillRect(0,0,1,1);let[t,r,i]=T.getImageData(0,0,1,1).data;n=[t,r,i].map(e=>(e/255)**2.2)}return D.set(e,n),n},k={width:1,height:1,fineWidth:1,fineHeight:1,coarseWidth:1,coarseHeight:1},A={x:0,y:0,inside:!1},j={time:0,intro:U.current.intro&&!E?0:1,heat:0,heatVelocity:0,heatX:0,lensX:0,lensY:0},M=0,N=0,P=!0,F=(e,t,r,i)=>{n.bindFramebuffer(n.FRAMEBUFFER,t?t.framebuffer:null),n.viewport(0,0,r,i),n.useProgram(e.program),n.drawArrays(n.TRIANGLES,0,3)},I=(e,t,r,i)=>{n.activeTexture(n.TEXTURE0+r),n.bindTexture(n.TEXTURE_2D,i),n.uniform1i(e.uniforms[t],r)},L=(e,t,r)=>{let a=e.uniforms;n.useProgram(e.program),n.uniform2f(a.uView,k.width,k.height),n.uniform2f(a.uOffset,t.xOffset,t.yOffset),n.uniform1f(a.uRotation,t.rotation),n.uniform1f(a.uFocalLength,t.focalLength),n.uniform1f(a.uTime,j.time),n.uniform1f(a.uSpeed1,t.speed1),n.uniform1f(a.uSpeed2,t.speed2),n.uniform1f(a.uDir2,t.dir2),n.uniform1f(a.uBend1,t.bend1*(.3+.7*r)),n.uniform1f(a.uBend2,t.bend2*(.3+.7*r)),n.uniform1f(a.uThickness,t.thickness),n.uniform3f(a.uHeat,j.heatX,j.heat,1.4),n.uniform3fv(a.uColor1,O(t.color1)),n.uniform3fv(a.uColor2,O(t.color2)),n.uniform1f(a.uCore,t.core),n.uniform1f(a.uRange,i)},R=()=>{let e=U.current,r=j.intro*j.intro*(3-2*j.intro);n.bindVertexArray(s),b(x,k.coarseWidth,k.coarseHeight),b(S,k.fineWidth,k.fineHeight),L(a.coarse,e,r),n.uniform2f(a.coarse.uniforms.uScale,k.width/k.coarseWidth,k.height/k.coarseHeight),F(a.coarse,x,k.coarseWidth,k.coarseHeight);let o=a.fine;L(o,e,r),n.uniform2f(o.uniforms.uScale,k.width/k.fineWidth,k.height/k.fineHeight),n.uniform2f(o.uniforms.uCoarseSize,k.coarseWidth,k.coarseHeight),n.uniform2f(o.uniforms.uFineSize,k.fineWidth,k.fineHeight),I(o,`uCoarse`,0,x.texture),F(o,S,k.fineWidth,k.fineHeight);let c=S;for(let e=0;e<=p;e++){let t=C[e],r=e===0?Math.round(k.width/2):c.width>>1,i=e===0?Math.round(k.height/2):c.height>>1;b(t,Math.max(1,r),Math.max(1,i)),n.useProgram(a.down.program),n.uniform2f(a.down.uniforms.uTexel,1/c.width,1/c.height),n.uniform2f(a.down.uniforms.uTarget,t.width,t.height),I(a.down,`uSource`,0,c.texture),F(a.down,t,t.width,t.height),c=t}for(let e=3;e>=1;e--){let t=e===3?C[p]:w[e+1],r=w[e];b(r,C[e].width,C[e].height),n.useProgram(a.up.program),n.uniform2f(a.up.uniforms.uTexel,1/t.width,1/t.height),n.uniform2f(a.up.uniforms.uTarget,r.width,r.height),I(a.up,`uSource`,0,t.texture),I(a.up,`uBase`,1,C[e].texture),F(a.up,r,r.width,r.height)}let l=a.composite,u=l.uniforms;n.useProgram(l.program),n.uniform2f(u.uResolution,t.width,t.height),n.uniform1f(u.uExposure,2.4*e.brightness/i),n.uniform1f(u.uGlow,e.glow),n.uniform1f(u.uCore,e.core),n.uniform1f(u.uPresence,r*r),n.uniform1f(u.uGrain,e.grain),n.uniform1f(u.uFade,e.fade),n.uniform1f(u.uOpacity,e.opacity),n.uniform1f(u.uTime,j.time),n.uniform1f(u.uLightMode,+!!e.lightMode),n.uniform3f(u.uLens,j.lensX*t.width/k.width,(k.height-j.lensY)*t.height/k.height,j.heat),I(l,`uLight`,0,S.texture),I(l,`uBloom`,1,w[1].texture),F(l,null,t.width,t.height)},H=e=>{if(!(e.mouseInteraction&&A.inside)||E)return null;let t=A.x+e.xOffset-k.width/2,n=k.height-A.y+e.yOffset-k.height/2,r=Math.cos(e.rotation),i=Math.sin(e.rotation);return 7*(r*t+i*n)/k.height/e.focalLength-15},W=e=>{if(M=0,!P||document.hidden)return;let t=U.current,n=N?Math.min(.05,(e-N)/1e3):1/60;N=e;let r=!t.paused&&!E;r&&(j.time+=n*t.speed),!t.intro||E?j.intro=1:j.intro<1&&(j.intro=Math.min(1,j.intro+n/h));let i=H(t);i!==null&&(j.heatX+=(i-j.heatX)*(1-Math.exp(-n*6))),j.heatVelocity+=(120*((i===null?0:1)-j.heat)-19*j.heatVelocity)*n,j.heat=_(j.heat+j.heatVelocity*n,0,1.15),j.lensX+=(A.x-j.lensX)*(1-Math.exp(-n*8)),j.lensY+=(A.y-j.lensY)*(1-Math.exp(-n*8)),R();let a=j.intro<1||j.heat>.001||Math.abs(j.heatVelocity)>.001;r||a?M=requestAnimationFrame(W):N=0},G=()=>{!M&&P&&!document.hidden&&(M=requestAnimationFrame(W))},K=()=>{let n=U.current,r=Math.max(1,e.clientWidth),i=Math.max(1,e.clientHeight),a=Math.min(n.dpr||window.devicePixelRatio||1,2);k.width=r,k.height=i,t.width=Math.max(1,Math.round(r*a)),t.height=Math.max(1,Math.round(i*a));let o=n.quality;r*i*o*o>g&&(o=Math.sqrt(g/(r*i))),k.fineWidth=Math.max(1,Math.round(r*o)),k.fineHeight=Math.max(1,Math.round(i*o)),k.coarseWidth=Math.max(1,Math.round(k.fineWidth/m)),k.coarseHeight=Math.max(1,Math.round(k.fineHeight/m)),M||R(),G()},q=t=>{let n=e.getBoundingClientRect();A.x=t.clientX-n.left,A.y=t.clientY-n.top,A.inside=A.x>=0&&A.y>=0&&A.x<=n.width&&A.y<=n.height,G()},J=()=>{A.inside=!1,G()},Y=()=>{N=0,G()},X=new ResizeObserver(K);X.observe(e);let Z=new IntersectionObserver(e=>{P=e.some(e=>e.isIntersecting),P&&(N=0,G())});Z.observe(e),window.addEventListener(`pointermove`,q,{passive:!0}),document.documentElement.addEventListener(`pointerleave`,J),document.addEventListener(`visibilitychange`,Y),K();let Q=U.current.quality,$=U.current.dpr;return V.current=()=>{let e=U.current;e.quality!==Q||e.dpr!==$?(Q=e.quality,$=e.dpr,K()):(M||R(),G())},()=>{cancelAnimationFrame(M),V.current=null,X.disconnect(),Z.disconnect(),window.removeEventListener(`pointermove`,q),document.documentElement.removeEventListener(`pointerleave`,J),document.removeEventListener(`visibilitychange`,Y);for(let e of[x,S,...C,...w])n.deleteTexture(e.texture),n.deleteFramebuffer(e.framebuffer);for(let e of Object.values(a))n.deleteProgram(e.program);n.deleteBuffer(o),n.deleteVertexArray(s),n.getExtension(`WEBGL_lose_context`)?.loseContext()}},[]),(0,r.useEffect)(()=>{V.current?.()}),(0,i.jsx)(`div`,{ref:z,className:[`relative h-full w-full overflow-hidden`,L].filter(Boolean).join(` `),...R,children:(0,i.jsx)(`canvas`,{ref:B,className:`absolute inset-0 block h-full w-full`,"aria-hidden":`true`})})}export{b as default};