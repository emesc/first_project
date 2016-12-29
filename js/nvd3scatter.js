var chart,
    duration = 300;

nv.addGraph(function(){
  chart = nv.models.scatterChart()
              .showDistX(true)
              .showDistY(true)
              .useVoronoi(true)
              .color(d3.scale.category10().range())
              .transitionDuration(duration);

  chart.xAxis.tickFormat(d3.format('0.02f'));
  chart.yAxis.tickFormat(d3.format('0.02f'));
  chart.tooltipContent(function(key){
    return '<h2>' + key + '<h2>';
  });
  chart.scatter.onlyCircles(false);

  d3.select('#scatterchart svg')
      .datum(randomData(4, 40))
      .call(chart);

  nv.utils.windowResize(chart.update);

  chart.dispatch.on('stateChange', function(e){ ('New State: ', JSON.stringify(e)); });

  return chart;
});

function randomData(groups, points){ // points -> points per group
  var data = [],
      shapes = ['circle', 'cross', 'triangle-up', 'triangle-down', 'diamond', 'square'],
      random = d3.random.normal();

  for(i=0; i<groups; i++){
    data.push({
      key: 'Group' + i,
      values: []
    });
    for(j=0; j<points; j++){
      data[i].values.push({
        x: random(),
        y: random(),
        size: Math.random(),
        shape: (Math.random() > 0.5) ? shapes[2] : shapes[3]
      });
    }
  }
  return data;
}