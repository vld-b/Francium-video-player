import './App.css'
import playImg from "./assets/play.svg";
import pauseImg from "./assets/pause.svg";
import vid from "./clip.mp4";

let playing: boolean = true;

function playPause() {
  if (playing) {
    playing = false;
    document.getElementById("playingImg")!.setAttribute("src", pauseImg);
  } else {
    playing = true;
    document.getElementById("playingImg")!.setAttribute("src", playImg);
  }
}

function App() {

  
  return (
    <>
    <video src={vid} class="mainVideo"></video>
      <div class="bottomBar">
        <div class="bottomContentWrapper">
          <button class="playpause" onClick={playPause}>
            <img src={playImg} alt="play" class="playingImg" id="playingImg" />
          </button>
        </div>
      </div>
    </>
  )
}

export default App
