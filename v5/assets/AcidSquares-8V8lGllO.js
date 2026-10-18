import{i as e,t}from"./react-sySUN5R7.js";import{O as n}from"./sculpture-dark-Cfb-XN1r.js";var r=e(t(),1),i=n(),a=8,o={low:150,medium:210,high:280},s=[-42,-76,84,94],c=2400,l=3,u=2.6,d=19,f=[0,-3],p={press:1,lift:-1,none:0},m={split:[[7,4.2,-4,4,4],[-8,3.6,3,4,4]],backlit:[[6,1.6,-15,5,3],[-7,1.4,-13,5,3]],overhead:[[3,7.5,-4,3,3],[-3,7,-1,3,3]]},h=Math.PI/180,g=`
uniform vec4 uRipples[${a}];
uniform vec4 uWave;
uniform float uSquare;
uniform float uClock;
uniform vec4 uSwell;
uniform vec4 uHover;
uniform vec4 uIntro;

float reachOf(vec2 delta, out vec2 grad) {
  vec2 a = abs(delta);
  vec2 dir = vec2(delta.x < 0.0 ? -1.0 : 1.0, delta.y < 0.0 ? -1.0 : 1.0);
  float round_ = length(delta);
  vec2 roundGrad = delta / max(round_, 1e-4);
  float m = max(max(a.x, a.y), 1e-4);
  vec2 k = a / m;
  vec2 k3 = k * k * k;
  float sum = dot(k3, k);
  float root = sqrt(sqrt(sum));
  float square = m * root;
  vec2 squareGrad = dir * k3 / (root * root * root);
  float d = mix(round_, square, uSquare);
  vec2 g = mix(roundGrad, squareGrad, uSquare);
  float soft = sqrt(d * d + 0.36);
  grad = g * d / soft;
  return soft - 0.6;
}

vec3 field(vec2 p) {
  float t = uSwell.w;
  float f = uSwell.y;
  vec2 k1 = vec2(0.19, 0.11) * f;
  vec2 k2 = vec2(-0.09, 0.23) * f;
  vec2 k3 = vec2(0.29, -0.17) * f;
  float a1 = dot(p, k1) + t * 0.55;
  float a2 = dot(p, k2) - t * 0.42 + 1.3;
  float a3 = dot(p, k3) + t * 0.74 + 2.1;
  float h = 0.55 * sin(a1) + 0.4 * sin(a2) + 0.22 * sin(a3);
  vec2 g = 0.55 * cos(a1) * k1 + 0.4 * cos(a2) * k2 + 0.22 * cos(a3) * k3;
  h *= uSwell.x;
  g *= uSwell.x;
  vec2 dg;
  for (int i = 0; i < ${a}; i++) {
    vec4 r = uRipples[i];
    if (r.w <= 0.0) continue;
    float age = uClock - r.z;
    if (age <= 0.0) continue;
    float d = reachOf(p - r.xy, dg);
    float radius = age * uWave.y;
    float x = (d - radius) / uWave.z;
    float life = clamp(1.0 - radius / uWave.w, 0.0, 1.0);
    float strength = r.w * uWave.x * life * life * smoothstep(0.0, 1.5, radius);
    float bump = exp(-x * x);
    h += bump * strength;
    g += -2.0 * x * bump * strength / uWave.z * dg;
  }
  if (uIntro.w > 0.0) {
    float d = reachOf(p - uIntro.xy, dg);
    float x = (d - uIntro.z) / 2.2;
    float bump = exp(-x * x) * uIntro.w;
    h += bump;
    g += -2.0 * x * bump / 2.2 * dg;
  }
  vec2 hd = p - uHover.xy;
  float hr = max(uHover.z, 1e-3);
  float hover = exp(-dot(hd, hd) / (hr * hr)) * uHover.w;
  h -= hover;
  g += 2.0 * hd / (hr * hr) * hover;
  return vec3(h, g);
}
`,_=`#version 300 es
precision highp float;
${g}
layout(location = 0) in vec2 aGrid;
uniform mat4 uViewProj;
uniform vec4 uArea;
out vec2 vGround;
out vec3 vWorld;
void main() {
  vec2 ground = uArea.xy + aGrid * uArea.zw;
  vec3 f = field(ground);
  vWorld = vec3(ground.x, f.x, ground.y);
  vGround = ground;
  gl_Position = uViewProj * vec4(vWorld, 1.0);
}`,v=`#version 300 es
precision highp float;
${g}
uniform vec3 uEye;
uniform vec3 uColor;
uniform vec3 uAccent;
uniform vec3 uSecond;
uniform vec3 uLightA;
uniform vec3 uLightB;
uniform float uTile;
uniform float uAngle;
uniform float uGap;
uniform float uRound;
uniform float uSoftness;
uniform float uBulge;
uniform float uGloss;
uniform vec2 uRange;
uniform float uBrightness;
uniform float uGrain;
uniform float uGrainScale;
uniform float uLightMode;
uniform float uOpacity;
uniform vec4 uReveal;
uniform vec2 uView;
uniform float uFade;
uniform float uFrame;
in vec2 vGround;
in vec3 vWorld;
out vec4 outColor;

float smoother(float x) {
  x = clamp(x, 0.0, 1.0);
  return x * x * x * (x * (x * 6.0 - 15.0) + 10.0);
}

float hash(vec3 p) {
  p = fract(p * 0.1031);
  p += dot(p, p.zyx + 31.32);
  return fract((p.x + p.y) * p.z);
}

void main() {
  vec3 f = field(vGround);
  vec3 n0 = normalize(vec3(-f.y, 1.0, -f.z));
  vec3 tx = normalize(vec3(1.0, f.y, 0.0));
  vec3 tz = normalize(cross(tx, n0));
  tx = normalize(cross(n0, tz));

  float c = cos(uAngle);
  float s = sin(uAngle);
  mat2 toTile = mat2(c, -s, s, c);
  vec2 q = toTile * vGround / uTile;
  vec2 cell = floor(q);
  vec2 local = q - cell - 0.5;
  float footprint = max(length(fwidth(q)), 1e-5);

  float on = 1.0;
  if (uReveal.w < 1.0) {
    vec2 centre = transpose(toTile) * (cell + 0.5) * uTile;
    vec2 dg;
    float d = reachOf(centre - uReveal.xy, dg);
    float delay = hash(vec3(cell, 7.0)) * 1.1;
    on = max(smoother((uReveal.z - d - delay) / 1.6), uReveal.w);
  }

  float half_ = (0.5 - uGap * 0.5) * mix(0.62, 1.0, on);
  float radius = min(uRound * half_, half_);
  vec2 dd = abs(local) - (half_ - radius);
  float d = length(max(dd, 0.0)) + min(max(dd.x, dd.y), 0.0) - radius;
  vec2 outward = dd.x > 0.0 || dd.y > 0.0 ? normalize(max(dd, 0.0) * sign(local)) : (dd.x > dd.y ? vec2(sign(local.x), 0.0) : vec2(0.0, sign(local.y)));

  float bevelWidth = max(mix(0.04, 0.42, uSoftness) * half_, footprint * 1.5);
  float edge = clamp((d + bevelWidth) / bevelWidth, 0.0, 1.0);
  float dome = uBulge * 0.5 * length(local) / max(half_, 1e-3);
  float theta = edge * edge * mix(0.7, 1.35, uSoftness) + dome;
  vec2 outwardGround = transpose(toTile) * outward;
  vec2 domeGround = transpose(toTile) * (local / max(length(local), 1e-4));
  vec3 bend = normalize(tx * mix(domeGround.x, outwardGround.x, edge) + tz * mix(domeGround.y, outwardGround.y, edge));
  float crowd = smoothstep(0.08, 0.3, footprint);
  theta *= 1.0 - crowd;
  vec3 n = normalize(n0 * cos(theta) + bend * sin(theta));

  float inside = 1.0 - smoothstep(-footprint * 0.75, footprint * 0.75, d);
  float area = (2.0 * half_) * (2.0 * half_) - (4.0 - 3.14159) * radius * radius;
  inside = mix(inside, area, crowd) * on;

  vec3 toEye = uEye - vWorld;
  float dist = length(toEye);
  vec3 v = toEye / dist;
  vec3 la = uLightA - vWorld;
  vec3 lb = uLightB - vWorld;
  float da = length(la);
  float db = length(lb);
  la /= da;
  lb /= db;
  float fa = 1.0 / (1.0 + da * da * 0.02);
  float fb = 1.0 / (1.0 + db * db * 0.02);

  float ndv = clamp(dot(n, v), 0.0, 1.0);
  float fresnel = 0.04 + 0.96 * pow(1.0 - ndv, 5.0);
  vec3 ha = normalize(la + v);
  vec3 hb = normalize(lb + v);
  float shine = mix(10.0, 90.0, uGloss);
  float norm = (shine + 8.0) / 60.0;
  float specA = pow(max(dot(n, ha), 0.0), shine) * norm;
  float specB = pow(max(dot(n, hb), 0.0), shine) * norm;
  float sheenA = pow(max(dot(n, ha), 0.0), 8.0);
  float sheenB = pow(max(dot(n, hb), 0.0), 8.0);
  float diffA = max(dot(n, la), 0.0);
  float diffB = max(dot(n, lb), 0.0);
  vec3 r = reflect(-v, n);
  float rim = exp((dot(r, normalize(vec3(0.15, 0.55, -1.0))) - 1.0) * 6.0);
  float occlusion = mix(1.0, 0.35, edge * edge);
  float edgeLight = edge * edge;

  vec3 color;
  float alpha;
  if (uLightMode > 0.5) {
    float luma = dot(uColor, vec3(0.299, 0.587, 0.114));
    vec3 body = mix(vec3(luma), uColor, 0.5) * 0.96;
    vec3 keyDir = normalize(vec3(-0.35, 0.85, 0.45));
    float shade = clamp(dot(n, keyDir) * 0.6 + 0.5, 0.0, 1.0);
    float wa = clamp(diffA * fa * 9.0, 0.0, 1.0);
    float wb = clamp(diffB * fb * 9.0, 0.0, 1.0);
    vec3 hue = (uAccent * wa + uSecond * wb) / max(wa + wb, 1e-3);
    vec3 lit = body * mix(vec3(1.0), hue, clamp(wa + wb, 0.0, 1.0) * 0.42) * mix(0.7, 1.05, shade);
    lit += vec3(1.0) * (specA * fa + specB * fb) * 2.4 * uGloss;
    lit *= mix(1.0, 0.8, edgeLight * (1.0 - crowd));
    color = lit;
    alpha = inside;
  } else {
    float luma = dot(uColor, vec3(0.299, 0.587, 0.114));
    vec3 body = mix(vec3(luma), uColor, 0.35) + vec3(0.02);
    vec3 lit = body * 0.25;
    lit += body * (uAccent * diffA * fa + uSecond * diffB * fb) * 14.0;
    lit += uAccent * (specA * (0.55 + 1.6 * edgeLight) + sheenA * 0.3) * fa * 9.0 * uGloss;
    lit += uSecond * (specB * (0.55 + 1.6 * edgeLight) + sheenB * 0.3) * fb * 9.0 * uGloss;
    lit += mix(uSecond, vec3(1.0), 0.4) * rim * fresnel * 0.35 * uGloss;
    lit *= occlusion;
    color = lit * inside;
    alpha = inside;
  }

  float fade = 1.0 - smoother((dist - uRange.x) / max(uRange.y - uRange.x, 1e-3));
  alpha *= fade * uOpacity;
  color *= uBrightness;
  if (uLightMode < 0.5) color = 1.0 - exp(-color * 1.1);

  vec2 grainCell = floor(gl_FragCoord.xy / uGrainScale);
  float grain = hash(vec3(grainCell, uFrame)) + hash(vec3(grainCell + 17.0, uFrame + 3.0)) - 1.0;
  float lum = dot(color, vec3(0.299, 0.587, 0.114));
  color += grain * uGrain * (uLightMode > 0.5 ? 0.6 : 0.25 + 0.75 * sqrt(clamp(lum, 0.0, 1.0)));
  color = clamp(color, 0.0, 1.0);

  vec2 uv = gl_FragCoord.xy / uView;
  float edgeFade = max(uFade * 0.5, 1e-4);
  float mask = uFade > 0.0 ? smoother(uv.x / edgeFade) * smoother((1.0 - uv.x) / edgeFade) * smoother(uv.y / edgeFade) * smoother((1.0 - uv.y) / edgeFade) : 1.0;
  alpha *= mask;
  outColor = vec4(color * alpha, alpha);
}`,y=`uRipples.uWave.uSquare.uClock.uSwell.uHover.uIntro.uViewProj.uArea.uEye.uColor.uAccent.uSecond.uLightA.uLightB.uTile.uAngle.uGap.uRound.uSoftness.uBulge.uGloss.uRange.uBrightness.uGrain.uGrainScale.uLightMode.uOpacity.uReveal.uView.uFade.uFrame`.split(`.`),b=(e,t,n)=>Math.min(n,Math.max(t,e)),ee=e=>{let t=b(e,0,1);return 1-(1-t)*(1-t)*(1-t)},x=e=>{let t=b(e,0,1);return t*t*t*(t*(t*6-15)+10)},te=(e,t,n)=>{let r=b((n-e)/(t-e),0,1);return r*r*(3-2*r)},S=(e,t,n)=>{let r=e.createShader(t);return r?(e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(e.deleteShader(r),null)):null},C=(e,t,n)=>{let r=S(e,e.VERTEX_SHADER,t),i=S(e,e.FRAGMENT_SHADER,n),a=e.createProgram();if(!r||!i||!a)return null;if(e.attachShader(a,r),e.attachShader(a,i),e.linkProgram(a),e.deleteShader(r),e.deleteShader(i),!e.getProgramParameter(a,e.LINK_STATUS))return e.deleteProgram(a),null;let o={};for(let t of y)o[t]=e.getUniformLocation(a,t);return{program:a,uniforms:o}},w=(e,t,n,r)=>{let i=1/Math.tan(e/2),a=1/(n-r);return[i/t,0,0,0,0,i,0,0,0,0,(r+n)*a,-1,0,0,2*r*n*a,0]},T=(e,t)=>{let n=e[0]-t[0],r=e[1]-t[1],i=e[2]-t[2],a=Math.hypot(n,r,i)||1;n/=a,r/=a,i/=a;let o=i,s=-n;a=Math.hypot(o,s)||1,o/=a,s/=a;let c=r*s,l=i*o-n*s,u=-r*o;return[o,c,n,0,0,l,r,0,s,u,i,0,-(o*e[0]+s*e[2]),-(c*e[0]+l*e[1]+u*e[2]),-(n*e[0]+r*e[1]+i*e[2]),1]},E=(e,t)=>{let n=Array(16);for(let r=0;r<4;r+=1)for(let i=0;i<4;i+=1)n[r*4+i]=e[i]*t[r*4]+e[4+i]*t[r*4+1]+e[8+i]*t[r*4+2]+e[12+i]*t[r*4+3];return n},ne=e=>{let t=e[0]*e[5]-e[1]*e[4],n=e[0]*e[6]-e[2]*e[4],r=e[0]*e[7]-e[3]*e[4],i=e[1]*e[6]-e[2]*e[5],a=e[1]*e[7]-e[3]*e[5],o=e[2]*e[7]-e[3]*e[6],s=e[8]*e[13]-e[9]*e[12],c=e[8]*e[14]-e[10]*e[12],l=e[8]*e[15]-e[11]*e[12],u=e[9]*e[14]-e[10]*e[13],d=e[9]*e[15]-e[11]*e[13],f=e[10]*e[15]-e[11]*e[14],p=t*f-n*d+r*u+i*l-a*c+o*s,m=p?1/p:0;return[(e[5]*f-e[6]*d+e[7]*u)*m,(e[2]*d-e[1]*f-e[3]*u)*m,(e[13]*o-e[14]*a+e[15]*i)*m,(e[10]*a-e[9]*o-e[11]*i)*m,(e[6]*l-e[4]*f-e[7]*c)*m,(e[0]*f-e[2]*l+e[3]*c)*m,(e[14]*r-e[12]*o-e[15]*n)*m,(e[8]*o-e[10]*r+e[11]*n)*m,(e[4]*d-e[5]*l+e[7]*s)*m,(e[1]*l-e[0]*d-e[3]*s)*m,(e[12]*a-e[13]*r+e[15]*t)*m,(e[9]*r-e[8]*a-e[11]*t)*m,(e[5]*c-e[4]*u-e[6]*s)*m,(e[0]*u-e[1]*c+e[2]*s)*m,(e[13]*n-e[12]*i-e[14]*t)*m,(e[8]*i-e[9]*n+e[10]*t)*m]},D=({color:e=`#120f17`,accentColor:t=`#ff4fb8`,secondaryColor:n=`#3b6bff`,tileSize:g=1,gap:y=.12,roundness:S=.25,softness:D=.5,bulge:O=.3,rotation:k=35,gloss:A=.6,waves:j=1,waveScale:M=1,speed:N=.6,shape:P=`square`,pulse:F=1,pulseSpeed:I=.45,pulseSpacing:L=1,pulseWidth:R=1,pulseOrigin:z=`center`,brightness:B=1,lighting:V=`split`,tilt:H=.7,zoom:U=1,depth:W=10,grain:G=.12,fade:K=0,opacity:q=1,intro:J=!0,mouseInteraction:re=!0,hoverEffect:ie=`press`,mouseStrength:ae=1,mouseRadius:oe=.35,pulseOnClick:se=!0,detail:ce=`medium`,lightMode:le=!1,paused:ue=!1,dpr:de,...fe})=>{let Y=(0,r.useRef)(null),X=(0,r.useRef)(null),Z=(0,r.useRef)(null),Q={color:String(e),accentColor:String(t),secondaryColor:String(n),tileSize:b(g,.2,5),gap:b(y,0,.6),roundness:b(S,0,1),softness:b(D,0,1),bulge:b(O,0,1.5),rotation:k*h,gloss:b(A,0,1),waves:Math.max(0,j),waveScale:b(M,.1,5),speed:Math.max(0,N),square:P===`round`?0:1,pulse:Math.max(0,F),pulseSpeed:Math.max(0,I),pulseSpacing:b(L,.2,6),pulseWidth:b(R,.1,5),randomOrigin:z===`random`,brightness:Math.max(0,B),lights:m[V]||m.split,tilt:b(H,0,1),zoom:b(U,.3,4),depth:b(W,2,40),grain:Math.max(0,G),fade:b(K,0,1),opacity:b(q,0,1),intro:J,mouseInteraction:re,hover:p[ie]??1,mouseStrength:Math.max(0,ae),mouseRadius:b(oe,.02,2),pulseOnClick:se,mesh:o[ce]||o.medium,lightMode:le,paused:ue,dpr:de},$=(0,r.useRef)(Q);$.current=Q,(0,r.useEffect)(()=>{let e=Y.current,t=X.current,n=t?.getContext(`webgl2`,{alpha:!0,premultipliedAlpha:!0,antialias:!0,depth:!0,stencil:!1});if(!e||!t||!n)return;let r=C(n,_,v);if(!r)return;let i=n.createVertexArray(),o=n.createBuffer(),p=n.createBuffer(),m=0,h=0,g=e=>{if(e===m)return;m=e;let t=new Float32Array((e+1)*(e+1)*2),r=0;for(let n=0;n<=e;n+=1)for(let i=0;i<=e;i+=1)t[r]=i/e,t[r+1]=n/e,r+=2;let a=new Uint32Array(e*e*6);r=0;for(let t=0;t<e;t+=1)for(let n=0;n<e;n+=1){let i=t*(e+1)+n,o=i+1,s=i+e+1,c=s+1;a[r]=i,a[r+1]=s,a[r+2]=o,a[r+3]=o,a[r+4]=s,a[r+5]=c,r+=6}h=a.length,n.bindVertexArray(i),n.bindBuffer(n.ARRAY_BUFFER,o),n.bufferData(n.ARRAY_BUFFER,t,n.STATIC_DRAW),n.enableVertexAttribArray(0),n.vertexAttribPointer(0,2,n.FLOAT,!1,0,0),n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,p),n.bufferData(n.ELEMENT_ARRAY_BUFFER,a,n.STATIC_DRAW),n.bindVertexArray(null)},y=document.createElement(`canvas`);y.width=1,y.height=1;let b=y.getContext(`2d`,{willReadFrequently:!0}),S=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches??!1,D={clock:0,swell:0,lights:0,frame:0,nextRipple:1.2,ripples:[],intro:$.current.intro&&!S?0:l,width:1,height:1,colorKey:``,color:[.07,.06,.09],accent:[1,.31,.72],second:[.23,.42,1],pointer:{x:0,y:0,inside:!1},hover:{x:0,z:0,vx:0,vz:0,presence:0,placed:!1},look:{x:0,y:0,vx:0,vy:0},seed:1,camera:null},O=0,k=0,A=!0,j=!0,M=(e,t)=>{if(!b||!e)return t;let n=/^[0-9a-f]{3,8}$/i.test(e)?`#${e}`:e;b.clearRect(0,0,1,1),b.fillStyle=`#000000`,b.fillStyle=n,b.fillRect(0,0,1,1);let[r,i,a]=b.getImageData(0,0,1,1).data;return[r/255,i/255,a/255]},N=e=>{let t=`${e.color}|${e.accentColor}|${e.secondaryColor}`;t!==D.colorKey&&(D.colorKey=t,D.color=M(e.color,[.07,.06,.09]),D.accent=M(e.accentColor,[1,.31,.72]),D.second=M(e.secondaryColor,[.23,.42,1]))},P=()=>(D.seed=D.seed*16807%2147483647,(D.seed-1)/2147483646),F=e=>{let t=D.width/Math.max(D.height,1),n=8/e.zoom,r=D.look.x*.16,i=1.5-e.tilt*1.26+D.look.y*.05,a=[f[0],0,f[1]],o=[a[0]+Math.sin(r)*Math.cos(i)*n,a[1]+Math.sin(i)*n,a[2]+Math.cos(r)*Math.cos(i)*n],s=E(w(.8,t,.1,400),T(o,a));return{eye:o,target:a,viewProj:s,inverse:ne(s),distance:n}},I=new Float32Array(32),L=()=>{let e=$.current;g(e.mesh),N(e);let a=F(e);D.camera=a,n.viewport(0,0,t.width,t.height),n.clearColor(0,0,0,0),n.clearDepth(1),n.clear(n.COLOR_BUFFER_BIT|n.DEPTH_BUFFER_BIT),n.enable(n.DEPTH_TEST),n.depthFunc(n.LEQUAL),n.useProgram(r.program);let o=r.uniforms;I.fill(0),D.ripples.forEach((e,t)=>{I[t*4]=e.x,I[t*4+1]=e.z,I[t*4+2]=e.start,I[t*4+3]=e.strength});let c=D.intro,p=c<l,m=x(c/u)*d,_=ee(c/l);n.uniform4fv(o.uRipples,I),n.uniform4f(o.uWave,.55*e.pulse,3*Math.max(e.pulseSpeed,.05)+1.2,1.6*e.pulseWidth,46),n.uniform1f(o.uSquare,e.square),n.uniform1f(o.uClock,D.clock),n.uniform4f(o.uSwell,1.3*e.waves*(.25+.75*_),1.9/e.waveScale,0,D.swell),n.uniform4f(o.uHover,D.hover.x,D.hover.z,3*e.mouseRadius/.35,.7*D.hover.presence*e.mouseStrength*e.hover),n.uniform4f(o.uIntro,f[0],f[1],m,p?.9*(1-te(.55,1,c/l)):0),n.uniformMatrix4fv(o.uViewProj,!1,a.viewProj),n.uniform4f(o.uArea,s[0]+f[0],s[1]+f[1],s[2],s[3]),n.uniform3f(o.uEye,a.eye[0],a.eye[1],a.eye[2]),n.uniform3f(o.uColor,D.color[0],D.color[1],D.color[2]),n.uniform3f(o.uAccent,D.accent[0],D.accent[1],D.accent[2]),n.uniform3f(o.uSecond,D.second[0],D.second[1],D.second[2]);let v=D.lights,y=a.distance/8,b=.35+.65*_,[S,C]=e.lights;n.uniform3f(o.uLightA,a.target[0]+(S[0]+Math.sin(v*.7)*S[3])*y,S[1]*y*b+.6,a.target[2]+(S[2]+Math.cos(v*.5)*S[4])*y),n.uniform3f(o.uLightB,a.target[0]+(C[0]+Math.cos(v*.6)*C[3])*y,C[1]*y*b+.6,a.target[2]+(C[2]+Math.sin(v*.45)*C[4])*y),n.uniform1f(o.uTile,1.2*e.tileSize),n.uniform1f(o.uAngle,e.rotation),n.uniform1f(o.uGap,e.gap),n.uniform1f(o.uRound,e.roundness),n.uniform1f(o.uSoftness,e.softness),n.uniform1f(o.uBulge,e.bulge),n.uniform1f(o.uGloss,e.gloss);let w=Math.min(e.depth*3.2*y,s[3]*.62);n.uniform2f(o.uRange,w*.5,w),n.uniform1f(o.uBrightness,e.brightness);let T=t.height/Math.max(D.height,1);n.uniform1f(o.uGrain,e.grain),n.uniform1f(o.uGrainScale,Math.max(1,T)),n.uniform1f(o.uLightMode,+!!e.lightMode),n.uniform1f(o.uOpacity,e.opacity),n.uniform4f(o.uReveal,f[0],f[1],m,+!p),n.uniform2f(o.uView,t.width,t.height),n.uniform1f(o.uFade,e.fade),n.uniform1f(o.uFrame,D.frame%977),n.bindVertexArray(i),n.drawElements(n.TRIANGLES,h,n.UNSIGNED_INT,0),n.bindVertexArray(null),n.disable(n.DEPTH_TEST)},R=()=>{let n=$.current,r=Math.max(1,e.clientWidth),i=Math.max(1,e.clientHeight),a=Math.min(n.dpr||window.devicePixelRatio||1,2),o=Math.max(r,i)*a,s=o>c?a*c/o:a,l=Math.max(1,Math.round(r*s)),u=Math.max(1,Math.round(i*s));(t.width!==l||t.height!==u)&&(t.width=l,t.height=u),D.width=r,D.height=i,L()},z=(e,t)=>{let n=D.camera;if(!n)return null;let r=e/D.width*2-1,i=1-t/D.height*2,a=n.inverse,o=a[0]*r+a[4]*i+a[8]+a[12],s=a[1]*r+a[5]*i+a[9]+a[13],c=a[2]*r+a[6]*i+a[10]+a[14],l=a[3]*r+a[7]*i+a[11]+a[15],u=o/l-n.eye[0],d=s/l-n.eye[1],f=c/l-n.eye[2];if(d>=-1e-4)return null;let p=-n.eye[1]/d;return{x:n.eye[0]+u*p,z:n.eye[2]+f*p}},B=(e,t,n)=>{for(D.ripples.push({x:e,z:t,start:D.clock,strength:n});D.ripples.length>a;)D.ripples.shift()},V=e=>{if(O=0,!j||!A||document.hidden)return;let t=$.current,n=k?Math.min(.05,(e-k)/1e3):1/60;k=e;let r=!t.paused&&!S;if(r){D.frame+=1,D.clock+=n,D.intro+=n,D.swell+=n*t.speed,D.lights+=n*t.speed*.6;let e=3*Math.max(t.pulseSpeed,.05)+1.2,r=10*t.pulseSpacing/e;if(t.pulse>0&&D.clock>=D.nextRipple){if(t.randomOrigin){let e=z((.15+P()*.7)*D.width,(.25+P()*.6)*D.height);e&&B(e.x,e.z,1)}else B(f[0],f[1],1);D.nextRipple=D.clock+r*(t.randomOrigin?.6:1)}let i=46/e+1;D.ripples=D.ripples.filter(e=>D.clock-e.start<i)}else D.intro<l&&(D.intro=l);let{pointer:i,hover:a,look:o}=D,s=t.mouseInteraction&&i.inside&&!S,c=s&&t.hover!==0?z(i.x,i.y):null;c&&(a.placed||(a.x=c.x,a.z=c.z,a.vx=0,a.vz=0,a.placed=!0),a.vx+=(90*(c.x-a.x)-19*a.vx)*n,a.vz+=(90*(c.z-a.z)-19*a.vz)*n,a.x+=a.vx*n,a.z+=a.vz*n);let u=+!!c;a.presence+=(u-a.presence)*(1-Math.exp(-n/(u>a.presence?.35:.6))),!c&&a.presence<.001&&(a.placed=!1);let d=s?(i.x/D.width-.5)*.5:0,p=s?(.5-i.y/D.height)*.5:0;o.vx+=(30*(d-o.x)-11*o.vx)*n,o.vy+=(30*(p-o.y)-11*o.vy)*n,o.x+=o.vx*n,o.y+=o.vy*n,L();let m=Math.abs(u-a.presence)>.002||Math.hypot(a.vx,a.vz)>.01||Math.abs(d-o.x)>2e-4||Math.abs(p-o.y)>2e-4;r||m?O=requestAnimationFrame(V):k=0},H=()=>{!O&&j&&A&&!document.hidden&&(O=requestAnimationFrame(V))},U=t=>{let n=e.getBoundingClientRect(),r=t.clientX-n.left,i=t.clientY-n.top;D.pointer.x=r,D.pointer.y=i,D.pointer.inside=r>=0&&i>=0&&r<=n.width&&i<=n.height,H()},W=t=>{let n=$.current;if(!n.mouseInteraction||!n.pulseOnClick||t.button!==0||S||t.target instanceof Element&&t.target.closest(`a, button, input, textarea, select, label, [role="button"]`))return;let r=e.getBoundingClientRect(),i=t.clientX-r.left,a=t.clientY-r.top;if(i<0||a<0||i>r.width||a>r.height)return;let o=z(i,a);o&&B(o.x,o.z,1.15),H()},G=()=>{D.pointer.inside=!1,H()},K=()=>{k=0,H()},q=new ResizeObserver(R);q.observe(e);let J=new IntersectionObserver(e=>{A=e.some(e=>e.isIntersecting),A&&(k=0,H())});return J.observe(e),window.addEventListener(`pointermove`,U,{passive:!0}),window.addEventListener(`pointerdown`,W),document.documentElement.addEventListener(`pointerleave`,G),document.addEventListener(`visibilitychange`,K),R(),H(),Z.current=()=>{O||L(),H()},()=>{j=!1,cancelAnimationFrame(O),Z.current=null,q.disconnect(),J.disconnect(),window.removeEventListener(`pointermove`,U),window.removeEventListener(`pointerdown`,W),document.documentElement.removeEventListener(`pointerleave`,G),document.removeEventListener(`visibilitychange`,K),n.deleteBuffer(o),n.deleteBuffer(p),n.deleteVertexArray(i),n.deleteProgram(r.program)}},[]),(0,r.useEffect)(()=>{Z.current?.()});let{className:pe=``,...me}=fe;return(0,i.jsx)(`div`,{ref:Y,className:[`relative h-full w-full overflow-hidden`,pe].filter(Boolean).join(` `),...me,children:(0,i.jsx)(`canvas`,{ref:X,className:`absolute inset-0 block h-full w-full`,"aria-hidden":`true`})})};export{D as default};