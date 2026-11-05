(() => {
  let disposeCurrent=()=>{};
  const subtract=(a,b)=>a.map((x,i)=>x-b[i]);
  const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  function geometry(){
    const vertices=[],segments=192;
    const radius=(angle,shape,scale)=>{
      const x=Math.cos(angle),y=Math.sin(angle);
      if(shape==='square')return scale/Math.max(Math.abs(x),Math.abs(y));
      let projection=0;for(let k=0;k<6;k++)projection=Math.max(projection,x*Math.cos(k*Math.PI/3)+y*Math.sin(k*Math.PI/3));
      // Rounded hexagon: intersect a ray with the inset polygon plus a circular rim.
      const corner=.085*scale,apothem=scale*Math.sqrt(3)/2-corner;
      let lo=0,hi=scale*1.1;
      for(let j=0;j<22;j++){
        const r=(lo+hi)/2;let qx=Math.abs(x*r),qy=Math.abs(y*r);
        const d=Math.min(-.8660254038*qx+.5*qy,0);
        qx-=2*d*-.8660254038;qy-=d;
        qx-=Math.max(-.5773502692*apothem,Math.min(.5773502692*apothem,qx));qy-=apothem;
        if(Math.hypot(qx,qy)*Math.sign(qy)>corner)hi=r;else lo=r;
      }
      return (lo+hi)/2;
    };
    const point=(ring,i)=>{const angle=i/segments*Math.PI*2,r=radius(angle,ring[0],ring[1]);return [Math.cos(angle)*r,Math.sin(angle)*r,ring[2]]};
    function triangle(a,b,c,tone){const n=cross(subtract(b,a),subtract(c,a)),length=Math.hypot(...n);for(const p of [a,b,c])vertices.push(...p,...n.map(v=>v/length),tone)}
    function strip(a,b,tone,reverse=false){for(let i=0;i<segments;i++){
      const v=[point(a,i),point(a,i+1),point(b,i+1),point(b,i)];
      const smooth=(ring,k)=>{const tangent=subtract(point(ring,k+.1),point(ring,k-.1)),across=subtract(point(b,k),point(a,k)),n=cross(tangent,across),length=Math.hypot(...n);return n.map(c=>c/length*(reverse?-1:1))};
      const normals=[smooth(a,i),smooth(a,i+1),smooth(b,i+1),smooth(b,i)];
      for(const k of (reverse?[0,2,1,0,3,2]:[0,1,2,0,2,3]))vertices.push(...v[k],...normals[k],tone);
    }}
    const front=[['hex',1,.08],['hex',.998,.102],['hex',.989,.125],['hex',.975,.143],['hex',.954,.153],['hex',.935,.155],['hex',.86,.155],['hex',.846,.158],['hex',.834,.174],['hex',.824,.184],['hex',.813,.184],['hex',.802,.174],['hex',.791,.158],['hex',.777,.155],['square',.253,.155],['square',.234,.145],['square',.218,.11]];
    const tones=front.map(()=>1);
    for(let i=0;i<front.length-1;i++){strip(front[i],front[i+1],tones[i]);strip([front[i][0],front[i][1],-front[i][2]],[front[i+1][0],front[i+1][1],-front[i+1][2]],tones[i],true)}
    strip(['hex',1,-.08],['hex',1,.08],.92);
    strip(['square',.218,.11],['square',.218,-.11],.72);
    return new Float32Array(vertices);
  }
  const vertexSource=`attribute vec3 aPosition;attribute vec3 aNormal;attribute float aTone;uniform float uYaw;uniform float uPitch;uniform float uAspect;varying vec3 vPosition;varying vec3 vNormal;varying float vTone;
  vec3 rotateModel(vec3 p){float c=cos(uYaw),s=sin(uYaw);p=vec3(c*p.x+s*p.z,p.y,-s*p.x+c*p.z);c=cos(uPitch);s=sin(uPitch);return vec3(p.x,c*p.y-s*p.z,s*p.y+c*p.z);}
  void main(){vec3 p=rotateModel(aPosition);vPosition=p;vNormal=rotateModel(aNormal);vTone=aTone;float z=4.0-p.z;gl_Position=vec4(p.x*3.0/uAspect,p.y*3.0,1.01005*z-.201005,z);}`;
  const fragmentSource=`precision mediump float;varying vec3 vPosition;varying vec3 vNormal;varying float vTone;
  vec3 studio(vec3 r){
float top=exp(-pow(abs((r.y-.72)/.16),2.));
float left=exp(-pow(abs((r.x+.68)/.12),2.))*smoothstep(-.65,.25,r.y);
float right=exp(-pow(abs((r.x-.78)/.085),2.));
float panel=exp(-pow(abs((r.x+.12)/.38),8.))*exp(-pow(abs((r.y-.25)/.30),8.));
return vec3(.07,.045,.018)+vec3(1.,.96,.84)*(top*2.8+left*3.8+right*4.5+panel*.65);
}
void main(){vec3 n=normalize(vNormal),v=normalize(vec3(0.,0.,4.)-vPosition),r=reflect(-v,n);
vec3 gold=vec3(1.,.66,.20);float fresnel=pow(1.-max(dot(n,v),0.),5.);
vec3 reflected=studio(r)*.72+studio(normalize(r+vec3(.018,.012,0.)))*.28;
vec3 color=reflected*mix(gold,vec3(1.,.91,.65),fresnel)*vTone;
color+=gold*(.045+.07*max(n.y,0.));
color=vec3(1.)-exp(-color*1.35);color=pow(color,vec3(.4545));
gl_FragColor=vec4(color,1.);}`;
  function mount(container){
    disposeCurrent();if(!container)return false;
    const canvas=document.createElement('canvas');canvas.className='rx-webgl-canvas';canvas.tabIndex=0;canvas.setAttribute('aria-label','Robux em 3D. Arraste para girar ou use as teclas de seta.');canvas.setAttribute('role','img');
    const gl=canvas.getContext('webgl',{alpha:true,antialias:true,premultipliedAlpha:false});if(!gl)return false;
    const shaders=[];
    function shader(type,source){const item=gl.createShader(type);gl.shaderSource(item,source);gl.compileShader(item);if(!gl.getShaderParameter(item,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(item));shaders.push(item);return item}
    let program,buffer;
    try{program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,vertexSource));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fragmentSource));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));gl.useProgram(program);buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);const mesh=geometry();gl.bufferData(gl.ARRAY_BUFFER,mesh,gl.STATIC_DRAW);
      for(const [name,size,offset]of [['aPosition',3,0],['aNormal',3,12],['aTone',1,24]]){const location=gl.getAttribLocation(program,name);gl.enableVertexAttribArray(location);gl.vertexAttribPointer(location,size,gl.FLOAT,false,28,offset)}
      const yawUniform=gl.getUniformLocation(program,'uYaw'),pitchUniform=gl.getUniformLocation(program,'uPitch'),aspectUniform=gl.getUniformLocation(program,'uAspect');
      gl.enable(gl.DEPTH_TEST);gl.clearColor(0,0,0,0);gl.clearDepth(1);
      container.append(canvas);container.classList.add('rx-webgl');container.parentElement?.classList.add('rx-has-webgl');
      let yaw=-.43,pitch=.13,raf=null,last=0,drag=null,dead=false;
      const signals=new AbortController(),reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
      const moving=()=>!dead&&!document.hidden&&!reduced.matches&&!drag&&!container.classList.contains('rx-user-paused')&&!container.classList.contains('rx-offscreen');
      function draw(){const bounds=canvas.getBoundingClientRect(),ratio=Math.min(window.devicePixelRatio||1,2),width=Math.max(1,Math.round(bounds.width*ratio)),height=Math.max(1,Math.round(bounds.height*ratio));if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height}gl.viewport(0,0,width,height);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.uniform1f(yawUniform,yaw);gl.uniform1f(pitchUniform,pitch);gl.uniform1f(aspectUniform,width/height);gl.drawArrays(gl.TRIANGLES,0,mesh.length/7);canvas.dataset.rendered='true';}
      function frame(now){raf=null;if(dead)return;if(moving()&&last)yaw+=Math.min((now-last)/1000,.05)*.31;last=now;draw();if(moving())raf=requestAnimationFrame(frame)}
      function request(){if(dead||raf!==null)return;last=0;raf=requestAnimationFrame(frame)}
      const mutations=new MutationObserver(request);mutations.observe(container,{attributes:true,attributeFilter:['class']});
      const resize=new ResizeObserver(request);resize.observe(canvas);
      canvas.addEventListener('pointerdown',event=>{if(event.button!==0)return;drag={x:event.clientX,y:event.clientY};canvas.setPointerCapture(event.pointerId);canvas.classList.add('is-dragging');request()},{signal:signals.signal});
      canvas.addEventListener('pointermove',event=>{if(!drag)return;yaw+=(event.clientX-drag.x)*.012;pitch=Math.max(-1.1,Math.min(1.1,pitch+(event.clientY-drag.y)*.009));drag={x:event.clientX,y:event.clientY};request()},{signal:signals.signal});
      const release=()=>{drag=null;canvas.classList.remove('is-dragging');request()};
      canvas.addEventListener('pointerup',release,{signal:signals.signal});canvas.addEventListener('pointercancel',release,{signal:signals.signal});canvas.addEventListener('lostpointercapture',release,{signal:signals.signal});
      canvas.addEventListener('keydown',event=>{const change={ArrowLeft:[-.15,0],ArrowRight:[.15,0],ArrowUp:[0,-.12],ArrowDown:[0,.12]}[event.key];if(!change)return;event.preventDefault();yaw+=change[0];pitch=Math.max(-1.1,Math.min(1.1,pitch+change[1]));request()},{signal:signals.signal});
      const visibility=()=>request();document.addEventListener('visibilitychange',visibility,{signal:signals.signal});reduced.addEventListener('change',visibility,{signal:signals.signal});
      canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();disposeCurrent()},{signal:signals.signal});
      disposeCurrent=()=>{if(dead)return;dead=true;if(raf!==null)cancelAnimationFrame(raf);mutations.disconnect();resize.disconnect();signals.abort();gl.deleteBuffer(buffer);gl.deleteProgram(program);shaders.forEach(s=>gl.deleteShader(s));canvas.remove();container.classList.remove('rx-webgl');container.parentElement?.classList.remove('rx-has-webgl');};
      request();return true;
    }catch{if(buffer)gl.deleteBuffer(buffer);if(program)gl.deleteProgram(program);shaders.forEach(s=>gl.deleteShader(s));return false}
  }
  window.addEventListener('pagehide',()=>disposeCurrent());
  window.robux3D={mount,dispose:()=>disposeCurrent(),geometry};
})();

