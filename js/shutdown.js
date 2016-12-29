var margin = {
				top: 50,
				right: 20,
				bottom: 50,
				left: 50
			},
	width = 950 - margin.left - margin.right,
	height = 400 - margin.top -margin.bottom,

	x = d3.scale.ordinal()
    		.rangeRoundBands([0, width], 0.3, 0.3),

	y = d3.scale.linear()
    		.range([height, 0]),

	xAxis = d3.svg.axis()
    			.scale(x)
    			.orient("bottom"),

	yAxis = d3.svg.axis()
    			.scale(y)
    			.orient("left")
    			.ticks(8),

  svg = d3.select("#shutdown").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  	.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.tsv("../data/survey.tsv", function(error, data) {
	data.forEach(function(d){
		d.response = +d.response;
	});
  	x.domain(data.map(function(d) { return d.answer; }));
  	y.domain([0, d3.max(data, function(d) { return d.response; })]);

  	svg.append("g")
      	.attr("class", "x axis")
      	.attr("transform", "translate(0," + height + ")")
        .style("fill", "darkblue")
      	.call(xAxis)
    	   .selectAll(".tick text")
      	.call(wrap, x.rangeBand());

  	svg.append("g")
      	.attr("class", "y axis")
        .style("fill", "darkblue")
      	.call(yAxis);

  	svg.selectAll(".bar")
      	.data(data)
    	.enter().append("rect")
    	.attr({
    		"class": "bar",
    		"x": function(d) { return x(d.answer); },
    		"width": x.rangeBand(),
    		"y": function(d) { return y(d.response); },
    		"height": function(d) { return height - y(d.response); }
    	});

    svg.append("text")
        //.attr({"x": x(data[0].name),
          .attr({"x": width/4,
                "y": -margin.top/2,
                "class": "title"
              })
        .style({
          "text-anchor": "middle",
          "font-size": "20px",
          "fill": "darkblue"
            })
        .text("US government shutdown of 2013: Who to blame?");
});

function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null)
                    .append("tspan")
                    .attr("x", 0)
                    .attr("y", y)
                    .attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan")
        				.attr("x", 0)
        				.attr("y", y)
        				.attr("dy", ++lineNumber * lineHeight + dy + "em")
        				.text(word);
      }
    }
  });
}