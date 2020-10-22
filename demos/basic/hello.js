/**
* This file is part of Qunee for HTML5.
* Copyright (c) 2016 by qunee.com
**/

if(!window.getI18NString){getI18NString = function(s){return s;}}
var graph = new Q.Graph(canvas);
var allNode = {};
var allNodeID = [];
var allEdges = [];
var levelMap = {};

graph.enableTooltip = true;

graph.tooltipDelay = 0;
graph.tooltipDuration = 10000;

graph.ondblclick = function(evt){
    var nodeData = evt.getData() || {};
    var url = "";
    var CZLX = "";
    if (nodeData.type === "type1") {
        url = "./chanpinClick.json";
        CZLX = "1";
    } else if (nodeData.type === "type2") {
        url = "./sucaiClick.json";
        CZLX = "6";
    }
    render(url, {
        "CZLX": CZLX,
        "DYLX": "query",
        "YHID": localStorage.getItem("YHID"),
        "BMID": localStorage.getItem("BMID"),
        "SZ":{
            "BT": nodeData.BT || "",
            "TJM": nodeData.TJM || "",
            "FWBH": nodeData.FWBH || "",
            "LEVEL": nodeData.level || "",
            "BMJB": localStorage.getItem("BMJB")
        }
    });
}

function drawEnv() {
    var enode11 = createNode("enode11", "", 700, 900);
    if (enode11) enode11.image = "";
    var enode12 = createNode("enode12", "", 700, 1300);
    if (enode12) enode12.image = "";
    
    var enode21 = createNode("enode21", "", 300, 900);
    if (enode21) enode21.image = "";
    var enode22 = createNode("enode22", "", 300, 1300);
    if (enode22) enode22.image = "";
    
    if (enode11 && enode12 && checkEdge("enode11", "enode12")) createEdge("", enode11, enode12, null, "rgba(0, 0, 0, .1)");
    if (enode21 && enode22 && checkEdge("enode21", "enode22")) createEdge("", enode21, enode22, null, "rgba(0, 0, 0, .1)");
    
    var level1 = createNode("level1ZQ", "ZQ", 900, 1000);
    if (level1) level1.image = "";
    
    var level2 = createNode("level2ZQFY", "ZQFY", 500, 1000);
    if (level2) level2.image = "";
    
    var level3 = createNode("level3BD", "BD", 100, 1000);
    if (level3) level3.image = "";
    
    graph.moveToCenter(1);
}

function render(url, data) {
    $.ajax({
   //   url: "/v1/chaincode/operation",
   //   type:"post",
      url: url,
      type:"get",
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
                        var newNode = createNode(nodes[i].id, nodes[i].name, 1000 - (nodes[i].level - 1) * 200, 1000 + 100 * num, nodes[i].images || "abc.png");
                        if (newNode) {
                            newNode.tooltip = (nodes[i].name ? '<div class="tooltip-item">标题: ' + nodes[i].name + '</div>' : '') +
                                                (nodes[i].SBDW ? '<div class="tooltip-item">上报单位: ' + nodes[i].SBDW + '</div>' : '') +
                                                (nodes[i].ZBDW ? '<div class="tooltip-item">整编单位: ' + nodes[i].ZBDW + '</div>' : '') +
                                                (nodes[i].PY ? '<div class="tooltip-item">评优: ' + nodes[i].PY + '</div>' : '') +
                                                (nodes[i].FWBH ? '<div class="tooltip-item">发文编号: ' + nodes[i].FWBH + '</div>' : '') +
                                                (nodes[i].BWXS ? '<div class="tooltip-item">报文形式: ' + nodes[i].BWXS + '</div>' : '') +
                                                (nodes[i].TJM ? '<div class="tooltip-item">统计码: ' + nodes[i].TJM + '</div>' : '') +
                                                (nodes[i].YYSCDW ? '<div class="tooltip-item">引用素材单位: ' + nodes[i].YYSCDW + '</div>' : '');
                            newNode.type= nodes[i].type;
                            newNode.BT = nodes[i].name;
                            newNode.TJM = nodes[i].TJM;
                            newNode.FWBH = nodes[i].FWBH;
                            newNode.level = nodes[i].level;
                            level = nodes[i].level;
                            levelMap[level] = num;
                            num ++;
                        }
                    }
                    for (var e = 0; e < edges.length;  e ++) {
                        if (allNode[edges[e].from] && allNode[edges[e].to] && checkEdge(edges[e].from, edges[e].to)) {
                            createEdge("", allNode[edges[e].from], allNode[edges[e].to]);
                            allEdges.push(edges[e]);
                        }
                    }
                    
                    graph.moveToCenter(1);
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

function checkEdge(from, to) {
    for (var i = 0; i < allEdges.length; i ++) {
        if ((allEdges[i].from == from && allEdges[i].to == to)
            || (allEdges[i].from == to && allEdges[i].to == from)) {
            return false;
        }
    }
    return true;
}

function createNode(id, name, x, y, image){
    if (allNodeID.indexOf(id) > -1) {
        return false;
    }
    var node = graph.createNode(name, x, y);
    if(image){
        node.image = "./network/images/" + image;
    }
    allNodeID.push(id);
    allNode[id] = node;
    return node;
}

function createEdge(name, from, to, edgeType, color){
    var edge = graph.createEdge(name, from, to);
    edge.setStyle(Q.Styles.LABEL_RADIUS, 0);
    edge.setStyle(Q.Styles.LABEL_ROTATABLE, false);
    edge.setStyle(Q.Styles.LABEL_BACKGROUND_COLOR, "#FFFFFF");
    edge.setStyle(Q.Styles.LABEL_ANCHOR_POSITION, Q.Position.CENTER_MIDDLE);
    edge.setStyle(Q.Styles.LABEL_BACKGROUND_COLOR, "#FFFFFF");
    edge.setStyle(Q.Styles.ARROW_TO, false);
    edge.setStyle(Q.Styles.EDGE_COLOR, color || "#000");
    
    if(edgeType){
        edge.edgeType = edgeType;
    }
    return edge;
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
            nodes[newUUID] = data.nodes[i];
            nodes2uuid[i] = newUUID;
        }
    }
    var edges = [];
    for (var e = 0; e < data.edges.length;  e ++) {
        if (nodes2uuid[data.edges[e].from] && nodes2uuid[data.edges[e].to]) {
            edges.push({
                from: nodes2uuid[data.edges[e].from],
                to: nodes2uuid[data.edges[e].to]
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
    drawEnv();
    
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
