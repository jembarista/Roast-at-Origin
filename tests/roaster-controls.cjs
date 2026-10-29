const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const handlers={},windowHandlers={},queued=new Map(),classes=new Set();let clock=0,next=0;
const motion={matches:false};const button={disabled:false,classList:{add(...v){v.forEach(x=>classes.add(x))},remove(...v){v.forEach(x=>classes.delete(x))}}};
const target={closest:()=>button};
vm.runInNewContext(fs.readFileSync(require('node:path').join(__dirname,'../roaster-controls.js'),'utf8'),{
 document:{addEventListener:(name,fn)=>handlers[name]=fn},window:{matchMedia:()=>motion,addEventListener:(name,fn)=>windowHandlers[name]=fn},performance:{now:()=>clock},setTimeout:(fn,ms)=>{queued.set(++next,{fn,ms});return next},clearTimeout:id=>queued.delete(id),Map,Set
});
function flush(){const batch=[...queued];queued.clear();batch.forEach(([,job])=>job.fn());}
handlers.pointerdown({target,button:0});assert(classes.has('bh-pressing'));
clock=20;handlers.pointerup({target});assert(classes.has('bh-pressing'));assert.equal([...queued.values()][0].ms,90);
flush();assert(classes.has('bh-latching'));assert(!classes.has('bh-pressing'));flush();assert.equal(classes.size,0);
handlers.pointerdown({target,button:0});handlers.pointercancel({target});assert.equal(classes.size,0);assert.equal(queued.size,0);
button.disabled=true;handlers.pointerdown({target,button:0});assert.equal(classes.size,0);button.disabled=false;
motion.matches=true;handlers.pointerdown({target,button:0});assert.equal(classes.size,0);motion.matches=false;
handlers.keydown({target,key:' ',repeat:false});assert(classes.has('bh-pressing'));handlers.keyup({target,key:' '});flush();assert(classes.has('bh-latching'));windowHandlers.blur();assert.equal(classes.size,0);assert.equal(queued.size,0);
console.log('PASS pointer travel, quick-tap visibility, cancellation, disabled, reduced motion, keyboard and blur cleanup');
