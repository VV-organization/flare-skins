export const project = {
  name:"FLARE",
  rublesPerFlare:1.5,
  steamFeePercent:5,
  preview: process.env.NEXT_PUBLIC_CATALOG_MODE !== "live",
} as const;
