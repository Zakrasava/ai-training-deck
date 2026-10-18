import{i as e,t}from"./react-sySUN5R7.js";import{k as n}from"./sculpture-dark-CKiqtzhU.js";var r=e(t(),1),i=n(),a=4,o=2.4,s=2.2,c=1.25,l=`https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js`,u=`https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@0.22.2/weights`,d={solid:0,dashed:1,dotted:2},f=`#version 300 es
out vec2 vUv;
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  vUv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`,ee=`#version 300 es
precision highp float;
precision highp int;
uniform float uAspect;
uniform float uPixel;
uniform vec3 uEye;
uniform float uDepth;
uniform vec3 uCell;
uniform float uThick;
uniform float uDot;
uniform int uStyle;
uniform vec3 uLineColor;
uniform vec3 uScanColor;
uniform vec3 uCoreColor;
uniform float uFade;
uniform float uScanZ;
uniform float uScanDir;
uniform float uScanAlpha;
uniform float uScanWidth;
uniform float uTrail;
uniform float uReveal;
uniform float uPoints;
uniform float uReflect;
uniform float uHaze;
uniform float uShade;
uniform float uLight;
uniform vec4 uPing[4];
uniform float uPingAlpha[4];
uniform vec4 uHover;
uniform float uTime;
in vec2 vUv;
layout(location = 0) out vec4 outColor;
layout(location = 1) out vec4 outGlow;

struct Light {
  float grid;
  float fade;
  float core;
  float trail;
  float spill;
  float ping;
  float wake;
  float reveal;
};

float hash(vec2 p) {
  vec3 q = fract(vec3(p.xyx) * 0.1031);
  q += dot(q, q.yzx + 33.33);
  return fract((q.x + q.y) * q.z);
}

vec2 hash2(vec2 p) {
  vec3 q = fract(vec3(p.xyx) * vec3(0.1031, 0.103, 0.0973));
  q += dot(q, q.yzx + 33.33);
  return fract((q.xx + q.yz) * q.zy);
}

float lines(float across, float along, float period, float dash, float fa, float fb) {
  float u = across / period;
  float du = fa / period;
  float d = abs(fract(u + 0.5) - 0.5) / max(du, 1e-5);
  float dense = smoothstep(0.1, 0.4, du);
  if (uStyle == 2) {
    float c = along / dash * 5.0;
    float dc = fb / dash * 5.0;
    float e = abs(fract(c + 0.5) - 0.5) / max(dc, 1e-5);
    float cov = clamp(uThick + 1.0 - length(vec2(d, e)), 0.0, 1.0);
    float mean = min(1.0, 3.1416 * (uThick + 0.5) * (uThick + 0.5) * du * dc);
    return mix(cov, mean, max(dense, smoothstep(0.1, 0.4, dc)));
  }
  float cov = clamp(uThick + 0.5 - d, 0.0, 1.0);
  float mean = min(1.0, 2.0 * uThick * du);
  if (uStyle == 1) {
    float c = along / dash * 4.0;
    float dc = fb / dash * 4.0;
    float e = abs(fract(c + 0.5) - 0.5);
    float m = clamp((0.25 - e) / max(dc, 1e-5) + 0.5, 0.0, 1.0);
    cov *= mix(m, 0.5, smoothstep(0.1, 0.4, dc));
    mean *= 0.5;
  }
  return mix(cov, mean, dense);
}

float depthFade(float z) {
  float n = clamp(z / uDepth, 0.0, 1.0);
  return mix(1.0, (exp(-3.0 * n) - 0.0497871) / 0.9502129, uFade);
}

vec3 project(vec3 eye, vec3 o, int face, float plane) {
  vec3 d = o - eye;
  float t = face == 0 ? (plane - o.x) / d.x : (face == 1 ? (plane - o.y) / d.y : (plane - o.z) / d.z);
  return o + d * t;
}

void trace(vec3 o, vec3 d, out int face, out float plane, out vec3 h) {
  float sx = d.x > 0.0 ? 0.5 * uAspect : -0.5 * uAspect;
  float sy = d.y > 0.0 ? 0.5 : -0.5;
  float tx = abs(d.x) > 1e-6 ? (sx - o.x) / d.x : 1e9;
  float ty = abs(d.y) > 1e-6 ? (sy - o.y) / d.y : 1e9;
  float t = (uDepth - o.z) / d.z;
  face = 2;
  plane = uDepth;
  if (tx < t) {
    face = 0;
    plane = sx;
    t = tx;
  }
  if (ty < t) {
    face = 1;
    plane = sy;
    t = ty;
  }
  h = o + d * t;
}

vec2 faceUv(vec3 h, int face) {
  if (face == 0) return vec2(h.z, h.y + 0.5);
  if (face == 1) return vec2(h.x + 0.5 * uAspect, h.z);
  return vec2(h.x + 0.5 * uAspect, h.y + 0.5);
}

Light illuminate(vec3 h, int face, vec2 uv, vec2 foot, float blur) {
  Light l;
  vec2 cell = face == 0 ? uCell.zy : (face == 1 ? uCell.xz : uCell.xy);
  vec2 f = foot * blur;
  float minor = max(lines(uv.x, uv.y, cell.x, cell.y, f.x, f.y), lines(uv.y, uv.x, cell.y, cell.x, f.y, f.x));
  float major = max(
    lines(uv.x, uv.y, cell.x * 4.0, cell.y, f.x, f.y),
    lines(uv.y, uv.x, cell.y * 4.0, cell.x, f.y, f.x)
  );
  l.grid = max(minor * 0.75, major) / blur;
  float z = h.z;
  l.fade = depthFade(z);
  l.reveal = smoothstep(uReveal, uReveal - 0.2, z);
  float zFoot = face == 0 ? f.x : (face == 1 ? f.y : 0.0);
  float width = max(uScanWidth, zFoot * 1.1);
  float dz = z - uScanZ;
  l.core = exp(-dz * dz / (width * width)) * (face == 2 ? 0.45 : 1.0) * uScanAlpha;
  float behind = -dz * uScanDir;
  l.trail = exp(-max(behind, 0.0) / uTrail) * smoothstep(-width, width * 0.5, behind) * uScanAlpha;
  l.spill = exp(-dz * dz / 0.05) * uScanAlpha;
  l.ping = 0.0;
  l.wake = 0.0;
  for (int i = 0; i < 4; i++) {
    float alpha = uPingAlpha[i];
    if (alpha <= 0.0) continue;
    float dist = length(h - uPing[i].xyz) - uPing[i].w;
    l.ping += exp(-dist * dist / 0.0012) * alpha;
    l.wake += exp(min(dist, 0.0) / 0.22) * smoothstep(0.03, -0.03, dist) * alpha;
  }
  return l;
}

void over(inout vec4 acc, vec3 color, float alpha) {
  alpha = clamp(alpha, 0.0, 1.0);
  acc = vec4(color * alpha, alpha) + acc * (1.0 - alpha);
}

void paint(inout vec4 color, inout float energy, Light l, float gain, float lift, float hover) {
  float base = l.grid * l.fade * l.reveal * lift;
  float far = l.fade * l.reveal * gain;
  float lit = l.grid * (l.core * 1.2 + l.trail * 0.75 + l.ping * 1.4 + l.wake * 0.5 + hover * 0.5) * far;
  float sheen = (l.core * 0.14 + l.spill * 0.05 + l.trail * 0.03 + l.ping * 0.2 + l.wake * 0.04) * far;
  float laser = (l.core + l.ping * 0.35) * far;
  over(color, uLineColor, base);
  over(color, uScanColor, sheen);
  over(color, uScanColor, lit);
  over(color, uCoreColor, laser * 0.9);
  energy += laser * 0.9 + lit * 0.5;
}

void main() {
  vec3 p = vec3((vUv.x - 0.5) * uAspect, vUv.y - 0.5, 0.0);
  vec3 d = p - uEye;
  int face;
  float plane;
  vec3 h;
  trace(p, d, face, plane, h);
  vec3 hx = project(uEye, p + vec3(uPixel, 0.0, 0.0), face, plane);
  vec3 hy = project(uEye, p + vec3(0.0, uPixel, 0.0), face, plane);
  vec2 uv = faceUv(h, face);
  vec2 ux = faceUv(hx, face) - uv;
  vec2 uy = faceUv(hy, face) - uv;
  vec2 foot = vec2(length(vec2(ux.x, uy.x)), length(vec2(ux.y, uy.y)));
  Light l = illuminate(h, face, uv, foot, 1.0);

  vec4 color = vec4(0.0);
  float energy = 0.0;

  if (uShade > 0.0) {
    vec2 gaps = face == 0
      ? vec2(0.5 - abs(h.y), uDepth - h.z)
      : (face == 1 ? vec2(0.5 * uAspect - abs(h.x), uDepth - h.z) : vec2(0.5 * uAspect - abs(h.x), 0.5 - abs(h.y)));
    vec2 crease = 1.0 - exp(-max(gaps, 0.0) / 0.16);
    float occlusion = crease.x * crease.y;
    float lamp = 1.0 / (1.0 + h.z * h.z * 0.9);
    float tilt = face == 1 ? (plane < 0.0 ? 1.1 : 0.85) : (face == 2 ? 0.8 : 1.0);
    float glowSpill = (l.spill * 0.5 + l.trail * 0.12) * l.reveal * l.fade;
    if (uLight > 0.5) {
      float shadow = (1.0 - lamp * tilt) * 0.09 + (1.0 - occlusion) * 0.2;
      over(color, vec3(0.0), shadow * uShade * l.reveal * l.fade);
    } else {
      over(color, vec3(1.0), lamp * tilt * occlusion * 0.11 * uShade * l.reveal * l.fade);
    }
    over(color, uScanColor, glowSpill * uShade * occlusion * 0.35);
  }

  if (face == 1 && plane < 0.0 && uReflect > 0.0) {
    vec3 mirror = vec3(uEye.x, -1.0 - uEye.y, uEye.z);
    vec3 r = h - mirror;
    int face2;
    float plane2;
    vec3 h2;
    trace(h, r, face2, plane2, h2);
    vec2 uv2 = faceUv(h2, face2);
    vec2 ux2 = faceUv(project(mirror, hx, face2, plane2), face2) - uv2;
    vec2 uy2 = faceUv(project(mirror, hy, face2, plane2), face2) - uv2;
    vec2 foot2 = vec2(length(vec2(ux2.x, uy2.x)), length(vec2(ux2.y, uy2.y)));
    float travel = length(h2 - h);
    Light m = illuminate(h2, face2, uv2, foot2, 1.0 + travel * 4.0);
    m.reveal *= l.reveal;
    float grazing = 1.0 - normalize(r).y;
    float gain = (0.3 + 0.7 * grazing * grazing * grazing * grazing) * uReflect * exp(-travel * 1.1) * (uLight > 0.5 ? 0.6 : 1.0);
    float reflected = 0.0;
    paint(color, reflected, m, gain, 0.0, 0.0);
    energy += reflected * 0.6;
  }

  vec3 near = h - uHover.xyz;
  float hover = exp(-dot(near, near) / 0.08) * uHover.w;
  paint(color, energy, l, 1.0, 1.0, hover);

  if (uPoints > 0.5) {
    vec2 cell = face == 0 ? uCell.zy : (face == 1 ? uCell.xz : uCell.xy);
    vec2 spacing = cell / 2.5;
    vec2 q = uv / spacing;
    vec2 id = floor(q);
    vec2 seed = id + vec2(float(face) * 13.7 + plane * 5.3, float(face) * 3.1);
    vec2 delta = (q - id - (0.2 + 0.6 * hash2(seed))) * spacing;
    float det = ux.x * uy.y - ux.y * uy.x;
    vec2 s = vec2(delta.x * uy.y - delta.y * uy.x, ux.x * delta.y - ux.y * delta.x) / det;
    float radius = uDot * mix(1.0, 0.55, clamp(h.z / uDepth, 0.0, 1.0));
    float spot = clamp(radius + 0.5 - length(s), 0.0, 1.0);
    float gap = min(spacing.x / foot.x, spacing.y / foot.y);
    float r = hash(seed + 7.7);
    float flicker = 0.75 + 0.25 * sin(uTime * (3.0 + r * 5.0) + r * 40.0);
    float dots = spot * smoothstep(5.0, 10.0, gap) * smoothstep(0.25, 0.6, r) * (0.3 + 0.7 * r * r) * flicker;
    float hot = l.core * 2.5 + l.ping * 1.6;
    float warm = l.trail * l.trail * 1.3 + l.wake * 0.6 + hover * 1.3;
    float spark = dots * (hot + warm) * l.fade * l.reveal;
    over(color, mix(uScanColor, uCoreColor, clamp(hot / max(hot + warm, 1e-4), 0.0, 1.0)), spark);
    energy += spark * 0.9;
  }

  if (uHaze > 0.0 && uScanAlpha > 0.0 && uScanZ > 0.0 && h.z > uScanZ) {
    vec3 c = p + d * (uScanZ / d.z);
    float grain = hash(floor(c.xy * 180.0) + floor(uTime * 24.0) * 7.0);
    float edge = min(0.5 * uAspect - abs(c.x), 0.5 - abs(c.y));
    float rim = exp(-edge / 0.06);
    float veil = uHaze * uScanAlpha * (0.45 + 0.9 * grain) * (0.55 + rim * 1.6);
    over(color, uScanColor, veil * depthFade(uScanZ) * l.reveal);
  }

  energy = clamp(energy, 0.0, 1.0);
  outColor = color;
  outGlow = vec4(uScanColor * energy, energy);
}`,p=`#version 300 es
precision highp float;
uniform sampler2D uSource;
uniform vec2 uTexel;
in vec2 vUv;
out vec4 outColor;
void main() {
  vec2 o = uTexel;
  outColor = 0.25 * (
    texture(uSource, vUv + vec2(-o.x, -o.y)) +
    texture(uSource, vUv + vec2(o.x, -o.y)) +
    texture(uSource, vUv + vec2(-o.x, o.y)) +
    texture(uSource, vUv + vec2(o.x, o.y))
  );
}`,te=`#version 300 es
precision highp float;
uniform sampler2D uSource;
uniform vec2 uStep;
in vec2 vUv;
out vec4 outColor;
void main() {
  vec4 sum = texture(uSource, vUv) * 0.1964825501511404;
  sum += (texture(uSource, vUv + uStep * 1.411764705882353) + texture(uSource, vUv - uStep * 1.411764705882353)) * 0.2969069646728344;
  sum += (texture(uSource, vUv + uStep * 3.2941176470588234) + texture(uSource, vUv - uStep * 3.2941176470588234)) * 0.09447039785044732;
  sum += (texture(uSource, vUv + uStep * 5.176470588235294) + texture(uSource, vUv - uStep * 5.176470588235294)) * 0.010381362401148057;
  outColor = sum;
}`,m=`#version 300 es
precision highp float;
uniform sampler2D uScene;
uniform sampler2D uBloom;
uniform float uGlow;
in vec2 vUv;
out vec4 outColor;
float hash(vec2 p) {
  vec3 q = fract(vec3(p.xyx) * 0.1031);
  q += dot(q, q.yzx + 33.33);
  return fract((q.x + q.y) * q.z);
}
void main() {
  vec4 scene = texture(uScene, vUv);
  vec4 bloom = texture(uBloom, vUv) * uGlow;
  bloom.a = min(bloom.a, 1.0);
  bloom.rgb = min(bloom.rgb, vec3(bloom.a));
  vec4 color = scene + bloom * (1.0 - scene.a);
  float noise = (hash(gl_FragCoord.xy) - 0.5) / 255.0;
  color.a = clamp(color.a + noise, 0.0, 1.0);
  color.rgb = clamp(color.rgb + noise, vec3(0.0), vec3(color.a));
  outColor = color;
}`,h=(e,t,n)=>Math.min(n,Math.max(t,e)),g=(e,t,n)=>{let r=e.createShader(t);return r?(e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(e.deleteShader(r),null)):null},_=(e,t)=>{let n=g(e,e.VERTEX_SHADER,f),r=g(e,e.FRAGMENT_SHADER,t),i=e.createProgram();if(!n||!r||!i)return null;if(e.attachShader(i,n),e.attachShader(i,r),e.linkProgram(i),e.deleteShader(n),e.deleteShader(r),!e.getProgramParameter(i,e.LINK_STATUS))return e.deleteProgram(i),null;let a={},o=e.getProgramParameter(i,e.ACTIVE_UNIFORMS);for(let t=0;t<o;t++){let n=e.getActiveUniform(i,t);if(!n)continue;let r=n.name.replace(/\[0\]$/,``);a[r]=e.getUniformLocation(i,r)}return{program:i,uniforms:a}},v=e=>{let t=e.createTexture();return e.bindTexture(e.TEXTURE_2D,t),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),{texture:t,width:0,height:0}},y=(e,t,n,r)=>{(t.width!==n||t.height!==r)&&(t.width=n,t.height=r,e.bindTexture(e.TEXTURE_2D,t.texture),e.texImage2D(e.TEXTURE_2D,0,e.RGBA8,n,r,0,e.RGBA,e.UNSIGNED_BYTE,null))},b=null,x=()=>{let e=window;return e.faceapi?Promise.resolve(e.faceapi):(b||(b=new Promise((t,n)=>{let r=document.createElement(`script`);r.src=l,r.async=!0,r.onload=()=>e.faceapi?t(e.faceapi):n(Error(`face-api.js`)),r.onerror=()=>{b=null,n(Error(`face-api.js`))},document.head.appendChild(r)})),b)},S={loading:`Loading face tracking`,searching:`Looking for a face`,tracking:`Tracking`,blocked:`Camera unavailable`},C=({linesColor:e,scanColor:t,cells:n=8,lineThickness:l=1,lineStyle:f=`solid`,depth:g=3,depthFade:b=.6,parallax:C=1,points:w=!0,reflection:T=.35,shading:E=.7,scanDirection:ne=`forward`,scanDuration:D=2.4,scanDelay:O=1.6,scanWidth:k=1,trail:A=.5,glow:j=.6,autoScan:M=!0,interactive:N=!0,clickEffect:P=`ping`,enableWebcam:F=!1,showPreview:I=!1,modelsPath:L=u,enableGyro:R=!1,intro:z=!0,lightMode:B=!1,dpr:V,className:H=``,style:U,...W})=>{let re=(0,r.useRef)(null),ie=(0,r.useRef)(null),G=(0,r.useRef)(null),K=(0,r.useRef)(null),q=(0,r.useRef)(null),[J,Y]=(0,r.useState)(`loading`),X={linesColor:e??(B?`#d4d4d8`:`#4d4757`),scanColor:t??(B?`#0284c7`:`#7dd3fc`),cells:h(n,2,40),thickness:h(l,.5,4),style:d[f]??0,depth:h(g,.5,12),depthFade:h(b,0,1),parallax:h(C,0,3),points:w,reflection:h(T,0,1),shading:h(E,0,1),direction:ne,duration:h(D,.3,20),delay:h(O,0,30),scanWidth:h(k,.2,5),trail:h(A,0,1),glow:h(j,0,1.5),autoScan:M,interactive:N,clickEffect:P,enableGyro:R,intro:z,lightMode:B,dpr:V},Z=(0,r.useRef)(X);return Z.current=X,(0,r.useEffect)(()=>{let e=re.current,t=ie.current,n=t?.getContext(`webgl2`,{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1});if(!e||!t||!n)return;let r=_(n,ee),i=_(n,p),l=_(n,te),u=_(n,m);if(!r||!i||!l||!u)return;let d=n.createVertexArray(),f=v(n),g=v(n),b=v(n),x=v(n),S=n.createFramebuffer(),C=n.createFramebuffer(),w=n.createFramebuffer(),T=document.createElement(`canvas`).getContext(`2d`,{willReadFrequently:!0}),E=new Map,ne=e=>{let t=String(e),n=E.get(t);if(n)return n;let r=[1,1,1];if(T){T.clearRect(0,0,1,1),T.fillStyle=`#000000`,T.fillStyle=t,T.fillRect(0,0,1,1);let[e,n,i]=T.getImageData(0,0,1,1).data;r=[e/255,n/255,i/255]}return E.set(t,r),r},D=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches??!1,O={width:1,height:1,ratio:1},k={x:0,y:0,vx:0,vy:0,tx:0,ty:0,f:c,vf:0,tf:c},A={x:0,y:0,inside:!1},j={x:0,y:0,held:!1},M={gamma:0,beta:0,ready:!1,asked:!1},N={x:0,y:0,z:0,strength:0,ready:!1},P={z:0,dir:1,alpha:0,start:0,sweeps:0,waiting:!1},F=[],I=new Float32Array(16),L=new Float32Array(a),R=0,z=Z.current.intro&&!D?0:1,B=0,V=0,H=!0,U=0,W=()=>{let e=Z.current,t=O.width/O.height,n=1/Math.round(e.cells);return{aspect:t,cx:t/Math.max(1,Math.round(t/n)),cy:n,roomDepth:Math.max(n,Math.round(e.depth/n)*n)}},G=(e,t)=>{let{aspect:n,roomDepth:r}=W(),i=(e-.5)*n,a=t-.5,o=i-k.x,s=a-k.y,c=k.f,l=o>0?.5*n:-.5*n,u=s>0?.5:-.5,d=r/c;return Math.abs(o)>1e-6&&(d=Math.min(d,(l-i)/o)),Math.abs(s)>1e-6&&(d=Math.min(d,(u-a)/s)),{x:i+o*d,y:a+s*d,z:c*d}},J=e=>{P.dir=e.direction===`backward`||e.direction===`pingpong`&&P.sweeps%2==1?-1:1,P.start=R,P.waiting=!1,P.sweeps+=1},Y=(e,t)=>{if(z<1){let e=z;P.dir=1,P.z=e*(t+.4)-.2,P.alpha=Math.min(1,e*6)*(1-Math.max(0,e-.85)/.15);return}if(P.sweeps===0&&!P.waiting&&(P.waiting=!0,P.start=R,P.alpha=0),P.waiting){P.alpha=0,e.autoScan&&!D&&R-P.start>=e.delay&&J(e);return}let n=(R-P.start)/e.duration;if(n>=1){P.waiting=!0,P.start=R,P.alpha=0;return}let r=n*(t+.3)-.15;P.z=P.dir>0?r:t-r,P.alpha=Math.min(1,n/.12)*Math.min(1,(1-n)/.12)},X=e=>{let t=Math.max(1,Math.ceil(e/(1/120))),n=e/t;for(let e=0;e<t;e++)k.vx+=((k.tx-k.x)*42-k.vx*11)*n,k.vy+=((k.ty-k.y)*42-k.vy*11)*n,k.vf+=((k.tf-k.f)*42-k.vf*11)*n,k.x+=k.vx*n,k.y+=k.vy*n,k.f+=k.vf*n},Q=(e,t,n)=>{j.x=h(e,-1,1),j.y=h(t,-1,1),j.held=n},ae=e=>{let t=O.width/O.height,n=+!D,r=j.held?j.x:(Math.sin(R*.21)*.2+Math.sin(R*.083+1.3)*.12)*n,i=j.held?j.y:Math.sin(R*.17+2.1)*.16*n;k.tx=r*e.parallax*.22*t,k.ty=i*e.parallax*.22},oe=()=>{let r=Z.current;O.width=Math.max(1,e.clientWidth),O.height=Math.max(1,e.clientHeight),O.ratio=Math.min(r.dpr||window.devicePixelRatio||1,2),t.width=Math.max(1,Math.round(O.width*O.ratio)),t.height=Math.max(1,Math.round(O.height*O.ratio)),y(n,f,t.width,t.height),y(n,g,t.width,t.height),n.bindFramebuffer(n.FRAMEBUFFER,S),n.framebufferTexture2D(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,f.texture,0),n.framebufferTexture2D(n.FRAMEBUFFER,n.COLOR_ATTACHMENT1,n.TEXTURE_2D,g.texture,0);let i=Math.max(1,Math.round(t.width/4)),a=Math.max(1,Math.round(t.height/4));y(n,b,i,a),y(n,x,i,a),n.bindFramebuffer(n.FRAMEBUFFER,C),n.framebufferTexture2D(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,b.texture,0),n.bindFramebuffer(n.FRAMEBUFFER,w),n.framebufferTexture2D(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,x.texture,0),n.bindFramebuffer(n.FRAMEBUFFER,null),se(),$()},se=()=>{let e=Z.current,{aspect:a,cx:o,cy:s,roomDepth:c}=W(),ee=ne(e.linesColor),p=ne(e.scanColor),te=e.lightMode?p:p.map(e=>e+(1-e)*.65),m=r.uniforms;n.bindVertexArray(d),n.disable(n.BLEND),n.bindFramebuffer(n.FRAMEBUFFER,S),n.drawBuffers([n.COLOR_ATTACHMENT0,n.COLOR_ATTACHMENT1]),n.viewport(0,0,t.width,t.height),n.useProgram(r.program),n.uniform1f(m.uAspect,a),n.uniform1f(m.uPixel,1/t.height),n.uniform3f(m.uEye,k.x,k.y,-k.f),n.uniform1f(m.uDepth,c),n.uniform3f(m.uCell,o,s,s),n.uniform1f(m.uThick,e.thickness*O.ratio*.5),n.uniform1f(m.uDot,1.8*O.ratio),n.uniform1i(m.uStyle,e.style),n.uniform3fv(m.uLineColor,ee),n.uniform3fv(m.uScanColor,p),n.uniform3fv(m.uCoreColor,te),n.uniform1f(m.uFade,e.depthFade),n.uniform1f(m.uScanZ,P.z),n.uniform1f(m.uScanDir,P.dir),n.uniform1f(m.uScanAlpha,P.alpha),n.uniform1f(m.uScanWidth,.006*e.scanWidth),n.uniform1f(m.uTrail,.04+e.trail*1.1),n.uniform1f(m.uReveal,z<1?P.z+.05:1e4),n.uniform1f(m.uPoints,+!!e.points),n.uniform1f(m.uReflect,e.reflection),n.uniform1f(m.uHaze,e.lightMode?.03:.05),n.uniform1f(m.uShade,e.shading),n.uniform1f(m.uLight,+!!e.lightMode),n.uniform4fv(m.uPing,I),n.uniform1fv(m.uPingAlpha,L),n.uniform4f(m.uHover,N.x,N.y,N.z,N.strength),n.uniform1f(m.uTime,R),n.drawArrays(n.TRIANGLES,0,3);let h=e.glow>0;if(h){n.bindFramebuffer(n.FRAMEBUFFER,C),n.viewport(0,0,b.width,b.height),n.useProgram(i.program),n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,g.texture),n.uniform1i(i.uniforms.uSource,0),n.uniform2f(i.uniforms.uTexel,1/g.width,1/g.height),n.drawArrays(n.TRIANGLES,0,3);let e=2.2*O.ratio/2;n.useProgram(l.program),n.uniform1i(l.uniforms.uSource,0),n.bindFramebuffer(n.FRAMEBUFFER,w),n.bindTexture(n.TEXTURE_2D,b.texture),n.uniform2f(l.uniforms.uStep,e/b.width,0),n.drawArrays(n.TRIANGLES,0,3),n.bindFramebuffer(n.FRAMEBUFFER,C),n.bindTexture(n.TEXTURE_2D,x.texture),n.uniform2f(l.uniforms.uStep,0,e/b.height),n.drawArrays(n.TRIANGLES,0,3)}n.bindFramebuffer(n.FRAMEBUFFER,null),n.viewport(0,0,t.width,t.height),n.useProgram(u.program),n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,f.texture),n.uniform1i(u.uniforms.uScene,0),n.activeTexture(n.TEXTURE1),n.bindTexture(n.TEXTURE_2D,b.texture),n.uniform1i(u.uniforms.uBloom,1),n.uniform1f(u.uniforms.uGlow,h?e.glow*(e.lightMode?.8:1.6):0),n.drawArrays(n.TRIANGLES,0,3),n.activeTexture(n.TEXTURE0)},ce=e=>{if(B=0,!H||document.hidden)return;let t=Z.current,n=V?h((e-V)/1e3,.001,.05):1/60;V=e,R+=n,z<1&&(z=Math.min(1,z+n/s));let{roomDepth:r}=W();Y(t,r),ae(t),X(n);let i=t.interactive&&A.inside&&!D?1:0;if(i){let e=G(A.x,A.y);N.ready||Object.assign(N,e,{ready:!0});let t=1-Math.exp(-n/.08);N.x+=(e.x-N.x)*t,N.y+=(e.y-N.y)*t,N.z+=(e.z-N.z)*t}N.strength+=(i-N.strength)*(1-Math.exp(-n/.25)),!i&&N.strength<.01&&(N.ready=!1);for(let e=F.length-1;e>=0;e--)F[e].age+=n,F[e].age>o&&F.splice(e,1);for(let e=0;e<a;e++){let t=F[e];if(!t){L[e]=0;continue}let n=t.age/o;I.set([t.x,t.y,t.z,t.age*1.15],e*4),L[e]=Math.min(1,t.age/.05)*(1-n)*(1-n)}se();let c=Math.abs(k.tx-k.x)+Math.abs(k.ty-k.y)+Math.abs(k.tf-k.f)>1e-4||Math.abs(k.vx)+Math.abs(k.vy)+Math.abs(k.vf)>1e-4;z<1||!D&&t.autoScan||!P.waiting||F.length>0||c||N.strength>.002||!D&&t.parallax>0&&!j.held||t.points&&!D&&P.alpha>0?B=requestAnimationFrame(ce):V=0};function $(){!B&&H&&!document.hidden&&(B=requestAnimationFrame(ce))}let le=t=>{let n=e.getBoundingClientRect(),r=(t.clientX-n.left)/Math.max(1,n.width),i=1-(t.clientY-n.top)/Math.max(1,n.height);return{u:r,v:i,inside:r>=0&&r<=1&&i>=0&&i<=1}},ue=e=>{let t=Z.current,{u:n,v:r,inside:i}=le(e);A.x=n,A.y=r;let a=A.inside;A.inside=i,i?(window.clearTimeout(U),U=0,!q.current?.active&&t.interactive&&!D&&Q(n*2-1,r*2-1,!0),$()):a&&!U&&(U=window.setTimeout(()=>{U=0,q.current?.active||(j.held=!1),$()},220),$())},de=e=>{let t=Z.current,{u:n,v:r,inside:i}=le(e);if(i&&!D&&t.clickEffect!==`none`){if(t.clickEffect===`scan`)z>=1&&J(t);else{let e=G(n,r);F.unshift({...e,age:0}),F.length>a&&F.pop()}$()}},fe=()=>{A.inside=!1,q.current?.active||(j.held=!1),$()},pe=e=>{!Z.current.enableGyro||q.current?.active||D||e.gamma===null||e.beta===null||(M.ready||Object.assign(M,{gamma:e.gamma,beta:e.beta,ready:!0}),Q((e.gamma-M.gamma)/25,(e.beta-M.beta)/-25,!0),$())},me=()=>{let e=Z.current,t=window.DeviceOrientationEvent?.requestPermission;e.enableGyro&&!M.asked&&typeof t==`function`&&(M.asked=!0,t.call(window.DeviceOrientationEvent).catch(()=>{}))},he=()=>{V=0,$()},ge=new ResizeObserver(oe);ge.observe(e);let _e=new IntersectionObserver(e=>{H=e.some(e=>e.isIntersecting),H&&(V=0,$())});return _e.observe(e),window.addEventListener(`pointermove`,ue,{passive:!0}),window.addEventListener(`pointerdown`,de,{passive:!0}),window.addEventListener(`deviceorientation`,pe),window.addEventListener(`click`,me),document.documentElement.addEventListener(`pointerleave`,fe),document.addEventListener(`visibilitychange`,he),q.current={active:!1,move:(e,t,n)=>{D||(Q(e*1.3,t*1.3,!0),k.tf=c*h(n,.6,1.6),$())},release:()=>{k.tf=c,j.held=!1,$()}},oe(),K.current=$,()=>{cancelAnimationFrame(B),window.clearTimeout(U),K.current=null,q.current=null,ge.disconnect(),_e.disconnect(),window.removeEventListener(`pointermove`,ue),window.removeEventListener(`pointerdown`,de),window.removeEventListener(`deviceorientation`,pe),window.removeEventListener(`click`,me),document.documentElement.removeEventListener(`pointerleave`,fe),document.removeEventListener(`visibilitychange`,he),[f,g,b,x].forEach(e=>n.deleteTexture(e.texture)),[S,C,w].forEach(e=>n.deleteFramebuffer(e)),n.deleteVertexArray(d),[r,i,l,u].forEach(e=>n.deleteProgram(e.program)),n.getExtension(`WEBGL_lose_context`)?.loseContext()}},[]),(0,r.useEffect)(()=>{K.current?.()}),(0,r.useEffect)(()=>{if(!F)return;let e=G.current;if(!e)return;let t=!1,n=null,r=0,i=0,a={x:0,y:0,near:1,ready:!1};return Y(`loading`),(async()=>{try{let o=await x();if(await o.nets.tinyFaceDetector.loadFromUri(L),t)return;if(n=await navigator.mediaDevices.getUserMedia({video:{facingMode:`user`,width:{ideal:640},height:{ideal:480}},audio:!1}),t){n.getTracks().forEach(e=>e.stop());return}e.srcObject=n,await e.play(),Y(`searching`);let s=new o.TinyFaceDetectorOptions({inputSize:224,scoreThreshold:.45}),c=async()=>{if(t)return;let n=null;try{n=await o.detectSingleFace(e,s)}catch{n=null}if(t)return;let l=q.current;if(n&&l){let t=n.box,r=e.videoWidth||1,o=e.videoHeight||1,s=-((t.x+t.width/2)/r-.5)*2,c=-((t.y+t.height/2)/o-.5)*2,u=.32/Math.max(.08,t.width/r),d=a.ready?.45:1;a.x+=(s-a.x)*d,a.y+=(c-a.y)*d,a.near+=(u-a.near)*d,a.ready=!0,i=0,l.active=!0,l.move(a.x,a.y,a.near),Y(`tracking`)}else l&&++i>12&&l.active&&(l.active=!1,a.ready=!1,l.release(),Y(`searching`));r=window.setTimeout(c,40)};c()}catch{t||Y(`blocked`)}})(),()=>{t=!0,window.clearTimeout(r),n?.getTracks().forEach(e=>e.stop()),e.srcObject=null;let i=q.current;i?.active&&(i.active=!1,i.release())}},[F,L]),(0,i.jsxs)(`div`,{ref:re,className:[`relative h-full w-full overflow-hidden`,H].filter(Boolean).join(` `),style:U,...W,children:[(0,i.jsx)(`canvas`,{ref:ie,className:`absolute inset-0 block h-full w-full`,"aria-hidden":`true`}),F&&(0,i.jsxs)(`div`,{className:I?`pointer-events-none absolute bottom-3 right-3 aspect-[4/3] w-[168px] overflow-hidden rounded-[14px] bg-[#0b0b0e] shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_8px_24px_rgba(0,0,0,0.35)]`:`pointer-events-none absolute h-px w-px overflow-hidden opacity-0`,children:[(0,i.jsx)(`video`,{ref:G,className:`block h-full w-full -scale-x-100 object-cover`,muted:!0,playsInline:!0}),I&&(0,i.jsx)(`span`,{className:`absolute bottom-2 left-2 rounded-lg bg-[rgba(10,10,12,0.6)] px-2 py-[3px] font-sans text-[11px] font-medium leading-[1.4] text-white backdrop-blur-sm`,children:S[J]})]})]})};export{C as GridScan,C as default};