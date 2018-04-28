var DELAY = 1000; // ms
var smoothie = new SmoothieChart({
  grid: {
    strokeStyle: 'rgb(120, 120, 120)',
    fillStyle: 'rgb(0, 0, 0)',
    lineWidth: 1,
    millisPerLine: 250,
    verticalSections: 6,
  },
  labels: {
    fillStyle:'rgb(255, 255, 255)'
  }
});
smoothie.streamTo(document.getElementById("heartbeat-canvas"), DELAY);
var heartbeat = new TimeSeries();
smoothie.addTimeSeries(heartbeat,
  {
    strokeStyle: 'rgb(255, 255, 255)',
    lineWidth: 4,
  });

var socket = io.connect('http://localhost:80');
socket.on('hb_data', function(data) {
  console.log(data)
  var jdata = JSON.parse(data);
  heartbeat.append(jdata.time, jdata.value);
});
