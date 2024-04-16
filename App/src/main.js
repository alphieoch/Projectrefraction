let currentVideoIndex = null;
let backgroundVideos = [];
let currentVideo = null;
let nextVideo = null;
let fadeOutStartTime = null;
let fadeOutDuration = 1000; // 1 second fade-out duration

async function loadBackgroundVideo() {
    try {
        const backgroundVideoUrls = await fetchBackgroundVideos();
        if (backgroundVideoUrls.length > 0) {
            backgroundVideos = backgroundVideoUrls;
            currentVideoIndex = Math.floor(Math.random() * backgroundVideos.length);
            const backgroundVideoContainer = document.getElementById('background-container');
            currentVideo = document.createElement('video');
            currentVideo.id = 'background-video';
            currentVideo.autoplay = true;
            currentVideo.loop = true;
            currentVideo.muted = true;
            currentVideo.src = backgroundVideos[currentVideoIndex];
            backgroundVideoContainer.appendChild(currentVideo);
            currentVideo.addEventListener('ended', cycleBackgroundVideo);
        }
    } catch (error) {
        console.log('Error fetching background videos:', error);
    }
}

function cycleBackgroundVideo() {
    let nextIndex;
    do {
        nextIndex = Math.floor(Math.random() * backgroundVideos.length);
    } while (nextIndex === currentVideoIndex);

    currentVideoIndex = nextIndex;
    fadeOutStartTime = performance.now();
    nextVideo = document.createElement('video');
    nextVideo.autoplay = true;
    nextVideo.loop = true;
    nextVideo.muted = true;
    nextVideo.src = backgroundVideos[currentVideoIndex];
    const backgroundVideoContainer = document.getElementById('background-container');
    backgroundVideoContainer.appendChild(nextVideo);
    requestAnimationFrame(fadeTransition);
}

function fadeTransition(timestamp) {
    if (!fadeOutStartTime) {
        fadeOutStartTime = timestamp;
    }

    const elapsedTime = timestamp - fadeOutStartTime;
    const progress = Math.min(elapsedTime / fadeOutDuration, 1);

    if (currentVideo) {
        currentVideo.style.opacity = 1 - progress;
    }

    if (nextVideo) {
        nextVideo.style.opacity = progress;
    }

    if (progress < 1) {
        requestAnimationFrame(fadeTransition);
    } else {
        if (currentVideo) {
            currentVideo.remove();
            currentVideo = null;
        }
        currentVideo = nextVideo;
        nextVideo = null;
        fadeOutStartTime = null;
    }
}

loadBackgroundVideo();