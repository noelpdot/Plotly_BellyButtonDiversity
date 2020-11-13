function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1.A Create the buildCharts function.
function buildCharts(sample) {
  // 2.A Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3.A Create a variable that holds the samples array. 
    var samples = data.samples;
    // console.log(samples);
    // 4.A Create a variable that filters the samples for the object with the desired sample number.
    var resultsArray = samples.filter(sampleObj => sampleObj.id == sample);
    // console.log(resultsArray);
    //  5A. Create a variable that holds the first sample in the array.
    var results = resultsArray[0];
    // console.log(results);
    // 6A. Create variables that hold the otu_ids, otu_labels, and sample_values.
    // Hint: Get the the top 10 otu_ids and map them in descending order
    //  so the otu_ids with the most bacteria are last.
    var array =[];
    var ids = results.otu_ids;
    // console.log(ids);
    var labels = results.otu_labels;
    // console.log(labels);
    var sV = results.sample_values;
    // console.log(sV);

    array = [{
      "otu_id": ids,
      "otu_labels": labels,
      "sample_values": sV
    }];
    // console.log(array);

    // sorting
    sortedArray = array.sort((a,b) => parseInt(b.sample_values) - parseInt(a.sample_values));
    // console.log(sortedArray);

    var newIds = sortedArray[0].otu_id.slice(0,10).reverse().map(id => "OTU " +id);;
    // console.log(newIds);
    var newLabels = sortedArray[0].otu_labels.slice(0,10).reverse();
    // console.log(newLabels);
    var newSV = sortedArray[0].sample_values.slice(0,10).reverse();
    // console.log(newSV);

    // 7A. Create the yticks for the bar chart.
    var yticks = {
      y: newIds,
      x: newSV,
      text: newLabels,
      type: "bar",
      orientation: "h",
    };

    // 8A. Create the trace for the bar chart. 
    var barData = [
      yticks
    ];

    // 9A. Create the layout for the bar chart. 
    var barLayout = {
     title: "Top 10 Bacteria Cultures Found"
    };

    // 10A. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout)
     
    // BUBBLE CHART
    // 1B. Create the trace for the bubble chart.
    var trace = {
      x: results.otu_ids,
      y: results.sample_values,
      text: results.otu_labels,
      mode: 'markers',          
      marker: {
        size: results.sample_values,
        color: results.otu_ids,
        colorscale: "Portland"
      }
    };
    
    var bubbleData = [
      trace
    ];

    // 2B. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      showlegend: false,
      xaxis: { title: "OTU ID"},
      yaxis: { title: "Sample Values"},
      height: 600,
      width: 1145
    };

    // 3B. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);
  
  
    // Gauge
    // 1C. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata =data.metadata;
    console.log(metadata);
    // 2C. Create a variable that holds the first sample in the metadata array.
    var metadataArray = metadata.filter(sampleObj => sampleObj.id == sample)[0];
    console.log(metadataArray);
    // 3C. Create a variable that holds the washing frequency.
    // var washF = metadataArray[0];
    // console.log(washF);
    var wash = metadataArray.wfreq;
    console.log(wash);  
    // 4C. Create the trace for the gauge chart.
    var gaugeData = [ 
      {
        domain: { x: [0,1], y:[0,1]},
        value: wash,
        title: {
          text: "Belly Button Washing Frequency <br> Scrubs Per Week"
        },
        type: "indicator",
        mode: "gauge+number",

        gauge: {
          axis: { range: [null, 10], tickwidth: 0.5, tickcolor: "pink"},
          bar: {color: "black"},
          borderwidth: 2,
          bordercolor: "gray",
          steps: [
            { range: [0,2], color:"red"},
            { range: [2,4], color: "orange"},
            { range: [4,6], color: "yellow"},
            { range: [6,8], color: "lightgreen"},
            { range: [8,10], color: "green"}
          ],
        }
      }];
  
    // 5C. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 455,
      height: 450,
      margin: { t:0, b:0}
    };

    // 6C. Use Plotly to plot the gauge data and layout.
  
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
  
  
  
  });
};
