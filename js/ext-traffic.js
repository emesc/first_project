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
        var w = 980, h = 800, r1 = h / 2, r0 = r1 - 110, duration=5000;

        var fill = d3.scale.ordinal()
            .range(['#c7b570','#c6cdc7','#335c64','#768935','#507282','#5c4a56','#aa7455','#574109','#837722','#73342d','#0a5564','#9c8f57','#7895a4','#4a5456','#b0a690','#0a3542',]);

        var chord = d3.layout.chord()
            .padding(.02)
            .sortSubgroups(d3.descending)
            .sortChords(d3.descending);

        var arc = d3.svg.arc()
            .innerRadius(r0)
            .outerRadius(r0 + 20);

        var svg = d3.select("#ext-traffic").append("svg:svg")
            .attr("width", w)
            .attr("height", h)
          .append("svg:g")
            .attr("id", "circle")
            .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");

        /* for time slider */
        //var svg2 = d3.select("#ext-traffic").append("svg");

        var timeLabel = svg.append("text")
                                        .attr("x", 300)
                                        .attr("y", 300);

        svg.on("mousemove", function(){
          printTime();
        });

        function printTime(){
          var time_simulated = d3.mouse(svg.node());
          timeLabel.text(time_simulated);
        }

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
            var p = d3.format(".1%"), q = d3.format(",.2f")
            return "Chord Info:<br/><br>"
              +  d.sname + " flow from " + d.tname
              + ": " + q(d.svalue) + "T<br/>"
              + "<br/>"
              + d.tname + " flow from " + d.sname
              + ": " + q(d.tvalue) + "T<br/>";
          }

          function groupTip (d) {
            var p = d3.format(".1%"), q = d3.format(",.2f")
            return "Group Info:<br/><br/>"
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

          //var svg2 = d3.select("#ext-traffic").append("svg");

              

          /* for x axis
            var margin = 25
              axisWidth = w - 2 * margin,
             svg2 = d3.select("#ext-traffic").append("svg")
                        .attr("class", "axis")
                        .attr("width", w)
                        .attr("height", h-2*margin),

              scale2 = d3.scale.linear().domain([10, 21]).range([0, axisWidth]),
              axis = d3.svg.axis()
                        .scale(scale2)
                        .ticks(10)
                        .tickSubdivide(5) 
                        .tickPadding(10)
                        .tickFormat(function(v){
                            return v + ":00";
                        });

          svg2.append("g")        
              .attr("transform", function(){
                  return "translate(" + margin + "," + margin + ")";
              })
              .call(axis);*/

          

          
      }