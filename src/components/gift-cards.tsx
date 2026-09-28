"use client";
import {useState} from "react";
// Reference denominations observed on Vault, not a supplier availability feed.
const regions={
 US:{label:"США",currency:"USD",symbol:"$",nominals:[2,3,4,5,6,7,8,9,10,15,20,25,30,35,40,45,50,60,70,75,80,90,100,150,200,250,300,400,500]},
 TR:{label:"Турция",currency:"TRY",symbol:"₺",nominals:[10,15,20,25,30,40,45,50,60,75,100,125,150,175,200,250,300,350,400,500,600,700,750,800,900,1000,1250,1500,1750,2000,2500,3000,4000,5000,7000,10000]},
 AE:{label:"ОАЭ",currency:"AED",symbol:"",nominals:[50,75,100,150,200,250,300,400,500,750,1000,1500,2000,2500,3000,4000,5000]},
} as const;
type Region=keyof typeof regions;
export function GiftCards(){
 const [region,setRegion]=useState<Region>("US");
 const [nominal,setNominal]=useState<number>(10);
 const selected=regions[region];
 return <section className="gift-section section" id="gift-cards" aria-labelledby="gift-title">
  <div className="gift-art"><span className="eyebrow">APP STORE & ITUNES</span><h2 id="gift-title">ПОДАРОЧНЫЕ<br/>КАРТЫ APPLE</h2><div className="gift-poster"><span className="gift-poster-word" aria-hidden="true">APPLE</span><div className="gift-card-face" aria-label="Выбранная подарочная карта Apple"><span>Apple Gift Card</span><strong>{selected.symbol}{nominal}</strong><small>{selected.label} · {selected.currency}</small></div></div><ol className="gift-steps"><li><b>01</b>Проверьте регион Apple Account</li><li><b>02</b>Выберите карту и номинал</li><li><b>03</b>Проверьте параметры перед покупкой</li></ol></div>
  <div className="gift-form"><span className="eyebrow">ПАРАМЕТРЫ КАРТЫ</span><h3>Регион → номинал</h3><p>Номинал зачисляется в валюте карты. Он не равен стоимости покупки в рублях.</p>
   <fieldset className="gift-region-options"><legend>Регион Apple Account</legend>{Object.entries(regions).map(([id,item])=><button type="button" key={id} aria-pressed={region===id} onClick={()=>{const next=id as Region;setRegion(next);setNominal(regions[next].nominals[0]);}}><span>{item.currency}</span><strong>{item.label}</strong></button>)}</fieldset>
   <label htmlFor="gift-nominal">Номинал карты</label><select id="gift-nominal" value={nominal} onChange={event=>setNominal(Number(event.target.value))}>{selected.nominals.map(value=><option value={value} key={value}>{value.toLocaleString("ru-RU")} {selected.currency}</option>)}</select>
   <details><summary>Где посмотреть регион аккаунта?</summary><p>На iPhone откройте настройки своего Apple Account → «Медиаматериалы и покупки» → «Просмотреть» → «Страна/регион». Ориентируйтесь на регион аккаунта, а не на язык телефона или место проживания.</p></details>
   <div className="gift-summary" aria-live="polite" aria-atomic="true"><span>ВЫБРАННАЯ КАРТА</span><dl><div><dt>Регион</dt><dd>{selected.label}</dd></div><div><dt>На баланс Apple</dt><dd>{nominal.toLocaleString("ru-RU")} {selected.currency}</dd></div></dl></div>
   <p className="gift-activation-note">Регион карты должен совпадать с регионом вашего Apple Account. Код активируется в App Store.</p>
  </div>
 </section>;
}
