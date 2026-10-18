import{i as e,t}from"./react-sySUN5R7.js";import{k as n}from"./sculpture-dark-CKiqtzhU.js";var r=e(t(),1),i=n(),a=`relative h-full w-full overflow-hidden`,o=`absolute inset-0 block h-full w-full`,s=24,c=6,l=3,u=1.6,d=.05,f=1.25,p=Math.PI*2,m=`#version 300 es
in vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`,h=`#version 300 es
precision highp float;
uniform vec2 uResolution;
uniform float uPhase;
uniform float uClock;
uniform int uCount;
uniform float uFrequency;
uniform float uSpread;
uniform float uTaper;
uniform float uPosition;
uniform float uPinch;
uniform float uNodes;
uniform vec2 uAngle;
uniform float uGlow;
uniform float uFalloff;
uniform float uThickness;
uniform float uBrightness;
uniform float uOpacity;
uniform float uMirror;
uniform float uShimmer;
uniform float uDepth;
uniform float uPulses;
uniform float uFade;
uniform float uGrain;
uniform vec3 uColors[${c}];
uniform int uColorCount;
uniform vec3 uCore;
uniform vec3 uBackground;
uniform float uOpaque;
uniform float uLight;
uniform vec4 uIntro;
uniform float uFocus[${s}];
uniform vec2 uFocusState;
uniform vec4 uSurges[${l}];
out vec4 outColor;

const float PI = 3.14159265;
const float TAU = 6.28318530;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float easeInOut(float t) {
  return t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 3.0) * 0.5;
}

vec3 palette(float t) {
  if (uColorCount <= 1) return uColors[0];
  float scaled = clamp(t, 0.0, 1.0) * float(uColorCount - 1);
  int index = int(min(floor(scaled), float(uColorCount - 2)));
  return mix(uColors[index], uColors[index + 1], scaled - float(index));
}

vec2 envelope(float x) {
  float dx = x - uPinch;
  if (uNodes <= 1.0) return vec2(uSpread * abs(dx), uSpread * sign(dx));
  float k = PI * uNodes;
  float c = cos(k * (dx + 0.5));
  return vec2(uSpread * 0.5 * abs(c), -uSpread * 0.5 * k * sin(k * (dx + 0.5)) * sign(c));
}

vec2 space(vec2 p, float aspect) {
  vec2 q = (p - 0.5) * vec2(aspect, 1.0);
  q = vec2(q.x * uAngle.x + q.y * uAngle.y, -q.x * uAngle.y + q.y * uAngle.x);
  return vec2(q.x / aspect + 0.5, q.y + 0.5);
}

float hubAt(float x) {
  if (uNodes <= 1.0) return uPinch;
  float spacing = 1.0 / uNodes;
  return uPinch - 0.5 + (floor((x - uPinch + 0.5) / spacing) + 0.5) * spacing;
}

vec3 thread(float x, float i, float n) {
  float lane = uNodes <= 1.0 ? x - uPinch : (x - uPinch + 0.5) * uNodes - 0.5;
  float side = uMirror > 0.5 ? (mod(floor(lane), 2.0) < 0.5 ? -1.0 : 1.0) : 1.0;
  vec2 env = envelope(x);
  float amp = 1.0 + i * uTaper;
  float shimmer = uShimmer > 0.5 ? sin(uClock * 1.7 + i * 1.3) * 0.35 : 0.0;
  float angle = x * uFrequency + (uPhase + i * TAU / max(n, 1.0)) * side + shimmer;
  float wave = sin(angle);
  float y = uPosition - env.x * amp * wave;
  float slope = -(env.y * amp * wave + env.x * amp * cos(angle) * uFrequency);
  return vec3(y, slope, angle);
}

void main() {
  vec2 p = gl_FragCoord.xy / uResolution;
  float aspect = uResolution.x / uResolution.y;
  vec2 s = space(p, aspect);
  float x = s.x;
  float y = s.y;
  float n = float(uCount);
  float pixel = 1.0 / uResolution.y;
  float hub = hubAt(x);
  float presence = uFocusState.x;
  float settle = uFocusState.y;

  vec3 color = vec3(0.0);
  float energy = 0.0;
  float ink = 0.0;
  vec3 inkColor = vec3(0.0);

  for (int idx = 0; idx < ${s}; idx++) {
    if (idx >= uCount) break;
    float i = float(idx);
    float ci = n > 1.0 ? i / (n - 1.0) : 0.0;

    float head = 2.0;
    float bead = 0.0;
    float born = 1.0;
    if (uIntro.w > 0.5) {
      float progress = clamp((uIntro.x - i * uIntro.y) / uIntro.z, 0.0, 1.0);
      head = mix(-0.06, 1.06, easeInOut(progress));
      bead = sin(PI * progress);
      born = progress > 0.0 ? smoothstep(-0.05, 0.03, head) : 0.0;
    }
    if (born <= 0.0) continue;

    bool tip = x > head;
    vec3 lead = bead > 0.0 || tip ? thread(head, i, n) : vec3(0.0);
    vec3 t = tip ? lead : thread(x, i, n);

    float focus = uFocus[idx];
    float spot = tip ? head : x;
    float twist = uDepth * smoothstep(0.0, 0.07, abs(spot - hubAt(spot)));
    float depth = 0.5 + 0.5 * cos(t.z);
    float front = mix(1.0, 0.3 + 0.7 * depth, twist);
    float width = uThickness * mix(1.0, 0.55 + 0.7 * depth, twist) * (1.0 + 0.3 * focus * presence);

    float d;
    if (tip) {
      float back = head - 0.02;
      vec2 a = vec2(back * aspect, thread(back, i, n).x);
      vec2 b = vec2(head * aspect, lead.x);
      vec2 pa = vec2(x * aspect, y) - a;
      vec2 ba = b - a;
      d = length(pa - ba * clamp(dot(pa, ba) / max(dot(ba, ba), 1e-6), 0.0, 1.0));
    } else {
      float bend = t.y * smoothstep(0.0, 0.04, abs(x - hub));
      d = abs(y - t.x) / sqrt(1.0 + bend * bend / (aspect * aspect));
    }
    float g = uGlow / pow(max(d / width, pixel * 0.35), uFalloff) * front * born;
    float onLine = exp(-d / (width * 0.012));

    if (bead > 0.0) {
      vec2 near = vec2((x - head) * aspect, y - lead.x);
      g *= 1.0 + bead * 1.6 * exp(-dot(near, near) / 0.0025);
    }

    float light = 0.0;
    for (int k = 0; k < ${l}; k++) {
      vec4 surge = uSurges[k];
      if (surge.w <= 0.0) continue;
      float progress = clamp((surge.y - i * ${d.toFixed(3)}) / ${u.toFixed(2)}, 0.0, 1.0);
      if (progress <= 0.0 || progress >= 1.0) continue;
      float lead = mix(surge.x, surge.z > 0.0 ? 1.12 : -0.12, easeInOut(progress));
      float along = (x - lead) * surge.z * aspect;
      float trail = along < 0.0 ? exp(along / 0.24) : exp(-along * along / 0.0009);
      light += trail * sin(PI * progress);
    }
    g *= 1.0 + light * (0.12 + 2.8 * onLine);

    if (uPulses > 0.0) {
      float travel = abs(x - hub);
      float pulse = pow(0.5 + 0.5 * sin(travel * 16.0 + uClock * 2.2 + i * 1.9), 24.0);
      g *= 1.0 + uPulses * 5.0 * pulse * onLine;
    }

    float sheen = pow(0.5 + 0.5 * sin(abs(x - hub) * 11.0 + uClock * 1.4), 10.0);
    float lift = focus * presence;
    g *= (1.0 - settle * (1.0 - focus)) * (1.0 + lift * (0.9 + 1.4 * sheen * onLine));

    vec3 tint = mix(palette(ci), uCore, 0.3 * lift);
    color += g * tint;
    energy += g;
    float stroke = smoothstep(0.45, 1.3, g);
    inkColor += tint * stroke;
    ink += stroke;
  }

  float fade = 1.0;
  if (uFade > 0.0) {
    float edge = min(x, 1.0 - x);
    float f = clamp(edge / max(uFade * 0.5, 0.001), 0.0, 1.0);
    fade = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  }
  float core = smoothstep(0.5, 2.2, energy);
  color = mix(color, uCore * energy, core * 0.5);
  color *= uBrightness * fade;
  float alpha = clamp(energy * fade, 0.0, 1.0) * uOpacity;
  float grain = (hash(gl_FragCoord.xy + fract(uClock) * 97.0) - 0.5) * uGrain;

  if (uLight < 0.5) {
    vec3 rgb = max(color * alpha * (1.0 + grain * 2.0), 0.0);
    if (uOpaque > 0.5) {
      outColor = vec4(min(uBackground * (1.0 - alpha) + rgb, 1.0), 1.0);
    } else {
      outColor = vec4(rgb, alpha);
    }
  } else {
    ink *= fade;
    vec3 hue = ink > 0.0001 ? inkColor / ink : palette(0.5);
    float body = clamp(ink, 0.0, 1.0);
    float haze = clamp(1.0 - exp(-energy * fade * 0.3), 0.0, 1.0) * 0.12;
    float focal = smoothstep(2.0, 9.0, energy * fade) * 0.25;
    float cover = clamp((body * 0.9 + (haze + focal) * (1.0 - body)) * (1.0 + grain * 2.0), 0.0, 0.95) * uOpacity;
    vec3 stroke = hue;
    if (uOpaque > 0.5) {
      outColor = vec4(mix(uBackground, stroke, cover), 1.0);
    } else {
      outColor = vec4(stroke * cover, cover);
    }
  }
}`,g=(e,t,n)=>Math.min(n,Math.max(t,e)),_=(e,t)=>(e%t+t)%t,v=null,y=(e,t)=>{if(e===`transparent`)return null;if(typeof document>`u`||(v||(v=document.createElement(`canvas`).getContext(`2d`)),!v))return t;v.fillStyle=`#000000`,v.fillStyle=e;let n=v.fillStyle;if(n.startsWith(`#`)){let e=parseInt(n.slice(1),16);return[(e>>16&255)/255,(e>>8&255)/255,(e&255)/255]}let r=/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?/.exec(n);return r?r[4]!==void 0&&Number(r[4])===0?null:[Number(r[1])/255,Number(r[2])/255,Number(r[3])/255]:t},b=e=>Math.min(.12,.9/Math.max(e-1,1)),x=(e,t,n)=>{let r=(e[0]-.5)*t,i=.5-e[1],a=Math.cos(n),o=Math.sin(n);return[(r*a+i*o)/t+.5,-r*o+i*a+.5]},S=(e,t,n,r,i)=>{let a=e.nodes<=1?t-e.pinch:(t-e.pinch+.5)*e.nodes-.5,o=e.mirror&&_(Math.floor(a),2)<.5?-1:1,s=t-e.pinch,c=e.nodes<=1?e.spread*Math.abs(s):e.spread*.5*Math.abs(Math.cos(Math.PI*e.nodes*(s+.5))),l=e.shimmer?Math.sin(i*1.7+n*1.3)*.35:0,u=t*e.frequency+(r+n*p/Math.max(e.count,1))*o+l;return e.position-c*(1+n*e.taper)*Math.sin(u)},C=(e,t,n)=>{let r=e.createShader(t);return r?(e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(e.deleteShader(r),null)):null},w=()=>typeof window<`u`&&(window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches??!1);function T({colors:e=[`#5227FF`,`#FF9FFC`],coreColor:t=`#FFFFFF`,backgroundColor:n=`transparent`,lightMode:p=!1,threadCount:_=6,speed:v=.2,frequency:T=5,spread:E=.18,taper:D=1,position:O=.5,pinch:k=.5,nodes:A=1,angle:j=0,glow:M=.02,falloff:N=.6,thickness:P=1.1,brightness:F=.6,opacity:I=1,depth:L=0,pulses:R=0,mirror:z=!0,shimmer:B=!1,fade:V=0,grain:H=.05,intro:U=!0,mouseInteraction:W=!0,mouseStrength:G=.5,pulseOnClick:K=!0,paused:q=!1,dpr:J=2,className:ee=``,style:te}){let Y=(0,r.useRef)(null),X=e.join(`|`),Z=(0,r.useMemo)(()=>X.split(`|`).slice(0,c).map(e=>y(e,[1,1,1])??[1,1,1]),[X]),ne=(0,r.useMemo)(()=>y(t,[1,1,1])??[1,1,1],[t]),re=(0,r.useMemo)(()=>y(n,null),[n]),Q={palette:Z.length?Z:[[1,1,1]],core:ne,paper:re,lightMode:p,count:g(Math.round(_),1,s),speed:v,frequency:T,spread:E,taper:D,position:O,pinch:k,nodes:g(Math.round(A),1,6),angle:j*Math.PI/180,glow:Math.max(0,M),falloff:Math.max(.05,N),thickness:Math.max(.05,P),brightness:Math.max(0,F),opacity:g(I,0,1),depth:g(L,0,1),pulses:Math.max(0,R),mirror:z,shimmer:B,fade:g(V,0,1),grain:typeof H==`number`?Math.max(0,H):H?.05:0,intro:U,mouseInteraction:W,mouseStrength:g(G,0,1),pulseOnClick:K,paused:q,dpr:Math.max(.5,J)},$=(0,r.useRef)(Q);return $.current=Q,(0,r.useEffect)(()=>{let e=Y.current;if(!e)return;let t=document.createElement(`canvas`);t.className=o,e.appendChild(t);let n=t.getContext(`webgl2`,{alpha:!0,antialias:!1,depth:!1,stencil:!1,premultipliedAlpha:!0,powerPreference:`high-performance`});if(!n){t.remove();return}let r=C(n,n.VERTEX_SHADER,m),i=C(n,n.FRAGMENT_SHADER,h),a=n.createProgram();if(!r||!i||!a){t.remove();return}if(n.attachShader(a,r),n.attachShader(a,i),n.bindAttribLocation(a,0,`aPosition`),n.linkProgram(a),n.deleteShader(r),n.deleteShader(i),!n.getProgramParameter(a,n.LINK_STATUS)){n.deleteProgram(a),t.remove();return}let p=`uResolution.uPhase.uClock.uCount.uFrequency.uSpread.uTaper.uPosition.uPinch.uNodes.uAngle.uGlow.uFalloff.uThickness.uBrightness.uOpacity.uMirror.uShimmer.uDepth.uPulses.uFade.uGrain.uColors.uColorCount.uCore.uBackground.uOpaque.uLight.uIntro.uFocus.uFocusState.uSurges`.split(`.`),g={};p.forEach(e=>{g[e]=n.getUniformLocation(a,e)});let _=n.createVertexArray();n.bindVertexArray(_);let v=n.createBuffer();n.bindBuffer(n.ARRAY_BUFFER,v),n.bufferData(n.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),n.STATIC_DRAW),n.enableVertexAttribArray(0),n.vertexAttribPointer(0,2,n.FLOAT,!1,0,0),n.useProgram(a);let y=new Float32Array(18),T=new Float32Array(12),E=new Float32Array(s),D={width:1,height:1,phase:0,clock:0,last:0,raf:0,visible:!1,introAt:-1,pointer:[.5,.5],inside:!1,presence:0,settle:0,target:-1,surges:[],quiet:0,seen:null},O=()=>{let n=$.current,r=Math.min(window.devicePixelRatio||1,n.dpr),i=Math.max(1,Math.round(e.clientWidth*r)),a=Math.max(1,Math.round(e.clientHeight*r));(i!==D.width||a!==D.height)&&(D.quiet=0,D.width=i,D.height=a,t.width=i,t.height=a)},k=e=>(e.count-1)*b(e.count)+f,A=(e,t,n)=>{let r=e.mouseInteraction&&D.inside;if(r){let t=D.width/Math.max(D.height,1),[r,i]=x(D.pointer,t,e.angle),a=-1,o=1/0;for(let t=0;t<e.count;t++){let s=Math.abs(S(e,r,t,D.phase,n?0:D.clock)-i);s<(t===D.target?.11:.085)&&s<o&&(a=t,o=s)}D.target=a}else D.target=-1;let i=1-Math.exp(-t/.22),a=0;for(let e=0;e<s;e++){let t=+(e===D.target);E[e]+=(t-E[e])*i,a=Math.max(a,E[e])}D.presence+=(+!!r-D.presence)*(1-Math.exp(-t/.3));let o=e.mouseStrength*.65*a*D.presence;return D.settle+=(o-D.settle)*(1-Math.exp(-t/.3)),a>.002||D.presence>.002||D.settle>.002},j=e=>{let t=$.current,r=D.introAt<0?0:D.clock-D.introAt,i=t.intro&&!e&&r<k(t);n.viewport(0,0,D.width,D.height),n.uniform2f(g.uResolution,D.width,D.height),n.uniform1f(g.uPhase,D.phase),n.uniform1f(g.uClock,e?0:D.clock),n.uniform1i(g.uCount,t.count),n.uniform1f(g.uFrequency,t.frequency),n.uniform1f(g.uSpread,t.spread),n.uniform1f(g.uTaper,t.taper),n.uniform1f(g.uPosition,t.position),n.uniform1f(g.uPinch,t.pinch),n.uniform1f(g.uNodes,t.nodes),n.uniform2f(g.uAngle,Math.cos(t.angle),Math.sin(t.angle)),n.uniform1f(g.uGlow,t.glow*Math.sqrt(6/Math.max(t.count,6))),n.uniform1f(g.uFalloff,t.falloff),n.uniform1f(g.uThickness,t.thickness),n.uniform1f(g.uBrightness,t.brightness),n.uniform1f(g.uOpacity,t.opacity),n.uniform1f(g.uMirror,+!!t.mirror),n.uniform1f(g.uShimmer,t.shimmer&&!e?1:0),n.uniform1f(g.uDepth,t.depth),n.uniform1f(g.uPulses,t.pulses),n.uniform1f(g.uFade,t.fade),n.uniform1f(g.uGrain,t.grain),y.fill(0),t.palette.slice(0,c).forEach((e,t)=>y.set(e,t*3)),n.uniform3fv(g.uColors,y),n.uniform1i(g.uColorCount,Math.min(t.palette.length,c)),n.uniform3f(g.uCore,t.core[0],t.core[1],t.core[2]);let a=t.paper??[0,0,0];n.uniform3f(g.uBackground,a[0],a[1],a[2]),n.uniform1f(g.uOpaque,+!!t.paper),n.uniform1f(g.uLight,+!!t.lightMode),n.uniform4f(g.uIntro,r,b(t.count),f,+!!i),n.uniform1fv(g.uFocus,E),n.uniform2f(g.uFocusState,D.presence*(.4+.6*t.mouseStrength),D.settle),T.fill(0),D.surges.slice(-3).forEach((e,t)=>{T.set([e.x,D.clock-e.at,e.direction,1],t*4)}),n.uniform4fv(g.uSurges,T),n.bindFramebuffer(n.FRAMEBUFFER,null),n.clearColor(0,0,0,0),n.clear(n.COLOR_BUFFER_BIT),n.drawArrays(n.TRIANGLES,0,3)},M=e=>{if(D.raf=requestAnimationFrame(M),!D.visible||document.hidden){D.last=e;return}let t=$.current,n=D.last?Math.min((e-D.last)/1e3,.1):1/60;D.last=e;let r=w();D.clock+=n,D.introAt<0&&(D.introAt=D.clock),!t.paused&&!r&&(D.phase+=n*t.speed);let i=A(t,n,r);D.surges=D.surges.filter(e=>D.clock-e.at<u+(t.count-1)*d);let a=t.paused||r,o=D.surges.length>0||t.intro&&!r&&D.clock-D.introAt<k(t)||i;D.seen!==t||o||!a?D.quiet=0:D.quiet+=1,D.seen=t,!(D.quiet>3)&&(O(),j(r))},N=t=>{let n=e.getBoundingClientRect();return{x:(t.clientX-n.left)/Math.max(n.width,1),y:(t.clientY-n.top)/Math.max(n.height,1),inside:t.clientX>=n.left&&t.clientX<=n.right&&t.clientY>=n.top&&t.clientY<=n.bottom}},P=e=>{let t=N(e);D.inside=t.inside,t.inside&&(D.pointer=[t.x,t.y])},F=()=>{D.inside=!1},I=e=>{let t=$.current;if(!t.pulseOnClick||e.button!==0||w()||e.target instanceof Element&&e.target.closest(`a, button, input, textarea, select, label, [role="button"]`))return;let n=N(e);if(!n.inside)return;let r=D.width/Math.max(D.height,1),[i]=x([n.x,n.y],r,t.angle),a=i<=t.pinch?1:-1;D.surges.push({x:i,direction:a,at:D.clock}),D.surges.length>l&&D.surges.shift()},L=new IntersectionObserver(e=>{D.visible=e.some(e=>e.isIntersecting)});L.observe(e);let R=new ResizeObserver(O);return R.observe(e),O(),window.addEventListener(`pointermove`,P,{passive:!0}),window.addEventListener(`pointerdown`,I),document.documentElement.addEventListener(`pointerleave`,F),D.raf=requestAnimationFrame(M),()=>{cancelAnimationFrame(D.raf),L.disconnect(),R.disconnect(),window.removeEventListener(`pointermove`,P),window.removeEventListener(`pointerdown`,I),document.documentElement.removeEventListener(`pointerleave`,F),n.deleteProgram(a),n.deleteBuffer(v),n.deleteVertexArray(_),n.getExtension(`WEBGL_lose_context`)?.loseContext(),t.remove()}},[]),(0,i.jsx)(`div`,{ref:Y,className:[a,ee].filter(Boolean).join(` `),style:te})}export{T as default};