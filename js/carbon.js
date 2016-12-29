var links = [

            {source: "Carbon", target: "Human Body", type: "5"},
            {source: "Human Body", target: "Carbon Dioxide", type: "4"},
            {source: "Carbon", target: "Isotopes", type: "5"},
            {source: "Isotopes", target: "C-12", type: "4"},
            {source: "Isotopes", target: "C-13", type: "4"},
            {source: "Isotopes", target: "C-14", type: "4"},
            {source: "C-12", target: "Human Body", type: "3"},
            {source: "C-14", target: "Nobel Prize", type: "3"},
            {source: "C-14", target: "Human Body", type: "3"},
            {source: "C-14", target: "Fossils", type: "3"},
            {source: "Carbon", target: "Allotropes", type: "5"},
            {source: "Allotropes", target: "Amorphous Carbon", type: "4"},
            {source: "Allotropes", target: "Graphite", type: "4"},
            {source: "Allotropes", target: "Diamond", type: "4"},
            {source: "Allotropes", target: "Fullerenes", type: "4"},
            {source: "Allotropes", target: "Graphene", type: "4"},
            {source: "Amorphous Carbon", target: "Coal", type: "3"},
            {source: "Amorphous Carbon", target: "Charcoal", type: "3"},
            {source: "Coal", target: "Climate Change", type: "2"},
            {source: "Charcoal", target: "Climate Change", type: "2"},
            {source: "Graphite", target: "Pencil", type: "2"},
            {source: "Pencil", target: "Conductivity", type: "2"},
            {source: "Graphite", target: "Carbon Fibre", type: "3"},
            {source: "Graphite", target: "Lubricant", type: "3"},
            {source: "Lubricant", target: "Motor oil", type: "2"},
            {source: "Carbon Fibre", target: "Superhero Material", type: "2"},
            {source: "Carbon Fibre", target: "Racing Cars", type: "2"},
            {source: "Racing Cars", target: "Superhero Material", type: "1"},
            {source: "Fullerenes", target: "Buckyball C-60", type: "3"},
            {source: "Fullerenes", target: "C-70", type: "3"},
            {source: "Fullerenes", target: "Nanotube", type: "3"},
            {source: "Fullerenes", target: "C-28", type: "3"},
            {source: "Buckyball", target: "Nobel Prize", type: "2"},
            {source: "Nanotube", target: "Superhero Material", type: "2"},
            {source: "Nanotube", target: "Space Elevator", type: "2"},
            {source: "Graphene", target: "Nobel Prize", type: "3"},
            {source: "Graphene", target: "Conductivity", type: "3"},
            {source: "Graphene", target: "Super-Conductive/Magnetic", type: "3"},
            {source: "Carbon", target: "Compounds", type: "5"},
            {source: "Compounds", target: "Carbon Dioxide", type: "4"},
            {source: "Compounds", target: "Hydrocarbon", type: "4"},
            {source: "Carbon Dioxide", target: "Climate Change", type: "3"},
            {source: "Hydrocarbon", target: "Diesel", type: "3"},
            {source: "Hydrocarbon", target: "Gasoline", type: "3"},
            {source: "Hydrocarbon", target: "Candle", type: "3"},
            {source: "Hydrocarbon", target: "Motor oil", type: "3"},
            {source: "Hydrocarbon", target: "Plastic", type: "3"},
            {source: "Diesel", target: "Climate Change", type: "2"},
            {source: "Gasoline", target: "Climate Change", type: "2"},
            {source: "Candle", target: "Nanotube", type: "2"},
          ];

          var nodes = {};
          // Compute the distinct nodes from the links.
          links.forEach(function(link) {
            link.source = nodes[link.source] || (nodes[link.source] = {name: link.source});
            link.target = nodes[link.target] || (nodes[link.target] = {name: link.target});
          });

          var width = 950,
              height = 600;

          var color = d3.scale.category20();

          var force = d3.layout.force()
              .nodes(d3.values(nodes))
              .links(links)
              .size([width, height])
              .linkDistance(60)
              .charge(-300)
              .on("tick", tick)
              .start();

          //var svg = d3.select("body").append("svg")
          var svg = d3.select("#carbon").append("svg")
              .attr("width", width)
              .attr("height", height);

          // Per-type markers, as they don't inherit styles.
          svg.append("defs").selectAll("marker")
              .data(["suit", "licensing", "resolved"])
            .enter().append("marker")
              .attr("id", function(d) { return d; })
              .attr("viewBox", "0 -5 10 10")
              .attr("refX", 15)
              .attr("refY", -1.5)
              .attr("markerWidth", 6)
              .attr("markerHeight", 6)
              .attr("orient", "auto")
            .append("path")
              .attr("d", "M0,-5L10,0L0,5");

          var path = svg.append("g").selectAll("path")
              .data(force.links())
              .enter()
              .append("path")
              .attr("class", function(d) { return "link " + d.type; })
              .attr("marker-end", function(d) { return "url(#" + d.type + ")"; });

          var circle = svg.append("g").selectAll("circle")
              .data(force.nodes())
              .enter()
              .append("circle")
              .attr("r", 10)
              .style("fill", function(d, i) { return color(i); })
              .call(force.drag);

          var text = svg.append("g").selectAll("text")
              .data(force.nodes())
            .enter().append("text")
              .attr("x", 8)
              .attr("y", "0.31em")
              .text(function(d) { return d.name; });

          function tick() {
            path.attr("d", linkArc);
            circle.attr("transform", transform);
            text.attr("transform", transform);
          }

          function linkArc(d) {
            var dx = d.target.x - d.source.x,
                dy = d.target.y - d.source.y,
                dr = Math.sqrt(dx * dx + dy * dy);
            return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
          }

          function transform(d) {
            return "translate(" + d.x + "," + d.y + ")";
          }