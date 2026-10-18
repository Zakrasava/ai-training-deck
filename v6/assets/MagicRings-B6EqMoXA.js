import{i as e,t}from"./react-sySUN5R7.js";import{k as n}from"./sculpture-dark-CKiqtzhU.js";var r=e(t(),1),i=n(),a=12,o=3,s=15,c=128,l=`
const vec2 corners[3] = vec2[3](vec2(-1.0, -1.0), vec2(3.0, -1.0), vec2(-1.0, 3.0));
void main() {
  gl_Position = vec4(corners[gl_VertexID], 0.0, 1.0);
}`,u=`
layout(location = 0) in vec2 aSegment;
uniform mat3 uForward;
uniform vec2 uResolution;
uniform float uUnit;
uniform vec2 uCenter;
uniform vec4 uShape[SLOTS];
uniform vec4 uFrame[SLOTS];
uniform float uReach;
uniform float uSplit;
flat out int vSlot;
out vec2 vPlane;
void main() {
  vec4 shape = uShape[gl_InstanceID];
  vec2 origin = uCenter + uFrame[gl_InstanceID].xy;
  float angle = aSegment.x * 6.2831853;
  vec2 direction = vec2(cos(angle), sin(angle));
  vec3 inner = uForward * vec3(origin + direction * shape.x, 1.0);
  vec3 outer = uForward * vec3(origin + direction * (shape.x + 0.01), 1.0);
  float pixels = length(outer.xy / outer.z - inner.xy / inner.z) * 100.0 * uUnit;
  float band = uReach / max(pixels, 1e-3) + uSplit * shape.x;
  vec2 plane = origin + direction * max(shape.x + aSegment.y * band, 0.0);
  vec3 screen = uForward * vec3(plane, 1.0);
  gl_Position = vec4(screen.xy * (2.0 * uUnit / uResolution), 0.0, screen.z);
  vPlane = plane;
  vSlot = gl_InstanceID;
}`,d=`
uniform vec2 uResolution;
uniform vec2 uScale;
uniform float uUnit;
uniform mat3 uInverse;
uniform vec2 uCenter;
uniform int uCount;
uniform vec4 uShape[SLOTS];
uniform vec4 uFrame[SLOTS];
uniform vec4 uTint[SLOTS];
uniform vec4 uHover;
uniform vec2 uBounds;
uniform float uSplit;
uniform float uOpacity;

out vec4 fragColor;

float hash(vec2 p) {
  vec3 q = fract(vec3(p.xyx) * 0.1031);
  q += dot(q, q.yzx + 33.33);
  return fract((q.x + q.y) * q.z);
}

float angleOf(vec2 v) {
  vec2 a = abs(v);
  float t = min(a.x, a.y) / max(max(a.x, a.y), 1e-6);
  float r = t * (0.5 + 0.1738 * (1.0 - t));
  return a.y > a.x ? 1.0 - r : r;
}

float nearness(vec2 plane) {
  vec2 offset = plane - uHover.xy;
  return uHover.z * exp(-dot(offset, offset) * uHover.w);
}

vec3 prismOf(vec3 tint) {
  return mix(tint, vec3(dot(tint, vec3(0.3333))), 0.65) * 0.85;
}

vec4 toneMap(vec3 light) {
  float peak = max(max(light.r, light.g), light.b);
  if (peak <= 0.0) return vec4(0.0);
  float level = 1.0 - exp(-peak);
  vec3 color = mix(light * (level / peak), vec3(level), smoothstep(1.4, 3.6, peak) * 0.4);
  return vec4(color, level);
}
`,f=`
uniform vec4 uHalo;
uniform vec3 uRange;

float haloOf(float d) {
  float fall = exp(-d * uHalo.y);
  float tight = fall * fall;
  tight *= tight;
  float window = clamp(1.0 - (d - uRange.x) * uRange.y, 0.0, 1.0);
  return (uHalo.z * tight + uHalo.w * fall) * window * window;
}

void main() {
  vec3 projected = uInverse * vec3((gl_FragCoord.xy * uScale - 0.5 * uResolution) / uUnit, 1.0);
  vec2 plane = projected.xy / projected.z;
  vec2 base = plane - uCenter;
  float reach = length(base);
  if (projected.z <= 0.0 || reach < uBounds.x || reach > uBounds.y) {
    fragColor = vec4(0.0);
    return;
  }
  float boost = 1.0 + 1.6 * nearness(plane);
  float limit = uRange.z + uSplit;
  vec3 light = vec3(0.0);
  float alpha = 0.0;

  for (int i = 0; i < SLOTS; i++) {
    if (i >= uCount) break;
    vec4 shape = uShape[i];
    vec4 frame = uFrame[i];
    vec2 w = base - frame.xy;
    float len = length(w);
    float d = abs(len - shape.x);
    if (d > limit) continue;
    float a = angleOf(vec2(dot(w, frame.zw), frame.z * w.y - frame.w * w.x));
    if (a > shape.w) continue;
    float energy = shape.y * max(exp(-shape.z * a * a * a) - 0.002, 0.0) * boost;
    vec3 tint = uTint[i].rgb;
#ifdef PRISM
    float offset = uSplit * shape.x;
    vec3 halo = vec3(haloOf(abs(len - shape.x - offset)), haloOf(d), haloOf(abs(len - shape.x + offset)));
#else
    vec3 halo = vec3(haloOf(d));
#endif
#ifdef LIGHT
    float layer = clamp(energy * dot(halo, vec3(0.3333)), 0.0, 1.0);
    light = tint * layer + light * (1.0 - layer);
    alpha = layer + alpha * (1.0 - layer);
#else
#ifdef PRISM
    tint = prismOf(tint);
#endif
    light += tint * energy * halo;
#endif
  }
#ifdef LIGHT
  fragColor = vec4(light, alpha);
#elif defined(PACKED)
  fragColor = vec4(1.0 - exp(-light), 1.0);
#else
  fragColor = vec4(light, 1.0);
#endif
}`,p=`
uniform sampler2D uGlow;
uniform float uGrain;
uniform float uTime;

void main() {
  vec4 glow = texture(uGlow, gl_FragCoord.xy / uResolution);
  float grain = 1.0;
  if (uGrain > 0.0) grain += uGrain * (hash(gl_FragCoord.xy + fract(uTime * 7.31) * 413.0) - 0.5) * 1.8;
  float dither = (hash(gl_FragCoord.xy) - 0.5) / 255.0;
#ifdef LIGHT
  float alpha = clamp(glow.a * grain, 0.0, 1.0);
  if (alpha <= 0.0) {
    fragColor = vec4(0.0);
    return;
  }
  vec3 ink = glow.rgb * grain;
  alpha = clamp(alpha + dither, 0.0, 1.0);
  fragColor = vec4(min(ink, vec3(alpha)), alpha) * uOpacity;
#else
#ifdef PACKED
  vec3 light = -log(1.0 - min(glow.rgb, vec3(0.9995))) * grain;
#else
  vec3 light = glow.rgb * grain;
#endif
  vec4 color = toneMap(light);
  if (color.a <= 0.0) {
    fragColor = vec4(0.0);
    return;
  }
  float alpha = clamp(color.a + dither, 0.0, 1.0);
  fragColor = vec4(min(color.rgb, vec3(alpha)), alpha) * uOpacity;
#endif
}`,m=`
flat in int vSlot;
in vec2 vPlane;
uniform float uWidth;

float coverage(float pixels, float halfWidth) {
  return clamp(max(halfWidth, 0.5) - pixels + 0.5, 0.0, 1.0) * min(halfWidth * 2.0, 1.0);
}

void main() {
  vec4 shape = uShape[vSlot];
  vec4 frame = uFrame[vSlot];
  vec4 tint = uTint[vSlot];
  vec2 w = vPlane - uCenter - frame.xy;
  float len = length(w);
  float stretch = 1.0 / max(length(vec2(dFdx(len), dFdy(len))), 1e-6);
  float a = angleOf(vec2(dot(w, frame.zw), frame.z * w.y - frame.w * w.x));
  float near = nearness(vPlane);
  float energy = shape.y * max(exp(-shape.z * a * a * a) - 0.002, 0.0) * (1.0 + 1.6 * near) * step(a, shape.w);
  float halfWidth = uWidth * (1.0 + 0.45 * near) * max(1.0 - a, 0.5) * tint.w;
  float pixels = abs(len - shape.x) * stretch;
#ifdef PRISM
  float offset = uSplit * shape.x;
  vec3 core = vec3(
    coverage(abs(len - shape.x - offset) * stretch, halfWidth),
    coverage(pixels, halfWidth),
    coverage(abs(len - shape.x + offset) * stretch, halfWidth)
  );
#else
  vec3 core = vec3(coverage(pixels, halfWidth));
#endif
#ifdef LIGHT
  float hot = core.g * clamp(1.0 - pixels / max(halfWidth * 0.35, 0.3), 0.0, 1.0);
  float layer = energy * max(max(core.r, core.g), core.b);
  if (layer <= 0.0) discard;
#ifdef PRISM
  vec3 color = clamp(1.0 - (1.0 - tint.rgb) * core * 1.4, 0.0, 1.0);
#else
  vec3 color = tint.rgb;
#endif
  color = mix(color, vec3(1.0), hot * 0.7);
  fragColor = vec4(color * layer, layer) * uOpacity;
#else
#ifdef PRISM
  vec4 color = toneMap(prismOf(tint.rgb) * energy * core * 1.7);
#else
  vec4 color = toneMap(tint.rgb * energy * core * 1.7);
#endif
  if (color.a <= 0.0) discard;
  fragColor = color * uOpacity;
#endif
}`,ee=(e,t)=>[`#version 300 es`,`precision highp float;`,`#define SLOTS ${s}`,...t.map(e=>`#define ${e}`),e].join(`
`),h={glow:f,compose:p,line:m},g=[`pulse`,`ripple`,`breathe`],_=3.45,v=.5,y=2.6,b=1.1,te=.9,x=(e,t,n)=>Math.min(n,Math.max(t,e)),S=(e,t,n)=>{let r=x((n-e)/(t-e),0,1);return r*r*(3-2*r)},ne=e=>Math.min(S(0,.7,e),1-S(.5,3.25,e)),C=e=>e<=.04045?e/12.92:((e+.055)/1.055)**2.4,w=e=>{let t=String(e||``).trim(),n=/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(t);if(n){let e=n[1].length===3?n[1].replace(/./g,e=>e+e):n[1];return[0,2,4].map(t=>parseInt(e.slice(t,t+2),16)/255)}let r=/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i.exec(t);if(r)return[r[1],r[2],r[3]].map(e=>x(parseFloat(e)/255,0,1));if(typeof document<`u`){let e=document.createElement(`canvas`).getContext(`2d`);if(e){e.fillStyle=`#000000`,e.fillStyle=t;let n=String(e.fillStyle);if(n!==`#000000`||/^(#0{3}|#0{6}|black)$/i.test(t))return w(n)}}return[.66,.33,.97]},T=(e,t,n)=>{let r=e.createShader(t);return r?(e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(console.error(e.getShaderInfoLog(r)),e.deleteShader(r),null)):null},E=(e,t,n)=>{let r=T(e,e.VERTEX_SHADER,t),i=T(e,e.FRAGMENT_SHADER,n),a=r&&i?e.createProgram():null;if(!r||!i||!a)return r&&e.deleteShader(r),i&&e.deleteShader(i),null;if(e.attachShader(a,r),e.attachShader(a,i),e.linkProgram(a),e.deleteShader(r),e.deleteShader(i),!e.getProgramParameter(a,e.LINK_STATUS))return console.error(e.getProgramInfoLog(a)),e.deleteProgram(a),null;let o={},s=e.getProgramParameter(a,e.ACTIVE_UNIFORMS);for(let t=0;t<s;t++){let n=e.getActiveUniform(a,t);n&&(o[n.name.replace(/\[0\]$/,``)]=e.getUniformLocation(a,n.name))}return{program:a,uniforms:o}},D=e=>{let[t,n,r,i,a,o,s,c,l]=e,u=a*l-o*c,d=o*s-i*l,f=i*c-a*s,p=t*u+n*d+r*f;return[u,r*c-n*l,n*o-r*a,d,t*l-r*s,r*i-t*o,f,n*s-t*c,t*a-n*i].map(e=>e/p)},re=(e,t)=>{let n=e*Math.PI/180,r=t*Math.PI/180,i=Math.cos(n),a=Math.sin(n),o=Math.cos(r),s=Math.sin(r),c=[o,s*a,0,0,i,0,s*i/y,-a/y,1];return{forward:c,inverse:D(c)}},ie=(e,t,n)=>{let r=e[6]*t+e[7]*n+e[8];return[(e[0]*t+e[1]*n+e[2])/r,(e[3]*t+e[4]*n+e[5])/r,r]},O=({color:e=`#A855F7`,colorTwo:t=`#6366F1`,ringCount:n=6,motion:s=`pulse`,speed:f=1,lineThickness:p=2,glow:m=1,baseRadius:y=.35,radiusStep:T=.1,expansion:D=.1,taper:O=1.5,rotation:k=0,spin:A=0,tilt:j=0,dispersion:M=0,grain:N=0,opacity:P=1,followMouse:F=!1,mouseInfluence:I=.2,hoverScale:L=1.2,hoverIntensity:R=1,parallax:z=.05,clickBurst:B=!0,intro:V=!0,theme:ae=`dark`,maxDevicePixelRatio:H=2,className:U=``,style:W})=>{let G=(0,r.useRef)(null),oe=(0,r.useRef)(null),K=(0,r.useRef)(null),[q,J]=(0,r.useState)(0),Y=ae===`light`,X=w(e),Z=w(t),Q={color:Y?X:X.map(C),colorTwo:Y?Z:Z.map(C),ringCount:x(Math.round(n),1,a),motion:g.includes(s)?s:`pulse`,speed:Math.max(0,f),lineThickness:Math.max(.25,p),glow:x(m,0,3),baseRadius:Math.max(.01,y),radiusStep:Math.max(0,T),expansion:D,taper:Math.max(.5,O),rotation:k*Math.PI/180,spin:A,tilt:x(j,-80,80),dispersion:x(M,0,1),grain:x(N,0,1),opacity:x(P,0,1),followMouse:F,mouseInfluence:I,hoverScale:Math.max(.5,L),hoverIntensity:Math.max(0,R),parallax:z,clickBurst:B,intro:V,light:Y,maxRatio:x(H,.5,3)},$=(0,r.useRef)(Q);return $.current=Q,(0,r.useEffect)(()=>{K.current?.()}),(0,r.useEffect)(()=>{let e=G.current,t=oe.current;if(!e||!t)return;let n=t.getContext(`webgl2`,{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1,powerPreference:`default`});if(!n)return;let r=new Map,i=(e,t)=>{let i=`${e}|${t.join(`,`)}`;if(!r.has(i)){let a=ee(e===`line`?u:l,t);r.set(i,E(n,a,ee(`${d}${h[e]}`,t)))}return r.get(i)};if(!i(`glow`,[])||!i(`compose`,[])||!i(`line`,[]))return;let a=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,s=n.createVertexArray(),f=n.createVertexArray(),p=n.createBuffer(),m=new Float32Array(516);for(let e=0;e<=c;e++)m.set([e/c,-1,e/c,1],e*4);n.bindVertexArray(f),n.bindBuffer(n.ARRAY_BUFFER,p),n.bufferData(n.ARRAY_BUFFER,m,n.STATIC_DRAW),n.enableVertexAttribArray(0),n.vertexAttribPointer(0,2,n.FLOAT,!1,0,0),n.bindVertexArray(null);let g=n.createTexture(),y=n.createFramebuffer(),C={width:0,height:0},w=!!n.getExtension(`EXT_color_buffer_float`),T=new Float32Array(60),D=new Float32Array(60),O=new Float32Array(60),k={width:1,height:1,ratio:1,unit:1},A={x:0,y:0,inside:!1,touch:!1},j={x:0,y:0,vx:0,vy:0,hover:0,hoverVelocity:0},M=[],N=$.current.intro&&$.current.speed>0&&!a&&q===0,P=N?0:1.6,F=0,I=0,L=0,R=!0,z=document.visibilityState!==`hidden`,B=!1,V=()=>{let r=$.current,i=e.getBoundingClientRect(),a=Math.min(window.devicePixelRatio||1,r.maxRatio),o=Math.max(1,Math.round(i.width*a)),s=Math.max(1,Math.round(i.height*a));(t.width!==o||t.height!==s)&&(t.width=o,t.height=s),Object.assign(k,{width:o,height:s,ratio:a,unit:Math.max(1,Math.min(o,s))});let c=Math.max(1,Math.ceil(o/2)),l=Math.max(1,Math.ceil(s/2));if(C.width===c&&C.height===l)return;Object.assign(C,{width:c,height:l});let u=e=>{n.bindTexture(n.TEXTURE_2D,g),n.texImage2D(n.TEXTURE_2D,0,e?n.RGBA16F:n.RGBA8,c,l,0,n.RGBA,e?n.HALF_FLOAT:n.UNSIGNED_BYTE,null),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MAG_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE),n.bindFramebuffer(n.FRAMEBUFFER,y),n.framebufferTexture2D(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,g,0);let t=n.checkFramebufferStatus(n.FRAMEBUFFER)===n.FRAMEBUFFER_COMPLETE;return n.bindFramebuffer(n.FRAMEBUFFER,null),t};u(w)||(w=!1,u(!1))},ae=(e,t,n)=>{let r=n>1?t/(n-1):0;if(e.motion===`ripple`){let r=n*e.radiusStep+e.expansion,i=_*Math.max(1,n)*.32,a=P/i+t/n,o=a-Math.floor(a),s=P-o*i>=-1e-4||!N?S(0,.12,o)*(1-S(.62,1,o)):0,c=o*Math.max(1,n-1);return{radius:e.baseRadius+o*r,life:s,virtual:c,mix:o,opening:1}}if(e.motion===`breathe`){let n=Math.sin(P/4*Math.PI*2-t*.55),i=N?S(t*.12,t*.12+.9,P):1;return{radius:e.baseRadius+t*e.radiusStep+e.expansion*.5*(1+n),life:(.78+.22*n)*i,virtual:t,mix:r,opening:1}}let i=P-t*v,a=(i%_+_)%_,o=N&&i<0?0:ne(a);return{radius:e.baseRadius+t*e.radiusStep+(1-(1-a/_)**2)*e.expansion,life:o,virtual:t,mix:r,opening:N&&i<_?S(0,.9,i):1}},H=()=>{let e=$.current,r=e.ringCount,o=j.hover,c=+!a,l=1+(e.hoverScale-1)*o*c,u=j.x*c,d=j.y*c,p=re(e.tilt-d*e.parallax*260,u*e.parallax*260),m=e.followMouse?[u*e.mouseInfluence,d*e.mouseInfluence]:[0,0],ee=e.spin*P*.6,h=0,_=1/0,v=0,S=0,ne=(t,n,r,i,a,o,s,c)=>{if(n<=.002)return;let l=10*t*r*r*r;T.set([t,n,l,l>6.2?Math.cbrt(6.2/l):2],h*4),D.set([a,o,Math.cos(i),Math.sin(i)],h*4),O.set([e.color[0]+(e.colorTwo[0]-e.color[0])*s,e.color[1]+(e.colorTwo[1]-e.color[1])*s,e.color[2]+(e.colorTwo[2]-e.color[2])*s,c],h*4),_=Math.min(_,t),v=Math.max(v,t),S=Math.max(S,Math.hypot(a,o)),h++};for(let t=0;t<r;t++){let n=ae(e,t,r),i=n.radius*l,a=n.life;for(let e of M){let t=F-e.start,n=(e.radius+t*te)*l,r=Math.max(0,1-t/b)**1.5,o=(n-i)/.08;i+=.04*Math.exp(-o*o)*r,a=Math.min(1.6,a+.9*Math.exp(-o*o*1.6)*r)}let o=e.taper**+n.virtual/Math.max(.08,n.opening),s=e.rotation+ee*(t%2?-1:1)*(1+t*.15);ne(i,a,o,s,t*e.parallax*u,t*e.parallax*d,n.mix,1)}for(let t of M){let n=F-t.start,r=Math.max(0,1-n/b)**1.5;ne((t.radius+n*te)*l,1.5*r,.85,e.rotation,0,0,x(n/b,0,1),1.15)}if(n.bindFramebuffer(n.FRAMEBUFFER,null),n.viewport(0,0,t.width,t.height),n.clearColor(0,0,0,0),n.clear(n.COLOR_BUFFER_BIT),!h)return;let E=[];e.light&&E.push(`LIGHT`),e.dispersion>0&&E.push(`PRISM`),w||E.push(`PACKED`);let N=i(`glow`,E),I=i(`compose`,E),L=i(`line`,E);if(!N||!I||!L)return;let R=(e.light?.3:1)*(1-e.dispersion*.45),z=.012+.033*e.glow,B=.5*Math.min(1,e.glow)*R,V=.9*e.glow*R,H=z*4.5+.008,U=e.dispersion*.03,W=H+U*v+S+.01,G=e.lineThickness*k.ratio,oe=G*(1+.45*e.hoverIntensity)*1.15+1.5,K=ie(p.inverse,A.x,A.y),q=r=>{let i=r.uniforms;return n.useProgram(r.program),n.uniform2f(i.uResolution,t.width,t.height),n.uniform1f(i.uUnit,k.unit),n.uniform2f(i.uCenter,m[0],m[1]),n.uniform1i(i.uCount,h),n.uniform4fv(i.uShape,T),n.uniform4fv(i.uFrame,D),n.uniform4fv(i.uTint,O),n.uniform4f(i.uHover,K[0]-m[0],K[1]-m[1],o*e.hoverIntensity,1/.03),n.uniform1f(i.uSplit,U),n.uniform1f(i.uOpacity,e.opacity),i};n.bindVertexArray(s),n.bindFramebuffer(n.FRAMEBUFFER,y),n.viewport(0,0,C.width,C.height),n.clear(n.COLOR_BUFFER_BIT);let J=q(N);n.uniform2f(J.uScale,t.width/C.width,t.height/C.height),n.uniformMatrix3fv(J.uInverse,!0,p.inverse),n.uniform2f(J.uBounds,Math.max(0,_-W),v+W),n.uniform4f(J.uHalo,0,1/z,B,V),n.uniform3f(J.uRange,H*.45,1/(H*.55),H),n.drawArrays(n.TRIANGLES,0,3),n.bindFramebuffer(n.FRAMEBUFFER,null),n.viewport(0,0,t.width,t.height);let Y=q(I);n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,g),n.uniform1i(Y.uGlow,0),n.uniform1f(Y.uGrain,e.grain),n.uniform1f(Y.uTime,F),n.drawArrays(n.TRIANGLES,0,3);let X=q(L);n.uniformMatrix3fv(X.uForward,!0,p.forward),n.uniform1f(X.uReach,oe),n.uniform1f(X.uWidth,G),n.enable(n.BLEND),e.light?n.blendFunc(n.ONE,n.ONE_MINUS_SRC_ALPHA):n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_COLOR,n.ONE,n.ONE_MINUS_SRC_ALPHA),n.bindVertexArray(f),n.drawArraysInstanced(n.TRIANGLE_STRIP,0,258,h),n.disable(n.BLEND),n.bindVertexArray(null)},U=e=>{if(I=0,B)return;let t=$.current,n=x((e-L)/1e3||0,0,.05);L=Math.max(L,e),F+=n,a||(P+=n*t.speed);let r=A.inside?A.x/Math.max(1e-6,k.width/k.unit):0,i=A.inside?A.y/Math.max(1e-6,k.height/k.unit):0,o=2*Math.sqrt(70)*.9,s=Math.max(1,Math.ceil(n/(1/240))),c=n/s;for(let e=0;e<s;e++){j.vx+=(70*(r-j.x)-o*j.vx)*c,j.vy+=(70*(i-j.y)-o*j.vy)*c,j.x+=j.vx*c,j.y+=j.vy*c;let e=+!!A.inside;j.hoverVelocity+=(40*(e-j.hover)-2*Math.sqrt(40)*j.hoverVelocity)*c,j.hover+=j.hoverVelocity*c}for(let e=M.length-1;e>=0;e--)F-M[e].start>b&&M.splice(e,1);N&&P>(t.ringCount+2)*v+_&&(N=!1),H();let l=Math.abs(j.vx)+Math.abs(j.vy)+Math.abs(j.hoverVelocity)>1e-4||Math.abs(+!!A.inside-j.hover)>.001;(t.speed>0&&!a||l||M.length>0||N)&&R&&z&&(I=requestAnimationFrame(U))},W=()=>{!I&&!B&&R&&z&&(L=performance.now(),I=requestAnimationFrame(U))};K.current=()=>{V(),W()};let Y=t=>{let n=e.getBoundingClientRect(),r=t.clientX>=n.left&&t.clientX<=n.right&&t.clientY>=n.top&&t.clientY<=n.bottom,i=Math.max(1,Math.min(n.width,n.height));return{x:(t.clientX-n.left-n.width/2)/i,y:(n.top+n.height/2-t.clientY)/i,inside:r}},X=e=>{if(e.pointerType===`touch`&&!A.touch)return;let t=Y(e);A.x=t.x,A.y=t.y,A.inside=t.inside,W()},Z=e=>{let t=Y(e);if(!t.inside)return;A.x=t.x,A.y=t.y,A.inside=!0,A.touch=e.pointerType===`touch`;let n=$.current;n.clickBurst&&!a&&(M.push({start:F,radius:Math.max(.04,n.baseRadius*.45)}),M.length>o&&M.shift()),W()},Q=e=>{e.pointerType===`touch`&&(A.touch=!1,A.inside=!1,W())},se=()=>{A.inside=!1,W()};window.addEventListener(`pointermove`,X,{passive:!0}),window.addEventListener(`pointerdown`,Z,{passive:!0}),window.addEventListener(`pointerup`,Q,{passive:!0}),window.addEventListener(`pointercancel`,Q,{passive:!0}),document.documentElement.addEventListener(`pointerleave`,se);let ce=e=>{e.preventDefault(),B=!0,cancelAnimationFrame(I),I=0},le=()=>J(e=>e+1);t.addEventListener(`webglcontextlost`,ce),t.addEventListener(`webglcontextrestored`,le);let ue=new ResizeObserver(()=>{V(),W()});ue.observe(e);let de=new IntersectionObserver(e=>{R=e.some(e=>e.isIntersecting),W()});de.observe(e);let fe=()=>{z=document.visibilityState!==`hidden`,W()};return document.addEventListener(`visibilitychange`,fe),V(),W(),()=>{cancelAnimationFrame(I),K.current=null,ue.disconnect(),de.disconnect(),window.removeEventListener(`pointermove`,X),window.removeEventListener(`pointerdown`,Z),window.removeEventListener(`pointerup`,Q),window.removeEventListener(`pointercancel`,Q),document.documentElement.removeEventListener(`pointerleave`,se),document.removeEventListener(`visibilitychange`,fe),t.removeEventListener(`webglcontextlost`,ce),t.removeEventListener(`webglcontextrestored`,le),n.isContextLost()||(n.deleteVertexArray(s),n.deleteTexture(g),n.deleteFramebuffer(y),r.forEach(e=>e&&n.deleteProgram(e.program)),n.deleteVertexArray(f),n.deleteBuffer(p))}},[q]),(0,i.jsx)(`div`,{ref:G,className:`relative h-full w-full overflow-hidden ${U}`.trim(),style:W,children:(0,i.jsx)(`canvas`,{ref:oe,className:`pointer-events-none absolute inset-0 block h-full w-full`,"aria-hidden":`true`})})};export{O as default};