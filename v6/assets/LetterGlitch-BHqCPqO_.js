import{i as e,t}from"./react-sySUN5R7.js";import{k as n}from"./sculpture-dark-CKiqtzhU.js";var r=e(t(),1),i=n(),a=`ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=/[]{};:<>.,0123456789`,o=`ui-monospace, 'SF Mono', 'JetBrains Mono', Menlo, Consolas, 'Liberation Mono', monospace`,s=[`#ffffff`,`#61dca3`],c=[`#18181b`,`#0f9f6e`],l=8,u=1.4,d=.2,f=.1,p=48,m=`#version 300 es
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`,h=`#version 300 es
precision highp float;
precision highp int;
uniform sampler2D uAtlas;
uniform sampler2D uState;
uniform ivec2 uCell;
uniform ivec2 uGrid;
uniform int uAtlasColumns;
uniform vec2 uResolution;
uniform vec2 uOrigin;
uniform vec3 uBase;
uniform float uBaseOpacity;
uniform vec3 uColors[8];
uniform float uEdge;
uniform float uCenter;
uniform vec2 uPointer;
uniform float uRadius;
uniform float uPresence;
uniform float uReveal;
uniform float uTime;
uniform float uFlow;
uniform float uFlowScale;
uniform vec4 uBackground;
out vec4 outColor;

float hash(vec2 p) {
  vec3 q = fract(vec3(p.xyx) * 0.1031);
  q += dot(q, q.yzx + 33.33);
  return fract((q.x + q.y) * q.z);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 w = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, w.x), mix(c, d, w.x), w.y);
}

float smoother(float x) {
  x = clamp(x, 0.0, 1.0);
  return x * x * x * (x * (x * 6.0 - 15.0) + 10.0);
}

void main() {
  vec2 frag = vec2(gl_FragCoord.x, uResolution.y - gl_FragCoord.y) - uOrigin;
  ivec2 q = ivec2(floor(frag));
  ivec2 cell = q / uCell;
  vec4 color = vec4(0.0);
  if (all(greaterThanEqual(q, ivec2(0))) && all(lessThan(cell, uGrid))) {
    vec4 state = texelFetch(uState, cell, 0);
    int glyph = int(state.r * 255.0 + 0.5);
    ivec2 texel = ivec2(glyph % uAtlasColumns, glyph / uAtlasColumns) * uCell + (q - cell * uCell);
    float coverage = texelFetch(uAtlas, texel, 0).a;
    if (coverage > 0.0) {
      vec2 center = vec2(cell * uCell) + vec2(uCell) * 0.5 + uOrigin;
      float mask = 1.0;
      if (uEdge > 0.0) {
        vec2 edge = min(center, uResolution - center) / uEdge;
        mask = smoother(edge.x) * smoother(edge.y);
      }
      if (uCenter > 0.0) {
        vec2 room = max(abs(center - uResolution * 0.5) - uResolution * vec2(0.3, 0.24), 0.0);
        float soft = min(uResolution.x, uResolution.y) * 0.24;
        mask *= 1.0 - uCenter * (1.0 - smoother(length(room) / soft));
      }
      float seed = hash(vec2(cell) + 17.0);
      float rest = state.g * uBaseOpacity * (0.8 + 0.2 * sin(uTime * (0.5 + 1.2 * seed) + seed * 40.0));
      if (uFlow > 0.0) {
        vec2 p = center / uFlowScale;
        float n = 0.65 * noise(p + vec2(uTime * 0.05, uTime * 0.03)) + 0.35 * noise(p * 2.03 - vec2(uTime * 0.04, -uTime * 0.06));
        rest *= mix(1.0, 0.1 + 1.7 * smoothstep(0.25, 0.8, n), uFlow);
      }
      if (uPresence > 0.0) {
        float d = length(center - uPointer) / uRadius;
        float f = clamp(1.0 - d * d, 0.0, 1.0);
        rest = mix(rest, max(rest, uReveal * step(0.004, state.g)), f * f * uPresence);
      }
      float heat = state.b;
      rest = min(rest, 1.0) * (1.0 - heat);
      vec3 tint = uColors[int(state.a * 255.0 + 0.5)];
      float weight = coverage * mask;
      color = vec4((uBase * rest + tint * heat) * weight, (rest + heat) * weight);
    }
  }
  outColor = color + uBackground * (1.0 - color.a);
}`,g=(e,t,n)=>Math.min(n,Math.max(t,e)),ee=e=>{let t=g(e,0,1);return t*t*t*(t*(t*6-15)+10)},_=(e,t,n)=>{let r=e.createShader(t);return r?(e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(e.deleteShader(r),null)):null},te=e=>{let t=_(e,e.VERTEX_SHADER,m),n=_(e,e.FRAGMENT_SHADER,h),r=e.createProgram();if(!t||!n||!r)return null;if(e.attachShader(r,t),e.attachShader(r,n),e.linkProgram(r),e.deleteShader(t),e.deleteShader(n),!e.getProgramParameter(r,e.LINK_STATUS))return e.deleteProgram(r),null;let i={},a=e.getProgramParameter(r,e.ACTIVE_UNIFORMS);for(let t=0;t<a;t++){let n=e.getActiveUniform(r,t);if(!n)continue;let a=n.name.replace(/\[0\]$/,``);i[a]=e.getUniformLocation(r,a)}return{program:r,uniforms:i}},v=({glitchColors:e,baseColor:t,characters:n=a,fontFamily:m=o,fontSize:h=14,spacing:_=.6,density:v=.9,baseOpacity:ne=.16,glitchAmount:y=.5,speed:b=1,smooth:x=!0,interactive:S=!0,cursorRadius:C=140,clickEffect:w=`tear`,flow:T=.5,edgeFade:re=0,centerFade:E=0,intro:D=!0,lightMode:O=!1,backgroundColor:k,dpr:A,className:j=``,style:M,...N})=>{let ie=(0,r.useRef)(null),ae=(0,r.useRef)(null),oe=(0,r.useRef)(null),P={colors:((Array.isArray(e)&&e.length?e:null)||(O?c:s)).slice(0,l),baseColor:t||(O?`#18181b`:`#ffffff`),characters:n||a,fontFamily:m||o,fontSize:g(h,6,96),spacing:g(_,0,2),density:g(v,0,1),baseOpacity:g(ne,0,1),glitchAmount:g(y,0,1),speed:Math.max(0,b),smooth:x,interactive:S,cursorRadius:Math.max(0,C),clickEffect:w,flow:g(T,0,1),edgeFade:g(re,0,.5),centerFade:g(E,0,1),intro:D,backgroundColor:k,dpr:A},F=(0,r.useRef)(P);return F.current=P,(0,r.useEffect)(()=>{let e=ie.current,t=ae.current,n=t?.getContext(`webgl2`,{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1});if(!e||!t||!n)return;let r=te(n);if(!r)return;let i=r.uniforms,a=n.createVertexArray(),o=()=>{let e=n.createTexture();return n.bindTexture(n.TEXTURE_2D,e),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MAG_FILTER,n.NEAREST),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE),e},s=o(),c=o(),m=n.getParameter(n.MAX_TEXTURE_SIZE),h=document.createElement(`canvas`),_=h.getContext(`2d`),v=document.createElement(`canvas`).getContext(`2d`,{willReadFrequently:!0});if(!_)return;let ne=new Map,y=e=>{let t=String(e),n=ne.get(t);if(n)return n;let r=[1,1,1];if(v){v.clearRect(0,0,1,1),v.fillStyle=`#ffffff`,v.fillStyle=t,v.fillRect(0,0,1,1);let[e,n,i]=v.getImageData(0,0,1,1).data;r=[e/255,n/255,i/255]}return ne.set(t,r),r},b=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches??!1,x={width:1,height:1,ratio:1},S={cols:0,rows:0,cellW:0,cellH:0,originX:0,originY:0,atlasColumns:1},C={x:0,y:0,sx:0,sy:0,inside:!1,presence:0,stir:0,fresh:!0},w=[],T=new Float32Array(24),re=new Set,E=[0],D=``,O=``,k=1,A=0,j=new Uint8Array,M=new Float32Array,N=new Float32Array,P=new Float32Array,I=new Float32Array,L=new Float32Array,R=new Float32Array,z=new Float32Array,se=new Float32Array,B=new Float32Array,V=new Int32Array,H=new Int32Array,U=0,W=F.current.intro&&!b,ce=0,le=0,ue=-1,de=0,fe=0,pe=0,G=!0,K=0,q=0,J=!0,me=!0,Y=()=>E[Math.random()*E.length|0],X=()=>Math.random()*k|0,he=(e,t=1)=>z[e]<F.current.density?Math.round(se[e]*255*t):0,Z=(e,t)=>{let n=Math.floor((e-S.originX)/S.cellW),r=Math.floor((t-S.originY)/S.cellH);return n<0||r<0||n>=S.cols||r>=S.rows?-1:r*S.cols+n},Q=(e,t,n,r,i,a=0)=>{V[e]<0?(V[e]=U,H[U++]=e,M[e]=0,P[e]=n,N[e]=t,I[e]=r,L[e]=0,R[e]=a,j[e*4+3]=i):(M[e]<.15&&(j[e*4+3]=i),N[e]=P[e]>0?Math.max(N[e],t):t,P[e]=Math.max(P[e],n),I[e]=Math.max(I[e],r),R[e]=Math.min(R[e],a))},ge=e=>{let t=H[e],n=H[--U];H[e]=n,V[n]=e,V[t]=-1,M[t]=0,j[t*4+2]=0},_e=()=>{let e=F.current,t=e.fontSize*x.ratio,r=`${t}px ${e.fontFamily}`,i=Array.from(e.characters),a=Array.from(new Set(i)).slice(0,256);_.font=r;let o=1;a.forEach(e=>{o=Math.max(o,_.measureText(e).width)});let c=_.measureText(`M`),l=Math.max(2,Math.ceil(o+t*e.spacing)),u=Math.max(2,Math.ceil(t*(.95+e.spacing))),d=Math.max(1,Math.min(a.length,Math.floor(m/l)));h.width=d*l,h.height=Math.ceil(a.length/d)*u,_.font=r,_.textAlign=`center`,_.textBaseline=`alphabetic`,_.fillStyle=`#ffffff`;let f=u/2+(c.actualBoundingBoxAscent-c.actualBoundingBoxDescent)/2;a.forEach((e,t)=>{_.fillText(e,t%d*l+l/2,Math.floor(t/d)*u+f)}),n.bindTexture(n.TEXTURE_2D,s),n.texImage2D(n.TEXTURE_2D,0,n.RGBA,n.RGBA,n.UNSIGNED_BYTE,h);let p=new Map(a.map((e,t)=>[e,t])),g=i.map(e=>p.get(e)).filter(e=>e!==void 0),ee=g.length!==E.length||g.some((e,t)=>e!==E[t]);E=g.length?g:[0];let te=l!==S.cellW||u!==S.cellH;return S.cellW=l,S.cellH=u,S.atlasColumns=d,!re.has(r)&&document.fonts?.load&&(re.add(r),document.fonts.load(r,e.characters).then(()=>{me&&(D=``,$())}).catch(()=>{})),{resized:te,charsChanged:ee}},ve=(e,t,n,r)=>{let i=(e+.5)/n-.5,a=(t+.5)/r-.5;return u*(.3*Math.min(1,Math.hypot(i,a*.8)*1.6)+.7*Math.random()**1.3)},ye=()=>{let e=Math.ceil(t.width/S.cellW)+1,r=Math.ceil(t.height/S.cellH)+1;if(S.originX=Math.floor((t.width-e*S.cellW)/2),S.originY=Math.floor((t.height-r*S.cellH)/2),e===S.cols&&r===S.rows)return;let i=e*r,a=new Uint8Array(i*4),o=new Float32Array(i),s=new Float32Array(i),l=new Float32Array(i),u=Math.floor((S.cols-e)/2),d=Math.floor((S.rows-r)/2);for(let t=0;t<r;t++)for(let n=0;n<e;n++){let i=t*e+n,c=n+u,f=t+d;if(c>=0&&f>=0&&c<S.cols&&f<S.rows){let e=f*S.cols+c;a[i*4]=j[e*4],a[i*4+1]=j[e*4+1],o[i]=z[e],s[i]=se[e],l[i]=B[e]}else a[i*4]=Y(),o[i]=Math.random(),s[i]=.55+.45*Math.random(),l[i]=W?ve(n,t,e,r):-1}S.cols=e,S.rows=r,A=i,j=a,z=o,se=s,B=l,M=new Float32Array(i),N=new Float32Array(i),P=new Float32Array(i),I=new Float32Array(i),L=new Float32Array(i),R=new Float32Array(i),V=new Int32Array(i).fill(-1),H=new Int32Array(i),U=0,w.length=0;for(let e=0;e<i;e++)j[e*4+1]=B[e]>=0?0:he(e);ue=F.current.density,n.bindTexture(n.TEXTURE_2D,c),n.texImage2D(n.TEXTURE_2D,0,n.RGBA8,e,r,0,n.RGBA,n.UNSIGNED_BYTE,j),G=!1},be=()=>{let e=F.current,t=`${e.fontSize*x.ratio}|${e.fontFamily}|${e.spacing}|${e.characters}`;if(t===D)return;D=t;let{resized:n,charsChanged:r}=_e();if((n||!S.cols)&&ye(),r){for(let e=0;e<A;e++)j[e*4]=Y();G=!0}},xe=()=>{let e=F.current,t=e.colors.join(`,`);if(t!==O){O=t,k=Math.max(1,e.colors.length);for(let t=0;t<l;t++){let n=y(e.colors[Math.min(t,k-1)]??`#ffffff`);T[t*3]=n[0],T[t*3+1]=n[1],T[t*3+2]=n[2]}for(let e=0;e<A;e++)j[e*4+3]>=k&&(j[e*4+3]=X());G=!0}},Se=e=>{w.length<p&&w.push({carry:0,after:0,wiggle:0,branch:0,...e})},Ce=(e,t)=>{let n=Z(e,t);if(n<0)return;let r=Math.floor(n/S.cols),i=S.cols*S.cellW;for(let t=-2;t<=2;t++){let n=r+t;if(n<0||n>=S.rows)continue;let a=1-Math.abs(t)/3;if(t!==0&&Math.random()>.3+.6*a)continue;let o=X(),s=S.originY+(n+.5)*S.cellH,c=(Math.random()-.5)*6*S.cellW*(1-a);[0,Math.PI].forEach(n=>{let r=i*(.12+.5*a*(.4+.6*Math.random()));Se({x:e+c,y:s,angle:n,life:r,span:r,speed:(2200+Math.random()*1200)*x.ratio,after:Math.abs(t)*.035+Math.random()*.03,color:o})})}},we=(e,t)=>{let n=Math.min(x.width,x.height)*x.ratio,r=5+(Math.random()*3|0),i=Math.random()*Math.PI*2;for(let a=0;a<r;a++){let o=n*(.25+Math.random()*.3);Se({x:e,y:t,angle:i+a/r*Math.PI*2+(Math.random()-.5)*.4,life:o,span:o,speed:(700+Math.random()*400)*x.ratio,wiggle:.2,branch:.03,color:X()})}},Te=(e,t)=>{let n=Z(e,t);n<0||(Q(n,1,.08,.8,X()),F.current.clickEffect===`burst`?we(e,t):Ce(e,t))},Ee=e=>{for(let t=w.length-1;t>=0;t--){let n=w[t];if(n.after>0){n.after-=e;continue}let r=Math.max(1,Math.abs(Math.cos(n.angle))*S.cellW+Math.abs(Math.sin(n.angle))*S.cellH*.6);for(n.carry+=n.speed*e;n.carry>=r&&n.life>0;){n.carry-=r,n.life-=r,n.angle+=(Math.random()-.5)*n.wiggle,n.x+=Math.cos(n.angle)*r,n.y+=Math.sin(n.angle)*r;let e=Z(n.x,n.y);if(e<0){n.life=0;break}let t=n.life/n.span;if(Q(e,.5+.5*t,.03+Math.random()*.05,.5+.5*t,n.color),n.branch&&Math.random()<n.branch){let e=Math.random()<.5?-1:1,t=n.life*(.45+Math.random()*.3);Se({x:n.x,y:n.y,angle:n.angle+e*(.5+Math.random()*.5),life:t,span:n.span,speed:n.speed,wiggle:n.wiggle,color:n.color})}}n.life<=0&&w.splice(t,1)}},De=e=>{let t=F.current;if(b||t.speed<=0||!A)return;de+=A*d*t.speed*e;let n=Math.min(A,de|0);for(de-=n;n-->0;){let e=Math.random()*A|0;V[e]<0&&(j[e*4]=Y(),G=!0)}let r=Math.max(t.speed,.2);fe+=A*t.glitchAmount**1.6*f*t.speed*e;let i=Math.min(A,fe|0);for(fe-=i;i-->0;){let e=Math.random()*A|0,t=X(),n=.45+.55*Math.random(),i=(.04+Math.random()*.26)/r,a=(.45+Math.random()*.6)/r,o=Math.random();if(o<.24){let s=e%S.cols,c=o<.015,l=Math.min(S.cols-s,c?10+(Math.random()*24|0):2+(Math.random()*7|0)),u=(c?.012:.028)/r;for(let r=0;r<l;r++)Q(e+r,n,i,a,t,r*u)}else Q(e,n,i,a,t)}},Oe=e=>{let t=F.current;if(C.presence<.02||b||!A)return;let n=t.cursorRadius*x.ratio;if(n<1)return;let r=Math.max(0,Math.floor((C.sx-n-S.originX)/S.cellW)),i=Math.min(S.cols-1,Math.floor((C.sx+n-S.originX)/S.cellW)),a=Math.max(0,Math.floor((C.sy-n-S.originY)/S.cellH)),o=Math.min(S.rows-1,Math.floor((C.sy+n-S.originY)/S.cellH)),s=C.presence*(3+9*C.stir)*e;for(let e=a;e<=o;e++){let t=(S.originY+(e+.5)*S.cellH-C.sy)/n;for(let a=r;a<=i;a++){let r=(S.originX+(a+.5)*S.cellW-C.sx)/n,i=r*r+t*t;if(i>=1)continue;let o=e*S.cols+a;V[o]<0&&Math.random()<(1-i)*(1-i)*s&&(j[o*4]=Y(),G=!0)}}let c=Math.PI*n*n/(S.cellW*S.cellH);pe+=c*C.presence*(.15+4*C.stir)*e;let l=Math.min(512,pe|0);for(pe-=l;l-->0;){let e=Math.random()*Math.PI*2,t=Math.sqrt(Math.random()),r=(1-t*t)**2;if(Math.random()>r)continue;let i=Z(C.sx+Math.cos(e)*t*n,C.sy+Math.sin(e)*t*n);i<0||Q(i,(.3+.7*Math.random())*(.45+.55*C.stir),.02+Math.random()*.08,.35+Math.random()*.4,X())}},ke=e=>{let t=F.current,n=Math.max(t.speed,.5),r=1-Math.exp(-e/.05);for(let i=0;i<U;){let a=H[i];if(R[a]>0){R[a]-=e,i++;continue}let o=M[a];P[a]>0?(P[a]-=e,o=t.smooth?o+(N[a]-o)*r:N[a]):o=t.smooth?o*Math.exp(-e*4/Math.max(I[a],.05)):0,o<.012&&P[a]<=0?(ge(i),G=!0):(M[a]=o,L[a]-=e,L[a]<=0&&(j[a*4]=Y(),L[a]=(.045+.45*(1-o)*(1-o))*(.6+.8*Math.random())/n),j[a*4+2]=Math.round(o*255),G=!0,i++)}},Ae=e=>{if(!W)return;let t=F.current,n=!1;for(let r=0;r<A;r++){let i=B[r];if(i<0)continue;let a=ce-i;if(a<0){n=!0;continue}a<e&&Math.random()<(z[r]<t.density?.45:.12)&&Q(r,.4+.5*Math.random(),.02,.35+Math.random()*.35,X());let o=t.smooth?ee(a/.35):1;j[r*4+1]=he(r,o),o>=1?B[r]=-1:n=!0}G=!0,n||(W=!1)},je=e=>{if(K=0,!J||document.hidden)return;let o=F.current,l=q?g((e-q)/1e3,5e-4,.05):1/60;if(q=e,ce+=l,b||(le+=l*o.speed),be(),xe(),o.density!==ue){ue=o.density;for(let e=0;e<A;e++)B[e]<0&&(j[e*4+1]=he(e));G=!0}let u=o.interactive&&C.inside&&!b?1:0;C.presence+=(u-C.presence)*(1-Math.exp(-l/.25)),Math.abs(u-C.presence)<.002&&(C.presence=u);let d=C.sx,f=C.sy,p=1-Math.exp(-l/.07);C.sx+=(C.x-C.sx)*p,C.sy+=(C.y-C.sy)*p;let m=Math.hypot(C.sx-d,C.sy-f)/x.ratio/l;if(C.stir+=(g(m/1400,0,1)-C.stir)*(1-Math.exp(-l/.12)),C.stir<.001&&(C.stir=0),Ae(l),De(l),Oe(l),Ee(l),ke(l),n.viewport(0,0,t.width,t.height),n.disable(n.BLEND),n.useProgram(r.program),n.bindVertexArray(a),n.activeTexture(n.TEXTURE1),n.bindTexture(n.TEXTURE_2D,c),G&&(n.texSubImage2D(n.TEXTURE_2D,0,0,0,S.cols,S.rows,n.RGBA,n.UNSIGNED_BYTE,j),G=!1),n.uniform1i(i.uState,1),n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,s),n.uniform1i(i.uAtlas,0),n.uniform2i(i.uCell,S.cellW,S.cellH),n.uniform2i(i.uGrid,S.cols,S.rows),n.uniform1i(i.uAtlasColumns,S.atlasColumns),n.uniform2f(i.uResolution,t.width,t.height),n.uniform2f(i.uOrigin,S.originX,S.originY),n.uniform3fv(i.uBase,y(o.baseColor)),n.uniform1f(i.uBaseOpacity,o.baseOpacity),n.uniform3fv(i.uColors,T),n.uniform1f(i.uEdge,o.edgeFade*Math.min(t.width,t.height)),n.uniform1f(i.uCenter,o.centerFade),n.uniform2f(i.uPointer,C.sx,C.sy),n.uniform1f(i.uRadius,Math.max(1,o.cursorRadius*x.ratio)),n.uniform1f(i.uPresence,C.presence),n.uniform1f(i.uReveal,Math.min(1,o.baseOpacity*3.5)),n.uniform1f(i.uTime,le),n.uniform1f(i.uFlow,o.flow),n.uniform1f(i.uFlowScale,Math.max(t.width,t.height)*.32),o.backgroundColor){let[e,t,r]=y(o.backgroundColor);n.uniform4f(i.uBackground,e,t,r,1)}else n.uniform4f(i.uBackground,0,0,0,0);n.drawArrays(n.TRIANGLES,0,3),!b&&o.speed>0||U>0||w.length>0||W||C.presence!==0&&C.presence!==1||C.stir>0?K=requestAnimationFrame(je):q=0};function $(){!K&&J&&!document.hidden&&(K=requestAnimationFrame(je))}let Me=()=>{let n=F.current;x.width=Math.max(1,e.clientWidth),x.height=Math.max(1,e.clientHeight),x.ratio=Math.min(n.dpr||window.devicePixelRatio||1,2),t.width=Math.max(1,Math.round(x.width*x.ratio)),t.height=Math.max(1,Math.round(x.height*x.ratio)),be(),S.cols&&ye(),$()},Ne=t=>{let n=e.getBoundingClientRect(),r=t.clientX-n.left,i=t.clientY-n.top;C.inside=r>=0&&i>=0&&r<=n.width&&i<=n.height,C.x=r*x.ratio,C.y=i*x.ratio,(C.fresh||C.presence<.02)&&(C.sx=C.x,C.sy=C.y,C.fresh=!1)},Pe=e=>{Ne(e),$()},Fe=e=>{Ne(e);let t=F.current;C.inside&&t.clickEffect!==`none`&&!b&&A&&(Te(C.x,C.y),$())},Ie=e=>{e.pointerType!==`mouse`&&(C.inside=!1)},Le=()=>{C.inside=!1,$()},Re=()=>{q=0,$()},ze=()=>{D=``,$()},Be=new ResizeObserver(Me);Be.observe(e);let Ve=new IntersectionObserver(e=>{J=e.some(e=>e.isIntersecting),J&&(q=0,$())});return Ve.observe(e),window.addEventListener(`pointermove`,Pe,{passive:!0}),window.addEventListener(`pointerdown`,Fe,{passive:!0}),window.addEventListener(`pointerup`,Ie,{passive:!0}),window.addEventListener(`pointercancel`,Ie,{passive:!0}),document.documentElement.addEventListener(`pointerleave`,Le),document.addEventListener(`visibilitychange`,Re),document.fonts?.addEventListener?.(`loadingdone`,ze),Me(),oe.current=$,()=>{me=!1,cancelAnimationFrame(K),oe.current=null,Be.disconnect(),Ve.disconnect(),window.removeEventListener(`pointermove`,Pe),window.removeEventListener(`pointerdown`,Fe),window.removeEventListener(`pointerup`,Ie),window.removeEventListener(`pointercancel`,Ie),document.documentElement.removeEventListener(`pointerleave`,Le),document.removeEventListener(`visibilitychange`,Re),document.fonts?.removeEventListener?.(`loadingdone`,ze),n.deleteTexture(s),n.deleteTexture(c),n.deleteVertexArray(a),n.deleteProgram(r.program),n.getExtension(`WEBGL_lose_context`)?.loseContext()}},[]),(0,r.useEffect)(()=>{oe.current?.()}),(0,i.jsx)(`div`,{ref:ie,className:[`relative h-full w-full overflow-hidden`,j].filter(Boolean).join(` `),style:M,...N,children:(0,i.jsx)(`canvas`,{ref:ae,className:`absolute inset-0 block h-full w-full`,"aria-hidden":`true`})})};export{v as default};