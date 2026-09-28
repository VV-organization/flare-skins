/** Minor units are hundredths; preview rounding is half-up, not a live payment contract. */
export const DROPS_PER_RUBLE = 1.8;
const RATE_NUMERATOR = 9n;
const RATE_DENOMINATOR = 5n;
export const STEAM_FEE_PERCENT = 5;
const MAX_MINOR = 999_999_999;

export function parseAmount(value: string): number | null {
  const clean = value.trim().replace(/[ \u00a0\u202f]/g, "").replace(",", ".");
  if (!/^\d{1,7}(?:\.\d{1,2})?$/.test(clean)) return null;
  const [whole, fraction = ""] = clean.split(".");
  const minor = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  return Number.isSafeInteger(minor) && minor <= MAX_MINOR ? minor : null;
}
function validMinor(value: number) {
  if (!Number.isSafeInteger(value) || value < 0 || value > MAX_MINOR) throw new RangeError("Invalid money amount");
}
export function dropsToRub(dropsMinor: number) {
  validMinor(dropsMinor);
  return Number((BigInt(dropsMinor) * RATE_DENOMINATOR + RATE_NUMERATOR / 2n) / RATE_NUMERATOR);
}
export function rubToDrops(rubMinor: number) {
  validMinor(rubMinor);
  return Number((BigInt(rubMinor) * RATE_NUMERATOR + RATE_DENOMINATOR / 2n) / RATE_DENOMINATOR);
}
export function steamQuote(amount: number) {
  validMinor(amount);
  const fee = Number((BigInt(amount) * 5n + 50n) / 100n);
  return { amount, fee, total: amount + fee };
}
export function sumPrices(prices: readonly number[]) {
  const drops=prices.reduce((sum,price)=>{validMinor(price);return sum+price;},0);
  if(!Number.isSafeInteger(drops))throw new RangeError("Invalid total");
  return {drops,rub:Number((BigInt(drops)*RATE_DENOMINATOR+RATE_NUMERATOR/2n)/RATE_NUMERATOR)};
}
export function formatMinor(minor: number, digits = 2) {
  return (minor / 100).toLocaleString("ru-RU", { minimumFractionDigits:0, maximumFractionDigits:digits });
}
export function inputAmount(minor: number) {
  return (minor / 100).toFixed(2).replace(/\.00$/, "").replace(".", ",");
}
