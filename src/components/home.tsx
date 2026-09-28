import type {Catalog} from "@/lib/types";
import {Converter} from "./converter";
import {LoadoutBuilder} from "./loadout-builder";
import {Topups} from "./topups";
import {SkinStage} from "./skin-stage";
import {ColorPicker} from "./color-picker";
import {GiftCards} from "./gift-cards";
import {SkinCompare} from "./skin-compare";
import {CategoryAtlas} from "./category-atlas";
const faqs=[
 ["В какой валюте указаны цены?","Цены предметов указаны в FLARE. Рядом приводится сумма в рублях по курсу 1 FLARE = 1,5 ₽. Пересчитать сумму можно в калькуляторе выше."],
 ["Какая ссылка нужна для получения предмета?","Trade-URL — ссылка на обмен Steam. Её можно сохранить в личном кабинете. Ссылка определяет аккаунт, на который должны поступать предметы."],
 ["Можно ли оплатить скин со Steam-баланса?","Баланс Steam и баланс магазина независимы. Предметы в каталоге оплачиваются через магазин; прямое пополнение Steam предназначено для аккаунта Steam."],
 ["Как узнать полную сумму пополнения?","Форма показывает зачисление, комиссию и итог отдельно. Например, при зачислении 1 000 ₽ в Steam комиссия 5% составляет 50 ₽, к оплате — 1 050 ₽."],
 ["Подойдёт ли карта Apple для другого региона?","Регион подарочной карты должен совпадать с регионом Apple Account. Проверьте его в настройках аккаунта до выбора номинала."],
];
export function Home({catalog}:{catalog:Catalog}){
 return <div className="home-experience">
  <SkinStage/>
  <div className="home-topups"><Topups/></div>
  <LoadoutBuilder products={catalog.products}/>
  <SkinCompare products={catalog.products}/>
  <CategoryAtlas catalog={catalog}/><ColorPicker products={catalog.products}/><GiftCards/>
  <div className="bottom-converter"><Converter/></div>
  <section className="flare-faq" id="faq"><div><span className="eyebrow">СПРАВОЧНАЯ</span><h2>Оплата и получение</h2><p>Валюта магазина, комиссии<br/>и параметры аккаунта.</p></div><div className="faq-answers">{faqs.map(([q,a],i)=><article key={q}><span className="eyebrow">0{i+1}</span><h3>{q}</h3><p>{a}</p></article>)}</div></section>
 </div>;
}
