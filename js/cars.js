var blue_to_brown = d3.scale.linear()
		  .domain([8,51])
		  .range(["steelblue", "brown"])
		  .interpolate(d3.interpolateLab);

//var blue_to_brown = d3.scale.category20b();

var color = function(d) { return blue_to_brown(d['mpg']); };

var parcoords = d3.parcoords()("#cars")
    .color(color)
    .alpha(0.6);



// load csv file and create the chart
d3.json('../data/cars.json', function(data) {
  parcoords
    .data(data)
    .margin({ top: 24, left: 80, bottom: 12, right: 0 })
    .render()
    .shadows()
    .brushable();  // enable brushing

  parcoords.svg.selectAll("text")
			.style("font", "bold 12px sans-serif");

  d3.select('#btnReset').on('click', function() {parcoords.brushReset();})
});