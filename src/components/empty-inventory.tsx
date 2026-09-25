"use client";
import Image from "next/image";
import Link from "next/link";
import {useShop} from "./shop-provider";
import {Icon} from "./icon";

export function EmptyInventory() {
  const shop=useShop();
  const product=shop.products.find(p=>p.id==="swap-5c3715c0960b");
  return <section className="empty-inventory"><div className="empty-inventory-art"><span aria-hidden="true">00</span>{product&&<Image src={product.imageUrl} alt="" width={650} height={500} loading="eager"/>}<span className="eyebrow">МЕСТО ДЛЯ ТВОЕГО ВЫБОРА</span></div><div className="empty-inventory-copy"><span className="eyebrow">ПОКА НИ ОДНОГО СКИНА</span><h2>Начни<br/>с любимого</h2><p>Собери вещи, которые хочется взять<br/>в следующий раунд.</p><Link className="button primary" href="/catalog">Открыть каталог <Icon name="diagonal"/></Link></div></section>;
}
