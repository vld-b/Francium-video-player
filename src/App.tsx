import "./App.css"
import { Signal, createSignal, createEffect, Show, untrack, onMount } from 'solid-js';
import { invoke } from "@tauri-apps/api/tauri"
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { appWindow } from "@tauri-apps/api/window";

let [playing, setPlaying]: Signal<boolean> = createSignal(false);
let [videoComponent, setVideoComponent] = createSignal<HTMLVideoElement>();
let [progressSlider, setProgressSlider] = createSignal<HTMLInputElement>();
let [audioSlider, setAudioSlider] = createSignal<HTMLInputElement>();
let [currentTimeLabel, setCurrentTimeLabel] = createSignal<HTMLLabelElement>();
let [durationLabel, setDurationLabel] = createSignal<HTMLLabelElement>();
let [maximizeBtn, setMaximizeBtn] = createSignal<HTMLButtonElement>();
let [windowMaximized, setWindowMaximized] = createSignal(false);
let [fullscreenBtn, setFullscreenBtn] = createSignal<HTMLButtonElement>();
let [windowFullscreen, setWindowFullscreen] = createSignal(false);
let [dragBar, setDragBar] = createSignal<HTMLDivElement>();
let canMaximiseUnmaximise: boolean = true;

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
  return <svg xmlns="http://www.w3.org/2000/svg" /*height="16" width="12"*/ viewBox="0 0 384 512"><path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z" /></svg>;
}

function PauseImg() {
  // <!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
  return <svg xmlns="http://www.w3.org/2000/svg" /*height="16" width="10"*/ viewBox="0 0 320 512"><path d="M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm192 0c-26.5 0-48 21.5-48 48V400c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H240z" /></svg>;
}

function XIcon() {
  // <!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
}

function MinimizeIcon() {
  // <!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z"/></svg>
}

function FullscreenIcon() {
  // <!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M384 80c8.8 0 16 7.2 16 16V416c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V96c0-8.8 7.2-16 16-16H384zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64z"/></svg>
}

function UnmaximiseIcon() {
  // <!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M432 48H208c-17.7 0-32 14.3-32 32V96H128V80c0-44.2 35.8-80 80-80H432c44.2 0 80 35.8 80 80V304c0 44.2-35.8 80-80 80H416V336h16c17.7 0 32-14.3 32-32V80c0-17.7-14.3-32-32-32zM48 448c0 8.8 7.2 16 16 16H320c8.8 0 16-7.2 16-16V256H48V448zM64 128H320c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V192c0-35.3 28.7-64 64-64z"/></svg>
}

function Expand() {
  // <!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M344 0H488c13.3 0 24 10.7 24 24V168c0 9.7-5.8 18.5-14.8 22.2s-19.3 1.7-26.2-5.2l-39-39-87 87c-9.4 9.4-24.6 9.4-33.9 0l-32-32c-9.4-9.4-9.4-24.6 0-33.9l87-87L327 41c-6.9-6.9-8.9-17.2-5.2-26.2S334.3 0 344 0zM168 512H24c-13.3 0-24-10.7-24-24V344c0-9.7 5.8-18.5 14.8-22.2s19.3-1.7 26.2 5.2l39 39 87-87c9.4-9.4 24.6-9.4 33.9 0l32 32c9.4 9.4 9.4 24.6 0 33.9l-87 87 39 39c6.9 6.9 8.9 17.2 5.2 26.2s-12.5 14.8-22.2 14.8z"/></svg>
}

function Collapse() {
  // <!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M439 7c9.4-9.4 24.6-9.4 33.9 0l32 32c9.4 9.4 9.4 24.6 0 33.9l-87 87 39 39c6.9 6.9 8.9 17.2 5.2 26.2s-12.5 14.8-22.2 14.8H296c-13.3 0-24-10.7-24-24V72c0-9.7 5.8-18.5 14.8-22.2s19.3-1.7 26.2 5.2l39 39L439 7zM72 272H216c13.3 0 24 10.7 24 24V440c0 9.7-5.8 18.5-14.8 22.2s-19.3 1.7-26.2-5.2l-39-39L73 505c-9.4 9.4-24.6 9.4-33.9 0L7 473c-9.4-9.4-9.4-24.6 0-33.9l87-87L55 313c-6.9-6.9-8.9-17.2-5.2-26.2s12.5-14.8 22.2-14.8z"/></svg>
}

function formatTime(time: number) {
  return Math.floor(time / 3600).toString() + ":" + Math.floor(time / 60).toString() + ":" + Math.floor(time % 60).toString()
}

function updateTime() {
  let time = videoComponent()!.currentTime;
  progressSlider()!.value = time.toString();
  currentTimeLabel()!.innerText = formatTime(time);
}

function setVolume() {
  const audioSliderValue: string = audioSlider()?.value!;
  const vid = videoComponent();
  if (!vid || !audioSlider) return;
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
    if (!vid) return;
    if (isPlaying) {
      vid.pause();
    } else {
      vid.play();
    }
  });

  // Effect to update the progress slider max value to the duration of the clip
  onMount(async () => {
    const vid = videoComponent();
    const slidr = progressSlider();
    setWindowMaximized(await appWindow.isMaximized());
    setWindowFullscreen(await appWindow.isFullscreen());
    if (!vid || !slidr) return;
    videoComponent()?.addEventListener("canplay", setupComponents);
  });

  return (
    <>
      <div class="dragBarAccenter" />
      <div data-tauri-drag-region ref={setDragBar} class="dragBar">
        <div class="windowControls">
          <button class="windowControl" ref={setFullscreenBtn} onClick={() => {
            if (windowFullscreen()) {
              // Conditions for not fulscreen
              appWindow.setFullscreen(false);
              setWindowFullscreen(false);
              dragBar()!.dataset.tauriDragRegion = "";
              appWindow.setResizable(true);
              appWindow.setMaximizable(true);
              canMaximiseUnmaximise = true;
              maximizeBtn()!.disabled = false;
            } else {
              // Conditions for fullscreen
              appWindow.setFullscreen(true);
              setWindowFullscreen(true);
              delete dragBar()!.dataset.tauriDragRegion;
              appWindow.setResizable(false);
              canMaximiseUnmaximise = false;
              maximizeBtn()!.disabled = true;
            }
          }}>
            <Show when={windowFullscreen()} fallback={<Expand />}>
              < Collapse />
            </Show>
          </button>
          <button class="windowControl" onClick={() => {appWindow.minimize()}}> <MinimizeIcon /> </button>
          <button class="windowControl" ref={setMaximizeBtn} onClick={() => {
            if (windowMaximized() && canMaximiseUnmaximise) {
              appWindow.unmaximize();
              setWindowMaximized(false);
              fullscreenBtn()!.disabled = false;
            } else if (!windowMaximized() && canMaximiseUnmaximise) {
              appWindow.maximize();
              setWindowMaximized(true);
              fullscreenBtn()!.disabled = true;
            }
          }}>
            <Show when={windowMaximized()} fallback={<FullscreenIcon />}>
              < UnmaximiseIcon />
            </Show>
          </button>
          <button class="windowControl closeBtn" onClick={() => {appWindow.close()}}> <XIcon /> </button>
        </div>
      </div>
      <video ref={setVideoComponent} class="mainVideo" id="mainVideo" onTimeUpdate={updateTime} onEnded={() => setPlaying(false)} autoplay></video>
      <div class="utilControl"></div>
      <div class="bottomBar">
        <div class="progressComponents">
          <label ref={setCurrentTimeLabel} class="timeLabel">00:00</label>
          <input ref={setProgressSlider} type="range" name="progress" class="progress" step="0.1" onInput={() => { videoComponent()!.currentTime = parseFloat(progressSlider()!.value) }} />
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