fdt = new function() {
    var tableName = "INSTREAM";
    this.createNewTable = function() {
        //console.log("Clicked on createNewTable");
        fdtClient.createTable(tableName);
    };
    this.deleteTable = function() {
        //console.log("Clicked on deleteTable");
        fdtClient.deleteTable(tableName);
    };
    this.checkForTable = function() {
        //console.log("Clicked on checkForTable");
        fdtClient.checkTable(tableName);
    };
    this.listAllTables = function() {
        //console.log("Clicked on listAllTables");
        fdtClient.listTables();
    };
    this.getRecordsFromtable = function() {
        //console.log("Clicked on getRecordsFromtable");
        fdtClient.getRecords(tableName);
    };
    this.getRecordsInRange = function(f, t) {
        //console.log("Clicked on getRecordsInArange");
        var from = f; //converting UNIX timestap to seconds
        var to = t;
        var start = 0;
        var count = 10;
        fdtClient.getRecordsRange(tableName, from, to, start, count);
    };
    this.getRecordsFromTableByIds = function() {
        //console.log("Clicked on getRecordsFromTableByIds");
        fdtClient.getRecordsByIds(tableName);
    };
    this.createNewRecords = function() {
        //console.log("Clicked on createNewRecords");
        var id = {};
        var timestamp = {};
        var values = {
            "columnName1": value1,
            "columnName2": value2
        };
        fdtClient.createRecords(id, tableName, timestamp, values);
    };
    this.deleteRecords = function() {
        //console.log("Clicked on deleteRecords");
        var timeFrom = {};
        var timeTo = {};
        fdtClient.deleteRecords(tableName, timeFrom, timeTo);
    };
    this.updateRecords = function() {
        //console.log("Clicked on updateRecords");
        var id = {};
        var timestamp = {};
        var values = {
            "columnName1": value1,
            "columnName2": value2
        };
        fdtClient.updateRecords(id, tableName, timestamp, values);
    };
    this.getRecordCount = function() {
        //console.log("Clicked on getRecordCount");
        fdtClient.recordCount(tableName);
    };
    this.createNewIndices = function() {
        //console.log("Clicked on createNewIndices");
        var types = {
            "indexColumnName1": TYPE1,
            "indexColumnName2": TYPE2
        };
        fdtClient.createIndices(tableName, types);
    };
    this.getIndicesFrom = function() {
        //console.log("Clicked on getIndicesFrom");
        fdtClient.getIndices(tableName);
    };
    this.clearIndicesFrom = function() {
        //console.log("Clicked on clearIndicesFrom");
        fdtClient.clearIndices(tableName);
    };
    this.searchRecordsFrom = function() {
        //console.log("----- innnn");
        //var n = loadData("current_num");
        //console.log("----- " +n.current_num);
        //if(typeof n.current_num == "undefined"){
        //saveData("current_num",1);
        // }
        var num = loadData("current_num");
        var cardId = loadData("wsDataLocal" + num);
        //console.log(cardId.event.payloadData.cardnum);
        var query = "cardnum:" + cardId.event.payloadData.cardnum;
        var start = 0;
        var count = 100;
        fdtClient.searchRecords(tableName, query, start,
            count);
    };
    this.filterRecords = function(query, fromTableLink) {
        var start = 0;
        var count = 100;
        if (fromTableLink) {
            //console.log("t");
            fdtClient.searchRecordsLink(tableName, query,start, count);
        } else {
            //console.log("f");
            fdtClient.searchRecords(tableName, query, start,count);
        }
    };
}