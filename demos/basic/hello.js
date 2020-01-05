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
    var yxwType = evt.getData().yxwType;
    $.ajax({
        // url: "/v1/chaincode/operation",
        // type:"post",
        url: "./login1.json",
        type:"get",
        data: JSON.stringify({
            CZLX:"1", 
            DYLX:"query",
            YHID:localStorage.getItem("YHID"),
            "SZ":{
            QDXBNM:"",
            QBWYM:$("#inputSCBM").val()
            }
        }),
        dataType: "json",
        success: function(json) {
            if(json.response_status == 0) {
                $("#success-msg").html("查询成功").removeClass("hide");
                setTimeout(function(){
                    $("#success-msg").addClass("hide");
                }, 1000);
                setTimeout(function(){
                    var nodes = json.response_data.data.nodes;
                    var edges = json.response_data.data.edges;
                    var parseNodes = parseData(nodes);
                    var level = 1;
                    var num = levelMap[level] + 1;
                    for(var p = 0; p < parseNodes.length; p ++) {
                        var i = parseNodes[p];
                        if (level != nodes[i].level) num = levelMap[nodes[i].level] + 1;
                        var newNode = createNode(nodes[i].id, nodes[i].id, 1000 - (nodes[i].level - 1) * 200, 1000 + 100 * num, nodes[i].images || "abc.png");
                        if (newNode) {
                            newNode.tooltip = (nodes[i].qbwym ? '<div class="tooltip-item">QB唯一码: ' + nodes[i].qbwym + '</div>' : '') +
                                                (nodes[i].name ? '<div class="tooltip-item">标题: ' + nodes[i].name + '</div>' : '') +
                                                (nodes[i].QBLX ? '<div class="tooltip-item">情报类型: ' + nodes[i].QBLX + '</div>' : '') +
                                                (nodes[i].LBSJ ? '<div class="tooltip-item">来报时间: ' + nodes[i].LBSJ + '</div>' : '') +
                                                (nodes[i].SBDW ? '<div class="tooltip-item">上报单位: ' + nodes[i].SBDW + '</div>' : '') +
                                                (nodes[i].PY ? '<div class="tooltip-item">评优: ' + nodes[i].PY + '</div>' : '') +
                                                (nodes[i].FWBH ? '<div class="tooltip-item">发文标号: ' + nodes[i].FWBH + '</div>' : '') +
                                                (nodes[i].BWXS ? '<div class="tooltip-item">值: ' + nodes[i].BWXS + '</div>' : '');
                            newNode.yxwID = nodes[i].id;
                            newNode.yxwType = nodes[i].id;
                            level = nodes[i].level;
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
        if (allEdges[i].from == from && allEdges[i].to == to) {
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
    $("#modalSubmit").click(function () {
        $.ajax({
            url: "/v1/chaincode/operation",
            type: "post",
            contentType: "application/json",
            data:JSON.stringify({
                "CZLX":"4",
                "DYLX":"insert",
                "QBtype":"1",
				"SZ":{
					"DXQBWYM": $("#DXQBWYM").val(),
                    "QBLX": $("#QBLX").val(),
                    "BT": $("#BT").val(),
                    "SBDW": $("#SBDW").val(),
                    "PY": $("#PY").val(),
                    "FWBH": $("#FWBH").val(),
                    "SCBM": $("#SCBM").val(),
			    	"BWXS": $("#BWXS").val(),
                    "LBSJ": moment().format("YYYY-MM-DD HH:mm:ss")
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
    
    $("#getQBUUIDSubmit").click(function () {
        $.ajax({
            url: "/v1/chaincode/operation",
            type: "post",
            contentType: "application/json",
            data:JSON.stringify({
                "DYLX":"create",
                "QBLX":"1",
                "QBNM": $("#QBNM").val(),
                "YHID": localStorage.getItem("YHID")
            }),
            dataType: "json",
            success: function(result) {
                clearForm();
                if(result.response_status == 0) {
                    $("#success-msg").html("获取QB唯一码成功").removeClass("hide");
                    setTimeout(function(){
                        $("#success-msg").addClass("hide");
                        $("#showResult .modal-body").html('QB唯一码：' + result.response_data.QBWYM || '空');
                        $('#getQBUUID').modal('hide');
                        $('#showResult').modal('show');
                    }, 1000);
                } else {
                    $("#error-msg").html("获取QB唯一码失败").removeClass("hide");
                    setTimeout(function(){
                        $("#error-msg").addClass("hide");
                    }, 1000);
                }
            }
        });
    });
    
    $("#searchBtn").click(function () {
        $.ajax({
            // url: "/v1/chaincode/operation",
            // type:"post",
            url: "./login.json",
            type:"get",
            data: JSON.stringify({
				CZLX:"1", 
                DYLX:"query",
				YHID:localStorage.getItem("YHID"),
				"SZ":{
				QDXBNM:"",
                QBWYM:$("#inputSCBM").val()
				}
            }),
            dataType: "json",
            success: function(json) {
				if(json.response_status == 0) {
					$("#success-msg").html("查询成功").removeClass("hide");
					setTimeout(function(){
						$("#success-msg").addClass("hide");
					}, 1000);
					setTimeout(function(){
                        var nodes = json.response_data.data.nodes;
                        var edges = json.response_data.data.edges;
                        var parseNodes = parseData(nodes);
                        var num = 1;
                        var level = 1;
                        for(var p = 0; p < parseNodes.length; p ++) {
                            var i = parseNodes[p];
                            if (level != nodes[i].level) num = 1;
                            var newNode = createNode(nodes[i].id, nodes[i].id, 1000 - (nodes[i].level - 1) * 200, 1000 + 100 * num, nodes[i].images || "abc.png");
                            if (newNode) {
                                newNode.tooltip = (nodes[i].qbwym ? '<div class="tooltip-item">QB唯一码: ' + nodes[i].qbwym + '</div>' : '') +
                                                    (nodes[i].name ? '<div class="tooltip-item">标题: ' + nodes[i].name + '</div>' : '') +
                                                    (nodes[i].QBLX ? '<div class="tooltip-item">情报类型: ' + nodes[i].QBLX + '</div>' : '') +
                                                    (nodes[i].LBSJ ? '<div class="tooltip-item">来报时间: ' + nodes[i].LBSJ + '</div>' : '') +
                                                    (nodes[i].SBDW ? '<div class="tooltip-item">上报单位: ' + nodes[i].SBDW + '</div>' : '') +
                                                    (nodes[i].PY ? '<div class="tooltip-item">评优: ' + nodes[i].PY + '</div>' : '') +
                                                    (nodes[i].FWBH ? '<div class="tooltip-item">发文标号: ' + nodes[i].FWBH + '</div>' : '') +
                                                    (nodes[i].BWXS ? '<div class="tooltip-item">值: ' + nodes[i].BWXS + '</div>' : '');
                                newNode.yxwID = nodes[i].id;
                                newNode.yxwType = nodes[i].id;
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
                    }, 1000);
				} else {
					$("#error-msg").html("获取数据失败").removeClass("hide");
					setTimeout(function(){
						$("#error-msg").addClass("hide");
					}, 1000);
				}
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