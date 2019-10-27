function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample

  var url = `/metadata/${sample}`;

  console.log("METADATA FOR *******: ",url);

  d3.json(url).then(function(data){
    
    // Use d3 to select the panel with id of `#sample-metadata`
    var metadata = d3.select("#sample-metadata");
    
    // Use `.html("") to clear any existing metadata
    metadata.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    wf = data.WFREQ;

    Object.entries(data).forEach(([key, value]) => {

      value = `${key}: ${value}`
      metadata.append("p").text(value);

    });

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);

  });  
};

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots

  var url = `/samples/${sample}`;

  // Grab values from the response json object to build the plots

  console.log("BUILDING CHART **** ", sample);

  d3.json(url).then(function(data) {

    //@TODO: Build a Bubble Chart using the sample data

    var tracebubble = {
      type: "scatter",
      mode: "markers",
      x : data.otu_ids,
      y : data.sample_values,
      marker : {
        size: data.sample_values,
        color: data.sample_values,
        sizemode: 'diameter'
      }
    };

    var databubble = [tracebubble];

    var layout = {
      title: `Bubble Graph: ${sample}`,
      showlegend: false,
      //height: 600,
      //width: 600
    };
    
    Plotly.newPlot("bubble", databubble, layout);
    
    // @TODO: Build a Pie Chart

    var dataobj = [];

    for (var i=1; i < data.otu_labels.length; i++){

      obj1 = {};
      obj1.ol = data.otu_labels[i];
      obj1.sv = data.sample_values[i];
      obj1.oi = data.otu_ids[i];

      dataobj.push(obj1);
    };

    dataobj.sort(function(a, b) {
      return b.sample_values - a.sample_values;
    });

    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    dataobj = dataobj.slice(0,10);
 
    var trace1 = {
      type: "pie",
      labels: dataobj.map(e => e.oi),
      values: dataobj.map(e => e.sv),
    };

    var datap = [trace1];

    var layout = {
      title: `Pie Graph: ${sample}`
    };

    Plotly.newPlot("pie", datap, layout);

    //GAUGE GRAPH

    console.log("WFREQ $$$$$$$$$$$$$$$$$$$$$  ",wf);
    

    var traceg = {
      domain: {
        x: [0, 1],
        y: [0, 1]
      },
      value: wf,
      title: {
        text: `Scrubs x Week - Sample: ${sample}`
      },
      titlefont: { size:15 },
      type: "indicator",
      mode: "gauge+number",
      gauge: {axis: {range: [null, 10]}},
    };

    var datag = [traceg];
  
    var layoutg = {
      title: "Bellybutton Washing Frequency",
      titlefont: { size:20 },
    };
      
    Plotly.newPlot("gauge",datag,layoutg);
    
  });
};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected

  console.log("OPTION CHANGED *********************");
  console.log ("NEW SAMPLE ************* ",newSample);
  // Prevent the page from refreshing
  //d3.event.preventDefault();

  // Select the input value from the form
  //var nsample = d3.select("#selDataset").node().value;
  //console.log("GOT IT FROM HTML #### , ", nsample);
  
  buildCharts(newSample);
  buildMetadata(newSample);
  //buildCharts(nsample);
  //buildMetadata(nsample);

}

// Initialize the dashboard

var wf = 0.0;
init();

//d3.select("#selDataset").on("change", optionChanged);