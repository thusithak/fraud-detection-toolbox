function sequanceMapFunc(featureCollection) {
    var MB_ATTR =
        'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery &copy; <a href="http://mapbox.com">Mapbox</a>';
    var MB_URL = 'http://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png';
    sequanceMap = L.map('sequance-map', {
        center: [0.00, 0.00],
        zoom: 2
    });
    L.tileLayer(MB_URL, {
        maxZoom: 18,
        attribution: MB_ATTR,
        id: 'examples.map-zr0njcqy'
    }).addTo(sequanceMap);
    var grayscale = L.tileLayer(MB_URL, {
        attribution: MB_ATTR,
        id: 'examples.map-zr0njcqy'
    });
    var streets = L.tileLayer(MB_URL, {
        attribution: MB_ATTR,
        id: 'examples.map-zr0njcqy'
    });
    var timeArr = [];

    function onEachFeature(feature, layer) {
        //console.log("inside onEachFeature1");
        var popupContent = "";
        timeArr.push(feature.properties.timestamp);
        if (feature.id == (feature.feature_count - 1)) {
            timeArr.sort(function(a, b) {
                return a - b;
            });
        }
        $.each(timeArr, function(index, e) {
            var seq = index + 1;
            //console.log("e: " +e+ " ts: " +timeArr[index]);
            if (e == feature.properties.timestamp) {
                layer.bindLabel(" " + seq + " ", {
                    noHide: true,
                    direction: 'right'
                });
            }
        });
    }
    var locationsGroup = L.geoJson([featureCollection], {
        style: function(feature) {
            return feature.properties && feature.properties.style;
        },
        onEachFeature: onEachFeature,
        pointToLayer: function(feature, latlng) {
            var LocationIcon = L.MakiMarkers.icon({
                icon: "circle",
                color: feature.properties.markerColor,
                size: "m",
                labelAnchor: [6, -20]
            });
            return L.marker(latlng, {
                icon: LocationIcon
            });
        }
    });
    locationsGroup.addTo(sequanceMap);
    var overlayMaps = {
        "Shipping Locations": locationsGroup
    };
    var baseLayers = {
        "Streets": streets,
        "Grayscale": grayscale
    };
    //L.control.layers(baseLayers,overlayMaps).addTo(sequanceMap);
    L.control.scale().addTo(sequanceMap);
    var legend = L.control({
        position: 'bottomright'
    });
    legend.onAdd = function(sequanceMap) {
        var div = L.DomUtil.create('div', 'info legend');
        div.innerHTML =
            '<table><tr><td style="width:15%;"><i class="maki-icon circle"></i></td><td>Shipping locations in chronological order</td></tr></table>';
        return div;
    };
    legend.addTo(sequanceMap);

    

}