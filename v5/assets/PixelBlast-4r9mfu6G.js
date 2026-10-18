import{i as e,t}from"./react-sySUN5R7.js";import{O as n}from"./sculpture-dark-Cfb-XN1r.js";var r=e(t(),1),i=n(),a=10,o=1.8,s={square:0,circle:1,triangle:2,diamond:3,cross:4,ring:5},c={none:0,grow:1,reveal:2},l=(e,t)=>(Math.floor(e)/2+Math.floor(t)*Math.floor(t)*.75)%1,u=(e,t)=>(l(e/4,t/4)*.25+l(e/2,t/2))*.25+l(e,t),d=Array.from({length:64},(e,t)=>u(t%8,Math.floor(t/8)).toFixed(6)).join(`, `),f=-6,p=10,m=`#version 300 es
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`,h=`
const float RANGE_MIN = ${f.toFixed(1)};
const float RANGE_MAX = ${p.toFixed(1)};

vec2 pack16(float value) {
  float x = floor(clamp((value - RANGE_MIN) / (RANGE_MAX - RANGE_MIN), 0.0, 1.0) * 65535.0 + 0.5);
  float hi = floor(x / 256.0);
  return vec2(hi, x - hi * 256.0) / 255.0;
}

float unpack16(vec2 c) {
  float x = floor(c.x * 255.0 + 0.5) * 256.0 + floor(c.y * 255.0 + 0.5);
  return RANGE_MIN + x / 65535.0 * (RANGE_MAX - RANGE_MIN);
}
`,g=`#version 300 es
precision highp float;
precision highp int;

uniform vec2 uResolution;
uniform float uTime;
uniform float uPixelSize;
uniform float uScale;
uniform float uDensity;
uniform int uEnableRipples;
uniform float uRippleSpeed;
uniform float uRippleThickness;
uniform float uRippleIntensity;
uniform vec2 uClickPos[${a}];
uniform float uClickAge[${a}];
uniform ivec2 uOrigin;
uniform vec2 uDrift;
uniform int uHover;
uniform vec2 uMouse;
uniform float uMouseRadius;
uniform float uMousePresence;
uniform float uIntro;
uniform sampler2D uPrev;
uniform float uDecay;
uniform float uFresh;

out vec4 outCell;
${h}
float hash11(float n) { return fract(sin(n) * 43758.5453); }

float vnoise(vec3 p) {
  vec3 ip = floor(p);
  vec3 fp = fract(p);
  float n000 = hash11(dot(ip + vec3(0.0, 0.0, 0.0), vec3(1.0, 57.0, 113.0)));
  float n100 = hash11(dot(ip + vec3(1.0, 0.0, 0.0), vec3(1.0, 57.0, 113.0)));
  float n010 = hash11(dot(ip + vec3(0.0, 1.0, 0.0), vec3(1.0, 57.0, 113.0)));
  float n110 = hash11(dot(ip + vec3(1.0, 1.0, 0.0), vec3(1.0, 57.0, 113.0)));
  float n001 = hash11(dot(ip + vec3(0.0, 0.0, 1.0), vec3(1.0, 57.0, 113.0)));
  float n101 = hash11(dot(ip + vec3(1.0, 0.0, 1.0), vec3(1.0, 57.0, 113.0)));
  float n011 = hash11(dot(ip + vec3(0.0, 1.0, 1.0), vec3(1.0, 57.0, 113.0)));
  float n111 = hash11(dot(ip + vec3(1.0, 1.0, 1.0), vec3(1.0, 57.0, 113.0)));
  vec3 w = fp * fp * fp * (fp * (fp * 6.0 - 15.0) + 10.0);
  float x00 = mix(n000, n100, w.x);
  float x10 = mix(n010, n110, w.x);
  float x01 = mix(n001, n101, w.x);
  float x11 = mix(n011, n111, w.x);
  float y0 = mix(x00, x10, w.y);
  float y1 = mix(x01, x11, w.y);
  return mix(y0, y1, w.z) * 2.0 - 1.0;
}

float fbm2(vec2 uv, float t) {
  vec3 p = vec3(uv * uScale, t);
  float amp = 1.0;
  float freq = 1.0;
  float sum = 1.0;
  for (int i = 0; i < 5; ++i) {
    sum += amp * vnoise(p * freq);
    freq *= 1.25;
    amp *= 1.0;
  }
  return sum * 0.5 + 0.5;
}

void main() {
  ivec2 texel = ivec2(gl_FragCoord.xy);
  float aspectRatio = uResolution.x / uResolution.y;
  float cellPixelSize = 8.0 * uPixelSize;
  vec2 cellId = vec2(texel + uOrigin);
  vec2 cellCoord = cellId * cellPixelSize;
  vec2 uv = cellCoord / uResolution * vec2(aspectRatio, 1.0);

  float base = fbm2(uv + uDrift, uTime * 0.05);
  base = base * 0.5 - 0.65;
  float feed = base + (uDensity - 0.5) * 0.3;
  if (uEnableRipples == 1) {
    for (int i = 0; i < ${a}; ++i) {
      vec2 pos = uClickPos[i];
      if (pos.x < 0.0) continue;
      vec2 cuv = (((pos - uResolution * 0.5 - cellPixelSize * 0.5) / uResolution)) * vec2(aspectRatio, 1.0);
      float t = max(uClickAge[i], 0.0);
      float r = distance(uv, cuv);
      float waveR = uRippleSpeed * t;
      float ring = exp(-pow((r - waveR) / uRippleThickness, 2.0));
      float atten = exp(-1.0 * t) * exp(-10.0 * r);
      feed = max(feed, ring * atten * uRippleIntensity);
    }
  }

  if (uIntro < 1.0) {
    vec2 center = (-cellPixelSize * 0.5 / uResolution) * vec2(aspectRatio, 1.0);
    float reach = length(vec2(aspectRatio, 1.0)) * 0.5 + 0.2;
    float eased = 1.0 - pow(1.0 - uIntro, 2.4);
    float front = eased * reach;
    float r = distance(uv, center);
    float shown = smoothstep(front + 0.04, front - 0.06, r);
    float ring = exp(-pow((r - front) / 0.07, 2.0)) * (1.0 - uIntro);
    feed = mix(-1.0, feed, shown);
    feed = max(feed, ring * 1.4);
  }

  float brush = 0.0;
  if (uHover > 0) {
    vec2 d = (cellCoord + cellPixelSize * 0.5 + uResolution * 0.5 - uMouse) / max(uMouseRadius, 1.0);
    brush = exp(-dot(d, d)) * uMousePresence;
  }
  vec4 prev = texelFetch(uPrev, texel, 0) * (1.0 - uFresh);
  float trail = max(brush, max(prev.a * uDecay - 1.0 / 255.0, 0.0));
  if (uHover == 2) feed += trail * 0.9;

  outCell = vec4(pack16(feed), clamp((feed + 0.5) * 0.5, 0.0, 1.0), trail);
}`,_=`#version 300 es
precision highp float;
precision highp int;

uniform vec3 uColor;
uniform vec3 uAccent;
uniform vec2 uResolution;
uniform float uTime;
uniform float uClock;
uniform float uPixelSize;
uniform float uPixelJitter;
uniform float uEdgeFade;
uniform int uShapeType;
uniform sampler2D uCells;
uniform ivec2 uOrigin;
uniform ivec2 uCellCount;
uniform float uSoftness;
uniform float uSmoothing;
uniform float uGlow;
uniform float uTwinkle;
uniform float uLightMode;
uniform float uTransparent;
uniform float uNoise;
uniform int uHover;
uniform mat3 uPlane;
uniform float uTilted;

out vec4 fragColor;
${h}
const float BAYER[64] = float[64](${d});

vec2 gDx;
vec2 gDy;

float aaFrom(vec2 grad) {
  return abs(dot(grad, gDx)) + abs(dot(grad, gDy));
}

float maskSquare(vec2 p, float cov, float soft) {
  if (soft <= 0.0) return cov;
  float side = 0.5 * sqrt(clamp(cov, 0.0, 1.0));
  vec2 c = p - 0.5;
  vec2 q = abs(c) - side;
  float d = max(q.x, q.y);
  vec2 grad = q.x > q.y ? vec2(sign(c.x), 0.0) : vec2(0.0, sign(c.y));
  float aa = max(aaFrom(grad), 1e-4);
  return 1.0 - smoothstep(-aa * 0.5, aa * 0.5, d);
}

float maskCircle(vec2 p, float cov) {
  float r = sqrt(cov) * 0.25;
  vec2 c = p - 0.5;
  float len = length(c);
  float d = len - r;
  float aa = 0.5 * aaFrom(c / max(len, 1e-5));
  return cov * (1.0 - smoothstep(-aa, aa, d * 2.0));
}

float maskTriangle(vec2 p, vec2 id, float cov) {
  bool flip = mod(id.x + id.y, 2.0) > 0.5;
  if (flip) p.x = 1.0 - p.x;
  float r = sqrt(cov);
  float d = p.y - r * (1.0 - p.x);
  float aa = max(aaFrom(vec2(flip ? -r : r, 1.0)), 1e-4);
  return cov * clamp(0.5 - d / aa, 0.0, 1.0);
}

float maskDiamond(vec2 p, float cov) {
  float r = sqrt(cov) * 0.564;
  return step(abs(p.x - 0.49) + abs(p.y - 0.49), r);
}

float maskCross(vec2 p, float cov) {
  float s = sqrt(clamp(cov, 0.0, 1.0));
  vec2 c = p - 0.5;
  vec2 q = abs(c);
  float arm = 0.42 * s;
  float bar = 0.13 * s + 0.02;
  float a1 = max(q.x - arm, q.y - bar);
  float a2 = max(q.x - bar, q.y - arm);
  float d = min(a1, a2);
  bool horizontal = a1 < a2 ? q.x - arm > q.y - bar : q.x - bar > q.y - arm;
  vec2 grad = horizontal ? vec2(sign(c.x), 0.0) : vec2(0.0, sign(c.y));
  float aa = max(aaFrom(grad), 1e-4);
  return 1.0 - smoothstep(-aa * 0.5, aa * 0.5, d);
}

float maskRing(vec2 p, float cov) {
  float s = sqrt(clamp(cov, 0.0, 1.0));
  vec2 c = p - 0.5;
  float len = length(c);
  float d = abs(len - 0.3 * s) - 0.09 * s;
  vec2 grad = sign(len - 0.3 * s) * c / max(len, 1e-5);
  float aa = max(aaFrom(grad), 1e-4);
  return 1.0 - smoothstep(-aa * 0.5, aa * 0.5, d);
}

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  float pixelSize = uPixelSize;
  vec2 screen = gl_FragCoord.xy;
  vec4 empty = uTransparent < 0.5 ? vec4(vec3(uLightMode > 0.5 ? 1.0 : 0.0), 1.0) : vec4(0.0);

  float lod = 0.0;
  float depthFade = 1.0;
  if (uTilted > 0.5) {
    vec3 plane = uPlane * vec3(screen.x, uResolution.y - screen.y, 1.0);
    screen = vec2(plane.x, uResolution.y * plane.z - plane.y) / max(plane.z, 1e-4);
    float footprint = length(fwidth(screen));
    lod = smoothstep(0.3, 0.85, footprint / pixelSize);
    depthFade = (1.0 - smoothstep(0.45, 1.0, footprint / (8.0 * pixelSize))) * step(0.0, plane.z);
  }

  vec2 fragCoord = screen - uResolution * 0.5;
  gDx = dFdx(fragCoord) / pixelSize;
  gDy = dFdy(fragCoord) / pixelSize;
  if (depthFade <= 0.0) {
    fragColor = empty;
    return;
  }

  float cellPixelSize = 8.0 * pixelSize;
  vec2 cellId = floor(fragCoord / cellPixelSize);
  ivec2 texel = clamp(ivec2(cellId) - uOrigin, ivec2(0), uCellCount - 1);
  vec2 smoothAt = (fragCoord / cellPixelSize - vec2(uOrigin)) / vec2(uCellCount);
  vec4 blended = texture(uCells, smoothAt);
  float smoothFeed = blended.b * 2.0 - 0.5;
  float feed = smoothFeed;
  float trail = uHover == 1 ? blended.a : 0.0;
  if (uSmoothing < 1.0) {
    vec4 cell = texelFetch(uCells, texel, 0);
    feed = mix(unpack16(cell.rg), smoothFeed, uSmoothing);
    if (uHover == 1) trail = mix(cell.a, blended.a, uSmoothing);
  }

  if (feed < -0.12 * uSoftness && smoothFeed < 0.2 && (lod <= 0.0 || smoothFeed <= 0.0)) {
    fragColor = empty;
    return;
  }

  vec2 pixelId = floor(fragCoord / pixelSize);
  vec2 pixelUV = fragCoord / pixelSize - pixelId;
  ivec2 cellBits = ivec2(mod(pixelId, 8.0));
  float bayer = BAYER[cellBits.y * 8 + cellBits.x] - 0.5;
  float margin = feed + bayer - 0.5;
  float bw = uSoftness > 0.0 ? smoothstep(-0.12 * uSoftness, 0.12 * uSoftness, margin) : step(0.0, margin);

  float h = uPixelJitter > 0.0 || uTwinkle > 0.0 ? fract(sin(dot(pixelId, vec2(127.1, 311.7))) * 43758.5453) : 0.5;
  float jitterScale = 1.0 + (h - 0.5) * uPixelJitter;
  float heat = max(trail, clamp((feed - 1.0) * 2.5, 0.0, 1.0) * min(uGlow * 2.0, 1.0));
  float coverage = bw * jitterScale * (1.0 + heat * 0.35);
  float M;
  float area;
  if (uShapeType == 1) {
    M = maskCircle(pixelUV, coverage);
    area = 0.196;
  } else if (uShapeType == 2) {
    M = maskTriangle(pixelUV, pixelId, coverage);
    area = 0.5;
  } else if (uShapeType == 3) {
    M = maskDiamond(pixelUV, coverage);
    area = 0.62;
  } else if (uShapeType == 4) {
    M = maskCross(pixelUV, coverage);
    area = 0.41;
  } else if (uShapeType == 5) {
    M = maskRing(pixelUV, coverage);
    area = 0.41;
  } else {
    M = maskSquare(pixelUV, coverage, uSoftness);
    area = 1.0;
  }
  if (lod > 0.0) {
    float average = clamp(smoothFeed, 0.0, 1.0) * area * (1.0 + heat * 0.35);
    M = mix(M, average, lod);
  }

  if (uTwinkle > 0.0) {
    float rate = 1.5 + 3.0 * fract(h * 7.31);
    float wave = 0.5 + 0.5 * sin(uClock * rate + h * 37.0);
    M *= 1.0 - uTwinkle * 0.55 * wave * wave;
  }

  float density = clamp(smoothFeed, 0.0, 1.0);
  float glow = 0.0;
  if (uGlow > 0.0) {
    float bloom = smoothstep(0.2, 1.0, density);
    glow = bloom * bloom * uGlow * (uLightMode > 0.5 ? 0.12 : 0.22) * depthFade;
  }

  float fade = depthFade;
  if (uEdgeFade > 0.0) {
    vec2 norm = gl_FragCoord.xy / uResolution;
    vec2 edgeA = clamp(norm / uEdgeFade, 0.0, 1.0);
    vec2 edgeB = clamp((1.0 - norm) / uEdgeFade, 0.0, 1.0);
    vec2 sa = edgeA * edgeA * edgeA * (edgeA * (edgeA * 6.0 - 15.0) + 10.0);
    vec2 sb = edgeB * edgeB * edgeB * (edgeB * (edgeB * 6.0 - 15.0) + 10.0);
    fade *= sa.x * sa.y * sb.x * sb.y;
  }
  M = clamp(M, 0.0, 1.0) * fade;
  glow *= fade;

  float hot = clamp(heat, 0.0, 1.0);
  float tone = smoothstep(0.3, 1.0, density) * 0.85;
  vec3 color = mix(uColor, uAccent, max(tone, hot));
  vec3 lit = uLightMode > 0.5 ? color * (1.0 - 0.35 * hot) : mix(color, vec3(1.0), 0.45 * hot);
  if (uNoise > 0.0) {
    float n = hash(floor(gl_FragCoord.xy) + floor(uTime * 60.0));
    lit = clamp(lit + (n - 0.5) * uNoise, 0.0, 1.0);
  }

  vec3 haze = uLightMode > 0.5 ? mix(color, vec3(1.0), 0.35) : color;
  float alpha = M + glow * (1.0 - M);
  vec3 premul = lit * M + haze * glow * (1.0 - M);
  if (uTransparent < 0.5) {
    vec3 paper = vec3(uLightMode > 0.5 ? 1.0 : 0.0);
    fragColor = vec4(premul + paper * (1.0 - alpha), 1.0);
    return;
  }
  fragColor = vec4(premul, alpha);
}`,v=(e,t,n)=>Math.min(n,Math.max(t,e)),y=(e,t,n)=>{let r=e.createShader(t);return r?(e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(e.deleteShader(r),null)):null},b=(e,t)=>{let n=y(e,e.VERTEX_SHADER,m),r=y(e,e.FRAGMENT_SHADER,t),i=e.createProgram();if(!n||!r||!i)return null;if(e.attachShader(i,n),e.attachShader(i,r),e.linkProgram(i),e.deleteShader(n),e.deleteShader(r),!e.getProgramParameter(i,e.LINK_STATUS))return e.deleteProgram(i),null;let a={},o=e.getProgramParameter(i,e.ACTIVE_UNIFORMS);for(let t=0;t<o;t++){let n=e.getActiveUniform(i,t);if(!n)continue;let r=n.name.replace(/\[0\]$/,``);a[r]=e.getUniformLocation(i,r)}return{program:i,uniforms:a}},x=new Map,S=e=>{let t=String(e),n=x.get(t);if(n)return n;let r=C(e);return x.size>64&&x.clear(),x.set(t,r),r},C=e=>{let t=String(e||`#ffffff`).replace(`#`,``).trim();(t.length===3||t.length===4)&&(t=t.slice(0,3).split(``).map(e=>e+e).join(``));let n=parseInt(t.slice(0,6),16);return Number.isNaN(n)?[1,1,1]:[(n>>16&255)/255,(n>>8&255)/255,(n&255)/255]},ee=()=>{if(typeof window<`u`&&window.crypto?.getRandomValues){let e=new Uint32Array(1);return window.crypto.getRandomValues(e),e[0]/4294967295}return Math.random()},w=e=>{let[t,n,r,i,a,o,s,c,l]=e,u=a*l-o*c,d=-(i*l-o*s),f=i*c-a*s,p=t*u+n*d+r*f||1;return[u/p,-(n*l-r*c)/p,(n*o-r*a)/p,d/p,(t*l-r*s)/p,-(t*o-r*i)/p,f/p,-(t*c-n*s)/p,(t*a-n*i)/p]},T=(e,t)=>{let n=Array(9);for(let r=0;r<3;r++)for(let i=0;i<3;i++)n[r*3+i]=e[r*3]*t[i]+e[r*3+1]*t[3+i]+e[r*3+2]*t[6+i];return n},te=(e,t,n,r)=>{let i=e*Math.PI/180,a=t*Math.PI/180,o=Math.max(n,r)*1.25,s=n/2,c=r/2,l=[Math.cos(a),0,0,Math.sin(i)*Math.sin(a),Math.cos(i),0,Math.sin(a)*Math.cos(i)/o,-Math.sin(i)/o,1];return w(T(T([1,0,s,0,1,c,0,0,1],l),[1,0,-s,0,1,-c,0,0,1]))},E=({variant:e=`square`,pixelSize:t=3,color:n=`#B497CF`,accentColor:l,className:u,style:d,patternScale:f=2,patternDensity:p=1,pixelSizeJitter:m=0,enableRipples:h=!0,rippleIntensityScale:y=1,rippleThickness:x=.1,rippleSpeed:C=.3,autoPauseOffscreen:w=!0,speed:T=.5,transparent:E=!0,edgeFade:D=.5,noiseAmount:O=0,softness:k=.6,smoothing:A=1,glow:j=.4,twinkle:M=.25,drift:N=.2,driftAngle:P=30,hoverEffect:F=`reveal`,hoverRadius:I=140,autoRipple:L=0,tiltX:R=0,tiltY:z=0,intro:B=!0,variation:V,lightMode:H=!1,dpr:U})=>{let W=(0,r.useRef)(null),G=(0,r.useRef)(null),K=(0,r.useRef)(null),q={variant:s[e]??0,pixelSize:Math.max(.5,t),color:n,accentColor:l||n,patternScale:f,patternDensity:p,pixelSizeJitter:m,enableRipples:h,rippleIntensityScale:y,rippleThickness:Math.max(.001,x),rippleSpeed:C,autoPauseOffscreen:w,speed:T,transparent:E,edgeFade:v(D,0,1),noiseAmount:O,softness:v(k,0,1),smoothing:v(A,0,1),glow:v(j,0,2),twinkle:v(M,0,1),drift:N,driftAngle:P,hoverEffect:c[F]??0,hoverRadius:Math.max(10,I),autoRipple:Math.max(0,L),tiltX:v(R,-70,70),tiltY:v(z,-70,70),intro:B,variation:V,lightMode:H,dpr:U},J=(0,r.useRef)(q);return J.current=q,(0,r.useEffect)(()=>{let e=W.current,t=G.current,n=t?.getContext(`webgl2`,{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1});if(!e||!t||!n)return;let r=b(n,g),i=b(n,_);if(!r||!i)return;let s=r.uniforms,c=i.uniforms,l=n.createVertexArray(),u=e=>{let t=n.createTexture();return n.bindTexture(n.TEXTURE_2D,t),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,e),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MAG_FILTER,e),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE),n.texImage2D(n.TEXTURE_2D,0,n.RGBA8,1,1,0,n.RGBA,n.UNSIGNED_BYTE,null),t},d=[0,1].map(()=>{let e=u(n.LINEAR),t=n.createFramebuffer();return n.bindFramebuffer(n.FRAMEBUFFER,t),n.framebufferTexture2D(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,e,0),{texture:e,framebuffer:t}});n.bindFramebuffer(n.FRAMEBUFFER,null);let f=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches??!1,p={width:1,height:1,ratio:1,plane:null,tiltKey:``},m={x:0,y:0,w:1,h:1,key:``},h={x:0,y:0,inside:!1},y={x:0,y:0,ready:!1},x=new Float32Array(20).fill(-1),C=new Float32Array(a),w=new Float32Array(a),T=0,E=0,D=!0,O=J.current.variation,k=typeof O==`number`?O*37:ee()*1e3,A=0,j=0,M=0,N=0,P=0,F=J.current.intro&&!f?0:1,I=1.2,L=0,R=0,z=!0,B=0,V=e=>k+A*e.speed,H=e=>{let r=8*(e.pixelSize*p.ratio),i=t.width,a=t.height,o=-i/2,s=i/2,c=-a/2,l=a/2;if(p.plane){let e=[[0,0],[i,0],[0,a],[i,a],[i/2,0],[i/2,a],[0,a/2],[i,a/2]];o=1/0,s=-1/0,c=1/0,l=-1/0;for(let[t,n]of e){let[e,r]=X(t,n);e<-1e5||(o=Math.min(o,e-i/2),s=Math.max(s,e-i/2),c=Math.min(c,r-a/2),l=Math.max(l,r-a/2))}Number.isFinite(o)||(o=-i/2,s=i/2,c=-a/2,l=a/2)}let u=r,f=Math.floor((o-u)/r),h=Math.floor((s+u)/r),g=Math.floor((c-u)/r),_=Math.floor((l+u)/r),v=Math.max(1,Math.min(2048,h-f+1)),y=Math.max(1,Math.min(2048,_-g+1)),b=`${f}:${g}:${v}:${y}`;if(b!==m.key){m.key=b,m.x=f,m.y=g,m.w=v,m.h=y;for(let e of d)n.bindTexture(n.TEXTURE_2D,e.texture),n.texImage2D(n.TEXTURE_2D,0,n.RGBA8,v,y,0,n.RGBA,n.UNSIGNED_BYTE,null);D=!0}},U=new Float32Array(20),q=(e,i)=>{for(let e=0;e<a;e++){if(x[e*2]<0){U[e*2]=-1,U[e*2+1]=-1;continue}let[t,n]=X(x[e*2],x[e*2+1]);U[e*2]=Math.max(t,0),U[e*2+1]=n}let[o,c]=X(y.x,y.y),u=d[E],f=d[1-E];n.bindFramebuffer(n.FRAMEBUFFER,f.framebuffer),n.viewport(0,0,m.w,m.h),n.disable(n.BLEND),n.useProgram(r.program),n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,u.texture),n.uniform1i(s.uPrev,0),n.uniform2f(s.uResolution,t.width,t.height),n.uniform1f(s.uTime,V(e)),n.uniform1f(s.uPixelSize,e.pixelSize*p.ratio),n.uniform1f(s.uScale,e.patternScale),n.uniform1f(s.uDensity,e.patternDensity),n.uniform1i(s.uEnableRipples,+!!e.enableRipples),n.uniform1f(s.uRippleSpeed,e.rippleSpeed),n.uniform1f(s.uRippleThickness,e.rippleThickness),n.uniform1f(s.uRippleIntensity,e.rippleIntensityScale),n.uniform2fv(s.uClickPos,U),n.uniform1fv(s.uClickAge,w),n.uniform2i(s.uOrigin,m.x,m.y),n.uniform2f(s.uDrift,N,P),n.uniform1i(s.uHover,e.hoverEffect),n.uniform2f(s.uMouse,o,c),n.uniform1f(s.uMouseRadius,e.hoverRadius*p.ratio),n.uniform1f(s.uMousePresence,M),n.uniform1f(s.uIntro,F),n.uniform1f(s.uDecay,i),n.uniform1f(s.uFresh,+!!D),n.bindVertexArray(l),n.drawArrays(n.TRIANGLES,0,3),n.bindFramebuffer(n.FRAMEBUFFER,null),E=1-E,D=!1},Y=()=>{let e=J.current;if(n.viewport(0,0,t.width,t.height),n.clearColor(0,0,0,0),n.clear(n.COLOR_BUFFER_BIT),n.useProgram(i.program),n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,d[E].texture),n.uniform1i(c.uCells,0),n.uniform3fv(c.uColor,S(e.color)),n.uniform3fv(c.uAccent,S(e.accentColor)),n.uniform2f(c.uResolution,t.width,t.height),n.uniform1f(c.uTime,V(e)),n.uniform1f(c.uClock,j),n.uniform1f(c.uPixelSize,e.pixelSize*p.ratio),n.uniform1f(c.uPixelJitter,e.pixelSizeJitter),n.uniform1f(c.uEdgeFade,e.edgeFade),n.uniform1i(c.uShapeType,e.variant),n.uniform2i(c.uOrigin,m.x,m.y),n.uniform2i(c.uCellCount,m.w,m.h),n.uniform1f(c.uSoftness,e.softness),n.uniform1f(c.uSmoothing,e.smoothing),n.uniform1f(c.uGlow,e.glow),n.uniform1f(c.uTwinkle,f?0:e.twinkle),n.uniform1f(c.uLightMode,+!!e.lightMode),n.uniform1f(c.uTransparent,+!!e.transparent),n.uniform1f(c.uNoise,e.noiseAmount),n.uniform1i(c.uHover,e.hoverEffect),n.uniform1f(c.uTilted,+!!p.plane),p.plane){let e=p.plane;n.uniformMatrix3fv(c.uPlane,!1,[e[0],e[3],e[6],e[1],e[4],e[7],e[2],e[5],e[8]])}n.bindVertexArray(l),n.drawArrays(n.TRIANGLES,0,3),n.bindVertexArray(null)},X=(e,n)=>{let r=p.plane;if(!r)return[e,n];let i=t.height,a=i-n,o=r[6]*e+r[7]*a+r[8];return o<=1e-4?[-1e6,-1e6]:[(r[0]*e+r[1]*a+r[2])/o,i-(r[3]*e+r[4]*a+r[5])/o]},Z=e=>{p.plane=e.tiltX||e.tiltY?te(e.tiltX,e.tiltY,t.width,t.height):null,p.tiltKey=`${e.tiltX}:${e.tiltY}:${t.width}:${t.height}`},Q=()=>{let n=J.current;p.width=Math.max(1,e.clientWidth),p.height=Math.max(1,e.clientHeight),p.ratio=Math.min(n.dpr||window.devicePixelRatio||1,2),t.width=Math.max(1,Math.round(p.width*p.ratio)),t.height=Math.max(1,Math.round(p.height*p.ratio)),y.ready||(y.ready=!0,y.x=t.width/2,y.y=t.height/2),Z(n),H(n),q(n,0),Y(),$()},ne=e=>{L=0;let n=J.current;if(!z&&n.autoPauseOffscreen||document.hidden)return;let r=R?v((e-R)/1e3,0,1/20):0;if(R=e,f||(A+=r),j+=r,!f&&n.drift){let e=n.driftAngle*Math.PI/180;N+=Math.cos(e)*n.drift*r*.05,P+=Math.sin(e)*n.drift*r*.05}!f&&n.enableRipples&&n.autoRipple>0&&F>=1&&(I-=r,I<=0&&(I=n.autoRipple*(.7+Math.random()*.6),ae((.15+Math.random()*.7)*p.width,(.15+Math.random()*.7)*p.height)));for(let e=0;e<a;e++)w[e]=(j-C[e])*.5;let i=h.x*p.ratio,s=(p.height-h.y)*p.ratio,c=1-Math.exp(-r/.08);h.inside&&(y.x+=(i-y.x)*c,y.y+=(s-y.y)*c),M+=(+!!h.inside-M)*(1-Math.exp(-r/.25)),`${n.tiltX}:${n.tiltY}:${t.width}:${t.height}`!==p.tiltKey&&Z(n),H(n);let l=n.hoverEffect?Math.exp(-r/.45):0;q(n,l),Y(),F<1&&(F=Math.min(1,F+r/o));let u=!f&&(n.speed!==0||n.drift!==0||n.twinkle>0||n.autoRipple>0&&n.enableRipples);u=u||F<1||M>.001;for(let e=0;e<a;e++)u=u||x[e*2]>=0&&w[e]<8;B=u?0:B+r,B<1.5&&(L=requestAnimationFrame(ne))};function $(){B=0,!L&&(z||!J.current.autoPauseOffscreen)&&!document.hidden&&(R=0,L=requestAnimationFrame(ne))}let re=t=>{let n=e.getBoundingClientRect(),r=t.clientX-n.left,i=t.clientY-n.top;return{x:r,y:i,inside:r>=0&&i>=0&&r<=n.width&&i<=n.height}},ie=e=>{let{x:t,y:n,inside:r}=re(e),i=h.inside;h.inside=r,r&&(h.x=t,h.y=n,i||(y.x=t*p.ratio,y.y=(p.height-n)*p.ratio)),(r||i)&&$()};function ae(e,t){x[T*2]=e*p.ratio,x[T*2+1]=(p.height-t)*p.ratio,C[T]=j,T=(T+1)%a,$()}let oe=e=>{let t=J.current,{x:n,y:r,inside:i}=re(e);i&&!f&&t.enableRipples&&ae(n,r)},se=()=>{h.inside=!1,$()},ce=()=>$(),le=new ResizeObserver(Q);le.observe(e);let ue=new IntersectionObserver(e=>{z=e.some(e=>e.isIntersecting),z&&$()});return ue.observe(e),window.addEventListener(`pointermove`,ie,{passive:!0}),window.addEventListener(`pointerdown`,oe,{passive:!0}),document.documentElement.addEventListener(`pointerleave`,se),document.addEventListener(`visibilitychange`,ce),Q(),K.current=$,()=>{cancelAnimationFrame(L),K.current=null,le.disconnect(),ue.disconnect(),window.removeEventListener(`pointermove`,ie),window.removeEventListener(`pointerdown`,oe),document.documentElement.removeEventListener(`pointerleave`,se),document.removeEventListener(`visibilitychange`,ce);for(let e of d)n.deleteTexture(e.texture),n.deleteFramebuffer(e.framebuffer);n.deleteVertexArray(l),n.deleteProgram(r.program),n.deleteProgram(i.program),n.getExtension(`WEBGL_lose_context`)?.loseContext()}},[]),(0,r.useEffect)(()=>{K.current?.()}),(0,i.jsx)(`div`,{ref:W,className:[`relative h-full w-full overflow-hidden`,u].filter(Boolean).join(` `),style:d,"aria-label":`PixelBlast interactive background`,children:(0,i.jsx)(`canvas`,{ref:G,className:`absolute inset-0 block h-full w-full`,"aria-hidden":`true`})})};export{E as default};