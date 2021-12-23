/*
	main.js is primarily responsible for hooking up the UI to the rest of the application 
	and setting up the main event loop
*/

// We will write the functions in this file in the traditional ES5 way
// In this instance, we feel the code is more readable if written this way
// If you want to re-write these as ES6 arrow functions, to be consistent with the other files, go ahead!

import * as utils from './utils.js';
import * as audio from './audio.js';
import * as canvas from './canvas.js';
import * as presets from './presets.js';
const drawParams = {
    showGradient: true,
    showBars: true,
    showCircles: true,
    showNoise: true,
    showInvert: true,
    showEmboss: true,
    showRandGrad: true
}
const gradientBtn = document.querySelector("#gradientCB");
const barsBtn = document.querySelector("#barsCB");
const circleBtn = document.querySelector("#circlesCB");
const noiseBtn = document.querySelector("#noiseCB");
const invertBtn = document.querySelector("#invertCB");
const embossBtn = document.querySelector("#embossCB");
const playTime = document.querySelector("#playTime");
const backBtn = document.querySelector("#backButton");
const randGradBtn = document.querySelector("#randGradCB");
const setRPButton = document.querySelector("#setRPButton");
const gotoRPButton = document.querySelector("#gotoRPButton");
let progressSlider = document.querySelector("#progressSlider");
let userTrack, userBg;
// 1 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
    sound1: "media/REMEMBER.flac"
});

function init() {
    audio.setupWebAudio(DEFAULTS.sound1);
    console.log("init called");
    console.log(`Testing utils.getRandomColor() import: ${utils.getRandomColor()}`);
    let canvasElement = document.querySelector("canvas"); // hookup <canvas> element
    setupUI(canvasElement);
    canvas.setupCanvas(canvasElement, audio.analyserNode);
    presets.loadJsonFetch("app-data/presets.json",presets.dataLoaded);
    loop();
}

function setupUI(canvasElement) {
    userTrack = document.querySelector("#userTrack");
    userBg = document.querySelector("#userBg");


    // A - hookup fullscreen button
    const fsButton = document.querySelector("#fsButton");

    userTrack.addEventListener("change", loadUserTrack, false)
    //userBg.addEventListener("change", loadBG, false)


    function loadUserTrack() {
        try{
            if (this.files[0] != undefined) {
                userFile = audio.loadSoundFile(URL.createObjectURL(this.files[0]));
                let userUpload = document.createElement("option");
                userUpload.text = this.files[0].name;
                userUpload.value = URL.createObjectURL(this.files[0]);
                userUpload.selected = true;
                trackSelect.appendChild(userUpload);
                if (playButton.dataset.playing == "yes") {
                    playButton.dispatchEvent(new MouseEvent("click"));
                }
            }
        }
        catch{
            console.log("Error has occured, song changed during play")
        }
    };


    // add .onclick event to button
    fsButton.onclick = e => {
        console.log("init called");
        utils.goFullscreen(canvasElement);
    };
    // add .onclick event to button
    playButton.onclick = e => {
        console.log(`audioctx.state before = ${audio.audioCtx.state}`);
        progressSlider.step = 1/parseInt(audio.currentDuration());
        // check if context is in suspended state (autoplay policy)
        if (audio.audioCtx.state == "suspended") {
            audio.audioCtx.resume();
        }
        console.log(`audioCtx.state after ${audio.audioCtx.state}`);
        if (e.target.dataset.playing == "no") {
            // if track is currently paused, play it
            audio.playCurrentSound();
            e.target.dataset.playing = "yes"; // our css will set the text to "Pause"
            // if track Is playing, pause it
        } else {
            audio.pauseCurrentSound();
            e.target.dataset.playing = "no"; // our CSS will set the text to "Play"
        }
    };
    // C - hookup volume slider & label
    let volumeSlider = document.querySelector("#volumeSlider");
    let volumeLabel = document.querySelector("#volumeLabel");
    // add .oninput event to slider
    volumeSlider.oninput = e => {
        // set the gain
        audio.setVolume(e.target.value);
        // update value of label to match value of slider
        volumeLabel.innerHTML = Math.round((e.target.value / 2 * 100));
    };
    progressSlider.oninput = e => {
        audio.setCurrentPlayTime(e.target.value*parseInt(audio.currentDuration()))
    };
    backBtn.onclick = e => {
        audio.resetPlayTime();
    };
    setRPButton.onclick = e => {
        audio.setResetPoint();
    };
    gotoRPButton.onclick = e => {
        audio.gotoResetPoint();
    };
    // set value of label to match initial value of slider
    volumeSlider.dispatchEvent(new Event("input"));
    // D - hookup track <select>
    let trackSelect = document.querySelector("#trackSelect");
    // add .onchange event to <select>
    trackSelect.onchange = e => {
        audio.loadSoundFile(e.target.value);
        // pause the current track if it is playing
        if (playButton.dataset.playing == "yes") {
            try{
                playbutton.dispatchEvent(new MouseEvent("click"));
            }
            catch{
                console.log("Error has occured, song changed during play")
            }
        }
    };

} // end setupUI
function loop() {
    /* NOTE: This is temporary testing code that we will delete in Part II */
    requestAnimationFrame(loop);
    if (gradientBtn.checked == false) {
        drawParams.showGradient = false;
    } else {
        drawParams.showGradient = true;
    }
    if (barsBtn.checked == false) {
        drawParams.showBars = false;
    } else {
        drawParams.showBars = true;
    }
    if (circleBtn.checked == false) {
        drawParams.showCircles = false;
    } else {
        drawParams.showCircles = true;
    }
    if (noiseBtn.checked == false) {
        drawParams.showNoise = false;
    } else {
        drawParams.showNoise = true;
    }
    if (invertBtn.checked == false) {
        drawParams.showInvert = false;
    } else {
        drawParams.showInvert = true;
    }
    if (embossBtn.checked == false) {
        drawParams.showEmboss = false;
    } else {
        drawParams.showEmboss = true;
    }
    if (randGradBtn.checked == false) {
        drawParams.showRandGrad = false;
    } else {
        drawParams.showRandGrad = true;
    }
    canvas.draw(drawParams, audio.getPlayPercent());
    if (playButton.dataset.playing == "yes") {
        playTime.innerHTML = `Current Play Time: ${parseInt(audio.currentPlayTime())}(s) / ${parseInt(audio.currentDuration())}(s)`;
        progressSlider.value= parseInt(audio.currentPlayTime()) / parseInt(audio.currentDuration());
    }
    // 1) create a byte array (values of 0-255) to hold the audio data
    // normally, we do this once when the program starts up, NOT every frame
    /*let audioData = new Uint8Array(audio.analyserNode.fftSize / 2);

    // 2) populate the array of audio data *by reference* (i.e. by its address)
    audio.analyserNode.getByteTimeDomainData(data);

    // 3) log out the array and the average loudness (amplitude) of all of the frequency bins
    console.log(audioData);

    console.log("-----Audio Stats-----");
    let totalLoudness = audioData.reduce((total, num) => total + num);
    let averageLoudness = totalLoudness / (audio.analyserNode.fftSize / 2);
    let minLoudness = Math.min(...audioData); // ooh - the ES6 spread operator is handy!
    let maxLoudness = Math.max(...audioData); // ditto!
    // Now look at loudness in a specific bin
    // 22050 kHz divided by 128 bins = 172.23 kHz per bin
    // the 12th element in array represents loudness at 2.067 kHz
    let loudnessAt2K = audioData[11];
    console.log(`averageLoudness = ${averageLoudness}`);
    console.log(`minLoudness = ${minLoudness}`);
    console.log(`maxLoudness = ${maxLoudness}`);
    console.log(`loudnessAt2K = ${loudnessAt2K}`);
    console.log("---------------------");*/
}
export {
    init, drawParams, gradientBtn, barsBtn, circleBtn, noiseBtn, invertBtn, embossBtn, randGradBtn
};