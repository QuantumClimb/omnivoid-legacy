export class AudioPlayer {
  constructor() {
    this.tracks = Array.from({ length: 20 }, (_, i) => `47K_Phase_${String(i + 1).padStart(2, '0')}.mp3`);
    
    this.currentTrackIndex = 0;
    this.isPlaying = false;
    this.isMuted = false;
    this.audio = new Audio();
    this.audio.loop = false;
    
    this.audio.addEventListener('ended', () => this.nextTrack());
    
    this.initUI();
    this.loadTrack(0);
  }

  loadTrack(index) {
    this.currentTrackIndex = index;
    const trackFile = this.tracks[this.currentTrackIndex];
    this.audio.src = `./public/audio/${trackFile}`;
    const trackName = trackFile.replace('.mp3', '').replace('_', ' - ');
    
    if (this.playBtn) {
      this.playBtn.title = `Play / Pause (${trackName})`;
    }
    
    if (this.isPlaying) {
      this.audio.play().catch(e => console.error("Audio playback failed:", e));
    }
  }

  togglePlay() {
    if (this.isPlaying) {
      this.audio.pause();
      this.playBtn.innerHTML = '&#9654;'; // ▶
    } else {
      this.audio.play().catch(e => console.error("Audio playback failed:", e));
      this.playBtn.innerHTML = '&#10074;&#10074;'; // ❚❚
    }
    this.isPlaying = !this.isPlaying;
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    this.audio.muted = this.isMuted;
    this.muteBtn.innerHTML = this.isMuted ? '&#9840;' : '&#9835;'; // 🕨 / ♫
  }

  nextTrack() {
    let next = this.currentTrackIndex + 1;
    if (next >= this.tracks.length) next = 0;
    this.loadTrack(next);
  }

  prevTrack() {
    let prev = this.currentTrackIndex - 1;
    if (prev < 0) prev = this.tracks.length - 1;
    this.loadTrack(prev);
  }

  initUI() {
    this.mount();
  }

  mount() {
    const container = document.querySelector('.minimal-controls');
    if (!container) {
      setTimeout(() => this.mount(), 500);
      return;
    }

    const targetContainer = container.querySelector('.audio-player-controls-row') || container;

    // Prev Button
    this.prevBtn = document.createElement('button');
    this.prevBtn.className = 'minimal-control-btn audio-player-btn';
    this.prevBtn.innerHTML = '&#9664;'; // ◀
    this.prevBtn.title = 'Previous Track';
    this.styleButton(this.prevBtn);
    this.prevBtn.addEventListener('click', () => this.prevTrack());
    targetContainer.appendChild(this.prevBtn);

    // Play/Pause Button
    this.playBtn = document.createElement('button');
    this.playBtn.className = 'minimal-control-btn audio-player-btn';
    this.playBtn.innerHTML = '&#9654;'; // ▶
    this.playBtn.title = 'Play / Pause';
    this.styleButton(this.playBtn);
    this.playBtn.addEventListener('click', () => this.togglePlay());
    targetContainer.appendChild(this.playBtn);

    // Next Button
    this.nextBtn = document.createElement('button');
    this.nextBtn.className = 'minimal-control-btn audio-player-btn';
    this.nextBtn.innerHTML = '&#9654;&#9654;'; // ▶▶
    this.nextBtn.title = 'Next Track';
    this.styleButton(this.nextBtn);
    this.nextBtn.addEventListener('click', () => this.nextTrack());
    targetContainer.appendChild(this.nextBtn);

    // Mute Button
    this.muteBtn = document.createElement('button');
    this.muteBtn.className = 'minimal-control-btn audio-player-btn';
    this.muteBtn.innerHTML = '&#9835;'; // ♫
    this.muteBtn.title = 'Mute / Unmute';
    this.styleButton(this.muteBtn);
    this.muteBtn.addEventListener('click', () => this.toggleMute());
    targetContainer.appendChild(this.muteBtn);
  }

  styleButton(btn) {
    btn.style.cssText = `
      background: transparent;
      border: 1px solid #333333;
      color: var(--fg-color, #99ccff);
      width: 41px;
      height: 41px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-weight: bold;
      transition: all 0.2s;
      opacity: 0.8;
    `;
    btn.addEventListener('mouseover', () => {
      btn.style.transform = 'scale(1.1)';
      btn.style.opacity = '1';
      btn.style.borderColor = '#99ccff';
    });
    btn.addEventListener('mouseout', () => {
      btn.style.transform = 'scale(1)';
      btn.style.opacity = '0.8';
      btn.style.borderColor = '#333333';
    });
  }
}
