import {mkdir,cp,writeFile,readFile} from 'node:fs/promises';
import {render} from './src/render.js';
import {locales,trainers} from './src/data.js';
await mkdir('dist',{recursive:true});await cp('public','dist',{recursive:true});
const pages={};
for(const l of locales){pages[l]={};for(const p of ['','impressum','datenschutz']){const html=render(l,p);await mkdir(`dist/${l}/${p}`,{recursive:true});await writeFile(`dist/${l}/${p?p+'/':''}index.html`,html);pages[l][p||'home']=html;}}
await writeFile('dist/index.html','<!doctype html><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=de/"><title>AK Löwen × VALSET</title><a href="de/">AK Löwen × VALSET</a>');
await writeFile('dist/robots.txt','User-agent: *\nDisallow: /\n');
// Downloadable review file: all four locales, scripts, styles and images embedded.
let standalone=render('de');
const css=(await readFile('public/vendor/scrollcraft.css','utf8'))+'\n'+await readFile('public/style.css','utf8');
const js=(await readFile('public/vendor/scrollcraft.js','utf8'))+'\n'+await readFile('public/client.js','utf8');
const assets={};for(const name of new Set(['ak-logo.png','valset.jpg','glove.webp',...trainers.map(tr=>tr.image)])){const type=name.endsWith('.jpg')?'jpeg':name.split('.').at(-1);assets['/assets/'+name]=`data:image/${type};base64,${(await readFile('public/assets/'+name)).toString('base64')}`;}
function inline(html){for(const [src,data] of Object.entries(assets))html=html.replaceAll(src,data);return html;}
standalone=inline(standalone).replace(/<link rel="stylesheet"[^>]+>/g,'').replace(/<script src="[^"]+" defer><\/script>/g,'').replace('</head>',()=>`<style>${css}</style></head>`);
standalone=standalone.replace('</body>',()=>`<script>window.__AK_PAGES__=${JSON.stringify(pages).replaceAll('<','\\u003c')};window.__AK_ASSETS__=${JSON.stringify(assets)};</script><script>${js.replaceAll('</script','<\\/script')}</script></body>`);
await writeFile('dist/ak-loewen-valset-v1.html',standalone);
console.log('Built 4 localized pages, 8 legal placeholders and a standalone review file.');
