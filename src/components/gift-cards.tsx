"use client";

import {useState} from "react";

const regions={
  US:{label:"США",currency:"USD",symbol:"$",nominals:[10,25,50,100]},
  TR:{label:"Турция",currency:"TRY",symbol:"₺",nominals:[100,250,500,1000]},
  DE:{label:"Германия",currency:"EUR",symbol:"€",nominals:[15,25,50,100]},
} as const;
type Region=keyof typeof regions;

export function GiftCards(){
  const [region,setRegion]=useState<Region>("US");
  const [nominal,setNominal]=useState<number>(regions.US.nominals[0]);
  const [compatible,setCompatible]=useState(false);
  const [checked,setChecked]=useState(false);
  const selected=regions[region];
  return <section className="gift-section section" id="gift-cards" aria-labelledby="gift-title">
    <div className="gift-art"><span className="eyebrow">05 / APPLE GIFT CARDS</span><h2 id="gift-title">МАЛЕНЬКАЯ КАРТА. БОЛЬШЕ ВОЗМОЖНОСТЕЙ.</h2><div className="gift-card-face" aria-label="Apple Gift Card: выбранный номинал"><span>Apple Gift Card</span><strong>{selected.symbol}{nominal}</strong><small>{selected.label} · {selected.currency}</small></div><p>Твой выбор. Или подарок кому-то особенному.</p></div>
    <div className="gift-form"><span className="eyebrow">НАСТРОЙ КАРТУ</span><h3>Apple Gift Card</h3><p>Выбери регион и номинал. Регион карты должен совпадать с регионом твоего Apple Account.</p>
      <label htmlFor="gift-region">Регион карты</label>
      <select id="gift-region" value={region} onChange={event=>{const next=event.target.value as Region;setRegion(next);setNominal(regions[next].nominals[0]);setCompatible(false);setChecked(false);}}><option value="US">США · USD</option><option value="TR">Турция · TRY</option><option value="DE">Германия · EUR</option></select>
      <fieldset className="gift-denominations"><legend>Номинал</legend>{selected.nominals.map(value=><button type="button" key={`${region}-${value}`} aria-pressed={nominal===value} className={nominal===value?"active":""} onClick={()=>{setNominal(value);setChecked(false);}}>{selected.symbol}{value}</button>)}</fieldset>
      <label className="gift-confirm"><input type="checkbox" checked={compatible} onChange={event=>{setCompatible(event.target.checked);setChecked(false);}}/><span>Регион моего Apple Account совпадает с регионом карты: {selected.label}</span></label>
      <div className="gift-summary"><span>Твой выбор</span><strong>{selected.label} · {selected.symbol}{nominal} {selected.currency}</strong><span>Карты временно недоступны. Цена появится после проверки наличия.</span></div>
      <button type="button" className="button primary" disabled={!compatible} onClick={()=>setChecked(true)}>Проверить доступность</button>
      {checked&&<p role="status">Проверка доступности временно не работает. Попробуй позже — деньги не списаны.</p>}
    </div>
  </section>;
}
