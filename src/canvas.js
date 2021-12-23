/*
	The purpose of this file is to take in the analyser node and a <canvas> element: 
	  - the module will create a drawing context that points at the <canvas> 
	  - it will store the reference to the analyser node
	  - in draw(), it will loop through the data in the analyser node
	  - and then draw something representative on the canvas
	  - maybe a better name for this file/module would be *visualizer.js* ?
*/

import * as utils from './utils.js';
import * as main from './main.js';

let ctx, canvasWidth, canvasHeight, gradient, analyserNode, audioData;
const trackSlctr = document.querySelector("#trackSelect");



function setupCanvas(canvasElement, analyserNodeRef) {
    // create drawing context
    ctx = canvasElement.getContext("2d");
    canvasWidth = canvasElement.width;
    canvasHeight = canvasElement.height;
    // create a gradient that runs top to bottom
    // keep a reference to the analyser node
    analyserNode = analyserNodeRef;
    // this is the array where the analyser data will be stored
    audioData = new Uint8Array(analyserNode.fftSize / 2);
}

function draw(params = {}, playtime) {
    // 1 - populate the audioData array with the frequency data from the analyserNode
    // notice these arrays are passed "by reference" 
    analyserNode.getByteFrequencyData(audioData);
    // OR
    //analyserNode.getByteTimeDomainData(audioData); // waveform data

    // 2 - draw background
    ctx.save();
    ctx.fillStyle = gradient;
    ctx.globalAlpha = .1;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.restore();

    // 3 - draw gradient
    if (params.showGradient) {
        ctx.save();
        let gradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
        if(trackSlctr.value == "media/Almighty.flac"){
            gradient.addColorStop(0, '#FF0000');
            gradient.addColorStop(0.4, '#FDFFFC');
            gradient.addColorStop(0.5, '#FDFFFC');
            gradient.addColorStop(1, '#000000');
        }
        else if(trackSlctr.value == "media/Umapyoi Densetsu.mp3"){
            gradient.addColorStop(0, '#570040');
            gradient.addColorStop(0.3, '#E600FF');
            gradient.addColorStop(0.6, '#E600FF');
            gradient.addColorStop(1, '#FDFFFC');
        }
        else if(trackSlctr.value == "media/Sakuramitsutsuki.flac"){
            gradient.addColorStop(0, '#000000');
            gradient.addColorStop(0.3, '#B10000');
            gradient.addColorStop(0.6, '#FFFFFF');
            gradient.addColorStop(1, '#7487FC');
        }
        else{
            if(main.drawParams.showRandGrad == true){
                setRandomGradient(gradient)
            }
            else{
                gradient.addColorStop(0, '#07393C');
                gradient.addColorStop(0.3, '#2C666E');
                gradient.addColorStop(0.6, '#5EA2AF');
                gradient.addColorStop(1, '#90DDF0');
            }
        }
        /*else{
            gradient.addColorStop(0, 'rgba(Math.random(0,255), Math.random(0,255), Math.random(0,255), Math.random(0,1))');
            gradient.addColorStop(0.3, 'rgba(Math.random(0,255), Math.random(0,255), Math.random(0,255), Math.random(0,1))');
            gradient.addColorStop(0.6, 'rgba(Math.random(0,255), Math.random(0,255), Math.random(0,255), Math.random(0,1))');
            gradient.addColorStop(1, 'rgba(Math.random(0,255), Math.random(0,255), Math.random(0,255), Math.random(0,1))');
        }*/
        ctx.fillStyle = gradient;
        ctx.globalAlpha = .3;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.restore();
    } 
    else {
        ctx.save();
        ctx.fillStyle = 'black';
        ctx.globalAlpha = 1;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.restore();
    }
    // 4 - draw bars
    if (params.showBars) {
        let barSpacing = 4;
        let margin = 5;
        let screenWidthForBars = canvasWidth - (audioData.length * barSpacing) - margin * 2;
        let barWidth = screenWidthForBars / audioData.length;
        let barHeight = 100;
        let topSpacing = 100;
        ctx.save();
        if(params.showGradient)
        {
            ctx.fillStyle = '#EEEEEE';
            ctx.strokeStyle = 'rgba(0,0,0,0.5)';
        }
        else
        {
            ctx.fillStyle = '#0D0D0D';
            ctx.strokeStyle = 'rgba(255,255,255,255.5)';
        }

        

        for(let i=0; i<audioData.length; i++){
            ctx.save();
            if(i/audioData.length < playtime)
            {
                if(params.showGradient)
                {
                    ctx.fillStyle = '#0D0D0D';
                }
                else
                {
                    ctx.fillStyle = '#90DDF0';
                }
            }

            ctx.fillRect(margin + i*(barWidth + barSpacing), topSpacing + 256-audioData[i], barWidth, barHeight);
            ctx.strokeRect(margin + i*(barWidth + barSpacing), topSpacing + 256-audioData[i], barWidth, barHeight);
            ctx.restore();
        }
        ctx.restore();
    }
    // 5 - draw circles
    if (params.showCircles) {
        let maxRadius = canvasHeight / 4;
        ctx.save();
        ctx.globalAlpha = 0.5;
        for (let i = 0; i < audioData.length; i++) {
            let percent = audioData[i] / 255;

            let circleRadius = percent * maxRadius;
            ctx.beginPath();
            ctx.fillStyle = utils.makeColor(255, 111, 111, .34 - percent / 3.0);
            ctx.arc(canvasWidth / 2, canvasHeight / 2, circleRadius * 1.5, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();

            ctx.beginPath();
            ctx.fillStyle = utils.makeColor(0, 0, 255, .10 - percent / 10.0);
            ctx.arc(canvasWidth / 2, canvasHeight / 2, circleRadius * 1.5, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();

            ctx.save();
            ctx.beginPath();
            ctx.fillStyle = utils.makeColor(200, 200, 0, .5 - percent / 5.0);
            ctx.arc(canvasWidth / 2, canvasHeight / 2, circleRadius * .50, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();
            ctx.restore();
        }
        ctx.restore();
    }
    // 6 - bitmap manipulation
    // TODO: right now. we are looping though every pixel of the canvas (320,000 of them!), 
    // regardless of whether or not we are applying a pixel effect
    // At some point, refactor this code so that we are looping though the image data only if
    // it is necessary

    // A) grab all of the pixels on the canvas and put them in the `data` array
    // `imageData.data` is a `Uint8ClampedArray()` typed array that has 1.28 million elements!
    // the variable `data` below is a reference to that array 
    let imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    let data = imageData.data;
    let length = data.length;
    let width = imageData.width;
    // B) Iterate through each pixel, stepping 4 elements at a time (which is the RGBA for 1 pixel)
    for(let i = 0; i < length; i+= 4)
    {
		// C) randomly change every 20th pixel to red
        if ( params.showNoise && Math.random() < .05)
        {
			// data[i] is the red channel
			// data[i+1] is the green channel
			// data[i+2] is the blue channel
			// data[i+3] is the alpha channel
			data[i] = data[i+1] = data[i+2] = 255;// zero out the red and green and blue channels
			//data[i] = 255;// make the red channel 100% red
        } // end if
        
        if(params.showInvert)
        {
        let red = data[i], green = data[i+1], blue = data[i+2];
        data[i] = 255 - red;
        data[i+1] = 255 - green;
        data[i+2] =255 - blue;
        }
    }
    if (params.showEmboss) {
        for (let i = 0; i < length; i++) {
            if (i % 4 == 3) continue;
            data[i] = 127 + 2 * data[i] - data[i + 4] - data[i + width * 4];
        }
    }
    // D) copy image data back to canvas
    ctx.putImageData(imageData, 0, 0);
}
function setRandomGradient(gradient){
    gradient.addColorStop(0, utils.getRandomColor());
    gradient.addColorStop(0.3, utils.getRandomColor());
    gradient.addColorStop(0.6, utils.getRandomColor());
    gradient.addColorStop(1, utils.getRandomColor());
}
export {
    setupCanvas,
    draw
};