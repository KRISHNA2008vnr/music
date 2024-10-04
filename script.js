let audioPlayer = document.getElementById("audioPlayer");
let currentSong = document.getElementById("currentSong");
let songListDiv = document.getElementById("songList");
let playPauseBtn = document.getElementById("playPauseBtn");
let progressBar = document.getElementById("progressBar");
let currentTimeElem = document.getElementById("currentTime");
let durationTimeElem = document.getElementById("durationTime");
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;
let currentSongIndex = 0;
let songs = [];

// Fetch the songs from songs.json
fetch('songs.json')
  .then(response => response.json())
  .then(data => {
    songs = data;
    renderSongList(songs);
    loadSong(currentSongIndex);
  })
  .catch(error => console.error('Error loading songs:', error));

// Function to load song based on index
function loadSong(index) {
  let song = songs[index];
  audioPlayer.src = song.file;
  currentSong.textContent = `Playing: ${song.title} by ${song.artist}`;
}

// Play or Pause toggle
function togglePlayPause() {
  if (isPlaying) {
    audioPlayer.pause();
    playPauseBtn.textContent = 'Play';
  } else {
    audioPlayer.play();
    playPauseBtn.textContent = 'Pause';
  }
  isPlaying = !isPlaying;
}

// Play next song
function nextSong() {
  if (isShuffle) {
    currentSongIndex = Math.floor(Math.random() * songs.length);
  } else {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
  }
  loadSong(currentSongIndex);
  audioPlayer.play();
  playPauseBtn.textContent = 'Pause';
}

// Play previous song
function prevSong() {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  loadSong(currentSongIndex);
  audioPlayer.play();
  playPauseBtn.textContent = 'Pause';
}

// Shuffle toggle
function toggleShuffle() {
  isShuffle = !isShuffle;
  document.getElementById("shuffleBtn").style.backgroundColor = isShuffle ? '#f0f0f0' : '';
}

// Repeat toggle
function toggleRepeat() {
  isRepeat = !isRepeat;
  audioPlayer.loop = isRepeat;
  document.getElementById("repeatBtn").style.backgroundColor = isRepeat ? '#f0f0f0' : '';
}

// Update progress bar
audioPlayer.addEventListener("timeupdate", () => {
  let currentTime = audioPlayer.currentTime;
  let duration = audioPlayer.duration;
  progressBar.value = (currentTime / duration) * 100;
  updateTimeDisplay(currentTime, currentTimeElem);
  updateTimeDisplay(duration, durationTimeElem);
});

// Seek to part of song
progressBar.addEventListener("input", () => {
  audioPlayer.currentTime = (progressBar.value / 100) * audioPlayer.duration;
});

// Update time display for progress
function updateTimeDisplay(time, element) {
  let minutes = Math.floor(time / 60);
  let seconds = Math.floor(time % 60);
  element.textContent = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Volume control
function setVolume(value) {
  audioPlayer.volume = value / 100;
}

// Render song list
function renderSongList(songs) {
  songListDiv.innerHTML = '';
  songs.forEach((song, index) => {
    const songItem = document.createElement("div");
    songItem.className = "song-item";
    songItem.textContent = `${song.title} - ${song.artist}`;
    songItem.onclick = () => {
      currentSongIndex = index;
      loadSong(index);
      audioPlayer.play();
      playPauseBtn.textContent = 'Pause';
    };
    songListDiv.appendChild(songItem);
  });
}

// Search songs
function searchSongs() {
  const searchQuery = document.getElementById("searchBar").value.toLowerCase();
  const filteredSongs = songs.filter(song => 
    song.title.toLowerCase().includes(searchQuery) || 
    song.artist.toLowerCase().includes(searchQuery)
  );
  renderSongList(filteredSongs);
}
