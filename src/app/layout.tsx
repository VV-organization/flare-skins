import type {Metadata} from "next";
import localFont from "next/font/local";
import {getCatalog} from "@/lib/catalog";
import {ShopProvider} from "@/components/shop-provider";
import {Header,Footer} from "@/components/shell";
import {QuickView} from "@/components/products";
import "./globals.css";

import "./interiors.css";
import "./flare.css";
import "./dark-theme.css";
import "./experience.css";
import "./color-refinement.css";
import "./compare.css";
import "./card-surfaces.css";
import "./image-motion.css";
import "./hero-compact.css";
import "./reference-design.css";
import "./ui-system.css";
import "./distinct-compositions.css";
import {ImageMotion} from "@/components/image-motion";
import {PageMotion} from "@/components/page-motion";
const golos=localFont({src:"../../public/fonts/GolosText-Variable.ttf",variable:"--font-body",display:"swap",weight:"400 900"});
const oswald=localFont({src:"../../public/fonts/Oswald-Variable.ttf",variable:"--font-display",display:"swap",weight:"200 700"});
export const metadata:Metadata={title:{default:"FLARE — скины CS2 и цифровые сервисы",template:"%s — FLARE"},icons:{icon:`${process.env.NEXT_PUBLIC_BASE_PATH??""}/favicon.svg`},description:"Скины Counter-Strike 2, баланс FLARE и прямое пополнение Steam. 1 FLARE = 1,5 ₽."};
export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="ru" data-scroll-behavior="smooth" className={`${golos.variable} ${oswald.variable}`}><body><ShopProvider catalog={getCatalog()}><PageMotion/><ImageMotion/><Header/><main id="main">{children}</main><Footer/><QuickView/></ShopProvider></body></html>;
}
