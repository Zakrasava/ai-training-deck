import{i as e,t}from"./react-sySUN5R7.js";import{O as n,T as r,b as i,g as a,h as o,o as s,r as c,v as l,w as u,x as d,y as f}from"./sculpture-dark-Cfb-XN1r.js";var p=e(t(),1),m=n(),h=8,g=`
#define MAX_COLORS ${h}
uniform vec2 uCanvas;
uniform float uTime;
uniform float uSpeed;
uniform vec2 uRot;
uniform int uColorCount;
uniform vec3 uColors[MAX_COLORS];
uniform int uTransparent;
uniform float uScale;
uniform float uFrequency;
uniform float uWarpStrength;
uniform vec2 uPointer; // in NDC [-1,1]
uniform float uMouseInfluence;
uniform float uParallax;
uniform float uNoise;
uniform int uIterations;
uniform float uIntensity;
uniform float uBandWidth;
varying vec2 vUv;

void main() {
  float t = uTime * uSpeed;
  vec2 p = vUv * 2.0 - 1.0;
  p += uPointer * uParallax * 0.1;
  vec2 rp = vec2(p.x * uRot.x - p.y * uRot.y, p.x * uRot.y + p.y * uRot.x);
  vec2 q = vec2(rp.x * (uCanvas.x / uCanvas.y), rp.y);
  q /= max(uScale, 0.0001);
  q /= 0.5 + 0.2 * dot(q, q);
  q += 0.2 * cos(t) - 7.56;
  vec2 toward = (uPointer - rp);
  q += toward * uMouseInfluence * 0.2;

    for (int j = 0; j < 5; j++) {
      if (j >= uIterations - 1) break;
      vec2 rr = sin(1.5 * (q.yx * uFrequency) + 2.0 * cos(q * uFrequency));
      q += (rr - q) * 0.15;
    }

    vec3 col = vec3(0.0);
    float a = 1.0;

    if (uColorCount > 0) {
      vec2 s = q;
      vec3 sumCol = vec3(0.0);
      float cover = 0.0;
      for (int i = 0; i < MAX_COLORS; ++i) {
            if (i >= uColorCount) break;
            s -= 0.01;
            vec2 r = sin(1.5 * (s.yx * uFrequency) + 2.0 * cos(s * uFrequency));
            float m0 = length(r + sin(5.0 * r.y * uFrequency - 3.0 * t + float(i)) / 4.0);
            float kBelow = clamp(uWarpStrength, 0.0, 1.0);
            float kMix = pow(kBelow, 0.3); // strong response across 0..1
            float gain = 1.0 + max(uWarpStrength - 1.0, 0.0); // allow >1 to amplify displacement
            vec2 disp = (r - s) * kBelow;
            vec2 warped = s + disp * gain;
            float m1 = length(warped + sin(5.0 * warped.y * uFrequency - 3.0 * t + float(i)) / 4.0);
            float m = mix(m0, m1, kMix);
            float w = 1.0 - exp(-uBandWidth / exp(uBandWidth * m));
            sumCol += uColors[i] * w;
            cover = max(cover, w);
      }
      col = clamp(sumCol, 0.0, 1.0);
      a = uTransparent > 0 ? cover : 1.0;
    } else {
        vec2 s = q;
        for (int k = 0; k < 3; ++k) {
            s -= 0.01;
            vec2 r = sin(1.5 * (s.yx * uFrequency) + 2.0 * cos(s * uFrequency));
            float m0 = length(r + sin(5.0 * r.y * uFrequency - 3.0 * t + float(k)) / 4.0);
            float kBelow = clamp(uWarpStrength, 0.0, 1.0);
            float kMix = pow(kBelow, 0.3);
            float gain = 1.0 + max(uWarpStrength - 1.0, 0.0);
            vec2 disp = (r - s) * kBelow;
            vec2 warped = s + disp * gain;
            float m1 = length(warped + sin(5.0 * warped.y * uFrequency - 3.0 * t + float(k)) / 4.0);
            float m = mix(m0, m1, kMix);
            col[k] = 1.0 - exp(-uBandWidth / exp(uBandWidth * m));
        }
        a = uTransparent > 0 ? max(max(col.r, col.g), col.b) : 1.0;
    }

    col *= uIntensity;

    if (uNoise > 0.0001) {
      float n = fract(sin(dot(gl_FragCoord.xy + vec2(uTime), vec2(12.9898, 78.233))) * 43758.5453123);
      col += (n - 0.5) * uNoise;
      col = clamp(col, 0.0, 1.0);
    }

    vec3 rgb = (uTransparent > 0) ? col * a : col;
    gl_FragColor = vec4(rgb, a);
}
`,_=`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;function v({className:e,style:t,rotation:n=90,speed:v=.2,colors:y=[],transparent:b=!0,autoRotate:x=0,scale:S=1,frequency:C=1,warpStrength:w=1,mouseInfluence:T=1,parallax:E=.5,noise:D=.15,iterations:O=1,intensity:k=1.5,bandWidth:A=6}){let j=(0,p.useRef)(null),M=(0,p.useRef)(null),N=(0,p.useRef)(null),P=(0,p.useRef)(null),F=(0,p.useRef)(null),I=(0,p.useRef)(n),L=(0,p.useRef)(x),R=(0,p.useRef)(new u(0,0)),z=(0,p.useRef)(new u(0,0)),B=(0,p.useRef)(8);return(0,p.useEffect)(()=>{let e=j.current,t=new i,n=new a(-1,1,1,-1,0,1),p=new l(2,2),m=Array.from({length:h},()=>new r(0,0,0)),y=new d({vertexShader:_,fragmentShader:g,uniforms:{uCanvas:{value:new u(1,1)},uTime:{value:0},uSpeed:{value:v},uRot:{value:new u(1,0)},uColorCount:{value:0},uColors:{value:m},uTransparent:{value:+!!b},uScale:{value:S},uFrequency:{value:C},uWarpStrength:{value:w},uPointer:{value:new u(0,0)},uMouseInfluence:{value:T},uParallax:{value:E},uNoise:{value:D},uIterations:{value:O},uIntensity:{value:k},uBandWidth:{value:A}},premultipliedAlpha:!0,transparent:!0});P.current=y;let x=new o(p,y);t.add(x);let V=new c({antialias:!1,powerPreference:`high-performance`,alpha:!0});M.current=V,V.outputColorSpace=f,V.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),V.setClearColor(0,+!b),V.domElement.style.width=`100%`,V.domElement.style.height=`100%`,V.domElement.style.display=`block`,e.appendChild(V.domElement);let H=new s,U=()=>{let t=e.clientWidth||1,n=e.clientHeight||1;V.setSize(t,n,!1),y.uniforms.uCanvas.value.set(t,n)};if(U(),`ResizeObserver`in window){let t=new ResizeObserver(U);t.observe(e),F.current=t}else window.addEventListener(`resize`,U);let W=()=>{let e=H.getDelta(),r=H.elapsedTime;y.uniforms.uTime.value=r;let i=(I.current%360+L.current*r)*Math.PI/180,a=Math.cos(i),o=Math.sin(i);y.uniforms.uRot.value.set(a,o);let s=z.current,c=R.current,l=Math.min(1,e*B.current);s.lerp(c,l),y.uniforms.uPointer.value.copy(s),V.render(t,n),N.current=requestAnimationFrame(W)};return N.current=requestAnimationFrame(W),()=>{N.current!==null&&cancelAnimationFrame(N.current),F.current?F.current.disconnect():window.removeEventListener(`resize`,U),p.dispose(),y.dispose(),V.dispose(),V.forceContextLoss(),V.domElement&&V.domElement.parentElement===e&&e.removeChild(V.domElement)}},[]),(0,p.useEffect)(()=>{let e=P.current,t=M.current;if(!e)return;I.current=n,L.current=x,e.uniforms.uSpeed.value=v,e.uniforms.uScale.value=S,e.uniforms.uFrequency.value=C,e.uniforms.uWarpStrength.value=w,e.uniforms.uMouseInfluence.value=T,e.uniforms.uParallax.value=E,e.uniforms.uNoise.value=D,e.uniforms.uIterations.value=O,e.uniforms.uIntensity.value=k,e.uniforms.uBandWidth.value=A;let i=(y||[]).filter(Boolean).slice(0,h).map(e=>{let t=e.replace(`#`,``).trim(),n=t.length===3?[parseInt(t[0]+t[0],16),parseInt(t[1]+t[1],16),parseInt(t[2]+t[2],16)]:[parseInt(t.slice(0,2),16),parseInt(t.slice(2,4),16),parseInt(t.slice(4,6),16)];return new r(n[0]/255,n[1]/255,n[2]/255)});for(let t=0;t<h;t++){let n=e.uniforms.uColors.value[t];t<i.length?n.copy(i[t]):n.set(0,0,0)}e.uniforms.uColorCount.value=i.length,e.uniforms.uTransparent.value=+!!b,t&&t.setClearColor(0,+!b)},[n,x,v,S,C,w,T,E,D,O,k,A,y,b]),(0,p.useEffect)(()=>{let e=P.current,t=j.current;if(!e||!t)return;let n=e=>{let n=t.getBoundingClientRect(),r=(e.clientX-n.left)/(n.width||1)*2-1,i=-((e.clientY-n.top)/(n.height||1)*2-1);R.current.set(r,i)};return t.addEventListener(`pointermove`,n),()=>{t.removeEventListener(`pointermove`,n)}},[]),(0,m.jsx)(`div`,{ref:j,className:`w-full h-full relative overflow-hidden ${e}`,style:t})}export{v as default};