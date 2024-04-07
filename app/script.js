const musicContainer = document.getElementById('music-container');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const audio = document.getElementById('audio');
const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progress-container');
const title = document.getElementById('title');
const cover = document.getElementById('cover');
const currTime = document.getElementById('currTime');
const durTime = document.getElementById('durTime');
const eqSliders = document.querySelectorAll('.eq-slider');
const eqValues = document.querySelectorAll('.eq-value');
const savePresetBtn = document.getElementById('savePreset');
const loadPresetBtn = document.getElementById('loadPreset');
const clipProtectionBtn = document.getElementById('clipProtection');
const balanceSlider = document.getElementById('balanceSlider');

let audioContext;
let source;
let filters = [];
let eqNode;
let clipProtection = true;

// Track info
const tracks = [
	{ id: 1, title: 'American Wedding', audio: 'sample tracks/american-wedding.m4a' },
	{ id: 2, title: 'Bitches Talkin', audio: 'sample tracks/bitches-talkin.m4a' },
	{ id: 3, title: 'Dust', audio: 'sample tracks/dust.m4a' },
	{ id: 4, title: 'Goldeneye', audio: 'sample tracks/goldeneye.m4a' },
	{ id: 5, title: 'Lovecrimes', audio: 'sample tracks/lovecrimes.m4a' },
	{ id: 6, title: 'Nature Feels', audio: 'sample tracks/nature-feels.m4a' },
	{ id: 7, title: 'Novacane', audio: 'sample tracks/novacane.m4a' },
	{ id: 8, title: 'Songs for Women', audio: 'sample tracks/songs-for-women.m4a' },
	{ id: 9, title: 'Soul Calibur', audio: 'sample tracks/soul-calibur.m4a' },
	{ id: 10, title: 'Strawberry Swing', audio: 'sample tracks/strawberry-swing.m4a' },
	{ id: 11, title: 'Street Fighter', audio: 'sample tracks/street-fighter.m4a' },
	{ id: 12, title: 'Swim Good', audio: 'sample tracks/swim-good.m4a' },
	{ id: 13, title: 'There Will Be Tears', audio: 'sample tracks/there-will-be-tears.m4a' },
	{ id: 14, title: 'We All Try', audio: 'sample tracks/we-all-try.m4a' }
];

// Keep track of the current track
let trackIndex = 0;

// Load the initial track
loadTrack(tracks[trackIndex]);

// Update track details
function loadTrack(track) {
	title.innerText = track.title;
	audio.src = track.audio;
	cover.src = 'https://example.com/path/to/black-vinyl.jpg'; // Replace with the actual URL or path to the black vinyl image
}

// Play song
function playSong() {
	musicContainer.classList.add('play');
	playBtn.querySelector('i.fas').classList.remove('fa-play');
	playBtn.querySelector('i.fas').classList.add('fa-pause');
	audio.play();
}

// Pause song
function pauseSong() {
	musicContainer.classList.remove('play');
	playBtn.querySelector('i.fas').classList.add('fa-play');
	playBtn.querySelector('i.fas').classList.remove('fa-pause');
	audio.pause();
}

// Previous track
function prevTrack() {
	trackIndex--;

	if (trackIndex < 0) {
		trackIndex = tracks.length - 1;
	}

	loadTrack(tracks[trackIndex]);
	playSong();
}

// Next track
function nextTrack() {
	trackIndex++;

	if (trackIndex > tracks.length - 1) {
		trackIndex = 0;
	}

	loadTrack(tracks[trackIndex]);
	playSong();
}

// Update progress bar
function updateProgress(e) {
	const { duration, currentTime } = e.srcElement;
	const progressPercent = (currentTime / duration) * 100;
	progress.style.width = `${progressPercent}%`;
}

// Set progress bar
function setProgress(e) {
	const width = this.clientWidth;
	const clickX = e.offsetX;
	const duration = audio.duration;

	audio.currentTime = (clickX / width) * duration;
}

// Update duration time
function updateDuration() {
	const duration = audio.duration;
	const minutes = Math.floor(duration / 60);
	const seconds = Math.floor(duration % 60);
	durTime.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Update current time
function updateCurrentTime() {
	const currentTime = audio.currentTime;
	const minutes = Math.floor(currentTime / 60);
	const seconds = Math.floor(currentTime % 60);
	currTime.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Initialize audio context
function initAudioContext() {
	if (window.AudioContext || window.webkitAudioContext) {
		if (!audioContext) {
			audioContext = new (window.AudioContext || window.webkitAudioContext)();
			source = audioContext.createMediaElementSource(audio);
			eqNode = audioContext.createGain();
			connectFilters();
			setBalance();
		}
	} else {
		console.log('Web Audio API is not supported');
		// Fallback or error handling
	}
}

// Create filters
function createFilters() {
	filters = [];
	eqSliders.forEach((slider, index) => {
		const filter = audioContext.createBiquadFilter();
		const frequency = parseFloat(slider.dataset.freq);

		if (frequency < 100) {
			filter.type = 'lowshelf';
		} else if (frequency > 5000) {
			filter.type = 'highshelf';
		} else {
			filter.type = 'peaking';
		}

		filter.frequency.value = frequency;
		filter.Q.value = 1;
		filter.gain.value = 0;
		filters.push(filter);
	});
}

// Connect filters
function connectFilters() {
	createFilters();
	source.connect(filters[0]);

	for (let i = 0; i < filters.length - 1; i++) {
		filters[i].connect(filters[i + 1]);
	}

	filters[filters.length - 1].connect(eqNode);
}

// Update filter gains
function updateFilterGains() {
	eqSliders.forEach((slider, index) => {
		const gainValue = parseFloat(slider.value);
		const maxGain = 12; // Maximum allowed gain in decibels
		filters[index].gain.setValueAtTime(Math.min(gainValue, maxGain), audioContext.currentTime);
	});
}

// EQ functionality
function applyEQ() {
	console.log('Applying EQ');

	if (!audioContext) {
		return;
	}

	updateFilterGains();
}

eqSliders.forEach((slider, index) => {
	slider.addEventListener('input', () => {
		console.log('EQ slider changed');
		eqValues[index].textContent = slider.value;
		applyEQ();
	});
});

// Save and load presets
function savePreset() {
	const preset = {};
	eqSliders.forEach(slider => {
		preset[slider.dataset.freq] = slider.value;
	});
	localStorage.setItem('eqPreset', JSON.stringify(preset));
}

function loadPreset() {
	const preset = JSON.parse(localStorage.getItem('eqPreset'));
	if (preset) {
		eqSliders.forEach((slider, index) => {
			slider.value = preset[slider.dataset.freq] || 0;
			eqValues[index].textContent = slider.value;
		});
		applyEQ();
	}
}

function setBalance() {
	if (audioContext && source) {
		const balance = parseFloat(balanceSlider.value);
		const gainL = audioContext.createGain();
		const gainR = audioContext.createGain();
		const merger = audioContext.createChannelMerger(2);

		eqNode.disconnect();
		eqNode.connect(gainL);
		eqNode.connect(gainR);

		gainL.connect(merger, 0, 0);
		gainR.connect(merger, 0, 1);

		gainL.gain.value = balance < 0 ? 1 + balance : 1;
		gainR.gain.value = balance > 0 ? 1 - balance : 1;

		merger.connect(audioContext.destination);
	}
}

// Event listeners
playBtn.addEventListener('click', () => {
	const isPlaying = musicContainer.classList.contains('play');

	if (isPlaying) {
		pauseSong();
	} else {
		playSong();
	}
});

prevBtn.addEventListener('click', prevTrack);
nextBtn.addEventListener('click', nextTrack);
audio.addEventListener('timeupdate', updateProgress);
progressContainer.addEventListener('click', setProgress);
audio.addEventListener('loadedmetadata', updateDuration);
audio.addEventListener('timeupdate', updateCurrentTime);
audio.addEventListener('canplaythrough', initAudioContext);
savePresetBtn.addEventListener('click', savePreset);
loadPresetBtn.addEventListener('click', loadPreset);

clipProtectionBtn.addEventListener('click', () => {
	if (clipProtection) {
		const confirmDisable = confirm('Disabling clip protection may result in loud audio levels that can potentially cause ear damage, especially when using headphones. Do you want to proceed?');
		if (!confirmDisable) {
			return;
		}
	}

	clipProtection = !clipProtection;
	clipProtectionBtn.classList.