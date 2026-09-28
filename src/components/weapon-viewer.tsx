"use client";
import Link from "next/link";
import {useEffect,useRef,useState} from "react";

export function WeaponViewer(){
 const host=useRef<HTMLDivElement>(null);
 const actions=useRef<{reset:()=>void;turn:(direction:number)=>void;auto:(value:boolean)=>void;detail:(value:boolean)=>void;metal:(value:boolean)=>void}>({reset:()=>{},turn:()=>{},auto:()=>{},detail:()=>{},metal:()=>{}});
 const [rotating,setRotating]=useState(false);
 const [detail,setDetail]=useState(false);
 const [metal,setMetal]=useState(false);
 const [state,setState]=useState<"loading"|"ready"|"error">("loading");
 useEffect(()=>{
  let disposed=false;let cleanup=()=>{};
  async function start(){
   const [T,{OBJLoader},{OrbitControls},{RoomEnvironment}]=await Promise.all([import("three"),import("three/examples/jsm/loaders/OBJLoader.js"),import("three/examples/jsm/controls/OrbitControls.js"),import("three/examples/jsm/environments/RoomEnvironment.js")]);
   if(disposed||!host.current)return;
   const container=host.current;
   const renderer=new T.WebGLRenderer({antialias:true,alpha:true,powerPreference:"high-performance"});
   renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));renderer.setClearColor(0,0);renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=.85;
   container.appendChild(renderer.domElement);
   renderer.domElement.setAttribute("aria-label","Трёхмерная модель AK-47. Перетаскивайте для вращения, используйте стрелки для поворота.");renderer.domElement.setAttribute("role","img");renderer.domElement.tabIndex=0;
   const scene=new T.Scene();const camera=new T.PerspectiveCamera(32,1,.1,100);
   const pmrem=new T.PMREMGenerator(renderer);const room=new RoomEnvironment();const environment=pmrem.fromScene(room,.04);scene.environment=environment.texture;scene.environmentIntensity=.7;room.dispose();pmrem.dispose();
   scene.add(new T.HemisphereLight(0xffffff,0x4b352d,.6));const key=new T.DirectionalLight(0xffffff,2);key.position.set(-3,5,6);scene.add(key);
   const controls=new OrbitControls(camera,renderer.domElement);renderer.domElement.style.touchAction="none";controls.enableDamping=true;controls.dampingFactor=.09;controls.enablePan=false;controls.enableZoom=false;controls.rotateSpeed=.65;controls.minPolarAngle=.25;controls.maxPolarAngle=Math.PI-.25;
   let object:InstanceType<typeof T.Group>|undefined;let frame=0;let visible=true;let targetZoom=1;let previousTime=0;
   const reduced=window.matchMedia("(prefers-reduced-motion: reduce)");
   controls.autoRotate=!reduced.matches;controls.autoRotateSpeed=.65;setRotating(controls.autoRotate);
   const pause=()=>{controls.autoRotate=false;setRotating(false);};controls.addEventListener("start",pause);
   const onMotion=()=>{if(reduced.matches)pause();};reduced.addEventListener("change",onMotion);
   function reset(){targetZoom=1;setDetail(false);const aspect=container.clientWidth/Math.max(container.clientHeight,1);camera.position.set(0,.3,Math.max(8.4,13/aspect));controls.target.set(0,0,0);controls.update();}
   const resize=new ResizeObserver(()=>{const w=container.clientWidth,h=container.clientHeight;renderer.setSize(w,h);camera.aspect=w/Math.max(h,1);camera.updateProjectionMatrix();reset();});resize.observe(container);
   const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;});observer.observe(container);
   const turn=(direction:number)=>{pause();const offset=camera.position.clone().sub(controls.target);offset.applyAxisAngle(new T.Vector3(0,1,0),direction*Math.PI/8);camera.position.copy(offset.add(controls.target));controls.update();};actions.current={reset:()=>{pause();reset();},turn,auto:(value)=>{controls.autoRotate=value;setRotating(value);},detail:(value)=>{pause();targetZoom=value?1.65:1;setDetail(value);},metal:(value)=>{setMetal(value);object?.traverse(node=>{if(node instanceof T.Mesh){const material=node.material as InstanceType<typeof T.MeshStandardMaterial>;material.metalness=value?.95:.3;material.roughness=value?.18:.48;}});}};
   const onKey=(event:KeyboardEvent)=>{if(event.key==="ArrowLeft"||event.key==="ArrowRight"){event.preventDefault();turn(event.key==="ArrowLeft"?-1:1);}if(event.key==="Home"){event.preventDefault();actions.current.reset();}};renderer.domElement.addEventListener("keydown",onKey);
   const contextLost=(event:Event)=>{event.preventDefault();if(!disposed)setState("error");};renderer.domElement.addEventListener("webglcontextlost",contextLost);
   const render=(time:number)=>{frame=requestAnimationFrame(render);const delta=Math.min((time-previousTime)/1000,.05);previousTime=time;if(visible&&!document.hidden){camera.zoom=T.MathUtils.damp(camera.zoom,targetZoom,reduced.matches?100:8,delta);camera.updateProjectionMatrix();controls.update(delta);renderer.render(scene,camera);}};frame=requestAnimationFrame(render);
   cleanup=()=>{cancelAnimationFrame(frame);resize.disconnect();observer.disconnect();controls.removeEventListener("start",pause);reduced.removeEventListener("change",onMotion);controls.dispose();environment.dispose();object?.traverse(node=>{if(node instanceof T.Mesh){node.geometry.dispose();(Array.isArray(node.material)?node.material:[node.material]).forEach(m=>m.dispose());}});renderer.dispose();renderer.domElement.remove();};
   try{
    object=await new OBJLoader().loadAsync(`${process.env.NEXT_PUBLIC_BASE_PATH??""}/models/ak47.obj`);if(disposed){object.traverse(node=>{if(node instanceof T.Mesh)node.geometry.dispose();});return;}
    object.traverse(node=>{if(!(node instanceof T.Mesh))return;const geometry=node.geometry;const position=geometry.attributes.position;const colors=new Float32Array(position.count*3);const dark=new T.Color("#242629"),ceramic=new T.Color("#e7e4da"),orange=new T.Color("#ff5b26");
     // A bespoke FLARE finish, not a reproduction of a catalog skin.
     for(let i=0;i<position.count;i++){const y=position.getY(i),z=position.getZ(i);const smooth=(a:number,b:number,v:number)=>T.MathUtils.smoothstep(v,a,b);const body=(1-smooth(7.5,9,z))*smooth(-1,.4,y);const stock=1-smooth(-4,-3,z);const foregrip=smooth(8.5,9.5,z)*(1-smooth(16,17,z))*smooth(-.2,.6,y);const end=1-smooth(-9.2,-8.7,z);const color=dark.clone().lerp(ceramic,Math.max(body,stock)).lerp(orange,Math.max(foregrip,end));color.toArray(colors,i*3);}
     geometry.setAttribute("color",new T.BufferAttribute(colors,3));node.material=new T.MeshStandardMaterial({vertexColors:true,metalness:.3,roughness:.48});
    });
    const bounds=new T.Box3().setFromObject(object);object.position.sub(bounds.getCenter(new T.Vector3()));const pivot=new T.Group();pivot.add(object);pivot.rotation.y=-Math.PI/2;const scale=5.8/bounds.getSize(new T.Vector3()).z;pivot.scale.setScalar(scale);scene.add(pivot);reset();setState("ready");
   }catch{if(!disposed)setState("error");}
  }
  start().catch(()=>{if(!disposed)setState("error");});return()=>{disposed=true;cleanup();};
 },[]);
 return <div className="weapon-viewer"><div ref={host} className="weapon-canvas"/>{state==="loading"&&<div className="studio-loading" role="status"><span/>Загружаем 3D-модель</div>}{state==="error"&&<div className="weapon-error" role="status">Не удалось открыть 3D-просмотр.<Link href="/catalog">Перейти к скинам ↗</Link></div>}<span className="viewer-label">AK-47 / FLARE FINISH</span>{state==="ready"&&<><div className="viewer-modes"><button aria-pressed={rotating} onClick={()=>actions.current.auto(!rotating)}>{rotating?"Ⅱ Пауза":"↻ Автоповорот"}</button><button aria-pressed={detail} onClick={()=>actions.current.detail(!detail)}>{detail?"− Целиком":"+ Детали"}</button><button aria-pressed={metal} onClick={()=>actions.current.metal(!metal)}>{metal?"Материал: металл":"Материал: керамика"}</button></div><div className="viewer-controls"><span>Зажмите и вращайте · 360°</span><div><button onClick={()=>actions.current.turn(-1)} aria-label="Повернуть влево">←</button><button onClick={()=>actions.current.turn(1)} aria-label="Повернуть вправо">→</button><button onClick={()=>actions.current.reset()}>Исходный вид ↺</button></div></div></>}</div>;
}
