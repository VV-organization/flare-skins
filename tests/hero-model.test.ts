import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
test('hero model fits transfer budget and preserves valid indexed geometry',()=>{
 const packed=readFileSync('public/models/ak47-packed.bin.gz');assert.ok(packed.length<350000);
 const data=gunzipSync(packed),vertices=data.readUInt32LE(0),indices=data.readUInt32LE(4);
 assert.equal(indices/3,26133);assert.equal(data.length,8+vertices*18+indices*2);
 for(let i=8;i<8+vertices*12;i+=4)assert.ok(Number.isFinite(data.readFloatLE(i)));
 for(let i=8+vertices*18;i<data.length;i+=2)assert.ok(data.readUInt16LE(i)<vertices);
 assert.ok(readFileSync('public/hero/ak47-poster.webp').length<65000);
});
