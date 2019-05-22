//jqGrid的配置信息
$.jgrid.defaults.width = 1000;
$.jgrid.defaults.responsive = true;
$.jgrid.defaults.styleUI = 'Bootstrap';

//工具集合Tools
window.T = {};

// 获取请求参数
// 使用示例
// location.href = http://localhost/index.html?id=123
// T.p('id') --> 123;
var url = function(name) {
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r!=null)return  unescape(r[2]); return null;
};
T.p = url;

//请求前缀
//var baseURL = "http://demo.open.renren.io/renren-fastplus/";
//var baseURL = "/renren-fastplus/";
var baseURL = "/appstore/";
var token = localStorage.getItem("token");
if(token == null || token == ""){
	token = T.p("token");
}
//jqgrid全局配置
$.extend($.jgrid.defaults, {
    ajaxGridOptions : {
        headers: {
            "token": token
        }
    }
});

//权限判断
function hasPermission(permission) {
    if (window.parent.permissions.indexOf(permission) > -1) {
        return true;
    } else {
        return false;
    }
}

function refreshBtnPermission() {
	$('[btnPermission]').each(function(){
		var permission = $(this).attr("btnPermission");
		if(hasPermission(permission) == false) {
//			$(this).hide();
			$(this).remove();
		}
	});
}

//重写alert
window.alert = function(msg, callback){
	layer.alert(msg, function(index){
		layer.close(index);
		if(typeof(callback) === "function"){
			callback("ok");
		}
	});
}

//重写confirm式样框
window.confirm = function(msg, callback){
	layer.confirm(msg, {btn: ['确定','取消']},
	function(){//确定事件
		if(typeof(callback) === "function"){
			callback("ok");
		}
	});
}

//选择一条记录
function getSelectedRow() {
    var grid = $("#jqGrid");
    var rowKey = grid.getGridParam("selrow");
    if(!rowKey){
    	alert("请选择一条记录");
    	return ;
    }
    
    var selectedIDs = grid.getGridParam("selarrrow");
    if(selectedIDs.length > 1){
    	alert("只能选择一条记录");
    	return ;
    }
    
    return selectedIDs[0];
}

//选择多条记录
function getSelectedRows() {
    var grid = $("#jqGrid");
    var rowKey = grid.getGridParam("selrow");
    if(!rowKey){
    	alert("请选择一条记录");
    	return ;
    }
    
    return grid.getGridParam("selarrrow");
}
//选择多条应用记录
function getAppSelectedRows() {
	var grid = $("#appJqGrid");
    var rowKey = grid.getGridParam("selrow");
    if(!rowKey){
    	alert("请选择一条记录");
    	return ;
    }
    
    return grid.getGridParam("selarrrow");
}
//toast弹窗
var toast=(function () {
    var queen=[];
    function doWork() {
        var toast=queen[0];
        if(!toast){
            return;
        }
        var tpl=$('<div class="toast"><div class="toast-content">'+toast.content+'</div></div>');
        $("body").append(tpl);
        tpl.css("margin-top",-parseInt(tpl.height()/2)+"px");
        tpl.animate({
        	'opacity':1
		},500);
        setTimeout(function () {
            tpl.animate({
                'opacity':0
			},500,function () {
                queen.shift();
                tpl.remove();
                doWork();
            });
        },toast.delay)
    }
     
     return function (content,delay) {
	     delay=delay||2000
	     queen.push({content:content,delay:delay});
	     if(queen.length>1){
	         return;
	     }
	     doWork();
     }
})();
T.toast = toast;

function layoutInfo(content){
	layer.open({
        content: '<div style="text-align:center;">' +content+'</div>',
        btn: '<div class="bg-c1">关闭</div>'
    });
}

window.loading = function(msg){
	layer.msg(msg, {
	  icon: 16
	  ,shade: 0.01
	  ,time:10000000
	});
}
window.closeLoading = function(){
	layer.closeAll('dialog');
}

function rootBasePath() {
    var curWwwPath = window.document.location.href;
    var pathName = window.document.location.pathname;
    var pos = curWwwPath.indexOf(pathName);
    var localhostPaht = curWwwPath.substring(0, pos);
    var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
    return (localhostPaht + projectName);
};

/**
 * 使用jquery的inArray方法判断元素是否存在于数组中
 * @param {Object} arr 数组
 * @param {Object} value 元素值
 */
function isInArray(arr,value){
    var index = $.inArray(value,arr);
    if(index >= 0){
        return true;
    }
    return false;
}

//检查是否为正数
function isUnsignedNumeric(a){
	var reg = /^\+?[0-9]\d*$/;
    return reg.test(a);
 }

