import type {Catalog} from "@/lib/types";
export function CatalogIntro({catalog,category}:{catalog:Catalog;category:string}) {
 const selected=catalog.categories.find(c=>c.id===category);
 const count=selected?catalog.products.filter(p=>p.categoryId===category).length:catalog.products.length;
 return <header className="market-intro"><div className="market-intro-copy"><h1>КАТАЛОГ CS2</h1><p>Предметы для Counter-Strike 2.<br/>Фильтры по цене, состоянию и StatTrak™.</p></div><div className="catalog-edition"><strong>{String(count).padStart(2,"0")}</strong><span>предметов<br/>в разделе</span></div></header>;
}
