import{i as e,t}from"./react-sySUN5R7.js";import{k as n}from"./sculpture-dark-CKiqtzhU.js";var r=e(t(),1),i=n(),a=`#version 300 es
in vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`,o=`#version 300 es
precision highp float;
uniform vec2 uView;
uniform vec2 uScale;
uniform vec2 uTurn;
uniform float uTime;
uniform float uWidth;
uniform float uWave;
uniform float uDepth;
uniform float uRough;
uniform float uSeed;
uniform float uTwist;
uniform vec3 uLight;
uniform float uFill;
uniform float uCamera;
uniform vec4 uPointer;
out vec4 outColor;

const float PI = 3.141592653589793;

vec4 permute(vec4 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

vec4 taylorInvSqrt(vec4 r) {
  return 1.79284291400159 - 0.85373472095314 * r;
}

vec3 fade(vec3 t) {
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

float cnoise(vec3 P) {
  vec3 Pi0 = floor(P);
  vec3 Pi1 = Pi0 + vec3(1.0);
  Pi0 = mod(Pi0, 289.0);
  Pi1 = mod(Pi1, 289.0);
  vec3 Pf0 = fract(P);
  vec3 Pf1 = Pf0 - vec3(1.0);
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;
  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);
  vec4 gx0 = ixy0 / 7.0;
  vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);
  vec4 gx1 = ixy1 / 7.0;
  vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);
  vec3 g000 = vec3(gx0.x, gy0.x, gz0.x);
  vec3 g100 = vec3(gx0.y, gy0.y, gz0.y);
  vec3 g010 = vec3(gx0.z, gy0.z, gz0.z);
  vec3 g110 = vec3(gx0.w, gy0.w, gz0.w);
  vec3 g001 = vec3(gx1.x, gy1.x, gz1.x);
  vec3 g101 = vec3(gx1.y, gy1.y, gz1.y);
  vec3 g011 = vec3(gx1.z, gy1.z, gz1.z);
  vec3 g111 = vec3(gx1.w, gy1.w, gz1.w);
  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;
  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);
  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
  return 2.2 * n_xyz;
}

float laneHash(float lane) {
  return fract(sin(lane * 91.3458 + uSeed * 17.17) * 47453.5453);
}

float lobe(float nh, float nl, float nv, float vh, float roughness) {
  float a = roughness * roughness;
  float a2 = a * a;
  float d = nh * nh * (a2 - 1.0) + 1.0;
  float distribution = a2 / (PI * d * d);
  float gv = nl * sqrt(nv * nv * (1.0 - a2) + a2);
  float gl = nv * sqrt(nl * nl * (1.0 - a2) + a2);
  float visibility = 0.5 / max(gv + gl, 0.0001);
  float fresnel = 0.028 + 0.972 * pow(1.0 - vh, 5.0);
  return distribution * visibility * fresnel * nl;
}

vec2 glint(float lane, vec2 local) {
  float along = local.y / uWave - laneHash(lane) * 60.0;
  float step = 0.01;
  float slope = (cnoise(vec3(0.0, along + step, uTime)) - cnoise(vec3(0.0, along - step, uTime))) / (2.0 * step);
  slope *= 0.2 * uDepth;
  float spin = laneHash(lane + 0.37);
  float tilt = ((spin - 0.5) * 0.5 + sin(uTime * 2.1 + spin * 6.2831) * 0.06) * uTwist;
  vec3 normal = normalize(vec3(tilt, -slope, 1.0));
  vec3 view = normalize(vec3(-local, uCamera));
  float nv = max(dot(normal, view), 0.0001);
  vec3 light = normalize(uLight);
  vec3 halfway = normalize(light + view);
  float core = lobe(max(dot(normal, halfway), 0.0), max(dot(normal, light), 0.0), nv, max(dot(view, halfway), 0.0), uRough);
  vec3 fill = normalize(vec3(0.0, -uLight.y * 1.25, uLight.z));
  vec3 fillHalf = normalize(fill + view);
  core += uFill * lobe(max(dot(normal, fillHalf), 0.0), max(dot(normal, fill), 0.0), nv, max(dot(view, fillHalf), 0.0), uRough);
  return vec2(core, core);
}

void main() {
  vec2 css = gl_FragCoord.xy * uScale;
  vec2 centered = css - uView * 0.5;
  vec2 local = mat2(uTurn.x, -uTurn.y, uTurn.y, uTurn.x) * centered;

  float across = local.x / uWidth + 0.5;
  float lane = floor(across);
  float u = across - lane;
  vec2 value = glint(lane, local);

  float pixel = max(uScale.x, uScale.y);
  float seam = min(u, 1.0 - u) * uWidth;
  if (seam < pixel * 1.5) {
    float other = u < 0.5 ? lane - 1.0 : lane + 1.0;
    float blend = 0.5 * (1.0 - smoothstep(0.0, pixel * 1.5, seam));
    value = mix(value, glint(other, local), blend);
  }

  vec2 toPointer = css - uPointer.xy;
  float near = exp(-dot(toPointer, toPointer) / (2.0 * uPointer.w * uPointer.w)) * uPointer.z;
  value *= 1.0 + near * 0.8;
  float hot = max(value.y - 0.18, 0.0);
  outColor = vec4(value.x, value.y, min(hot, 6.0), 1.0);
}`,s=`#version 300 es
precision highp float;
uniform sampler2D uField;
uniform vec2 uResolution;
uniform vec3 uColor;
uniform vec3 uInk;
uniform float uGain;
uniform float uGlow;
uniform float uPresence;
uniform float uGrain;
uniform float uFade;
uniform float uOpacity;
uniform float uLightMode;
out vec4 outColor;

float random(vec2 st) {
  return fract(sin(dot(st, vec2(12.9898, 78.233))) * 43758.5453123);
}

float grainNoise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

vec3 acesFilmic(vec3 color) {
  const mat3 inputMatrix = mat3(
    vec3(0.59719, 0.07600, 0.02840),
    vec3(0.35458, 0.90834, 0.13383),
    vec3(0.04823, 0.01566, 0.83777)
  );
  const mat3 outputMatrix = mat3(
    vec3(1.60475, -0.10208, -0.00327),
    vec3(-0.53108, 1.10813, -0.07276),
    vec3(-0.07367, -0.00605, 1.07602)
  );
  color = inputMatrix * (color / 0.6);
  vec3 a = color * (color + 0.0245786) - 0.000090537;
  vec3 b = color * (0.983729 * color + 0.4329510) + 0.238081;
  color = outputMatrix * (a / b);
  return clamp(color, 0.0, 1.0);
}

vec3 toSrgb(vec3 color) {
  return mix(color * 12.92, 1.055 * pow(color, vec3(1.0 / 2.4)) - 0.055, step(vec3(0.0031308), color));
}

float feather(float x, float edge) {
  float t = clamp(x / max(edge, 0.0001), 0.0, 1.0);
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  float radiance = textureLod(uField, uv, 0.0).r;
  float bloom = 0.0;
  bloom += textureLod(uField, uv, 2.0).b * 0.3;
  bloom += textureLod(uField, uv, 3.0).b * 0.3;
  bloom += textureLod(uField, uv, 4.0).b * 0.22;
  bloom += textureLod(uField, uv, 5.0).b * 0.18;

  float hot = textureLod(uField, uv, 0.0).g;
  vec3 light = uColor * (radiance + bloom * uGlow) * uGain;
  light += mix(uColor, vec3(1.0), 0.7) * hot * hot * 0.12 * uGain;
  light *= uPresence;
  vec3 color = toSrgb(acesFilmic(light));
  color -= grainNoise(gl_FragCoord.xy) / 15.0 * uGrain;
  color = max(color, 0.0);

  float edge = uFade * 0.5;
  float mask = feather(uv.x, edge) * feather(1.0 - uv.x, edge) * feather(uv.y, edge) * feather(1.0 - uv.y, edge);
  mask *= uOpacity;
  float dither = (random(gl_FragCoord.yx + 31.7) - 0.5) / 255.0;

  float peak = max(color.r, max(color.g, color.b));
  if (uLightMode > 0.5) {
    float alpha = clamp(peak * 0.9 + dither, 0.0, 1.0) * mask;
    outColor = vec4(uInk * alpha, alpha);
  } else {
    color = clamp(color + dither, 0.0, 1.0) * mask;
    outColor = vec4(color, max(color.r, max(color.g, color.b)));
  }
}`,c=1.6,l=16e5,u=(e,t,n)=>Math.min(n,Math.max(t,e)),d=(e,t,n)=>{let r=e.createShader(t);return r?(e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(e.deleteShader(r),null)):null},f=(e,t)=>{let n=d(e,e.VERTEX_SHADER,a),r=d(e,e.FRAGMENT_SHADER,t),i=e.createProgram();if(!n||!r||!i)return null;if(e.attachShader(i,n),e.attachShader(i,r),e.bindAttribLocation(i,0,`aPosition`),e.linkProgram(i),e.deleteShader(n),e.deleteShader(r),!e.getProgramParameter(i,e.LINK_STATUS))return e.deleteProgram(i),null;let o={},s=e.getProgramParameter(i,e.ACTIVE_UNIFORMS);for(let t=0;t<s;t++){let n=e.getActiveUniform(i,t);n&&(o[n.name]=e.getUniformLocation(i,n.name))}return{program:i,uniforms:o}},p=({color:e=`#ffffff`,beamWidth:t=140,rotation:n=30,speed:a=1,waveLength:d=233,depth:p=1,sharpness:m=.6,twist:h=0,fillLight:g=.3,glow:_=.6,brightness:v=1.6,variation:y=0,grain:b=.35,quality:x=.75,mouseInteraction:S=!0,mouseStrength:C=1,intro:w=!0,fade:T=0,opacity:E=1,lightMode:D=!1,backgroundColor:O,paused:k=!1,dpr:A,className:j=``,style:M,...N})=>{let P=(0,r.useRef)(null),F=(0,r.useRef)(null),I=(0,r.useRef)(null),L={color:String(e),beamWidth:Math.max(8,t),rotation:n,speed:a,waveLength:Math.max(20,d),depth:Math.max(0,p),sharpness:u(m,0,1),twist:u(h,0,2),fillLight:u(g,0,1.5),glow:Math.max(0,_),brightness:Math.max(0,v),variation:Number(y)||0,grain:Math.max(0,b),quality:u(x,.25,1),mouseInteraction:S,mouseStrength:Math.max(0,C),intro:w,fade:u(T,0,1),opacity:u(E,0,1),lightMode:D,paused:k,dpr:A},R=(0,r.useRef)(L);return R.current=L,(0,r.useEffect)(()=>{let e=P.current,t=F.current,n=t?.getContext(`webgl2`,{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1,powerPreference:`high-performance`});if(!e||!t||!n)return;let r=!!n.getExtension(`EXT_color_buffer_float`),i=f(n,o),a=f(n,s);if(!i||!a)return;let d=n.createBuffer(),p=n.createVertexArray();n.bindVertexArray(p),n.bindBuffer(n.ARRAY_BUFFER,d),n.bufferData(n.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),n.STATIC_DRAW),n.enableVertexAttribArray(0),n.vertexAttribPointer(0,2,n.FLOAT,!1,0,0);let m=null,h=n.createFramebuffer(),g={width:0,height:0},_=(e,t)=>{if(g.width===e&&g.height===t)return;g.width=e,g.height=t,m&&n.deleteTexture(m),m=n.createTexture(),n.bindTexture(n.TEXTURE_2D,m);let i=Math.floor(Math.log2(Math.max(e,t)))+1;n.texStorage2D(n.TEXTURE_2D,i,r?n.RGBA16F:n.RGBA8,e,t),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR_MIPMAP_LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MAG_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE),n.bindFramebuffer(n.FRAMEBUFFER,h),n.framebufferTexture2D(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,m,0)},v=document.createElement(`canvas`).getContext(`2d`,{willReadFrequently:!0}),y=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches??!1,b=new Map,x=e=>{let t=b.get(e);if(t)return t;let n=[1,1,1];if(v){v.clearRect(0,0,1,1),v.fillStyle=`#ffffff`,v.fillStyle=e,v.fillRect(0,0,1,1);let[t,r,i]=v.getImageData(0,0,1,1).data;n=[t,r,i].map(e=>(e/255)**2.2)}return b.set(e,n),n},S={width:1,height:1,fieldWidth:1,fieldHeight:1},C={x:0,y:0,inside:!1},w={clock:0,intro:R.current.intro&&!y?0:1,reach:0,x:0,y:0,lightY:0},T=0,E=0,D=!0,O=()=>{let e=R.current,r=w.intro*w.intro*w.intro*(w.intro*(w.intro*6-15)+10);n.bindVertexArray(p),_(S.fieldWidth,S.fieldHeight);let o=e.rotation*Math.PI/180,s=(1-r)*-9,c=w.reach*e.mouseStrength,l=i.uniforms;n.bindFramebuffer(n.FRAMEBUFFER,h),n.viewport(0,0,g.width,g.height),n.useProgram(i.program),n.uniform2f(l.uView,S.width,S.height),n.uniform2f(l.uScale,S.width/g.width,S.height/g.height),n.uniform2f(l.uTurn,Math.cos(o),Math.sin(o)),n.uniform1f(l.uTime,w.clock*.12%289),n.uniform1f(l.uWidth,e.beamWidth),n.uniform1f(l.uWave,e.waveLength),n.uniform1f(l.uDepth,e.depth),n.uniform1f(l.uRough,.55-e.sharpness*.5),n.uniform1f(l.uSeed,e.variation),n.uniform1f(l.uTwist,e.twist),n.uniform1f(l.uFill,e.fillLight),n.uniform3f(l.uLight,0,3+s+w.lightY*c,10),n.uniform1f(l.uCamera,S.height*1.866),n.uniform4f(l.uPointer,w.x,S.height-w.y,c,Math.max(S.height,S.width)*.28),n.drawArrays(n.TRIANGLES,0,3),n.bindTexture(n.TEXTURE_2D,m),n.generateMipmap(n.TEXTURE_2D);let u=a.uniforms,d=x(e.color),f=.2126*d[0]+.7152*d[1]+.0722*d[2],v=Math.min(1,.18/Math.max(f,.001)),y=d.map(e=>Math.min(1,e*v)**(1/2.2));n.bindFramebuffer(n.FRAMEBUFFER,null),n.viewport(0,0,t.width,t.height),n.useProgram(a.program),n.uniform2f(u.uResolution,t.width,t.height),n.uniform3fv(u.uColor,d),n.uniform3fv(u.uInk,y),n.uniform1f(u.uGain,e.brightness),n.uniform1f(u.uGlow,e.glow),n.uniform1f(u.uPresence,r),n.uniform1f(u.uGrain,e.grain*1.75),n.uniform1f(u.uFade,e.fade),n.uniform1f(u.uOpacity,e.opacity),n.uniform1f(u.uLightMode,+!!e.lightMode),n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,m),n.uniform1i(u.uField,0),n.drawArrays(n.TRIANGLES,0,3)},k=e=>{if(T=0,!D||document.hidden)return;let t=R.current,n=E?Math.min(.05,(e-E)/1e3):1/60;E=e;let r=!t.paused&&!y;r&&(w.clock+=n*t.speed),!t.intro||y?w.intro=1:w.intro<1&&(w.intro=Math.min(1,w.intro+n/c));let i=t.mouseInteraction&&C.inside&&!y;i&&w.reach<.01&&(w.x=C.x,w.y=C.y);let a=1-Math.exp(-n*7);w.x+=(C.x-w.x)*a,w.y+=(C.y-w.y)*a,w.reach+=(+!!i-w.reach)*(1-Math.exp(-n*(i?3.2:1.8)));let o=t.rotation*Math.PI/180,s=w.x-S.width/2,l=S.height/2-w.y,d=-Math.sin(o)*s+Math.cos(o)*l;w.lightY=u(d/(S.height*.5)*3,-4,4),O();let f=w.intro<1||Math.abs(+!!i-w.reach)>.002||Math.abs(C.x-w.x)+Math.abs(C.y-w.y)>.3;r||f?T=requestAnimationFrame(k):E=0},A=()=>{!T&&D&&!document.hidden&&(T=requestAnimationFrame(k))},j=()=>{let n=R.current,r=Math.max(1,e.clientWidth),i=Math.max(1,e.clientHeight),a=Math.min(n.dpr||window.devicePixelRatio||1,2);S.width=r,S.height=i,t.width=Math.max(1,Math.round(r*a)),t.height=Math.max(1,Math.round(i*a));let o=n.quality*a;r*i*o*o>l&&(o=Math.sqrt(l/(r*i))),S.fieldWidth=Math.max(1,Math.round(r*o)),S.fieldHeight=Math.max(1,Math.round(i*o)),T||O(),A()},M=t=>{let n=e.getBoundingClientRect();C.x=t.clientX-n.left,C.y=t.clientY-n.top,C.inside=C.x>=0&&C.y>=0&&C.x<=n.width&&C.y<=n.height,A()},N=()=>{C.inside=!1,A()},L=()=>{E=0,A()},z=new ResizeObserver(j);z.observe(e);let B=new IntersectionObserver(e=>{D=e.some(e=>e.isIntersecting),D&&(E=0,A())});B.observe(e),window.addEventListener(`pointermove`,M,{passive:!0}),document.documentElement.addEventListener(`pointerleave`,N),document.addEventListener(`visibilitychange`,L),j();let V=R.current.quality,H=R.current.dpr;return I.current=()=>{let e=R.current;e.quality!==V||e.dpr!==H?(V=e.quality,H=e.dpr,j()):(T||O(),A())},()=>{cancelAnimationFrame(T),I.current=null,z.disconnect(),B.disconnect(),window.removeEventListener(`pointermove`,M),document.documentElement.removeEventListener(`pointerleave`,N),document.removeEventListener(`visibilitychange`,L),m&&n.deleteTexture(m),n.deleteFramebuffer(h),n.deleteProgram(i.program),n.deleteProgram(a.program),n.deleteBuffer(d),n.deleteVertexArray(p),n.getExtension(`WEBGL_lose_context`)?.loseContext()}},[]),(0,r.useEffect)(()=>{I.current?.()}),(0,i.jsx)(`div`,{ref:P,className:[`relative h-full w-full overflow-hidden`,j].filter(Boolean).join(` `),style:O?{background:O,...M}:M,...N,children:(0,i.jsx)(`canvas`,{ref:F,className:`absolute inset-0 block h-full w-full`,"aria-hidden":`true`})})};export{p as Beams,p as default};