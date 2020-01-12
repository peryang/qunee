/**
* This file is part of Qunee for HTML5.
* Copyright (c) 2016 by qunee.com
**/

if(!window.getI18NString){getI18NString = function(s){return s;}}
var graph = new Q.Graph(canvas);

graph.enableTooltip = true;

graph.tooltipDelay = 0;
graph.tooltipDuration = 10000;

function createNode(name, x, y, image){
    var node = graph.createNode(name, x, y);
    if(image){
        node.image = "./network/images2/" + image;
    }
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
        $.ajax({
            url: "/v1/chaincode/operation",
            type:"post",
            data: JSON.stringify({
				"CZLX": "2",
                "DYLX": "query",
                "YHID": localStorage.getItem("YHID"),
                "SZ":{
                    "BT": $("#search_BT").val() || "",
                    "TJM": $("#search_TJM").val() || "",
                    "FWBH": $("#search_FWBH").val() || ""
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
                        var testArr = {};
                        var num = 1;
                        var level = 1;
                        for(var p = 0; p < parseNodes.length; p ++) {
                            var i = parseNodes[p];
                            if (level != nodes[i].level) num = 1;
                            var newNode = createNode(nodes[i].name, 1000 - (nodes[i].level - 1) * 200, 1000 + 100 * num, nodes[i].images || "abc.png");
                            testArr[nodes[i].id] = newNode;
                            if (nodes[i].type === '1' || nodes[i].type === '2')
                                newNode.tooltip = (nodes[i].name ? '<div class="tooltip-item">标题: ' + nodes[i].name + '</div>' : '') +
                                                (nodes[i].SBDW ? '<div class="tooltip-item">上报单位: ' + nodes[i].SBDW + '</div>' : '') +
                                                (nodes[i].ZBDW ? '<div class="tooltip-item">整编单位: ' + nodes[i].ZBDW + '</div>' : '') +
                                                (nodes[i].PY ? '<div class="tooltip-item">评优: ' + nodes[i].PY + '</div>' : '') +
                                                (nodes[i].FWBH ? '<div class="tooltip-item">发文编号: ' + nodes[i].FWBH + '</div>' : '') +
                                                (nodes[i].BWXS ? '<div class="tooltip-item">报文形式: ' + nodes[i].BWXS + '</div>' : '') +
                                                (nodes[i].TJM ? '<div class="tooltip-item">统计码: ' + nodes[i].TJM + '</div>' : '') +
                                                (nodes[i].YYSCDW ? '<div class="tooltip-item">引用素材单位: ' + nodes[i].YYSCDW + '</div>' : '');
                            if (nodes[i].type === '3')
                                newNode.tooltip = (nodes[i].name ? '<div class="tooltip-item">副本名称: ' + nodes[i].name + '</div>' : '') +
                                                (nodes[i].SFYFB ? '<div class="tooltip-item">是否有副本: ' + (nodes[i].SFYFB ? "有" : "没有") + '</div>' : '') +
                                                (nodes[i].JLBH ? '<div class="tooltip-item">修改记录: ' + nodes[i].JLBH + '</div>' : '') +
                                                (nodes[i].ZWNR ? '<div class="tooltip-item">正文内容: ' + nodes[i].ZWNR + '</div>' : '') +
                                                (nodes[i].XW ? '<div class="tooltip-item">席位: ' + nodes[i].XW + '</div>' : '') +
                                                (nodes[i].SJSJ ? '<div class="tooltip-item">提交时间: ' + nodes[i].SJSJ + '</div>' : '');
                            newNode.yxwID = nodes[i].id;
                            level = nodes[i].level;
                            num ++;
                        }
                        for (var e = 0; e < edges.length;  e ++) {
                            createEdge("", testArr[edges[e].from], testArr[edges[e].to]);
                        }
    
                        var level2 = createNode("半成品溯源", 500, 1000);
                        level2.image = "";
                        
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