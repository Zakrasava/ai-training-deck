import{i as e,t}from"./react-sySUN5R7.js";import{O as n}from"./sculpture-dark-Cfb-XN1r.js";var r=e(t(),1),i=n(),a=`#version 300 es
in vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`,o=`#version 300 es
precision highp float;
out vec4 outColor;
uniform vec2 uResolution;
uniform float uDpr;
uniform float uScale;
uniform float uTime;
uniform float uBeamX;
uniform vec4 uSurface;
uniform float uRadius;
uniform vec3 uIntro;
uniform vec4 uPour;
uniform vec2 uRun;
uniform vec4 uLens;
uniform sampler2D uReveal;
uniform vec4 uRevealMap;
uniform vec2 uRevealInfo;
uniform float uAtmosphere;
uniform vec4 uAmount;
uniform vec4 uShape;
uniform vec4 uExtra;
uniform float uTheme;
uniform vec3 uTint[16];

#define BEAM uTint[0]
#define LEFT uTint[1]
#define RIGHT uTint[2]
#define CYAN uTint[3]
#define PINK uTint[4]
#define LILAC uTint[5]
#define SKY uTint[6]
#define PURPLE uTint[7]
#define DEEP uTint[8]
#define MIST uTint[9]
#define NAVY uTint[10]
#define WARM uTint[11]
#define EMBER uTint[12]
#define WHITE uTint[13]
#define HAZE uTint[14]
#define LAVENDER uTint[15]

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = m * p;
    a *= 0.5;
  }
  return v;
}

float sq(float x) {
  return x * x;
}

float roundBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

vec3 spill(float e, float fall, float strength, float front, float t, out vec3 glow) {
  glow = vec3(0.0);
  if (strength < 0.0005) return vec3(0.0);
  float f = max(fall, 0.0);
  float d = max(e, 0.0);
  float u = d / (6.0 + 0.28 * f);
  float start = smoothstep(-6.0, 12.0, fall);
  float fade = exp(-sq(max(f - 125.0, 0.0) / 40.0));
  float streak = 0.88 + 0.24 * noise(vec2(u * 6.0, f / 22.0 - t * 1.7));
  float bright = pow(strength, 1.5);
  float soft = sqrt(strength);
  float warmth = smoothstep(90.0, 130.0, f);
  vec3 coreK = mix(WHITE, WARM, warmth * exp(-d / 9.0));
  float core = mix(9.0, 2.6, warmth) * exp(-sq(d / (3.5 + 0.04 * f))) * exp(-sq(max(f - 130.0, 0.0) / 38.0));
  float wall = 24.0 * exp(-sq(d / 1.1)) * exp(-sq(max(f - 100.0, 0.0) / 30.0));
  float bandCenter = 0.7 - 0.3 * smoothstep(30.0, 110.0, f);
  float offset = u - bandCenter;
  float decay = (1.05 - bandCenter) / 1.31;
  float profile = offset < 0.0 ? exp(-sq(offset / 0.3)) : exp(-offset / decay);
  profile *= 1.0 - smoothstep(1.0, 1.4, u);
  vec3 bandA = mix(CYAN, PINK, smoothstep(50.0, 75.0, f));
  bandA = mix(bandA, LILAC, smoothstep(100.0, 125.0, f));
  vec3 bandB = mix(SKY, PURPLE, smoothstep(50.0, 75.0, f));
  vec3 fanK = mix(bandA, bandB, smoothstep(0.06, 0.18, offset));
  fanK = mix(fanK, DEEP, smoothstep(0.22, 0.42, offset));
  vec3 thread = WHITE * wall * bright + coreK * core * streak * bright;
  glow += fanK * 4.5 * profile * fade * streak * bright;
  glow += MIST * 0.7 * exp(-max(u - 1.0, 0.0) / 0.9) * smoothstep(0.7, 1.2, u) * fade * soft;
  glow += EMBER * 0.35 * exp(-sq((f - 165.0) / 22.0)) * exp(-d / 25.0) * bright;
  float lag = u * (6.0 + 0.28 * f) * 0.35;
  float reveal = 1.0 - smoothstep(front - 70.0, front + 8.0, f + lag);
  glow *= start * reveal;
  return thread * start * reveal;
}

vec3 easeLight(vec3 light, float amount) {
  return -log(max(1.0 - amount * (1.0 - exp(-light)), vec3(0.0001)));
}

void main() {
  vec2 frag = vec2(gl_FragCoord.x, uResolution.y * uDpr - gl_FragCoord.y) / uDpr;
  vec2 p = frag / uScale;
  float t = uTime;
  float bx = uBeamX / uScale;
  float sl = uSurface.x / uScale;
  float sy = uSurface.y / uScale;
  float sr = uSurface.z / uScale;
  float sb = uSurface.w / uScale;
  float radius = uRadius / uScale;
  float dx = p.x - bx;
  float adx = abs(dx);
  float h = sy - p.y;
  float hp = max(h, 0.0);
  float above = smoothstep(-0.5, 0.5, h);
  float side = smoothstep(-24.0, 24.0, dx);
  vec3 sideK = mix(mix(LAVENDER, LEFT, smoothstep(40.0, 140.0, adx)), RIGHT, side);
  float beamWidth = uShape.x;
  float flare = uShape.y;
  float spread = 250.0 * uShape.z;
  float reachL = max(bx - sl, 1.0);
  float reachR = max(sr - bx, 1.0);
  float reach = dx < 0.0 ? reachL : reachR;
  float layerLen = clamp(0.29 * reach, 20.0, 100.0) * sqrt(uShape.z);
  float run = uRun.x;
  float runMask = 1.0 - smoothstep(run - 34.0, run + 6.0, adx);
  float bead = exp(-sq((adx - run + 16.0) / (18.0 + 0.04 * run))) * uRun.y;
  float flowMask = (1.0 - smoothstep(0.75 * spread, 1.1 * spread, adx)) * runMask;
  float edgeMask = (1.0 - smoothstep(0.8 * spread, 1.25 * spread, adx)) * runMask;
  float bloom = uIntro.y;
  vec2 center = vec2((sl + sr) * 0.5, (sy + sb) * 0.5);
  vec2 halfSize = vec2((sr - sl) * 0.5, (sb - sy) * 0.5);
  float sd = roundBox(p - center, halfSize, radius);
  float outline = max(sd, 0.0);
  float below = max(p.y - sy - radius, 0.0);
  float hug = smoothstep(-0.5, 0.5, sd) * exp(-sq(below / 14.0));
  float hugWide = smoothstep(-0.5, 0.5, sd) * exp(-sq(below / 40.0));

  vec3 col = vec3(0.0);

  float breathe = 1.0 + uExtra.x * (0.12 * sin(t * 1.5708) + 0.08 * (noise(vec2(t * 0.5, 3.0)) - 0.5));

  float front = uIntro.x / uScale;
  float drop = smoothstep(front + 10.0, front - 110.0, p.y);
  float falling = 1.0 - smoothstep(sy - 24.0, sy, front);
  float top = mix(0.3, 1.0, smoothstep(0.0, 0.3 * sy, p.y));
  float beamCore = 24.0 * exp(-adx / (2.0 * beamWidth));
  float beamHalo = 1.3 * exp(-adx / (6.0 * beamWidth)) + 0.3 * exp(-adx / (22.0 * beamWidth));
  vec3 haloK = mix(BEAM, sideK, exp(-hp / 80.0));
  col += (BEAM * beamCore + haloK * beamHalo) * top * above * drop;
  float head = exp(-sq((p.y - front) / 24.0)) * falling;
  col += mix(WHITE, BEAM, 0.35) * head * (7.0 * exp(-adx / (2.6 * beamWidth)) + 1.0 * exp(-adx / (14.0 * beamWidth)));

  float psi = adx * (outline + 1.0);
  float rise = max(hp - 17.9 * flare, 0.0);
  float skirtAmp = 16.6 * (exp(-sq(rise / (11.8 * flare))) + 0.3 * exp(-rise / (60.0 * flare)));
  float skirtSpread = mix(134.0, 155.0, side) * breathe * flare * flare * mix(0.35, 1.0, min(bloom, 1.0)) * max(bloom, 1.0);
  float skirt = skirtAmp * exp(-psi / skirtSpread) * exp(-sq(adx / (max(layerLen, 60.0 * sqrt(uShape.z)) * 1.48))) * hug;
  col += sideK * skirt * flowMask * min(bloom, 1.0);

  float layer = 12.0 * exp(-adx / layerLen) * exp(-outline / (0.19 * layerLen)) * (1.0 + 0.4 * bead);
  col += sideK * layer * hug * flowMask * min(bloom, 1.0);
  float washMask = smoothstep(sl - 60.0, sl + 6.0, p.x) * (1.0 - smoothstep(sr - 6.0, sr + 45.0, p.x));
  float wash = 1.4 * exp(-adx / 100.0) * exp(-outline / 30.0);
  col += mix(BEAM, sideK, 0.25) * wash * hugWide * washMask * flowMask * min(bloom, 1.0);
  float highWash = 0.7 * exp(-adx / 140.0) * exp(-outline / 60.0);
  col += mix(BEAM, NAVY, 0.5) * highWash * hugWide * washMask * runMask * min(bloom, 1.0);

  float sideSign = dx < 0.0 ? 0.0 : 1.0;
  float along = 0.5 * log((hp + 1.0) / (adx + 1.0));
  float lineScale = 6.0;
  float lp = log(max(psi, 1.0) / (120.0 * flare * flare)) * lineScale;
  float lineIndex = floor(lp) + sideSign * 97.0;
  float wobble = 0.22 * (noise(vec2(lineIndex * 3.7, t * 0.4 + along)) - 0.5);
  float lf = fract(lp + wobble) - 0.5;
  float gradient = lineScale * length(vec2(hp + 1.0, adx)) / max(psi, 1.0) / uScale;
  float halfWidth = max(0.35 * gradient, 0.0001);
  float drawWidth = max(halfWidth, 0.6 * gradient);
  float lineShape = exp(-lf * lf / (drawWidth * drawWidth)) * (halfWidth / drawWidth);
  float lineOn = step(0.3, hash(vec2(lineIndex, 1.3)));
  float lineFlow = smoothstep(0.25, 0.85, noise(vec2(lineIndex * 5.3 + 2.0, along * 3.0 + t * 1.1)));
  float flareArea = 120.0 * flare * flare;
  float lineEnvelope = smoothstep(0.85 * flareArea, 1.4 * flareArea, psi) * (1.0 - smoothstep(3.2 * flareArea, 7.5 * flareArea, psi));
  lineEnvelope *= exp(-adx / (layerLen * 1.5)) * hug * flowMask * (1.0 - smoothstep(35.0 * flare, 80.0 * flare, hp));
  float lineBright = mix(0.35, 1.0, hash(vec2(lineIndex, 4.0)));
  col += mix(sideK, WHITE, 0.6) * lineShape * lineOn * lineFlow * lineEnvelope * lineBright * 2.6 * uAmount.w * min(bloom, 1.0);

  float edgeGlow = 22.8 * exp(-sq(adx / (150.0 * uShape.z))) * edgeMask * (1.0 + 0.9 * bead);
  float onTop = 1.0 - smoothstep(sy + radius, sy + radius + 10.0, p.y);
  float edgeLine = (exp(-sq(max(sd, 0.0) / 0.9)) + 0.12 * exp(-max(sd, 0.0) / 3.0)) * edgeGlow * onTop;
  col += mix(sideK, WHITE, 0.6) * edgeLine * min(bloom, 1.0);

  float pour = uShape.w;
  float baseline = exp(-sq(130.0 / 150.0));
  float strengthR = exp(-sq(reachR / (150.0 * uShape.z))) * (1.0 - smoothstep(0.8 * spread, 1.25 * spread, reachR)) / baseline * pour;
  float strengthL = exp(-sq(reachL / (150.0 * uShape.z))) * (1.0 - smoothstep(0.8 * spread, 1.25 * spread, reachL)) / baseline * pour;
  float fallY = p.y - sy - 0.3 * radius;
  float rightHalf = smoothstep(center.x - 4.0, center.x + 4.0, p.x);
  float haloR = exp(-length(p - vec2(sr - 0.3 * radius, sy + 0.3 * radius)) / 40.0) * sqrt(strengthR);
  float haloL = exp(-length(p - vec2(sl + 0.3 * radius, sy + 0.3 * radius)) / 40.0) * sqrt(strengthL);
  vec3 glowR;
  vec3 glowL;
  col += spill(sd, fallY, strengthR, uPour.y, t, glowR) * rightHalf;
  col += spill(sd, fallY, strengthL, uPour.x, t, glowL) * (1.0 - rightHalf);
  col += easeLight(glowR * rightHalf + NAVY * 0.9 * haloR, uPour.w);
  col += easeLight(glowL * (1.0 - rightHalf) + NAVY * 0.9 * haloL, uPour.z);

  vec2 toLens = frag - uLens.xy;
  float lens = exp(-dot(toLens, toLens) / sq(uLens.z)) * uLens.w;
  col *= 1.0 + 0.35 * lens * hug;
  float fogAmount = uAmount.y * uAtmosphere;
  float near = exp(-adx / 150.0);
  float envelope = near * (0.3 + 0.4 * exp(-hp / 50.0) + 1.2 * exp(-p.y / 120.0));
  if (fogAmount > 0.001 && h > -2.0 && envelope * max(0.25, 6.0 * exp(-adx / 50.0)) > 0.002) {
    vec2 fq = vec2(dx / 1.7, h) / 85.0 + vec2(t * 0.012, -t * 0.03) + uExtra.zw;
    vec2 fw = vec2(fbm(fq * 1.3 + vec2(1.7, 9.2) + t * 0.03), fbm(fq * 1.3 + vec2(8.3, 2.8) - t * 0.025));
    float cloud = fbm(fq + 1.4 * fw);
    float density = smoothstep(0.5, 0.78, cloud);
    float lit = exp(-adx / 50.0);
    float fogMask = smoothstep(-2.0, 20.0, h);
    float reached = smoothstep(front + 80.0, front - 40.0, p.y);
    vec3 fog = (HAZE * 0.45 + BEAM * 6.0 * lit * reached) * density * envelope * fogMask;
    float surfaceLit = exp(-adx / (layerLen * 1.3)) * exp(-outline / 28.0) * hugWide * flowMask * washMask * min(bloom, 1.0);
    fog += sideK * 2.2 * surfaceLit * (smoothstep(0.38, 0.72, cloud) - 0.35) * fogMask;
    float smoke = smoothstep(0.3, 0.75, cloud);
    fog += BEAM * 0.35 * exp(-adx / (22.0 * beamWidth)) * (0.35 + 0.9 * smoke) * fogMask * top * drop;
    col += fog * fogAmount * (1.0 + 1.2 * lens) * mix(1.0, 0.45, uTheme);
  }

  if (uRevealInfo.y > 0.001 && uLens.w > 0.002) {
    vec2 toReveal = frag - uLens.xy;
    float reveal = exp(-dot(toReveal, toReveal) / sq(uRevealInfo.x)) * uLens.w;
    vec2 uv = frag * uRevealMap.xy + uRevealMap.zw;
    float onImage = step(0.0, uv.x) * step(uv.x, 1.0) * step(0.0, uv.y) * step(uv.y, 1.0);
    vec4 ui = texture(uReveal, uv);
    float ink = max(ui.r, max(ui.g, ui.b)) * onImage;
    float lit = clamp(col.b * 0.9, 0.0, 1.0) * (1.0 - smoothstep(0.9, 2.2, col.b));
    float clearance = smoothstep(60.0 * sqrt(beamWidth), 150.0 * sqrt(beamWidth), adx);
    col += mix(BEAM, WHITE, 0.4) * ink * reveal * lit * clearance * uRevealInfo.y * 2.2;
  }

  float haze = col.b;
  float dotGrid = 1.0 - smoothstep(0.16, 0.32, length(fract(frag / 3.0) - 0.5));
  col += BEAM * dotGrid * clamp(haze, 0.0, 1.5) * (1.0 - smoothstep(1.5, 4.0, haze)) * (0.18 + 0.3 * lens) * uExtra.y;
  if (lens > 0.002) {
    vec2 drift = frag - vec2(0.0, t * 14.0);
    vec2 sparkCell = floor(drift / 7.0);
    vec2 sparkPos = (sparkCell + 0.2 + 0.6 * vec2(hash(sparkCell + 5.1), hash(sparkCell + 2.3))) * 7.0;
    float sparkDist = length(drift - sparkPos);
    float sparkOn = step(0.8, hash(sparkCell + 8.8));
    float sparkTwinkle = 0.5 + 0.5 * sin(t * 5.0 + hash(sparkCell + 3.7) * 6.283);
    col += WHITE * exp(-sparkDist * sparkDist / 0.35) * sparkOn * sparkTwinkle * lens * clamp(haze * 1.5, 0.0, 1.0) * 1.6 * uAmount.z;
  }

  float dustAmount = uAmount.z;
  if (dustAmount > 0.001) {
    float dustLp = log(max(psi, 1.0) / (120.0 * flare * flare)) * 2.2;
    vec2 flowCell = vec2(dustLp / 1.1, (along + t * 0.22) / 0.06);
    vec2 cellId = floor(flowCell) + vec2(sideSign * 131.0, 0.0);
    vec2 cellJitter = vec2(hash(cellId + 1.7), hash(cellId + 8.3));
    vec2 particleFlow = (floor(flowCell) + 0.1 + cellJitter * 0.8) * vec2(1.1, 0.06);
    float particlePsi = 120.0 * flare * flare * exp(particleFlow.x / 2.2);
    float particleAlong = particleFlow.y - t * 0.22;
    float particleX = sqrt(particlePsi * exp(-2.0 * particleAlong)) - 1.0;
    float particleH = sqrt(particlePsi * exp(2.0 * particleAlong)) - 1.0;
    float particleDist = length(vec2(adx - particleX, hp - particleH)) * uScale;
    float particleOn = step(0.62, hash(cellId + 3.1));
    float particleTwinkle = 0.5 + 0.5 * sin(t * 5.0 + hash(cellId + 9.2) * 6.283);
    float dustZone = exp(-sq(log(max(psi, 1.0) / (200.0 * flare * flare)) / 0.55)) * hug * flowMask * smoothstep(0.0, 6.0, outline);
    col += WHITE * exp(-particleDist * particleDist / 0.3) * particleOn * particleTwinkle * dustZone * 3.0 * dustAmount * min(bloom, 1.0);

    vec2 glitterCell = vec2(dx / 3.0, (p.y - t * 26.0) / 9.0);
    vec2 glitterId = floor(glitterCell);
    vec2 glitterJitter = vec2(hash(glitterId + 4.4), hash(glitterId + 2.9));
    vec2 glitterPos = (glitterId + 0.15 + glitterJitter * 0.7) * vec2(3.0, 9.0);
    float glitterDist = length(vec2(dx, p.y - t * 26.0) - glitterPos) * uScale;
    float glitterOn = step(0.7, hash(glitterId + 6.6));
    float glitterTwinkle = 0.5 + 0.5 * sin(t * 6.0 + hash(glitterId + 1.1) * 6.283);
    float glitterZone = exp(-adx / (5.0 * beamWidth)) * smoothstep(1.5, 4.0, adx / beamWidth) * above * smoothstep(25.0, 70.0, hp) * top * drop;
    col += WHITE * exp(-glitterDist * glitterDist / 0.25) * glitterOn * glitterTwinkle * glitterZone * 2.2 * dustAmount * uAtmosphere;
  }

  col *= uAmount.x * (1.0 + uIntro.z * 0.9 * exp(-length(vec2(dx, h * 1.6)) / 70.0));
  col *= smoothstep(-0.75, 0.25, sd * uScale);

  vec3 emit = 1.0 - exp(-col * mix(1.0, 0.6, uTheme));
  float peak = max(emit.r, max(emit.g, emit.b));
  if (uTheme > 0.5) {
    float low = min(emit.r, min(emit.g, emit.b));
    float chroma = peak - low;
    vec3 hue = (emit - low) / max(chroma, 0.0001);
    float alpha = clamp(pow(chroma, 1.35) * 1.3, 0.0, 1.0) * 0.9;
    outColor = vec4((hue * 0.82 + 0.06) * alpha, alpha);
  } else {
    outColor = vec4(emit, peak);
  }
}`,s=[[0,1],[-11.5,.77],[9.5,.95],[-53.5,.79],[39.5,.77],[16,.81],[-16.3,.92],[13.3,.96],[3,1.01],[1,.68],[1,1.15],[142.5,.51],[113.6,.28],[-7.5,.13],[-2.7,.32],[7.5,.81]],c=.78,l=2048,u=1.25,d=5,f=(e,t,n)=>Math.min(n,Math.max(t,e)),p=e=>1-(1-f(e,0,1))**3,m=e=>{let t=.62,n=8*Math.sqrt(1-t*t);return 1-Math.exp(-4.96*e)*(Math.cos(n*e)+t*8/n*Math.sin(n*e))},h=([e,t,n])=>{let r=Math.max(e,t,n),i=r-Math.min(e,t,n),a=0;return i>0&&(a=r===e?(t-n)/i%6:r===t?(n-e)/i+2:(e-t)/i+4),[(a*60+360)%360,r>0?i/r:0]},g=(e,t)=>{let n=(e%360+360)%360/60,r=t,i=r*(1-Math.abs(n%2-1)),a=1-r,[o,s,c]=n<1?[r,i,0]:n<2?[i,r,0]:n<3?[0,r,i]:n<4?[0,i,r]:n<5?[i,0,r]:[r,0,i];return[o+a,s+a,c+a]},_=e=>{let[t,n]=h(e),r=n/c,i=new Float32Array(s.length*3);return s.forEach(([e,n],a)=>{i.set(g(t+e,f(c*n*r,0,1)),a*3)}),i},v=(e,t,n)=>{let r=e.createShader(t);return r?(e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(e.deleteShader(r),null)):null},y=(e,t,n)=>{let r=v(e,e.VERTEX_SHADER,t),i=v(e,e.FRAGMENT_SHADER,n),a=e.createProgram();return!r||!i||!a?null:(e.attachShader(a,r),e.attachShader(a,i),e.linkProgram(a),e.deleteShader(r),e.deleteShader(i),e.getProgramParameter(a,e.LINK_STATUS)?a:(e.deleteProgram(a),null))},b=(e,t,n)=>{let r={};for(let i of n)r[i]=e.getUniformLocation(t,i);return r},x=({surfaceRef:e,beamPosition:t=.6,surfaceLevel:n=1,color:s=`#3847ff`,intensity:c=1.8,beamWidth:h=1.5,flare:g=1.5,spread:v=1.5,spill:x=1,fog:S=.2,dust:C=1.6,streaks:w=1.5,dots:T=1,pulse:E=1.5,speed:D=1.5,seed:O=3,mouseInteraction:k=!0,revealImage:A,revealRadius:j=220,revealOpacity:M=.6,intro:N=!0,theme:P=`dark`,paused:F=!1,dpr:I,...L})=>{let R=(0,r.useRef)(null),z=(0,r.useRef)(null),B=(0,r.useRef)(null),V={surfaceRef:e,beamPosition:f(t,0,1),surfaceLevel:f(n,0,1),color:String(s),intensity:Math.max(0,c),beamWidth:f(h,.2,5),flare:f(g,.2,4),spread:f(v,.1,4),spill:Math.max(0,x),fog:Math.max(0,S),dust:Math.max(0,C),streaks:Math.max(0,w),dots:Math.max(0,T),pulse:Math.max(0,E),speed:D,seed:O,mouseInteraction:k,revealImage:A,revealRadius:Math.max(1,j),revealOpacity:f(M,0,1),intro:N,theme:P,paused:F,dpr:I},H=(0,r.useRef)(V);H.current=V,(0,r.useEffect)(()=>{let e=R.current,t=z.current,n=t?.getContext(`webgl2`,{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1});if(!e||!t||!n)return;let r=y(n,a,o);if(!r)return;let i=b(n,r,[`uResolution`,`uDpr`,`uScale`,`uTime`,`uBeamX`,`uSurface`,`uRadius`,`uIntro`,`uPour`,`uRun`,`uLens`,`uReveal`,`uRevealMap`,`uRevealInfo`,`uAtmosphere`,`uAmount`,`uShape`,`uExtra`,`uTheme`,`uTint`]),s=n.createVertexArray(),c=n.createBuffer();n.bindVertexArray(s),n.bindBuffer(n.ARRAY_BUFFER,c),n.bufferData(n.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),n.STATIC_DRAW);let h=n.getAttribLocation(r,`aPosition`);n.enableVertexAttribArray(h),n.vertexAttribPointer(h,2,n.FLOAT,!1,0,0),n.bindVertexArray(null);let g=n.createTexture();n.bindTexture(n.TEXTURE_2D,g),n.texImage2D(n.TEXTURE_2D,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,new Uint8Array([0,0,0,0])),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MAG_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE);let v=document.createElement(`canvas`);v.width=1,v.height=1;let x=v.getContext(`2d`,{willReadFrequently:!0}),S=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches??!1,C={time:0,introTime:H.current.intro&&!S?0:d,width:1,height:1,ratio:1,colorKey:``,tints:_([.22,.28,1]),observed:null,pointer:{x:0,y:0,inside:!1},lens:{x:0,y:0,vx:0,vy:0,strength:0,placed:!1},reveal:{src:``,ready:!1,width:1,height:1,image:null}},w=0,T=0,E=!0,D=!0,O=e=>{if(!x)return[.22,.28,1];x.clearRect(0,0,1,1),x.fillStyle=`#3847ff`,x.fillStyle=e,x.fillRect(0,0,1,1);let[t,n,r]=x.getImageData(0,0,1,1).data;return[t/255,n/255,r/255]},k=e=>{e.color!==C.colorKey&&(C.colorKey=e.color,C.tints=_(O(e.color)))},A=e=>{let t=e.revealImage?String(e.revealImage):``,r=C.reveal;if(t===r.src||(r.src=t,r.ready=!1,r.image&&(r.image.onload=null),!t))return;let i=new Image;i.crossOrigin=`anonymous`,i.decoding=`async`,i.onload=()=>{if(!D||r.src!==t)return;let e=i.naturalWidth||i.width||1,a=i.naturalHeight||i.height||1,o=Math.min(1,2048/Math.max(e,a)),s=document.createElement(`canvas`);s.width=Math.max(1,Math.round(e*o)),s.height=Math.max(1,Math.round(a*o)),s.getContext(`2d`)?.drawImage(i,0,0,s.width,s.height),n.bindTexture(n.TEXTURE_2D,g),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!0),n.texImage2D(n.TEXTURE_2D,0,n.RGBA,n.RGBA,n.UNSIGNED_BYTE,s),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),r.width=s.width,r.height=s.height,r.ready=!0,B.current?.()},i.src=t,r.image=i},j=(t,n,r)=>{let i=t.surfaceRef?.current??null;if(i!==C.observed&&(C.observed&&U.unobserve(C.observed),i&&U.observe(i),C.observed=i),i){let t=e.getBoundingClientRect(),n=i.getBoundingClientRect();if(n.width>0){let e=getComputedStyle(i),r=Math.max(parseFloat(e.borderTopLeftRadius)||0,parseFloat(e.borderTopRightRadius)||0);return{left:n.left-t.left,top:n.top-t.top,right:n.right-t.left,bottom:n.bottom-t.top,radius:Math.min(r,n.width/2,n.height/2),real:!0}}}return{left:-n*2,top:t.surfaceLevel*r,right:n*3,bottom:r*3,radius:0,real:!1}},M=()=>{let n=Math.max(1,e.clientWidth),r=Math.max(1,e.clientHeight),i=H.current,a=Math.min(i.dpr||window.devicePixelRatio||1,2),o=Math.max(n,r)*a,s=o>l?a*l/o:a,c=Math.max(1,Math.round(n*s)),u=Math.max(1,Math.round(r*s));(t.width!==c||t.height!==u)&&(t.width=c,t.height=u),C.width=n,C.height=r,C.ratio=t.width/n,N()},N=()=>{let e=H.current;k(e);let{width:a,height:o}=C,c=Math.max(.2,Math.min(a/585,o/507)),l=j(e,a,o),h=e.beamPosition*a;if(l.real){let e=l.radius+6;h>=l.left&&h<=l.right?h=f(h,l.left+e,l.right-e):l={left:-a*2,top:o,right:a*3,bottom:o*3,radius:0,real:!1}}let _=-.15*o,v=l.top-_+.3*o,y=C.introTime,b=y>=d,x=b?l.top+.3*o:_+v*f(y/u,0,1)**1.3,S=y-u*(Math.max(0,l.top-_)/v)**(1/1.3),w=b?1:S<=0?0:m(S),T=b||S<=0?0:Math.exp(-S/.35)*(1-Math.exp(-S/.05)),E=e.spread*250*1.3+80,D=b?1e5:S<=0?-40:E*(1-Math.exp(-1.15*S)),O=b||S<=0?0:Math.exp(-1.15*S)*(1-Math.exp(-S/.08)),M=e=>{if(b)return[1e3,1];if(S<=0)return[-e,0];let t=Math.min(e,E*.97),n=-Math.log(1-t/E)/1.15,r=S-n,i=f((r+.15)/.8,0,1),a=i*i*i*(i*(i*6-15)+10);return r<=0?[D-t,a]:[1.15*(E-t)*r+260*r*r,a]},[N,P]=M((h-l.left)/c),[F,I]=M((l.right-h)/c),L=b?1:S<=0?.3*p(y/u):.3+.7*(1-Math.exp(-1.3*S)),R=Number(e.seed)||0;n.viewport(0,0,t.width,t.height),n.clearColor(0,0,0,0),n.clear(n.COLOR_BUFFER_BIT),n.useProgram(r),n.uniform2f(i.uResolution,a,o),n.uniform1f(i.uDpr,C.ratio),n.uniform1f(i.uScale,c),n.uniform1f(i.uTime,C.time),n.uniform1f(i.uBeamX,h),n.uniform4f(i.uSurface,l.left,l.top,l.right,l.bottom),n.uniform1f(i.uRadius,l.radius),n.uniform3f(i.uIntro,x,w,T),n.uniform4f(i.uPour,N,F,P,I),n.uniform2f(i.uRun,D,O),n.uniform4f(i.uLens,C.lens.x,C.lens.y,95*c,C.lens.strength),A(e);let{reveal:z}=C,B=Math.max(a/z.width,o/z.height),V=z.width*B,U=z.height*B;n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,g),n.uniform1i(i.uReveal,0),n.uniform4f(i.uRevealMap,1/V,1/U,(V-a)/2/V,(U-o)/2/U),n.uniform2f(i.uRevealInfo,e.revealRadius,z.ready?e.revealOpacity:0),n.uniform1f(i.uAtmosphere,L),n.uniform4f(i.uAmount,e.intensity,e.fog,e.dust,e.streaks),n.uniform4f(i.uShape,e.beamWidth,e.flare,e.spread,e.spill),n.uniform4f(i.uExtra,e.pulse,e.dots,34.34+R*7.31,11.58+R*3.17),n.uniform1f(i.uTheme,+(e.theme===`light`)),n.uniform3fv(i.uTint,C.tints),n.bindVertexArray(s),n.drawArrays(n.TRIANGLES,0,3),n.bindVertexArray(null)},P=e=>{if(w=0,!D||!E||document.hidden)return;let t=H.current,n=T?Math.min(.05,(e-T)/1e3):1/60;T=e;let r=!t.paused&&!S;r&&(C.time+=n*t.speed);let i=C.introTime<d;i&&(C.introTime=Math.min(d,C.introTime+n));let{pointer:a,lens:o}=C,s=t.mouseInteraction&&a.inside&&!S;s&&!o.placed&&(o.x=a.x,o.y=a.y,o.vx=0,o.vy=0,o.placed=!0);let c=120*(a.x-o.x)-19*o.vx,l=120*(a.y-o.y)-19*o.vy;o.vx+=c*n,o.vy+=l*n,o.x+=o.vx*n,o.y+=o.vy*n;let u=+!!s;o.strength+=(u-o.strength)*(1-Math.exp(-n/(u>o.strength?.3:.55))),o.strength<.001&&!s&&(o.placed=!1),N();let f=Math.abs(C.lens.strength-(t.mouseInteraction&&C.pointer.inside?1:0))>.002||Math.hypot(C.lens.vx,C.lens.vy)>.5;r||i||f?w=requestAnimationFrame(P):T=0},F=()=>{!w&&D&&E&&!document.hidden&&(w=requestAnimationFrame(P))},I=t=>{let n=e.getBoundingClientRect(),r=t.clientX-n.left,i=t.clientY-n.top;C.pointer.x=r,C.pointer.y=i,C.pointer.inside=r>=0&&i>=0&&r<=n.width&&i<=n.height,F()},L=()=>{C.pointer.inside=!1,F()},V=()=>{T=0,F()},U=new ResizeObserver(M);U.observe(e);let W=new IntersectionObserver(e=>{E=e.some(e=>e.isIntersecting),E&&(T=0,F())});return W.observe(e),window.addEventListener(`pointermove`,I,{passive:!0}),document.documentElement.addEventListener(`pointerleave`,L),document.addEventListener(`visibilitychange`,V),M(),F(),B.current=()=>{w||N(),F()},()=>{D=!1,cancelAnimationFrame(w),B.current=null,U.disconnect(),W.disconnect(),window.removeEventListener(`pointermove`,I),document.documentElement.removeEventListener(`pointerleave`,L),document.removeEventListener(`visibilitychange`,V),n.deleteTexture(g),n.deleteBuffer(c),n.deleteVertexArray(s),n.deleteProgram(r)}},[]),(0,r.useEffect)(()=>{B.current?.()});let{className:U=``,...W}=L;return(0,i.jsx)(`div`,{ref:R,className:`pointer-events-none relative h-full w-full${U?` ${U}`:``}`,...W,children:(0,i.jsx)(`canvas`,{ref:z,className:`absolute inset-0 block h-full w-full`,"aria-hidden":`true`})})};export{x as LaserFlow,x as default};