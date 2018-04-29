
var drones = [
  {
    status: "Relaying Data",
  },
  {
    status: "Idle",
  },
  {
    status: "Idle",
  },
]

var DELAY = 1000; // ms
var smoothie_heartbeat = new SmoothieChart({
  maxValue: 250,
  minValue: 0,
  millisPerPixel:100,
  grid: {
    millisPerLine: 10000,
    verticalSections:2,
    strokeStyle: 'rgb(60, 60, 60)',
    fillStyle: 'rgb(0, 0, 0)',
    lineWidth: 1,
  },
  labels: {
    fillStyle:'rgb(255, 255, 255)'
  }
});
smoothie_heartbeat.streamTo(document.getElementById("heartbeat-canvas"), DELAY);
var smoothie_bp = new SmoothieChart({
  maxValue: 250,
  minValue: 0,
  millisPerPixel:100,
  grid: {
    millisPerLine: 10000,
    verticalSections:2,
    strokeStyle: 'rgb(60, 60, 60)',
    fillStyle: 'rgb(0, 0, 0)',
    lineWidth: 1,
  },
  labels: {
    fillStyle:'rgb(255, 255, 255)'
  }
});
console.log(document.getElementById("heartbeat-canvas"))
console.log(document.getElementById("bp-canvas"))
smoothie_bp.streamTo(document.getElementById("bp-canvas"), DELAY);
var heartbeat = new TimeSeries();
var bloodpressure_up = new TimeSeries();
var bloodpressure_lo = new TimeSeries();
smoothie_heartbeat.addTimeSeries(heartbeat,
  {
    strokeStyle: 'rgb(255, 255, 255)',
    lineWidth: 4,
  });
smoothie_bp.addTimeSeries(bloodpressure_up,
  {
    strokeStyle: 'rgb(255, 0, 0)',
    // fillStyle:'rgba(255,0,0,0.5)',
    lineWidth: 4,
  });
smoothie_bp.addTimeSeries(bloodpressure_lo,
  {
    strokeStyle: 'rgb(255, 0, 0)',
    // fillStyle:'rgba(0,0,0,0.8)',
    lineWidth: 4,
  });

// var t = 0;
// setInterval(function() {
//   v = 100;
//   // var v = 0 + Math.random();
//   // if(t == 6) {
//   //   v = 5 + Math.random();
//   // }
//   // else if(t == 7) {
//   //   v = -3 + Math.random();
//   // }
//   bloodpressure_up.append(new Date().getTime(), v+10);
//   bloodpressure_lo.append(new Date().getTime(), v);
//   heartbeat.append(new Date().getTime(), t * 5);
//   t = (t + 1) % 100;
// }, 150);

var socket = io.connect('http://localhost:80');
socket.on('hb_data', function(data) {
  console.log(data)
  var jdata = JSON.parse(data);
  for(d of jdata) {
    heartbeat.append(d.time, d.hr);
    bloodpressure_up.append(d.time, d.bp_upper);
    bloodpressure_lo.append(d.time, d.bp_lower);
  }
});

function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 18,
    center: {lat: 40.0152329, lng: -105.2780127},
    mapTypeId: google.maps.MapTypeId.HYBRID,
    disableDefaultUI: true,
  });
  map.setTilt(0);
  map.set('styles', [
    {
      featureType: "all",
      elementType: "labels",
      stylers: [
        { visibility: "off" }
      ]
    }
  ]);

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
