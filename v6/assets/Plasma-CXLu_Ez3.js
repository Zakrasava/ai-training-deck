import{i as e,t}from"./react-sySUN5R7.js";import{k as n}from"./sculpture-dark-CKiqtzhU.js";var r=e(t(),1),i=n(),a=`#version 300 es
in vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`,o=`#version 300 es
precision highp float;
uniform vec2 uView;
uniform vec2 uScale;
uniform float uZoom;
uniform float uTime;
uniform float uTwist;
uniform float uWave;
uniform float uSharpness;
uniform vec2 uOrbit;
uniform float uDither;
out vec4 outColor;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

void main() {
  vec2 c = (gl_FragCoord.xy * uScale - 0.5 * uView) / uZoom;
  vec3 rd = normalize(vec3(c, uView.y));
  vec3 ro = vec3(0.0, 0.0, -4.0);
  float cy = cos(uOrbit.x);
  float sy = sin(uOrbit.x);
  float cx = cos(uOrbit.y);
  float sx = sin(uOrbit.y);
  mat3 orbit = mat3(cy, 0.0, -sy, 0.0, 1.0, 0.0, sy, 0.0, cy) * mat3(1.0, 0.0, 0.0, 0.0, cx, sx, 0.0, -sx, cx);
  ro = orbit * ro;
  rd = orbit * rd;
  float z = 0.0;
  float density = 0.0;
  float band = 0.0;
  for (int i = 0; i < 60; i++) {
    vec3 p = ro + rd * z;
    vec3 s = p;
    float d = p.y - uTime;
    p.x += uWave * (1.0 + p.y) * sin(d + p.x * 0.1) * cos(0.34 * d + p.x * 0.05);
    vec2 q = p.xz *= mat2(cos(p.y * uTwist + vec4(0.0, 11.0, 33.0, 0.0) - uTime));
    float shell = abs(sqrt(length(q * q)) - 0.25 * (5.0 + s.y)) / 3.0;
    float stepLength = shell + 0.0008;
    z += stepLength;
    float phase = s.y + p.z * 0.5 + s.z - length(s - p);
    float weight = (1.0 + sin(phase + 8.0)) * exp(-shell * uSharpness) * stepLength;
    density += weight;
    band += weight * (0.5 + 0.5 * sin(phase * 0.5 + 1.0));
  }
  vec2 encoded = sqrt(vec2(density, band) / (1.0 + vec2(density, band)));
  encoded += (vec2(hash(gl_FragCoord.xy), hash(gl_FragCoord.yx + 17.0)) - 0.5) * uDither;
  outColor = vec4(encoded, 0.0, 1.0);
}`,s=`#version 300 es
precision highp float;
uniform sampler2D uVolume;
uniform vec2 uResolution;
uniform vec3 uColor;
uniform vec3 uHighlight;
uniform vec3 uInk;
uniform float uGain;
uniform float uShine;
uniform float uPresence;
uniform float uGrain;
uniform float uFade;
uniform float uOpacity;
uniform float uTime;
uniform float uLightMode;
uniform vec3 uHeat;
out vec4 outColor;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float smootherstep(float edge, float x) {
  float t = clamp(x / max(edge, 0.0001), 0.0, 1.0);
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  vec2 encoded = clamp(texture(uVolume, uv).rg, 0.0, 0.9995);
  encoded *= encoded;
  vec2 volume = encoded / (1.0 - encoded);
  vec2 offset = (gl_FragCoord.xy - uHeat.xy) / uResolution.y;
  float heat = uHeat.z * exp(-dot(offset, offset) / 0.05);
  float density = volume.r * uGain * uPresence * (1.0 + heat * 0.35);
  float band = clamp(volume.g / max(volume.r, 0.00001), 0.0, 1.0);
  vec3 tint = mix(uColor, uHighlight, band * 0.35);
  vec3 hdr = tint * density + uHighlight * density * density * uShine;
  float peak = max(hdr.r, max(hdr.g, hdr.b));
  float level = 1.0 - exp(-peak);
  float hot = smoothstep(1.0, 3.0, peak);
  float edge = uFade * 0.5;
  float mask = smootherstep(edge, uv.x) * smootherstep(edge, 1.0 - uv.x) * smootherstep(edge, uv.y) * smootherstep(edge, 1.0 - uv.y);
  mask *= uOpacity;
  float grain = (hash(gl_FragCoord.xy + fract(uTime * 7.31) * 113.0) - 0.5) * uGrain;
  if (uLightMode > 0.5) {
    vec3 color = mix(uInk, vec3(1.0), hot * 0.75);
    float alpha = clamp(pow(level, 0.8) * 0.9 * (1.0 + grain), 0.0, 1.0) * mask;
    outColor = vec4(color * alpha, alpha);
  } else {
    vec3 hue = hdr / max(peak, 0.0001);
    vec3 color = mix(hue * level, vec3(level), hot * 0.6);
    color = pow(color, vec3(1.0 / 2.2));
    color = clamp(color + grain * level, 0.0, 1.0) * mask;
    outColor = vec4(color, max(color.r, max(color.g, color.b)));
  }
}`,c=1.6,l=16e5,u=(e,t,n)=>Math.min(n,Math.max(t,e)),d=(e,t,n)=>{let r=e.createShader(t);return r?(e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(e.deleteShader(r),null)):null},f=(e,t)=>{let n=d(e,e.VERTEX_SHADER,a),r=d(e,e.FRAGMENT_SHADER,t),i=e.createProgram();if(!n||!r||!i)return null;if(e.attachShader(i,n),e.attachShader(i,r),e.bindAttribLocation(i,0,`aPosition`),e.linkProgram(i),e.deleteShader(n),e.deleteShader(r),!e.getProgramParameter(i,e.LINK_STATUS))return e.deleteProgram(i),null;let o={},s=e.getProgramParameter(i,e.ACTIVE_UNIFORMS);for(let t=0;t<s;t++){let n=e.getActiveUniform(i,t);n&&(o[n.name]=e.getUniformLocation(i,n.name))}return{program:i,uniforms:o}},p=({color:e=`#a6a3b8`,speed:t=1,direction:n=`forward`,scale:a=1,twist:d=1,wave:p=1,softness:m=.5,shine:h=1,brightness:g=1,grain:_=.04,quality:v=.75,mouseInteractive:y=!0,intro:b=!0,fade:x=0,opacity:S=1,lightMode:C=!1,paused:w=!1,dpr:T,className:E=``,...D})=>{let O=(0,r.useRef)(null),k=(0,r.useRef)(null),A=(0,r.useRef)(null),j={color:String(e),speed:t,direction:n,scale:Math.max(.1,a),twist:d,wave:Math.max(0,p),softness:u(m,0,1),shine:Math.max(0,h),brightness:Math.max(0,g),grain:Math.max(0,_),quality:u(v,.25,1),mouseInteractive:y,intro:b,fade:u(x,0,1),opacity:u(S,0,1),lightMode:C,paused:w,dpr:T},M=(0,r.useRef)(j);return M.current=j,(0,r.useEffect)(()=>{let e=O.current,t=k.current,n=t?.getContext(`webgl2`,{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1,powerPreference:`high-performance`});if(!e||!t||!n)return;let r=!!n.getExtension(`EXT_color_buffer_float`),i=f(n,o),a=f(n,s);if(!i||!a)return;let u={volume:i,composite:a},d=n.createBuffer(),p=n.createVertexArray();n.bindVertexArray(p),n.bindBuffer(n.ARRAY_BUFFER,d),n.bufferData(n.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),n.STATIC_DRAW),n.enableVertexAttribArray(0),n.vertexAttribPointer(0,2,n.FLOAT,!1,0,0);let m=n.createTexture(),h=n.createFramebuffer(),g={width:0,height:0},_=(e,t)=>{(g.width!==e||g.height!==t)&&(g.width=e,g.height=t,n.bindTexture(n.TEXTURE_2D,m),r?n.texImage2D(n.TEXTURE_2D,0,n.RGBA16F,e,t,0,n.RGBA,n.HALF_FLOAT,null):n.texImage2D(n.TEXTURE_2D,0,n.RGBA,e,t,0,n.RGBA,n.UNSIGNED_BYTE,null),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MAG_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE),n.bindFramebuffer(n.FRAMEBUFFER,h),n.framebufferTexture2D(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,m,0))},v=document.createElement(`canvas`).getContext(`2d`,{willReadFrequently:!0}),y=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches??!1,b=new Map,x=e=>{let t=b.get(e);if(t)return t;let n=[1,1,1];if(v){v.clearRect(0,0,1,1),v.fillStyle=`#ffffff`,v.fillStyle=e,v.fillRect(0,0,1,1);let[t,r,i]=v.getImageData(0,0,1,1).data;n=[t,r,i].map(e=>(e/255)**2.2)}return b.set(e,n),n},S={width:1,height:1,volumeWidth:1,volumeHeight:1},C={x:0,y:0,inside:!1},w={clock:0,intro:M.current.intro&&!y?0:1,yaw:0,pitch:0,yawVelocity:0,pitchVelocity:0,heat:0,heatX:0,heatY:0},T=0,E=0,D=!0,j=e=>{let t=w.clock*.4;if(e.direction===`reverse`)return-t;if(e.direction!==`pingpong`)return t;let n=w.clock%10/10,r=n*n*(3-2*n);return(Math.floor(w.clock/10)%2==0?r:1-r)*10*.4},N=()=>{let e=M.current,i=w.intro*w.intro*(3-2*w.intro);n.bindVertexArray(p),_(S.volumeWidth,S.volumeHeight);let a=u.volume,o=a.uniforms;n.bindFramebuffer(n.FRAMEBUFFER,h),n.viewport(0,0,g.width,g.height),n.useProgram(a.program),n.uniform2f(o.uView,S.width,S.height),n.uniform2f(o.uScale,S.width/g.width,S.height/g.height),n.uniform1f(o.uZoom,e.scale),n.uniform1f(o.uTime,j(e)+(1-i)*1.4),n.uniform1f(o.uTwist,e.twist),n.uniform1f(o.uWave,.4*e.wave),n.uniform1f(o.uSharpness,100-e.softness*90),n.uniform2f(o.uOrbit,w.yaw,w.pitch),n.uniform1f(o.uDither,r?0:1/255),n.drawArrays(n.TRIANGLES,0,3);let s=u.composite,c=s.uniforms,l=x(e.color),d=l.map(e=>e+(1-e)*.85),f=.2126*l[0]+.7152*l[1]+.0722*l[2],v=Math.min(1,.16/Math.max(f,.001)),y=l.map(e=>Math.min(1,e*v)**(1/2.2));n.bindFramebuffer(n.FRAMEBUFFER,null),n.viewport(0,0,t.width,t.height),n.useProgram(s.program),n.uniform2f(c.uResolution,t.width,t.height),n.uniform3fv(c.uColor,l),n.uniform3fv(c.uHighlight,d),n.uniform3fv(c.uInk,y),n.uniform1f(c.uGain,4.8*e.brightness),n.uniform1f(c.uShine,.025*e.shine),n.uniform1f(c.uPresence,i),n.uniform1f(c.uGrain,e.grain),n.uniform1f(c.uFade,e.fade),n.uniform1f(c.uOpacity,e.opacity),n.uniform1f(c.uTime,w.clock%1e3),n.uniform1f(c.uLightMode,+!!e.lightMode),n.uniform3f(c.uHeat,w.heatX*t.width/S.width,(S.height-w.heatY)*t.height/S.height,w.heat),n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,m),n.uniform1i(c.uVolume,0),n.drawArrays(n.TRIANGLES,0,3)},P=e=>{if(T=0,!D||document.hidden)return;let t=M.current,n=E?Math.min(.05,(e-E)/1e3):1/60;E=e;let r=!t.paused&&!y;r&&(w.clock+=n*t.speed),!t.intro||y?w.intro=1:w.intro<1&&(w.intro=Math.min(1,w.intro+n/c));let i=t.mouseInteractive&&C.inside&&!y,a=i?(C.x/S.width-.5)*.9:0,o=i?(C.y/S.height-.5)*.18:0;w.yawVelocity+=(40*(a-w.yaw)-11*w.yawVelocity)*n,w.pitchVelocity+=(40*(o-w.pitch)-11*w.pitchVelocity)*n,w.yaw+=w.yawVelocity*n,w.pitch+=w.pitchVelocity*n,w.heat+=(+!!i-w.heat)*(1-Math.exp(-n*(i?4:2))),w.heatX+=(C.x-w.heatX)*(1-Math.exp(-n*8)),w.heatY+=(C.y-w.heatY)*(1-Math.exp(-n*8)),N();let s=w.intro<1||Math.abs(a-w.yaw)>5e-4||Math.abs(w.yawVelocity)>5e-4||Math.abs(o-w.pitch)>5e-4||Math.abs(w.pitchVelocity)>5e-4||Math.abs(+!!i-w.heat)>.002;r||s?T=requestAnimationFrame(P):E=0},F=()=>{!T&&D&&!document.hidden&&(T=requestAnimationFrame(P))},I=()=>{let n=M.current,r=Math.max(1,e.clientWidth),i=Math.max(1,e.clientHeight),a=Math.min(n.dpr||window.devicePixelRatio||1,2);S.width=r,S.height=i,t.width=Math.max(1,Math.round(r*a)),t.height=Math.max(1,Math.round(i*a));let o=n.quality;r*i*o*o>l&&(o=Math.sqrt(l/(r*i))),S.volumeWidth=Math.max(1,Math.round(r*o)),S.volumeHeight=Math.max(1,Math.round(i*o)),T||N(),F()},L=t=>{let n=e.getBoundingClientRect();C.x=t.clientX-n.left,C.y=t.clientY-n.top,C.inside=C.x>=0&&C.y>=0&&C.x<=n.width&&C.y<=n.height,F()},R=()=>{C.inside=!1,F()},z=()=>{E=0,F()},B=new ResizeObserver(I);B.observe(e);let V=new IntersectionObserver(e=>{D=e.some(e=>e.isIntersecting),D&&(E=0,F())});V.observe(e),window.addEventListener(`pointermove`,L,{passive:!0}),document.documentElement.addEventListener(`pointerleave`,R),document.addEventListener(`visibilitychange`,z),I();let H=M.current.quality,U=M.current.dpr;return A.current=()=>{let e=M.current;e.quality!==H||e.dpr!==U?(H=e.quality,U=e.dpr,I()):(T||N(),F())},()=>{cancelAnimationFrame(T),A.current=null,B.disconnect(),V.disconnect(),window.removeEventListener(`pointermove`,L),document.documentElement.removeEventListener(`pointerleave`,R),document.removeEventListener(`visibilitychange`,z),n.deleteTexture(m),n.deleteFramebuffer(h),n.deleteProgram(u.volume.program),n.deleteProgram(u.composite.program),n.deleteBuffer(d),n.deleteVertexArray(p),n.getExtension(`WEBGL_lose_context`)?.loseContext()}},[]),(0,r.useEffect)(()=>{A.current?.()}),(0,i.jsx)(`div`,{ref:O,className:[`relative h-full w-full overflow-hidden`,E].filter(Boolean).join(` `),...D,children:(0,i.jsx)(`canvas`,{ref:k,className:`absolute inset-0 block h-full w-full`,"aria-hidden":`true`})})};export{p as Plasma,p as default};