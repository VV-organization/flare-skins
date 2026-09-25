import {formatMinor,flareToRub} from "@/lib/money";
export function Price({minor,large=false}:{minor:number;large?:boolean}) {
  return <div className={`price ${large?"price-large":""}`}><span>{formatMinor(minor)} <b>FLARE</b></span><small>≈ {formatMinor(flareToRub(minor))} ₽</small></div>;
}
