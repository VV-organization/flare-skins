"use client";
import {createContext,useContext,useMemo,useState,useSyncExternalStore,type ReactNode} from "react";
import Link from "next/link";
import {usePathname,useRouter} from "next/navigation";
import type {Catalog,Product} from "@/lib/types";
import {Modal} from "./modal";
import {Icon} from "./icon";

const memoryStore=new Map<string,string>();
function readStored(key:string,fallback:string){try{return localStorage.getItem(key)??memoryStore.get(key)??fallback;}catch{return memoryStore.get(key)??fallback;}}
function subscribe(callback:()=>void) {
  window.addEventListener("storage",callback); window.addEventListener("flare-store",callback);
  return ()=>{window.removeEventListener("storage",callback);window.removeEventListener("flare-store",callback);};
}
function useStored(key:string, fallback:string) {
  const raw=useSyncExternalStore(subscribe,()=>readStored(key,fallback),()=>fallback);
  function set(value:string){memoryStore.set(key,value);try{localStorage.setItem(key,value);}catch{/* Retain this session if storage is disabled. */}window.dispatchEvent(new Event("flare-store"));}
  return [raw,set] as const;
}
type Shop = Catalog & {cart:Product[];notice:Product|null;dismissNotice:()=>void;add:(product:Product)=>void;remove:(id:string)=>void;loggedIn:boolean;login:()=>void;logout:()=>void;tradeUrl:string;saveTradeUrl:(url:string)=>void;previewProduct:Product|null;setPreviewProduct:(p:Product|null)=>void};
const ShopContext=createContext<Shop|null>(null);
export function useShop(){const value=useContext(ShopContext);if(!value)throw new Error("Missing shop");return value;}
export function ShopProvider({catalog,children}:{catalog:Catalog;children:ReactNode}) {
  const router=useRouter();const pathname=usePathname().replace(/\/$/,"")||"/";
  const [raw,setRaw]=useStored("flare:cart","[]");
  const [loginValue,setLoginValue]=useStored("flare:preview-login","0");
  const [tradeUrl,saveTradeUrl]=useStored("flare:trade-url","");
  const [notice,setNotice]=useState<Product|null>(null);
  const [loginDialog,setLoginDialog]=useState(false);
  const [logoutDialog,setLogoutDialog]=useState(false);
  const [previewProduct,setPreviewProduct]=useState<Product|null>(null);
  const cart=useMemo(()=>{
    try {const parsed:unknown=JSON.parse(raw);if(!Array.isArray(parsed))return [];const ids=new Set(parsed.filter(x=>typeof x==="string"));return catalog.products.filter(p=>ids.has(p.id));}catch{return [];}
  },[raw,catalog.products]);
  async function mutateCart(id:string,addItem:boolean){
    const mutate=()=>{let ids:string[]=[];try{const parsed:unknown=JSON.parse(readStored("flare:cart","[]"));if(Array.isArray(parsed))ids=parsed.filter((x):x is string=>typeof x==="string"&&catalog.products.some(p=>p.id===x));}catch{/* Recover corrupted state. */}setRaw(JSON.stringify(addItem?[...new Set([...ids,id])]:ids.filter(x=>x!==id)));};
    if(navigator.locks)await navigator.locks.request("flare-cart",mutate);else mutate();
  }
  function add(product:Product){void mutateCart(product.id,true).then(()=>setNotice(product));}
  function remove(id:string){void mutateCart(id,false);}
  return <ShopContext.Provider value={{...catalog,cart,notice,dismissNotice:()=>setNotice(null),add,remove,loggedIn:loginValue==="1",login:()=>setLoginDialog(true),logout:()=>setLogoutDialog(true),tradeUrl,saveTradeUrl,previewProduct,setPreviewProduct}}>
    {children}
    {!previewProduct&&<CartNotice/>}
    {loginDialog&&<Modal title="Личный кабинет" onClose={()=>setLoginDialog(false)}><div className="dialog-symbol"><Icon name="steam" size={32}/></div><h2>Личный кабинет</h2><p className="muted">Сохраните ссылку на обмен Steam для получения выбранных предметов.</p><button className="button primary full" onClick={()=>{setLoginValue("1");setLoginDialog(false);if(pathname!=="/cart")router.push("/account");}}>{pathname==="/cart"?"Продолжить":"Перейти в кабинет"} <Icon name="arrow"/></button></Modal>}
    {logoutDialog&&<Modal title="Выйти из аккаунта?" onClose={()=>setLogoutDialog(false)}><h2>Выйти из аккаунта?</h2><p className="muted">Выбранные скины останутся в корзине.</p><div className="dialog-actions"><button className="button primary" autoFocus onClick={()=>setLogoutDialog(false)}>Остаться</button><button className="button secondary" onClick={()=>{setLoginValue("0");setLogoutDialog(false);}}>Выйти</button></div></Modal>}
  </ShopContext.Provider>;
}

export function CartNotice(){
 const shop=useShop();
 if(!shop.notice)return null;
 return <div className="cart-notice" role="status" aria-live="polite"><span className="notice-check"><Icon name="check"/></span><div><strong>Добавлено в корзину</strong><span>{shop.notice.name}</span></div><Link href="/cart" onClick={()=>{shop.dismissNotice();shop.setPreviewProduct(null);}}>В корзину <Icon name="arrow" size={16}/></Link><button className="icon-button" aria-label="Закрыть уведомление" onClick={shop.dismissNotice}><Icon name="close" size={18}/></button></div>;
}
