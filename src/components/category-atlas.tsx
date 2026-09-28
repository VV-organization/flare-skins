"use client";
import {WaveImage as Image} from './wave-image';
import Link from 'next/link';
import {useState} from 'react';
import type {Catalog} from '@/lib/types';
import {Icon} from './icon';
const labels:Record<string,string>={knife:'Ножи',rifle:'Винтовки',pistol:'Пистолеты',smg:'ПП',gloves:'Перчатки'};
export function CategoryAtlas({catalog}:{catalog:Catalog}){
 const [active,setActive]=useState(catalog.categories[0]?.id??'');
 const category=catalog.categories.find(c=>c.id===active)??catalog.categories[0];
 if(!category)return null;
 const item=catalog.products.find(p=>p.categoryId===category.id);
 return <section className="category-index" aria-labelledby="atlas-title">
  <header><span className="eyebrow">РАЗДЕЛЫ КАТАЛОГА</span><h2 id="atlas-title">КАТЕГОРИИ</h2></header>
  <div className="category-gallery">
   <div className="category-stage" id="category-preview" aria-live="polite">
    <span className="category-stage-name" aria-hidden="true">{labels[category.id]}</span>
    {item&&<div className="category-object"><Image key={item.id} src={item.imageUrl} alt={item.name} width={850} height={650}/></div>}
    <div className="category-stage-caption"><span>{item?.weapon}</span><span>{item?.finish}</span></div>
   </div>
   <div className="category-menu"><div className="category-lines">{catalog.categories.map((c,i)=><div className={`category-line ${active===c.id?'is-active':''}`} key={c.id}>
    <button aria-pressed={active===c.id} aria-controls="category-preview" onClick={()=>setActive(c.id)}><span className="category-number">0{i+1}</span><span>{labels[c.id]}</span><small>{String(catalog.products.filter(p=>p.categoryId===c.id).length).padStart(2,'0')}</small><Icon name="diagonal"/></button>
   </div>)}</div><p className="category-description">{category.description}</p><Link className="category-shop" href={`/catalog?category=${category.id}`}>Выбрать {labels[category.id].toLowerCase()}<Icon name="arrow"/></Link></div>
  </div><Link className="category-all" href="/catalog">Все скины <Icon name="arrow"/></Link>
 </section>;
}
