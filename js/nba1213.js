// load data from json file
d3.json("../data/nba1213.json", function(error, nba1213_data){

	// create dc charts and link to divs
	var bubbleChart = dc.bubbleChart("#dc-bubble-chart"),
		rowChart = dc.rowChart("#dc-row-chart"),
		dataTable = dc.dataTable("#dc-data-table");

	// run data through crossfilter
	var ndx = crossfilter(nba1213_data);

	// create dimensions
	var teamDim = ndx.dimension(function(d){ return d.Team; });
	var teamGroup = teamDim.group().reduceSum(function(d){ return d.PTS; });
	var teamDimGroup = teamDim.group().reduce(
		//add
		function(p, v){
			//++p.count;
			p.FG = v.FG;
			p.FGA = v.FGA;
			p.Rk = v.Rk;
			p.PTS = v.PTS;
			return p;
		},
		//remove
		function(p, v){
			//--p.count;
			p.FG = 0;
			p.FGA = 0;
			p.Rk = 0;
			p.PTS = 0;
			return p;
		},
		//init
		function(p, v){
			return {};
		}
		);

	// for data table
	var rankDim = ndx.dimension(function(d){ return d.Rk; });

	// create the visualizations

	bubbleChart
		.width(700).height(500)
		.dimension(teamDim)
		.group(teamDimGroup)
		.transitionDuration(1500)
		.colors(d3.scale.category20b())
		.margins({ top: 10, left: 50, right: 20, bottom: 50})
		.x(d3.scale.linear().domain([2700, 3400]))
		.y(d3.scale.linear().domain([4000, 7500]))
		.r(d3.scale.linear().domain([0, 200]))
		.keyAccessor(function(p){
			return p.value.FG;
		})
		.valueAccessor(function(p){
			return p.value.FGA;
		})
		.radiusValueAccessor(function(p){
			return p.value.Rk;
		})		
		.elasticY(true)
		.yAxisPadding(50)
		.yAxisLabel("Field Goal Attempts (FGA)")
		.xAxisPadding(1)
		.xAxisLabel("Field Goal (FG)")
		.label(function(p){
			return p.key;
		})
		.renderLabel(true)
		.renderlet(function(chart){
			rowChart.filter(chart.filter());
		})
		.on("click", function(chart){
			dc.events.trigger(function(){
				rowChart.filter(chart.filter());
			});
		});

	rowChart
		.width(350).height(850)
		.margins({ top: 10, left: 80, right: 20, bottom: 30})
		.dimension(teamDim)
		.group(teamGroup)
		.renderLabel(true)
		.colors(["#a60000","#ff0000", "#ff4040","#ff7373","#67e667","#39e639","#00cc00"])
		.colorDomain([0, 0])
		.renderlet(function(chart){
			bubbleChart.filter(chart.filter());
		})
		.on("filtered", function(chart){
			dc.events.trigger(function(){
				bubbleChart.filter(chart.filter());
			});
		});

	dataTable
		.width(800).height(800)
		.dimension(rankDim)
		.group(function(d){ return "Team Stats"})
		.size(100)
		.columns([
			function(d){ return d.Rk; },
			function(d){ return d.Team; },
			function(d){ return d.FG; },
			function(d){ return d.FGA; },
			function(d){ return (d.FGR*100).toFixed(1); },
			function(d){ return	d.PTS; },
			function(d){ return '<a href=\"http://maps.google.com/maps?z=12&t=m&q=loc:' + d.LOC +"\" target=\"_blank\">Map</a>" }
			])
		.sortBy(function(d){ return d.Rk; })
		.order(d3.ascending);

	dc.renderAll();
})