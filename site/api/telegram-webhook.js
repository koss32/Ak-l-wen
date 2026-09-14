import {secureEqual} from '../server/bot-store.js';
import {createBotRuntime} from '../server/bot-runtime.js';
export const config={api:{bodyParser:false}};
const LIMIT=128*1024;
const json=(res,status,body)=>{res.setHeader('Cache-Control','no-store');res.status(status).json(body);};
const scalar=value=>typeof value==='string'?value:'';
export function validPublicOrigin(value){try{const url=new URL(value);return !url.username&&!url.password&&!url.pathname.replaceAll('/','')&&!url.search&&!url.hash&&(url.protocol==='https:'||(url.protocol==='http:'&&['localhost','127.0.0.1'].includes(url.hostname)))?url:null;}catch{return null;}}
export async function readJsonBody(req,limit=LIMIT){let buffer;if(Buffer.isBuffer(req.rawBody))buffer=req.rawBody;else if(Buffer.isBuffer(req.body))buffer=req.body;else if(typeof req.body==='string')buffer=Buffer.from(req.body);else if(req&&typeof req[Symbol.asyncIterator]==='function'){const chunks=[];let size=0;for await(const chunk of req){const part=Buffer.from(chunk);size+=part.length;if(size>limit)throw Object.assign(new Error('too_large'),{code:'too_large'});chunks.push(part);}buffer=Buffer.concat(chunks);}else throw Object.assign(new Error('raw_body_required'),{code:'invalid_json'});if(buffer.length>limit)throw Object.assign(new Error('too_large'),{code:'too_large'});let body;try{body=JSON.parse(buffer.toString('utf8'));}catch{throw Object.assign(new Error('invalid_json'),{code:'invalid_json'});}if(!body||typeof body!=='object'||Array.isArray(body))throw Object.assign(new Error('invalid_json'),{code:'invalid_json'});return body;}
export function validTelegramUpdate(update){if(!Number.isInteger(update?.update_id)||Boolean(update.message)===Boolean(update.callback_query))return false;if(update.message)return Number.isSafeInteger(update.message.chat?.id)&&Number.isSafeInteger(update.message.from?.id)&&typeof update.message.chat?.type==='string'&&typeof update.message.text==='string';const q=update.callback_query;return typeof q?.id==='string'&&q.id.length>0&&Number.isSafeInteger(q.from?.id)&&Number.isSafeInteger(q.message?.chat?.id)&&typeof q.message?.chat?.type==='string'&&typeof q.data==='string'&&q.data.length>0&&Buffer.byteLength(q.data)<=64;}
export default async function handler(req,res){
 if(req.method!=='POST')return json(res,405,{ok:false,code:'method'});
 if(process.env.BOT_WEBHOOK_ENABLED!=='true'||process.env.BOT_ENABLED!=='true')return json(res,503,{ok:false,code:'not_configured'});
 const origin=validPublicOrigin(process.env.PUBLIC_ORIGIN);if(!origin)return json(res,503,{ok:false,code:'not_configured'});
 if(scalar(req.headers?.host).toLowerCase()!==origin.host.toLowerCase())return json(res,403,{ok:false,code:'host'});
 if(!/^application\/json(?:\s*;\s*charset=utf-8)?$/i.test(scalar(req.headers?.['content-type'])))return json(res,415,{ok:false,code:'content_type'});
 if(!secureEqual(scalar(req.headers?.['x-telegram-bot-api-secret-token']),process.env.TELEGRAM_WEBHOOK_SECRET))return json(res,401,{ok:false,code:'secret'});
 let update;try{update=await readJsonBody(req);}catch(error){return json(res,error.code==='too_large'?413:400,{ok:false,code:error.code||'invalid_json'});}
 if(!validTelegramUpdate(update))return json(res,400,{ok:false,code:'invalid_update'});
 try{const result=await createBotRuntime().bot.handle(update);if(result?.ok===false)return json(res,400,result);return json(res,200,{ok:true,dropped:Boolean(result?.dropped)});}catch{return json(res,503,{ok:false,code:'retry'});}
}
