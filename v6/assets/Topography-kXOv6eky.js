import{i as e,t}from"./react-sySUN5R7.js";import{k as n}from"./sculpture-dark-CKiqtzhU.js";var r=e(t(),1),i=n(),a=.32,o=9,s=.05,c=160,l=1.7,u=.45,d=2.8,f=4,p=4,m=256,h=48,ee=2e5,te=[-.81,.58,-.02],g={forward:[0,1],backward:[0,-1],left:[-1,0],right:[1,0]},_=[`lift`,`trace`,`light`],v={plus:0,dots:1},ne=1.25,y=`
precision highp float;
precision highp int;

uniform float uFrequency;
uniform vec2 uMorph;
uniform sampler2D uSculpt;
uniform float uSculptOn;
uniform vec4 uPulses[${f}];
uniform vec3 uEye;
uniform vec3 uForward;
uniform vec3 uNear;

uint lattice(ivec2 p) {
  uvec2 q = uvec2(p + 1073741824);
  uint h = q.x * 2654435761u + q.y * 2246822519u;
  h = (h ^ (h >> 15u)) * 739982445u;
  h = (h ^ (h >> 12u)) * 695872825u;
  return h ^ (h >> 15u);
}

float corner(ivec2 c, vec2 f) {
  uint h = lattice(c);
  vec2 g = vec2(float(h & 65535u), float(h >> 16u)) / 32767.5 - 1.0;
  return dot(g, f);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = p - i;
  ivec2 c = ivec2(i);
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  float a = corner(c, f);
  float b = corner(c + ivec2(1, 0), f - vec2(1.0, 0.0));
  float d = corner(c + ivec2(0, 1), f - vec2(0.0, 1.0));
  float e = corner(c + ivec2(1, 1), f - vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(d, e, u.x), u.y);
}

vec2 octave(vec2 p, vec2 shift) {
  return vec2(1.6 * p.x - 1.2 * p.y, 1.2 * p.x + 1.6 * p.y) + shift;
}

float relief(vec2 t) {
  vec2 p = t * uFrequency;
  vec2 w = vec2(noise(p * 0.42 + uMorph), noise(p * 0.42 - uMorph.yx + vec2(5.2, 1.3)));
  p += w * 0.8;
  float n = noise(p) * 0.55;
  p = octave(p, vec2(7.1, 3.7));
  n += noise(p) * 0.15;
  p = octave(p, vec2(1.9, 8.3));
  n += noise(p) * 0.04;
  float s = log(1.0 + exp(7.0 * (3.0 * n + 0.05))) / 7.0;
  return s * s * 1.4 + 0.1 * n;
}

float swell(vec2 t) {
  float lift = 0.0;
  for (int i = 0; i < ${f}; i++) {
    vec4 p = uPulses[i];
    if (p.w <= 0.0) continue;
    float x = (length(t - p.xy) - p.z) / (0.28 + p.z * 0.05);
    lift += exp(-x * x) * p.w;
  }
  return lift;
}

vec4 sculpted(vec2 t) {
  return uSculptOn > 0.5 ? textureLod(uSculpt, t / ${h}.0, 0.0) : vec4(0.0);
}

float settle(vec2 world) {
  float depth = dot(vec3(world.x, 0.0, world.y) - uEye, uForward);
  float x = clamp((depth - uNear.x) / max(uNear.y - uNear.x, 1e-3), 0.0, 1.0);
  return mix(uNear.z, 1.0, x * x * x * (x * (x * 6.0 - 15.0) + 10.0));
}
`,re=`#version 300 es
${y}
uniform ivec2 uBase;
uniform float uCell;
uniform float uDetail;
layout(location = 0) out vec4 outField;
layout(location = 1) out vec4 outHeight;

void main() {
  vec2 t = vec2(uBase + ivec2(gl_FragCoord.xy)) * uCell;
  vec4 carved = sculpted(t);
  float ring = swell(t);
  float ground = relief(t) + carved.r + ring * 0.14;
  vec2 dp = t * uFrequency * 5.0 + vec2(13.1, 4.7);
  float fine = noise(dp) * 0.6 + noise(octave(dp, vec2(2.3, 6.1))) * 0.3;
  outField = vec4(carved.g, ring, ground, carved.r);
  outHeight = vec4(ground + uDetail * 0.1 * fine, 0.0, 0.0, 1.0);
}`,b=e=>`#version 300 es
#define BAKED ${+!!e}
${y}
uniform sampler2D uField;
uniform ivec2 uOrigin;
uniform ivec2 uCamCell;
uniform vec2 uCamFrac;
uniform float uCell;
uniform int uStride;
uniform float uHeight;
uniform mat4 uViewProj;
out vec2 vTexel;
out vec2 vTerrain;
out float vDepth;
out float vLift;
out vec3 vNormal;

float ground(vec2 t) {
  return relief(t) + swell(t) * 0.14;
}

void main() {
  ivec2 step = ivec2(gl_VertexID >> 1, gl_InstanceID + (gl_VertexID & 1)) * uStride;
  ivec2 local = uOrigin + step;
  vec2 terrain = vec2(local + uCamCell) * uCell;
  vec2 world = vec2(local) * uCell - uCamFrac;
  float k = settle(world);
#if BAKED
  ivec2 texel = step + 2;
  vec4 c = texelFetch(uField, texel, 0);
  vec4 l = texelFetch(uField, texel - ivec2(1, 0), 0);
  vec4 r = texelFetch(uField, texel + ivec2(1, 0), 0);
  vec4 d = texelFetch(uField, texel - ivec2(0, 1), 0);
  vec4 u = texelFetch(uField, texel + ivec2(0, 1), 0);
  float h = (c.b - c.a) * k + c.a;
  float dx = (l.b - l.a - r.b + r.a) * k + l.a - r.a;
  float dz = (d.b - d.a - u.b + u.a) * k + d.a - u.a;
  vNormal = vec3(dx * uHeight / (2.0 * uCell), 1.0, dz * uHeight / (2.0 * uCell));
  vTexel = vec2(texel) + 0.5;
#else
  float h = ground(terrain) * k;
  float hx = ground(terrain + vec2(0.04, 0.0)) * k;
  float hz = ground(terrain + vec2(0.0, 0.04)) * k;
  vNormal = vec3((h - hx) * uHeight / 0.04, 1.0, (h - hz) * uHeight / 0.04);
  vTexel = vec2(0.0);
#endif
  vec4 clip = uViewProj * vec4(world.x, h * uHeight, world.y, 1.0);
  gl_Position = clip;
  vTerrain = terrain;
  vDepth = clip.w;
  vLift = h * uHeight;
}`,ie=e=>`#version 300 es
#define BAKED ${+!!e}
${y}
uniform sampler2D uField;
uniform highp sampler2D uHeightField;
uniform float uDetail;
uniform float uLines;
uniform float uLineWidth;
uniform float uMajor;
uniform vec3 uColor;
uniform float uBrightness;
uniform vec2 uFade;
uniform vec3 uFocus;
uniform vec4 uHeat;
uniform vec4 uLamp;
uniform vec4 uTrace;
uniform vec3 uSun;
uniform float uRefDepth;
uniform float uReveal;
uniform float uLightMode;
uniform float uOpacity;
uniform vec4 uGlitch[3];
uniform float uGlitchSeed;
uniform float uPixel;
in vec2 vTexel;
in vec2 vTerrain;
in float vDepth;
in float vLift;
in vec3 vNormal;
out vec4 outColor;

float smoother(float x) {
  x = clamp(x, 0.0, 1.0);
  return x * x * x * (x * (x * 6.0 - 15.0) + 10.0);
}

float stroke(float dist, float width, float soft, float density, float crowd) {
  float cover = max(0.0, min(min(width, soft), 0.5 * (width + soft) - dist)) / soft;
  return mix(cover, min(width * density, 1.0) * 0.6, crowd);
}

float sampleHeight(vec2 coord, out vec2 slope) {
  vec2 u = coord - 0.5;
  vec2 i = floor(u + 0.5);
  vec2 f = u - i;
  vec3 wx = vec3(0.5 * (0.5 - f.x) * (0.5 - f.x), 0.75 - f.x * f.x, 0.5 * (0.5 + f.x) * (0.5 + f.x));
  vec3 wy = vec3(0.5 * (0.5 - f.y) * (0.5 - f.y), 0.75 - f.y * f.y, 0.5 * (0.5 + f.y) * (0.5 + f.y));
  vec3 dx = vec3(f.x - 0.5, -2.0 * f.x, 0.5 + f.x);
  vec3 dy = vec3(f.y - 0.5, -2.0 * f.y, 0.5 + f.y);
  ivec2 base = ivec2(i) - 1;
  float total = 0.0;
  slope = vec2(0.0);
  for (int y = 0; y < 3; y++) {
    float a = texelFetch(uHeightField, base + ivec2(0, y), 0).r;
    float b = texelFetch(uHeightField, base + ivec2(1, y), 0).r;
    float c = texelFetch(uHeightField, base + ivec2(2, y), 0).r;
    float row = a * wx.x + b * wx.y + c * wx.z;
    total += row * wy[y];
    slope += vec2((a * dx.x + b * dx.y + c * dx.z) * wy[y], row * dy[y]);
  }
  return total;
}

void main() {
  float py = gl_FragCoord.y / uPixel;
  float shift = 0.0;
  float split = 0.0;
  for (int i = 0; i < 3; i++) {
    if (py >= uGlitch[i].x && py < uGlitch[i].y) {
      shift = uGlitch[i].z * uPixel;
      split = uGlitch[i].w * uPixel;
    }
  }
  vec2 spot = vTerrain - dFdx(vTerrain) * shift;
#if BAKED
  vec2 ex = dFdx(vTexel);
  vec2 ey = dFdy(vTexel);
  vec2 coord = vTexel - ex * shift;
  vec2 slope;
  float h = sampleHeight(coord, slope);
  vec4 field = texture(uField, coord / vec2(textureSize(uField, 0)));
  float trail = field.r;
  float ring = field.g;
  float gx = dot(slope, ex) * uLines;
  float gy = dot(slope, ey) * uLines;
#else
  vec2 dp = spot * uFrequency * 5.0 + vec2(13.1, 4.7);
  float ring = swell(spot);
  float h = relief(spot) + ring * 0.14 + uDetail * 0.1 * (noise(dp) * 0.6 + noise(octave(dp, vec2(2.3, 6.1))) * 0.3);
  float trail = 0.0;
  float gx = dFdx(h) * uLines;
  float gy = dFdy(h) * uLines;
#endif

  float lc = h * uLines + 0.5;
  float density = max(sqrt(gx * gx + gy * gy), 1e-5);
  float dist = abs(fract(lc + 0.5) - 0.5) / density;
  float major = uMajor * (1.0 - step(0.5, mod(floor(lc + 0.5), 5.0)));

  vec2 hd = spot - uHeat.xy;
  float heat = exp(-dot(hd, hd) / (uHeat.z * uHeat.z)) * uHeat.w + trail * 0.6;
  float energy = heat + ring;

  float depth = max(vDepth, 0.01);
  float persp = clamp(sqrt(uRefDepth / depth), 0.6, 1.6);
  float width = uLineWidth * persp * (1.0 + 0.6 * major) * (1.0 + 0.45 * min(energy, 1.5));
  float soft = 1.0 + min(uFocus.y * abs(1.0 - uFocus.x / depth), uFocus.z);
  float crowd = smoothstep(0.3, 0.75, density * max(width, soft));
  float cover = stroke(dist, width, soft, density, crowd);
  vec3 cover3 = vec3(cover);
  if (split > 0.0) {
    float offset = split * density;
    cover3.r = stroke(abs(fract(lc + offset + 0.5) - 0.5) / density, width, soft, density, crowd);
    cover3.b = stroke(abs(fract(lc - offset + 0.5) - 0.5) / density, width, soft, density, crowd);
    vec2 block = floor(vec2(gl_FragCoord.x / (uPixel * 26.0), py / 5.0)) + uGlitchSeed * 71.0;
    float drop = fract(sin(dot(block, vec2(12.9898, 78.233))) * 43758.5453);
    cover3 *= drop > 0.82 ? 0.1 : 1.2;
  }

  vec3 normal = normalize(vNormal);
  float sun = clamp(dot(normal, uSun), 0.0, 1.0);
  vec3 toLamp = uLamp.xyz - vec3(vTerrain.x, vLift, vTerrain.y);
  float lampDistance = length(toLamp);
  float lamp = clamp(dot(normal, toLamp / max(lampDistance, 1e-3)), 0.0, 1.0) * uLamp.w / (1.0 + lampDistance * lampDistance * 0.9);
  float level = mix(0.45, 1.05, smoothstep(0.0, 1.1, h)) * mix(0.35, 1.25, sun * sun) * (1.0 + 0.6 * major);
  level += heat * 1.4 + ring * 3.0 + lamp * 1.2;

  float fade = 1.0 - smoother((depth - uFade.x) / max(uFade.y - uFade.x, 1e-3));
  vec3 light = cover3 * level;

  if (uTrace.y > 0.0) {
    float traceWidth = uLineWidth * persp * 1.8;
    float trace = stroke(abs(h - uTrace.x) * uLines / density, traceWidth, soft, density, crowd);
    vec2 td = spot - uTrace.zw;
    light += trace * uTrace.y * mix(0.35, 1.0, exp(-dot(td, td) / 20.0)) * 2.6;
  }
  light *= fade * uBrightness * uReveal;

  if (uLightMode > 0.5) {
    float ink = (1.0 - exp(-max(max(light.r, light.g), light.b) * 1.8)) * 0.92 * uOpacity;
    outColor = vec4(uColor * ink, ink);
    return;
  }

  vec3 color = 1.0 - exp(-uColor * light * 1.8);
  float top = max(max(color.r, color.g), color.b);
  float dither = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5;
  color = max(color + dither / 255.0 * step(0.002, top), 0.0);
  outColor = vec4(color, max(max(color.r, color.g), color.b)) * uOpacity;
}`,x=`#version 300 es
${y}
uniform ivec2 uOrigin;
uniform ivec2 uCamCell;
uniform vec2 uCamFrac;
uniform float uSpacing;
uniform int uColumns;
uniform float uHeight;
uniform mat4 uViewProj;
uniform vec2 uView;
uniform float uSize;
uniform float uRefDepth;
uniform vec4 uHeat;
uniform float uTime;
uniform vec4 uGlitch[3];
uniform float uPixel;
out vec2 vCorner;
out float vSize;
out float vGlow;
out float vFrame;
out float vDepth;

void main() {
  ivec2 local = uOrigin + ivec2(gl_InstanceID % uColumns, gl_InstanceID / uColumns);
  ivec2 id = local + uCamCell;
  vec2 terrain = vec2(id) * uSpacing;
  vec2 world = vec2(local) * uSpacing - uCamFrac;
  float ring = swell(terrain);
  float h = (relief(terrain) + ring * 0.14) * settle(world) + sculpted(terrain).r;
  vec4 clip = uViewProj * vec4(world.x, h * uHeight + 0.05, world.y, 1.0);
  uint seed = lattice(id + ivec2(911, 377));
  float a = float(seed & 1023u) / 1023.0;
  float b = float((seed >> 10u) & 1023u) / 1023.0;
  vec2 hd = terrain - uHeat.xy;
  float heat = exp(-dot(hd, hd) / (uHeat.z * uHeat.z)) * uHeat.w;
  float blink = step(0.92, a) * (0.5 + 0.5 * sin(uTime * (1.4 + b * 2.2) + b * 40.0));
  float size = uSize * clamp(sqrt(uRefDepth / max(clip.w, 0.01)), 0.6, 1.3) * (1.0 + 0.4 * heat + 0.35 * blink);
  float frame = max(smoothstep(0.55, 0.95, blink), smoothstep(0.3, 0.8, heat));
  vec2 corner = vec2(float(gl_VertexID & 1), float(gl_VertexID >> 1)) * 2.0 - 1.0;
  vec2 offset = corner * (size * (frame > 0.001 ? 2.6 : 1.0) + 1.5);
  float py = (clip.y / clip.w * 0.5 + 0.5) * uView.y / uPixel;
  float shift = 0.0;
  for (int i = 0; i < 3; i++) {
    if (py >= uGlitch[i].x && py < uGlitch[i].y) shift = uGlitch[i].z;
  }
  clip.xy += (offset + vec2(shift * uPixel, 0.0)) / uView * 2.0 * clip.w;
  gl_Position = clip;
  vCorner = offset;
  vSize = size;
  vFrame = frame;
  vGlow = 0.5 + 0.4 * b + blink * 0.9 + heat * 1.8 + ring * 3.0;
  vDepth = clip.w;
}`,ae=`#version 300 es
precision highp float;
uniform vec3 uColor;
uniform vec2 uFade;
uniform float uReveal;
uniform float uBrightness;
uniform float uLightMode;
uniform float uOpacity;
uniform float uStyle;
uniform float uPixel;
in vec2 vCorner;
in float vSize;
in float vGlow;
in float vFrame;
in float vDepth;
out vec4 outColor;

float smoother(float x) {
  x = clamp(x, 0.0, 1.0);
  return x * x * x * (x * (x * 6.0 - 15.0) + 10.0);
}

void main() {
  vec2 a = abs(vCorner);
  float cover;
  if (uStyle < 0.5) {
    float thick = max(0.6 * uPixel, 0.5);
    float across = clamp(vSize - a.x + 0.5, 0.0, 1.0) * clamp(thick - a.y + 0.5, 0.0, 1.0);
    float down = clamp(vSize - a.y + 0.5, 0.0, 1.0) * clamp(thick - a.x + 0.5, 0.0, 1.0);
    cover = max(across, down);
  } else {
    cover = clamp(vSize * 0.42 - length(vCorner) + 0.5, 0.0, 1.0);
  }
  if (vFrame > 0.001) {
    float edge = vSize * 2.3;
    float reach = edge * 0.45;
    float line = max(0.5 * uPixel, 0.5);
    float sides = clamp(line - abs(a.x - edge) + 0.5, 0.0, 1.0) * clamp(a.y - edge + reach + 0.5, 0.0, 1.0) * clamp(edge + line - a.y + 0.5, 0.0, 1.0);
    float caps = clamp(line - abs(a.y - edge) + 0.5, 0.0, 1.0) * clamp(a.x - edge + reach + 0.5, 0.0, 1.0) * clamp(edge + line - a.x + 0.5, 0.0, 1.0);
    cover = max(cover, max(sides, caps) * vFrame * 0.8);
  }
  float fade = 1.0 - smoother((vDepth - uFade.x) / max(uFade.y - uFade.x, 1e-3));
  float light = cover * vGlow * fade * fade * uReveal * uBrightness;
  if (uLightMode > 0.5) {
    float ink = (1.0 - exp(-light * 1.8)) * 0.92 * uOpacity;
    outColor = vec4(uColor * ink, ink);
    return;
  }
  vec3 color = 1.0 - exp(-uColor * light * 1.8);
  outColor = vec4(color, max(max(color.r, color.g), color.b)) * uOpacity;
}`,S=`#version 300 es
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`,oe=`#version 300 es
precision highp float;
uniform sampler2D uPrevious;
uniform vec4 uSegment;
uniform vec4 uBrush;
uniform vec4 uBurst;
uniform vec2 uDecay;
out vec4 outColor;

vec2 wrapped(vec2 d) {
  return d - ${h}.0 * floor(d / ${h}.0 + 0.5);
}

void main() {
  vec4 previous = texelFetch(uPrevious, ivec2(gl_FragCoord.xy), 0);
  vec2 t = gl_FragCoord.xy / ${m}.0 * ${h}.0;
  vec2 a = wrapped(t - uSegment.xy);
  vec2 ab = uSegment.zw - uSegment.xy;
  float k = clamp(dot(a, ab) / max(dot(ab, ab), 1e-6), 0.0, 1.0);
  vec2 d = a - ab * k;
  float g = exp(-dot(d, d) / (uBrush.x * uBrush.x)) * uBrush.w;
  float height = previous.r * uDecay.x;
  height += (uBrush.y - height) * g * uBrush.z;
  float heat = previous.g * uDecay.y;
  heat += (1.0 - heat) * g * uBrush.z;
  vec2 b = wrapped(t - uBurst.xy);
  height += uBurst.w * exp(-dot(b, b) / (uBurst.z * uBurst.z));
  outColor = vec4(height, heat, 0.0, 1.0);
}`,C=`#version 300 es
precision highp float;
uniform sampler2D uSource;
uniform vec2 uTarget;
uniform vec2 uTexel;
out vec4 outColor;

void main() {
  vec2 uv = gl_FragCoord.xy / uTarget;
  vec4 color = texture(uSource, uv - uTexel);
  color += texture(uSource, uv + uTexel);
  color += texture(uSource, uv + vec2(uTexel.x, -uTexel.y));
  color += texture(uSource, uv + vec2(-uTexel.x, uTexel.y));
  outColor = min(color * 0.25, vec4(1.0));
}`,w=`#version 300 es
precision highp float;
uniform sampler2D uSource;
uniform vec2 uTarget;
uniform vec2 uStep;
out vec4 outColor;

void main() {
  vec2 uv = gl_FragCoord.xy / uTarget;
  vec4 color = texture(uSource, uv) * 0.181862;
  color += (texture(uSource, uv + uStep * 1.423135) + texture(uSource, uv - uStep * 1.423135)) * 0.284316;
  color += (texture(uSource, uv + uStep * 3.326702) + texture(uSource, uv - uStep * 3.326702)) * 0.106598;
  color += (texture(uSource, uv + uStep * 5.242989) + texture(uSource, uv - uStep * 5.242989)) * 0.018156;
  outColor = color;
}`,se=`#version 300 es
precision highp float;
uniform sampler2D uBloom0;
uniform sampler2D uBloom1;
uniform sampler2D uBloom2;
uniform sampler2D uBloom3;
uniform vec2 uView;
uniform float uGlow;
uniform float uLightMode;
out vec4 outColor;

void main() {
  vec2 uv = gl_FragCoord.xy / uView;
  vec4 halo = texture(uBloom0, uv) * 0.4;
  halo += texture(uBloom1, uv) * 0.3;
  halo += texture(uBloom2, uv) * 0.2;
  halo += texture(uBloom3, uv) * 0.1;
  if (uLightMode > 0.5) {
    outColor = halo * uGlow * 0.35;
    return;
  }
  vec3 color = halo.rgb * uGlow * 1.6;
  color = color / (1.0 + color);
  outColor = vec4(color, max(max(color.r, color.g), color.b));
}`,T=(e,t,n)=>Math.min(n,Math.max(t,e)),E=e=>{let t=T(e,0,1);return t*t*t*(t*(t*6-15)+10)},D=(e,t)=>{let n=Math.imul(e+1073741824,2654435761)+Math.imul(t+1073741824,2246822519)>>>0;return n=Math.imul(n^n>>>15,739982445)>>>0,n=Math.imul(n^n>>>12,695872825)>>>0,(n^n>>>15)>>>0},O=(e,t,n,r)=>{let i=D(e,t);return((i&65535)/32767.5-1)*n+((i>>>16)/32767.5-1)*r},k=(e,t)=>{let n=Math.floor(e),r=Math.floor(t),i=e-n,a=t-r,o=i*i*i*(i*(i*6-15)+10),s=a*a*a*(a*(a*6-15)+10),c=O(n,r,i,a),l=O(n+1,r,i-1,a),u=O(n,r+1,i,a-1),d=O(n+1,r+1,i-1,a-1),f=c+(l-c)*o;return f+(u+(d-u)*o-f)*s},ce=(e,t,n,r,i)=>{let a=e*n,o=t*n,s=k(a*.42+r,o*.42+i),c=k(a*.42-i+5.2,o*.42-r+1.3);a+=s*.8,o+=c*.8;let l=k(a,o)*.55,u=1.6*a-1.2*o+7.1,d=1.2*a+1.6*o+3.7;l+=k(u,d)*.15,l+=k(1.6*u-1.2*d+1.9,1.2*u+1.6*d+8.3)*.04;let f=Math.log(1+Math.exp(7*(3*l+.05)))/7;return f*f*1.4+.1*l},le=(e,t,n)=>{let r=e*n*5+13.1,i=t*n*5+4.7;return k(r,i)*.6+k(1.6*r-1.2*i+2.3,1.2*r+1.6*i+6.1)*.3},A=(e,t,n)=>{let r=e.createShader(t);return r?(e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(e.deleteShader(r),null)):null},j=(e,t,n)=>{let r=A(e,e.VERTEX_SHADER,t),i=A(e,e.FRAGMENT_SHADER,n),a=e.createProgram();if(!r||!i||!a)return null;if(e.attachShader(a,r),e.attachShader(a,i),e.linkProgram(a),e.deleteShader(r),e.deleteShader(i),!e.getProgramParameter(a,e.LINK_STATUS))return e.deleteProgram(a),null;let o={},s=e.getProgramParameter(a,e.ACTIVE_UNIFORMS);for(let t=0;t<s;t++){let n=e.getActiveUniform(a,t);n&&(o[n.name.replace(/\[0\]$/,``)]=e.getUniformLocation(a,n.name))}return{program:a,uniforms:o}},ue=e=>{let t=String(e||`#ffffff`).replace(`#`,``).trim();(t.length===3||t.length===4)&&(t=t.slice(0,3).split(``).map(e=>e+e).join(``));let n=parseInt(t.slice(0,6),16);return Number.isNaN(n)?[1,1,1]:[(n>>16&255)/255,(n>>8&255)/255,(n&255)/255]},de=(e,t)=>{let n=Math.cos(t),r=[Math.sin(e)*n,-Math.sin(t),Math.cos(e)*n],i=[Math.cos(e),0,-Math.sin(e)];return{f:r,r:i,u:[r[1]*i[2]-r[2]*i[1],r[2]*i[0]-r[0]*i[2],r[0]*i[1]-r[1]*i[0]]}},fe=e=>T(.4877/e,a,.6),pe=({eye:e,f:t,r:n,u:r},i,a)=>{let o=1/fe(i),c=1/-159.95,l=[n[0],r[0],-t[0],0,n[1],r[1],-t[1],0,n[2],r[2],-t[2],0,-(n[0]*e[0]+n[1]*e[1]+n[2]*e[2]),-(r[0]*e[0]+r[1]*e[1]+r[2]*e[2]),t[0]*e[0]+t[1]*e[1]+t[2]*e[2],1],u=[o/i,0,0,0,0,o,0,0,0,0,160.05*c,-1,0,0,320*s*c,0];for(let e=0;e<4;e++)for(let t=0;t<4;t++){let n=0;for(let r=0;r<4;r++)n+=u[r*4+t]*l[e*4+r];a[e*4+t]=n}return a},me=({color:e=`#4f7cff`,lineCount:t=22,lineWidth:n=1.2,majorLines:a=!0,elevation:h=1,foreground:y=.2,scale:D=1,detail:O=.35,tilt:k=32,speed:A=.25,direction:me=`forward`,morph:M=.2,glow:N=.6,depthOfField:he=.4,fog:P=.35,brightness:F=1,opacity:I=1,mouseInteraction:L=!0,hoverEffect:R=`lift`,mouseRadius:z=1,mouseStrength:ge=.6,trail:B=.3,parallax:V=.5,clickEffect:_e=`pulse`,markers:H=`none`,glitch:U=0,intro:W=!0,lightMode:ve=!1,dpr:G,className:K=``,style:q})=>{let ye=(0,r.useRef)(null),be=(0,r.useRef)(null),xe=(0,r.useRef)(null),[J,Se]=(0,r.useState)(0),Y={color:e,lineCount:T(t,2,80),lineWidth:Math.max(.2,n),majorLines:a,elevation:T(h,0,3),foreground:T(y,0,1),scale:T(D,.2,5),detail:T(O,0,1),tilt:T(k,12,90),speed:A,direction:g[me]??g.forward,morph:Math.max(0,M),glow:Math.max(0,N),depthOfField:T(he,0,1),fog:T(P,0,1),brightness:Math.max(0,F),opacity:T(I,0,1),mouseInteraction:L,hoverEffect:_.includes(R)?R:`lift`,mouseRadius:Math.max(.1,z),mouseStrength:Math.max(0,ge),trail:T(B,0,1),parallax:T(V,0,1),clickEffect:_e,markers:v[H]??-1,glitch:T(U,0,1),intro:W,lightMode:ve,dpr:G},X=(0,r.useRef)(Y);return X.current=Y,(0,r.useEffect)(()=>{let e=ye.current,t=be.current,n=Math.min(X.current.dpr||window.devicePixelRatio||1,2),r=t?.getContext(`webgl2`,{alpha:!0,premultipliedAlpha:!0,antialias:n<1.5,depth:!0,stencil:!1,powerPreference:`high-performance`});if(!e||!t||!r)return;let i=!!r.getExtension(`EXT_color_buffer_float`),a=j(r,b(i),ie(i)),h=i?j(r,S,re):null,g=i?j(r,S,oe):null,_=j(r,S,C),v=j(r,S,w),y=j(r,S,se),D=j(r,x,ae);if(!a||!_||!v||!y||!D)return;let O=e=>e.preventDefault(),k=()=>Se(e=>e+1);t.addEventListener(`webglcontextlost`,O),t.addEventListener(`webglcontextrestored`,k);let A=r.createVertexArray(),me=i?r.RGBA16F:r.RGBA8,M=(e,t,n,i)=>{let a=r.createTexture();return r.bindTexture(r.TEXTURE_2D,a),r.texStorage2D(r.TEXTURE_2D,1,n,e,t),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MIN_FILTER,r.LINEAR),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MAG_FILTER,r.LINEAR),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_S,i),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_T,i),a},N=()=>({texture:null,framebuffer:r.createFramebuffer(),depth:null,width:0,height:0}),he=(e,t,n,i)=>{e.texture&&e.width===t&&e.height===n||(e.texture&&r.deleteTexture(e.texture),e.texture=M(t,n,me,r.CLAMP_TO_EDGE),e.width=t,e.height=n,r.bindFramebuffer(r.FRAMEBUFFER,e.framebuffer),r.framebufferTexture2D(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,e.texture,0),i&&(e.depth||(e.depth=r.createRenderbuffer()),r.bindRenderbuffer(r.RENDERBUFFER,e.depth),r.renderbufferStorage(r.RENDERBUFFER,r.DEPTH_COMPONENT24,t,n),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.RENDERBUFFER,e.depth)))},P=N(),F=Array.from({length:p},()=>[N(),N()]),I=g?[0,1].map(()=>{let e=M(m,m,r.RG16F,r.REPEAT),t=r.createFramebuffer();return r.bindFramebuffer(r.FRAMEBUFFER,t),r.framebufferTexture2D(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,e,0),r.clearColor(0,0,0,0),r.clear(r.COLOR_BUFFER_BIT),{texture:e,framebuffer:t}}):null,L=M(1,1,r.RGBA8,r.REPEAT),R={texture:null,heights:null,framebuffer:r.createFramebuffer(),width:0,height:0},z=0,ge=(e,t)=>{R.texture&&e<=R.width&&t<=R.height||(R.texture&&r.deleteTexture(R.texture),R.heights&&r.deleteTexture(R.heights),R.width=Math.max(e,Math.ceil(R.width*1.25),64),R.height=Math.max(t,Math.ceil(R.height*1.25),64),R.texture=M(R.width,R.height,r.RGBA16F,r.CLAMP_TO_EDGE),R.heights=M(R.width,R.height,r.R32F,r.CLAMP_TO_EDGE),r.bindTexture(r.TEXTURE_2D,R.heights),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MAG_FILTER,r.NEAREST),r.bindFramebuffer(r.FRAMEBUFFER,R.framebuffer),r.framebufferTexture2D(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,R.texture,0),r.framebufferTexture2D(r.FRAMEBUFFER,r.COLOR_ATTACHMENT1,r.TEXTURE_2D,R.heights,0),r.drawBuffers([r.COLOR_ATTACHMENT0,r.COLOR_ATTACHMENT1]))},B=(e,t)=>{r.activeTexture(r.TEXTURE0+e),r.bindTexture(r.TEXTURE_2D,t)},V=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches??!1,_e=new Float32Array(16),H=new Float32Array(16),U=new Float32Array(12),W={until:0,next:1.5,roll:0,seed:0},ve=7919,G=()=>(ve=ve*16807%2147483647,(ve-1)/2147483646),K=[],q={x:0,y:0,inside:!1},J={width:1,height:1,ratio:1,cell:.05,cellKey:``},Y={intro:X.current.intro&&!V?0:1,rise:1,travelX:0,travelZ:0,morph:0,yaw:0,pitch:0,yawVelocity:0,pitchVelocity:0,presence:0,focus:o,hit:null,brushFrom:null,sculptLife:0,burst:null,level:0,trace:0,clock:0,tilt:X.current.tilt,elevation:X.current.elevation,scale:X.current.scale};Y.rise=E(Y.intro);let Z=0,Ce=0,we=!0,Te=0,Ee=()=>{let e=Math.min(Y.tilt*Math.PI/180+Y.pitch,Math.PI/2-1e-4),t=de(Y.yaw,e),n=Y.elevation*l*Y.rise*.18,r=Y.elevation*l*Y.rise*1.3+.9,i=Math.max(o,(r-n)/Math.sin(e));return{...t,distance:i,eye:[-t.f[0]*i,n-t.f[1]*i,-t.f[2]*i]}},De=(e,t,n)=>{let r=J.width/J.height,i=fe(r),a=[0,1,2].map(a=>e.f[a]+e.r[a]*t*i*r+e.u[a]*n*i),o=Math.hypot(a[0],a[1],a[2]);return a.map(e=>e/o)},Oe=(e,t)=>t[0]*e.f[0]+t[1]*e.f[1]+t[2]*e.f[2],ke=(e,t)=>{let n=De(e,0,t);return n[1]>-.001?1/0:e.eye[1]/-n[1]*Oe(e,n)},Ae=(e,t)=>[ke(e,-1)*.9,e.distance,t.foreground],je=(e,t,n,r)=>{let i=(n-e.eye[0])*e.f[0]-e.eye[1]*e.f[1]+(r-e.eye[2])*e.f[2];return t[2]+(1-t[2])*E((i-t[0])/Math.max(t[1]-t[0],.001))},Me=(e,t,n,r)=>{let i=De(e,n,r),a=Y.elevation*l*Y.rise,o=u/Y.scale,d=Ae(e,t),f=t=>{let n=e.eye[0]+i[0]*t,r=e.eye[2]+i[2]*t,s=ce(Y.travelX+n,Y.travelZ+r,o,Y.morph*.37,Y.morph*.23);return e.eye[1]+i[1]*t-s*a*je(e,d,n,r)},p=s,m=f(p);for(let t=0;t<200&&p<c*.5;t++){let t=p+Math.max(.02,m*.4),n=f(t);if(n<0){let n=p,r=t;for(let e=0;e<10;e++){let e=(n+r)*.5;f(e)<0?r=e:n=e}return{x:Y.travelX+e.eye[0]+i[0]*r,y:e.eye[1]+i[1]*r,z:Y.travelZ+e.eye[2]+i[2]*r,depth:r*Oe(e,i)}}p=t,m=n}return null},Ne=(e,t,n)=>{let r=Y.elevation*l*Y.rise*1.7+.2+t.mouseStrength,i={minX:1/0,maxX:-1/0,minZ:1/0,maxZ:-1/0,near:1/0},a=(t,n)=>{let r=e.eye[0]+t[0]*n,a=e.eye[2]+t[2]*n;i.minX=Math.min(i.minX,r),i.maxX=Math.max(i.maxX,r),i.minZ=Math.min(i.minZ,a),i.maxZ=Math.max(i.maxZ,a)};for(let t of[-1.08,0,1.08])for(let o of[-1.08,1.08]){let c=De(e,t,o),l=Math.max(Oe(e,c),.001),u=s,d=n*1.05/l;c[1]<-1e-4&&(u=Math.max(s,(e.eye[1]-r)/-c[1]),d=Math.min(d,e.eye[1]/-c[1])),u=Math.min(u,d),a(c,u),a(c,d),i.near=Math.min(i.near,u*l)}return i},Pe=(e,t)=>{let n=Math.floor(Y.travelX/t),r=Math.floor(Y.travelZ/t),i=Y.travelX-n*t,a=Y.travelZ-r*t,o=Math.floor((e.minX+i)/t)-2,s=Math.floor((e.minZ+a)/t)-2,c=T(Math.ceil((e.maxX+i)/t)+2-o,1,4e3);return{cell:t,camX:n,camZ:r,fracX:i,fracZ:a,k0:o,m0:s,columns:c,rows:T(Math.ceil((e.maxZ+a)/t)+2-s,1,Math.floor(ee*1.5/c))}},Fe=()=>{let e=X.current,n=Ee();pe(n,J.width/J.height,_e);let i=ke(n,-1),o=Math.min(ke(n,1),n.distance*3.2),s=Math.max(o,i*1.6,n.distance*1.4),c=s+(i*1.8-s)*e.fog,d=c*.7+(i*.7-c*.7)*e.fog,f=Ne(n,e,c),m=`${J.width}x${J.height}@${J.ratio}|${Math.round(Y.tilt/4)}|${Math.round(Y.elevation*5)}|${e.fog}`;if(m!==J.cellKey){J.cellKey=m;let e=J.height*J.ratio*.5/fe(J.width/J.height),t=T(14*Math.max(f.near,.5)/e,.02,.4),n=(f.maxX-f.minX)*(f.maxZ-f.minZ)/(t*t);n>ee&&(t*=Math.sqrt(n/ee)),J.cell=t}let g=ue(e.color),re=Y.elevation*l*Y.rise,b=Pe(f,J.cell),ie=Ae(n,e),x=e.markers>=0?Pe(f,ne):null,ae=(Y.hit&&e.mouseInteraction?Y.presence:0)*(.35+.5*e.mouseStrength),S=e.depthOfField*J.height*.016,oe=E(Y.intro/.35),C=Y.hit?Y.hit.x:0,w=Y.hit?Y.hit.z:0;if(H.fill(0),K.forEach((e,t)=>{H.set([e.x,e.z,e.age*4.2,Math.exp(-e.age*1.1)*E(e.age/.08)],t*4)}),r.bindVertexArray(A),h){let t=b.columns+7,n=b.rows+7;ge(t,n),r.bindFramebuffer(r.FRAMEBUFFER,R.framebuffer),r.viewport(0,0,t,n),r.useProgram(h.program);let i=h.uniforms;B(0,I?I[z].texture:L),r.uniform1i(i.uSculpt,0),r.uniform1f(i.uSculptOn,+!!I),r.uniform1f(i.uFrequency,u/Y.scale),r.uniform2f(i.uMorph,Y.morph*.37,Y.morph*.23),r.uniform4fv(i.uPulses,H),r.uniform2i(i.uBase,b.k0-2+b.camX,b.m0-2+b.camZ),r.uniform1f(i.uCell,b.cell),r.uniform1f(i.uDetail,e.detail),r.disable(r.DEPTH_TEST),r.disable(r.BLEND),r.drawArrays(r.TRIANGLES,0,3)}let se=(t,i,o,s)=>{r.viewport(0,0,i,o),r.useProgram(a.program);let l=a.uniforms;if(B(0,h?R.texture:L),r.uniform1i(l.uField,0),B(1,h?R.heights:L),r.uniform1i(l.uHeightField,1),r.uniform1f(l.uFrequency,u/Y.scale),r.uniform2f(l.uMorph,Y.morph*.37,Y.morph*.23),r.uniform4fv(l.uPulses,H),r.uniform2i(l.uOrigin,b.k0,b.m0),r.uniform2i(l.uCamCell,b.camX,b.camZ),r.uniform2f(l.uCamFrac,b.fracX,b.fracZ),r.uniform1f(l.uCell,b.cell),r.uniform1i(l.uStride,s),r.uniform1f(l.uHeight,re),r.uniform3fv(l.uEye,n.eye),r.uniform3fv(l.uForward,n.f),r.uniform3fv(l.uNear,ie),r.uniform1f(l.uRefDepth,n.distance),r.uniformMatrix4fv(l.uViewProj,!1,_e),r.uniform1f(l.uDetail,e.detail),r.uniform1f(l.uLines,e.lineCount),r.uniform1f(l.uLineWidth,e.lineWidth*t),r.uniform1f(l.uMajor,+!!e.majorLines),r.uniform3fv(l.uColor,g),r.uniform1f(l.uBrightness,e.brightness),r.uniform2f(l.uFade,d,c),r.uniform3f(l.uFocus,Y.focus,S*t,J.height*.03*t),r.uniform4f(l.uHeat,C,w,.9*e.mouseRadius,ae),r.uniform4f(l.uLamp,C,Y.hit?Y.hit.y+1.4:0,w,ae),r.uniform4f(l.uTrace,Y.level,Y.trace,C,w),r.uniform3fv(l.uSun,te),r.uniform1f(l.uReveal,oe),r.uniform1f(l.uLightMode,+!!e.lightMode),r.uniform1f(l.uOpacity,e.opacity),r.uniform4fv(l.uGlitch,U),r.uniform1f(l.uGlitchSeed,W.seed),r.uniform1f(l.uPixel,t),r.enable(r.DEPTH_TEST),r.depthFunc(r.LESS),r.disable(r.BLEND),r.clearColor(0,0,0,0),r.clearDepth(1),r.clear(r.COLOR_BUFFER_BIT|r.DEPTH_BUFFER_BIT),r.drawArraysInstanced(r.TRIANGLE_STRIP,0,2*(Math.ceil(b.columns/s)+1),Math.ceil(b.rows/s)),x){r.useProgram(D.program);let a=D.uniforms;B(2,I?I[z].texture:L),r.uniform1i(a.uSculpt,2),r.uniform1f(a.uSculptOn,+!!I),r.uniform1f(a.uFrequency,u/Y.scale),r.uniform2f(a.uMorph,Y.morph*.37,Y.morph*.23),r.uniform4fv(a.uPulses,H),r.uniform3fv(a.uEye,n.eye),r.uniform3fv(a.uForward,n.f),r.uniform3fv(a.uNear,ie),r.uniform2i(a.uOrigin,x.k0,x.m0),r.uniform2i(a.uCamCell,x.camX,x.camZ),r.uniform2f(a.uCamFrac,x.fracX,x.fracZ),r.uniform1f(a.uSpacing,x.cell),r.uniform1i(a.uColumns,x.columns+1),r.uniform1f(a.uHeight,re),r.uniformMatrix4fv(a.uViewProj,!1,_e),r.uniform2f(a.uView,i,o),r.uniform1f(a.uSize,4*t),r.uniform1f(a.uRefDepth,n.distance),r.uniform4f(a.uHeat,C,w,1.2*e.mouseRadius,ae),r.uniform1f(a.uTime,Y.clock),r.uniform4fv(a.uGlitch,U),r.uniform1f(a.uPixel,t),r.uniform3fv(a.uColor,g),r.uniform2f(a.uFade,d,c),r.uniform1f(a.uReveal,oe),r.uniform1f(a.uBrightness,e.brightness),r.uniform1f(a.uLightMode,+!!e.lightMode),r.uniform1f(a.uOpacity,e.opacity),r.uniform1f(a.uStyle,e.markers),r.depthFunc(r.LEQUAL),r.depthMask(!1),r.enable(r.BLEND),r.blendFunc(r.ONE,r.ONE_MINUS_SRC_ALPHA),r.drawArraysInstanced(r.TRIANGLE_STRIP,0,4,(x.columns+1)*(x.rows+1)),r.disable(r.BLEND),r.depthMask(!0)}r.disable(r.DEPTH_TEST)},O=e.glow>.001;if(O){let e=Math.max(1,Math.round(J.width/2)),t=Math.max(1,Math.round(J.height/2));he(P,e,t,!0),F.forEach((e,t)=>{let n=Math.max(1,Math.round(J.width/2**(t+2))),r=Math.max(1,Math.round(J.height/2**(t+2)));he(e[0],n,r,!1),he(e[1],n,r,!1)}),r.bindFramebuffer(r.FRAMEBUFFER,P.framebuffer),se(.5,e,t,2);let n=P;F.forEach(([e,t])=>{r.bindFramebuffer(r.FRAMEBUFFER,e.framebuffer),r.viewport(0,0,e.width,e.height),r.useProgram(_.program),B(0,n.texture),r.uniform1i(_.uniforms.uSource,0),r.uniform2f(_.uniforms.uTarget,e.width,e.height),r.uniform2f(_.uniforms.uTexel,1/n.width,1/n.height),r.drawArrays(r.TRIANGLES,0,3),r.useProgram(v.program),r.uniform1i(v.uniforms.uSource,0),r.uniform2f(v.uniforms.uTarget,t.width,t.height),r.bindFramebuffer(r.FRAMEBUFFER,t.framebuffer),B(0,e.texture),r.uniform2f(v.uniforms.uStep,1/e.width,0),r.drawArrays(r.TRIANGLES,0,3),r.bindFramebuffer(r.FRAMEBUFFER,e.framebuffer),B(0,t.texture),r.uniform2f(v.uniforms.uStep,0,1/t.height),r.drawArrays(r.TRIANGLES,0,3),n=e})}if(r.bindFramebuffer(r.FRAMEBUFFER,null),se(J.ratio,t.width,t.height,1),O){r.viewport(0,0,t.width,t.height),r.useProgram(y.program);let n=y.uniforms;F.forEach(([e],t)=>{B(t,e.texture),r.uniform1i(n[`uBloom${t}`],t)}),r.uniform2f(n.uView,t.width,t.height),r.uniform1f(n.uGlow,e.glow*oe),r.uniform1f(n.uLightMode,+!!e.lightMode),r.enable(r.BLEND),e.lightMode?r.blendFunc(r.ONE,r.ONE_MINUS_SRC_ALPHA):r.blendFunc(r.ONE,r.ONE),r.drawArrays(r.TRIANGLES,0,3),r.disable(r.BLEND)}for(let e=p;e>=0;e--)B(e,null)},Ie=(e,t)=>{if(!I||!g)return!1;let n=e.mouseInteraction&&e.hoverEffect===`lift`&&Y.presence>.001?Y.hit:null,i=Y.burst;if(!n&&!i&&Y.sculptLife<=0)return!1;let a=Y.brushFrom||n,o=I[z],s=I[1-z];r.bindFramebuffer(r.FRAMEBUFFER,s.framebuffer),r.viewport(0,0,m,m),r.useProgram(g.program);let c=g.uniforms;if(B(0,o.texture),r.uniform1i(c.uPrevious,0),n&&a?r.uniform4f(c.uSegment,a.x,a.z,n.x,n.z):r.uniform4f(c.uSegment,0,0,0,0),r.uniform4f(c.uBrush,1.1*e.mouseRadius,.9*e.mouseStrength,1-Math.exp(-t*7),n?Y.presence:0),i){let n=E(i.age/.7);i.age+=t;let a=(E(i.age/.7)-n)*.9*Math.max(e.mouseStrength,.3);r.uniform4f(c.uBurst,i.x,i.z,1.6*e.mouseRadius,a),i.age>=.7&&(Y.burst=null)}else r.uniform4f(c.uBurst,0,0,1,0);let l=.25+3*e.trail*e.trail;return r.uniform2f(c.uDecay,Math.exp(-t/l),Math.exp(-t/.7)),r.disable(r.BLEND),r.drawArrays(r.TRIANGLES,0,3),z=1-z,Y.brushFrom=n?{x:n.x,z:n.z}:null,n||i?Y.sculptLife=l*6:Y.sculptLife-=t,!0},Le=X.current.dpr,Re=()=>{let n=X.current;Le=n.dpr,J.width=Math.max(1,e.clientWidth),J.height=Math.max(1,e.clientHeight),J.ratio=Math.min(n.dpr||window.devicePixelRatio||1,2),t.width=Math.max(1,Math.round(J.width*J.ratio)),t.height=Math.max(1,Math.round(J.height*J.ratio)),Fe(),Q()},ze=e=>{if(Z=0,!we||document.hidden)return;let t=X.current;t.dpr!==Le&&Re();let n=Ce?T((e-Ce)/1e3,0,1/20):1/60;Ce=e,!t.intro||V?Y.intro=1:Y.intro<1&&(Y.intro=Math.min(1,Y.intro+n/d)),Y.rise=E(Y.intro);let r=V?1:1-Math.exp(-n/.4);Y.tilt+=(t.tilt-Y.tilt)*r,Y.elevation+=(t.elevation-Y.elevation)*r,Y.scale=t.scale,Y.clock+=n;let i=V?0:t.glitch;if(i>0){if(Y.clock>=W.next&&Y.clock>=W.until&&(W.until=Y.clock+.1+G()*.22*(.5+i),W.next=W.until+(9-7.4*i)*(.45+G()*1.1),W.roll=0),Y.clock<W.until){if(Y.clock>=W.roll){U.fill(0);let e=1+Math.floor(G()*3);for(let t=0;t<e;t++){let e=3+G()*G()*J.height*.14,n=G()*J.height,r=(G()-.5)*2*(10+46*i);U.set([n,n+e,r,1+G()*3*i],t*4)}W.seed=G(),W.roll=Y.clock+.04+G()*.05}}else U.fill(0)}else U.fill(0);V||(Y.travelX+=t.direction[0]*t.speed*.8*n,Y.travelZ+=t.direction[1]*t.speed*.8*n,Y.morph+=t.morph*.12*n);let a=q.inside&&t.mouseInteraction;Y.presence+=(+!!a-Y.presence)*(1-Math.exp(-n/(a?.18:.45)));let o=q.x/J.width*2-1,s=1-q.y/J.height*2,c=V||!a?0:t.parallax,l=o*c*.09,f=-s*c*.045;Y.yawVelocity+=(38*(l-Y.yaw)-11*Y.yawVelocity)*n,Y.pitchVelocity+=(38*(f-Y.pitch)-11*Y.pitchVelocity)*n,Y.yaw+=Y.yawVelocity*n,Y.pitch+=Y.pitchVelocity*n;let p=Ee();a?(Y.hit=Me(p,t,o,s),Y.hit&&Y.brushFrom&&Math.hypot(Y.hit.x-Y.brushFrom.x,Y.hit.z-Y.brushFrom.z)>3*t.mouseRadius&&(Y.brushFrom=null)):Y.presence<.002&&(Y.hit=null,Y.brushFrom=null);let m=Y.hit&&t.mouseInteraction&&t.hoverEffect===`trace`?Y.presence:0;if(Y.hit){let e=u/Y.scale,r=ce(Y.hit.x,Y.hit.z,e,Y.morph*.37,Y.morph*.23)+t.detail*.1*le(Y.hit.x,Y.hit.z,e);Y.level=Y.trace<.01?r:Y.level+(r-Y.level)*(1-Math.exp(-n/.09))}Y.trace+=(m-Y.trace)*(1-Math.exp(-n/.2));let h=Y.hit&&t.depthOfField>0?Y.hit.depth:p.distance;Y.focus+=(h-Y.focus)*(1-Math.exp(-n/.35));for(let e=K.length-1;e>=0;e--)K[e].age+=n,K[e].age>4&&K.splice(e,1);let ee=Ie(t,n);Fe();let te=Math.abs(t.tilt-Y.tilt)>.01||Math.abs(t.elevation-Y.elevation)>1e-4||Math.abs(Y.yaw-l)>1e-4||Math.abs(Y.pitch-f)>1e-4||Math.abs(Y.yawVelocity)>1e-4||Math.abs(Y.pitchVelocity)>1e-4||Math.abs(h-Y.focus)>.001||Math.abs(m-Y.trace)>.001;Te=!V&&(t.speed!==0||t.morph!==0||t.glitch>0||t.markers>=0)||Y.intro<1||K.length>0||ee||te||Y.presence>.001&&Y.presence<.999?0:Te+n,Te<.5&&(Z=requestAnimationFrame(ze))};function Q(){Te=0,!Z&&we&&!document.hidden&&(Ce=0,Z=requestAnimationFrame(ze))}let Be=t=>{let n=e.getBoundingClientRect(),r=t.clientX-n.left,i=t.clientY-n.top;return{x:r,y:i,inside:r>=0&&i>=0&&r<=n.width&&i<=n.height}},Ve=e=>{let{x:t,y:n,inside:r}=Be(e),i=q.inside;q.inside=r,r&&(q.x=t,q.y=n),(r||i)&&Q()},He=e=>{let t=X.current,{x:n,y:r,inside:i}=Be(e);if(!i||(q.x=n,q.y=r,q.inside=!0,Q(),t.glitch>0&&!V&&(W.until=Y.clock+.16,W.roll=0),!t.mouseInteraction||t.clickEffect!==`pulse`&&t.clickEffect!==`peak`))return;let a=Me(Ee(),t,n/J.width*2-1,1-r/J.height*2);a&&(t.clickEffect===`peak`&&I?Y.burst={x:a.x,z:a.z,age:0}:t.clickEffect===`pulse`&&(K.length>=f&&K.shift(),K.push({x:a.x,z:a.z,age:0})))},$=e=>{e.pointerType===`touch`&&(q.inside=!1,Q())},Ue=()=>{q.inside=!1,Q()},We=()=>Q(),Ge=new ResizeObserver(Re);Ge.observe(e);let Ke=new IntersectionObserver(e=>{we=e.some(e=>e.isIntersecting),we&&Q()});return Ke.observe(e),window.addEventListener(`pointermove`,Ve,{passive:!0}),window.addEventListener(`pointerdown`,He,{passive:!0}),window.addEventListener(`pointerup`,$,{passive:!0}),window.addEventListener(`pointercancel`,$,{passive:!0}),document.documentElement.addEventListener(`pointerleave`,Ue),document.addEventListener(`visibilitychange`,We),Re(),xe.current=Q,()=>{cancelAnimationFrame(Z),xe.current=null,Ge.disconnect(),Ke.disconnect(),window.removeEventListener(`pointermove`,Ve),window.removeEventListener(`pointerdown`,He),window.removeEventListener(`pointerup`,$),window.removeEventListener(`pointercancel`,$),document.documentElement.removeEventListener(`pointerleave`,Ue),document.removeEventListener(`visibilitychange`,We),t.removeEventListener(`webglcontextlost`,O),t.removeEventListener(`webglcontextrestored`,k),[P,...F.flat()].forEach(e=>{e.texture&&r.deleteTexture(e.texture),e.depth&&r.deleteRenderbuffer(e.depth),r.deleteFramebuffer(e.framebuffer)}),I?.forEach(e=>{r.deleteTexture(e.texture),r.deleteFramebuffer(e.framebuffer)}),r.deleteTexture(L),r.deleteVertexArray(A),R.texture&&r.deleteTexture(R.texture),R.heights&&r.deleteTexture(R.heights),r.deleteFramebuffer(R.framebuffer),[a,h,g,_,v,y,D].forEach(e=>e&&r.deleteProgram(e.program)),r.getExtension(`WEBGL_lose_context`)?.loseContext()}},[J]),(0,r.useEffect)(()=>{xe.current?.()}),(0,i.jsx)(`div`,{ref:ye,className:[`relative w-full h-full overflow-hidden`,K].filter(Boolean).join(` `),style:q,children:(0,i.jsx)(`canvas`,{ref:be,className:`block w-full h-full`,"aria-hidden":`true`})})};export{me as default};