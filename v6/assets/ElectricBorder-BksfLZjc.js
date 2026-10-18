import{i as e,t}from"./react-sySUN5R7.js";import{k as n}from"./sculpture-dark-CKiqtzhU.js";var r=e(t(),1),i=n(),a=4,o=3,s=64,c=3e6,l=560,u=Math.PI/2,d=`#version 300 es
const vec2 corners[3] = vec2[3](vec2(-1.0, -1.0), vec2(3.0, -1.0), vec2(-1.0, 3.0));
void main() {
  gl_Position = vec4(corners[gl_VertexID], 0.0, 1.0);
}`,f=`#version 300 es
precision highp float;
precision highp int;

uniform vec2 uSize;
uniform float uRatio;
uniform vec2 uCenter;
uniform vec2 uHalf;
uniform float uRadius;
uniform vec3 uParam;
uniform float uPerimeter;
uniform vec4 uCells;
uniform vec2 uSoft;
uniform float uTime;
uniform float uPower;
uniform float uReveal;
uniform vec3 uHover;
uniform float uHoverRadius;
uniform vec4 uPulses[${o}];
uniform vec3 uCore;
uniform vec3 uGlowColor;
uniform float uIntensity;
uniform float uGlow;
uniform float uThickness;
uniform float uStrands;
uniform float uChaos;
uniform float uSpread;
uniform float uFlicker;
uniform float uInk;
uniform vec4 uArcEnds[${a}];
uniform vec4 uArcShape[${a}];

out vec4 fragColor;

uint scramble(uint x) {
  x ^= x >> 16u;
  x *= 0x7feb352du;
  x ^= x >> 15u;
  x *= 0x846ca68bu;
  x ^= x >> 16u;
  return x;
}

vec2 slant(uint x, uint y, uint seed) {
  uint h = scramble(x * 0x8da6b343u + y * 0xd8163841u + seed * 0xcb1ab31fu);
  return vec2(uvec2(h, h >> 8u) & 255u) / 127.5 - 1.0;
}

vec2 ring(vec2 p, float period, uint seed) {
  vec2 i = floor(p);
  vec2 f = p - i;
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  float du = 30.0 * f.x * f.x * (f.x * (f.x - 2.0) + 1.0);
  uint x0 = uint(mod(i.x, period));
  uint x1 = uint(mod(i.x + 1.0, period));
  uint y0 = uint(i.y + 65536.0);
  vec2 ga = slant(x0, y0, seed);
  vec2 gb = slant(x1, y0, seed);
  vec2 gc = slant(x0, y0 + 1u, seed);
  vec2 gd = slant(x1, y0 + 1u, seed);
  float va = dot(ga, f);
  float vb = dot(gb, f - vec2(1.0, 0.0));
  float vc = dot(gc, f - vec2(0.0, 1.0));
  float vd = dot(gd, f - vec2(1.0, 1.0));
  float k = va - vb - vc + vd;
  float value = va + u.x * (vb - va) + u.y * (vc - va) + u.x * u.y * k;
  float gx = ga.x + u.x * (gb.x - ga.x) + u.y * (gc.x - ga.x) + u.x * u.y * (ga.x - gb.x - gc.x + gd.x);
  return vec2(value, gx + du * (vb - va + u.y * k));
}

float wobble(float x, uint seed) {
  return ring(vec2(x, 0.5), 1048576.0, seed).x;
}

vec2 frameAt(vec2 p) {
  vec2 inner = max(uHalf - uRadius, 0.0);
  vec2 q = abs(p) - inner;
  float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - uRadius;
  float quarter = uPerimeter * 0.25;
  vec2 v = abs(p) - uParam.xy;
  float t;
  if (v.x > 0.0 && v.y > 0.0) t = uParam.x + uParam.z * atan(v.x, v.y);
  else if (v.x > v.y) t = uParam.x + 1.5707963 * uParam.z + uParam.y - abs(p.y);
  else t = abs(p.x);
  t = clamp(t, 0.0, quarter);
  float s = p.x >= 0.0 ? (p.y < 0.0 ? t : 2.0 * quarter - t) : (p.y < 0.0 ? 4.0 * quarter - t : 2.0 * quarter + t);
  return vec2(s, d);
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
  float along = dot(rel, dir);
  float side = dot(rel, vec2(-dir.y, dir.x));
  float margin = abs(info.x) + (0.6 + uChaos) * (2.0 + len * 0.08) + uThickness * 12.0 + 10.0;
  if (along < -margin || along > len + margin || abs(side) > margin) return;
  float u = clamp(along / len, 0.0, 1.0);
  float taper = sin(3.14159265 * u);
  float settle = smoothstep(0.0, 0.15, u) * smoothstep(1.0, 0.85, u);
  float bendSlope = 3.14159265 / len * cos(3.14159265 * u) * settle;
  float beyond = max(-along, 0.0) + max(along - len, 0.0);
  for (int c = 0; c < 2; c++) {
    uint seed = uint(info.z * 131.0) + uint(c) * 29u + 7u;
    float jag = 0.0;
    float jagSlope = 0.0;
    float wave = max(len * 0.3, 14.0);
    float weight = (0.6 + uChaos) * (1.5 + len * 0.05) * (c == 0 ? 1.0 : 1.5);
    for (int o = 0; o < 3; o++) {
      vec2 n = ring(vec2(along / wave + info.z * 3.0, t * (1.4 + float(o) * 1.1)), 1048576.0, seed + uint(o));
      jag += n.x * weight;
      jagSlope += n.y * weight / wave;
      wave *= 0.42;
      weight *= 0.4;
    }
    float offset = (info.x + jag) * taper;
    float offsetSlope = (info.x + jag) * bendSlope + jagSlope * taper * settle;
    float across = (side - offset) / sqrt(1.0 + offsetSlope * offsetSlope);
    float gap = length(vec2(beyond, across));
    float w = uThickness * (c == 0 ? 0.9 : 0.6);
    vec2 g = glowShape(gap, gap, w);
    float k = info.y * (c == 0 ? 1.0 : 0.45);
    light += (uCore * g.x + uGlowColor * g.y * uGlow) * k;
    energy += (g.x + g.y * uGlow) * k;
    hot += exp(-gap * gap / (w * w * 0.16)) * k * (c == 0 ? 1.0 : 0.0);
  }
}

void main() {
  vec2 p = vec2(gl_FragCoord.x / uRatio, uSize.y - gl_FragCoord.y / uRatio);
  vec2 frame = frameAt(p - uCenter);
  float s = frame.x;
  float d = frame.y;
  float t = uTime;
  vec3 light = vec3(0.0);
  float energy = 0.0;
  float hot = 0.0;

  float along = min(s, uPerimeter - s);
  float front = uReveal * (uPerimeter * 0.5 + 80.0);
  float shown = smoothstep(front, front - 70.0, along) * uPower;
  float flare = uReveal < 1.0 ? exp(-pow((along - front + 30.0) / 26.0, 2.0)) * uPower : 0.0;

  vec2 toHover = p - uHover.xy;
  float heat = uHover.z * exp(-dot(toHover, toHover) / (uHoverRadius * uHoverRadius));
  float surge = 0.0;
  for (int i = 0; i < ${o}; i++) {
    vec4 pulse = uPulses[i];
    if (pulse.z <= 0.0) continue;
    float gap = abs(s - pulse.x);
    gap = min(gap, uPerimeter - gap);
    float wave = (gap - pulse.y * ${l}.0) / 46.0;
    surge += exp(-wave * wave) * pulse.z * exp(-pulse.y * 1.2);
  }
  heat = min(heat * 0.7 + surge * 0.8 + flare * 0.6, 1.2);
  vec2 inset = min(p, uSize - p);
  float frameFade = smoothstep(0.0, 14.0, min(inset.x, inset.y));

  float edge = abs(d);
  float inward = d < 0.0 ? exp(d / 14.0) : 1.0;
  float bloom = (exp(-edge / 3.0) * 0.1 + exp(-edge / 16.0) * 0.05 * inward) * uGlow * (1.0 + heat * 0.6) * shown;
  light += uGlowColor * bloom;
  energy += bloom;

  float bendAmp = uSpread * 16.0 * (1.0 + heat * 0.35);
  float rippleAmp = uSpread * 6.0 * (1.0 + heat * 0.3);
  float crinkleAmp = uChaos * 4.5 * (1.0 + heat * 0.3);
  float squeeze = min(1.0, 34.0 / max((bendAmp + rippleAmp) * 1.6 + crinkleAmp, 1e-3));
  bendAmp *= squeeze;
  rippleAmp *= squeeze;
  crinkleAmp *= squeeze;
  float reach = (bendAmp * 1.9 + rippleAmp + crinkleAmp * 1.6) * 1.3 + uThickness * 14.0 + 8.0;
  if (edge < reach && shown > 0.0) {
    float fade = smoothstep(reach, reach * 0.55, edge);
    float count = min(uStrands + heat * 1.2, 6.0);
    float slopeScale = 1.0 / uPerimeter;
    for (int i = 0; i < 6; i++) {
      float fi = float(i);
      if (fi >= ceil(count)) break;
      float present = clamp(count - fi, 0.0, 1.0);
      uint seed = uint(i) * 7u + 3u;
      float lead = i == 0 ? 1.0 : 0.0;
      float range = mix(1.35 + fi * 0.18, 0.7, lead);
      float x = s * slopeScale;
      vec2 a = ring(vec2(x * uCells.x, t * 0.7 + fi * 3.1), uCells.x, seed);
      vec2 b = ring(vec2(x * uCells.y, t * 1.9 + fi * 1.7), uCells.y, seed + 1u);
      vec2 c = ring(vec2(x * uCells.z, t * 4.6 + fi * 0.9), uCells.z, seed + 2u);
      vec2 e = ring(vec2(x * uCells.w, t * 6.8), uCells.w, seed + 3u);
      float offset = (a.x * bendAmp + b.x * rippleAmp) * range + (c.x + e.x * 0.35) * crinkleAmp;
      float slope =
        ((a.y * uCells.x * bendAmp + b.y * uCells.y * rippleAmp) * range +
          (c.y * uCells.z + e.y * 0.35 * uCells.w) * crinkleAmp) *
        slopeScale;
      float drift = lead > 0.5 ? 0.0 : wobble(fi * 7.3, seed + 9u) * 2.5 * uSpread;
      offset += drift;
      float across = (d - offset) / sqrt(1.0 + slope * slope);
      float spread = d - a.x * bendAmp * range - drift;
      float swell = 0.5 + 0.5 * ring(vec2(x * uSoft.y, t * 2.0 + fi * 5.1), uSoft.y, seed + 8u).x;
      float w = uThickness * mix(0.55, 1.0, lead) * (0.5 + swell);
      float vis = mix(0.3 + 0.45 * smoothstep(-0.25, 0.2, ring(vec2(x * uSoft.x, t * 0.5 + fi * 3.7), uSoft.x, seed + 5u).x), 1.0, lead);
      float spark = 1.0 - uFlicker * 0.3 * (0.5 + 0.5 * wobble(t * 13.0 + fi * 2.3, seed + 6u));
      float weight = max(vis, heat * 0.6) * spark * fade * present * (0.7 + 0.6 * swell);
      vec2 g = glowShape(across, spread, w) * weight;
      g.y *= inward;
      float haze = uGlow * (1.0 + heat * 0.5) * (1.0 - uInk * 0.7);
      light += uCore * g.x + uGlowColor * g.y * haze;
      energy += g.x + g.y * haze;
      hot += exp(-across * across / (w * w * 0.16)) * lead * weight;
    }
    light *= shown;
    energy *= shown;
    hot *= shown;
  }

  for (int i = 0; i < ${a}; i++) addArc(p, uArcEnds[i], uArcShape[i], t, light, energy, hot);

  float breath = 1.0 + uFlicker * 0.5 * wobble(t * 4.6 + 7.0, 3u);
  float gain = uIntensity * breath * (1.0 + heat * 0.25) * 1.4;
  light *= frameFade;
  energy *= frameFade;
  hot *= frameFade;
  float alpha = 1.0 - exp(-energy * gain);
  vec3 color = mix(1.0 - exp(-light * gain), alpha * light / max(energy, 1e-4), uInk);
  color = mix(color, vec3(alpha), clamp(hot, 0.0, 1.0) * uInk * 0.85);
  float grain = (fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715)))) - 0.5) / 255.0;
  alpha = clamp(alpha + grain, 0.0, 1.0);
  fragColor = vec4(clamp(color + grain, 0.0, alpha), alpha);
}`,p=(e,t,n)=>Math.min(n,Math.max(t,e)),m=e=>{let t=String(e||``).trim(),n=/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(t);if(n){let e=n[1].length===3?n[1].replace(/./g,e=>e+e):n[1];return[0,2,4].map(t=>parseInt(e.slice(t,t+2),16)/255)}let r=/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i.exec(t);if(r)return[r[1],r[2],r[3]].map(e=>p(parseFloat(e)/255,0,1));if(typeof document<`u`){let e=document.createElement(`canvas`).getContext(`2d`);if(e){e.fillStyle=`#000000`,e.fillStyle=t;let n=String(e.fillStyle);if(n!==`#000000`||/^(#0{3}|#0{6}|black)$/i.test(t))return m(n)}}return[.49,.98,1]},h=(e,t,n)=>{let r=e.createShader(t);return r?(e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(console.error(e.getShaderInfoLog(r)),e.deleteShader(r),null)):null},g=e=>{let t=h(e,e.VERTEX_SHADER,d),n=h(e,e.FRAGMENT_SHADER,f),r=t&&n?e.createProgram():null;if(!t||!n||!r)return t&&e.deleteShader(t),n&&e.deleteShader(n),null;if(e.attachShader(r,t),e.attachShader(r,n),e.linkProgram(r),e.deleteShader(t),e.deleteShader(n),!e.getProgramParameter(r,e.LINK_STATUS))return console.error(e.getProgramInfoLog(r)),e.deleteProgram(r),null;let i={},a=e.getProgramParameter(r,e.ACTIVE_UNIFORMS);for(let t=0;t<a;t++){let n=e.getActiveUniform(r,t);n&&(i[n.name.replace(/\[0\]$/,``)]=e.getUniformLocation(r,n.name))}return{program:r,uniforms:i}},_=(e,t,n,r,i)=>{let a=Math.abs(e)-(n-i),o=Math.abs(t)-(r-i);return Math.hypot(Math.max(a,0),Math.max(o,0))+Math.min(Math.max(a,o),0)-i},v=(e,t,n,r)=>{let i=Math.max(1,e/2+r),a=Math.max(1,t/2+r),o=p(n+r,0,Math.min(i,a)),s=Math.min(o+48,Math.min(i,a)),c=i-s,l=a-s,d=c+l+u*s;return{hx:i,hy:a,r:o,vr:s,ax:c,ay:l,quarter:d,perimeter:d*4}},y=(e,t)=>{let{hx:n,hy:r,r:i,vr:a,ax:o,ay:s,quarter:c,perimeter:l}=e,d=(t%l+l)%l,f=Math.min(3,Math.floor(d/c)),p=d-f*c,m=f%2?c-p:p,h,g;if(m<=o)h=m,g=-r;else if(m<=o+u*a){let e=a>0?(m-o)/a:0,t=Math.sin(e),c=-Math.cos(e),l=0,u=a+i+2;for(let e=0;e<18;e++){let e=(l+u)/2;_(o+t*e,-s+c*e,n,r,i)<0?l=e:u=e}h=o+t*l,g=-s+c*l}else h=n,g=-s+(m-o-u*a);let v=f>=2?-1:1,y=f===1||f===2?-1:1,b=h*v,x=g*y,S=_(b+.5,x,n,r,i)-_(b-.5,x,n,r,i),C=_(b,x+.5,n,r,i)-_(b,x-.5,n,r,i),w=Math.hypot(S,C)||1;return{x:b,y:x,nx:S/w,ny:C/w}},b=(e,t,n)=>{let{ax:r,ay:i,vr:a,quarter:o}=e,s=Math.abs(t)-r,c=Math.abs(n)-i,l;return l=s>0&&c>0?r+a*Math.atan2(s,c):s>c?r+u*a+i-Math.abs(n):Math.abs(t),l=p(l,0,o),t>=0?n<0?l:2*o-l:n<0?4*o-l:2*o+l},x=({children:e,color:t=`#7df9ff`,glowColor:n,speed:l=1,chaos:u=.5,spread:d=.6,thickness:f=1.5,strands:h=3,glow:_=.6,intensity:x=.8,arcs:S=1,flicker:C=.5,borderRadius:w=24,offset:T=0,active:E=!0,intro:D=!0,interactive:O=!0,cursorRadius:k=90,theme:A=`dark`,className:j=``,style:M})=>{let N=(0,r.useRef)(null),P=(0,r.useRef)(null),F=(0,r.useRef)(null),[I,L]=(0,r.useState)(0),R=m(t),z={core:R.map(e=>e+(1-e)*.55),glowColor:n?m(n):R,speed:Math.max(0,l),chaos:p(u,0,2),spread:p(d,0,2),thickness:Math.max(.25,f),strands:p(Math.round(h),1,6),glow:p(_,0,3),intensity:Math.max(0,x),arcs:Math.max(0,S),flicker:p(C,0,1),borderRadius:Math.max(0,w),offset:T,active:E,intro:D,interactive:O,cursorRadius:Math.max(1,k),light:A===`light`},B=(0,r.useRef)(z);return B.current=z,(0,r.useEffect)(()=>{F.current?.()}),(0,r.useEffect)(()=>{let e=N.current,t=P.current;if(!e||!t)return;let n=t.getContext(`webgl2`,{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1,powerPreference:`default`}),r=n?g(n):null;if(!n||!r)return;let i=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,l=n.createVertexArray(),u=new Float32Array(16),d=new Float32Array(16),f=new Float32Array(12),m={width:1,height:1,ratio:1},h={x:0,y:0,over:!1,near:!1},_={x:0,y:0,vx:0,vy:0,power:0},x=[],S=[],C=B.current,w=C.active&&(!C.intro||i||I!==0)?1:0,T=w,E=C.active,D=+!!C.light,O=v(1,1,0,0),k=Math.random()*100,A=0,j=0,M=!0,R=document.visibilityState!==`hidden`,z=!1,V=()=>{let n=B.current,r=Math.max(1,e.offsetWidth),i=Math.max(1,e.offsetHeight),a=r+128,o=i+128,s=Math.min(window.devicePixelRatio||1,2,Math.sqrt(c/(a*o))),l=Math.max(1,Math.round(a*s)),u=Math.max(1,Math.round(o*s));(t.width!==l||t.height!==u)&&(t.width=l,t.height=u),t.style.width=`${a}px`,t.style.height=`${o}px`,Object.assign(m,{width:r,height:i,ratio:l/a}),O=v(r,i,n.borderRadius,n.offset)},H=(e,t)=>{let n=Math.min(O.perimeter*.3,60+Math.random()*90),r=(t??Math.random()*O.perimeter)-n*(.2+Math.random()*.6),i=r+n,a=y(O,r),o=y(O,i),s=y(O,(r+i)/2),c=o.x-a.x,l=o.y-a.y,u=Math.hypot(c,l)||1,d=-l/u*s.nx+c/u*s.ny,f=Math.min(34,u*(.14+Math.random()*.16)+5);return{ax:a.x,ay:a.y,bx:o.x,by:o.y,bow:d>=0?f:-f,seed:1+Math.random()*60,born:e,life:.35+Math.random()*.45}},ee=(e,a)=>{let o=r.uniforms,c=m.width+128,p=m.height+128;n.viewport(0,0,t.width,t.height),n.clearColor(0,0,0,0),n.clear(n.COLOR_BUFFER_BIT),!(w<=.001&&!x.length)&&(n.useProgram(r.program),n.uniform2f(o.uSize,c,p),n.uniform1f(o.uRatio,m.ratio),n.uniform2f(o.uCenter,c/2,p/2),n.uniform2f(o.uHalf,O.hx,O.hy),n.uniform1f(o.uRadius,O.r),n.uniform3f(o.uParam,O.ax,O.ay,O.vr),n.uniform1f(o.uPerimeter,O.perimeter),n.uniform4f(o.uCells,Math.max(1,Math.round(O.perimeter/75)),Math.max(2,Math.round(O.perimeter/25)),Math.max(3,Math.round(O.perimeter/9)),Math.max(4,Math.round(O.perimeter/4))),n.uniform2f(o.uSoft,Math.max(1,Math.round(O.perimeter/150)),Math.max(1,Math.round(O.perimeter/50))),n.uniform1f(o.uTime,k),n.uniform1f(o.uPower,w*w*(3-2*w)),n.uniform1f(o.uReveal,T),n.uniform3f(o.uHover,_.x+s,_.y+s,a),n.uniform1f(o.uHoverRadius,e.cursorRadius),n.uniform4fv(o.uPulses,f),n.uniform3fv(o.uCore,e.core),n.uniform3fv(o.uGlowColor,e.glowColor),n.uniform1f(o.uIntensity,e.intensity),n.uniform1f(o.uGlow,e.glow),n.uniform1f(o.uThickness,e.thickness),n.uniform1f(o.uStrands,e.strands),n.uniform1f(o.uChaos,e.chaos),n.uniform1f(o.uSpread,e.spread),n.uniform1f(o.uFlicker,i?0:e.flicker),n.uniform1f(o.uInk,D),n.uniform4fv(o.uArcEnds,u),n.uniform4fv(o.uArcShape,d),n.bindVertexArray(l),n.drawArrays(n.TRIANGLES,0,3))},U=e=>{if(A=0,z)return;let t=B.current,n=p((e-j)/1e3||0,0,.05);j=Math.max(j,e);let r=i?.2:1;k+=n*t.speed*r,t.active&&!E&&(T=0),E=t.active,w+=(+!!t.active-w)*(1-Math.exp(-n/(t.active?.28:.4))),t.active&&(T=i?1:Math.min(1,T+n/.9)),D+=(+!!t.light-D)*(1-Math.exp(-n/.25));let c=t.interactive&&h.near&&t.active;c&&_.power<.01&&(_.x=h.x,_.y=h.y,_.vx=0,_.vy=0),_.vx+=((h.x-_.x)*120-_.vx*19)*n,_.vy+=((h.y-_.y)*120-_.vy*19)*n,_.x+=_.vx*n,_.y+=_.vy*n,_.power+=(+!!c-_.power)*(1-Math.exp(-n/(c?.3:.55)));for(let e=x.length-1;e>=0;e--)k-x[e].born>x[e].life&&x.splice(e,1);if(!i&&t.active&&T>=1&&t.arcs>0&&x.length<a){let e=n*t.speed*t.arcs;Math.random()<e*5*_.power?x.push(H(k,b(O,_.x-m.width/2,_.y-m.height/2))):Math.random()<e*(.6+O.perimeter/2400)&&x.push(H(k,null))}let l=w*w*(3-2*w);for(let e=0;e<a;e++){let t=e*4,n=x[e];if(!n){d[t+1]=0;continue}let r=p((k-n.born)/n.life,0,1);u[t]=n.ax+m.width/2+s,u[t+1]=n.ay+m.height/2+s,u[t+2]=n.bx+m.width/2+s,u[t+3]=n.by+m.height/2+s,d[t]=n.bow,d[t+1]=Math.sin(Math.PI*r)*l,d[t+2]=n.seed}for(let t=S.length-1;t>=0;t--)e-S[t].born>2200&&S.splice(t,1);for(let t=0;t<o;t++){let n=t*4,r=S[t];r?(f[n]=r.s,f[n+1]=(e-r.born)/1e3,f[n+2]=1):f[n+2]=0}ee(t,_.power*+!!t.interactive),(w>.002||t.active||x.length>0)&&M&&R&&(A=requestAnimationFrame(U))},W=()=>{!A&&!z&&M&&R&&(j=performance.now(),A=requestAnimationFrame(U))};F.current=()=>{V(),W()};let G=t=>{let n=e.getBoundingClientRect();h.x=t.clientX-n.left,h.y=t.clientY-n.top,h.over=h.x>=0&&h.y>=0&&h.x<=n.width&&h.y<=n.height,h.near=h.x>=-32&&h.y>=-32&&h.x<=n.width+s/2&&h.y<=n.height+s/2},K=e=>{G(e),h.near&&W()},q=e=>{G(e);let t=B.current;if(!h.over||!t.interactive||!t.active||i)return;let n=b(O,h.x-m.width/2,h.y-m.height/2);S.push({s:n,born:performance.now()}),S.length>o&&S.shift(),x.length<a&&x.push(H(k,n)),W()},J=()=>{h.over=!1,h.near=!1};window.addEventListener(`pointermove`,K,{passive:!0}),window.addEventListener(`pointerdown`,q,{passive:!0}),document.documentElement.addEventListener(`pointerleave`,J);let Y=e=>{e.preventDefault(),z=!0,cancelAnimationFrame(A),A=0},X=()=>L(e=>e+1);t.addEventListener(`webglcontextlost`,Y),t.addEventListener(`webglcontextrestored`,X);let Z=new ResizeObserver(()=>{V(),W()});Z.observe(e);let Q=new IntersectionObserver(e=>{M=e.some(e=>e.isIntersecting),W()});Q.observe(e);let $=()=>{R=document.visibilityState!==`hidden`,W()};return document.addEventListener(`visibilitychange`,$),V(),W(),()=>{cancelAnimationFrame(A),F.current=null,Z.disconnect(),Q.disconnect(),window.removeEventListener(`pointermove`,K),window.removeEventListener(`pointerdown`,q),document.documentElement.removeEventListener(`pointerleave`,J),document.removeEventListener(`visibilitychange`,$),t.removeEventListener(`webglcontextlost`,Y),t.removeEventListener(`webglcontextrestored`,X),n.isContextLost()||(n.deleteVertexArray(l),n.deleteProgram(r.program))}},[I]),(0,i.jsxs)(`div`,{ref:N,className:`relative isolate ${j}`.trim(),style:{borderRadius:w,...M},children:[e,(0,i.jsx)(`canvas`,{ref:P,className:`pointer-events-none absolute z-[1] block`,style:{top:-64,left:-64},"aria-hidden":`true`})]})};export{x as default};