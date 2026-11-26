const get = (id) => document.getElementById(id);
const envelope = get('envelope');
const reading = get('reading');
const pin = get('pin');
const theme = get('theme');
const close = get('close-letter');
const audio = get('audio');
const listen = get('listen');
const audioPanel = get('audio-panel');
const speech = window.speechSynthesis;
const readAloud = get('read-aloud');
let utterance;
let audioUrl;
let photoUrls = [];

function setTheme(mode) {
  document.documentElement.dataset.theme = mode;
  theme.textContent = mode === 'dark' ? 'Light mode' : 'Dark mode';
}

theme.addEventListener('click', () => {
  setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
});

get('open-letter').addEventListener('submit', (event) => {
  event.preventDefault();
  if (pin.value !== '2017') {
    get('pin-error').textContent = 'Try the preview PIN shown below.';
    pin.focus();
    return;
  }
  pin.value = '';
  get('pin-error').textContent = '';
  envelope.hidden = true;
  reading.hidden = false;
  get('letter-title').focus();
  window.scrollTo(0, 0);
});

function stopNarration() {
  const wasSpeaking = Boolean(utterance);
  utterance = undefined;
  if (wasSpeaking) {
    speech.cancel();
    get('audio-status').textContent = 'Device narration stopped.';
  }
  readAloud.textContent = 'Try device narration';
}

close.addEventListener('click', () => {
  stopNarration();
  audio.pause();
  reading.hidden = true;
  envelope.hidden = false;
  pin.focus();
  window.scrollTo(0, 0);
});

listen.addEventListener('click', () => {
  audioPanel.hidden = !audioPanel.hidden;
  listen.setAttribute('aria-expanded', String(!audioPanel.hidden));
});

readAloud.hidden = !speech || !window.SpeechSynthesisUtterance;
readAloud.addEventListener('click', () => {
  if (utterance) {
    stopNarration();
    return;
  }
  const voices = speech.getVoices().filter((voice) => voice.localService && voice.lang.startsWith('en'));
  if (!voices.length) {
    get('audio-status').textContent = 'This browser has no local English narration voice. You can still try a recording.';
    return;
  }

  audio.pause();
  const passages = Array.from(document.querySelectorAll('[data-narrate]'), (element) => element.textContent.trim());
  const voice = voices.find(({ lang }) => lang.toLowerCase() === 'en-za') ||
    voices.find(({ lang }) => lang.toLowerCase() === 'en-gb') || voices[0];

  function speakFrom(index) {
    if (index === passages.length) {
      utterance = undefined;
      readAloud.textContent = 'Try device narration';
      get('audio-status').textContent = 'Device narration finished.';
      return;
    }

    const part = new SpeechSynthesisUtterance(passages[index]);
    part.voice = voice;
    part.lang = voice.lang;
    part.rate = 0.93;
    part.onend = () => { if (utterance === part) speakFrom(index + 1); };
    part.onerror = () => {
      if (utterance !== part) return;
      stopNarration();
      get('audio-status').textContent = 'Device narration could not play. You can still try a recording.';
    };
    utterance = part;
    speech.speak(part);
  }

  get('audio-status').textContent = 'Playing a device voice for this preview.';
  readAloud.textContent = 'Stop narration';
  speakFrom(0);
});

const audioInput = get('audio-input');
audioInput.addEventListener('change', () => {
  const file = audioInput.files[0];
  if (!file) return;
  stopNarration();
  audio.pause();
  if (audioUrl) URL.revokeObjectURL(audioUrl);
  audioUrl = URL.createObjectURL(file);
  audio.src = audioUrl;
  audio.hidden = false;
  get('audio-status').textContent = 'Recording ready to play on this device.';
  audioInput.value = '';
});
audio.addEventListener('play', stopNarration);
audio.addEventListener('error', () => {
  get('audio-status').textContent = 'This recording could not play. Try an MP3 or WAV file.';
});

const photoInput = get('photos-input');
const dialog = get('photo-dialog');
const fullPhoto = get('full-photo');

photoInput?.addEventListener('change', () => {
  const photos = Array.from(photoInput.files);
  photoInput.value = '';
  if (!photos.length) return;

  for (const url of photoUrls) URL.revokeObjectURL(url);
  photoUrls = photos.map((photo) => URL.createObjectURL(photo));
  const thumbs = photoUrls.map((url, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'photo-thumb';
    const img = document.createElement('img');
    img.src = url;
    img.alt = 'Open photo ' + (index + 1);
    button.append(img);
    button.addEventListener('click', () => {
      fullPhoto.src = url;
      fullPhoto.alt = 'Selected photo ' + (index + 1);
      get('photo-title').textContent = 'Photo ' + (index + 1) + ' of ' + photoUrls.length;
      dialog.showModal();
    });
    return button;
  });
  get('photos-grid').replaceChildren(...thumbs);
});
dialog.addEventListener('close', () => fullPhoto.removeAttribute('src'));
window.addEventListener('pagehide', stopNarration);
