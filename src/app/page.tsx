import {Home} from "@/components/home";
import {getCatalog} from "@/lib/catalog";
export default function Page(){return <><link rel="preload" href={`${process.env.NEXT_PUBLIC_BASE_PATH??""}/models/ak47-packed.bin.gz`} as="fetch" crossOrigin="anonymous"/><Home catalog={getCatalog()}/></>;}
