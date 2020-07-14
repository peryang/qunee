var realTable = '';

function reloadData(newDataList) {
    var currentPage = realTable.page()
    realTable.clear()
    realTable.rows.add(newDataList)
    realTable.page(currentPage).draw( false );
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
                	reloadData(json.response_data.data || []);
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

$(function () {
	$("#search_CZLX").change(function(e){
		if (e.target.value == '7') {
			$('#search_Date_c').addClass('hide');
			$('#search_FINDKEY_c').removeClass('hide');
			$('#search_FINDVALUE_c').removeClass('hide');
		} else if (e.target.value == '8') {
			$('#search_Date_c').removeClass('hide');
			$('#search_FINDKEY_c').addClass('hide');
			$('#search_FINDVALUE_c').addClass('hide');
		}
	});
	
	$('#search_Date').daterangepicker({
		timePicker: true,
		timePicker24Hour: true,
		startDate: moment().startOf('hour').subtract(48, 'hour'),
		endDate: moment().startOf('hour'),
		locale: {
			format: 'YYYY-MM-DD HH:mm:00',
			applyLabel: '确定',
			cancelLabel: '取消',
			fromLabel: '起始时间',
			toLabel: '结束时间',
			daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
			monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
			firstDay: 1
		}
	});
	
    $("#searchBtn").click(function () {
    	var CZLX = $("#search_CZLX").val();
    	var postData = {
            "DYLX": "query",
            "YHID": localStorage.getItem("YHID"),
            "CZLX": CZLX,
            "SZ":{
                "FINDKEY": $("#search_FINDKEY").val() || "",
                "FINDVALUE": $("#search_FINDVALUE").val() || ""
            }
       	};
       	if (CZLX == 8) {
       		var search_DateArr = $("#search_Date").val().split(' - ');
       		postData = {
	            "DYLX": "query",
	            "YHID": localStorage.getItem("YHID"),
	            "CZLX": CZLX,
	            "SZ":{
	                "START_TIME": search_DateArr[0],
	                "END_TIME": search_DateArr[1]
	            }
	       	};
       	}
        render("./searchSearch.json", postData);
    });
    
    realTable = $('#myTable').DataTable({
    	"data": [],
    	"columns": [
    		{ title: "QB唯一码", data: "dxqbwym" },
    		{ title: "上链时间", data: "slsj" },
    		{ title: "QB类型", data: "qblx" },
    		{ title: "标题", data: "bt" },
    		{ title: "上报单位", data: "sbdw" },
    		{ title: "评优", data: "py" },
    		{ title: "发文编号", data: "fwbh" },
    		{ title: "报文形式", data: "bwxs" }
    	],
    	"order": [],
    	"lengthChange": false,
    	"stateSave": false,
    	"searching": false,
    	"iDisplayLength": 15,
    	"language": {
			"sProcessing": "处理中...",
			"sLengthMenu": "显示 _MENU_ 项结果",
			"sZeroRecords": "没有匹配结果",
			"sInfo": "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
			"sInfoEmpty": "显示第 0 至 0 项结果，共 0 项",
			"sInfoFiltered": "(由 _MAX_ 项结果过滤)",
			"sInfoPostFix": "",
			"sSearch": "搜索:",
			"sUrl": "",
			"sEmptyTable": "表中数据为空",
			"sLoadingRecords": "载入中...",
			"sInfoThousands": ",",
			"oPaginate": {
				"sFirst": "首页",
				"sPrevious": "上页",
				"sNext": "下页",
				"sLast": "末页"
			}
		}
    });
});
