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
    console.log('Loading audio file:', url);
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
            console.log('Audio playback started');
        },
        onpause: function() {
            isPlaying = false;
            playIcon.style.display = 'inline-block';
            pauseIcon.style.display = 'none';
            stopTimer();
            console.log('Audio playback paused');
        },
        onend: function() {
            currentTime = 0;
            pauseMusic();
            console.log('Audio playback ended');
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
    console.log('Previous track button clicked');
});

nextBtn.addEventListener('click', () => {
    // Add your code to handle next track functionality
    console.log('Next track button clicked');
});

volumeSlider.addEventListener('input', () => {
    const volume = volumeSlider.value / 100;
    sound.volume(volume);
    console.log('Volume changed:', volume);
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
        console.log('Seeked to:', formatTime(currentTime));
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

// Get the equalizer container
const equalizerContainer = document.querySelector('.equalizer-container');

// Number of equalizer bars
const numBars = 32;

// Array to store equalizer bar elements
const equalizerBars = [];

// Create equalizer bars
for (let i = 0; i < numBars; i++) {
    const bar = document.createElement('div');
    bar.classList.add('equalizer-bar');
    equalizerContainer.appendChild(bar);
    equalizerBars.push(bar);
}

// Web Audio API setup
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioCtx.createAnalyser();
analyser.fftSize = 256;

// Create EQ filters
const filters = [];
const eqSliders = document.querySelectorAll('.eq-slider');

eqSliders.forEach((slider, index) => {
    const frequency = parseFloat(slider.dataset.frequency);
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'peaking';
    filter.frequency.value = frequency;
    filter.Q.value = Math.sqrt(1 / (2 - 1)); // Constant Q value for filters
    filters.push(filter);

    slider.addEventListener('input', () => {
        const gain = parseFloat(slider.value);
        filter.gain.value = gain; // Adjust filter gain based on slider value
        console.log(`Frequency ${frequency} Hz gain set to ${gain} dB`);
    });
});

// Connect the audio source to the filters and analyser
const source = audioCtx.createMediaElementSource(sound._sounds[0]._node);
source.connect(filters[0]);

for (let i = 0; i < filters.length - 1; i++) {
    filters[i].connect(filters[i + 1]);
}

filters[filters.length - 1].connect(analyser);
analyser.connect(audioCtx.destination);

// Update equalizer bars
function updateEqualizerBars() {
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    const barHeight = equalizerContainer.offsetHeight;
    const barWidth = equalizerBars[0].offsetWidth;

    equalizerBars.forEach((bar, index) => {
        const value = dataArray[index];
        const height = (value / 256) * barHeight;
        bar.style.height = `${height}px`;
        bar.style.marginTop = `${barHeight - height - barWidth / 2}px`;
    });

    requestAnimationFrame(updateEqualizerBars);
}

// Start updating equalizer bars
updateEqualizerBars();

// Handle navigation dot clicks and menu transitions
const menuDots = document.querySelectorAll('.nav-dots .dot');
const menus = document.querySelectorAll('.top-right-box .menu');

menuDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        // Remove the active class from all menus and dots
        menus.forEach(menu => menu.classList.remove('active'));
        menuDots.forEach(dot => dot.classList.remove('active'));

        // Add the active class to the clicked dot and corresponding menu
        dot.classList.add('active');
        menus[index].classList.add('active');

        // Add slide animation
        const activeMenu = menus[index];
        activeMenu.style.transform = `translateX(0)`;
        activeMenu.style.transition = 'transform 0.3s ease';

        // Log the active menu
        console.log(`Switched to menu ${index + 1}`);
    });
});

// Get the pop-up elements
const eqSavePopup = document.getElementById('eq-save-popup');
const eqNameInput = document.getElementById('eq-name');
const userNameInput = document.getElementById('user-name');
const trackInfoInput = document.getElementById('track-info');
const eqSaveConfirmBtn = document.getElementById('eq-save-confirm');
const eqSaveCancelBtn = document.getElementById('eq-save-cancel');

// Show the pop-up when the save button is clicked
function showSavePopup() {
    eqSavePopup.style.display = 'block';
    const trackName = document.getElementById('trackName').textContent;
    trackInfoInput.value = trackName;
}

// Hide the pop-up
function hideSavePopup() {
    eqSavePopup.style.display = 'none';
    eqNameInput.value = '';
    userNameInput.value = '';
    trackInfoInput.value = '';
}

// Save the equalizer settings to a text file
function saveEqSettingsToFile() {
    const settingName = eqNameInput.value.trim();
    const userName = userNameInput.value.trim();
    const trackInfo = trackInfoInput.value.trim();

    if (settingName === '' || userName === '') {
        alert('Please enter a setting name and your name.');
        return;
    }

    const settingsData = {
        settingName: settingName,
        userName: userName,
        trackInfo: trackInfo,
        eqSettings: savedEqSettings
    };

    const settingsJson = JSON.stringify(settingsData, null, 2);
    const blob = new Blob([settingsJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${settingName}.json`;
    link.click();

    URL.revokeObjectURL(url);
    hideSavePopup();
}

// Event listener for the save button in the pop-up
eqSaveConfirmBtn.addEventListener('click', saveEqSettingsToFile);

// Event listener for the cancel button in the pop-up
eqSaveCancelBtn.addEventListener('click', hideSavePopup);

// Get the save and clear buttons
const eqSaveBtn = document.querySelector('.eq-save-btn');
const eqClearBtn = document.querySelector('.eq-clear-btn');

// Store the saved equalizer settings
let savedEqSettings = {};

// Save the equalizer settings
function saveEqSettings() {
    eqSliders.forEach((slider, index) => {
        const frequency = parseFloat(slider.dataset.frequency);
        const gain = parseFloat(slider.value);
        savedEqSettings[frequency] = gain;
    });
    console.log('Equalizer settings saved:', savedEqSettings);
}

// Apply the saved equalizer settings
function applyEqSettings() {
    eqSliders.forEach((slider, index) => {
        const frequency = parseFloat(slider.dataset.frequency);
        const savedGain = savedEqSettings[frequency];
        if (savedGain !== undefined) {
            slider.value = savedGain;
            filters[index].gain.value = savedGain;
        }
    });
    console.log('Equalizer settings applied');
}

// Clear the equalizer settings
function clearEqSettings() {
    eqSliders.forEach((slider, index) => {
        slider.value = 0;
        filters[index].gain.value = 0;
    });
    savedEqSettings = {};
    console.log('Equalizer settings cleared');
}

// Event listener for the save button
eqSaveBtn.addEventListener('click', showSavePopup);

// Event listener for the clear button
eqClearBtn.addEventListener('click', clearEqSettings);

// Load the saved equalizer settings on page load
document.addEventListener('DOMContentLoaded', applyEqSettings); 