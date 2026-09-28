"use client";
import {useEffect} from "react";
import {usePathname} from "next/navigation";

/** Animate leaves, never whole sections: long sections must not reveal offscreen content early. */
export function PageMotion(){
 const pathname=usePathname();
 useEffect(()=>{
  const media=matchMedia("(prefers-reduced-motion: reduce)");
  const animations=new Map<Element,Animation>();
  const seen=new WeakSet<Element>();
  let observer:IntersectionObserver|undefined;
  let mutations:MutationObserver|undefined;
  const stop=()=>{observer?.disconnect();mutations?.disconnect();animations.forEach(a=>a.cancel());animations.clear();};
  const start=()=>{
   stop();if(media.matches)return;
   observer=new IntersectionObserver(entries=>{
    entries.filter(e=>e.isIntersecting).sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top).forEach((entry,i)=>{
     const animation=animations.get(entry.target);if(animation){animation.effect?.updateTiming({delay:Math.min(i,4)*25});animation.play();}
     observer?.unobserve(entry.target);
    });
   },{threshold:0,rootMargin:"0px"});
   const scan=()=>{
    const candidates=[...document.querySelectorAll('#main h1,#main h2,#main h3,#main p,#main .eyebrow,#main .category-line,#main .skin-guide dl>div,#main .faq-list details,#main .gift-card-face,#main .hero-product,#main .hero-footer,#main .field-label,#main .money-input,#main .text-input,#main .amount-presets,#main .payment-choice,#main .gift-form>label,#main .gift-form>select,#main .gift-denominations,#main .gift-summary,#main .topup-total,#main .product-info,#main .loadout-info,#main .loadout-row-top,#main .loadout-controls,#main .compare-weapon,#main .compare-verdict,#main .button,#main .color-options,#main .budget-control,#main .budget-options,#main .converter-fields,#main .converter-rate,#main .gift-steps,#main .steam-summary,#main .topup-title>svg,.footer-directory>*,.footer-baseline>*,.site-header>*,#main .catalog-page .product-card,#main .catalog-category-tabs,#main .catalog-toolbar,#main .filters-heading,#main .results-count,#main .filter-chips,#main fieldset,#main .filter-option,#main .product-meta,#main .hero-overline,#main .loadout-count,#main .compare-row:not(:first-child),#main .cart-item,#main .summary-line,#main .order-total,#main .payment-row,#main .skin-specs,#main .float-block,#main .detail-price-block,#main .inspection-top,#main .inspection-tools,#main .inspection-bottom,#main button,#main a,#main label,#main input,#main select,#main img,.modal h2,.modal p,.modal .eyebrow,.modal .float-block,.modal .detail-price-block,.modal .button,.modal .payment-row,.modal .text-link,#main .category-stage-caption,#main .category-stage-name,#main .hero-field-word,#main .gift-poster-word,.footer-signature,#main .loadout-film,#main .gift-poster,#main .catalog-edition')].filter(node=>!node.matches('.hero-skin,.product-image-button,.loadout-image,.compare-image')&&!node.matches('.hero-object img,.studio-render img,.product-image-button img,.loadout-image img,.compare-image img,.detail-visual img,.inspection-object img,.category-object img'));
    const groups=new Set(candidates);
    candidates.forEach(node=>{
     if(seen.has(node)||node.closest('[hidden]'))return;
     // Each visual group appears once; its children inherit the same motion.
     for(let parent=node.parentElement;parent;parent=parent.parentElement){if(groups.has(parent))return;}
     const rect=node.getBoundingClientRect();if(!rect.width||!rect.height||rect.bottom<0)return;
     seen.add(node);
     const field=node.matches(".loadout-film,.gift-poster");
     const frames=field?[{clipPath:"inset(9% 0 9% 0)"},{clipPath:"inset(0)"}]:[{opacity:0,translate:"0 16px"},{opacity:1,translate:"0 0"}];
     const animation=node.animate(frames,{duration:field?650:450,easing:"cubic-bezier(.16,1,.3,1)",fill:"both"});
     animation.pause();animations.set(node,animation);
     animation.onfinish=()=>{animation.cancel();animations.delete(node);};
     observer?.observe(node);
    });
   };
   scan();mutations=new MutationObserver(scan);mutations.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden','open']});
  };
  const showFocused=(event:FocusEvent)=>{animations.forEach((animation,node)=>{if(event.target instanceof Node&&node.contains(event.target)){animation.finish();observer?.unobserve(node);}});};
  document.addEventListener('focusin',showFocused);
  start();media.addEventListener('change',start);
  return ()=>{stop();document.removeEventListener('focusin',showFocused);media.removeEventListener('change',start);};
 },[pathname]);
 return null;
}
