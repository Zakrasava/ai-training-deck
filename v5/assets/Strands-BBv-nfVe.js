import{i as e,t}from"./react-sySUN5R7.js";import{O as n}from"./sculpture-dark-Cfb-XN1r.js";var r=e(t(),1),i=n(),a=8,o=7,s=`#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`,c=`#version 300 es
precision highp float;

uniform vec2 uResolution;
uniform vec3 uMotion;
uniform float uLevel;
uniform vec3 uColors[8];
uniform int uCount;
uniform float uAmplitude;
uniform float uWaviness;
uniform float uThickness;
uniform float uGlow;
uniform float uTaper;
uniform float uSpread;
uniform float uHueShift;
uniform float uIntensity;
uniform float uSaturation;
uniform float uScale;
uniform float uGlass;
uniform float uRadius;
uniform float uRefraction;
uniform float uDispersion;
uniform float uRim;
uniform vec2 uLean;
uniform float uIntro;
uniform float uPulse;
uniform float uLight;
uniform float uOpacity;

out vec4 fragColor;

const int NB = 10;
const float PI = 3.14159265;

vec3 hueRotate(vec3 c, float a) {
  const mat3 toYiq = mat3(0.299, 0.596, 0.211, 0.587, -0.274, -0.523, 0.114, -0.322, 0.312);
  const mat3 toRgb = mat3(1.0, 1.0, 1.0, 0.956, -0.272, -1.106, 0.621, -0.647, 1.703);
  vec3 yiq = toYiq * c;
  float ca = cos(a);
  float sa = sin(a);
  yiq.yz = mat2(ca, sa, -sa, ca) * yiq.yz;
  return max(toRgb * yiq, 0.0);
}

vec3 grade(vec3 c) {
  float g = dot(c, vec3(0.2126, 0.7152, 0.0722));
  c = clamp(mix(vec3(g), c, 1.5 * uSaturation), 0.0, 1.0);
  return hueRotate(c, uHueShift * 6.2831853);
}

vec3 lightInk(vec3 L, float halo, vec3 body) {
  vec3 Lg = grade(L);
  float lum = dot(Lg, vec3(0.2126, 0.7152, 0.0722));
  float cov = 1.0 - exp(-lum * 2.6);
  vec3 hue = Lg / max(max(Lg.r, max(Lg.g, Lg.b)), 1e-4);
  float white = pow(clamp(min(hue.r, min(hue.g, hue.b)), 0.0, 1.0), 1.4);
  vec3 ink = pow(hue, vec3(2.2)) * 0.88;
  float coreAmt = white * smoothstep(0.05, 2.2, lum) * 0.92;
  vec3 cream = mix(mix(uColors[3], vec3(1.0), 0.3), vec3(1.0, 0.985, 0.95), smoothstep(1.2, 3.5, lum));
  vec3 c = mix(body, vec3(0.66, 0.69, 0.76), halo * 0.32);
  c = mix(c, ink, cov * (1.0 - white));
  return mix(c, cream, clamp(coreAmt, 0.0, 1.0));
}

float sstep(float a, float b, float x) {
  float t = clamp((x - a) / (b - a), 0.0, 1.0);
  return t * t * (3.0 - 2.0 * t);
}

float erfa(float x) {
  float a = abs(x);
  float t = 1.0 / (1.0 + 0.3275911 * a);
  float y = 1.0 - ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * exp(-a * a);
  return x < 0.0 ? -y : y;
}

vec3 grad4(vec3 c0, vec3 c1, vec3 c2, vec3 c3, float p1, float p2, float f) {
  vec3 c = mix(c0, c1, sstep(0.0, p1, f));
  c = mix(c, c2, sstep(p1, p2, f));
  return mix(c, c3, sstep(p2, 1.0, f));
}

float smaxk(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(a, b, h) + k * h * (1.0 - h);
}

vec2 sheetW(float tt, float H, float sig, float sigB, float ridges) {
  float ew = 0.04 * uThickness;
  float res0;
  float res1;
  for (int pass = 0; pass < 2; pass++) {
    float sg = pass == 0 ? sig : sigB;
    float fill = 0.5 * (erfa(tt / sg) - erfa((tt - H) / sg)) / H;
    float se = sqrt(sg * sg + 0.25 * ew * ew * H * H);
    float de = (tt - H + 0.5 * ew * H) / se;
    float eg = exp(-de * de) / (se * 1.7724539);
    float rgw = sqrt(sg * sg + 0.0025 * H * H);
    float d1 = (tt - 0.45 * H) / rgw;
    float d2 = (tt - 0.241 * H) / rgw;
    float rid = 0.04 * (exp(-d1 * d1) * step(1.5, ridges) + 0.7 * exp(-d2 * d2) * step(2.5, ridges)) / (rgw * 1.7724539);
    float v = 0.6 * fill * (1.0 - 0.55 * uLight) + (1.6 * ew * 0.886 * eg + rid) * (1.0 + 1.3 * uLight);
    if (pass == 0) res0 = v;
    else res1 = v;
  }
  return vec2(res0, res1);
}

float axis(float x) {
  float a = uAmplitude;
  return -0.2318 + uLean.y * 0.06 + (-0.2394 + uLean.x * 0.1) * x + 0.2815 * a * x * x + 0.3368 * a * x * x * x;
}

float softp(float z) {
  return 0.03 * log(1.0 + exp(clamp(z / 0.03, -60.0, 60.0)));
}

vec3 light(vec2 u, float fp, float bend, float level, out float halo) {
  float amp = level < 0.65 ? mix(0.25, 1.0, sstep(0.0, 0.65, level)) : mix(1.0, 1.12, (level - 0.65) / 0.35);
  float grow = clamp((amp - 0.25) / 0.75, 0.0, 1.25);
  float x = u.x / uScale;
  float uy = u.y;
  float ya = axis(x);
  float taper = max(uTaper, 0.05);
  float bx = 0.0437 + uMotion.z + uLean.x * 0.08;
  float bump = exp(-pow((x - bx) / (0.6879 * taper), 2.0));
  float hW = 0.02 + softp(-0.12 + 0.5324 * uAmplitude * grow * uMotion.y * bump - 0.02);
  float k = 1.0 * uWaviness;
  float cphi = cos(0.5 * PI + k * (x + 0.0664) + uMotion.x);
  float envC = (0.0886 + 0.3 * exp(-pow((x - 0.0634) / 0.6873, 2.0))) * uSpread * grow;
  float hC = -envC * tanh(cphi / 0.6);
  float th = 0.051 * uThickness * exp(-pow(cphi / 0.5, 2.0));
  float sig = sqrt(pow(0.005 + 0.05 * bend, 2.0) + fp * fp + th * th);
  float sigB = sqrt(0.0064 * max(uGlow, 0.05) * max(uGlow, 0.05) + fp * fp + th * th);
  float mend = exp(-pow(abs((x + 0.0421) / (0.4235 * taper)), 2.2689));
  vec3 red = uColors[0];
  vec3 orange = uColors[1];
  vec3 amber = uColors[2];
  vec3 warmWhite = uColors[3];
  vec3 cyan = uColors[4];
  vec3 blue = uColors[5];
  vec3 deep = uColors[6];
  vec3 orangeEdge = orange * vec3(1.0, 0.85, 0.77);
  vec3 coolCore = mix(warmWhite, vec3(1.0, 1.0, 0.7), 0.6);
  vec3 mint = clamp(mix(cyan, warmWhite, 0.35) * vec3(0.92, 1.05, 0.95), 0.0, 1.0);
  float ridges = float(uCount);
  float glow = max(uGlow, 0.0);
  vec3 L = vec3(0.0);
  vec3 Lb = vec3(0.0);
  {
    float H = max(abs(hW), 1e-4);
    float tt = uy - ya;
    vec2 w = sheetW(tt, H, sig, sigB, ridges);
    float f = clamp(tt / H, 0.0, 1.0);
    vec3 c = grad4(warmWhite, amber, orange, orangeEdge, 0.2351, 0.5643, f);
    c = mix(c, red, sstep(0.75, 1.0, f) * sstep(0.196, 0.3376, hW));
    vec3 mean = (grad4(warmWhite, amber, orange, orangeEdge, 0.2351, 0.5643, 0.1) + grad4(warmWhite, amber, orange, orangeEdge, 0.2351, 0.5643, 0.35) + grad4(warmWhite, amber, orange, orangeEdge, 0.2351, 0.5643, 0.6) + grad4(warmWhite, amber, orange, orangeEdge, 0.2351, 0.5643, 0.9)) * 0.25;
    L += mix(c, mean, sstep(0.3, 1.2, sig / H)) * (w.x * 0.2101 * mend);
    Lb += mix(c, mean, sstep(0.3, 1.2, sigB / H)) * (w.y * 0.2101 * mend);
  }
  {
    float H = max(abs(hC), 1e-4);
    float tt = (uy - ya) * (hC >= 0.0 ? 1.0 : -1.0);
    vec2 w = sheetW(tt, H, sig, sigB, 1.0);
    float f = clamp(tt / H, 0.0, 1.0);
    vec3 c = grad4(coolCore, cyan, blue, deep, 0.15, 0.7931, f);
    vec3 mean = (grad4(coolCore, cyan, blue, deep, 0.15, 0.7931, 0.1) + grad4(coolCore, cyan, blue, deep, 0.15, 0.7931, 0.35) + grad4(coolCore, cyan, blue, deep, 0.15, 0.7931, 0.6) + grad4(coolCore, cyan, blue, deep, 0.15, 0.7931, 0.9)) * 0.25;
    L += mix(c, mean, sstep(0.3, 1.2, sig / H)) * (w.x * 0.28 * mend);
    Lb += mix(c, mean, sstep(0.3, 1.2, sigB / H)) * (w.y * 0.28 * mend);
  }
  vec3 G = vec3(0.0);
  float wh = sqrt(0.0256 + envC * envC * cphi * cphi);
  float dg = (uy - ya) / wh;
  G += vec3(1.0, 0.97, 0.92) * (exp(-dg * dg) * 0.0315 / wh * mend * glow);
  float nx = -0.0664 - uMotion.x / k + 0.2168;
  float bxx = (x - nx) / 0.1849;
  float byy = (uy - axis(nx) - 0.0333) / (0.0544 * mix(0.7, 1.0, min(amp, 1.0)));
  G += mint * (exp(-bxx * bxx - byy * byy) * 1.4 * glow * sstep(0.0, 0.6, amp));
  float hb = (uy - ya - 0.3 * hW) / (0.07 + 0.45 * hW + 0.3 * envC);
  halo = exp(-hb * hb) * mend * smoothstep(0.0, 0.3, uIntro);
  vec3 total = L + 0.16 * glow * Lb + 1.16 * G;
  return total * 2.4 * uIntensity * smoothstep(0.0, 0.3, uIntro) * sstep(uIntro * 1.6, uIntro * 1.6 - 0.5, abs(x));
}

vec2 remap(vec2 p, float f, out float r, out float bend) {
  r = min(length(p), 0.9995);
  bend = pow(r, 5.17);
  float k = clamp(uRefraction, 0.0, 1.8);
  float sc = (1.0 - 0.278 * k * (1.0 - bend)) * (1.0 - 0.632 * k * bend) / (1.0 - 0.278 * k);
  return p * sc * f;
}

void main() {
  vec2 res = uResolution;
  vec2 p = (gl_FragCoord.xy - 0.5 * res) / min(res.x, res.y);
  float level = clamp(uLevel, 0.0, 1.0);
  float appear = smoothstep(0.0, 0.35, uIntro);

  if (uGlass > 0.5) {
    float R = uRadius * mix(0.94, 1.0, uIntro) * (1.0 + 0.03 * uPulse);
    float px = 1.0 / (min(res.x, res.y) * R);
    vec2 pc = p / R;
    float rho = length(pc);
    if (rho > 1.0 + 2.0 * px) {
      float sh = uLight * 0.07 * exp(-pow((rho - 0.985) / 0.07, 2.0)) * smoothstep(-0.6, 0.4, -pc.y) * appear * uOpacity;
      fragColor = vec4(0.0, 0.0, 0.0, sh);
      return;
    }
    float r;
    float bend;
    vec2 u = remap(pc, 1.0, r, bend);
    float fp = 0.5 * max(length(dFdx(u)), length(dFdy(u)));
    float halo;
    float skip;
    vec3 L = light(u, fp, bend, level, halo);
    float ca = 0.02 * uDispersion * bend;
    if (ca > 0.0015) {
      float r2;
      float b2;
      L.r = light(remap(pc, 1.0 - ca, r2, b2), fp, bend, level, skip).r;
      L.b = light(remap(pc, 1.0 + ca, r2, b2), fp, bend, level, skip).b;
    }
    vec3 col = 1.0 - exp(-L);
    vec2 d = pc / max(rho, 1e-6);
    float key = 0.4 * pow(max(0.0, d.x * 0.94 - d.y * 0.34), 6.0) + 0.2 * pow(max(0.0, -d.x * 0.5 + d.y * 0.87), 6.0);
    float ring = exp(-pow((r - 0.985) / 0.011, 2.0));
    float hzk = 0.25 + 0.7 * pow(max(0.0, -d.x * 0.6 + d.y * 0.8), 2.0) + pow(max(0.0, d.x * 0.8 - d.y * 0.6), 2.0);
    float haze = exp(-pow((1.0 - r) / 0.09, 2.0)) * hzk * 0.13 * uRim;
    vec3 orb;
    if (uLight > 0.5) {
      float lz = dot(d * r, vec2(-0.55, 0.83));
      vec3 body = mix(vec3(0.885, 0.893, 0.915), vec3(0.972, 0.975, 0.983), 0.5 + 0.5 * lz);
      float fres = smoothstep(0.8, 1.0, r);
      body = mix(body, vec3(0.82, 0.83, 0.86), fres * fres * 0.5);
      orb = lightInk(L, halo, body);
      float spec = exp(-pow((r - 0.955) / 0.03, 2.0)) * pow(max(0.0, dot(d, vec2(-0.55, 0.83))), 3.0);
      orb = mix(orb, vec3(1.0), clamp(spec * 0.85 * uRim + haze * 0.6, 0.0, 1.0));
      float edge = exp(-pow((1.0 - r) / (0.01 + 1.2 * px), 2.0));
      orb *= 1.0 - 0.12 * edge;
    } else {
      orb = vec3(0.04) + col * (1.0 + 0.1 * bend * uRim) + ring * key * uRim * (1.0 + 0.4 * level) + haze * vec3(1.0, 1.02, 1.04);
      orb = grade(clamp(orb, 0.0, 1.0));
    }
    float inside = clamp((1.0 - rho) / px + 0.5, 0.0, 1.0) * appear;
    vec3 rgb = orb * inside;
    fragColor = vec4(rgb, max(inside * mix(0.92, 1.0, uLight), max(max(rgb.r, rgb.g), rgb.b))) * uOpacity;
  } else {
    float span = 0.5 * res.x / min(res.x, res.y);
    vec2 u = p * (0.78 / span) + vec2(0.0, -0.15);
    float fp = 0.5 * max(length(dFdx(u)), length(dFdy(u)));
    float halo;
    float fade = sstep(0.82, 0.55, abs(u.x));
    vec3 L = light(u, fp, 0.0, level, halo) * fade;
    vec3 col = grade(1.0 - exp(-L)) * appear;
    if (uLight > 0.5) {
      vec3 c = lightInk(L, halo * fade * 0.6, vec3(1.0));
      float a = clamp(1.0 - min(c.r, min(c.g, c.b)), 0.0, 1.0) * appear;
      fragColor = vec4((c - (1.0 - a)) * appear, a) * uOpacity;
    } else {
      fragColor = vec4(col, max(max(col.r, col.g), col.b)) * uOpacity;
    }
  }
}
`,l=e=>{let t=String(e).replace(`#`,``).trim();t.length===3&&(t=t.replace(/(.)/g,`$1$1`));let n=parseInt(t.slice(0,6),16);return isFinite(n)?[(n>>16&255)/255,(n>>8&255)/255,(n&255)/255]:[1,1,1]},u=(e,t,n)=>Math.min(n,Math.max(t,e)),d=(e,t,n)=>{let r=e.createShader(t);return e.shaderSource(r,n),e.compileShader(r),r},f=e=>{let t=e.createProgram();return e.attachShader(t,d(e,e.VERTEX_SHADER,s)),e.attachShader(t,d(e,e.FRAGMENT_SHADER,c)),e.bindAttribLocation(t,0,`position`),e.linkProgram(t),e.getProgramParameter(t,e.LINK_STATUS)?t:null},p=(e,t,n)=>{let r=Math.min(1,Math.max(0,(n-e)/(t-e)));return r*r*(3-2*r)},m=e=>{let t=p(-.8,-.3,.6*Math.sin(e*2.7)+.5*Math.sin(e*1.53+1.2)),n=Math.max(0,Math.sin(e*17+1.6*Math.sin(e*5.3))),r=.6+.4*Math.sin(e*3.7+.7);return t*(.35+.65*n)*(.25+r)},h=[`#d95b56`,`#ba5046`,`#ffa24c`,`#ffe0b3`,`#93f1ff`,`#3569fa`,`#193d9b`];function g({colors:e=h,count:t=3,speed:n=1,amplitude:s=1,waviness:c=1,thickness:d=1,glow:p=1,taper:g=1,spread:_=1,hueShift:v=0,intensity:y=1,saturation:b=1,opacity:x=1,scale:S=1,glass:C=!0,refraction:w=1,dispersion:T=1,glassSize:E=1,rim:D=1,energy:O=.65,listening:k=!1,level:A,interactive:j=!0,clickPulse:M=!0,intro:N=!0,lightMode:P=!1,maxDevicePixelRatio:F=2,className:I=``,style:L}){let R=(0,r.useRef)(null),z=(0,r.useRef)({});return z.current={colors:e,count:t,speed:n,amplitude:s,waviness:c,thickness:d,glow:p,taper:g,spread:_,hueShift:v,intensity:y,saturation:b,opacity:x,scale:S,glass:C,refraction:w,dispersion:T,glassSize:E,rim:D,energy:O,listening:k,level:A,interactive:j,clickPulse:M,intro:N,lightMode:P,maxDevicePixelRatio:F},(0,r.useEffect)(()=>{let e=R.current;if(!e)return;let t=document.createElement(`canvas`);t.style.display=`block`,t.style.width=`100%`,t.style.height=`100%`,t.setAttribute(`aria-hidden`,`true`);let n=t.getContext(`webgl2`,{alpha:!0,premultipliedAlpha:!0,antialias:!1});if(!n)return;e.appendChild(t);let r=null,i=null,s={},c=[`uResolution`,`uMotion`,`uLevel`,`uColors`,`uCount`,`uAmplitude`,`uWaviness`,`uThickness`,`uGlow`,`uTaper`,`uSpread`,`uHueShift`,`uIntensity`,`uSaturation`,`uScale`,`uGlass`,`uRadius`,`uRefraction`,`uDispersion`,`uRim`,`uLean`,`uIntro`,`uPulse`,`uLight`,`uOpacity`],d=()=>{let e=f(n);return e?(r=e,i=n.createBuffer(),n.bindBuffer(n.ARRAY_BUFFER,i),n.bufferData(n.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),n.STATIC_DRAW),n.enableVertexAttribArray(0),n.vertexAttribPointer(0,2,n.FLOAT,!1,0,0),n.useProgram(e),s=Object.fromEntries(c.map(t=>[t,n.getUniformLocation(e,t)])),n.disable(n.BLEND),n.clearColor(0,0,0,0),!0):!1};if(!d()){t.remove();return}let p=typeof window.matchMedia==`function`?window.matchMedia(`(prefers-reduced-motion: reduce)`):null,g={clock:0,pace:0,activity:0,hover:0,hoverTarget:0,burst:0,lean:[0,0],leanTarget:[0,0],pulse:0,pulseV:0,introStart:-1,intro:+!z.current.intro,visible:typeof IntersectionObserver>`u`,lost:!1,raf:0,last:0,width:0,height:0,speechT:0,paletteKey:``,palette:{flat:new Float32Array(24),count:1}},_=()=>{let n=Math.min(window.devicePixelRatio||1,Math.max(.5,z.current.maxDevicePixelRatio)),r=Math.max(1,Math.round(e.clientWidth*n)),i=Math.max(1,Math.round(e.clientHeight*n));(r!==g.width||i!==g.height)&&(g.width=r,g.height=i,t.width=r,t.height=i)},v=e=>{let t=e.join(`,`);if(t===g.paletteKey)return;g.paletteKey=t;let n=(e.length?e:h).slice(0,a).map(l),r=new Float32Array(24);for(let e=0;e<o;e++){let t=n.length>1?e/6*(n.length-1):0,i=Math.floor(t),a=Math.min(i+1,n.length-1),o=t-i;r.set(n[i].map((e,t)=>e+(n[a][t]-e)*o),e*3)}g.palette={flat:r,count:o}},y=()=>{if(g.lost||!r)return;let e=z.current;v(Array.isArray(e.colors)?e.colors:[]),n.viewport(0,0,g.width,g.height),n.uniform2f(s.uResolution,g.width,g.height);let t=g.clock,i=.75+.45*g.pace;n.uniform3f(s.uMotion,(.26*Math.sin(.53*t)+.1*Math.sin(1.19*t+1.3))*i,1+(.06*Math.sin(.71*t)+.035*Math.sin(1.37*t+.4))*i,.06*Math.sin(.41*t+2)*i),n.uniform1f(s.uLevel,u(g.activity,0,1)),n.uniform3fv(s.uColors,g.palette.flat),n.uniform1i(s.uCount,u(Math.round(e.count),1,3)),n.uniform1f(s.uAmplitude,e.amplitude),n.uniform1f(s.uWaviness,e.waviness),n.uniform1f(s.uThickness,e.thickness),n.uniform1f(s.uGlow,e.glow),n.uniform1f(s.uTaper,Math.max(.05,e.taper)),n.uniform1f(s.uSpread,e.spread),n.uniform1f(s.uHueShift,e.hueShift),n.uniform1f(s.uIntensity,e.intensity),n.uniform1f(s.uSaturation,e.saturation),n.uniform1f(s.uScale,Math.max(.05,e.scale)),n.uniform1f(s.uGlass,+!!e.glass),n.uniform1f(s.uRadius,.42*e.glassSize),n.uniform1f(s.uRefraction,e.refraction),n.uniform1f(s.uDispersion,e.dispersion),n.uniform1f(s.uRim,e.rim),n.uniform2f(s.uLean,g.lean[0],g.lean[1]),n.uniform1f(s.uIntro,g.intro),n.uniform1f(s.uPulse,g.pulse),n.uniform1f(s.uLight,+!!e.lightMode),n.uniform1f(s.uOpacity,e.opacity),n.clear(n.COLOR_BUFFER_BIT),n.drawArrays(n.TRIANGLES,0,3)},b=e=>{g.raf=0;let t=z.current,n=g.last?u((e-g.last)/1e3,0,.05):0;g.last=e;let r=!!p?.matches;if(g.introStart<0&&g.visible&&(g.introStart=e),t.intro&&!r&&g.introStart>=0){let t=u((e-g.introStart)/1400,0,1);g.intro=1-(1-t)**3}else g.intro=1;g.hover+=(g.hoverTarget-g.hover)*(1-Math.exp(-n/(g.hoverTarget>g.hover?.25:.6)));for(let e=0;e<2;e++)g.lean[e]+=(g.leanTarget[e]-g.lean[e])*(1-Math.exp(-n/.35));g.pulseV+=(-170*g.pulse-14*g.pulseV)*n,g.pulse+=g.pulseV*n,g.burst*=Math.exp(-n/.45),t.listening&&!r&&(g.speechT+=n);let i=typeof t.level==`number`?u(t.level,0,1):t.listening&&!r?m(g.speechT):0,a=Math.min(1.2,Math.max(u(t.energy,0,1),i)+g.hover*.18+g.burst);g.activity+=(a-g.activity)*(1-Math.exp(-n/(a>g.activity?.12:.4))),g.pace+=(Math.min(1,g.activity)-g.pace)*(1-Math.exp(-n/.8)),r||(g.clock+=n*t.speed*(.6+1.6*g.pace)),y();let o=r&&Math.abs(g.activity-a)<.001&&Math.abs(g.pulse)<.001&&Math.abs(g.pulseV)<.001&&g.burst<.001&&Math.abs(g.hover-g.hoverTarget)<.001&&Math.abs(g.lean[0]-g.leanTarget[0])<.001&&Math.abs(g.lean[1]-g.leanTarget[1])<.001;g.visible&&!document.hidden&&!g.lost&&!o&&(g.raf=requestAnimationFrame(b))},x=()=>{!g.raf&&g.visible&&!g.lost&&(g.last=0,g.raf=requestAnimationFrame(b))},S=t=>{let n=e.getBoundingClientRect(),r=Math.min(n.width,n.height)||1;return[(t.clientX-n.left-n.width/2)/(r/2),(t.clientY-n.top-n.height/2)/(r/2)]},C=e=>{if(!z.current.interactive)return;let[t,n]=S(e);g.hoverTarget=u(1.6-Math.hypot(t,n),0,1),g.leanTarget=[u(t,-1.2,1.2)*.8,u(-n,-1.2,1.2)*.8],x()},w=()=>{g.hoverTarget=0,g.leanTarget=[0,0],x()},T=()=>{z.current.clickPulse&&(g.pulseV+=5,g.burst=Math.min(1.2,g.burst+.9),x())},E=e=>{e.preventDefault(),g.lost=!0,g.raf&&cancelAnimationFrame(g.raf),g.raf=0},D=()=>{g.lost=!1,d()&&x()};t.addEventListener(`webglcontextlost`,E),t.addEventListener(`webglcontextrestored`,D),e.addEventListener(`pointermove`,C),e.addEventListener(`pointerleave`,w),e.addEventListener(`pointerdown`,T);let O=new ResizeObserver(()=>{_(),y()});O.observe(e),_();let k=null;typeof IntersectionObserver<`u`&&(k=new IntersectionObserver(e=>{g.visible=e[e.length-1].isIntersecting,g.visible&&x()}),k.observe(e));let A=()=>{document.hidden||x()};return document.addEventListener(`visibilitychange`,A),x(),()=>{g.raf&&cancelAnimationFrame(g.raf),t.removeEventListener(`webglcontextlost`,E),t.removeEventListener(`webglcontextrestored`,D),e.removeEventListener(`pointermove`,C),e.removeEventListener(`pointerleave`,w),e.removeEventListener(`pointerdown`,T),document.removeEventListener(`visibilitychange`,A),O.disconnect(),k?.disconnect(),r&&n.deleteProgram(r),i&&n.deleteBuffer(i),n.getExtension(`WEBGL_lose_context`)?.loseContext(),t.remove()}},[]),(0,i.jsx)(`div`,{ref:R,className:`relative h-full w-full bg-transparent [-webkit-tap-highlight-color:transparent] ${I}`.trim(),style:L})}export{g as default};