"use client";
import Link from "next/link";
import Image from "next/image";
import {useEffect,useRef,useState} from "react";

export function WeaponViewer(){
 const host=useRef<HTMLDivElement>(null);
 const actions=useRef<{reset:()=>void;turn:(direction:number)=>void;auto:(value:boolean)=>void;detail:(value:boolean)=>void;metal:(value:boolean)=>void}>({reset:()=>{},turn:()=>{},auto:()=>{},detail:()=>{},metal:()=>{}});
 const [rotating,setRotating]=useState(false);
 const [detail,setDetail]=useState(false);
 const [metal,setMetal]=useState(false);
 const [state,setState]=useState<"loading"|"ready"|"error">("loading");
 useEffect(()=>{
  let disposed=false;let cleanup=()=>{};const abort=new AbortController();
  async function start(){
   const modelRequest=fetch(`${process.env.NEXT_PUBLIC_BASE_PATH??""}/models/ak47-packed.bin.gz`,{signal:abort.signal}).then(async response=>{if(!response.ok||!response.body)throw Error("Model unavailable");return new Response(response.body.pipeThrough(new DecompressionStream("gzip"))).arrayBuffer();});
   // Attach rejection immediately, including when WebGL initialization fails first.
   void modelRequest.catch(()=>{});
   const [T,{OrbitControls},{RoomEnvironment}]=await Promise.all([import("three"),import("three/examples/jsm/controls/OrbitControls.js"),import("three/examples/jsm/environments/RoomEnvironment.js")]);
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
    const buffer=await modelRequest;if(disposed)return;
    const view=new DataView(buffer),count=view.getUint32(0,true),indices=view.getUint32(4,true);let offset=8;
    const geometry=new T.BufferGeometry();geometry.setAttribute("position",new T.BufferAttribute(new Float32Array(buffer,offset,count*3),3));offset+=count*12;
    geometry.setAttribute("normal",new T.BufferAttribute(new Int8Array(buffer,offset,count*3),3,true));offset+=count*3;
    geometry.setAttribute("color",new T.BufferAttribute(new Uint8Array(buffer,offset,count*3),3,true));offset+=count*3;
    geometry.setIndex(new T.BufferAttribute(new Uint16Array(buffer,offset,indices),1));
    object=new T.Group();object.add(new T.Mesh(geometry,new T.MeshStandardMaterial({vertexColors:true,metalness:.3,roughness:.48})));
    const bounds=new T.Box3().setFromObject(object);object.position.sub(bounds.getCenter(new T.Vector3()));const pivot=new T.Group();pivot.add(object);pivot.rotation.y=-Math.PI/2;const scale=5.8/bounds.getSize(new T.Vector3()).z;pivot.scale.setScalar(scale);scene.add(pivot);reset();renderer.render(scene,camera);setState("ready");
   }catch{if(!disposed)setState("error");}
  }
  start().catch(()=>{if(!disposed)setState("error");});return()=>{disposed=true;abort.abort();cleanup();};
 },[]);
 return <div className={`weapon-viewer weapon-state-${state}`}><Image className="weapon-poster" aria-hidden={state==="ready"} src={`${process.env.NEXT_PUBLIC_BASE_PATH??""}/hero/ak47-poster.webp`} alt="AK-47 в авторском покрытии FLARE" width={1160} height={460} preload/><div ref={host} className="weapon-canvas"/>{state==="loading"&&<span className="viewer-preparing" role="status">Подключаем вращение</span>}{state==="error"&&<div className="weapon-error" role="status">Не удалось открыть 3D-просмотр.<Link href="/catalog">Перейти к скинам ↗</Link></div>}<span className="viewer-label">AK-47 / FLARE FINISH</span>{state==="ready"&&<><div className="viewer-modes"><button aria-pressed={rotating} onClick={()=>actions.current.auto(!rotating)}>{rotating?"Ⅱ Пауза":"↻ Автоповорот"}</button><button aria-pressed={detail} onClick={()=>actions.current.detail(!detail)}>{detail?"− Целиком":"+ Детали"}</button><button aria-pressed={metal} onClick={()=>actions.current.metal(!metal)}>{metal?"Материал: металл":"Материал: керамика"}</button></div><div className="viewer-controls"><span>Зажмите и вращайте · 360°</span><div><button onClick={()=>actions.current.turn(-1)} aria-label="Повернуть влево">←</button><button onClick={()=>actions.current.turn(1)} aria-label="Повернуть вправо">→</button><button onClick={()=>actions.current.reset()}>Исходный вид ↺</button></div></div></>}</div>;
}
