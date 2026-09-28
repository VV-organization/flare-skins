import {DROPS_PER_RUBLE} from "../lib/money";
export const project = {
  name:"Drops",
  dropsPerRuble:DROPS_PER_RUBLE,
  steamFeePercent:5,
  preview: process.env.NEXT_PUBLIC_CATALOG_MODE !== "live",
} as const;
