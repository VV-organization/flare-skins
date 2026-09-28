import fs from 'node:fs/promises';
import {gzipSync} from 'node:zlib';
import * as T from 'three';
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader.js';
import {mergeVertices} from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import sharp from 'sharp';
const source=await fs.readFile('public/models/ak47.obj','utf8');
const model=new OBJLoader().parse(source);const geometry=model.children[0].geometry;geometry.deleteAttribute('uv');
const p=geometry.attributes.position;const colors=new Float32Array(p.count*3);
const dark=new T.Color('#242629'),ceramic=new T.Color('#e7e4da'),orange=new T.Color('#ff5b26');
for(let i=0;i<p.count;i++){const y=p.getY(i),z=p.getZ(i);const smooth=T.MathUtils.smoothstep;const body=(1-smooth(z,7.5,9))*smooth(y,-1,.4),stock=1-smooth(z,-4,-3),foregrip=smooth(z,8.5,9.5)*(1-smooth(z,16,17))*smooth(y,-.2,.6),end=1-smooth(z,-9.2,-8.7);dark.clone().lerp(ceramic,Math.max(body,stock)).lerp(orange,Math.max(foregrip,end)).toArray(colors,i*3);}
geometry.setAttribute('color',new T.BufferAttribute(colors,3));const g=mergeVertices(geometry,1e-5);const count=g.attributes.position.count,index=g.index;
if(count>65535)throw Error('16-bit index limit');
const data=Buffer.alloc(8+count*18+index.count*2);data.writeUInt32LE(count,0);data.writeUInt32LE(index.count,4);let o=8;
for(let i=0;i<count;i++)for(let c=0;c<3;c++){data.writeFloatLE(g.attributes.position.array[i*3+c],o);o+=4;}
for(let i=0;i<count*3;i++)data.writeInt8(Math.round(g.attributes.normal.array[i]*127),o++);
for(let i=0;i<count*3;i++)data.writeUInt8(Math.round(g.attributes.color.array[i]*255),o++);
for(let i=0;i<index.count;i++){data.writeUInt16LE(index.array[i],o);o+=2;}
await fs.writeFile('public/models/ak47-packed.bin.gz',gzipSync(data,{level:9}));
// Lightweight first-paint poster rendered from the same geometry and vertex colours.
const n=geometry.attributes.normal,c=geometry.attributes.color,tri=[];const light=new T.Vector3(-.6,.7,.4).normalize();
for(let i=0;i<p.count;i+=3){let depth=0;const points=[];const color=new T.Color(0,0,0);let shade=0;for(let j=0;j<3;j++){const k=i+j;points.push(`${(25.92-p.getZ(k))*29+40},${(4.53-p.getY(k))*29+70}`);depth+=p.getX(k);const normal=new T.Vector3(-n.getX(k),n.getY(k),-n.getZ(k));shade+=Math.max(0,normal.dot(light));color.r+=c.getX(k)/3;color.g+=c.getY(k)/3;color.b+=c.getZ(k)/3;}color.multiplyScalar(.48+shade/3*.65);tri.push({depth,svg:`<polygon points="${points.join(' ')}" fill="#${color.getHexString()}" stroke="#${color.getHexString()}" stroke-width="0.65"/>`});}
tri.sort((a,b)=>b.depth-a.depth);const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1160" height="460" viewBox="0 0 1160 460">${tri.map(t=>t.svg).join('')}</svg>`;
await sharp(Buffer.from(svg)).webp({quality:88}).toFile('public/hero/ak47-poster.webp');
console.log({vertices:count,triangles:index.count/3,sourceBytes:Buffer.byteLength(source),packedBytes:(await fs.stat('public/models/ak47-packed.bin.gz')).size,posterBytes:(await fs.stat('public/hero/ak47-poster.webp')).size});
