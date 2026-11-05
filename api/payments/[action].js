import {paymentHandler} from '../../server/payments.mjs';
export default async function handler(req,res){const action=req.query?.action||new URL(req.url,'http://local').pathname.split('/').pop();await paymentHandler(req,res,action)}
