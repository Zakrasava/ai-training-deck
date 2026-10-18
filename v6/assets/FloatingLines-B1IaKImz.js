import{i as e,t}from"./react-sySUN5R7.js";import{k as n}from"./sculpture-dark-CKiqtzhU.js";var r=e(t(),1),i=n(),a=24,o=8,s=3,c=1.8,l=[`top`,`middle`,`bottom`],u={top:{x:10,y:.5,rotate:-.4},middle:{x:5,y:0,rotate:.2},bottom:{x:2,y:-.7,rotate:-1}},d={top:{offset:1,step:.2,light:.2,flip:1,depth:1,drift:.6},middle:{offset:2,step:.15,light:1,flip:0,depth:0,drift:1},bottom:{offset:1.5,step:.2,light:.32,flip:0,depth:.6,drift:1.4}},f=`#version 300 es
in vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`,p=`#version 300 es
precision highp float;
precision highp int;
uniform vec2 uResolution;
uniform float uRatio;
uniform vec4 uWave[3];
uniform vec4 uShape[3];
uniform vec4 uParallax[3];
uniform int uCount[3];
uniform vec4 uLine[72];
uniform vec3 uLineColor[72];
uniform vec2 uMouseWarp[3];
uniform float uHaloReach;
uniform float uWidth;
uniform float uGlow;
uniform float uBrightness;
uniform float uFocus;
uniform float uEdgeFade;
uniform vec4 uMouse;
uniform float uBendRadius;
uniform float uBendStrength;
uniform vec4 uClicks[${s}];
uniform float uLight;
uniform float uOpaque;
uniform vec3 uBackground;
uniform float uOpacity;
uniform float uStyle;
uniform float uSpacing;
out vec4 outColor;

vec3 toSrgb(vec3 c) {
  return pow(max(c, 0.0), vec3(1.0 / 2.2));
}

vec3 inkOf(vec3 color) {
  float luma = dot(color, vec3(0.2126, 0.7152, 0.0722));
  return color * min(1.0, 0.16 / max(luma, 0.001));
}

vec2 warp(vec2 p, float rotate, float flip) {
  float angle = rotate * log(length(p) + 1.0);
  vec2 r = p * mat2(cos(angle), sin(angle), -sin(angle), cos(angle));
  if (flip > 0.5) r.x = -r.x;
  return r;
}

void main() {
  vec2 screen = (2.0 * gl_FragCoord.xy - uResolution) / uResolution.y;
  screen.y = -screen.y;
  for (int k = 0; k < ${s}; k++) {
    vec4 click = uClicks[k];
    if (click.w == 0.0) continue;
    float age = click.z;
    float turn = 1.9 * smoothstep(0.0, 0.23, age) * exp(-max(age - 0.23, 0.0) * 1.1) * click.w;
    float spread = 0.3 * (1.0 + age * 0.55);
    vec2 offset = screen - click.xy;
    float angle = turn * exp(-dot(offset, offset) / (spread * spread));
    screen = click.xy + mat2(cos(angle), sin(angle), -sin(angle), cos(angle)) * offset;
  }
  vec3 light = vec3(0.0);
  vec3 bloom = vec3(0.0);
  vec3 inkColor = vec3(0.0);
  float inkAlpha = 0.0;
  float aa = 0.75 * uRatio;
  float invSigma = 1.0 / max(uBendRadius * uBendRadius, 1e-4);
  float tight = 1.0 / (2.6 * uRatio);
  float wide = 1.0 / (11.0 * uRatio);

  for (int w = 0; w < 3; w++) {
    int count = uCount[w];
    if (count <= 0) continue;
    vec4 wave = uWave[w];
    vec4 shape = uShape[w];
    vec2 r = warp(screen + uParallax[w].xy, wave.z, shape.w);
    vec2 rm = uMouseWarp[w];
    float blur = uFocus * uParallax[w].z;
    float width = uWidth * (1.0 + blur * 2.5);
    float soft = aa * (1.0 + blur * 7.0);
    float energy = (uWidth + aa) / (width + soft) * shape.z;
    float cut = uHaloReach + width * 2.0 + soft;
    float sx = sin(r.x);
    float cx = cos(r.x);
    float along = r.x - rm.x;
    float pull = uMouse.z * exp(-along * along * invSigma);
    float level = r.y + wave.y;
    int first = w * ${a};

    for (int i = 0; i < ${a}; i++) {
      if (i >= count) break;
      vec4 line = uLine[first + i];
      float y = (sx * line.x + cx * line.y) * line.z;
      float near = 0.0;
      if (pull > 0.002) {
        float across = (y - wave.y) - rm.y;
        near = exp(-across * across * invSigma) * pull;
        float push = uBendStrength * near;
        y += across * (uBendStrength < 0.0 ? min(-push, 2.5) : -min(push, 0.9));
      }
      float m = level - y;
      float slope = length(vec2(dFdx(m), dFdy(m)));
      float d = abs(m) / max(slope, 1e-5);
      if (d < cut) {
        float gap = d;
        float size = width;
        if (uStyle > 0.5) {
          float period = uSpacing / (uResolution.y * 0.5);
          float cell = (fract((r.x + line.w) / period + float(i) * 0.37) - 0.5) * uSpacing;
          float span = uStyle > 1.5 ? max(uSpacing * 0.32 - width, 0.0) : 0.0;
          gap = length(vec2(max(abs(cell) - span, 0.0), d));
          size = uStyle > 1.5 ? width : width * 1.6;
        }
        float core = smoothstep(size + soft, size - soft, gap);
        float fall = 1.0 - d / cut;
        float halo = (exp(-gap * tight) * 0.3 + exp(-d * wide) * 0.02 * fall * fall) * uGlow;
        vec3 color = uLineColor[first + i];
        float lift = 1.0 + near * 0.8;
        light += color * core * energy * lift;
        bloom += color * halo * shape.z * lift;
        float a = clamp(clamp(core * energy * 1.15 + halo * shape.z * 0.12, 0.0, 1.0) * lift, 0.0, 1.0);
        inkColor = inkOf(color) * a + inkColor * (1.0 - a);
        inkAlpha = a + inkAlpha * (1.0 - a);
      }
    }
  }

  float edge = 1.0;
  if (uEdgeFade > 0.0) {
    float u = gl_FragCoord.x / uResolution.x;
    float fade = uEdgeFade * 0.45;
    float left = smoothstep(0.0, fade, u);
    float right = smoothstep(0.0, fade, 1.0 - u);
    edge = left * left * (3.0 - 2.0 * left) * right * right * (3.0 - 2.0 * right);
  }

  if (uLight > 0.5) {
    float alpha = inkAlpha * edge * uOpacity;
    vec3 ink = toSrgb(inkColor / max(inkAlpha, 1e-4));
    if (uOpaque > 0.5) {
      outColor = vec4(mix(uBackground, ink, alpha), 1.0);
    } else {
      outColor = vec4(ink * alpha, alpha);
    }
    return;
  }

  vec3 capped = 0.28 * (1.0 - exp(-bloom / 0.28));
  vec3 glow = toSrgb(1.0 - exp(-(light + capped) * uBrightness * 1.2)) * edge * uOpacity;
  if (uOpaque > 0.5) {
    outColor = vec4(uBackground + glow * (1.0 - uBackground), 1.0);
  } else {
    outColor = vec4(glow, max(glow.r, max(glow.g, glow.b)));
  }
}`,m=(e,t,n)=>Math.min(n,Math.max(t,e)),h=(e,t,n,r)=>{let i=n*Math.log(Math.hypot(e,t)+1),a=Math.cos(i),o=Math.sin(i),s=e*a+t*o;return[r>.5?-s:s,t*a-e*o]},g=(e,t,n)=>{let r=e.createShader(t);return r?(e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(e.deleteShader(r),null)):null},_=e=>{let t=g(e,e.VERTEX_SHADER,f),n=g(e,e.FRAGMENT_SHADER,p),r=e.createProgram();if(!t||!n||!r)return null;if(e.attachShader(r,t),e.attachShader(r,n),e.bindAttribLocation(r,0,`aPosition`),e.linkProgram(r),e.deleteShader(t),e.deleteShader(n),!e.getProgramParameter(r,e.LINK_STATUS))return e.deleteProgram(r),null;let i={},a=e.getProgramParameter(r,e.ACTIVE_UNIFORMS);for(let t=0;t<a;t++){let n=e.getActiveUniform(r,t);n&&(i[n.name.replace(`[0]`,``)]=e.getUniformLocation(r,n.name))}return{program:r,uniforms:i}},v=(e,t,n,r)=>typeof e==`number`?e:!Array.isArray(e)||e.length===0?r:e[t.indexOf(n)]??e[e.length-1]??r,y=({linesGradient:e=[`#e945f5`,`#ffffff`],enabledWaves:t=[`top`,`middle`,`bottom`],lineCount:n=10,lineDistance:f=6,topWavePosition:p,middleWavePosition:g,bottomWavePosition:y,animationSpeed:b=1,amplitude:x=1,lineWidth:S=1,lineStyle:C=`solid`,glow:w=1,brightness:T=1,depthOfField:E=.5,edgeFade:D=0,interactive:O=!0,bendRadius:k=5,bendStrength:A=-.5,mouseDamping:j=.05,parallax:M=!0,parallaxStrength:N=.2,clickSwirl:P=!0,intro:F=!0,mixBlendMode:I=`screen`,backgroundColor:L,lightMode:R=!1,opacity:z=1,dpr:B,className:V=``,style:H,...U})=>{let W=(0,r.useRef)(null),G=(0,r.useRef)(null),K=(0,r.useRef)(null),q=Array.isArray(t)?t.filter(e=>l.includes(e)):l,J={stops:Array.isArray(e)&&e.length?e.slice(0,o):[`#ffffff`],waves:l.map(e=>{let t=q.includes(e),r={...u[e],...e===`top`?p:e===`middle`?g:y};return{count:t?m(Math.round(v(n,q,e,10)),0,a):0,distance:v(f,q,e,6)*.01,position:r}}),animationSpeed:Math.max(0,b),amplitude:Math.max(0,x),lineWidth:Math.max(.1,S),style:C===`dashed`?2:+(C===`dotted`),glow:Math.max(0,w),brightness:Math.max(0,T),depthOfField:m(E,0,1),edgeFade:m(D,0,1),interactive:O,bendRadius:Math.max(.1,k),bendStrength:A,mouseDamping:m(j,0,1),parallax:M,parallaxStrength:Math.max(0,N),clickSwirl:P,intro:F,backgroundColor:L,lightMode:R,opacity:m(z,0,1),dpr:B},Y=(0,r.useRef)(J);return Y.current=J,(0,r.useEffect)(()=>{let e=W.current,t=G.current,n=t?.getContext(`webgl2`,{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1});if(!e||!t||!n)return;let r=_(n);if(!r)return;let i=r.uniforms,o=n.createBuffer(),u=n.createVertexArray();n.bindVertexArray(u),n.bindBuffer(n.ARRAY_BUFFER,o),n.bufferData(n.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),n.STATIC_DRAW),n.enableVertexAttribArray(0),n.vertexAttribPointer(0,2,n.FLOAT,!1,0,0);let f=document.createElement(`canvas`).getContext(`2d`,{willReadFrequently:!0}),p=new Map,g=(e,t)=>{if(!e)return t;let n=String(e),r=p.get(n);if(r)return r;let i=t;if(f){f.clearRect(0,0,1,1),f.fillStyle=`#000000`,f.fillStyle=n,f.fillRect(0,0,1,1);let[e,t,r]=f.getImageData(0,0,1,1).data;i=[e/255,t/255,r/255]}return p.set(n,i),i},v=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches??!1,y={x:0,y:0,nx:0,ny:0,vx:0,inside:!1},b={x:0,y:0,influence:0,px:0,py:0},x=[],S=new Float32Array(12),C=new Float32Array(12),w=new Float32Array(12),T=new Int32Array(3),E=new Float32Array(288),D=new Float32Array(216),O=new Float32Array(6),k=new Float32Array(12),A=0,j=Y.current.intro&&!v?0:1,M=0,N=0,P=!0,F=()=>{let o=Y.current,s=t.width,c=t.height,f=j*j*(3-2*j),p=s/Math.max(1,e.clientWidth),_=o.stops.map(e=>g(e,[1,1,1]).map(e=>e**2.2)),v=(2*b.x-s)/c,y=-(2*b.y-c)/c;o.waves.forEach((e,t)=>{let n=d[l[t]],{x:r,y:i,rotate:s}=e.position,c=b.px*n.drift,u=-b.py*n.drift;S.set([r,i,s,0],t*4),C.set([n.offset,n.step,n.light,n.flip],t*4),w.set([c,u,n.depth,0],t*4),O.set(h(v+c,y+u,s,n.flip),t*2),T[t]=e.count;for(let i=0;i<e.count;i++){let s=n.offset+n.step*i,c=e.distance*i+r,l=c+s+A*.1,u=Math.sin(s+A*.2)*.3*o.amplitude*f,d=t*a+i;E.set([Math.cos(l),Math.sin(l),u,c],d*4);let p=(e.count>1?i/(e.count-1):0)*Math.max(_.length-1,0),h=Math.min(Math.floor(p),Math.max(_.length-2,0)),g=Math.min(h+1,_.length-1),v=m(p-h,0,1),y=v*v*(3-2*v);for(let e=0;e<3;e++)D[d*3+e]=_[h][e]+(_[g][e]-_[h][e])*y}}),k.fill(0),x.forEach((e,t)=>k.set([e.x,e.y,e.age,e.spin],t*4)),n.viewport(0,0,s,c),n.useProgram(r.program),n.bindVertexArray(u),n.uniform2f(i.uResolution,s,c),n.uniform1f(i.uRatio,p),n.uniform4fv(i.uWave,S),n.uniform4fv(i.uShape,C),n.uniform4fv(i.uParallax,w),n.uniform1iv(i.uCount,T),n.uniform4fv(i.uLine,E),n.uniform3fv(i.uLineColor,D),n.uniform2fv(i.uMouseWarp,O),n.uniform1f(i.uHaloReach,11*p*Math.log(160*o.glow+1)),n.uniform1f(i.uWidth,o.lineWidth*.5*p),n.uniform1f(i.uGlow,o.glow),n.uniform1f(i.uBrightness,o.brightness*f),n.uniform1f(i.uFocus,o.depthOfField),n.uniform1f(i.uEdgeFade,o.edgeFade),n.uniform4f(i.uMouse,b.x,b.y,b.influence,0),n.uniform1f(i.uBendRadius,o.bendRadius*.09),n.uniform1f(i.uBendStrength,o.bendStrength*2.5),n.uniform4fv(i.uClicks,k),n.uniform1f(i.uLight,+!!o.lightMode),n.uniform1f(i.uOpaque,+!!o.backgroundColor),n.uniform3fv(i.uBackground,g(o.backgroundColor,o.lightMode?[1,1,1]:[0,0,0])),n.uniform1f(i.uOpacity,o.opacity*f),n.uniform1f(i.uStyle,o.style),n.uniform1f(i.uSpacing,(o.style===2?22:9)*p),n.drawArrays(n.TRIANGLES,0,3)},I=e=>{if(M=0,!P||document.hidden)return;let t=Y.current,n=N?m((e-N)/1e3,5e-4,.05):1/60;N=e;let r=+!v;A+=n*t.animationSpeed*r,t.intro&&!v&&j<1?j=Math.min(1,j+n/c):(!t.intro||v)&&(j=1);let i=1-(1-t.mouseDamping)**(n*60),a=t.interactive&&y.inside&&!v;a&&(b.x+=(y.x-b.x)*i,b.y+=(y.y-b.y)*i),b.influence+=(+!!a-b.influence)*i;let o=t.parallax&&a?y.nx*t.parallaxStrength:0,s=t.parallax&&a?y.ny*t.parallaxStrength:0;b.px+=(o-b.px)*i,b.py+=(s-b.py)*i;for(let e=x.length-1;e>=0;e--)x[e].age+=n,x[e].age>4&&x.splice(e,1);F(),M=requestAnimationFrame(I)},L=()=>{!M&&P&&!document.hidden&&(M=requestAnimationFrame(I))},R=()=>{let n=Y.current,r=Math.max(1,e.clientWidth),i=Math.max(1,e.clientHeight),a=Math.min(n.dpr||window.devicePixelRatio||1,2);t.width=Math.max(1,Math.round(r*a)),t.height=Math.max(1,Math.round(i*a)),F(),L()},z=n=>{let r=e.getBoundingClientRect(),i=n.clientX-r.left,a=n.clientY-r.top,o=t.width/Math.max(1,r.width);y.inside=i>=0&&a>=0&&i<=r.width&&a<=r.height;let s=i*o;Math.abs(s-y.x)>.5&&(y.vx=s-y.x),y.x=s,y.y=(r.height-a)*o,y.nx=i/Math.max(1,r.width)-.5,y.ny=.5-a/Math.max(1,r.height)},B=e=>{let t=y.inside;z(e),y.inside&&!t&&b.influence<.05&&(b.x=y.x,b.y=y.y),L()},V=e=>{if(z(e),!y.inside||!Y.current.clickSwirl||v)return;let n=(2*y.x-t.width)/t.height,r=-(2*y.y-t.height)/t.height;x.unshift({x:n,y:r,age:0,spin:y.vx<0?-1:1}),x.length>s&&x.pop(),L()},H=e=>{e.pointerType!==`mouse`&&(y.inside=!1)},U=()=>{y.inside=!1},q=()=>{N=0,L()},J=new ResizeObserver(R);J.observe(e);let X=new IntersectionObserver(e=>{P=e.some(e=>e.isIntersecting),P&&(N=0,L())});X.observe(e),window.addEventListener(`pointermove`,B,{passive:!0}),window.addEventListener(`pointerdown`,V,{passive:!0}),window.addEventListener(`pointerup`,H,{passive:!0}),window.addEventListener(`pointercancel`,H,{passive:!0}),document.documentElement.addEventListener(`pointerleave`,U),document.addEventListener(`visibilitychange`,q),R();let Z=Y.current.dpr;return K.current=()=>{let e=Y.current;e.dpr===Z?(M||F(),L()):(Z=e.dpr,R())},()=>{cancelAnimationFrame(M),K.current=null,J.disconnect(),X.disconnect(),window.removeEventListener(`pointermove`,B),window.removeEventListener(`pointerdown`,V),window.removeEventListener(`pointerup`,H),window.removeEventListener(`pointercancel`,H),document.documentElement.removeEventListener(`pointerleave`,U),document.removeEventListener(`visibilitychange`,q),n.deleteProgram(r.program),n.deleteBuffer(o),n.deleteVertexArray(u),n.getExtension(`WEBGL_lose_context`)?.loseContext()}},[]),(0,r.useEffect)(()=>{K.current?.()}),(0,i.jsx)(`div`,{ref:W,className:[`relative h-full w-full overflow-hidden`,V].filter(Boolean).join(` `),style:{...H,mixBlendMode:R||L?`normal`:I},...U,children:(0,i.jsx)(`canvas`,{ref:G,className:`absolute inset-0 block h-full w-full`,"aria-hidden":`true`})})};export{y as default};