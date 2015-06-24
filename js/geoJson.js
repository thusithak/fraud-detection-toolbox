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

    var features = '';
    var featuresIp = '';
    var lineString = '';
    var featureData = globalTnx;
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
        //console.log("ratio: "+ratio);
    $.each(featureData, function(index, val) {
        var comma = (index !== 0 ? "," : "");
        var coordinates = val.addLong +","+ val.addLat;
        var coordinatesIp = val.ipLong +","+ val.ipLat;
        var iCoordinates = val.addLat +","+ val.addLong;
        var iCoordinatesIp = val.ipLat +","+ val.ipLong;
        //console.log("coordinates:" +coordinates +" --- coordinatesIp:" +coordinatesIp);
        //console.log("icoordinates:" +iCoordinates +" --- icoordinatesIp:" +iCoordinatesIp);
        var shippingA = val.shippingaddress.replace(/['"]+/g, '');
        var billingA = val.billingaddress.replace(/['"]+/g, '');

        itemNo = '"' + val.itemNo + '"';
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

        var xxcolor = $.xcolor.random();
        //console.log("color:" + index +": " +xxcolor);
        mcolor = '"' + xxcolor + '"';
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
    });

    try {
        var jsonStringAdd = JSON.parse(featureHead + features + featureFoot);
        var jsonStringIp = JSON.parse(featureHead + featuresIp + featureFoot);
        var jsonStringLine = JSON.parse(lineStringHead + lineString +lineStringFoot);
    } catch (err) {
        console.log("An error occured while parsing the geoJSON string >>> " + err);
    }
    //console.log(jsonStringAdd);
    //console.log(jsonString2);
    //console.log(lineString3);
    //console.log("LineString: " + lineString3);
    $("#shipping-ip-map,#intensity-map,#sequance-map").preloader("hide");
    shippingIpMapFunc(jsonStringAdd, jsonStringIp, jsonStringLine);
    initIntensityMapFunc(jsonStringAdd);
    sequanceMapFunc(jsonStringAdd);
}