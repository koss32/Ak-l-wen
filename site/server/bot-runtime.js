import {Redis} from '@upstash/redis';
import {createMemoryBotStore,createUpstashBotStore} from './bot-store.js';
import {createTelegramBot,drainTelegramOutbox} from './telegram-bot.js';
import {legal} from '../src/data.js';

const ids=value=>String(value||'').split(',').map(x=>x.trim()).filter(x=>/^\d+$/.test(x));
export function createBotRuntime(env=process.env,{store,fetchImpl=fetch}={}){
 if(env.BOT_ENABLED!=='true')throw new Error('BOT_DISABLED');
 if(!store){const url=env.UPSTASH_REDIS_REST_URL||env.KV_REST_API_URL,token=env.UPSTASH_REDIS_REST_TOKEN||env.KV_REST_API_TOKEN;if(!url||!token)throw new Error('BOT_REDIS_MISSING');store=createUpstashBotStore(new Redis({url,token}),{prefix:env.BOT_REDIS_PREFIX||'{akbot}:'});}
 const config={privacyUrl:env.PRIVACY_URL||'',deliveryReady:env.BOT_WORKER_ENABLED==='true'&&Boolean(env.TELEGRAM_BOT_TOKEN),staffUserIds:ids(env.TELEGRAM_STAFF_USER_IDS),staffChatId:env.TELEGRAM_STAFF_CHAT_ID,privacyStatus:env.PRIVACY_PUBLICATION_STATUS||'pending',consentVersion:env.PRIVACY_CONSENT_VERSION||legal.consentVersion};
 const bot=createTelegramBot({store,config});
 return {bot,store,infoOnly:legal.publicationStatus!=='published'||config.privacyStatus!=='published'||config.consentVersion!==legal.consentVersion||!config.privacyUrl||!config.deliveryReady||config.staffUserIds.length===0||!config.staffChatId,drain:()=>{if(!env.TELEGRAM_BOT_TOKEN)throw new Error('BOT_TOKEN_MISSING');return drainTelegramOutbox({store,token:env.TELEGRAM_BOT_TOKEN,fetchImpl,timeoutMs:Number(env.TELEGRAM_SEND_TIMEOUT_MS)||8000});}};
}
export {createMemoryBotStore};
