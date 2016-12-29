var margin = {
				top: 30,
				right: 20,
				bottom: 50,
				left: 30
			},
	width = 1000 - margin.left - margin.right,
	height = 300 - margin.top -margin.bottom;

var parseDate = d3.time.format("%Y-%m-%d").parse;

var	x = d3.time.scale().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

var xAxis = d3.svg.axis().scale(x)
					.orient("bottom").ticks(6);

var	yAxis = d3.svg.axis().scale(y)
					.orient("left").ticks(5);

var valuesClose = d3.svg.line()
				.x(function(d){ return x(d.date); })
				.y(function(d){ return y(d.close); });

//var	svg = d3.select("body")
var	svg = d3.select("#line_00")
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

		// add the values path
		svg.append("path")
			.attr("class", "line")
			.attr("d", valuesClose(data));

		// create the x axis
		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis);

		svg.append("g")
			.attr("class", "y axis")
			.call(yAxis);
	});

