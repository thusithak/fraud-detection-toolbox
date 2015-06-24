function initIntensityMapFunc(featureCollection) {
    var MB_ATTR =
        'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery &copy; <a href="http://mapbox.com">Mapbox</a>';
    var MB_URL = 'http://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png';
    intensityMap = L.map('intensity-map', {
        center: [0.00, 0.00],
        zoom: 2
    });
    L.tileLayer(MB_URL, {
        maxZoom: 18,
        attribution: MB_ATTR,
        id: 'examples.map-20v6611k'
    }).addTo(intensityMap);

    function onEachFeature(feature, layer) {
        //console.log("inside onEachFeature");
        var popupContent = "<b>Amount: </b>" + feature.properties.currency +
            " " + feature.properties.txnamt + "<br/>";
        if (feature.properties && feature.properties.popupContent) {
            popupContent += "<b>Shipped to: </b>" + feature.properties.popupContent;
        }
        layer.bindPopup(popupContent);
    }
    L.geoJson([featureCollection], {
        style: function(feature) {
            return feature.properties && feature.properties.style;
        },
        onEachFeature: onEachFeature,
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, {
                radius: feature.properties.intensity,
                fillColor: "#D61800",
                color: "#FFFFFF",
                weight: 0,
                opacity: 1,
                fillOpacity: 0.3
            });
        }
    }).addTo(intensityMap);
    L.geoJson([featureCollection], {
        style: function(feature) {
            return feature.properties && feature.properties.style;
        },
        onEachFeature: onEachFeature,
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, {
                radius: 2,
                fillColor: "#D61800",
                color: "#FFFFFF",
                weight: 0,
                fillOpacity: 1
            });
        }
    }).addTo(intensityMap);
    L.control.scale().addTo(intensityMap);
    //var bounds = new L.LatLngBounds(LatLng);
    //intensityMap.fitBounds(bounds);
}