/* Resolve typed cities explicitly; only a confirmed match changes the route. */
(() => {
  const get=id=>document.getElementById(id), metadata=new Map(),cache=new Map();
  const valid=place=>typeof place.name==='string'&&place.name.trim()&&typeof place.latitude==='number'&&Number.isFinite(place.latitude)&&Math.abs(place.latitude)<=90&&typeof place.longitude==='number'&&Number.isFinite(place.longitude)&&Math.abs(place.longitude)<=180;
  for(const role of ['from','to']){
    const select=get(role),query=get('city'+role),button=get('city'+role+'Search'),status=get('city'+role+'Status'),matches=get('city'+role+'Matches');
    let generation=0,controller=null;
    function describe(){query.value=select.selectedOptions[0].textContent;status.textContent='Using: '+select.selectedOptions[0].textContent;}
    function choose(place){
      let label=[place.name,place.admin1,place.country||place.country_code].filter((x,i,array)=>x&&array.indexOf(x)===i).join(', ');
      const coords=[place.latitude,place.longitude];
      if(Object.prototype.hasOwnProperty.call(locations,label)&&locations[label].some((v,i)=>v!==coords[i]))label+=` (${coords.map(v=>v.toFixed(4)).join(', ')})`;
      Object.defineProperty(locations,label,{value:coords,writable:true,enumerable:true,configurable:true});
      if(!Array.from(select.options).some(option=>option.value===label)){
        const option=document.createElement('option');option.value=label;option.textContent=label;select.appendChild(option);
      }
      metadata.set(label,{provider:'Open-Meteo / GeoNames',id:place.id??'Unavailable',checked:new Date().toISOString()});
      select.value=label;
      select.dispatchEvent(new Event('input',{bubbles:true}));select.dispatchEvent(new Event('change',{bubbles:true}));
      describe();matches.replaceChildren();
    }
    async function search(){
      const name=query.value.trim();
      if(name.length<2){status.textContent='Type at least two characters. Add a country to narrow the search.';return;}
      const version=++generation;controller?.abort();controller=new AbortController();const requestController=controller;button.disabled=true;matches.replaceChildren();status.textContent='Finding cities…';
      const timer=setTimeout(()=>requestController.abort(),12000);
      try{
        let results=cache.get(name.toLocaleLowerCase());
        if(!results){
          const url=new URL('https://geocoding-api.open-meteo.com/v1/search');url.search=new URLSearchParams({name,count:'6',language:'en',format:'json'}).toString();
          const response=await fetch(url,{signal:requestController.signal,credentials:'omit'});
          if(!response.ok)throw new Error('Search unavailable');
          const data=await response.json();if(data.error)throw new Error('Search unavailable');
          results=(Array.isArray(data.results)?data.results:[]).filter(valid);cache.set(name.toLocaleLowerCase(),results);
        }
        if(version!==generation)return;
        if(!results.length){status.textContent='No match found. Try the city name plus its country, or use a preset. Your current route has not changed.';return;}
        status.textContent='Choose the right city. Your current route stays in place until you select a match.';
        for(const place of results){
          const match=document.createElement('button');match.type='button';
          match.textContent=[place.name,place.admin1,place.country||place.country_code].filter(Boolean).join(', ');
          match.addEventListener('click',()=>choose(place));matches.appendChild(match);
        }
      }catch(error){if(version===generation)status.textContent='City search could not connect. Try again or use a preset. Your current route has not changed.';}
      finally{clearTimeout(timer);if(version===generation)button.disabled=false;}
    }
    query.addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();search();}});
    query.addEventListener('input',()=>{generation++;controller?.abort();button.disabled=false;matches.replaceChildren();status.textContent='Press Find city, then choose a match to update your route.';});
    button.addEventListener('click',search);
    select.addEventListener('input',()=>{generation++;controller?.abort();button.disabled=false;matches.replaceChildren();describe();});
    describe();
  }
  window.cityExportRows=()=>['from','to'].flatMap(role=>{
    const key=get(role).value,coords=locations[key],meta=metadata.get(key);
    return [[role+' city coordinates (latitude, longitude)',coords.join(', '),'WGS84 city point, not verified freight endpoint'],[role+' coordinate provenance',meta?.provider||'Supplied illustrative city preset',meta?.checked||'Original handover'],[role+' geocoding identifier',meta?.id??'Not supplied','']];
  });
})();
