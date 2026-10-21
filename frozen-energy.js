/* Full refrigeration electricity, never an incremental addition to a GLEC reefer total. */
(function(root){
  const presets = Object.freeze({
    fitzgerald: Object.freeze({power:2.7,temperature:null,kind:'published modelling assumption',doi:'10.1016/j.enpol.2010.12.015'}),
    cheaitou: Object.freeze({power:5.2,temperature:-18,kind:'frozen engineering-model input',doi:'10.1080/03088839.2012.728726'})
  });
  function numeric(value,name,min=0,max=Infinity){
    if(typeof value!=='number'||!Number.isFinite(value)||value<min||value>max)throw new Error(`Check ${name}.`);
    return value;
  }
  function calculate(input){
    if(![20,40].includes(input.containerFeet))throw new Error('Choose a 20-foot or 40-foot container.');
    const teu=input.containerFeet===40?2:1;
    const power=numeric(input.power,'average power'),days=numeric(input.days,'powered voyage days');
    const allocation=numeric(input.allocation,'shipment allocation',0,1);
    numeric(input.temperature,'temperature',-Infinity,Infinity);
    const finished=numeric(input.finishedKg,'finished roasted output',Number.MIN_VALUE);
    const factor=input.electricityFactor===null||input.electricityFactor===undefined?null:numeric(input.electricityFactor,'onboard electricity factor');
    const atPower = p => {
      const averageKW=p*teu,dailyKWh=averageKW*24,totalKWh=dailyKWh*days,allocatedKWh=totalKWh*allocation;
      return {powerPerTEU:p,averageKW,dailyKWh,totalKWh,allocatedKWh,perKg:allocatedKWh/finished,co2e:factor===null?null:allocatedKWh*factor};
    };
    // ±60% is a sensitivity assumption around entered power, not a confidence interval.
    const reference=atPower(power),low=atPower(power*.4),high=atPower(power*1.6);
    const generic=input.glecKg===null||input.glecKg===undefined?null:numeric(input.glecKg,'GLEC reefer baseline');
    const output={...reference,teu,allocation,electricityFactor:factor,low,reference,high,temperature:input.temperature,method:input.method||'glec',transportKg:null};
    if(output.method==='glec')output.transportKg=generic;
    else if(output.method==='components'){
      const evidence=input.component||{};
      if(factor===null)throw new Error('Component method needs an onboard-generation electricity factor.');
      if(evidence.propulsionBoundary!=='WTW'||evidence.electricityBoundary!=='WTW'||evidence.refrigerationExcluded!==true||evidence.boundariesConfirmed!==true||!String(evidence.propulsionSource||'').trim()||!String(evidence.electricitySource||'').trim())throw new Error('Component method needs documented propulsion/electricity sources, matching WTW boundaries and confirmation that propulsion excludes refrigeration.');
      const propulsionFactor=numeric(evidence.propulsionFactor,'propulsion-only intensity');
      const distance=numeric(evidence.distanceKm,'sea distance');
      output.propulsionKg=propulsionFactor*distance*teu*allocation;
      output.transportKg=output.propulsionKg+reference.co2e;
    }else throw new Error('Choose one accounting method.');
    for(const scenario of [reference,low,high])if(Object.values(scenario).some(v=>typeof v==='number'&&!Number.isFinite(v)))throw new Error('Inputs are too large to calculate.');
    if(output.transportKg!==null&&!Number.isFinite(output.transportKg))throw new Error('Transport total is too large to calculate.');
    return output;
  }
  const api={presets,calculate};
  if(typeof module!=='undefined')module.exports=api;else root.frozenEnergy=api;
})(typeof window!=='undefined'?window:globalThis);
