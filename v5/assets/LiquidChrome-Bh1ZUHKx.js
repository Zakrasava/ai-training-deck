import{i as e,t}from"./react-sySUN5R7.js";import{O as n}from"./sculpture-dark-Cfb-XN1r.js";var r=e(t(),1),i=n(),a=24e5,o=4,s=1/120,c=`#version 300 es
const vec2 corners[3] = vec2[3](vec2(-1.0, -1.0), vec2(3.0, -1.0), vec2(-1.0, 3.0));
void main() {
  gl_Position = vec4(corners[gl_VertexID], 0.0, 1.0);
}`,l=`#version 300 es
precision highp float;
uniform sampler2D uState;
uniform vec2 uSize;
uniform vec4 uStroke;
uniform vec2 uImpulse;
out vec4 fragColor;

float segment(vec2 p, vec2 a, vec2 b) {
  vec2 ab = b - a;
  float t = clamp(dot(p - a, ab) / max(dot(ab, ab), 1e-4), 0.0, 1.0);
  return length(p - a - ab * t);
}

void main() {
  vec2 texel = 1.0 / uSize;
  vec2 uv = gl_FragCoord.xy * texel;
  vec2 state = texture(uState, uv).rg;
  vec2 around =
    texture(uState, uv - vec2(texel.x, 0.0)).rg +
    texture(uState, uv + vec2(texel.x, 0.0)).rg +
    texture(uState, uv - vec2(0.0, texel.y)).rg +
    texture(uState, uv + vec2(0.0, texel.y)).rg -
    4.0 * state;
  float next = state.r + (state.r - state.g) * 0.982 + 0.3 * around.r + 0.08 * (around.r - around.g);
  next *= 0.998;
  if (uImpulse.x != 0.0) {
    float d = segment(gl_FragCoord.xy, uStroke.xy, uStroke.zw) / uImpulse.y;
    next += uImpulse.x * exp(-d * d);
  }
  fragColor = vec4(next, state.r, 0.0, 1.0);
}`,u=`#version 300 es
precision highp float;
uniform sampler2D uState;
uniform vec2 uSize;
out vec4 fragColor;

void main() {
  vec2 texel = 1.0 / uSize;
  vec2 uv = gl_FragCoord.xy * texel;
  float left = texture(uState, uv - vec2(texel.x, 0.0)).r;
  float right = texture(uState, uv + vec2(texel.x, 0.0)).r;
  float down = texture(uState, uv - vec2(0.0, texel.y)).r;
  float up = texture(uState, uv + vec2(0.0, texel.y)).r;
  fragColor = vec4((right - left) * 0.5, (up - down) * 0.5, 0.0, 1.0);
}`,d=`#version 300 es
precision highp float;
uniform vec2 uResolution;
uniform float uUnit;
uniform float uTime;
uniform float uAmplitude;
uniform vec2 uFrequency;
uniform float uDetail;
uniform float uSharpness;
uniform float uDepth;
uniform float uPresence;
uniform vec3 uTint;
uniform vec2 uShift;
uniform float uRoughness;
uniform float uExposure;
uniform float uLight;
uniform sampler2D uSlope;
uniform vec2 uSlopeSize;
uniform float uRipple;
out vec4 fragColor;

vec2 slopeAt(vec2 uv) {
  vec2 st = uv * uSlopeSize - 0.5;
  vec2 i = floor(st);
  vec2 f = st - i;
  vec2 f2 = f * f;
  vec2 f3 = f2 * f;
  vec2 w0 = (-f3 + 3.0 * f2 - 3.0 * f + 1.0) / 6.0;
  vec2 w1 = (3.0 * f3 - 6.0 * f2 + 4.0) / 6.0;
  vec2 w2 = (-3.0 * f3 + 3.0 * f2 + 3.0 * f + 1.0) / 6.0;
  vec2 w3 = f3 / 6.0;
  vec2 g0 = w0 + w1;
  vec2 g1 = w2 + w3;
  vec2 h0 = (i - 0.5 + w1 / g0) / uSlopeSize;
  vec2 h1 = (i + 1.5 + w3 / g1) / uSlopeSize;
  vec2 a = texture(uSlope, vec2(h0.x, h0.y)).rg;
  vec2 b = texture(uSlope, vec2(h1.x, h0.y)).rg;
  vec2 c = texture(uSlope, vec2(h0.x, h1.y)).rg;
  vec2 d = texture(uSlope, vec2(h1.x, h1.y)).rg;
  return g0.y * (g0.x * a + g1.x * b) + g1.y * (g0.x * c + g1.x * d);
}

float lamp(vec2 p, vec2 center, vec2 size, float soft) {
  vec2 grown = size + soft;
  vec2 q = (p - center) / grown;
  q *= q;
  float d = sqrt(sqrt(dot(q, q)));
  float edge = soft / min(grown.x, grown.y);
  float shape = (1.0 - smoothstep(1.0 - edge, 1.0 + edge, d)) * (1.0 - 0.45 * d * d);
  return shape * size.x * size.y / (grown.x * grown.y);
}

vec3 studio(vec3 r, float blur) {
  vec2 p = r.xy / max(r.z + 1.0, 0.05);
  p += uShift * smoothstep(0.3, 1.0, length(p));
  float radius = length(p);
  float soft = 0.008 + blur;
  vec2 dir = p / max(radius, 1e-3);
  float key = lamp(p, vec2(-0.25, 0.42), vec2(0.3, 0.12), soft);
  float side = lamp(p, vec2(0.48, 0.12), vec2(0.06, 0.3), soft);
  float ground = lamp(p, vec2(-0.1, -0.55), vec2(0.45, 0.06), soft);
  float rise = smoothstep(-1.0, 1.0, dir.y);
  if (uLight > 0.5) {
    float edge = 0.008 + blur * 0.8;
    float lobe = smoothstep(0.15, 0.85, 0.5 + 0.5 * sin(atan(dir.y, dir.x) * 2.0 + 0.9));
    float tone = mix(2.4, 0.95, smoothstep(0.5 - edge, 1.0 + edge, radius));
    tone = mix(tone, 0.02, smoothstep(0.98 - edge, 1.12 + edge, radius));
    tone = mix(tone, mix(0.03, 0.3, lobe) * (0.8 + 0.4 * rise), smoothstep(1.15 - edge, 1.3 + edge, radius));
    float width = 0.035 + edge;
    tone += 2.4 * exp(-pow((radius - 1.4) / width, 2.0)) * min(1.0, 0.06 / width) * (0.6 + 0.4 * rise);
    return vec3(tone) * (1.0 - 0.5 * side) * (1.0 - 0.3 * ground) + 0.8 * key;
  }
  float width = 0.015 + soft * 2.0;
  float rim = exp(-abs(radius - 1.0) / width) * 0.031 / width * (0.8 + smoothstep(-0.5, 0.8, p.y));
  float band = 1.0 - 0.95 * smoothstep(1.04 - soft, 1.12 + soft, radius);
  float wall = smoothstep(1.25, 1.55, radius) * (0.6 + 0.4 * rise);
  float streak = smoothstep(0.2, 0.8, 0.5 + 0.5 * sin(atan(dir.y, dir.x) * 3.0 + 0.6));
  vec3 color = vec3(0.004, 0.004, 0.005) + 0.02 * smoothstep(-0.4, 0.6, p.y);
  color += vec3(1.0, 0.97, 0.94) * key * 4.0 + vec3(0.9, 0.95, 1.0) * side * 3.0 + ground * 1.2;
  color += vec3(1.0, 0.98, 0.95) * rim;
  color *= band;
  return color + vec3(mix(0.45, 1.8, streak)) * wall;
}

vec3 shade(vec2 slope, vec3 v, float blur, vec3 f0) {
  float steep = length(slope);
  slope *= 3.0 * tanh(steep / 3.0) / max(steep, 1e-6);
  vec3 n = normalize(vec3(-slope, 1.0));
  vec3 r = reflect(v, n);
  float facing = clamp(dot(n, -v), 0.0, 1.0);
  return studio(r, blur) * (f0 + (1.0 - f0) * pow(1.0 - facing, 5.0));
}

vec3 aces(vec3 x) {
  return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec2 uv = (2.0 * frag - uResolution) / uUnit;
  vec2 p = uv;
  vec2 rowX = vec2(1.0, 0.0);
  vec2 rowY = vec2(0.0, 1.0);
  float amplitude = uAmplitude * uPresence;
  for (float i = 1.0; i < 9.0; i++) {
    if (i > uDetail) break;
    float a = amplitude / i;
    float soften = exp(0.3 - 0.3 * i);
    float argX = i * uFrequency.x * p.y + uTime;
    p.x += a * cos(argX);
    rowX -= a * sin(argX) * i * uFrequency.x * soften * rowY;
    float argY = i * uFrequency.y * p.x + uTime;
    p.y += a * cos(argY);
    rowY -= a * sin(argY) * i * uFrequency.y * soften * rowX;
  }
  float phase = uTime - p.x - p.y;
  vec2 field = -(rowX + rowY);
  float density = max(length(field), 1e-3);
  vec2 across = field / density;
  float k = uSharpness;
  float sn = sin(phase);
  float cs = cos(phase);
  float th = tanh(k * sn);
  float bevel = (1.0 - th * th) / tanh(k);
  float fade = smoothstep(3.0, 9.0, 3.14159 * uUnit / density);
  float weight = uDepth * uPresence * fade;
  vec2 slope = k * cs * bevel * weight * across + slopeAt(frag / uResolution) * uRipple;
  vec2 sweep = -k * bevel * (sn + 2.0 * k * cs * cs * th) * weight * density * 2.0 / uUnit * across;
  vec2 stepX = dFdx(slope);
  vec2 stepY = dFdy(slope);
  vec2 crease = dot(stepX, stepX) > dot(stepY, stepY) ? stepX : stepY;
  if (dot(crease, crease) > dot(sweep, sweep)) sweep = crease;
  float bend = length(sweep);
  float alpha = smoothstep(0.0, 0.1, length(slope));
  vec3 f0 = mix(vec3(1.0), uTint, smoothstep(0.05, 0.6, length(slope))) * 0.92;
  vec3 v = normalize(vec3(uv * 0.08, -1.0));
  float blur = uRoughness * 0.35;
  vec3 light;
  if (bend < 0.01) {
    light = shade(slope, v, blur + bend * 0.5, f0);
  } else {
    light = vec3(0.0);
    for (float t = -0.375; t < 0.4; t += 0.25) {
      light += shade(slope + sweep * t, v, blur + bend * 0.15, f0);
    }
    light *= 0.25;
  }
  vec3 color = pow(aces(light * uExposure), vec3(1.0 / 2.2));
  float grain = fract(52.9829189 * fract(dot(frag, vec2(0.06711056, 0.00583715))));
  color += (grain - 0.5) / 255.0;
  fragColor = vec4(clamp(color, 0.0, 1.0) * alpha, alpha);
}`,f=(e,t,n)=>Math.min(n,Math.max(t,e)),p=e=>{if(Array.isArray(e))return[0,1,2].map(t=>f(Number(e[t])||0,0,1));let t=String(e||``).trim(),n=/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(t);if(n){let e=n[1].length===3?n[1].replace(/./g,e=>e+e):n[1];return[0,2,4].map(t=>parseInt(e.slice(t,t+2),16)/255)}let r=/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i.exec(t);return r?[r[1],r[2],r[3]].map(e=>f(parseFloat(e)/255,0,1)):[1,1,1]},m=(e,t,n)=>{let r=e.createShader(t);return r?(e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(console.error(e.getShaderInfoLog(r)),e.deleteShader(r),null)):null},h=(e,t)=>{let n=m(e,e.VERTEX_SHADER,c),r=m(e,e.FRAGMENT_SHADER,t),i=n&&r?e.createProgram():null;if(!n||!r||!i)return n&&e.deleteShader(n),r&&e.deleteShader(r),null;if(e.attachShader(i,n),e.attachShader(i,r),e.linkProgram(i),e.deleteShader(n),e.deleteShader(r),!e.getProgramParameter(i,e.LINK_STATUS))return console.error(e.getProgramInfoLog(i)),e.deleteProgram(i),null;let a={},o=e.getProgramParameter(i,e.ACTIVE_UNIFORMS);for(let t=0;t<o;t++){let n=e.getActiveUniform(i,t);n&&(a[n.name]=e.getUniformLocation(i,n.name))}return{program:i,uniforms:a}},g=({color:e=`#ffffff`,speed:t=.2,amplitude:n=.3,frequencyX:c=3,frequencyY:m=3,detail:g=4,thickness:_=1,depth:v=1,roughness:y=.3,exposure:b=1,interactive:x=!0,rippleStrength:S=1,rippleSize:C=1,tilt:w=1,intro:T=!0,lightMode:E=!1,maxDevicePixelRatio:D=2,className:O=``,style:k})=>{let A=(0,r.useRef)(null),j=(0,r.useRef)(null),M=(0,r.useRef)(null),[N,ee]=(0,r.useState)(0),P={tint:p(e).map(e=>e**2.2),speed:Math.max(0,t),amplitude:f(n,0,2),frequency:[Math.max(.1,c),Math.max(.1,m)],detail:f(Math.round(g),1,8),thickness:f(_,.25,4),depth:Math.max(0,v),roughness:f(y,0,1),exposure:Math.max(0,b),interactive:x,rippleStrength:Math.max(0,S),rippleSize:f(C,.2,4),tilt:Math.max(0,w),intro:T,light:E,maxRatio:f(D,.5,3)},F=(0,r.useRef)(P);return F.current=P,(0,r.useEffect)(()=>{M.current?.()}),(0,r.useEffect)(()=>{let e=A.current,t=j.current;if(!e||!t)return;let n=t.getContext(`webgl2`,{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1,powerPreference:`high-performance`}),r=n?h(n,d):null;if(!n||!r)return;let i=!!n.getExtension(`EXT_color_buffer_float`),c=i?h(n,l):null,p=i?h(n,u):null,m=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,g=n.createVertexArray(),_={width:1,height:1},v=[],y=null,b=0,x=1,S={x:0,y:0,inside:!1,ready:!1,nx:0,ny:0},C={yaw:0,pitch:0,vyaw:0,vpitch:0},w=[],T=Math.random()*40,E=F.current.intro&&!m&&N===0?0:1,D=0,O=0,k=0,P=0,I=!0,L=document.visibilityState!==`hidden`,R=!1,z=(e,t)=>{let r=n.createTexture();n.bindTexture(n.TEXTURE_2D,r),n.texImage2D(n.TEXTURE_2D,0,n.RG16F,e,t,0,n.RG,n.HALF_FLOAT,null),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MAG_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE);let i=n.createFramebuffer();return n.bindFramebuffer(n.FRAMEBUFFER,i),n.framebufferTexture2D(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,r,0),n.clearColor(0,0,0,1),n.clear(n.COLOR_BUFFER_BIT),n.bindFramebuffer(n.FRAMEBUFFER,null),{texture:r,framebuffer:i}},B=e=>{e&&(n.deleteTexture(e.texture),n.deleteFramebuffer(e.framebuffer))},V=()=>{let n=F.current,r=e.getBoundingClientRect(),s=Math.max(1,r.width),l=Math.max(1,r.height),u=Math.min(window.devicePixelRatio||1,n.maxRatio,Math.sqrt(a/(s*l))),d=Math.max(1,Math.round(s*u)),m=Math.max(1,Math.round(l*u));if((t.width!==d||t.height!==m)&&(t.width=d,t.height=m),x=Math.min(d,m),!i||!c||!p)return;let h=f(Math.round(s/o),16,512),g=f(Math.round(l/o),16,512);h===_.width&&g===_.height&&v.length||(v.forEach(B),v.length=0,B(y),Object.assign(_,{width:h,height:g}),v.push(z(h,g),z(h,g)),y=z(h,g))},te=e=>{if(c&&p&&y){n.useProgram(c.program),n.viewport(0,0,_.width,_.height),n.uniform2f(c.uniforms.uSize,_.width,_.height),n.activeTexture(n.TEXTURE0),n.uniform1i(c.uniforms.uState,0);for(let t=0;t<e;t++){let e=t===0?w.shift():null;e?(n.uniform4f(c.uniforms.uStroke,e.ax,e.ay,e.bx,e.by),n.uniform2f(c.uniforms.uImpulse,e.strength,e.radius)):n.uniform2f(c.uniforms.uImpulse,0,1);let r=v[b],i=v[1-b];n.bindTexture(n.TEXTURE_2D,r.texture),n.bindFramebuffer(n.FRAMEBUFFER,i.framebuffer),n.drawArrays(n.TRIANGLES,0,3),b=1-b}n.useProgram(p.program),n.uniform2f(p.uniforms.uSize,_.width,_.height),n.uniform1i(p.uniforms.uState,0),n.bindTexture(n.TEXTURE_2D,v[b].texture),n.bindFramebuffer(n.FRAMEBUFFER,y.framebuffer),n.drawArrays(n.TRIANGLES,0,3)}},ne=e=>{n.bindFramebuffer(n.FRAMEBUFFER,null),n.viewport(0,0,t.width,t.height);let i=r.uniforms;n.useProgram(r.program),n.uniform2f(i.uResolution,t.width,t.height),n.uniform1f(i.uUnit,x),n.uniform1f(i.uTime,T),n.uniform1f(i.uAmplitude,e.amplitude),n.uniform2f(i.uFrequency,e.frequency[0],e.frequency[1]),n.uniform1f(i.uDepth,e.depth),n.uniform1f(i.uDetail,e.detail),n.uniform1f(i.uSharpness,5/(3*e.thickness)),n.uniform1f(i.uPresence,1-(1-E)**3),n.uniform3fv(i.uTint,e.tint),n.uniform2f(i.uShift,C.yaw,C.pitch),n.uniform1f(i.uRoughness,e.roughness),n.uniform1f(i.uExposure,e.exposure),n.uniform1f(i.uLight,+!!e.light),n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,y?y.texture:null),n.uniform1i(i.uSlope,0),n.uniform2f(i.uSlopeSize,_.width,_.height),n.uniform1f(i.uRipple,y?e.rippleStrength*2.2:0),n.drawArrays(n.TRIANGLES,0,3)},H=e=>{if(k=0,R)return;let t=F.current,r=f((e-P)/1e3||0,0,.05);P=Math.max(P,e),T+=r*t.speed*(m?.25:1),E=Math.min(1,E+r/1.8);let i=t.interactive&&S.inside,a=m?0:t.tilt,o=(i?S.nx*.35:.22*Math.sin(T*1.3))*a,c=(i?-S.ny*.28:.16*Math.sin(T*.9+1.7))*a,l=12*.95;if(C.vyaw+=((o-C.yaw)*36-C.vyaw*l)*r,C.vpitch+=((c-C.pitch)*36-C.vpitch*l)*r,C.yaw+=C.vyaw*r,C.pitch+=C.vpitch*r,n.bindVertexArray(g),y){O+=r;let e=Math.min(4,Math.floor(O/s));O-=e*s,e>0&&(te(e),D=Math.max(0,D*.982**e))}ne(t);let u=Math.abs(C.vyaw)+Math.abs(C.vpitch)>1e-4||Math.abs(o-C.yaw)+Math.abs(c-C.pitch)>1e-4;(t.speed>0||E<1||u||D>.002||w.length>0)&&I&&L&&(k=requestAnimationFrame(H))},U=()=>{!k&&!R&&I&&L&&(P=performance.now(),k=requestAnimationFrame(H))};M.current=()=>{V(),U()};let W=(t,n)=>{let r=e.getBoundingClientRect();return{x:(t-r.left)/r.width*_.width,y:(1-(n-r.top)/r.height)*_.height,nx:(t-r.left)/r.width*2-1,ny:(n-r.top)/r.height*2-1,inside:t>=r.left&&t<=r.right&&n>=r.top&&n<=r.bottom}},G=(e,t)=>{y&&t.interactive&&!m&&(w.push(e),w.length>6&&w.shift(),D=1)},K=e=>{let t=F.current,n=W(e.clientX,e.clientY);if(S.nx=f(n.nx,-1,1),S.ny=f(n.ny,-1,1),S.inside=n.inside,n.inside&&S.ready){let e=Math.hypot(n.x-S.x,n.y-S.y);e>.25&&G({ax:S.x,ay:S.y,bx:n.x,by:n.y,strength:-Math.min(.45,.04+e*.045)*t.rippleSize,radius:4*t.rippleSize},t)}S.x=n.x,S.y=n.y,S.ready=n.inside,U()},q=e=>{let t=F.current,n=W(e.clientX,e.clientY);n.inside&&(G({ax:n.x,ay:n.y,bx:n.x,by:n.y,strength:-1.6*t.rippleSize,radius:6*t.rippleSize},t),U())},J=()=>{S.inside=!1,S.ready=!1,U()},Y=e=>{e.pointerType!==`mouse`&&J()};window.addEventListener(`pointermove`,K,{passive:!0}),window.addEventListener(`pointerdown`,q,{passive:!0}),window.addEventListener(`pointerup`,Y,{passive:!0}),window.addEventListener(`pointercancel`,Y,{passive:!0}),document.documentElement.addEventListener(`pointerleave`,J);let X=e=>{e.preventDefault(),R=!0,cancelAnimationFrame(k),k=0},Z=()=>ee(e=>e+1);t.addEventListener(`webglcontextlost`,X),t.addEventListener(`webglcontextrestored`,Z);let Q=new ResizeObserver(()=>{V(),U()});Q.observe(e);let $=new IntersectionObserver(e=>{I=e.some(e=>e.isIntersecting),U()});$.observe(e);let re=()=>{L=document.visibilityState!==`hidden`,U()};return document.addEventListener(`visibilitychange`,re),V(),U(),()=>{cancelAnimationFrame(k),M.current=null,Q.disconnect(),$.disconnect(),window.removeEventListener(`pointermove`,K),window.removeEventListener(`pointerdown`,q),window.removeEventListener(`pointerup`,Y),window.removeEventListener(`pointercancel`,Y),document.documentElement.removeEventListener(`pointerleave`,J),document.removeEventListener(`visibilitychange`,re),t.removeEventListener(`webglcontextlost`,X),t.removeEventListener(`webglcontextrestored`,Z),n.isContextLost()||(v.forEach(B),B(y),n.deleteVertexArray(g),n.deleteProgram(r.program),c&&n.deleteProgram(c.program),p&&n.deleteProgram(p.program))}},[N]),(0,i.jsx)(`div`,{ref:A,className:`relative h-full w-full overflow-hidden ${O}`.trim(),style:k,children:(0,i.jsx)(`canvas`,{ref:j,className:`absolute inset-0 block h-full w-full`,"aria-hidden":`true`})})};export{g as default};