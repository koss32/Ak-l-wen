import {secureEqual} from '../server/bot-store.js';
import {isValidTelegramSecret} from '../server/bot-config.js';
import {runCheck,preconditions} from '../server/telegram-ops.js';

const json=(res,status,body)=>{res.setHeader('Cache-Control','no-store');res.status(status).json(body);};

// Read-only diagnostics run alongside the existing managed KV credentials.
// Never export credentials or allow webhook registration / outbox drain here.
export function createOpsHandler({env=process.env,check=runCheck}={}){
 return async function handler(req,res){
  if(req.method!=='POST')return json(res,405,{ok:false,code:'method'});
  if(!isValidTelegramSecret(env.TELEGRAM_WORKER_SECRET))return json(res,503,{ok:false,code:'not_configured'});
  const authorization=typeof req.headers?.authorization==='string'?req.headers.authorization:'';
  if(!secureEqual(authorization,`Bearer ${env.TELEGRAM_WORKER_SECRET}`))return json(res,401,{ok:false,code:'secret'});
  if(!Object.values(preconditions(env,'BOT_WEBHOOK_ENABLED')).every(Boolean))return json(res,403,{ok:false,code:'preview_only'});
  try{
   const result=await check({env});
   return json(res,result.ok?200:503,result);
  }catch{return json(res,503,{ok:false,code:'check_failed'});}
 };
}
export default createOpsHandler();
