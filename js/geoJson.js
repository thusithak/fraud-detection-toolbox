//location data
var geometryType = '"Point"';
var coordinatesLat = 79.871;
var coordinatesLng = 6.936;
var coordinates = [];
var layerName = '"location"';
var popupContent = '"Intensity 1"';
var intensity = 10;
var id = 0;
//trasaction data
var itemNo = "test";
var billingaddress = "test";
var txnamt = 0;
var timestamp = "test";
var shippingaddress = "test";
var txnid = "test";
var qty = 0;
var email = "test";
var currency = "test";
var cardnum = 0;
var ip = "test";
var ver = "test";
var mcolor = "test";
var featureHead = '{"type": "FeatureCollection","features": [';
var featureFoot = ']}';
var lineStringHead = '[';
var lineStringFoot = ']';

function initFeatureCollection(featureData) {
    //get lat lng
    var length = featureData.length;
    $.each(featureData, function(index, val) {
        getLatLng(val.shippingaddress, val.ip,
            index, length);
        //console.log("1: " + coordinates[index]);
    });
}

function getLatLng(address, ip, iteration, length) {
    var lat;
    var lng;
    var latLng;
    var request_addr = $.ajax({
        //url: 'http://nominatim.openstreetmap.org/search?format=json&limit=1&q=' + address,
        url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' +
            address +
            '&key=AIzaSyAE5HNqYSWEsBuskseqJDRtgIyg3603aQw',
        dataType: 'json',
        beforeSend: function() {
            $("#shipping-ip-map,#intensity-map,#sequance-map").preloader(
                "show");
            $(".dataSave").html("");
            $('#reportrange').hide();
            //console.log("before send....");
        }
    });
    request_addr.fail(function() {
        console.log("Address retreival failed...");
    });
    request_addr.done(function(data) {
        var request_ip = $.ajax({
            url: 'http://ipinfo.io/' + ip,
            dataType: 'jsonp'
        });
        request_ip.fail(function() {
            //console.log("IP retreival failed...");
        });
        request_ip.done(function(data) {
            //console.log("ip loc: " +data.loc);
            var swap = data.loc;
            var a = swap.split(",");
            var str = a[1] + "," + a[0];
            //console.log("Reversed Ips: " +str+ " I: " +iteration);
            $(".dataSave").append(
                "<span id='dataSaveSpanIp-" + iteration +
                "' class='class" + iteration + "'>" +
                str + "</span>");
            //console.log("LatLng IP: " + str);
            //console.log("I: " + iteration + " L: " + (length-1));
            if (iteration == (length - 1)) {
                $('#reportrange').show();
                setTimeout(constructString, 2000);
            }
        });
        if (data.status == "ZERO_RESULTS" || data.status ==
            "OVER_QUERY_LIMIT") {
            //console.log("0 results for this location..." + address);
        } else if (typeof data.results[0] === 'undefined') {
            //console.log("undefined...." + address);
        } else {
            lat = data.results[0].geometry.location.lat.toFixed(4);
            lng = data.results[0].geometry.location.lng.toFixed(4);
            console.log("Add: " +lat+" "+lng);
            //console.log("passing addresses: " +address);
            var latLng = lng + "," + lat;
            $(".dataSave").append("<span id='dataSaveSpan-" +
                iteration + "' class='class" + iteration + "'>" +
                latLng + "</span>");
        }
    });
}

function constructString() {
    var features = '';
    var featuresIp = '';
    var lineString = '';
    var featureData = globalTnx;
    var colorArray = ["CC66CC", "993399", "660066", "000066", "009966",
        "99FFCC", "66CC99", "339966", "006633", "CCCC99", "999966",
        "FFCCFF", "CC99CC", "996699", "660099", "CC99FF", "9966CC",
        "663399", "330066", "6666FF", "3333CC", "000099", "993366",
        "660033", "FF66CC", "CC3399", "990066", "999999", "666666",
        "9999FF", "6666CC", "333399", "666633", "333300", "CC0000",
        "FF6666", "CC3333", "990000", "FF9999", "CC6666", "993333",
        "660000", "993366", "660033", "FF66CC", "CC3399", "990066",
        "999999", "666666", "333333","CC66CC", "993399", "660066", "000066", "009966",
        "99FFCC", "66CC99", "339966", "006633", "CCCC99", "999966",
        "FFCCFF", "CC99CC", "996699", "660099", "CC99FF", "9966CC",
        "663399", "330066", "6666FF", "3333CC", "000099", "993366",
        "660033", "FF66CC", "CC3399", "990066", "999999", "666666",
        "9999FF", "6666CC", "333399", "666633", "333300", "CC0000",
        "FF6666", "CC3333", "990000", "FF9999", "CC6666", "993333",
        "660000", "993366", "660033", "FF66CC", "CC3399", "990066",
        "999999", "666666", "333333","CC66CC", "993399", "660066", "000066", "009966",
        "99FFCC", "66CC99", "339966", "006633", "CCCC99", "999966",
        "FFCCFF", "CC99CC", "996699", "660099", "CC99FF", "9966CC",
        "663399", "330066", "6666FF", "3333CC", "000099", "993366",
        "660033", "FF66CC", "CC3399", "990066", "999999", "666666",
        "9999FF", "6666CC", "333399", "666633", "333300", "CC0000",
        "FF6666", "CC3333", "990000", "FF9999", "CC6666", "993333",
        "660000", "993366", "660033", "FF66CC", "CC3399", "990066",
        "999999", "666666", "333333"
    ];
    //normalization for intensity map
    var intensityArr = [];
    $.each(featureData, function(index, val) {
        intensityArr.push(val.txnamt);
    });
    ratio = Math.max.apply(Math, intensityArr) / 50,
        $.each(intensityArr, function(index, value) {
            intensityArr[index] = Math.round(intensityArr[index] /
                ratio);
        });
    $.each(featureData, function(index, val) {
        var comma = (index !== 0 ? "," : "");
        var current = $("#dataSaveSpan-" + index).attr("id");
        var currentIp = $("#dataSaveSpanIp-" + index).attr("id");
        if ((typeof current === 'undefined') || (typeof currentIp ===
            'undefined')) {
            //console.log("1 or both undefined...");
        } else {
            //console.log("both have data...");
            var currentId = current.substr(13, 2);
            var currentIpId = currentIp.substr(15, 2);
            var iCoordinates = "";
            var iCoordinatesIp = "";
            //console.log("id: " + currentId + "  IpId: " + currentIpId);
            if (index == currentId) {
                coordinates = $(".dataSave #dataSaveSpan-" +index).text();
                var a = coordinates.split(",");
                iCoordinates = a[1] + "," + a[0];
               // console.log("Ad:" +coordinates);
                //console.log("iAd:" +iCoordinates);
            }
            if (index == currentIpId) {
                coordinatesIp = $(".dataSave #dataSaveSpanIp-" +index).text();
                var b = coordinatesIp.split(",");
                iCoordinatesIp = b[1] + "," + b[0];
                //console.log("IP:" +coordinatesIp);
                //console.log("iIP:" +iCoordinatesIp);
            }
            var latLngRet = $("#dataSave .class" + index).text();
            var shippingA = val.shippingaddress.replace(
                /['"]+/g, '');
            var billingA = val.billingaddress.replace(
                /['"]+/g, '');
            itemNo = '"' + val.itemNo + '"';
            //console.log(shippingA+ "\n" +billingA);
            billingaddress = '"' + billingA + '"';
            popupContent = '"' + shippingA + '"';
            shippingaddress = '"' + shippingA + '"';
            txnamt = val.txnamt;
            intensity = intensityArr[index];
            timestamp = val.timestamp;
            txnid = val.txnid;
            qty = val.qty;
            email = '"' + val.email + '"';
            currency = '"' + val.currency + '"';
            cardnum = val.cardnum;
            ip = '"' + val.ip + '"';
            ver = '"' + val.Version + '"';
            //var rand = Math.floor(Math.random()*colorArray.length);
            mcolor = '"' + colorArray[index] + '"';
            // var colorKey = '<span style="height:10px;width:10px;display:block;background:#'+colorArray[index]+'"></span>';
            // $('#dashboard-main-table tr[data-index='+index+']').children().first().html(colorKey);
            features += '' + comma + '{"geometry": {"type":' +
                geometryType + ',"coordinates": [' + coordinates +
                ']},"type": "Feature","properties": {"layer": ' +
                layerName + ',"popupContent": ' + popupContent +
                ',"markerColor": ' + mcolor + ',"intensity":' +
                intensity + ',"itemNo": ' + itemNo +
                ',"billingaddress": ' + billingaddress +
                ',"txnamt": ' + txnamt +
                ',"timestamp": ' + timestamp +
                ',"shippingaddress": ' + shippingaddress +
                ',"txnid": ' + txnid + ',"qty": ' +
                qty + ',"email": ' + email +
                ',"currency": ' + currency +
                ',"cardnum": ' + cardnum +
                ',"ip": ' + ip + ',"Version": ' + ver +
                '},"id": ' + index + ',"feature_count": ' +
                featureData.length + '}';
            featuresIp += '' + comma + '{"geometry": {"type":' +
                geometryType + ',"coordinates": [' + coordinatesIp +
                ']},"type": "Feature","properties": {"layer": ' +
                layerName + ',"popupContent": ' + ip +
                ',"markerColor": ' + mcolor + ',"intensity":' +
                intensity + ',"itemNo": ' + itemNo +
                ',"billingaddress": ' + billingaddress +
                ',"txnamt": ' + txnamt +
                ',"timestamp": ' + timestamp +
                ',"shippingaddress": ' + shippingaddress +
                ',"txnid": ' + txnid + ',"qty": ' +
                qty + ',"email": ' + email +
                ',"currency": ' + currency +
                ',"cardnum": ' + cardnum +
                ',"ip": ' + ip + ',"Version": ' + ver +
                '},"id": ' + index + ',"feature_count": ' +
                featureData.length + '}';
            lineString += '' + comma +
                '{"type": "LineString","coordinates": [[' +
                 iCoordinatesIp + '], [' + iCoordinates + ']]}';
        }
    });
    var jsonStringAdd = JSON.parse(featureHead + features + featureFoot);
    var jsonStringIp = JSON.parse(featureHead + featuresIp + featureFoot);
    var jsonStringLine = JSON.parse(lineStringHead + lineString +
        lineStringFoot);
    // try {
    //     jsonStringAdd = JSON.parse(jsonStringAdd);
    //     jsonStringIp = JSON.parse(jsonStringIp);
    //     jsonStringLine = JSON.parse(jsonStringLine);
    // } catch (err) {
    //     console.log("An error occured while parsing the geoJSON string >>> " + err);
    // }
    //console.log(jsonStringAdd);
    //console.log(jsonString2);
    //console.log(lineString3);
    //console.log("LineString: " + lineString3);
    $("#shipping-ip-map,#intensity-map,#sequance-map").preloader("hide");
    shippingIpMapFunc(jsonStringAdd, jsonStringIp, jsonStringLine);
    initIntensityMapFunc(jsonStringAdd);
    sequanceMapFunc(jsonStringAdd);
}