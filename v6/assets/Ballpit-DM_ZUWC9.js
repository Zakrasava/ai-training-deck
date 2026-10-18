import{i as e,t}from"./react-sySUN5R7.js";import{k as n}from"./sculpture-dark-CKiqtzhU.js";var r=e(t(),1),i=n(),a=50,o=20,s=1.5,c=16,l=12,u=.01,d={satin:{roughness:.42,metalness:0,coat:.35,coatRoughness:.22,scatter:1,frost:0},matte:{roughness:.92,metalness:0,coat:0,coatRoughness:.5,scatter:.5,frost:0},gloss:{roughness:.2,metalness:0,coat:1,coatRoughness:.08,scatter:1,frost:0},frosted:{roughness:.55,metalness:0,coat:.6,coatRoughness:.18,scatter:1.5,frost:1},metal:{roughness:.3,metalness:1,coat:0,coatRoughness:.2,scatter:0,frost:0}},f=`#version 300 es
precision highp float;
layout(location = 0) in vec2 aCorner;
layout(location = 1) in vec4 aSphere;
layout(location = 2) in vec4 aColor;
layout(location = 3) in vec4 aShade;
uniform mat4 uProj;
uniform float uCameraZ;
uniform float uPixel;
out vec3 vPoint;
flat out vec3 vCenter;
flat out float vRadius;
flat out vec4 vColor;
flat out vec4 vShade;
void main() {
  vec3 c = vec3(aSphere.xy, aSphere.z - uCameraZ);
  float r = aSphere.w;
  float d = length(c);
  vec3 toCamera = -c / d;
  vec3 right = normalize(cross(vec3(0.0, 1.0, 0.0), toCamera));
  vec3 up = cross(toCamera, right);
  float reach = r * d / sqrt(max(d * d - r * r, 1e-4)) + uPixel * d * 2.0;
  vec3 p = c + (right * aCorner.x + up * aCorner.y) * reach;
  vPoint = p;
  vCenter = c;
  vRadius = r;
  vColor = aColor;
  vShade = aShade;
  gl_Position = uProj * vec4(p, 1.0);
}`,p=`#version 300 es
precision highp float;
in vec3 vPoint;
flat in vec3 vCenter;
flat in float vRadius;
flat in vec4 vColor;
flat in vec4 vShade;
uniform mat4 uProj;
uniform vec3 uLightPos;
uniform vec3 uLight;
uniform float uExposure;
uniform float uShadow;
uniform vec4 uSurface;
uniform vec2 uExtra;
out vec4 outColor;

const float PI = 3.14159265;

float lobe(vec3 d, vec3 axis, float sharp) {
  return pow(max(dot(d, axis), 0.0), sharp) * (sharp + 1.0) * 0.16;
}

vec3 studio(vec3 d, float rough) {
  float r = clamp(rough, 0.0, 1.0);
  float sharp = mix(60.0, 1.2, sqrt(r));
  vec3 col = mix(vec3(0.085, 0.085, 0.09), vec3(0.38, 0.38, 0.39), smoothstep(-0.7, 0.9, d.y));
  col += vec3(1.0, 0.99, 0.97) * 2.6 * lobe(d, normalize(vec3(-0.42, 0.78, 0.47)), sharp);
  col += vec3(0.97, 0.98, 1.0) * 1.1 * lobe(d, normalize(vec3(0.78, 0.22, 0.58)), sharp * 0.7);
  col += vec3(1.0) * 1.3 * lobe(d, normalize(vec3(0.15, 0.55, -0.82)), sharp * 0.8);
  return col;
}

vec2 envBRDF(float NoV, float rough) {
  vec4 c0 = vec4(-1.0, -0.0275, -0.572, 0.022);
  vec4 c1 = vec4(1.0, 0.0425, 1.04, -0.04);
  vec4 r = rough * c0 + c1;
  float a = min(r.x * r.x, exp2(-9.28 * NoV)) * r.x + r.y;
  return vec2(-1.04, 1.04) * a + r.zw;
}

float ggx(float NoH, float a) {
  float a2 = a * a;
  float d = NoH * NoH * (a2 - 1.0) + 1.0;
  return a2 / (PI * d * d);
}

float smith(float NoV, float NoL, float a) {
  float k = a * 0.5;
  return 0.25 / max((NoV * (1.0 - k) + k) * (NoL * (1.0 - k) + k), 1e-4);
}

vec3 aces(vec3 x) {
  return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
}

void main() {
  vec3 rd = normalize(vPoint);
  float b = dot(vCenter, rd);
  float h = length(vCenter - rd * b);
  float r = vRadius;
  float aa = max(fwidth(h), 1e-5);
  float cover = clamp((r - h) / aa + 0.5, 0.0, 1.0);
  if (cover <= 0.002) discard;
  float hc = min(h, r * 0.9995);
  float t = b - sqrt(r * r - hc * hc);
  vec3 pos = rd * t;
  vec3 n = normalize(pos - vCenter);
  vec4 clip = uProj * vec4(pos, 1.0);
  gl_FragDepth = clamp(clip.z / clip.w * 0.5 + 0.5, 0.0, 1.0);

  vec3 v = -rd;
  vec3 albedo = vColor.rgb;
  bool lamp = vColor.a > 0.5;
  vec3 dn = fwidth(n);
  float rough = sqrt(min(uSurface.x * uSurface.x + dot(dn, dn) * 0.6, 1.0));
  float metal = uSurface.y;
  float coat = uSurface.z;
  float coatRough = sqrt(min(uSurface.w * uSurface.w + dot(dn, dn) * 0.6, 1.0));
  float NoV = clamp(dot(n, v), 1e-4, 1.0);
  vec3 R = reflect(-v, n);

  float occlusion = vShade.w * smoothstep(-0.15, 0.9, dot(n, vShade.xyz));
  float ao = 1.0 - uShadow * occlusion;
  float specAo = 1.0 - uShadow * occlusion * 0.7;

  vec3 L = uLightPos - pos;
  float dist2 = dot(L, L);
  L *= inversesqrt(dist2);
  vec3 radiance = lamp ? vec3(0.0) : uLight / (dist2 + 1.0);
  float NoL = clamp(dot(n, L), 0.0, 1.0);
  vec3 H = normalize(L + v);
  float NoH = clamp(dot(n, H), 0.0, 1.0);
  float VoH = clamp(dot(v, H), 0.0, 1.0);

  vec3 F0 = mix(vec3(0.04), albedo, metal);
  vec2 ab = envBRDF(NoV, rough);
  vec3 Fr = max(vec3(1.0 - rough), F0) - F0;
  vec3 kS = F0 + Fr * pow(1.0 - NoV, 5.0);
  vec3 diffuseColor = albedo * (1.0 - metal);
  vec3 irradiance = studio(n, 1.0) * 1.15;
  vec3 envSpec = studio(R, rough) * (F0 * ab.x + ab.y);
  vec3 col = diffuseColor * irradiance * (1.0 - kS) * ao + envSpec * specAo;
  vec3 F = F0 + (1.0 - F0) * pow(1.0 - VoH, 5.0);
  float a = max(rough * rough, 0.06);
  vec3 spec = ggx(NoH, a) * smith(NoV, NoL, a) * F;
  float wrap = clamp((dot(n, L) + 0.3) / 1.3, 0.0, 1.0);
  col += (diffuseColor * (1.0 - F) / PI * wrap + spec * NoL) * radiance;
  vec3 sh = normalize(L + n * 0.1);
  float scatter = pow(clamp(dot(v, -sh), 0.0, 1.0), 2.0) * 10.0 + 0.04;
  col += scatter * albedo * radiance * 0.03 * uExtra.x;
  float alpha = 1.0;
  if (uExtra.y > 0.5) {
    float rim = pow(1.0 - NoV, 2.5);
    col += albedo * (studio(-R, 1.0) * 0.35 + 0.06) * (1.0 - rim);
    col += radiance * albedo * pow(max(dot(-v, L), 0.0), 3.0) * 0.08;
    alpha = mix(0.5, 0.96, rim);
  }
  if (coat > 0.0) {
    float Fc = 0.04 + 0.96 * pow(1.0 - NoV, 5.0);
    float ca = max(coatRough * coatRough, 0.03);
    vec3 coatEnv = studio(R, coatRough) * Fc;
    float coatSpec = ggx(NoH, ca) * smith(NoV, NoL, ca) * (0.04 + 0.96 * pow(1.0 - VoH, 5.0)) * NoL;
    col = col * (1.0 - Fc * coat) + (coatEnv * specAo + radiance * coatSpec) * coat;
    alpha = mix(alpha, 1.0, Fc * coat);
  }
  if (lamp) col += uLight * 0.0025 * (0.4 + 0.6 * albedo);
  col = aces(col * uExposure);
  col = pow(col, vec3(1.0 / 2.2));
  col += (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) / 255.0;
  float a2 = alpha * cover;
  outColor = vec4(col * a2, a2);
}`,m=(e,t,n)=>Math.min(n,Math.max(t,e)),h=(e,t,n)=>{let r=e.createShader(t);return r?(e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(e.deleteShader(r),null)):null},g=e=>{let t=h(e,e.VERTEX_SHADER,f),n=h(e,e.FRAGMENT_SHADER,p),r=e.createProgram();if(!t||!n||!r)return null;if(e.attachShader(r,t),e.attachShader(r,n),e.linkProgram(r),e.deleteShader(t),e.deleteShader(n),!e.getProgramParameter(r,e.LINK_STATUS))return e.deleteProgram(r),null;let i={},a=e.getProgramParameter(r,e.ACTIVE_UNIFORMS);for(let t=0;t<a;t++){let n=e.getActiveUniform(r,t);n&&(i[n.name]=e.getUniformLocation(r,n.name))}return{program:r,uniforms:i}},_=e=>{let t;if(typeof e==`number`)t=[(e>>16&255)/255,(e>>8&255)/255,(e&255)/255];else{let n=String(e||`#ffffff`).replace(`#`,``).trim();(n.length===3||n.length===4)&&(n=n.slice(0,3).split(``).map(e=>e+e).join(``));let r=parseInt(n.slice(0,6),16);t=Number.isNaN(r)?[1,1,1]:[(r>>16&255)/255,(r>>8&255)/255,(r&255)/255]}return t.map(e=>e**2.2)},v=({count:e=200,colors:t=[`#ffffff`],material:n=`satin`,minSize:f=.5,maxSize:p=1,gravity:h=.5,friction:v=.9975,wallBounce:y=.95,bounce:b=.85,depth:x=2,drift:S=0,followCursor:C=!0,cursorSize:w=1,grab:T=!0,clickEffect:E=`burst`,lightColor:D=`#ffffff`,lightIntensity:O=1,exposure:k=1,shadows:A=.6,intro:j=!0,dpr:M,className:N=``,style:P})=>{let ee=(0,r.useRef)(null),te=(0,r.useRef)(null),ne=(0,r.useRef)(null),F={count:Math.round(m(e,1,4e3)),colors:Array.isArray(t)&&t.length?t:[`#ffffff`],material:d[n]?n:`satin`,minSize:Math.max(.05,Math.min(f,p)),maxSize:Math.max(.05,Math.max(f,p)),gravity:h,friction:m(v,.5,1),wallBounce:m(y,0,1),bounce:m(b,0,1),depth:Math.max(0,x),drift:Math.max(0,S),followCursor:C,cursorSize:Math.max(0,w),grab:T,clickEffect:E,lightColor:D,lightIntensity:O>20?O/200:Math.max(0,O),exposure:Math.max(0,k),shadows:m(A,0,1),intro:j,dpr:M},I=(0,r.useRef)(F);return I.current=F,(0,r.useEffect)(()=>{let e=ee.current,t=te.current,n=t?.getContext(`webgl2`,{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!0,stencil:!1,powerPreference:`high-performance`});if(!e||!t||!n)return;let r=g(n);if(!r)return;let i=r.uniforms,f=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches??!1,p={width:1,height:1,ratio:1,halfW:9,halfH:9,fit:1,tan:Math.tan(a*Math.PI/360)},h=new Float32Array(16),v=n.createVertexArray();n.bindVertexArray(v);let y=n.createBuffer();n.bindBuffer(n.ARRAY_BUFFER,y),n.bufferData(n.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),n.STATIC_DRAW),n.enableVertexAttribArray(0),n.vertexAttribPointer(0,2,n.FLOAT,!1,0,0);let b=n.createBuffer();n.bindBuffer(n.ARRAY_BUFFER,b);for(let e=0;e<3;e++)n.enableVertexAttribArray(1+e),n.vertexAttribPointer(1+e,4,n.FLOAT,!1,48,e*16),n.vertexAttribDivisor(1+e,1);n.bindVertexArray(null);let x=0,S=0,C=new Float32Array,w=new Float32Array,T=new Float32Array,E=new Float32Array,D=new Float32Array,O=new Float32Array,k=new Float32Array,A=new Float32Array,j=new Float32Array,M=new Float32Array,N=new Float32Array,P=new Float32Array,F=new Uint16Array,L=new Uint8Array,re=new Int32Array,ie=new Int32Array,R=new Int32Array(1),z=new Float32Array(l),B=new Int32Array(2),ae=new Int32Array(2),oe=[],se=``,ce=``,le=e=>{let t=(t,n=1)=>{let r=new Float32Array(e*n);return r.set(t.subarray(0,Math.min(t.length,r.length))),r},r=t=>{let n=new Uint8Array(e);return n.set(t.subarray(0,Math.min(t.length,n.length))),n};C=t(C),w=t(w),T=t(T),E=t(E),D=t(D),O=t(O),k=t(k),A=t(A),j=t(j),M=t(M),N=t(N,4),P=t(P,3);let i=new Uint16Array(e);i.set(F.subarray(0,Math.min(F.length,e))),F=i,L=r(L),re=new Int32Array(e),ie=new Int32Array(e),R=new Int32Array(e+1),z=new Float32Array((e+1)*l),x=e,n.bindBuffer(n.ARRAY_BUFFER,b),n.bufferData(n.ARRAY_BUFFER,z.byteLength,n.DYNAMIC_DRAW)},V={x:0,y:0,inside:!1,down:!1,downX:0,downY:0,downAt:0,moved:!1},H={x:0,y:0,z:0,r:0,tx:0,ty:0,vx:0,vy:0},U={x:0,y:5,z:6,flash:0},W={index:-1,ox:0,oy:0,tx:0,ty:0,vx:0,vy:0},G=0,K=0,q=0,J=0,ue=!0,de=0,fe=(e,t,n)=>{let r=k[e],i=Math.max(t.depth-r,0);if(L[e]=1,n&&t.gravity>.05)C[e]=(Math.random()*2-1)*Math.max(p.halfW-r,.01),w[e]=p.halfH+r+Math.random()*p.halfH*2.2,T[e]=(Math.random()*2-1)*i,E[e]=(Math.random()-.5)*2,D[e]=-(4+Math.random()*5),O[e]=0,L[e]=0;else if(n){let t=(Math.random()*2-1)*Math.max(p.halfW-r,.01),n=(Math.random()*2-1)*Math.max(p.halfH-r,.01),a=(Math.random()*2-1)*i;C[e]=(Math.random()*2-1)*.6,w[e]=(Math.random()*2-1)*.6,T[e]=(Math.random()*2-1)*Math.min(i,.3),E[e]=(t-C[e])*2.2,D[e]=(n-w[e])*2.2,O[e]=(a-T[e])*2.2,K=1}else C[e]=(Math.random()*2-1)*Math.max(p.halfW-r,.01),w[e]=(Math.random()*2-1)*Math.max(p.halfH-r,.01),T[e]=(Math.random()*2-1)*i,E[e]=0,D[e]=0,O[e]=0},pe=e=>{for(let t=0;t<S;t++)k[t]=(e.minSize+j[t]*(e.maxSize-e.minSize))*p.fit,A[t]=1/(k[t]*k[t]*k[t])},me=e=>{oe=e.colors.map(_),se=e.colors.join(`|`)},he=(e,t)=>{let n=`${e.minSize}:${e.maxSize}:${p.fit}`;if(e.count!==S){e.count>x&&le(Math.max(e.count,Math.ceil(x*1.5)));let n=S;S=e.count;for(let r=n;r<S;r++)j[r]=Math.random(),F[r]=r,M[r]=Math.random()*Math.PI*2,k[r]=(e.minSize+j[r]*(e.maxSize-e.minSize))*p.fit,A[r]=1/(k[r]*k[r]*k[r]),fe(r,e,(!t||e.intro)&&!f);for(let e=0;e<=S;e++)R[e]=e}n!==ce&&(ce=n,pe(e)),e.colors.join(`|`)!==se&&me(e)},Y=new Float32Array,X=0,Z={scale:1,x0:0,y0:0,z0:0,nx:1,ny:1,nz:1},ge=(e,t)=>{Z.scale=1/e,Z.x0=-p.halfW-e,Z.y0=-p.halfH-e,Z.z0=-Math.max(t.depth,t.maxSize)-e,Z.nx=Math.max(1,Math.ceil((p.halfW*2+e*2)*Z.scale)+1),Z.ny=Math.max(1,Math.ceil((p.halfH*2+e*2)*Z.scale)+1),Z.nz=Math.max(1,Math.ceil((Math.max(t.depth,t.maxSize)*2+e*2)*Z.scale)+1);let n=Z.nx*Z.ny*Z.nz;B.length<n+1&&(B=new Int32Array(n+1),ae=new Int32Array(n+1)),B.fill(0,0,n+1);for(let e=0;e<S;e++){let t=m(Math.floor((C[e]-Z.x0)*Z.scale),0,Z.nx-1),n=m(Math.floor((w[e]-Z.y0)*Z.scale),0,Z.ny-1),r=(m(Math.floor((T[e]-Z.z0)*Z.scale),0,Z.nz-1)*Z.ny+n)*Z.nx+t;re[e]=r,B[r+1]++}for(let e=1;e<=n;e++)B[e]+=B[e-1];ae.set(B.subarray(0,n+1));for(let e=0;e<S;e++)ie[ae[re[e]]++]=e},Q=(e,t,n,r,i,a,o)=>{if(t>=o||X*8>=Y.length)return;let s=E[e]*n+D[e]*r+O[e]*i,c=X*8;Y[c]=e,Y[c+1]=-2,Y[c+2]=n,Y[c+3]=r,Y[c+4]=i,Y[c+5]=t,Y[c+6]=s<-1.5?-a*s:0,Y[c+7]=0,X++},_e=(e,t,n,r)=>{let i=W.index,{nx:a,ny:o,nz:s}=Z;X=0;for(let t=0;t<S;t++){let c=re[t],l=c%a,u=Math.floor(c/a)%o,d=Math.floor(c/(a*o));for(let c=d>0?-1:0;c<=+(d<s-1);c++)for(let s=u>0?-1:0;s<=+(u<o-1);s++){let f=((d+c)*o+u+s)*a;for(let o=l>0?-1:0;o<=+(l<a-1);o++){let a=f+l+o;for(let o=B[a];o<B[a+1];o++){let a=ie[o];if(a<=t)continue;let s=C[a]-C[t],c=w[a]-w[t],l=T[a]-T[t],u=s*s+c*c+l*l,d=k[t]+k[a],f=Math.max(d+r,n?d*1.4:0);if(u>=f*f||u<1e-12)continue;let p=Math.sqrt(u),h=s/p,g=c/p,_=l/p;if(n){let e=m(1-(p-d)/(d*.4),0,1);N[t*4]+=h*e,N[t*4+1]+=g*e,N[t*4+2]+=_*e,N[t*4+3]+=e,N[a*4]-=h*e,N[a*4+1]-=g*e,N[a*4+2]-=_*e,N[a*4+3]+=e}if(p>=d+r||X*8>=Y.length||t===i&&a===i)continue;let v=(E[a]-E[t])*h+(D[a]-D[t])*g+(O[a]-O[t])*_,y=X*8;Y[y]=t,Y[y+1]=a,Y[y+2]=h,Y[y+3]=g,Y[y+4]=_,Y[y+5]=p-d,Y[y+6]=v<-1.5?-e.bounce*v:0,Y[y+7]=0,X++}}}if(t!==i){let n=k[t],i=Math.max(e.depth-n,0);Q(t,C[t]+p.halfW-n,1,0,0,e.wallBounce,r),Q(t,p.halfW-n-C[t],-1,0,0,e.wallBounce,r),Q(t,w[t]+p.halfH-n,0,1,0,e.wallBounce,r),L[t]&&Q(t,p.halfH-n-w[t],0,-1,0,e.wallBounce,r),Q(t,T[t]+i,0,0,1,e.wallBounce,r),Q(t,i-T[t],0,0,-1,e.wallBounce,r)}if(H.r>.01&&t!==i&&X*8<Y.length){let n=C[t]-H.x,i=w[t]-H.y,a=T[t]-H.z,o=k[t]+H.r,s=n*n+i*i+a*a;if(s<(o+r)*(o+r)&&s>1e-12){let r=Math.sqrt(s),c=n/r,l=i/r,u=a/r,d=(E[t]-H.vx)*c+(D[t]-H.vy)*l+O[t]*u,f=X*8;Y[f]=t,Y[f+1]=-1,Y[f+2]=c,Y[f+3]=l,Y[f+4]=u,Y[f+5]=r-o,Y[f+6]=d<-1.5?-e.bounce*d:0,Y[f+7]=0,X++}}}},ve=e=>{let t=W.index,n=S>800?5:8;for(let r=0;r<n;r++)for(let n=0;n<X;n++){let r=n*8,i=Y[r],a=Y[r+1],o=Y[r+2],s=Y[r+3],c=Y[r+4],l=Y[r+5],u=l>0?-l/e:Y[r+6],d=Y[r+7];if(a<0){let e=a===-1?(E[i]-H.vx)*o+(D[i]-H.vy)*s+O[i]*c:E[i]*o+D[i]*s+O[i]*c,t=Math.max(d+u-e,0),n=t-d;Y[r+7]=t,E[i]+=n*o,D[i]+=n*s,O[i]+=n*c;continue}let f=i===t?0:A[i],p=a===t?0:A[a],m=f+p;if(m<=0)continue;let h=(E[a]-E[i])*o+(D[a]-D[i])*s+(O[a]-O[i])*c,g=Math.max(d+(u-h)/m,0),_=g-d;Y[r+7]=g,E[i]-=_*f*o,D[i]-=_*f*s,O[i]-=_*f*c,E[a]+=_*p*o,D[a]+=_*p*s,O[a]+=_*p*c}},ye=()=>{let e=W.index;for(let t=0;t<2;t++)for(let t=0;t<X;t++){let n=t*8,r=Y[n],i=Y[n+1];if(i===-2)continue;if(i<0){let e=C[r]-H.x,t=w[r]-H.y,n=T[r]-H.z,i=Math.sqrt(e*e+t*t+n*n),a=k[r]+H.r-i-u;if(a<=0||i<1e-6)continue;let o=a*.5/i;C[r]+=e*o,w[r]+=t*o,T[r]+=n*o;continue}let a=C[i]-C[r],o=w[i]-w[r],s=T[i]-T[r],c=Math.sqrt(a*a+o*o+s*s),l=k[r]+k[i]-c-u;if(l<=0||c<1e-6)continue;let d=r===e?0:A[r],f=i===e?0:A[i],p=d+f;if(p<=0)continue;let m=l*.3/(c*p);C[r]-=a*m*d,w[r]-=o*m*d,T[r]-=s*m*d,C[i]+=a*m*f,w[i]+=o*m*f,T[i]+=s*m*f}},be=e=>{let t=p.halfW,n=p.halfH,r=e.wallBounce;for(let i=0;i<S;i++){let a=k[i];C[i]<-t+a?(C[i]=-t+a,E[i]<0&&(E[i]=E[i]<-1.5?-E[i]*r:0)):C[i]>t-a&&(C[i]=t-a,E[i]>0&&(E[i]=E[i]>1.5?-E[i]*r:0)),w[i]<-n+a?(w[i]=-n+a,D[i]<0&&(D[i]=D[i]<-1.5?-D[i]*r:0),E[i]*=.995,O[i]*=.995):L[i]&&w[i]>n-a&&(w[i]=n-a,D[i]>0&&(D[i]=D[i]>1.5?-D[i]*r:0)),!L[i]&&w[i]<n-a&&(L[i]=1);let o=Math.max(e.depth-a,0);T[i]<-o?(T[i]=-o,O[i]<0&&(O[i]=O[i]<-1.5?-O[i]*r:0)):T[i]>o&&(T[i]=o,O[i]>0&&(O[i]=O[i]>1.5?-O[i]*r:0))}},xe=(e,t,n)=>{let r=e.gravity*45,i=e.friction**(t*60)*(K>0?Math.exp(-2.2*t):1),a=f?0:e.drift*2.2,o=e.maxSize*p.fit,s=o*.3;Y.length<S*96&&(Y=new Float32Array(S*96));for(let e=0;e<S;e++){if(e===W.index){let n=1-Math.exp(-t/.02);E[e]=(W.tx-C[e])*n/t,D[e]=(W.ty-w[e])*n/t,O[e]=0;continue}if(D[e]-=r*t,a){let n=M[e];E[e]+=Math.sin(G*.63+n)*a*t,D[e]+=Math.cos(G*.47+n*1.7)*a*t,O[e]+=Math.sin(G*.41+n*2.3)*a*t*.5}E[e]*=i,D[e]*=i,O[e]*=i;let n=E[e]*E[e]+D[e]*D[e]+O[e]*O[e];if(n>256){let t=c/Math.sqrt(n);E[e]*=t,D[e]*=t,O[e]*=t}}ge(o*(n?2.8:2.3),e),n&&N.fill(0,0,S*4),_e(e,t,n,s),ve(t);for(let e=0;e<S;e++)C[e]+=E[e]*t,w[e]+=D[e]*t,T[e]+=O[e]*t;if(ye(),be(e),n)for(let e=0;e<S;e++){let t=w[e]-k[e]+p.halfH,n=k[e]*.5;if(t>=n)continue;let r=1-Math.max(t,0)/n;N[e*4+1]-=r,N[e*4+3]+=r}if(W.index>=0){let e=W.index;W.vx+=(E[e]-W.vx)*(1-Math.exp(-t/.05)),W.vy+=(D[e]-W.vy)*(1-Math.exp(-t/.05))}},Se=(t,n)=>{let r=e.getBoundingClientRect(),i=(t-r.left)/Math.max(r.width,1)*2-1,a=1-(n-r.top)/Math.max(r.height,1)*2;return[i*p.tan*(p.width/p.height),a*p.tan,-1]},Ce=(e,t)=>{let n=(t-o)/e[2];return[e[0]*n,e[1]*n]},we=e=>{let t=Math.hypot(e[0],e[1],e[2]),n=e[0]/t,r=e[1]/t,i=e[2]/t,a=-1,s=1/0;for(let e=0;e<S;e++){let t=-C[e],c=-w[e],l=o-T[e],u=t*n+c*r+l*i,d=k[e]*1.15,f=t*t+c*c+l*l-d*d,p=u*u-f;if(p<0)continue;let m=-u-Math.sqrt(p);m>0&&m<s&&(s=m,a=e)}return a},Te=(e,t)=>{let n=I.current,r=p.halfH*.7;for(let n=0;n<S;n++){let i=C[n]-e,a=w[n]-t,o=T[n],s=Math.hypot(i,a,o);if(s>=r||s<1e-4)continue;let c=(1-s/r)**2*26*(1+.6/(k[n]+.4));E[n]+=i/s*c,D[n]+=a/s*c+c*.25,O[n]+=o/s*c*.5}U.x=e,U.y=t,U.z=Math.max(n.depth,1)+1.5,U.flash=1},Ee=I.current.dpr,De=()=>{let n=I.current;Ee=n.dpr,p.width=Math.max(1,e.clientWidth),p.height=Math.max(1,e.clientHeight),p.ratio=Math.min(n.dpr||window.devicePixelRatio||1,2),t.width=Math.max(1,Math.round(p.width*p.ratio)),t.height=Math.max(1,Math.round(p.height*p.ratio));let r=p.width/p.height,i=Math.tan(a*Math.PI/360);p.tan=r>s?i*s/r:i,p.halfH=p.tan*o,p.halfW=p.halfH*r,p.fit=m(Math.sqrt(p.halfW*p.halfH/(i*i*o*o*s)),.4,1);let c=1/p.tan;h.fill(0),h[0]=c/r,h[5]=c,h[10]=81/-79,h[11]=-1,h[14]=160/-79,S||he(n,!0),Oe(),$()},Oe=()=>{let e=I.current,a=d[e.material],s=0,c=S+1;for(let e=1;e<c;e++){let t=R[e],n=t===S?H.z:T[t],r=e-1;for(;r>=0&&(R[r]===S?H.z:T[R[r]])>n;)R[r+1]=R[r],r--;R[r+1]=t}for(let t=0;t<c;t++){let n=R[t],r=s*l;if(n===S){if(H.r<.01||!e.followCursor)continue;let t=oe[0]||[1,1,1];z[r]=H.x,z[r+1]=H.y,z[r+2]=H.z,z[r+3]=H.r,z[r+4]=t[0],z[r+5]=t[1],z[r+6]=t[2],z[r+7]=1,z[r+8]=0,z[r+9]=0,z[r+10]=0,z[r+11]=0}else{let e=oe[F[n]%oe.length];z[r]=C[n],z[r+1]=w[n],z[r+2]=T[n],z[r+3]=k[n],z[r+4]=e[0],z[r+5]=e[1],z[r+6]=e[2],z[r+7]=0;let t=N[n*4+3],i=Math.hypot(N[n*4],N[n*4+1],N[n*4+2])||1;z[r+8]=N[n*4]/i,z[r+9]=N[n*4+1]/i,z[r+10]=N[n*4+2]/i,z[r+11]=Math.min(t*.55,1)}s++}if(n.viewport(0,0,t.width,t.height),n.clearColor(0,0,0,0),n.clearDepth(1),n.clear(n.COLOR_BUFFER_BIT|n.DEPTH_BUFFER_BIT),!s)return;n.enable(n.DEPTH_TEST),n.depthFunc(n.LEQUAL),n.enable(n.BLEND),n.blendFunc(n.ONE,n.ONE_MINUS_SRC_ALPHA),n.useProgram(r.program),n.uniformMatrix4fv(i.uProj,!1,h),n.uniform1f(i.uCameraZ,o),n.uniform1f(i.uPixel,2*p.tan/t.height);let u=_(e.lightColor),f=e.lightIntensity*60*(1+U.flash*3);n.uniform3f(i.uLight,u[0]*f,u[1]*f,u[2]*f),n.uniform3f(i.uLightPos,U.x,U.y,U.z-o),n.uniform1f(i.uExposure,e.exposure),n.uniform1f(i.uShadow,e.shadows),n.uniform4f(i.uSurface,a.roughness,a.metalness,a.coat,a.coatRoughness),n.uniform2f(i.uExtra,a.scatter,a.frost),n.bindBuffer(n.ARRAY_BUFFER,b),n.bufferSubData(n.ARRAY_BUFFER,0,z,0,s*l),n.bindVertexArray(v),n.drawArraysInstanced(n.TRIANGLE_STRIP,0,4,s),n.bindVertexArray(null)},ke=e=>{if(q=0,!ue||document.hidden)return;let t=I.current;t.dpr!==Ee&&De();let n=J?m((e-J)/1e3,0,1/20):1/60;J=e,G+=n,K=Math.max(0,K-n),he(t,!1);let r=t.followCursor&&V.inside&&W.index<0?t.cursorSize*p.fit:0;H.r+=(r-H.r)*(1-Math.exp(-n/.12));let i=1-Math.exp(-n/.06),a=H.x,o=H.y;H.x+=(H.tx-H.x)*i,H.y+=(H.ty-H.y)*i,H.vx=m((H.x-a)/Math.max(n,.001),-16,c),H.vy=m((H.y-o)/Math.max(n,.001),-16,c);let s=p.halfH*.75,l=t.depth+4,u=V.inside?[H.x,H.y,t.followCursor?H.z:1.5]:U.flash>.05?[U.x,U.y,U.z]:[0,s,l],d=1-Math.exp(-n/.08);if(U.x+=(u[0]-U.x)*d,U.y+=(u[1]-U.y)*d,U.z+=(u[2]-U.z)*d,U.flash*=Math.exp(-n/.3),n>1e-4){let e=Math.min(6,Math.max(1,Math.ceil(n/(1/180)))),r=n/e;for(let n=0;n<e;n++)xe(t,r,n===e-1)}Oe();let h=0;for(let e=0;e<S;e++){let t=e*3,n=Math.abs(C[e]-P[t])+Math.abs(w[e]-P[t+1])+Math.abs(T[e]-P[t+2]);n>h&&(h=n),P[t]=C[e],P[t+1]=w[e],P[t+2]=T[e]}de=h/Math.max(n,.001)>.6||V.inside||W.index>=0||U.flash>.01||K>0||H.r>.01||t.drift>0&&!f?0:de+n,de<.8&&(q=requestAnimationFrame(ke))};function $(){de=0,!q&&ue&&!document.hidden&&(J=0,q=requestAnimationFrame(ke))}let Ae=t=>{let n=e.getBoundingClientRect(),r=t.clientX-n.left,i=t.clientY-n.top;return r>=0&&i>=0&&r<=n.width&&i<=n.height},je=e=>{let t=Se(e.clientX,e.clientY),[n,r]=Ce(t,H.z);if(H.tx=n,H.ty=r,W.index>=0){let[e,n]=Ce(t,T[W.index]);W.tx=e-W.ox,W.ty=n-W.oy}return t},Me=e=>{let t=V.inside;V.inside=Ae(e)||W.index>=0,V.inside&&(je(e),t||(H.x=H.tx,H.y=H.ty),V.down&&Math.hypot(e.clientX-V.downX,e.clientY-V.downY)>6&&(V.moved=!0)),(V.inside||t)&&$()},Ne=e=>e instanceof Element&&e.closest(`a, button, input, textarea, select, label, [role="button"]`),Pe=e=>{if(e.button!==0||!Ae(e)||Ne(e.target))return;let t=I.current;V.down=!0,V.moved=!1,V.downX=e.clientX,V.downY=e.clientY,V.downAt=performance.now();let n=je(e);if(t.grab){let t=we(n);if(t>=0){let[r,i]=Ce(n,T[t]);W.index=t,W.ox=r-C[t],W.oy=i-w[t],W.tx=C[t],W.ty=w[t],W.vx=0,W.vy=0,e.pointerType===`mouse`&&e.preventDefault()}}$()},Fe=e=>{let t=I.current;if(W.index>=0){let e=W.index,t=Math.hypot(W.vx,W.vy),n=t>22?22/t:1;E[e]=W.vx*n,D[e]=W.vy*n,W.index=-1,L[e]=1}else if(e&&V.down&&!V.moved&&performance.now()-V.downAt<400&&t.clickEffect===`burst`&&!f&&Ae(e)){let[t,n]=Ce(Se(e.clientX,e.clientY),0);Te(t,n)}V.down=!1,$()},Ie=e=>Fe(e),Le=()=>Fe(null),Re=()=>{V.inside=W.index>=0,$()},ze=()=>$(),Be=new ResizeObserver(De);Be.observe(e);let Ve=new IntersectionObserver(e=>{ue=e.some(e=>e.isIntersecting),ue&&$()});return Ve.observe(e),window.addEventListener(`pointermove`,Me,{passive:!0}),window.addEventListener(`pointerdown`,Pe),window.addEventListener(`pointerup`,Ie,{passive:!0}),window.addEventListener(`pointercancel`,Le,{passive:!0}),document.documentElement.addEventListener(`pointerleave`,Re),document.addEventListener(`visibilitychange`,ze),De(),ne.current=$,()=>{cancelAnimationFrame(q),ne.current=null,Be.disconnect(),Ve.disconnect(),window.removeEventListener(`pointermove`,Me),window.removeEventListener(`pointerdown`,Pe),window.removeEventListener(`pointerup`,Ie),window.removeEventListener(`pointercancel`,Le),document.documentElement.removeEventListener(`pointerleave`,Re),document.removeEventListener(`visibilitychange`,ze),n.deleteBuffer(y),n.deleteBuffer(b),n.deleteVertexArray(v),n.deleteProgram(r.program),n.getExtension(`WEBGL_lose_context`)?.loseContext()}},[]),(0,r.useEffect)(()=>{ne.current?.()}),(0,i.jsx)(`div`,{ref:ee,className:[`relative w-full h-full overflow-hidden`,N].filter(Boolean).join(` `),style:P,children:(0,i.jsx)(`canvas`,{ref:te,className:`block w-full h-full`,"aria-hidden":`true`})})};export{v as default};