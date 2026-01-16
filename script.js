
const playlist = [
    "[1]_vibrator_xaviersobased.mp3",
    "[2]_heinous nosense_jaydes.flac",
    "[3]_LADYGAGA_8belial.flac",
    "[4]_Be that easy_Sade.mp3",
    "[5]_Twist and Shout_The Beatles.mp3"
];

const loadingStates = ["JOINING SERVER", "PREPARING ASSETS", "ESTABLISHING CONNECTION"];


const audio = document.getElementById('bg-m');
const loadingText = document.getElementById('loading-text');
const trackImage = document.getElementById('track-image');
const progressBar = document.getElementById('progress-bar');
const volumeSlider = document.getElementById('volume-slider');
const playPauseBtn = document.getElementById('play-pause-btn');
const shuffleBtn = document.getElementById('shuffle-btn');
const loopBtn = document.getElementById('loop-btn');

let currentTrackIndex = 0;
let isShuffle = false;
let isLoop = false;

function loadTrack(index) {
    const fileName = playlist[index];
    audio.src = `media/${fileName}`;
    
    const trackID = fileName.match(/\[\d+\]/)[0];
    trackImage.src = `media/album_art/${trackID}.webp`;
    
    const parts = fileName.replace(/\.(mp3|flac)$/, '').split('_');
    document.getElementById('track-name').innerText = parts[1] || "Unknown";
    document.getElementById('track-artist').innerText = parts[2] || "Unknown";
    
    audio.play().catch(() => console.log("Esperando interacción..."));
    updatePlayPauseIcon();
}

audio.addEventListener('timeupdate', () => {
    if (!progressBar.classList.contains('seeking')) {
        const progress = (audio.currentTime / audio.duration) * 100;
        progressBar.value = progress || 0;
        updateTimeDisplays();
    }
});

progressBar.addEventListener('mousedown', () => progressBar.classList.add('seeking'));
progressBar.addEventListener('input', () => updateTimeDisplays());
progressBar.addEventListener('change', () => {
    const seekTime = (progressBar.value / 100) * audio.duration;
    audio.currentTime = seekTime;
    progressBar.classList.remove('seeking');
});

function updateTimeDisplays() {
    const current = Math.floor(audio.currentTime);
    const total = Math.floor(audio.duration);
    document.getElementById('current-time').innerText = formatTime(current);
    if (!isNaN(total)) {
        document.getElementById('duration-time').innerText = "-" + formatTime(total - current);
    }
}

function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

function updatePlayPauseIcon() {
    const icon = playPauseBtn.querySelector('i');
    icon.className = audio.paused ? "fas fa-play" : "fas fa-pause";
}

playPauseBtn.onclick = () => {
    audio.paused ? audio.play() : audio.pause();
    updatePlayPauseIcon();
};

function nextTrack() {
    if (isShuffle) {
        currentTrackIndex = Math.floor(Math.random() * playlist.length);
    } else {
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    }
    loadTrack(currentTrackIndex);
}

document.getElementById('next-btn').onclick = nextTrack;
document.getElementById('prev-btn').onclick = () => {
    currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    loadTrack(currentTrackIndex);
};

shuffleBtn.onclick = () => {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle('active-control', isShuffle);
};

loopBtn.onclick = () => {
    isLoop = !isLoop;
    loopBtn.classList.toggle('active-control', isLoop);
};

audio.addEventListener('ended', () => {
    isLoop ? audio.play() : nextTrack();
});

volumeSlider.addEventListener('input', () => {
    audio.volume = volumeSlider.value / 100;
});

window.addEventListener('keydown', (e) => {
    if (e.code === "Space") {
        e.preventDefault();
        audio.muted = !audio.muted;
    }
    if (e.code === "ArrowRight") nextTrack();
    if (e.code === "ArrowLeft") {
        currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
        loadTrack(currentTrackIndex);
    }
});

setInterval(() => {
    loadingText.innerText = loadingStates[Math.floor(Math.random() * loadingStates.length)];
}, 4000);

window.onload = () => {
    currentTrackIndex = Math.floor(Math.random() * playlist.length);
    loadTrack(currentTrackIndex);
    audio.volume = 0.3;
};