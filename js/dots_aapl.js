var margin = {
				top: 50,
				right: 40,
				bottom: 50,
				left: 30
			},
	width = 950 - margin.left - margin.right,
	height = 300 - margin.top -margin.bottom,

 	parseDate = d3.time.format("%Y-%m-%d").parse,

 	tooltipDisplay = d3.time.format("%e %B"),

	x = d3.time.scale().range([0, width]),
	y = d3.scale.linear().range([height, 0]),

	xAxis = d3.svg.axis().scale(x)
					.orient("bottom").ticks(6),

	yAxis = d3.svg.axis().scale(y)
					.orient("left").ticks(5),

	valuesClose = d3.svg.line()
				.x(function(d){ return x(d.date); })
				.y(function(d){ return y(d.close); }),

	//div = d3.select("body")
	div = d3.select("#dots_aapl")
			.append("div")
			.attr("class", "tooltip")
			.style("opacity", 0);

	//svg = d3.select("body")
	svg = d3.select("#dots_aapl")
			.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// read the data
	d3.tsv("../data/apple.tsv", function(error, data){
		data.forEach(function(d){
			d.date = parseDate(d.date);
			d.close = +d.close;
		});

		// scale the data range to domain
		x.domain(d3.extent(data, function(d){ return d.date; }));
		y.domain([0, d3.max(data, function(d){ return d.close; })]);

		// add dots on the coordinates
		svg.selectAll("dot")
	  			.data(data)
				.enter().append("circle")
				.attr({
					"class": "dot",
					"r": 3,
					"cx": function(d){ return x(d.date); },
					"cy": function(d){ return y(d.close); },
					"transform": "translate(" + margin.left + ",0)"
					})
				.on("mouseover", function(d){
					div.transition()
						.duration(300)
						.style("opacity", 0.9);
					div.html(tooltipDisplay(d.date) + "<br>" + "USD " + d.close)
						.style({
							"left": (d3.event.pageX - 420) + "px",
							"top": (d3.event.pageY - 150) + "px"
							});					
					})
				.on("mouseout", function(d){
					div.transition()
						.duration(500)
						.style("opacity", 0);
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

		svg.append("text")	
			.attr({
				"transform": "translate(" + width/2 + "," + -margin.top/2 + ")",
				"class": "title"
				})
			.style({
				"text-anchor": "middle",
				"font-size": "16px",
				"text-decoration": "underline",
				"font-style": "italic"
				})
			.text("Apple Inc (2014, Quarter 1)");

		svg.append("text")
			.attr("transform", "translate(" + width/2 + "," + (height + margin.bottom) + ")")
			.style("text-anchor", "middle")
			.text("Date");

		svg.append("text")
			.attr({
				"transform": "rotate(-90)",
				"y": -margin.left,
				"x": -height + margin.bottom*2,
				"dy": "1em"
				})
			.style("text-anchor", "middle")
			.text("Adjusted Closing Prices, USD");

	});

