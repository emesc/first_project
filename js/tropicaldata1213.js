// load data from file
d3.json("../../data/tropicaldata1213.json", function(error, tropical_data){
	var yearChart = dc.pieChart("#dc-year-chart"),
		statChart = dc.pieChart("#dc-stat-chart"),
		categoryChart = dc.barChart("#dc-category-chart"),
		windChart = dc.barChart("#dc-wind-chart"),
		dateChart = dc.bubbleChart("#dc-date-chart"),
		dataTable = dc.dataTable("#dc-data-table");

	var parseDate = d3.time.format("%Y-%m-%d");

	tropical_data.forEach(function(d){
		d.date = parseDate.parse(d.date);
		d.year = d.date.getFullYear();
	});
	// run data through crossfilter
	var logs = crossfilter(tropical_data);

	/**********************************/
	/* create dimensions to filter by */
	/**********************************/

	function print_filter(filter){
		var f=eval(filter);
		if (typeof(f.length) != "undefined") {}else{}
		if (typeof(f.top) != "undefined") {f=f.top(Infinity);}else{}
		if (typeof(f.dimension) != "undefined") {f=f.dimension(function(d) { return "";}).top(Infinity);}else{}
		console.log(filter+"("+f.length+") = "+JSON.stringify(f).replace("[","[\n\t").replace(/}\,/g,"},\n\t").replace("]","\n]"));
	} 

	// for year
	var yearDim = logs.dimension(function(d){ return +d.year; });
	var yearDimGroup = yearDim.group().reduceCount(function(d){ return d.name; });

	// for stat
	var statDim = logs.dimension(function(d){ return d.status; });
	var statDimGroup = statDim.group().reduceCount(function(d){ return d.status; });
	print_filter("statDimGroup");

	// for category
	var catValue = logs.dimension(function(d){ return d.category; });
	// let's sum the categories per category
	var catValueGroupSum = catValue.group().reduceSum(function(d){ return d.category; });
	// let's count the number of logs by category
	var catValueGroupCount = catValue.group().reduceCount(function(d){ return d.category; });

	// for wind speed
	var windValue = logs.dimension(function(d){ return d.wind; });
	// let's group
	var windValueGroup = windValue.group().reduceCount(function(d){ return d.wind; });
	//print_filter("windValueGroup");

	// define a daily volume dimension
	var dateDim = logs.dimension(function(d){ return d.date; });
	// reduce to group sum
	var dateGroup = dateDim.group().reduceSum(function(d){ return d.category; });
	var dateDimGroup = dateDim.group().reduce(
		//add
		function(p, v){
			//++p.count;
			p.date = v.date;
			p.category = v.category;
			p.stat = v.stat;
			p.wind = v.wind;
			p.name = v.name;
			return p;
		},
		//remove
		function(p, v){
			//--p.count;
			p.date = 0;
			p.category = 0;
			p.stat = 0;
			p.wind = 0;
			p.name = 0;
			return p;
		},
		//init
		function(p, v){
			return {};
		}
		);

	// var minDate = dateDim.bottom(1)[0].date;
	// var maxDate = dateDim.top(1)[0].date;
	/* need to pad the x axis of bubble chart, 
	cannot use the 2 above as the 2 entries at the ends are slightly cut off */
	var minDate = new Date(2012,01,05);
	var maxDate = new Date(2013,12,05);

	// for data table date
	var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "June",
    				"July", "Aug", "Sep", "Oct", "Nov", "Dec" ];

	/**********************************/
	/* create the visualisations 	  */
	/**********************************/

	// pie chart for year
	yearChart
		.width(200).height(240)
		.transitionDuration(1000)
		.dimension(yearDim)
		.group(yearDimGroup)
		.innerRadius(20)
		.ordinalColors(["#FBD506","#A8BF12"]);

	// pie chart for status
	statChart
		.width(200).height(240)
		.transitionDuration(1000)
		.dimension(statDim)
		.group(statDimGroup)
		.innerRadius(80)
		.legend(dc.legend().x(40).y(85).itemHeight(13).gap(5))
		.renderLabel(false);

	// category bar graph summed
	categoryChart
		.width(150).height(200)
		.margins({ top:10, right:10, bottom:40, left:35 })
		.dimension(catValue)
		.group(catValueGroupCount)
		.transitionDuration(500)
		.centerBar(true)
		.gap(1)
		.colors(["#F41C54"])//(["#E54E45"])
		.x(d3.scale.linear().domain([-0.5, 5.5]))
		.xUnits(function(){ return 9;})
		.elasticY(true)
		.renderHorizontalGridLines(true)
		.xAxisLabel("CATEGORY")
		.yAxisLabel("OCCURENCE")
		.xAxis().tickFormat(function(v){ return v; }).ticks(6);

	// wind bar chart
	windChart
		.width(400).height(200)
		.margins({ top: 10, right: 10, bottom: 40, left:35 })
		.dimension(windValue)
		.group(windValueGroup)
		.transitionDuration(500)
		.centerBar(true)
		.gap(1)
		.colors(["#00AAB5"])//(["#13A3A5"])
		.x(d3.scale.linear().domain([20, 180]))
		.xUnits(function(){ return 35; })
		.elasticY(true)
		.renderHorizontalGridLines(true)
		.xAxisLabel("MAXIMUM WIND SPEED SUSTAINED (knots)")
		.yAxisLabel("OCCURENCE")
		.xAxis();

	// date-wind bubble chart
	dateChart
		.width(1000).height(450)
		.margins({ top: 10, right:10, bottom:60, left:35 })
		.dimension(dateDim)
		.group(dateDimGroup)
		//.colors(d3.scale.category10())
		.transitionDuration(500)
		.colors(["#c994c7","#df65b0","#e7298a","#ce1256","#91003f"])
        .colorDomain([0, 170])
        .colorAccessor(function (p) {
            return p.value.wind;
        })
		.keyAccessor(function(p){
			return p.value.date;
		})
		.valueAccessor(function(p){
			return p.value.wind;
		})
		.radiusValueAccessor(function(p){
			//return (p.value.category+1.0);
			return (0.5+(Math.PI*(Math.sqrt(p.value.category))));
		})		
		.label(function(p){
			return p.value.name;
			// if (p.value.category === 0) return (p.value.stat + "");
			// else { return (p.value.stat + "-" + p.value.category); }
		})
		.elasticY(true)
		.yAxisPadding(20)
		.renderHorizontalGridLines(true)
		.renderVerticalGridLines(true)
		.xAxisLabel("DATE")
		.yAxisLabel("SUSTAINED WIND, knots")
		.renderLabel(true)
		.x(d3.time.scale().domain([minDate, maxDate]))
		.renderlet(function (chart) {chart.selectAll("g.x text").attr('dx', '-0.8em').attr(
  			'dy', '0.15em').attr('transform', "rotate(-30)").style("text-anchor", "end");})
		.xAxis().tickFormat(function(v){ return monthNames[v.getMonth()]+ " " + v.getFullYear(); })
		.ticks(20);

	// data table
	dataTable
		.width(1000).height(800)
		.dimension(dateDim)
		.group(function(d){ return "Tropical data corresponding to the filters (Location indicates where the maximum speed is initially gained.)"})
		.size(70)
		.columns([
			function(d){ 
				// to pad the x axis
				if(d.date === minDate || d.date === maxDate) {return ''; }
				// to correct Thirteen's date as it overlaps with Trami
				// to correct Saola's date as it overlaps with Damrey
				else if(d.name === "Thirteen" || d.name === "Saola") { return (d.date.getDate()+1) + " " + monthNames[d.date.getMonth()] + " " + d.date.getFullYear(); }
				else{
				return d.date.getDate() + " " + monthNames[d.date.getMonth()] + " " + d.date.getFullYear(); }},
			function(d){ return d.name; },
			function(d){ return d.status; },
			function(d){ 
				if(d.category === 0){ return '-'; }
				else{ return d.category; }},
			function(d){ return d.wind; },
			function(d) { 
				if(d.date === minDate || d.date === maxDate) {return ''; }
				else{
				return '<a href=\"http://maps.google.com/maps?q=' + d.lat + ',' + d.lon +"\" target=\"_blank\">Map</a>"}},
			])
		.sortBy(function(d){ return d.date; })
		.order(d3.descending);

	/**********************************/
	/* render the charts		 	  */
	/**********************************/
	dc.renderAll();

})