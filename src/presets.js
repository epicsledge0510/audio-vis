import * as main from './main.js';
const loadJsonFetch = (url,callback) => {
    fetch(url)
        .then(response => {
            // If the response is successful, return the JSON
            if (response.ok) {
                return response.json();
            }

            // else throw an error that will be caught below
            return response.text().then(text =>{
                throw text;
            });
        }) // send the response.json() promise to the next .then()
        .then(json => { // the second promise is resolved, and `json` is a JSON object
            callback(json);
        }).catch(error => {
            // error
            console.log(error);
    });
};
const dataLoaded = json => {
    console.log(json);
    console.log(json.presets.showGradient);
    if(json.presets.showGradient){
        main.drawParams.showGradient=true;
        main.gradientBtn.checked = true;
    }
    if(json.presets.showBars){
        main.drawParams.showBars=true;
        main.barsBtn.checked = true;
    }
    if(json.presets.showCircles){
        main.drawParams.showCircles=true;
        main.circleBtn.checked = true;
    }
    if(json.presets.showNoise){
        main.drawParams.showNoise=true;
        main.noiseBtn.checked = true;
    }
    if(json.presets.showInvert){
        main.drawParams.showInvert=true;
        main.invertBtn.checked = true;
    }
    if(json.presets.showEmboss){
        main.drawParams.showEmboss=true;
        main.embossBtn.checked = true;
    }
    if(json.presets.showRandGrad){
        main.drawParams.showRandGrad=true;
        main.randGradBtn.checked = true;
    }
};
loadJsonFetch("app-data/presets.json",dataLoaded);
export{
    loadJsonFetch,
    dataLoaded
}