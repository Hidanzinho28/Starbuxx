import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
test('cliente exibe PIX sandbox, salva pedido e atualiza confirmação sem entregar item',async()=>{
 let html='',stored={},onConfirmed=0;
 const created={order:{id:'STB-CLIENTE',paymentId:'psc_CLIENTE',status:'pendente',total:15,environment:'sandbox',items:[{id:0,name:'Produto',price:15,qty:1}]},token:'signed-receipt',pix:{brCode:'SANDBOX_PIX_TEST',qrCodeImage:'data:image/png;base64,AAAA'},expiresAt:new Date(Date.now()+1800000).toISOString()};
 const document={hidden:false,querySelector:s=>s==='#modal'?{addEventListener(){}}:null,querySelectorAll:()=>[],addEventListener(){}};
 const ctx={window:{lojaCart:{open:s=>html=s}},document,localStorage:{getItem:k=>stored[k]||null,setItem:(k,v)=>stored[k]=v},location:{pathname:'/robux'},AbortSignal,URL,Date,setTimeout:()=>1,clearTimeout(){},navigator:{},fetch:async(url,opts)=>({ok:true,json:async()=>url.endsWith('/config')?{enabled:true,environment:'sandbox'}:url.endsWith('/create')?created:{status:'pago'}})};
 vm.runInNewContext(fs.readFileSync(new URL('../dist/payments.js',import.meta.url),'utf8'),ctx);await ctx.window.paymentUI.ready;
 assert.equal(ctx.window.paymentUI.enabled,true);await ctx.window.paymentUI.create({email:'teste@example.com',username:'Usuario',items:[{id:0,qty:1}],onConfirmed:()=>onConfirmed++});assert(html.includes('SANDBOX'));assert(html.includes('SANDBOX_PIX_TEST'));assert(html.includes('entrega não é automática'));assert.equal(onConfirmed,1);assert.equal(ctx.window.paymentUI.saved()[0].status,'pendente');
});
test('adapters Vercel e build são empacotados com a API fora de dist',()=>{const cfg=JSON.parse(fs.readFileSync(new URL('../vercel.json',import.meta.url)));assert.equal(cfg.outputDirectory,'dist');assert(cfg.buildCommand.includes('scripts/build.mjs'));assert(fs.existsSync(new URL('../api/payments/[action].js',import.meta.url)));assert(!fs.existsSync(new URL('../dist/server/payments.mjs',import.meta.url)))});

test('erro de configuração bloqueia fluxo no domínio publicado',async()=>{
 const ctx={window:{},document:{querySelector:()=>({addEventListener(){}}),addEventListener(){}},localStorage:{getItem:()=>null},location:{hostname:'loja.example'},AbortSignal,setTimeout,clearTimeout,fetch:async()=>{throw Error('offline')}};
 vm.runInNewContext(fs.readFileSync(new URL('../dist/payments.js',import.meta.url),'utf8'),ctx);await ctx.window.paymentUI.ready;assert.equal(ctx.window.paymentUI.enabled,false);assert.equal(ctx.window.paymentUI.unavailable,true);
});
test('consulta PIX pendente não reabre modal depois de fechado',async()=>{
 let opened=0,resolveStatus,close,click;const modal={open:true,addEventListener:(type,fn)=>{if(type==='close')close=fn}};let records={};
 const response={order:{id:'STB-RACE',paymentId:'psc_RACE',status:'pendente',total:15,environment:'sandbox',items:[]},token:'token',pix:{brCode:'SANDBOX_TEST'},expiresAt:new Date(Date.now()+100000).toISOString()};
 const ctx={window:{lojaCart:{open:()=>opened++}},document:{hidden:false,querySelector:s=>s==='#modal'?modal:s==='.pc-payment'?{}:s==='#pc-payment-status'?{textContent:''}:null,addEventListener:(type,fn)=>{if(type==='click')click=fn},querySelectorAll:()=>[]},localStorage:{getItem:k=>records[k]||null,setItem:(k,v)=>records[k]=v},location:{pathname:'/robux',hostname:'localhost'},AbortSignal,Date,setTimeout:()=>1,clearTimeout(){},fetch:async url=>url.endsWith('/status')?await new Promise(resolve=>resolveStatus=resolve):({ok:true,json:async()=>url.endsWith('/config')?{enabled:true}:response})};
 vm.runInNewContext(fs.readFileSync(new URL('../dist/payments.js',import.meta.url),'utf8'),ctx);await ctx.window.paymentUI.ready;await ctx.window.paymentUI.create({items:[],onConfirmed(){}});click({target:{closest:()=>({hasAttribute:key=>key==='data-pc-refresh'})}});await new Promise(setImmediate);modal.open=false;close();resolveStatus({ok:true,json:async()=>({status:'pago'})});await new Promise(setImmediate);assert.equal(opened,1);assert.equal(ctx.window.paymentUI.saved()[0].status,'pago');
});

test('rotas explicitas de pagamento funcionam sem roteamento dinamico de framework',async()=>{
 const oldKey=process.env.PURINCASH_API_KEY;delete process.env.PURINCASH_API_KEY;
 try{
  for(const action of ['config','create','status']){
   const {default:handler}=await import('../api/payments/'+action+'.js');let output;const res={setHeader(){},end(v){output=JSON.parse(v)}};
   await handler({method:action==='config'?'GET':'POST',headers:{host:'loja.example','content-type':'application/json'},body:{}},res);
   assert.equal(res.statusCode,action==='config'?200:503);assert(action==='config'?'enabled' in output:!!output.error);
  }
 }finally{if(oldKey===undefined)delete process.env.PURINCASH_API_KEY;else process.env.PURINCASH_API_KEY=oldKey}
});
