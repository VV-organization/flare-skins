"use client";
import {useEffect,useId,useRef,useState,type CSSProperties,type KeyboardEvent} from 'react';
import {createPortal} from 'react-dom';
import {Icon} from './icon';

type Option={value:string;label:string;description?:string};
export function FlareSelect({label,value,options,onChange}:{label:string;value:string;options:Option[];onChange:(value:string)=>void}){
 const id=useId();const trigger=useRef<HTMLButtonElement>(null);const menu=useRef<HTMLDivElement>(null);
 const search=useRef({text:'',time:0});
 const [open,setOpen]=useState(false);const [active,setActive]=useState(0);const [position,setPosition]=useState<CSSProperties>({});
 const selected=options.findIndex(option=>option.value===value);const current=options[selected]??options[0];
 function expand(index=Math.max(0,selected)){
  const rect=trigger.current?.getBoundingClientRect();if(!rect)return;
  const below=window.innerHeight-rect.bottom-16;const above=rect.top-16;const upward=below<240&&above>below;
  const width=Math.min(Math.max(rect.width,300),window.innerWidth-32);
  setPosition({left:Math.max(16,Math.min(rect.left,window.innerWidth-width-16)),width,maxHeight:Math.max(80,Math.min(340,upward?above:below)),...(upward?{bottom:window.innerHeight-rect.top+8}:{top:rect.bottom+8})});
  setActive(index);setOpen(true);
 }
 function choose(index:number){const option=options[index];if(option){onChange(option.value);setOpen(false);trigger.current?.focus();}}
 function onKey(event:KeyboardEvent<HTMLButtonElement>){
  if(event.key==='Tab'){setOpen(false);return;}
  if(event.key==='Escape'){if(open){event.preventDefault();setOpen(false);}return;}
  if(event.key==='Enter'||event.key===' '){event.preventDefault();if(open)choose(active);else expand();return;}
  if(['ArrowDown','ArrowUp','Home','End'].includes(event.key)){
   event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?options.length-1:Math.max(0,Math.min(options.length-1,(open?active:Math.max(selected,0))+(event.key==='ArrowDown'?1:-1)));
   if(open)setActive(next);else expand(event.key==='ArrowDown'||event.key==='ArrowUp'?Math.max(selected,0):next);return;
  }
  if(event.key.length===1&&!event.ctrlKey&&!event.metaKey&&!event.altKey){
   const now=Date.now();search.current={text:(now-search.current.time<700?search.current.text:'')+event.key.toLocaleLowerCase(),time:now};
   const index=options.findIndex(option=>option.label.toLocaleLowerCase().startsWith(search.current.text));
   if(index>=0){event.preventDefault();if(open)setActive(index);else expand(index);}
  }
 }
 useEffect(()=>{
  if(!open)return;
  const outside=(event:PointerEvent)=>{if(event.target instanceof Node&&!trigger.current?.contains(event.target)&&!menu.current?.contains(event.target))setOpen(false);};
  const close=()=>setOpen(false);
  const scroll=(event:Event)=>{if(event.target instanceof Node&&menu.current?.contains(event.target))return;close();};
  document.addEventListener('pointerdown',outside);window.addEventListener('resize',close);window.addEventListener('scroll',scroll,true);
  return()=>{document.removeEventListener('pointerdown',outside);window.removeEventListener('resize',close);window.removeEventListener('scroll',scroll,true);};
 },[open]);
 useEffect(()=>{if(open)menu.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({block:'nearest'});},[active,open]);
 if(!current)return null;
 return <div className="flare-select">
  <button ref={trigger} type="button" className="flare-select-trigger" role="combobox" aria-label={label} aria-expanded={open} aria-controls={open?id:undefined} aria-haspopup="listbox" aria-activedescendant={open?`${id}-${active}`:undefined} onClick={()=>open?setOpen(false):expand()} onKeyDown={onKey} onBlur={()=>setOpen(false)}>
   <span><strong>{current.label}</strong>{current.description&&<small>{current.description}</small>}</span><Icon name="chevron" size={18}/>
  </button>
  {open&&createPortal(<div ref={menu} id={id} className="flare-select-menu" role="listbox" aria-label={label} style={position} onMouseDown={event=>event.preventDefault()}>
   {options.map((option,index)=><div key={option.value} id={`${id}-${index}`} data-index={index} role="option" aria-selected={value===option.value} className={`flare-select-option ${active===index?'is-active':''}`} onPointerMove={()=>setActive(index)} onClick={()=>choose(index)}>
    <span><strong>{option.label}</strong>{option.description&&<small>{option.description}</small>}</span><span className="flare-select-check" aria-hidden="true">{value===option.value?'✓':''}</span>
   </div>)}
  </div>,document.body)}
 </div>;
}
