d3.csv('../data/mall-ext-traffic.csv', function (error, data) {
        
        var mpr = chordMpr(data);

        mpr
          .addValuesToMap('loc1')
          .addValuesToMap('loc2')
          .setFilter(function (row, a, b) {
            return (row.loc1 === a.name && row.loc2 === b.name) ||
                   (row.loc1 === b.name && row.loc2 === a.name)
          })
          .setAccessor(function (recs, a, b) {
            if (!recs[0]) return 0;
              return recs[0].loc1 === a.name ? +recs[0].volume1 : +recs[0].volume2; 
          });
        drawChords(mpr.getMatrix(), mpr.getMap());
      });


      //*******************************************************************
      //  DRAW THE CHORD DIAGRAM
      //*******************************************************************
      function drawChords (matrix, mmap) {
        var w = 980, h = 750, r1 = h / 2, r0 = r1 - 110, duration=5000;

        var fill = d3.scale.ordinal()
            // .range(['#c7b570','#c6cdc7','#335c64','#768935','#507282','#5c4a56','#aa7455','#574109','#837722','#73342d','#0a5564','#9c8f57','#7895a4','#4a5456','#b0a690','#0a3542',]);
                //.range(['#E54E45', "#DBC390", "#13A3A5", "#403833", "#334D5C", "#C0748D", "#EFC94C", "#E27A3F", "#DF4949", "#7B3722", "#8F831F", "#F0900D", "#10325C"]);
                .range(['#A9A18C', '#855723', '#4E6172', '#DBCA69', '#A3ADB8', '#668D3C', '#493829']);

        var chord = d3.layout.chord()
            .padding(.02)
            .sortSubgroups(d3.descending)
            .sortChords(d3.descending);

        var arc = d3.svg.arc()
            .innerRadius(r0)
            .outerRadius(r0 + 20);

        var svg = d3.select("#ext-chart").append("svg:svg")
            .attr("width", w)
            .attr("height", h)
          .append("svg:g")
            .attr("id", "circle")
            .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");

            svg.append("circle")
                .attr("r", r0 + 20);

        var rdr = chordRdr(matrix, mmap);
        chord.matrix(matrix);

        var g = svg.selectAll("g.group")
            .data(chord.groups())
          .enter().append("svg:g")
            .attr("class", "group")
            .on("mouseover", mouseover)
            .on("mouseout", function (d) { d3.select("#tooltip").style("visibility", "hidden") });

        g.append("svg:path")
            .style("stroke", "black")
            .style("fill", function(d) { return fill(rdr(d).gname); })
            .attr("d", arc);

        g.append("svg:text")
            .each(function(d) { d.angle = (d.startAngle + d.endAngle) / 2; })
            .attr("dy", ".35em")
            .style("font-family", "helvetica, arial, sans-serif")
            .style("font-size", "12px")
            .attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
            .attr("transform", function(d) {
              return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
                  + "translate(" + (r0 + 26) + ")"
                  + (d.angle > Math.PI ? "rotate(180)" : "");
            })
            .text(function(d) { return rdr(d).gname; });

          var chordPaths = svg.selectAll("path.chord")
                .data(chord.chords())
              .enter().append("svg:path")
                .attr("class", "chord")
                .style("stroke", function(d) { return d3.rgb(fill(rdr(d).sname)).darker(); })
                .style("fill", function(d) { return fill(rdr(d).sname); })
                .attr("d", d3.svg.chord().radius(r0))
                .on("mouseover", function (d) {
                  d3.select("#tooltip")
                    .style("visibility", "visible")
                    .html(chordTip(rdr(d)))
                    .style("font", "12px sans-serif")
                    .style("top", function () { return (d3.event.pageY - 170)+"px"})
                    .style("left", function () { return (d3.event.pageX - 100)+"px";})
                })
                .on("mouseout", function (d) { d3.select("#tooltip").style("visibility", "hidden") });

          function chordTip (d) {
            var q = d3.format(",.1f")
            return "Flow Info:<br/><br>"
              +  d.sname + " flow from " + d.tname
              + ": " + q(d.svalue) + "T<br/>"
              + "<br/>"
              + d.tname + " flow from " + d.sname
              + ": " + q(d.tvalue) + "T<br/>";
          }

          function groupTip (d) {
            var p = d3.format(".1%"), q = d3.format(",.2f")
            return "Influx Info:<br/><br/>"
                + d.gname + " : " + q(d.gvalue) + "T"
          }

          function mouseover(d, i) {
            d3.select("#tooltip")
              .style("visibility", "visible")
              .html(groupTip(rdr(d)))
              .style("top", function () { return (d3.event.pageY - 80)+"px"})
              .style("left", function () { return (d3.event.pageX - 130)+"px";})

            chordPaths.classed("fade", function(p) {
              return p.source.index != i
                  && p.target.index != i;
            });
          }

          /* for brush slider */
          var margin = {top: 0, right: 50, bottom: 10, left: 50},
              width = w - margin.left - margin.right,
              height = 50 - margin.bottom - margin.top;

          var x = d3.scale.linear()
              .domain([10, 22])
              .range([0, width])
              .clamp(true);

          var brush = d3.svg.brush()
              .x(x)
              .extent([0, 0])
              .on("brush", brushed);

          var svg = d3.select("#brush-slider").append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
            .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height / 2 + ")")
              .call(d3.svg.axis()
                .scale(x)
                .orient("bottom")
                .tickFormat(function(d) { return d + ":00"; })
                .tickSize(0)
                .tickPadding(12))
            .select(".domain")
            .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
              .attr("class", "halo");

          var slider = svg.append("g")
              .attr("class", "slider")
              .call(brush);

          slider.selectAll(".extent,.resize")
              .remove();

          slider.select(".background")
              .attr("height", height);

          var handle = slider.append("circle")
              .attr("class", "handle")
              .attr("transform", "translate(0," + height / 2 + ")")
              .attr("r", 9);

          slider
              .call(brush.event)
            .transition() // gratuitous intro!
              .duration(750)
              .call(brush.extent([16, 16]))
              .call(brush.event);

          function brushed() {
            var value = brush.extent()[0];

            if (d3.event.sourceEvent) { // not a programmatic event
              value = x.invert(d3.mouse(this)[0]);
              brush.extent([value, value]);
            }

            handle.attr("cx", x(value));
          } 
      }