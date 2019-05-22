var rankId = T.p('id');
$(function () {
	$("#rankId").val(rankId);
	initRankInfo(rankId);
	vm.loadDevicetype2();
	initTable();
	skyworthbox.initApplist();
});
//---------- 初始化列表 ---------
function initTable(){
	var classid = $('#tdclass').val();
	$("#jqGrid").jqGrid({
        url: baseURL + '/admin/tbRankApp/list?rankId='+rankId,
        datatype: "json",
        colModel: [			
			{ label: '虚拟下载次数', name: 'visualDownloadNum', index: 'visualDownloadNum', width: 50,formatter: function(value, options, row){
				return "<input value='"+value+"' id='num"+row.appId+"'>";
			}},
			{ label: '应用ID', name: 'appId', index: 'appId', width: 50}, 			
			{ label: '名称', name: 'name', index: 'name', width: 60},
			{ label: '应用图片', name: 'siconPath', index: 'siconPath', width: 80,formatter: function(value, options, row){
				return "<img src='"+value+"' width='25px' height='25px'>";
			}}, 			
			{ label: '操作', name: 'id', index: 'id', width: 60,formatter: function(value, options, row){
				return [
					"<button type='button' btnPermission='tbrank:tbrankmapp:update' class='btn btn-info btn-xs' onclick='update("+row.appId+")'>修改</button>",
					"<button type='button' btnPermission='tbrank:tbrankmapp:del' class='btn btn-danger btn-xs' onclick='del("+row.appId+")'>删除</button>"
				].join('');
			}}			
        ],
		viewrecords: true,
        height: 450,
        rowNum: 30,
		rowList : [10,30,50],
        rownumbers: true, 
        rownumWidth: 60, 
        autowidth:true,
        multiselect: false,
        pager: "#jqGridPager",
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
        	$("#jqGrid").jqGrid('setLabel','rn', '排序', {'text-align':'center'},'');
        	refreshBtnPermission();
        },
        postData:{
        	'classid':classid
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
            vm.changeColumnName();
		},
		reload: function () {
			vm.showList = true;
			var page = $("#jqGrid").jqGrid('getGridParam','page');
			$("#jqGrid").jqGrid('setGridParam',{
				postData:{
		        	'deviceTypeId':$('#devicetypeid2').val(),
		        	'customerId':$('#customerid2').val(),
		        	'rankType':$("#rankType").val(),
		        	'appName':$("#rankAppName").val()
		        },
                page:page
            }).trigger("reloadGrid");
		},
		back:function(){
			location.href = baseURL + "/admin/app/tbrank.html";
		},
		/**加载型号*/
		loadDevicetype2: function(){
			$.get(baseURL + "devicetype/query",function(r){
				var optionhtml = '<option value="">全部</option>';
		    	for(var i in r.deviceTypeList){
		    		optionhtml += '<option value="'+r.deviceTypeList[i].devicetypeid+'">'+r.deviceTypeList[i].devicetype+'</option>'
				}
		    	$("#devicetypeid2").html(optionhtml);
		    	vm.loadCustomer2(); 
            });
		},
		/**加载渠道*/
		loadCustomer2:function(){
			var devicetypeid = $("#devicetypeid2").val();
			//全部渠道
			if(devicetypeid == null || devicetypeid == ''){
				$.get(baseURL + "customer/query", function(r){
					var optionhtml = '<option value="">全部</option>';
			    	for(var i in r.customers){
			    		optionhtml += '<option value="'+r.customers[i].customerid+'">'+r.customers[i].customername+'</option>'
					}
			    	$("#customerid2").html(optionhtml);
	            });
			}else{
				$.get(baseURL + "typecustomermap/info/"+devicetypeid, function(r){
					var optionhtml = '<option value="">全部</option>';
			    	for(var i in r.customerMaps){
			    		optionhtml += '<option value="'+r.customerMaps[i].customerid+'">'+r.customerMaps[i].customername+'</option>'
					}
			    	$("#customerid2").html(optionhtml);
	            });
			}
		},
        refreshWeekRank:function (rankType) {
            var rankTypeName = rankType === "week" ? "周榜" : "月榜";
            var rankName = $("#rankName").val();
			$.get(baseURL + '/admin/tbRankApp/refreshPeriodRank',{rankType:rankType,rankId:rankId,rankName:rankName},function(r){
                alert(r.msg);
                vm.reload();
            })
        },
       /* refreshWeekRank2:function (rankType) {
            var rankTypeName = rankType === "week" ? "周榜" : "月榜";
            var rankName = $("#rankName").val();
			$.get(baseURL + '/admin/tbRankApp/refreshPeriodRank',{rankType:rankType,rankId:rankId,thresholdDay:1,rankName:rankName},function(r){
                alert(r.msg);
                vm.reload();
            })
        },*/
		changeColumnName:function () {
			var rankType = $("#rankType").val();
			if (rankType !== "all"){
                $("#jqGrid").jqGrid('setLabel', "visualDownloadNum","实际下载次数" );
            }else {
                $("#jqGrid").jqGrid('setLabel', "visualDownloadNum","虚拟下载次数" );
			}
        }
	}
});
function add(appid){
    var deviceTypeId = $("#devicetypeid2").val();
    var customerId = $("#customerid2").val();
    if (customerId ==='' && deviceTypeId !==''||customerId !=='' && deviceTypeId ===''){
        alert("请指定具体机型和渠道");
        return;
	}
	loading("正在保存，请稍后...");
	$.ajax({
		type: "POST",
		url: baseURL + '/admin/tbRankApp/save',
		data:{
			"appId":appid,
			'rankId':rankId,
            'rankType':$("#rankType").val(),
            'appName':$("#rankAppName").val(),
            'deviceTypeId':deviceTypeId,
            'customerId':customerId
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
function initRankInfo(rankId){
	var url = baseURL + '/admin/tbRank/rankInfo';
	$.get(url,{"id":rankId},function(data){
		closeLoading();
    	if(data.status == 0){
    		$("#rankName").html(data.rankInfo.name);
    		$("#rankName").val(data.rankInfo.name);
    	}
	})
}

function addBatch(){
    var deviceTypeId = $("#devicetypeid2").val();
    var customerId = $("#customerid2").val();
    if (customerId ==='' && deviceTypeId !==''||customerId !=='' && deviceTypeId ===''){
        var msg = "请指定具体机型和渠道";
        alert(msg);
        return;
    }
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
			url:baseURL + '/admin/tbRankApp/saveBatch',
			data:{"rankId":rankId,
                'rankType':$("#rankType").val(),
                'appName':$("#rankAppName").val(),
                'deviceTypeId':deviceTypeId,
                'customerId':customerId,
				"ids":ids},
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

function update(appId){
    var deviceTypeId = $("#devicetypeid2").val();
    var customerId = $("#customerid2").val();
    if (customerId ==='' && deviceTypeId !==''||customerId !=='' && deviceTypeId ===''){
        var msg = "请指定具体机型和渠道,";
        alert(msg);
        return;
    }
	loading("正在修改，请稍后...");
	var visualDownloadNum = $("#num"+appId).val();
	$.ajax({
		type: "POST",
		url: baseURL + '/admin/tbRankApp/update',
		data:{
			'visualDownloadNum':visualDownloadNum,
			'appId':appId,
			'rankType':$("#rankType").val(),
            'deviceTypeId':deviceTypeId,
            'customerId':customerId
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
    var deviceTypeId = $("#devicetypeid2").val();
    var customerId = $("#customerid2").val();
    if (customerId ==='' && deviceTypeId !==''||customerId !=='' && deviceTypeId ===''){
        var msg = "请指定具体机型和渠道,";
        alert(msg);
        return;
    }
	confirm('确定删除排行榜应用？', function(){
		loading("正在删除，请稍后...");
		$.post(baseURL + '/admin/tbRankApp/delete',
			{"appId": appId,
				"rankId":rankId,
                'rankType':$("#rankType").val(),
                'deviceTypeId':deviceTypeId,
                'customerId':customerId
			},
			function(r){
				closeLoading();
				if(r.status === 0){
					vm.reload();
				}
			}, "json");
	});
}

