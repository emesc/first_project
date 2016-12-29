var margin = {
				top: 30,
				right: 20,
				bottom: 70,
				left: 30
			},
	width = 950 - margin.left - margin.right,
	height = 300 - margin.top -margin.bottom,

	parseDate = d3.time.format("%Y-%m-%d").parse,

	x = d3.time.scale().range([0, width-margin.right*4]),
	y_aapl = d3.scale.linear().range([height, 0]),
	y_mcd = d3.scale.linear().range([height, 0]),

	xAxis = d3.svg.axis().scale(x)
					.orient("bottom").ticks(21),

	yAxis_aapl = d3.svg.axis().scale(y_aapl)
					.orient("left").ticks(5),

	yAxis_mcd = d3.svg.axis().scale(y_mcd)
					.orient("right").ticks(5),

	values_aapl = d3.svg.line()
				.interpolate("basis")
				.x(function(d){ return x(d.date); })
				.y(function(d){ return y_aapl(d.aapl_adjClose); }),

	values_mcd = d3.svg.line()
				.interpolate("basis")
				.x(function(d){ return x(d.date); })
				.y(function(d){ return y_mcd(d.mcd_adjClose); }),

	area_aapl = d3.svg.area()
						.interpolate("basis")
						.x(function(d){ return x(d.date); })
						.y0(height)
						.y1(function(d){ return y_aapl(d.aapl_adjClose); }),

	area_mcd = d3.svg.area()
						.interpolate("basis")
						.x(function(d){ return x(d.date); })
						.y0(height)
						.y1(function(d){ return y_mcd(d.mcd_adjClose); }),

	//svg = d3.select("body")
	svg = d3.select("#line_05")
			.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// for the grids
	function x_grid(){
	return d3.svg.axis()
		.scale(x)
		.orient("bottom")
		.ticks(21)
	}

	// this is enough, a separate fxn for mcd clutters the chart
	function y_grid_aapl(){
		return d3.svg.axis()
			.scale(y_aapl)
			.orient("left")
			.ticks(5)
	}

	// read the data; go up to the highest folder level then let d3 search for data folder
	d3.tsv("../data/aapl_mcd.tsv", function(error, data){
		data.forEach(function(d){
			d.date = parseDate(d.date);
			d.aapl_adjClose = +d.aapl_adjClose;
			d.mcd_adjClose = +d.mcd_adjClose;
		});

		// scale the data range to domain
		x.domain(d3.extent(data, function(d){ return d.date; }));
		y_aapl.domain([0, d3.max(data, function(d){ return 20+Math.max(d.aapl_adjClose); })]);
		y_mcd.domain([0, d3.max(data, function(d){ return 20+Math.max(d.mcd_adjClose); })]);

		// create the grids
		svg.append("g")
			.attr("class", "grid")
			.attr("transform", "translate(" + margin.left + "," + height + ")")
			.style("stroke-dasharray", ("3, 3"))
			.call(x_grid()
				.tickSize(-height, 0, 0)
				.tickFormat("")
			);

		svg.append("g")
			.attr("class", "grid")
			.attr("transform", "translate(" + margin.left + ",0)")
			.style("stroke-dasharray", ("3, 3"))
			.call(y_grid_aapl()
				.tickSize(-width+margin.right*4, 0, 0)
				.tickFormat("")
			);

		// add the values path
		svg.append("path")
			.attr({
				"class": "line",
				"d": values_aapl(data),
				"transform": "translate(" + margin.left + ",0)"
			});

		svg.append("path")
			.style("stroke", "red")
			.attr({
				"class": "line",
				"d": values_mcd(data),
				"transform": "translate(" + margin.left + ",0)"
				});

		// shade the area under the curves
		svg.append("path")
			.datum(data)
			.attr({
				"class": "area_aapl",
				"d": area_aapl,
				"transform": "translate(" + margin.left + ",0)"
				});

		svg.append("path")
			.datum(data)
			.attr({
				"class": "area_mcd",
				"d": area_mcd,
				"transform": "translate(" + margin.left + ",0)"
				});

		// create the axes
		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(" + margin.left + "," + height + ")")
			.call(xAxis)
			.selectAll("text")
				.style("text-anchor", "end")
				.attr({
					"dx": "-0.8em",
					"dy": "0.15em",
					"transform": function(d){ return "rotate(-65)" }});

		svg.append("g")
			.attr("class", "y axis")
			.attr("transform", "translate(" + margin.left + ",0)")
			.style("fill", "green")
			.call(yAxis_aapl);

		svg.append("g")
			.attr("class", "y axis")
			.attr("transform", "translate(" + margin.left + ",0)")
			.attr("transform", "translate(" + (width-margin.right-margin.left) + ",0)")
			.style("fill", "red")
			.call(yAxis_mcd);

		// create title
		svg.append("text")
			.attr("transform", "translate(" + width/2 + "," + -margin.top/2 + ")")
			.style({
				"text-anchor": "middle",
				"font-size": "16px",
				"text-decoration": "underline"
				})
			.text("Apple Inc vs McDonald's Corp Historical Prices (2014, Quarter 1)");

		// label the axes
		svg.append("text")
			.attr("transform", "translate(" + width/2 + "," + (height+margin.bottom) + ")")
			.style("text-anchor", "middle")
			.text("Date");

		svg.append("text")
			.attr({
				"transform": "rotate(-90)",
				"x": -height/2,
				"y": -margin.left,
				"dy": "1em"
				})
			.style({
				"text-anchor": "middle",
				"fill": "green"
				})
			.text("Apple Inc (USD)");	

		svg.append("text")
			.attr({
				"transform": "rotate(-90)",
				"x": -height/2,
				"y": width + margin.right/4,
				"dy": "1em"
				})
			.style({
				"text-anchor": "middle",
				"fill": "red"
				})
			.text("McDonald's Corp (USD)");		

	});

