import{i as e,t}from"./react-sySUN5R7.js";import{O as n}from"./sculpture-dark-Cfb-XN1r.js";var r=e(t(),1),i=n(),a={circle:0,square:1,ring:2,sparkle:3},o={parallax:0,repel:1,attract:2},s={none:0,up:1,down:2,forward:3},c=2e4,l=900,u=9e3,d=4,f=10,p=1/Math.tan(7.5*Math.PI/180),ee=.1,m=100,h=1.8,g=1.5,_=520,v=46,y=`#version 300 es
precision highp float;
layout(location = 0) in vec2 aCorner;
layout(location = 1) in vec3 aPosition;
layout(location = 2) in vec4 aRandom;
layout(location = 3) in vec3 aColor;
uniform mat3 uRotation;
uniform vec3 uOffset;
uniform float uSpread;
uniform float uTime;
uniform float uCamera;
uniform float uAspect;
uniform vec2 uView;
uniform float uRatio;
uniform float uSize;
uniform float uRandomness;
uniform float uBlur;
uniform float uFocus;
uniform float uGlow;
uniform float uTwinkle;
uniform int uShape;
uniform int uDrift;
uniform float uTravel;
uniform vec4 uPointer;
uniform int uEffect;
uniform float uStrength;
uniform vec4 uBursts[${d}];
uniform int uBurstCount;
uniform float uReveal;
out vec2 vLocal;
out float vRadius;
out float vBlur;
out float vAlpha;
out float vHalo;
out float vSeed;
out vec3 vColor;

vec3 bob(vec4 r, float t) {
  return vec3(
    sin(t * r.z + 6.28 * r.w) * mix(0.1, 1.5, r.x),
    sin(t * r.y + 6.28 * r.x) * mix(0.1, 1.5, r.w),
    sin(t * r.w + 6.28 * r.y) * mix(0.1, 1.5, r.z)
  );
}

void main() {
  vec3 pos = aPosition * uSpread;
  pos.z *= ${f.toFixed(1)};
  vec3 wobble = bob(aRandom, uTime);
  vec3 world = uRotation * pos + uOffset + wobble;
  float edge = 1.0;
  if (uDrift == 1 || uDrift == 2) {
    float span = uSpread * 2.0 + 3.0;
    float k = mod(aRandom.w * span + uOffset.y + wobble.y + (uDrift == 1 ? uTravel : -uTravel), span);
    world.y = k - span * 0.5;
    edge = smoothstep(0.0, span * 0.12, k) * smoothstep(span, span * 0.88, k);
  } else if (uDrift == 3) {
    float span = uSpread * ${f.toFixed(1)} * 2.0 + 3.0;
    float k = mod(aRandom.y * span + uOffset.z + wobble.z + uTravel, span);
    world.z = k - span * 0.5;
    edge = smoothstep(0.0, span * 0.1, k);
  }
  vec3 view = world - vec3(0.0, 0.0, uCamera);
  float dist = length(view);
  float ahead = -view.z;
  if (ahead < ${ee.toFixed(2)} || ahead > ${m.toFixed(1)}) {
    gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
    return;
  }
  edge *= smoothstep(1.0, 4.0, ahead);
  vec2 ndc = vec2(view.x * ${p.toFixed(6)} / uAspect, view.y * ${p.toFixed(6)}) / ahead;
  vec2 screen = (ndc * 0.5 + 0.5) * uView;

  vec2 shift = vec2(0.0);
  float flash = 0.0;
  if (uEffect != 0 && uPointer.z > 0.001) {
    vec2 delta = screen - uPointer.xy;
    float reach = length(delta);
    float falloff = exp(-dot(delta, delta) / (uPointer.w * uPointer.w));
    vec2 away = reach > 0.001 ? delta / reach : vec2(0.0);
    shift += (uEffect == 1 ? away * uPointer.w * 0.5 : -delta * 0.6) * falloff * uStrength * uPointer.z;
  }
  for (int i = 0; i < ${d}; i++) {
    if (i >= uBurstCount) break;
    vec4 burst = uBursts[i];
    vec2 delta = screen - burst.xy;
    float reach = length(delta);
    float wave = exp(-pow((reach - burst.z * ${_.toFixed(1)}) / ${v.toFixed(1)}, 2.0));
    vec2 away = reach > 0.001 ? delta / reach : vec2(0.0);
    float fade = (1.0 - burst.z) * (1.0 - burst.z) * burst.w;
    shift += away * wave * fade * 56.0 * smoothstep(0.0, 30.0, reach);
    flash += wave * fade;
  }
  screen += shift;

  float diameter = (uRandomness <= 0.0 ? uSize : uSize * (1.0 + uRandomness * (aRandom.x - 0.5)) / dist) * (1.0 + min(flash, 1.0) * 0.6);
  float device = diameter * uRatio;
  float radius = max(diameter, 1.0 / uRatio) * 0.5;
  float coverage = min(1.0, device * device);
  float blur = uBlur * max(uFocus - dist, 0.0) / max(dist, 1.0);
  float halo = uGlow > 0.0 ? radius * 2.5 + 2.0 : 0.0;
  float extent = radius * (uShape == 3 ? 1.6 : 1.0) + blur + halo + 1.5;

  float twinkle = 1.0 - uTwinkle * 0.6 * (0.5 + 0.5 * sin(uTime * (6.0 + aRandom.y * 14.0) + aRandom.w * 40.0));
  float far = smoothstep(${m.toFixed(1)}, ${(m*.9).toFixed(1)}, ahead);
  float focus = radius / (radius + blur);
  float reveal = clamp(uReveal * 1.6 - aRandom.z * 0.6, 0.0, 1.0);

  vLocal = aCorner * extent;
  vRadius = radius;
  vBlur = blur;
  vHalo = halo;
  vSeed = aRandom.y;
  vAlpha = min(1.0, coverage * twinkle * (1.0 + flash * 1.4)) * far * edge * max(focus, 0.35) * reveal * reveal;
  vColor = aColor;
  gl_Position = vec4((screen + aCorner * extent) / uView * 2.0 - 1.0, 0.0, 1.0);
}`,b=`#version 300 es
precision highp float;
precision highp int;
uniform int uShape;
uniform float uGlow;
uniform float uRatio;
uniform float uTime;
uniform float uSoft;
uniform float uShimmer;
uniform float uOpacity;
in vec2 vLocal;
in float vRadius;
in float vBlur;
in float vAlpha;
in float vHalo;
in float vSeed;
in vec3 vColor;
out vec4 outColor;

float ray(vec2 q, float aa) {
  float width = 0.14 * max(0.0, 1.0 - q.x);
  return (1.0 - smoothstep(width - aa, width + aa, q.y)) * step(q.x, 1.0);
}

void main() {
  float soft = vBlur + 0.7 / uRatio + vRadius * uSoft;
  float d = length(vLocal);
  float shape;
  if (uShape == 1) {
    float box = max(abs(vLocal.x), abs(vLocal.y));
    shape = 1.0 - smoothstep(vRadius * 0.86 - soft, vRadius * 0.86 + soft, box);
  } else if (uShape == 2) {
    float edge = max(vRadius * 0.22, 0.6 / uRatio);
    shape = 1.0 - smoothstep(edge - soft, edge + soft, abs(d - vRadius * 0.8));
  } else if (uShape == 3) {
    float reach = vRadius * 1.6;
    vec2 q = abs(vLocal) / max(reach, 0.0001);
    float aa = soft / max(reach, 0.0001);
    shape = max(max(ray(q, aa), ray(q.yx, aa)), 1.0 - smoothstep(vRadius * 0.32 - soft, vRadius * 0.32 + soft, d));
  } else {
    shape = 1.0 - smoothstep(vRadius - soft, vRadius + soft, d);
  }
  float halo = vHalo > 0.0 ? exp(-d / (vHalo * 0.35)) * uGlow * 0.4 : 0.0;
  float alpha = clamp(shape + halo * (1.0 - shape), 0.0, 1.0) * vAlpha * uOpacity * (1.0 - uSoft);
  if (alpha < 0.002) discard;
  vec2 uv = vLocal / max(vRadius * 2.0, 0.0001) + 0.5;
  vec3 color = clamp(vColor + uShimmer * 0.2 * sin(uv.yxx + uTime + vSeed * 6.28), 0.0, 1.0);
  outColor = vec4(color * alpha, alpha);
}`,x=`#version 300 es
precision highp float;
layout(location = 0) in vec2 aCorner;
layout(location = 1) in vec4 aEnds;
layout(location = 2) in vec4 aTint;
uniform vec2 uView;
uniform float uRatio;
uniform float uWidth;
out float vAcross;
out float vHalf;
out vec4 vTint;

void main() {
  vec2 a = aEnds.xy;
  vec2 b = aEnds.zw;
  vec2 along = b - a;
  float span = max(length(along), 0.0001);
  vec2 normal = vec2(-along.y, along.x) / span;
  float reach = uWidth * 0.5 + 1.0 / uRatio;
  vec2 point = mix(a, b, aCorner.x * 0.5 + 0.5) + normal * aCorner.y * reach;
  vAcross = aCorner.y * reach;
  vHalf = uWidth * 0.5;
  vTint = aTint;
  gl_Position = vec4(point / uView * 2.0 - 1.0, 0.0, 1.0);
}`,S=`#version 300 es
precision highp float;
uniform float uRatio;
uniform float uOpacity;
in float vAcross;
in float vHalf;
in vec4 vTint;
out vec4 outColor;

void main() {
  float edge = 0.6 / uRatio;
  float cover = 1.0 - smoothstep(vHalf - edge, vHalf + edge, abs(vAcross));
  float alpha = cover * vTint.a * uOpacity;
  outColor = vec4(vTint.rgb * alpha, alpha);
}`,C=(e,t,n)=>Math.min(n,Math.max(t,e)),w=(e,t,n)=>{let r=e.createShader(t);return r?(e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(e.deleteShader(r),null)):null},T=(e,t,n)=>{let r=w(e,e.VERTEX_SHADER,t),i=w(e,e.FRAGMENT_SHADER,n),a=e.createProgram();if(!r||!i||!a)return null;if(e.attachShader(a,r),e.attachShader(a,i),e.linkProgram(a),e.deleteShader(r),e.deleteShader(i),!e.getProgramParameter(a,e.LINK_STATUS))return e.deleteProgram(a),null;let o={},s=e.getProgramParameter(a,e.ACTIVE_UNIFORMS);for(let t=0;t<s;t++){let n=e.getActiveUniform(a,t);n&&(o[n.name.replace(`[0]`,``)]=e.getUniformLocation(a,n.name))}return{program:a,uniforms:o}},te=e=>{let t=e>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}},E=e=>1-(1-C(e,0,1))**3,ne=(e,t)=>(e%t+t)%t,D=({particleCount:e=200,particleSpread:t=10,speed:n=.1,particleColors:w=[`#ffffff`],moveParticlesOnHover:D=!0,particleHoverFactor:O=1,alphaParticles:k=!1,particleBaseSize:A=100,sizeRandomness:j=1,cameraDistance:M=20,disableRotation:N=!1,pixelRatio:P,shape:F=`circle`,glow:I=.5,twinkle:L=.3,depthOfField:R=0,connections:z=!1,connectionDistance:B=110,hoverEffect:V=`parallax`,hoverRadius:H=140,clickBurst:U=!0,drift:W=`none`,driftSpeed:G=1,variation:re=0,intro:ie=!0,opacity:K=1,lightMode:ae=!1,paused:oe=!1,className:q=``,style:J})=>{let se=(0,r.useRef)(null),ce=(0,r.useRef)(null),Y=(0,r.useRef)(null),X=(Array.isArray(w)?w:[w]).filter(Boolean).map(String),Z={count:C(Math.round(e),1,c),spread:Math.max(.1,t),speed:n,colors:X.length?X:[`#ffffff`],mouse:D,hoverFactor:Math.max(0,O),soft:k,size:Math.max(0,A),randomness:Math.max(0,j),camera:Math.max(1,M),rotate:!N,dpr:P,shape:a[F]??0,glow:Math.max(0,I),twinkle:C(L,0,1),depthOfField:Math.max(0,R),connections:z,connectionDistance:Math.max(10,B),hoverEffect:o[V]??0,hoverRadius:Math.max(20,H),clickBurst:U,drift:s[W]??0,driftSpeed:G,variation:Math.max(0,Math.round(re)),intro:ie,opacity:C(K,0,1),lightMode:ae,paused:oe},Q=(0,r.useRef)(Z);return Q.current=Z,(0,r.useEffect)(()=>{let e=se.current,t=ce.current,n=t?.getContext(`webgl2`,{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1});if(!e||!t||!n)return;let r=T(n,y,b),i=T(n,x,S);if(!r||!i)return;let a=n.createBuffer();n.bindBuffer(n.ARRAY_BUFFER,a),n.bufferData(n.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),n.STATIC_DRAW);let o=n.createBuffer(),s=n.createBuffer(),c=n.createBuffer(),w=n.createVertexArray();n.bindVertexArray(w),n.bindBuffer(n.ARRAY_BUFFER,a),n.enableVertexAttribArray(0),n.vertexAttribPointer(0,2,n.FLOAT,!1,0,0);let D=(e,t,r)=>{n.bindBuffer(n.ARRAY_BUFFER,e),n.enableVertexAttribArray(t),n.vertexAttribPointer(t,r,n.FLOAT,!1,0,0),n.vertexAttribDivisor(t,1)};D(o,1,3),D(s,2,4),D(c,3,3);let O=n.createBuffer(),k=new Float32Array(u*8),A=n.createVertexArray();n.bindVertexArray(A),n.bindBuffer(n.ARRAY_BUFFER,a),n.enableVertexAttribArray(0),n.vertexAttribPointer(0,2,n.FLOAT,!1,0,0),n.bindBuffer(n.ARRAY_BUFFER,O),n.bufferData(n.ARRAY_BUFFER,k.byteLength,n.DYNAMIC_DRAW),n.enableVertexAttribArray(1),n.vertexAttribPointer(1,4,n.FLOAT,!1,32,0),n.vertexAttribDivisor(1,1),n.enableVertexAttribArray(2),n.vertexAttribPointer(2,4,n.FLOAT,!1,32,16),n.vertexAttribDivisor(2,1),n.bindVertexArray(null);let j=document.createElement(`canvas`).getContext(`2d`,{willReadFrequently:!0}),M=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches??!1,N=new Map,P=e=>{let t=N.get(e);if(t)return t;let n=[1,1,1];if(j){j.clearRect(0,0,1,1),j.fillStyle=`#ffffff`,j.fillStyle=e,j.fillRect(0,0,1,1);let[t,r,i]=j.getImageData(0,0,1,1).data;n=[t/255,r/255,i/255]}return N.set(e,n),n},F=e=>{let t=e.map(e=>e**2.2),n=.2126*t[0]+.7152*t[1]+.0722*t[2],r=Math.min(1,.06/Math.max(n,1e-4));return t.map(e=>(e*r)**(1/2.2))},I={width:1,height:1,ratio:1},L={x:0,y:0,sx:0,sy:0,nx:0,ny:0,inside:!1,active:0},R={clock:0,spin:0,travel:0,offsetX:0,offsetY:0,reveal:Q.current.intro&&!M?0:1},z=[],B=new Float32Array(16),V={key:``,count:0,positions:new Float32Array,randoms:new Float32Array,colors:new Float32Array},H={x:new Float32Array,y:new Float32Array,ahead:new Float32Array,alpha:new Float32Array},U=0,W=0,G=!0,re=e=>{let t=`${e.count}|${e.variation}|${e.colors.join(`,`)}|${+!!e.lightMode}`;if(t===V.key)return;V.key=t;let r=te(e.variation*7919+1),i=e.count,a=new Float32Array(i*3),u=new Float32Array(i*4),d=new Float32Array(i*3),f=e.colors.map(t=>e.lightMode?F(P(t)):P(t));for(let e=0;e<i;e++){let t,n,i,o;do t=r()*2-1,n=r()*2-1,i=r()*2-1,o=t*t+n*n+i*i;while(o>1||o===0);let s=Math.cbrt(r());a.set([t*s,n*s,i*s],e*3),u.set([r(),r(),r(),r()],e*4),d.set(f[Math.floor(r()*f.length)],e*3)}V.count=i,V.positions=a,V.randoms=u,V.colors=d;let p=Math.min(i,l);H.x=new Float32Array(p),H.y=new Float32Array(p),H.ahead=new Float32Array(p),H.alpha=new Float32Array(p),n.bindBuffer(n.ARRAY_BUFFER,o),n.bufferData(n.ARRAY_BUFFER,a,n.STATIC_DRAW),n.bindBuffer(n.ARRAY_BUFFER,s),n.bufferData(n.ARRAY_BUFFER,u,n.STATIC_DRAW),n.bindBuffer(n.ARRAY_BUFFER,c),n.bufferData(n.ARRAY_BUFFER,d,n.STATIC_DRAW)},ie=e=>{let t=R.clock*1e3,n=e.rotate?Math.sin(t*2e-4)*.1:0,r=e.rotate?Math.cos(t*5e-4)*.15:0,i=e.rotate?R.spin:0,[a,o,s,c,l,u]=[Math.sin(n),Math.cos(n),Math.sin(r),Math.cos(r),Math.sin(i),Math.cos(i)];return[c*u+s*a*l,o*l,-s*u+c*a*l,-c*l+s*a*u,o*u,s*l+c*a*u,s*o,-a,c*o]},K=()=>[R.offsetX,R.offsetY,-(1-E(R.reveal))*70],ae=(e,t)=>{let n=Math.min(V.count,l),[r,i,a]=K(),o=I.width/I.height,s=R.clock,c=e.hoverRadius,u=e.hoverEffect===0?0:L.active,d=e.spread*2+3,h=e.spread*f*2+3;for(let l=0;l<n;l++){let n=V.positions[l*3]*e.spread,y=V.positions[l*3+1]*e.spread,b=V.positions[l*3+2]*e.spread*f,x=V.randoms[l*4],S=V.randoms[l*4+1],w=V.randoms[l*4+2],T=V.randoms[l*4+3],te=Math.sin(s*w+6.28*T)*(.1+1.4*x),E=Math.sin(s*S+6.28*x)*(.1+1.4*T),D=Math.sin(s*T+6.28*S)*(.1+1.4*w),O=t[0]*n+t[3]*y+t[6]*b+r+te,k=t[1]*n+t[4]*y+t[7]*b+i+E,A=t[2]*n+t[5]*y+t[8]*b+a+D,j=1;if(e.drift===1||e.drift===2){let t=ne(T*d+i+E+(e.drift===1?R.travel:-R.travel),d);k=t-d/2;let n=C(t/(d*.12),0,1),r=C((d-t)/(d*.12),0,1);j=n*n*(3-2*n)*r*r*(3-2*r)}else if(e.drift===3){let e=ne(S*h+a+D+R.travel,h);A=e-h/2;let t=C(e/(h*.1),0,1);j=t*t*(3-2*t)}let M=e.camera-A;if(M<ee||M>m){H.alpha[l]=0;continue}let N=C((M-1)/3,0,1);j*=N*N*(3-2*N);let P=O*p/o/M*.5*I.width+I.width/2,F=k*p/M*.5*I.height+I.height/2,B=0,U=0;if(u>.001){let t=P-L.sx,n=F-L.sy,r=Math.hypot(t,n),i=Math.exp(-(t*t+n*n)/(c*c))*e.hoverFactor*u;e.hoverEffect===1&&r>.001?(B+=t/r*c*.5*i,U+=n/r*c*.5*i):e.hoverEffect===2&&(B-=t*.6*i,U-=n*.6*i)}for(let e of z){let t=e.age/g,n=P-e.x,r=F-e.y,i=Math.hypot(n,r);if(i<.001)continue;let a=Math.exp(-(((i-t*_)/v)**2)),o=C(i/30,0,1),s=a*(1-t)*(1-t)*56*o*o*(3-2*o);B+=n/i*s,U+=r/i*s}P+=B,F+=U;let W=C((m-M)/(m-m*.9),0,1),G=C(R.reveal*1.6-w*.6,0,1);H.x[l]=P,H.y[l]=F,H.ahead[l]=M,H.alpha[l]=W*W*(3-2*W)*j*G*G}return n},oe=(e,t)=>{let n=ae(e,t),r=e.connectionDistance,i=Math.max(1,Math.ceil(I.width/r)+2),a=new Map;for(let e=0;e<n;e++){if(H.alpha[e]<.02)continue;let t=(Math.floor(H.y[e]/r)+1)*i+Math.floor(H.x[e]/r)+1,n=a.get(t);n?n.push(e):a.set(t,[e])}let o=0,s=r*r;for(let[e,t]of a)for(let n of[0,1,i-1,i,i+1]){let i=n===0?t:a.get(e+n);if(i)for(let e=0;e<t.length;e++){let a=t[e];for(let t=n===0?e+1:0;t<i.length;t++){let e=i[t],n=H.x[a]-H.x[e],c=H.y[a]-H.y[e],l=n*n+c*c;if(l>s)continue;let d=C(1-Math.abs(H.ahead[a]-H.ahead[e])/18,0,1);if(d<=0)continue;if(o>=u)return o;let f=1-Math.sqrt(l)/r,p=o*8;k[p]=H.x[a],k[p+1]=H.y[a],k[p+2]=H.x[e],k[p+3]=H.y[e],k[p+4]=(V.colors[a*3]+V.colors[e*3])/2,k[p+5]=(V.colors[a*3+1]+V.colors[e*3+1])/2,k[p+6]=(V.colors[a*3+2]+V.colors[e*3+2])/2,k[p+7]=f*f*d*.7*Math.min(H.alpha[a],H.alpha[e]),o++}}}return o},q=()=>{let e=Q.current;re(e);let a=ie(e),[o,s,c]=K();if(n.viewport(0,0,t.width,t.height),n.clearColor(0,0,0,0),n.clear(n.COLOR_BUFFER_BIT),n.enable(n.BLEND),n.blendFunc(n.ONE,n.ONE_MINUS_SRC_ALPHA),e.connections){let t=oe(e,a);t&&(n.useProgram(i.program),n.bindVertexArray(A),n.bindBuffer(n.ARRAY_BUFFER,O),n.bufferSubData(n.ARRAY_BUFFER,0,k.subarray(0,t*8)),n.uniform2f(i.uniforms.uView,I.width,I.height),n.uniform1f(i.uniforms.uRatio,I.ratio),n.uniform1f(i.uniforms.uWidth,1),n.uniform1f(i.uniforms.uOpacity,e.opacity),n.drawArraysInstanced(n.TRIANGLE_STRIP,0,4,t))}let l=r.uniforms,u=0;for(let e=z.length-1;e>=0&&u<d;e--)B.set([z[e].x,z[e].y,z[e].age/g,1],u*4),u++;n.useProgram(r.program),n.bindVertexArray(w),n.uniformMatrix3fv(l.uRotation,!1,a),n.uniform3f(l.uOffset,o,s,c),n.uniform1f(l.uSpread,e.spread),n.uniform1f(l.uTime,R.clock),n.uniform1f(l.uCamera,e.camera),n.uniform1f(l.uAspect,I.width/I.height),n.uniform2f(l.uView,I.width,I.height),n.uniform1f(l.uRatio,I.ratio),n.uniform1f(l.uSize,e.size),n.uniform1f(l.uRandomness,e.randomness),n.uniform1f(l.uBlur,e.depthOfField*14),n.uniform1f(l.uFocus,e.camera+14),n.uniform1f(l.uGlow,e.lightMode?e.glow*.3:e.glow),n.uniform1f(l.uTwinkle,e.twinkle),n.uniform1i(l.uShape,e.shape),n.uniform1i(l.uDrift,e.drift),n.uniform1f(l.uTravel,R.travel),n.uniform4f(l.uPointer,L.sx,L.sy,L.active,e.hoverRadius),n.uniform1i(l.uEffect,e.hoverEffect),n.uniform1f(l.uStrength,e.hoverFactor),n.uniform4fv(l.uBursts,B),n.uniform1i(l.uBurstCount,u),n.uniform1f(l.uReveal,R.reveal),n.uniform1f(l.uSoft,e.soft?.2:0),n.uniform1f(l.uShimmer,+!e.lightMode),n.uniform1f(l.uOpacity,e.opacity),n.drawArraysInstanced(n.TRIANGLE_STRIP,0,4,V.count),n.bindVertexArray(null)},J=e=>{if(U=0,!G||document.hidden)return;let t=Q.current,n=W?C((e-W)/1e3,5e-4,.05):1/60;if(W=e,t.paused){R.reveal=1,q(),W=0;return}let r=+!M,i=n*t.speed*r;R.clock+=i,t.rotate&&(R.spin+=i*.6),R.travel+=n*t.driftSpeed*r*(t.drift===3?6:.9);let a=t.mouse&&L.inside&&!M,o=1-Math.exp(-n/.35),s=a&&t.hoverEffect===0?t.hoverFactor:0;R.offsetX+=(-L.nx*s-R.offsetX)*o,R.offsetY+=(-L.ny*s-R.offsetY)*o,L.sx+=(L.x-L.sx)*(1-Math.exp(-n/.06)),L.sy+=(L.y-L.sy)*(1-Math.exp(-n/.06)),L.active+=(+!!a-L.active)*(1-Math.exp(-n/.2));for(let e=z.length-1;e>=0;e--)z[e].age+=n,z[e].age>=g&&z.splice(e,1);!t.intro||M?R.reveal=1:R.reveal<1&&(R.reveal=Math.min(1,R.reveal+n/h)),q(),U=requestAnimationFrame(J)},X=()=>{!U&&G&&!document.hidden&&(U=requestAnimationFrame(J))},Z=()=>{let n=Q.current,r=Math.max(1,e.clientWidth),i=Math.max(1,e.clientHeight),a=Math.min(n.dpr||window.devicePixelRatio||1,2);I.width=r,I.height=i,t.width=Math.max(1,Math.round(r*a)),t.height=Math.max(1,Math.round(i*a)),I.ratio=t.width/r,q(),X()},le=t=>{let n=e.getBoundingClientRect(),r=t.clientX-n.left,i=t.clientY-n.top,a=L.inside;L.inside=r>=0&&i>=0&&r<=n.width&&i<=n.height,L.x=r,L.y=n.height-i,L.nx=r/Math.max(1,n.width)*2-1,L.ny=-(i/Math.max(1,n.height)*2-1),L.inside&&!a&&(L.sx=L.x,L.sy=L.y)},ue=e=>{le(e),Q.current.paused||X()},de=e=>{let t=Q.current;le(e),L.inside&&t.clickBurst&&!t.paused&&!M&&(z.push({x:L.x,y:L.y,age:0}),z.length>d&&z.shift(),X())},$=e=>{e.pointerType!==`mouse`&&(L.inside=!1)},fe=()=>{L.inside=!1},pe=()=>{W=0,X()},me=new ResizeObserver(Z);me.observe(e);let he=new IntersectionObserver(e=>{G=e.some(e=>e.isIntersecting),G&&(W=0,X())});he.observe(e),window.addEventListener(`pointermove`,ue,{passive:!0}),window.addEventListener(`pointerdown`,de,{passive:!0}),window.addEventListener(`pointerup`,$,{passive:!0}),window.addEventListener(`pointercancel`,$,{passive:!0}),document.documentElement.addEventListener(`pointerleave`,fe),document.addEventListener(`visibilitychange`,pe),Z();let ge=Q.current.dpr;return Y.current=()=>{let e=Q.current;e.dpr===ge?(U||q(),X()):(ge=e.dpr,Z())},()=>{cancelAnimationFrame(U),Y.current=null,me.disconnect(),he.disconnect(),window.removeEventListener(`pointermove`,ue),window.removeEventListener(`pointerdown`,de),window.removeEventListener(`pointerup`,$),window.removeEventListener(`pointercancel`,$),document.documentElement.removeEventListener(`pointerleave`,fe),document.removeEventListener(`visibilitychange`,pe),n.deleteProgram(r.program),n.deleteProgram(i.program),[a,o,s,c,O].forEach(e=>n.deleteBuffer(e)),n.deleteVertexArray(w),n.deleteVertexArray(A),n.getExtension(`WEBGL_lose_context`)?.loseContext()}},[]),(0,r.useEffect)(()=>{Y.current?.()}),(0,i.jsx)(`div`,{ref:se,className:[`relative h-full w-full overflow-hidden`,q].filter(Boolean).join(` `),style:J,children:(0,i.jsx)(`canvas`,{ref:ce,className:`absolute inset-0 block h-full w-full`,"aria-hidden":`true`})})};export{D as default};