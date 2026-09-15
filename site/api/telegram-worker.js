import {secureEqual} from '../server/bot-store.js';
import {createBotRuntime} from '../server/bot-runtime.js';
import {assessBotConfig,isValidTelegramSecret} from '../server/bot-config.js';
const json=(res,status,body)=>{res.setHeader('Cache-Control','no-store');res.status(status).json(body);};
const WORKER_BUDGET_MS=25000; // leaves headroom below a 30-second serverless invocation.

export function createWorkerHandler({env=process.env,createRuntime=createBotRuntime}={}){
 return async function handler(req,res){
  if(req.method!=='POST')return json(res,405,{ok:false,code:'method'});
  // Authenticate first once the endpoint itself has an adequate configured secret.
  // This does not disclose whether later operational checks (Redis, staff routing) pass.
  if(env.BOT_ENABLED!=='true'||env.BOT_WORKER_ENABLED!=='true'||!isValidTelegramSecret(env.TELEGRAM_WORKER_SECRET))return json(res,503,{ok:false,code:'not_configured'});
  const header=typeof req.headers?.authorization==='string'?req.headers.authorization:'';
  const match=/^Bearer ([^\s]+)$/.exec(header);
  if(!match||!secureEqual(match[1],env.TELEGRAM_WORKER_SECRET))return json(res,401,{ok:false,code:'secret'});
  const checked=assessBotConfig(env,{requireEnabled:true,requireWorker:true,requireRedis:false});
  if(!checked.ok)return json(res,503,{ok:false,code:'not_configured'});
  try{
   const runtime=createRuntime(env);
   const processed=await runtime.drain({limit:50,maxDurationMs:WORKER_BUDGET_MS});
   return json(res,200,{ok:true,processed});
  }catch{return json(res,503,{ok:false,code:'retry'});}
 };
}
export {WORKER_BUDGET_MS};
export default createWorkerHandler();
