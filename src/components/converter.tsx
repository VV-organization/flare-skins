"use client";
import {useId,useState} from "react";
import {parseAmount,dropsToRub,rubToDrops,inputAmount} from "@/lib/money";
import {Icon} from "./icon";
export function Converter(){
  const id=useId();const [rub,setRub]=useState("1 000");const [drops,setDrops]=useState("1 800");const [error,setError]=useState(false);
  function change(value:string,type:"rub"|"drops"){
    const update=type==="rub"?setRub:setDrops; const other=type==="rub"?setDrops:setRub;
    update(value);if(!value){other("");setError(false);return;}const amount=parseAmount(value);
    setError(amount===null);other(amount===null?"":inputAmount(type==="rub"?rubToDrops(amount):dropsToRub(amount)));
  }
  return <section className="converter" aria-labelledby={id}><div className="converter-heading"><h2 id={id}>Расчёт стоимости</h2></div><div className="converter-fields"><label><span className="sr-only">Рубли</span><input aria-label="Рубли" value={rub} inputMode="decimal" maxLength={12} onChange={e=>change(e.target.value,"rub")} aria-invalid={error}/><span>₽</span></label><span className="convert-icon"><Icon name="swap"/></span><label><span className="sr-only">Drops</span><input aria-label="Drops" value={drops} inputMode="decimal" maxLength={12} onChange={e=>change(e.target.value,"drops")} aria-invalid={error}/><span>Drops</span></label></div><div className="converter-rate"><strong>1 ₽ = 1,8 Drops</strong><span>{error?"Введите корректную сумму":"Можно изменить любую сумму"}</span></div>{error&&<p className="converter-error" role="status">Введите корректную сумму: до двух знаков после запятой.</p>}</section>;
}
