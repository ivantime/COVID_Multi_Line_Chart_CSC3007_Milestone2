//Begin prep for chart
var width = document.getElementById('lineChart1')
    .clientWidth;
var height = document.getElementById('lineChart1')
    .clientHeight;

var margin = {
    top: 30,
    bottom: 30,
    left: 50,
    right: 20
}

var svg1 = d3.select('#lineChart1')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.right + ')');

var svg2 = d3.select('#lineChart2')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.right + ')');

width = width - margin.left - margin.right;
height = height - margin.top - margin.bottom;

var x_scale = d3.scaleBand()
    .rangeRound([0, width])
    .padding(0.1);

var y_scale = d3.scaleLinear()
    .range([height, 0]);


var colour_scaleRegion = d3.scaleQuantile()
    .range(["#FA985C", "#8291DB", "#CBF24B", "#DB3941", "#42E7FF", "#5C93FA", "#DB958B", "#CBF24B", "#397FDB"]);

var colorScaleCountry = d3.scaleLinear()
    .domain([0, height])
    .range([0, 100]);

var y_axis = d3.axisLeft(y_scale);
var x_axis = d3.axisBottom(x_scale);


svg1.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')');

svg1.append('g')
    .attr('class', 'y axis');

svg2.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')');

svg2.append('g')
    .attr('class', 'y axis');

switchValue = "country";
// Code for JSON parsing getJson()/main() functions Reference: https://stackoverflow.com/questions/61228241/how-do-i-get-fetch-result-from-api-to-store-as-a-global-variable#answer-61228364
async function getJson(url) {
    let response = await fetch(url);
    let data = await response.json()
    return data;
}

async function main() {
    let country_data = await getJson('/data/country_data.json')
    // console.log(country_regions)


    // if (switchValue == "region") {
    //     let country_regions = await getJson('/data/country_regions.json')
    //     for (const [key1, value1] of Object.entries(country_regions)) {
    //         value1.forEach(function (country, index) {

    //             // add to each date (key in country_data) with respect to their country(inner-key), add to that country the respective region
    //             for (const [key2, value2] of Object.entries(country_data)) {
    //                 if (Object.keys(value2).includes(country)) {
    //                     country_data[key2][country] = key1
    //                 }

    //             }

    //         })
    //     }

    prepLineChart1(country_data);


}

function prepLineChart1(country_data) {
    var data = [];
    let raw_dates = Object.keys(country_data)
    let dates = [];

    for (index = 0; index < raw_dates.length; index++) {
        let dArray = raw_dates[index].split("-")
        let date = new Date(dArray[2] + "-" + dArray[0] + "-" + dArray[1]);
        dates.push(date)
    }

    day_count = 1;
    //convert key (originally date) to Day Number after 100 Covid Cases & add key (originally date) to each Country's key's value
    Object.entries(country_data).forEach(item => {
        country_data[day_count] = item[1]
        for (const [key2, value2] of Object.entries(item[1])) {
            country_data[day_count][key2]["date"] = item[0]
        }
        delete country_data[item[0]]
        day_count += 1
    })
    console.log(country_data)

    //ADD date to key's value
    // for (const [key1, value1] of Object.entries(country_data)) {
    //     for (const [key2, value2] of Object.entries(value1)) {
    //         console.log(country_data[key1][key2]["date"]=)

    //     }

    // }

    //sort dates by ascending order
    dates.sort((a, b) => a.getTime() - b.getTime());

    //generate the number of days based on the length of the dates available Code Reference: https://stackoverflow.com/questions/3746725/how-to-create-an-array-containing-1-n#answer-38213213
    let days = Array.from(Array(dates.length), (_, i) => i + 1)
    data.forEach(function (d) {
        d.date = parseDate(d.date);
    });


}

if (d3.select("#myCheckbox").on("click", function (d) {
    var check = this.checked;
    if (check) {
        switchValue = "region"
        console.log("By Region")
    }
    else {
        switchValue = "country"
        console.log("By Country")
    }
}));


//prepare the Axis, SVG for both LineCharts & their Color
//by default set as By Country
d3.select("#myCheckbox").property('checked', false);
main();