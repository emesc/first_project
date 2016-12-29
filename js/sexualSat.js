var margin = {
				top: 20,
				bottom: 80,
				right: 20,
				left: 50
				},
	width = 1000 - margin.left - margin.right,
	height = 600 - margin.top - margin.bottom,

	x = d3.scale.linear().range([0, width]),
	y = d3.scale.linear().range([height, 0]),

	colour = d3.scale.category20(),

	satScale = d3.scale.linear().range([1, 40]);

	xAxis = d3.svg.axis().scale(x).orient("bottom"),
	yAxis = d3.svg.axis().scale(y).orient("left"),

	//div = d3.select("body")
	div = d3.select("#sexualSat")
				.append("div")
				.attr("class", "tooltip")
				.style("opacity", 0),

	//svg = d3.select("body")
	svg = d3.select("#sexualSat")
				.append("svg")
				.attr({
					"width": width + margin.left + margin.right,
					"height": height + margin.top + margin.bottom
					})
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.tsv("../data/sexualSatRate.tsv", function(error, data){
	data.forEach(function(d){
		d.perCapitaGDP = +d.perCapitaGDP;
		d.sexRatePerWk = +d.sexRatePerWk;
		d.satisfactionRate = +d.satisfactionRate;
		d.population = +d.population;
		d.country = d.country;
	});

	x.domain(d3.extent(data, function(d){ return d.sexRatePerWk; })).nice();
	//y.domain(d3.extent(data, function(d){ return d.perCapitaGDP; })).nice();
	//x.domain([0, d3.max(data, function(d){ return d.sexRatePerWk; })]).nice();
	// map the range instead from -5 so the dot won't overlap with the x axis label
	y.domain([-5, d3.max(data, function(d){ return d.perCapitaGDP; })]).nice();
	satScale.domain([0, d3.max(data, function(d){ return d.satisfactionRate; })]);

	svg.append("g")
		.attr({
			"class": "x axis",
			"transform": "translate(0," + height + ")"
			})
		.call(xAxis)
		.append("text")
		.attr({
			"class": "label",
			"x": width,
			"y": -6
			})
		.style("text-anchor", "end")
		.text("% of population having sex per week");

	svg.append("g")
		.attr("class", "y axis")
		.call(yAxis)
		.append("text")
		.attr({
			"class": "label",
			"transform": "rotate(-90)",
			"y": 6,
			"dy": "1em"
			})
		.style("text-anchor", "end")
		.text("per Capita GDP");

	svg.append("text")
		.attr({
			"class": "title",
			"transform": "translate(" + width/2 + "," + (height+margin.bottom/2) + ")"
			})
		.style("text-anchor", "middle")
		.text("Sexual satisfaction of selected countries based on per capita GDP (2006)");

	svg.selectAll(".dot")
		.data(data)
		.enter().append("circle")
		.attr({
			"class": "dot",
			"r": function(d){ return satScale(d.satisfactionRate); },
			"cx": function(d){ return x(d.sexRatePerWk); },
			"cy": function(d){ return y(d.perCapitaGDP); }
			})
		.style("fill", function(d){ return colour(d.population); })
		.style("opacity", 0.9)
		.on("mouseover", function(d){
					div.transition()
						.duration(400)
						.style("opacity", 0.8)
						.style("width", "100px")
						.style("color", "white")
						.style("background", "black");
					div.html(d.country + ", " + d.satisfactionRate + "%" + "<br>" + d.population + "M")
						.style({
							"left": (d3.event.pageX - 440) + "px",
							"top": (d3.event.pageY - 160) + "px"
						});
			})
		.on("mouseout", function(d){ 
					div.transition()
						.duration(500)
						.style("opacity", 0);
			});

	function tabulate(data, columns){
		var table = d3.select("body").select("div#sexualSat")
						.append("table")
						.attr("style", "margin: auto")
						.style({
							"border-collapse": "collapse",
							"border": "2px black solid"
							}),
			thead = table.append("thead"),
			tbody = table.append("tbody");

		thead.append("tr")
				.selectAll("th")
				.data(columns)
				.enter()
				.append("th")
				.text(function(column){ return column; });

		// create row values
		var rows = tbody.selectAll("tr")
						.data(data)
						.enter()
						.append("tr");

		// create cells for each row
		var cells = rows.selectAll("td")
						.data(function(row){
							return columns.map(function(column){
								return { column: column, value: row[column]};
							});
						})
						.enter()
						.append("td")
						.html(function(d){ return d.value});

		return table;
	}
	// create the table
	var satTable = tabulate(data, ["country", "population", "perCapitaGDP", "sexRatePerWk", "satisfactionRate", "remarks"]);

	satTable.selectAll("tbody tr")
			.sort(function(a, b){
				return d3.descending(a.satisfactionRate, b.satisfactionRate);
			});

	satTable.selectAll("thead th")
			.text(function(column){
				return column.charAt(0).toUpperCase() + column.substr(1);
			})
			.style("text-align", "center");
});