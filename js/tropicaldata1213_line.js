// load data from file
d3.json("../../data/tropicaldata1213.json", function(error, tropical_data){
	var categoryChart = dc.barChart("#dc-category-chart"),
		windChart = dc.barChart("#dc-wind-chart"),
		dateChart = dc.lineChart("#dc-date-chart"),
		dataTable = dc.dataTable("#dc-data-table");

	var parseDate = d3.time.format("%Y-%m-%d").parse;

	tropical_data.forEach(function(d){
		d.date = parseDate(d.date);
	});
	// run data through crossfilter
	var logs = crossfilter(tropical_data);

	/**********************************/
	/* create dimensions to filter by */
	/**********************************/

	// for category
	var catValue = logs.dimension(function(d){ return d.category; });
	// let's sum the categories per category
	var catValueGroupSum = catValue.group().reduceSum(function(d){ return d.category; });
	// let's count the number of logs by category
	var catValueGroupCount = catValue.group().reduceCount(function(d){ return d.category; });


	// for wind speed
	var windValue = logs.dimension(function(d){ return d.wind; });
	// let's group
	var windValueGroup = windValue.group();

	// define a daily volume dimension
	var dateDim = logs.dimension(function(d){ return d.date; });
	// reduce to group sum
	var dateDimGroup = dateDim.group().reduceSum(function(d){ return d.category; });
	var minDate = dateDim.bottom(1)[0].date;
	var maxDate = dateDim.top(1)[0].date;

	/**********************************/
	/* create the visualisations 	  */
	/**********************************/

	// category bar graph summed
	categoryChart
		.width(400).height(200)
		.margins({ top:10, right:10, bottom:40, left:40 })
		.dimension(catValue)
		.group(catValueGroupCount)
		.transitionDuration(500)
		.centerBar(true)
		.gap(10)
		.x(d3.scale.linear().domain([-0.5, 5.5]))
		.xUnits(function(){ return 20;})
		.elasticY(true)
		.renderHorizontalGridLines(true)
		.xAxisLabel("CATEGORY")
		.yAxisLabel("OCCURENCE")
		.xAxis().tickFormat(function(v){ return v; }).ticks(6);

	//wind bar chart
	windChart
		.width(500).height(200)
		.margins({ top: 10, right: 10, bottom: 40, left:40 })
		.dimension(windValue)
		.group(windValueGroup)
		.transitionDuration(500)
		.centerBar(true)
		.gap(3)
		.x(d3.scale.linear().domain([10, 190]))
		.xUnits(function(){ return 40; })
		.elasticY(true)
		.renderHorizontalGridLines(true)
		.xAxisLabel("WIND SPEED")
		.yAxisLabel("OCCURENCE")
		.xAxis().tickFormat(function(v){ return v; });

	dateChart
		.width(960).height(300)
		.margins({ top: 10, right:10, bottom:100, left:40 })
		.dimension(dateDim)
		.group(dateDimGroup)
		.transitionDuration(500)
		.elasticY(true)
		.renderHorizontalGridLines(true)
		.xAxisLabel("DATE")
		.yAxisLabel("OCCURENCE")
		.yAxisPadding(0.5)
		.x(d3.time.scale().domain([minDate, maxDate]))
		.renderlet(function (chart) {chart.selectAll("g.x text").attr('dx', '-0.8em').attr(
  			'dy', '0.15em').attr('transform', "rotate(-65)").style("text-anchor", "end");})
		.xAxis();

	/**********************************/
	/* render the charts		 	  */
	/**********************************/
	dc.renderAll();

})