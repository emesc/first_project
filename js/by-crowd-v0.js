// load data from file
d3.csv("../data/crowd-v0.csv", function(data){
	var dtgFormat = d3.time.format("%Y-%m-%dT%H:%M:%S");

	data.forEach(function(d){
		d.dtg = dtgFormat.parse(d.timestamp.substr(0,19));
		// d.mallcode = +d.mallcode;
		// d.type = +d.type;
		d.volume = +d.volume;
	})

	var duration = 500;
	var crowdChart = dc.lineChart("#crowd-per-hour-line-chart");

	var ndx = crossfilter(data);

	var timeDim = ndx.dimension(function(d){ return d.dtg; });//return d3.time.hour(d.dtg); });
	var crowdByHour = timeDim.group().reduceSum(function(d){ return d.volume; });

	print_filter(crowdByHour);

	crowdChart
		.width(960).height(250)
		.margins({top: 10, right: 10, bottom: 20, left: 40})
		.dimension(timeDim)
		.group(crowdByHour)
		.transitionDuration(duration)
		.elasticY(true)
		.x(d3.time.scale().domain([new Date(2013, 6, 18), new Date(2013, 6, 24)]))
		.xAxis();

	dc.renderAll();
})

function print_filter(filter){
	var f=eval(filter);
	if (typeof(f.length) != "undefined") {}else{}
	if (typeof(f.top) != "undefined") {f=f.top(Infinity);}else{}
	if (typeof(f.dimension) != "undefined") {f=f.dimension(function(d) { return "";}).top(Infinity);}else{}
	console.log(filter+"("+f.length+") = "+JSON.stringify(f).replace("[","[\n\t").replace(/}\,/g,"},\n\t").replace("]","\n]"));
} 