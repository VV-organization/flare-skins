"use client";
import Image from "next/image";
import Link from "next/link";
import type {Catalog} from "@/lib/types";
import {RevealText} from "./motion";
import {Icon} from "./icon";

export function CatalogIntro({catalog,category}:{catalog:Catalog;category:string}) {
  const selected=catalog.categories.find(c=>c.id===category);
  const items=selected?catalog.products.filter(p=>p.categoryId===category):catalog.products;
  const object=items.find(p=>p.finish==="Fade")??items[0];
  return <header className="market-intro">
    <div className="market-intro-copy"><span className="eyebrow">FLARE / ИНВЕНТАРЬ CS2</span><h1><span className="title-mask"><span>Найди <em>свой</em></span></span></h1><p>Тот самый скин среди всех остальных.<br/>Теперь дело за тобой.</p></div>
    <div className="market-intro-art"><span className="market-ghost-number" aria-hidden="true">{String(items.length).padStart(2,"0")}</span>{object&&<Link key={object.id} className="market-featured-object" href={`/catalog/${object.id}`} aria-label={`Рассмотреть ${object.name}`}><Image src={object.imageUrl} alt={object.name} width={750} height={530} loading="eager" fetchPriority="high"/><span className="market-object-label">{object.weapon} / {object.finish}<Icon name="diagonal" size={18}/></span></Link>}<div className="market-intro-caption"><span><RevealText text={selected?.name??"Весь каталог"}/></span><span>{items.length} ПРЕДМЕТОВ</span></div></div>
  </header>;
}
