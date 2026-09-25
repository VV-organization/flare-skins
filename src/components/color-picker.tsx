"use client";

import {useState} from "react";
import Link from "next/link";
import type {Product} from "@/lib/types";
import {filterDiscovery, type DiscoveryColor} from "@/lib/discovery";
import {ProductCard} from "./products";

const colors:{id:DiscoveryColor;label:string;note:string}[]=[
  {id:"orange",label:"Оранжевый",note:"Тёплый акцент"},
  {id:"blue",label:"Синий",note:"Холодный акцент"},
  {id:"mono",label:"Монохром",note:"Чёрное и белое"},
];
const budgets=[{label:"До 3 000 ₽",value:"3000"},{label:"До 15 000 ₽",value:"15000"},{label:"Все цены",value:""}];

export function ColorPicker({products}:{products:Product[]}) {
  const [color,setColor]=useState<DiscoveryColor>("orange");
  const [budget,setBudget]=useState("");
  const {count,items,invalidBudget}=filterDiscovery(products,color,budget);
  return <section className="color-picker section" id="color-picker" aria-labelledby="color-picker-title">
    <div className="discovery-aside">
      <span className="eyebrow">04 / ЦВЕТ ИМЕЕТ ЗНАЧЕНИЕ</span>
      <h2 id="color-picker-title">ПОПАДИ В СВОЙ ЦВЕТ.</h2>
      <p>Выбери настроение и сумму. Покажем скины из каталога, которые подходят под оба условия.</p>
      <fieldset className="color-options"><legend>Цвет</legend>{colors.map(option=><button key={option.id} type="button" className={`color-option color-${option.id}${color===option.id?" active":""}`} aria-pressed={color===option.id} onClick={()=>setColor(option.id)}><span className="color-swatch" aria-hidden="true"/><strong>{option.label}</strong><small>{option.note}</small></button>)}</fieldset>
      <div className="budget-control"><label htmlFor="discovery-budget">Бюджет, ₽</label><input id="discovery-budget" type="text" inputMode="decimal" autoComplete="off" value={budget} onChange={event=>setBudget(event.target.value)} placeholder="Без ограничения" aria-invalid={invalidBudget}/>{invalidBudget&&<span role="alert">Укажи сумму в рублях, например 3 000.</span>}</div>
      <div className="budget-options" aria-label="Быстрый выбор бюджета">{budgets.map(option=><button type="button" key={option.label} aria-pressed={budget===option.value} className={budget===option.value?"active":""} onClick={()=>setBudget(option.value)}>{option.label}</button>)}</div>
    </div>
    <div className="discovery-results" aria-live="polite">
      <div className="discovery-results-heading"><span className="eyebrow">ВЫБРАННОЕ ДЛЯ ТЕБЯ</span><span>{invalidBudget?"Проверь бюджет":`${count} в подборке`}</span></div>
      {count>0?<div className="discovery-grid">{items.map(product=><ProductCard key={product.id} product={product}/>)}</div>:<div className="empty-state"><h3>{invalidBudget?"Не получилось прочитать бюджет":"Скинов по этому сочетанию нет"}</h3><p>{invalidBudget?"Исправь сумму или выбери один из вариантов ниже.":"Попробуй другой цвет или увеличь бюджет."}</p><button className="button secondary" type="button" onClick={()=>{setColor("orange");setBudget("");}}>Сбросить подбор</button></div>}
      <Link className="text-link" href="/catalog">Смотреть весь каталог ↗</Link>
    </div>
  </section>;
}
