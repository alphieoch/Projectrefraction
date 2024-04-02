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