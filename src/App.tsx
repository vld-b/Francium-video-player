import "./App.css"
import { Signal, createSignal, createEffect, Show, untrack, onMount } from 'solid-js';
import { invoke } from "@tauri-apps/api/tauri"
import  { convertFileSrc } from "@tauri-apps/api/tauri";

let [playing, setPlaying]: Signal<boolean> = createSignal(false);
let [videoComponent, setVideoComponent] = createSignal<HTMLVideoElement>();
let [progressSlider, setProgressSlider] = createSignal<HTMLInputElement>(); 
let [audioSlider, setAudioSlider] = createSignal<HTMLInputElement>();
let [currentTimeLabel, setCurrentTimeLabel] = createSignal<HTMLLabelElement>();
let [durationLabel, setDurationLabel] = createSignal<HTMLLabelElement>();

window.oncontextmenu = (e) => {
  e.preventDefault();
  return;
};

document.addEventListener("keydown", e => {
  e.preventDefault();
  if (e.key == " ") {
    setPlaying(!playing());
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  await invoke<string>("transfer_vid").then((vidSrc) => {
    videoComponent()!.src = convertFileSrc(vidSrc);
  });
});

function PlayImg() {
  // <!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
  return <svg xmlns="http://www.w3.org/2000/svg" /*height="16" width="12"*/ viewBox="0 0 384 512"><path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/></svg>;
}

function PauseImg() {
  // <!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
  return <svg xmlns="http://www.w3.org/2000/svg" /*height="16" width="10"*/ viewBox="0 0 320 512"><path d="M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm192 0c-26.5 0-48 21.5-48 48V400c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H240z"/></svg>;
}

function formatTime(time: number) {
  return Math.floor(time/3600).toString() + ":" + Math.floor(time/60).toString() + ":" + Math.floor(time%60).toString()
}

function updateTime() {
  let time = videoComponent()!.currentTime;
  progressSlider()!.value = time.toString();
  currentTimeLabel()!.innerText = formatTime(time);
}

function setVolume() {
  const audioSliderValue: string = audioSlider()?.value!;
  const vid = videoComponent();
  if(!vid || !audioSlider) return;
  vid.volume = parseInt(audioSliderValue) / 100;
}

function setupComponents() {
  progressSlider()!.max = videoComponent()!.duration.toString();
  durationLabel()!.innerText = formatTime(videoComponent()!.duration);
}

function App() {
  // Effect to update the video component playing state
  createEffect(() => {
    const isPlaying: boolean = playing();
    const vid = untrack(videoComponent);
    if(!vid) return;
    if (isPlaying) {
      vid.pause();
    } else {
      vid.play();
    }
  });

  // Effect to update the progress slider max value to the duration of the clip
  onMount(() => {
    const vid = videoComponent();
    const slidr = progressSlider();
    if (!vid ||!slidr) return;
    videoComponent()?.addEventListener("canplay", setupComponents);
  });
  
  return (
    <>
      <div data-tauri-drag-region class="dragBar" />
      <video ref={setVideoComponent} class="mainVideo" id="mainVideo" onTimeUpdate={updateTime} onEnded={() => setPlaying(false)} autoplay />
      <div class="utilControl"></div>
      <div class="bottomBar">
        <div class="progressComponents">
          <label ref={setCurrentTimeLabel} class="timeLabel">00:00</label>
          <input ref={setProgressSlider} type="range" name="progress" class="progress" step="0.1" onInput={() => {videoComponent()!.currentTime = parseFloat(progressSlider()!.value)}} />
          <label ref={setDurationLabel} class="timeLabel">00:00</label>
        </div>
        <div class="bottomContentWrapper">
          <button class="playpause" id="playpause" onClick={() => setPlaying(!playing())}>
            <Show when={playing()} fallback={<PauseImg />}>
              <PlayImg />
            </Show>
          </button>
          <input ref={setAudioSlider} type="range" min="0" max="100" value="100" step="0.1" class="volumeBar" onInput={setVolume} />
        </div>
      </div>
    </>
  )
}

export default App