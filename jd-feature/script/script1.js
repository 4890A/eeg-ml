// minimal heatmap instance configuration
var heatmapInstance = h337.create({
  // only container is required, the rest will be defaults
  container: document.querySelector('.heatmap_max')
});

// now generate some random data
var points = [];
var max = 0;
var width = 388;
var height = 388;
var len = 10;


// heatmap data format
var dataPoints = [
  {x: 160, //FP1
  y: 80,
  value: 183.868},
  {x: 230, //FP2
    y: 80,
    value: 193.217},
  {x: 120, //AF7
    y: 100,
    value: 150.279},
  {x: 195, //AFZ
  y: 100,
  value: 88.236},
  {x: 260, //AF8
    y: 100,
    value: 143.402},
  {x: 95, //F7
    y: 130,
    value: 71.452},
  {x: 120, //F5
    y: 140,
    value: 48.696},
  {x: 150, //F3
  y: 125,
  value: 150.649},
  {x: 175, //F1
    y: 125,
    value: 152.684},
  {x: 195, //Fz
    y: 125,
    value: 49.601},
  {x: 220, //F2
    y: 125,
    value: 45.441},  
  {x: 240, //F4
  y: 125,
  value: 46.6},
  {x: 265, //F6
    y: 125,
    value: 54.331},
  {x: 290, //F8
    y: 120,
    value: 71.452},
  {x: 80, //FT7
  y: 150,
  value: 38.177},
  {x: 115, //FC5
    y: 150,
    value: 29.124},
  {x: 140, //FC3
    y: 155,
    value: 22.349},
  {x: 170, //FC1
    y: 155,
    value: 22.664},
  {x: 190, //FCz
  y: 155,
  value: 18.768},
  {x: 220, //FC2
    y: 155,
    value: 17.395},
  {x: 250, //FC4
    y: 155,
    value: 17.415},
  {x: 280, //FC6
    y: 155,
    value: 16.5},
  {x: 300, //FT8
  y: 155,
  value: 22.552},
  {x: 100, //C5
    y: 185,
    value: 21.749},
  {x: 135, //C3
    y: 185,
    value: 44.017},
  {x: 165, //C1
  y: 185,
  value: 19.379},
  {x: 195, //Cz
    y: 185,
    value: 65.45},
  {x: 225, //C2
    y: 185,
    value: 12.512},
  {x: 250, //C4
    y: 185,
    value: 29.836},
  {x: 280, //C6
  y: 185,
  value: 14.882},
  {x: 85, //TP7
    y: 220,
    value: 26.316},
  {x: 110, //CP5
    y: 220,
    value: 51.9},
  {x: 140, //CP3
    y: 220,
    value: 11.332},  
  {x: 165, //CP1
  y: 220,
  value: 19.42},
  {x: 195, //CPz
    y: 220,
    value: 9.928},
  {x: 225, //CP2
    y: 220,
    value: 10.284},
  {x: 250, //CP4
  y: 220,
  value: 15.564},
  {x: 280, //CP6
    y: 220,
    value: 22.186},
  {x: 310, //TP8
    y: 220,
    value: 24.851},
  {x: 100, //P7
    y: 255,
    value: 26.489},
  {x: 120, //P5
  y: 250,
  value: 20.528},
  {x: 145, //P3
    y: 250,
    value: 16.246},
  {x: 170, //P1
    y: 250,
    value: 18.636},
  {x: 195, //Pz
    y: 245,
    value: 18.184}, 
  {x: 220, //P2
  y: 245,
  value: 20.304},
  {x: 245, //P4
    y: 245,
    value: 20.304},
  {x: 265, //P6
    y: 250,
    value: 23.844},
  {x: 290, //P8
    y: 255,
    value: 29.439},  
  {x: 125, //PO7
  y: 280,
  value: 44.657},
  {x: 195, //POz
    y: 270,
    value: 25.95},
  {x: 260, //PO8
  y: 285,
  value: 32.166},
  {x: 160, //O1
    y: 300,
    value: 31.281},
  {x: 195, //Oz
    y: 300,
    value: 33.773},
  {x: 230, //O2
    y: 300,
    value: 32.43},
];
// if you have a set of datapoints always use setData instead of addData
// for data initialization
heatmapInstance.addData(dataPoints);

sqlArray.forEach((index, brainValue) => {dataPoints[i].value = brainValue

})