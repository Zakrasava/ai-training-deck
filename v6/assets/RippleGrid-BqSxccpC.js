import{i as e,t}from"./react-sySUN5R7.js";import{k as n}from"./sculpture-dark-CKiqtzhU.js";var r=e(t(),1),i=n(),a=12,o={lines:0,dots:1,cross:2},s=`#version 300 es
in vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`,c=`#version 300 es
precision highp float;
uniform vec2 uView;
uniform float uRatio;
uniform float uCell;
uniform float uLineWidth;
uniform float uGlow;
uniform float uTilt;
uniform float uFocal;
uniform vec2 uTurn;
uniform vec4 uRipples[${a}];
uniform int uRippleCount;
uniform float uWaveLength;
uniform float uWaveSpeed;
uniform float uStrength;
uniform vec3 uPointer;
uniform vec3 uColor;
uniform vec3 uInk;
uniform float uPresence;
uniform float uReveal;
uniform float uFade;
uniform float uOpacity;
uniform float uLightMode;
uniform int uVariant;
out vec4 outColor;

float smootherstep(float edge, float x) {
  float t = clamp(x / max(edge, 0.0001), 0.0, 1.0);
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

void main() {
  vec2 css = gl_FragCoord.xy / uRatio;
  vec2 screen = vec2(css.x - uView.x * 0.5, uView.y * 0.5 - css.y);
  vec2 plane = screen;
  float horizon = 1.0;
  if (uTilt > 0.0001) {
    float depth = uFocal + screen.y * tan(uTilt);
    horizon = smoothstep(0.0, uFocal * 0.35, depth);
    float scale = uFocal / max(depth, 0.001);
    plane = vec2(screen.x * scale, screen.y * scale / cos(uTilt));
  }

  vec2 push = vec2(0.0);
  float lift = 0.0;
  for (int i = 0; i < ${a}; i++) {
    if (i >= uRippleCount) break;
    vec4 ripple = uRipples[i];
    vec2 delta = plane - ripple.xy;
    float dist = length(delta);
    float x = (dist - ripple.z * uWaveSpeed) / uWaveLength;
    float packet = exp(-x * x * 1.8);
    float spread = 1.0 / (1.0 + dist / (uWaveLength * 5.0));
    float calm = smoothstep(0.0, uWaveLength * 0.9, dist);
    float wave = sin(x * 6.28318) * packet * spread * calm * ripple.w;
    push += (dist > 0.001 ? delta / dist : vec2(0.0)) * wave;
    lift += wave;
  }

  vec2 bent = plane + push * uStrength * uCell * 0.22;
  vec2 grid = mat2(uTurn.x, uTurn.y, -uTurn.y, uTurn.x) * bent / uCell;
  vec2 fw = max(fwidth(grid), vec2(0.00001));
  vec2 offset = abs(fract(grid - 0.5) - 0.5);
  vec2 dist = offset / fw;
  float width = max(uLineWidth * uRatio, 1.0);
  float thin = min(uLineWidth * uRatio, 1.0);
  float shape = 0.0;
  float edge = min(dist.x, dist.y);
  if (uVariant == 1) {
    edge = length(dist);
    shape = (1.0 - smoothstep(width * 1.7 - 0.5, width * 1.7 + 0.5, edge)) * thin * 1.8;
  } else if (uVariant == 2) {
    float arm = 0.16;
    vec2 cover = (1.0 - smoothstep(width * 0.5 - 0.5, width * 0.5 + 0.5, dist)) * thin;
    vec2 reach = 1.0 - smoothstep(arm - fw * 0.5, arm + fw * 0.5, offset);
    shape = max(cover.x * reach.y, cover.y * reach.x);
    edge = max(min(dist.x, dist.y), length(max(offset - arm, 0.0) / fw));
  } else {
    vec2 cover = (1.0 - smoothstep(width * 0.5 - 0.5, width * 0.5 + 0.5, dist)) * thin;
    shape = max(cover.x, cover.y);
  }
  float halo = exp(-edge / (uRatio * 2.4)) * uGlow;
  float far = 1.0 - smoothstep(0.18, 0.5, max(fw.x, fw.y));

  vec2 toPointer = (plane - uPointer.xy) / (uCell * 3.2);
  float near = uPointer.z * exp(-dot(toPointer, toPointer));
  float shine = max(1.0 + lift * 3.4 * uStrength, 0.25) * (1.0 + near * 1.6);

  float radius = length(plane);
  float reveal = 1.0 - smoothstep(uReveal - uCell * 4.0, uReveal, radius);
  vec2 uv = gl_FragCoord.xy / (uView * uRatio);
  float edgeFade = uFade * 0.5;
  float mask = smootherstep(edgeFade, uv.x) * smootherstep(edgeFade, 1.0 - uv.x) * smootherstep(edgeFade, uv.y) * smootherstep(edgeFade, 1.0 - uv.y);
  mask *= horizon * far * reveal * uPresence * uOpacity;

  float level = (shape * 0.26 + halo * 0.1) * shine * mask;
  float dither = (hash(gl_FragCoord.xy) - 0.5) / 255.0;
  if (uLightMode > 0.5) {
    float alpha = clamp(level * 1.2 + dither, 0.0, 1.0);
    outColor = vec4(uInk * alpha, alpha);
  } else {
    float alpha = clamp(level + dither, 0.0, 1.0);
    vec3 color = mix(uColor, vec3(1.0), clamp(level - 0.7, 0.0, 1.0));
    outColor = vec4(color * alpha, alpha);
  }
}`,l=1.6,u=(e,t,n)=>Math.min(n,Math.max(t,e)),d=(e,t,n)=>{let r=e.createShader(t);return r?(e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(e.deleteShader(r),null)):null},f=e=>{let t=d(e,e.VERTEX_SHADER,s),n=d(e,e.FRAGMENT_SHADER,c),r=e.createProgram();if(!t||!n||!r)return null;if(e.attachShader(r,t),e.attachShader(r,n),e.bindAttribLocation(r,0,`aPosition`),e.linkProgram(r),e.deleteShader(t),e.deleteShader(n),!e.getProgramParameter(r,e.LINK_STATUS))return e.deleteProgram(r),null;let i={},a=e.getProgramParameter(r,e.ACTIVE_UNIFORMS);for(let t=0;t<a;t++){let n=e.getActiveUniform(r,t);n&&(i[n.name.replace(`[0]`,``)]=e.getUniformLocation(r,n.name))}return{program:r,uniforms:i}},p=({color:e=`#ffffff`,variant:t=`lines`,cellSize:n=48,lineWidth:s=1,glow:c=.6,rippleStrength:d=1,rippleSpeed:p=1,rippleSize:m=1,autoRipple:h=`center`,rippleInterval:g=2.6,tilt:_=0,rotation:v=0,mouseInteraction:y=!0,clickRipple:b=!0,intro:x=!0,fade:S=.5,opacity:C=1,lightMode:w=!1,paused:T=!1,dpr:E,className:D=``,...O})=>{let k=(0,r.useRef)(null),A=(0,r.useRef)(null),j=(0,r.useRef)(null),M={color:String(e),variant:o[t]??0,cellSize:Math.max(8,n),lineWidth:Math.max(.25,s),glow:Math.max(0,c),rippleStrength:Math.max(0,d),rippleSpeed:Math.max(.05,p),rippleSize:Math.max(.2,m),autoRipple:h,rippleInterval:Math.max(.3,g),tilt:u(_,0,80),rotation:v,mouseInteraction:y,clickRipple:b,intro:x,fade:u(S,0,1),opacity:u(C,0,1),lightMode:w,paused:T,dpr:E},N=(0,r.useRef)(M);return N.current=M,(0,r.useEffect)(()=>{let e=k.current,t=A.current,n=t?.getContext(`webgl2`,{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1});if(!e||!t||!n)return;let r=f(n);if(!r)return;let i=r.uniforms,o=n.createBuffer(),s=n.createVertexArray();n.bindVertexArray(s),n.bindBuffer(n.ARRAY_BUFFER,o),n.bufferData(n.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),n.STATIC_DRAW),n.enableVertexAttribArray(0),n.vertexAttribPointer(0,2,n.FLOAT,!1,0,0);let c=document.createElement(`canvas`).getContext(`2d`,{willReadFrequently:!0}),u=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches??!1,d=new Map,p=e=>{let t=d.get(e);if(t)return t;let n=[1,1,1];if(c){c.clearRect(0,0,1,1),c.fillStyle=`#ffffff`,c.fillStyle=e,c.fillRect(0,0,1,1);let[t,r,i]=c.getImageData(0,0,1,1).data;n=[t,r,i].map(e=>(e/255)**2.2)}return d.set(e,n),n},m={width:1,height:1,ratio:1},h={x:0,y:0,inside:!1,planeX:0,planeY:0,lastX:0,lastY:0,travel:0},g={clock:0,intro:N.current.intro&&!u?0:1,glow:0,nextAuto:.4},_=[],v=new Float32Array(48),y=0,b=0,x=!0,S=()=>m.height*1.15,C=(e,t)=>{let n=N.current,r=e-m.width/2,i=t-m.height/2,a=n.tilt*Math.PI/180;if(a<=1e-4)return[r,i];let o=S(),s=o+i*Math.tan(a);if(s<=o*.05)return null;let c=o/s;return[r*c,i*c/Math.cos(a)]},w=(e,t,n)=>{_.push({x:e,y:t,born:g.clock,strength:n}),_.length>a&&_.shift()},T=()=>{let e=N.current,o=g.intro*g.intro*(3-2*g.intro),c=e.cellSize*2.4*e.rippleSize,l=240*e.rippleSpeed,d=0;for(let e=_.length-1;e>=0&&d<a;e--){let t=_[e],n=g.clock-t.born;v[d*4]=t.x,v[d*4+1]=t.y,v[d*4+2]=n,v[d*4+3]=t.strength*Math.exp(-n*.55),d++}let f=e.rotation*Math.PI/180,y=p(e.color),b=.2126*y[0]+.7152*y[1]+.0722*y[2],x=Math.min(1,.12/Math.max(b,.001)),C=y.map(e=>Math.min(1,e*x)**(1/2.2)),w=Math.hypot(m.width,m.height);n.bindVertexArray(s),n.viewport(0,0,t.width,t.height),n.useProgram(r.program),n.uniform2f(i.uView,m.width,m.height),n.uniform1f(i.uRatio,m.ratio),n.uniform1f(i.uCell,e.cellSize),n.uniform1f(i.uLineWidth,e.lineWidth),n.uniform1f(i.uGlow,e.glow),n.uniform1f(i.uTilt,e.tilt*Math.PI/180),n.uniform1f(i.uFocal,S()),n.uniform2f(i.uTurn,Math.cos(f),Math.sin(f)),n.uniform4fv(i.uRipples,v),n.uniform1i(i.uRippleCount,d),n.uniform1f(i.uWaveLength,c),n.uniform1f(i.uWaveSpeed,l),n.uniform1f(i.uStrength,e.rippleStrength),n.uniform3f(i.uPointer,h.planeX,h.planeY,g.glow),n.uniform3fv(i.uColor,y.map(e=>e**(1/2.2))),n.uniform3fv(i.uInk,C),n.uniform1f(i.uPresence,Math.min(1,o*1.6)),n.uniform1f(i.uReveal,e.intro&&!u?o*w*1.4+e.cellSize*4:1e6),n.uniform1f(i.uFade,e.fade),n.uniform1f(i.uOpacity,e.opacity),n.uniform1f(i.uLightMode,+!!e.lightMode),n.uniform1i(i.uVariant,e.variant),n.drawArrays(n.TRIANGLES,0,3)},E=e=>{if(y=0,!x||document.hidden)return;let t=N.current,n=b?Math.min(.05,(e-b)/1e3):1/60;b=e;let r=!t.paused&&!u;if(r&&(g.clock+=n),!t.intro||u?g.intro=1:g.intro<1&&(g.intro=Math.min(1,g.intro+n/l)),r&&t.autoRipple!==`none`&&g.clock>=g.nextAuto){if(t.autoRipple===`random`){let e=C(Math.random()*m.width,m.height*(.2+Math.random()*.7));e&&w(e[0],e[1],.75)}else w(0,0,1);g.nextAuto=g.clock+t.rippleInterval}let i=9/Math.max(.2,t.rippleSpeed);for(;_.length&&g.clock-_[0].born>i;)_.shift();let a=t.mouseInteraction&&h.inside&&!u;g.glow+=(+!!a-g.glow)*(1-Math.exp(-n*(a?6:2.5))),T();let o=g.intro<1||Math.abs(+!!a-g.glow)>.002;r||o?y=requestAnimationFrame(E):b=0},D=()=>{!y&&x&&!document.hidden&&(y=requestAnimationFrame(E))},O=()=>{let n=N.current,r=Math.max(1,e.clientWidth),i=Math.max(1,e.clientHeight),a=Math.min(n.dpr||window.devicePixelRatio||1,2);m.width=r,m.height=i,t.width=Math.max(1,Math.round(r*a)),t.height=Math.max(1,Math.round(i*a)),m.ratio=t.width/r,y||T(),D()},M=t=>{let n=e.getBoundingClientRect(),r=t.clientX-n.left,i=t.clientY-n.top;h.inside=r>=0&&i>=0&&r<=n.width&&i<=n.height;let a=h.inside?C(r,i):null;if(a){let e=N.current,t=Math.hypot(a[0]-h.planeX,a[1]-h.planeY);h.planeX=a[0],h.planeY=a[1],e.mouseInteraction&&!u&&t<e.cellSize*6&&(h.travel+=t,h.travel>e.cellSize*1.6&&(h.travel=0,w(a[0],a[1],.32)))}else h.inside=!1;h.x=r,h.y=i,D()},P=t=>{if(!N.current.clickRipple||u)return;let n=e.getBoundingClientRect(),r=t.clientX-n.left,i=t.clientY-n.top;if(r<0||i<0||r>n.width||i>n.height)return;let a=C(r,i);a&&w(a[0],a[1],1.2),D()},F=()=>{h.inside=!1,D()},I=()=>{b=0,D()},L=new ResizeObserver(O);L.observe(e);let R=new IntersectionObserver(e=>{x=e.some(e=>e.isIntersecting),x&&(b=0,D())});R.observe(e),window.addEventListener(`pointermove`,M,{passive:!0}),window.addEventListener(`pointerdown`,P,{passive:!0}),document.documentElement.addEventListener(`pointerleave`,F),document.addEventListener(`visibilitychange`,I),N.current.intro&&!u&&w(0,0,1.1),O();let z=N.current.dpr;return j.current=()=>{let e=N.current;e.dpr===z?(y||T(),D()):(z=e.dpr,O())},()=>{cancelAnimationFrame(y),j.current=null,L.disconnect(),R.disconnect(),window.removeEventListener(`pointermove`,M),window.removeEventListener(`pointerdown`,P),document.documentElement.removeEventListener(`pointerleave`,F),document.removeEventListener(`visibilitychange`,I),n.deleteProgram(r.program),n.deleteBuffer(o),n.deleteVertexArray(s),n.getExtension(`WEBGL_lose_context`)?.loseContext()}},[]),(0,r.useEffect)(()=>{j.current?.()}),(0,i.jsx)(`div`,{ref:k,className:[`relative h-full w-full overflow-hidden`,D].filter(Boolean).join(` `),...O,children:(0,i.jsx)(`canvas`,{ref:A,className:`absolute inset-0 block h-full w-full`,"aria-hidden":`true`})})};export{p as RippleGrid,p as default};