const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {nodes,context,run,set}=require('./regression.cjs');
function attach(node){node.listeners={};node.addEventListener=function(type,fn){(this.listeners[type]??=[]).push(fn)};node.replaceChildren=function(){this.children=[]};node.appendChild=function(x){(this.children??=[]).push(x)};return node}
for(const node of nodes.values())attach(node);
const dynamic=attach({});
Object.defineProperty(dynamic,'innerHTML',{set(html){
 for(const m of html.matchAll(/<input\b([^>]+)>/g)){
  const attrs=m[1],get=k=>(attrs.match(new RegExp('\\b'+k+'="([^"]*)"'))||[])[1]||'';
  const node=attach({id:get('id'),type:get('type'),min:get('min'),max:get('max'),setAttribute(){}});
  let value='';Object.defineProperty(node,'value',{get(){return value},set(v){value=String(v)}});nodes.set(node.id,node);
 }
}});
nodes.set('econInputs',dynamic);
const oldQuery=context.document.querySelectorAll;
context.document.querySelectorAll=selector=>selector.startsWith('#valuePanel')?[...nodes.values()].filter(n=>n.id?.startsWith('econ')&&(n.type==='number'||n.options||n.id==='econEvidence')):oldQuery(selector);
const click=id=>{for(const fn of nodes.get(id).listeners.click||[])fn()};
const input=(id,value)=>{set(id,value);for(const fn of nodes.get(id).listeners.input||[])fn()};
set('mass',1000);set('loss',15);set('econHourly','');
run(fs.readFileSync(path.join(__dirname,'../value-model.js'),'utf8'));
run(fs.readFileSync(path.join(__dirname,'../value-ui.js'),'utf8'));
assert.match(nodes.get('econAfter').textContent,/—/);
run('update()');assert.ok(context.window.last,'Unknown optional inputs must not block carbon results');
click('econExample');
assert.match(nodes.get('econDifference').textContent,/USD 1,700.00 more/);
assert.match(nodes.get('econGrowers').textContent,/USD 0.00/);
assert.match(nodes.get('econHours').textContent,/85 hours/);
set('journeyChoice','green');for(const fn of nodes.get('journeyChoice').listeners.change||[])fn();
assert.match(nodes.get('econSelectedRetained').textContent,/USD 7.06/);
assert.match(nodes.get('econSelectedStory').textContent,/USD 6,000.00/);
set('journeyChoice','roasted');for(const fn of nodes.get('journeyChoice').listeners.change||[])fn();
assert.match(nodes.get('econSelectedRetained').textContent,/USD 9.06/);
assert.match(nodes.get('econSelectedStory').textContent,/USD 7,700.00/);

input('econ_origin_surplus_retention',0);
assert.match(nodes.get('econDifference').textContent,/USD 1,190.00 more/);
assert.match(nodes.get('econStatus').textContent,/ILLUSTRATIVE/);
input('econ_origin_surplus_retention','');
assert.equal(nodes.get('econAfter').textContent,'—');assert.equal(nodes.get('econCsv').disabled,true);
assert.match(nodes.get('econStatus').textContent,/Blank means unknown/);
click('econExample');input('econEvidence','=HYPERLINK("https://example.com")');
const rows=context.window.valueExportRows();
assert.ok(rows.some(r=>r[0]==='Financial evidence notes'&&r[1].startsWith("'=")));
assert.ok(rows.some(r=>r[0].includes('retainedPerExtraDollar')));
click('econClear');assert.equal(nodes.get('econBefore').textContent,'—');
console.log('PASS economic UI: empty state, example, edits, invalidation, export and clearing');
