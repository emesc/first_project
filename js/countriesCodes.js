var width = 950,
    height = 900,

	projection = d3.geo.mercator()
				    .center([0, 0 ])
				    //.rotate([180,0])
				    .scale(150)//.scale(width/2/Math.PI)
				    .translate([width/2, height/2])
				    .precision(0.1),

	div = d3.select("#worldMap")
    		.append("div")
    		.attr("class", "tooltip")
    		.style("opacity", 0),

	svg = d3.select("#worldMap")
				.append("svg")
			    .attr({
			    	"width": width,
			    	"height": height
			    }),

	path = d3.geo.path()
    			.projection(projection),

	g = svg.append("g");

// load and display the world
queue()
	.defer(d3.json, "../data/world-110m2.json")
	.defer(d3.csv, "../data/countries.csv")
	.await(ready);

function ready(error, world, names) {
	//var format = d3.format('03.2f');

	// names.forEach(function(d){
	// 	d.popgrowth = parseFloat(d.popgrowth);
	// 	// console.log(typeof(d.popgrowth));
	// });

	var countries = topojson.object(world, world.objects.countries).geometries;
	var	popScale = d3.scale.linear()
						.domain([-4.0, 10.0])
						.rangeRound([1, 15]);

	// console.log(popScale(-3.0));

	g.attr("class", "country")
    	.selectAll("path")
	    .data(countries)
	    .enter()
	    .append("path")
	    .attr("d", path);

	g.selectAll("circle")
		.data(names)
		.enter()
		.append("circle")
		.attr({
			"cx": function(d){ return projection([d.longitude, d.latitude])[0]; },
			"cy": function(d){ return projection([d.longitude, d.latitude])[1]; },
			"r": function(d){ return popScale(d.popgrowth); }
		})
		.style("fill", "#D90000")
		.style("opacity", 0.7)
		.on("mouseover", function(d){
			div.transition()
				.duration(400)
				.style("opacity", 0.9)
				.style("color", "black")
			div.html(d.country + "<br>" + d.ccode + "<br>" + d.popgrowth + "%")
				.style("left", (d3.event.pageX-width/2) + "px")
				.style("top", (d3.event.pageY-height/6) + "px");
		})
		.on("mouseout", function(d){
			div.transition()
				.duration(500)
				.style("opacity", 0);
		});
}
