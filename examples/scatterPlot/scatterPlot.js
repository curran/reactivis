define(['d3', 'model'], function (d3, Model) {
  return function (div){
    var x = d3.scale.linear(),
        y = d3.scale.linear(),
        xAxis = d3.svg.axis().scale(x).orient('bottom'),
        yAxis = d3.svg.axis().scale(y).orient('left'),
        svg = d3.select(div).append('svg'),
        g = svg.append('g'),
        xAxisG = g.append('g').attr('class', 'x axis'),
        yAxisG = g.append('g').attr('class', 'y axis'),
        xAxisLabel = yAxisG.append('text')
          .attr('class', 'label')
          .attr('y', -6)
          .style('text-anchor', 'end'),
        yAxisLabel = yAxisG.append('text')
          .attr('class', 'label')
          .attr('transform', 'rotate(-90)')
          .attr('y', 6)
          .attr('dy', '.71em')
          .style('text-anchor', 'end'),
        model = Model();

    model.when('xLabel', xAxisLabel.text, yAxisLabel);
    model.when('yLabel', yAxisLabel.text, yAxisLabel);

    model.when('margin', function (margin) {
      g.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    });

    model.when('size', function (size) {
      svg.attr('width', size.width)
         .attr('height', size.height);
    });

    model.when(['size', 'margin'], function (size, margin) {
      model.set('width', size.width - margin.left - margin.right);
      model.set('height', size.height - margin.top - margin.bottom);
    });

    model.when('width', function (width) {
      xAxisLabel.attr('x', width);
    });

    model.when('height', function (height) {
      xAxisG.attr('transform', 'translate(0,' + height + ')');
    });

    model.when(['width', 'height', 'data', 'xField', 'yField'], function (width, height, data, xField, yField) {
      var dots;

      x.domain(d3.extent(data, function(d) { return d[xField]; })).nice();
      y.domain(d3.extent(data, function(d) { return d[yField]; })).nice();

      x.range([0, width]);
      y.range([height, 0]);

      xAxisG.call(xAxis);
      yAxisG.call(yAxis);

      dots = g.selectAll('.dot').data(data);
      dots.enter().append('circle')
        .attr('class', 'dot')
        .attr('r', 3.5);
      dots
        .attr('cx', function(d) { return x(d[xField]); })
        .attr('cy', function(d) { return y(d[yField]); });
      dots.exit().remove();
    });
    return model;
  }
});
