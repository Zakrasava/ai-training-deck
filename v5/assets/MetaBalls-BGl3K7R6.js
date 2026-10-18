import{i as e,t}from"./react-sySUN5R7.js";import{O as n}from"./sculpture-dark-Cfb-XN1r.js";var r=e(t(),1),i=n(),a=50,o=51,s={solid:0,outline:1,contour:2},c=.877,l=e=>e-Math.floor(e),u=e=>{let t=[e*.1031,e*.103,e*.0973].map(l),n=t[0]*(t[1]+33.33)+t[1]*(t[2]+33.33)+t[2]*(t[0]+33.33);return t.map(e=>l(e+n))},d=e=>{let t=[e[0]*.1031,e[1]*.103,e[2]*.0973].map(l),n=t[0]*(t[1]+33.33)+t[1]*(t[0]+33.33)+t[2]*(t[2]+33.33),r=t.map(e=>l(e+n));return[l((r[0]+r[1])*r[2]),l((r[0]+r[0])*r[1]),l((r[1]+r[0])*r[0])]},f=e=>{let t=String(e||``).trim().replace(`#`,``);return t.length===3&&(t=t.replace(/./g,e=>e+e)),/^[0-9a-f]{6}/i.test(t)?[0,2,4].map(e=>parseInt(t.slice(e,e+2),16)/255):[1,1,1]},p=(e,t,n)=>Math.min(n,Math.max(t,e)),m=(e,t,n)=>{let r=p((n-e)/(t-e),0,1);return r*r*(3-2*r)},h=e=>1-(1-p(e,0,1))**3,g=e=>{let t=p(e,0,1);return t<.5?4*t*t*t:1-(-2*t+2)**3/2},_=`#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`,v=`#version 300 es
precision highp float;

uniform vec2 uResolution;
uniform float uScale;
uniform vec4 uBalls[${o}];
uniform vec4 uShapes[${o}];
uniform int uCount;
uniform float uGamma;
uniform float uThreshold;
uniform vec3 uColor;
uniform vec3 uCursorColor;
uniform int uVariant;
uniform float uLine;
uniform float uSpacing;
uniform float uRings;
uniform float uOpaque;

out vec4 outColor;

void main() {
  vec2 p = (gl_FragCoord.xy - 0.5 * uResolution) * uScale;
  float field = 0.0;
  float tint = 0.0;
  float mass = 0.0;
  vec2 grad = vec2(0.0);
  bool classic = abs(uGamma - 1.0) < 0.001;
  for (int i = 0; i < ${o}; i++) {
    if (i >= uCount) break;
    vec4 ball = uBalls[i];
    vec4 shape = uShapes[i];
    vec2 d = p - ball.xy;
    vec2 q = vec2(shape.x * d.x + shape.y * d.y, shape.y * d.x + shape.z * d.y);
    float qq = max(dot(q, q), ball.z * 1e-4 + 1e-12);
    float v = ball.z / qq;
    float w = classic ? v : pow(v, uGamma);
    field += w;
    float weight = w / (1.0 + w / uThreshold);
    mass += weight;
    tint += weight * ball.w;
    grad -= 2.0 * uGamma * w / qq * vec2(shape.x * q.x + shape.y * q.y, shape.y * q.x + shape.z * q.y);
  }
  float slope = max(length(grad) * uScale, 1e-8);
  vec3 color = mix(uColor, uCursorColor, mass > 0.0 ? clamp(tint / mass, 0.0, 1.0) : 0.0);
  float alpha;
  if (uVariant == 0) {
    alpha = field > 3.0 * uThreshold ? 1.0 : clamp((field - uThreshold) / slope + 0.5, 0.0, 1.0);
  } else if (uVariant == 1) {
    alpha = field > 3.0 * uThreshold ? 0.0 : clamp(0.5 * uLine + 0.5 - abs((field - uThreshold) / slope), 0.0, 1.0);
  } else {
    float rho = pow(max(field / uThreshold, 1e-6), -0.5 / uGamma);
    float rate = rho * slope / (2.0 * uGamma * max(field, 1e-8));
    float u = (rho - 1.0) / uSpacing;
    float ring = floor(u + 0.5);
    float gap = (u - ring) * uSpacing / max(rate, 1e-8);
    alpha = clamp(0.5 * uLine + 0.5 - abs(gap), 0.0, 1.0);
    alpha *= ring < -0.5 || ring > uRings + 0.5 ? 0.0 : 1.0 - ring / (uRings + 1.0);
    if (ring > 0.5) alpha *= smoothstep(uLine * 6.0, uLine * 12.0, uSpacing / max(rate, 1e-8));
  }
  outColor = vec4(color * alpha, uOpaque > 0.5 ? 1.0 : alpha);
}
`,y=(e,t,n)=>{let r=e.createShader(t);return e.shaderSource(r,n),e.compileShader(r),r},b=e=>{let t=u(e+1),n=d(t);return{start:t[0]*Math.PI*2,rate:.1*Math.PI+t[1]*.3*Math.PI,reach:5+t[1]*5,toggle:Math.floor(n[0]*2),radius:.5+n[2]*1.5,lane:n[1]*2-1,rise:.55+t[2]*.7,sway:n[0]*Math.PI*2,delay:.1+l(t[2]*7.31+n[1]*3.17)*.55,x:0,y:0,vx:0,vy:0,fx:0,fy:0,ax:0,ay:0,avx:0,avy:0,a:0,b:0,va:0,vb:0}},x=({className:e=``,color:t=`#ffffff`,cursorBallColor:n=`#ffffff`,speed:o=.3,enableMouseInteraction:l=!0,hoverSmoothness:u=.1,animationSize:d=30,ballCount:x=15,clumpFactor:S=1,cursorBallSize:C=3,enableTransparency:w=!1,variant:T=`solid`,motion:E=`orbit`,gooeyness:D=.5,stickiness:O=.5,stretch:k=.5,wobble:A=.5,lineWidth:j=1.5,rings:M=4,clickBurst:N=!0,intro:P=!0,paused:F=!1,dpr:I,style:L})=>{let R=(0,r.useRef)(null),z=(0,r.useRef)(null),B={color:t,cursorBallColor:n,speed:o,enableMouseInteraction:l,hoverSmoothness:u,animationSize:d,ballCount:x,clumpFactor:S,cursorBallSize:C,enableTransparency:w,variant:T,motion:E,gooeyness:D,stickiness:O,stretch:k,wobble:A,lineWidth:j,rings:M,clickBurst:N,paused:F,dpr:I},V=(0,r.useRef)(B);V.current=B;let ee=(0,r.useRef)(P),H=(0,r.useRef)(null);return(0,r.useEffect)(()=>{let e=R.current,t=z.current;if(!e||!t)return;let n=t.getContext(`webgl2`,{alpha:!0,antialias:!1,premultipliedAlpha:!0});if(!n)return;let r=n.createProgram();if(n.attachShader(r,y(n,n.VERTEX_SHADER,_)),n.attachShader(r,y(n,n.FRAGMENT_SHADER,v)),n.bindAttribLocation(r,0,`position`),n.linkProgram(r),!n.getProgramParameter(r,n.LINK_STATUS))return;n.useProgram(r);let i=n.createBuffer();n.bindBuffer(n.ARRAY_BUFFER,i),n.bufferData(n.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),n.STATIC_DRAW),n.enableVertexAttribArray(0),n.vertexAttribPointer(0,2,n.FLOAT,!1,0,0);let o=e=>n.getUniformLocation(r,e),l={resolution:o(`uResolution`),scale:o(`uScale`),balls:o(`uBalls`),shapes:o(`uShapes`),count:o(`uCount`),gamma:o(`uGamma`),threshold:o(`uThreshold`),color:o(`uColor`),cursorColor:o(`uCursorColor`),variant:o(`uVariant`),line:o(`uLine`),spacing:o(`uSpacing`),rings:o(`uRings`),opaque:o(`uOpaque`)},u=new Float32Array(204),d=new Float32Array(204),x=Array.from({length:a},(e,t)=>b(t)),S=b(57),C={x:0,y:0,vx:0,vy:0,a:0,b:0,va:0,vb:0,pulse:0,pulseVelocity:0,ready:!1},w={x:0,y:0,inside:!1},T=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,E={width:1,height:1,ratio:1},D=new Map,O=e=>(D.has(e)||D.set(e,f(e)),D.get(e)),k=0,A=0,j=ee.current&&!T?0:-1,M=!0,N=0,P=0,F=!0,I=()=>{let r=e.getBoundingClientRect(),i=V.current,a=Math.max(.5,Math.min(i.dpr??window.devicePixelRatio??1,2));E.width=Math.max(1,r.width),E.height=Math.max(1,r.height),E.ratio=a,t.width=Math.max(1,Math.round(E.width*a)),t.height=Math.max(1,Math.round(E.height*a)),n.viewport(0,0,t.width,t.height),F=!0},L=(t,n)=>{let r=e.getBoundingClientRect(),i=V.current.animationSize/Math.max(1,r.height);return{x:(t-r.left-r.width/2)*i,y:(r.top+r.height/2-n)*i,inside:t>=r.left&&t<=r.right&&n>=r.top&&n<=r.bottom}},B=()=>{if(j<0)return{size:1,time:1/0};let e=A-j;return{size:h(e/.5),time:e}},te=(e,t)=>t.time===1/0?1:g((t.time-e.delay)/1.15),U=(e,t,n)=>{let r=t.animationSize*E.width/E.height/2,i=t.animationSize/2,a=Math.min(1.25,t.clumpFactor);if(t.motion===`lava`){let t=Math.sin(k*e.rise*1.6+e.start),o=e.lane*r*.8*a+Math.sin(k*.5*e.rise+e.sway)*r*.06,s=Math.sign(t)*Math.abs(t)**.55*i*.9;return[o*n,s*n]}if(t.motion===`drift`){let t=Math.sin(k*e.rise*.9+e.start)*r*.84*a,o=Math.sin(k*e.rate*1.3+e.sway)*i*.78*a;return[t*n,o*n]}let o=k*e.rate,s=e.start+o;return[Math.cos(s)*e.reach*t.clumpFactor*n,Math.sin(s+o*e.toggle)*e.reach*t.clumpFactor*n]},W=(e,t,n)=>{let r=Math.hypot(e.vx,e.vy),i=.6*n.stretch*Math.tanh(r/14),a=0,o=0;r>1e-4&&(a=i*(e.vx*e.vx-e.vy*e.vy)/(r*r),o=i*2*e.vx*e.vy/(r*r));let s=.85-.68*p(n.wobble,0,1);e.va+=(169*(a-e.a)-2*s*13*e.va)*t,e.vb+=(169*(o-e.b)-2*s*13*e.vb)*t,e.a+=e.va*t,e.b+=e.vb*t},G=e=>{let t=p(e.gooeyness,0,1),n=t<.5?1+(.5-t)*1.2:1-(t-.5)*.5;return{gamma:n,threshold:1.3**n,reach:2**(.5/n)}},ne=(e,t,n,r)=>{let{reach:i}=G(t),a=36*p(t.stickiness,0,1),o=t.cursorBallSize*c*r.size*(1+C.pulse);k+=e*t.speed;for(let i=0;i<n;i++){let n=x[i],[a,o]=U(n,t,te(n,r));n.avx=p((a-n.ax)/e,-40,40),n.avy=p((o-n.ay)/e,-40,40),n.ax=a,n.ay=o,n.fx=20*(a-n.x)-5.4*(n.vx-n.avx),n.fy=20*(o-n.y)-5.4*(n.vy-n.avy)}for(let e=0;e<n;e++){let t=x[e],s=t.radius*c*r.size;for(let o=e+1;o<n;o++){let e=x[o],n=e.radius*c*r.size,l=e.x-t.x,u=e.y-t.y,d=Math.hypot(l,u)||1e-4,f=(s+n)*i;if(d>=f)continue;let p=(s+n)*.62,h;if(d<p)h=-60*(p-d);else{let e=(d-p)/(f-p);h=a*Math.min(s,n)*m(0,.6,e)*(1-m(.82,1,e))}let g=l/d,_=u/d,v=s*s+.05,y=n*n+.05;t.fx+=g*h/v,t.fy+=_*h/v,e.fx-=g*h/y,e.fy-=_*h/y}let l=C.x-t.x,u=C.y-t.y,d=Math.hypot(l,u)||1e-4,f=(s+o)*i;if(d<f){let e=(s+o)*.62,n;if(d<e)n=-140*(e-d);else{let t=(d-e)/(f-e);n=a*.6*s*m(0,.6,t)*(1-m(.82,1,t))}t.fx+=l/d*n/(s*s+.05),t.fy+=u/d*n/(s*s+.05)}}for(let r=0;r<n;r++){let n=x[r];n.vx+=n.fx*e,n.vy+=n.fy*e,n.x+=n.vx*e,n.y+=n.vy*e,W(n,e,t),Number.isFinite(n.x+n.y+n.vx+n.vy+n.a+n.b+n.va+n.vb)||Object.assign(n,{x:n.ax,y:n.ay,vx:0,vy:0,a:0,b:0,va:0,vb:0})}},re=(e,t,n)=>{let r,i;if(w.inside&&t.enableMouseInteraction)r=w.x,i=w.y;else{let e=n.time===1/0?1:g((n.time-.75)/1.3);if(t.motion===`lava`||t.motion===`drift`)[r,i]=U(S,t,e);else{let n=t.animationSize*E.width/E.height/2,a=t.animationSize/2;r=Math.cos(A*t.speed)*n*.3*e,i=Math.sin(A*t.speed)*a*.3*e}}C.ready||(C.x=r,C.y=i,C.ready=!0);let a=1-(1-p(t.hoverSmoothness,.001,1))**(e*60),o=C.x+(r-C.x)*a,s=C.y+(i-C.y)*a,c=1-Math.exp(-e/.05);C.vx+=((o-C.x)/Math.max(e,1e-4)-C.vx)*c,C.vy+=((s-C.y)/Math.max(e,1e-4)-C.vy)*c,C.x=o,C.y=s},ie=(e,t)=>{let n=V.current,r=p(Math.round(n.ballCount),0,a),i=n.animationSize*.45;for(let n=0;n<r;n++){let r=x[n],a=r.x-e,o=r.y-t,s=Math.hypot(a,o)||1e-4;if(s>i)continue;let c=72*(1-s/i)**1.2;r.vx+=a/s*c-o/s*c*.3,r.vy+=o/s*c+a/s*c*.3}C.pulseVelocity+=9},K=(e,t,n)=>{let r=Math.hypot(e.a,e.b),i=Math.cosh(r),a=r>1e-6?Math.sinh(r)/r:1;t[n]=i-a*e.a,t[n+1]=-a*e.b,t[n+2]=i+a*e.a,t[n+3]=0},ae=()=>{let e=V.current,r=p(Math.round(e.ballCount),0,a),i=B(),{gamma:o,threshold:c}=G(e);for(let e=0;e<r;e++){let t=x[e],n=t.radius*i.size;u[e*4]=t.x,u[e*4+1]=t.y,u[e*4+2]=n*n,u[e*4+3]=0,K(t,d,e*4)}let f=e.cursorBallSize*i.size*(1+C.pulse);u[r*4]=C.x,u[r*4+1]=C.y,u[r*4+2]=f*f,u[r*4+3]=1,K(C,d,r*4),n.uniform2f(l.resolution,t.width,t.height),n.uniform1f(l.scale,e.animationSize/t.height),n.uniform4fv(l.balls,u),n.uniform4fv(l.shapes,d),n.uniform1i(l.count,r+1),n.uniform1f(l.gamma,o),n.uniform1f(l.threshold,c),n.uniform3fv(l.color,O(e.color)),n.uniform3fv(l.cursorColor,O(e.cursorBallColor)),n.uniform1i(l.variant,s[e.variant]??0),n.uniform1f(l.line,Math.max(.25,e.lineWidth)*E.ratio),n.uniform1f(l.spacing,.28),n.uniform1f(l.rings,p(Math.round(e.rings),0,12)),n.uniform1f(l.opaque,+!e.enableTransparency),n.clearColor(0,0,0,+!e.enableTransparency),n.clear(n.COLOR_BUFFER_BIT),n.drawArrays(n.TRIANGLES,0,3),F=!1},q=e=>{if(N=0,!M)return;let t=Math.min(.05,P?(e-P)/1e3:1/60);P=e;let n=V.current;if(!n.paused&&t>1e-4){A+=t;let e=p(Math.round(n.ballCount),0,a),r=B();re(t,n,r);let i=Math.max(1,Math.ceil(t/(1/240)));for(let a=0;a<i;a++)ne(t/i,n,e,r);W(C,t,n),C.pulseVelocity+=(-170*C.pulse-10.92*C.pulseVelocity)*t,C.pulse=Math.max(-.4,C.pulse+C.pulseVelocity*t),F=!0}F&&ae(),N=requestAnimationFrame(q)},J=()=>{!N&&M&&(P=0,N=requestAnimationFrame(q))},Y=e=>{let t=L(e.clientX,e.clientY);w.x=t.x,w.y=t.y,w.inside=t.inside},X=e=>{e.relatedTarget||(w.inside=!1)},Z=e=>{e.pointerType!==`mouse`&&(w.inside=!1)},Q=e=>{let t=V.current;if(!t.clickBurst||!t.enableMouseInteraction||t.paused||e.button!==0)return;let n=L(e.clientX,e.clientY);n.inside&&ie(n.x,n.y)},$=new ResizeObserver(I);$.observe(e);let oe=new IntersectionObserver(e=>{M=e.some(e=>e.isIntersecting),M&&J()});return oe.observe(e),window.addEventListener(`pointermove`,Y,{passive:!0}),window.addEventListener(`pointerdown`,Q,{passive:!0}),window.addEventListener(`pointerout`,X),window.addEventListener(`pointerup`,Z),window.addEventListener(`pointercancel`,Z),I(),J(),H.current={refresh:()=>{F=!0}},()=>{cancelAnimationFrame(N),$.disconnect(),oe.disconnect(),window.removeEventListener(`pointermove`,Y),window.removeEventListener(`pointerdown`,Q),window.removeEventListener(`pointerout`,X),window.removeEventListener(`pointerup`,Z),window.removeEventListener(`pointercancel`,Z),n.deleteBuffer(i),n.deleteProgram(r),H.current=null}},[]),(0,r.useEffect)(()=>{H.current?.refresh()}),(0,i.jsx)(`div`,{ref:R,className:`relative h-full w-full ${e}`.trim(),style:L,children:(0,i.jsx)(`canvas`,{ref:z,className:`block h-full w-full`})})};export{x as default};