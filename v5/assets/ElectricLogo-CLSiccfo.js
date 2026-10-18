import{i as e,t}from"./react-sySUN5R7.js";import{O as n}from"./sculpture-dark-Cfb-XN1r.js";import{a as r,i,n as a,r as o,t as s}from"./Triangle-CxvaD6kv.js";var c=e(t(),1),l=n(),u=`data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2264%22%20height%3D%2264%22%20viewBox%3D%220%200%2064%2064%22%3E%3Cpath%20d%3D%22M39%203%2012%2037h17l-4%2024%2027-34H35z%22%20fill%3D%22%23fff%22%2F%3E%3C%2Fsvg%3E`,d=560,f=4,p=0x56bc75e2d63100000,m=5,h=3,g=4e6,_=e=>{let t=String(e||``).replace(`#`,``);t.length===3&&(t=t.replace(/./g,e=>e+e));let n=parseInt(t.slice(0,6),16);return Number.isNaN(n)?[1,1,1]:[(n>>16&255)/255,(n>>8&255)/255,(n&255)/255]},v=(e,t,n,r,i)=>{let a=0;n[0]=0,r[0]=-0x56bc75e2d63100000,r[1]=p;for(let t=1;t<i;t++){let i=(e[t]+t*t-(e[n[a]]+n[a]*n[a]))/(2*t-2*n[a]);for(;i<=r[a];)a--,i=(e[t]+t*t-(e[n[a]]+n[a]*n[a]))/(2*t-2*n[a]);a++,n[a]=t,r[a]=i,r[a+1]=p}a=0;for(let o=0;o<i;o++){for(;r[a+1]<o;)a++;t[o]=(o-n[a])*(o-n[a])+e[n[a]]}},y=(e,t,n)=>{let r=Math.max(t,n),i=new Float64Array(r),a=new Float64Array(r),o=new Int32Array(r),s=new Float64Array(r+1);for(let r=0;r<t;r++){for(let a=0;a<n;a++)i[a]=e[a*t+r];v(i,a,o,s,n);for(let i=0;i<n;i++)e[i*t+r]=a[i]}for(let r=0;r<n;r++){for(let n=0;n<t;n++)i[n]=e[r*t+n];v(i,a,o,s,t);for(let n=0;n<t;n++)e[r*t+n]=a[n]}},b=(e,t,n,r,i,a)=>{let o=1/(2*a+1),s=0;for(let t=0;t<=a&&t<i;t++)s+=e[n+t*r];for(let c=0;c<i;c++)t[n+c*r]=s*o,c+a+1<i&&(s+=e[n+(c+a+1)*r]),c-a>=0&&(s-=e[n+(c-a)*r])},x=(e,t,n,r)=>{let i=new Float32Array(t*n);for(let a=0;a<3;a++){for(let a=0;a<n;a++)b(e,i,a*t,1,t,r);for(let a=0;a<t;a++)b(i,e,a,t,n,r)}},S=(e,t,n)=>{let r=new Float32Array(t*n),i=0;for(let r=0;r<t*n;r++)e[r*4+3]<250&&i++;if(i>t*n*.01){for(let i=0;i<t*n;i++)r[i]=e[i*4+3]/255;return r}let a=0,o=0,s=0,c=0,l=t=>{a+=e[t*4],o+=e[t*4+1],s+=e[t*4+2],c++};for(let e=0;e<t;e++)l(e),l((n-1)*t+e);for(let e=0;e<n;e++)l(e*t),l(e*t+t-1);a/=c,o/=c,s/=c;for(let i=0;i<t*n;i++){let t=Math.max(Math.abs(e[i*4]-a),Math.abs(e[i*4+1]-o),Math.abs(e[i*4+2]-s));r[i]=Math.min(1,Math.max(0,(t-24)/48))}return r},C=(e,t,n)=>{let{field:r,width:i,height:a}=e,o=Math.min(Math.max(t,.5),i-.5),s=Math.min(Math.max(n,.5),a-.5),c=Math.min(Math.floor(o-.5),i-2),l=Math.min(Math.floor(s-.5),a-2),u=o-.5-c,d=s-.5-l,f=l*i+c,p=r[f]+(r[f+1]-r[f])*u;return p+(r[f+i]+(r[f+i+1]-r[f+i])*u-p)*d+Math.hypot(t-o,n-s)},w=e=>{let t=e.naturalWidth||e.width,n=e.naturalHeight||e.height;if(!t||!n)return null;let r=d/Math.max(t,n),i=Math.max(2,Math.round(t*r)),a=Math.max(2,Math.round(n*r)),o=document.createElement(`canvas`);o.width=i,o.height=a;let s=o.getContext(`2d`,{willReadFrequently:!0});if(!s)return null;s.drawImage(e,0,0,i,a);let c=S(s.getImageData(0,0,i,a).data,i,a),l=i,u=a,m=-1,h=-1;for(let e=0;e<a;e++)for(let t=0;t<i;t++)c[e*i+t]<=.01||(t<l&&(l=t),t>m&&(m=t),e<u&&(u=e),e>h&&(h=e));if(m<0)return null;let g=m-l+1,_=h-u+1,v=Math.ceil(Math.max(g,_)*.25)+2,b=g+v*2,C=_+v*2,w=new Float32Array(b*C),T=new Float32Array(b*C);for(let e=0;e<C;e++)for(let t=0;t<b;t++){let n=t-v+l,r=e-v+u,o=n>=0&&r>=0&&n<i&&r<a?c[r*i+n]:0,s=e*b+t;if(o>=1)w[s]=0,T[s]=p;else if(o<=0)w[s]=p,T[s]=0;else{let e=.5-o;w[s]=e>0?e*e:0,T[s]=e<0?e*e:0}}y(w,b,C),y(T,b,C);let E=new Float32Array(b*C);for(let e=0;e<b*C;e++)E[e]=Math.sqrt(w[e])-Math.sqrt(T[e]);let D=[];for(let e=1;e<C-1;e++)for(let t=1;t<b-1;t++){let n=e*b+t,r=E[n];if(r>0||E[n-1]<=0&&E[n+1]<=0&&E[n-b]<=0&&E[n+b]<=0)continue;let i=E[n+1]-E[n-1],a=E[n+b]-E[n-b],o=Math.hypot(i,a)||1;D.push(t+.5-r*i/o,e+.5-r*a/o)}let O=Math.max(1,Math.ceil(D.length/2/3e3))*2,k=[];for(let e=0;e<D.length;e+=O)k.push(D[e],D[e+1]);let A=Math.max(g,_),j=Math.ceil(A*.7/f),M=Math.ceil(g/f)+j*2,N=Math.ceil(_/f)+j*2,P=new Float32Array(M*N);for(let e=0;e<C;e++){let t=Math.floor((e-v)/f)+j;for(let n=0;n<b;n++){let r=Math.floor((n-v)/f)+j;P[t*M+r]+=Math.exp(-Math.abs(E[e*b+n])/1.5)/16}}let F=P.slice(),I=Math.max(1,Math.round(A*.035/f)),L=Math.max(2,Math.round(A*.13/f));x(P,M,N,I),x(F,M,N,L);let R=Math.sqrt(2*Math.PI*(I*I+I))*f/3,z=Math.sqrt(2*Math.PI*(L*L+L))*f/3,B=new Float32Array(M*N*2);for(let e=0;e<M*N;e++)B[e*2]=P[e]*R,B[e*2+1]=F[e]*z;return{field:E,edges:k,width:b,height:C,pad:v,logoWidth:g,logoHeight:_,glow:B,glowWidth:M,glowHeight:N,glowOffset:v-j*f}},T=(e,t,n)=>{let{edges:r,logoWidth:i,logoHeight:a}=e,o=r.length/2;if(o<2)return null;let s=Math.max(i,a),c=Math.floor(Math.random()*o);if(n){let e=!1;for(let t=0;t<40&&!e;t++){let t=Math.floor(Math.random()*o);Math.hypot(r[t*2]-n.x,r[t*2+1]-n.y)<n.radius&&(c=t,e=!0)}if(!e)return null}let l=r[c*2],u=r[c*2+1];for(let n=0;n<24;n++){let n=Math.floor(Math.random()*o),i=r[n*2],a=r[n*2+1],c=Math.hypot(i-l,a-u);if(c<s*.08||c>s*.3)continue;let d=-(a-u)/c,f=(i-l)/c,p=c*(.2+Math.random()*.3),m=(l+i)/2,h=(u+a)/2,g=C(e,m+d*p,h+f*p),_=C(e,m-d*p,h-f*p);if(!(Math.max(g,_)<=0))return{ax:l,ay:u,bx:i,by:a,bow:g>=_?p:-p,seed:1+Math.random()*60,born:t,life:.35+Math.random()*.45}}return null},E=`#version 300 es
in vec2 position;
in vec2 uv;
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`,D=`#version 300 es
precision highp float;
precision highp int;

uniform sampler2D tFieldFrom;
uniform sampler2D tGlowFrom;
uniform sampler2D tFieldTo;
uniform sampler2D tGlowTo;
uniform vec4 uMapFrom;
uniform vec4 uSizeFrom;
uniform vec4 uMapTo;
uniform vec4 uSizeTo;
uniform float uMorph;
uniform vec2 uResolution;
uniform float uUnit;
uniform float uTime;
uniform float uPresence;
uniform vec3 uHover;
uniform float uHoverRadius;
uniform vec4 uPulses[${h}];
uniform float uPulseBoost;
uniform float uFlash;
uniform vec3 uColor;
uniform vec3 uGlowColor;
uniform float uIntensity;
uniform float uGlow;
uniform float uThickness;
uniform float uStrands;
uniform float uBend;
uniform float uCrackle;
uniform float uFlicker;
uniform float uFill;
uniform float uInk;
uniform vec4 uArcEnds[${m}];
uniform vec4 uArcShape[${m}];

in vec2 vUv;
out vec4 fragColor;

uint scramble(uint x) {
  x ^= x >> 16u;
  x *= 0x7feb352du;
  x ^= x >> 15u;
  x *= 0x846ca68bu;
  x ^= x >> 16u;
  return x;
}

float fieldAt(sampler2D tex, vec4 map, vec4 size, vec2 p) {
  vec2 f = (p - map.xy) / map.z;
  vec2 c = clamp(f, vec2(0.5), size.xy - 0.5);
  return (textureLod(tex, c / size.xy, 0.0).r + length(f - c)) * map.z;
}

vec2 glowAt(sampler2D tex, vec4 map, vec4 size, vec2 p) {
  vec2 f = (p - map.xy) / map.z - map.w;
  return textureLod(tex, f / (size.zw * ${f}.0), 0.0).rg;
}

float shape(vec2 p, float k) {
  float to = fieldAt(tFieldTo, uMapTo, uSizeTo, p);
  if (k >= 1.0) return to;
  return mix(fieldAt(tFieldFrom, uMapFrom, uSizeFrom, p), to, k);
}

vec2 aura(vec2 p, float k) {
  vec2 to = glowAt(tGlowTo, uMapTo, uSizeTo, p);
  if (k >= 1.0) return to;
  return mix(glowAt(tGlowFrom, uMapFrom, uSizeFrom, p), to, k);
}

vec4 corner(ivec2 c, uint seed) {
  uint h = scramble(uint(c.x) * 0x8da6b343u + uint(c.y) * 0xd8163841u + seed * 0xcb1ab31fu);
  return vec4(uvec4(h, h >> 8u, h >> 16u, h >> 24u) & 255u) / 127.5 - 1.0;
}

vec2 drift(vec2 p, uint seed, out mat2 jac) {
  vec2 i = floor(p);
  vec2 f = p - i;
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  vec2 du = 30.0 * f * f * (f * (f - 2.0) + 1.0);
  ivec2 c = ivec2(i);
  vec4 ga = corner(c, seed);
  vec4 gb = corner(c + ivec2(1, 0), seed);
  vec4 gc = corner(c + ivec2(0, 1), seed);
  vec4 gd = corner(c + ivec2(1, 1), seed);
  vec2 fb = f - vec2(1.0, 0.0);
  vec2 fc = f - vec2(0.0, 1.0);
  vec2 fd = f - vec2(1.0);
  vec2 va = vec2(dot(ga.xy, f), dot(ga.zw, f));
  vec2 vb = vec2(dot(gb.xy, fb), dot(gb.zw, fb));
  vec2 vc = vec2(dot(gc.xy, fc), dot(gc.zw, fc));
  vec2 vd = vec2(dot(gd.xy, fd), dot(gd.zw, fd));
  vec2 k = va - vb - vc + vd;
  vec4 g = ga + u.x * (gb - ga) + u.y * (gc - ga) + u.x * u.y * (ga - gb - gc + gd);
  jac = mat2(
    g.xy + du * (u.yx * k.x + vec2(vb.x - va.x, vc.x - va.x)),
    g.zw + du * (u.yx * k.y + vec2(vb.y - va.y, vc.y - va.y))
  );
  return va + u.x * (vb - va) + u.y * (vc - va) + u.x * u.y * k;
}

float wobble(vec2 p, uint seed) {
  mat2 jac;
  return drift(p, seed, jac).x;
}

vec2 ripple(vec2 p, out float surge) {
  vec2 push = vec2(0.0);
  surge = 0.0;
  float width = uUnit * 10.0;
  for (int i = 0; i < ${h}; i++) {
    vec4 pulse = uPulses[i];
    if (pulse.w <= 0.0) continue;
    vec2 d = p - pulse.xy;
    float dist = length(d);
    float front = (dist - pulse.z * uUnit * 150.0) / width;
    float env = exp(-front * front) * pulse.w * exp(-pulse.z * 1.7) * smoothstep(0.0, uUnit * 8.0, dist);
    push += d / max(dist, 1.0) * env * cos(front * 2.2) * uUnit * 7.5;
    surge += env;
  }
  return push;
}

vec2 wander(vec2 p, float t, uint seed, float reachScale, out mat2 jac, out vec2 sway) {
  vec2 q = p / uUnit;
  mat2 ja;
  mat2 jb;
  mat2 jc;
  mat2 jd;
  vec2 a = drift(q * 0.028 + vec2(t * 0.29, t * 0.21), seed, ja);
  vec2 b = drift(q * 0.085 + a * 0.4 + vec2(t * 0.83, -t * 0.61) + 17.0, seed + 1u, jb);
  vec2 c = drift(p / 9.0 + b * 0.6 + vec2(t * 1.9, t * 1.3) + 5.0, seed + 2u, jc);
  vec2 d = drift(p / 4.1 + vec2(-t * 2.7, t * 2.2) + 11.0, seed + 3u, jd);
  float bendAmp = uBend * 8.0 * reachScale;
  float rippleAmp = uBend * 3.2 * reachScale;
  float crinkleAmp = uCrackle * 1.5 * reachScale;
  jac = ja * (0.028 * bendAmp) + jb * (0.085 * rippleAmp) + jc * (crinkleAmp / 9.0) + jd * (crinkleAmp * 0.35 / 4.1);
  sway = (a * bendAmp + b * rippleAmp) * uUnit;
  return sway + (c + d * 0.35) * crinkleAmp;
}

vec2 glowShape(float line, float spread, float w) {
  float x = abs(line);
  float y = abs(spread);
  return vec2(exp(-x * x / (w * w * 0.5)) + exp(-y / (w * 2.2)) * 0.6, exp(-y / (w * 4.5)) * 0.5);
}

void addArc(vec2 p, vec4 ends, vec4 info, float t, inout vec3 light, inout float energy, inout float hot) {
  if (info.y < 0.002) return;
  vec2 ab = ends.zw - ends.xy;
  float len = max(length(ab), 1.0);
  vec2 dir = ab / len;
  vec2 rel = p - ends.xy;
  float s = dot(rel, dir);
  float h = dot(rel, vec2(-dir.y, dir.x));
  float margin = abs(info.x) + uCrackle * (2.0 + len * 0.08) + uThickness * 12.0 + 10.0;
  if (s < -margin || s > len + margin || abs(h) > margin) return;
  float u = clamp(s / len, 0.0, 1.0);
  float taper = sin(3.14159265 * u);
  float bendSlope = s > 0.0 && s < len ? 3.14159265 / len * cos(3.14159265 * u) : 0.0;
  float beyond = max(-s, 0.0) + max(s - len, 0.0);
  for (int c = 0; c < 2; c++) {
    uint seed = uint(info.z * 131.0) + uint(c) * 29u + 7u;
    float jag = 0.0;
    float jagSlope = 0.0;
    float wave = max(len * 0.3, 14.0);
    float weight = uCrackle * (1.5 + len * 0.05) * (c == 0 ? 1.0 : 1.5);
    for (int o = 0; o < 3; o++) {
      mat2 jac;
      float n = drift(vec2(s / wave + info.z * 3.0, t * (1.4 + float(o) * 1.1)), seed + uint(o), jac).x;
      jag += n * weight;
      jagSlope += jac[0].x * weight / wave;
      wave *= 0.42;
      weight *= 0.4;
    }
    float offset = (info.x + jag) * taper;
    float offsetSlope = (info.x + jag) * bendSlope + jagSlope * taper;
    float across = (h - offset) / sqrt(1.0 + offsetSlope * offsetSlope);
    float gap = length(vec2(beyond, across));
    float w = uThickness * (c == 0 ? 0.9 : 0.6);
    vec2 g = glowShape(gap, gap, w);
    float k = info.y * (c == 0 ? 1.0 : 0.45);
    light += (uColor * g.x + uGlowColor * g.y * uGlow) * k;
    energy += (g.x + g.y * uGlow) * k;
    hot += exp(-gap * gap / (w * w * 0.16)) * k * (c == 0 ? 1.0 : 0.0);
  }
}

void main() {
  vec2 p = vec2(vUv.x, 1.0 - vUv.y) * uResolution;
  float t = uTime;
  vec3 light = vec3(0.0);
  float energy = 0.0;
  float hot = 0.0;

  float surge;
  vec2 pr = p - ripple(p, surge);
  float k = uMorph >= 1.0 ? 1.0 : smoothstep(0.0, 1.0, clamp(uMorph * 1.7 - 0.35 + 0.35 * wobble(p / uUnit * 0.018, 41u), 0.0, 1.0));
  float transit = uMorph >= 1.0 ? 0.0 : sin(3.14159265 * uMorph);
  float base = shape(pr, k);

  vec2 toHover = p - uHover.xy;
  float heat = min(uHover.z * exp(-dot(toHover, toHover) / (uHoverRadius * uHoverRadius)) + surge * 1.4 + transit * 0.5, 2.0);
  float heatCap = min(uHover.z + uPulseBoost * 1.4 + transit * 0.5, 2.0);
  float breath = 1.0 + uFlicker * 0.6 * wobble(vec2(t * 2.1, 7.0), 3u);
  float grow = uPresence;

  float edge = abs(base);
  vec2 halo = aura(pr, k);
  float ink = uInk;
  float bloom = (halo.x * 0.16 + halo.y * 0.08) * (1.0 - ink * 0.65) * uGlow * (1.0 + heat * 1.2);
  float body = smoothstep(0.75, -0.75, base) * uFill * (0.06 + 1.2 * min(halo.x, 1.0)) * (1.0 + heat * 0.5);
  light += uGlowColor * bloom * grow * grow;
  energy += bloom * grow * grow;

  float reachScale = mix(0.15, 1.0, grow) * (1.0 + heat * 0.9);
  float reach = (uUnit * uBend * 16.0 + uCrackle * 3.0) * (1.0 + heatCap * 0.9) + uThickness * 20.0 + 8.0;
  if (edge < reach && grow > 0.0) {
    float fade = smoothstep(reach, reach * 0.55, edge);
    vec2 q = pr / uUnit;
    float count = min(uStrands + heat * 2.5, 6.0);
    float limit = min(uStrands + heatCap * 2.5, 6.0);
    for (int i = 0; i < 6; i++) {
      float fi = float(i);
      if (fi >= limit) break;
      float present = clamp(count - fi, 0.0, 1.0);
      if (present <= 0.0) continue;
      uint seed = uint(i) * 7u + 3u;
      mat2 jac;
      vec2 sway;
      float lead = i == 0 ? 1.0 : 0.0;
      vec2 warped = pr + wander(pr, t * (1.0 + fi * 0.19), seed, reachScale * mix(0.6 + fi * 0.2, 0.7, lead), jac, sway);
      float dw = shape(warped, k);
      vec2 slope = vec2(shape(warped + vec2(1.0, 0.0), k), shape(warped + vec2(0.0, 1.0), k)) - dw;
      float d = dw / max(length(slope + jac * slope), 0.3);
      float spread = shape(pr + sway, k);
      float swell = 0.5 + 0.5 * wobble(q * 0.06 + vec2(t * 0.9, fi * 5.1 - t * 0.6), seed + 8u);
      float w = uThickness * mix(0.5, 1.0, lead) * (0.5 + swell);
      float vis = mix(0.3 + 0.45 * smoothstep(-0.25, 0.2, wobble(q * 0.035 + vec2(t * 0.21, fi * 3.7), seed + 5u)), 1.0, lead);
      float spark = 1.0 - uFlicker * 0.3 * (0.5 + 0.5 * wobble(vec2(t * 6.0, fi * 2.3), seed + 6u));
      float weight = max(vis, heat * 0.85) * spark * fade * present * (0.7 + 0.6 * swell);
      vec2 g = glowShape(d, spread, w) * weight;
      float soft = mix(1.0, mix(0.5, 1.0, lead), ink);
      vec3 stroke = mix(uColor, uGlowColor, ink * (1.0 - lead) * 0.65);
      float haze = uGlow * (1.0 + heat) * (1.0 - ink * 0.7);
      light += stroke * g.x * soft + uGlowColor * g.y * haze;
      energy += g.x * soft + g.y * haze;
      hot += exp(-d * d / (w * w * 0.16)) * lead * weight;
    }
    light *= grow;
    energy *= grow;
  }

  for (int i = 0; i < ${m}; i++) addArc(pr, uArcEnds[i], uArcShape[i], t, light, energy, hot);

  float gain = uIntensity * breath * (1.0 + heat * 0.45) * (1.0 + uFlash * 0.3) * 1.4;
  float alpha = 1.0 - exp(-energy * gain);
  vec3 color = mix(1.0 - exp(-light * gain), alpha * light / max(energy, 1e-4), ink);
  color = mix(color, vec3(alpha), clamp(hot * grow, 0.0, 1.0) * ink * 0.85);
  float tint = (1.0 - exp(-body * gain * 1.2)) * grow * grow * (1.0 - ink * 0.82);
  color += uGlowColor * tint * (1.0 - alpha);
  alpha += tint * (1.0 - alpha);
  float grain = (fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715)))) - 0.5) / 255.0;
  alpha = clamp(alpha + grain, 0.0, 1.0);
  fragColor = vec4(clamp(color + grain, 0.0, alpha), alpha);
}
`,O=({src:e=u,color:t=`#ecc7ff`,glowColor:n=`#ad6dff`,scale:d=.7,intensity:f=1,glow:p=1,thickness:v=1.5,strands:y=4,bend:b=.6,crackle:x=1.5,arcs:S=1,flicker:C=.6,fill:O=0,speed:k=2.5,interactive:A=!0,cursorIntensity:j=.75,cursorRadius:M=100,theme:N=`dark`,onRender:P,className:F=``,style:I})=>{let L=(0,c.useRef)(null),R=(0,c.useRef)(null),z=(0,c.useRef)(null);return(0,c.useEffect)(()=>{R.current={color:t,glowColor:n,scale:d,intensity:f,glow:p,thickness:v,strands:y,bend:b,crackle:x,arcs:S,flicker:C,fill:O,speed:k,interactive:A,cursorIntensity:j,cursorRadius:M,theme:N,onRender:P}}),(0,c.useEffect)(()=>{let t=!0,n=new Image;return n.crossOrigin=`anonymous`,n.decoding=`async`,n.onload=()=>{if(!t)return;let e=null;try{e=w(n)}catch{e=null}e&&(z.current=e)},n.src=e||u,()=>{t=!1,n.onload=null}},[e]),(0,c.useEffect)(()=>{let e=L.current;if(!e)return;let t=new i({dpr:Math.min(window.devicePixelRatio||1,2),alpha:!0,premultipliedAlpha:!0,antialias:!1}),n=t.gl,c=n;if(!t.isWebgl2){n.getExtension(`WEBGL_lose_context`)?.loseContext();return}n.clearColor(0,0,0,0);let l=n.canvas;l.style.display=`block`,l.style.width=`100%`,l.style.height=`100%`,e.appendChild(l);let u=()=>({shape:null,field:new a(n,{image:new Float32Array([1e3]),width:1,height:1,internalFormat:c.R16F,format:c.RED,type:n.FLOAT,minFilter:n.LINEAR,magFilter:n.LINEAR,generateMipmaps:!1,flipY:!1,unpackAlignment:1}),glow:new a(n,{image:new Float32Array([0,0]),width:1,height:1,internalFormat:c.RG16F,format:c.RG,type:n.FLOAT,minFilter:n.LINEAR,magFilter:n.LINEAR,generateMipmaps:!1,flipY:!1,unpackAlignment:1})}),d=[u(),u()],f=Array.from({length:20},()=>0),p=Array.from({length:20},()=>0),v=Array.from({length:12},()=>0),y={tFieldFrom:{value:d[1].field},tGlowFrom:{value:d[1].glow},tFieldTo:{value:d[0].field},tGlowTo:{value:d[0].glow},uMapFrom:{value:[0,0,1,0]},uSizeFrom:{value:[1,1,1,1]},uMapTo:{value:[0,0,1,0]},uSizeTo:{value:[1,1,1,1]},uMorph:{value:1},uResolution:{value:[1,1]},uUnit:{value:1},uTime:{value:0},uPresence:{value:0},uHover:{value:[0,0,0]},uHoverRadius:{value:120},uPulses:{value:v},uPulseBoost:{value:0},uFlash:{value:0},uColor:{value:[1,1,1]},uGlowColor:{value:[.43,.48,1]},uIntensity:{value:1},uGlow:{value:1},uThickness:{value:1.8},uStrands:{value:3},uBend:{value:1},uCrackle:{value:1},uFlicker:{value:.4},uFill:{value:.5},uInk:{value:0},uArcEnds:{value:f},uArcShape:{value:p}},b=new o(n,{geometry:new s(n),program:new r(n,{vertex:E,fragment:D,uniforms:y,depthTest:!1,depthWrite:!1})}),x=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches??!1,S={x:0,y:0,over:!1},C={x:0,y:0,vx:0,vy:0,power:0},w=[],O=[],k=0,A=null,j=1,M=null,N=0,P=0,F=[[1,1,1],[1,1,1]],I=!1,B=0,V=1,H=1,U=0,W=performance.now(),G=!0,ee=(e,t)=>{e.shape=t,e.field.image=t.field,e.field.width=t.width,e.field.height=t.height,e.field.needsUpdate=!0,e.glow.image=t.glow,e.glow.width=t.glowWidth,e.glow.height=t.glowHeight,e.glow.needsUpdate=!0},K=(e,t)=>{let n=Math.max(1e-4,Math.min(V*t.scale/e.logoWidth,H*t.scale/e.logoHeight));return{fit:n,ox:V/2-(e.pad+e.logoWidth/2)*n,oy:H/2-(e.pad+e.logoHeight/2)*n,unit:Math.max(e.logoWidth,e.logoHeight)*n/100}},q=()=>{V=Math.max(1,e.clientWidth),H=Math.max(1,e.clientHeight),t.dpr=Math.min(window.devicePixelRatio||1,2,Math.sqrt(g/(V*H))),t.setSize(V,H),y.uResolution.value=[V,H]},J=e=>{U=0;let n=R.current,r=Math.min(.05,Math.max(0,(e-W)/1e3));W=e;let i=z.current;i&&i!==d[k].shape&&(A=i),A&&j>=1&&(d[k].shape&&(k=1-k,j=0,w.length=0),ee(d[k],A),A=null),j<1&&(j=Math.min(1,j+r/(A?.3:1.6)));let a=d[k].shape,o=j<1?d[1-k].shape:null;a&&(N=Math.min(1,N+r/1.4));let s=N*N*(3-2*N);if(a&&n){let i=K(a,n),c=o?K(o,n):i,u=j*j*(3-2*j),g=c.unit+(i.unit-c.unit)*u,E=n.interactive&&S.over;E&&C.power<.01&&(C.x=S.x,C.y=S.y,C.vx=0,C.vy=0),C.vx+=((S.x-C.x)*120-C.vx*19)*r,C.vy+=((S.y-C.y)*120-C.vy*19)*r,C.x+=C.vx*r,C.y+=C.vy*r,C.power+=(+!!E-C.power)*(1-Math.exp(-r/(E?.3:.55)));let D=x?.2:1;B+=r*n.speed*D;for(let e=w.length-1;e>=0;e--)B-w[e].born>w[e].life&&w.splice(e,1);let A=e=>({x:(e.x-i.ox)/i.fit,y:(e.y-i.oy)/i.fit,radius:Math.max(1,n.cursorRadius)/i.fit});if(M&&j>=1&&n.arcs>0)for(let e=0;e<3&&w.length<m;e++){let e=T(a,B,A(M));e&&w.push(e)}if(M=null,!x&&s>.8&&j>=1&&w.length<m){let e=r*n.speed*n.arcs;if(Math.random()<e*6*C.power*n.cursorIntensity){let e=T(a,B,A(C));e&&w.push(e)}else if(Math.random()<e*2.2){let e=T(a,B,null);e&&w.push(e)}}for(let e=0;e<m;e++){let t=e*4,n=w[e];if(!n){p[t+1]=0;continue}let r=(B-n.born)/n.life;f[t]=i.ox+n.ax*i.fit,f[t+1]=i.oy+n.ay*i.fit,f[t+2]=i.ox+n.bx*i.fit,f[t+3]=i.oy+n.by*i.fit,p[t]=n.bow*i.fit,p[t+1]=Math.sin(Math.PI*Math.min(1,Math.max(0,r)))*s,p[t+2]=n.seed}let N=0,L=0;for(let t=O.length-1;t>=0;t--)(e-O[t].born)/1e3>2&&O.splice(t,1);for(let t=0;t<h;t++){let n=t*4,r=O[t];if(!r){v[n+3]=0;continue}let i=(e-r.born)/1e3;v[n]=r.x,v[n+1]=r.y,v[n+2]=i,v[n+3]=1,N=Math.max(N,Math.exp(-i*1.7)),L+=Math.exp(-i*7)}let R=d[1-k];y.tFieldTo.value=d[k].field,y.tGlowTo.value=d[k].glow,y.tFieldFrom.value=R.field,y.tGlowFrom.value=R.glow,y.uMapTo.value=[i.ox,i.oy,i.fit,a.glowOffset],y.uSizeTo.value=[a.width,a.height,a.glowWidth,a.glowHeight],o&&(y.uMapFrom.value=[c.ox,c.oy,c.fit,o.glowOffset],y.uSizeFrom.value=[o.width,o.height,o.glowWidth,o.glowHeight]),y.uMorph.value=j,y.uUnit.value=g,y.uTime.value=B,y.uPresence.value=s,y.uHover.value=[C.x,C.y,C.power*Math.max(0,n.cursorIntensity)],y.uHoverRadius.value=Math.max(1,n.cursorRadius),y.uPulseBoost.value=N,y.uFlash.value=L;let z=[_(n.color),_(n.glowColor)],V=I?1-Math.exp(-r/.35):1;I=!0;for(let e=0;e<2;e++)for(let t=0;t<3;t++)F[e][t]+=(z[e][t]-F[e][t])*V;y.uColor.value=F[0].slice(),y.uGlowColor.value=F[1].slice(),y.uIntensity.value=n.intensity,y.uGlow.value=n.glow,y.uThickness.value=n.thickness,y.uStrands.value=Math.max(1,Math.min(6,Math.round(n.strands))),y.uBend.value=n.bend,y.uCrackle.value=n.crackle,y.uFlicker.value=x?0:n.flicker,P+=(+(n.theme===`light`)-P)*(1-Math.exp(-r/.25)),y.uFill.value=n.fill,y.uInk.value=P,t.render({scene:b}),n.onRender?.(l)}G&&(U=requestAnimationFrame(J))},Y=()=>{!U&&G&&(W=performance.now(),U=requestAnimationFrame(J))},X=t=>{let n=e.getBoundingClientRect();S.x=t.clientX-n.left,S.y=t.clientY-n.top,S.over=!0},Z=e=>{X(e),R.current?.interactive&&!x&&(O.push({x:S.x,y:S.y,born:performance.now()}),O.length>h&&O.shift(),M={x:S.x,y:S.y})},Q=()=>{S.over=!1};e.addEventListener(`pointermove`,X),e.addEventListener(`pointerdown`,Z),e.addEventListener(`pointerleave`,Q),e.addEventListener(`pointercancel`,Q);let $=new ResizeObserver(q);$.observe(e);let te=new IntersectionObserver(([e])=>{G=e.isIntersecting,Y()});return te.observe(e),q(),Y(),()=>{G=!1,cancelAnimationFrame(U),$.disconnect(),te.disconnect(),e.removeEventListener(`pointermove`,X),e.removeEventListener(`pointerdown`,Z),e.removeEventListener(`pointerleave`,Q),e.removeEventListener(`pointercancel`,Q),n.getExtension(`WEBGL_lose_context`)?.loseContext(),l.parentNode&&l.parentNode.removeChild(l)}},[]),(0,l.jsx)(`div`,{ref:L,className:`relative w-full h-full overflow-hidden ${F}`.trim(),style:I})};export{O as default};