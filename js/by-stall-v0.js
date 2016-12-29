var margin = { top: 50, right: 200, bottom: 100, left: 100 },
          width = 1100 - margin.left - margin.right,
          height = 900 - margin.top - margin.bottom,
          gridSize = Math.floor(width / 24),
          legendElementHeight = gridSize + 5,
          buckets = 9,
          colours = ["#fff7fb", "#ece2f0", "#d0d1e6", "#a6bddb", "#67a9cf", "#3690c0", "#02818a", "#016c59", "#014636"],
          // colours = ["#f6eff7", "#d0d1e6", "#a6bddb", "#67a9cf", "#1c9099", "#016c59"],
          stores = ["MCDONALD'S", "MOSBURGER", "STARBUCKS", "BURGERKING", "DINTAIFUNG", "KFC", "P'BAGUETTE", "HAN'S", "YAKUNKAYA", "MARCHE", "DELIFRANCE", "JACK'SPLACE", "LAKSANIA", "SALADWORKS", "TOASTBOX", "CBTL"],
          times = ["1a", "2a", "3a", "4a", "5a", "6a", "7a", "8a", "9a", "10a", "11a", "12a", "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p", "10p", "11p", "12p"];

      var formats = {
          percent: d3.format('%')
      };

      d3.csv("../data/by-stall-v0.csv",
        function(d) {
          return {
            store: +d.store,
            hour: +d.hour,
            count: +d.count
          };
        },
        function(error, data) {
          var colourScale = d3.scale.quantile()
              .domain([0, buckets - 1, d3.max(data, function (d) { return d.count; })])
              .range(colours);

          /*var colourScale = d3.scale.threshold().domain([0,100,200,300,400,500])
                              .range([0].concat(colours));*/

          var svg = d3.select("#chart").append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          var storeLabels = svg.selectAll(".storeLabel")
              .data(stores)
              .enter().append("text")
                .text(function (d) { return d; })
                .attr("x", 0)
                .attr("y", function (d, i) { return i * gridSize; })
                .style("text-anchor", "end")
                .style("font-family", "sans-serif")
                .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
                .attr("class", function (d, i) { return ((i >= 0 && i <= 11) ? "storeLabel mono axis axis-workweek" : "storeLabel mono axis"); });

          var timeLabels = svg.selectAll(".timeLabel")
              .data(times)
              .enter().append("text")
                .text(function(d) { return d; })
                .attr("x", function(d, i) { return i * gridSize; })
                .attr("y", 0)
                .style("text-anchor", "middle")
                .style("font-family", "sans-serif")
                .attr("transform", "translate(" + gridSize / 2 + ", -6)")
                .attr("class", function(d, i) { return ((i >= 10 && i <= 21) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });

          var heatMap = svg.selectAll(".hour")
              .data(data)
              .enter().append("rect")
              .attr("x", function(d) { return (d.hour - 1) * gridSize; })
              .attr("y", function(d) { return (d.store - 1) * gridSize; })
              .attr("rx", 4)
              .attr("ry", 4)
              .attr("class", "hour bordered")
              .attr("width", gridSize)
              .attr("height", gridSize)
              .style("fill", colours[0]);

          heatMap.transition().duration(1000)
              .style("fill", function(d) { return colourScale(d.count); });

          heatMap.append("title").text(function(d) { return d.count; });
              
          var legend = svg.selectAll(".legend")
              .data([0].concat(colourScale.quantiles()), function(d) { return d; })
              //.data(colourScale.domain(), function(d){ return d; })
              .enter().append("g")
              .attr("class", "legend");

          legend.append("rect")
            .attr("x", width+50)
            .attr("y", function(d, i) { return legendElementHeight * i; })
            .attr("width", gridSize)
            .attr("height", gridSize)
            .style("fill", function(d, i) { return colours[i]; })
            .style("stroke", "#E6E6E6");

          legend.append("text")
            .attr("class", "mono")
            .text(function(d) { return "≥ " + Math.round(d); })
            .attr("x", width+3*gridSize)
            .attr("y", function(d, i) { return legendElementHeight * i; })
            .attr("dy", "1.7em");
      });