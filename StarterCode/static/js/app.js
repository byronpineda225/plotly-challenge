function buildData(sample) {
    d3.json("samples.json").then(data => {
        let metadata = data.metadata;
        // console.log(sample);
        // Filter for the object with the requested sample number
        let objArray = metadata.filter(sampleX => sampleX.id == sample);
        let result = objArray[0];
        let PANEL = d3.select("#sample-metadata");
        PANEL.html("");

        Object.entries(result).forEach(([key, value]) => {
            PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });
    });
}    

function chartBuilder(sample) {
    d3.json("samples.json").then((data) => {
        let samples = data.samples;
        let objArray = samples.filter(sampleX => sampleX.id == sample);
        let result = objArray[0];

        let otu_ids = result.otu_ids;
        let otu_labels = result.otu_labels;
        let sample_values = result.sample_values;
        
        // Build the bar chart and select the top 10 operational taxonomic units  
        // (OTUs) found in the individual
        let yticks = otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse();
        let barGraphData = [
            {
                x: sample_values.slice(0,10).reverse(),
                y: yticks,
                text: otu_labels.slice(0,10).reverse(),
                type: "bar",
                orientation: "h"
            }
        ];

        Plotly.newPlot("bar", barGraphData);

        // Build the bubble chart
        let bLayout = {
            title: "Bacteria Cultures per Sample",
            margin: { t: 0},
            hovermode: "closest",
            xaxis: { title: "OTU ID"},
            margin: { t: 35}
        };
        
        let bData = [
            {
                x: otu_ids,
                y: sample_values,
                text: otu_labels,
                mode: "markers",
                marker: {
                    size: sample_values,
                    color: otu_ids,
                    colorscale: "Earth"
                }
            }
        ];
        
        Plotly.newPlot("bubble", bData, bLayout);
    });
}

function init() {
    // Get the dropdown select element 
    let selector = d3.select("#selDataset");

    d3.json("samples.json").then(data => {
        let sampleNames = data.names;

        sampleNames.forEach((sample) => {
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
        });

        // Get the first sample from the list
        let theFirstSample = sampleNames[0];
        // console.log(theFirstSample)
        chartBuilder(theFirstSample);
        buildData(theFirstSample);
    });

}

// Get new data when a new sample is
function optionChanged(aNewSample) {
    chartBuilder(aNewSample);
    buildData(aNewSample); 
}

init();