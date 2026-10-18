import{i as e,t}from"./react-sySUN5R7.js";import{O as n}from"./sculpture-dark-Cfb-XN1r.js";var r=e(t(),1),i=n(),a=1.4,o={lines:0,dashed:1,dots:2,crosses:3},s={linear:e=>e,smooth:e=>e*e*(3-2*e),sharp:e=>e*e*e},c=`#version 300 es
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`,l=`#version 300 es
precision highp float;
precision highp int;

uniform vec2 uResolution;
uniform vec2 uOffset;
uniform float uCellSize;
uniform sampler2D uState;
uniform ivec2 uCells;
uniform vec3 uColor;
uniform vec3 uGridColor;
uniform float uLineWidth;
uniform float uMaxOpacity;
uniform float uFillOpacity;
uniform float uGridOpacity;
uniform float uCellRadius;
uniform float uCellGap;
uniform int uGridStyle;
uniform vec2 uMouse;
uniform float uRadius;
uniform float uSpotlight;
uniform float uPresence;
uniform float uEdgeFade;
uniform float uReveal;

out vec4 outColor;

float level(vec2 cell) {
  if (cell.x < 0.0 || cell.y < 0.0 || cell.x >= float(uCells.x) || cell.y >= float(uCells.y)) return 0.0;
  float v = texelFetch(uState, ivec2(cell), 0).r;
  return v * v * (3.0 - 2.0 * v);
}

float line(float d, float width) {
  float w = max(width, 1.0);
  return clamp(w * 0.5 + 0.5 - d, 0.0, 1.0) * (width / w);
}

float roundBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

void main() {
  vec2 pos = vec2(gl_FragCoord.x, uResolution.y - gl_FragCoord.y);
  vec2 g = (pos - uOffset) / uCellSize;
  vec2 cell = floor(g);
  vec2 f = g - cell;
  vec2 edge = min(f, 1.0 - f) * uCellSize;

  float vx = line(edge.x, uLineWidth);
  float vy = line(edge.y, uLineWidth);
  if (uGridStyle == 1) {
    float dash = uCellSize / 6.0;
    vx *= step(0.5, fract((pos.y - uOffset.y) / dash + 0.25));
    vy *= step(0.5, fract((pos.x - uOffset.x) / dash + 0.25));
  } else if (uGridStyle == 2) {
    float r = max(uLineWidth * 1.25, 1.2);
    float d = length(edge);
    vx = clamp(r + 0.5 - d, 0.0, 1.0);
    vy = 0.0;
  } else if (uGridStyle == 3) {
    float arm = uCellSize * 0.1 + uLineWidth;
    vx *= step(edge.y, arm);
    vy *= step(edge.x, arm);
  }
  float mark = max(vx, vy);

  vec2 toMouse = pos - uMouse;
  float spot = exp(-dot(toMouse, toMouse) / max(uRadius * uRadius, 1.0) * 1.6) * uSpotlight * uPresence;

  vec2 center = uResolution * 0.5;
  float reach = length(center);
  float shown = smoothstep(uReveal * (reach + uCellSize * 2.0), uReveal * (reach + uCellSize * 2.0) - uCellSize * 2.0, length(pos - center));
  shown = uReveal >= 1.0 ? 1.0 : shown;

  float fade = 1.0;
  if (uEdgeFade > 0.0) {
    vec2 norm = pos / uResolution;
    vec2 a = clamp(norm / uEdgeFade, 0.0, 1.0);
    vec2 b = clamp((1.0 - norm) / uEdgeFade, 0.0, 1.0);
    vec2 sa = a * a * a * (a * (a * 6.0 - 15.0) + 10.0);
    vec2 sb = b * b * b * (b * (b * 6.0 - 15.0) + 10.0);
    fade = sa.x * sa.y * sb.x * sb.y;
  }

  float own = level(cell);
  float gridAlpha = mark * min(uGridOpacity + spot * 0.45, 1.0) * fade * shown;
  float litAlpha = 0.0;
  float fillAlpha = 0.0;

  if (uCellGap <= 0.0 && uCellRadius <= 0.0) {
    vec2 side = step(0.5, f) * 2.0 - 1.0;
    float nx = level(cell + vec2(side.x, 0.0));
    float ny = level(cell + vec2(0.0, side.y));
    float nc = level(cell + side);
    float ex = max(own, nx);
    float ey = max(own, ny);
    float joint = max(max(ex, ey), nc);
    float lit;
    if (uGridStyle == 2) lit = vx * joint;
    else if (uGridStyle == 3) lit = max(vx * (edge.y < uLineWidth ? joint : ex), vy * (edge.x < uLineWidth ? joint : ey));
    else lit = max(vx * (edge.y < uLineWidth ? joint : ex), vy * (edge.x < uLineWidth ? joint : ey));
    litAlpha = lit * uMaxOpacity;
    fillAlpha = own * uFillOpacity;
  } else if (own > 0.0) {
    vec2 local = (f - 0.5) * uCellSize;
    float halfSize = uCellSize * 0.5 - max(uCellGap, 0.0);
    float radius = min(uCellRadius, halfSize);
    float sd = roundBox(local, vec2(halfSize), radius);
    float inside = clamp(0.5 - sd, 0.0, 1.0);
    float border = line(abs(sd + uLineWidth * 0.5), uLineWidth) * inside;
    litAlpha = border * own * uMaxOpacity;
    fillAlpha = inside * own * uFillOpacity;
  }
  litAlpha *= fade;
  fillAlpha *= fade;

  float cellAlpha = clamp(max(litAlpha, fillAlpha), 0.0, 1.0);
  float alpha = cellAlpha + gridAlpha * (1.0 - cellAlpha);
  vec3 premul = uColor * cellAlpha + uGridColor * gridAlpha * (1.0 - cellAlpha);
  outColor = vec4(premul, alpha);
}`,u=(e,t,n)=>Math.min(n,Math.max(t,e)),d=(e,t,n)=>{let r=e.createShader(t);return r?(e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(e.deleteShader(r),null)):null},f=e=>{let t=d(e,e.VERTEX_SHADER,c),n=d(e,e.FRAGMENT_SHADER,l),r=e.createProgram();if(!t||!n||!r)return null;if(e.attachShader(r,t),e.attachShader(r,n),e.linkProgram(r),e.deleteShader(t),e.deleteShader(n),!e.getProgramParameter(r,e.LINK_STATUS))return e.deleteProgram(r),null;let i={},a=e.getProgramParameter(r,e.ACTIVE_UNIFORMS);for(let t=0;t<a;t++){let n=e.getActiveUniform(r,t);n&&(i[n.name]=e.getUniformLocation(r,n.name))}return{program:r,uniforms:i}},p=new Map,m=e=>{let t=String(e||`#ffffff`).replace(`#`,``).trim();(t.length===3||t.length===4)&&(t=t.slice(0,3).split(``).map(e=>e+e).join(``));let n=parseInt(t.slice(0,6),16);return Number.isNaN(n)?[1,1,1]:[(n>>16&255)/255,(n>>8&255)/255,(n&255)/255]},h=e=>{let t=String(e),n=p.get(t);if(n)return n;let r=m(e);return p.size>64&&p.clear(),p.set(t,r),r},g=({cellSize:e=60,color:t,gridColor:n,radius:c=140,falloff:l=`smooth`,highlight:d=`area`,holdTime:p=400,fadeDuration:m=800,lineWidth:g=1,maxOpacity:_=1,fillOpacity:v=.06,gridOpacity:y=.08,gridStyle:b=`lines`,cellRadius:x=0,cellGap:S=0,spotlight:C=.6,clickPulse:w=!0,pulseSpeed:T=600,ambient:E=0,edgeFade:D=.2,intro:O=!0,lightMode:k=!1,dpr:A,children:j,className:M=``,style:N})=>{let P=(0,r.useRef)(null),F=(0,r.useRef)(null),I=(0,r.useRef)(null),L=k?`#18181b`:`#ffffff`,R={cellSize:Math.max(8,e),color:t||L,gridColor:n||L,radius:Math.max(1,c),falloff:l,highlight:d,holdTime:Math.max(0,p),fadeDuration:Math.max(16,m),lineWidth:Math.max(.25,g),maxOpacity:u(_,0,1),fillOpacity:u(v,0,1),gridOpacity:u(y,0,1),gridStyle:o[b]??0,cellRadius:Math.max(0,x),cellGap:Math.max(0,S),spotlight:u(C,0,1),clickPulse:w,pulseSpeed:Math.max(1,T),ambient:u(E,0,1),edgeFade:u(D,0,.5),intro:O,dpr:A},z=(0,r.useRef)(R);return z.current=R,(0,r.useEffect)(()=>{let e=P.current,t=F.current,n=t?.getContext(`webgl2`,{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1});if(!e||!t||!n)return;let r=f(n);if(!r)return;let i=r.uniforms,o=n.createVertexArray(),c=n.createTexture();n.bindTexture(n.TEXTURE_2D,c),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MAG_FILTER,n.NEAREST),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE),n.pixelStorei(n.UNPACK_ALIGNMENT,1);let l=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches??!1,d={width:1,height:1,ratio:1,cellSize:0},p={cols:0,rows:0,offX:0,offY:0},m={x:0,y:0,inside:!1},g={x:0,y:0},_=[],v=new Float32Array,y=new Float32Array,b=new Float32Array,x=new Float32Array,S=new Uint8Array,C=0,w=0,T=z.current.intro&&!l?0:1,E=0,D=0,O=!0,k=!0,A=()=>{let r=z.current;d.width=Math.max(1,e.clientWidth),d.height=Math.max(1,e.clientHeight),d.ratio=Math.min(r.dpr||window.devicePixelRatio||1,2),t.width=Math.max(1,Math.round(d.width*d.ratio)),t.height=Math.max(1,Math.round(d.height*d.ratio));let i=r.cellSize,a=Math.ceil(d.width/i)+1,o=Math.ceil(d.height/i)+1,s=a!==p.cols||o!==p.rows||i!==d.cellSize;p.cols=a,p.rows=o,p.offX=(d.width-a*i)/2,p.offY=(d.height-o*i)/2,d.cellSize=i,s&&(v=new Float32Array(a*o),y=new Float32Array(a*o),b=new Float32Array(a*o),x=new Float32Array(a*o).fill(-1e9),S=new Uint8Array(a*o),n.bindTexture(n.TEXTURE_2D,c),n.texImage2D(n.TEXTURE_2D,0,n.R8,a,o,0,n.RED,n.UNSIGNED_BYTE,S)),k=!0},j=(e,t)=>{t>b[e]&&(b[e]=t),x[e]=w},M=(e,t)=>{let n=z.current,r=n.cellSize;if(n.highlight===`cell`){let n=Math.floor((e-p.offX)/r),i=Math.floor((t-p.offY)/r);n>=0&&i>=0&&n<p.cols&&i<p.rows&&j(i*p.cols+n,1);return}let i=n.radius,a=s[n.falloff]??s.linear,o=Math.max(0,Math.floor((e-i-p.offX)/r)),c=Math.min(p.cols-1,Math.floor((e+i-p.offX)/r)),l=Math.max(0,Math.floor((t-i-p.offY)/r)),u=Math.min(p.rows-1,Math.floor((t+i-p.offY)/r));for(let n=l;n<=u;n++)for(let s=o;s<=c;s++){let o=p.offX+s*r+r/2,c=p.offY+n*r+r/2,l=Math.hypot(o-e,c-t);if(l>i)continue;let u=a(1-l/i);u>0&&j(n*p.cols+s,u)}},N=e=>{let t=e.cellSize,n=t*.6,r=t*1.4,i=Math.hypot(d.width,d.height);y.fill(0);for(let a=_.length-1;a>=0;a--){let o=_[a],s=(w-o.t0)*e.pulseSpeed;if(s-r*2>i){_.splice(a,1);continue}if(s<0)continue;let c=o.strength*Math.max(0,1-s/(i+r))**.6,l=s+n*2,u=Math.max(0,Math.floor((o.x-l-p.offX)/t)),d=Math.min(p.cols-1,Math.floor((o.x+l-p.offX)/t)),f=Math.max(0,Math.floor((o.y-l-p.offY)/t)),m=Math.min(p.rows-1,Math.floor((o.y+l-p.offY)/t));for(let e=f;e<=m;e++)for(let i=u;i<=d;i++){let a=p.offX+i*t+t/2,l=p.offY+e*t+t/2,u=Math.hypot(a-o.x,l-o.y)-s;if(u>n*2||u<-r*2)continue;let d=u>0?u/n:u/r,f=c*Math.exp(-d*d),m=e*p.cols+i;f>y[m]&&(y[m]=f)}}k=!0},L=()=>{let e=z.current,a=d.ratio;if(n.viewport(0,0,t.width,t.height),n.clearColor(0,0,0,0),n.clear(n.COLOR_BUFFER_BIT),n.useProgram(r.program),n.bindVertexArray(o),n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,c),k){for(let e=0;e<v.length;e++)S[e]=Math.round(u(Math.max(v[e],y[e]),0,1)*255);n.texSubImage2D(n.TEXTURE_2D,0,0,0,p.cols,p.rows,n.RED,n.UNSIGNED_BYTE,S),k=!1}let s=e.lineWidth*a,l=Math.round(s)%2==1?.5:0;n.uniform1i(i.uState,0),n.uniform2f(i.uResolution,t.width,t.height),n.uniform2f(i.uOffset,Math.round(p.offX*a)+l,Math.round(p.offY*a)+l),n.uniform1f(i.uCellSize,e.cellSize*a),n.uniform2i(i.uCells,p.cols,p.rows),n.uniform3fv(i.uColor,h(e.color)),n.uniform3fv(i.uGridColor,h(e.gridColor)),n.uniform1f(i.uLineWidth,s),n.uniform1f(i.uMaxOpacity,e.maxOpacity),n.uniform1f(i.uFillOpacity,e.fillOpacity),n.uniform1f(i.uGridOpacity,e.gridOpacity),n.uniform1f(i.uCellRadius,e.cellRadius*a),n.uniform1f(i.uCellGap,e.cellGap*a),n.uniform1i(i.uGridStyle,e.gridStyle),n.uniform2f(i.uMouse,g.x*a,g.y*a),n.uniform1f(i.uRadius,e.radius*a),n.uniform1f(i.uSpotlight,e.spotlight),n.uniform1f(i.uPresence,C),n.uniform1f(i.uEdgeFade,e.edgeFade),n.uniform1f(i.uReveal,T>=1?1:1-(1-T)**2.2),n.drawArrays(n.TRIANGLES,0,3),n.bindVertexArray(null)},R=e=>{if(E=0,!O||document.hidden)return;let t=z.current,n=D?u((e-D)/1e3,0,1/20):1/60;D=e,w+=n,T<1&&(T=Math.min(1,T+n/a));let r=1-Math.exp(-n/.07);g.x+=(m.x-g.x)*r,g.y+=(m.y-g.y)*r;let i=+!!m.inside;if(C+=(i-C)*(1-Math.exp(-n/.25)),t.ambient>0&&!l&&v.length){let e=t.ambient*n*v.length*.04,r=Math.floor(e)+ +(Math.random()<e%1);for(;r-->0;)j(Math.floor(Math.random()*v.length),.25+Math.random()*.45)}_.length?N(t):y.length&&y.some(e=>e>0)&&(y.fill(0),k=!0);let o=t.holdTime/1e3,s=n/(t.fadeDuration/1e3),c=1-Math.exp(-n/.045),d=_.length>0||T<1||Math.abs(C-i)>.002;for(let e=0;e<v.length;e++){let t=b[e];if(t<=0&&v[e]<=0)continue;w-x[e]>o&&(t=Math.max(0,t-s)),b[e]=t;let n=v[e],r=t>n?n+(t-n)*c:t;v[e]=r<.002?0:r,v[e]!==n&&(k=!0),(v[e]>0||b[e]>0)&&(d=!0)}Math.abs(g.x-m.x)+Math.abs(g.y-m.y)>.05&&C>.002&&(d=!0),t.ambient>0&&!l&&(d=!0),L(),d&&(E=requestAnimationFrame(R))};function B(){!E&&O&&!document.hidden&&(D=0,E=requestAnimationFrame(R))}let V=t=>{let n=e.getBoundingClientRect(),r=t.clientX-n.left,i=t.clientY-n.top;return{x:r,y:i,inside:r>=0&&i>=0&&r<=n.width&&i<=n.height}},H=e=>{let{x:t,y:n,inside:r}=V(e),i=m.inside;m.inside=r,r?(m.x=t,m.y=n,i||(g.x=t,g.y=n),M(t,n),B()):i&&B()},U=e=>{let t=z.current,{x:n,y:r,inside:i}=V(e);i&&t.clickPulse&&!l&&(_.push({x:n,y:r,t0:w,strength:1}),B())},W=()=>{m.inside=!1,B()},G=()=>B(),K=new ResizeObserver(()=>{A(),L(),B()});K.observe(e);let q=new IntersectionObserver(e=>{O=e.some(e=>e.isIntersecting),O&&B()});return q.observe(e),window.addEventListener(`pointermove`,H,{passive:!0}),window.addEventListener(`pointerdown`,U,{passive:!0}),document.documentElement.addEventListener(`pointerleave`,W),document.addEventListener(`visibilitychange`,G),A(),T<1&&_.push({x:d.width/2,y:d.height/2,t0:.15,strength:.6}),L(),B(),I.current=()=>{z.current.cellSize!==d.cellSize&&A(),k=!0,L(),B()},()=>{cancelAnimationFrame(E),I.current=null,K.disconnect(),q.disconnect(),window.removeEventListener(`pointermove`,H),window.removeEventListener(`pointerdown`,U),document.documentElement.removeEventListener(`pointerleave`,W),document.removeEventListener(`visibilitychange`,G),n.deleteTexture(c),n.deleteVertexArray(o),n.deleteProgram(r.program),n.getExtension(`WEBGL_lose_context`)?.loseContext()}},[]),(0,r.useEffect)(()=>{I.current?.()}),(0,i.jsxs)(`div`,{ref:P,className:[`relative h-full w-full overflow-hidden`,M].filter(Boolean).join(` `),style:N,children:[(0,i.jsx)(`canvas`,{ref:F,className:`pointer-events-none absolute inset-0 block h-full w-full`,"aria-hidden":`true`}),j?(0,i.jsx)(`div`,{className:`relative h-full w-full`,children:j}):null]})};export{g as default};