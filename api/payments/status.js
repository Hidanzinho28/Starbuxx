import {paymentHandler} from '../../server/payments.mjs';
export default async function handler(req,res){await paymentHandler(req,res,'status')}
