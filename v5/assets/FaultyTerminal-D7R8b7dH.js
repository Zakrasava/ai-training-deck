import{i as e,t}from"./react-sySUN5R7.js";import{O as n}from"./sculpture-dark-Cfb-XN1r.js";var r=e(t(),1),i=n(),a=2,o=4,s={glitch:.7,degauss:1.6},c={blocks:0,dots:1,characters:2},l={none:0,glitch:1,degauss:2},u=[[`.###.`,`#..##`,`#.#.#`,`##..#`,`.###.`],[`..#..`,`.##..`,`..#..`,`..#..`,`.###.`],[`####.`,`....#`,`.###.`,`#....`,`#####`],[`####.`,`....#`,`.###.`,`....#`,`####.`],[`#..#.`,`#..#.`,`#####`,`...#.`,`...#.`],[`#####`,`#....`,`####.`,`....#`,`####.`],[`.###.`,`#....`,`####.`,`#...#`,`.###.`],[`#####`,`....#`,`...#.`,`..#..`,`..#..`],[`.###.`,`#...#`,`.###.`,`#...#`,`.###.`],[`.###.`,`#...#`,`.####`,`....#`,`.###.`],[`.###.`,`#...#`,`#####`,`#...#`,`#...#`],[`####.`,`#...#`,`####.`,`#...#`,`####.`],[`.####`,`#....`,`#....`,`#....`,`.####`],[`####.`,`#...#`,`#...#`,`#...#`,`####.`],[`#####`,`#....`,`####.`,`#....`,`#####`],[`#####`,`#....`,`####.`,`#....`,`#....`],[`.....`,`..#..`,`.###.`,`..#..`,`.....`],[`.....`,`.....`,`.###.`,`.....`,`.....`],[`.#...`,`..#..`,`...#.`,`..#..`,`.#...`],[`....#`,`...#.`,`..#..`,`.#...`,`#....`],[`.....`,`#.#.#`,`.###.`,`#.#.#`,`.....`],[`.....`,`#####`,`.....`,`#####`,`.....`],[`.....`,`.....`,`.....`,`.....`,`#####`]].map(e=>e.reduce((e,t,n)=>{let r=e;for(let e=0;e<5;e++)t[e]===`#`&&(r+=2**(n*5+e));return r},0)),d=`#version 300 es
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`,f=`#version 300 es
precision highp float;
precision highp int;

uniform float iTime;
uniform vec2 uGridMul;
uniform float uNoiseAmp;
uniform float uScale;
uniform vec2 uMouse;
uniform float uMouseStrength;
uniform float uUseMouse;
uniform float uPageLoadProgress;
uniform float uUsePageLoadAnimation;
uniform ivec2 uOrigin;
uniform sampler2D uPrev0;
uniform sampler2D uPrev1;
uniform float uDecay;
uniform float uFresh;
uniform float uHover;

layout(location = 0) out vec4 outRings;
layout(location = 1) out vec4 outExtra;

float time;

float noise(vec2 p) {
  return sin(p.x * 10.0) * sin(p.y * (3.0 + sin(time * 0.090909))) + 0.2;
}

mat2 rotate(float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return mat2(c, -s, s, c);
}

float fbm(vec2 p) {
  p *= 1.1;
  float f = 0.0;
  float amp = 0.5 * uNoiseAmp;
  mat2 modify0 = rotate(time * 0.02);
  f += amp * noise(p);
  p = modify0 * p * 2.0;
  amp *= 0.454545;
  mat2 modify1 = rotate(time * 0.02);
  f += amp * noise(p);
  p = modify1 * p * 2.0;
  amp *= 0.454545;
  f += amp * noise(p);
  return f;
}

float pattern(vec2 p) {
  vec2 offset1 = vec2(1.0);
  vec2 offset0 = vec2(0.0);
  mat2 rot01 = rotate(0.1 * time);
  mat2 rot1 = rotate(0.1);
  vec2 q = vec2(fbm(p + offset1), fbm(rot01 * p + offset1));
  vec2 r = vec2(fbm(rot1 * q + offset0), fbm(q + offset0));
  return fbm(p + r);
}

void main() {
  time = iTime * 0.333333;
  ivec2 texel = ivec2(gl_FragCoord.xy);
  vec2 grid = uGridMul * 15.0;
  vec2 s = vec2(texel + uOrigin) / grid;
  float intensity = pattern(s * 0.1) * 1.3 - 0.03;
  float lift = 0.0;
  float strike = 0.0;

  if (uUseMouse > 0.5) {
    vec2 mouseWorld = uMouse * uScale;
    float distToMouse = distance(s, mouseWorld);
    float mouseInfluence = exp(-distToMouse * 8.0) * uMouseStrength * 10.0;
    intensity += mouseInfluence;
    float ripple = sin(distToMouse * 20.0 - iTime * 5.0) * 0.1 * mouseInfluence;
    intensity += ripple;
    lift = mouseInfluence;
  }

  if (uUsePageLoadAnimation > 0.5) {
    float cellRandom = fract(sin(dot(s, vec2(12.9898, 78.233))) * 43758.5453);
    float cellDelay = cellRandom * 0.8;
    float cellProgress = clamp((uPageLoadProgress - cellDelay) / 0.2, 0.0, 1.0);
    float fadeAlpha = smoothstep(0.0, 1.0, cellProgress);
    intensity *= fadeAlpha;
    strike = sin(3.14159265 * cellProgress) * step(0.1, intensity);
  }

  vec4 on0 = step(vec4(0.1), intensity - vec4(0.0, 1.0, 2.0, 4.0) * 0.0625);
  vec2 on1 = step(vec2(0.1), intensity - vec2(5.0, 8.0) * 0.0625);
  float level = clamp((intensity - 0.1) / 0.6, 0.0, 1.0);
  float heat = max(clamp(lift / 3.0, 0.0, 1.0) * uHover, strike);

  vec4 prev0 = texelFetch(uPrev0, texel, 0) * (1.0 - uFresh);
  vec4 prev1 = texelFetch(uPrev1, texel, 0) * (1.0 - uFresh);
  vec4 fade0 = max(prev0 * uDecay - 1.0 / 255.0, 0.0);
  vec4 fade1 = max(prev1 * uDecay - 1.0 / 255.0, 0.0);

  outRings = max(on0, fade0);
  outExtra = vec4(max(on1, fade1.xy), max(level, fade1.z), max(heat, fade1.w));
}`,p=`#version 300 es
precision highp float;
precision highp int;

uniform float iTime;
uniform vec3 iResolution;
uniform float uScale;
uniform vec2 uGridMul;
uniform float uDigitSize;
uniform float uScanlineIntensity;
uniform float uGlitchAmount;
uniform float uFlickerAmount;
uniform float uChromaticAberration;
uniform float uDither;
uniform float uCurvature;
uniform vec3 uTint;
uniform float uBrightness;
uniform float uLightMode;
uniform sampler2D uRings0;
uniform sampler2D uRings1;
uniform ivec2 uOrigin;
uniform ivec2 uCellCount;
uniform int uGlyphs;
uniform float uGlow;
uniform float uScramble;
uniform float uMouseGlow;
uniform float uVignette;
uniform vec4 uClicks[${o}];
uniform int uClickMode;
uniform float uClickSeconds;
uniform float uClock;

out vec4 outColor;

${`const uint FONT[${u.length}] = uint[${u.length}](${u.map(e=>`${e}u`).join(`, `)});`}

float time;
float clickTear;
float clickSplit;
float pixelHeat;

float hash21(vec2 p) {
  p = fract(p * 234.56);
  p += dot(p, p + 34.56);
  return fract(p.x * p.y);
}

float hashCell(vec2 p) {
  vec3 q = fract(vec3(p.xyx) * 0.1031);
  q += dot(q, q.yzx + 33.33);
  return fract((q.x + q.y) * q.z);
}

ivec2 cellTexel(vec2 cell) {
  return clamp(ivec2(cell) - uOrigin, ivec2(0), uCellCount - 1);
}

float ringValue(float n, vec4 r0, vec4 r1) {
  if (n < 0.5) return r0.x;
  if (n < 1.5) return r0.y;
  if (n < 2.5) return r0.z;
  if (n < 4.5) return r0.w;
  if (n < 5.5) return r1.x;
  return r1.y;
}

float digit(vec2 p) {
  vec2 grid = uGridMul * 15.0;
  vec2 cell = floor(p * grid);
  ivec2 texel = cellTexel(cell);
  vec4 r0 = texelFetch(uRings0, texel, 0);
  vec4 r1 = texelFetch(uRings1, texel, 0);
  float boost = 1.0 + r1.w * uMouseGlow * 1.3;
  pixelHeat = max(pixelHeat, r1.w);
  p = fract(p * grid);
  p *= uDigitSize;

  float px5 = p.x * 5.0;
  float py5 = (1.0 - p.y) * 5.0;
  float x = fract(px5);
  float y = fract(py5);
  float i = floor(py5) - 2.0;
  float j = floor(px5) - 2.0;
  float inside = step(0.0, p.x) * step(p.x, 1.0) * step(0.0, p.y) * step(p.y, 1.0);

  if (uGlyphs == 2) {
    float rate = 1.2 + r1.w * uScramble * 18.0;
    float phase = hashCell(cell * 1.37 + 4.1);
    float epoch = floor(iTime * rate + phase * 7.0);
    float pick = hashCell(cell + vec2(epoch * 0.731, epoch * 1.913));
    uint glyph = FONT[int(min(pick * float(FONT.length()), float(FONT.length()) - 1.0))];
    int bit = int(i + 2.0) * 5 + int(j + 2.0);
    float lit = float((glyph >> uint(clamp(bit, 0, 24))) & 1u);
    float glow = max(r0.x, r1.z);
    float shade = 0.35 + 0.65 * r1.z;
    return inside * lit * glow * shade * boost * (0.2 + y * 0.8) * (0.75 + x * 0.25);
  }

  float n = i * i + j * j;
  float on = ringValue(n, r0, r1);
  if (uGlyphs == 1) {
    vec2 d = vec2(x, y) - 0.5;
    float radius = 0.36 + 0.06 * on;
    float edge = fwidth(px5) * 0.75;
    float dot = 1.0 - smoothstep(radius - edge, radius + edge, length(d));
    return inside * on * dot * boost * (0.55 + 0.45 * (1.0 - length(d) / 0.5));
  }
  float brightness = on * (0.2 + y * 0.8) * (0.75 + x * 0.25);
  return inside * brightness * boost;
}

float onOff(float a, float b, float c) {
  return step(c, sin(iTime + a * cos(iTime * b))) * uFlickerAmount;
}

float displace(vec2 look) {
  float y = look.y - mod(iTime * 0.25, 1.0);
  float window = 1.0 / (1.0 + 50.0 * y * y);
  return sin(look.y * 20.0 + iTime) * 0.0125 * onOff(4.0, 2.0, 0.8) * (1.0 + cos(iTime * 60.0)) * window;
}

vec2 getLight(vec2 p) {
  float bar = step(mod(p.y + time * 20.0, 1.0), 0.2) * 0.4 + 1.0;
  bar *= uScanlineIntensity;

  float displacement = displace(p);
  p.x += displacement;

  if (uGlitchAmount != 1.0) {
    float extra = displacement * (uGlitchAmount - 1.0);
    p.x += extra;
  }

  p.x += clickTear;

  float middle = digit(p);

  const float off = 0.002;
  float sum = digit(p + vec2(-off, -off)) + digit(p + vec2(0.0, -off)) + digit(p + vec2(off, -off)) +
              digit(p + vec2(-off, 0.0)) + digit(p + vec2(0.0, 0.0)) + digit(p + vec2(off, 0.0)) +
              digit(p + vec2(-off, off)) + digit(p + vec2(0.0, off)) + digit(p + vec2(off, off));

  return vec2(0.9 * middle, sum * 0.1 * bar);
}

float glowAt(vec2 p) {
  vec2 grid = uGridMul * 15.0;
  vec2 cell = floor(p * grid);
  vec2 cellPx = iResolution.xy / (uScale * grid);
  float sigma = 0.5 * min(cellPx.x, cellPx.y);
  float center = 0.5 * min(1.0, 1.0 / max(uDigitSize, 0.001));
  float total = 0.0;
  for (int oy = -1; oy <= 1; oy++) {
    for (int ox = -1; ox <= 1; ox++) {
      vec2 c = cell + vec2(float(ox), float(oy));
      ivec2 texel = cellTexel(c);
      vec4 r0 = texelFetch(uRings0, texel, 0);
      vec4 r1 = texelFetch(uRings1, texel, 0);
      float emission = uGlyphs == 2
        ? max(r0.x, r1.z) * (0.35 + 0.65 * r1.z) * 0.45
        : (r0.x + 4.0 * (r0.y + r0.z + r0.w + r1.y) + 8.0 * r1.x) / 25.0;
      emission *= 1.0 + r1.w * uMouseGlow * 1.6;
      vec2 d = (p - (c + center) / grid) * iResolution.xy / uScale;
      total += emission * exp(-dot(d, d) / (2.0 * sigma * sigma));
    }
  }
  return total;
}

vec2 barrel(vec2 uv) {
  vec2 c = uv * 2.0 - 1.0;
  float r2 = dot(c, c);
  c *= 1.0 + uCurvature * r2;
  return c * 0.5 + 0.5;
}

void main() {
  time = iTime * 0.333333;
  vec2 uv = gl_FragCoord.xy / iResolution.xy;

  if (uCurvature != 0.0) {
    uv = barrel(uv);
  }

  clickTear = 0.0;
  clickSplit = 0.0;
  if (uClickMode > 0) {
    for (int k = 0; k < ${o}; k++) {
      vec4 click = uClicks[k];
      if (click.w <= 0.0) continue;
      float age = uClock - click.z;
      if (age < 0.0 || age > uClickSeconds) continue;
      float life = age / uClickSeconds;
      float envelope = (1.0 - life) * (1.0 - life);
      if (uClickMode == 1) {
        float tick = floor(age * 30.0);
        float bands = 14.0 + 26.0 * hashCell(vec2(click.z, tick * 0.37));
        float row = floor(uv.y * bands);
        float pickRow = hashCell(vec2(row + tick * 7.0, click.z * 17.0));
        float torn = step(0.42, pickRow);
        float reach = exp(-abs(uv.y - click.y) * 2.5);
        float shift = (hashCell(vec2(row * 1.7 + tick, click.z)) - 0.5) * 0.22;
        clickTear += shift * torn * envelope * reach;
        clickSplit = max(clickSplit, envelope * reach * (0.4 + 0.6 * torn));
      } else {
        vec2 aspect = vec2(iResolution.x / iResolution.y, 1.0);
        vec2 delta = (uv - click.xy) * aspect;
        float dist = length(delta);
        float front = age * 1.6;
        float band = exp(-pow((dist - front) / 0.18, 2.0));
        float wave = sin((dist - front) * 40.0) * band;
        uv += delta / aspect * wave * 0.05 * envelope;
        clickSplit = max(clickSplit, envelope * band);
      }
    }
  }

  vec2 p = uv * uScale;
  pixelHeat = 0.0;
  vec2 lightG = getLight(p);
  float heat = pixelHeat;
  vec2 lightR = lightG;
  vec2 lightB = lightG;

  float split = uChromaticAberration + clickSplit * 6.0;
  if (split != 0.0) {
    vec2 ca = vec2(split) / iResolution.xy;
    lightR = getLight(p + ca);
    lightB = getLight(p - ca);
  }

  if (uGlow > 0.0) {
    float bloom = uGlow * 0.2 * glowAt(p);
    lightR.y += bloom;
    lightG.y += bloom;
    lightB.y += bloom;
  }

  vec3 core = vec3(lightR.x, lightG.x, lightB.x);
  vec3 halo = vec3(lightR.y, lightG.y, lightB.y);
  vec3 raw = core + halo;

  vec3 luma = vec3(0.2126, 0.7152, 0.0722);
  float peak = max(uTint.r, max(uTint.g, uTint.b));
  float phosphor = clamp(uGlow, 0.0, 1.0);
  vec3 vividTint = clamp(mix(vec3(dot(uTint, luma)), uTint, 1.0 + 0.8 * phosphor), 0.0, 1.0);
  vec3 coreTint = mix(uTint, vec3(peak), phosphor * 0.45 * smoothstep(0.45, 0.9, core));
  vec3 col = core * coreTint + halo * vividTint;
  col += (vec3(1.0) - uTint) * min(raw, vec3(1.0)) * heat * uMouseGlow * 0.6;
  col *= uBrightness;

  if (uVignette > 0.0) {
    float edge = 0.04 + 0.22 * uVignette;
    vec2 fade = smoothstep(vec2(0.0), vec2(edge), uv) * smoothstep(vec2(0.0), vec2(edge), 1.0 - uv);
    float mask = fade.x * fade.y;
    mask = mask * mask * (3.0 - 2.0 * mask);
    float keep = mix(1.0, mask, clamp(uVignette * 1.5, 0.0, 1.0));
    col *= keep;
    core *= keep;
    halo *= keep;
  }

  if (uLightMode > 0.5) {
    vec3 luma = vec3(0.2126, 0.7152, 0.0722);
    float lum = dot(uTint, luma);
    float peak = max(uTint.r, max(uTint.g, uTint.b));
    vec3 hue = uTint / max(peak, 0.0001);
    vec3 vivid = clamp(mix(vec3(dot(hue, luma)), hue, 1.6), 0.0, 1.0);
    vivid = clamp(vivid * (0.3 / max(dot(vivid, luma), 0.0001)), 0.0, 1.0);
    vec3 ink = mix(uTint, vivid, smoothstep(0.3, 0.6, lum));
    vec3 cover = (core * 1.15 + halo * 0.4) * uBrightness * (1.0 + heat * uMouseGlow * 0.4);
    if (uDither > 0.0) cover += (hash21(gl_FragCoord.xy) - 0.5) * (uDither * 0.003922);
    cover = clamp(cover, 0.0, 0.94);
    float alpha = max(cover.r, max(cover.g, cover.b));
    outColor = vec4(alpha - cover * (1.0 - ink), alpha);
    return;
  }

  if (uDither > 0.0) {
    float rnd = hash21(gl_FragCoord.xy);
    col += (rnd - 0.5) * (uDither * 0.003922);
  }

  col = clamp(col, 0.0, 1.0);
  outColor = vec4(col, max(col.r, max(col.g, col.b)));
}`,m=(e,t,n)=>Math.min(n,Math.max(t,e)),h=(e,t,n)=>{let r=e.createShader(t);return r?(e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(e.deleteShader(r),null)):null},g=(e,t)=>{let n=h(e,e.VERTEX_SHADER,d),r=h(e,e.FRAGMENT_SHADER,t),i=e.createProgram();if(!n||!r||!i)return null;if(e.attachShader(i,n),e.attachShader(i,r),e.linkProgram(i),e.deleteShader(n),e.deleteShader(r),!e.getProgramParameter(i,e.LINK_STATUS))return e.deleteProgram(i),null;let a={},o=e.getProgramParameter(i,e.ACTIVE_UNIFORMS);for(let t=0;t<o;t++){let n=e.getActiveUniform(i,t);if(!n)continue;let r=n.name.replace(/\[0\]$/,``);a[r]=e.getUniformLocation(i,r)}return{program:i,uniforms:a}},_=e=>{let t=String(e||`#ffffff`).replace(`#`,``).trim();(t.length===3||t.length===4)&&(t=t.slice(0,3).split(``).map(e=>e+e).join(``));let n=parseInt(t.slice(0,6),16);return Number.isNaN(n)?[1,1,1]:[(n>>16&255)/255,(n>>8&255)/255,(n&255)/255]};function v({scale:e=1,gridMul:t=[2,1],digitSize:n=1.5,timeScale:u=.3,pause:d=!1,scanlineIntensity:h=.3,glitchAmount:v=1,flickerAmount:y=1,noiseAmp:b=1,chromaticAberration:x=0,dither:S=0,curvature:C=.2,tint:w=`#ffffff`,mouseReact:T=!0,mouseStrength:E=.2,pageLoadAnimation:D=!0,brightness:O=1,glyphs:k=`blocks`,glow:A=.5,persistence:j=.5,scramble:M=.5,mouseGlow:N=.6,vignette:P=.25,clickEffect:F=`glitch`,variation:I,lightMode:L=!1,dpr:R,className:z=``,style:B,...V}){let H=(0,r.useRef)(null),U=(0,r.useRef)(null),W=(0,r.useRef)(null),G={scale:Math.max(.05,e),gridX:Math.max(.1,(t?.[0]??2)*15),gridY:Math.max(.1,(t?.[1]??1)*15),digitSize:n,timeScale:u,pause:d,scanlineIntensity:h,glitchAmount:v,flickerAmount:y,noiseAmp:b,chromaticAberration:x,dither:typeof S==`boolean`?+!!S:S,curvature:C,tint:w,mouseReact:T,mouseStrength:E,pageLoadAnimation:D,brightness:O,glyphs:c[k]??0,glow:m(A,0,3),persistence:m(j,0,1),scramble:m(M,0,1),mouseGlow:m(N,0,1),vignette:m(P,0,1),clickEffect:l[F]??0,clickSeconds:s[F]??1,variation:I,lightMode:L,dpr:R},K=(0,r.useRef)(G);return K.current=G,(0,r.useEffect)(()=>{let e=H.current,t=U.current,n=t?.getContext(`webgl2`,{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1});if(!e||!t||!n)return;let r=g(n,f),i=g(n,p);if(!r||!i)return;let s=r.uniforms,c=i.uniforms,l=n.createVertexArray(),u=()=>{let e=n.createTexture();return n.bindTexture(n.TEXTURE_2D,e),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MAG_FILTER,n.NEAREST),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE),n.texImage2D(n.TEXTURE_2D,0,n.RGBA8,1,1,0,n.RGBA,n.UNSIGNED_BYTE,null),e},d=[0,1].map(()=>{let e=u(),t=u(),r=n.createFramebuffer();return n.bindFramebuffer(n.FRAMEBUFFER,r),n.framebufferTexture2D(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,e,0),n.framebufferTexture2D(n.FRAMEBUFFER,n.COLOR_ATTACHMENT1,n.TEXTURE_2D,t,0),{rings:e,extra:t,framebuffer:r}});n.bindFramebuffer(n.FRAMEBUFFER,null);let h=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches??!1,v={width:1,height:1,ratio:1,columns:1},y={x:0,y:0,w:1,h:1,key:``},b={x:.5,y:.5,inside:!1},x={x:.5,y:.5},S=new Float32Array(16),C=0,w=0,T=0,E=0,D=!0,O=K.current.variation,k=(typeof O==`number`?O*10:Math.random()*100)*K.current.timeScale,A=K.current.pageLoadAnimation&&!h?0:1,j=0,M=0,N=!0,P=0,F=e=>{let t=1+Math.max(0,e.curvature)*2,r=.5-.5*t,i=.5+.5*t,a=.06*Math.max(1,Math.abs(e.glitchAmount))*Math.max(1,Math.abs(e.flickerAmount))+.2,o=e.gridX*v.columns,s=Math.floor((r*e.scale-a)*o)-2,c=Math.floor((i*e.scale+a)*o)+2,l=Math.floor((r*e.scale-a)*e.gridY)-2,u=Math.floor((i*e.scale+a)*e.gridY)+2,f=`${s}:${c}:${l}:${u}`;if(f!==y.key){y.key=f,y.x=s,y.y=l,y.w=Math.max(1,Math.min(4096,c-s+1)),y.h=Math.max(1,Math.min(4096,u-l+1));for(let e of d)for(let t of[e.rings,e.extra])n.bindTexture(n.TEXTURE_2D,t),n.texImage2D(n.TEXTURE_2D,0,n.RGBA8,y.w,y.h,0,n.RGBA,n.UNSIGNED_BYTE,null);D=!0}},I=(e,t)=>{let i=d[E],a=d[1-E];n.bindFramebuffer(n.FRAMEBUFFER,a.framebuffer),n.drawBuffers([n.COLOR_ATTACHMENT0,n.COLOR_ATTACHMENT1]),n.viewport(0,0,y.w,y.h),n.disable(n.BLEND),n.useProgram(r.program),n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,i.rings),n.activeTexture(n.TEXTURE1),n.bindTexture(n.TEXTURE_2D,i.extra),n.uniform1i(s.uPrev0,0),n.uniform1i(s.uPrev1,1),n.uniform1f(s.iTime,k),n.uniform2f(s.uGridMul,e.gridX*v.columns/15,e.gridY/15),n.uniform1f(s.uNoiseAmp,e.noiseAmp),n.uniform1f(s.uScale,e.scale),n.uniform2f(s.uMouse,x.x,x.y),n.uniform1f(s.uMouseStrength,e.mouseStrength),n.uniform1f(s.uUseMouse,+!!e.mouseReact),n.uniform1f(s.uPageLoadProgress,A),n.uniform1f(s.uUsePageLoadAnimation,+!!e.pageLoadAnimation),n.uniform2i(s.uOrigin,y.x,y.y),n.uniform1f(s.uDecay,t),n.uniform1f(s.uFresh,+!!D),n.uniform1f(s.uHover,T),n.bindVertexArray(l),n.drawArrays(n.TRIANGLES,0,3),n.bindFramebuffer(n.FRAMEBUFFER,null),E=1-E,D=!1},L=()=>{let e=K.current,r=d[E];n.viewport(0,0,t.width,t.height),n.clearColor(0,0,0,0),n.clear(n.COLOR_BUFFER_BIT),n.useProgram(i.program),n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,r.rings),n.activeTexture(n.TEXTURE1),n.bindTexture(n.TEXTURE_2D,r.extra),n.uniform1i(c.uRings0,0),n.uniform1i(c.uRings1,1),n.uniform1f(c.iTime,k),n.uniform3f(c.iResolution,t.width,t.height,t.width/t.height),n.uniform1f(c.uScale,e.scale),n.uniform2f(c.uGridMul,e.gridX*v.columns/15,e.gridY/15),n.uniform1f(c.uDigitSize,e.digitSize),n.uniform1f(c.uScanlineIntensity,e.scanlineIntensity),n.uniform1f(c.uGlitchAmount,h?0:e.glitchAmount),n.uniform1f(c.uFlickerAmount,h?0:e.flickerAmount),n.uniform1f(c.uChromaticAberration,e.chromaticAberration),n.uniform1f(c.uDither,e.dither),n.uniform1f(c.uCurvature,e.curvature),n.uniform3fv(c.uTint,_(e.tint)),n.uniform1f(c.uBrightness,e.brightness),n.uniform1f(c.uLightMode,+!!e.lightMode),n.uniform2i(c.uOrigin,y.x,y.y),n.uniform2i(c.uCellCount,y.w,y.h),n.uniform1i(c.uGlyphs,e.glyphs),n.uniform1f(c.uGlow,e.glow),n.uniform1f(c.uScramble,e.scramble),n.uniform1f(c.uMouseGlow,e.mouseGlow),n.uniform1f(c.uVignette,e.vignette),n.uniform4fv(c.uClicks,S),n.uniform1i(c.uClickMode,e.clickEffect),n.uniform1f(c.uClickSeconds,e.clickSeconds),n.uniform1f(c.uClock,w),n.bindVertexArray(l),n.drawArrays(n.TRIANGLES,0,3),n.bindVertexArray(null)},R=()=>{let n=K.current;v.width=Math.max(1,e.clientWidth),v.height=Math.max(1,e.clientHeight),v.ratio=Math.min(n.dpr||window.devicePixelRatio||1,2),v.columns=Math.min(1,v.width/v.height/1.5),t.width=Math.max(1,Math.round(v.width*v.ratio)),t.height=Math.max(1,Math.round(v.height*v.ratio)),F(n),I(n,0),L(),B()},z=e=>{if(j=0,!N||document.hidden)return;let t=K.current,n=M?m((e-M)/1e3,.001,1/20):1/60;M=e,w+=n,!t.pause&&!h&&(k+=n*t.timeScale);let r=b.inside?b.x:.5,i=b.inside?b.y:.5,s=1-Math.exp(-n/(b.inside?.19988:.6));x.x+=(r-x.x)*s,x.y+=(i-x.y)*s,T+=(+!!b.inside-T)*(1-Math.exp(-n/.35));for(let e=0;e<o;e++)S[e*4+3]>0&&w-S[e*4+2]>t.clickSeconds&&(S[e*4+3]=0);F(t);let c=t.persistence>0?Math.exp(-n/(.08+t.persistence*1.4)):0;I(t,c),L(),A<1&&(A=Math.min(1,A+n/a));let l=!(t.pause||h)||A<1;l=l||Math.abs(r-x.x)+Math.abs(i-x.y)>1e-4,l=l||Math.abs(+!!b.inside-T)>.001;for(let e=0;e<o;e++)l=l||S[e*4+3]>0;P=l?0:P+n,P<2.5&&(j=requestAnimationFrame(z))};function B(){P=0,!j&&N&&!document.hidden&&(M=0,j=requestAnimationFrame(z))}let V=t=>{let n=e.getBoundingClientRect(),r=(t.clientX-n.left)/Math.max(n.width,1),i=1-(t.clientY-n.top)/Math.max(n.height,1);return{x:r,y:i,inside:r>=0&&r<=1&&i>=0&&i<=1}},G=e=>{let{x:t,y:n,inside:r}=V(e),i=b.inside;b.inside=r,r&&(b.x=t,b.y=n),(r||i)&&B()},q=e=>{let t=K.current,{x:n,y:r,inside:i}=V(e);if(!i||h||!t.clickEffect)return;let a=C*4;S[a]=n,S[a+1]=r,S[a+2]=w,S[a+3]=1,C=(C+1)%o,B()},J=()=>{b.inside=!1,B()},Y=()=>B(),X=new ResizeObserver(R);X.observe(e);let Z=new IntersectionObserver(e=>{N=e.some(e=>e.isIntersecting),N&&B()});return Z.observe(e),window.addEventListener(`pointermove`,G,{passive:!0}),window.addEventListener(`pointerdown`,q,{passive:!0}),document.documentElement.addEventListener(`pointerleave`,J),document.addEventListener(`visibilitychange`,Y),R(),W.current=B,()=>{cancelAnimationFrame(j),W.current=null,X.disconnect(),Z.disconnect(),window.removeEventListener(`pointermove`,G),window.removeEventListener(`pointerdown`,q),document.documentElement.removeEventListener(`pointerleave`,J),document.removeEventListener(`visibilitychange`,Y);for(let e of d)n.deleteTexture(e.rings),n.deleteTexture(e.extra),n.deleteFramebuffer(e.framebuffer);n.deleteVertexArray(l),n.deleteProgram(r.program),n.deleteProgram(i.program),n.getExtension(`WEBGL_lose_context`)?.loseContext()}},[]),(0,r.useEffect)(()=>{W.current?.()}),(0,i.jsx)(`div`,{ref:H,className:[`relative h-full w-full overflow-hidden`,z].filter(Boolean).join(` `),style:B,...V,children:(0,i.jsx)(`canvas`,{ref:U,className:`absolute inset-0 block h-full w-full`,"aria-hidden":`true`})})}export{v as default};