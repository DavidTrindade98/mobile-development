export default class AudioPlayer {
  #audio;
  #playlist = [];
  #trackIndex = 0;

  currentState = "pause";
  callback;
  constructor(callback) {
    this.#audio = new Audio();
    this.callback = callback;

    this.#setupEvents();
  }
  #setupEvents() {
    this.#audio.onended = () => {
      this.currentState = "ended";
      this.callback(this.currentState);
      this.next();
    };
    this.#audio.onpause = () => {
      this.currentState = "pause";
      this.callback(this.currentState);
    };
    this.#audio.onerror = (e) => {
      e.preventDefault();
      this.currentState = "error";
      this.callback(this.currentState, this.#audio.error);
    };
    this.#audio.onloadstart = () => {
      this.currentState = "loading";
      this.callback(this.currentState);
    };
    this.#audio.onplaying = () => {
      this.currentState = "play";
      this.callback(this.currentState);
    };
    this.#audio.ontimeupdate = () => {
      this.currentState = "progress";
      this.callback(this.currentState);
    };
  }

  previous() {
    this.#trackIndex--;
    if (this.#trackIndex < 0) this.#trackIndex = this.#playlist.length - 1;
    this.play(this.#playlist[this.#trackIndex], this.#playlist);
  }

  async play(track = null, playlist = null) {
    this.#playlist = playlist || this.#playlist;
    this.currentTrack = track || this.currentTrack;

    if (!this.#audio.paused) this.#audio.pause();

    try {
      this.#audio.src = this.#playlist[this.#trackIndex].url;

      await this.#audio.play();
      return true;
    } catch (error) {
      this.currentState = "error";
      return false;
    }
  }
  pause() {
    this.#audio.pause();
  }
  next() {
    this.#trackIndex++;
    if (this.#trackIndex >= this.#playlist.length) this.#trackIndex = 0;
    this.play(this.#playlist[this.#trackIndex], this.#playlist);
  }

  scrub(value) {
    this.#audio.currentTime = (this.#audio.duration * value) / 100;
  }

  get currentTrack() {
    return this.#playlist[this.#trackIndex];
  }
  set currentTrack(track) {
    for (let i = 0; i < this.#playlist.length; i++) {
      if (this.#playlist[i].id === track.id) {
        this.#trackIndex = i;
        break;
      }
    }
  }

  get volume() {
    return this.#audio.volume;
  }
  set volume(val) {
    this.#audio.volume = val / 100;
  }

  get duration() {
    return this.#audio.duration;
  }
  get currentTime() {
    return this.#audio.currentTime;
  }
}
