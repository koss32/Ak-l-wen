(() => {
 const supported=['de','ru','uk','tr'];
 let stored='';try{stored=localStorage.getItem('ak-locale')||'';}catch{}
 const browser=(navigator.languages||[navigator.language]).map(l=>String(l).toLowerCase().split('-')[0]).find(l=>supported.includes(l));
 const locale=supported.includes(stored)?stored:browser||'de';
 location.replace('/'+locale+'/'+location.hash);
})();
