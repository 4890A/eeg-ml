// minimal heatmap instance configuration
var heatmapInstance = h337.create({
  // only container is required, the rest will be defaults
  container: document.querySelector('.heatmap_avg')
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
  value: 1.6929968039772800},
  {x: 230, //FP2
    y: 80,
    value: 1.6080834517045400},
  {x: 95, //F7
    y: 130,
    value: -1.3327808061079600},
  {x: 290, //F8
    y: 120,
    value: -1.4344586736505700},
  {x: 185, //AF1
    y: 100,
    value: 0.3465520241477290},
  {x: 205, //AF2
    y: 100,
    value: 1.018159312855120},
  {x: 195, //Fz
    y: 125,
    value: 0.4074793146306850},
  {x: 240, //F4
  y: 125,
  value: 0.10967076526988600},
  {x: 150, //F3
  y: 125,
  value: -0.23261585582386100},
  {x: 280, //FC6
    y: 155,
    value: -1.1562332652699100},
  {x: 115, //FC5
    y: 150,
    value: -1.3730302290482900},
  {x: 220, //FC2
    y: 155,
    value: 0.24809956498579500},
  {x: 170, //FC1
    y: 155,
    value: -0.18882892400568300},
  {x: 300, //T8
    y: 185,
    value: 0.3465520241477290},
  {x: 80, //T7
    y: 185,
    value: 1.018159312855120},
  {x: 195, //Cz
    y: 185,
    value: -5.884875932173270},
  {x: 135, //C3
    y: 185,
    value: -1.3094406960227300},
  {x: 250, //C4
    y: 185,
    value: -0.556373801491474},
  {x: 110, //CP5
    y: 220,
    value: -3.4821031161221300},
  {x: 280, //CP6
    y: 220,
    value: -3.1179094460227500},
  {x: 165, //CP1
    y: 220,
    value: -1.1509290216619300},
  {x: 225, //CP2
    y: 220,
    value: 0.729276899857957},
  {x: 145, //P3
    y: 250,
    value: -3.56167702414776},
  {x: 245, //P4
    y: 245,
    value: -3.3218858753550800},
  {x: 195, //Pz
    y: 245,
    value: -1.91871129261362}, 
  {x: 290, //P8
    y: 255,
    value: -6.257923295454490}, 
  {x: 100, //P7
    y: 255,
    value: -5.97207626065339}, 
  {x: 185, //PO2
    y: 255,
    value: 0.3465520241477290},
  {x: 205, //PO1
    y: 255,
    value: 1.018159312855120},
  {x: 230, //O2
    y: 300,
    value: -5.733994273792620},
  {x: 160, //O1
    y: 300,
    value: -5.94951007634942},
  {x: 500, //X(M)
    y: 500,
    value: 0.3465520241477290},
  {x: 120, //AF7
    y: 100,
    value: 0.3465520241477290},
  {x: 260, //AF8
    y: 100,
    value: 0.375170587713065},
  {x: 120, //F5
    y: 140,
    value: -0.8589695046164830},
  {x: 265, //F6
    y: 125,
    value: -0.4719102006392040},
  {x: 80, //FT7
    y: 150,
    value: -2.4883308327414600},
  {x: 300, //FT8
    y: 155,
    value: -2.364761674360790},
  {x: 195, //FPz
    y: 100,
    value: 1.018159312855120},
  {x: 250, //FC4
    y: 155,
    value: -0.2371245117187510},
  {x: 140, //FC3
    y: 155,
    value: -0.6961786221590970},
  {x: 280, //C6
    y: 185,
    value: -1.792583274147720},
  {x: 100, //C5
    y: 185,
    value: -2.3685344016335100},
  {x: 220, //F2
    y: 125,
    value: 0.4709135298295460},
  {x: 175, //F1
    y: 125,
    value: 0.10318119673295400},
  {x: 310, //TP8
    y: 220,
    value: -4.8687009943181800},
  {x: 85, //TP7
    y: 220,
    value: -4.786425514914770},
  {x: 195, //AFZ
    y: 100,
    value: 1.018159312855120},
  {x: 140, //CP3
    y: 220,
    value: -1.95196040482953},    
  {x: 250, //CP4
    y: 220,
    value: -1.91698473011363},
  {x: 120, //P5
    y: 250,
    value: -4.476589533025600},
  {x: 265, //P6
    y: 250,
    value: -4.78960875355116},
  {x: 165, //C1
    y: 185,
    value: 0.366948996803983},
  {x: 225, //C2
    y: 185,
    value: 0.03082541725852220},
  {x: 125, //PO7
    y: 280,
    value: -6.4315922407671},
  {x: 260, //PO8
    y: 285,
    value: -6.019880726207410},
  {x: 190, //FCz
    y: 155,
    value: 0.3200656516335260},
  {x: 195, //POz
    y: 270,
    value: -13.91571888316762},
  {x: 195, //Oz
    y: 300,
    value: -5.668623668323880},
  {x: 220, //P2
    y: 245,
    value: -2.500591796875010},
  {x: 170, //P1
    y: 250,
    value: -2.8945955699573700},  
  {x: 195, //CPz
    y: 220,
    value: -0.661605601917616}, 
  {x: 500, //nd(M)
    y: 500,
    value: -2.8945955699573700},  
  {x: 500, //Y(M)
    y: 500,
    value: -0.661605601917616}, 
];
// if you have a set of datapoints always use setData instead of addData
// for data initialization
// carlosArray.forEach((index, brainValue) => {
//  dataPoints[index].value = brainValue
// })
heatmapInstance.addData(dataPoints);
