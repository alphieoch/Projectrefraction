const canvas = document.getElementById('progress');
const ctx = canvas.getContext('2d');
const volumeSlider = document.querySelector('.volume-slider');

let isDragging = false;
let dragStartX = 0;
let dragStartTime = 0;

// Update the canvas width to match the progress bar width
function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = 10;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

let percentage = 0;

ctx.fillStyle = 'grey';

function drawBackground() {
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

drawBackground();

ctx.fillStyle = 'white';

function draw() {
    drawBackground();
    const progressWidth = (percentage / 100) * canvas.width;
    ctx.fillRect(0, 0, progressWidth, canvas.height);
}

const playPauseBtn = document.querySelector('.play-pause-btn');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const playIcon = playPauseBtn.querySelector('.fa-play');
const pauseIcon = playPauseBtn.querySelector('.fa-pause');

let isPlaying = false;
let timerInterval;

const currentTimeEl = document.querySelector('.current-time');
const totalTimeEl = document.querySelector('.total-time');

let currentTime = 0;
let totalDuration = 0;

function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function startTimer() {
    timerInterval = setInterval(() => {
        currentTime = Math.floor(sound.seek());
        updateTimers();
        updateProgress();
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

// Initialize Howler.js
let sound;

// Load the audio file
function loadAudio(url) {
    sound = new Howl({
        src: [url],
        html5: true,
        onload: function() {
            totalDuration = Math.floor(sound.duration());
            updateTimers();
            sound.volume(volumeSlider.value / 100); // Set initial volume

            const trackNameElement = document.getElementById('trackName');
            const audioUrl = url.split('/').pop(); // Get the file name from the URL
            const trackName = audioUrl.replace(/\.[^/.]+$/, ''); // Remove the file extension
            trackNameElement.textContent = trackName;

            if (trackNameElement.scrollWidth > trackNameElement.clientWidth) {
                trackNameElement.classList.add('scrolling');
                startTrackNameScroll();
            }
        },
        onplay: function() {
            isPlaying = true;
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'inline-block';
            startTimer();
        },
        onpause: function() {
            isPlaying = false;
            playIcon.style.display = 'inline-block';
            pauseIcon.style.display = 'none';
            stopTimer();
        },
        onend: function() {
            currentTime = 0;
            pauseMusic();
        },
        onseek: function() {
            currentTime = Math.floor(sound.seek());
            updateTimers();
        }
    });
}

// Play the music
function playMusic() {
    sound.play();
}

// Pause the music
function pauseMusic() {
    sound.pause();
}

// Update the playback progress
function updateProgress() {
    const progress = (currentTime / totalDuration) * 100;
    percentage = Math.floor(progress);
    draw();

    // Draw the current time position
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    const currentTimePosition = (currentTime / totalDuration) * canvas.width;

    // Get the progress circle element
    const progressCircle = document.querySelector('.progress-circle');

    // Update the position of the progress circle
    if (progressCircle) {
        progressCircle.style.left = `${currentTimePosition - 6}px`; // Adjust the left position based on the circle size
    }
}

// Update the current time and total duration
function updateTimers() {
    currentTimeEl.textContent = formatTime(currentTime);
    totalTimeEl.textContent = formatTime(totalDuration);
}

// Event listeners
playPauseBtn.addEventListener('click', () => {
    if (isPlaying) {
        pauseMusic();
    } else {
        playMusic();
    }
});

prevBtn.addEventListener('click', () => {
    // Add your code to handle previous track functionality
});

nextBtn.addEventListener('click', () => {
    // Add your code to handle next track functionality
});

volumeSlider.addEventListener('input', () => {
    const volume = volumeSlider.value / 100;
    sound.volume(volume);
});

canvas.addEventListener('contextmenu', function(event) {
    event.preventDefault();
});

canvas.addEventListener('click', handleCanvasClick);

canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('mousemove', handleMouseMove);
canvas.addEventListener('mouseup', handleMouseUp);

function handleCanvasClick(event) {
    if (!isDragging) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const progress = x / canvas.width;
        const newTime = progress * totalDuration;

        currentTime = newTime;
        updateTimers();
        updateProgress();
        sound.seek(newTime);
    }
}

function handleMouseDown(event) {
    if (event.target === canvas) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const progress = x / canvas.width;
        const newTime = progress * totalDuration;

        if (Math.abs(newTime - currentTime) < 5) {
            isDragging = true;
            dragStartX = event.clientX;
            dragStartTime = currentTime;
            event.preventDefault(); // Prevent the click event from being triggered
        }
    }
}

function handleMouseMove(event) {
    if (isDragging) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const progress = x / canvas.width;
        const newTime = progress * totalDuration;

        currentTime = newTime;
        updateTimers();
        updateProgress();
        sound.seek(newTime);
    }
}

function handleMouseUp(event) {
    isDragging = false;
}

function startTrackNameScroll() {
    const trackNameElement = document.getElementById('trackName');
    const animationDuration = parseFloat(getComputedStyle(trackNameElement).animationDuration) * 1000; // Convert to milliseconds

    trackNameElement.addEventListener('animationiteration', () => {
        trackNameElement.style.transform = 'translateX(0)';
    });

    let animationStartTime = null;

    trackNameElement.addEventListener('mouseenter', () => {
        trackNameElement.style.animationPlayState = 'running';
        animationStartTime = Date.now();
    });

    trackNameElement.addEventListener('mouseleave', () => {
        trackNameElement.style.animationPlayState = 'paused';
        const animationElapsedTime = Date.now() - animationStartTime;
        const animationRemainingTime = animationDuration - animationElapsedTime;
        trackNameElement.style.animationDelay = `${animationRemainingTime}ms`;
    });
}

// Detect the user's preferred color scheme
function detectColorScheme() {
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const body = document.getElementsByTagName('body')[0];

    if (prefersDarkMode) {
        body.classList.add('dark-mode');
    } else {
        body.classList.remove('dark-mode');
    }
}

// Call detectColorScheme on page load
window.addEventListener('DOMContentLoaded', detectColorScheme);

// Call detectColorScheme when the color scheme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', detectColorScheme);

// Load the initial audio file
loadAudio('Childish Gambino - Human Sacrifice (Studio Version Leak).mp3');