import type {Metadata} from "next";
import localFont from "next/font/local";
import {getCatalog} from "@/lib/catalog";
import {ShopProvider} from "@/components/shop-provider";
import {Header,Footer} from "@/components/shell";
import {QuickView} from "@/components/products";
import "./globals.css";

import "./interiors.css";
import "./flare.css";
const manrope=localFont({src:"../../public/fonts/Manrope-Variable.ttf",variable:"--font-manrope",display:"swap"});
export const metadata:Metadata={title:{default:"FLARE — твой ход",template:"%s — FLARE"},icons:{icon:`${process.env.NEXT_PUBLIC_BASE_PATH??""}/favicon.svg`},description:"Скины Counter-Strike 2, баланс FLARE и прямое пополнение Steam. 1 FLARE = 1,5 ₽."};
export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="ru" data-scroll-behavior="smooth" className={manrope.variable}><body><ShopProvider catalog={getCatalog()}><Header/><main id="main">{children}</main><Footer/><QuickView/></ShopProvider></body></html>;
}
