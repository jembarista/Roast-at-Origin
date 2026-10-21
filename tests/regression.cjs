// Exercises the app's actual inline script with a minimal DOM, using Node's built-in modules.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const nodes=new Map();
for(const m of html.matchAll(/<(input|select|[a-z0-9]+)\b([^>]*\bid="([^"]+)"[^>]*)>/g)){
 const attrs=m[2],get=k=>(attrs.match(new RegExp('\\b'+k+'="([^"]*)"'))||[])[1]||'';
 const node={id:m[3],type:get('type'),value:get('value'),min:get('min'),max:get('max'),checked:/\bchecked\b/.test(attrs),disabled:false,textContent:'',style:{},classList:{toggle(){}},addEventListener(){},appendChild(){},setAttribute(){},click(){}};
 let storedValue=String(node.value);Object.defineProperty(node,'value',{get(){return storedValue},set(v){storedValue=String(v)}});
 let inner='';Object.defineProperty(node,'innerHTML',{get(){return inner},set(v){inner=v;if(m[1]==='select'){node.options=[...v.matchAll(/<option value="([^"]+)"/g)].map(x=>x[1]);node.value=node.options[0]||'';}}});
 Object.defineProperty(node,'selectedIndex',{set(i){node.value=node.options[i]}});
 if(m[1]==='select')node.innerHTML=html.slice(m.index+m[0].length).split('</select>')[0];
 nodes.set(node.id,node);
}
const inputs=[...nodes.values()].filter(x=>x.type==='number'||x.type==='checkbox'||x.options);
const context={document:{getElementById:id=>nodes.get(id),querySelectorAll:s=>s==='input[type="number"]'?inputs.filter(x=>x.type==='number'):s==='input,select'?inputs:[],querySelector:s=>({textContent:s}),createElement:()=>({style:{},click(){}})},window:{},Blob,URL,setTimeout};
vm.createContext(context);vm.runInContext(html.match(/<script>([\s\S]*?)<\/script>/)[1],context);
const run=s=>vm.runInContext(s,context),set=(id,value)=>{nodes.get(id).value=String(value)},close=(x,y)=>assert.ok(Math.abs(x-y)<1e-7,`${x} != ${y}`);
let checks=0;function test(name,fn){fn();checks++;console.log('PASS '+name)}
test('default equal roasted output and sea-versus-air scenario',()=>{const a=context.window.last;close(a.traditional.roast,850);close(a.origin.roast,850);assert.equal(a.traditional.mode,'sea');assert.equal(a.origin.mode,'air');const air=run("pathway('origin',{mode:'air'})");close(air.allocated,air.shipMass);assert.equal(nodes.get('volumetricAir').checked,false)});
test('destination packaging does not change green freight',()=>{const before=run("pathway('trad')");set('tradPack','retail03');const after=run("pathway('trad')");close(before.shipMass,after.shipMass);close(before.volume,after.volume);assert.ok(after.packaging>before.packaging)});
test('origin package changes freight volume',()=>{const before=run("pathway('origin')");set('originPack','retail03');assert.ok(run("pathway('origin').volume")>before.volume)});
test('mass scaling and break-even identity',()=>{run("preset('same')");const before=run("pathway('origin')");set('mass',2000);const after=run("pathway('origin')");close(after.total,2*before.total);const a=run("pathway('trad')");set('originRoast',(a.total-(after.total-after.roasting))/2000);close(run("pathway('origin').total"),a.total)});
test('invalid input clears results and prevents stale CSV',()=>{set('teuVolume',0);run('update()');assert.equal(context.window.last,null);assert.equal(nodes.get('csv').disabled,true);assert.equal(nodes.get('tradTotal').textContent,'—');set('teuVolume',28);set('mass','');run('update()');assert.equal(context.window.last,null)});
test('negative, excessive loss and infinite inputs are rejected',()=>{set('mass',1000);for(const [id,value,reset] of [['loss',101,15],['airFactor',-1,.6],['mass','1e309',1000]]){set(id,value);run('update()');assert.equal(context.window.last,null);set(id,reset)}});
test('zero baseline comparison stays finite',()=>{for(const id of ['dry','reef','roadFactor','packFactor','tradRoast'])set(id,0);set('originRoast',.42);run('update()');assert.ok(!/Infinity|NaN/.test(nodes.get('comparison').textContent));assert.match(nodes.get('comparison').textContent,/traditional total is zero/)});
test('frozen baseline warning persists',()=>{run("preset('reefer')");assert.match(nodes.get('status').textContent,/frozen-specific electricity is unknown/)});
test('CSV captures inputs, units and method caveats',()=>{run("el('csv').onclick()");const source=html.slice(html.indexOf("el('csv').onclick="));for(const label of ['international mode','freight allocation unit','factor scope','air allocation caveat','input: ','frozen caveat'])assert.ok(source.includes(label))});
test('map paths keep endpoints and wrap across the Pacific',()=>{
 const {routeArc}=require('../route-map.js');
 const locations=run('Object.values(locations)');
 for(const from of locations)for(const to of locations){
  const points=routeArc(from,to);
  close(points[0][0],from[0]);close(points[0][1],from[1]);
  close(points.at(-1)[0],to[0]);
  const endLongitude=points.at(-1)[1];close((endLongitude-to[1])/360,Math.round((endLongitude-to[1])/360));
  points.forEach((p,i)=>{assert.ok(p.every(Number.isFinite));if(i)assert.ok(Math.abs(p[1]-points[i-1][1])<=180)});
 }
 const pacific=routeArc([-6.21,106.85],[34.05,-118.24]);
 assert.ok(Math.abs(pacific.at(-1)[1]-pacific[0][1])<180);
});
console.log(`${checks} regression checks passed.`);
module.exports = { nodes, context, run, set };
