const apiKey = '2164218-a660e6d3883800d89a77a4886';
const apiUrl = `https://pixabay.com/api/videos/?key=${apiKey}&q=aerial&min_width=3840&min_height=2160&video_type=film`;

async function changeBackgroundVideo() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const filteredVideos = data.hits.filter(video => video.videos.large && video.videos.large.width >= 3840 && video.videos.large.height >= 2160);

        if (filteredVideos.length > 0) {
            const randomIndex = Math.floor(Math.random() * filteredVideos.length);
            const videoUrl = filteredVideos[randomIndex].videos.large.url;
            const artistName = filteredVideos[randomIndex].user;
            document.getElementById('background-video').src = videoUrl;
            document.getElementById('artist-name').textContent = `Artist: ${artistName}`;
        } else {
            console.log('No 4K aerial videos found.');
        }
    } catch (error) {
        console.error('Error fetching video:', error);
    }
}

changeBackgroundVideo();

let track_list = [
    {
        name: "Night Owl",
        artist: "Broke For Free",
        image: "https://images.pexels.com/photos/2264753/pexels-photo-2264753.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=250&w=250",
        path: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/WFMU/Broke_For_Free/Directionless_EP/Broke_For_Free_-_01_-_Night_Owl.mp3"
    },
    {
        name: "Enthusiast",
        artist: "Tours",
        image: "https://images.pexels.com/photos/3100835/pexels-photo-3100835.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=250&w=250",
        path: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Tours/Enthusiast/Tours_-_01_-_Enthusiast.mp3"
    },
    {
        name: "Shipping Lanes",
        artist: "Chad Crouch",
        image: "https://images.pexels.com/photos/1717969/pexels-photo-1717969.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=250&w=250",
        path: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Chad_Crouch/Arps/Chad_Crouch_-_Shipping_Lanes.mp3",
    },
];

let curr_track = document.createElement('audio');
let track_index = 0;
let isPlaying = false;
let updateTimer;

function loadTrack(track_index) {
    clearInterval(updateTimer);
    resetValues();
    curr_track.src = track_list[track_index].path;
    curr_track.load();

    document.getElementById('album-art').src = track_list[track_index].image;
    document.getElementById('track-artist').textContent = track_list[track_index].artist;
    document.getElementById('track-title').textContent = track_list[track_index].name;

    updateTimer = setInterval(seekUpdate, 1000);
    curr_track.addEventListener("ended", nextTrack);
}

function resetValues() {
    document.getElementById('current-time').textContent = "00:00";
    document.getElementById('duration').textContent = "00:00";
    document.getElementById('seek-slider').value = 0;
}

function playPause() {
    if (isPlaying) {
        pauseTrack();
    } else {
        playTrack();
    }
}

function playTrack() {
    curr_track.play().then(() => {
        isPlaying = true;
        document.getElementById('playpause-btn').innerHTML = '<i class="fas fa-pause"></i>';
    }).catch((error) => {
        console.error('Error playing track:', error);
    });
}

function pauseTrack() {
    curr_track.pause();
    isPlaying = false;
    document.getElementById('playpause-btn').innerHTML = '<i class="fas fa-play"></i>';
}

function nextTrack() {
    if (track_index < track_list.length - 1) {
        track_index += 1;
    } else {
        track_index = 0;
    }
    loadTrack(track_index);
    playTrack();
}

function prevTrack() {
    if (track_index > 0) {
        track_index -= 1;
    } else {
        track_index = track_list.length - 1;
    }
    loadTrack(track_index);
    playTrack();
}

function seekTo() {
    let seekto = curr_track.duration * (document.getElementById('seek-slider').value / 100);
    curr_track.currentTime = seekto;
}

function setVolume() {
    curr_track.volume = document.getElementById('volume-slider').value;
    let volumeLevel = curr_track.volume * 100;
    document.getElementById('volume-slider').style.background = `linear-gradient(to right, #fff ${volumeLevel}%, #d3d3d3 ${volumeLevel}%)`;
}

function seekUpdate() {
    let seekPosition = 0;

    if (!isNaN(curr_track.duration)) {
        seekPosition = curr_track.currentTime * (100 / curr_track.duration);
        document.getElementById('seek-slider').value = seekPosition;

        let currentMinutes = Math.floor(curr_track.currentTime / 60);
        let currentSeconds = Math.floor(curr_track.currentTime - currentMinutes * 60);
        let durationMinutes = Math.floor(curr_track.duration / 60);
        let durationSeconds = Math.floor(curr_track.duration - durationMinutes * 60);

        if (currentSeconds < 10) { currentSeconds = "0" + currentSeconds; }
        if (durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
        if (currentMinutes < 10) { currentMinutes = "0" + currentMinutes; }
        if (durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }

        document.getElementById('current-time').textContent = currentMinutes + ":" + currentSeconds;
        document.getElementById('duration').textContent = durationMinutes + ":" + durationSeconds;
    }
}

document.getElementById('playpause-btn').addEventListener('click', playPause);
document.getElementById('next-btn').addEventListener('click', nextTrack);
document.getElementById('prev-btn').addEventListener('click', prevTrack);
document.getElementById('volume-slider').addEventListener('input', setVolume);
document.getElementById('seek-slider').addEventListener('input', seekTo);

curr_track.addEventListener('timeupdate', seekUpdate);

loadTrack(track_index);