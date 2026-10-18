import{i as e,t}from"./react-sySUN5R7.js";import{O as n}from"./sculpture-dark-Cfb-XN1r.js";import{a as r,i,n as a,o,r as s,t as c}from"./Triangle-CxvaD6kv.js";import{t as l}from"./RenderTarget-yTJj73BA.js";var u=e(t(),1),d=n(),f={plasma:{color:`#F25BD0`,strands:6,crackle:.85,flares:.65,glow:.9,sparks:.6,particleCount:15e3,fill:.5,motion:`rise`,particleShape:`square`,depth:.6,sway:.5,twinkle:.5,haze:.7,dustSpeed:1},aurora:{color:`#5CFFC8`,strands:5,crackle:.6,flares:.5,glow:.8,sparks:.45,particleCount:15e3,fill:.5,motion:`rise`,particleShape:`square`,depth:.6,sway:.5,twinkle:.5,haze:.7,dustSpeed:1},nebula:{color:`#9478FF`,strands:6,crackle:1,flares:.5,glow:.9,sparks:.6,particleCount:18e3,fill:.45,motion:`rise`,particleShape:`square`,depth:.5,sway:.4,twinkle:.6,haze:.8,dustSpeed:1.2},ember:{color:`#FF8A2A`,strands:5,crackle:.9,flares:.8,glow:1,sparks:.8,particleCount:12e3,fill:.35,motion:`rise`,particleShape:`round`,depth:.7,sway:.3,twinkle:.7,haze:.9,dustSpeed:1.6},frost:{color:`#BFE6FF`,strands:3,crackle:.3,flares:.3,glow:.6,sparks:.2,particleCount:16e3,fill:.6,motion:`fall`,particleShape:`round`,depth:.8,sway:.4,twinkle:.4,haze:.5,dustSpeed:.7},solar:{color:`#FFD36E`,strands:6,crackle:.7,flares:1,glow:1.1,sparks:.5,particleCount:15e3,fill:.55,motion:`orbit`,particleShape:`square`,depth:.6,sway:.7,twinkle:.5,haze:.8,dustSpeed:1},eclipse:{color:`#FFFFFF`,strands:4,crackle:.5,flares:.4,glow:.7,sparks:.35,particleCount:14e3,fill:.5,motion:`drift`,particleShape:`square`,depth:.7,sway:.5,twinkle:.5,haze:.5,dustSpeed:.8},abyss:{color:`#3F7BFF`,strands:5,crackle:.55,flares:.6,glow:.9,sparks:.4,particleCount:2e4,fill:.8,motion:`orbit`,particleShape:`round`,depth:.8,sway:.8,twinkle:.5,haze:.6,dustSpeed:.9}},ee={rise:0,fall:1,drift:2,orbit:3},te={square:0,round:1},ne=8,re=4,ie=4e4,p=256,ae=45e5,oe=2.2,se=7,m=[1,1,1],h=[0,0,0],g=(e,t,n)=>Math.min(Math.max(e,t),n),_=(e,t,n)=>{let r=g((n-e)/(t-e),0,1);return r*r*(3-2*r)},ce=e=>1-(1-e)**3,v=(e,t,n)=>e.map((e,r)=>e+(t[r]-e)*n),le=e=>e-Math.PI*2*Math.floor((e+Math.PI)/(Math.PI*2)),y=(e,t)=>{try{let n=document.createElement(`canvas`).getContext(`2d`);if(!n)return t;n.fillStyle=`#000000`,n.fillStyle=e;let r=n.fillStyle;if(r.startsWith(`#`)){let e=parseInt(r.slice(1),16);return[(e>>16&255)/255,(e>>8&255)/255,(e&255)/255]}let i=r.match(/[\d.]+/g);return!i||i.length<3?t:[Number(i[0])/255,Number(i[1])/255,Number(i[2])/255]}catch{return t}},b=e=>e<=.04045?e/12.92:((e+.055)/1.055)**2.4,x=e=>e<=.0031308?e*12.92:1.055*e**(1/2.4)-.055,S=e=>{let[t,n,r]=e.map(b),i=Math.cbrt(.4122214708*t+.5363325363*n+.0514459929*r),a=Math.cbrt(.2119034982*t+.6806995451*n+.1073969566*r),o=Math.cbrt(.0883024619*t+.2817188376*n+.6299787005*r);return[.2104542553*i+.793617785*a-.0040720468*o,1.9779984951*i-2.428592205*a+.4505937099*o,.0259040371*i+.7827717662*a-.808675766*o]},C=([e,t,n])=>{let r=(e+.3963377774*t+.2158037573*n)**3,i=(e-.1055613458*t-.0638541728*n)**3,a=(e-.0894841775*t-1.291485548*n)**3;return[4.0767416621*r-3.3077115913*i+.2309699292*a,-1.2684380046*r+2.6097574011*i-.3413193965*a,-.0041960863*r-.7034186147*i+1.707614701*a].map(e=>g(x(g(e,0,1)),0,1))},w=(e,t,n)=>C(v(S(e),S(t),n)),T=(e,t,n,r)=>{let[i,a,o]=S(e),s=Math.hypot(a,o)*r,c=Math.atan2(o,a)+t*Math.PI/180;return C([g(i+n,0,1),s*Math.cos(c),s*Math.sin(c)])},E=(e,t,n,r)=>{let[,i,a]=S(e),o=Math.max(Math.hypot(i,a)*r,.02),s=Math.atan2(a,i)+t*Math.PI/180;return C([g(n,0,1),o*Math.cos(s),o*Math.sin(s)])},ue=(e,t)=>{if(t){let t=E(e,0,Math.min(S(e)[0],.62),1.15);return{rim:t,rimHot:t,rimMid:t,rimDeep:E(e,0,.72,.8),spark:E(e,0,.6,1.2),sparkGlow:E(e,0,.78,.8),haze:E(e,0,.8,.6),edge:E(e,0,.72,.8),tones:[E(e,0,.56,1.1),E(e,16,.6,1.05),E(e,-16,.5,1.1),E(e,0,.66,.9),E(e,0,.74,.7)]}}return{rim:e,rimHot:v(e,m,.72),rimMid:v(e,h,.15),rimDeep:v(e,h,.45),spark:v(e,m,.45),sparkGlow:T(e,0,-.15,1),haze:v(e,h,.6),edge:T(e,0,-.3,.9),tones:[T(e,0,-.06,1),T(e,16,-.02,1),T(e,-16,-.12,1.05),T(w(e,m,.25),0,.04,1),w(e,m,.7)]}},D=e=>{let t=e>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}},de=()=>{let e=D(99),t=[[6,12,.6,1.6],[18,34,1.5,3.5],[40,70,3,7],[80,130,6,12]],n={harmonics:[],rates:[],phases:[],flareHarmonics:[],flareRates:[],flarePhases:[]};for(let r=0;r<ne;r++){t.forEach(([t,r,i,a])=>{n.harmonics.push(Math.round(t+e()*(r-t))),n.rates.push((i+e()*(a-i))*(e()<.5?-1:1)),n.phases.push(e()*Math.PI*2)});for(let t=0;t<3;t++)n.flareHarmonics.push(4+Math.floor(e()*6)),n.flareRates.push((.4+e()*.8)*(e()<.5?-1:1)),n.flarePhases.push(e()*Math.PI*2);let i=r===0;n.flareHarmonics.push(i?.75:.95+e()*.3),n.flareRates.push(i?1.15:.8+e()*.2),n.flarePhases.push(i?1:.7+e()*.25)}return n},fe=e=>{let t=D(1337),n=Math.max(1,Math.ceil(e/p)),r=new Float32Array(p*n*4),i=new Float32Array(p*n*4),a=0,o=0;for(;a<e&&o<e*80;){o++;let e,n,s;if(t()<.28){let r=t()*Math.PI*2,i=.87+Math.sqrt(t())*.105;if(e=Math.cos(r)*i,n=Math.sin(r)*i,t()>_(-.6,.3,-n))continue;let a=t();s=a<.5?3:a<.8?2:1}else{e=t()*2-1,n=t()*2-1;let r=Math.hypot(e,n);if(r>.975)continue;let i=_(-.25,.85,-n)**1.3,a=_(.66,.96,r)*_(-.7,.3,-n),o=Math.max(i,a*.9);if(t()>.012+.988*o)continue;if(o<.12)s=4;else{let e=t();s=e<.32?0:e<.52?1:e<.8?2:3}}let c=Math.sqrt(Math.max(0,.95-e*e-n*n));r[a*4]=e,r[a*4+1]=n,r[a*4+2]=(t()*2-1)*c,r[a*4+3]=s,i[a*4]=s===4?1.8:t()<.22?2.1:1.3,i[a*4+1]=t(),i[a*4+2]=2.5+t()*3.5,i[a*4+3]=.16+t()*.26,a++}return{home:r,seed:i,count:a,rows:n}},O=`#version 300 es
in vec2 position;
in vec2 uv;
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`,k=`
uint scramble(uint v) {
  v = v * 747796405u + 2891336453u;
  uint w = ((v >> ((v >> 28u) + 4u)) ^ v) * 277803737u;
  return (w >> 22u) ^ w;
}

float random(uint v) {
  return float(scramble(v)) * (1.0 / 4294967295.0);
}
`,A=`
uniform float uDustTime;
uniform vec2 uTurn;
uniform float uMotion;
uniform float uFill;

vec3 settle(vec3 p, out float spread) {
  float bend = exp2((0.5 - uFill) * 1.8);
  float h = clamp((p.y + 1.0) * 0.5, 0.0, 1.0);
  float y = 2.0 * pow(h, bend) - 1.0;
  float from = sqrt(max(1.0 - p.y * p.y, 1e-4));
  float to = sqrt(max(1.0 - y * y, 0.0));
  spread = clamp(bend * pow(max(h, 1e-3), bend - 1.0) * to / from, 0.25, 1.0);
  return vec3(p.xz * (to / from), y).xzy;
}

vec3 drift(vec4 home, vec4 seed, uint id, out float life, out float spread) {
  vec3 p = settle(home.xyz, spread);
  float t = uDustTime;
  float u = fract(t / seed.z + seed.y);
  life = sin(3.14159265 * u);
  float travel = seed.w;
  if (uMotion < 0.5) {
    p.y += travel * (u - 0.5);
  } else if (uMotion < 1.5) {
    p.y -= travel * (u - 0.5);
  } else if (uMotion < 2.5) {
    p += 0.045 * vec3(
      sin(t * 0.37 + seed.y * 17.0) + 0.5 * sin(t * 0.83 + seed.z * 5.0),
      sin(t * 0.29 + seed.z * 11.0) + 0.5 * sin(t * 0.61 + seed.w * 7.0),
      sin(t * 0.33 + seed.w * 23.0)
    );
  } else {
    float loop = t * (0.6 + 0.9 * random(id * 7u + 3u)) * (random(id * 7u + 10u) < 0.5 ? -1.0 : 1.0) + seed.y * 6.2831853;
    p.xy += (0.025 + 0.05 * random(id * 7u + 16u)) * vec2(cos(loop), sin(loop));
  }
  float wobble = 0.002 + 0.006 * random(id * 7u + 1u);
  float w1 = 0.8 + 2.4 * random(id * 7u + 2u);
  float w2 = 0.8 + 2.4 * random(id * 7u + 4u);
  p += wobble * vec3(sin(t * w1 + seed.y * 40.0), cos(t * w2 + seed.z * 30.0), sin(t * (w1 + w2) * 0.5 + seed.w * 20.0));
  float cy = cos(uTurn.x);
  float sy = sin(uTurn.x);
  p.xz = mat2(cy, -sy, sy, cy) * p.xz;
  float cx = cos(uTurn.y);
  float sx = sin(uTurn.y);
  p.yz = mat2(cx, -sx, sx, cx) * p.yz;
  return p;
}
`,pe=`#version 300 es
precision highp float;

uniform vec2 uCenter;
uniform float uRadius;
uniform float uDpr;
uniform float uLine;
uniform float uTime;
uniform float uFrame;
uniform float uBins;
uniform float uStrands;
uniform float uCrackle;
uniform float uFlares;
uniform float uGlow;
uniform float uHaze;
uniform float uFill;
uniform float uPresence;
uniform float uUnfold;
uniform float uBloom;
uniform float uInside;
uniform float uEncode;
uniform vec3 uRim;
uniform vec3 uRimHot;
uniform vec3 uRimMid;
uniform vec3 uRimDeep;
uniform vec3 uSpark;
uniform vec3 uSparkGlow;
uniform vec3 uHazeColor;
uniform vec3 uEdgeColor;
uniform vec4 uHeat;
uniform vec4 uHarmonics[8];
uniform vec4 uRates[8];
uniform vec4 uPhases[8];
uniform vec4 uFlareHarmonics[8];
uniform vec4 uFlareRates[8];
uniform vec4 uFlarePhases[8];
uniform vec4 uArcs[4];

out vec4 fragColor;
${k}
const float PI = 3.14159265;
const float TAU = 6.28318531;
const vec4 AMPS = vec4(0.35, 0.3, 0.22, 0.13);

float bell(float d, float w) {
  float x = d / w;
  return exp(-x * x);
}

float segment(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a;
  vec2 ba = b - a;
  float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-5), 0.0, 1.0);
  return length(pa - ba * h);
}

float pool(vec2 q) {
  float t = length(q - vec2(0.0, mix(-1.0, -0.66, uFill))) / mix(0.8, 1.35, uFill);
  return t < 0.6 ? mix(0.5, 0.22, t / 0.6) : mix(0.22, 0.0, clamp((t - 0.6) / 0.4, 0.0, 1.0));
}

void main() {
  vec2 p = gl_FragCoord.xy / uDpr - uCenter;
  float r = length(p);
  float R = uRadius;
  float theta = atan(p.y, p.x);
  float lift = p.y / max(r, 1e-3);
  float topDim = 1.0 - 0.35 * pow(max(lift, 0.0), 1.5);
  vec3 col = vec3(0.0);
  float hot = 0.0;
  uint frame = uint(uFrame);

  if (r < R) {
    vec2 q = p / R;
    float chord = sqrt(max(1.0 - dot(q, q), 0.0));
    float haze = pool(q) * (0.55 + 0.45 * chord);
    col += uHazeColor * haze * uHaze * uInside;
    float e = length(q - vec2(0.0, 0.2)) / 1.2;
    float edge = 0.5 * pow(smoothstep(0.62, 1.0, e), 1.4);
    col += uEdgeColor * edge * uInside * (0.5 + 0.5 * uHaze);
  }

  float dr = r - R;
  float halo = 1.0 - smoothstep(R * 0.05, R * 0.105, abs(dr - R * 0.0213));
  col += uRimDeep * 0.18 * halo * topDim * uGlow * uBloom;
  col += uRim * 0.12 * bell(dr + R * 0.0383, R * 0.032) * uGlow * uBloom;
  col += uRim * 0.32 * bell(dr, max(R * 0.0117, uLine)) * uPresence * uUnfold;

  float delta = mod(theta - uHeat.x + PI, TAU) - PI;
  float heat = uHeat.z * uHeat.y * exp(-delta * delta / 0.3);
  float crackle = uCrackle + heat * 0.9;
  float amp = R * 0.016 * (0.3 + 1.4 * crackle) * uUnfold;
  float jitterAmp = R * 0.0048 * (0.3 + 1.4 * uCrackle) * uUnfold * (1.0 + heat * 0.3);
  float flareAmp = R * 0.064 * (0.4 + 1.2 * crackle) * uFlares * 1.6 * uUnfold;

  if (abs(dr) < amp * 2.0 + flareAmp + R * 0.3) {
    float step = TAU / uBins;
    float binPos = (theta + PI) / step;
    float bin0 = floor(binPos);
    float binF = binPos - bin0;
    float th0 = bin0 * step - PI;
    float th1 = th0 + step;
    uint b0 = uint(mod(bin0, uBins));
    uint b1 = uint(mod(bin0 + 1.0, uBins));
    float gain = min(1.0, 2.4 / max(uStrands, 1.0));
    for (int k = 0; k < 8; k++) {
      if (float(k) >= uStrands) break;
      vec4 m = uHarmonics[k];
      vec4 lead = uRates[k] * uTime + uPhases[k];
      float wave0 = dot(AMPS, sin(m * th0 + lead));
      float wave1 = dot(AMPS, sin(m * th1 + lead));
      uint salt = uint(k) * 1013u + frame * 7919u;
      vec4 shape = uFlareHarmonics[k];
      vec4 look = uFlareRates[k];
      vec4 tone = uFlarePhases[k];
      float a = amp * shape.w;
      float off0 = a * wave0 + jitterAmp * (random(b0 + salt) - 0.5);
      float off1 = a * wave1 + jitterAmp * (random(b1 + salt) - 0.5);
      float rc = R + mix(off0, off1, binF);
      float grade = (off1 - off0) / (step * max(r, 1.0));
      float d = abs(r - rc) * inversesqrt(1.0 + grade * grade);
      float swell = 0.8 + 0.4 * (0.5 + 0.5 * sin(3.0 * theta + uTime * 0.7 + tone.x * 1.7));
      float width = uLine * look.w * swell * (1.0 + heat * 0.25);
      float core = exp(-d * d / (width * width));
      float sheath = exp(-d * d / (width * width * 3.0));
      float bright = tone.w * (1.0 + heat * 0.45) * uPresence;
      col += (uRimHot * core * 0.8 + uRim * sheath * 0.32) * bright;
      hot += core * bright;
      vec3 fargs = shape.xyz * theta + look.xyz * uTime + tone.xyz;
      float flare = max(0.0, (sin(fargs.x) + sin(fargs.y) + sin(fargs.z)) / 3.0);
      flare = (flare * flare + heat * 0.35) * flareAmp;
      float dw = abs(r - rc - flare);
      float dm = abs(r - rc - flare * 0.6);
      float dn = abs(r - rc - flare * 0.25);
      vec3 glow = uRimDeep * (0.07 * bell(dw, R * 0.09) + 0.16 * bell(dw, R * 0.05));
      glow += uRimMid * 0.28 * bell(dm, R * 0.027) + uRim * 0.38 * bell(dn, R * 0.013);
      col += glow * gain * topDim * uGlow * uBloom * (1.0 + heat * 1.4);
    }
  }

  for (int i = 0; i < 4; i++) {
    vec4 arc = uArcs[i];
    if (arc.w <= 0.002) continue;
    float mid = arc.x + arc.y * 0.5;
    vec2 center = R * 0.93 * vec2(cos(mid), sin(mid));
    if (distance(p, center) > R * (abs(arc.y) * 0.6 + 0.1) + 12.0) continue;
    float ar = R * 0.955;
    vec2 a0 = ar * vec2(cos(arc.x), sin(arc.x));
    vec2 a2 = ar * vec2(cos(arc.x + arc.y), sin(arc.x + arc.y));
    vec2 a1 = R * (0.955 - arc.z) * vec2(cos(mid), sin(mid));
    float dmin = 1e5;
    float along = 0.0;
    vec2 prev = a0;
    for (int s = 1; s <= 10; s++) {
      float u = float(s) / 10.0;
      vec2 b = mix(mix(a0, a1, u), mix(a1, a2, u), u);
      vec2 pa = p - prev;
      vec2 ba = b - prev;
      float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-5), 0.0, 1.0);
      float dist = length(pa - ba * h);
      if (dist < dmin) {
        dmin = dist;
        along = (float(s) - 1.0 + h) / 10.0;
      }
      prev = b;
    }
    float taper = sqrt(max(sin(PI * along), 0.0));
    float arcWidth = uLine * (0.55 + 0.6 * taper);
    float arcCore = exp(-dmin * dmin / (arcWidth * arcWidth));
    float arcGlow = exp(-dmin * dmin / (arcWidth * arcWidth * 12.0));
    col += (uSpark * 0.95 * arcCore + uSparkGlow * 0.4 * arcGlow) * arc.w * taper;
    hot += arcCore * arc.w * taper * 0.6;
  }

  fragColor = vec4(col, hot) * uEncode;
}
`,j=`#version 300 es
precision highp float;

in float aIndex;

uniform sampler2D tHome;
uniform sampler2D tSeed;
uniform sampler2D tOffset;
uniform float uStirred;
uniform vec2 uCenter;
uniform vec2 uViewport;
uniform float uRadius;
uniform float uDpr;
uniform float uDepth;
uniform float uTwinkle;
uniform float uPointScale;
uniform float uReveal;
uniform float uEncode;
uniform vec3 uTones[5];
uniform vec3 uRimTone;

out vec3 vColor;
out float vSize;
${k}
${A}
void main() {
  ivec2 cell = ivec2(int(mod(aIndex, ${p}.0)), int(floor(aIndex / ${p}.0)));
  uint id = uint(aIndex);
  vec4 home = texelFetch(tHome, cell, 0);
  vec4 seed = texelFetch(tSeed, cell, 0);
  float life;
  float spread;
  vec3 p = drift(home, seed, id, life, spread);
  if (uStirred > 0.5) p += texelFetch(tOffset, cell, 0).xyz;
  float len = length(p);
  float inside = 1.0 - smoothstep(0.955, 0.985, length(p.xy));
  if (len > 0.975) p *= 0.975 / len;

  float front = p.z * 0.5 + 0.5;
  float depthSize = mix(1.0, 0.7 + 0.6 * front, uDepth);
  float depthLight = mix(1.0, 0.35 + 0.8 * front, uDepth);
  float blink = sin(uDustTime * (2.0 + 6.0 * random(id * 7u + 5u)) + random(id * 7u + 6u) * 6.2831853);
  float twinkle = mix(1.0, smoothstep(-0.9, -0.6, blink), uTwinkle);
  float fade = smoothstep(0.04, 0.12, life);
  float order = (home.y + 1.0) * 0.5 * 0.55 + random(id * 7u + 8u) * 0.25;
  float reveal = smoothstep(order, order + 0.2, uReveal * 1.0);
  float alpha = random(id * 7u + 9u) < 0.5 || home.w > 3.5 ? 1.0 : 0.6;

  float size = seed.x * uPointScale * (0.35 + 0.95 * life) * depthSize * mix(0.5, 1.0, reveal);
  vec2 screen = uCenter + p.xy * uRadius;
  gl_Position = vec4(screen / uViewport * 2.0 - 1.0, 0.0, 1.0);
  float px = size * uDpr;
  gl_PointSize = px + 2.0;
  vSize = px;

  int tone = int(home.w + 0.5);
  float rimLit = smoothstep(0.8, 0.97, length(p.xy));
  vec3 color = uTones[tone] + uRimTone * rimLit * rimLit * 0.12;
  vColor = color * alpha * fade * twinkle * depthLight * reveal * inside * sqrt(spread) * uEncode;
}
`,me=`#version 300 es
precision highp float;

uniform float uShape;

in vec3 vColor;
in float vSize;

out vec4 fragColor;

void main() {
  vec2 q = (gl_PointCoord - 0.5) * (vSize + 2.0);
  float half_ = max(vSize * 0.5, 0.5);
  float cover;
  if (uShape < 0.5) {
    vec2 c = clamp(half_ - abs(q) + 0.5, 0.0, 1.0);
    cover = c.x * c.y;
  } else {
    cover = clamp(half_ - length(q) + 0.5, 0.0, 1.0);
  }
  if (cover <= 0.0) discard;
  fragColor = vec4(vColor * cover, 0.0);
}
`,he=`#version 300 es
precision highp float;

uniform sampler2D tHome;
uniform sampler2D tSeed;
uniform sampler2D tOffset;
uniform sampler2D tVelocity;
uniform float uDt;
uniform float uReset;
uniform vec4 uBrush;
uniform float uBrushPower;
uniform vec4 uKick;

layout(location = 0) out vec4 outOffset;
layout(location = 1) out vec4 outVelocity;
${k}
${A}
vec3 swirl(vec3 p) {
  float t = uDustTime * 0.15;
  vec3 a = vec3(1.7, 1.9, 1.5) * p.yzx + vec3(t, 1.2, 2.1);
  vec3 b = vec3(2.3, 2.1, 2.7) * p.zxy + vec3(0.4, t * 1.3, 0.9);
  vec3 ca = cos(a) * vec3(1.7, 1.9, 1.5);
  vec3 cb = cos(b) * vec3(2.3, 2.1, 2.7);
  return vec3(ca.z - cb.x, cb.y - ca.x, ca.y - cb.z);
}

void main() {
  ivec2 cell = ivec2(gl_FragCoord.xy);
  if (uReset > 0.5) {
    outOffset = vec4(0.0);
    outVelocity = vec4(0.0);
    return;
  }
  uint id = uint(cell.y * ${p} + cell.x);
  vec4 home = texelFetch(tHome, cell, 0);
  vec4 seed = texelFetch(tSeed, cell, 0);
  vec3 o = texelFetch(tOffset, cell, 0).xyz;
  vec3 v = texelFetch(tVelocity, cell, 0).xyz;
  float life;
  float spread;
  vec3 base = drift(home, seed, id, life, spread);
  vec3 p = base + o;

  float k = mix(0.8, 2.2, random(id * 7u + 11u));
  vec3 acc = -k * o - 1.5 * sqrt(k) * v;

  vec2 gap = p.xy - uBrush.xy;
  float touch = exp(-dot(gap, gap) / 0.07) * uBrushPower;
  acc += (vec3(uBrush.zw, 0.0) - v) * touch * 14.0;
  float pace = length(v);
  if (pace > 1e-4) {
    vec3 heading = v / pace;
    vec3 curl = swirl(p * 1.6);
    acc += (curl - heading * dot(curl, heading)) * min(pace, 2.0) * 1.8;
  }

  if (uKick.z > 0.0) {
    vec3 jolt = vec3(random(id * 7u + 12u), random(id * 7u + 13u), random(id * 7u + 14u)) - 0.5;
    float near = exp(-dot(p.xy - uKick.xy, p.xy - uKick.xy) / 0.4);
    vec3 spinKick = vec3(-p.z, 0.0, p.x) * 0.9;
    vec3 lift = vec3(0.0, 0.5 + 0.8 * random(id * 7u + 15u), 0.0) * (0.3 + 0.7 * smoothstep(0.2, -0.8, p.y));
    v += (jolt * 0.8 + spinKick + lift) * uKick.z * (0.4 + 0.45 * near);
  }

  v += acc * uDt;
  o += v * uDt;
  vec3 q = base + o;
  float len = length(q);
  if (len > 0.97) {
    vec3 n = q / len;
    o -= n * (len - 0.97);
    v -= n * max(dot(v, n), 0.0) * 1.5;
  }
  outOffset = vec4(o, 1.0);
  outVelocity = vec4(v, 1.0);
}
`,M=`#version 300 es
precision highp float;

uniform sampler2D tScene;
uniform float uLight;
uniform float uDecode;

in vec2 vUv;
out vec4 fragColor;

vec3 soften(vec3 x) {
  vec3 over = max(x - 0.6, 0.0);
  return min(x, 0.6) + 0.4 * (1.0 - exp(-over / 0.4));
}

void main() {
  vec4 scene = texture(tScene, vUv) * uDecode;
  vec3 light = max(scene.rgb, 0.0);
  float peak = max(light.r, max(light.g, light.b));
  if (uLight > 0.5) {
    vec3 hue = light / max(peak, 1e-4);
    float cover = 1.0 - exp(-peak * 2.4);
    vec3 ink = hue * mix(0.92, 0.72, cover);
    float core = clamp(scene.a * 0.7, 0.0, 1.0) * cover;
    vec3 tint = mix(vec3(1.0), hue, 0.22);
    fragColor = vec4(tint * core + ink * cover * (1.0 - core), core + cover * (1.0 - core));
    return;
  }
  light += vec3(max(peak - 1.8, 0.0) * 0.25);
  vec3 shown = soften(light);
  fragColor = vec4(shown, max(shown.r, max(shown.g, shown.b)));
}
`,N=({preset:e=`plasma`,color:t,theme:n=`dark`,size:m=.7,strands:h,crackle:v,flares:b,glow:x,sparks:S,particleCount:C,fill:w,motion:T,particleShape:E,depth:k,sway:A,twinkle:N,haze:P,speed:ge=1,dustSpeed:F,interactive:_e=!0,hoverStrength:ve=.7,intro:I=!0,paused:ye=!1,className:be=``,style:xe})=>{let Se=(0,u.useRef)(null),Ce=(0,u.useRef)(null),we=(0,u.useRef)(null),L=f[e]||f.plasma,R=(e,t)=>e??L[t],z=R(t,`color`),B=(0,u.useMemo)(()=>{let e=n===`light`;return{light:e,palette:ue(y(z,[.95,.36,.82]),e)}},[z,n]);return(0,u.useEffect)(()=>{Ce.current={...B,size:m,strands:R(h,`strands`),crackle:R(v,`crackle`),flares:R(b,`flares`),glow:R(x,`glow`),sparks:R(S,`sparks`),particleCount:R(C,`particleCount`),fill:R(w,`fill`),motion:R(T,`motion`),particleShape:R(E,`particleShape`),depth:R(k,`depth`),sway:R(A,`sway`),twinkle:R(N,`twinkle`),haze:R(P,`haze`),dustSpeed:R(F,`dustSpeed`),speed:ge,interactive:_e,hoverStrength:ve,intro:I,paused:ye},we.current?.()}),(0,u.useEffect)(()=>{let e=Se.current;if(!e)return;let t=new i({alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1}),n=t.gl,u=n;if(!t.isWebgl2){n.getExtension(`WEBGL_lose_context`)?.loseContext();return}let d=n.canvas;d.style.display=`block`,d.style.width=`100%`,d.style.height=`100%`,d.setAttribute(`aria-hidden`,`true`),e.appendChild(d);let f=!!n.getExtension(`EXT_color_buffer_float`),m=f||!!n.getExtension(`EXT_color_buffer_half_float`),h=m?1:.25,v=new c(n),y=new a(n),b=de(),x=new l(n,{width:1,height:1,depth:!1,type:m?u.HALF_FLOAT:n.UNSIGNED_BYTE,format:n.RGBA,internalFormat:m?u.RGBA16F:n.RGBA,minFilter:n.NEAREST,magFilter:n.NEAREST}),S=Array(16).fill(0),C={uCenter:{value:[0,0]},uRadius:{value:1},uDpr:{value:1},uLine:{value:.6},uTime:{value:0},uFrame:{value:0},uBins:{value:420},uStrands:{value:5},uCrackle:{value:.6},uFlares:{value:.5},uGlow:{value:.8},uHaze:{value:.7},uFill:{value:.5},uPresence:{value:0},uUnfold:{value:0},uBloom:{value:0},uInside:{value:0},uEncode:{value:h},uRim:{value:[1,1,1]},uRimHot:{value:[1,1,1]},uRimMid:{value:[1,1,1]},uRimDeep:{value:[1,1,1]},uSpark:{value:[1,1,1]},uSparkGlow:{value:[1,1,1]},uHazeColor:{value:[0,0,0]},uEdgeColor:{value:[0,0,0]},uHeat:{value:[0,0,0,0]},uHarmonics:{value:b.harmonics},uRates:{value:b.rates},uPhases:{value:b.phases},uFlareHarmonics:{value:b.flareHarmonics},uFlareRates:{value:b.flareRates},uFlarePhases:{value:b.flarePhases},uArcs:{value:S}},w={uDustTime:{value:0},uTurn:{value:[0,0]},uMotion:{value:0},uFill:C.uFill,tHome:{value:y},tSeed:{value:y}},T={...w,tOffset:{value:y},uStirred:{value:0},uCenter:C.uCenter,uViewport:{value:[1,1]},uRadius:C.uRadius,uDpr:C.uDpr,uDepth:{value:.6},uTwinkle:{value:.5},uPointScale:{value:1},uReveal:{value:0},uEncode:{value:h},uTones:{value:Array(15).fill(1)},uRimTone:{value:[1,1,1]},uShape:{value:0}},E={...w,tOffset:{value:y},tVelocity:{value:y},uDt:{value:.016},uReset:{value:1},uBrush:{value:[0,0,0,0]},uBrushPower:{value:0},uKick:{value:[0,0,0,0]}},ue={tScene:{value:x.texture},uLight:{value:0},uDecode:{value:1/h}},k=e=>(e.setBlendFunc(n.ONE,n.ONE),e),A=new s(n,{geometry:v,program:k(new r(n,{vertex:O,fragment:pe,uniforms:C,transparent:!0,depthTest:!1,depthWrite:!1}))}),N=k(new r(n,{vertex:j,fragment:me,uniforms:T,transparent:!0,depthTest:!1,depthWrite:!1})),P=m?new s(n,{geometry:v,program:new r(n,{vertex:O,fragment:he,uniforms:E,depthTest:!1,depthWrite:!1})}):null,ge=new s(n,{geometry:v,program:new r(n,{vertex:O,fragment:M,uniforms:ue,depthTest:!1,depthWrite:!1})}),F=e=>{e&&(n.deleteFramebuffer(e.buffer),e.textures.forEach(e=>n.deleteTexture(e.texture)))},_e=e=>new l(n,{width:p,height:e,color:2,depth:!1,type:f?n.FLOAT:u.HALF_FLOAT,format:n.RGBA,internalFormat:f?u.RGBA32F:u.RGBA16F,minFilter:n.NEAREST,magFilter:n.NEAREST}),ve=(e,t)=>new a(n,{image:e,width:p,height:t,type:n.FLOAT,format:n.RGBA,internalFormat:u.RGBA32F,minFilter:n.NEAREST,magFilter:n.NEAREST,generateMipmaps:!1,flipY:!1}),I=null,ye=()=>{I&&(I.mesh.geometry.remove(),n.deleteTexture(I.home.texture),n.deleteTexture(I.seed.texture),F(I.read),F(I.write),I=null)},be=()=>{P&&I&&I.read&&I.write&&(E.tOffset.value=y,E.tVelocity.value=y,E.uReset.value=1,t.render({scene:P,target:I.read,clear:!1}),t.render({scene:P,target:I.write,clear:!1}),E.uReset.value=0)},xe=e=>{let t=g(Math.round(e/100)*100,0,ie);if(I&&I.requested===t)return;if(ye(),!t){I=null;return}let r=fe(t),i=new Float32Array(r.count);for(let e=0;e<r.count;e++)i[e]=e;let a=new o(n,{aIndex:{size:1,data:i}});I={requested:t,rows:r.rows,home:ve(r.home,r.rows),seed:ve(r.seed,r.rows),mesh:new s(n,{mode:n.POINTS,geometry:a,program:N}),read:P?_e(r.rows):null,write:P?_e(r.rows):null},w.tHome.value=I.home,w.tSeed.value=I.seed,be(),G=0},L=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches??!1,R=D(913),z=1,B=1,V=0,Te=performance.now(),Ee=0,De=0,Oe=0,H=0,U=!0,ke=!0,W=0,G=0,Ae=0,K=null,je=.3,q=[],J={x:0,y:0,inside:!1,fresh:!0},Y={angle:0,velocity:0,power:0,near:0},X={x:0,y:0,vx:0,vy:0},Z={x:0,y:0,vx:0,vy:0},Me=()=>{z=Math.max(1,e.clientWidth),B=Math.max(1,e.clientHeight),t.dpr=Math.min(window.devicePixelRatio||1,2,Math.sqrt(ae/(z*B))),t.setSize(z,B),x.setSize(n.canvas.width,n.canvas.height),Q()},Ne=(e,t)=>{q.length>=re||q.push({start:e,span:(.05+R()*.07)*(R()<.5?-1:1),curl:.02+R()*.04,life:0,duration:.2+R()*.2,drift:(R()-.5)*.3,strength:t})},Pe=e=>{if(V=0,!ke)return;let r=Ce.current,i=Math.min(.05,Math.max(1/240,(e-Te)/1e3));if(Te=e,!r)return;let a=!r.paused&&!L;H=r.intro&&!L?Math.min(1,H+i/oe):1;let o=ce(_(0,.42,H)),s=ce(_(0,.32,H)),c=Math.sin(Math.PI*_(.22,.78,H))*.35,l=Math.max(8,g(r.size,.1,1.5)*Math.min(z,B)/2),u=r.interactive&&!L?g(r.hoverStrength,0,1):0,d=J.x-z/2,f=B/2-J.y,ie=Math.hypot(d,f),p=J.inside?u:0;Y.power<.02&&(Y.angle=Math.atan2(f,d),Y.velocity=0);let ae=le(Math.atan2(f,d)-Y.angle);Y.velocity+=(120*ae-19*Y.velocity)*i,Y.angle=le(Y.angle+Y.velocity*i),Y.power+=(p-Y.power)*(1-Math.exp(-i/(p>Y.power?.3:.55)));let m=Math.exp(-(((ie-l)/(l*.45))**2));Y.near+=(m-Y.near)*(1-Math.exp(-i/.15)),W*=Math.exp(-i/.7);let h=d/l,v=f/l;Math.hypot(h-X.x,v-X.y)>.6&&(J.fresh=!0),J.fresh&&(X.x=h,X.y=v,X.vx=0,X.vy=0,J.fresh=!1);let b=1-Math.exp(-i/.05);X.vx+=((h-X.x)/i-X.vx)*b,X.vy+=((v-X.y)/i-X.vy)*b,X.x=h,X.y=v;let D=Math.hypot(X.vx,X.vy),de=D>4?4/D:1,fe=Math.exp(-Math.max(0,Math.hypot(h,v)-1)*6),O=J.inside?u*fe*o:0;if(Ae=Ae*Math.exp(-i/1.2)+O*Math.min(D,4)*i,a){let e=1+W*.6+Y.power*Y.near*.3,t=i*Math.max(0,r.speed)*2*e;Ee+=t,De+=i*Math.max(0,r.dustSpeed)*(1+W*.4),Oe+=i*Math.max(0,r.dustSpeed);let n=g(r.crackle+W*.5,0,1.5);if(r.sparks>.01&&H>.55&&(je-=t*r.sparks*2*(.6+n*.6),je<=0)){let e=Y.power*Y.near,t=R()<e*.7?Y.angle+(R()-.5)*.8:R()<.7?Math.PI/2+(R()-.5)*1.5:R()*Math.PI*2;Ne(t,.8+e*.6+W*.4),je=.15+R()*.6}for(let e=q.length-1;e>=0;e--){let n=q[e];n.life+=t,n.start+=n.drift*t,n.life>=n.duration&&q.splice(e,1)}}else q.length=0;for(let e=0;e<re;e++){let t=q[e];S[e*4]=t?t.start:0,S[e*4+1]=t?t.span:0,S[e*4+2]=t?t.curl:0,S[e*4+3]=t?Math.sin(Math.PI*t.life/t.duration)*t.strength:0}xe(r.particleCount);let k=r.palette;C.uCenter.value=[z/2,B/2],C.uRadius.value=l,C.uDpr.value=t.dpr,C.uLine.value=Math.max(.6,l*.0035),C.uTime.value=Ee,C.uFrame.value=Math.floor(Ee*24)%1e5,C.uBins.value=g(Math.round(Math.PI*2*l/2.6),240,900),C.uStrands.value=Math.round(g(r.strands,1,ne)),C.uCrackle.value=g(r.crackle,0,1)+W*.5+c,C.uFlares.value=g(r.flares,0,1),C.uGlow.value=g(r.glow,0,2)*(1+W*.5+c)*(r.light?.35:1),C.uHaze.value=g(r.haze,0,2)*(r.light?.6:1),C.uFill.value=g(r.fill,0,1),C.uPresence.value=o,C.uUnfold.value=s,C.uBloom.value=o*o,C.uInside.value=_(.2,.95,H),C.uRim.value=k.rim,C.uRimHot.value=k.rimHot,C.uRimMid.value=k.rimMid,C.uRimDeep.value=k.rimDeep,C.uSpark.value=k.spark,C.uSparkGlow.value=k.sparkGlow,C.uHazeColor.value=k.haze,C.uEdgeColor.value=k.edge,C.uHeat.value=[Y.angle,Y.near,Y.power*o,0],w.uDustTime.value=De;let pe=J.inside?u*o:0,j=g(h,-1.6,1.6)*pe,me=g(v,-1.6,1.6)*pe;Z.vx+=(40*(j-Z.x)-11*Z.vx)*i,Z.vy+=(40*(me-Z.y)-11*Z.vy)*i,Z.x+=Z.vx*i,Z.y+=Z.vy*i;let he=g(r.sway,0,1);w.uTurn.value=[he*.42*Math.sin(Oe*.23)+Z.x*.3,he*.12*Math.sin(Oe*.17+1.3)-Z.y*.16],w.uMotion.value=ee[r.motion]??0,T.uViewport.value=[z,B],T.uDepth.value=g(r.depth,0,1),T.uTwinkle.value=g(r.twinkle,0,1),T.uPointScale.value=Math.max(1,l/491),T.uReveal.value=_(.18,1,H),T.uTones.value=k.tones.flat(),T.uRimTone.value=k.rim,T.uShape.value=te[r.particleShape]??0;let M=I;M&&P&&(Ae>.002||K)&&(G=se);let N=!1;if(M&&M.read&&M.write&&P&&G>0){E.uDt.value=Math.min(i,1/30),E.uBrush.value=[X.x,X.y,X.vx*de,X.vy*de],E.uBrushPower.value=O,E.uKick.value=K?[K.x,K.y,K.strength,0]:[0,0,0,0],E.tOffset.value=M.read.textures[0],E.tVelocity.value=M.read.textures[1],t.render({scene:P,target:M.write,clear:!1});let e=M.read;M.read=M.write,M.write=e,G-=i,N=G>0,N||(G=0,be())}K=null,T.uStirred.value=+!!N,T.tOffset.value=M&&M.read?M.read.textures[0]:y,n.clearColor(0,0,0,0),t.render({scene:A,target:x,clear:!0}),I&&t.render({scene:I.mesh,target:x,clear:!1}),ue.uLight.value=+!!r.light,t.render({scene:ge,clear:!1});let F=Math.abs(p-Y.power)>.002||W>.002||G>0||Math.abs(Y.velocity)>.01||Math.hypot(Z.vx,Z.vy,Z.x-j,Z.y-me)>.001;U&&(a||H<1||F)&&(V=requestAnimationFrame(Pe))},Q=()=>{!V&&U&&ke&&(Te=performance.now(),V=requestAnimationFrame(Pe))},Fe=t=>{let n=e.getBoundingClientRect(),r=t.clientX-n.left,i=t.clientY-n.top;return{x:r,y:i,inside:r>=0&&i>=0&&r<=n.width&&i<=n.height}},Ie=e=>{let t=Fe(e);t.inside&&!J.inside&&(J.fresh=!0),J.x=t.x,J.y=t.y,J.inside=t.inside,t.inside&&Q()},Le=e=>{let t=Ce.current,n=Fe(e);if(!t||!t.interactive||L||!n.inside)return;J.inside||(J.fresh=!0),J.x=n.x,J.y=n.y,J.inside=!0;let r=Math.max(8,g(t.size,.1,1.5)*Math.min(z,B)/2),i=(n.x-z/2)/r,a=(B/2-n.y)/r;if(Math.hypot(i,a)>1.3)return;let o=g(t.hoverStrength,0,1);K={x:i,y:a,strength:o*1.2},W=Math.max(W,o);let s=Math.atan2(a,i);Ne(s+(R()-.5)*.5,1.3),Ne(s+Math.PI+(R()-.5)*1.2,1.1),Q()},$=()=>{J.inside=!1,Q()},Re=e=>{e.relatedTarget||$()},ze=e=>{e.pointerType===`touch`&&$()},Be=()=>{document.hidden||Q()};window.addEventListener(`pointermove`,Ie,{passive:!0}),window.addEventListener(`pointerdown`,Le,{passive:!0}),window.addEventListener(`pointerout`,Re,{passive:!0}),window.addEventListener(`pointerup`,ze,{passive:!0}),window.addEventListener(`blur`,$),document.addEventListener(`visibilitychange`,Be);let Ve=new ResizeObserver(Me);Ve.observe(e);let He=new IntersectionObserver(([e])=>{U=e.isIntersecting,Q()});return He.observe(e),we.current=Q,Me(),()=>{ke=!1,U=!1,cancelAnimationFrame(V),Ve.disconnect(),He.disconnect(),window.removeEventListener(`pointermove`,Ie),window.removeEventListener(`pointerdown`,Le),window.removeEventListener(`pointerout`,Re),window.removeEventListener(`pointerup`,ze),window.removeEventListener(`blur`,$),document.removeEventListener(`visibilitychange`,Be),we.current=null,ye(),F(x),n.getExtension(`WEBGL_lose_context`)?.loseContext(),d.parentNode&&d.parentNode.removeChild(d)}},[]),(0,d.jsx)(`div`,{ref:Se,className:`relative w-full h-full overflow-hidden ${be}`.trim(),style:xe})};export{N as default};