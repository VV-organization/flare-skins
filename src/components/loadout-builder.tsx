"use client";
import {useState} from "react";
import {WaveImage as Image} from "./wave-image";
import Link from "next/link";
import type {Product} from "@/lib/types";
import {Price} from "./price";
import {Icon} from "./icon";
import {useShop} from "./shop-provider";
const slots=[{id:"pistol",label:"Пистолет"},{id:"rifle",label:"Винтовка"},{id:"knife",label:"Нож"}];
export function LoadoutBuilder({products}:{products:Product[]}){
 const [indices,setIndices]=useState([0,0,0]);
 const shop=useShop();
 const pools=slots.map(slot=>products.filter(p=>p.categoryId===slot.id).sort((a,b)=>a.priceMinor-b.priceMinor));
 const selected=pools.map((pool,i)=>pool[indices[i]%pool.length]).filter((p):p is Product=>Boolean(p));
 const total=selected.reduce((sum,p)=>sum+p.priceMinor,0);
 const allAdded=selected.length>0&&selected.every(p=>shop.cart.some(item=>item.id===p.id));
 const change=(slot:number,direction:number)=>setIndices(values=>values.map((value,i)=>i===slot?(value+direction+pools[i].length)%pools[i].length:value));
 return <section className="loadout-builder" id="collection" aria-labelledby="loadout-title">
  <aside className="loadout-aside"><h2 id="loadout-title">СОБРАТЬ<br/>КОМПЛЕКТ</h2><p>Пистолет, винтовка и нож. Листайте предметы в каждой строке — стоимость комплекта пересчитается сразу.</p><span className="loadout-count">03 <small>позиции<br/>на ваш выбор</small></span><Link href="/catalog" className="text-link">Открыть каталог <Icon name="arrow"/></Link></aside>
  <div className="loadout-workbench">{slots.map((slot,i)=>{
   const product=pools[i][indices[i]%pools[i].length];
   return <article className="loadout-row" key={slot.id}>
    <div className="loadout-row-top"><span>{slot.label}</span><span>{pools[i].length?indices[i]+1:0} / {pools[i].length}</span></div>
    {product?<><div className="loadout-film"><button className="loadout-image" aria-label={`Рассмотреть комплект: ${product.name}`} onClick={()=>shop.setPreviewProduct(product)}><Image key={product.id} src={product.imageUrl} alt={product.name} width={560} height={320}/><span>↗</span></button>{[1,2].filter(offset=>offset<pools[i].length).map(offset=>{const alternative=pools[i][(indices[i]+offset)%pools[i].length];return <button className="loadout-alternative" key={alternative.id} aria-label={`Выбрать в комплект: ${alternative.name}`} onClick={()=>change(i,offset)}><Image src={alternative.imageUrl} alt={alternative.name} width={400} height={320}/><span>{alternative.finish}<b>↗</b></span></button>;})}</div>
    <div className="loadout-info" key={product.id}><span>{product.weapon}</span><h3><Link href={`/catalog/${product.id}`}>{product.finish}</Link></h3><small>{product.condition}</small><Price minor={product.priceMinor}/></div>
    <div className="loadout-controls"><button type="button" aria-label={`Предыдущий: ${slot.label}`} disabled={pools[i].length<2} onClick={()=>change(i,-1)}>←</button><button type="button" aria-label={`Следующий: ${slot.label}`} disabled={pools[i].length<2} onClick={()=>change(i,1)}>→</button></div></>:<p>В этой категории пока нет предметов.</p>}
   </article>;
  })}<div className="loadout-summary"><div aria-live="polite" aria-atomic="true"><span>За {selected.length} предмета</span><Price minor={total}/></div>{allAdded?<Link className="button primary" href="/cart" onClick={shop.dismissNotice}>Перейти в корзину<Icon name="arrow"/></Link>:<button className="button primary" disabled={!selected.length} onClick={()=>selected.filter(p=>!shop.cart.some(item=>item.id===p.id)).forEach(p=>shop.add(p))}>{allAdded?"Комплект в корзине":"Добавить комплект"}<Icon name={allAdded?"check":"plus"}/></button>}</div><p className="loadout-note">Каждый предмет добавляется отдельно. Состав можно изменить в корзине.</p></div>
 </section>;
}
