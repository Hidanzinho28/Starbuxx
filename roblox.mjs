const USERNAME=/^[A-Za-z0-9_]{1,20}$/;
export function normalizeUsername(value){return String(value||'').trim().replace(/^@/,'')}
export function validUsername(value){return USERNAME.test(value)}
export class LookupError extends Error{constructor(status,message){super(message);this.status=status}}
export async function lookupRoblox(username,fetcher=fetch){
  if(!validUsername(username))throw new LookupError(400,'Digite o nome de usuário Roblox, sem espaços (até 20 caracteres).');
  let response;
  try{response=await fetcher('https://users.roblox.com/v1/usernames/users',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({usernames:[username],excludeBannedUsers:true}),signal:AbortSignal.timeout(8000)})}
  catch{throw new LookupError(502,'Não foi possível consultar o Roblox agora. Confira sua conexão e tente novamente.')}
  if(response.status===429)throw new LookupError(429,'O Roblox recebeu muitas consultas. Aguarde um pouco e tente novamente.');
  if(!response.ok)throw new LookupError(502,'O Roblox está indisponível para consulta. Tente novamente em instantes.');
  let user;try{user=(await response.json()).data?.[0]}catch{throw new LookupError(502,'O Roblox retornou uma resposta inválida.')}
  if(!user)throw new LookupError(404,'Usuário não encontrado. Use o @nome de usuário, não o nome de exibição.');
  if(!Number.isSafeInteger(user.id)||user.id<1||typeof user.name!=='string'||!validUsername(user.name))throw new LookupError(502,'O Roblox retornou um perfil inválido.');
  let avatarUrl=null;
  try{const thumbnail=await fetcher(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${user.id}&size=420x420&format=Png&isCircular=false`,{signal:AbortSignal.timeout(8000)});if(thumbnail.ok){const image=(await thumbnail.json()).data?.find(item=>item.targetId===user.id&&item.state==='Completed');if(image?.imageUrl){const url=new URL(image.imageUrl);if(url.protocol==='https:'&&(url.hostname==='rbxcdn.com'||url.hostname.endsWith('.rbxcdn.com')))avatarUrl=url.href}}}catch{/* A public profile can still be selected while its thumbnail is unavailable. */}
  const publicData=await lookupPublicDetails(user.id,fetcher);
  return {id:user.id,username:user.name,displayName:typeof user.displayName==='string'?user.displayName.slice(0,100):user.name,avatarUrl,...publicData,profileUrl:`https://www.roblox.com/users/${user.id}/profile`};
}
export async function lookupPublicDetails(id,fetcher=fetch){
  const base='https://friends.roblox.com/v1/users/'+id;
  const urls=[['description','https://users.roblox.com/v1/users/'+id],['friendsCount',base+'/friends/count'],['followersCount',base+'/followers/count'],['followingCount',base+'/followings/count']];
  const pairs=await Promise.all(urls.map(async([key,url])=>{try{const r=await fetcher(url,{signal:AbortSignal.timeout(6000)});if(!r.ok)return [key,null];const body=await r.json();if(key==='description')return [key,typeof body.description==='string'?body.description.slice(0,10000):null];return [key,Number.isSafeInteger(body.count)&&body.count>=0?body.count:null]}catch{return [key,null]}}));
  return {...Object.fromEntries(pairs),publicDetailsAt:new Date().toISOString()};
}
export function createRobloxHandler(fetcher=fetch){
  const cache=new Map(),rate=new Map();
  return async function handle(req,res,url){
    if(url.pathname!=='/api/roblox/user')return false;
    const send=(status,data)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(data));return true};
    if(req.method!=='GET')return send(405,{error:'Método não permitido.'});
    const username=normalizeUsername(url.searchParams.get('username'));
    if(!validUsername(username))return send(400,{error:'Digite um nome de usuário Roblox válido, sem espaços.'});
    const now=Date.now(),ip=req.socket.remoteAddress||'local';
    for(const [key,v] of rate)if(v.until<now)rate.delete(key);
    const bucket=rate.get(ip)||{count:0,until:now+60000};if(bucket.count>=12)return send(429,{error:'Muitas buscas seguidas. Aguarde um minuto antes de tentar novamente.'});bucket.count++;rate.set(ip,bucket);
    const key=username.toLowerCase(),saved=cache.get(key);if(saved&&saved.until>now)return send(200,saved.user);
    try{const user=await lookupRoblox(username,fetcher);if(cache.size>=500)cache.delete(cache.keys().next().value);cache.set(key,{user,until:now+300000});return send(200,user)}catch(error){return send(error.status||502,{error:error instanceof LookupError?error.message:'Não foi possível buscar o usuário. Tente novamente.'})}
  };
}
