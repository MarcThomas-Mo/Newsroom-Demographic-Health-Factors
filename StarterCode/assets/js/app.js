// set up SVG

var svgWidth = 900;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    left: 40,
    bottom: 20
};

var width = svgWidth - margin.right - margin.left;
var height = svgHeight - margin.top - margin.bottom;

//create SVG wrapper and append SVG group
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// import data
d3.csv("assets/js/data.csv").then(function(healthdata){
    // if (error) throw error;

    // parse data
    healthdata.forEach(function (data) {
        data.smokes = +data.smokes;
        data.poverty = +data.poverty;
    });
    console.log(healthdata)
    // create scale functions
    var xLinearScale = d3.scaleLinear()
        .domain(d3.extent(healthdata, d => d.poverty))
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(healthdata, d => d.smokes)])
        .range([height, 0]);

    // create Axes
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append axes to chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    // create circles for plot
    var circlesGroup = chartGroup.selectAll()
        .data(healthdata)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.smokes))
        .attr("r", "15")
        .attr("fill", "blue")
        .attr("opacity", ".5");

    // add text to circles
    var textGroup = chartGroup.selectAll()
        .data(healthdata)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d.poverty)-5)
        .attr("y", d => yLinearScale(d.smokes)+2)
        .attr("fill","black")
        .attr("font-size", "10")
        .text(d => d.abbr);

    // tooltip
    // var tooltip = d3.select("body").append("div")
    //     .attr("class", "tooltip");

    // circlesGroup.on("click", function (d, i) {
    //     tooltip.style("display", "block");
    //     tooltip.html("")
    // })
    chartGroup.append("text")
     .attr("transform", "rotate(-90)")
     .attr("y", 0 - margin.left)
     .attr("x", 0 - (height / 2))
     .attr("dy", "1em")
     .attr("class", "axisText")
     .text("Smokes");

    chartGroup.append("text")
     .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
     .attr("class", "axisText")
     .text("Poverty");
});
