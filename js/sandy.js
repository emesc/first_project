d3.csv("../../data/sandy_nj.csv", function(error, nj_data){

    var id= 0, 
        data=nj_data,
        duration = 500, 
        chartHeight = 100, 
        chartWidth = 680;

    for(var i = 0; i < 20; i++) push(data);   

    function render(data) {
        var selection = d3.select("#sandy")
                .selectAll("div.v-bar")
                .data(data, function(d){return d.id;}); // <-A

        // enter
        selection.enter()
                .append("div")
                    .attr("class", "v-bar")
                    .style("position", "fixed")
                    .style("top", chartHeight + "px")
                    .style("left", function(d, i){
                        return barLeft(i+1) + "px"; // <-B
                    })
                    .style("height", "0px") // <-C
                .append("span");

        // update
        selection
            .transition().duration(duration) // <-D
                .style("top", function (d) { 
                    return chartHeight - barHeight(d) + "px"; 
                })
                .style("left", function(d, i){
                    return barLeft(i) + "px";
                })
                .style("height", function (d) { 
                    return barHeight(d) + "px"; 
                })
                .select("span")
                    .text(function (d) {return d.value;});

        // exit
        selection.exit()
                .transition().duration(duration) // <-E
                .style("left", function(d, i){
                    return barLeft(-1) + "px"; //<-F
                })
                .remove(); // <-G
    }

    function push(data,i) {
        data.push({
            id: ++id, 
            value: data[i]
        });
    }
    
    function barLeft(i) {
        return i * (30 + 2);
    }

    function barHeight(d) {
        return d.value;
    }

    setInterval(function () {
        data.shift();
        push(data);
        render(data);
    }, 2000);

    render(data);

    d3.select("#sandy")
       .append("div")
           .attr("class", "baseline")
           .style("position", "fixed")
           .style("top", chartHeight + "px")
           .style("left", "0px")
           .style("width", chartWidth + "px");
})