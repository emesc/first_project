var margin = {
				top: 30,
				right: 20,
				bottom: 50,
				left: 80
			},
	width = 1000 - margin.left - margin.right,
	height = 300 - margin.top -margin.bottom,

	parseDate = d3.time.format("%Y-%m-%d").parse,

	x = d3.time.scale().range([0, width]),
	y = d3.scale.linear().range([height, 0]),

	xAxis = d3.svg.axis().scale(x)
					.orient("bottom").ticks(6),

	yAxis = d3.svg.axis().scale(y)
					.orient("left").ticks(5),

	valuesClose = d3.svg.line()
				.x(function(d){ return x(d.date); })
				.y(function(d){ return y(d.close); }),

	valuesOpen = d3.svg.line()
				.x(function(d){ return x(d.date); })
				.y(function(d){ return y(d.open); }),

	areaClose = d3.svg.area()
						.interpolate("basis")
						.x(function(d){ return x(d.date); })
						.y0(height)
						.y1(function(d){ return y(d.close); });

	areaOpen = d3.svg.area()
						.interpolate("basis")
						.x(function(d){ return x(d.date); })
						.y0(height)
						.y1(function(d){ return y(d.open); });

	//svg = d3.select("body")
	svg = d3.select("#line_01")
			.append("svg")
			.attr("width", width + margin.left)// + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// read the data; go up to the highest folder level then let d3 search for data folder
	d3.tsv("../data/apple.tsv", function(error, data){
		data.forEach(function(d){
			d.date = parseDate(d.date);
			d.close = +d.close;
			d.open = +d.open;
		});

		// scale the data range to domain
		x.domain(d3.extent(data, function(d){ return d.date; }));
		y.domain([0, d3.max(data, function(d){ return Math.max(d.close, d.open); })]);

		// add the values path
		svg.append("path")
			.attr({
				"class": "line",
				"d": valuesClose(data),
				"transform": "translate(" + margin.left + ",0)"
			});
			
		svg.append("path")
			.style("stroke", "red")
			.attr({
				"class": "line",
				"d": valuesOpen(data),
				"transform": "translate(" + margin.left + ", 0)"
				});

		// shade the area under the curves
		svg.append("path")
			.datum(data)
			.attr({
				"class": "areaClose",
				"d": areaClose,
				"transform": "translate(" + margin.left + ", 0)"
				});

		svg.append("path")
			.datum(data)
			.attr({
				"class": "areaOpen",
				"d": areaOpen,
				"transform": "translate(" + margin.left + ",0)"
				});

		// create the axes
		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(" + margin.left + "," + height + ")")
			.call(xAxis);

		svg.append("g")
			.attr("class", "y axis")
			.attr("transform", "translate(" + margin.left + ",0)")
			.call(yAxis);

		// label the axes
		svg.append("text")
			.attr("transform", "translate(" + width/2 + "," + (height+margin.bottom) + ")")
			.style("text-anchor", "middle")
			.text("Date (First Quarter of 2014)");

		svg.append("text")
			.attr({
				"transform": "rotate(-90)",
				"x": -height/2,
				"y": 0,
				"dy": "1em"
				})
			.style("text-anchor", "middle")
			.text("Value (USD)");
	});