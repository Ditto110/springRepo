var attachId = T.p('id');
$(function () {
	$("#attachId").val(attachId);
	initAttachInfo(attachId);
	initTable();
	skyworthbox.initApplist();
});
//---------- 初始化列表 ---------
function initTable(){
	$("#jqGrid").jqGrid({
        url: baseURL + '/admin/tbAttachAppmap/list?attachId='+attachId,
        datatype: "json",
        colModel: [			
			{ label: '应用ID', name: 'appid', index: 'appid', width: 80}, 			
			{ label: '名称', name: 'name', index: 'name', width: 60}, 			
			{ label: '应用图片', name: 'siconPath', index: 'siconPath', width: 80,formatter: function(value, options, row){
				return "<img src='"+value+"' width='25px' height='25px'>";
			}}, 			
			{ label: '操作', name: 'appid', index: 'appid', width: 60,formatter: function(value, options, row){
				return [
					/*"<button type='button' class='btn btn-info btn-xs' onclick='update("+row.appid+")'>修改</button>",*/
					"<button type='button' btnPermission='tbattachment:detail:del' class='btn btn-danger btn-xs' onclick='del("+row.appid+")'>删除</button>"
				].join('');
			}}			
        ],
		viewrecords: true,
        height: 450,
        rowNum: 30,
		rowList : [10,30,50],
        rownumbers: true, 
        rownumWidth: 25, 
        autowidth:true,
        multiselect: false,
        jsonReader : {
            root: "page.list",
            page: "page.currPage",
            total: "page.totalPage",
            records: "page.totalCount"
        },
        prmNames : {
            page:"page", 
            rows:"limit", 
            order: "order"
        },
        gridComplete:function(){
        	//隐藏grid底部滚动条
        	$("#jqGrid").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "hidden" }); 
        	//刷新按钮权限
        	refreshBtnPermission();
        }
    });
}
var vm = new Vue({
	el:'#rrapp',
	data:{
		showList: true,
		title: null,
	},
	methods: {
		query: function () {
			vm.reload();
		},
		reload: function (event) {
			var classid = $('#tdclass').val();
			vm.showList = true;
			var page = $("#jqGrid").jqGrid('getGridParam','page');
			$("#jqGrid").jqGrid('setGridParam',{
				postData:{
		        	'classid':classid
		        },
                page:page
            }).trigger("reloadGrid");
		},
		back:function(){
			var url = baseURL + "/admin/app/tbattachment.html";
			location.href = url; 
//			window.history.back(-1);
		}
	}
});
function add(appid){
	loading("正在保存，请稍后...");
	$.ajax({
		type: "post",
		url: baseURL + '/admin/tbAttachAppmap/save',
		data:{
			"appId":appid,
			'attachmentId':attachId
		},
		dataType : 'json',
	    success: function(r){
	    	closeLoading();
	    	if(r.status === 0){
	    		vm.reload();
			}else if (r.status === 1) {
				alert(r.msg);
			}
		},
		error : function() {
			closeLoading();
		}
	});
}
function initAttachInfo(rankId){
	var url = baseURL + '/admin/tbAttach/info';
	$.get(url,{"id":attachId},function(data){
		closeLoading();
    	if(data.status == 0){
    		$("#attachName").html(data.tbAttach.name);
    	}
	})
}

function addBatch(){
	loading("正在保存，请稍后...");
	var appid = $("#appJqGrid").jqGrid("getGridParam","selrow");
	if (appid == null) {
		alert("请选择需要添加的应用");
		return;
	}
	var appIds = $("#appJqGrid").jqGrid("getGridParam","selarrrow");
	confirm("请确认需要批量添加的应用!!!",function(){
		var ids = JSON.stringify(appIds);
		$.ajax({
			type:"post",
			url:baseURL + '/admin/tbAttachAppmap/saveBatch',
			data:{"attachIdStr":attachId,"ids":ids},
			success:function(data){
				if (data.status===0) {
					alert("批量添加成功...");
					vm.reload();
				}else if (data.status===1) {
					alert("批量添加失败...")
				}
			}
		})
	}) 
}

function update(id){
	var sort = $('#'+(id+'Sort')).val();
	loading("正在修改，请稍后...");
	$.ajax({
		type: "POST",
		url: baseURL + '/admin/tbRankApp/update',
		data:{
			'sort':sort,
			'id':id
		},
		dataType : 'json',
	    success: function(r){
	    	closeLoading();
	    	if(r.status === 0){
	    		vm.reload();
			}
		},
		error : function() {
			closeLoading();
		}
	});
}

function del(appId){
	confirm('确定删除配件应用？', function(){
		loading("正在删除，请稍后...");
		$.post(baseURL + '/admin/tbAttachAppmap/delete', {"appId": appId,"attachId":attachId},
			function(r){
				closeLoading();
				if(r.status === 0){
					vm.reload();
				}
			}, "json");
	});
}

