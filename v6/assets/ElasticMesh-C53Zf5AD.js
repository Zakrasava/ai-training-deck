import{i as e,t}from"./react-sySUN5R7.js";import{k as n}from"./sculpture-dark-CKiqtzhU.js";var r=e(t(),1),i=n(),a=`#version 300 es
in vec2 aPosition;
in vec2 aRest;
in vec4 aStrain;
in vec3 aDent;
uniform vec2 uViewport;
uniform vec2 uOffset;
out vec2 vRest;
out vec4 vStrain;
out vec3 vDent;
void main() {
  vRest = aRest;
  vStrain = aStrain;
  vDent = aDent;
  vec2 clip = (aPosition + uOffset) / uViewport * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
}`,o=`#version 300 es
precision highp float;
in vec2 vRest;
in vec4 vStrain;
in vec3 vDent;
uniform sampler2D uField;
uniform vec3 uShadowColor;
uniform float uShadow;
uniform vec4 uParts[64];
uniform float uClock;

float arrival(float delay) {
  float t = max(uClock - delay, 0.0);
  float omega = 15.0;
  float zeta = 0.38;
  float damped = omega * sqrt(1.0 - zeta * zeta);
  return 1.0 - exp(-zeta * omega * t) * (cos(damped * t) + zeta * omega / damped * sin(damped * t));
}

float owner(vec2 rest) {
  ivec2 size = textureSize(uField, 0);
  ivec2 texel = clamp(ivec2(rest * vec2(size)), ivec2(0), size - 1);
  return floor(texelFetch(uField, texel, 0).w + 0.5);
}

vec3 settle(vec2 rest) {
  if (uClock > 9.0) return vec3(rest, 1.0);
  float id = owner(rest);
  if (id < 0.5 || id > 64.5) return vec3(rest, 1.0);
  vec4 part = uParts[int(id) - 1];
  float presence = arrival(part.z);
  float size = max(mix(0.5, 1.0, presence), 0.05);
  vec2 moved = part.xy + (rest - part.xy) / size;
  return vec3(moved, presence * step(abs(owner(moved) - id), 0.5));
}
out vec4 outColor;
void main() {
  vec3 arrived = settle(vRest);
  float shade = texture(uField, arrived.xy).z * uShadow * clamp(arrived.z, 0.0, 1.0) * (1.0 - 0.35 * clamp(vDent.x, 0.0, 1.0));
  outColor = vec4(uShadowColor * shade, shade);
}`,s=`#version 300 es
precision highp float;
in vec2 vRest;
in vec4 vStrain;
in vec3 vDent;
uniform sampler2D uField;
uniform sampler2D uSlope;
uniform sampler2D uPaint;
uniform vec3 uColor;
uniform float uPaintMix;
uniform float uMaterial;
uniform float uLight;
uniform float uInflate;
uniform mat3 uTurn;
uniform vec4 uParts[64];
uniform float uClock;
out vec4 outColor;

float arrival(float delay) {
  float t = max(uClock - delay, 0.0);
  float omega = 15.0;
  float zeta = 0.38;
  float damped = omega * sqrt(1.0 - zeta * zeta);
  return 1.0 - exp(-zeta * omega * t) * (cos(damped * t) + zeta * omega / damped * sin(damped * t));
}

float owner(vec2 rest) {
  ivec2 size = textureSize(uField, 0);
  ivec2 texel = clamp(ivec2(rest * vec2(size)), ivec2(0), size - 1);
  return floor(texelFetch(uField, texel, 0).w + 0.5);
}

vec3 settle(vec2 rest) {
  if (uClock > 9.0) return vec3(rest, 1.0);
  float id = owner(rest);
  if (id < 0.5 || id > 64.5) return vec3(rest, 1.0);
  vec4 part = uParts[int(id) - 1];
  float presence = arrival(part.z);
  float size = max(mix(0.5, 1.0, presence), 0.05);
  vec2 moved = part.xy + (rest - part.xy) / size;
  return vec3(moved, presence * step(abs(owner(moved) - id), 0.5));
}
vec4 cubic(float v) {
  vec4 n = vec4(1.0, 2.0, 3.0, 4.0) - v;
  vec4 s = n * n * n;
  float x = s.x;
  float y = s.y - 4.0 * s.x;
  float z = s.z - 4.0 * s.y + 6.0 * s.x;
  return vec4(x, y, z, 6.0 - x - y - z) / 6.0;
}

vec2 smoothSlope(vec2 uv) {
  vec2 size = vec2(textureSize(uSlope, 0));
  vec2 cell = uv * size - 0.5;
  vec2 f = fract(cell);
  cell -= f;
  vec4 xc = cubic(f.x);
  vec4 yc = cubic(f.y);
  vec4 corner = cell.xxyy + vec2(-0.5, 1.5).xyxy;
  vec4 sum = vec4(xc.xz + xc.yw, yc.xz + yc.yw);
  vec4 offset = (corner + vec4(xc.yw, yc.yw) / sum) / size.xxyy;
  vec2 a = texture(uSlope, offset.xz).xy;
  vec2 b = texture(uSlope, offset.yz).xy;
  vec2 c = texture(uSlope, offset.xw).xy;
  vec2 d = texture(uSlope, offset.yw).xy;
  float sx = sum.x / (sum.x + sum.y);
  float sy = sum.z / (sum.z + sum.w);
  return mix(mix(d, c, sx), mix(b, a, sx), sy);
}

float panel(vec3 r, vec3 center, vec2 size, float soft) {
  vec3 forward = normalize(center);
  vec3 side = normalize(cross(vec3(0.0, 1.0, 0.0), forward));
  vec3 lift = cross(forward, side);
  float facing = dot(r, forward);
  vec2 local = vec2(dot(r, side), dot(r, lift)) / max(facing, 0.1);
  vec2 q = abs(local) - size;
  float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0);
  return smoothstep(soft, -soft, d) * smoothstep(0.05, 0.3, facing);
}

vec3 studio(vec3 r, float blur) {
  float y = r.y;
  vec3 skyLow = mix(vec3(0.92, 0.95, 1.0), vec3(1.0), uLight);
  vec3 skyHigh = mix(vec3(0.1, 0.11, 0.14), vec3(0.62, 0.64, 0.7), uLight);
  vec3 groundNear = mix(vec3(0.12, 0.11, 0.1), vec3(0.3, 0.29, 0.28), uLight);
  vec3 groundFar = mix(vec3(0.005), vec3(0.1), uLight);
  vec3 sky = mix(skyLow, skyHigh, smoothstep(0.0, 0.75, y));
  vec3 ground = mix(groundNear, groundFar, smoothstep(0.0, -0.4, y));
  float edge = 0.004 + blur;
  vec3 c = mix(ground, sky, smoothstep(-edge, edge, y));
  float glow = 0.035 + blur;
  c += vec3(2.2) * exp(-pow((y - 0.02) / glow, 2.0)) * (0.035 / glow);
  c += vec3(7.0) * panel(r, vec3(-0.55, 0.55, 0.62), vec2(0.36, 0.2), 0.025 + blur);
  c += vec3(4.5) * panel(r, vec3(0.9, 0.18, 0.4), vec2(0.045, 0.85), 0.01 + blur) * (0.045 / (0.045 + blur));
  c += vec3(3.2) * panel(r, vec3(-0.95, 0.1, 0.32), vec2(0.035, 0.7), 0.01 + blur) * (0.035 / (0.035 + blur));
  c += vec3(2.4) * panel(r, vec3(0.0, 0.92, 0.38), vec2(1.1, 0.045), 0.01 + blur) * (0.045 / (0.045 + blur));
  return c;
}

vec3 tone(vec3 x) {
  return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
}

void main() {
  vec3 arrived = settle(vRest);
  vec2 rest = arrived.xy;
  float presence = arrived.z;
  vec4 field = texture(uField, rest);
  float edge = field.y;
  float edgeWidth = max(fwidth(edge), 0.0001);
  if (edge < -3.0 * edgeWidth || presence <= 0.001) discard;
  float cover = clamp(edge / edgeWidth + 0.5, 0.0, 1.0);

  vec2 slope = smoothSlope(rest);
  mat2 strain = mat2(vStrain.xy, vStrain.zw);
  float area = max(determinant(strain), 0.2);
  float lift = uInflate * presence * inversesqrt(area);
  float keep = clamp(1.0 - vDent.x, 0.15, 1.6);
  vec2 restGradient = (slope * keep - field.x * vDent.yz) * lift;
  vec2 gradient = inverse(transpose(strain)) * restGradient;
  vec3 normal = normalize(vec3(-gradient.x, gradient.y, 1.0));
  float depth = field.x * keep * lift;

  vec3 turned = uTurn * normal;
  vec3 reflected = uTurn * reflect(vec3(0.0, 0.0, -1.0), normal);
  float footprint = length(fwidth(reflected));
  float facing = max(normal.z, 0.0);
  float fresnel = pow(1.0 - facing, 5.0);
  vec3 lightDir = normalize(vec3(-0.5, 0.62, 0.62));
  float wrap = max((dot(turned, lightDir) + 0.45) / 1.45, 0.0);
  float key = max(dot(turned, lightDir), 0.0);
  float occlusion = mix(0.55, 1.0, smoothstep(0.0, 12.0, depth));

  vec3 paint = texture(uPaint, rest).rgb;
  vec3 base = mix(uColor, paint, uPaintMix);
  vec3 color;
  if (uMaterial < 0.5) {
    vec3 env = studio(reflected, 0.04 + footprint * 0.6);
    float reflectance = 0.045 + 0.955 * fresnel;
    vec3 deep = base * base * 0.55;
    vec3 body = mix(deep, base * 1.08, wrap) * occlusion;
    body += base * pow(1.0 - facing, 2.0) * 0.18;
    color = body * (1.0 - reflectance) + tone(env * reflectance * 0.9);
  } else if (uMaterial < 1.5) {
    vec3 env = studio(reflected, footprint * 0.6);
    vec3 tint = mix(vec3(1.0), base, 0.6) * 0.92;
    vec3 reflectance = tint + (1.0 - tint) * fresnel;
    color = tone(env * reflectance * mix(0.55, 1.0, occlusion) * 1.1);
  } else if (uMaterial < 2.5) {
    vec3 env = studio(reflected, 0.03 + footprint * 0.6);
    float core = smoothstep(0.0, 1.0, facing);
    vec3 glow = mix(base * base * 0.35, min(base * 1.45 + 0.08, vec3(1.0)), core * core);
    vec3 body = glow * mix(0.7, 1.0, occlusion) + base * wrap * 0.18;
    float reflectance = 0.03 + 0.97 * fresnel;
    color = body * (1.0 - reflectance) + tone(env * reflectance * 0.85);
  } else {
    vec3 env = studio(reflected, 0.35 + footprint * 0.6);
    vec3 body = base * (0.3 + 0.7 * wrap) * mix(0.68, 1.0, occlusion);
    body += base * key * 0.12;
    color = body + tone(env * (0.012 + 0.18 * fresnel)) * 0.5;
  }
  float alpha = cover * smoothstep(0.0, 0.18, presence);
  outColor = vec4(color * alpha, alpha);
}`,c={balloon:0,chrome:1,jelly:2,clay:3},l=720,u=5200,d=1/480,f=(e,t,n)=>Math.min(n,Math.max(t,e)),p=(e,t,n)=>{let r=e.createShader(t);return r?(e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(e.deleteShader(r),null)):null},m=(e,t)=>{let n=p(e,e.VERTEX_SHADER,a),r=p(e,e.FRAGMENT_SHADER,t),i=e.createProgram();return!n||!r||!i?null:(e.attachShader(i,n),e.attachShader(i,r),e.bindAttribLocation(i,0,`aPosition`),e.bindAttribLocation(i,1,`aRest`),e.bindAttribLocation(i,2,`aStrain`),e.bindAttribLocation(i,3,`aDent`),e.linkProgram(i),e.deleteShader(n),e.deleteShader(r),e.getProgramParameter(i,e.LINK_STATUS)?i:(e.deleteProgram(i),null))},h=(e,t,n)=>{let r={};for(let i of n)r[i]=e.getUniformLocation(t,i);return r},g=(e,t,n,r,i)=>{let a=0;r[0]=0,i[0]=-1/0,i[1]=1/0;for(let n=1;n<t;n++){let t=(e[n]+n*n-(e[r[a]]+r[a]*r[a]))/(2*n-2*r[a]);for(;t<=i[a];)a--,t=(e[n]+n*n-(e[r[a]]+r[a]*r[a]))/(2*n-2*r[a]);a++,r[a]=n,i[a]=t,i[a+1]=1/0}a=0;for(let o=0;o<t;o++){for(;i[a+1]<o;)a++;n[o]=(o-r[a])*(o-r[a])+e[r[a]]}},_=(e,t,n)=>{let r=Math.max(t,n),i=new Float64Array(r),a=new Float64Array(r),o=new Int32Array(r),s=new Float64Array(r+1);for(let r=0;r<t;r++){for(let a=0;a<n;a++)i[a]=e[a*t+r];g(i,n,a,o,s);for(let i=0;i<n;i++)e[i*t+r]=a[i]}for(let r=0;r<n;r++){for(let n=0;n<t;n++)i[n]=e[r*t+n];g(i,t,a,o,s);for(let n=0;n<t;n++)e[r*t+n]=Math.sqrt(a[n])}return e},v=(e,t,n)=>{let r=new Float64Array(t*n),i=new Int32Array(t*n);for(let a=0;a<t;a++){let o=-1;for(let s=0;s<n;s++){let n=s*t+a;e[n]&&(o=s),i[n]=o,r[n]=o>=0?(s-o)*(s-o):0x56bc75e2d63100000}o=-1;for(let s=n-1;s>=0;s--){let n=s*t+a;e[n]&&(o=s),o>=0&&(o-s)*(o-s)<r[n]&&(r[n]=(o-s)*(o-s),i[n]=o)}}let a=new Float32Array(t*n),o=new Float64Array(t),s=new Int32Array(t),c=new Float64Array(t+1);for(let l=0;l<n;l++){for(let e=0;e<t;e++)o[e]=r[l*t+e];let n=0;s[0]=0,c[0]=-1/0,c[1]=1/0;for(let e=1;e<t;e++){let t=(o[e]+e*e-(o[s[n]]+s[n]*s[n]))/(2*e-2*s[n]);for(;t<=c[n];)n--,t=(o[e]+e*e-(o[s[n]]+s[n]*s[n]))/(2*e-2*s[n]);n++,s[n]=e,c[n]=t,c[n+1]=1/0}n=0;for(let r=0;r<t;r++){for(;c[n+1]<r;)n++;let o=s[n],u=i[l*t+o];a[l*t+r]=u>=0?e[u*t+o]:0}}return a},y=(e,t,n)=>{let r=[{width:t,height:n,mask:e}];for(;Math.max(r[r.length-1].width,r[r.length-1].height)>48;){let e=r[r.length-1],t=Math.ceil(e.width/2),n=Math.ceil(e.height/2),i=new Float32Array(t*n);for(let r=0;r<n;r++)for(let n=0;n<t;n++){let a=0,o=0;for(let t=0;t<2;t++)for(let i=0;i<2;i++){let s=n*2+i,c=r*2+t;s<e.width&&c<e.height&&(a+=e.mask[c*e.width+s],o++)}i[r*t+n]=a/o}r.push({width:t,height:n,mask:i})}let i=null;for(let e=r.length-1;e>=0;e--){let{width:t,height:n,mask:a}=r[e],o=new Float32Array(t*n);if(i){let a=r[e+1].width,s=r[e+1].height;for(let e=0;e<n;e++)for(let n=0;n<t;n++){let r=f((n+.5)/2-.5,0,a-1),c=f((e+.5)/2-.5,0,s-1),l=Math.floor(r),u=Math.floor(c),d=Math.min(a-1,l+1),p=Math.min(s-1,u+1),m=r-l,h=c-u,g=i[u*a+l]*(1-m)+i[u*a+d]*m,_=i[p*a+l]*(1-m)+i[p*a+d]*m;o[e*t+n]=g*(1-h)+_*h}}let s=4**e,c=e===r.length-1?300:60;for(let e=0;e<c;e++)for(let e=0;e<n;e++)for(let r=0;r<t;r++){let i=e*t+r;if(a[i]<.5){o[i]=0;continue}let c=r>0?o[i-1]:0,l=r<t-1?o[i+1]:0,u=e>0?o[i-t]:0,d=e<n-1?o[i+t]:0;o[i]+=((c+l+u+d+s)*.25-o[i])*1.85}i=o}return i},b=(e,t,n,r)=>{let i=Math.max(1,Math.round(r)),a=i/2.5,o=[],s=0;for(let e=-i;e<=i;e++){let t=Math.exp(-(e*e)/(2*a*a));o.push(t),s+=t}for(let e=0;e<o.length;e++)o[e]/=s;let c=new Float32Array(t*n),l=new Float32Array(t*n);for(let r=0;r<n;r++)for(let n=0;n<t;n++){let a=0;for(let s=-i;s<=i;s++)a+=e[r*t+f(n+s,0,t-1)]*o[s+i];c[r*t+n]=a}for(let e=0;e<n;e++)for(let r=0;r<t;r++){let a=0;for(let s=-i;s<=i;s++)a+=c[f(e+s,0,n-1)*t+r]*o[s+i];l[e*t+r]=a}return l},x=({text:e=`Squish`,src:t=``,fontFamily:n=`system-ui, sans-serif`,fontWeight:a=900,color:p=`#3b5bff`,imageColors:g=!0,material:x=`balloon`,inflate:S=1,stiffness:C=.5,wobble:w=.6,grabRadius:T=70,stretch:E=.5,press:D=.5,shadow:O=.5,intro:k=!0,theme:A=`dark`,dpr:j,className:M=``,style:N,...P})=>{let F=(0,r.useRef)(null),I=(0,r.useRef)(null),L=(0,r.useRef)(null),R=(0,r.useRef)(null),z={text:String(e),src:String(t||``),fontFamily:String(n),fontWeight:a,color:String(p),imageColors:g,material:c[x]??0,inflate:f(S,.1,3),stiffness:f(C,0,1),wobble:f(w,0,1),grabRadius:f(T,10,400),stretch:f(E,0,1),press:f(D,0,1),shadow:f(O,0,1),intro:k,light:A===`light`,dpr:j},B=(0,r.useRef)(z);B.current=z;let V=`${z.text}|${z.src}|${z.fontFamily}|${z.fontWeight}`,H=(0,r.useRef)(V);return(0,r.useEffect)(()=>{let e=F.current,t=I.current,n=t?.getContext(`webgl2`,{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1});if(!e||!t||!n)return;let r=m(n,s),i=m(n,o);if(!r||!i)return;let a=h(n,r,[`uViewport`,`uOffset`,`uField`,`uPaint`,`uSlope`,`uColor`,`uPaintMix`,`uMaterial`,`uLight`,`uInflate`,`uTurn`,`uClock`,`uParts`]),c=h(n,i,[`uViewport`,`uOffset`,`uField`,`uShadowColor`,`uShadow`,`uClock`,`uParts`]),p=n.createTexture(),g=n.createTexture(),x=n.createTexture();for(let e of[p,g,x])n.bindTexture(n.TEXTURE_2D,e),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MAG_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE),n.texImage2D(n.TEXTURE_2D,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,new Uint8Array(4));let S=n.createVertexArray(),C=n.createBuffer(),w=n.createBuffer(),T=n.createBuffer();n.bindVertexArray(S),n.bindBuffer(n.ARRAY_BUFFER,C),n.enableVertexAttribArray(1),n.vertexAttribPointer(1,2,n.FLOAT,!1,0,0),n.bindBuffer(n.ARRAY_BUFFER,w),n.enableVertexAttribArray(0),n.vertexAttribPointer(0,2,n.FLOAT,!1,36,0),n.enableVertexAttribArray(2),n.vertexAttribPointer(2,4,n.FLOAT,!1,36,8),n.enableVertexAttribArray(3),n.vertexAttribPointer(3,3,n.FLOAT,!1,36,24),n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,T),n.bindVertexArray(null);let E=document.createElement(`canvas`).getContext(`2d`,{willReadFrequently:!0}),D=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches??!1,O=new Float32Array(256),k=new Float32Array([1,0,0,0,1,0,0,0,1]),A={cols:0,rows:0,spacing:1,count:0,indices:0,restX:new Float32Array,restY:new Float32Array,x:new Float32Array,y:new Float32Array,vx:new Float32Array,vy:new Float32Array,dent:new Float32Array,dentV:new Float32Array,grip:new Float32Array,gripX:new Float32Array,gripY:new Float32Array,active:new Uint8Array,neighbors:new Int32Array,dynamic:new Float32Array,anchorX:new Float32Array,anchorY:new Float32Array,indexType:n.UNSIGNED_SHORT,activeCount:0,width:1,height:1},j={width:1,height:1,ready:!1,fieldWidth:1,fieldHeight:1,fieldScale:1,sdf:new Float32Array,parts:[],clock:B.current.intro&&!D?0:10,colorKey:``,color:[.31,.42,1],pointer:{x:0,y:0,inside:!1,down:!1,startX:0,startY:0,startTime:0,dragging:!1},hover:{x:0,y:0,vx:0,vy:0,power:0},turn:{x:0,y:0,vx:0,vy:0},accumulator:0,energy:1,buildToken:0},M=0,N=0,P=!0,z=!0,V=0,H=e=>{if(!E||!e)return[.31,.42,1];E.fillStyle=`#000000`,E.fillStyle=/^[0-9a-f]{3,8}$/i.test(e)?`#${e}`:e,E.fillRect(0,0,1,1);let[t,n,r]=E.getImageData(0,0,1,1).data;return[t/255,n/255,r/255]},U=(e,t)=>{let n=f(Math.round(e*j.fieldScale),0,j.fieldWidth-1),r=f(Math.round(t*j.fieldScale),0,j.fieldHeight-1);return j.sdf[r*j.fieldWidth+n]||-1e6},ee=()=>{let{width:e,height:t}=j,r=Math.max(7,Math.sqrt(e*t/u)),i=Math.ceil(e/r)+1,a=Math.ceil(t/r)+1,o=i*a,s=e/(i-1),c=t/(a-1);A.cols=i,A.rows=a,A.width=e,A.height=t,A.spacing=(s+c)/2,A.count=o,A.restX=new Float32Array(o),A.restY=new Float32Array(o),A.x=new Float32Array(o),A.y=new Float32Array(o),A.vx=new Float32Array(o),A.vy=new Float32Array(o),A.dent=new Float32Array(o),A.dentV=new Float32Array(o),A.grip=new Float32Array(o),A.gripX=new Float32Array(o),A.gripY=new Float32Array(o),A.active=new Uint8Array(o),A.dynamic=new Float32Array(o*9);let l=new Float32Array(o*2),d=-2.5*A.spacing;for(let n=0;n<a;n++)for(let r=0;r<i;r++){let a=n*i+r,o=r*s,u=n*c;A.restX[a]=o,A.restY[a]=u,A.x[a]=o,A.y[a]=u,l[a*2]=o/e,l[a*2+1]=u/t,A.active[a]=j.ready&&U(o,u)>d?1:0}let f=new Int32Array(o*8).fill(-1),p=[[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[1,-1],[-1,1],[1,1]];for(let e=0;e<a;e++)for(let t=0;t<i;t++){let n=e*i+t;A.active[n]&&p.forEach(([r,o],s)=>{let c=t+r,l=e+o;if(c<0||l<0||c>=i||l>=a)return;let u=l*i+c;A.active[u]&&(f[n*8+s]=u)})}A.neighbors=f,A.activeCount=A.active.reduce((e,t)=>e+t,0);let m=-(Math.min(e,t)*.14+A.spacing*3),h=new Uint8Array(o);for(let e=0;e<o;e++)h[e]=j.ready&&U(A.restX[e],A.restY[e])>m?1:0;let g=[];for(let e=0;e<a-1;e++)for(let t=0;t<i-1;t++){let n=e*i+t,r=n+1,a=n+i,o=a+1;(h[n]||h[r]||h[a]||h[o])&&g.push(n,a,r,r,a,o)}let _=o>65535?new Uint32Array(g):new Uint16Array(g);A.indexType=o>65535?n.UNSIGNED_INT:n.UNSIGNED_SHORT,A.indices=g.length,n.bindBuffer(n.ARRAY_BUFFER,C),n.bufferData(n.ARRAY_BUFFER,l,n.STATIC_DRAW),n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,T),n.bufferData(n.ELEMENT_ARRAY_BUFFER,_,n.STATIC_DRAW),W()},W=()=>{let{cols:e,rows:t,x:r,y:i,dent:a,dynamic:o,spacing:s}=A,c=A.width/Math.max(1,e-1),l=A.height/Math.max(1,t-1);for(let n=0;n<t;n++)for(let u=0;u<e;u++){let d=n*e+u,f=u>0?d-1:d,p=u<e-1?d+1:d,m=n>0?d-e:d,h=n<t-1?d+e:d,g=(p-f)*c||s,_=(h-m)/e*l||s,v=d*9;o[v]=r[d],o[v+1]=i[d],o[v+2]=(r[p]-r[f])/g,o[v+3]=(i[p]-i[f])/g,o[v+4]=(r[h]-r[m])/_,o[v+5]=(i[h]-i[m])/_,o[v+6]=a[d],o[v+7]=(a[p]-a[f])/g,o[v+8]=(a[h]-a[m])/_}n.bindBuffer(n.ARRAY_BUFFER,w),n.bufferData(n.ARRAY_BUFFER,o,n.DYNAMIC_DRAW)},G=async()=>{let e=B.current,t=++j.buildToken,{width:r,height:i}=j,a=Math.min(1,l/Math.max(r,i)),o=Math.max(8,Math.round(r*a)),s=Math.max(8,Math.round(i*a)),c=document.createElement(`canvas`);c.width=o,c.height=s;let u=c.getContext(`2d`,{willReadFrequently:!0});if(!u)return;let d=!1;if(e.src){let n=new Image;n.crossOrigin=`anonymous`,n.decoding=`async`,n.src=e.src;try{await n.decode()}catch{return}if(t!==j.buildToken)return;let r=Math.min(o*.78/n.naturalWidth,s*.74/n.naturalHeight),i=n.naturalWidth*r,a=n.naturalHeight*r;u.drawImage(n,(o-i)/2,(s-a)/2,i,a),d=!0}else{let n=e.fontFamily,r=e.fontWeight;if(document.fonts&&await document.fonts.load(`${r} 100px ${n}`).catch(()=>null),t!==j.buildToken)return;let i=e.text.split(`
`);u.font=`${r} 100px ${n}`;let a=1,c=0,l=0;for(let e of i){let t=u.measureText(e||` `);a=Math.max(a,t.actualBoundingBoxLeft+t.actualBoundingBoxRight),c=Math.max(c,t.actualBoundingBoxAscent),l=Math.max(l,t.actualBoundingBoxDescent)}let f=c+l+102*(i.length-1),p=Math.min(o*.8/a,s*.7/f)*100;u.font=`${r} ${p}px ${n}`,u.fillStyle=`#ffffff`,u.textAlign=`center`,u.textBaseline=`alphabetic`;let m=p/100,h=(s-f*m)/2+c*m;i.forEach((e,t)=>{let n=u.measureText(e||` `),r=(n.actualBoundingBoxLeft-n.actualBoundingBoxRight)/2;u.fillText(e,o/2+r,h+t*102*m)}),d=!0}if(!d||t!==j.buildToken)return;let f=u.getImageData(0,0,o,s).data,m=o*s,h=new Float32Array(m),S=new Float64Array(m),C=new Float64Array(m);for(let e=0;e<m;e++){let t=f[e*4+3]/255;h[e]=t,S[e]=t>.5?1e10:0,C[e]=t>.5?0:1e10}_(S,o,s),_(C,o,s);let w=new Float32Array(m),T=new Float32Array(m);for(let e=0;e<m;e++)w[e]=+(h[e]>.5),T[e]=h[e]>.02&&h[e]<.98?h[e]-.5:S[e]>0?S[e]-.5:.5-C[e];let E=new Int32Array(m),D=[],k=new Int32Array(m);for(let e=0;e<m;e++){if(!w[e]||E[e])continue;let t=D.length+1,n=0,r=0,i=0,c=0,l=1/0;for(k[r++]=e,E[e]=t;n<r;){let e=k[n++],a=e%o,u=(e-a)/o;i+=a,c+=u,a<l&&(l=a),a>0&&w[e-1]&&!E[e-1]&&(E[e-1]=t,k[r++]=e-1),a<o-1&&w[e+1]&&!E[e+1]&&(E[e+1]=t,k[r++]=e+1),u>0&&w[e-o]&&!E[e-o]&&(E[e-o]=t,k[r++]=e-o),u<s-1&&w[e+o]&&!E[e+o]&&(E[e+o]=t,k[r++]=e+o)}D.push({x:i/r/a,y:c/r/a,left:l,size:r,delay:0})}let A=[...D].sort((e,t)=>e.left-t.left),M=A.length>1?Math.min(.07,.5/(A.length-1)):0;A.forEach((e,t)=>{e.delay=t*M});let N=D.length<=64?v(E,o,s):new Float32Array(m),P=b(y(w,o,s),o,s,2),F=b(T,o,s,2),I=b(w,o,s,Math.max(4,Math.min(o,s)*.045)),L=new Float32Array(m*4),R=new Float32Array(m),z=new Float32Array(m);for(let e=0;e<m;e++){let t=F[e]/a;R[e]=t,z[e]=Math.sqrt(Math.max(0,2*P[e]))/a,L[e*4]=z[e],L[e*4+1]=t,L[e*4+2]=I[e],L[e*4+3]=N[e]}let V=new Float32Array(m*2);for(let e=0;e<s;e++)for(let t=0;t<o;t++){let n=e*o+t,r=(z[e*o+Math.min(o-1,t+1)]-z[e*o+Math.max(0,t-1)])*.5*a,i=(z[Math.min(s-1,e+1)*o+t]-z[Math.max(0,e-1)*o+t])*.5*a,c=Math.hypot(r,i);c>7&&(r*=7/c,i*=7/c),V[n*2]=r,V[n*2+1]=i}n.bindTexture(n.TEXTURE_2D,p),n.texImage2D(n.TEXTURE_2D,0,n.RGBA16F,o,s,0,n.RGBA,n.FLOAT,L),n.bindTexture(n.TEXTURE_2D,x),n.texImage2D(n.TEXTURE_2D,0,n.RG16F,o,s,0,n.RG,n.FLOAT,V),n.bindTexture(n.TEXTURE_2D,g),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),n.texImage2D(n.TEXTURE_2D,0,n.RGBA,n.RGBA,n.UNSIGNED_BYTE,c),j.fieldWidth=o,j.fieldHeight=s,j.fieldScale=a,j.sdf=R,j.parts=D,O.fill(0),D.slice(0,64).forEach((e,t)=>{O[t*4]=e.x/r,O[t*4+1]=e.y/i,O[t*4+2]=e.delay}),j.ready=!0,ee(),X()},te=(e,t)=>{let{count:n,x:r,y:i,vx:a,vy:o,restX:s,restY:c,dent:l,dentV:u,active:d,neighbors:p,grip:m,gripX:h,gripY:g,spacing:_}=A,v=.4+t.stiffness*1.2,y=350*v*v,b=y*(52/Math.sqrt(v)/_)**2,x=D?.8:.5-t.wobble*.42,S=2*x*Math.sqrt(y),C=y*1.4,w=C*(18/_)**2,T=2*(x+.06)*Math.sqrt(C),E=y*30,O=1.2*Math.sqrt(E),k=j.pointer.dragging?0:10,M=j.hover,N=t.grabRadius*.32,P=1/(2*N*N),F=M.power*t.press,I=j.pointer.dragging?1.6:1,L=0;for(let t=0;t<n;t++){if(!d[t])continue;let n=r[t]-s[t],f=i[t]-c[t],v=-y*n-S*a[t],x=-y*f-S*o[t],D=-C*l[t]-T*u[t],A=t*8;for(let e=0;e<8;e++){let a=p[A+e];if(a<0)continue;let o=e<4?1:.5;v+=b*o*(r[a]-s[a]-n),x+=b*o*(i[a]-c[a]-f),D+=w*o*(l[a]-l[t])}if(F>.001){let e=r[t]-M.x,n=i[t]-M.y,a=Math.exp(-(e*e+n*n)*P);D+=C*2.6*I*F*a,v+=(y*.3*e+k*M.vx)*F*a,x+=(y*.3*n+k*M.vy)*F*a}m[t]>0&&(v+=m[t]*(E*(h[t]-r[t])-O*a[t]),x+=m[t]*(E*(g[t]-i[t])-O*o[t])),a[t]+=v*e,o[t]+=x*e,u[t]+=D*e,L+=Math.abs(a[t])+Math.abs(o[t])+Math.abs(u[t])*_}for(let t=0;t<n;t++)d[t]&&(r[t]+=a[t]*e,i[t]+=o[t]*e,l[t]=f(l[t]+u[t]*e,-.6,.85));return L},ne=e=>{let{pointer:t}=j,{count:n,grip:r,gripX:i,gripY:a}=A;if(!t.dragging)return;let o=Math.max(20,Math.min(j.width,j.height)*(.08+e.stretch*.32)),s=t.x-t.startX,c=t.y-t.startY,l=Math.hypot(s,c),u=l>0?o*Math.tanh(l/o)/l:0;for(let e=0;e<n;e++)r[e]<=0||(i[e]=A.anchorX[e]+s*u,a[e]=A.anchorY[e]+c*u)},re=(e,t,n)=>{let{count:r,x:i,y:a,grip:o,active:s}=A,c=n.grabRadius*.3,l=1/(2*c*c);A.anchorX=new Float32Array(r),A.anchorY=new Float32Array(r);let u=0;for(let n=0;n<r;n++){if(!s[n])continue;let r=i[n]-e,c=a[n]-t,d=Math.exp(-(r*r+c*c)*l);o[n]=d>.03?d:0,A.anchorX[n]=i[n],A.anchorY[n]=a[n],u+=o[n]}return u>0},ie=()=>{A.grip.fill(0),j.pointer.dragging=!1},ae=(e,t,n)=>{let{count:r,x:i,y:a,vx:o,vy:s,dentV:c,active:l}=A,u=n.grabRadius,d=1/(2*u*u),f=.4+n.press;for(let n=0;n<r;n++){if(!l[n])continue;let r=i[n]-e,u=a[n]-t,p=Math.exp(-(r*r+u*u)*d);c[n]+=9*f*p,o[n]+=r*9*f*p,s[n]+=u*9*f*p}},K=(e,t)=>{let{cols:n,rows:r,x:i,y:a,active:o,spacing:s}=A,c=1/0,l=-1,u=Math.ceil(80/s),d=f(Math.round(e/(A.width/Math.max(1,n-1))),0,n-1),p=f(Math.round(t/(A.height/Math.max(1,r-1))),0,r-1);for(let s=Math.max(0,p-u);s<=Math.min(r-1,p+u);s++)for(let r=Math.max(0,d-u);r<=Math.min(n-1,d+u);r++){let u=s*n+r;if(!o[u])continue;let d=Math.hypot(i[u]-e,a[u]-t);d<c&&(c=d,l=u)}return l<0?!1:U(A.restX[l]+(e-i[l]),A.restY[l]+(t-a[l]))>-4},q=()=>{let n=B.current,r=Math.max(1,e.clientWidth),i=Math.max(1,e.clientHeight),a=Math.min(n.dpr||window.devicePixelRatio||1,2);if(t.width=Math.max(1,Math.round(r*a)),t.height=Math.max(1,Math.round(i*a)),r!==j.width||i!==j.height){let e=!j.ready&&!j.buildToken;j.width=r,j.height=i,window.clearTimeout(V),e?G():V=window.setTimeout(G,160)}X()},J=()=>{let e=B.current,o=e.color;if(o!==j.colorKey&&(j.colorKey=o,j.color=H(e.color)),n.viewport(0,0,t.width,t.height),n.clearColor(0,0,0,0),n.clear(n.COLOR_BUFFER_BIT),!j.ready||!A.indices)return;if(n.enable(n.BLEND),n.blendFunc(n.ONE,n.ONE_MINUS_SRC_ALPHA),n.bindVertexArray(S),n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,p),n.activeTexture(n.TEXTURE1),n.bindTexture(n.TEXTURE_2D,g),n.activeTexture(n.TEXTURE2),n.bindTexture(n.TEXTURE_2D,x),e.shadow>0){n.useProgram(i),n.uniform2f(c.uViewport,A.width,A.height);let t=Math.min(A.width,A.height)*.035*e.inflate;n.uniform2f(c.uOffset,t*.25,t),n.uniform1i(c.uField,0),e.light?n.uniform3f(c.uShadowColor,.08,.08,.14):n.uniform3f(c.uShadowColor,0,0,0),n.uniform1f(c.uShadow,e.shadow*(e.light?.35:.7)),n.uniform1f(c.uClock,j.clock),n.uniform4fv(c.uParts,O),n.drawElements(n.TRIANGLES,A.indices,A.indexType,0)}n.useProgram(r),n.uniform2f(a.uViewport,A.width,A.height),n.uniform2f(a.uOffset,0,0),n.uniform1i(a.uField,0),n.uniform1i(a.uPaint,1),n.uniform1i(a.uSlope,2);let s=j.turn.x,l=j.turn.y,u=Math.cos(s),d=Math.sin(s),f=Math.cos(l),m=Math.sin(l);k[0]=u,k[1]=d*m,k[2]=-d*f,k[3]=0,k[4]=f,k[5]=m,k[6]=d,k[7]=-u*m,k[8]=u*f,n.uniformMatrix3fv(a.uTurn,!1,k),n.uniform3f(a.uColor,j.color[0],j.color[1],j.color[2]),n.uniform1f(a.uPaintMix,e.src&&e.imageColors?1:0),n.uniform1f(a.uMaterial,e.material),n.uniform1f(a.uLight,+!!e.light),n.uniform1f(a.uInflate,e.inflate),n.uniform1f(a.uClock,j.clock),n.uniform4fv(a.uParts,O),n.drawElements(n.TRIANGLES,A.indices,A.indexType,0),n.bindVertexArray(null)},Y=e=>{if(M=0,!z||!P||document.hidden)return;let t=B.current,n=N?Math.min(.05,(e-N)/1e3):1/60;N=e,D||!t.intro?j.clock=10:j.ready&&j.clock<10&&(j.clock=j.clock+n>1.8?10:j.clock+n);let r=j.hover,i=j.pointer,a=j.ready&&(i.dragging||i.inside&&!i.down&&K(i.x,i.y)),o=1-Math.exp(-n/.05),s=r.x+(i.x-r.x)*o,c=r.y+(i.y-r.y)*o,l=1-Math.exp(-n/.04);r.vx+=((s-r.x)/Math.max(n,.001)-r.vx)*l,r.vy+=((c-r.y)/Math.max(n,.001)-r.vy)*l,r.x=s,r.y=c;let u=+!!a;r.power+=(u-r.power)*(1-Math.exp(-n/(a?.12:.25)));let f=j.turn,p=i.inside&&!D?(i.x/Math.max(1,A.width)-.5)*.7:0,m=i.inside&&!D?(i.y/Math.max(1,A.height)-.5)*.4:0;f.vx+=(28*(p-f.x)-10*f.vx)*n,f.vy+=(28*(m-f.y)-10*f.vy)*n,f.x+=f.vx*n,f.y+=f.vy*n;let h=Math.abs(p-f.x)>5e-4||Math.abs(m-f.y)>5e-4||Math.abs(f.vx)>.001||Math.abs(f.vy)>.001,g=0;if(j.ready){ne(t),j.accumulator+=n;let e=0;for(;j.accumulator>=d&&e<40;)g=te(d,t),j.accumulator-=d,e++;e===40&&(j.accumulator=0),W()}j.energy=g,J(),!j.ready||j.clock<10||Math.abs(u-r.power)>.002||h||Math.hypot(i.x-r.x,i.y-r.y)>.1||i.dragging||g>.05*Math.max(1,A.activeCount)?M=requestAnimationFrame(Y):N=0},X=()=>{!M&&z&&P&&!document.hidden&&(M=requestAnimationFrame(Y))},Z=t=>{let n=e.getBoundingClientRect();j.pointer.x=t.clientX-n.left,j.pointer.y=t.clientY-n.top,j.pointer.inside=j.pointer.x>=0&&j.pointer.y>=0&&j.pointer.x<=n.width&&j.pointer.y<=n.height},Q=e=>{Z(e),X()},oe=t=>{if(Z(t),!j.ready||!K(j.pointer.x,j.pointer.y))return;let n=B.current;j.pointer.down=!0,j.pointer.startX=j.pointer.x,j.pointer.startY=j.pointer.y,j.pointer.startTime=performance.now(),j.pointer.dragging=re(j.pointer.x,j.pointer.y,n),e.setPointerCapture?.(t.pointerId),X()},$=e=>{if(!j.pointer.down)return;Z(e);let t=B.current,n=Math.hypot(j.pointer.x-j.pointer.startX,j.pointer.y-j.pointer.startY),r=performance.now()-j.pointer.startTime<260;ie(),n<8&&r&&ae(j.pointer.x,j.pointer.y,t),j.pointer.down=!1,X()},se=()=>{j.pointer.inside=!1,X()},ce=()=>{N=0,X()},le=new ResizeObserver(q);le.observe(e);let ue=new IntersectionObserver(e=>{P=e.some(e=>e.isIntersecting),P&&(N=0,X())});return ue.observe(e),e.addEventListener(`pointerdown`,oe),window.addEventListener(`pointermove`,Q,{passive:!0}),window.addEventListener(`pointerup`,$),window.addEventListener(`pointercancel`,$),e.addEventListener(`pointerleave`,se),document.addEventListener(`visibilitychange`,ce),q(),R.current=()=>{j.ready=!1,j.clock=B.current.intro&&!D?0:10,G()},L.current=()=>{M||J(),X()},()=>{z=!1,j.buildToken++,cancelAnimationFrame(M),window.clearTimeout(V),L.current=null,R.current=null,le.disconnect(),ue.disconnect(),e.removeEventListener(`pointerdown`,oe),window.removeEventListener(`pointermove`,Q),window.removeEventListener(`pointerup`,$),window.removeEventListener(`pointercancel`,$),e.removeEventListener(`pointerleave`,se),document.removeEventListener(`visibilitychange`,ce),n.deleteBuffer(C),n.deleteBuffer(w),n.deleteBuffer(T),n.deleteVertexArray(S),n.deleteTexture(p),n.deleteTexture(g),n.deleteTexture(x),n.deleteProgram(r),n.deleteProgram(i)}},[]),(0,r.useEffect)(()=>{H.current!==V&&(H.current=V,R.current?.())},[V]),(0,r.useEffect)(()=>{L.current?.()}),(0,i.jsx)(`div`,{ref:F,className:[`relative h-full w-full touch-pan-y select-none overflow-hidden`,M].filter(Boolean).join(` `),style:N,role:`img`,"aria-label":z.src?`Elastic logo`:z.text,...P,children:(0,i.jsx)(`canvas`,{ref:I,className:`absolute inset-0 block h-full w-full`,"aria-hidden":`true`})})};export{x as default};