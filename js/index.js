$(function () {
	$("#signup").click(function () {
        $("#first").fadeOut("fast", function () {
            $("#second").fadeIn("fast");
        });
    });
    $("#signin").click(function () {
        $("#second").fadeOut("fast", function () {
            $("#first").fadeIn("fast");
        });
    });
    
    $("form[name='login']").validate({
        rules: {
            loginYHID: {
                required: true
            },
            loginBMID: {
                required: true
            }
        },
        messages: {
            loginYHID: "请输入用户ID",
            loginBMID: "请输入部门ID"
        },
        submitHandler: function (form) {  
            $.ajax({
                url: "/v1/chaincode/operation",
                type: "post",
                data: JSON.stringify({
                    YHID: $("#loginYHID").val(),
                    BMID: $("#loginBMID").val(),
					DYLX: "login"
                }),
                dataType: "json",
                contentType: "application/json",
                success: function(result) {
					if(result.response_status == 0){
						$("#success-msg").html("登录成功").removeClass("hide");
						setTimeout(function(){
							$("#success-msg").addClass("hide");
							window.location.href = "./demos/index.html";
						}, 1000);
						localStorage.setItem("YHID", $("#loginYHID").val());
						localStorage.setItem("BMID", $("#loginBMID").val());
					} else {
						$("#error-msg").html("登录失败").removeClass("hide");
						setTimeout(function(){
							$("#error-msg").addClass("hide");
						}, 1000);
					}
                }
            });
        }
    });
});
$(function () {
    $("form[name='registration']").validate({
        rules: {
            registYHID: {
                required: true
            },
            registBMID: {
                required: true
            },
            registBMJB: {
                required: true
            },
            registYHQM: {
                required: true
            }
        },
        messages: {
            registYHID: "请输入用户ID",
            registBMID: "请输入部门ID",
            registBMJB: "请输入部门级别",
            registYHQM: "请输入用户名"
        },
        submitHandler: function (form) {
            $.ajax({
                url: "/v1/chaincode/operation",
                type: "post",
                data: JSON.stringify({
                    DYLX: "register",
                    YHID: $("#registYHID").val(),
                    BMID: $("#registBMID").val(),
                    BMJB: $("#registBMJB").val(),
                    YHQM: $("#registYHQM").val()
                }),
                dataType: "json",
                contentType: "application/json",
                success: function(result) {
					if(result.response_status == 0) {
						$("#success-msg").html("注册成功").removeClass("hide");
						setTimeout(function(){
							$("#success-msg").addClass("hide");
						}, 1000);
						window.location.reload();
					} else {
						$("#error-msg").html("注册失败").removeClass("hide");
						setTimeout(function(){
							$("#error-msg").addClass("hide");
						}, 1000);
					}
                },
            });
        }
    });
});