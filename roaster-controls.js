/* Visual travel only: selection, calculation and click handlers run normally. */
(() => {
  const active = new Map();
  const timers = new Map();
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const control = event => {
    const button = event.target.closest('.button-choices button[data-value]');
    return button && !button.disabled ? button : null;
  };
  function clear(button) {
    clearTimeout(timers.get(button));timers.delete(button);
    active.delete(button);button.classList.remove('bh-pressing','bh-latching');
  }
  function down(button) {
    if (!button || motion.matches || active.has(button)) return;
    clear(button);active.set(button,performance.now());button.classList.add('bh-pressing');
  }
  function up(button, cancelled = false) {
    if (!active.has(button)) return;
    const start = active.get(button);active.delete(button);
    if (cancelled || motion.matches) { clear(button);return; }
    // A short minimum travel makes a quick tap visible without delaying activation.
    timers.set(button,setTimeout(() => {
      button.classList.remove('bh-pressing');button.classList.add('bh-latching');
      timers.set(button,setTimeout(() => {button.classList.remove('bh-latching');timers.delete(button);},180));
    },Math.max(0,110-(performance.now()-start))));
  }
  document.addEventListener('pointerdown',event => {if(event.button===0)down(control(event));});
  document.addEventListener('pointerup',() => {for(const button of active.keys())up(button);});
  document.addEventListener('pointercancel',() => {for(const button of active.keys())up(button,true);});
  document.addEventListener('keydown',event => {if(!event.repeat && [' ','Enter'].includes(event.key))down(control(event));});
  document.addEventListener('keyup',event => {if([' ','Enter'].includes(event.key))up(control(event));});
  document.addEventListener('focusout',event => {const button=control(event);if(button)up(button,true);});
  window.addEventListener('blur',() => {for(const button of new Set([...active.keys(),...timers.keys()]))clear(button);});
})();
