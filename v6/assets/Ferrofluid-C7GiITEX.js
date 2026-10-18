import{i as e,t}from"./react-sySUN5R7.js";import{k as n}from"./sculpture-dark-CKiqtzhU.js";var r=e(t(),1),i=n(),a=1/3,o=1,s=2.4,c=38*Math.PI/180,l={up:[0,1],down:[0,-1],left:[-1,0],right:[1,0],none:[0,0]},u=`#version 300 es
in vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`,d=`#version 300 es
precision highp float;
uniform sampler2D uState;
uniform vec2 uGridOrigin;
uniform float uCell;
uniform float uDt;
uniform float uTime;
uniform vec2 uFlow;
uniform float uTurbulence;
uniform float uMagnetism;
uniform float uFieldScale;
uniform vec2 uSeed;
uniform vec4 uCursor;
uniform vec4 uPulse;
uniform float uPulseSpeed;
uniform float uPulseWidth;
uniform vec3 uIntro;
uniform float uSpikeHeight;
uniform float uMound;
uniform float uStiffness;
uniform float uDamping;
uniform float uSettle;
out vec4 outState;

float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float flowField(vec2 p) {
  vec2 q = p / uFieldScale + uSeed;
  vec2 drift = uFlow * uTime * 0.55;
  vec2 warp = vec2(noise(q * 0.6 + vec2(uTime * 0.07, 3.1)), noise(q * 0.6 - vec2(7.3, uTime * 0.06))) - 0.5;
  vec2 r = q + warp * 1.8 * uTurbulence - drift;
  float n = noise(r) * 0.65 + noise(r * 2.03 + 11.7 - drift * 0.5) * 0.35;
  return smoothstep(0.44, 0.86, n);
}

void main() {
  vec2 texel = floor(gl_FragCoord.xy);
  vec2 p = uGridOrigin + (texel + 0.5) * uCell;
  vec4 prev = texelFetch(uState, ivec2(texel), 0);
  float swell = flowField(p);
  float field = uMagnetism * (0.03 + 1.0 * swell * swell);
  vec2 dc = p - uCursor.xy;
  float falloff = dot(dc, dc) / (uCursor.w * uCursor.w);
  field += uCursor.z * exp(-falloff);
  float mound = uCursor.z * exp(-falloff / 2.2);
  if (uPulse.w > 0.0) {
    float ring = length(p - uPulse.xy) - uPulse.z * uPulseSpeed;
    float envelope = smoothstep(0.0, 0.08, uPulse.z) * exp(-uPulse.z * 1.1);
    field += uPulse.w * envelope * exp(-ring * ring / (uPulseWidth * uPulseWidth));
  }
  float front = clamp((uIntro.z - length(p - uIntro.xy)) / 3.0, 0.0, 1.0);
  front = front * front * (3.0 - 2.0 * front);
  float target = uSpikeHeight * min(pow(max(field * front - 0.04, 0.0), 1.6), 1.0);
  float height = prev.x;
  float velocity = prev.y;
  if (uSettle > 0.5) {
    height = target;
    velocity = 0.0;
  } else {
    float steps = ceil(uDt / 0.008);
    float h = uDt / steps;
    for (int k = 0; k < 8; k++) {
      if (float(k) >= steps) break;
      velocity += (uStiffness * (target - height) - uDamping * velocity) * h;
      height += velocity * h;
    }
    if (height < 0.0) {
      height = 0.0;
      velocity = max(velocity, 0.0);
    }
  }
  outState = vec4(height, velocity, mound * front * uMound, 1.0);
}`,f=`#version 300 es
precision highp float;
uniform sampler2D uState;
uniform vec2 uGridOrigin;
uniform float uCell;
uniform vec2 uStateSize;
uniform float uBoundCell;
out vec4 outBound;

void main() {
  vec2 center = uGridOrigin + (floor(gl_FragCoord.xy) + 0.5) * uBoundCell;
  vec2 base = floor((center - uGridOrigin) / uCell);
  float top = 0.0;
  float peak = 0.0;
  for (int y = -4; y <= 4; y++) {
    for (int x = -4; x <= 4; x++) {
      vec2 texel = clamp(base + vec2(float(x), float(y)), vec2(0.0), uStateSize - 1.0);
      vec4 s = texelFetch(uState, ivec2(texel), 0);
      top = max(top, max(s.x, 0.0) * 1.05 + s.z);
      peak = max(peak, s.x);
    }
  }
  outBound = vec4(top, peak, 0.0, 1.0);
}`,p=`#version 300 es
precision highp float;
uniform sampler2D uField;
uniform sampler2D uBound;
uniform vec2 uGridOrigin;
uniform vec2 uGridSpan;
uniform vec2 uBoundSpan;
uniform float uCellSize;
uniform vec2 uResolution;
uniform vec3 uCamera;
uniform vec3 uForward;
uniform vec3 uUpward;
uniform float uTanHalf;
uniform float uPixelAngle;
uniform float uFar;
uniform float uFogStart;
uniform float uTop;
uniform float uBottom;
uniform float uTime;
uniform vec4 uCursor;
uniform float uMound;
uniform float uRound;
uniform float uSpan;
uniform float uExponent;
uniform float uWarp;
uniform vec3 uKey;
uniform vec3 uStrip;
uniform vec3 uFill;
uniform float uExposure;
uniform float uLight;
uniform float uOpaque;
uniform vec3 uBase;
uniform float uOpacity;
out vec4 outColor;

const float G = 7.2551975;
const vec2 E1 = vec2(0.8660254, 0.5);
const vec2 E2 = vec2(-0.8660254, 0.5);
const vec2 E3 = vec2(0.0, -1.0);
const mat2 TURN = mat2(0.9902681, 0.1391731, -0.1391731, 0.9902681);
const float F0 = 0.06;

vec3 mound(vec2 p) {
  vec2 d = p - uCursor.xy;
  float inv = 1.0 / (uCursor.w * uCursor.w * 2.2);
  float e = uCursor.z * exp(-dot(d, d) * inv);
  return vec3(e, -2.0 * inv * e * d) * uMound;
}

vec2 lattice(vec2 p) {
  vec2 q = TURN * p;
  float t = uTime * 0.35;
  return q + uWarp * vec2(sin(q.y * 0.9 + t), cos(q.x * 0.8 - t * 0.8));
}

float detail(float t) {
  return smoothstep(3.0, 8.0, 1.0 / max(t * uPixelAngle, 1e-5)) * (1.0 - smoothstep(uFogStart, mix(uFogStart, uFar, 0.7), t));
}

float profile(float u, out float rate) {
  float root = sqrt(max(1.0 - u, 0.0) + uRound * uRound);
  rate = 0.5 / (uSpan * root);
  return clamp(1.0 - (root - uRound) / uSpan, 0.0, 1.0);
}

float spikes(vec2 p, float a, float rise, out float clearance) {
  clearance = 10.0;
  if (a < 0.002) return 0.0;
  vec2 q = lattice(p);
  float u = (cos(G * dot(E1, q)) + cos(G * dot(E2, q)) + cos(G * dot(E3, q)) + 1.5) / 4.5;
  if (a > 0.05) {
    float root = uRound + (1.0 - pow(clamp(rise / a, 0.0, 1.0), 1.0 / uExponent)) * uSpan;
    clearance = sqrt(max(1.0 - u, 0.0) / 8.77) - sqrt(max(root * root - uRound * uRound, 0.0) / 8.77);
  }
  float rate;
  return a * pow(profile(u, rate), uExponent);
}

vec2 spikesSlope(vec2 p, float a, vec2 aSlope) {
  if (a < 0.002) return vec2(0.0);
  vec2 q = lattice(p);
  float c1 = G * dot(E1, q);
  float c2 = G * dot(E2, q);
  float c3 = G * dot(E3, q);
  float u = (cos(c1) + cos(c2) + cos(c3) + 1.5) / 4.5;
  vec2 du = -(G / 4.5) * (sin(c1) * E1 + sin(c2) * E2 + sin(c3) * E3) * TURN;
  float rate;
  float s = max(profile(u, rate), 1e-4);
  float shape = pow(s, uExponent);
  return a * uExponent * shape / s * rate * du + aSlope * shape;
}

float surface(vec2 p, float z, float t, out float clearance) {
  vec4 f = texture(uField, (p - uGridOrigin) / uGridSpan);
  return f.z + spikes(p, f.x * detail(t), z - f.z, clearance);
}

vec2 bound(vec2 p) {
  return texture(uBound, (p - uGridOrigin) / uBoundSpan).rg;
}

float panel(vec3 r, vec3 dir, vec3 up, vec2 extent, float soft) {
  vec3 side = normalize(cross(dir, up));
  vec3 top = cross(side, dir);
  float facing = dot(r, dir);
  if (facing <= 0.0) return 0.0;
  vec2 q = vec2(dot(r, side), dot(r, top)) / facing;
  vec2 e = smoothstep(extent + soft, extent - soft, abs(q));
  return e.x * e.y;
}

vec3 studio(vec3 r, vec3 rd, float soft) {
  vec3 z = vec3(0.0, 0.0, 1.0);
  vec3 col = uKey * 4.2 * panel(r, normalize(vec3(-0.3, -0.5, 0.81)), z, vec2(0.36, 0.22), 0.08 + soft);
  col += uStrip * 1.5 * panel(r, normalize(vec3(-0.9, -0.2, 0.38)), z, vec2(0.12, 0.7), 0.07 + soft);
  col += uStrip * 1.5 * panel(r, normalize(vec3(0.9, -0.1, 0.42)), z, vec2(0.12, 0.7), 0.07 + soft);
  float lift = asin(clamp(r.z, -1.0, 1.0)) - asin(clamp(-rd.z, -1.0, 1.0));
  col += uFill * 0.45 * smoothstep(0.08 - soft, 0.7 + soft, lift) * smoothstep(1.6, 1.0, lift);
  return col;
}

vec4 finish(vec3 light, vec3 paper, float alpha) {
  if (uLight > 0.5) {
    if (uOpaque > 0.5) return vec4(mix(uBase, paper, alpha) * uOpacity, uOpacity);
    vec3 shade = mix(vec3(1.0), paper, alpha * uOpacity);
    float cover = 1.0 - min(shade.r, min(shade.g, shade.b));
    return vec4(shade - (1.0 - cover), cover);
  }
  vec3 glow = light * alpha * uOpacity;
  if (uOpaque > 0.5) return vec4(uBase + glow, 1.0);
  return vec4(glow, max(glow.r, max(glow.g, glow.b)));
}

void main() {
  vec2 ndc = (gl_FragCoord.xy - 0.5 * uResolution) / (0.5 * uResolution.y);
  vec3 side = normalize(cross(uForward, uUpward));
  vec3 rd = normalize(uForward + (ndc.x * side + ndc.y * uUpward) * uTanHalf);
  if (rd.z > -0.004) {
    outColor = finish(vec3(0.0), vec3(1.0), 0.0);
    return;
  }
  float tTop = max((uTop - uCamera.z) / rd.z, 0.0);
  float tEnd = min((uBottom - uCamera.z) / rd.z, uFar);
  if (tTop >= tEnd) {
    outColor = finish(vec3(0.0), vec3(1.0), 0.0);
    return;
  }
  float sink = max(-rd.z, 0.2);
  float glide = max(length(rd.xy), 0.05);
  float chunk = 0.9 / glide;
  float t = tEnd;
  float tPrev = tEnd;
  bool found = false;
  bool smoothHit = false;
  float t0 = tTop;
  vec2 b0 = bound(uCamera.xy + rd.xy * t0);
  for (int c = 0; c < 64; c++) {
    if (t0 >= tEnd) break;
    float t1 = min(t0 + chunk, tEnd);
    vec2 b1 = bound(uCamera.xy + rd.xy * t1);
    float b = max(b0.x, b1.x) + 0.03;
    float z1 = uCamera.z + rd.z * t1;
    if (z1 > b) {
      t0 = t1;
      b0 = b1;
      continue;
    }
    float tt = max(t0, (b - uCamera.z) / rd.z);
    if (max(b0.y, b1.y) < 0.002) {
      for (int k = 0; k < 3; k++) {
        vec3 probe = uCamera + rd * tt;
        tt += (probe.z - mound(probe.xy).x) / sink * 0.95;
      }
      if (tt <= t1 + 0.02 || t1 >= tEnd) {
        t = tt;
        smoothHit = true;
        break;
      }
      t0 = t1;
      b0 = b1;
      continue;
    }
    float tp = tt;
    for (int k = 0; k < 48; k++) {
      vec3 pos = uCamera + rd * tt;
      float clearance;
      float gap = pos.z - surface(pos.xy, pos.z, tt, clearance);
      if (gap < 0.0) {
        found = true;
        break;
      }
      tp = tt;
      float pixel = tt * uPixelAngle;
      float limit = pos.z > bound(pos.xy).x + 0.02 ? 0.6 / glide : max(clearance * 0.9, pixel) / glide;
      tt += max(min(gap * 0.75 / sink, limit), pixel);
      if (tt > t1) break;
    }
    if (found) {
      t = tt;
      tPrev = tp;
      break;
    }
    t0 = t1;
    b0 = b1;
  }

  vec3 pos;
  vec2 slope;
  if (smoothHit || !found) {
    pos = uCamera + rd * t;
    slope = mound(pos.xy).yz;
  } else {
    float lo = tPrev;
    float hi = t;
    for (int k = 0; k < 4; k++) {
      float mid = 0.5 * (lo + hi);
      vec3 probe = uCamera + rd * mid;
      float clearance;
      if (probe.z - surface(probe.xy, probe.z, mid, clearance) < 0.0) hi = mid;
      else lo = mid;
    }
    t = hi;
    pos = uCamera + rd * t;
    vec2 uv = (pos.xy - uGridOrigin) / uGridSpan;
    vec2 step = uCellSize / uGridSpan;
    float fade = detail(t);
    float a = texture(uField, uv).x * fade;
    vec2 aSlope = vec2(
      texture(uField, uv + vec2(step.x, 0.0)).x - texture(uField, uv - vec2(step.x, 0.0)).x,
      texture(uField, uv + vec2(0.0, step.y)).x - texture(uField, uv - vec2(0.0, step.y)).x
    ) * fade / (2.0 * uCellSize);
    slope = mound(pos.xy).yz + spikesSlope(pos.xy, a, aSlope);
  }

  vec3 n = normalize(vec3(-slope, 1.0));
  vec3 r = reflect(rd, n);
  float soft = length(fwidth(r)) * 0.6;
  float facing = max(dot(n, -rd), 0.0);
  float fresnel = F0 + (1.0 - F0) * pow(1.0 - facing, 5.0);
  float rim = pow(1.0 - clamp(abs(dot(rd, n)), 0.0, 1.0), 3.0) * smoothstep(0.85, 0.4, n.z);
  float distance = 1.0 - smoothstep(uFogStart, uFar, t);

  if (uLight > 0.5) {
    vec3 key = normalize(vec3(-0.45, -0.55, 0.7));
    float lambert = clamp(dot(n, key) / key.z, 0.0, 1.0);
    float diffuse = mix(0.62, 1.0, lambert);
    float room = mix(0.3, 1.0, smoothstep(-0.25, 0.3, r.z));
    room -= 0.3 * rim;
    float lum = mix(diffuse, room, fresnel);
    lum = 1.0 - (1.0 - lum) * clamp(uExposure / 3.0, 0.0, 1.5);
    vec3 shadow = mix(vec3(0.0), uStrip, 0.45);
    vec3 paper = mix(shadow, vec3(1.0), clamp(lum, 0.0, 1.0));
    outColor = finish(vec3(0.0), paper, distance);
    return;
  }

  vec3 shine = 1.0 - exp(-(studio(r, rd, soft) * fresnel + uFill * rim * 0.35) * uExposure);
  outColor = finish(shine, vec3(1.0), distance);
}`,m=(e,t,n)=>Math.min(n,Math.max(t,e)),h=e=>{let t=m((e-1)/4,0,1),n=1-t*.7;return{round:n,exponent:1.05+t*1.2,span:Math.sqrt(1+n*n)-n}},g=(e,t,n)=>{let r=e.createShader(t);return r?(e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(e.deleteShader(r),null)):null},_=(e,t)=>{let n=g(e,e.VERTEX_SHADER,u),r=g(e,e.FRAGMENT_SHADER,t),i=e.createProgram();if(!n||!r||!i)return null;if(e.attachShader(i,n),e.attachShader(i,r),e.bindAttribLocation(i,0,`aPosition`),e.linkProgram(i),e.deleteShader(n),e.deleteShader(r),!e.getProgramParameter(i,e.LINK_STATUS))return e.deleteProgram(i),null;let a={},o=e.getProgramParameter(i,e.ACTIVE_UNIFORMS);for(let t=0;t<o;t++){let n=e.getActiveUniform(i,t);n&&(a[n.name.replace(`[0]`,``)]=e.getUniformLocation(i,n.name))}return{program:i,uniforms:a}},v=({colors:e=[`#ffffff`,`#ffffff`,`#ffffff`],speed:t=.5,scale:n=1.6,spikeHeight:u=1,sharpness:g=2.5,turbulence:v=1,fluidity:y=.5,tilt:b=48,magnetism:x=1,variation:S=0,flowDirection:C=`down`,brightness:w=1,mouseInteraction:T=!0,mouseStrength:E=1,mouseRadius:D=.22,mouseDampening:O=.15,clickPulse:k=!0,intro:A=!0,lightMode:j=!1,transparent:M=!0,color:N,opacity:P=1,paused:F=!1,dpr:I,mixBlendMode:L,className:R=``,style:z,...B})=>{let V=(0,r.useRef)(null),H=(0,r.useRef)(null),U=(0,r.useRef)(null),W={colors:Array.isArray(e)&&e.length?e.slice(0,3):[`#ffffff`],speed:Math.max(0,t),scale:m(n,.2,6),spikeHeight:Math.max(0,u),sharpness:m(g,.6,6),turbulence:Math.max(0,v),fluidity:m(y,0,1),tilt:m(b,10,70),magnetism:Math.max(0,x),variation:S,flow:l[C]??l.down,brightness:Math.max(0,w),mouseInteraction:T,mouseStrength:Math.max(0,E),mouseRadius:m(D,.02,2),mouseDampening:Math.max(0,O),clickPulse:k,intro:A,lightMode:j,transparent:M,color:N,opacity:m(P,0,1),paused:F,dpr:I},G=(0,r.useRef)(W);return G.current=W,(0,r.useEffect)(()=>{let e=V.current,t=H.current,n=t?.getContext(`webgl2`,{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1});if(!e||!t||!n)return;let r=!!n.getExtension(`EXT_color_buffer_float`),i=_(n,d),l=_(n,f),u=_(n,p);if(!i||!l||!u)return;let g=n.createBuffer(),v=n.createVertexArray();n.bindVertexArray(v),n.bindBuffer(n.ARRAY_BUFFER,g),n.bufferData(n.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),n.STATIC_DRAW),n.enableVertexAttribArray(0),n.vertexAttribPointer(0,2,n.FLOAT,!1,0,0);let y=(e,t,i)=>{let a=n.createTexture();n.bindTexture(n.TEXTURE_2D,a),r?n.texImage2D(n.TEXTURE_2D,0,n.RGBA16F,e,t,0,n.RGBA,n.HALF_FLOAT,null):n.texImage2D(n.TEXTURE_2D,0,n.RGBA,e,t,0,n.RGBA,n.UNSIGNED_BYTE,null),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,i),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MAG_FILTER,i),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE);let o=n.createFramebuffer();return n.bindFramebuffer(n.FRAMEBUFFER,o),n.framebufferTexture2D(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,a,0),n.clearColor(0,0,0,0),n.clear(n.COLOR_BUFFER_BIT),{texture:a,framebuffer:o}},b=e=>{e&&(n.deleteTexture(e.texture),n.deleteFramebuffer(e.framebuffer))},x=document.createElement(`canvas`).getContext(`2d`,{willReadFrequently:!0}),S=new Map,C=(e,t)=>{if(!e)return t;let n=String(e),r=S.get(n);if(r)return r;let i=t;if(x){x.clearRect(0,0,1,1),x.fillStyle=`#000000`,x.fillStyle=n,x.fillRect(0,0,1,1);let[e,t,r]=x.getImageData(0,0,1,1).data;i=[e/255,t/255,r/255]}return S.set(n,i),i},w=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches??!1,T=Math.tan(c/2),E={width:1,height:1,worldHeight:10,scale:0,tilt:-1,reach:1},D={x:0,y:0,z:1,forward:[0,1,0],upward:[0,0,1],far:10,distance:4},O={width:0,height:0,originX:0,originY:0,boundWidth:0,boundHeight:0},k=[],A=null,j=0,M=!0,N={x:0,y:0,inside:!1},P={x:0,y:0,strength:0},F={x:0,y:0,age:10},I=0,L=G.current.intro&&!w?0:1,R=h(G.current.sharpness),z=G.current.sharpness,B=0,W=0,K=!0,ee=(e,t)=>{let n=e*(E.width/E.height)*T,r=t*T,[i,a,o]=D.forward,[,s,c]=D.upward,l=i+n,u=a+r*s,d=o+r*c,f=Math.hypot(l,u,d)||1;return[l/f,u/f,d/f]},q=(e,t)=>{let[n,r,i]=ee(e,t),a=i<-.004?Math.min(-D.z/i,D.far):D.far;return[D.x+n*a,D.y+r*a]},J=()=>{let r=G.current,i=Math.max(1,e.clientWidth),s=Math.max(1,e.clientHeight),c=Math.min(r.dpr||window.devicePixelRatio||1,2);t.width=Math.max(1,Math.round(i*c)),t.height=Math.max(1,Math.round(s*c)),E.width=t.width,E.height=t.height,E.worldHeight=22/r.scale,E.scale=r.scale,E.tilt=r.tilt;let l=(90-r.tilt)*Math.PI/180,u=E.worldHeight/(2*T);D.forward=[0,Math.cos(l),-Math.sin(l)],D.upward=[0,Math.sin(l),Math.cos(l)],D.x=0,D.y=-u*Math.cos(l),D.z=u*Math.sin(l),D.far=u*2.5,D.distance=u;let d=[q(-1,-1),q(1,-1),q(-1,1),q(1,1),q(0,1)],f=d.map(e=>e[0]),p=d.map(e=>e[1]),m=Math.min(...f)-3,h=Math.max(...f)+3,g=Math.min(...p)-3,_=Math.max(...p)+3;E.reach=Math.max(...d.map(e=>Math.hypot(e[0],e[1])))+4;let v=Math.ceil((h-m)/a)+2,x=Math.ceil((_-g)/a)+2;O.originX=m,O.originY=g,(v!==O.width||x!==O.height)&&(k.forEach(b),b(A),k=[y(v,x,n.LINEAR),y(v,x,n.LINEAR)],O.width=v,O.height=x,O.boundWidth=Math.ceil(v*a/o),O.boundHeight=Math.ceil(x*a/o),A=y(O.boundWidth,O.boundHeight,n.NEAREST),j=0),M=!0},te=(t,n)=>{let r=e.getBoundingClientRect(),i=(t-r.left)/Math.max(1,r.width)*2-1,a=1-(n-r.top)/Math.max(1,r.height)*2;return q(i,a)},ne=e=>{let t=G.current;(t.scale!==E.scale||t.tilt!==E.tilt)&&J();let n=+!t.paused;I+=e*n*(w?0:t.speed),L=t.intro&&!w?Math.min(1,L+e*n/s):1,F.age+=e*n;let r=t.mouseInteraction&&N.inside,i=t.mouseDampening>0?1-Math.exp(-e/t.mouseDampening):1;r&&(P.x+=(N.x-P.x)*i,P.y+=(N.y-P.y)*i);let a=r?t.mouseStrength*1.4:0;P.strength+=(a-P.strength)*(1-Math.exp(-e/.35)),Math.abs(a-P.strength)<.001&&(P.strength=a)},Y=e=>{if(!A||k.length<2)return;let t=G.current,s=E.worldHeight,c=t.mouseRadius*s,d=1.2*t.spikeHeight;t.sharpness!==z&&(z=t.sharpness,R=h(t.sharpness));let f=L*L*(3-2*L);n.bindVertexArray(v),n.activeTexture(n.TEXTURE0);let p=k[j],m=k[1-j];n.bindFramebuffer(n.FRAMEBUFFER,m.framebuffer),n.viewport(0,0,O.width,O.height),n.useProgram(i.program);let g=i.uniforms;n.bindTexture(n.TEXTURE_2D,p.texture),n.uniform1i(g.uState,0),n.uniform2f(g.uGridOrigin,O.originX,O.originY),n.uniform1f(g.uCell,a),n.uniform1f(g.uDt,Math.max(e,.001)),n.uniform1f(g.uTime,I),n.uniform2f(g.uFlow,t.flow[0],t.flow[1]),n.uniform1f(g.uTurbulence,t.turbulence),n.uniform1f(g.uMagnetism,t.magnetism),n.uniform1f(g.uFieldScale,5.5),n.uniform2f(g.uSeed,t.variation*17.31,t.variation*9.73),n.uniform4f(g.uCursor,P.x,P.y,P.strength,c),n.uniform4f(g.uPulse,F.x,F.y,F.age,F.age<4?1.1:0),n.uniform1f(g.uPulseSpeed,s*.45),n.uniform1f(g.uPulseWidth,1.4),n.uniform3f(g.uIntro,0,0,f*(E.reach+3)),n.uniform1f(g.uSpikeHeight,d),n.uniform1f(g.uMound,.6),n.uniform1f(g.uStiffness,150),n.uniform1f(g.uDamping,22-t.fluidity*15),n.uniform1f(g.uSettle,M||!r||w?1:0),n.drawArrays(n.TRIANGLES,0,3),M=!1,j=1-j,n.bindFramebuffer(n.FRAMEBUFFER,A.framebuffer),n.viewport(0,0,O.boundWidth,O.boundHeight),n.useProgram(l.program);let _=l.uniforms;n.bindTexture(n.TEXTURE_2D,m.texture),n.uniform1i(_.uState,0),n.uniform2f(_.uGridOrigin,O.originX,O.originY),n.uniform1f(_.uCell,a),n.uniform2f(_.uStateSize,O.width,O.height),n.uniform1f(_.uBoundCell,o),n.drawArrays(n.TRIANGLES,0,3),n.bindFramebuffer(n.FRAMEBUFFER,null),n.viewport(0,0,E.width,E.height),n.useProgram(u.program);let y=u.uniforms;n.bindTexture(n.TEXTURE_2D,m.texture),n.uniform1i(y.uField,0),n.activeTexture(n.TEXTURE1),n.bindTexture(n.TEXTURE_2D,A.texture),n.uniform1i(y.uBound,1),n.activeTexture(n.TEXTURE0),n.uniform2f(y.uGridOrigin,O.originX,O.originY),n.uniform2f(y.uGridSpan,O.width*a,O.height*a),n.uniform2f(y.uBoundSpan,O.boundWidth*o,O.boundHeight*o),n.uniform1f(y.uCellSize,a),n.uniform2f(y.uResolution,E.width,E.height),n.uniform3f(y.uCamera,D.x,D.y,D.z),n.uniform3fv(y.uForward,D.forward),n.uniform3fv(y.uUpward,D.upward),n.uniform1f(y.uTanHalf,T),n.uniform1f(y.uPixelAngle,2*T/E.height),n.uniform1f(y.uFar,D.far),n.uniform1f(y.uFogStart,D.distance*.95),n.uniform1f(y.uTop,d*1.6+.6*3+.1),n.uniform1f(y.uBottom,-.05),n.uniform1f(y.uTime,I*2),n.uniform4f(y.uCursor,P.x,P.y,P.strength,c),n.uniform1f(y.uMound,.6),n.uniform1f(y.uRound,R.round),n.uniform1f(y.uSpan,R.span),n.uniform1f(y.uExponent,R.exponent),n.uniform1f(y.uWarp,.06*t.turbulence);let b=t.colors.map(e=>C(e,[1,1,1])),x=b[0],S=b[1]??x,N=b[2]??S;n.uniform3fv(y.uKey,x),n.uniform3fv(y.uStrip,S),n.uniform3fv(y.uFill,N),n.uniform1f(y.uExposure,3*t.brightness),n.uniform1f(y.uLight,+!!t.lightMode),n.uniform1f(y.uOpaque,+!t.transparent),n.uniform3fv(y.uBase,C(t.color,t.lightMode?[1,1,1]:[.0706,.0588,.0902])),n.uniform1f(y.uOpacity,t.opacity),n.drawArrays(n.TRIANGLES,0,3)},re=e=>{if(B=0,!K||document.hidden)return;let t=W?m((e-W)/1e3,5e-4,.05):1/60;W=e,ne(t),Y(t),B=requestAnimationFrame(re)},X=()=>{!B&&K&&!document.hidden&&(B=requestAnimationFrame(re))},Z=()=>{J(),Y(0),X()},ie=t=>{let n=e.getBoundingClientRect(),r=t.clientX-n.left,i=t.clientY-n.top;N.inside=r>=0&&i>=0&&r<=n.width&&i<=n.height,[N.x,N.y]=te(t.clientX,t.clientY)},Q=e=>{let t=N.inside;ie(e),N.inside&&!t&&P.strength<.05&&(P.x=N.x,P.y=N.y),X()},ae=e=>{Q(e),N.inside&&G.current.clickPulse&&!w&&(F.x=N.x,F.y=N.y,F.age=0)},$=e=>{e.pointerType!==`mouse`&&(N.inside=!1)},oe=()=>{N.inside=!1},se=()=>{W=0,X()},ce=new ResizeObserver(Z);ce.observe(e);let le=new IntersectionObserver(e=>{K=e.some(e=>e.isIntersecting),K&&(W=0,X())});le.observe(e),window.addEventListener(`pointermove`,Q,{passive:!0}),window.addEventListener(`pointerdown`,ae,{passive:!0}),window.addEventListener(`pointerup`,$,{passive:!0}),window.addEventListener(`pointercancel`,$,{passive:!0}),document.documentElement.addEventListener(`pointerleave`,oe),document.addEventListener(`visibilitychange`,se),Z();let ue=G.current.dpr;return U.current=()=>{let e=G.current;e.dpr===ue?X():(ue=e.dpr,Z())},()=>{cancelAnimationFrame(B),U.current=null,ce.disconnect(),le.disconnect(),window.removeEventListener(`pointermove`,Q),window.removeEventListener(`pointerdown`,ae),window.removeEventListener(`pointerup`,$),window.removeEventListener(`pointercancel`,$),document.documentElement.removeEventListener(`pointerleave`,oe),document.removeEventListener(`visibilitychange`,se),k.forEach(b),b(A),n.deleteProgram(i.program),n.deleteProgram(l.program),n.deleteProgram(u.program),n.deleteBuffer(g),n.deleteVertexArray(v),n.getExtension(`WEBGL_lose_context`)?.loseContext()}},[]),(0,r.useEffect)(()=>{U.current?.()}),(0,i.jsx)(`div`,{ref:V,className:[`relative h-full w-full overflow-hidden`,R].filter(Boolean).join(` `),style:L?{...z,mixBlendMode:L}:z,...B,children:(0,i.jsx)(`canvas`,{ref:H,className:`absolute inset-0 block h-full w-full`,"aria-hidden":`true`})})};export{v as default};