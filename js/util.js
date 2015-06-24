fdtRestRequestUtil = new function() {
        this.makeJsonRequest = function(type, u, d, callback) {
            var BAMUrl = "https://localhost:9443" + u; //localhost
            //var BAMUrl = "http://10.100.5.46:9763" + u;
            //var BAMUrl = "http://192.168.57.141:9763" + u;
            var username = "admin";
            var password = "admin";
            $.ajax({
                type: type,
                url: BAMUrl,
                data: d,
                contentType: "application/json",
                dataType: "json",
                success: callback,
                crossDomain: true,
                beforeSend: function (request)
                {
                    request.setRequestHeader("Authorization", "Basic YWRtaW46YWRtaW4=");
                }
            });
        };
    }
    //preloader plugin
    (function($) {
        $.fn.preloader = function(action) {
            if (action === 'show') {
                this.html(
                    '<div class="preloaderContainer">Loading Map Data</div>'
                );
                $(".preloaderContainer").addClass('preloader');
            }
            if (action === 'hide') {
                $(".preloaderContainer").remove();
            }
            return this;
        };
    }(jQuery));
window.msgCount = 0;
fdtRestWsUtil = new function() {
    this.startWs = function() {


        console.log("web socket started... ");
        var CEPUrl = 'ws://localhost:9763/outputwebsocket/WebsocketPublisher'; //localhost
        //var CEPUrl = 'ws://192.168.57.141:9763/outputwebsocket/WebsocketPublisher';
        //var CEPUrl = 'ws://10.100.5.46:9763/outputwebsocket/WebsocketPublisher';
        var ws = new WebSocket(CEPUrl);
        var wsData;
        ws.onopen = function() {
            var d = loadData("wsDataLocal1");
            //console.log("data: " + d.event.payloadData.txnid);
            if ($.isEmptyObject(d)) {
                window.msgCount = 0;
            } else {
                var c = Object.keys(d).length;
                window.msgCount = c;
            }
            $("#fraudMsg1").hide();
            $("#fraudMsgOk").show();
            $("#fraudulent-data-panel").hide();
        };
        //event handler for the message event in the case of text frames
        ws.onmessage = function(e) {
            console.log("ws message: " + e.data);
            var d = JSON.parse(e.data);
            msgCount++;
            saveData("wsDataLocal" + msgCount, d);
            console.log("data saved.... " + msgCount);
            d = loadData("wsDataLocal" + msgCount);
            bindWsContent(d, msgCount);
            //$("#alertDd ul li>a").first().click();
        };
        ws.onclose = function() {
            console.log("web Socket onclose. ");
        };
    };
}

function bindWsContent(wsData, msgCount) {
    console.log(msgCount);
    if (msgCount < 1) {
        $("#alertDd").hide();
    } else if (msgCount < 2) {
        showWsContent(wsData);
    } else {
        $("#alertDd").show();
        $("#alertDd .dropdown-menu").prepend('<li><a id="' + msgCount +
            '" href="#">possible fraudulent transaction for <span class="label label-danger">' +
            wsData.event.payloadData.cardnum + '</span> .</a></li>');
        $("#fdCount").text(msgCount - 1);
        $("#alertDd").show("slow");
    }
    $("#alertDd ul li a").click(function(e) {
        e.preventDefault();
        var currentNumber = $(this).attr("id");
        //currentNumber = currentNumber.replace(/['"]+/g, '');
        //console.log(currentNumber);
        var d = loadData("wsDataLocal" + currentNumber);
        //deleteData("wsDataLocal"+currentNumber);
        if (typeof currentNumber === 'undefined') {
            saveData("current_num", "1");
            //console.log("if:" +current_num);
        } else {
            saveData("current_num", currentNumber);
            //console.log(current_num);
        }
        $(this).parent().remove();
        var len = $("#alertDd ul li").length;
        if (len === 0) {
            $("#alertDd").hide();
        } else {
            $("#fdCount").text(len);
        }
        showWsContent(d);
    });
}

function showWsContent(wsData) {
        var cardId = wsData.event.payloadData.cardnum;
        var fScore = wsData.event.payloadData.fraudflag;
        //console.log("ws started....");
        $("#fraudMsg1 strong").text(
            "CEP has detected a possible fraudulent transaction for " +
            wsData.event.payloadData.cardnum);
        $("#cardNumberDisplay").text(wsData.event.payloadData.cardnum);
        $("#appendContainerL,#appendContainerR").html("");
        if (fScore < 20) {
            $("#fraudMsg1 small").text("Detection details > Generic Rules");
            $("#detectionMethod").text("Generic Rule");
        } else if (fScore == 50) {
            $("#fraudMsg1 small").text("Detection details > High fraud score");
            $("#detectionMethod").text("High fraud score");
        } else if (50 < fScore && fScore < 100) {
            $("#fraudMsg1 small").text(
                "Detection details > Generic Rules & High fraud score");
            $("#detectionMethod").text("Generic Rules & High fraud score");
        } else if (fScore == 100) {
            $("#fraudMsg1 small").text("Detection details > Markov model");
            $("#detectionMethod").text("Markov model");
        } else if (100 < fScore && fScore < 150) {
            $("#fraudMsg1 small").text(
                "Detection details > Generic Rules & Markov model");
            $("#detectionMethod").text("Generic Rules & Markov model");
        } else if (fScore == 150) {
            $("#fraudMsg1 small").text(
                "Detection details > High fraud score & Markov model");
            $("#detectionMethod").text("High fraud score & Markov model");
        } else if (fScore > 150) {
            $("#fraudMsg1 small").text(
                "Detection details > Generic Rules, High fraud score & Markov model"
            );
            $("#detectionMethod").text(
                "Generic Rules, High fraud score & Markov model");
        }
        $("#appendContainerL").prepend(
            '<div class="form-group"><label for="input" class="control-label col-xs-4">Transaction ID</label><div class="col-xs-8"><p class="form-control-static">' +
            wsData.event.payloadData.txnid + '</p></div></div>');
        $("#appendContainerL").prepend(
            '<div class="form-group"><label for="input" class="control-label col-xs-4">Transaction Amount</label><div class="col-xs-8"><p class="form-control-static">' +
            wsData.event.payloadData.txnamt + '</p></div></div>');
        $("#appendContainerL").prepend(
            '<div class="form-group"><label for="input" class="control-label col-xs-4">Transaction currency</label><div class="col-xs-8"><p class="form-control-static">' +
            wsData.event.payloadData.currency + '</p></div></div>');
        $("#appendContainerL").prepend(
            '<div class="form-group"><label for="input" class="control-label col-xs-4">Email</label><div class="col-xs-8"><p class="form-control-static">' +
            wsData.event.payloadData.email + '</p></div></div>');
        $("#appendContainerL").prepend(
            '<div class="form-group"><label for="input" class="control-label col-xs-4">Shipping Address</label><div class="col-xs-8"><p class="form-control-static">' +
            wsData.event.payloadData.shippingaddress + '</p></div></div>');
        $("#appendContainerL").prepend(
            '<div class="form-group"><label for="input" class="control-label col-xs-4">IP</label><div class="col-xs-8"><p class="form-control-static">' +
            wsData.event.payloadData.ip + '</p></div></div>');
        $("#appendContainerL").prepend(
            '<div class="form-group"><label for="input" class="control-label col-xs-4">Item Number</label><div class="col-xs-8"><p class="form-control-static">' +
            wsData.event.payloadData.itemNo + '</p></div></div>');
        $("#appendContainerL").prepend(
            '<div class="form-group"><label for="input" class="control-label col-xs-4">Item Qty</label><div class="col-xs-8"><p class="form-control-static">' +
            wsData.event.payloadData.qty + '</p></div></div>');
        $("#fraudMsg1").show();
        $("#fraudulent-data-panel").show();
        $("#fraudMsgOk").hide();
    }
    //data normalization for intensities
fdtNormalizeUtil = new function() {
    this.normalizeArray = function(a) {
        //var numbers = [3, 8, 45, 74, 123000],
        ratio = Math.max.apply(Math, a) / 100,
            //console.log("rat: " + ratio);
            $.each(a, function(index, value) {
                a[index] = Math.round(a[index] / ratio);
            });
        return a;
    }
}




function saveData(objName, obj) {
    var objO = JSON.stringify(obj);
    localStorage.setItem(objName, objO);
}

function loadData(objName) {
    var objO = localStorage.getItem(objName);
    if (objO) objO = JSON.parse(objO);
    return objO;
}

function deleteData(objName) {
    localStorage.removeItem(objName);
}