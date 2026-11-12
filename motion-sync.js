(() => {
  const skeleton = document.getElementById('paired-skeleton');
  const character = document.getElementById('paired-character');
  const controls = document.getElementById('motion-sync');
  const play = document.getElementById('motion-sync-play');
  const progress = document.getElementById('motion-sync-progress');
  const time = document.getElementById('motion-sync-time');
  const mute = document.getElementById('motion-sync-mute');
  const status = document.getElementById('motion-sync-status');
  const language = document.getElementById('language-switch');
  if (!skeleton || !character || !controls || !play || !progress || !time || !mute || !status) return;

  const videos = [skeleton, character];
  let phase = 'loading';
  let message = 'loading';
  let duration = 0;
  let animationFrame = 0;
  const english = () => document.documentElement.lang === 'en';
  const formatTime = value => {
    const seconds = Math.floor(Math.max(0, value));
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
  };
  const messages = {
    loading: ['正在加载视频。', 'Loading videos.'],
    ready: ['共同控制两段视频，声音来自人物视频。', 'Both videos share these controls; audio comes from the character video.'],
    playbackError: ['视频未能同时播放，请检查网络后重试。', 'The videos could not play together. Check your connection and try again.'],
    mediaError: ['视频加载失败，请刷新页面后重试。', 'A video failed to load. Refresh the page and try again.'],
  };

  function render() {
    const en = english();
    play.textContent = phase === 'playing' ? (en ? 'Pause both' : '暂停') :
      phase === 'starting' ? (en ? 'Starting…' : '正在启动…') : (en ? 'Play together' : '同步播放');
    play.disabled = !duration || phase === 'starting' || phase === 'error';
    progress.disabled = !duration || phase === 'starting' || phase === 'error';
    progress.setAttribute('aria-label', en ? 'Synchronized playback position' : '同步播放进度');
    progress.max = String(duration);
    progress.value = String(Math.min(character.currentTime || 0, duration));
    time.textContent = `${formatTime(character.currentTime || 0)} / ${formatTime(duration)}`;
    mute.textContent = character.muted ? (en ? 'Unmute' : '取消静音') : (en ? 'Mute' : '静音');
    mute.setAttribute('aria-pressed', String(character.muted));
    const statusText = messages[message][en ? 1 : 0];
    if (status.textContent !== statusText) status.textContent = statusText;
  }

  function ready() {
    if (phase !== 'loading' || !videos.every(video => video.readyState >= 1 && Number.isFinite(video.duration))) return;
    duration = Math.min(...videos.map(video => video.duration));
    if (duration <= 0) {
      phase = 'error';
      message = 'mediaError';
    } else {
      phase = 'paused';
      message = 'ready';
    }
    render();
  }

  function pauseBoth() {
    cancelAnimationFrame(animationFrame);
    videos.forEach(video => video.pause());
    if (phase !== 'error') phase = 'paused';
    render();
  }

  function follow() {
    if (phase !== 'playing') return;
    if (!skeleton.seeking && Math.abs(skeleton.currentTime - character.currentTime) > 0.1) {
      skeleton.currentTime = character.currentTime;
    }
    render();
    animationFrame = requestAnimationFrame(follow);
  }

  play.addEventListener('click', async () => {
    if (phase === 'playing') {
      pauseBoth();
      return;
    }
    if (phase !== 'paused') return;
    if (character.currentTime >= duration - 1 / 30) videos.forEach(video => { video.currentTime = 0; });
    skeleton.currentTime = character.currentTime;
    phase = 'starting';
    message = 'ready';
    render();
    const attempts = await Promise.allSettled(videos.map(video => video.play()));
    if (phase === 'error') return;
    if (attempts.some(attempt => attempt.status === 'rejected')) {
      message = 'playbackError';
      pauseBoth();
      return;
    }
    skeleton.currentTime = character.currentTime;
    phase = 'playing';
    render();
    animationFrame = requestAnimationFrame(follow);
  });

  progress.addEventListener('input', () => {
    const position = Number(progress.value);
    videos.forEach(video => { video.currentTime = position; });
    render();
  });
  mute.addEventListener('click', () => {
    character.muted = !character.muted;
    render();
  });
  videos.forEach(video => {
    video.addEventListener('loadedmetadata', ready);
    video.addEventListener('ended', pauseBoth);
    video.addEventListener('error', () => {
      phase = 'error';
      message = 'mediaError';
      pauseBoth();
    });
  });
  character.addEventListener('timeupdate', render);
  if (language) language.addEventListener('click', render);

  skeleton.muted = true;
  videos.forEach(video => { video.controls = false; });
  controls.hidden = false;
  ready();
  render();
})();
