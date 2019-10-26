const Muse = require('muse-js') // this node.js style import needs to be browserified
// $ browserify index.js -o bundle.js


const graphTitles = Array.from(document.querySelectorAll('.electrode-item h3'));

// hook onto and store the cavas div/ canvas context
const canvases = Array.from(document.querySelectorAll('.electrode-item canvas'));
const canvasCtx = canvases.map((canvas) => canvas.getContext('2d'));
const blinkStatus = document.querySelector('#blinkStatus');

const neuralNetwork = ml5.neuralNetwork(4, 2);
console.log(neuralNetwork)

var recording = false
var finishedTraining = false

window.record = function (){
  recording = true
}

window.stop = function (){
  recording = false
}

storedResults = [[],[],[],[]]

// for each 15 element array returned by the eegReading, adjust the appropriate canvas with a 
// histogram like plot
function plot(reading) {
  // identify the appropriate plot for the current electrode reading
  const canvas = canvases[reading.electrode];
  const context = canvasCtx[reading.electrode];
  
  // escape the function if the electrode is invalid
  if (!context) {
    return;
  }
  const width = canvas.width / 12.0;
  const height = canvas.height / 2.0;
  context.fillStyle = 'black';
  context.clearRect(0, 0, canvas.width, canvas.height);
  
  // loop through each eeg reading (15 per array) and create a rectangle cooresponding
  // to the appropriate voltage
  for (let i = 0; i < reading.samples.length; i++) {
    const sample = reading.samples[i] / 10.;
    if (sample > 0) {
      context.fillRect(i * 25, height - sample, width, sample);
    } else {
      context.fillRect(i * 25, height, width, -sample);
    }
  }
}

async function main() {
  
  // initiate the web-bluetooth conection request
  
  let client = new Muse.MuseClient();
  await client.connect();
  await client.start();
  
  client.eegReadings.subscribe(reading => {
    plot(reading);
    graphTitles[reading.electrode].textContent = Math.max.apply(null, reading.samples).toString()
    if(reading.electrode === 0){
      if(Math.max.apply(null, reading.samples) >= 95){
        blinkStatus.textContent = "(>*.*)> Blink"
      }
      else {
        blinkStatus.textContent = "(>o.o)> Eyes Open"
      }
    }
    if(recording === true){
      storedResults[reading.electrode].push(Math.max.apply(null, reading.samples));
    }
  });
  
  client.accelerometerData.subscribe(acceleration => {
    return null
  });
}


// web-bluetooth can only be started by a user gesture.
// This funciton is called by an html button
window.connect = function (){
  main();
}

// log stored Results. For testing purposes
window.showRecorded = function (){
  console.log(storedResults)
}

function createFeatures(resultsArray, classification) {
  recording = false
  for(let i = 0; i < 200; i+=1){
    const x = resultsArray.map(electrode => (electrode[i]))
    var y = [0., 0.]
    y[classification] = 1.
    console.log(x)
    console.log(y)
    neuralNetwork.data.addData(x, y)
  }
  storedResults  = [[],[],[],[]]
}

window.classify1 = function (){
  createFeatures(storedResults, 1)
  recording = false
}

window.classify0 = function(){
  createFeatures(storedResults, 0)
  recording = false
}

window.train = function (){
  // normalize your data
  neuralNetwork.data.normalize();
  // train your model
  neuralNetwork.train();
  finishedTraining = true
  neuralNetwork
}

window.predict = function(){
  const x =  storedResults.map(electrode => (electrode[5])) 
  neuralNetwork.predict( x, (err, results) => {
    console.log(results);
  })
  storedResults = [[],[],[],[]]
}