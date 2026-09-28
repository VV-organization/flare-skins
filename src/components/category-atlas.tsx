"use client";
import {WaveImage as Image} from './wave-image';
import Link from 'next/link';
import type {Catalog} from '@/lib/types';
import {Icon} from './icon';
const labels:Record<string,string>={knife:'Ножи',rifle:'Винтовки',pistol:'Пистолеты',smg:'ПП',gloves:'Перчатки'};

/** Noho's adjacent object panels, each leading directly to its own category. */
export function CategoryAtlas({catalog}:{catalog:Catalog}){
 return <section className="category-index" aria-labelledby="atlas-title">
  <header><h2 id="atlas-title">КАТЕГОРИИ</h2></header>
  <div className="category-exhibit">{catalog.categories.map(category=>{
   const items=catalog.products.filter(p=>p.categoryId===category.id);const item=items[0];
   return <Link className="category-tile" href={`/catalog?category=${category.id}`} key={category.id} aria-label={`${labels[category.id]}, предметов: ${items.length}`}>
    <div className="category-tile-heading"><h3>{labels[category.id]}</h3><span>Предметов: {String(items.length).padStart(2,'0')}</span><Icon name="diagonal"/></div>
    {item&&<div className="category-tile-image"><Image src={item.imageUrl} alt={item.name} width={850} height={650}/></div>}
    <p>{category.description}</p>
   </Link>;
  })}</div>
  <Link className="category-all" href="/catalog">Все скины <Icon name="arrow"/></Link>
 </section>;
}
