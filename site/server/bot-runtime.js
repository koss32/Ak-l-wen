import {Redis} from '@upstash/redis';
import {createMemoryBotStore,createUpstashBotStore} from './bot-store.js';
import {createTelegramBot,drainTelegramOutbox} from './telegram-bot.js';
import {assessBotConfig,isValidTelegramTimeout} from './bot-config.js';
import {legal} from '../src/data.js';

const fail=code=>{throw new Error(code);};
const positiveInteger=(value,name,{min=1,max=1000}={})=>{
 const number=Number(value);
 if(!Number.isInteger(number)||number<min||number>max)fail(name);
 return number;
};

/**
 * Construct a durable bot runtime. Memory storage is only injectable for tests;
 * production construction always requires Redis credentials.
 */
export function createBotRuntime(env=process.env,{store,fetchImpl=fetch}={}){
 const checked=assessBotConfig(env,{requireEnabled:true,requireRedis:!store});
 if(!checked.ok)fail(checked.errors[0]);
 let activeStore=store;
 if(!activeStore){
  const url=env.UPSTASH_REDIS_REST_URL||env.KV_REST_API_URL;
  const token=env.UPSTASH_REDIS_REST_TOKEN||env.KV_REST_API_TOKEN;
  activeStore=createUpstashBotStore(new Redis({url,token}),{prefix:env.BOT_REDIS_PREFIX||'{akbot}:'});
 }
 const config={
  sourceLegalStatus:legal.publicationStatus,
  privacyUrl:checked.privacyUrl,
  deliveryReady:checked.workerReady,
  staffUserIds:checked.userIds,
  staffChatId:checked.staffChatId,
  privacyStatus:env.PRIVACY_PUBLICATION_STATUS||'pending',
  consentVersion:env.PRIVACY_CONSENT_VERSION||legal.consentVersion
 };
 const bot=createTelegramBot({store:activeStore,config});
 return {
  bot,
  store:activeStore,
  // createTelegramBot is the single booking-readiness authority.
  infoOnly:bot.infoOnly,
  drain(options={}){
   if(!checked.workerReady)fail('BOT_WORKER_NOT_READY');
   const timeoutMs=options.timeoutMs===undefined?checked.timeoutMs:positiveInteger(options.timeoutMs,'BOT_TIMEOUT_INVALID',{min:250,max:10000});
   if(!isValidTelegramTimeout(timeoutMs))fail('BOT_TIMEOUT_INVALID');
   const limit=options.limit===undefined?50:positiveInteger(options.limit,'BOT_DRAIN_LIMIT_INVALID',{max:1000});
   const maxDurationMs=options.maxDurationMs===undefined?25000:positiveInteger(options.maxDurationMs,'BOT_DRAIN_BUDGET_INVALID',{min:250,max:29000});
   return drainTelegramOutbox({store:activeStore,token:String(env.TELEGRAM_BOT_TOKEN||'').trim(),fetchImpl,timeoutMs,limit,maxDurationMs,monotonicNow:options.monotonicNow});
  }
 };
}
export {createMemoryBotStore};
