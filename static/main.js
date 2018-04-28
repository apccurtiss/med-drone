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
  for(d of jdata) {
    heartbeat.append(d.time, d.value);
  }
});

var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 18,
    center: {lat: 40.0152329, lng: -105.2780127},
    mapTypeId: google.maps.MapTypeId.HYBRID,
  });
  map.setTilt(0);

  map.data.setStyle(function(feature) {
    return {
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: 'red',
        fillOpacity: 1,
        scale: 15,
        strokeColor: 'white',
        strokeWeight: 1
      }
    };
  });

  map.data.addGeoJson({
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {
          count: 50
        },
        geometry: {
          type: "Point",
          coordinates: [-105.2780127,40.0152329]
        }
      },
    ]
  });
}

function eqfeed_callback(results) {
  map.data.addGeoJson(results);
}
