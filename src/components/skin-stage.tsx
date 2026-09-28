"use client";
import Link from "next/link";
import {Icon} from "./icon";
import {WeaponViewer} from "./weapon-viewer";
export function SkinStage(){
 return <section className="flare-hero hero-studio hero-three">
 <div className="hero-overline"><span>МАГАЗИН ЦИФРОВЫХ ТОВАРОВ</span><span>COUNTER-STRIKE 2 / STEAM / APPLE</span></div>
 <div className="hero-title"><h1><span>СКИНЫ</span><span><em>И СЕРВИСЫ</em></span></h1></div>
 <div className="hero-side-copy"><p>Поворачивайте AK-47.<br/>Рассмотрите AK-47 со всех сторон.</p><Link href="/catalog?category=rifle" className="hero-rifle-link">Выбрать винтовку <Icon name="diagonal" size={20}/></Link></div>
 <div className="hero-visual"><WeaponViewer/></div>
 <div className="hero-product"><span>AK-47<br/><strong>FLARE / 3D</strong></span><span className="viewer-caption">Авторское покрытие FLARE<br/>3D-визуализация</span></div>
 <div className="hero-footer"><Link href="/catalog" className="hero-main-link">Выбрать скин <Icon name="diagonal" size={24}/></Link><a href="#steam" className="hero-steam-link"><Icon name="steam"/>Пополнить Steam <Icon name="arrow"/></a></div>
 </section>;
}
