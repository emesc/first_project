// load data from file
d3.json("../../data/nball1314.json", function(error, nball1314_data){
	//var rowChart = dc.rowChart("#dc-row-chart");

	function render(nball1314_data, comparator){
		d3.select("body").selectAll("div.h-bar")
				.data(nball1314_data)
			.enter().append("span");

		d3.select("body").selectAll("div.h-bar")
				.data(nball1314_data)
			.exit().remove();

		d3.select("body").selectAll("div.h-bar")
				.data(nball1314_data)
			.style("width", function(d){ return (d.PTS*20) + "px"; })
			.select("span")
				.text(function(d){ return d.PLAYER; });

		if(comparator)
			d3.select("body").selectAll("div.h-bar")
				.sort(comparator);
	}
	var compareByTeam = function(a, b){
		return a.TEAM < b.TEAM ? -1 : 1;
	};
	var compareByPointsPerGame = function(a, b){
		return a.PTS < b.PTS ? -1 : 1;
	};
	render(nball1314_data);

	function sort(comparator){
		render(nball1314_data, comparator);
	}
})