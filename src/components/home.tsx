import Link from "next/link";
import type {Catalog} from "@/lib/types";
import {featuredProducts} from "@/lib/catalog";
import {Icon} from "./icon";
import {Converter} from "./converter";
import {ProductCard} from "./products";
import {Topups} from "./topups";
import {Reveal} from "./motion";
import {SkinStage} from "./skin-stage";
import {ColorPicker} from "./color-picker";
import {GiftCards} from "./gift-cards";
import {CategoryAtlas} from "./category-atlas";
const faqs=[
 ["Что такое FLARE?","FLARE — баллы на балансе сайта. 1 FLARE равен 1,5 ₽. Рядом с каждой ценой указан рублёвый эквивалент, а калькулятор переводит суммы в обе стороны."],
 ["Как получить купленный скин?","Для получения понадобится trade-URL твоего Steam-аккаунта. Его можно указать и изменить в личном кабинете. Статус выдачи отображается в истории покупок."],
 ["Чем отличаются два пополнения?","Баланс FLARE используется на сайте для скинов. Пополнение Steam — отдельная операция в рублях напрямую на Steam, без корзины и баллов FLARE."],
 ["Как считается комиссия Steam?","К сумме зачисления добавляется 5%. Для зачисления 1 000 ₽ комиссия составит 50 ₽, итог к оплате — 1 050 ₽."],
 ["Как выбрать регион карты Apple?","Регион карты должен совпадать со страной или регионом твоего Apple Account. Номинал указан в валюте карты. Проверь регион в настройках аккаунта перед выбором."],
];
export function Home({catalog}:{catalog:Catalog}){
 const featured=featuredProducts(catalog.products);
 const stage=["swap-35d1bd8ccb42","swap-ba19f94fd9cd","swap-5c3715c0960b"].flatMap(id=>catalog.products.filter(p=>p.id===id));
 return <div className="home-experience"><SkinStage products={stage}/><div className="home-topups"><Topups/></div><section className="editorial-collection" id="collection"><aside className="collection-aside"><span className="eyebrow">02 / SELECTED SKINS</span><h2>ХОЧУ.<br/>БЕРУ.</h2><p>Не просто пиксели.<br/>Твой следующий фаворит.</p><Link href="/catalog" className="text-link">Весь каталог <Icon name="diagonal"/></Link></aside><div className="editorial-products">{featured.slice(0,6).map((p,i)=><Reveal className="editorial-item" key={p.id}><span className="item-number">({String(i+1).padStart(2,"0")})</span><ProductCard product={p}/></Reveal>)}</div></section><section className="flare-statement"><span className="eyebrow">НЕ МЕНЯЕТ ПРАВИЛА ИГРЫ.</span><Reveal><p>МЕНЯЕТ<br/><span>ОЩУЩЕНИЕ</span><br/>ОТ НЕЁ<span className="orange-period">.</span></p></Reveal><span className="statement-foot">[ МАЛЕНЬКИЕ ДЕТАЛИ. БОЛЬШАЯ РАЗНИЦА. ]</span></section><CategoryAtlas catalog={catalog}/><ColorPicker products={catalog.products}/><GiftCards/><div className="bottom-converter"><Converter/></div><section className="flare-faq" id="faq"><div><span className="eyebrow">07 / ЕСТЬ ВОПРОС?</span><h2>ПО ДЕЛУ.</h2><p>Всё, что нужно<br/>перед следующим ходом.</p></div><div className="faq-list">{faqs.map(([q,a],i)=><details key={q}><summary><span className="faq-number">0{i+1}</span>{q}<Icon name="plus" size={22}/></summary><p>{a}</p></details>)}</div></section></div>;
}
