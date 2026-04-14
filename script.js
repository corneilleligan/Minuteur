const CIRCUMFERENCE = 2 * Math.PI * 120; // 753.98

const playBtn     = document.getElementById('playBtn');
const resetBtn    = document.getElementById('resetBtn');
const timerDisp   = document.getElementById('timerDisp');
const progressArc = document.getElementById('progressArc');
const durBtns     = document.querySelectorAll('.dur-btn');

// Add SVG gradient
const svgEl = document.querySelector('.face-svg');
const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
defs.innerHTML = `
  <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="#4f8ef7"/>
    <stop offset="100%" stop-color="#7c5ce8"/>
  </linearGradient>`;
svgEl.prepend(defs);

let totalSecondes     = 60;
let secondesActuelles = 60;
let enCours           = false;
let intervalle        = null;

// Init display
updateDisplay();
updateArc(1);

// Duration picker
durBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    if (enCours) return;
    durBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    totalSecondes = parseInt(btn.dataset.sec);
    secondesActuelles = totalSecondes;
    updateDisplay();
    updateArc(1);
    timerDisp.classList.remove('done');
  });
});

// Play / Pause
playBtn.addEventListener('click', () => {
  if (secondesActuelles <= 0) {
    resetAll();
    return;
  }
  enCours = !enCours;
  if (enCours) {
    playBtn.textContent = 'Pause';
    intervalle = setInterval(run, 1000);
  } else {
    playBtn.textContent = 'Reprendre';
    clearInterval(intervalle);
  }
});

// Reset
resetBtn.addEventListener('click', resetAll);

function run() {
  secondesActuelles--;
  updateDisplay();
  updateArc(secondesActuelles / totalSecondes);

  if (secondesActuelles <= 0) {
    clearInterval(intervalle);
    enCours = false;
    playBtn.textContent = 'Recommencer';
    timerDisp.classList.add('done');
  }
}

function updateDisplay() {
  const m = Math.floor(secondesActuelles / 60);
  const s = secondesActuelles % 60;
  timerDisp.textContent = pad(m) + ':' + pad(s);
}

function updateArc(ratio) {
  // ratio 1 = full circle, 0 = empty
  const offset = CIRCUMFERENCE * (1 - ratio);
  progressArc.style.strokeDashoffset = offset;
}

function resetAll() {
  clearInterval(intervalle);
  enCours = false;
  secondesActuelles = totalSecondes;
  playBtn.textContent = 'Démarrer';
  timerDisp.classList.remove('done');
  updateDisplay();
  updateArc(1);
}

function pad(n) {
  return n < 10 ? '0' + n : String(n);
}