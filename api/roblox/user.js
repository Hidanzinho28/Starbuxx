import {createRobloxHandler} from '../../roblox.mjs';
const handle=createRobloxHandler();
export default async function handler(req,res){await handle(req,res,new URL(req.url,'http://local'))}
