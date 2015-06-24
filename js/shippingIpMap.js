function shippingIpMapFunc(featureCollection, featureCollectionIp,
    featureCollectionLine) {
    var MB_ATTR =
        'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery &copy; <a href="http://mapbox.com">Mapbox</a>';
    var MB_URL = 'http://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png';
    shippingIpMap = L.map('shipping-ip-map', {
        center: [0.00, 0.00],
        //layers: [grayscale],
        zoom: 2
    });
    L.tileLayer(MB_URL, {
        maxZoom: 18,
        attribution: MB_ATTR,
        id: 'examples.map-20v6611k'
    }).addTo(shippingIpMap);
    var grayscale = L.tileLayer(MB_URL, {
        attribution: MB_ATTR,
        id: 'examples.map-20v6611k'
    });
    var streets = L.tileLayer(MB_URL, {
        attribution: MB_ATTR,
        id: 'examples.map-i875mjb7'
    });

    function onEachFeature1(feature, layer) {
        //console.log("inside onEachFeature1");
        var popupContent = "";
        if (feature.properties && feature.properties.popupContent) {
            popupContent += feature.properties.popupContent;
        }
        layer.bindPopup(popupContent);
    }
    var ipArray = [];
    var uniqueIpArray = [];

    function onEachFeature2(feature, layer) {
            //console.log("inside onEachFeature2: " + feature.geometry.coordinates);
            var popupContent = "";
            if (feature.properties && feature.properties.popupContent) {
                popupContent += feature.properties.popupContent;
            }
            layer.bindPopup(popupContent);
        }
        //var locationsGroup = new L.layerGroup();
    var locationsGroup = L.geoJson([featureCollection], {
        style: function(feature) {
            return feature.properties && feature.properties.style;
        },
        onEachFeature: onEachFeature1,
        pointToLayer: function(feature, latlng) {
            var LocationIcon = L.MakiMarkers.icon({
                icon: "building",
                color: feature.properties.markerColor,
                size: "m"
            });
            return L.marker(latlng, {
                icon: LocationIcon
            });
        }
    });
    locationsGroup.addTo(shippingIpMap);
    //var ipGroup = new L.layerGroup();
    var ipGroup = L.geoJson([featureCollectionIp], {
        style: function(feature) {
            return feature.properties && feature.properties.style;
        },
        onEachFeature: onEachFeature2,
        pointToLayer: function(feature, latlng) {
            //console.log("Ip color " +feature.properties.markerColor);
            ipArray.push(feature.geometry.coordinates);
            uniqueIpArray.push($.unique(ipArray));
            //console.log("ip: " + ipArray.length+ " unique: " + uniqueIpArray.length);
            var IpIcon = L.MakiMarkers.icon({
                icon: "triangle",
                color: feature.properties.markerColor,
                size: "m"
            });
            return L.marker(latlng, {
                icon: IpIcon
            });
        }
    });
    ipGroup.addTo(shippingIpMap);
    var lineStyle = {
        color: "#333",
        weight: 2,
        smoothFactor: 1,
        opacity: 1
    };
    
    var lineGroup = L.geoJson(featureCollectionLine, {
        //style: lineStyle,
        //onEachFeature: onEachFeature3,
    });
    //console.log(featureCollectionLine);
    
    function onEachFeature3(feature, layer) {
            var arrowLines = {};
            var annon = JSON.stringify(feature.coordinates[0][0]).replace('-','').replace('.','');
            var numRand = Math.floor(Math.random()*100);
            annon =  annon + numRand;
            //console.log(annon);
            arrowLines['arrow' + annon] = L.polyline(feature.coordinates, {});
            arrowLines['arrowHead' + annon] = L.polylineDecorator(arrowLines['arrow' + annon],{
                patterns: [
                    {offset: 10, repeat: 0, symbol: L.Symbol.arrowHead({pixelSize: 4, polygon: false, pathOptions: {stroke: true}})}
                ]
            });
            arrowLines['arrow' + annon].addTo(shippingIpMap);
            arrowLines['arrowHead' + annon].addTo(shippingIpMap);
            //console.log(JSON.stringify(arrowLines[0]));
        }

      
function logArrayElements(element, index, array) {
   var arrow = L.polyline(element.coordinates, {}).addTo(shippingIpMap);
   var arrowHead = L.polylineDecorator(arrow).addTo(shippingIpMap);

       arrowHead.setPatterns([
           {offset: '50%', repeat: 0, symbol: L.Symbol.arrowHead({pixelSize: 10, polygon: false, pathOptions: {stroke: true}})}
       ]);
}

featureCollectionLine.forEach(logArrayElements);

//console.log(featureCollectionLine);


    //lineGroup.addTo(shippingIpMap);
    var overlayMaps = {
        "Shipping Locations": locationsGroup,
        "Origins": ipGroup
    };
    var baseLayers = {
        "Streets": streets,
        "Grayscale": grayscale
    };
    L.control.layers(baseLayers, overlayMaps).addTo(shippingIpMap);
    L.control.scale().addTo(shippingIpMap);
    var legend = L.control({
        position: 'bottomright'
    });
    legend.onAdd = function(shippingIpMap) {
        var div = L.DomUtil.create('div', 'info legend');
        div.innerHTML =
            '<table><tr><td style="width:25%;"><div style="height:2px;width:24px;background:#000;margin-top:4px;"></div></td><td>Origin/Shipping location link</td></tr><tr><td><i class="maki-icon building"></i></td><td>Shipping location</td></tr><tr><td><i class="maki-icon triangle"></i></td><td>Origin</td></tr></table>';
        return div;
    };
    legend.addTo(shippingIpMap);


}