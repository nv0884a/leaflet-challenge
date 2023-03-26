
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


d3.json(queryUrl).then(function (data) {

  createFeatures(data.features);
});

function createMap(earthquakes) {


  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });
  var baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });
  var info = L.control({
    position: "bottomright"
  });
  info.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    return div;
  };
  
  info.addTo(myMap);

  L.control.layers(baseMaps, overlayMaps, info,{
    collapsed: false
  }).addTo(myMap);

}
function createFeatures(earthquakeData) {
    
  function getColor(mag) {
    return mag > 5 ? "red" :
           mag > 4 ? "orange" :
           mag > 3 ? "green" :
           mag > 2 ? "yellow" :
           mag > 1 ? "blue" :
                     "white";
  }
 
  function createEarthquakesLayer(features) {
    var earthquakes = L.geoJSON(features, {
      pointToLayer: function (feature, latlng) {
        var mag = feature.properties.mag;
        var color = getColor(mag);

        var markerOptions = {
          radius: mag * 2.5,
          fillColor: color,
          color: "#000",
          weight: 1,
          opacity: 1,
          fillOpacity: 1
        };

        return L.circleMarker(latlng, markerOptions);
      },
      onEachFeature: function (feature, layer) {
        var place = feature.properties.place;
        var time = new Date(feature.properties.time);
        var mag = feature.properties.mag;
        layer.bindPopup(`<h3>${place}</h3><hr><p>${time}</p><p>Magnitude: ${mag}</p>`);
      }
    });

    return earthquakes;
  }
  var earthquakes = createEarthquakesLayer(earthquakeData);

  createMap(earthquakes);
}


