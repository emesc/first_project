var w = 500;
var h = 250;

var dataset = [ 8.5, 9.6, 11.1, 12.9, 14.5, 15.8, 15.9, 14.9, 13.4, 11.6, 10.0, 8.7 ];

var xScale = d3.scale.ordinal()
					.domain(d3.range(dataset.length))
					.rangeRoundBands([0, w], 0.05);

var yScale = d3.scale.linear()
					.domain([0, d3.max(dataset)])
					.range([0, h]);

var svg = d3.select(".seattle")
			.append("svg")
			.attr("class", "chart")
			.attr("width", w)
			.attr("height", h);

svg.selectAll("rect")
.data(dataset)
.enter()
.append("rect")
.attr({
	x: function(d, i){ return xScale(i); },
	y: function(d){ return h - yScale(d); },
	"width": xScale.rangeBand(),
	"height": function(d){ return yScale(d); },
	// "fill": function(d){ return "rgb(0, 0, " + d*10 + ")"; }
	"fill": "steelblue"
})
.on("mouseover", function(d){
	var xPos = parseFloat(d3.select(this).attr("x")) + xScale.rangeBand() / 2;
	var yPos = parseFloat(d3.select(this).attr("y")) + 14;

	svg.append("text")
		.attr({
			"id": "tooltip",
			x: xPos,
			y: yPos,
			"text-anchor": "middle",
			"font-family": "sans-serif",
			"font-size": "12px", 
			"font-weight": "bold",
			"fill": "white"
		})
		.text(d);
})
.on("mouseout", function(){
					d3.select("#tooltip").remove();
});