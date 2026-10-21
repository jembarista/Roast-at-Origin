const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {nodes,context,run,set}=require('./regression.cjs');
function element(){return {style:{},children:[],listeners:{},appendChild(x){(this.children??=[]).push(x)},replaceChildren(){this.children=[]},addEventListener(type,fn){(this.listeners[type]??=[]).push(fn)}}}
for(const node of nodes.values()){node.listeners={};node.addEventListener=element().addEventListener;node.replaceChildren=element().replaceChildren;node.appendChild=element().appendChild;}
for(const role of ['from','to']){
 const select=nodes.get(role);select.options=select.options.map(value=>({value,textContent:value}));
 Object.defineProperty(select,'selectedOptions',{get(){return this.options.filter(x=>x.value===this.value)}});
 select.appendChild=function(option){this.options.push(option)};
 select.dispatchEvent=function(event){if(event.type==='input')run('routes();update()');for(const fn of this.listeners[event.type]||[])fn(event)};
}
context.document.createElement=element;context.URL=URL;context.URLSearchParams=URLSearchParams;context.AbortController=AbortController;context.Event=Event;context.clearTimeout=clearTimeout;
run("el('reset').onclick()");
let calls=0,lastUrl='';
context.fetch=async url=>{calls++;lastUrl=String(url);return {ok:true,json:async()=>({results:[{id:1,name:'Sydney',admin1:'New South Wales',country:'Australia',latitude:-33.87,longitude:151.21},{id:2,name:'Sydney',admin1:'Nova Scotia',country:'Canada',latitude:46.14,longitude:-60.19},{name:'Invalid',latitude:100,longitude:5}]})}};
run(fs.readFileSync(path.join(__dirname,'../city-search.js'),'utf8'));
const fire=(id,type,event={})=>Promise.all((nodes.get(id).listeners[type]||[]).map(fn=>fn(event)));
(async()=>{
 const oldRoute=nodes.get('to').value,oldDistance=nodes.get('airDist').value;
 set('cityto','Sydney');await fire('cityto','input');await fire('citytoSearch','click');
 assert.equal(nodes.get('to').value,oldRoute,'Search alone must not change the route');
 assert.equal(nodes.get('citytoMatches').children.length,2,'Invalid geographic coordinates must be excluded');
 assert.equal(new URL(lastUrl).searchParams.get('name'),'Sydney');
 const match=nodes.get('citytoMatches').children[0];await Promise.all(match.listeners.click.map(fn=>fn()));
 assert.match(nodes.get('to').value,/Sydney.*Australia/);assert.notEqual(nodes.get('airDist').value,oldDistance);
 assert.deepEqual(Array.from(run("locations[el('to').value]")),[-33.87,151.21]);
 assert.ok(context.window.cityExportRows().some(r=>r[0]==='to coordinate provenance'&&r[1]==='Open-Meteo / GeoNames'));
 const selected=nodes.get('to').value;
 set('cityto','Sydney');await fire('citytoSearch','click');assert.equal(calls,1,'Repeat queries should use in-memory cache');
 context.fetch=async()=>{throw new Error('Offline')};set('cityto','Unknown place');await fire('citytoSearch','click');
 assert.equal(nodes.get('to').value,selected);assert.match(nodes.get('citytoStatus').textContent,/could not connect/);
 let resolve;context.fetch=()=>new Promise(r=>{resolve=r});set('cityto','Old query');const pending=fire('citytoSearch','click');
 set('cityto','New query');await fire('cityto','input');resolve({ok:true,json:async()=>({results:[{name:'Old',latitude:1,longitude:2}]})});await pending;
 assert.equal(nodes.get('citytoMatches').children.length,0,'Late results must not replace a newer query');
 assert.equal(nodes.get('to').value,selected);
 console.log('PASS city search: confirmed matches, coordinates, distance refresh, cache, invalid data, offline handling, stale results and export');
})().catch(error=>{console.error(error);process.exitCode=1});
