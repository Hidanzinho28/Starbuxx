import fs from 'node:fs';
import vm from 'node:vm';
const ctx={window:{}};
for(const file of ['pricing.js','catalog-data.js','mm2-data.js','blox-data.js','brainrot-data.js'])vm.runInNewContext(fs.readFileSync(new URL('../dist/'+file,import.meta.url),'utf8'),ctx);
const app=fs.readFileSync(new URL('../dist/app.js',import.meta.url),'utf8');
const prefix=app.slice(0,app.indexOf('window.productPages?.configure(products);'));
if(!prefix.includes('products[24].archived=true'))throw Error('Catálogo não localizado.');
vm.runInNewContext(prefix+'\nwindow.paymentCatalog=products.filter(p=>!p.archived).map(({id,name,price,game,stock})=>({id,name,priceCents:Math.round(price*100),game,stock}));',ctx);
fs.writeFileSync(new URL('../server/catalog.json',import.meta.url),JSON.stringify(ctx.window.paymentCatalog));
console.log('Catálogo de pagamento gerado: '+ctx.window.paymentCatalog.length+' produtos.');

await import('./check-release.mjs');
