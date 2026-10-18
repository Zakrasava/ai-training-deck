import{i as e,t}from"./react-sySUN5R7.js";import{k as n}from"./sculpture-dark-CKiqtzhU.js";import{a as r,i,n as a,r as o,t as s}from"./Triangle-CxvaD6kv.js";import{t as c}from"./RenderTarget-yTJj73BA.js";var l=e(t(),1),u=n(),d={silk:{pattern:`dot`,wave:`silk`,spacing:9,markSize:.95,depth:.95,light:0,shine:.8,contrast:1.2,speed:.35,scale:1,direction:20},ocean:{pattern:`dot`,wave:`swell`,spacing:10,markSize:.9,depth:.42,light:0,shine:1,contrast:1.2,speed:.5,scale:1,direction:100},pond:{pattern:`dot`,wave:`ripple`,spacing:10,markSize:.9,depth:.55,light:0,shine:1.2,contrast:1.2,speed:.5,scale:1,direction:35},lines:{pattern:`line`,wave:`silk`,spacing:12,markSize:.42,depth:.9,light:0,shine:.6,contrast:1.2,speed:.3,scale:1,direction:20},terminal:{pattern:`glyph`,wave:`ripple`,spacing:13,markSize:.95,depth:.75,light:0,shine:.9,contrast:1.4,speed:.3,scale:1.1,direction:200},mesh:{pattern:`plus`,wave:`silk`,spacing:14,markSize:.8,depth:.95,light:0,shine:1,contrast:1.45,speed:.4,scale:1.1,direction:325}},ee={dot:0,square:1,plus:2,line:3,glyph:4},te={silk:0,swell:1,ripple:2},ne={none:0,edges:1,center:2,bottom:3,top:4},f=`.:-=+*#%@`,p=`ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`,m=128,re=520,h=8,g=60,_=45e5,ie=2,v=(e,t,n)=>Math.min(Math.max(e,t),n),y=e=>.2126*e[0]+.7152*e[1]+.0722*e[2],b=(e,t)=>{try{let n=document.createElement(`canvas`).getContext(`2d`);if(!n)return t;n.fillStyle=`#000000`,n.fillStyle=e;let r=n.fillStyle;if(r.startsWith(`#`)){let e=parseInt(r.slice(1),16);return[(e>>16&255)/255,(e>>8&255)/255,(e&255)/255,1]}let i=r.match(/[\d.]+/g);return!i||i.length<3?t:[Number(i[0])/255,Number(i[1])/255,Number(i[2])/255,i[3]?Number(i[3]):1]}catch{return t}},x=e=>{let t=Array.from(e&&e.length?e:f),n=Math.ceil(Math.sqrt(t.length)),r=Math.ceil(t.length/n),i=document.createElement(`canvas`);i.width=n*m,i.height=r*m;let a=i.getContext(`2d`);return a?(a.fillStyle=`#ffffff`,a.textAlign=`center`,a.textBaseline=`middle`,a.font=`500 ${Math.round(m*.86)}px ${p}`,t.forEach((e,t)=>{let r=t%n*m+m/2,i=Math.floor(t/n)*m+m/2;a.fillText(e,r,i)}),{canvas:i,columns:n,lines:r,count:t.length}):null},S=`#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`,C=`#version 300 es
precision highp float;
precision highp int;
uniform vec2 uSize;
uniform float uDpr;
uniform vec2 uOrigin;
uniform vec2 uPitch;
uniform int uWave;
uniform float uTime;
uniform float uUnit;
uniform vec2 uHeading;
uniform float uAmp;
uniform float uDepth;
uniform vec3 uLight;
uniform float uShine;
uniform float uContrast;
uniform float uInk;
uniform float uOpacity;
uniform int uFade;
uniform float uFadeSize;
uniform float uAppear;
uniform sampler2D tRipple;
uniform float uRipple;
out vec4 fragColor;

const float FOLDS = 5.5;

uvec3 scramble(uvec3 v) {
  v = v * 1664525u + 1013904223u;
  v.x += v.y * v.z;
  v.y += v.z * v.x;
  v.z += v.x * v.y;
  v ^= v >> 16u;
  v.x += v.y * v.z;
  v.y += v.z * v.x;
  v.z += v.x * v.y;
  return v;
}

vec3 lattice(vec3 corner) {
  uvec3 h = scramble(uvec3(ivec3(corner) + 4096));
  return vec3(h & 65535u) / 32767.5 - 1.0;
}

float gradientNoise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = p - i;
  vec3 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  float n000 = dot(lattice(i), f);
  float n100 = dot(lattice(i + vec3(1.0, 0.0, 0.0)), f - vec3(1.0, 0.0, 0.0));
  float n010 = dot(lattice(i + vec3(0.0, 1.0, 0.0)), f - vec3(0.0, 1.0, 0.0));
  float n110 = dot(lattice(i + vec3(1.0, 1.0, 0.0)), f - vec3(1.0, 1.0, 0.0));
  float n001 = dot(lattice(i + vec3(0.0, 0.0, 1.0)), f - vec3(0.0, 0.0, 1.0));
  float n101 = dot(lattice(i + vec3(1.0, 0.0, 1.0)), f - vec3(1.0, 0.0, 1.0));
  float n011 = dot(lattice(i + vec3(0.0, 1.0, 1.0)), f - vec3(0.0, 1.0, 1.0));
  float n111 = dot(lattice(i + vec3(1.0, 1.0, 1.0)), f - vec3(1.0, 1.0, 1.0));
  return mix(
    mix(mix(n000, n100, u.x), mix(n010, n110, u.x), u.y),
    mix(mix(n001, n101, u.x), mix(n011, n111, u.x), u.y),
    u.z
  );
}

vec2 turn(vec2 v, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return vec2(c * v.x - s * v.y, s * v.x + c * v.y);
}

float surface(vec2 p, float t) {
  if (uWave == 0) {
    vec2 side = vec2(-uHeading.y, uHeading.x);
    float u = dot(p, uHeading);
    float v = dot(p, side);
    float bend = gradientNoise(vec3(v * 0.85, u * 0.3, t * 0.05)) * 1.7 + 0.4 * sin(v * 1.6 + t * 0.2);
    float phase = u * FOLDS + bend - t * 0.45;
    float swell = 0.6 + 0.4 * gradientNoise(vec3(u * 0.55 + 3.0, v * 0.45, t * 0.04));
    float fold = sin(phase) + 0.32 * sin(2.0 * phase + 1.3);
    float ripple = 0.16 * sin(u * FOLDS * 2.5 + bend * 1.9 - t * 0.9 + 2.1);
    return (fold + ripple) * swell;
  }
  if (uWave == 1) {
    float bend = gradientNoise(vec3(p * 0.6, t * 0.05)) * 0.6;
    float phase = dot(p, uHeading) * 15.0 + bend * 2.2 - t * 1.4;
    float swell = sin(phase) + 0.3 * sin(2.0 * phase - 0.8);
    float roll = 0.75 + 0.25 * gradientNoise(vec3(p * 0.9 + 11.0, t * 0.05));
    return 0.8 * swell * roll;
  }
  float r = length(p + uHeading * 1.2);
  float bend = gradientNoise(vec3(p * 1.2, t * 0.05)) * 0.1;
  return sin((r + bend) * 9.0 - t * 1.8) * (0.45 + 0.55 * exp(-(r - 0.6) * 0.8));
}

float heightAt(vec2 css) {
  float h = surface((css - 0.5 * uSize) / uUnit, uTime) * uAmp;
  if (uRipple > 0.0) h += texture(tRipple, css / uSize).r * uRipple;
  return h;
}

void main() {
  vec2 cell = floor(gl_FragCoord.xy);
  vec2 center = uOrigin + (cell + 0.5) * uPitch;
  vec2 css = center / uDpr;
  vec2 uv = css / uSize;
  float e = max(uPitch.y / uDpr, 4.0);
  float h = heightAt(css);
  float hx = (heightAt(css + vec2(e, 0.0)) - heightAt(css - vec2(e, 0.0))) / (2.0 * e);
  float hy = (heightAt(css + vec2(0.0, e)) - heightAt(css - vec2(0.0, e))) / (2.0 * e);
  vec2 grad = vec2(hx, hy) * uUnit * uDepth * 0.4;
  vec3 n = normalize(vec3(-grad, 1.0));

  float diffuse = clamp(dot(n, uLight), 0.0, 1.0);
  vec3 halfway = normalize(uLight + vec3(0.0, 0.0, 1.0));
  float spec = pow(clamp(dot(n, halfway), 0.0, 1.0), 160.0) * uShine * 1.15;
  float hollow = 0.7 + 0.3 * clamp(h * 0.5 + 0.5, 0.0, 1.0);
  float tone = clamp(diffuse * hollow * 0.78 + spec, 0.0, 1.0);
  tone = clamp((tone - 0.42) * uContrast + 0.42, 0.0, 1.0);

  float level = uInk > 0.5 ? pow(clamp(1.0 - tone / 0.46, 0.0, 1.0), 2.4) * 0.72 : pow(tone, 2.2);
  float emphasis = uInk > 0.5 ? smoothstep(0.55, 0.95, level) : clamp(spec * 1.6, 0.0, 1.0);

  float fade = 1.0;
  vec2 c = uv * 2.0 - 1.0;
  if (uFade == 1) {
    fade = 1.0 - smoothstep(1.0 - uFadeSize, 1.18, length(c));
  } else if (uFade == 2) {
    fade = mix(0.05, 1.0, smoothstep(0.08, 0.08 + uFadeSize, length(c * vec2(1.0, 1.35))));
  } else if (uFade == 3) {
    fade = smoothstep(0.0, uFadeSize, uv.y);
  } else if (uFade == 4) {
    fade = smoothstep(0.0, uFadeSize, 1.0 - uv.y);
  }

  float reach = length(css - 0.5 * uSize) / max(0.5 * length(uSize), 1.0);
  float appear = smoothstep(reach - 0.05, reach + 0.3, uAppear * 1.35);

  float alpha = uOpacity * fade * appear * (0.22 + 0.78 * level);
  float lift = clamp(h * uDepth * 0.42, -0.48, 0.48);
  fragColor = vec4(level, alpha, emphasis, lift + 0.5);
}
`,w=`#version 300 es
precision highp float;
uniform sampler2D tState;
uniform vec2 uTexel;
uniform vec2 uSize;
uniform vec2 uFrom;
uniform vec2 uTo;
uniform float uRadius;
uniform float uImpulse;
uniform float uDamping;
out vec4 fragColor;

void main() {
  vec2 uv = gl_FragCoord.xy * uTexel;
  vec2 state = texture(tState, uv).rg;
  float left = texture(tState, uv - vec2(uTexel.x, 0.0)).r;
  float right = texture(tState, uv + vec2(uTexel.x, 0.0)).r;
  float below = texture(tState, uv - vec2(0.0, uTexel.y)).r;
  float above = texture(tState, uv + vec2(0.0, uTexel.y)).r;
  float next = ((left + right + below + above) * 0.5 - state.g) * uDamping;
  vec2 p = uv * uSize;
  vec2 segment = uTo - uFrom;
  float along = clamp(dot(p - uFrom, segment) / max(dot(segment, segment), 1e-4), 0.0, 1.0);
  float d = length(p - uFrom - segment * along) / uRadius;
  next -= uImpulse * exp(-d * d * 2.0);
  fragColor = vec4(next, state.r, 0.0, 1.0);
}
`,T=`#version 300 es
precision highp float;
precision highp int;
uniform sampler2D tField;
uniform sampler2D tAtlas;
uniform vec2 uOrigin;
uniform vec2 uPitch;
uniform vec2 uGrid;
uniform int uPattern;
uniform float uMarkSize;
uniform float uStroke;
uniform vec3 uColor;
uniform vec3 uAccent;
uniform vec4 uBackground;
uniform vec3 uAtlas;
out vec4 fragColor;

float box(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

float coverage(vec2 local, float level) {
  float span = uPitch.y * uMarkSize;
  float area = max(sqrt(level), 0.14);
  if (uPattern == 0) {
    return clamp(0.5 - (length(local) - 0.5 * span * area), 0.0, 1.0);
  }
  if (uPattern == 1) {
    float extent = 0.5 * span * area;
    return clamp(0.5 - box(local, vec2(extent), extent * 0.3), 0.0, 1.0);
  }
  if (uPattern == 2) {
    float arm = 0.5 * span * mix(0.3, 1.0, level);
    float width = 0.5 * uStroke;
    return clamp(0.5 - min(box(local, vec2(arm, width), width), box(local, vec2(width, arm), width)), 0.0, 1.0);
  }
  if (uAtlas.z < 1.0) return 0.0;
  vec2 g = local / span + 0.5;
  if (g.x < 0.0 || g.y < 0.0 || g.x > 1.0 || g.y > 1.0) return 0.0;
  float index = min(floor(level * uAtlas.z), uAtlas.z - 1.0);
  vec2 tile = vec2(mod(index, uAtlas.x), floor(index / uAtlas.x));
  vec2 atlasUv = (tile + vec2(g.x, 1.0 - g.y)) / uAtlas.xy;
  vec2 texel = 1.0 / (span * uAtlas.xy);
  return textureGrad(tAtlas, atlasUv, vec2(texel.x, 0.0), vec2(0.0, texel.y)).a;
}

vec4 lineInk(vec2 rel) {
  float fx = rel.x / uPitch.x - 0.5;
  float c0 = clamp(floor(fx), 0.0, uGrid.x - 1.0);
  float c1 = min(c0 + 1.0, uGrid.x - 1.0);
  float t = clamp(fx - c0, 0.0, 1.0);
  float row = floor(rel.y / uPitch.y);
  vec4 ink = vec4(0.0);
  for (int k = -1; k <= 1; k++) {
    float cy = row + float(k);
    if (cy < 0.0 || cy >= uGrid.y) continue;
    vec4 a = texelFetch(tField, ivec2(int(c0), int(cy)), 0);
    vec4 b = texelFetch(tField, ivec2(int(c1), int(cy)), 0);
    vec4 f = mix(a, b, t);
    if (f.g < 0.002) continue;
    float y = (cy + 0.5 + f.a - 0.5) * uPitch.y;
    float slope = (b.a - a.a) * uPitch.y / uPitch.x;
    float thickness = max(uStroke, uPitch.y * uMarkSize * f.r);
    float d = abs(rel.y - y) / sqrt(1.0 + slope * slope) - 0.5 * thickness;
    float alpha = clamp(0.5 - d, 0.0, 1.0) * f.g;
    if (alpha > ink.a) ink = vec4(mix(uColor, uAccent, f.b) * alpha, alpha);
  }
  return ink;
}

void main() {
  vec2 rel = gl_FragCoord.xy - uOrigin;
  vec4 background = vec4(uBackground.rgb * uBackground.a, uBackground.a);
  vec4 ink = vec4(0.0);
  if (uPattern == 3) {
    ink = lineInk(rel);
  } else {
    float cx = floor(rel.x / uPitch.x);
    float row = floor(rel.y / uPitch.y);
    if (cx >= 0.0 && cx < uGrid.x) {
      for (int k = -1; k <= 1; k++) {
        float cy = row + float(k);
        if (cy < 0.0 || cy >= uGrid.y) continue;
        vec4 f = texelFetch(tField, ivec2(int(cx), int(cy)), 0);
        if (f.g < 0.002) continue;
        vec2 center = (vec2(cx, cy) + 0.5) * uPitch + vec2(0.0, (f.a - 0.5) * uPitch.y);
        float alpha = coverage(rel - center, f.r) * f.g;
        if (alpha > ink.a) ink = vec4(mix(uColor, uAccent, f.b) * alpha, alpha);
      }
    }
  }
  fragColor = ink + background * (1.0 - ink.a);
}
`,E=({preset:e=`silk`,pattern:t,wave:n,spacing:p,markSize:m,depth:E,light:D,shine:O,contrast:k,speed:A,scale:j,direction:M,color:N=`#ffffff`,backgroundColor:P=`#000000`,opacity:F=1,fade:I=`edges`,fadeSize:L=.5,characters:R=f,interactive:z=!0,cursorSize:B=50,cursorStrength:V=.6,intro:H=!0,paused:U=!1,className:W=``,style:G})=>{let K=(0,l.useRef)(null),ae=(0,l.useRef)(null),q=(0,l.useRef)(null),J=d[e]||d.silk,Y=(e,t)=>e??J[t],X=(0,l.useMemo)(()=>({color:b(N,[1,1,1,1]),background:b(P,[0,0,0,1])}),[N,P]);return(0,l.useEffect)(()=>{ae.current={...X,pattern:Y(t,`pattern`),wave:Y(n,`wave`),spacing:Y(p,`spacing`),markSize:Y(m,`markSize`),depth:Y(E,`depth`),light:Y(D,`light`),shine:Y(O,`shine`),contrast:Y(k,`contrast`),speed:Y(A,`speed`),scale:Y(j,`scale`),direction:Y(M,`direction`),opacity:F,fade:I,fadeSize:L,characters:R,interactive:z,cursorSize:B,cursorStrength:V,intro:H,paused:U},q.current?.()}),(0,l.useEffect)(()=>{let e=K.current;if(!e)return;let t=new i({alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1}),n=t.gl;if(!t.isWebgl2){n.getExtension(`WEBGL_lose_context`)?.loseContext();return}n.clearColor(0,0,0,0);let l=n.canvas;l.style.display=`block`,l.style.width=`100%`,l.style.height=`100%`,l.setAttribute(`aria-hidden`,`true`),e.appendChild(l);let u=new s(n),d=new a(n),f=!!n.getExtension(`EXT_color_buffer_float`),p=e=>{n.deleteFramebuffer(e.buffer),n.deleteTexture(e.texture.texture)},m=(e,t)=>new c(n,{width:e,height:t,depth:!1,minFilter:n.NEAREST,magFilter:n.NEAREST}),b=(e,t)=>new c(n,{width:e,height:t,depth:!1,type:n.HALF_FLOAT,format:n.RGBA,internalFormat:n.RGBA16F,minFilter:n.LINEAR,magFilter:n.LINEAR}),E=m(1,1),D=null,O=new a(n,{generateMipmaps:!0,minFilter:n.LINEAR_MIPMAP_LINEAR,magFilter:n.LINEAR,flipY:!1}),k={uSize:{value:[1,1]},uDpr:{value:1},uOrigin:{value:[0,0]},uPitch:{value:[1,1]},uWave:{value:0},uTime:{value:0},uUnit:{value:re},uHeading:{value:[1,0]},uAmp:{value:0},uDepth:{value:.5},uLight:{value:[0,0,1]},uShine:{value:.8},uContrast:{value:1},uInk:{value:0},uOpacity:{value:1},uFade:{value:0},uFadeSize:{value:.5},uAppear:{value:0},tRipple:{value:d},uRipple:{value:0}},A=new o(n,{geometry:u,program:new r(n,{vertex:S,fragment:C,uniforms:k,depthTest:!1,depthWrite:!1})}),j={tState:{value:d},uTexel:{value:[1,1]},uSize:{value:[1,1]},uFrom:{value:[0,0]},uTo:{value:[0,0]},uRadius:{value:40},uImpulse:{value:0},uDamping:{value:.975}},M=new o(n,{geometry:u,program:new r(n,{vertex:S,fragment:w,uniforms:j,depthTest:!1,depthWrite:!1})}),N={tField:{value:E.texture},tAtlas:{value:O},uOrigin:{value:[0,0]},uPitch:{value:[1,1]},uGrid:{value:[1,1]},uPattern:{value:0},uMarkSize:{value:.9},uStroke:{value:2},uColor:{value:[1,1,1]},uAccent:{value:[1,1,1]},uBackground:{value:[0,0,0,1]},uAtlas:{value:[1,1,0]}},P=new o(n,{geometry:u,program:new r(n,{vertex:S,fragment:T,uniforms:N,depthTest:!1,depthWrite:!1})}),F=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches??!1,I=1,L=1,R=0,z=performance.now(),B=0,V=0,H=!0,U=!0,W=!0,G=0,J=!1,Y=0,X=``,Z={x:0,y:0,inside:!1,placed:!1,lastX:0,lastY:0,burst:0},oe=()=>{if(!f)return;let e=v(Math.ceil(I/h),4,512),t=v(Math.ceil(L/h),4,512);D&&D.width===e&&D.height===t||(D&&(p(D.read),p(D.write)),D={width:e,height:t,read:b(e,t),write:b(e,t)},J=!1)},se=()=>{D&&([D.read,D.write].forEach(e=>{t.bindFramebuffer(e),n.viewport(0,0,e.width,e.height),n.clear(n.COLOR_BUFFER_BIT)}),t.bindFramebuffer())},ce=e=>{if(e.characters===X)return;X=e.characters;let t=x(e.characters);t&&(O.image=t.canvas,N.uAtlas.value=[t.columns,t.lines,t.count])},le=()=>{I=Math.max(1,e.clientWidth),L=Math.max(1,e.clientHeight),t.dpr=Math.min(window.devicePixelRatio||1,2,Math.sqrt(_/(I*L))),t.setSize(I,L),oe(),W=!0,Q()},ue=(e,n,r)=>{Y=Math.min(Y+r*g,4);let i=v(n.cursorStrength,0,1),a=Math.hypot(Z.x-Z.lastX,Z.y-Z.lastY),o=(Z.inside?Math.min(a/14,1)*.35*i:0)+Z.burst*i;for(Z.burst=0,j.uTexel.value=[1/e.width,1/e.height],j.uSize.value=[I,L],j.uFrom.value=[Z.lastX,L-Z.lastY],j.uTo.value=[Z.x,L-Z.y],j.uRadius.value=v(n.cursorSize,8,400);Y>=1;){--Y,j.tState.value=e.read.texture,j.uImpulse.value=o,t.render({scene:M,target:e.write,clear:!1});let n=e.read;e.read=e.write,e.write=n,o=0}Z.lastX=Z.x,Z.lastY=Z.y},de=e=>{if(R=0,!U)return;let r=ae.current,i=Math.min(.05,Math.max(1/240,(e-z)/1e3));if(z=e,!r)return;let a=!r.paused&&!F&&r.speed!==0;a&&(B+=i*r.speed),V=r.intro&&!F?Math.min(1,V+i/ie):1;let o=1-(1-v(V/.75,0,1))**3,s=v((V-.1)/.9,0,1),c=s*s*(3-2*s),l=r.interactive&&!F&&!!D&&r.cursorStrength>0;l&&Z.inside&&!Z.placed&&(Z.lastX=Z.x,Z.lastY=Z.y,Z.placed=!0),l&&(Z.inside||Z.burst>0)&&(G=e+5e3);let u=l&&e<G;u&&D?(ue(D,r,i),J=!0):J&&(se(),J=!1);let f=ee[r.pattern]??0;f===4&&ce(r);let h=n.canvas.width,g=n.canvas.height,_=h/I,b=Math.max(4,Math.round(v(r.spacing,4,120)*_)),x=f===3?Math.max(2,Math.round(b/4)):b,S=Math.min(4096,Math.ceil(h/x)+1),C=Math.min(4096,Math.ceil(g/b)+2),w=[Math.floor((h-S*x)/2),Math.floor((g-C*b)/2)];(E.width!==S||E.height!==C)&&(p(E),E=m(S,C),N.tField.value=E.texture);let T=r.direction*Math.PI/180,O=(r.direction+180+v(r.light,-90,90))*Math.PI/180,j=r.background,M=j[3]>.02?y(r.color)<y(j):y(r.color)<.5;k.uSize.value=[I,L],k.uDpr.value=_,k.uOrigin.value=w,k.uPitch.value=[x,b],k.uWave.value=te[r.wave]??0,k.uTime.value=B,k.uUnit.value=re*v(r.scale,.2,5),k.uHeading.value=[Math.cos(T),Math.sin(T)],k.uAmp.value=c,k.uDepth.value=v(r.depth,0,1.5),k.uLight.value=[Math.cos(O)*.78,Math.sin(O)*.78,.62],k.uShine.value=v(r.shine,0,2),k.uContrast.value=v(r.contrast,.3,3),k.uInk.value=+!!M,k.uOpacity.value=v(r.opacity,0,1),k.uFade.value=ne[r.fade]??0,k.uFadeSize.value=v(r.fadeSize,.05,1),k.uAppear.value=o,k.tRipple.value=D&&J?D.read.texture:d,k.uRipple.value=J?.32:0,t.render({scene:A,target:E}),N.uOrigin.value=w,N.uPitch.value=[x,b],N.uGrid.value=[S,C],N.uPattern.value=f,N.uMarkSize.value=v(r.markSize,.05,1),N.uStroke.value=f===3?.9*_:Math.max(1.1*_,b*.08);let K=+!M,q=M?.35:.55;N.uColor.value=r.color.slice(0,3),N.uAccent.value=r.color.slice(0,3).map(e=>e+(K-e)*q),N.uBackground.value=j,t.render({scene:P}),W=!1,H&&(a||V<1||u||W)&&(R=requestAnimationFrame(de))},Q=()=>{!R&&H&&U&&(z=performance.now(),R=requestAnimationFrame(de))},fe=t=>{let n=e.getBoundingClientRect(),r=t.clientX-n.left,i=t.clientY-n.top;return{x:r,y:i,inside:r>=0&&i>=0&&r<=n.width&&i<=n.height}},pe=e=>{let t=fe(e);Z.x=t.x,Z.y=t.y,t.inside!==Z.inside&&(Z.placed=!1),Z.inside=t.inside,t.inside&&Q()},me=e=>{let t=fe(e);t.inside&&(Z.x=t.x,Z.y=t.y,Z.inside||(Z.lastX=t.x,Z.lastY=t.y),Z.burst=1.2,Q())},$=()=>{Z.inside=!1,Z.placed=!1,Q()},he=e=>{e.relatedTarget||$()},ge=e=>{e.pointerType===`touch`&&$()},_e=()=>{document.hidden||Q()};window.addEventListener(`pointermove`,pe,{passive:!0}),window.addEventListener(`pointerdown`,me,{passive:!0}),window.addEventListener(`pointerout`,he,{passive:!0}),window.addEventListener(`pointerup`,ge,{passive:!0}),window.addEventListener(`blur`,$),document.addEventListener(`visibilitychange`,_e);let ve=new ResizeObserver(le);ve.observe(e);let ye=new IntersectionObserver(([e])=>{H=e.isIntersecting,Q()});return ye.observe(e),q.current=()=>{W=!0,Q()},le(),()=>{U=!1,H=!1,cancelAnimationFrame(R),ve.disconnect(),ye.disconnect(),window.removeEventListener(`pointermove`,pe),window.removeEventListener(`pointerdown`,me),window.removeEventListener(`pointerout`,he),window.removeEventListener(`pointerup`,ge),window.removeEventListener(`blur`,$),document.removeEventListener(`visibilitychange`,_e),q.current=null,D&&(p(D.read),p(D.write)),p(E),n.deleteTexture(O.texture),n.getExtension(`WEBGL_lose_context`)?.loseContext(),l.parentNode&&l.parentNode.removeChild(l)}},[]),(0,u.jsx)(`div`,{ref:K,className:`relative h-full w-full overflow-hidden ${W}`.trim(),style:G})};export{E as default};