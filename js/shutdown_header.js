var margin = {
				top: 0,
				right: 20,
				bottom: 0,
				left: 45
			},
	width = 950 - margin.left - margin.right,
	height = 200 - margin.top -margin.bottom,

	report = "Full Report",

	svg = d3.select("#shutdown").append("svg")
		    .attr("width", width + margin.left + margin.right)
		    .attr("height", height + margin.top + margin.bottom);

svg.append("a")
	.attr("xlink:href", "http://utahdatapoints.com/abrown/utahdatapoints/wp-content/uploads/2013/10/2013-October-UVP-Topline.pdf")
	.append("rect")
	.attr({
		"class": "titleBar",
		"x": width/4,
		"y": 0,
		"width": width/2,
		"height": height/2,
		"rx": 8,
		"ry": 8
	});

svg.append("a")
	.attr("xlink:href", "http://utahdatapoints.com/abrown/utahdatapoints/wp-content/uploads/2013/10/2013-October-UVP-Topline.pdf")
	.append("text")
	.attr({
		"class": "title",
		"x": width/2,
		"y": 0,
		"dy": "1.6em",
		"text-anchor": "middle"
		})
	.style("fill", "darkblue")
	.text(report);
