import{i as e,t}from"./react-sySUN5R7.js";import{O as n}from"./sculpture-dark-Cfb-XN1r.js";var r=e(t(),1),i=n(),a={bayer:0,bayer4:1,bayer2:2,halftone:3,lines:4,crosshatch:5,noise:6,none:7},o={erase:0,reveal:1,ripple:2},s=16,c=4,l=8,u=1.8,d=1.6,f=`#version 300 es
in vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`,p=`#version 300 es
precision highp float;
precision highp int;
uniform vec2 uResolution;
uniform float uCell;
uniform float uTime;
uniform float uWaveSpeed;
uniform float uWaveFrequency;
uniform float uWaveAmplitude;
uniform float uScale;
uniform float uContrast;
uniform float uBrightness;
uniform int uEffect;
uniform float uRadius;
uniform float uStrength;
uniform vec3 uTrail[${s}];
uniform int uTrailCount;
uniform vec4 uRipples[${c}];
uniform int uRippleCount;
uniform float uIntro;
uniform float uReach;
out vec4 outColor;

vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
vec2 fade(vec2 t) { return t * t * t * (t * (t * 6.0 - 15.0) + 10.0); }

float cnoise(vec2 P) {
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod289(Pi);
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = fract(i * (1.0 / 41.0)) * 2.0 - 1.0;
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x, gy.x);
  vec2 g10 = vec2(gx.y, gy.y);
  vec2 g01 = vec2(gx.z, gy.z);
  vec2 g11 = vec2(gx.w, gy.w);
  vec4 norm = taylorInvSqrt(vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11)));
  g00 *= norm.x;
  g01 *= norm.y;
  g10 *= norm.z;
  g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fadeXY = fade(Pf.xy);
  vec2 nx = mix(vec2(n00, n01), vec2(n10, n11), fadeXY.x);
  return 2.3 * mix(nx.x, nx.y, fadeXY.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amp = 1.0;
  for (int i = 0; i < 4; i++) {
    value += amp * abs(cnoise(p));
    p *= uWaveFrequency;
    amp *= uWaveAmplitude;
  }
  return value;
}

float pattern(vec2 p) {
  vec2 p2 = p - uTime * uWaveSpeed;
  return fbm(p + fbm(p2));
}

void main() {
  vec2 corner = (gl_FragCoord.xy - 0.5) * uCell;
  vec2 uv = corner / uResolution - 0.5;
  uv.x *= uResolution.x / uResolution.y;

  float touch = 0.0;
  for (int i = 0; i < ${s}; i++) {
    if (i >= uTrailCount) break;
    vec3 point = uTrail[i];
    float reach = uRadius * mix(0.55, 1.0, point.z);
    touch = max(touch, point.z * (1.0 - smoothstep(0.0, reach, length(uv - point.xy))));
  }

  vec2 warp = vec2(0.0);
  float ring = 0.0;
  for (int i = 0; i < ${c}; i++) {
    if (i >= uRippleCount) break;
    vec4 ripple = uRipples[i];
    vec2 delta = uv - ripple.xy;
    float dist = length(delta);
    float life = clamp(ripple.z / ${d.toFixed(2)}, 0.0, 1.0);
    float wave = exp(-pow((dist - ripple.z * 0.9) / 0.07, 2.0)) * (1.0 - life) * (1.0 - life) * ripple.w;
    warp += (dist > 0.0001 ? delta / dist : vec2(0.0)) * wave * 0.035;
    ring += wave;
  }

  if (uEffect == 2 && touch > 0.0) {
    vec3 head = uTrail[0];
    vec2 delta = uv - head.xy;
    float dist = length(delta);
    warp += (dist > 0.0001 ? delta / dist : vec2(0.0)) * sin(dist / max(uRadius, 0.001) * 16.0 - uTime * 7.0) * 0.04 * touch * uStrength;
  }

  float f = pattern((uv + warp) / uScale);
  if (uEffect == 0) f -= 0.5 * touch * uStrength;
  if (uEffect == 1) f += 0.5 * touch * uStrength;
  f += ring * 0.55;
  f = (f - 0.5) * uContrast + 0.5 + uBrightness;
  float show = clamp((uIntro * uReach - length(uv)) / 0.45, 0.0, 1.0);
  float v = clamp(f, 0.0, 1.0) * show * show * (3.0 - 2.0 * show);
  outColor = vec4(floor(v * 255.0) / 255.0, fract(v * 255.0), 0.0, 1.0);
}`,m=`#version 300 es
precision highp float;
precision highp int;
uniform sampler2D uField;
uniform ivec2 uFieldSize;
uniform float uCellDevice;
uniform int uMode;
uniform float uColorNum;
uniform vec3 uWave;
uniform vec3 uBackground;
uniform vec3 uPalette[${l}];
uniform int uPaletteCount;
uniform float uTransparent;
out vec4 outColor;

const float bayer8[64] = float[64](
  0.0 / 64.0, 48.0 / 64.0, 12.0 / 64.0, 60.0 / 64.0, 3.0 / 64.0, 51.0 / 64.0, 15.0 / 64.0, 63.0 / 64.0,
  32.0 / 64.0, 16.0 / 64.0, 44.0 / 64.0, 28.0 / 64.0, 35.0 / 64.0, 19.0 / 64.0, 47.0 / 64.0, 31.0 / 64.0,
  8.0 / 64.0, 56.0 / 64.0, 4.0 / 64.0, 52.0 / 64.0, 11.0 / 64.0, 59.0 / 64.0, 7.0 / 64.0, 55.0 / 64.0,
  40.0 / 64.0, 24.0 / 64.0, 36.0 / 64.0, 20.0 / 64.0, 43.0 / 64.0, 27.0 / 64.0, 39.0 / 64.0, 23.0 / 64.0,
  2.0 / 64.0, 50.0 / 64.0, 14.0 / 64.0, 62.0 / 64.0, 1.0 / 64.0, 49.0 / 64.0, 13.0 / 64.0, 61.0 / 64.0,
  34.0 / 64.0, 18.0 / 64.0, 46.0 / 64.0, 30.0 / 64.0, 33.0 / 64.0, 17.0 / 64.0, 45.0 / 64.0, 29.0 / 64.0,
  10.0 / 64.0, 58.0 / 64.0, 6.0 / 64.0, 54.0 / 64.0, 9.0 / 64.0, 57.0 / 64.0, 5.0 / 64.0, 53.0 / 64.0,
  42.0 / 64.0, 26.0 / 64.0, 38.0 / 64.0, 22.0 / 64.0, 41.0 / 64.0, 25.0 / 64.0, 37.0 / 64.0, 21.0 / 64.0
);

const float bayer4[16] = float[16](
  0.0 / 16.0, 8.0 / 16.0, 2.0 / 16.0, 10.0 / 16.0,
  12.0 / 16.0, 4.0 / 16.0, 14.0 / 16.0, 6.0 / 16.0,
  3.0 / 16.0, 11.0 / 16.0, 1.0 / 16.0, 9.0 / 16.0,
  15.0 / 16.0, 7.0 / 16.0, 13.0 / 16.0, 5.0 / 16.0
);

const float bayer2[4] = float[4](0.0 / 4.0, 2.0 / 4.0, 3.0 / 4.0, 1.0 / 4.0);

float threshold(vec2 cell) {
  if (uMode == 1) {
    ivec2 c = ivec2(mod(cell, 4.0));
    return bayer4[c.y * 4 + c.x];
  }
  if (uMode == 2) {
    ivec2 c = ivec2(mod(cell, 2.0));
    return bayer2[c.y * 2 + c.x];
  }
  if (uMode == 3) {
    vec2 r = vec2(cell.x + cell.y, cell.x - cell.y) * 0.70710678 / 4.0;
    return clamp(length(fract(r) - 0.5) * 1.41421356, 0.0, 0.999);
  }
  if (uMode == 4) {
    return abs(fract(cell.y / 4.0) - 0.5) * 2.0 * 0.999;
  }
  if (uMode == 5) {
    float a = abs(fract((cell.x + cell.y) / 6.0) - 0.5) * 2.0;
    float b = abs(fract((cell.x - cell.y) / 6.0) - 0.5) * 2.0;
    return min(a, b) * 0.999;
  }
  if (uMode == 6) {
    return fract(52.9829189 * fract(dot(cell, vec2(0.06711056, 0.00583715))));
  }
  if (uMode == 7) {
    return 0.25;
  }
  ivec2 c = ivec2(mod(cell, 8.0));
  return bayer8[c.y * 8 + c.x];
}

vec3 toSrgb(vec3 c) {
  c = clamp(c, 0.0, 1.0);
  return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c));
}

void main() {
  vec2 cell = floor(gl_FragCoord.xy / uCellDevice);
  vec4 sampleValue = texelFetch(uField, clamp(ivec2(cell), ivec2(0), uFieldSize - 1), 0);
  float f = sampleValue.r + sampleValue.g / 255.0;
  float t = threshold(cell) - 0.25;

  if (uPaletteCount > 1) {
    float n = float(uPaletteCount);
    float v = f + t / (n - 1.0);
    v = clamp(v - mix(0.2, 0.0, smoothstep(0.45, 0.8, v)), 0.0, 1.0);
    int index = int(floor(v * (n - 1.0) + 0.5));
    outColor = vec4(toSrgb(uPalette[index]), 1.0);
    return;
  }

  float levels = max(uColorNum, 1.01) - 1.0;
  if (uTransparent > 0.5) {
    float v = f + t / levels;
    v = clamp(v - mix(0.2, 0.0, smoothstep(0.45, 0.8, v)), 0.0, 1.0);
    float a = floor(v * levels + 0.5) / levels;
    outColor = vec4(toSrgb(uWave) * a, a);
    return;
  }

  float base = dot(uBackground, vec3(0.2126, 0.7152, 0.0722));
  vec3 offset = (uWave - vec3(base)) * f + t / levels;
  float luminance = dot(uBackground + offset, vec3(0.2126, 0.7152, 0.0722));
  offset -= mix(0.2, 0.0, smoothstep(0.45, 0.8, luminance));
  bool rising = dot(uWave, vec3(0.2126, 0.7152, 0.0722)) >= base;
  float lower = rising ? 0.0 : -max(uBackground.r, max(uBackground.g, uBackground.b));
  float upper = rising ? 1.0 - min(uBackground.r, min(uBackground.g, uBackground.b)) : 0.0;
  offset = floor(clamp(offset, lower, upper) * levels + 0.5) / levels;
  outColor = vec4(toSrgb(uBackground + offset), 1.0);
}`,h=(e,t,n)=>Math.min(n,Math.max(t,e)),g=(e,t,n)=>{let r=e.createShader(t);return r?(e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(e.deleteShader(r),null)):null},_=(e,t)=>{let n=g(e,e.VERTEX_SHADER,f),r=g(e,e.FRAGMENT_SHADER,t),i=e.createProgram();if(!n||!r||!i)return null;if(e.attachShader(i,n),e.attachShader(i,r),e.bindAttribLocation(i,0,`aPosition`),e.linkProgram(i),e.deleteShader(n),e.deleteShader(r),!e.getProgramParameter(i,e.LINK_STATUS))return e.deleteProgram(i),null;let a={},o=e.getProgramParameter(i,e.ACTIVE_UNIFORMS);for(let t=0;t<o;t++){let n=e.getActiveUniform(i,t);n&&(a[n.name.replace(`[0]`,``)]=e.getUniformLocation(i,n.name))}return{program:i,uniforms:a}},v=e=>e<=.04045?e/12.92:((e+.055)/1.055)**2.4,y=({waveSpeed:e=.05,waveFrequency:t=3,waveAmplitude:n=.3,waveColor:f=[.5,.5,.5],backgroundColor:g=[0,0,0],colorNum:y=4,pixelSize:b=2,disableAnimation:x=!1,enableMouseInteraction:S=!0,mouseRadius:C=1,ditherMode:w=`bayer`,palette:T,scale:E=1,contrast:D=1,brightness:O=0,mouseEffect:k=`erase`,mouseStrength:A=1,trail:j=.5,clickRipple:M=!0,intro:N=!0,dpr:P,className:F=``,style:I})=>{let L=(0,r.useRef)(null),R=(0,r.useRef)(null),z=(0,r.useRef)(null),B={waveSpeed:e,waveFrequency:t,waveAmplitude:n,waveColor:f,backgroundColor:g,colorNum:Math.max(2,y),pixelSize:Math.max(1,b),disableAnimation:x,enableMouseInteraction:S,mouseRadius:Math.max(.001,C),mode:a[w]??0,palette:Array.isArray(T)?T.filter(Boolean).slice(0,l):[],scale:Math.max(.05,E),contrast:D,brightness:O,effect:o[k]??0,mouseStrength:Math.max(0,A),trail:h(j,0,1),clickRipple:M,intro:N,dpr:P},V=(0,r.useRef)(B);return V.current=B,(0,r.useEffect)(()=>{let e=L.current,t=R.current,n=t?.getContext(`webgl2`,{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1});if(!e||!t||!n)return;let r=_(n,p),i=_(n,m);if(!r||!i)return;let a=n.createBuffer(),o=n.createVertexArray();n.bindVertexArray(o),n.bindBuffer(n.ARRAY_BUFFER,a),n.bufferData(n.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),n.STATIC_DRAW),n.enableVertexAttribArray(0),n.vertexAttribPointer(0,2,n.FLOAT,!1,0,0);let l=n.createTexture();n.bindTexture(n.TEXTURE_2D,l),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MAG_FILTER,n.NEAREST),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE);let f=n.createFramebuffer(),g=document.createElement(`canvas`).getContext(`2d`,{willReadFrequently:!0}),y=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches??!1,b=new Map,x=e=>{if(Array.isArray(e))return[0,1,2].map(t=>h(Number(e[t])||0,0,1));let t=String(e),n=b.get(t);if(n)return n;let r=[0,0,0];if(g){g.clearRect(0,0,1,1),g.fillStyle=`#000000`,g.fillStyle=t,g.fillRect(0,0,1,1);let[e,n,i]=g.getImageData(0,0,1,1).data;r=[e,n,i].map(e=>v(e/255))}return b.set(t,r),r},S={width:1,height:1,ratio:1,cell:1,cellCss:1,cols:1,rows:1},C={x:0,y:0,inside:!1,set:!1},w=[],T=[],E=new Float32Array(48),D=new Float32Array(16),O=new Float32Array(24),k={time:0,hx:0,hy:0,presence:0,reveal:V.current.intro&&!y?0:1},A=0,j=0,M=!0,N=()=>{let e=V.current;S.cell=Math.max(1,Math.round(e.pixelSize*S.ratio)),S.cellCss=S.cell/S.ratio,S.cols=Math.max(1,Math.ceil(t.width/S.cell)),S.rows=Math.max(1,Math.ceil(t.height/S.cell)),n.bindTexture(n.TEXTURE_2D,l),n.texImage2D(n.TEXTURE_2D,0,n.RGBA8,S.cols,S.rows,0,n.RGBA,n.UNSIGNED_BYTE,null),n.bindFramebuffer(n.FRAMEBUFFER,f),n.framebufferTexture2D(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,l,0),n.bindFramebuffer(n.FRAMEBUFFER,null)},P=(e,t)=>{let n=S.width/S.height;return[(e/S.width-.5)*n,-(t/S.height-.5)]},F=()=>{let e=V.current;Math.max(1,Math.round(e.pixelSize*S.ratio))!==S.cell&&N();let a=0;for(let e=0;e<w.length&&a<s;e++){let t=w[e];t.weight<=.01||(E.set([t.x,t.y,t.weight],a*3),a++)}let u=0;for(let e=T.length-1;e>=0&&u<c;e--)D.set([T[e].x,T[e].y,T[e].age,1],u*4),u++;let d=e.intro&&!y?k.reveal*k.reveal*(3-2*k.reveal):1;n.bindVertexArray(o),n.bindFramebuffer(n.FRAMEBUFFER,f),n.viewport(0,0,S.cols,S.rows),n.useProgram(r.program);let p=r.uniforms;n.uniform2f(p.uResolution,t.width/S.ratio,t.height/S.ratio),n.uniform1f(p.uCell,S.cellCss),n.uniform1f(p.uTime,k.time),n.uniform1f(p.uWaveSpeed,e.waveSpeed),n.uniform1f(p.uWaveFrequency,e.waveFrequency),n.uniform1f(p.uWaveAmplitude,e.waveAmplitude),n.uniform1f(p.uScale,e.scale),n.uniform1f(p.uContrast,e.contrast),n.uniform1f(p.uBrightness,e.brightness),n.uniform1i(p.uEffect,e.effect),n.uniform1f(p.uRadius,e.mouseRadius),n.uniform1f(p.uStrength,e.mouseStrength),n.uniform3fv(p.uTrail,E),n.uniform1i(p.uTrailCount,a),n.uniform4fv(p.uRipples,D),n.uniform1i(p.uRippleCount,u),n.uniform1f(p.uIntro,d),n.uniform1f(p.uReach,.5*Math.hypot(S.width/S.height,1)+.45),n.drawArrays(n.TRIANGLES,0,3),n.bindFramebuffer(n.FRAMEBUFFER,null),n.viewport(0,0,t.width,t.height),n.useProgram(i.program);let m=i.uniforms;n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,l),n.uniform1i(m.uField,0),n.uniform2i(m.uFieldSize,S.cols,S.rows),n.uniform1f(m.uCellDevice,S.cell),n.uniform1i(m.uMode,e.mode),n.uniform1f(m.uColorNum,e.colorNum),n.uniform3fv(m.uWave,x(e.waveColor));let h=e.backgroundColor===`transparent`;n.uniform3fv(m.uBackground,h?[0,0,0]:x(e.backgroundColor)),n.uniform1f(m.uTransparent,+!!h),e.palette.forEach((e,t)=>O.set(x(e),t*3)),n.uniform3fv(m.uPalette,O),n.uniform1i(m.uPaletteCount,e.palette.length),n.drawArrays(n.TRIANGLES,0,3)},I=e=>{if(A=0,!M||document.hidden)return;let t=V.current,n=j?h((e-j)/1e3,5e-4,.05):1/60;j=e,!t.disableAnimation&&!y&&(k.time+=n);let r=t.enableMouseInteraction&&C.inside&&!y;if(k.presence+=(+!!r-k.presence)*(1-Math.exp(-n/(r?.12:.35))),C.set){let[e,r]=P(C.x,C.y),i=1-Math.exp(-n/.06),a=Math.hypot(e-k.hx,r-k.hy);k.hx+=(e-k.hx)*i,k.hy+=(r-k.hy)*i;let o=Math.exp(-n/(.08+t.trail*.7));w.forEach(e=>{e.weight*=o});let c=w[0];for(!c||Math.hypot(c.x-k.hx,c.y-k.hy)>.012||a>.012?w.unshift({x:k.hx,y:k.hy,weight:k.presence}):(c.x=k.hx,c.y=k.hy,c.weight=k.presence),t.trail<=.001&&(w.length=Math.min(w.length,1));w.length>s||w.length>1&&w[w.length-1].weight<.01;)w.pop()}for(let e=T.length-1;e>=0;e--)T[e].age+=n,T[e].age>=d&&T.splice(e,1);!t.intro||y?k.reveal=1:k.reveal<1&&(k.reveal=Math.min(1,k.reveal+n/u)),F(),(!t.disableAnimation||k.reveal<1||T.length>0||k.presence>.002||w.some(e=>e.weight>.01))&&!y?A=requestAnimationFrame(I):j=0},B=()=>{!A&&M&&!document.hidden&&(A=requestAnimationFrame(I))},H=()=>{let n=V.current,r=Math.max(1,e.clientWidth),i=Math.max(1,e.clientHeight),a=Math.min(n.dpr||window.devicePixelRatio||1,2);S.width=r,S.height=i,t.width=Math.max(1,Math.round(r*a)),t.height=Math.max(1,Math.round(i*a)),S.ratio=t.width/r,N(),F(),B()},U=t=>{let n=e.getBoundingClientRect();if(C.x=t.clientX-n.left,C.y=t.clientY-n.top,C.inside=C.x>=0&&C.y>=0&&C.x<=n.width&&C.y<=n.height,C.inside&&!C.set){let[e,t]=P(C.x,C.y);k.hx=e,k.hy=t,C.set=!0}},W=e=>{U(e),B()},G=e=>{let t=V.current;if(U(e),!C.inside||!t.clickRipple||y)return;let[n,r]=P(C.x,C.y);T.push({x:n,y:r,age:0}),T.length>c&&T.shift(),B()},K=e=>{e.pointerType!==`mouse`&&(C.inside=!1)},q=()=>{C.inside=!1},J=()=>{j=0,B()},Y=new ResizeObserver(H);Y.observe(e);let X=new IntersectionObserver(e=>{M=e.some(e=>e.isIntersecting),M&&(j=0,B())});X.observe(e),window.addEventListener(`pointermove`,W,{passive:!0}),window.addEventListener(`pointerdown`,G,{passive:!0}),window.addEventListener(`pointerup`,K,{passive:!0}),window.addEventListener(`pointercancel`,K,{passive:!0}),document.documentElement.addEventListener(`pointerleave`,q),document.addEventListener(`visibilitychange`,J),H();let Z=V.current.dpr;return z.current=()=>{let e=V.current;e.dpr===Z?(A||F(),B()):(Z=e.dpr,H())},()=>{cancelAnimationFrame(A),z.current=null,Y.disconnect(),X.disconnect(),window.removeEventListener(`pointermove`,W),window.removeEventListener(`pointerdown`,G),window.removeEventListener(`pointerup`,K),window.removeEventListener(`pointercancel`,K),document.documentElement.removeEventListener(`pointerleave`,q),document.removeEventListener(`visibilitychange`,J),n.deleteProgram(r.program),n.deleteProgram(i.program),n.deleteBuffer(a),n.deleteVertexArray(o),n.deleteTexture(l),n.deleteFramebuffer(f),n.getExtension(`WEBGL_lose_context`)?.loseContext()}},[]),(0,r.useEffect)(()=>{z.current?.()}),(0,i.jsx)(`div`,{ref:L,className:[`relative h-full w-full overflow-hidden`,F].filter(Boolean).join(` `),style:I,children:(0,i.jsx)(`canvas`,{ref:R,className:`absolute inset-0 block h-full w-full`,"aria-hidden":`true`})})};export{y as default};