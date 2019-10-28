const Muse = require('muse-js') // this node.js style import needs to be browserified
// $ browserify index.js -o bundle.js


const graphTitles = Array.from(document.querySelectorAll('.electrode-item h3'));

// hook onto and store the cavas div/ canvas context
const canvases = Array.from(document.querySelectorAll('.electrode-item canvas'));
const canvasCtx = canvases.map((canvas) => canvas.getContext('2d'));
const blinkStatus = document.querySelector('#blinkStatus');

const networkParams = {
  task: 'classification',
  //activationHidden: 'sigmoid',
  // activationOutput: 'sigmoid',
  debug: true,
  learningRate: 4.,
  inputs: 4, // or the names of the data properties ['temperature', 'precipitation']
  outputs: 2, // or the names of the data properties ['thermalComfort']
  hiddenUnits: 7,
  // modelMetrics: ['accuracy'],
  modelLoss: 'categoricalCrossentropy',
  modelOptimizer: 'adam',
}
const neuralNetwork = ml5.neuralNetwork(networkParams);
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

let CalculateRMS = function (arr) { 
  
    // Map will return another array with each  
    // element corresponding to the elements of 
    // the original array mapped according to 
    // some relation 
    let Squares = arr.map((val) => (val*val)); 
  
    // Function reduce the array to a value 
    // Here, all the elements gets added to the first 
    // element which acted as the accumulator initially. 
    let Sum = Squares.reduce((acum, val) => (acum + val)); 
  
    Mean = Sum/arr.length; 
    return Math.sqrt(Mean); 
} 

async function main() {
  
  // initiate the web-bluetooth conection request
  
  let client = new Muse.MuseClient();
  await client.connect();
  await client.start();
  
  client.eegReadings.subscribe(reading => {
    plot(reading);
    graphTitles[reading.electrode].textContent = CalculateRMS(reading.samples).toString()
    if(reading.electrode === 0){
      if(Math.max.apply(null, reading.samples) >= 95){
        blinkStatus.textContent = "(>*.*)> Blink"
      }
      else {
        blinkStatus.textContent = "(>o.o)> Eyes Open"
      }
    }
    if(recording === true){
      // storedResults[reading.electrode].push(Math.abs(Math.max.apply(null, reading.samples)));
      storedResults[reading.electrode].push(CalculateRMS(reading.samples))
    }
  });
  
  client.accelerometerData.subscribe(acceleration => {
    // console.log(acceleration)
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
  for(let i = 0; i < resultsArray[3].length; i+=1){
    const x = resultsArray.map(electrode => (electrode[i]))
    var y = [classification]
    console.log(x)
    console.log(y)
    neuralNetwork.data.addData(x, y)
  }
  storedResults  = [[],[],[],[]]
}

window.classify1 = function (){
  createFeatures(storedResults, "rest")
  recording = false
}

window.classify0 = function(){
  createFeatures(storedResults, "active")
  recording = false
}

window.train = function (){
  // normalize your data
  neuralNetwork.data.normalize();
  // train your model
  
  const trainingOptions={
    batchSize: 128,
    epochs: 4000
  }
  function whileTraining(epoch, loss){
    console.log(`epoch: ${epoch}, loss:${loss}`);
  }
  function doneTraining(){
    console.log('done!');
  }
  neuralNetwork.train(trainingOptions, whileTraining, doneTraining)
  
  finishedTraining = true
}

function average(arr) {
  var sum = 0.
  arr.forEach((value, index) => {sum += value})
  sum = sum / arr.length
  return sum
}

function getProbabilities(){
  
  recording = false
  var classificationArrayActive = []
  var classificationArrayRest = []
  
  storedResults[3].forEach((value, index) => {
    const x = storedResults.map(electrode => (electrode[index]))
    neuralNetwork.classify(x, (err, results) => {
      classificationArrayActive.push(results[0].confidence)
      classificationArrayRest.push(results[1].confidence)
    })
  })
  return [classificationArrayActive, classificationArrayRest]
}

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

window.predict = function(){
  value = getProbabilities()
  sleep(1000).then(() => { 
    console.log(value)
    probAcive = average(value[0])
    probRest = average(value[1])
    console.log(probAcive)
    console.log(probRest)
    document.querySelector('#active').textContent = probAcive
    document.querySelector('#rest').textContent = probAcive
    storedResults = [[],[],[],[]]
  })
}
