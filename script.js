//Begin prep for chart
var width = document.getElementById('lineChart1')
    .clientWidth;
var height = document.getElementById('lineChart1')
    .clientHeight;

var margin = {
    top: 30,
    bottom: 30,
    left: 70,
    right: 20
}

var svg1 = d3.select('#lineChart1')
    .append('svg')
    .attr('width', "100%")
    .attr('height', "100%")
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.right + ')');

var svg2 = d3.select('#lineChart2')
    .append('svg')
    .attr('width', "100%")
    .attr('height', "100%")
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.right + ')');

width = width - margin.left - margin.right;
height = height - margin.top - margin.bottom;

var x_scale = d3.scaleLinear()
    .rangeRound([0, width]);

var y_scale = d3.scaleLog()
    .base(2)
    .range([height, 0])


var colour_scaleRegion = d3.scaleQuantile()
    .range(["#FA985C", "#8291DB", "#CBF24B", "#DB3941", "#42E7FF", "#5C93FA", "#DB958B", "#CBF24B", "#397FDB"]);

var blues = d3.scaleOrdinal(d3.schemeBlues[9]);


var y_axis = d3.axisLeft(y_scale);
var x_axis = d3.axisBottom(x_scale);


svg1.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')');

svg1.append('g')
    .attr('class', 'y axis');


switchValue = "country";






//LineChart 1
function prepData(country_data) {
    var data = [];

    //sort string dates with help with date type sort (append to array)
    let raw_dates = Object.keys(country_data)
    for (index = 0; index < raw_dates.length; index++) {

        let dArray = raw_dates[index].split("-")
        let rec = [country_data[raw_dates[index]], new Date(dArray[2] + "-" + dArray[0] + "-" + dArray[1])];
        data.push(rec)
    }
    //sort date type by ascending order
    data.sort((a, b) => a[1].getTime() - b[1].getTime());

    temp_dict = {}
    let inner_country = Object.keys(Object.values(Object.entries(country_data)[0])[1]);
    inner_country.forEach(function (country) {
        temp_dict[country] = {}
    })

    //Create dictionary to contain Country Stats (as value) and day (as JSON key)
    inner_country.forEach(function (country) {
        day_count = 1
        for (i = 0; i < data.length; i++) {
            if (Object.keys(data[i][0]).includes(country)) {
                var date = data[i][1]
                var country_stat = data[i][0][country]
                country_stat["date"] = date
                country_stat["day"] = day_count

                temp_dict[country][day_count] = country_stat
                day_count += 1
            }
        }
    })
    //set x scale by Days
    var str_days = Object.keys(Object.values(temp_dict)[0])
    var int_days = str_days.map(Number);

    //Code Reference for X Scale's tick spread (nice) from:https://observablehq.com/@d3/scale-ticks
    x_scale.domain(d3.extent(int_days)).nice().ticks()

    var all_cases = []
    Object.values(country_data).forEach(function (country) {
        Object.values(country).forEach(function (country2) {
            all_cases.push(country2["Confirmed"]);
        })
    })

    var max_cases = d3.max(all_cases)
    //enable clamp for countries with 0 Number of Cases referenced from: https://stackoverflow.com/questions/11322651/how-to-avoid-log-zero-in-graph-using-d3-js#answer-11322824
    y_scale.domain([1, max_cases]).clamp(true).nice();

    var json2array = []
    var countries = Object.keys(temp_dict)

    for (var i = 0; i < countries.length; i++) {
        var temp_country = countries[i]
        country_data = Object.values(temp_dict[temp_country])
        temp_dict2 = { "name": temp_country, dataz: country_data }
        json2array.push(temp_dict2)
    }
    // allCasesByDay = []
    // for (var i = 0; i < json2array.length; i++) {
    //     var currCountry = json2array[i];
    //     casesByDay = []
    //     for (var j = 0; j < currCountry.dataz.length; j++) {
    //         if (j != 0) {
    //             casesByDay[j] = currCountry.dataz[j].Confirmed;
    //         }
    //     }
    //     allCasesByDay.push([casesByDay])
    // }
    // console.log(allCasesByDay[allCasesByDay.length - 1])
    return [json2array, temp_dict];
}


// Code for JSON parsing getJson()/main() functions Reference: https://stackoverflow.com/questions/61228241/how-do-i-get-fetch-result-from-api-to-store-as-a-global-variable#answer-61228364
async function getJson(url) {
    let response = await fetch(url);
    let data = await response.json()
    return data;
}

async function main() {
    let country_data = await getJson('/data/country_data.json')
    var getData = prepData(country_data);
    var jsonAllCountries = getData[0];
    var dictAllCountries = getData[1];
    var table1tooltip = prepTooltip("table1tooltip");
    prepLineChart1(jsonAllCountries, dictAllCountries, table1tooltip);
    if (switchValue === "country") {
        d3.select('#secondChartTable')
            .style("background", "grey")
        // .html("Not Available for \"Sort by Countries\" Selection")
    }

}

function prepTooltip(tooltipClass) {
    var div = d3.select("body").append("div")
        .attr("class", tooltipClass)
        .style("opacity", 0)
        .style('position', 'absolute')
        .style('z-index', '10')
        .style('padding', '10px')
        .style('background', 'rgba(0,0,0,0.6)')
        .style('border-radius', '4px')
        .style('color', '#fff');
    return div;
}

//Code from: https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript#answer-2901298
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function prepLineChart1(jsonData, dictAllCountries, table1tooltip) {

    //set Countrys' hue colors range (for later d3's interpolateViridis)
    let color_scale = d3.scaleLinear()
        .domain([0, height])
        .range([0, 100]);

    var line1 = svg1.selectAll("g.line1")
        .data(jsonData)
        .enter()
        .append("g")
        .attr("class", "country");

    ////ADDDD LEGEND

    var countryLine = d3.line()
        .x(function (d) { return x_scale(d.day); })
        .y(function (d) { return y_scale(d.Confirmed); });

    var colorScaleCountry = d3.scaleOrdinal(d3.schemeAccent);

    //Code Source for Line Transition and tweenDash from: https://bl.ocks.org/pjsier/28d1d410b64dcd74d9dab348514ed256
    function transition(path) {
        path.transition()
            .duration(2000)
            .attrTween("stroke-dasharray", tweenDash);
    }
    function tweenDash() {
        var l = this.getTotalLength(),
            i = d3.interpolateString("0," + l, l + "," + l);
        return function (t) { return i(t); };
    }

    line1
        .each(function (d, i) {
            d3.select(this)
                .append("path")
                .attr("class", "line")
                .attr("fill", "none")
                .attr("stroke-width", "1.5px")
                .attr("id", function (d) { return d.name.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&\\ '])/g, ""); })
                .attr("d", function (d) {
                    return countryLine(d.dataz);
                })
                .style("stroke", function (d) {
                    return colorScaleCountry(d.name.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&\\ '])/g, ""));
                })
                .call(transition);
        })


    svg1.select('.x.axis')
        .call(x_axis);

    svg1.select('.y.axis')
        .transition().duration(500)
        .call(y_axis);


    line1tableData = []
    var line1table_tr = svg1.selectAll("g.country").select("path")
        .each(function (d, i) {
            line1tableData.push({ "name": d.name, "color": d3.select(this).style("stroke") });
        })
    //code Reference for Dict to table (with svg plot) from: https://stackoverflow.com/questions/54935575/d3-js-nested-data-update-line-plot-in-html-table#answer-54936178
    var line1table = d3.select("#line1Table tbody")
        .selectAll("tr")
        .data(line1tableData)
        .enter()
        .append("tr")
        .attr("id", function (d) { return d.name.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&\\ '])/g, ""); })
        .attr("border", "1px solid black;")
        .on('mousemove', (event, d) => {
            svg1.selectAll(".country").selectAll("path").attr("opacity", 0)
            svg1.selectAll(".country").select("#" + d.name.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&\\ '])/g, "")).attr("opacity", 1)

            var currCountry = dictAllCountries[d.name];
            var totalCasesArray = Object.values(currCountry)
            var totalCases = totalCasesArray[totalCasesArray.length - 1].Confirmed

            table1tooltip
                .style("opacity", .9)
                .style("left", (event.pageX - 70) + "px")
                .style("top", (event.pageY + 20) + "px")
                .html("<b><u>" + d.name + "</u></b>" +
                    "<br>No. of Confirmed Cases (on Day <u>" + totalCasesArray.length + ")</u>: </br><b>" + numberWithCommas(totalCases) + "<b>")

            svg1.select(".max-svg1mouse-line")
                .style("opacity", 1)
                .attr("d", function () {
                    var maxPoint = y_scale(totalCases)
                    var d = "M" + 0 + "," + maxPoint;
                    d += " " + width + "," + maxPoint;
                    return d;
                });
        })
        .on('mouseout', (event, d) => {
            svg1.selectAll(".country").selectAll("path").attr("opacity", 1)

            table1tooltip.transition()
                .duration(500)
                .style("opacity", 0);

            svg1.select(".max-svg1mouse-line")
                .style("opacity", 0)
        })

    var dottedLine = svg1.append("g")
        .attr("class", "mouse-over-dotted-line");

    //Dotted Line Code adapted from: https://stackoverflow.com/questions/16447302/dashtype-line-in-svg-path#answer-16472453
    dottedLine.append("path")
        .attr("class", "svg1mouse-line")
        .style("stroke", "black")
        .style("stroke-width", "1px")
        .style("stroke-line-cap", "butt")
        .style("stroke-linejoin", "round")
        .style("stroke-dasharray", "10,10")
        .style("opacity", "0");

    var dottedMaxLine = svg1.append("g")
        .attr("class", "max-mouse-over-dotted-line");

    //Dotted Line Code adapted from: https://stackoverflow.com/questions/16447302/dashtype-line-in-svg-path#answer-16472453
    dottedMaxLine.append("path")
        .attr("class", "max-svg1mouse-line")
        .style("stroke", "grey")
        .style("stroke-width", "1px")
        .style("stroke-line-cap", "butt")
        .style("stroke-linejoin", "round")
        .style("stroke-dasharray", "10,10")
        .style("opacity", "0");


    var chart1tooltip = prepTooltip("svg1Tooltip")

    // On Hover Over SVG (Line CHart) get Mouse Position and display Day Number currently hovered at Code from: https://stackoverflow.com/questions/67948959/d3-line-chart-doesnt-return-correct-value-on-ticks-mouse-over#answer-67953774
    // and from: https://bl.ocks.org/larsenmtl/e3b8b7c2ca4787f77d78f58d41c3da91
    svg1
        .on("mousemove", function (event) {
            const mousePosition = d3.pointer(event, svg1.node()); // gets [x,y]
            const currentDate = Math.round(x_scale.invert(mousePosition[0])); // converts x to date

            chart1tooltip
                .style("opacity", .9)
                .style("left", (event.pageX) + "px")
                .style("top", (event.pageY - 40) + "px")
                .html("<b>Day " + currentDate + "<b>")

            svg1.select(".svg1mouse-line")
                .style("opacity", 1)
                .attr("d", function () {
                    var d = "M" + mousePosition[0] + "," + height;
                    d += " " + mousePosition[0] + "," + 0;
                    return d;
                });
        })
        .on("mouseout", function (event) {
            chart1tooltip
                .style("opacity", 0)

            svg1.select(".svg1mouse-line")
                .style("opacity", 0)

        })

    var tableLinePathDrawn = d3.line()([[1, 1], [35, 1]])
    line1table
        .append('td')
        .append('svg')
        .attr("class", "spark-svg")
        .attr("width", 15)
        .attr("height", 10)
        .append('path')
        .attr("class", "spark-path")
        .attr('d', function (d) {
            return tableLinePathDrawn;
        })
        .attr("stroke", function (d) { return d.color; })
        .attr("stroke-width", 5)

    var pathLine = line1table
        .append("td")
        .text(function (d) {
            return d.name
        });
    d3.select("#dummyHead")
        .style("visibility", "visible")
    d3.select(".tableDiv")
        .style("visibility", "visible")
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