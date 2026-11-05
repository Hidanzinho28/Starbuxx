import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {paymentHandler} from './server/payments.mjs';
import {createRobloxHandler} from './roblox.mjs';
const root=path.resolve('dist');
const port=Number(process.argv[2]||4173);
if(!Number.isInteger(port)||port<1||port>65535){console.error('Informe uma porta entre 1 e 65535.');process.exit(1)}
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.avif':'image/avif','.webm':'video/webm','.mp4':'video/mp4','.woff2':'font/woff2','.json':'application/json'};
const robloxHandler=createRobloxHandler();
http.createServer(async(req,res)=>{
  let requestUrl;try{requestUrl=new URL(req.url,'http://localhost')}catch{res.writeHead(400).end();return}
  if(requestUrl.pathname.startsWith('/api/payments/')){await paymentHandler(req,res,requestUrl.pathname.split('/').pop());return}
  if(await robloxHandler(req,res,requestUrl))return;
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405).end();return}
  let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname)}catch{res.writeHead(400).end();return}
  let file=path.resolve(root,'.'+pathname);
  if(!file.startsWith(root+path.sep)&&file!==root){res.writeHead(403).end();return}
  if(!fs.existsSync(file)||fs.statSync(file).isDirectory()){
    if(path.extname(pathname)){res.writeHead(404).end();return}
    file=path.join(root,'index.html');
  }
  const size=fs.statSync(file).size;res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');
  res.setHeader('Accept-Ranges','bytes');let start=0,end=size-1;
  if(req.headers.range){const match=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
    if(!match||(!match[1]&&!match[2])){res.writeHead(416,{'Content-Range':`bytes */${size}`}).end();return}
    if(!match[1])start=Math.max(0,size-Number(match[2]));else{start=Number(match[1]);if(match[2])end=Math.min(Number(match[2]),size-1)}
    if(start>=size||start>end){res.writeHead(416,{'Content-Range':`bytes */${size}`}).end();return}
    res.statusCode=206;res.setHeader('Content-Range',`bytes ${start}-${end}/${size}`);
  }
  res.setHeader('Content-Length',end-start+1);if(req.method==='HEAD'){res.end();return}
  fs.createReadStream(file,{start,end}).on('error',()=>res.destroy()).pipe(res);
}).listen(port,'127.0.0.1',()=>console.log(`Local: http://127.0.0.1:${port}`));
