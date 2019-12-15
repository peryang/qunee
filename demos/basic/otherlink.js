/**
* This file is part of Qunee for HTML5.
* Copyright (c) 2016 by qunee.com
**/

if(!window.getI18NString){getI18NString = function(s){return s;}}
var graph = new Q.Graph(canvas);

graph.enableTooltip = true;

graph.tooltipDelay = 0;
graph.tooltipDuration = 10000;

graph.ondblclick = function(evt){
    Q.log('double click');
}

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
    $("#DXQBWYM").val("");
    $("#DXQBNM").val("");
    $("#YHBH").val("");
    $('#FBDX').children('option').eq(0).prop('selected', true);
    $('#SFYFB').children('option').eq(0).prop('selected', true);
    $("#FBMC").val("");
    $("#JLBH").val("");
    $("#ZWNR").val("");
    $("#XW").val("");
    
    $("#SUCAIDXQBWYM").val("");
    $("#SUCAIBCPTMDXQBNM").val("");
    $("#SUCAISCTMDXQBWYM").val("");
    $("#SUCAISCTMDXQBNM").val("");
    $("#SUCAIQBLX").val("");
    $("#SUCAIBT").val("");
    $("#SUCAISBDW").val("");
    $("#SUCAIBWXS").val("");
    $("#SUCAIFWBH").val("");
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
					"DXQBWYM": $("#DXQBWYM").val(),
                    "DXQBNM": $("#DXQBNM").val(),
                    "YHBH": $("#YHBH").val(),
                    "FBDX": $("#FBDX").val(),
                    "SFYFB": $("#SFYFB").val(),
                    "FBMC": $("#FBMC").val(),
                    "JLBH": $("#JLBH").val(),
                    "ZWNR": $("#ZWNR").val(),
			    	"XW": $("#XW").val(),
                    "SJSJ": moment().format("YYYY-MM-DD HH:mm:ss")
				},
                "YHID": localStorage.getItem("YHID")
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
                "CZLX":"2",
                "DYLX":"insert",
                "QBtype":"1",
                "SZ":{
                    "DXQBWYM": $("#SUCAIDXQBWYM").val(),
                    "BCPTMDXQBNM": $("#SUCAIBCPTMDXQBNM").val(),
                    "SCTMDXQBWYM": $("#SUCAISCTMDXQBWYM").val(),
                    "SCTMDXQBNM": $("#SUCAISCTMDXQBNM").val(),
                    "QBLX": $("#SUCAIQBLX").val(),
                    "BT": $("#SUCAIBT").val(),
                    "SBDW": $("#SUCAISBDW").val(),
                    "BWXS": $("#SUCAIBWXS").val(),
                    "FWBH": $("#SUCAIFWBH").val(),
                    "LBSJ": moment().format("YYYY-MM-DD HH:mm:ss")
                },
                "YHID": localStorage.getItem("YHID")
            }),
            dataType: "json",
            success: function(result) {
                clearForm();
                if(result.response_status == 0) {
                    $("#success-msg").html("添加素材成功").removeClass("hide");
                    setTimeout(function(){
                        $("#success-msg").addClass("hide");
                        $('#addSucai').modal('hide');
                    }, 1000);
                } else {
                    $("#error-msg").html("添加素材失败").removeClass("hide");
                    setTimeout(function(){
                        $("#error-msg").addClass("hide");
                        $('#addSucai').modal('hide');
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
            url: "/v1/chaincode/operation",
            type:"post",
//          url: "./otherlink.json",
//          type:"get",
            data: JSON.stringify({
				CZLX:"2", 
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
                        var testArr = {};
                        var num = 1;
                        var level = 1;
                        for(var p = 0; p < parseNodes.length; p ++) {
                            var i = parseNodes[p];
                            if (level != nodes[i].level) num = 1;
                            var newNode = createNode(nodes[i].name, 1000 - (nodes[i].level - 1) * 200, 1000 + 100 * num, nodes[i].images || "abc.png");
                            testArr[nodes[i].id] = newNode;
                            if (nodes[i].type === 'type1')
                                newNode.tooltip = (nodes[i].DXQBWYM ? '<div class="tooltip-item">半成品QB唯一码: ' + nodes[i].DXQBWYM + '</div>' : '') +
                                                (nodes[i].name ? '<div class="tooltip-item">副本名称: ' + nodes[i].name + '</div>' : '') +
                                                (nodes[i].DXQBNM ? '<div class="tooltip-item">QB内码: ' + nodes[i].DXQBNM + '</div>' : '') +
                                                (nodes[i].SJSJ ? '<div class="tooltip-item">修改时间: ' + nodes[i].SJSJ + '</div>' : '') +
                                                (nodes[i].YHBH ? '<div class="tooltip-item">用户编号: ' + nodes[i].YHBH + '</div>' : '') +
                                                (nodes[i].FBDX ? '<div class="tooltip-item">原件副本: ' + nodes[i].FBDX + '</div>' : '') +
                                                (nodes[i].SFYFB ? '<div class="tooltip-item">是否有副本: ' + nodes[i].SFYFB + '</div>' : '') +
                                                (nodes[i].JLBH ? '<div class="tooltip-item">修改记录: ' + nodes[i].JLBH + '</div>' : '') +
                                                (nodes[i].ZWNR ? '<div class="tooltip-item">正文内容: ' + nodes[i].ZWNR + '</div>' : '') +
                                                (nodes[i].XW ? '<div class="tooltip-item">席位: ' + nodes[i].XW + '</div>' : '');
                            if (nodes[i].type === 'type2')
                                newNode.tooltip = (nodes[i].DXQBWYM ? '<div class="tooltip-item">半成品QB唯一码: ' + nodes[i].DXQBWYM + '</div>' : '') +
                                                (nodes[i].name ? '<div class="tooltip-item">数据标题: ' + nodes[i].name + '</div>' : '') +
                                                (nodes[i].BCPTMDXQBNM ? '<div class="tooltip-item">半成品QB内码: ' + nodes[i].BCPTMDXQBNM + '</div>' : '') +
                                                (nodes[i].SCTMDXQBWYM ? '<div class="tooltip-item">素材QB唯一码: ' + nodes[i].SCTMDXQBWYM + '</div>' : '') +
                                                (nodes[i].SCTMDXQBNM ? '<div class="tooltip-item">素材QB内码: ' + nodes[i].SCTMDXQBNM + '</div>' : '') +
                                                (nodes[i].QBLX ? '<div class="tooltip-item">情报类型: ' + nodes[i].QBLX + '</div>' : '') +
                                                (nodes[i].LBSJ ? '<div class="tooltip-item">来报时间: ' + nodes[i].LBSJ + '</div>' : '') +
                                                (nodes[i].SBDW ? '<div class="tooltip-item">上报单位: ' + nodes[i].SBDW + '</div>' : '') +
                                                (nodes[i].FWBH ? '<div class="tooltip-item">发文编号: ' + nodes[i].FWBH + '</div>' : '') +
                                                (nodes[i].BWXS ? '<div class="tooltip-item">报文形式: ' + nodes[i].BWXS + '</div>' : '');
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
    
    $('#getQBUUID').on('hide.bs.modal', function () {
        clearForm();
    });
});