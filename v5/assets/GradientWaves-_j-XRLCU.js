import{i as e,t}from"./react-sySUN5R7.js";import{O as n}from"./sculpture-dark-Cfb-XN1r.js";var r=e(t(),1),i=n(),a=`relative h-full w-full overflow-hidden`,o=`absolute inset-0 block h-full w-full`,s=4,c=3.2,l=2.8,u=8,d=2.6,f=30,p={low:56,medium:84,high:120},m=`#version 300 es
in vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`,h=`#version 300 es
precision highp float;
uniform vec2 uResolution;
uniform float uTime;
uniform float uClock;
uniform float uAmplitude;
uniform float uWaveScale;
uniform float uWaveRatio;
uniform float uSwell;
uniform float uTurbulence;
uniform float uHeight;
uniform float uTilt;
uniform float uZoom;
uniform vec2 uLook;
uniform float uFogDepth;
uniform float uBrightness;
uniform float uOpacity;
uniform float uGrain;
uniform vec3 uHorizon;
uniform vec3 uWave;
uniform vec3 uCrest;
uniform vec3 uBackground;
uniform float uOpaque;
uniform float uLight;
uniform vec3 uSun;
uniform float uRelief;
uniform float uSheen;
uniform float uSteps;
uniform float uStride;
uniform vec3 uIntro;
uniform vec3 uSwells[${s}];
uniform float uSwellWidth;
out vec4 outColor;

const float FAR = 4000.0;

float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

vec3 surface(vec2 xy) {
  vec2 freq = vec2(uWaveScale / 7.0, (uWaveScale * uWaveRatio) / 3.0);
  vec4 tc = vec4(uTime / 0.130, uTime / 0.810, uTime / 0.200, uTime / 0.710);
  float a = xy.x + tc.x;
  float swellPhase = (xy.y + a) / 20.0 + tc.y;
  float bend = uSwell * cos(swellPhase) / 20.0;
  float mx = a + uSwell * sin(swellPhase);
  float crossPhase = xy.x / 23.0 + tc.w;
  float my = xy.y - tc.z + uTurbulence * cos(crossPhase);
  float twist = -uTurbulence * sin(crossPhase) / 23.0;
  float cx = cos(mx * freq.x);
  float cy = cos(my * freq.y);
  float rise = 1.0;
  if (uIntro.z > 0.0) rise = mix(1.0, smoothstep(uIntro.y * 0.45, uIntro.y * 1.6, xy.x), uIntro.z);
  float amp = uAmplitude * rise;
  float h = (sin(mx * freq.x) + sin(my * freq.y)) * amp + uHeight;
  float dx = amp * (freq.x * cx * (1.0 + bend) + freq.y * cy * twist);
  float dy = amp * (freq.x * cx * bend + freq.y * cy);
  for (int k = 0; k < ${s}; k++) {
    vec3 sw = uSwells[k];
    if (sw.z <= 0.0) continue;
    float u = (xy.x - sw.x) / uSwellWidth;
    float v = (xy.y - sw.y) / (uSwellWidth * 3.5);
    float bump = sw.z * exp(-u * u - v * v);
    h += bump;
    dx += bump * (-2.0 * u / uSwellWidth);
    dy += bump * (-2.0 * v / (uSwellWidth * 3.5));
  }
  return vec3(h, dx, dy);
}

float march(vec3 origin, vec3 dir) {
  float dist = 0.0;
  for (int i = 0; i < 128; i++) {
    if (float(i) >= uSteps) break;
    float gap = origin.z + dist * dir.z - surface(origin.xy + dist * dir.xy).x;
    if (abs(gap) < 0.002 * dist + 0.01) break;
    dist += uStride * gap;
    if (!(abs(dist) < FAR)) return FAR;
  }
  return dist;
}

void main() {
  float c;
  float s;
  float vfov = (3.14159 / 2.3) / max(uZoom, 0.05);
  vec3 cam = vec3(0.0, 0.0, ${f.toFixed(1)});
  vec2 uv = gl_FragCoord.xy / uResolution - 0.5;
  uv.x *= uResolution.x / uResolution.y;
  uv.y *= -1.0;

  vec3 dir = vec3(0.0, 0.0, -1.0);
  float ulen = length(uv);
  float xrot = vfov * ulen;
  c = cos(xrot);
  s = sin(xrot);
  dir = mat3(1.0, 0.0, 0.0, 0.0, c, -s, 0.0, s, c) * dir;
  vec2 nuv = ulen > 1e-5 ? uv / ulen : vec2(1.0, 0.0);
  dir = mat3(nuv.x, -nuv.y, 0.0, nuv.y, nuv.x, 0.0, 0.0, 0.0, 1.0) * dir;
  c = cos(uTilt + uLook.y);
  s = sin(uTilt + uLook.y);
  dir = mat3(c, 0.0, s, 0.0, 1.0, 0.0, -s, 0.0, c) * dir;
  c = cos(uLook.x);
  s = sin(uLook.x);
  dir = mat3(c, s, 0.0, -s, c, 0.0, 0.0, 0.0, 1.0) * dir;

  float dist = march(cam, dir);
  vec3 pos = cam + dist * dir;
  vec3 field = surface(pos.xy);
  vec3 view = -dir;

  float crest = clamp((field.x - uHeight) / max(2.0 * uAmplitude, 0.001) * 0.5 + 0.5, 0.0, 1.0);
  vec3 body = mix(uWave, uCrest, smoothstep(0.45, 1.0, crest) * 0.5);
  vec3 normal = normalize(vec3(-field.yz * (1.0 + 1.5 * uRelief), 1.0));
  float diffuse = clamp(dot(normal, uSun) * 0.5 + 0.5, 0.0, 1.0);
  float lightness = mix(1.0, diffuse * diffuse * (3.0 - 2.0 * diffuse), uRelief);
  float sheen = pow(clamp(dot(normal, normalize(uSun + view)), 0.0, 1.0), 14.0) * uSheen * (0.4 + 0.6 * uRelief);
  float rim = pow(1.0 - clamp(dot(normal, view), 0.0, 1.0), 3.0);

  vec3 col;
  float alpha;
  float haze = 1.0 - exp(-dist / (uFogDepth * 5.0));
  float fade = 1.0 - smoothstep(0.35, 1.0, haze);
  if (uLight < 0.5) {
    vec3 lit = mix(uHorizon * 0.18, body, lightness) + uCrest * sheen;
    lit = mix(lit, uHorizon, rim * 0.15 * uRelief);
    col = mix(lit, uHorizon, smoothstep(0.0, 1.0, haze)) * 0.85 * uBrightness;
    alpha = fade;
  } else {
    vec3 hue = mix(uHorizon, body, 0.35 + 0.65 * lightness);
    float density = mix(0.16, 0.9, 1.0 - lightness);
    density *= 1.0 - clamp(sheen, 0.0, 1.0) * 0.85;
    density *= 1.0 - 0.5 * smoothstep(0.0, 1.0, haze);
    col = hue;
    alpha = fade * clamp(density * uBrightness, 0.0, 1.0);
  }

  float reveal = uIntro.x;
  col = clamp(col, 0.0, 1.0);
  float grain = (hash(gl_FragCoord.xy + fract(uClock) * 64.0) - 0.5) * uGrain;
  alpha = clamp(alpha * (1.0 + grain), 0.0, 1.0) * reveal * uOpacity;
  if (uOpaque > 0.5) {
    outColor = vec4(mix(uBackground, col, alpha), 1.0);
  } else {
    outColor = vec4(col * alpha, alpha);
  }
}`,g=(e,t,n)=>Math.min(n,Math.max(t,e)),_=e=>e<.5?2*e*e:1-(-2*e+2)**2/2,v=null,y=(e,t)=>{if(e===`transparent`)return null;if(typeof document>`u`||(v||(v=document.createElement(`canvas`).getContext(`2d`)),!v))return t;v.fillStyle=`#000000`,v.fillStyle=e;let n=v.fillStyle;if(n.startsWith(`#`)){let e=parseInt(n.slice(1),16);return[(e>>16&255)/255,(e>>8&255)/255,(e&255)/255]}let r=/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?/.exec(n);return r?r[4]!==void 0&&Number(r[4])===0?null:[Number(r[1])/255,Number(r[2])/255,Number(r[3])/255]:t},b=(e,t,n)=>{let r=e.createShader(t);return r?(e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(console.error(e.getShaderInfoLog(r)),e.deleteShader(r),null)):null},x=(e,t,n,r)=>{let i=(e[0]-.5)*t,a=e[1]-.5,o=Math.PI/2.3/Math.max(n.zoom,.05),s=Math.hypot(i,a),c=o*s,l=[0,-Math.sin(c),-Math.cos(c)],u=s>1e-5?i/s:1,d=s>1e-5?a/s:0;l=[u*l[0]+d*l[1],-d*l[0]+u*l[1],l[2]];let f=n.tilt+r[1],p=Math.cos(f),m=Math.sin(f);l=[p*l[0]-m*l[2],l[1],m*l[0]+p*l[2]];let h=Math.cos(r[0]),g=Math.sin(r[0]);return l=[h*l[0]-g*l[1],g*l[0]+h*l[1],l[2]],l},S=(e,t,n,r)=>{let i=x(e,t,n,r);if(i[2]>-.02)return null;let a=(f-n.height)/-i[2];return[i[0]*a,i[1]*a]},C=()=>typeof window<`u`&&(window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches??!1);function w({horizonColor:e=`#5227FF`,waveColor:t=`#FF9FFC`,crestColor:n=`#FFFFFF`,backgroundColor:f=`transparent`,lightMode:v=!1,speed:x=.4,amplitude:w=2.5,waveScale:T=.6,waveRatio:E=.9,swell:D=35,turbulence:O=20,tilt:k=64,zoom:A=1,height:j=5.5,fogDepth:M=15,relief:N=1,lightAngle:P=120,sheen:F=0,brightness:I=1,opacity:L=1,grain:R=.2,quality:z=`medium`,intro:B=!0,mouseInteraction:V=!0,parallaxStrength:H=.5,mouseStrength:U=.6,swellOnClick:W=!0,paused:G=!1,dpr:K=2,className:q=``,style:J}){let Y=(0,r.useRef)(null),X={horizon:(0,r.useMemo)(()=>y(e,[.32,.15,1])??[.32,.15,1],[e]),wave:(0,r.useMemo)(()=>y(t,[1,.62,.99])??[1,.62,.99],[t]),crest:(0,r.useMemo)(()=>y(n,[1,1,1])??[1,1,1],[n]),paper:(0,r.useMemo)(()=>y(f,null),[f]),lightMode:v,speed:x,amplitude:Math.max(0,w),waveScale:Math.max(.01,T),waveRatio:Math.max(.01,E),swell:D,turbulence:O,tilt:g(k,10,85)*Math.PI/180,zoom:Math.max(.05,A),height:j,fogDepth:Math.max(.5,M),relief:g(N,0,1),lightAngle:P*Math.PI/180,sheen:Math.max(0,F),brightness:Math.max(0,I),opacity:g(L,0,1),grain:typeof R==`number`?Math.max(0,R):R?.05:0,steps:p[z]??p.medium,intro:B,mouseInteraction:V,parallaxStrength:Math.max(0,H),mouseStrength:g(U,0,1),swellOnClick:W,paused:G,dpr:Math.max(.5,K)},Z=(0,r.useRef)(X);Z.current=X;let Q=(0,r.useRef)(null);return(0,r.useEffect)(()=>{Q.current?.()}),(0,r.useEffect)(()=>{let e=Y.current;if(!e)return;let t=document.createElement(`canvas`);t.className=o,e.appendChild(t);let n=t.getContext(`webgl2`,{alpha:!0,antialias:!1,depth:!1,stencil:!1,premultipliedAlpha:!0,powerPreference:`high-performance`});if(!n){t.remove();return}let r=b(n,n.VERTEX_SHADER,m),i=b(n,n.FRAGMENT_SHADER,h),a=n.createProgram();if(!r||!i||!a){t.remove();return}if(n.attachShader(a,r),n.attachShader(a,i),n.bindAttribLocation(a,0,`aPosition`),n.linkProgram(a),n.deleteShader(r),n.deleteShader(i),!n.getProgramParameter(a,n.LINK_STATUS)){n.deleteProgram(a),t.remove();return}let f=`uResolution.uTime.uClock.uAmplitude.uWaveScale.uWaveRatio.uSwell.uTurbulence.uHeight.uTilt.uZoom.uLook.uFogDepth.uBrightness.uOpacity.uGrain.uHorizon.uWave.uCrest.uBackground.uOpaque.uLight.uSun.uRelief.uSheen.uSteps.uStride.uIntro.uSwells.uSwellWidth`.split(`.`),p={};f.forEach(e=>{p[e]=n.getUniformLocation(a,e)});let v=n.createVertexArray();n.bindVertexArray(v);let y=n.createBuffer();n.bindBuffer(n.ARRAY_BUFFER,y),n.bufferData(n.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),n.STATIC_DRAW),n.enableVertexAttribArray(0),n.vertexAttribPointer(0,2,n.FLOAT,!1,0,0),n.useProgram(a);let x=new Float32Array(12),w={width:1,height:1,cssWidth:0,cssHeight:0,time:0,clock:0,last:0,raf:0,visible:!1,introAt:-1,pointer:[.5,.5],inside:!1,look:[0,0],steer:[0,0],swells:[],quiet:0,seen:null},T=()=>{let e=Z.current,n=Math.min(window.devicePixelRatio||1,e.dpr),r=Math.max(1,Math.round(w.cssWidth*n)),i=Math.max(1,Math.round(w.cssHeight*n));(r!==w.width||i!==w.height)&&(w.quiet=0,w.width=r,w.height=i,t.width=r,t.height=i)},E=()=>{w.cssWidth=e.clientWidth,w.cssHeight=e.clientHeight,T(),A()},D=(e,t)=>!e.intro||t||w.introAt<0?1:g((w.clock-w.introAt)/d,0,1),O=e=>{let t=Z.current;n.viewport(0,0,w.width,w.height),n.uniform2f(p.uResolution,w.width,w.height),n.uniform1f(p.uTime,w.time),n.uniform1f(p.uClock,w.clock),n.uniform1f(p.uAmplitude,t.amplitude),n.uniform1f(p.uWaveScale,t.waveScale),n.uniform1f(p.uWaveRatio,t.waveRatio),n.uniform1f(p.uSwell,t.swell),n.uniform1f(p.uTurbulence,t.turbulence),n.uniform1f(p.uHeight,t.height),n.uniform1f(p.uTilt,t.tilt),n.uniform1f(p.uZoom,t.zoom),n.uniform2f(p.uLook,w.look[0],w.look[1]),n.uniform1f(p.uFogDepth,t.fogDepth),n.uniform1f(p.uBrightness,t.brightness),n.uniform1f(p.uOpacity,t.opacity),n.uniform1f(p.uGrain,t.grain),n.uniform3fv(p.uHorizon,t.horizon),n.uniform3fv(p.uWave,t.wave),n.uniform3fv(p.uCrest,t.crest);let r=t.paper??[0,0,0];n.uniform3f(p.uBackground,r[0],r[1],r[2]),n.uniform1f(p.uOpaque,+!!t.paper),n.uniform1f(p.uLight,+!!t.lightMode);let i=t.lightAngle+w.steer[0]*t.mouseStrength*2,a=.52-w.steer[1]*t.mouseStrength*.7;n.uniform3f(p.uSun,Math.cos(a)*Math.cos(i),Math.cos(a)*Math.sin(i),Math.sin(a)),n.uniform1f(p.uRelief,t.relief),n.uniform1f(p.uSheen,t.sheen),n.uniform1f(p.uSteps,t.steps);let o=t.amplitude*(t.waveScale/7*(1+Math.abs(t.swell)/20)+t.waveScale*t.waveRatio/3*(1+Math.abs(t.turbulence)/23)),s=D(t,e),d=Math.min(1,s/.22),f=160*(3/160)**_(Math.max(0,(s-.1)/.9)),m=g((s-.75)/.25,0,1);n.uniform3f(p.uIntro,d*d*(3-2*d),f,1-m*m*(3-2*m)),x.fill(0);let h=0;w.swells.forEach((e,n)=>{let r=w.clock-e.at,i=r/c,a=(1-Math.exp(-r/.25))*(1-i)**1.6,o=t.amplitude*l*a;x.set([e.x-r*12,e.y,o],n*3),h=Math.max(h,o)}),n.uniform3fv(p.uSwells,x),n.uniform1f(p.uSwellWidth,u),n.uniform1f(p.uStride,.9/Math.max(1,(o+h*.86/u)/1.5)),n.clearColor(0,0,0,0),n.clear(n.COLOR_BUFFER_BIT),n.drawArrays(n.TRIANGLES,0,3)},k=e=>{if(w.raf=0,!w.visible||document.hidden)return;let t=Z.current,n=w.last?Math.min((e-w.last)/1e3,.1):0;w.last=e;let r=C();w.clock+=n,w.introAt<0&&(w.introAt=w.clock),!t.paused&&!r&&(w.time+=n*t.speed);let i=t.mouseInteraction&&w.inside&&!r,a=i?w.pointer:[.5,.5],o=1-Math.exp(-n/.45),s=(a[0]-.5)*t.parallaxStrength*.35,l=(a[1]-.5)*t.parallaxStrength*.18;w.look[0]+=(s-w.look[0])*o,w.look[1]+=(l-w.look[1])*o;let u=Math.abs(s-w.look[0])+Math.abs(l-w.look[1])>2e-4,d=1-Math.exp(-n/.6),f=i?w.pointer[0]-.5:0,p=i?.5-w.pointer[1]:0;w.steer[0]+=(f-w.steer[0])*d,w.steer[1]+=(p-w.steer[1])*d;let m=Math.abs(f-w.steer[0])+Math.abs(p-w.steer[1])>5e-4;w.swells=w.swells.filter(e=>w.clock-e.at<c);let h=t.paused||r,g=u||m||w.swells.length>0||D(t,r)<1;w.seen!==t||g||!h?w.quiet=0:w.quiet+=1,w.seen=t,!(w.quiet>3)&&(w.raf=requestAnimationFrame(k),T(),O(r))},A=()=>{w.raf||!w.visible||document.hidden||(w.last=0,w.raf=requestAnimationFrame(k))};Q.current=A;let j=t=>{let n=e.getBoundingClientRect();return{x:(t.clientX-n.left)/Math.max(n.width,1),y:(t.clientY-n.top)/Math.max(n.height,1),inside:t.clientX>=n.left&&t.clientX<=n.right&&t.clientY>=n.top&&t.clientY<=n.bottom}},M=e=>{let t=j(e),n=w.inside;w.inside=t.inside,t.inside&&(w.pointer=[t.x,t.y]),(t.inside||n)&&Z.current.mouseInteraction&&A()},N=()=>{w.inside=!1,A()},P=e=>{let t=Z.current;if(!t.swellOnClick||e.button!==0||C()||e.target instanceof Element&&e.target.closest(`a, button, input, textarea, select, label, [role="button"]`))return;let n=j(e);if(!n.inside)return;let r=S([n.x,n.y],w.width/Math.max(w.height,1),t,w.look);r&&(w.swells.push({x:r[0],y:r[1],at:w.clock}),w.swells.length>s&&w.swells.shift(),A())},F=new IntersectionObserver(e=>{w.visible=e.some(e=>e.isIntersecting),A()});F.observe(e);let I=new ResizeObserver(E);return I.observe(e),E(),document.addEventListener(`visibilitychange`,A),window.addEventListener(`pointermove`,M,{passive:!0}),window.addEventListener(`pointerdown`,P),document.documentElement.addEventListener(`pointerleave`,N),w.raf=requestAnimationFrame(k),()=>{cancelAnimationFrame(w.raf),Q.current=null,document.removeEventListener(`visibilitychange`,A),F.disconnect(),I.disconnect(),window.removeEventListener(`pointermove`,M),window.removeEventListener(`pointerdown`,P),document.documentElement.removeEventListener(`pointerleave`,N),n.deleteProgram(a),n.deleteBuffer(y),n.deleteVertexArray(v),n.getExtension(`WEBGL_lose_context`)?.loseContext(),t.remove()}},[]),(0,i.jsx)(`div`,{ref:Y,className:[a,q].filter(Boolean).join(` `),style:J})}export{w as default};