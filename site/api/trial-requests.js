import {Redis} from '@upstash/redis';
import {createHostedTrialService,createUpstashLedger} from '../server/hosted-trial.js';

export const config={api:{bodyParser:{sizeLimit:'8kb'}}};

function json(res,status,body){res.setHeader('Cache-Control','no-store');res.status(status).json(body);}

export default async function handler(req,res){
 if(req.method!=='POST')return json(res,405,{ok:false,code:'method'});
 if(!req.headers['content-type']?.startsWith('application/json'))return json(res,415,{ok:false,code:'content_type'});
 const expectedOrigin=process.env.PUBLIC_ORIGIN||`https://${req.headers.host}`;
 if(req.headers.origin&&req.headers.origin!==expectedOrigin)return json(res,403,{ok:false,code:'origin'});
 if(Number(req.headers['content-length'])>8192)return json(res,413,{ok:false,code:'too_large'});
 const redisUrl=process.env.UPSTASH_REDIS_REST_URL||process.env.KV_REST_API_URL;
 const redisToken=process.env.UPSTASH_REDIS_REST_TOKEN||process.env.KV_REST_API_TOKEN;
 if(!redisUrl||!redisToken)return json(res,503,{ok:false,code:'not_configured'});
 try{
  const redis=new Redis({url:redisUrl,token:redisToken});
  const service=createHostedTrialService({ledger:createUpstashLedger(redis),token:process.env.TELEGRAM_BOT_TOKEN,chatId:process.env.TELEGRAM_CHAT_ID_AK});
  const ip=String(req.headers['x-forwarded-for']||req.socket?.remoteAddress||'unknown').split(',')[0].trim();
  const result=await service.handle(req.body,ip);return json(res,result.httpStatus,result.body);
 }catch{return json(res,503,{ok:false,code:'not_configured'});}
}
