import{i as e,t}from"./react-sySUN5R7.js";import{O as n}from"./sculpture-dark-Cfb-XN1r.js";var r=e(t(),1),i=n(),a=24e5,o=31.5,s=256,c=[`#5227FF`,`#FF9FFC`,`#B497CF`],l={capsule:0,sphere:1,box:2,tetrahedron:3},u={conic:0,radial:1,random:2},d=`#version 300 es
precision highp float;
layout(location = 0) in vec2 aCorner;
layout(location = 1) in vec4 aParticle;
layout(location = 2) in vec4 aSeed;
uniform vec2 uSize;
uniform float uPixel;
uniform vec2 uCursor;
uniform float uRing;
uniform float uBand;
uniform float uParticle;
uniform float uAmbient;
uniform float uTime;
uniform float uPulse;
uniform float uVariance;
uniform float uDepth;
uniform float uShape;
uniform float uColorMode;
uniform float uStops;
uniform float uHue;
uniform float uReveal;
uniform float uStreak;
uniform float uCharge;
out vec2 vLocal;
out vec2 vBounds;
out float vU;
out float vAlpha;
out float vSoft;

void main() {
  vec2 rel = aParticle.xy - uCursor;
  float dist = length(rel);
  vec2 radial = dist > 1e-3 ? rel / dist : vec2(1.0, 0.0);
  vec2 dir = radial;
  float speed = length(aParticle.zw);
  float streak = clamp(speed / uStreak, 0.0, 2.5);
  if (speed > 1e-3) {
    vec2 heading = aParticle.zw / speed * sign(dot(aParticle.zw, radial) + 1e-4);
    dir = normalize(mix(radial, heading, smoothstep(0.0, 1.0, streak)));
  }
  float ring = exp(-pow((dist - uRing) / uBand, 2.0));
  float z = aSeed.x;
  float depth = 1.0 + z * 0.32 * uDepth;
  float pulse = 1.0 + sin(uTime * uPulse + aSeed.y) * 0.22 * uVariance;
  float grow = uAmbient + (1.0 - uAmbient) * ring;
  float size = uParticle * depth * pulse * (0.85 + 0.3 * aSeed.w) * (1.0 + uCharge * 0.25 * ring);
  vec2 bounds;
  if (uShape < 0.5) {
    float width = size * 0.17 * mix(0.55, 1.0, ring);
    bounds = vec2(max(width, size * 0.5 * grow) * (1.0 + streak * 1.2), width);
  } else if (uShape < 1.5) {
    bounds = vec2(size * 0.22 * mix(0.45, 1.0, grow));
  } else {
    bounds = vec2(size * 0.26 * mix(0.45, 1.0, grow));
  }
  float soft = 1.0 + max(-z, 0.0) * 1.6 * uDepth;
  vec2 local = aCorner * (bounds + soft * 1.5 / uPixel);
  vec2 world = aParticle.xy + dir * local.x + vec2(-dir.y, dir.x) * local.y;
  gl_Position = vec4(world.x / uSize.x * 2.0 - 1.0, 1.0 - world.y / uSize.y * 2.0, 0.0, 1.0);
  vLocal = local * uPixel;
  vBounds = bounds * uPixel;
  vSoft = soft;
  if (uColorMode < 0.5) {
    vU = atan(radial.y, radial.x) / 6.28318530718 + uHue + (aSeed.z - 0.5) * 0.06;
  } else if (uColorMode < 1.5) {
    vU = clamp(dist / (uRing * 2.4), 0.0, 1.0) + (aSeed.z - 0.5) * 0.06;
  } else {
    vU = floor(aSeed.z * uStops) / max(uStops - 1.0, 1.0);
  }
  float fog = 1.0 - max(-z, 0.0) * 0.35 * uDepth;
  vAlpha = mix(uAmbient, 1.0, ring) * fog * uReveal;
}`,f=`#version 300 es
precision highp float;
uniform sampler2D uPalette;
uniform float uShape;
uniform float uColorMode;
uniform float uOpacity;
in vec2 vLocal;
in vec2 vBounds;
in float vU;
in float vAlpha;
in float vSoft;
out vec4 fragColor;

void main() {
  vec2 p = vLocal;
  float d;
  if (uShape < 0.5) {
    float r = vBounds.y;
    d = length(vec2(max(abs(p.x) - max(vBounds.x - r, 0.0), 0.0), p.y)) - r;
  } else if (uShape < 1.5) {
    d = length(p) - vBounds.x;
  } else if (uShape < 2.5) {
    float r = vBounds.x * 0.28;
    vec2 q = abs(p) - (vBounds - r);
    d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
  } else {
    float r = vBounds.x * 1.15;
    vec2 q = vec2(r * 0.5774 - p.x, abs(p.y));
    d = max(dot(q, vec2(0.5, 0.8660254)) - r * 0.5, -q.x - r * 0.5) * 1.2;
  }
  float alpha = clamp(0.5 - d / vSoft, 0.0, 1.0) * vAlpha * uOpacity;
  if (alpha < 0.002) discard;
  vec3 color = texture(uPalette, vec2(uColorMode < 0.5 ? fract(vU) : vU, uColorMode < 0.5 ? 0.25 : 0.75)).rgb;
  fragColor = vec4(color * alpha, alpha);
}`,p=(e,t,n)=>Math.min(n,Math.max(t,e)),m=e=>{let t=String(e||``).trim(),n=/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(t);if(n){let e=n[1].length===3?n[1].replace(/./g,e=>e+e):n[1];return[0,2,4].map(t=>parseInt(e.slice(t,t+2),16)/255)}let r=/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i.exec(t);return r?[r[1],r[2],r[3]].map(e=>p(parseFloat(e)/255,0,1)):null},h=e=>e<=.04045?e/12.92:((e+.055)/1.055)**2.4,g=e=>e<=.0031308?e*12.92:1.055*Math.max(e,0)**(1/2.4)-.055,_=e=>{let[t,n,r]=e.map(h),i=Math.cbrt(.4122214708*t+.5363325363*n+.0514459929*r),a=Math.cbrt(.2119034982*t+.6806995451*n+.1073969566*r),o=Math.cbrt(.0883024619*t+.2817188376*n+.6299787005*r);return[.2104542553*i+.793617785*a-.0040720468*o,1.9779984951*i-2.428592205*a+.4505937099*o,.0259040371*i+.7827717662*a-.808675766*o]},v=([e,t,n])=>{let r=(e+.3963377774*t+.2158037573*n)**3,i=(e-.1055613458*t-.0638541728*n)**3,a=(e-.0894841775*t-1.291485548*n)**3;return[4.0767416621*r-3.3077115913*i+.2309699292*a,-1.2684380046*r+2.6097574011*i-.3413193965*a,-.0041960863*r-.7034186147*i+1.707614701*a].map(e=>p(g(e),0,1))},y=(e,t)=>{let n=[];e.forEach(e=>{let r=m(e);if(!r)return;let i=_(r),a=Math.atan2(i[2],i[1])*180/Math.PI,o=p(1-Math.abs(a-85)/40,0,1),s=.62+.14*o*o*(3-2*o);if(t&&i[0]>s){let e=1+(i[0]-s)*1.6;n.push([s,i[1]*e,i[2]*e])}else n.push(i)}),n.length||n.push(_(t?[.1,.1,.12]:[1,1,1]));let r=new Uint8Array(s*2*4);return[[...n,n[0]],n.length>1?n:[n[0],n[0]]].forEach((e,t)=>{for(let n=0;n<s;n++){let i=n/(s-(t===0?0:1))*(e.length-1),a=Math.min(Math.floor(i),e.length-2),o=i-a,c=o*o*(3-2*o),l=e[a],u=e[a+1],d=Math.hypot(l[1],l[2])*(1-c)+Math.hypot(u[1],u[2])*c,f=l[1]+(u[1]-l[1])*c,p=l[2]+(u[2]-l[2])*c,m=Math.hypot(f,p),h=m>1e-4?d/m:0,g=v([l[0]+(u[0]-l[0])*c,f*h,p*h]);for(let e=0;e<3;e++)r[(t*s+n)*4+e]=Math.round(g[e]*255);r[(t*s+n)*4+3]=255}}),r},b=e=>()=>{e|=0,e=e+1831565813|0;let t=Math.imul(e^e>>>15,1|e);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296},x=(e,t,n)=>{let r=e.createShader(t);return r?(e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(console.error(e.getShaderInfoLog(r)),e.deleteShader(r),null)):null},S=e=>{let t=x(e,e.VERTEX_SHADER,d),n=x(e,e.FRAGMENT_SHADER,f),r=t&&n?e.createProgram():null;if(!t||!n||!r)return t&&e.deleteShader(t),n&&e.deleteShader(n),null;if(e.attachShader(r,t),e.attachShader(r,n),e.linkProgram(r),e.deleteShader(t),e.deleteShader(n),!e.getProgramParameter(r,e.LINK_STATUS))return console.error(e.getProgramInfoLog(r)),e.deleteProgram(r),null;let i={},a=e.getProgramParameter(r,e.ACTIVE_UNIFORMS);for(let t=0;t<a;t++){let n=e.getActiveUniform(r,t);n&&(i[n.name]=e.getUniformLocation(r,n.name))}return{program:r,uniforms:i}},C=({count:e=1500,magnetRadius:t=9,ringRadius:n=7,waveSpeed:d=.4,waveAmplitude:f=1,waveCount:m=3,particleSize:h=.9,lerpSpeed:g=.05,color:_,colors:v=c,colorMode:x=`conic`,colorSpeed:C=.05,autoAnimate:w=!0,particleVariance:T=1,rotationSpeed:E=0,depthFactor:D=1,pulseSpeed:O=3,particleShape:k=`capsule`,fieldStrength:A=10,ambient:j=.25,interactive:M=!0,clickBurst:N=!0,intro:P=!0,lightMode:F=!1,opacity:I=1,maxDevicePixelRatio:L=2,className:R=``,style:z})=>{let B=(0,r.useRef)(null),V=(0,r.useRef)(null),H=(0,r.useRef)(null),[U,W]=(0,r.useState)(0),G=_?[_]:Array.isArray(v)&&v.length?v:c,K={count:p(Math.round(e),1,2e4),magnet:Math.max(0,t),ring:Math.max(0,n),waveSpeed:d,waveAmplitude:Math.max(0,f),waveCount:Math.max(0,Math.round(m)),size:Math.max(0,h),follow:p(g,.001,1),palette:G,paletteKey:`${G.join(`,`)}|${F}`,colorMode:u[x]??u.conic,colorSpeed:C,autoAnimate:w,variance:Math.max(0,T),rotation:E,depth:Math.max(0,D),pulse:O,shape:l[k]??l.capsule,tightness:Math.max(0,A),ambient:p(j,0,1),interactive:M,clickBurst:N,intro:P,light:F,opacity:p(I,0,1),maxRatio:p(L,.5,3)},q=(0,r.useRef)(K);return q.current=K,(0,r.useEffect)(()=>{H.current?.()}),(0,r.useEffect)(()=>{let e=B.current,t=V.current;if(!e||!t)return;let n=t.getContext(`webgl2`,{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1,powerPreference:`high-performance`}),r=n?S(n):null;if(!n||!r)return;let i=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,c=n.createVertexArray();n.bindVertexArray(c);let l=n.createBuffer();n.bindBuffer(n.ARRAY_BUFFER,l),n.bufferData(n.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),n.STATIC_DRAW),n.enableVertexAttribArray(0),n.vertexAttribPointer(0,2,n.FLOAT,!1,0,0);let u=n.createBuffer();n.bindBuffer(n.ARRAY_BUFFER,u),n.enableVertexAttribArray(1),n.vertexAttribPointer(1,4,n.FLOAT,!1,0,0),n.vertexAttribDivisor(1,1);let d=n.createBuffer();n.bindBuffer(n.ARRAY_BUFFER,d),n.enableVertexAttribArray(2),n.vertexAttribPointer(2,4,n.FLOAT,!1,0,0),n.vertexAttribDivisor(2,1);let f=n.createTexture();n.bindTexture(n.TEXTURE_2D,f),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MAG_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.REPEAT),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE);let m={width:1,height:1,ratio:1},h={x:0,y:0,vx:0,vy:0,tx:0,ty:0,ready:!1},g={x:0,y:0,inside:!1,down:!1,moved:-1/0},_=null,v=``,x=0,C=0,w=0,T=q.current.intro&&!i&&U===0?0:1/0,E=0,D=0,O=!0,k=document.visibilityState!==`hidden`,A=!1,j=e=>{e.paletteKey!==v&&(v=e.paletteKey,n.bindTexture(n.TEXTURE_2D,f),n.texImage2D(n.TEXTURE_2D,0,n.RGBA8,s,2,0,n.RGBA,n.UNSIGNED_BYTE,y(e.palette,e.light)))},M=(e,t,r,i)=>{let a=b(1337),o=.06,s=t*1.12,c=r*1.12,l=Math.max(1,Math.ceil(Math.sqrt(e*s/c))),f=Math.max(1,Math.ceil(e/l)),p=Array.from({length:l*f},(e,t)=>t);for(let e=p.length-1;e>0;e--){let t=Math.floor(a()*(e+1));[p[e],p[t]]=[p[t],p[e]]}let m=Array.from({length:e},()=>a()*2-1).sort((e,t)=>e-t),h={total:e,width:t,height:r,homeX:new Float32Array(e),homeY:new Float32Array(e),band:new Float32Array(e),phase:new Float32Array(e),agility:new Float32Array(e),delay:new Float32Array(e),orbit:new Float32Array(e),x:new Float32Array(e),y:new Float32Array(e),vx:new Float32Array(e),vy:new Float32Array(e),particles:new Float32Array(e*4),seeds:new Float32Array(e*4)};for(let n=0;n<e;n++){let e=p[n],u=-t*o+(e%l+.5+(a()-.5)*.85)/l*s,d=-r*o+(Math.floor(e/l)+.5+(a()-.5)*.85)/f*c;h.homeX[n]=u,h.homeY[n]=d,h.band[n]=a()*2-1,h.phase[n]=a()*Math.PI*2,h.agility[n]=.75+a()*.5,h.delay[n]=a(),i&&n<i.total?(h.x[n]=i.x[n]/i.width*t,h.y[n]=i.y[n]/i.height*r,h.vx[n]=i.vx[n],h.vy[n]=i.vy[n],h.orbit[n]=i.orbit[n]):(h.x[n]=u,h.y[n]=T===0?d+r*(.45+h.delay[n]*.4):d),h.seeds[n*4]=m[n],h.seeds[n*4+1]=h.phase[n],h.seeds[n*4+2]=a(),h.seeds[n*4+3]=a()}return n.bindBuffer(n.ARRAY_BUFFER,d),n.bufferData(n.ARRAY_BUFFER,h.seeds,n.STATIC_DRAW),n.bindBuffer(n.ARRAY_BUFFER,u),n.bufferData(n.ARRAY_BUFFER,h.particles.byteLength,n.DYNAMIC_DRAW),h},N=()=>{let n=q.current,r=e.getBoundingClientRect(),i=Math.max(1,r.width),o=Math.max(1,r.height),s=Math.min(window.devicePixelRatio||1,n.maxRatio,Math.sqrt(a/(i*o))),c=Math.max(1,Math.round(i*s)),l=Math.max(1,Math.round(o*s));(t.width!==c||t.height!==l)&&(t.width=c,t.height=l),m.width=i,m.height=o,m.ratio=c/i,h.ready||(h.x=h.tx=i/2,h.y=h.ty=o/2,h.ready=!0),(!_||_.total!==n.count||Math.abs(_.width-i)>.5||Math.abs(_.height-o)>.5)&&(_=M(n.count,i,o,_))},P=(e,t)=>{if(!_)return;let n=m.height/o,r=e.ring*n*(1-.38*w),a=Math.max(e.magnet*n,1),s=5/(e.tightness+.1)*n,c=e.waveAmplitude*n*.5,l=2.2+e.follow*80,u=(e.rotation+w*3)*(i?.3:1),d=m.width/2,f=m.height/2,g=a*.18,{homeX:v,homeY:y,band:b,phase:S,agility:C,delay:E,orbit:D,x:O,y:k,vx:A,vy:j,particles:M,seeds:N,total:P}=_;for(let i=0;i<P;i++){let o=1-N[i*4]*.12*e.depth,m=d+(h.x-d)*o,_=f+(h.y-f)*o,w=v[i],P=y[i]+Math.sin(x*.7+S[i])*n*.12*e.waveAmplitude,F=w-m,I=P-_,L=Math.sqrt(F*F+I*I),R=1-p((L-(a-g))/(g*2),0,1),z=R*R*(3-2*R),B=D[i]+u*z*t;B-=Math.atan2(Math.sin(B),Math.cos(B))*(1-z)*Math.min(1,t*2.5),D[i]=B;let V=w,H=P;if(z>0||Math.abs(B)>1e-4){let t=Math.atan2(I,F)+B,n=L+(r+c*(.6*Math.sin(t*e.waveCount-x*e.waveSpeed*2)+.4*Math.sin(S[i]+x*e.waveSpeed*1.3))+b[i]*s-L)*z;V=m+Math.cos(t)*n,H=_+Math.sin(t)*n}let U=T<E[i]*.9?0:l*C[i],W=1.64*U,G=U*U,K=Math.min(4,Math.max(1,Math.ceil(U*t*2))),q=t/K;for(let e=0;e<K;e++)A[i]+=((V-O[i])*G-A[i]*W)*q,j[i]+=((H-k[i])*G-j[i]*W)*q,O[i]+=A[i]*q,k[i]+=j[i]*q;M[i*4]=O[i],M[i*4+1]=k[i],M[i*4+2]=A[i],M[i*4+3]=j[i]}},F=(e,t)=>{if(!_)return;let n=m.height/o,r=Math.max(e.magnet,e.ring)*n*1.8,{x:i,y:a,vx:s,vy:c,agility:l,total:u}=_;for(let e=0;e<u;e++){let o=i[e]-h.x,u=a[e]-h.y,d=Math.sqrt(o*o+u*u)+.001,f=n*110*t*Math.exp(-((d/r)**2))*l[e];s[e]+=o/d*f,c[e]+=u/d*f}},I=e=>{if(E=0,A||!_)return;let a=q.current;j(a);let s=p((e-D)/1e3||0,0,1/30);D=Math.max(D,e);let l=i?.3:1;x+=s*l,C+=s*a.colorSpeed*l,T<3&&(T+=s),w=g.down?Math.min(1,w+s/.9):Math.max(0,w-s*4);let d=performance.now()-g.moved>2e3||!g.inside;a.autoAnimate&&!i&&(d||!a.interactive)?(h.tx=m.width/2+Math.sin(x*.5)*(m.width/4),h.ty=m.height/2+Math.cos(x)*(m.height/4)):a.interactive&&g.inside&&(h.tx=g.x,h.ty=g.y),h.vx+=((h.tx-h.x)*49-h.vx*14)*s,h.vy+=((h.ty-h.y)*49-h.vy*14)*s,h.x+=h.vx*s,h.y+=h.vy*s,P(a,s);let v=m.height/o;n.viewport(0,0,t.width,t.height),n.clearColor(0,0,0,0),n.clear(n.COLOR_BUFFER_BIT),n.enable(n.BLEND),n.blendFunc(n.ONE,n.ONE_MINUS_SRC_ALPHA),n.useProgram(r.program),n.bindVertexArray(c),n.bindBuffer(n.ARRAY_BUFFER,u),n.bufferSubData(n.ARRAY_BUFFER,0,_.particles);let y=r.uniforms;n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,f),n.uniform1i(y.uPalette,0),n.uniform2f(y.uSize,m.width,m.height),n.uniform1f(y.uPixel,m.ratio),n.uniform2f(y.uCursor,h.x,h.y),n.uniform1f(y.uRing,a.ring*v*(1-.38*w)),n.uniform1f(y.uBand,Math.max(v*6,1)),n.uniform1f(y.uParticle,a.size*v*.6),n.uniform1f(y.uAmbient,a.ambient),n.uniform1f(y.uTime,x),n.uniform1f(y.uPulse,a.pulse),n.uniform1f(y.uVariance,a.variance),n.uniform1f(y.uDepth,a.depth),n.uniform1f(y.uShape,a.shape),n.uniform1f(y.uColorMode,a.colorMode),n.uniform1f(y.uStops,a.palette.length),n.uniform1f(y.uHue,C),n.uniform1f(y.uReveal,T<3?p(T/.6,0,1):1),n.uniform1f(y.uStreak,v*30),n.uniform1f(y.uCharge,w),n.uniform1f(y.uOpacity,a.opacity),n.drawArraysInstanced(n.TRIANGLE_STRIP,0,4,_.total),O&&k&&(E=requestAnimationFrame(I))},L=()=>{!E&&!A&&O&&k&&(D=performance.now(),E=requestAnimationFrame(I))};H.current=()=>{N(),L()};let R=t=>{let n=e.getBoundingClientRect();return{x:t.clientX-n.left,y:t.clientY-n.top,inside:t.clientX>=n.left&&t.clientX<=n.right&&t.clientY>=n.top&&t.clientY<=n.bottom}},z=e=>{let t=R(e);g.inside=t.inside,t.inside&&(g.x=t.x,g.y=t.y,g.moved=performance.now())},G=e=>{let t=q.current,n=R(e);n.inside&&t.interactive&&(g.x=n.x,g.y=n.y,g.inside=!0,g.moved=performance.now(),t.clickBurst&&!i&&(g.down=!0))},K=e=>{g.down&&F(q.current,.45+w),g.down=!1,e.pointerType!==`mouse`&&(g.inside=!1)},J=()=>{g.inside=!1,g.down=!1};window.addEventListener(`pointermove`,z,{passive:!0}),window.addEventListener(`pointerdown`,G,{passive:!0}),window.addEventListener(`pointerup`,K,{passive:!0}),window.addEventListener(`pointercancel`,K,{passive:!0}),document.documentElement.addEventListener(`pointerleave`,J);let Y=e=>{e.preventDefault(),A=!0,cancelAnimationFrame(E),E=0},X=()=>W(e=>e+1);t.addEventListener(`webglcontextlost`,Y),t.addEventListener(`webglcontextrestored`,X);let Z=new ResizeObserver(()=>{N(),L()});Z.observe(e);let Q=new IntersectionObserver(e=>{O=e.some(e=>e.isIntersecting),L()});Q.observe(e);let $=()=>{k=document.visibilityState!==`hidden`,L()};return document.addEventListener(`visibilitychange`,$),N(),L(),()=>{cancelAnimationFrame(E),H.current=null,Z.disconnect(),Q.disconnect(),window.removeEventListener(`pointermove`,z),window.removeEventListener(`pointerdown`,G),window.removeEventListener(`pointerup`,K),window.removeEventListener(`pointercancel`,K),document.documentElement.removeEventListener(`pointerleave`,J),document.removeEventListener(`visibilitychange`,$),t.removeEventListener(`webglcontextlost`,Y),t.removeEventListener(`webglcontextrestored`,X),n.isContextLost()||(n.deleteBuffer(l),n.deleteBuffer(u),n.deleteBuffer(d),n.deleteTexture(f),n.deleteVertexArray(c),n.deleteProgram(r.program))}},[U]),(0,i.jsx)(`div`,{ref:B,className:`relative h-full w-full overflow-hidden ${R}`.trim(),style:z,children:(0,i.jsx)(`canvas`,{ref:V,className:`absolute inset-0 block h-full w-full`,"aria-hidden":`true`})})};export{C as default};