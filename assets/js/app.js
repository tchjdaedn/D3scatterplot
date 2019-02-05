
//Axis names stored in variables with the intent to allow them to be dynamic, there was not enough time to accomplish this.
var xVar = "age";
var yVar = "poverty";


function makeResponsive() {
    
    var svgArea = d3.select("#scatter").selectAll("svg");
    if (!svgArea.empty()) {
        svgArea.remove();
    };

    var svgHeight = window.innerHeight;
    var svgWidth = window.innerWidth;
    var margin = {
        top: 50,
        right: 100, //find out why right margin grows/shrinks with window resize
        bottom: 150,
        left: 50
    };
    
    //set chart size based on window size & margin settings
    var chartHeight = svgHeight - margin.top - margin.bottom;
    var chartWidth = svgWidth - margin.left - margin.right;

// setup x 
var xValue = function(d) { return d[xVar];}, 
    xScale = d3.scaleLinear().range([0, chartWidth-margin.right]), 
    xMap = function(d) { return xScale(xValue(d));}, 
    xAxis = d3.axisBottom(xScale);

// setup y
var yValue = function(d) { return d[yVar];}, 
    yScale = d3.scaleLinear().range([chartHeight-margin.bottom, 0]), 
    yMap = function(d) { return yScale(yValue(d));}, 
    yAxis = d3.axisLeft(yScale);

// add the graph area
var svg = d3.select("#scatter").append("svg")
    //.attr("id", "Graphsvg")
    .attr("width", chartWidth)
    .attr("height", chartHeight)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// add the tooltip area to the webpage
var tooltip = d3.select("#scatter").select("div")
    .attr("class", "tooltip")
    .style("opacity", 0.8);


// pull data
d3.csv('./assets/data/data.csv').then(data => {
    data.forEach(d => {
        d.obesity = +d.obesity;
        d.smokes = +d.smokes;
        d.healthcare = +d.healthcare;
        d.poverty = +d.poverty;
        d.age = +d.age;
        d.income = +d.income;
        d.state = d.state;
        d.abbr = d.abbr;
        //console.log(d);
    });

    //establish axes based on data ranges, adjust lower bounds to keep data off axis.
    xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)]);
    yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)]);

    //console.log("x domain", xScale.domain());
    //console.log("y range", yScale.domain());

    // x-axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0, ${chartHeight - margin.bottom})`) 
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", chartWidth)
        .attr("y", d3.min(data, yValue))

    //x axis label
    svg.append("text")
        .style("text-anchor", "middle")
        .attr("transform", `translate(${chartWidth/2}, ${chartHeight - margin.bottom + 35})`)
        .text(`${xVar}`.toUpperCase());

    // y-axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y",chartHeight)

    //y axis label
        svg.append("text")
        .style("text-anchor", "left")
        .attr("transform", `rotate(90)`)
        .attr("transform",  `translate(0, ${margin.top})`)
        .text(`${yVar}`.toUpperCase());

  // draw dots
    svg.selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("r", 12)
        .attr('cx', xMap)
        .attr('cy', yMap)
        .style("fill", "00ffaa")
        .style("stroke", "000000")
        .style("opacity", 0.5)
        .on("mouseover", d => {
            tooltip.transition()
                .duration(100)
                .style("opacity", .8);
            tooltip.html("<b>" + d["state"] + "</b><br> (" + xValue(d) 
            + ", " + yValue(d) + ")")
                .style("left", (d3.event.pageX - 70) + "px")
                .style("top", (d3.event.pageY - 40) + "px");
        })
        .on("mouseout", d=> {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        })
        .on("click", d => {
            tooltip
                .style("opacity", 1)
                .style("background", "ffffff")
                .style("border",1);
            tooltip.html("<b>" 
                + d["state"] 
                + "</b><br> Obesity Rate: " 
                +d["obesity"]
                +"%<br> Smoking Rate: "
                +d["smokes"]
                +"%<br> Without Healthcare: "
                +d["healthcare"]
                +"%<br> Poverty Level: "
                +d["poverty"]
                +"%<br> Average Age: "
                +d["age"]
                +"<br> Median Household Income: $"
                +d["income"]
                )
                .style("left", (d3.event.pageX - 70) + "px")
                .style("top", (d3.event.pageY - 40) + "px");
        });
        
        //add state Labels 
         svg.selectAll(".Labels")
         .data(data)
         .enter()
         .append("text")
         .attr("class", "Labels")
         .attr('x', xMap)
         .attr('y', yMap)
         .attr('dy', 5)
         .style("text-anchor", "middle")
         .text(d=>{ return d.abbr})

});

}

//initialize functions
function init() {
    //console.log("init");

    var tooltip = d3.select("#scatter").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0.8);

    makeResponsive();
}

//listen for movement
d3.select(window).on("resize", makeResponsive);

init();