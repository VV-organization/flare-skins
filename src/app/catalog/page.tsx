import {CatalogLoading} from "@/components/catalog-loading";
import {Suspense} from "react";
import {CatalogView} from "@/components/catalog-view";
export const metadata={title:"Каталог скинов CS2"};
export default function Page(){return <Suspense fallback={<CatalogLoading/>}><CatalogView/></Suspense>;}
