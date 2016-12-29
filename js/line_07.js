var margin = {
				top: 30,
				right: 40,
				bottom: 100,
				left: 30
			},
	width = 1000 - margin.left - margin.right,
	height = 300 - margin.top -margin.bottom,

	parseDate = d3.time.format("%Y-%m-%d").parse,

	x = d3.time.scale().range([0, width]),
	y_aapl_0 = d3.scale.linear().range([height, 0]),

	xAxis = d3.svg.axis().scale(x)
					.orient("bottom").ticks(21)
					.tickFormat(d3.time.format("%d-%b-%y")),

	yAxis_aapl_0 = d3.svg.axis().scale(y_aapl_0)
					.orient("left").ticks(5),

	values_aapl_0 = d3.svg.line()
				.interpolate("basis")
				.x(function(d){ return x(d.date); })
				.y(function(d){ return y_aapl_0(d.adjClose); }),

	area_aapl_0 = d3.svg.area()
						.interpolate("basis")
						.x(function(d){ return x(d.date); })
						.y0(height)
						.y1(function(d){ return y_aapl_0(d.adjClose); }),

	//svg = d3.select("body")
	svg = d3.select("#line_07")
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
function y_grid_aapl_0(){
	return d3.svg.axis()
		.scale(y_aapl_0)
		.orient("left")
		.ticks(5)
}

// read the data; go up to the highest folder level then let d3 search for data folder
d3.tsv("../data/aapl_2014q1.tsv", function(error, data){
	data.forEach(function(d){
		d.date = parseDate(d.date);
		d.adjClose = +d.adjClose;
	});

	// scale the data range to domain
	x.domain(d3.extent(data, function(d){ return d.date; }));
	y_aapl_0.domain([0, d3.max(data, function(d){ return Math.max(d.adjClose); })]);

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
		.call(y_grid_aapl_0()
			.tickSize(-width, 0, 0)
			.tickFormat("")
		);

	// add the values path
	svg.append("path")
		.attr({
			"class": "line",
			"d": values_aapl_0(data),
			"transform": "translate(" + margin.left + ",0)"
			});

	// shade the area under the curves
	svg.append("path")
		.datum(data)
		.attr({
			"class": "area_aapl_0",
			"d": area_aapl_0(data),
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
			.call(yAxis_aapl_0);

	// create title
	svg.append("text")
		.attr("transform", "translate(" + width/2 + "," + -margin.top/2 + ")")
		.attr("class", "title")
		.style({
			"text-anchor": "middle",
			"font-size": "16px",
			"text-decoration": "underline"
			})
		.text("Apple Inc Adjusted Closing Prices (2014, Quarter 1)");

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
		.text("Adj Closing Prices (USD)");		
});

// switch to previous quarter on user's click
function updateData(){

	//retrieve data
	d3.tsv("../data/aapl_2013q4.tsv", function(error, data){
		data.forEach(function(d){
			d.date = parseDate(d.date);
			d.adjClose = +d.adjClose;
		});

	// scale range to domain
	x.domain(d3.extent(data, function(d){ return d.date; }));
	y_aapl_0.domain([0, d3.max(data, function(d){ return d.adjClose; })]);

	// select which svg to modify
	var svg = d3.select("#line_07").transition();

	// mods
		svg.select(".line")
			.duration(1000)
			.attr("d", values_aapl_0(data));

		// tried shading but can't
		svg.select(".area_aapl_0")
			.duration(800)
			.attr("d", area_aapl_0(data));

		svg.select(".x.axis")
			.duration(800)
			.call(xAxis)
				.selectAll("text")
					.style("text-anchor", "end")
					.attr({
						"dx": "-0.8em",
						"dy": "0.15em",
						"transform": function(d){ return "rotate(-65)" }
						});

		svg.select(".y.axis")
			.duration(800)
			.call(yAxis_aapl_0);

		svg.select(".title")
			.duration(800)
			.attr("transform", "translate(" + width/2 + "," + -margin.top/2 + ")")
			.style({
				"text-anchor": "middle",
				"font-size": "16px",
				"text-decoration": "underline"
				})
			.text("Apple Inc Adjusted Closing Prices (2013, Quarter 4)");
	});
}

