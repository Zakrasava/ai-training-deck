import{i as e,t}from"./react-sySUN5R7.js";import{k as n}from"./sculpture-dark-CKiqtzhU.js";import{t as r}from"./FingerPrintIcon-B1JJe5mQ.js";import{n as i}from"./showcase-Ba60OtnS.js";var a=[[`path`,{d:`M18.9905 19H19M18.9905 19C18.3678 19.6175 17.2393 19.4637 16.4479 19.4637C15.4765 19.4637 15.0087 19.6537 14.3154 20.347C13.7251 20.9374 12.9337 22 12 22C11.0663 22 10.2749 20.9374 9.68457 20.347C8.99128 19.6537 8.52349 19.4637 7.55206 19.4637C6.76068 19.4637 5.63218 19.6175 5.00949 19C4.38181 18.3776 4.53628 17.2444 4.53628 16.4479C4.53628 15.4414 4.31616 14.9786 3.59938 14.2618C2.53314 13.1956 2.00002 12.6624 2 12C2.00001 11.3375 2.53312 10.8044 3.59935 9.73817C4.2392 9.09832 4.53628 8.46428 4.53628 7.55206C4.53628 6.76065 4.38249 5.63214 5 5.00944C5.62243 4.38178 6.7556 4.53626 7.55208 4.53626C8.46427 4.53626 9.09832 4.2392 9.73815 3.59937C10.8044 2.53312 11.3375 2 12 2C12.6625 2 13.1956 2.53312 14.2618 3.59937C14.9015 4.23907 15.5355 4.53626 16.4479 4.53626C17.2393 4.53626 18.3679 4.38247 18.9906 5C19.6182 5.62243 19.4637 6.75559 19.4637 7.55206C19.4637 8.55858 19.6839 9.02137 20.4006 9.73817C21.4669 10.8044 22 11.3375 22 12C22 12.6624 21.4669 13.1956 20.4006 14.2618C19.6838 14.9786 19.4637 15.4414 19.4637 16.4479C19.4637 17.2444 19.6182 18.3776 18.9905 19Z`,stroke:`currentColor`,strokeWidth:`1.5`,key:`0`}],[`path`,{d:`M9 12.8929C9 12.8929 10.2 13.5447 10.8 14.5C10.8 14.5 12.6 10.75 15 9.5`,stroke:`currentColor`,strokeLinecap:`round`,strokeLinejoin:`round`,strokeWidth:`1.5`,key:`1`}]],o=e(t(),1),s=n(),c={dark:{"--rc-base":`#1d1c22`,"--rc-shadow":`0 22px 44px -20px rgba(0, 0, 0, 0.8), 0 6px 16px -8px rgba(0, 0, 0, 0.5)`,"--rc-ink":`#f4f4f5`,"--rc-muted":`rgba(244, 244, 245, 0.6)`,"--rc-tile":`linear-gradient(180deg, #3a3644 0%, #27242f 100%)`,"--rc-tile-edge":`rgba(255, 255, 255, 0.07)`,"--rc-tile-highlight":`rgba(255, 255, 255, 0.12)`,"--rc-tile-shadow":`0 4px 10px -4px rgba(0, 0, 0, 0.7)`,"--rc-rim":`rgba(255, 255, 255, 0.07)`,"--rc-rim-highlight":`rgba(255, 255, 255, 0.1)`},light:{"--rc-base":`#e7e7ea`,"--rc-shadow":`0 22px 44px -22px rgba(24, 24, 27, 0.3), 0 6px 16px -10px rgba(24, 24, 27, 0.16)`,"--rc-ink":`#18181b`,"--rc-muted":`rgba(24, 24, 27, 0.6)`,"--rc-tile":`linear-gradient(180deg, #ffffff 0%, #f6f6f8 100%)`,"--rc-tile-edge":`rgba(24, 24, 27, 0.08)`,"--rc-tile-highlight":`rgba(255, 255, 255, 1)`,"--rc-tile-shadow":`0 4px 10px -5px rgba(24, 24, 27, 0.25)`,"--rc-rim":`rgba(24, 24, 27, 0.08)`,"--rc-rim-highlight":`rgba(255, 255, 255, 0.8)`}},l={borderRadius:`var(--rc-radius)`,background:`var(--rc-base)`,boxShadow:`var(--rc-shadow)`,transform:`translate3d(0, var(--rc-lift, 0px), 0) rotateX(var(--rc-rotate-x, 0deg)) rotateY(var(--rc-rotate-y, 0deg))`,opacity:`var(--rc-presence, 1)`,isolation:`isolate`,willChange:`transform`},u={borderRadius:`var(--rc-tile-radius)`,background:`var(--rc-tile)`,boxShadow:`var(--rc-tile-shadow)`,color:`var(--rc-muted)`},d={boxShadow:`inset 0 0 0 1px var(--rc-tile-edge), inset 0 1px 0 var(--rc-tile-highlight)`},f={boxShadow:`inset 0 0 0 1px var(--rc-rim), inset 0 1px 0 var(--rc-rim-highlight)`},p=900,m=1.2,h=1400,g=.35,_=`#version 300 es
in vec2 aPosition;
out vec2 vUv;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`,v=`#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uVideo;
uniform sampler2D uCam;
uniform vec4 uVideoMap;
uniform vec4 uCamMap;
uniform vec2 uWeights;
uniform vec2 uLod;
float level(sampler2D source) {
  vec3 mean = pow(textureLod(source, vec2(0.5), 14.0).rgb, vec3(2.2));
  return pow(dot(mean, vec3(0.2126, 0.7152, 0.0722)), 1.0 / 2.2);
}
void main() {
  vec3 color = vec3(0.0);
  float mean = 0.0;
  if (uWeights.x > 0.0) {
    color += textureLod(uVideo, vUv * uVideoMap.xy + uVideoMap.zw, uLod.x).rgb * uWeights.x;
    mean += level(uVideo) * uWeights.x;
  }
  if (uWeights.y > 0.0) {
    color += textureLod(uCam, vUv * uCamMap.xy + uCamMap.zw, uLod.y).rgb * uWeights.y;
    mean += level(uCam) * uWeights.y;
  }
  fragColor = vec4(color, mean);
}`,y=`#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uTexture;
uniform vec2 uStep;
uniform float uSigma;
void main() {
  vec4 sum = texture(uTexture, vUv);
  if (uSigma < 0.35) {
    fragColor = sum;
    return;
  }
  float falloff = -0.5 / (uSigma * uSigma);
  int radius = int(min(ceil(uSigma * 2.8), 40.0));
  float total = 1.0;
  for (int i = 1; i <= 40; i++) {
    if (i > radius) break;
    float offset = float(i);
    float weight = exp(offset * offset * falloff);
    sum += (texture(uTexture, vUv + uStep * offset) + texture(uTexture, vUv - uStep * offset)) * weight;
    total += 2.0 * weight;
  }
  fragColor = sum / total;
}`,b=`#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uEnv;
uniform vec2 uEnvSize;
uniform vec2 uSize;
uniform float uRadius;
uniform float uScale;
uniform mat3 uRotate;
uniform float uCapture;
uniform float uBlur;
uniform float uRough;
uniform float uMetal;
uniform vec3 uTint;
uniform float uGray;
uniform float uWarp;
uniform float uWarpScale;
uniform float uShine;
uniform float uBevel;
uniform float uGlare;
uniform vec2 uPointer;
uniform float uTheme;

const float VIEW = ${p.toFixed(1)};
const float OVERSCAN = ${m.toFixed(2)};
const float CONTENT = 46.0;

float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

vec2 hash2(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.103, 0.0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.xx + p3.yz) * p3.zy) * 2.0 - 1.0;
}

vec3 gradientNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  vec2 du = 30.0 * f * f * (f * (f - 2.0) + 1.0);
  vec2 ga = hash2(i);
  vec2 gb = hash2(i + vec2(1.0, 0.0));
  vec2 gc = hash2(i + vec2(0.0, 1.0));
  vec2 gd = hash2(i + vec2(1.0, 1.0));
  float va = dot(ga, f);
  float vb = dot(gb, f - vec2(1.0, 0.0));
  float vc = dot(gc, f - vec2(0.0, 1.0));
  float vd = dot(gd, f - vec2(1.0, 1.0));
  float k = va - vb - vc + vd;
  float value = va + u.x * (vb - va) + u.y * (vc - va) + u.x * u.y * k;
  vec2 slope = ga + u.x * (gb - ga) + u.y * (gc - ga) + u.x * u.y * (ga - gb - gc + gd) + du * (u.yx * k + vec2(vb, vc) - va);
  return vec3(value, slope);
}

float valueNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float erf(float x) {
  float x2 = x * x;
  return sign(x) * sqrt(1.0 - exp(-x2 * (1.2732395 + 0.147 * x2) / (1.0 + 0.147 * x2)));
}

float band(float x, float halfWidth, float sigma) {
  float s = 1.4142136 * max(sigma, 0.0001);
  return 0.5 * (erf((x + halfWidth) / s) - erf((x - halfWidth) / s));
}

float strip(vec2 q, vec2 center, vec2 dir, float halfWidth, vec2 sigma) {
  vec2 normal = vec2(-dir.y, dir.x);
  return band(dot(q - center, normal), halfWidth, length(sigma * normal));
}

const vec2 SWEEP = vec2(0.5, 0.86);
const vec3 LUMA = vec3(0.2126, 0.7152, 0.0722);

float softbox(vec2 q, vec2 sigma) {
  float key = strip(q, vec2(-0.1, -0.16), normalize(SWEEP), 0.022, sigma + 0.018);
  float top = band(q.y + 0.6, 0.12, sigma.y + 0.05);
  float side = band(q.x - 0.46, 0.05, sigma.x + 0.05);
  return key + top * 0.8 + side * 0.35;
}

float room(vec2 q, vec2 sigma) {
  float fall = smoothstep(-0.55, 0.5, q.y);
  float flag = strip(q, vec2(0.24, -0.02), normalize(SWEEP), 0.09, sigma + 0.08);
  return mix(0.85, 0.12, fall) * (1.0 - 0.6 * flag);
}

vec4 sampleEnv(vec2 uv) {
  vec2 st = uv * uEnvSize - 0.5;
  vec2 i = floor(st);
  vec2 f = st - i;
  vec2 f2 = f * f;
  vec2 f3 = f2 * f;
  vec2 w0 = (1.0 - 3.0 * f + 3.0 * f2 - f3) / 6.0;
  vec2 w1 = (4.0 - 6.0 * f2 + 3.0 * f3) / 6.0;
  vec2 w2 = (1.0 + 3.0 * f + 3.0 * f2 - 3.0 * f3) / 6.0;
  vec2 w3 = f3 / 6.0;
  vec2 g0 = w0 + w1;
  vec2 g1 = w2 + w3;
  vec2 c0 = (i + 0.5 + w1 / g0 - 1.0) / uEnvSize;
  vec2 c1 = (i + 0.5 + w3 / g1 + 1.0) / uEnvSize;
  vec4 a = texture(uEnv, c0) * g0.x + texture(uEnv, vec2(c1.x, c0.y)) * g1.x;
  vec4 b = texture(uEnv, vec2(c0.x, c1.y)) * g0.x + texture(uEnv, c1) * g1.x;
  return a * g0.y + b * g1.y;
}

vec3 toLinear(vec3 c) {
  return pow(max(c, 0.0), vec3(2.2));
}

void main() {
  vec2 p = vec2(vUv.x - 0.5, 0.5 - vUv.y) * uSize;
  vec2 halfSize = uSize * 0.5;
  float r = min(uRadius, min(halfSize.x, halfSize.y));
  vec2 corner = abs(p) - halfSize + r;
  vec2 side = vec2(p.x >= 0.0 ? 1.0 : -1.0, p.y >= 0.0 ? 1.0 : -1.0);
  float d;
  vec2 outward;
  if (corner.x > 0.0 && corner.y > 0.0) {
    d = length(corner) - r;
    outward = normalize(corner) * side;
  } else if (corner.x > corner.y) {
    d = corner.x - r;
    outward = vec2(side.x, 0.0);
  } else {
    d = corner.y - r;
    outward = vec2(0.0, side.y);
  }
  float coverage = clamp(0.5 - d * uScale, 0.0, 1.0);

  float chamferWidth = min(uBevel, max(r, 1.0));
  float chamfer = chamferWidth > 0.01 ? 1.0 - smoothstep(0.0, chamferWidth, -d) : 0.0;
  vec2 slope = outward * chamfer;

  vec2 wp = p / (220.0 * uWarpScale);
  vec3 w1 = gradientNoise(wp);
  vec3 w2 = gradientNoise(wp * 2.07 + 13.7);
  vec2 ripple = (w1.yz + w2.yz * 0.5) * uWarp;
  slope += ripple * 0.008;

  float grain = valueNoise(vec2(p.x * 0.008, p.y * 0.55)) * 0.45 + valueNoise(vec2(p.x * 0.019 + 3.7, p.y * 0.23)) * 0.35 + valueNoise(vec2(p.x * 0.004 + 9.2, p.y * 0.09)) * 0.2;
  float brush = uRough * uRough;
  slope.y += (grain - 0.5) * brush * 0.004;

  vec3 normal = uRotate * normalize(vec3(slope, 1.0));
  vec3 position = uRotate * vec3(p, 0.0);
  vec3 view = normalize(position - vec3(0.0, 0.0, VIEW));
  vec3 bounce = reflect(view, normal);
  vec2 q = bounce.xy / max(bounce.z, 0.2);

  vec2 footprint = fwidth(q);
  vec2 sigma = sqrt(vec2(uBlur / VIEW) * vec2(uBlur / VIEW) + footprint * footprint * 0.5);
  sigma += vec2(0.004, 0.05) * uRough;

  vec2 shift = clamp((q - p / VIEW) * CONTENT + ripple * 10.0, -uSize, uSize);
  vec2 cp = (p + shift) / (uSize * OVERSCAN);
  vec4 reflected = uCapture > 0.0 ? sampleEnv(vec2(0.5 + cp.x, 0.5 - cp.y)) : vec4(0.0, 0.0, 0.0, 1.0);
  vec3 captured = toLinear(reflected.rgb) * (0.5 / max(pow(reflected.a, 2.2), 0.02));
  captured = mix(vec3(dot(captured, LUMA)), captured, 1.0 - uGray);
  captured = pow(max(captured * 1.2, 0.0), vec3(mix(2.0, 1.5, uTheme)));

  vec3 scene = mix(vec3(room(q, sigma)), captured, uCapture * (1.0 - chamfer) * mix(1.0, 0.6, uTheme));
  scene *= 1.0 + (grain - 0.5) * brush * 0.3;

  vec2 toPointer = (uPointer - p) / (120.0 + uBlur * 4.0);
  vec2 spread = toPointer * vec2(1.0, 1.0 / (1.0 + 2.5 * uRough));
  float reach = dot(spread, spread);
  float glint = max(1.0 + 3.0 * dot(slope, toPointer), 0.0);
  float glare = (exp(-reach * 1.6) + exp(-reach * 0.35) * 0.15) * glint * uGlare * (1.0 + 0.8 * (grain - 0.5) * brush);
  float highlight = (softbox(q, sigma) * uShine + glare) * mix(0.4, 1.0, uMetal);

  vec3 dark = vec3(0.005, 0.005, 0.006) + uTint * (scene * 0.05 * uMetal + highlight * 0.36);
  vec3 light = uTint * (vec3(0.83, 0.83, 0.85) * (1.0 - 0.45 * uMetal * (1.0 - clamp(scene, 0.0, 1.0))) + highlight * 0.35);
  vec3 color = mix(dark, light, uTheme);
  color = min(color, 0.7) + 0.3 * (1.0 - exp(-max(color - 0.7, 0.0) / 0.3));
  color = pow(clamp(color, 0.0, 1.0), vec3(1.0 / 2.2));

  color += (hash(gl_FragCoord.xy) - 0.5) / 255.0;
  color = clamp(color, 0.0, 1.0);
  fragColor = vec4(color * coverage, coverage);
}`,x=(e,t,n)=>Math.min(n,Math.max(t,e)),S=e=>typeof e==`number`?`${e}px`:e,C=e=>{let t=String(e||``).trim(),n=/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(t);if(n){let e=n[1].length===3?n[1].replace(/./g,e=>e+e):n[1];return[0,2,4].map(t=>parseInt(e.slice(t,t+2),16)/255)}let r=/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i.exec(t);return r?[r[1],r[2],r[3]].map(e=>x(parseFloat(e)/255,0,1)):[1,1,1]},w=(e,t,n)=>{let r=e.createShader(t);return r?(e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(console.error(e.getShaderInfoLog(r)),e.deleteShader(r),null)):null},T=(e,t)=>{let n=w(e,e.VERTEX_SHADER,_),r=w(e,e.FRAGMENT_SHADER,t),i=n&&r?e.createProgram():null;if(!n||!r||!i)return n&&e.deleteShader(n),r&&e.deleteShader(r),null;if(e.attachShader(i,n),e.attachShader(i,r),e.bindAttribLocation(i,0,`aPosition`),e.linkProgram(i),e.deleteShader(n),e.deleteShader(r),!e.getProgramParameter(i,e.LINK_STATUS))return console.error(e.getProgramInfoLog(i)),e.deleteProgram(i),null;let a={},o=e.getProgramParameter(i,e.ACTIVE_UNIFORMS);for(let t=0;t<o;t++){let n=e.getActiveUniform(i,t);n&&(a[n.name]=e.getUniformLocation(i,n.name))}return{program:i,uniforms:a}},E=(e,t,n,r)=>{let i=e/Math.max(1,t),a=i>n?n/i:1,o=i>n?1:i/n,s=r?-a:a;return[s,-o,.5-s*.5,.5+o*.5]},D=(e,t,n,r)=>{let i=e/Math.max(1,t),a=e*(i>r?r/i:1);return Math.max(0,Math.log2(Math.max(1,a/Math.max(1,n)))-.5)},O=e=>{let t=e.getContext(`webgl2`,{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1,powerPreference:`default`});if(!t)return null;let n=T(t,v),r=T(t,y),i=T(t,b);if(!n||!r||!i){for(let e of[n,r,i])e&&t.deleteProgram(e.program);return null}let a=(e,n)=>{let r=t.createTexture();return t.bindTexture(t.TEXTURE_2D,r),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,e?t.LINEAR_MIPMAP_LINEAR:t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,n),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,n),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,new Uint8Array([0,0,0,255])),r},o=()=>{let e=a(!1,t.MIRRORED_REPEAT),n=t.createFramebuffer();return t.bindFramebuffer(t.FRAMEBUFFER,n),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,e,0),t.bindFramebuffer(t.FRAMEBUFFER,null),{texture:e,framebuffer:n,width:1,height:1}},s=(e,n,r)=>{(e.width!==n||e.height!==r)&&(e.width=n,e.height=r,t.bindTexture(t.TEXTURE_2D,e.texture),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,n,r,0,t.RGBA,t.UNSIGNED_BYTE,null))},c=t.createVertexArray();t.bindVertexArray(c);let l=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,l),t.bufferData(t.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),t.STATIC_DRAW),t.enableVertexAttribArray(0),t.vertexAttribPointer(0,2,t.FLOAT,!1,0,0),t.disable(t.BLEND),t.disable(t.DEPTH_TEST);let u={video:a(!0,t.CLAMP_TO_EDGE),cam:a(!0,t.CLAMP_TO_EDGE)},d=o(),f=o(),p=o(),h=new Float32Array(9),g=(n,r)=>(t.bindFramebuffer(t.FRAMEBUFFER,n?n.framebuffer:null),t.viewport(0,0,n?n.width:e.width,n?n.height:e.height),t.useProgram(r.program),r.uniforms),_=(e,n)=>{t.activeTexture(t.TEXTURE0+e),t.bindTexture(t.TEXTURE_2D,n)};return{upload:(e,n)=>{try{return t.bindTexture(t.TEXTURE_2D,u[e]),t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,!1),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,t.RGBA,t.UNSIGNED_BYTE,n),t.generateMipmap(t.TEXTURE_2D),!0}catch{return!1}},renderEnv:({width:e,height:i,scale:a,blur:o,roughness:c,video:l,cam:h})=>{let v=x(2.5/Math.max(o,.01),.12,a),y=Math.max(8,Math.ceil(e*m*v)),b=Math.max(8,Math.ceil(i*m*v));s(d,y,b),s(f,y,b),s(p,y,b);let S=e/Math.max(1,i),C=1-(1-l.mix)*(1-h.mix),w=C>0?h.mix/C:0,T=g(d,n);_(0,u.video),_(1,u.cam),t.uniform1i(T.uVideo,0),t.uniform1i(T.uCam,1),t.uniform4fv(T.uVideoMap,l.ready?E(l.width,l.height,S,!1):[1,1,0,0]),t.uniform4fv(T.uCamMap,h.ready?E(h.width,h.height,S,!0):[1,1,0,0]),t.uniform2f(T.uWeights,l.ready&&C>0?1-w:0,h.ready?w:0),t.uniform2f(T.uLod,l.ready?D(l.width,l.height,y,S):0,h.ready?D(h.width,h.height,y,S):0),t.drawArrays(t.TRIANGLES,0,3),T=g(f,r),_(0,d.texture),t.uniform1i(T.uTexture,0),t.uniform2f(T.uStep,1/y,0),t.uniform1f(T.uSigma,o*v),t.drawArrays(t.TRIANGLES,0,3),T=g(p,r),_(0,f.texture),t.uniform1i(T.uTexture,0),t.uniform2f(T.uStep,0,1/b),t.uniform1f(T.uSigma,(o*(1+1.5*c)+10*c)*v),t.drawArrays(t.TRIANGLES,0,3)},renderPlate:({width:n,height:r,rotateX:a,rotateY:o,capture:s,glare:c,pointerX:l,pointerY:u,settings:d})=>{let f=Math.cos(a),m=Math.sin(a),v=Math.cos(o),y=Math.sin(o);h.set([v,m*y,-f*y,0,f,m,y,-m*v,f*v]);let b=g(null,i);_(0,p.texture),t.uniform1i(b.uEnv,0),t.uniform2f(b.uEnvSize,p.width,p.height),t.uniform2f(b.uSize,n,r),t.uniform1f(b.uRadius,d.radius),t.uniform1f(b.uScale,e.width/Math.max(1,n)),t.uniformMatrix3fv(b.uRotate,!1,h),t.uniform1f(b.uCapture,s),t.uniform1f(b.uBlur,d.blurStrength),t.uniform1f(b.uRough,d.roughness),t.uniform1f(b.uMetal,d.metalness),t.uniform3fv(b.uTint,d.tint),t.uniform1f(b.uGray,d.grayscale),t.uniform1f(b.uWarp,d.warp),t.uniform1f(b.uWarpScale,d.warpScale),t.uniform1f(b.uShine,d.shine),t.uniform1f(b.uBevel,d.bevel),t.uniform1f(b.uGlare,c),t.uniform2f(b.uPointer,l,u),t.uniform1f(b.uTheme,d.theme),t.drawArrays(t.TRIANGLES,0,3)},dispose:()=>{if(!t.isContextLost()){for(let e of[d,f,p])t.deleteFramebuffer(e.framebuffer),t.deleteTexture(e.texture);t.deleteTexture(u.video),t.deleteTexture(u.cam),t.deleteBuffer(l),t.deleteVertexArray(c);for(let e of[n,r,i])t.deleteProgram(e.program)}}}},k=(0,o.memo)(({name:e=`Alexander Doe`,role:t=`Senior Developer`,badge:n=`Verified`,status:p=`Active`,statusColor:m=`#22c55e`,idLabel:_=`ID number`,idValue:v=`8901 2345 6789`,children:y,theme:b=`dark`,videoSrc:w,webcam:T=!1,onWebcamError:E,tint:D=`#ffffff`,metalness:k=1,roughness:A=.3,blurStrength:ee=6,grayscale:j=1,warp:M=.6,warpScale:N=1,shine:P=1,bevel:F=3,glare:I=.5,enableTilt:L=!0,tiltStrength:R=12,intro:z=!0,width:B=320,height:V=500,radius:H=24,className:U=``,style:W})=>{let G=(0,o.useRef)(null),te=(0,o.useRef)(null),ne=(0,o.useRef)(null),K=(0,o.useRef)(null),q=(0,o.useRef)(null),J=(0,o.useRef)(null),Y=(0,o.useRef)(E),[re,ie]=(0,o.useState)(0),X=b===`light`?`light`:`dark`,Z={tint:C(D).map(e=>e**2.2),metalness:x(k,0,1),roughness:x(A,0,1),blurStrength:x(ee,0,40),grayscale:x(j,0,1),warp:x(M,0,2),warpScale:x(N,.2,4),shine:x(P,0,3),bevel:x(F,0,16),glare:x(I,0,1),enableTilt:L,tiltStrength:x(R,0,30),radius:Math.max(0,H),theme:+(X===`light`),intro:z},Q=(0,o.useRef)(Z);Q.current=Z,Y.current=E,(0,o.useEffect)(()=>{J.current?.()}),(0,o.useLayoutEffect)(()=>{let e=G.current;e&&Q.current.intro&&(window.matchMedia(`(prefers-reduced-motion: reduce)`).matches||(e.style.setProperty(`--rc-presence`,`0`),e.style.setProperty(`--rc-lift`,`14px`)))},[]),(0,o.useEffect)(()=>{let e=G.current,t=te.current,n=ne.current,r=K.current,i=q.current;if(!e||!t||!n||!r||!i)return;let a=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,o=O(n),s={p:0,v:0,target:0},c={p:0,v:0,target:0},l={p:0,target:0},u={x:0,y:0},d={width:t.offsetWidth,height:t.offsetHeight,scale:1},f=e=>({element:e,src:``,time:-1,ready:!1,failed:!1,width:0,height:0,mix:0}),p={video:f(r),cam:f(i)},m=1,_=0,v=0,y=null,b=0,S=0,C=!0,w=document.visibilityState!==`hidden`,T=!1,E=``,D=!1,k=()=>{let{enableTilt:t,tiltStrength:n}=Q.current,r=t&&!a?n:0,i=e.style;i.setProperty(`--rc-rotate-x`,`${(c.p*r).toFixed(3)}deg`),i.setProperty(`--rc-rotate-y`,`${(-s.p*r).toFixed(3)}deg`);let o=1-(1-m)**3;i.setProperty(`--rc-presence`,o.toFixed(4)),i.setProperty(`--rc-lift`,`${((1-o)*14).toFixed(2)}px`)},A=(e,t)=>{let n=t.element,r=n.srcObject?`stream`:n.currentSrc;if(r!==t.src&&(t.src=r,t.failed=!1,t.time=-1),!r)return t.ready=!1,!1;if(n.error)return t.failed=!0,!1;if(n.readyState<2||!n.videoWidth)return!1;let i=n.currentTime;return t.ready&&i===t.time?!1:!o||!o.upload(e,n)?(t.failed=!0,!1):(t.time=i,t.width=n.videoWidth,t.height=n.videoHeight,t.ready=!0,!0)},ee=(e,t)=>{let n=e.ready&&!e.failed&&e.src?1:0,r=e.mix;return e.mix+=(n-e.mix)*(1-Math.exp(-t/g)),Math.abs(n-e.mix)<.002&&(e.mix=n),e.mix!==r},j=()=>{d.width=t.offsetWidth,d.height=t.offsetHeight,d.scale=Math.min(window.devicePixelRatio||1,2);let e=Math.max(1,Math.round(d.width*d.scale)),r=Math.max(1,Math.round(d.height*d.scale));(n.width!==e||n.height!==r)&&(n.width=e,n.height=r),D=!0},M=e=>{if(b=0,T)return;let t=Math.min(.05,(e-S)/1e3||0);S=e;let n=e<v,r=n?24:120,i=n?9:16,f=Math.max(1,Math.ceil(t/(1/120))),h=t/f;for(let e=0;e<f;e++)for(let e of[s,c])e.v+=(r*(e.target-e.p)-i*e.v)*h,e.p+=e.v*h;let g=l.target>l.p?.18:n?.9:.45;l.p+=(l.target-l.p)*(1-Math.exp(-t/g)),m<1&&(m=x((e-_)/650,0,1));let y=Math.abs(s.target-s.p)>5e-4||Math.abs(c.target-c.p)>5e-4||Math.abs(s.v)>5e-4||Math.abs(c.v)>5e-4||Math.abs(l.target-l.p)>.002||m<1;y||(s.p=s.target,c.p=c.target,s.v=0,c.v=0,l.p=l.target),k();let O=!1;if(o){p.cam.mix<1&&A(`video`,p.video)&&(D=!0),A(`cam`,p.cam)&&(D=!0);for(let e of[p.video,p.cam])e.src&&!e.failed&&!e.element.paused&&(O=!0),ee(e,t)&&(D=!0),e.mix>0&&e.mix<1&&(O=!0);let e=Q.current,n=`${e.blurStrength}|${e.roughness}|${d.width}|${d.height}|${d.scale}`;n!==E&&(E=n,D=!0),D&&(p.video.mix>0||p.cam.mix>0)&&o.renderEnv({width:d.width,height:d.height,scale:d.scale,blur:e.blurStrength,roughness:e.roughness,video:p.video,cam:p.cam}),D=!1;let r=(e.enableTilt&&!a?e.tiltStrength:0)*(Math.PI/180);o.renderPlate({width:d.width,height:d.height,rotateX:c.p*r,rotateY:-s.p*r,capture:1-(1-p.video.mix)*(1-p.cam.mix),glare:e.glare*l.p,pointerX:u.x,pointerY:u.y,settings:e})}(y||O)&&C&&w&&(b=requestAnimationFrame(M))},N=()=>{!b&&!T&&C&&w&&(S=performance.now(),b=requestAnimationFrame(M))};J.current=N;let P=(e,t,n=!0)=>{s.target=x(e,-1,1),c.target=x(t,-1,1),l.target=+!!n,v=0,N()},F=t=>{let n=e.getBoundingClientRect();if(!n.width||!n.height)return;let r=(t.clientX-n.left)/n.width*2-1,i=(t.clientY-n.top)/n.height*2-1;u.x=r*d.width*.5,u.y=i*d.height*.5,P(r,i)},I=()=>P(0,0,!1),L=e=>{e.pointerType===`mouse`&&F(e)},R=e=>{(e.pointerType===`mouse`||e.pointerId===y)&&F(e)},z=e=>{e.pointerType===`mouse`&&I()},B=e=>{e.pointerType!==`mouse`&&(y=e.pointerId,F(e))},V=e=>{e.pointerId===y&&(y=null,I())};e.addEventListener(`pointerenter`,L),e.addEventListener(`pointermove`,R),e.addEventListener(`pointerleave`,z),e.addEventListener(`pointerdown`,B),e.addEventListener(`pointerup`,V),e.addEventListener(`pointercancel`,V);let H=e=>{e.preventDefault(),T=!0,cancelAnimationFrame(b),b=0},U=()=>ie(e=>e+1);n.addEventListener(`webglcontextlost`,H),n.addEventListener(`webglcontextrestored`,U);let W=new ResizeObserver(()=>{j(),N()});W.observe(t),j();let Y=new IntersectionObserver(e=>{if(C=e.some(e=>e.isIntersecting),!a)for(let e of[r,i])C&&(e.currentSrc||e.srcObject)?e.play().catch(()=>{}):!C&&e.currentSrc&&!e.srcObject&&e.pause();N()});Y.observe(e);let X=()=>{w=document.visibilityState!==`hidden`,N()};document.addEventListener(`visibilitychange`,X);let Z=()=>N(),$=[`loadeddata`,`playing`,`seeked`,`emptied`,`error`];for(let e of[r,i])for(let t of $)e.addEventListener(t,Z);return Q.current.intro&&!a&&re===0&&(s.p=.62,c.p=-.55,l.p=1,u.x=.62*d.width*.5,u.y=-.55*d.height*.5,m=0,_=performance.now(),v=performance.now()+h),k(),N(),()=>{cancelAnimationFrame(b),J.current=null,W.disconnect(),Y.disconnect(),document.removeEventListener(`visibilitychange`,X),e.removeEventListener(`pointerenter`,L),e.removeEventListener(`pointermove`,R),e.removeEventListener(`pointerleave`,z),e.removeEventListener(`pointerdown`,B),e.removeEventListener(`pointerup`,V),e.removeEventListener(`pointercancel`,V),n.removeEventListener(`webglcontextlost`,H),n.removeEventListener(`webglcontextrestored`,U);for(let e of[r,i])for(let t of $)e.removeEventListener(t,Z);o?.dispose()}},[re]),(0,o.useEffect)(()=>{let e=K.current;if(e){if(!w)e.removeAttribute(`src`),e.load(),J.current?.();else return e.src=w,window.matchMedia(`(prefers-reduced-motion: reduce)`).matches||e.play().catch(()=>{}),J.current?.(),()=>e.pause()}},[w]),(0,o.useEffect)(()=>{let e=q.current;if(!T||!e)return;let t=navigator.mediaDevices;if(!t||!t.getUserMedia){Y.current?.(Error(`Camera access is not available in this browser.`));return}let n=null,r=!1;return t.getUserMedia({video:{facingMode:`user`,width:{ideal:640},height:{ideal:480}},audio:!1}).then(t=>{r?t.getTracks().forEach(e=>e.stop()):(n=t,e.srcObject=t,e.play().catch(()=>{}),J.current?.())}).catch(e=>{r||Y.current?.(e)}),()=>{r=!0,n?.getTracks().forEach(e=>e.stop()),e.srcObject=null,J.current?.()}},[T]);let $=Math.max(0,H),ae={...c[X],"--rc-width":S(B),"--rc-height":S(V),"--rc-radius":`${$}px`,"--rc-pad":`${Math.round(x($*.8,16,22))}px`,"--rc-tile-radius":`${Math.round(x($*.5,8,14))}px`,"--rc-status":m,width:`var(--rc-width)`,height:`var(--rc-height)`,perspective:`900px`,color:`var(--rc-ink)`};return(0,s.jsxs)(`div`,{ref:G,className:`relative box-border max-w-full touch-pan-y select-none ${U}`.trim(),style:{...ae,...W},children:[(0,s.jsxs)(`div`,{ref:te,className:`relative box-border h-full w-full overflow-hidden`,style:l,children:[(0,s.jsx)(`canvas`,{ref:ne,className:`absolute inset-0 block h-full w-full`,"aria-hidden":`true`}),(0,s.jsx)(`div`,{className:`relative z-[1] box-border flex h-full flex-col p-[var(--rc-pad)]`,children:y??(0,s.jsxs)(s.Fragment,{children:[(n||p)&&(0,s.jsxs)(`div`,{className:`flex items-center gap-3 text-[13px] leading-5`,children:[n&&(0,s.jsxs)(`span`,{className:`inline-flex items-center gap-1.5 font-medium [color:var(--rc-ink)]`,children:[(0,s.jsx)(i,{icon:a,size:16,strokeWidth:1.8}),n]}),p&&(0,s.jsxs)(`span`,{className:`ml-auto inline-flex items-center gap-2 [color:var(--rc-muted)]`,children:[(0,s.jsx)(`span`,{className:`h-1.5 w-1.5 rounded-full [background:var(--rc-status)]`}),p]})]}),(0,s.jsxs)(`div`,{className:`mt-auto`,children:[e&&(0,s.jsx)(`h3`,{className:`m-0 text-[24px] font-medium leading-[1.15] tracking-[-0.02em] [color:var(--rc-ink)] [text-wrap:balance]`,children:e}),t&&(0,s.jsx)(`p`,{className:`mb-0 mt-1 text-[14px] leading-[1.4] [color:var(--rc-muted)]`,children:t})]}),(_||v)&&(0,s.jsxs)(`div`,{className:`mt-6 flex items-end justify-between gap-4`,children:[(0,s.jsxs)(`div`,{className:`flex min-w-0 flex-col gap-1`,children:[_&&(0,s.jsx)(`span`,{className:`text-[12px] leading-4 [color:var(--rc-muted)]`,children:_}),v&&(0,s.jsx)(`span`,{className:`overflow-hidden text-ellipsis whitespace-nowrap font-mono text-[15px] leading-5 tracking-[0.02em] tabular-nums [color:var(--rc-ink)]`,children:v})]}),(0,s.jsxs)(`span`,{className:`relative box-border flex h-11 w-11 flex-none items-center justify-center`,style:u,children:[(0,s.jsx)(`span`,{className:`pointer-events-none absolute inset-0 rounded-[inherit]`,style:d}),(0,s.jsx)(i,{icon:r,size:22,strokeWidth:1.6})]})]})]})}),(0,s.jsx)(`span`,{className:`pointer-events-none absolute inset-0 z-[2] rounded-[inherit]`,style:f})]}),(0,s.jsx)(`video`,{ref:K,className:`pointer-events-none absolute left-0 top-0 h-px w-px opacity-0`,muted:!0,loop:!0,playsInline:!0,crossOrigin:`anonymous`,"aria-hidden":`true`}),(0,s.jsx)(`video`,{ref:q,className:`pointer-events-none absolute left-0 top-0 h-px w-px opacity-0`,muted:!0,playsInline:!0,"aria-hidden":`true`})]})});export{k as default};