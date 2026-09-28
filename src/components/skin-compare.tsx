"use client";
import {useState} from "react";
import {FlareSelect} from "./flare-select";
import {WaveImage as Image} from "./wave-image";
import Link from "next/link";
import type {Product} from "@/lib/types";
import {flareToRub,formatMinor} from "@/lib/money";
import {Price} from "./price";
import {useShop} from "./shop-provider";

export function SkinCompare({products}:{products:Product[]}){
 const shop=useShop();
 const weapons=[...new Set(products.map(p=>p.weapon))].filter(weapon=>products.filter(p=>p.weapon===weapon).length>1);
 const [weapon,setWeapon]=useState(weapons.includes("AK-47")?"AK-47":weapons[0]??"");
 const pool=products.filter(p=>p.weapon===weapon);
 const [ids,setIds]=useState<[string,string]>(["",""]);
 const left=pool.find(p=>p.id===ids[0])??pool[0];
 const right=pool.find(p=>p.id===ids[1]&&p.id!==left?.id)??pool.find(p=>p.id!==left?.id);
 if(!left||!right)return null;
 const pair=[left,right];
 const difference=Math.abs(left.priceMinor-right.priceMinor);
 const rubDifference=Math.abs(flareToRub(left.priceMinor)-flareToRub(right.priceMinor));
 const cheaper=left.priceMinor<right.priceMinor?left:right;
 function select(index:number,id:string){
  const other=pair[1-index];
  const alternate=other.id===id?pair[index].id:other.id;
  setIds(index===0?[id,alternate]:[alternate,id]);
 }
 return <section className="skin-compare" id="compare" aria-labelledby="compare-title">
  <header><div><h2 id="compare-title">СРАВНИТЬ СКИНЫ</h2><p>Выберите оружие и два покрытия. Сопоставьте цену, состояние и float.</p></div><div className="compare-weapon"><span>Оружие</span><FlareSelect label="Оружие" value={weapon} onChange={value=>{setWeapon(value);setIds(["",""]);}} options={weapons.map(item=>({value:item,label:item}))}/></div></header>
  <div className="compare-table" role="table" aria-label="Сравнение выбранных скинов">
   <div className="compare-row compare-selection" role="row"><span role="columnheader">Предмет</span>{pair.map((p,i)=><div role="columnheader" key={i}><FlareSelect label={i===0?"Первый скин":"Второй скин"} value={p.id} onChange={value=>select(i,value)} options={pool.map(item=>({value:item.id,label:item.finish,description:`${item.condition}${item.stattrak?" · StatTrak™":""}`}))}/><button className="compare-image" aria-label={`Рассмотреть для сравнения: ${p.name}`} onClick={()=>shop.setPreviewProduct(p)}><Image key={p.id} src={p.imageUrl} alt={p.name} width={600} height={350}/><span>↗</span></button><h3>{p.finish}</h3></div>)}</div>
   <div className="compare-row" role="row"><span role="rowheader">Цена</span>{pair.map(p=><div role="cell" key={p.id}><Price minor={p.priceMinor}/></div>)}</div>
   <div className="compare-row" role="row"><span role="rowheader">Состояние</span>{pair.map(p=><span role="cell" key={p.id}>{p.condition}</span>)}</div>
   <div className="compare-row" role="row"><span role="rowheader">Float</span>{pair.map(p=><span role="cell" key={p.id}>{p.float===null?"Не указан":p.float.toFixed(6)}</span>)}</div>
   <div className="compare-row" role="row"><span role="rowheader">StatTrak™</span>{pair.map(p=><span role="cell" key={p.id}>{p.stattrak?"Есть":"Нет"}</span>)}</div>
   <div className="compare-row compare-actions" role="row"><span role="rowheader">Подробнее</span>{pair.map(p=><div role="cell" key={p.id}><Link href={`/catalog/${p.id}`}>Открыть скин <span aria-hidden="true">↗</span></Link></div>)}</div>
  </div>
  <div className="compare-verdict" role="status" aria-atomic="true">{difference>0?<><span>{cheaper.finish} дешевле на</span><strong>{formatMinor(difference)} FLARE <small>≈ {formatMinor(rubDifference)} ₽</small></strong></>:<strong>Оба предмета стоят одинаково</strong>}<span className="compare-note">Float описывает износ, но сам по себе не определяет стоимость скина.</span></div>
 </section>;
}
