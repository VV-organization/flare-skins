"use client";
import Image from "next/image";
import Link from "next/link";
import {useRef, useState, type PointerEvent} from "react";
import type {Product} from "@/lib/types";
import {Icon} from "./icon";
import {Price} from "./price";
import {useShop} from "./shop-provider";
export function SkinStage({products}:{products:Product[]}) {
 const [active,setActive]=useState(0);const stage=useRef<HTMLElement>(null);const shop=useShop();const product=products[active];
 function move(e:PointerEvent<HTMLElement>){if(e.pointerType!=="mouse"||matchMedia("(prefers-reduced-motion: reduce)").matches)return;const rect=e.currentTarget.getBoundingClientRect();stage.current?.style.setProperty("--look-x",`${((e.clientX-rect.left)/rect.width-.5)*26}px`);stage.current?.style.setProperty("--look-y",`${((e.clientY-rect.top)/rect.height-.5)*18}px`);}
 return <section className="flare-hero" ref={stage} onPointerMove={move} onPointerLeave={()=>{stage.current?.style.setProperty("--look-x","0px");stage.current?.style.setProperty("--look-y","0px");}}>
 <div className="hero-overline"><span>СКИНЫ. STEAM. ЦИФРОВОЕ.</span><span>ТВОЙ ИНВЕНТАРЬ — ТВОИ ПРАВИЛА</span></div>
 <div className="hero-title"><h1><span>ТВОЙ СТИЛЬ.</span><span>ТВОЙ <em>ХОД.</em></span></h1></div>
 <div className="hero-side-copy"><span className="eyebrow">[ BE ANYTHING.<br/>EXCEPT DEFAULT. ]</span><p>Скины, которые говорят<br/>за тебя. Ещё до раунда.</p><Link className="round-cta" href="/catalog" aria-label="Выбрать скин"><Icon name="diagonal" size={34}/></Link></div>
 {product&&<><button className="hero-skin" aria-label={`Рассмотреть ${product.name}`} onClick={()=>shop.setPreviewProduct(product)}><Image key={product.id} src={product.imageUrl} alt={product.name} width={1100} height={825} priority/><span className="hero-inspect"><Icon name="plus" size={18}/> РАССМОТРЕТЬ</span></button><div className="hero-product"><span className="eyebrow">В ФОКУСЕ / 0{active+1}</span><Link href={`/catalog/${product.id}`}>{product.weapon}<br/><strong>{product.finish}</strong></Link><Price minor={product.priceMinor}/></div></>}
 <div className="hero-footer"><Link href="/catalog" className="hero-main-link">Выбрать скин <Icon name="diagonal" size={24}/></Link><a href="#steam" className="hero-steam-link"><Icon name="steam"/>Пополнить Steam <Icon name="arrow"/></a><div className="hero-switch" role="group" aria-label="Скин на главном экране">{products.map((p,i)=><button key={p.id} aria-pressed={active===i} aria-label={`Показать ${p.name}`} onClick={()=>setActive(i)}>0{i+1}</button>)}</div><span className="hero-scroll">ЛИСТАЙ НИЖЕ ↓</span></div>
 </section>;
}
