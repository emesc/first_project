var w = 1000;
var h = 500;

var projection = d3.geo.albersUsa()
                       .translate([w/2-100, h/2])
                       .scale([1000]);

var path = d3.geo.path()
                 .projection(projection);
                 
var color = d3.scale.quantize()
                    // .range(["rgb(237,248,251)","rgb(179,205,227)","rgb(140,150,198)","rgb(136,86,167)","rgb(129,15,124)"])
                    .range(["rgb(254,237,222)","rgb(253,190,133)","rgb(253,141,60)","rgb(230,85,13)","rgb(166,54,3)"]);

var svg2011 = d3.select("#geo-us-2011")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

d3.csv("../data/us-CO2-emission-2011.csv", function(data) {
    data.forEach(function(d){
        d.value = +d.value;
    });

    color.domain([
        d3.min(data, function(d) { return +d.value; }), 
        d3.max(data, function(d) { return +d.value; })
    ]);

    d3.json("../data/us-states.json", function(json) {

        for (var i = 0; i < data.length; i++) {
    
            var dataState = data[i].state;
            
            var dataValue = parseFloat(data[i].value);
    
            for (var j = 0; j < json.features.length; j++) {
            
                var jsonState = json.features[j].properties.name;
    
                if (dataState == jsonState) {
            
                    json.features[j].properties.value = dataValue;
                    
                    break;
                    
                }
            }       
        }

        svg2011.selectAll("path")
           .data(json.features)
           .enter()
           .append("path")
           .attr("d", path)
           .style("fill", function(d) {

                var value = d.properties.value;
                
                if (value) { return color(value); } 
                else { return "#ccc"; }
           })
           .style("stroke", "#fff");

        // add state labels; puerto rico not counted
        svg2011.selectAll(".state-label")
            .data(json.features)
            .enter().append("text")
                .attr("class", function(d) { return "state-label " + d.id; })
                .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
                .attr("dx", "-0.5em")
                .attr("dy", "0.35em")
                .text(function(d) { 
                    if(d.properties.name === "Puerto Rico") return "";
                    else{ return d.properties.name; }});
    });

});

var svg2001 = d3.select("#geo-us-2001")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

d3.csv("../data/us-CO2-emission-2001.csv", function(data) {
    data.forEach(function(d){
        d.value = +d.value;
    });

    color.domain([
        d3.min(data, function(d) { return +d.value; }), 
        d3.max(data, function(d) { return +d.value; })
    ]);

    d3.json("../data/us-states.json", function(json) {

        for (var i = 0; i < data.length; i++) {
    
            var dataState = data[i].state;
            
            var dataValue = parseFloat(data[i].value);
    
            for (var j = 0; j < json.features.length; j++) {
            
                var jsonState = json.features[j].properties.name;
    
                if (dataState == jsonState) {
            
                    json.features[j].properties.value = dataValue;
                    
                    break;
                    
                }
            }       
        }

        svg2001.selectAll("path")
           .data(json.features)
           .enter()
           .append("path")
           .attr("d", path)
           .style("fill", function(d) {

                var value = d.properties.value;
                
                if (value) { return color(value); } 
                else { return "#ccc"; }
           })
           .style("stroke", "#fff")
           .on("mouseover", function(d){
            div.transition()
                .duration(400)
                .style("opacity", 0.9)
                .style("color", "black")
            div.html(d.country + "<br>" + d.ccode)
                .style("left", (d3.event.pageX-width/2) + "px")
                .style("top", (d3.event.pageY-height/6) + "px");
        })
        .on("mouseout", function(d){
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });

        // add state labels; puerto rico not counted
        svg2001.selectAll(".state-label")
            .data(json.features)
            .enter().append("text")
                .attr("class", function(d) { return "state-label " + d.id; })
                .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
                .attr("dx", "-0.5em")
                .attr("dy", "0.35em")
                .text(function(d) { 
                    if(d.properties.name === "Puerto Rico") return "";
                    else{ return d.properties.name; }});
    });

});

var svg1991 = d3.select("#geo-us-1991")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

d3.csv("../data/us-CO2-emission-1991.csv", function(data) {
    data.forEach(function(d){
        d.value = +d.value;
    });

    color.domain([
        d3.min(data, function(d) { return +d.value; }), 
        d3.max(data, function(d) { return +d.value; })
    ]);

    d3.json("../data/us-states.json", function(json) {

        for (var i = 0; i < data.length; i++) {
    
            var dataState = data[i].state;
            
            var dataValue = parseFloat(data[i].value);
    
            for (var j = 0; j < json.features.length; j++) {
            
                var jsonState = json.features[j].properties.name;
    
                if (dataState == jsonState) {
            
                    json.features[j].properties.value = dataValue;
                    
                    break;
                    
                }
            }       
        }

        svg1991.selectAll("path")
           .data(json.features)
           .enter()
           .append("path")
           .attr("d", path)
           .style("fill", function(d) {

                var value = d.properties.value;
                
                if (value) { return color(value); } 
                else { return "#ccc"; }
           })
           .style("stroke", "#fff");

        // add state labels; puerto rico not counted
        svg1991.selectAll(".state-label")
            .data(json.features)
            .enter().append("text")
                .attr("class", function(d) { return "state-label " + d.id; })
                .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
                .attr("dx", "-0.5em")
                .attr("dy", "0.35em")
                .text(function(d) { 
                    if(d.properties.name === "Puerto Rico") return "";
                    else{ return d.properties.name; }});
    });

});