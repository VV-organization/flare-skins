"use client";
import Image from "next/image";
import Link from "next/link";
import {useState} from "react";
import type {Catalog} from "@/lib/types";
import {Icon} from "./icon";
import {RevealText} from "./motion";
const labels:Record<string,string>={knife:"Ножи",rifle:"Винтовки",pistol:"Пистолеты",smg:"ПП",gloves:"Перчатки"};
const words:Record<string,string>={knife:"Острый характер",rifle:"Точный выбор",pistol:"Первое впечатление",smg:"Задавай темп",gloves:"Всё в твоих руках"};
export function CategoryAtlas({catalog}:{catalog:Catalog}) {
  const [active,setActive]=useState(catalog.categories[0]?.id??"");
  const item=catalog.products.find(p=>p.categoryId===active && p.finish==="Fade")??catalog.products.find(p=>p.categoryId===active);
  if (!catalog.categories.length) return null;
  return <section className="atlas" aria-labelledby="atlas-title">
    <div className="atlas-art"><span className="eyebrow">03 / ВЫБЕРИ СВОЮ СТОРОНУ</span><h2 id="atlas-title">Детали<br/>решают<span> всё</span></h2><div className="atlas-object" key={active}><span aria-hidden="true">{labels[active]}</span>{item&&<Image src={item.imageUrl} alt={item.name} width={650} height={480}/>}</div><p><RevealText text={words[active]??"Твой стиль"}/><small>{catalog.categories.find(c=>c.id===active)?.description}</small></p><span className="atlas-coordinate" aria-hidden="true">[ FLR — {active.toUpperCase()} ]</span></div>
    <div className="atlas-list"><p>Один инвентарь<br/>Тысяча способов быть собой</p>{catalog.categories.map((c,i)=><div key={c.id} className={`atlas-row ${active===c.id?"is-active":""}`} onPointerEnter={()=>setActive(c.id)}><button aria-pressed={active===c.id} onClick={()=>setActive(c.id)} onFocus={()=>setActive(c.id)} aria-label={`Показать категорию ${labels[c.id]}`}><span className="atlas-index">0{i+1}</span><span className="atlas-name">{labels[c.id]}</span>{active===c.id&&item&&<Image className="atlas-row-image" src={item.imageUrl} alt="" width={100} height={75}/>}<span className="atlas-count">{String(catalog.products.filter(p=>p.categoryId===c.id).length).padStart(2,"0")}</span></button><Link href={`/catalog?category=${c.id}`} aria-label={`Открыть категорию ${labels[c.id]}`}><Icon name="diagonal" size={26}/></Link></div>)}<Link className="atlas-all" href="/catalog">Весь инвентарь <Icon name="arrow"/></Link></div>
  </section>;
}
