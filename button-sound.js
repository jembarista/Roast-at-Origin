/* A short synthesized switch click; no audio files or external requests. */
(() => {
  let enabled = true, context = null;
  try { enabled = localStorage.getItem('coffeeExaminedSound') !== 'off'; } catch {}
  const toggle = document.createElement('button');
  toggle.type = 'button';toggle.id = 'buttonSoundToggle';toggle.className = 'sound-toggle';
  function label() {
    toggle.textContent = enabled ? 'Click sound: on' : 'Click sound: off';
    toggle.setAttribute('aria-pressed',String(enabled));
    toggle.setAttribute('aria-label',enabled ? 'Turn button click sound off' : 'Turn button click sound on');
  }
  toggle.addEventListener('click',() => {
    enabled = !enabled;
    try { localStorage.setItem('coffeeExaminedSound',enabled ? 'on' : 'off'); } catch {}
    label();
  });
  document.querySelector('.hero').insertAdjacentElement('afterend',toggle);
  label();
  async function clickSound() {
    if (!enabled) return;
    try {
      const Audio = window.AudioContext || window.webkitAudioContext;
      if (!Audio) return;
      context ||= new Audio();
      if (context.state === 'suspended') await context.resume();
      if (context.state !== 'running' || !enabled) return;
      const now = context.currentTime;
      // A textured downstroke, dry latch click, then a quieter return stroke.
      function texture(start, duration, level, fromHz, toHz, attack) {
        const frames = Math.ceil(context.sampleRate * duration);
        const buffer = context.createBuffer(1, frames, context.sampleRate);
        const samples = buffer.getChannelData(0);
        let smooth = 0;
        for (let i = 0; i < frames; i++) {
          smooth = .55 * smooth + .45 * (Math.random() * 2 - 1);
          samples[i] = smooth * (.65 + .35 * Math.random());
        }
        const source = context.createBufferSource();source.buffer = buffer;
        const filter = context.createBiquadFilter();filter.type = 'bandpass';filter.Q.value = .55;
        filter.frequency.setValueAtTime(fromHz, start);
        filter.frequency.exponentialRampToValueAtTime(toHz, start + duration);
        const gain = context.createGain();gain.gain.setValueAtTime(.0001, start);
        gain.gain.linearRampToValueAtTime(level, start + attack);
        gain.gain.exponentialRampToValueAtTime(.0001, start + duration);
        source.connect(filter);filter.connect(gain);gain.connect(context.destination);
        source.start(start);source.stop(start + duration);
        source.onended = () => { source.disconnect();filter.disconnect();gain.disconnect(); };
      }
      texture(now, .095, .16, 1600, 480, .018);
      texture(now + .068, .024, .24, 2900, 900, .001);
      texture(now + .125, .055, .07, 900, 1500, .009);
      // Very short damped housing resonance, with no sustained electronic tone.
      const body = context.createOscillator();body.type = 'sine';
      body.frequency.setValueAtTime(175, now + .069);
      body.frequency.exponentialRampToValueAtTime(85, now + .093);
      const bodyGain = context.createGain();bodyGain.gain.setValueAtTime(.0001, now + .069);
      bodyGain.gain.linearRampToValueAtTime(.055, now + .07);
      bodyGain.gain.exponentialRampToValueAtTime(.0001, now + .1);
      body.connect(bodyGain);bodyGain.connect(context.destination);
      body.start(now + .069);body.stop(now + .102);
      body.onended = () => { body.disconnect();bodyGain.disconnect(); };
    } catch { /* Unsupported or blocked audio never interrupts the app. */ }
  }
  // Pointer presses sound immediately; keyboard activation is handled on click.
  document.addEventListener('pointerdown',event=>{
    const button = event.target.closest('button');
    if(button && !button.disabled && event.button === 0 && button !== toggle)clickSound();
  });
  document.addEventListener('click',event=>{
    const button = event.target.closest('button');
    if(button && !button.disabled && (event.detail === 0 || button === toggle))clickSound();
  });
})();
