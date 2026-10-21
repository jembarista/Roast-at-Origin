const assert = require('node:assert/strict');
const { categories, compareValue, freshnessClocks } = require('../value-model.js');
const close = (a,b) => assert.ok(Math.abs(a-b)<1e-8, `${a} != ${b}`);
function fixture(){
 const input={green:1000,loss:.15,hourlyWage:8,traditional:{},origin:{}};
 const values={grower:[5,5],originServices:[1,1],wages:[.8,.8],localServices:[.6,.6],surplus:[1,1],supplies:[.6,.6],freight:[.5,3],destination:[1,1]};
 const shares={grower:[100,100],originServices:[100,100],wages:[0,100],localServices:[0,100],surplus:[0,60],supplies:[0,0],freight:[0,0],destination:[0,0]};
 for(const c of categories)['traditional','origin'].forEach((p,i)=>input[p][c.id]={rate:values[c.id][i],retention:shares[c.id][i]});
 return input;
}
let count=0;function test(name,fn){fn();count++;console.log('PASS '+name)}
test('buyer ledger reconciles costs and equal output',()=>{const x=compareValue(fixture());close(x.roasted,850);close(x.traditional.total,9825);close(x.origin.total,11950);close(x.traditional.retained,6000);close(x.origin.retained,7700);close(x.extraSpend,2125);close(x.extraRetained,1700);close(x.retainedPerExtraDollar,.8);for(const p of ['traditional','origin']){close(x[p].rows.reduce((a,r)=>a+r.total,0),x[p].total);close(x[p].perKg*x.roasted,x[p].total)}});
test('more origin retention does not invent farmer income',()=>{const x=compareValue(fixture());close(x.extraGrower,0);close(x.extraWages,680);close(x.additionalWageHours,85)});
test('profit retention accounts for ownership leakage',()=>{const f=fixture();f.origin.surplus.retention=0;close(compareValue(f).extraRetained,1190);f.origin.surplus.retention=100;close(compareValue(f).extraRetained,2040)});
test('doubling shipment doubles money and work, not shares',()=>{const f=fixture(),a=compareValue(f);f.green*=2;const b=compareValue(f);close(b.extraRetained,a.extraRetained*2);close(b.additionalWageHours,a.additionalWageHours*2);close(b.origin.share,a.origin.share)});
test('no positive extra spend produces no benefit-per-extra-dollar ratio',()=>{const f=fixture();f.origin.freight.rate=.5;assert.equal(compareValue(f).retainedPerExtraDollar,null)});
test('unknown wage stays unknown and zero wage is rejected',()=>{const f=fixture();f.hourlyWage=null;assert.equal(compareValue(f).additionalWageHours,null);f.hourlyWage=0;assert.throws(()=>compareValue(f))});
test('unknown, negative, infinite and impossible retention are rejected',()=>{for(const value of [undefined,null,NaN,Infinity,-1]){const f=fixture();f.origin.grower.rate=value;assert.throws(()=>compareValue(f))}const f=fixture();f.origin.surplus.retention=101;assert.throws(()=>compareValue(f));f.origin.surplus.retention=50;f.loss=1;assert.throws(()=>compareValue(f))});
test('zero spending gives no false percentage and finite zero totals',()=>{const f=fixture();for(const p of ['traditional','origin'])for(const c of categories)f[p][c.id].rate=0;const x=compareValue(f);close(x.extraRetained,0);assert.equal(x.origin.share,null)});
test('negative retention benefit remains visible',()=>{const f=fixture();for(const c of categories)f.origin[c.id].retention=0;assert.ok(compareValue(f).extraRetained<0)});
test('freshness tracks both clocks without a quality verdict',()=>{assert.deepEqual(freshnessClocks(150,7),{greenDays:150,roastedDays:7,total:157});assert.deepEqual(freshnessClocks(30,20),{greenDays:30,roastedDays:20,total:50});for(const v of [null,undefined,-1,NaN,Infinity])assert.throws(()=>freshnessClocks(v,5))});
console.log(`${count} value/freshness model checks passed.`);
