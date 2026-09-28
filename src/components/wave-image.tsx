"use client";
import Image,{type ImageProps} from 'next/image';
import {useEffect,useRef} from 'react';

/** Opt in only after this image hydrates, including inside streamed Suspense routes. */
export function WaveImage(props:ImageProps){
 const ref=useRef<HTMLImageElement>(null);
 useEffect(()=>{
  const image=ref.current;
  if(image)image.dataset.waveReady='true';
  return()=>{if(image)delete image.dataset.waveReady;};
 },[]);
 return <Image {...props} alt={props.alt} ref={ref}/>;
}
