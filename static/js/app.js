const initSubjectIdDropdown = () => {
    const { names } = sample_data;
    const dropdownElem = document.querySelector('#selDataset');

    names.forEach(name => {
        const optionElementRef = new Option(name);
        optionElementRef.value = name;
        dropdownElem.add(optionElementRef);
    })
}

const createDemographicInfoList = (demographicData) => {
    let demographicHtml = '';
    for (const [key, value] of Object.entries(demographicData)) {
        demographicHtml += `<h5>${key}: ${value}</h5>`;
    }
    document.getElementById('sample-metadata').innerHTML = demographicHtml;
}

const createBarChart = (barChartData) => {
    const { otu_ids, sample_values, otu_labels } = barChartData;
    let otu_ids_top_10 = otu_ids.slice(0, 10);
    const sample_values_top_10 = sample_values.slice(0, 10);
    otu_ids_top_10 = otu_ids_top_10.map(d => `OTU ${d}`);
    const otu_labels_top_10 = otu_labels.slice(0, 10);

    const data = [{
        x: sample_values_top_10,
        y: otu_ids_top_10,
        type: 'bar',
        orientation: 'h',
        text: otu_labels_top_10
    }];
    Plotly.newPlot('bar', data);
}

const createBubbleChart = (bubbleChartData) => {
    const { otu_ids, sample_values, otu_labels } = bubbleChartData;
    const data = [{
        x: otu_ids,
        y: sample_values,
        mode: 'markers',
        marker: {
          color: otu_ids,
          size: sample_values
        },
        text: otu_labels
    }];
    const layout = {
        showlegend: false,
        height: 600,
        width: 600,
        xaxis: {
            title: {
                text: 'OTU ID'
            }
        }
    };
    Plotly.newPlot('bubble', data, layout);
}

const optionChanged = () => {
    const dropdownMenu = d3.select("#selDataset");
    // Assign the value of the dropdown menu option to a variable
    const name = dropdownMenu.property("value");
    createCharts(name);
}

const createCharts = (name) => {
    const { metadata, samples } = sample_data;
    const filteredData = samples.filter(d => d.id == name);
    if (filteredData.length === 0) {
        console.error(`cannot find a matching info for ${name}`);
        return;
    }
    const filteredMetadata = metadata.filter(d => d.id == name);
    if (filteredMetadata.length === 0) {
        console.error(`cannot find a matching info for ${name}`);
        return;
    }
    createDemographicInfoList(filteredMetadata[0]);
    createBarChart(filteredData[0]);
    createBubbleChart(filteredData[0]);
}

document.addEventListener("DOMContentLoaded", function() {
    initSubjectIdDropdown()
    createCharts('940');
});
