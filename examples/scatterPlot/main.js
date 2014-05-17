// The main program that runs the scatter plot.
// This program creates a new visualization, loads a
// configuration file for it, and loads data into it.
// Then it periodically updates various aspects of the chart
// with random values, to illustrate that the chart
// is dynamic and reacts to changes in its model.
//
// Curran Kelleher 4/17/2014
require(['d3', 'scatterPlot'], function (d3, ScatterPlot) {
  var div = document.getElementById('scatterPlotContainer'),
      scatterPlot = ScatterPlot(div);

  scatterPlot.set({
    "xField": "sepalWidth",
    "yField": "sepalLength",
    "xLabel": "Sepal Width (cm)",
    "yLabel": "Sepal Width (cm)",
    "margin": {
      "top": 20,
      "right": 20,
      "bottom": 30,
      "left": 40
    }
  }); 

  d3.tsv('data.tsv', function (d) {
    d.sepalLength = +d.sepalLength;
    d.sepalWidth = +d.sepalWidth;
    return d;
  }, function(error, data) {

    // Set size once to initialize
    setSizeFromDiv();

    // Set size on resize
    window.addEventListener('resize', setSizeFromDiv);

    // Set the data
    scatterPlot.set('data', data);

    // Reset data each second
    setInterval(function () {

      // Include each element with a 10% chance.
      var randomSample = data.filter(function(d){
        return Math.random() < 0.1;
      });

      scatterPlot.set('data', randomSample);
    }, 1000);

    // Randomly change the margin every 1.7 seconds.
    function random(){ return Math.random() * 100; }
    setInterval(function () {
      scatterPlot.set('margin', {top: random(), right: random(), bottom: random(), left: random()});
    }, 1700);

    // Change the Y axis label every 600 ms.
    function randomString() {
      var possibilities = ['Frequency', 'Population', 'Alpha', 'Beta'],
          i = Math.round(Math.random() * possibilities.length);
      return possibilities[i];
    }
    setInterval(function () {
      scatterPlot.set('yLabel', randomString());
    }, 600);
  });

  function setSizeFromDiv(){
    scatterPlot.set('size', {
      width: div.clientWidth,
      height: div.clientHeight
    });
  }
});
