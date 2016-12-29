var data = [
			  {
			    "aircraft":"Airbus A300",
			    "accidents":32,
			    "fatalities":1436
			  },
			  {
			    "aircraft":"Airbus A310",
			    "accidents":8,
			    "fatalities":700
			  },
			  {
			    "aircraft":"Airbus A320",
			    "accidents":20,
			    "fatalities":636
			  },
			  {
			    "aircraft":"Airbus A321",
			    "accidents":2,
			    "fatalities":152
			  },
			  {
			    "aircraft":"Airbus A330",
			    "accidents":6,
			    "fatalities":338
			  },
			  {
			    "aircraft":"Airbus A340",
			    "accidents":4,
			    "fatalities":0
			  },
			  {
			    "aircraft":"ATR 42/72",
			    "accidents":33,
			    "fatalities":416
			  },
			  {
			    "aircraft":"Boeing 737",
			    "accidents":136,
			    "fatalities":4186
			  },
			  {
			    "aircraft":"Boeing 737 Next Gen",
			    "accidents":13,
			    "fatalities":527
			  },
			  {
			    "aircraft":"Boeing 747",
			    "accidents":46,
			    "fatalities":3709
			  },
			  {
			    "aircraft":"Boeing 757",
			    "accidents":8,
			    "fatalities":572
			  },
			  {
			    "aircraft":"Boeing 767",
			    "accidents":12,
			    "fatalities":851
			  },
			  {
			    "aircraft":"Boeing 777",
			    "accidents":3,
			    "fatalities":3
			  },
			  {
			    "aircraft":"BAe 146/Avro RJ",
			    "accidents":12,
			    "fatalities":227
			  },
			  {
			    "aircraft":"Beech 1900D",
			    "accidents":1,
			    "fatalities":19
			  },
			  {
			    "aircraft":"Canadair Regional Jet",
			    "accidents":10,
			    "fatalities":162
			  },
			  {
			    "aircraft":"McDonnell Douglas DC-10",
			    "accidents":19,
			    "fatalities":509
			  },
			  {
			    "aircraft":"Dash 8",
			    "accidents":4,
			    "fatalities":77
			  },
			  {
			    "aircraft":"Embraer 120 Brasilia",
			    "accidents":4,
			    "fatalities":48
			  },
			  {
			    "aircraft":"Embraer 135/145",
			    "accidents":6,
			    "fatalities":22
			  },
			  {
			    "aircraft":"Embraer 190/195",
			    "accidents":3,
			    "fatalities":75
			  },
			  {
			    "aircraft":"Fokker 70/100",
			    "accidents":7,
			    "fatalities":179
			  },
			  {
			    "aircraft":"Fokker 50",
			    "accidents":2,
			    "fatalities":7
			  },
			  {
			    "aircraft":"Lockheed L-1011 TriStar",
			    "accidents":6,
			    "fatalities":233
			  },
			  {
			    "aircraft":"McDonnell Douglas MD-11",
			    "accidents":9,
			    "fatalities":237
			  },
			  {
			    "aircraft":"McDonnell Douglas MD-80/90",
			    "accidents":23,
			    "fatalities":1150
			  },
			  {
			    "aircraft":"Saab 340",
			    "accidents":2,
			    "fatalities":0
			  },
			  {
			    "aircraft":"Concorde",
			    "accidents":1,
			    "fatalities":109
			  },
			  {
			    "aircraft":"Sukhoi SuperJet 100",
			    "accidents":1,
			    "fatalities":45
			  }
			];

var ndx = crossfilter(data);

var craftDim = ndx.dimension(function(d){ return d.aircraft; });

var status_accidents = craftDim.group().reduceSum(function(d){ return d.accidents; });
var status_fatalities = craftDim.group().reduceSum(function(d){ return d.fatalities; });

var accidentsChart = dc.barChart("#chart-bar-accidents");
var fatalitiesChart = dc.barChart("#chart-bar-fatalities");
var dataTable = dc.dataTable("#table-accidents-fatalities");

accidentsChart
	.width(420).height(500)
	.dimension(craftDim)
	.group(status_accidents)
	.barPadding(0.8)
	.outerPadding(0.5)
	.gap(5)
	.centerBar(true)
	.elasticY(true)
	.ordinalColors(["#BF1E0F"])
	.x(d3.scale.ordinal())
	.xUnits(dc.units.ordinal)
	.margins({ top: 50, left: 50, right: 10, bottom: 200})
	.renderlet(function(chart){ chart.selectAll("g.x text").attr("dx", "-10").attr("dy", "-5")
		.attr("transform", "rotate(-90)").style("font-size", "10px").style("text-anchor", "end"); })
	.renderHorizontalGridLines(true)
	.yAxisLabel("NO. OF ACCIDENTS");

fatalitiesChart
	.width(420).height(500)
	.dimension(craftDim)
	.group(status_fatalities)
	.barPadding(0.8)
	.outerPadding(0.5)
	.gap(5)
	.centerBar(true)
	.elasticY(true)
	.ordinalColors(["#D77E00"])
	.x(d3.scale.ordinal())
	.xUnits(dc.units.ordinal)
	.margins({ top: 50, left: 50, right: 10, bottom: 200})
	.renderlet(function(chart){ chart.selectAll("g.x text").attr("dx", "-10").attr("dy", "-5")
		.attr("transform", "rotate(-90)").style("font-size", "10px").style("text-anchor", "end"); })
	.renderHorizontalGridLines(true)
	.yAxisLabel("NO. OF FATALITIES");

dataTable
	.dimension(craftDim)
	.group(function(d){ return "Accidents and Fatalities by Aircraft"; })
	.size(40)
	.columns([
		function(d){ return d.aircraft; },
		function(d){ return d.accidents; },
		function(d){ return d.fatalities; }
		])
	.sortBy(function(d){ return d.aircraft; })
	.order(d3.ascending);

dc.renderAll();