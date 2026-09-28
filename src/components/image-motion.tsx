"use client";
import {useEffect} from 'react';
import {usePathname} from 'next/navigation';
import {createImageWave,WAVE_DURATION,WAVE_HANDOFF,WAVE_SPEED} from '@/lib/image-wave';

const selector='img[data-wave-ready]';

/** Progressive enhancement: the original accessible image always survives any failure. */
export function ImageMotion(){
 const pathname=usePathname();
 useEffect(()=>{
  const media=matchMedia('(prefers-reduced-motion: reduce)');
  const records=new Map<HTMLImageElement,{source:string;finish:()=>void;start:()=>void}>();
  const seen=new WeakMap<HTMLImageElement,string>();
  let contexts=0;
  const prepare=(image:HTMLImageElement)=>{
   const source=image.getAttribute('src')??'';
   if(seen.get(image)===source||media.matches)return;
   const host=image.parentElement;
   if(!host||host.closest('[hidden],.catalog-page'))return;
   const rect=image.getBoundingClientRect();
   if(!rect.width||!rect.height)return;
   seen.set(image,source);
   if(rect.bottom<0)return;
   image.classList.add('image-wave-pending');
   image.dataset.waveState='pending';
   let effect:ReturnType<typeof createImageWave>=null;
   let frame=0,finished=false,started=false,last=0,elapsed=0;
   let resize:ResizeObserver|undefined;
   let timeout:ReturnType<typeof setTimeout>|undefined;
   const finish=()=>{
    if(finished)return;finished=true;
    cancelAnimationFrame(frame);clearTimeout(timeout);
    observer.unobserve(image);resize?.disconnect();
    image.removeEventListener('load',start);image.removeEventListener('error',finish);
    image.classList.remove('image-wave-pending');host.classList.remove('image-wave-active');
    image.dataset.waveState=effect?'complete':'fallback';
    if(effect){effect.dispose();contexts--;}
    records.delete(image);
   };
   const tick=(now:number)=>{
    if(!image.isConnected||media.matches||host.closest('.motion-paused')){finish();return;}
    if(!document.hidden)elapsed+=now-last;
    last=now;
    if(elapsed>=WAVE_HANDOFF)image.classList.remove('image-wave-pending');
    if(elapsed>=WAVE_DURATION||!effect?.draw(elapsed*WAVE_SPEED/1000)){finish();return;}
    // The canvas fully owns the image until the reference's handoff point.
    if(elapsed>=WAVE_HANDOFF)effect.canvas.style.visibility='hidden';
    frame=requestAnimationFrame(tick);
   };
   function start(){
    if(finished||started)return;
    const bounds=image.getBoundingClientRect();
    if(bounds.top>innerHeight||bounds.bottom<=0)return;
    if(!image.complete){timeout??=setTimeout(finish,10000);return;}
    if(!image.naturalWidth){finish();return;}
    clearTimeout(timeout);
    if(host!.closest('.motion-paused')){finish();return;}
    // Do not silently skip the remaining cards when several rows enter together.
    // Leave room for the hero's persistent 3D context; retry overflow on the next frame.
    if(contexts>=12){frame=requestAnimationFrame(start);return;}
    started=true;
    host!.classList.add('image-wave-active');
    effect=createImageWave(image);
    if(!effect){finish();return;}
    contexts++;
    image.dataset.waveState='running';
    host!.append(effect.canvas);effect.draw(0);
    effect.canvas.addEventListener('webglcontextlost',finish,{once:true});
    resize=new ResizeObserver(()=>{effect?.resize();});resize.observe(image);
    last=performance.now();frame=requestAnimationFrame(tick);
    observer.unobserve(image);
   }
   // Loading timeout starts on approach, so lazy images below the fold keep their reveal.
   records.set(image,{source,finish,start});
   image.addEventListener('load',start);image.addEventListener('error',finish,{once:true});
   observer.observe(image);start();
  };
  const scan=()=>{
   records.forEach((record,image)=>{if(!image.isConnected||record.source!==image.getAttribute('src'))record.finish();});
   document.querySelectorAll<HTMLImageElement>(selector).forEach(prepare);
  };
  const makeObserver=()=>new IntersectionObserver(entries=>{
   for(const entry of entries){
    if(entry.isIntersecting)records.get(entry.target as HTMLImageElement)?.start();
   }
  },{rootMargin:'0px',threshold:0});
  let observer=makeObserver();
  const resized=()=>{
   observer.disconnect();observer=makeObserver();
   records.forEach((record,image)=>{observer.observe(image);record.start();});
   scan();
  };
  window.addEventListener('resize',resized);
  const mutations=new MutationObserver(scan);
  mutations.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['src','srcset','hidden','data-wave-ready']});
  const preference=()=>{records.forEach(record=>record.finish());scan();};
  const pause=(event:MouseEvent)=>{
   if(event.target instanceof Element&&event.target.closest('.hero-motion-toggle')){
    records.forEach((record,image)=>{if(image.closest('.flare-hero'))record.finish();});
   }
  };
  media.addEventListener('change',preference);document.addEventListener('click',pause);
  scan();
  return()=>{window.removeEventListener('resize',resized);mutations.disconnect();observer.disconnect();records.forEach(record=>record.finish());media.removeEventListener('change',preference);document.removeEventListener('click',pause);};
 },[pathname]);
 return null;
}
