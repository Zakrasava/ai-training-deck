import{i as e,t}from"./react-sySUN5R7.js";import{C as n,D as r,E as i,O as a,S as o,T as s,_ as c,a as l,c as u,d,f,g as p,h as ee,i as te,k as m,l as ne,m as re,o as ie,p as ae,u as oe,v as se,w as ce,x as le,y as ue}from"./sculpture-dark-CKiqtzhU.js";var h=e(t(),1),g=m(),_=400,de=160,fe=80,v=1500,y=8,pe=[`straight`,`gentle`,`winding`,`hills`,`racing`,`deep`],b={dark:{background:`transparent`,road:`#08080a`,lines:`#25252d`,tail:[`#d856bf`,`#6750a2`,`#c247ac`],head:[`#03b3c3`,`#0e5ea5`,`#324555`],poles:[`#03b3c3`],dust:`#ffffff`},light:{background:`transparent`,road:`#efeff2`,lines:`#d0d0d7`,tail:[`#d856bf`,`#6750a2`,`#c247ac`],head:[`#03b3c3`,`#0e5ea5`,`#324555`],poles:[`#03b3c3`],dust:`#18181b`}},x=`
  uniform float uTime;
  uniform float uCurvature;
  uniform vec4 uCurveA;
  uniform float uCurveB;
  uniform float uFogNear;
  uniform float uFogFar;
  uniform float uPixel;
  #define PI 3.14159265358979
  float nsin(float v) { return sin(v) * 0.5 + 0.5; }
  vec3 gentle(float p) {
    return vec3(
      cos(p * PI * 5.0 + uTime) * 25.0 - cos(0.02 * PI * 5.0 + uTime) * 25.0,
      sin(p * PI * 2.0 + PI * 0.5 + uTime) * 15.0 - sin(0.02 * PI * 2.0 + PI * 0.5 + uTime) * 15.0,
      0.0
    );
  }
  float windX(float p) { return cos(PI * p * 4.0 + uTime) * 25.0 + pow(cos(PI * p * 8.0 + uTime * 2.0), 2.0) * 5.0; }
  float windY(float p) { return -nsin(PI * p * 8.0 + uTime) * 10.0 - pow(nsin(PI * p + uTime / 8.0), 5.0) * 10.0; }
  vec3 winding(float p) { return vec3(windX(p) - windX(0.0125), windY(p) - windY(0.0125), 0.0); }
  vec3 hills(float p) {
    return vec3(
      cos(p * PI * 3.0 + uTime) * 30.0 - cos(0.02 * PI * 3.0 + uTime) * 30.0,
      nsin(p * PI * 6.0 + uTime) * 30.0 - nsin(0.02 * PI * 6.0 + uTime) * 30.0,
      nsin(p * PI * 10.0 + uTime) * 20.0 - nsin(0.02 * PI * 10.0 + uTime) * 20.0
    );
  }
  vec3 racing(float p) {
    return vec3(
      sin(p * PI * 2.0 + uTime) * 35.0 - sin(0.0125 * PI * 2.0 + uTime) * 35.0,
      sin(p * PI * 3.0 + uTime) * 10.0 - sin(0.0125 * PI * 3.0 + uTime) * 10.0,
      0.0
    );
  }
  float deepX(float p) { return sin(p * PI * 4.0 + uTime) * 10.0; }
  float deepY(float p) { return pow(abs(p * 10.0), 2.0) + sin(p * PI * 8.0 + uTime) * 20.0; }
  vec3 deep(float p) { return vec3(deepX(p) - deepX(0.02), deepY(p) - deepY(0.02), 0.0); }
  vec3 bend(float p) {
    vec3 d = gentle(p) * uCurveA.x + winding(p) * uCurveA.y + hills(p) * uCurveA.z + racing(p) * uCurveA.w + deep(p) * uCurveB;
    return d * uCurvature;
  }
`,me=`
  ${x}
  attribute vec4 aSeedA;
  attribute vec4 aSeedB;
  attribute float aPair;
  attribute float aTone;
  uniform float uTravel;
  uniform float uRoadX;
  uniform float uRoadWidth;
  uniform float uLanes;
  uniform float uDirection;
  uniform vec2 uSpeedRange;
  uniform float uTrail;
  uniform float uStretch;
  uniform float uSize;
  uniform float uRadiusScale;
  uniform float uMirror;
  uniform vec3 uColors[${y}];
  uniform float uColorCount;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec3 vColor;
  varying float vFog;
  varying float vAbove;
  varying float vThin;
  void main() {
    float laneWidth = uRoadWidth / uLanes;
    float lane = min(floor(aSeedA.x * uLanes), uLanes - 1.0);
    float laneX = (lane + 0.5) * laneWidth - uRoadWidth * 0.5 + (aSeedA.y - 0.5) * 0.5 * laneWidth;
    float carWidth = mix(0.3, 0.5, aSeedA.z) * laneWidth;
    float radius = mix(0.05, 0.14, aSeedA.w) * uSize;
    float len = mix(0.03, 0.2, aSeedB.x) * uTravel * uTrail * (1.0 + uStretch);
    float speed = mix(uSpeedRange.x, uSpeedRange.y, aSeedB.y) * uDirection;
    vec3 center = vec3(
      uRoadX + laneX + aPair * carWidth,
      aSeedB.w * 0.8 + radius * 1.3,
      position.z * len + len - mod(uTime * speed + aSeedB.z * uTravel, uTravel)
    );
    vAbove = center.y;
    center.y = mix(center.y, -center.y * 1.8, uMirror);
    center += bend(abs(center.z / uTravel));
    float depth = max(0.1, -(modelViewMatrix * vec4(center, 1.0)).z);
    float wanted = radius * uRadiusScale;
    float shown = max(wanted, depth * uPixel * 0.75);
    vThin = wanted / shown;
    vec3 p = center + vec3(position.x * shown, position.y * shown * mix(1.0, 2.2, uMirror), 0.0);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    vec3 n = normal;
    n.y *= 1.0 - 2.0 * uMirror;
    vNormal = normalize(normalMatrix * n);
    vView = -mv.xyz;
    vUv = uv;
    vColor = uColors[int(min(floor(aTone * uColorCount), uColorCount - 1.0))];
    vFog = smoothstep(uFogNear, uFogFar, -mv.z);
  }
`,he=`
  uniform vec2 uFade;
  uniform float uIntensity;
  uniform float uSharp;
  uniform float uCore;
  uniform float uMirror;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec3 vColor;
  varying float vFog;
  varying float vAbove;
  varying float vThin;
  void main() {
    float facing = abs(dot(normalize(vNormal), normalize(vView)));
    float alpha = pow(facing, uSharp) * smoothstep(uFade.x, uFade.y, vUv.x) * uIntensity * vThin * (1.0 - vFog);
    alpha *= mix(1.0, exp(-vAbove * 0.9), uMirror);
    if (alpha < 0.003) discard;
    gl_FragColor = vec4(mix(vColor, vec3(1.0), pow(facing, 12.0) * uCore), min(alpha, 1.0));
  }
`,ge=`
  ${x}
  attribute vec4 aSeed;
  attribute float aIndex;
  attribute float aSide;
  uniform float uTravel;
  uniform float uCount;
  uniform float uEdge;
  uniform float uHeight;
  uniform float uRadiusScale;
  uniform float uMirror;
  uniform vec3 uColors[${y}];
  uniform float uColorCount;
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec3 vColor;
  varying float vFog;
  varying float vAbove;
  varying float vHeight;
  varying float vThin;
  void main() {
    vHeight = position.y + 0.5;
    float width = mix(0.08, 0.22, aSeed.y);
    float height = mix(1.3, 1.9, aSeed.z) * uHeight;
    float spacing = uTravel / max(uCount, 1.0);
    vec3 center = vec3(
      aSide * uEdge,
      vHeight * height,
      -uTravel + mod(uTime * 120.0 + (aIndex + aSeed.x * 0.6) * spacing, uTravel)
    );
    vAbove = center.y;
    center.y = mix(center.y, -center.y * 1.6, uMirror);
    center += bend(abs(center.z / uTravel));
    float depth = max(0.1, -(modelViewMatrix * vec4(center, 1.0)).z);
    float wanted = width * uRadiusScale;
    float shown = max(wanted, depth * uPixel * 0.75);
    vThin = wanted / shown;
    vec3 p = center + vec3(position.x * shown, 0.0, position.z * shown);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    vNormal = normalize(normalMatrix * normal);
    vView = -mv.xyz;
    vColor = uColors[int(min(floor(aSeed.w * uColorCount), uColorCount - 1.0))];
    vFog = smoothstep(uFogNear, uFogFar, -mv.z);
  }
`,_e=`
  uniform float uIntensity;
  uniform float uSharp;
  uniform float uCore;
  uniform float uMirror;
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec3 vColor;
  varying float vFog;
  varying float vAbove;
  varying float vHeight;
  varying float vThin;
  void main() {
    float facing = abs(dot(normalize(vNormal), normalize(vView)));
    float ends = smoothstep(0.0, 0.08, vHeight) * smoothstep(1.0, 0.9, vHeight);
    float alpha = pow(facing, uSharp) * ends * uIntensity * vThin * (1.0 - vFog);
    alpha *= mix(1.0, exp(-vAbove * 0.6), uMirror);
    if (alpha < 0.003) discard;
    gl_FragColor = vec4(mix(vColor, vec3(1.0), pow(facing, 12.0) * uCore), min(alpha, 1.0));
  }
`,ve=`
  ${x}
  attribute vec4 aSeed;
  attribute float aEnd;
  uniform float uTravel;
  uniform float uStretch;
  uniform float uSpread;
  varying float vAlpha;
  void main() {
    float x = (aSeed.x - 0.5) * uSpread;
    float y = mix(1.0, 42.0, aSeed.y * aSeed.y);
    float speed = mix(140.0, 260.0, aSeed.w);
    float z = -uTravel + mod(uTime * speed + aSeed.z * uTravel, uTravel);
    float len = (0.6 + uStretch * 7.0) * mix(0.6, 1.4, aSeed.w);
    vec3 p = vec3(x, y, z + aEnd * len);
    p += bend(abs(p.z / uTravel));
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    vAlpha = aEnd * (1.0 - smoothstep(uFogNear, uFogFar, -mv.z));
  }
`,ye=`
  uniform vec3 uColor;
  uniform float uIntensity;
  varying float vAlpha;
  void main() {
    gl_FragColor = vec4(uColor, vAlpha * uIntensity);
  }
`,be=`
  ${x}
  uniform float uTravel;
  uniform float uWidth;
  varying vec2 vRoad;
  varying float vFog;
  void main() {
    vec3 p = position;
    p.x *= uWidth;
    vRoad = vec2(p.x, p.z);
    p += bend(abs(p.z / uTravel));
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    vFog = smoothstep(uFogNear, uFogFar, -mv.z);
  }
`,xe=`
  uniform float uTime;
  uniform vec3 uRoadColor;
  uniform vec3 uLineColor;
  uniform vec3 uBackground;
  uniform float uRoadWidth;
  uniform float uMedian;
  uniform float uLanes;
  uniform float uTransparent;
  uniform float uOpacity;
  varying vec2 vRoad;
  varying float vFog;
  float stripe(float d, float w) {
    float aa = fwidth(d) * 1.2;
    return 1.0 - smoothstep(w - aa, w + aa, d);
  }
  void main() {
    float rx = abs(vRoad.x) - uMedian * 0.5;
    vec3 color = rx < 0.0 ? mix(uRoadColor, uLineColor, 0.12) : uRoadColor;
    if (rx >= 0.0) {
      float laneWidth = uRoadWidth / uLanes;
      float shoulder = max(stripe(abs(rx - 0.3), 0.07), stripe(abs(rx - (uRoadWidth - 0.3)), 0.07));
      float nearest = floor(rx / laneWidth + 0.5);
      float inner = step(0.5, nearest) * step(nearest, uLanes - 0.5);
      float dash = step(0.5, fract((vRoad.y - uTime * 120.0) / 14.0));
      float marks = max(shoulder, stripe(abs(rx - nearest * laneWidth), 0.06) * inner * dash);
      color = mix(color, uLineColor, marks);
    }
    float alpha = mix(1.0, 1.0 - vFog, uTransparent) * uOpacity;
    gl_FragColor = vec4(mix(color, uBackground, vFog * (1.0 - uTransparent)), alpha);
  }
`,Se=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`,Ce=`
  uniform sampler2D uTexture;
  uniform vec2 uTexel;
  varying vec2 vUv;
  vec4 tap(vec2 offset) {
    return min(texture2D(uTexture, vUv + uTexel * offset), vec4(1.0));
  }
  void main() {
    vec4 sum = tap(vec2(0.0)) * 4.0 + tap(vec2(-1.0, -1.0)) + tap(vec2(1.0, -1.0)) + tap(vec2(-1.0, 1.0)) + tap(vec2(1.0, 1.0));
    gl_FragColor = sum * 0.125;
  }
`,S=`
  uniform sampler2D uTexture;
  uniform vec2 uTexel;
  varying vec2 vUv;
  vec4 tent() {
    vec4 sum = texture2D(uTexture, vUv + uTexel * vec2(-1.0, 0.0));
    sum += texture2D(uTexture, vUv + uTexel * vec2(1.0, 0.0));
    sum += texture2D(uTexture, vUv + uTexel * vec2(0.0, -1.0));
    sum += texture2D(uTexture, vUv + uTexel * vec2(0.0, 1.0));
    sum += texture2D(uTexture, vUv + uTexel * vec2(-0.5, -0.5)) * 2.0;
    sum += texture2D(uTexture, vUv + uTexel * vec2(0.5, -0.5)) * 2.0;
    sum += texture2D(uTexture, vUv + uTexel * vec2(-0.5, 0.5)) * 2.0;
    sum += texture2D(uTexture, vUv + uTexel * vec2(0.5, 0.5)) * 2.0;
    return sum / 12.0;
  }
`,we=`
  ${S}
  void main() {
    gl_FragColor = tent();
  }
`,Te=`
  ${S}
  uniform float uStrength;
  uniform float uCeiling;
  uniform float uLight;
  void main() {
    vec4 color = tent() * uStrength;
    float peak = max(uLight > 0.5 ? color.a : max(color.r, max(color.g, color.b)), 0.0001);
    color *= uCeiling * (1.0 - exp(-peak / uCeiling)) / peak;
    gl_FragColor = uLight > 0.5 ? color : vec4(color.rgb, 0.0);
  }
`,C=null,w=e=>{if(C=C??document.createElement(`canvas`).getContext(`2d`),!C)return[1,1,1];C.fillStyle=`#000000`,C.fillStyle=e;let t=String(C.fillStyle);if(t.startsWith(`#`)){let e=parseInt(t.slice(1,7),16);return[(e>>16&255)/255,(e>>8&255)/255,(e&255)/255]}let n=t.match(/[\d.]+/g)?.map(Number)??[0,0,0];return[n[0]/255,n[1]/255,n[2]/255]},Ee=(e,t,n)=>{let r=n.length?n:[`#ffffff`];for(let t=0;t<y;t++)e.value[t].fromArray(w(r[t%r.length]));t.value=Math.min(r.length,y)},De=e=>{let t=new f;return t.setIndex(e.index),Object.entries(e.attributes).forEach(([e,n])=>t.setAttribute(e,n)),t},T=e=>Math.sin(e)*.5+.5,E=(e,t)=>Math.cos(Math.PI*e*4+t)*25+Math.cos(Math.PI*e*8+t*2)**2*5,D=(e,t)=>-T(Math.PI*e*8+t)*10-T(Math.PI*e+t/8)**5*10,O=(e,t)=>Math.sin(e*Math.PI*4+t)*10,k=(e,t)=>Math.abs(e*10)**2+Math.sin(e*Math.PI*8+t)*20,A=(e,t)=>{let{PI:n,cos:r,sin:i}=Math;return[[r(e*n*5+t)*25-r(.02*n*5+t)*25,i(e*n*2+n*.5+t)*15-i(.02*n*2+n*.5+t)*15,0],[E(e,t)-E(.0125,t),D(e,t)-D(.0125,t),0],[r(e*n*3+t)*30-r(.02*n*3+t)*30,T(e*n*6+t)*30-T(.02*n*6+t)*30,T(e*n*10+t)*20-T(.02*n*10+t)*20],[i(e*n*2+t)*35-i(.0125*n*2+t)*35,i(e*n*3+t)*10-i(.0125*n*3+t)*10,0],[O(e,t)-O(.02,t),k(e,t)-k(.02,t),0]]},Oe=(e,t)=>{let n=.025,[r,,i,a]=A(n,e);return[[r[0]*t*2,r[1]*t*.4,-3],[(E(n,e)-E(.032,e))*t*-2,(D(n,e)-D(.032,e))*t*-5,-10],[i[0]*t*2,i[1]*t*2,i[2]*t*2-5],[a[0]*t,a[1]*t,-5],[(O(n,e)-O(.035,e))*t*-2,(k(n,e)-k(.035,e))*t*-4,-10]]},j=`absolute inset-0 overflow-hidden touch-pan-y select-none [-webkit-tap-highlight-color:transparent] [-webkit-touch-callout:none] [&>canvas]:block [&>canvas]:h-full [&>canvas]:w-full`,M=({curve:e=`winding`,curvature:t=1,speed:f=1,boost:m=3,fov:x=90,boostFov:S=130,lanes:C=3,roadWidth:T=10,medianWidth:E=2,density:D=40,trailLength:O=1,lightSize:k=1,poles:A=20,poleHeight:M=1,dust:ke=100,glow:N=.6,reflections:Ae=.5,steer:P=.35,tailColors:F,headColors:I,poleColors:L,roadColor:R,roadOpacity:z=.1,lineColor:B,background:je,theme:V=`dark`,interactive:Me=!0,boosting:H=!1,onBoostStart:Ne,onBoostEnd:U,className:W=``,style:Pe})=>{let Fe=(0,h.useRef)(null),G=b[V]??b.dark,K={light:V===`light`,curve:pe.includes(e)?e:`winding`,curvature:Math.max(0,t),speed:Math.max(0,f),boost:Math.max(1,m),fov:Math.min(170,Math.max(20,x)),boostFov:Math.min(170,Math.max(20,S)),lanes:Math.max(1,Math.round(C)),roadWidth:Math.max(1,T),medianWidth:Math.max(0,E),density:Math.min(de,Math.max(0,Math.round(D))),trailLength:Math.max(.05,O),lightSize:Math.max(.1,k),poles:Math.min(fe,Math.max(0,Math.round(A))),poleHeight:Math.max(.1,M),dust:Math.min(v,Math.max(0,Math.round(ke))),glow:Math.max(0,N),reflections:Math.max(0,Ae),steer:Math.max(0,P),tailColors:F?.length?F:G.tail,headColors:I?.length?I:G.head,poleColors:L?.length?L:G.poles,roadColor:R??G.road,roadOpacity:Math.min(1,Math.max(0,z)),lineColor:B??G.lines,background:je??G.background,dustColor:G.dust,interactive:Me,boosting:H},q=(0,h.useRef)(K);q.current=K;let Ie=(0,h.useRef)({onBoostStart:Ne,onBoostEnd:U});return Ie.current={onBoostStart:Ne,onBoostEnd:U},(0,h.useEffect)(()=>{let e=Fe.current;if(!e)return;let t=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches??!1,f=new te({antialias:!0,alpha:!0,powerPreference:`high-performance`});f.outputColorSpace=ee,f.autoClear=!1,f.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),e.appendChild(f.domElement);let m=new le,h=new se(q.current.fov,1,.1,1e4);h.position.set(0,8,-5);let g={uTime:{value:0},uCurvature:{value:1},uCurveA:{value:new r},uCurveB:{value:0},uFogNear:{value:_*.22},uFogFar:{value:_*.95},uTravel:{value:_},uStretch:{value:0},uPixel:{value:.001}},b=[],x=[],S=(e,t,n,r={})=>{let i=new o({vertexShader:e,fragmentShader:t,uniforms:{...g,...n},transparent:!0,depthWrite:!1,...r});return b.push(i),i},C=()=>({value:Array.from({length:y},()=>new i(1,1,1))}),T=new ue(1,_,1,220);T.rotateX(-Math.PI/2),T.translate(0,0,-200),b.push(T);let E={uWidth:{value:1},uRoadColor:{value:new i},uLineColor:{value:new i},uBackground:{value:new i},uRoadWidth:{value:10},uMedian:{value:2},uLanes:{value:3},uTransparent:{value:0},uOpacity:{value:1}},D=S(be,xe,E,{transparent:!0,depthWrite:!0}),O=new p(T,D);O.frustumCulled=!1,O.renderOrder=0,O.layers.enable(1),m.add(O);let k=new n(new ae(new i(0,0,0),new i(0,0,-1)),24,1,7,!1);b.push(k);let A=(e,t,n)=>{let r=De(k),i=new Float32Array(1280),a=new Float32Array(1280),o=new Float32Array(320),c=new Float32Array(320);for(let e=0;e<de;e++){let t=[Math.random(),Math.random(),Math.random(),Math.random()],n=[Math.random(),Math.random(),Math.random(),Math.random()*Math.random()],r=Math.random();for(let s=0;s<2;s++){let l=e*2+s;i.set(t,l*4),a.set(n,l*4),o[l]=s?.5:-.5,c[l]=r}}r.setAttribute(`aSeedA`,new d(i,4)),r.setAttribute(`aSeedB`,new d(a,4)),r.setAttribute(`aPair`,new d(o,1)),r.setAttribute(`aTone`,new d(c,1)),r.instanceCount=0,b.push(r);let l={uRoadX:{value:0},uRoadWidth:{value:10},uLanes:{value:3},uDirection:{value:e},uSpeedRange:{value:new s(...n)},uTrail:{value:1},uSize:{value:1},uColors:C(),uColorCount:{value:1},uFade:{value:new s(...t)}},u=(e,t,n,i)=>{let a=S(me,he,{...l,uRadiusScale:{value:e},uSharp:{value:t},uMirror:{value:n},uIntensity:{value:1},uCore:{value:0}},{depthTest:!n});x.push(a);let o=new p(r,a);return o.frustumCulled=!1,o.renderOrder=i,n||o.layers.enable(1),m.add(o),a};return{geometry:r,uniforms:l,reflection:u(2.1,1.2,1,1),core:u(1,.85,0,3)}},j=A(1,[0,.6],[60,80]),M=A(-1,[1,.4],[120,160]),ke=new ne(1,1,1,8,1,!0);b.push(ke);let N=De(ke),Ae=new Float32Array(640),P=new Float32Array(160),F=new Float32Array(160);for(let e=0;e<fe;e++)for(let t=0;t<2;t++){let n=e*2+t;Ae.set([Math.random(),Math.random(),Math.random(),Math.random()],n*4),P[n]=e+(t?.5:0),F[n]=t?1:-1}N.setAttribute(`aSeed`,new d(Ae,4)),N.setAttribute(`aIndex`,new d(P,1)),N.setAttribute(`aSide`,new d(F,1)),N.instanceCount=0,b.push(N);let I={uCount:{value:20},uEdge:{value:11},uHeight:{value:1},uColors:C(),uColorCount:{value:1}},L=(e,t,n,r)=>{let i=S(ge,_e,{...I,uRadiusScale:{value:e},uSharp:{value:t},uMirror:{value:n},uIntensity:{value:1},uCore:{value:0}},{depthTest:!n});x.push(i);let a=new p(N,i);return a.frustumCulled=!1,a.renderOrder=r,n||a.layers.enable(1),m.add(a),i},R={reflection:L(2.4,1.2,1,1),core:L(1,.8,0,3)},z=new ie,B=new Float32Array(v*2*4),je=new Float32Array(v*2);for(let e=0;e<v;e++){let t=[Math.random(),Math.random(),Math.random(),Math.random()];B.set(t,e*8),B.set(t,e*8+4),je[e*2+1]=1}z.setAttribute(`position`,new l(new Float32Array(v*2*3),3)),z.setAttribute(`aSeed`,new l(B,4)),z.setAttribute(`aEnd`,new l(je,1)),z.setDrawRange(0,0),b.push(z);let V={uSpread:{value:140},uColor:{value:new i(1,1,1)},uIntensity:{value:.5}},Me=S(ve,ye,V);x.push(Me);let H=new re(z,Me);H.frustumCulled=!1,H.renderOrder=4,m.add(H);let Ne=f.extensions.has(`EXT_color_buffer_float`)||f.extensions.has(`EXT_color_buffer_half_float`),U=Array.from({length:5},(e,t)=>{let n=new a(1,1,{type:Ne?oe:ce,depthBuffer:t===0});return b.push(n),n}),W=new le,Pe=new c(-1,1,1,-1,0,1),G=new ue(2,2);b.push(G);let K=new p(G);K.frustumCulled=!1,W.add(K);let Le=(e,t)=>{let n=new o({vertexShader:Se,fragmentShader:e,uniforms:{uTexture:{value:null},uTexel:{value:new s},uStrength:{value:1},uCeiling:{value:1},uLight:{value:0}},depthTest:!1,depthWrite:!1,...t});return b.push(n),n},Re=Le(Ce,{blending:0}),ze=Le(we,{blending:5,blendSrc:201,blendDst:201,blendSrcAlpha:201,blendDstAlpha:201}),J=Le(Te,{blending:5,blendSrc:201}),Be=(e,t,n)=>{K.material=e,e.uniforms.uTexture.value=t.texture,e.uniforms.uTexel.value.set(1/t.width,1/t.height),f.setRenderTarget(n),f.render(W,Pe)},Ve=new u,He=0,Y={boost:0,held:!1,boosted:!1,fov:q.current.fov,fovVelocity:0,steerX:0,steerY:0,pointerX:0,pointerY:0,weights:[0,0,0,0,0],visible:!0},X={tail:``,head:``,poles:``,surface:``,light:null},Z=new i,Q=0,Ue=performance.now(),We=!0,Ge=e=>{let t=e.tailColors.join();t!==X.tail&&(X.tail=t,Ee(j.uniforms.uColors,j.uniforms.uColorCount,e.tailColors));let n=e.headColors.join();n!==X.head&&(X.head=n,Ee(M.uniforms.uColors,M.uniforms.uColorCount,e.headColors));let r=e.poleColors.join();r!==X.poles&&(X.poles=r,Ee(I.uColors,I.uColorCount,e.poleColors));let i=[e.roadColor,e.lineColor,e.background,e.dustColor].join();if(i!==X.surface){X.surface=i,E.uRoadColor.value.fromArray(w(e.roadColor)),E.uLineColor.value.fromArray(w(e.lineColor)),V.uColor.value.fromArray(w(e.dustColor));let t=e.background===`transparent`,n=t?[0,0,0]:w(e.background);E.uBackground.value.fromArray(n),E.uTransparent.value=+!!t,Ve.setRGB(...n,ee),He=+!t}X.light!==e.light&&(X.light=e.light,x.forEach(t=>{t.blending=e.light?1:2,t.needsUpdate=!0}),J.blendDst=e.light?205:201,J.blendSrcAlpha=e.light?201:200,J.blendDstAlpha=e.light?205:201,J.uniforms.uLight.value=+!!e.light)},Ke=()=>{let t=Math.max(1,e.clientWidth),n=Math.max(1,e.clientHeight);f.setSize(t,n,!1),U.forEach((e,r)=>e.setSize(Math.max(1,Math.round(t/2**(r+1))),Math.max(1,Math.round(n/2**(r+1))))),h.aspect=t/n,h.updateProjectionMatrix(),Je()},qe=e=>{if(Q=0,!We)return;let n=q.current,r=Math.min(.05,Math.max(.001,(e-Ue)/1e3));Ue=e,Ge(n);let i=Y.held&&n.interactive||n.boosting?1:0;Y.boost+=(i-Y.boost)*(1-Math.exp(-r/(i>Y.boost?.28:.85)));let a=n.speed*(t?.3:1)*(1+(n.boost-1)*Y.boost);g.uTime.value+=r*a,g.uStretch.value=Y.boost*1.1,g.uCurvature.value=n.curvature;let o=pe.indexOf(n.curve)-1,s=1-Math.exp(-r/.6);Y.weights=Y.weights.map((e,t)=>e+(+(t===o)-e)*s),g.uCurveA.value.set(Y.weights[0],Y.weights[1],Y.weights[2],Y.weights[3]),g.uCurveB.value=Y.weights[4];let c=n.roadWidth/2+n.medianWidth/2,l=.45+.55*n.roadOpacity;[j,M].forEach((e,t)=>{e.geometry.instanceCount=n.density*2,e.uniforms.uRoadX.value=t?c:-c,e.uniforms.uRoadWidth.value=n.roadWidth,e.uniforms.uLanes.value=n.lanes,e.uniforms.uTrail.value=n.trailLength,e.uniforms.uSize.value=n.lightSize,e.core.uniforms.uIntensity.value=n.light?.95:1+.35*Y.boost,e.core.uniforms.uCore.value=n.light?0:.75,e.reflection.uniforms.uIntensity.value=n.reflections*(n.light?.22:.42)*l}),N.instanceCount=n.poles*2,I.uCount.value=Math.max(1,n.poles),I.uEdge.value=n.roadWidth+n.medianWidth/2+.8,I.uHeight.value=n.poleHeight,R.core.uniforms.uIntensity.value=n.light?.9:1,R.core.uniforms.uCore.value=n.light?0:.6,R.reflection.uniforms.uIntensity.value=n.reflections*(n.light?.2:.38)*l,z.setDrawRange(0,n.dust*2),V.uIntensity.value=(n.light?.35:.45)*(1+Y.boost),V.uSpread.value=(n.roadWidth*2+n.medianWidth)*5,E.uWidth.value=n.roadWidth*2+n.medianWidth+3,E.uRoadWidth.value=n.roadWidth,E.uMedian.value=n.medianWidth,E.uLanes.value=n.lanes,E.uOpacity.value=n.roadOpacity,D.depthWrite=n.roadOpacity>.5;let u=t?n.fov:n.fov+(n.boostFov-n.fov)*Y.boost;Y.fovVelocity+=((u-Y.fov)*90-Y.fovVelocity*13)*r,Y.fov+=Y.fovVelocity*r,h.fov=Y.fov,g.uPixel.value=2*Math.tan(Y.fov*Math.PI/360)/Math.max(1,f.domElement.height);let d=1-Math.exp(-r/.35),p=n.interactive?n.steer:0;Y.steerX+=(Y.pointerX*p-Y.steerX)*d,Y.steerY+=(Y.pointerY*p-Y.steerY)*d,h.position.set(Y.steerX*n.roadWidth*.45,8-Y.steerY*2.5,-5);let ee=Oe(g.uTime.value,n.curvature),te=1-Y.weights.reduce((e,t)=>e+t,0);if(Z.set(0,0,-10*te),ee.forEach((e,t)=>{Z.x+=e[0]*Y.weights[t],Z.y+=e[1]*Y.weights[t],Z.z+=e[2]*Y.weights[t]}),Z.x+=Y.steerX*2.5,Z.add(h.position),h.lookAt(Z),h.updateProjectionMatrix(),f.setRenderTarget(null),f.setClearColor(Ve,He),f.clear(),f.render(m,h),n.glow>0){let e=g.uPixel.value;g.uPixel.value=e*(f.domElement.height/U[0].height),h.layers.set(1),D.colorWrite=!1,f.setRenderTarget(U[0]),f.setClearColor(0,0),f.clear(),f.render(m,h),D.colorWrite=!0,h.layers.set(0),g.uPixel.value=e;for(let e=1;e<U.length;e++)Be(Re,U[e-1],U[e]);for(let e=U.length-1;e>1;e--)Be(ze,U[e],U[e-1]);J.uniforms.uStrength.value=n.glow*(n.light?.5:1.4),J.uniforms.uCeiling.value=n.glow*(n.light?.3:.5),Be(J,U[1],null)}Y.visible&&(Q=requestAnimationFrame(qe))},Je=()=>{!Q&&We&&Y.visible&&(Ue=performance.now(),Q=requestAnimationFrame(qe))},Ye=e=>{Y.held!==e&&(Y.held=e,q.current.interactive&&(e?Ie.current.onBoostStart?.():Ie.current.onBoostEnd?.()))},Xe=e=>{(e.button===0||e.pointerType!==`mouse`)&&Ye(!0)},$=()=>Ye(!1),Ze=t=>{let n=e.getBoundingClientRect();Y.pointerX=(t.clientX-n.left)/n.width*2-1,Y.pointerY=(t.clientY-n.top)/n.height*2-1},Qe=()=>{Y.pointerX=0,Y.pointerY=0},$e=e=>{q.current.interactive&&e.preventDefault()},et=new ResizeObserver(Ke);et.observe(e);let tt=new IntersectionObserver(e=>{Y.visible=e.some(e=>e.isIntersecting),Y.visible&&Je()});return tt.observe(e),e.addEventListener(`pointerdown`,Xe),e.addEventListener(`pointermove`,Ze),e.addEventListener(`pointerleave`,Qe),e.addEventListener(`contextmenu`,$e),window.addEventListener(`pointerup`,$),window.addEventListener(`pointercancel`,$),window.addEventListener(`blur`,$),Ke(),()=>{We=!1,cancelAnimationFrame(Q),et.disconnect(),tt.disconnect(),e.removeEventListener(`pointerdown`,Xe),e.removeEventListener(`pointermove`,Ze),e.removeEventListener(`pointerleave`,Qe),e.removeEventListener(`contextmenu`,$e),window.removeEventListener(`pointerup`,$),window.removeEventListener(`pointercancel`,$),window.removeEventListener(`blur`,$),b.forEach(e=>e.dispose()),f.dispose(),f.domElement.remove()}},[]),(0,g.jsx)(`div`,{ref:Fe,className:`${j}${W?` ${W}`:``}`,style:Pe})};export{M as default};