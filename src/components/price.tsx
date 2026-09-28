import {formatMinor,dropsToRub} from "@/lib/money";
export function Price({minor,large=false}:{minor:number;large?:boolean}) {
  return <div className={`price ${large?"price-large":""}`}><span>{formatMinor(minor)} <b>Drops</b></span><small>≈ {formatMinor(dropsToRub(minor))} ₽</small></div>;
}
