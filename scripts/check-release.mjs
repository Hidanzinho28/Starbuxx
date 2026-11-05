import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const root=new URL('../',import.meta.url),dist=new URL('../dist/',import.meta.url);
for(const file of fs.readdirSync(dist).filter(n=>n.endsWith('.js')))new vm.Script(fs.readFileSync(new URL(file,dist),'utf8'),{filename:file});
const ctx={window:{},document:{addEventListener(){}}};
for(const file of ['pricing.js','media-map.js','catalog-data.js','mm2-data.js','blox-data.js','brainrot-data.js','product-page.js'])vm.runInNewContext(fs.readFileSync(new URL(file,dist),'utf8'),ctx);
const app=fs.readFileSync(new URL('app.js',dist),'utf8');vm.runInNewContext(app.slice(0,app.indexOf('window.productPages?.configure(products);'))+'\nwindow.allProducts=products;',ctx);
const products=ctx.window.allProducts.filter(p=>!p.archived);ctx.window.productPages.configure(products);
const server=JSON.parse(fs.readFileSync(new URL('../server/catalog.json',import.meta.url)));
const urls=new Set();
for(const p of products){const route=ctx.window.productPages.url(p);assert(!urls.has(route),'Rota duplicada: '+route);urls.add(route);const html=ctx.window.productPages.page(p);assert(html.includes('data-pdp-buy')&&html.includes('id="pdp-receive"'),'Produto incompleto: '+p.name);const image=p.image||ctx.window.originalMedia.products[p.id]||'/assets/'+p.art+'.svg';if(image.startsWith('/'))assert(fs.existsSync(new URL(image.slice(1),dist)),'Imagem ausente: '+image);assert.equal(server.find(x=>x.id===p.id)?.priceCents,Math.round(p.price*100),'Preço divergente: '+p.name)}
const html=fs.readFileSync(new URL('index.html',dist),'utf8');for(const match of html.matchAll(/(?:src|href)="(\/[^"?#]+\.(?:js|css|webp|png|svg))[^\"]*"/g)){assert(fs.existsSync(new URL(match[1].slice(1),dist)),'Arquivo HTML ausente: '+match[1])}
assert(!fs.existsSync(new URL('.env',dist)));const v=JSON.parse(fs.readFileSync(new URL('../vercel.json',import.meta.url)));assert(v.routes.some(r=>r.src==='/api/.*'&&r.status===404));
console.log('PASS: JavaScript, '+products.length+' páginas, rotas únicas, imagens locais, preços de servidor e recursos do HTML.');
