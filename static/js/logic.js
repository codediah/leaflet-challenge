// Build Map Function
function createMap(earthquakes) {

    // Create the tile layer that will be the background of our map.
    let base = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    let baseMaps = {
        "Base Map": base
    };

    // Create an overlayMaps object to hold the earthquakes layer.
    let overlayMaps = {
        "Earthquakes": earthquakes
    };

    // Create the map object with options.
    let map = L.map("map", {
        center: [40.7608, -111.8910],
        zoom: 5,
        layers: [base, earthquakes]
    });

    // Legend
    addLegend();

    // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(map);

}

// Map Markers Function
function createMarkers(response) {

    // Pull the "earthquake" property from response.data.
    let quakes = response.features;
  
    // Initialize an array to hold bike markers.
    let quakeMarks = [];
  
    // Loop through the stations array.
    for (let index = 0; index < quakes.length; index++) {
      let quake = quakes[index];
  
      // For each station, create a marker, and bind a popup with the station's name.
      let quakeMark = L.circleMarker([quake.geometry.coordinates[1], quake.geometry.coordinates[0]], {
        color: getColor(quake.geometry.coordinates[2]),
        fill: getColor(quake.geometry.coordinates[2]),
        fillOpacity: 0.7,
        radius: (quake.properties.mag * 3)
      });

      quakeMark.bindPopup(`Magnitude: ${quake.properties.mag}<br>Depth: ${quake.geometry.coordinates[2]}<br>Latitude: ${quake.geometry.coordinates[1]}<br>Longitude: ${quake.geometry.coordinates[0]}`);
  
      // Add markers to the array.
      quakeMarks.push(quakeMark);
    }
  
    // Create a layer group that's made from the bike markers array, and pass it to the createMap function.
    createMap(L.layerGroup(quakeMarks));
}

// Assigning Colors to Depths
function getColor(val) {
    if (val >= -10 && val < 10) {
        return '#59ff00'
    } else if (val <= 10 && val < 30) {
        return '#ffff00'
    } else if (val <= 30 && val < 50) {
        return '#ffbb00'
    } else if (val <= 50 && val < 70) {
        return '#ff9d00'
    } else if (val <= 70 && val < 90) {
        return '#ff8000'
    } else if (val <= 90) {
        return '#ff1e00'
    } else {};
}

// Legend Function
function addLegend() {
    let legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {
        let div = L.DomUtil.create('div', 'info legend'),
            depths = [-10, 10, 30, 50, 70, 90],
            labels = [];

        for (let i = 0; i < depths.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(depths[i] + 1) + '"></i> ' +
                depths[i] + (depths[i + 1] ? '&ndash;' + (depths[i + 1] - 1) + '<br>' : '+');
        }
        return div;
    };

    legend.addTo(map);
}

// Perform an API call to the Citi Bike API to get the station information. Call createMarkers when it completes.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(createMarkers);