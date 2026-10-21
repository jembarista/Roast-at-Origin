/* A separate research panel; never writes refrigeration emissions into the existing freight model. */
(() => {
  const get = id => document.getElementById(id), calculate = window.frozenEnergy.calculate;
  const number = value => value.toLocaleString('en-GB',{maximumFractionDigits:3});
  let provenance = 'Fitzgerald reference modelling assumption', result = null;
  const ids = ['feSize','feTemperature','feDays','fePower','feAllocation','feFactor','feFactorSource','feMethod','fePropulsion','feDistance','fePropulsionBoundary','feElectricityBoundary','fePropulsionSource','feExcluded','feCompatible'];
  function read(id,optional=false){
    const input=get(id),blank=input.value.trim()==='',value=Number(input.value);
    const min=id==='feTemperature'?-Infinity:Number(input.min||0),max=input.max!==''?Number(input.max):Infinity;
    const invalid=(!optional&&blank)||(!blank&&(!Number.isFinite(value)||value<min||value>max));
    input.setAttribute('aria-invalid',String(invalid));
    if(invalid)throw new Error('Check '+document.querySelector(`label[for="${id}"]`).textContent+'.');
    return blank?null:value;
  }
  function componentReady(){
    const validNumber=id=>get(id).value.trim()!==''&&Number.isFinite(Number(get(id).value))&&Number(get(id).value)>=0;
    return ['feFactor','fePropulsion','feDistance'].every(validNumber)&&get('feExcluded').checked&&get('feCompatible').checked&&get('feFactorSource').value.trim()!==''&&get('fePropulsionSource').value.trim()!==''&&get('fePropulsionBoundary').value==='WTW'&&get('feElectricityBoundary').value==='WTW';
  }
  function clear(message){
    result=null;
    for(const id of ['feTotal','feAllocated','fePerKg','feAverage','feDaily'])get(id).textContent='—';
    get('feEmissions').textContent='Unavailable';get('feTransport').textContent='Research result unavailable; the main freight calculation is unchanged.';
    get('feScenarios').replaceChildren();get('feStatus').textContent=message;get('feCsv').disabled=true;
  }
  function refresh(){
    const ready=componentReady();get('feMethod').options[1].disabled=!ready;
    get('feGate').textContent=ready?'Method B unlocked by researcher-supplied evidence and confirmation. The app does not independently audit these sources.':'Method B locked: supply both source records, numeric factors/distance, matching WTW boundaries and both confirmations.';
    get('feProvenance').textContent=provenance+'. Neither preset is a universally validated coffee coefficient. Temperature is context only.';
    try{
      const rawFactor=read('feFactor',true);
      const factorDocumented=rawFactor!==null&&get('feFactorSource').value.trim()!==''&&get('feElectricityBoundary').value==='WTW';
      const factor=factorDocumented?rawFactor:null;
      const share=read('feAllocation')/100,feet=Number(get('feSize').value);
      const green=read('mass'),loss=read('loss')/100;
      if(green<=0||loss<0||loss>=1)throw new Error('Check coffee quantity and roast loss.');
      const choice=get('journeyChoice').value;
      const current=window.last&&(choice==='roasted'?window.last.origin:choice==='green'?window.last.traditional:null);
      const refrigerated=current&&['reefer','frozen'].includes(current.mode);
      const glec=refrigerated?Number(get('reef').value)*Number(get('seaDist').value)*(feet===40?2:1)*share:null;
      const method=get('feMethod').value;
      const component=method==='components'&&ready?{
        propulsionFactor:read('fePropulsion'),distanceKm:read('feDistance'),propulsionBoundary:get('fePropulsionBoundary').value,electricityBoundary:get('feElectricityBoundary').value,
        refrigerationExcluded:get('feExcluded').checked,boundariesConfirmed:get('feCompatible').checked,propulsionSource:get('fePropulsionSource').value,electricitySource:get('feFactorSource').value
      }:undefined;
      const componentBlocked=method==='components'&&!ready;
      result=calculate({containerFeet:feet,temperature:read('feTemperature'),days:read('feDays'),power:read('fePower'),allocation:share,finishedKg:green*(1-loss),electricityFactor:factor,glecKg:componentBlocked?null:glec,method:componentBlocked?'glec':method,component});
      if(componentBlocked)result.method='components-blocked';
      get('feTotal').textContent=number(result.totalKWh)+' kWh';
      get('feAllocated').textContent=number(result.allocatedKWh)+' kWh';
      get('fePerKg').textContent=number(result.perKg)+' kWh/kg';
      get('feAverage').textContent=number(result.averageKW)+' kW';
      get('feDaily').textContent=number(result.dailyKWh)+' kWh/day';
      get('feEmissions').textContent=result.co2e===null?'Unavailable':number(result.co2e)+' kg CO₂e';
      const notes=['Standalone research estimate; no electricity emissions are added to the main freight total.'];
      if(factor===null)notes.push(rawFactor===null?'Onboard WTW factor unknown: energy is shown, CO₂e is unavailable.':'The entered factor is not applied until its source and WTW boundary are recorded.');
      if(feet===40)notes.push('40-foot demand uses provisional two-TEU scaling.');
      if(componentBlocked)notes.push('Method B is unavailable: required factors or boundary evidence are missing. Electricity remains informational.');
      else if(method==='components')notes.push('Component result uses researcher-attested compatible boundaries; it is not independently validated.');
      get('feStatus').textContent=notes.join(' ');
      if(componentBlocked)get('feTransport').textContent='Method B total unavailable: supply the required sources, matching boundaries and exclusion evidence. Energy remains shown separately; no replacement method has been applied.';
      else if(method==='components')get('feTransport').textContent=`Method B research total: ${number(result.transportKg)} kg CO₂e = ${number(result.propulsionKg)} propulsion + ${number(result.co2e)} refrigeration. Uses this panel’s distance and container allocation; main comparison unchanged.`;
      else if(glec!==null)get('feTransport').textContent=`Method A: ${number(glec)} kg CO₂e generic GLEC reefer transport for this panel’s ${number(result.teu*share)} allocated TEU and the main sea distance. Full refrigeration electricity/emissions are contextual only. Main journey allocation is ${number(current.allocated)} TEU; its generic reefer baseline is ${number(current.transport-current.frozenExtra)} kg CO₂e${current.frozenExtra?`, plus ${number(current.frozenExtra)} kg from the separate legacy incremental allowance`:''}. Align allocations before comparing; neither baseline is temperature-calibrated.`;
      else get('feTransport').textContent='Method A: select a refrigerated/frozen journey to show its GLEC baseline. Electricity is still shown for the entered hypothetical container; nothing is added to the current air/dry-sea result.';
      get('feScenarios').innerHTML=[['Low (−60%)',result.low],['Reference',result.reference],['High (+60%)',result.high]].map(([label,v])=>`<tr><th scope="row">${label}</th><td>${number(v.powerPerTEU)}</td><td>${number(v.totalKWh)}</td><td>${number(v.allocatedKWh)}</td></tr>`).join('');
      get('feCsv').disabled=false;
    }catch(error){clear(error.message);}
  }
  function exportRows(){
    const rows=[['Frozen energy result status',result?'Available as standalone research estimate':'Unavailable: invalid/missing inputs','Does not modify main freight total'],['Frozen energy provenance',provenance,'Published modelling assumptions, not universal measurements'],['Electricity sensitivity','40% / 100% / 160% of entered power','Sensitivity scenarios, not confidence intervals'],['Container scaling','40-foot uses 2 TEU provisionally','Allocation independent of main freight model']];
    for(const id of ids){const input=get(id);rows.push(['Energy input: '+id,input.type==='checkbox'?input.checked:input.value,'']);}
    if(result){
      for(const key of ['method','teu','averageKW','dailyKWh','totalKWh','allocatedKWh','perKg','co2e','propulsionKg','transportKg'])rows.push(['Energy result: '+key,result[key]??'Unavailable',key==='transportKg'?'Selected research method, not added to main comparison':'']);
      for(const key of ['low','reference','high'])rows.push(['Energy scenario: '+key+' (allocated kWh)',result[key].allocatedKWh,'']);
    }
    return rows.map(row=>row.map(value=>typeof value==='string'&&/^\s*[=+@-]/.test(value)?"'"+value:value));
  }
  window.frozenExportRows=exportRows;
  get('feCsv').addEventListener('click',()=>{
    refresh();if(!result)return;
    const csv=[['Metric','Value','Notes'],...exportRows()].map(row=>row.map(value=>'"'+String(value).replaceAll('"','""')+'"').join(',')).join('\n');
    const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'})),link=document.createElement('a');link.href=url;link.download='frozen-container-energy.csv';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  });
  for(const id of ids){get(id).addEventListener('input',()=>{if(id==='fePower')provenance='User-entered average power';refresh();});get(id).addEventListener('change',refresh);}
  for(const [id,key]of[['feFitzgerald','fitzgerald'],['feCheaitou','cheaitou']])get(id).addEventListener('click',()=>{
    const preset=window.frozenEnergy.presets[key];get('fePower').value=preset.power;
    if(preset.temperature!==null)get('feTemperature').value=preset.temperature;
    provenance=key==='fitzgerald'?'Fitzgerald reference modelling assumption':'Cheaitou & Cariou frozen engineering-model input';refresh();
  });
  for(const id of ['mass','loss','tradMode','originMode','seaDist','reef','freezeDays','freezeExtra','freezeGrid'])get(id).addEventListener('input',refresh);
  get('journeyChoice').addEventListener('change',refresh);
  for(const button of document.querySelectorAll('.tab, #reset'))button.addEventListener('click',refresh);
  refresh();
})();
