import {secureEqual} from '../server/bot-store.js';
import {createBotRuntime} from '../server/bot-runtime.js';
const json=(res,status,body)=>{res.setHeader('Cache-Control','no-store');res.status(status).json(body);};
export default async function handler(req,res){
 if(req.method!=='POST')return json(res,405,{ok:false,code:'method'});
 if(process.env.BOT_WORKER_ENABLED!=='true'||process.env.BOT_ENABLED!=='true')return json(res,503,{ok:false,code:'not_configured'});
 const header=typeof req.headers?.authorization==='string'?req.headers.authorization:'',match=/^Bearer ([^\s]+)$/.exec(header);
 if(!match||!secureEqual(match[1],process.env.TELEGRAM_WORKER_SECRET))return json(res,401,{ok:false,code:'secret'});
 try{const processed=await createBotRuntime().drain();return json(res,200,{ok:true,processed});}catch{return json(res,503,{ok:false,code:'retry'});}
}
