const assert=require('node:assert/strict');
const {calculate}=require('../frozen-energy.js');
const fixture=()=>({containerFeet:20,temperature:-18,days:30,power:2.7,allocation:1,finishedKg:850,electricityFactor:null,method:'glec',glecKg:150});
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} != ${b}`);
let count=0;function test(name,fn){fn();count++;console.log('PASS '+name)}
test('A: 20-foot, 2.7 kW/TEU, 30 days = 1944 kWh',()=>{close(calculate(fixture()).totalKWh,1944)});
test('B: provisional 40-foot scaling = 3888 kWh',()=>{close(calculate({...fixture(),containerFeet:40}).totalKWh,3888)});
test('C: 5.2 kW/TEU, 30 days = 3744 kWh',()=>{close(calculate({...fixture(),power:5.2}).totalKWh,3744)});
test('D: GLEC total independent of informational power and factor',()=>{const a=calculate(fixture()),b=calculate({...fixture(),power:5.2,electricityFactor:.8});close(a.transportKg,b.transportKg);assert.notEqual(a.totalKWh,b.totalKWh);close(b.co2e,3744*.8);close(b.transportKg,150)});
test('E: unknown factor is unavailable, not zero',()=>{assert.equal(calculate(fixture()).co2e,null);assert.equal(calculate({...fixture(),electricityFactor:undefined}).co2e,null);close(calculate({...fixture(),electricityFactor:0}).co2e,0)});
test('allocation, daily power, finished output and sensitivity reconcile',()=>{const x=calculate({...fixture(),allocation:.25});close(x.allocatedKWh,486);close(x.averageKW,2.7);close(x.dailyKWh,64.8);close(x.perKg,486/850);close(x.low.powerPerTEU,1.08);close(x.high.powerPerTEU,4.32);close(x.low.totalKWh,777.6);close(x.high.totalKWh,3110.4)});
test('temperature alone never changes electrical demand',()=>{close(calculate({...fixture(),temperature:-25}).totalKWh,calculate({...fixture(),temperature:4}).totalKWh)});
test('zero days or allocation stays finite',()=>{close(calculate({...fixture(),days:0}).totalKWh,0);close(calculate({...fixture(),allocation:0}).allocatedKWh,0)});
const component=()=>({propulsionFactor:.05,distanceKm:10000,propulsionBoundary:'WTW',electricityBoundary:'WTW',refrigerationExcluded:true,boundariesConfirmed:true,propulsionSource:'Carrier report, table 1',electricitySource:'Generator fuel lifecycle report, table 2'});
test('component total adds propulsion and refrigeration once, excluding GLEC',()=>{const x=calculate({...fixture(),method:'components',electricityFactor:.7,component:component()});close(x.propulsionKg,500);close(x.transportKg,500+1944*.7)});
test('component method rejects absent, incompatible or unconfirmed evidence',()=>{for(const patch of [{refrigerationExcluded:false},{boundariesConfirmed:false},{propulsionBoundary:'TTW'},{electricityBoundary:'TTW'},{propulsionSource:''},{electricitySource:' ' }])assert.throws(()=>calculate({...fixture(),method:'components',electricityFactor:.7,component:{...component(),...patch}}));assert.throws(()=>calculate({...fixture(),method:'components',component:component()}))});
test('invalid allocations, equipment, factors and overflow rejected',()=>{for(const patch of [{containerFeet:45},{allocation:1.01},{allocation:-.1},{power:-1},{power:Infinity},{days:NaN},{finishedKg:0},{electricityFactor:-1},{power:1e308},{method:'both'}])assert.throws(()=>calculate({...fixture(),...patch}))});
console.log(`${count} frozen-energy checks passed.`);
