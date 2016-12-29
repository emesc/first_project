var treeData = [{
			"name": "curlycoderme",
			"parent": "null",
			"children": [{
				"name": "data vis",
				"parent": "curlycoderme"
			}, {
				"name": "science vis",
				"parent": "curlycoderme"
			}, {
				"name": "nil",
				"parent": "curlycoderme"
			},{
				"name": "references",
				"parent": "curlycoderme"
			}, {
				"name": "contact",
				"parent": "curlycoderme"
			}]
		}];

		// create the tree diagram
		var margin = {top: 10, right: 220, bottom: 20, left: 220},
			width = 950 - margin.left - margin.right,
			height = 500 - margin.top - margin.bottom,

			i = 0,

			tree = d3.layout
						.tree()
						.size([height, width]),

			diagonal = d3.svg
							.diagonal()
							.projection(function(d){ return [d.y, d.x]; }),

			//svg = d3.select("body")
			svg = d3.select("#treeLayout")
					.append("svg")
					.attr("width", width + margin.left + margin.right)
					.attr("height", height + margin.top + margin.bottom)
					.append("g")	// add chart
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		root = treeData[0];

		update(root);

		function update(source){

			// compute the new tree layout
			var nodes = tree.nodes(root).reverse(),
				links = tree.links(nodes);

			// normalise for fixed depth
			nodes.forEach(function(d) { d.y = d.depth * width; });

			// declare the nodes
			var node = svg.selectAll("g.node")
							.data(nodes, function(d){ return d.id || (d.id = ++i); });

			// enter the node
			var nodeEnter = node.enter()
								.append("g")
								.attr("class", "node")
								.attr("transform", function(d){ return "translate(" + d.y + "," + d.x + ")"; });

			var linkTo = nodeEnter.append("a")
						.attr("xlink:href", function(d) {
							if (d.name == "curlycoderme"){
								return "index.html";
							} else if (d.name == "data vis"){
								return "datavis/datavis.html";
							} else if (d.name == "science vis"){
								return "scivis/scivis.html"
							} else if (d.name == "contact"){
								return "contact.html";
							} else if (d.name == "references"){
								return "refs.html";
							} else if (d.name == "nil"){
								return "index.html";
							}
						});
			
			linkTo.append("circle")
						.attr("r", function(d){ return d.children || d._children ? 200 : 20; })	;

			linkTo.append("text")
						.attr({
							"x": function(d){ return d.children || d._children ? 0 : 40; },
							"dy": "0.35em",
							"text-anchor": function(d){ return d.children || d._children ? "middle" : "start"; }
						})
						.style("fill-opacity", 1)
						.style("font-weight", function(d){ return d.children || d._children ? "bold" : "normal"; })						
						.style("font-size", function(d){ return d.children || d._children ? "60px" : "30px"; })
						.text(function(d){ return d.name.toLowerCase(); });

			// declare the links
			var link = svg.selectAll("path.link")
							.data(links, function(d){ return d.target.id; });

			// enter the links
			link.enter()
				.insert("path", "g")
				.attr({
					"class": "link",
					"d": diagonal
				});
		}
		
