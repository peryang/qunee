var allNodeMap = {};
var allNodes = [];
var allNodeID = [];
var allEdges = [];
var levelMap = {};

var myChart = echarts.init(document.getElementById('canvas'));
myChart.setOption({
    title: {
        text: ''
    },
    tooltip: {
        show: true,
        formatter: function(item) {
            if (item.data.type === "type1" || item.data.type === "type2")
                return (item.data.name ? '<div class="tooltip-item">标题: ' + item.data.name + '</div>' : '') +
                        (item.data.SBDW ? '<div class="tooltip-item">上报单位: ' + item.data.SBDW + '</div>' : '') +
                        (item.data.ZBDW ? '<div class="tooltip-item">整编单位: ' + item.data.ZBDW + '</div>' : '') +
                        (item.data.PY ? '<div class="tooltip-item">评优: ' + item.data.PY + '</div>' : '') +
                        (item.data.FWBH ? '<div class="tooltip-item">发文编号: ' + item.data.FWBH + '</div>' : '') +
                        (item.data.BWXS ? '<div class="tooltip-item">报文形式: ' + item.data.BWXS + '</div>' : '') +
                        (item.data.TJM ? '<div class="tooltip-item">统计码: ' + item.data.TJM + '</div>' : '') +
                        (item.data.YYSCDW ? '<div class="tooltip-item">引用素材单位: ' + item.data.YYSCDW + '</div>' : '');
            if (item.data.type === "type3")
                return (item.data.name ? '<div class="tooltip-item">副本名称: ' + item.data.name + '</div>' : '') +
                        (item.data.SFYFB ? '<div class="tooltip-item">是否有副本: ' + (item.data.SFYFB ? "有" : "没有") + '</div>' : '') +
                        (item.data.JLBH ? '<div class="tooltip-item">修改记录: ' + item.data.JLBH + '</div>' : '') +
                        (item.data.ZWNR ? '<div class="tooltip-item">正文内容: ' + item.data.ZWNR + '</div>' : '') +
                        (item.data.XW ? '<div class="tooltip-item">席位: ' + item.data.XW + '</div>' : '') +
                        (item.data.SJSJ ? '<div class="tooltip-item">提交时间: ' + item.data.SJSJ + '</div>' : '');
            return '';
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

function initChart() {
    allNodeMap = {};
    allNodes = [];
    allNodeID = [];
    allEdges = [];
    levelMap = {};
    myChart.setOption({series: {data: allNodes, links: allEdges}});
}

function render(url, data) {
    $.ajax({
        url: "/v1/chaincode/operation",
        type:"post",
//      url: url,
//      type:"get",
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
                    
                    var parseNodes = parseData(nodes);
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
    $("#DXQBNM").val("");
    $("#YHBH").val("");
    $('#FBDX').children('option').eq(0).prop('selected', true);
    $('#SFYFB').children('option').eq(0).prop('selected', true);
    $("#FBMC").val("");
    $("#JLBH").val("");
    $("#ZWNR").val("");
    $("#XW").val("");
    $("#SCBM").val("");
    $("#LOGHASH").val("");
    
    $("#SucaiDXQBNM").val("");
    $("#SucaiBT").val("");
    $("#SucaiSBDW").val("");
    $("#SucaiZBDW").val("");
    $("#SucaiPY").val("");
    $("#SucaiFWBH").val("");
    $("#SucaiBWXS").val("");
    $("#SucaiSCBM").val("");
    $("#SucaiTJM").val("");
    $("#SucaiYYSCDW").val("");
    $("#SucaiLOGHASH").val("");
    
    $("#UploadSCTMDXQBNM").val("");
    $("#UploadBT").val("");
    $("#UploadSBDW").val("");
    $("#UploadZBDW").val("");
    $("#UploadPY").val("");
    $("#UploadFWBH").val("");
    $("#UploadBWXS").val("");
    $("#UploadSCBM").val("");
    $("#UploadTJM").val("");
    $("#UploadYYSCDW").val("");
    $("#UploadLOGHASH").val("");
}

function switchParseData(data) {
    var nodes2uuid = {};
    var nodes = {};
    for (var i in data.nodes) {
        data.nodes[i].id = i;
        nodes[i] = data.nodes[i];
        nodes2uuid[i] = i;
    }
    var edges = [];
    for (var e = 0; e < data.edges.length;  e ++) {
        if (nodes2uuid[data.edges[e].from] && nodes2uuid[data.edges[e].to]) {
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
    return result;
}

$(function () {
    $("#addProSubmit").click(function () {
        $.ajax({
            url: "/v1/chaincode/operation",
            type: "post",
            contentType: "application/json",
            data:JSON.stringify({
                "CZLX":"1",
                "DYLX":"insert",
                "QBtype":"1",
                "SZ":{
                    "DXQBNM": $("#DXQBNM").val(),
                    "YHBH": $("#YHBH").val(),
                    "FBDX": $("#FBDX").val(),
                    "SFYFB": $("#SFYFB").val(),
                    "FBMC": $("#FBMC").val(),
                    "JLBH": $("#JLBH").val(),
                    "ZWNR": $("#ZWNR").val(),
                    "XW": $("#XW").val(),
                    "SCBM": $("#SCBM").val(),
                    "LOGHASH": $("#LOGHASH").val(),
                    "SJSJ": moment().format("YYYY-MM-DD HH:mm:ss")
                },
                "YHID": localStorage.getItem("YHID"),
                "BMID": localStorage.getItem("BMID")
            }),
            dataType: "json",
            success: function(result) {
                clearForm();
                if(result.response_status == 0) {
                    $("#success-msg").html("添加半成品成功").removeClass("hide");
                    setTimeout(function(){
                        $("#success-msg").addClass("hide");
                        $('#addPro').modal('hide');
                    }, 1000);
                } else {
                    $("#error-msg").html("添加半成品失败").removeClass("hide");
                    setTimeout(function(){
                        $("#error-msg").addClass("hide");
                        $('#addPro').modal('hide');
                    }, 1000);
                }
            }
        });
    });
    
    $("#addSucaiSubmit").click(function () {
        $.ajax({
            url: "/v1/chaincode/operation",
            type: "post",
            contentType: "application/json",
            data:JSON.stringify({
                "CZLX": "5",
                "DYLX": "insert",
                "QBtype": "1",
                "SZ":{
                    "DXQBNM": $("#SucaiDXQBNM").val(),
                    "BT": $("#SucaiBT").val(),
                    "SBDW": $("#SucaiSBDW").val(),
                    "ZBDW": $("#SucaiZBDW").val(),
                    "PY": $("#SucaiPY").val(),
                    "FWBH": $("#SucaiFWBH").val(),
                    "BWXS": $("#SucaiBWXS").val(),
                    "SCBM": $("#SucaiSCBM").val(),
                    "TJM": $("#SucaiTJM").val(),
                    "YYSCDW": $("#SucaiYYSCDW").val(),
                    "LOGHASH": $("#SucaiLOGHASH").val(),
                    "QBLX": "1",
                    "CPSC": "0",
                    "SLSJ": moment().format("YYYY-MM-DD HH:mm:ss")
                },
                "YHID": localStorage.getItem("YHID"),
                "BMID": localStorage.getItem("BMID")
            }),
            dataType: "json",
            success: function(result) {
                clearForm();
                if(result.response_status == 0) {
                    $("#success-msg").html("添加本级素材成功").removeClass("hide");
                    setTimeout(function(){
                        $("#success-msg").addClass("hide");
                        $('#addSucai').modal('hide');
                    }, 1000);
                } else {
                    $("#error-msg").html("添加本级素材失败").removeClass("hide");
                    setTimeout(function(){
                        $("#error-msg").addClass("hide");
                        $('#addSucai').modal('hide');
                    }, 1000);
                }
            }
        });
    });
    
    $("#addUploadSucaiSubmit").click(function () {
        $.ajax({
            url: "/v1/chaincode/operation",
            type: "post",
            contentType: "application/json",
            data:JSON.stringify({
                "CZLX": "2",
                "DYLX": "insert",
                "QBtype": "1",
                "SZ":{
                    "SCTMDXQBNM": $("#UploadSCTMDXQBNM").val(),
                    "BT": $("#UploadBT").val(),
                    "SBDW": $("#UploadSBDW").val(),
                    "ZBDW": $("#UploadZBDW").val(),
                    "PY": $("#UploadPY").val(),
                    "FWBH": $("#UploadFWBH").val(),
                    "BWXS": $("#UploadBWXS").val(),
                    "SCBM": $("#UploadSCBM").val(),
                    "TJM": $("#UploadTJM").val(),
                    "YYSCDW": $("#UploadYYSCDW").val(),
                    "LOGHASH": $("#UploadLOGHASH").val(),
                    "QBLX": "1",
                    "CPSC": "0",
                    "SLSJ": moment().format("YYYY-MM-DD HH:mm:ss")
                },
                "YHID": localStorage.getItem("YHID"),
                "BMID": localStorage.getItem("BMID")
            }),
            dataType: "json",
            success: function(result) {
                clearForm();
                if(result.response_status == 0) {
                    $("#success-msg").html("添加上报素材成功").removeClass("hide");
                    setTimeout(function(){
                        $("#success-msg").addClass("hide");
                        $('#addUploadSucai').modal('hide');
                    }, 1000);
                } else {
                    $("#error-msg").html("添加上报素材失败").removeClass("hide");
                    setTimeout(function(){
                        $("#error-msg").addClass("hide");
                        $('#addUploadSucai').modal('hide');
                    }, 1000);
                }
            }
        });
    });
    
    $("#searchBtn").click(function () {
        initChart();
        render("./indexSearch.json", {
            "CZLX": "2",
            "DYLX": "query",
            "YHID": localStorage.getItem("YHID"),
            "SZ":{
                "BT": $("#search_BT").val() || "",
                "TJM": $("#search_TJM").val() || "",
                "FWBH": $("#search_FWBH").val() || ""
            }
        });
    });
    
    $('#addPro').on('hide.bs.modal', function () {
        clearForm();
    });
    
    $('#addSucai').on('hide.bs.modal', function () {
        clearForm();
    });
    
    $('#addUploadSucai').on('hide.bs.modal', function () {
        clearForm();
    });
});
