import{i as e,t}from"./react-sySUN5R7.js";import{C as n,D as r,E as i,O as a,S as o,T as s,_ as c,a as l,b as u,c as ee,d,f as te,g as ne,h as f,i as p,l as re,m as ie,p as ae,r as oe,s as se,u as m,v as ce,w as le,x as ue}from"./sculpture-dark-Cfb-XN1r.js";var h=e(t(),1),g=a(),_=400,de=160,fe=80,v=1500,y=8,pe=[`straight`,`gentle`,`winding`,`hills`,`racing`,`deep`],b={dark:{background:`transparent`,road:`#08080a`,lines:`#25252d`,tail:[`#d856bf`,`#6750a2`,`#c247ac`],head:[`#03b3c3`,`#0e5ea5`,`#324555`],poles:[`#03b3c3`],dust:`#ffffff`},light:{background:`transparent`,road:`#efeff2`,lines:`#d0d0d7`,tail:[`#d856bf`,`#6750a2`,`#c247ac`],head:[`#03b3c3`,`#0e5ea5`,`#324555`],poles:[`#03b3c3`],dust:`#18181b`}},x=`
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
`,C=null,w=e=>{if(C=C??document.createElement(`canvas`).getContext(`2d`),!C)return[1,1,1];C.fillStyle=`#000000`,C.fillStyle=e;let t=String(C.fillStyle);if(t.startsWith(`#`)){let e=parseInt(t.slice(1,7),16);return[(e>>16&255)/255,(e>>8&255)/255,(e&255)/255]}let n=t.match(/[\d.]+/g)?.map(Number)??[0,0,0];return[n[0]/255,n[1]/255,n[2]/255]},T=(e,t,n)=>{let r=n.length?n:[`#ffffff`];for(let t=0;t<y;t++)e.value[t].fromArray(w(r[t%r.length]));t.value=Math.min(r.length,y)},Ee=e=>{let t=new d;return t.setIndex(e.index),Object.entries(e.attributes).forEach(([e,n])=>t.setAttribute(e,n)),t},E=e=>Math.sin(e)*.5+.5,D=(e,t)=>Math.cos(Math.PI*e*4+t)*25+Math.cos(Math.PI*e*8+t*2)**2*5,O=(e,t)=>-E(Math.PI*e*8+t)*10-E(Math.PI*e+t/8)**5*10,k=(e,t)=>Math.sin(e*Math.PI*4+t)*10,A=(e,t)=>Math.abs(e*10)**2+Math.sin(e*Math.PI*8+t)*20,j=(e,t)=>{let{PI:n,cos:r,sin:i}=Math;return[[r(e*n*5+t)*25-r(.02*n*5+t)*25,i(e*n*2+n*.5+t)*15-i(.02*n*2+n*.5+t)*15,0],[D(e,t)-D(.0125,t),O(e,t)-O(.0125,t),0],[r(e*n*3+t)*30-r(.02*n*3+t)*30,E(e*n*6+t)*30-E(.02*n*6+t)*30,E(e*n*10+t)*20-E(.02*n*10+t)*20],[i(e*n*2+t)*35-i(.0125*n*2+t)*35,i(e*n*3+t)*10-i(.0125*n*3+t)*10,0],[k(e,t)-k(.02,t),A(e,t)-A(.02,t),0]]},De=(e,t)=>{let n=.025,[r,,i,a]=j(n,e);return[[r[0]*t*2,r[1]*t*.4,-3],[(D(n,e)-D(.032,e))*t*-2,(O(n,e)-O(.032,e))*t*-5,-10],[i[0]*t*2,i[1]*t*2,i[2]*t*2-5],[a[0]*t,a[1]*t,-5],[(k(n,e)-k(.035,e))*t*-2,(A(n,e)-A(.035,e))*t*-4,-10]]},M=`absolute inset-0 overflow-hidden touch-pan-y select-none [-webkit-tap-highlight-color:transparent] [-webkit-touch-callout:none] [&>canvas]:block [&>canvas]:h-full [&>canvas]:w-full`,N=({curve:e=`winding`,curvature:t=1,speed:a=1,boost:d=3,fov:x=90,boostFov:S=130,lanes:C=3,roadWidth:E=10,medianWidth:D=2,density:O=40,trailLength:k=1,lightSize:A=1,poles:j=20,poleHeight:N=1,dust:Oe=100,glow:P=.6,reflections:ke=.5,steer:Ae=.35,tailColors:F,headColors:I,poleColors:L,roadColor:R,roadOpacity:z=.1,lineColor:B,background:je,theme:V=`dark`,interactive:Me=!0,boosting:H=!1,onBoostStart:Ne,onBoostEnd:U,className:W=``,style:Pe})=>{let Fe=(0,h.useRef)(null),G=b[V]??b.dark,K={light:V===`light`,curve:pe.includes(e)?e:`winding`,curvature:Math.max(0,t),speed:Math.max(0,a),boost:Math.max(1,d),fov:Math.min(170,Math.max(20,x)),boostFov:Math.min(170,Math.max(20,S)),lanes:Math.max(1,Math.round(C)),roadWidth:Math.max(1,E),medianWidth:Math.max(0,D),density:Math.min(de,Math.max(0,Math.round(O))),trailLength:Math.max(.05,k),lightSize:Math.max(.1,A),poles:Math.min(fe,Math.max(0,Math.round(j))),poleHeight:Math.max(.1,N),dust:Math.min(v,Math.max(0,Math.round(Oe))),glow:Math.max(0,P),reflections:Math.max(0,ke),steer:Math.max(0,Ae),tailColors:F?.length?F:G.tail,headColors:I?.length?I:G.head,poleColors:L?.length?L:G.poles,roadColor:R??G.road,roadOpacity:Math.min(1,Math.max(0,z)),lineColor:B??G.lines,background:je??G.background,dustColor:G.dust,interactive:Me,boosting:H},q=(0,h.useRef)(K);q.current=K;let Ie=(0,h.useRef)({onBoostStart:Ne,onBoostEnd:U});return Ie.current={onBoostStart:Ne,onBoostEnd:U},(0,h.useEffect)(()=>{let e=Fe.current;if(!e)return;let t=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches??!1,a=new oe({antialias:!0,alpha:!0,powerPreference:`high-performance`});a.outputColorSpace=ie,a.autoClear=!1,a.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),e.appendChild(a.domElement);let d=new u,h=new c(q.current.fov,1,.1,1e4);h.position.set(0,8,-5);let g={uTime:{value:0},uCurvature:{value:1},uCurveA:{value:new i},uCurveB:{value:0},uFogNear:{value:_*.22},uFogFar:{value:_*.95},uTravel:{value:_},uStretch:{value:0},uPixel:{value:.001}},b=[],x=[],S=(e,t,n,r={})=>{let i=new ue({vertexShader:e,fragmentShader:t,uniforms:{...g,...n},transparent:!0,depthWrite:!1,...r});return b.push(i),i},C=()=>({value:Array.from({length:y},()=>new s(1,1,1))}),E=new ce(1,_,1,220);E.rotateX(-Math.PI/2),E.translate(0,0,-200),b.push(E);let D={uWidth:{value:1},uRoadColor:{value:new s},uLineColor:{value:new s},uBackground:{value:new s},uRoadWidth:{value:10},uMedian:{value:2},uLanes:{value:3},uTransparent:{value:0},uOpacity:{value:1}},O=S(be,xe,D,{transparent:!0,depthWrite:!0}),k=new f(E,O);k.frustumCulled=!1,k.renderOrder=0,k.layers.enable(1),d.add(k);let A=new o(new te(new s(0,0,0),new s(0,0,-1)),24,1,7,!1);b.push(A);let j=(e,t,n)=>{let r=Ee(A),i=new Float32Array(1280),a=new Float32Array(1280),o=new Float32Array(320),s=new Float32Array(320);for(let e=0;e<de;e++){let t=[Math.random(),Math.random(),Math.random(),Math.random()],n=[Math.random(),Math.random(),Math.random(),Math.random()*Math.random()],r=Math.random();for(let c=0;c<2;c++){let l=e*2+c;i.set(t,l*4),a.set(n,l*4),o[l]=c?.5:-.5,s[l]=r}}r.setAttribute(`aSeedA`,new m(i,4)),r.setAttribute(`aSeedB`,new m(a,4)),r.setAttribute(`aPair`,new m(o,1)),r.setAttribute(`aTone`,new m(s,1)),r.instanceCount=0,b.push(r);let c={uRoadX:{value:0},uRoadWidth:{value:10},uLanes:{value:3},uDirection:{value:e},uSpeedRange:{value:new le(...n)},uTrail:{value:1},uSize:{value:1},uColors:C(),uColorCount:{value:1},uFade:{value:new le(...t)}},l=(e,t,n,i)=>{let a=S(me,he,{...c,uRadiusScale:{value:e},uSharp:{value:t},uMirror:{value:n},uIntensity:{value:1},uCore:{value:0}},{depthTest:!n});x.push(a);let o=new f(r,a);return o.frustumCulled=!1,o.renderOrder=i,n||o.layers.enable(1),d.add(o),a};return{geometry:r,uniforms:c,reflection:l(2.1,1.2,1,1),core:l(1,.85,0,3)}},M=j(1,[0,.6],[60,80]),N=j(-1,[1,.4],[120,160]),Oe=new ee(1,1,1,8,1,!0);b.push(Oe);let P=Ee(Oe),ke=new Float32Array(640),Ae=new Float32Array(160),F=new Float32Array(160);for(let e=0;e<fe;e++)for(let t=0;t<2;t++){let n=e*2+t;ke.set([Math.random(),Math.random(),Math.random(),Math.random()],n*4),Ae[n]=e+(t?.5:0),F[n]=t?1:-1}P.setAttribute(`aSeed`,new m(ke,4)),P.setAttribute(`aIndex`,new m(Ae,1)),P.setAttribute(`aSide`,new m(F,1)),P.instanceCount=0,b.push(P);let I={uCount:{value:20},uEdge:{value:11},uHeight:{value:1},uColors:C(),uColorCount:{value:1}},L=(e,t,n,r)=>{let i=S(ge,_e,{...I,uRadiusScale:{value:e},uSharp:{value:t},uMirror:{value:n},uIntensity:{value:1},uCore:{value:0}},{depthTest:!n});x.push(i);let a=new f(P,i);return a.frustumCulled=!1,a.renderOrder=r,n||a.layers.enable(1),d.add(a),i},R={reflection:L(2.4,1.2,1,1),core:L(1,.8,0,3)},z=new l,B=new Float32Array(v*2*4),je=new Float32Array(v*2);for(let e=0;e<v;e++){let t=[Math.random(),Math.random(),Math.random(),Math.random()];B.set(t,e*8),B.set(t,e*8+4),je[e*2+1]=1}z.setAttribute(`position`,new p(new Float32Array(v*2*3),3)),z.setAttribute(`aSeed`,new p(B,4)),z.setAttribute(`aEnd`,new p(je,1)),z.setDrawRange(0,0),b.push(z);let V={uSpread:{value:140},uColor:{value:new s(1,1,1)},uIntensity:{value:.5}},Me=S(ve,ye,V);x.push(Me);let H=new ae(z,Me);H.frustumCulled=!1,H.renderOrder=4,d.add(H);let Ne=a.extensions.has(`EXT_color_buffer_float`)||a.extensions.has(`EXT_color_buffer_half_float`),U=Array.from({length:5},(e,t)=>{let i=new r(1,1,{type:Ne?re:n,depthBuffer:t===0});return b.push(i),i}),W=new u,Pe=new ne(-1,1,1,-1,0,1),G=new ce(2,2);b.push(G);let K=new f(G);K.frustumCulled=!1,W.add(K);let Le=(e,t)=>{let n=new ue({vertexShader:Se,fragmentShader:e,uniforms:{uTexture:{value:null},uTexel:{value:new le},uStrength:{value:1},uCeiling:{value:1},uLight:{value:0}},depthTest:!1,depthWrite:!1,...t});return b.push(n),n},Re=Le(Ce,{blending:0}),ze=Le(we,{blending:5,blendSrc:201,blendDst:201,blendSrcAlpha:201,blendDstAlpha:201}),J=Le(Te,{blending:5,blendSrc:201}),Be=(e,t,n)=>{K.material=e,e.uniforms.uTexture.value=t.texture,e.uniforms.uTexel.value.set(1/t.width,1/t.height),a.setRenderTarget(n),a.render(W,Pe)},Ve=new se,He=0,Y={boost:0,held:!1,boosted:!1,fov:q.current.fov,fovVelocity:0,steerX:0,steerY:0,pointerX:0,pointerY:0,weights:[0,0,0,0,0],visible:!0},X={tail:``,head:``,poles:``,surface:``,light:null},Z=new s,Q=0,Ue=performance.now(),We=!0,Ge=e=>{let t=e.tailColors.join();t!==X.tail&&(X.tail=t,T(M.uniforms.uColors,M.uniforms.uColorCount,e.tailColors));let n=e.headColors.join();n!==X.head&&(X.head=n,T(N.uniforms.uColors,N.uniforms.uColorCount,e.headColors));let r=e.poleColors.join();r!==X.poles&&(X.poles=r,T(I.uColors,I.uColorCount,e.poleColors));let i=[e.roadColor,e.lineColor,e.background,e.dustColor].join();if(i!==X.surface){X.surface=i,D.uRoadColor.value.fromArray(w(e.roadColor)),D.uLineColor.value.fromArray(w(e.lineColor)),V.uColor.value.fromArray(w(e.dustColor));let t=e.background===`transparent`,n=t?[0,0,0]:w(e.background);D.uBackground.value.fromArray(n),D.uTransparent.value=+!!t,Ve.setRGB(...n,ie),He=+!t}X.light!==e.light&&(X.light=e.light,x.forEach(t=>{t.blending=e.light?1:2,t.needsUpdate=!0}),J.blendDst=e.light?205:201,J.blendSrcAlpha=e.light?201:200,J.blendDstAlpha=e.light?205:201,J.uniforms.uLight.value=+!!e.light)},Ke=()=>{let t=Math.max(1,e.clientWidth),n=Math.max(1,e.clientHeight);a.setSize(t,n,!1),U.forEach((e,r)=>e.setSize(Math.max(1,Math.round(t/2**(r+1))),Math.max(1,Math.round(n/2**(r+1))))),h.aspect=t/n,h.updateProjectionMatrix(),Je()},qe=e=>{if(Q=0,!We)return;let n=q.current,r=Math.min(.05,Math.max(.001,(e-Ue)/1e3));Ue=e,Ge(n);let i=Y.held&&n.interactive||n.boosting?1:0;Y.boost+=(i-Y.boost)*(1-Math.exp(-r/(i>Y.boost?.28:.85)));let o=n.speed*(t?.3:1)*(1+(n.boost-1)*Y.boost);g.uTime.value+=r*o,g.uStretch.value=Y.boost*1.1,g.uCurvature.value=n.curvature;let s=pe.indexOf(n.curve)-1,c=1-Math.exp(-r/.6);Y.weights=Y.weights.map((e,t)=>e+(+(t===s)-e)*c),g.uCurveA.value.set(Y.weights[0],Y.weights[1],Y.weights[2],Y.weights[3]),g.uCurveB.value=Y.weights[4];let l=n.roadWidth/2+n.medianWidth/2,u=.45+.55*n.roadOpacity;[M,N].forEach((e,t)=>{e.geometry.instanceCount=n.density*2,e.uniforms.uRoadX.value=t?l:-l,e.uniforms.uRoadWidth.value=n.roadWidth,e.uniforms.uLanes.value=n.lanes,e.uniforms.uTrail.value=n.trailLength,e.uniforms.uSize.value=n.lightSize,e.core.uniforms.uIntensity.value=n.light?.95:1+.35*Y.boost,e.core.uniforms.uCore.value=n.light?0:.75,e.reflection.uniforms.uIntensity.value=n.reflections*(n.light?.22:.42)*u}),P.instanceCount=n.poles*2,I.uCount.value=Math.max(1,n.poles),I.uEdge.value=n.roadWidth+n.medianWidth/2+.8,I.uHeight.value=n.poleHeight,R.core.uniforms.uIntensity.value=n.light?.9:1,R.core.uniforms.uCore.value=n.light?0:.6,R.reflection.uniforms.uIntensity.value=n.reflections*(n.light?.2:.38)*u,z.setDrawRange(0,n.dust*2),V.uIntensity.value=(n.light?.35:.45)*(1+Y.boost),V.uSpread.value=(n.roadWidth*2+n.medianWidth)*5,D.uWidth.value=n.roadWidth*2+n.medianWidth+3,D.uRoadWidth.value=n.roadWidth,D.uMedian.value=n.medianWidth,D.uLanes.value=n.lanes,D.uOpacity.value=n.roadOpacity,O.depthWrite=n.roadOpacity>.5;let ee=t?n.fov:n.fov+(n.boostFov-n.fov)*Y.boost;Y.fovVelocity+=((ee-Y.fov)*90-Y.fovVelocity*13)*r,Y.fov+=Y.fovVelocity*r,h.fov=Y.fov,g.uPixel.value=2*Math.tan(Y.fov*Math.PI/360)/Math.max(1,a.domElement.height);let te=1-Math.exp(-r/.35),ne=n.interactive?n.steer:0;Y.steerX+=(Y.pointerX*ne-Y.steerX)*te,Y.steerY+=(Y.pointerY*ne-Y.steerY)*te,h.position.set(Y.steerX*n.roadWidth*.45,8-Y.steerY*2.5,-5);let f=De(g.uTime.value,n.curvature),p=1-Y.weights.reduce((e,t)=>e+t,0);if(Z.set(0,0,-10*p),f.forEach((e,t)=>{Z.x+=e[0]*Y.weights[t],Z.y+=e[1]*Y.weights[t],Z.z+=e[2]*Y.weights[t]}),Z.x+=Y.steerX*2.5,Z.add(h.position),h.lookAt(Z),h.updateProjectionMatrix(),a.setRenderTarget(null),a.setClearColor(Ve,He),a.clear(),a.render(d,h),n.glow>0){let e=g.uPixel.value;g.uPixel.value=e*(a.domElement.height/U[0].height),h.layers.set(1),O.colorWrite=!1,a.setRenderTarget(U[0]),a.setClearColor(0,0),a.clear(),a.render(d,h),O.colorWrite=!0,h.layers.set(0),g.uPixel.value=e;for(let e=1;e<U.length;e++)Be(Re,U[e-1],U[e]);for(let e=U.length-1;e>1;e--)Be(ze,U[e],U[e-1]);J.uniforms.uStrength.value=n.glow*(n.light?.5:1.4),J.uniforms.uCeiling.value=n.glow*(n.light?.3:.5),Be(J,U[1],null)}Y.visible&&(Q=requestAnimationFrame(qe))},Je=()=>{!Q&&We&&Y.visible&&(Ue=performance.now(),Q=requestAnimationFrame(qe))},Ye=e=>{Y.held!==e&&(Y.held=e,q.current.interactive&&(e?Ie.current.onBoostStart?.():Ie.current.onBoostEnd?.()))},Xe=e=>{(e.button===0||e.pointerType!==`mouse`)&&Ye(!0)},$=()=>Ye(!1),Ze=t=>{let n=e.getBoundingClientRect();Y.pointerX=(t.clientX-n.left)/n.width*2-1,Y.pointerY=(t.clientY-n.top)/n.height*2-1},Qe=()=>{Y.pointerX=0,Y.pointerY=0},$e=e=>{q.current.interactive&&e.preventDefault()},et=new ResizeObserver(Ke);et.observe(e);let tt=new IntersectionObserver(e=>{Y.visible=e.some(e=>e.isIntersecting),Y.visible&&Je()});return tt.observe(e),e.addEventListener(`pointerdown`,Xe),e.addEventListener(`pointermove`,Ze),e.addEventListener(`pointerleave`,Qe),e.addEventListener(`contextmenu`,$e),window.addEventListener(`pointerup`,$),window.addEventListener(`pointercancel`,$),window.addEventListener(`blur`,$),Ke(),()=>{We=!1,cancelAnimationFrame(Q),et.disconnect(),tt.disconnect(),e.removeEventListener(`pointerdown`,Xe),e.removeEventListener(`pointermove`,Ze),e.removeEventListener(`pointerleave`,Qe),e.removeEventListener(`contextmenu`,$e),window.removeEventListener(`pointerup`,$),window.removeEventListener(`pointercancel`,$),window.removeEventListener(`blur`,$),b.forEach(e=>e.dispose()),a.dispose(),a.domElement.remove()}},[]),(0,g.jsx)(`div`,{ref:Fe,className:`${M}${W?` ${W}`:``}`,style:Pe})};export{N as default};