import{i as e,t}from"./react-sySUN5R7.js";import{k as n}from"./sculpture-dark-CKiqtzhU.js";var r=e(t(),1),i=n(),a=4,o=4,s=`#version 300 es
in vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`,c=`#version 300 es
precision highp float;
precision highp int;

uniform vec2 uResolution;
uniform float uTime;
uniform float uPhase;
uniform float uIntensity;
uniform mat3 uOrient;
uniform int uColorCount;
uniform float uDistort;
uniform vec2 uOffset;
uniform sampler2D uGradient;
uniform float uNoiseAmount;
uniform int uRayCount;
uniform float uZoom;
uniform float uRayWidth;
uniform float uTwist;
uniform float uFlow;
uniform float uCenterFade;
uniform vec4 uPointer;
uniform vec4 uPulses[4];
uniform vec3 uIntro;
uniform float uEncode;
out vec4 outColor;

float hash21(vec2 p) {
  p = floor(p);
  float f = 52.9829189 * fract(dot(p, vec2(0.065, 0.005)));
  return fract(f);
}

mat2 rot30() {
  return mat2(0.8, -0.5, 0.5, 0.8);
}

float layeredNoise(vec2 fragPx) {
  vec2 p = mod(fragPx + vec2(uTime * 30.0, -uTime * 21.0), 1024.0);
  vec2 q = rot30() * p;
  float n = 0.0;
  n += 0.40 * hash21(q);
  n += 0.25 * hash21(q * 2.0 + 17.0);
  n += 0.20 * hash21(q * 4.0 + 47.0);
  n += 0.10 * hash21(q * 8.0 + 113.0);
  n += 0.05 * hash21(q * 16.0 + 191.0);
  return n;
}

float edgeFade(vec2 frag, vec2 res, vec2 offset) {
  vec2 toC = frag - 0.5 * res - offset;
  float r = length(toC) / (0.5 * min(res.x, res.y) * uCenterFade);
  float x = clamp(r, 0.0, 1.0);
  float q = x * x * x * (x * (x * 6.0 - 15.0) + 10.0);
  float s = q * 0.5;
  s = pow(s, 1.5);
  float tail = 1.0 - pow(1.0 - s, 2.0);
  s = mix(s, tail, 0.2);
  float dn = (layeredNoise(frag * 0.15) - 0.5) * 0.0015 * s;
  return clamp(s + dn, 0.0, 1.0);
}

vec2 rot2(vec2 v, float a) {
  float s = sin(a);
  float c = cos(a);
  return mat2(c, -s, s, c) * v;
}

float bendAngle(vec3 q, float t) {
  return 0.8 * sin(q.x * 0.55 + t * 0.6) + 0.7 * sin(q.y * 0.50 - t * 0.5) + 0.6 * sin(q.z * 0.60 + t * 0.7);
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  float t = uPhase;
  float jitterAmp = 0.1 * clamp(uNoiseAmount, 0.0, 1.0);
  vec2 centered = 2.0 * (frag - uOffset) - uResolution;
  vec3 dir = normalize(vec3(centered, uResolution.y * max(uZoom, 1e-3)));
  float marchT = 0.0;
  vec3 col = vec3(0.0);
  float n = layeredNoise(frag);
  float amp = clamp(uDistort, 0.0, 50.0) * 0.15;
  float edge = 0.5 - 0.35 * (uRayWidth - 1.0);
  mat2 twist = mat2(1.0);
  if (uTwist != 0.0) {
    float a = uTwist * length(centered) / uResolution.y;
    float c = cos(a);
    float s = sin(a);
    twist = mat2(c, s, -s, c);
  }

  for (int i = 0; i < 44; ++i) {
    vec3 P = marchT * dir;
    P.z -= 2.0;
    float rad = length(P);
    vec3 Pl = P * (10.0 / max(rad, 1e-6));
    if (uTwist != 0.0) Pl.xy = twist * Pl.xy;
    Pl = uOrient * Pl;

    float stepLen = min(rad - 0.3, n * jitterAmp) + 0.1;

    vec3 Pb = Pl;
    if (amp > 0.0) {
      float grow = smoothstep(0.35, 3.0, marchT);
      float a1 = amp * grow * bendAngle(Pl * 0.6, t);
      float a2 = 0.5 * amp * grow * bendAngle(Pl.zyx * 0.5 + 3.1, t * 0.9);
      Pb.xz = rot2(Pb.xz, a1);
      Pb.xy = rot2(Pb.xy, a2);
    }

    float rayPattern = smoothstep(
      edge,
      edge + 0.2,
      sin(Pb.x + cos(Pb.y) * cos(Pb.z)) * sin(Pb.z + sin(Pb.y) * cos(Pb.x + t))
    );

    if (uRayCount > 0) {
      float ang = atan(Pb.y, Pb.x);
      float comb = 0.5 + 0.5 * cos(float(uRayCount) * ang);
      comb = pow(comb, 3.0);
      rayPattern *= smoothstep(0.15, 0.95, comb);
    }

    float depth = marchT - uFlow;
    vec3 spectral;
    if (uColorCount > 0) {
      float saw = fract(depth * 0.25);
      float tRay = saw * saw * (3.0 - 2.0 * saw);
      spectral = 2.0 * texture(uGradient, vec2(clamp(tRay, 0.0, 1.0), 0.5)).rgb;
    } else {
      spectral = 1.0 + cos(depth * 3.0 + vec3(0.0, 1.0, 2.0));
    }

    col += (0.05 / (0.4 + stepLen)) * smoothstep(5.0, 0.0, rad) * spectral * rayPattern;
    marchT += stepLen;
  }

  col *= edgeFade(frag, uResolution, uOffset);
  col *= uIntensity;

  float unit = 0.5 * min(uResolution.x, uResolution.y);
  float radius = length(frag - 0.5 * uResolution - uOffset) / unit;
  float lift = 1.0;
  for (int k = 0; k < 4; k++) {
    vec4 pulse = uPulses[k];
    if (pulse.y <= 0.0) continue;
    float d = (radius - pulse.x) / pulse.z;
    lift += pulse.y * exp(-d * d) + pulse.w;
  }
  if (uPointer.z > 0.0) {
    vec2 m = (frag - uPointer.xy) / unit;
    lift += uPointer.z * exp(-dot(m, m) / max(uPointer.w * uPointer.w, 1e-4));
  }
  if (uIntro.z > 0.0) {
    vec2 toC = frag - 0.5 * uResolution - uOffset;
    float ang = atan(toC.y, toC.x);
    float streak = 0.5 + 0.22 * sin(ang * 5.0 + 1.3) + 0.16 * sin(ang * 13.0 + 4.1) + 0.12 * sin(ang * 29.0 + 2.2);
    float front = uIntro.x * (0.7 + 0.3 * streak);
    float d = (radius - front) / 0.2;
    lift += uIntro.y * exp(-d * d);
    lift *= smoothstep(front, front - 0.5, radius);
  }

  outColor = vec4(col * lift * uEncode, 1.0);
}`,l=`#version 300 es
precision highp float;
uniform sampler2D uSource;
uniform vec2 uTarget;
uniform vec2 uTexel;
uniform float uLimit;
out vec4 outColor;

void main() {
  vec2 uv = gl_FragCoord.xy / uTarget;
  vec3 color = texture(uSource, uv - uTexel).rgb;
  color += texture(uSource, uv + uTexel).rgb;
  color += texture(uSource, uv + vec2(uTexel.x, -uTexel.y)).rgb;
  color += texture(uSource, uv + vec2(-uTexel.x, uTexel.y)).rgb;
  outColor = vec4(min(color * 0.25, vec3(uLimit)), 1.0);
}`,u=`#version 300 es
precision highp float;
uniform sampler2D uSource;
uniform vec2 uTarget;
uniform vec2 uStep;
out vec4 outColor;

void main() {
  vec2 uv = gl_FragCoord.xy / uTarget;
  vec3 color = texture(uSource, uv).rgb * 0.181862;
  color += (texture(uSource, uv + uStep * 1.423135).rgb + texture(uSource, uv - uStep * 1.423135).rgb) * 0.284316;
  color += (texture(uSource, uv + uStep * 3.326702).rgb + texture(uSource, uv - uStep * 3.326702).rgb) * 0.106598;
  color += (texture(uSource, uv + uStep * 5.242989).rgb + texture(uSource, uv - uStep * 5.242989).rgb) * 0.018156;
  outColor = vec4(color, 1.0);
}`,d=`#version 300 es
precision highp float;
uniform sampler2D uScene;
uniform vec2 uSceneSize;
uniform sampler2D uBloom0;
uniform sampler2D uBloom1;
uniform sampler2D uBloom2;
uniform sampler2D uBloom3;
uniform vec2 uView;
uniform float uExact;
uniform float uDecode;
uniform float uBloom;
uniform float uFade;
uniform float uLightMode;
out vec4 outColor;

vec3 tap(vec2 uv) {
  return textureLod(uScene, uv, 0.0).rgb;
}

vec3 bicubic(vec2 uv) {
  vec2 position = uv * uSceneSize;
  vec2 center = floor(position - 0.5) + 0.5;
  vec2 f = position - center;
  vec2 w0 = f * (-0.5 + f * (1.0 - 0.5 * f));
  vec2 w1 = 1.0 + f * f * (-2.5 + 1.5 * f);
  vec2 w2 = f * (0.5 + f * (2.0 - 1.5 * f));
  vec2 w3 = f * f * (-0.5 + 0.5 * f);
  vec2 w12 = w1 + w2;
  vec2 t0 = (center - 1.0) / uSceneSize;
  vec2 t3 = (center + 2.0) / uSceneSize;
  vec2 t12 = (center + w2 / w12) / uSceneSize;
  vec3 result = tap(vec2(t0.x, t0.y)) * w0.x * w0.y;
  result += tap(vec2(t12.x, t0.y)) * w12.x * w0.y;
  result += tap(vec2(t3.x, t0.y)) * w3.x * w0.y;
  result += tap(vec2(t0.x, t12.y)) * w0.x * w12.y;
  result += tap(vec2(t12.x, t12.y)) * w12.x * w12.y;
  result += tap(vec2(t3.x, t12.y)) * w3.x * w12.y;
  result += tap(vec2(t0.x, t3.y)) * w0.x * w3.y;
  result += tap(vec2(t12.x, t3.y)) * w12.x * w3.y;
  result += tap(vec2(t3.x, t3.y)) * w3.x * w3.y;
  return max(result, 0.0);
}

float smootherstep01(float t) {
  t = clamp(t, 0.0, 1.0);
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uView;
  vec3 col = uExact > 0.5 ? texelFetch(uScene, ivec2(gl_FragCoord.xy), 0).rgb : bicubic(uv);
  if (uBloom > 0.0) {
    vec3 halo = texture(uBloom0, uv).rgb * 0.42;
    halo += texture(uBloom1, uv).rgb * 0.3;
    halo += texture(uBloom2, uv).rgb * 0.18;
    halo += texture(uBloom3, uv).rgb * 0.1;
    col += halo * uBloom * (uLightMode > 0.5 ? 0.25 : 1.0);
  }
  col = clamp(col * uDecode, 0.0, 1.0);

  float mask = 1.0;
  float edge = uFade * 0.5;
  if (edge > 0.0) {
    mask *= smootherstep01(uv.x / edge) * smootherstep01((1.0 - uv.x) / edge);
    mask *= smootherstep01(uv.y / edge) * smootherstep01((1.0 - uv.y) / edge);
  }

  if (uLightMode > 0.5) {
    float energy = max(max(col.r, col.g), col.b);
    vec3 hue = col / max(energy, 0.0001);
    float neutral = min(hue.r, min(hue.g, hue.b));
    hue = max(hue - vec3(neutral * 0.68), vec3(0.0));
    hue /= max(max(hue.r, max(hue.g, hue.b)), 0.0001);
    vec3 pigment = mix(hue, hue * hue, 0.24) * 0.64;
    float coverage = smoothstep(0.001, 0.32, energy);
    coverage = pow(coverage, 0.72) * 0.92 * mask;
    outColor = vec4(pigment * coverage, coverage);
  } else {
    col *= mask;
    outColor = vec4(col, max(col.r, max(col.g, col.b)));
  }
}`,f={low:.35,medium:.5,high:.7},p=.2,m=2.4,h=1.5,g={rotate:0,rotate3d:1,hover:2},_=(e,t,n)=>Math.min(n,Math.max(t,e)),v=e=>{if(e==null)return 0;if(typeof e==`number`)return e;let t=parseFloat(String(e).trim().replace(`px`,``));return Number.isNaN(t)?0:t},y=e=>{let t=Math.cos(e),n=Math.sin(e);return[1,0,0,0,t,-n,0,n,t]},b=e=>{let t=Math.cos(e),n=Math.sin(e);return[t,0,n,0,1,0,-n,0,t]},ee=e=>{let t=Math.cos(e),n=Math.sin(e);return[t,-n,0,n,t,0,0,0,1]},x=(e,t)=>{let n=new Float32Array(9);for(let r=0;r<3;r++)for(let i=0;i<3;i++)n[r*3+i]=e[i]*t[r*3]+e[3+i]*t[r*3+1]+e[6+i]*t[r*3+2];return n},S=(e,t,n)=>{let r=e.createShader(t);return r?(e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(e.deleteShader(r),null)):null},C=(e,t)=>{let n=S(e,e.VERTEX_SHADER,s),r=S(e,e.FRAGMENT_SHADER,t),i=e.createProgram();if(!n||!r||!i)return null;if(e.attachShader(i,n),e.attachShader(i,r),e.bindAttribLocation(i,0,`aPosition`),e.linkProgram(i),e.deleteShader(n),e.deleteShader(r),!e.getProgramParameter(i,e.LINK_STATUS))return e.deleteProgram(i),null;let a={},o=e.getProgramParameter(i,e.ACTIVE_UNIFORMS);for(let t=0;t<o;t++){let n=e.getActiveUniform(i,t);n&&(a[n.name.replace(/\[0\]$/,``)]=e.getUniformLocation(i,n.name))}return{program:i,uniforms:a}},w=({colors:e,intensity:t=2,speed:n=.5,animationType:s=`rotate3d`,distort:S=0,rayCount:w=0,rayWidth:T=1,zoom:E=1,twist:D=0,flow:O=0,centerFade:k=1,grain:A=.8,glow:j=0,offset:M,mouseInteraction:N=!0,mouseStrength:P=.5,hoverDampness:F=.25,clickBurst:I=!0,intro:L=!0,fade:R=0,quality:z=`high`,resolution:B,lightMode:V=!1,mixBlendMode:H,paused:U=!1,dpr:W,className:G=``,style:K})=>{let q=(0,r.useRef)(null),J=(0,r.useRef)(null),Y=(0,r.useRef)(null),X=(0,r.useRef)(null),[Z,te]=(0,r.useState)(0);return X.current={colors:Array.isArray(e)?e.slice(0,64).map(String):[],intensity:Math.max(0,t),speed:n,animation:g[s]??g.rotate3d,distort:Math.max(0,S),rayCount:Math.max(0,Math.floor(w??0)),rayWidth:_(T,.2,2.5),zoom:Math.max(.05,E),twist:D,flow:O,centerFade:_(k,.5,3),grain:_(A,.3,1),glow:Math.max(0,j),offsetX:v(M?.x),offsetY:v(M?.y),mouseInteraction:N,mouseStrength:Math.max(0,P),hoverDampness:_(F,0,1),clickBurst:I,intro:L,fade:_(R,0,1),scale:_(B??f[z]??f.high,p,1),lightMode:V,paused:U,dpr:W},(0,r.useEffect)(()=>{let e=q.current,t=J.current,n=t?.getContext(`webgl2`,{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1,powerPreference:`high-performance`});if(!e||!t||!n)return;let r=!!n.getExtension(`EXT_color_buffer_float`),i=C(n,c),s=C(n,l),f=C(n,u),g=C(n,d);if(!i||!s||!f||!g)return;let v=e=>{e.preventDefault()},S=()=>te(e=>e+1);t.addEventListener(`webglcontextlost`,v),t.addEventListener(`webglcontextrestored`,S);let w=n.createBuffer(),T=n.createVertexArray();n.bindVertexArray(T),n.bindBuffer(n.ARRAY_BUFFER,w),n.bufferData(n.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),n.STATIC_DRAW),n.enableVertexAttribArray(0),n.vertexAttribPointer(0,2,n.FLOAT,!1,0,0);let E=r?n.RGBA16F:n.RGBA8,D=r?1:.25,O=()=>({texture:null,framebuffer:n.createFramebuffer(),width:0,height:0}),k=O(),A=Array.from({length:a},()=>[O(),O()]),j=(e,t,r)=>{e.texture&&e.width===t&&e.height===r||(e.texture&&n.deleteTexture(e.texture),e.texture=n.createTexture(),e.width=t,e.height=r,n.bindTexture(n.TEXTURE_2D,e.texture),n.texStorage2D(n.TEXTURE_2D,1,E,t,r),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MAG_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE),n.bindFramebuffer(n.FRAMEBUFFER,e.framebuffer),n.framebufferTexture2D(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,e.texture,0))},M=(e,r)=>(n.bindFramebuffer(n.FRAMEBUFFER,e?e.framebuffer:null),n.viewport(0,0,e?e.width:t.width,e?e.height:t.height),n.useProgram(r.program),r.uniforms),N=(e,t)=>{n.activeTexture(n.TEXTURE0+e),n.bindTexture(n.TEXTURE_2D,t)},P=n.createTexture(),F=null,I=document.createElement(`canvas`).getContext(`2d`,{willReadFrequently:!0}),L=e=>{if(!I)return[255,255,255];I.clearRect(0,0,1,1),I.fillStyle=`#ffffff`,I.fillStyle=e,I.fillRect(0,0,1,1);let[t,n,r]=I.getImageData(0,0,1,1).data;return[t,n,r]},R=e=>{let t=e.join(`|`);if(t===F)return;F=t;let r=Math.max(1,e.length),i=new Uint8Array(r*4).fill(255);e.forEach((e,t)=>i.set(L(e),t*4)),n.bindTexture(n.TEXTURE_2D,P),n.pixelStorei(n.UNPACK_ALIGNMENT,1),n.texImage2D(n.TEXTURE_2D,0,n.RGBA,r,1,0,n.RGBA,n.UNSIGNED_BYTE,i),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MAG_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE)},z=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches??!1,B={x:0,y:0,inside:!1},V={time:0,phase:0,flow:0,kick:0,intro:X.current.intro&&!z?0:1,hoverX:.5,hoverY:.5,smoothX:0,smoothY:0,touch:0,governor:1,slow:0,quick:0},H=[],U=new Float32Array(16),W=0,G=0,K=!0,Z=()=>{let r=X.current,o=t.width,c=t.height,l=Math.max(1,e.clientWidth),u=Math.max(1,e.clientHeight),d=Math.max(p,r.scale*V.governor),m=Math.max(1,Math.round(o*d)),_=Math.max(1,Math.round(c*d)),v=m===o&&_===c;n.bindVertexArray(T),j(k,m,_),A.forEach((e,t)=>{let n=Math.max(1,Math.round(l/2**(t+1))),r=Math.max(1,Math.round(u/2**(t+1)));j(e[0],n,r),j(e[1],n,r)}),R(r.colors);let S=m/l,C=r.mouseInteraction?V.touch:0,w=l>0?V.smoothX/l*2-1:0,E=u>0?V.smoothY/u*2-1:0,O=.06*r.mouseStrength*C*Math.min(m,_)*.5,F=r.offsetX*S+w*O,I=r.offsetY*S-E*O,L=V.phase,z;if(r.animation===0){let e=L*.2,t=Math.cos(e);z=[t,0,Math.cos(e+11),0,1,0,Math.cos(e+33),0,t]}else if(r.animation===1)z=x(x(ee(L*.17),b(L*.21)),y(L*.31));else{let e=V.hoverX*2-1,t=V.hoverY*2-1;z=x(b(e*.6),y(t*.6))}if(r.animation!==2&&C>0){let e=.3*r.mouseStrength*C;z=x(z,x(b(w*e),y(E*e)))}U.fill(0),H.forEach((e,t)=>{let n=e.age/h;U.set([e.age*1.7,1.6*(1-n)**1.6,.2+e.age*.16,.35*Math.exp(-e.age*7)],t*4)});let B=.5*Math.min(m,_),W=Math.hypot(m*.5+Math.abs(F),_*.5+Math.abs(I))/Math.max(B,1),G=1-(1-V.intro)**3,K=M(k,i);if(N(0,P),n.uniform1i(K.uGradient,0),n.uniform2f(K.uResolution,m,_),n.uniform1f(K.uTime,V.time),n.uniform1f(K.uPhase,L),n.uniform1f(K.uIntensity,r.intensity),n.uniformMatrix3fv(K.uOrient,!1,z),n.uniform1i(K.uColorCount,r.colors.length),n.uniform1f(K.uDistort,r.distort),n.uniform2f(K.uOffset,F,I),n.uniform1f(K.uNoiseAmount,r.grain),n.uniform1i(K.uRayCount,r.rayCount),n.uniform1f(K.uZoom,r.zoom),n.uniform1f(K.uRayWidth,r.rayWidth),n.uniform1f(K.uTwist,r.twist),n.uniform1f(K.uFlow,V.flow),n.uniform1f(K.uCenterFade,r.centerFade*Math.max(1,r.zoom)),n.uniform4f(K.uPointer,V.smoothX*S,(u-V.smoothY)*S,r.mouseInteraction?.7*r.mouseStrength*C:0,.45),n.uniform4fv(K.uPulses,U),n.uniform3f(K.uIntro,G*(W+.6)/.7,1.6*(1-V.intro),+(V.intro<1)),n.uniform1f(K.uEncode,D),n.drawArrays(n.TRIANGLES,0,3),r.glow>0){let e=k;A.forEach(([t,r])=>{let i=M(t,s);N(0,e.texture),n.uniform1i(i.uSource,0),n.uniform2f(i.uTarget,t.width,t.height),n.uniform2f(i.uTexel,1/e.width,1/e.height),n.uniform1f(i.uLimit,3*D),n.drawArrays(n.TRIANGLES,0,3);let a=M(r,f);N(0,t.texture),n.uniform1i(a.uSource,0),n.uniform2f(a.uTarget,r.width,r.height),n.uniform2f(a.uStep,1/t.width,0),n.drawArrays(n.TRIANGLES,0,3),a=M(t,f),N(0,r.texture),n.uniform1i(a.uSource,0),n.uniform2f(a.uTarget,t.width,t.height),n.uniform2f(a.uStep,0,1/r.height),n.drawArrays(n.TRIANGLES,0,3),e=t})}let q=M(null,g);N(0,k.texture),n.uniform1i(q.uScene,0),A.forEach(([e],t)=>{N(t+1,e.texture),n.uniform1i(q[`uBloom${t}`],t+1)}),n.uniform2f(q.uSceneSize,m,_),n.uniform2f(q.uView,o,c),n.uniform1f(q.uExact,+!!v),n.uniform1f(q.uDecode,1/D),n.uniform1f(q.uBloom,r.glow),n.uniform1f(q.uFade,r.fade),n.uniform1f(q.uLightMode,+!!r.lightMode),n.drawArrays(n.TRIANGLES,0,3);for(let e=a;e>=0;e--)N(e,null)},ne=e=>{e>1/40?(V.slow+=1,V.quick=0):e<1/55&&(V.quick+=1,V.slow=0),V.slow>20?(V.governor=Math.max(.5,V.governor*.85),V.slow=0):V.quick>180&&V.governor<1&&(V.governor=Math.min(1,V.governor*1.1),V.quick=0)},re=t=>{if(W=0,!K||document.hidden)return;let n=X.current,r=G?Math.min(.05,(t-G)/1e3):1/60;G&&ne((t-G)/1e3),G=t,!n.intro||z?V.intro=1:V.intro<1&&(V.intro=Math.min(1,V.intro+r/m));let i=3*(1-V.intro)**2,a=!n.paused&&!z;a&&(V.time+=r,V.phase+=r*n.speed*(1+i)+V.kick*r,V.flow+=r*n.flow*1.2),V.kick*=Math.exp(-r*3.5),V.kick<.001&&(V.kick=0);let o=n.mouseInteraction&&B.inside&&!z,s=.02+n.hoverDampness*.5,c=1-Math.exp(-r/s);if(o&&V.touch<.01&&(V.smoothX=B.x,V.smoothY=B.y),V.smoothX+=(B.x-V.smoothX)*c,V.smoothY+=(B.y-V.smoothY)*c,V.touch+=(+!!o-V.touch)*(1-Math.exp(-r*(o?5:2.5))),n.animation===2&&B.inside){let t=Math.max(1,e.clientWidth),n=Math.max(1,e.clientHeight);V.hoverX+=(_(B.x/t,0,1)-V.hoverX)*c,V.hoverY+=(_(B.y/n,0,1)-V.hoverY)*c}for(let e=H.length-1;e>=0;e--)H[e].age+=r,H[e].age>h&&H.splice(e,1);Z();let l=V.intro<1||H.length>0||V.kick>0||Math.abs(+!!o-V.touch)>.002||Math.abs(B.x-V.smoothX)+Math.abs(B.y-V.smoothY)>.2;a&&(n.speed!==0||n.grain>0||n.flow!==0)||l?W=requestAnimationFrame(re):G=0},Q=()=>{!W&&K&&!document.hidden&&(W=requestAnimationFrame(re))},$=()=>{let n=X.current,r=Math.max(1,e.clientWidth),i=Math.max(1,e.clientHeight),a=Math.min(n.dpr||window.devicePixelRatio||1,2);t.width=Math.max(1,Math.round(r*a)),t.height=Math.max(1,Math.round(i*a)),W||Z(),Q()},ie=t=>{let n=e.getBoundingClientRect(),r=t.clientX-n.left,i=t.clientY-n.top;return{x:r,y:i,inside:r>=0&&i>=0&&r<=n.width&&i<=n.height}},ae=e=>{let t=ie(e);B.x=t.x,B.y=t.y,B.inside=t.inside,Q()},oe=e=>{let t=ie(e);if(!t.inside)return;B.x=t.x,B.y=t.y,B.inside=!0;let n=X.current;n.mouseInteraction&&n.clickBurst&&!z&&(H.length>=o&&H.shift(),H.push({age:0}),V.kick=Math.min(5,V.kick+2.4)),Q()},se=()=>{B.inside=!1,Q()},ce=()=>{G=0,Q()},le=new ResizeObserver($);le.observe(e);let ue=new IntersectionObserver(e=>{K=e.some(e=>e.isIntersecting),K&&(G=0,Q())});ue.observe(e),window.addEventListener(`pointermove`,ae,{passive:!0}),window.addEventListener(`pointerdown`,oe,{passive:!0}),document.documentElement.addEventListener(`pointerleave`,se),document.addEventListener(`visibilitychange`,ce),$();let de=X.current.dpr;return Y.current=()=>{let e=X.current;e.dpr===de?(W||Z(),Q()):(de=e.dpr,$())},()=>{cancelAnimationFrame(W),Y.current=null,t.removeEventListener(`webglcontextlost`,v),t.removeEventListener(`webglcontextrestored`,S),le.disconnect(),ue.disconnect(),window.removeEventListener(`pointermove`,ae),window.removeEventListener(`pointerdown`,oe),document.documentElement.removeEventListener(`pointerleave`,se),document.removeEventListener(`visibilitychange`,ce),[k,...A.flat()].forEach(e=>{e.texture&&n.deleteTexture(e.texture),n.deleteFramebuffer(e.framebuffer)}),n.deleteTexture(P),[i,s,f,g].forEach(e=>n.deleteProgram(e.program)),n.deleteBuffer(w),n.deleteVertexArray(T),n.isContextLost()||n.getExtension(`WEBGL_lose_context`)?.loseContext()}},[Z]),(0,r.useEffect)(()=>{Y.current?.()}),(0,i.jsx)(`div`,{ref:q,className:`relative w-full h-full overflow-hidden ${G}`,style:K,children:(0,i.jsx)(`canvas`,{ref:J,className:`absolute inset-0 block w-full h-full`,style:H&&H!==`none`?{mixBlendMode:H}:void 0,"aria-hidden":`true`})})};export{w as default};