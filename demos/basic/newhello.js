var allNodeMap = {};
var allNodes = [{
    symbolSize: 0,
    x: 700,
    y: 900
}, {
    symbolSize: 0,
    x: 700,
    y: 1600
}, {
    symbolSize: 0,
    x: 300,
    y: 900
}, {
    symbolSize: 0,
    x: 300,
    y: 1600
}, {
    symbolSize: 0.00001,
    symbol: 'arrow',
    name: 'ZQ',
    x: 900,
    y: 1000
}, {
    symbolSize: 0.00001,
    symbol: 'arrow',
    name: 'ZQFY',
    x: 500,
    y: 1000
}, {
    symbolSize: 0.00001,
    symbol: 'arrow',
    name: 'BD',
    x: 100,
    y: 1000
}];
var allNodeID = [];
var allEdges = [{
    source: 0,
    target: 1,
    lineStyle: {
        opacity: 0.9,
        width: 1,
        curveness: 0
    }
}, {
    source: 2,
    target: 3,
    lineStyle: {
        opacity: 0.9,
        width: 1,
        curveness: 0
    }
}];
var levelMap = {};

var myChart = echarts.init(document.getElementById('canvas'));
myChart.setOption({
    title: {
        text: ''
    },
    tooltip: {
        show: true,
        formatter: function(item) {
            return (item.data.xname ? '<div class="tooltip-item">标题: ' + item.data.xname + '</div>' : '') +
            (item.data.SBDW ? '<div class="tooltip-item">上报单位: ' + item.data.SBDW + '</div>' : '') +
            (item.data.ZBDW ? '<div class="tooltip-item">整编单位: ' + item.data.ZBDW + '</div>' : '') +
            (item.data.PY ? '<div class="tooltip-item">评优: ' + item.data.PY + '</div>' : '') +
            (item.data.FWBH ? '<div class="tooltip-item">发文编号: ' + item.data.FWBH + '</div>' : '') +
            (item.data.BWXS ? '<div class="tooltip-item">报文形式: ' + item.data.BWXS + '</div>' : '') +
            (item.data.TJM ? '<div class="tooltip-item">统计码: ' + item.data.TJM + '</div>' : '') +
            (item.data.YYSCDW ? '<div class="tooltip-item">引用素材单位: ' + item.data.YYSCDW + '</div>' : '');
        }
    },
    animationDurationUpdate: 1500,
    animationEasingUpdate: 'quinticInOut',
    series:  {
        type: 'graph',
        layout: 'none',
        symbolSize: 50,
        roam: true,
        label: {
            show: true,
            position: 'bottom',
            color: 'black'
        },
        edgeSymbol: ['none', 'none'],
        edgeSymbolSize: [4, 10],
        edgeLabel: {
            fontSize: 20
        },
        data: allNodes,
        links: allEdges,
        lineStyle: {
            opacity: 0.9,
            width: 2,
            curveness: 0
        }
    }
});

myChart.on('dblclick', function (params) {
    var url = "";
    var CZLX = "";
    if (params.data.type === "type1") {
        url = "./chanpinClick.json";
        CZLX = "1";
    } else if (params.data.type === "type2") {
        url = "./sucaiClick.json";
        CZLX = "6";
    }
    render(url, {
        "CZLX": CZLX,
        "DYLX": "query",
        "YHID": localStorage.getItem("YHID"),
        "BMID": localStorage.getItem("BMID"),
        "SZ":{
            "BT": params.data.xname || "",
            "TJM": params.data.TJM || "",
            "FWBH": params.data.FWBH || "",
            "LEVEL": params.data.level || "",
            "BMJB": localStorage.getItem("BMJB")
        }
    });
});

function initChart() {
    levelMap = {};
    allNodeMap = {};
    allNodeID = [];
    allNodes = [{
        symbolSize: 0,
        x: 700,
        y: 900
    }, {
        symbolSize: 0,
        x: 700,
        y: 1600
    }, {
        symbolSize: 0,
        x: 300,
        y: 900
    }, {
        symbolSize: 0,
        x: 300,
        y: 1600
    }, {
        symbolSize: 0.00001,
        symbol: 'arrow',
        name: 'ZQ',
        x: 900,
        y: 1000
    }, {
        symbolSize: 0.00001,
        symbol: 'arrow',
        name: 'ZQFY',
        x: 500,
        y: 1000
    }, {
        symbolSize: 0.00001,
        symbol: 'arrow',
        name: 'BD',
        x: 100,
        y: 1000
    }];
    allEdges = [{
        source: 0,
        target: 1,
        lineStyle: {
            opacity: 0.9,
            width: 1,
            curveness: 0
        }
    }, {
        source: 2,
        target: 3,
        lineStyle: {
            opacity: 0.9,
            width: 1,
            curveness: 0
        }
    }];
    myChart.setOption({series: {data: allNodes, links: allEdges}});
}

function render(url, data) {
    $.ajax({
        url: "/v1/chaincode/operation",
        type:"post",
        // url: url,
        // type:"get",
        data: JSON.stringify(data),
        dataType: "json",
        success: function(json) {
            if(json.response_status == 0) {
                $("#success-msg").html("查询成功").removeClass("hide");
                setTimeout(function(){
                    $("#success-msg").addClass("hide");
                }, 1000);
                setTimeout(function(){
                    var switchData = switchParseData(json.response_data.data);
                    var nodes = switchData.nodes;
                    var edges = switchData.edges;
                    var tmpparseNodes = parseData(nodes)
                    var parseNodes = tmpparseNodes.parseNodes;
                    var levelData = tmpparseNodes.levelData;
                    var level = 1;
                    var num = (levelMap[level] || 0) + 1;
                    for(var p = 0; p < parseNodes.length; p ++) {
                        var i = parseNodes[p];
                        if (level != nodes[i].level) num = (levelMap[nodes[i].level] || 0) + 1;
                        var newNode = createNode(nodes[i], 1000 - (nodes[i].level - 1) * 200, 1000 + 100 * num, nodes[i].images || "abc.png");
                        if (newNode) {
                            level = nodes[i].level;
                            levelMap[level] = num;
                            num ++;
                        }
                    }
                    for (var e = 0; e < edges.length;  e ++) {
                        if (allNodeMap[edges[e].source] && allNodeMap[edges[e].target] && checkEdge(edges[e].source, edges[e].target)) {
                            allEdges.push(edges[e]);
                        }
                    }
                    for (var dy = 0; dy < allNodes.length; dy ++) {
                        while (allNodes[dy].parentID && allNodes[dy].y < allNodeMap[allNodes[dy].parentID].y) {
                            var tmpLevelData = levelData[allNodes[dy].level + ""];
                            levelMap[allNodes[dy].level + ""] += 1;
                            for (var ld = (tmpLevelData && allNodes[dy] && allNodes[dy].id) ? tmpLevelData.indexOf(allNodes[dy].id) : 0;
                                    ld >= 0 && ld < tmpLevelData.length;
                                    ld ++
                                ) {
                                allNodeMap[tmpLevelData[ld]].y += 100;
                            }
                        }
                    }
                    myChart.setOption({series: {data: allNodes, links: allEdges}});
                }, 1000);
            } else {
                $("#error-msg").html("获取数据失败").removeClass("hide");
                setTimeout(function(){
                    $("#error-msg").addClass("hide");
                }, 1000);
            }
        }
    });
}

function checkEdge(source, target) {
    for (var i = 0; i < allEdges.length; i ++) {
        if ((allEdges[i].source == source && allEdges[i].target == target)
            || (allEdges[i].source == target && allEdges[i].target == source)) {
            return false;
        }
    }
    return true;
}

function createNode(nodeData, x, y, image){
    if (allNodeID.indexOf(nodeData.id) > -1) {
        return false;
    }
    nodeData.x = x;
    nodeData.y = y;
    nodeData.symbol = 'image://./network/images/' + image;
    allNodeID.push(nodeData.id);
    allNodeMap[nodeData.id] = nodeData;
    allNodes.push(nodeData);
    return nodeData;
}

function clearForm() {
    $("#QBLX").val("");
    $("#BT").val("");
    $("#SBDW").val("");
    $("#PY").val("");
    $("#FWBH").val("");
    $("#SCBM").val("");
    $("#BWXS").val("");
}

function switchParseData(data) {
    var nodes2uuid = {};
    var nodes = {};
    for (var i in data.nodes) {
        if (data.nodes[i].qbwym && data.nodes[i].level) {
            var newUUID = data.nodes[i].qbwym + "_" + data.nodes[i].level;
            data.nodes[i].id = newUUID;
            data.nodes[i].xname = data.nodes[i].name;
            data.nodes[i].name = '';
            nodes[newUUID] = data.nodes[i];
            nodes2uuid[i] = newUUID;
        }
    }
    var edges = [];
    for (var e = 0; e < data.edges.length;  e ++) {
        if (nodes2uuid[data.edges[e].from] && nodes2uuid[data.edges[e].to]) {
            nodes[nodes2uuid[data.edges[e].to]].parentID = nodes2uuid[data.edges[e].from];
            edges.push({
                source: nodes2uuid[data.edges[e].from],
                target: nodes2uuid[data.edges[e].to]
            });
        }
    }
    return {
        nodes: nodes,
        edges: edges
    };
}

function parseData(data) {
    var result = [];
    var json = {};
    for(var i in data) {
        if (!json[data[i].level + ""]) json[data[i].level + ""] = [];
        json[data[i].level + ""].push(data[i].id);
    }
    for(var j in json) {
        result = [...result, ...json[j]];
    }
    return {
        parseNodes: result,
        levelData: json
    };
}

$(function () {
    $("#modalSubmit").click(function () {
        $.ajax({
            url: "/v1/chaincode/operation",
            type: "post",
            contentType: "application/json",
            data:JSON.stringify({
                "CZLX": "6",
                "DYLX": "insert",
                "QBtype": "1",
                "SZ":{
                    "DXQBNM": $("#DXQBNM").val(),
                    "DXQBYNM": $("#DXQBYNM").val(),
                    "BT": $("#BT").val(),
                    "SBDW": $("#SBDW").val(),
                    "ZBDW": $("#ZBDW").val(),
                    "PY": $("#PY").val(),
                    "FWBH": $("#FWBH").val(),
                    "BWXS": $("#BWXS").val(),
                    "SCBM": $("#SCBM").val(),
                    "TJM": $("#TJM").val(),
                    "YYSCDW": $("#YYSCDW").val(),
                    "LOGHASH": $("#LOGHASH").val(),
                    "QBLX": "1",
                    "CPSC": "1",
                    "SLSJ": moment().format("YYYY-MM-DD HH:mm:ss")
                },
                "YHID": localStorage.getItem("YHID"),
                "BMID": localStorage.getItem("BMID")
            }),
            dataType: "json",
            success: function(result) {
                clearForm();
                if(result.response_status == 0) {
                    $("#success-msg").html("插入节点成功").removeClass("hide");
                    setTimeout(function(){
                        $("#success-msg").addClass("hide");
                        $('#myModal').modal('hide');
                    }, 1000);
                } else {
                    $("#error-msg").html("插入节点失败").removeClass("hide");
                    setTimeout(function(){
                        $("#error-msg").addClass("hide");
                        $('#myModal').modal('hide');
                    }, 1000);
                }
            }
        });
    });
    
    $("#searchBtn").click(function () {
        initChart();
        render("./indexSearch.json", {
            "CZLX": $("#search_CZLX").val(),
            "DYLX": "query",
            "YHID": localStorage.getItem("YHID"),
            "BMID": localStorage.getItem("BMID"),
            "SZ":{
                "BT": $("#search_BT").val() || "",
                "TJM": $("#search_TJM").val() || "",
                "FWBH": $("#search_FWBH").val() || "",
                "LEVEL": 0,
                "BMJB": localStorage.getItem("BMJB")
            }
        });
    });
    
    $('#myModal').on('hide.bs.modal', function () {
        clearForm();
    });
    
    $('#getQBUUID').on('hide.bs.modal', function () {
        clearForm();
    });
});
