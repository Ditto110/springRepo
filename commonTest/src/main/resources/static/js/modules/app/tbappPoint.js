$(function () {
	skyworthbox.initApplist();
    $("#jqGrid").jqGrid({
        url: baseURL + 'admin/tbapppoint/list',
        datatype: "json",
        colModel: [			
			{ label: 'id', name: 'id', index: 'id', width: 50, key: true },
			{ label: '应用ID', name: 'appid', index: 'appid', width: 40 }, 			
			{ label: '应用名称', name: 'aliasName', index: 'aliasName', width: 80 },
			{ label: '图片', name: 'siconPath', index: 'siconPath', width: 80,formatter:function(cellValue,options,rowObject){  
				var	imgUrl = '<img src="'+baseURL + '/file/download?fullPath='+ rowObject.siconPath+'" style="width:50px;height:25px;"/>';
	            return imgUrl;
			} },	
			{ label: '第一次领取积分', name: 'firstPoint', index: 'firstPoint', width: 80,formatter:function(cellValue,options,rowObject){  
                return '<input type="text" class="form-control" value="'+rowObject.firstPoint+'" id="firstPoint_'+rowObject.id+'"/>';
			} },
			{ label: '第二次领取积分', name: 'secondPoint', index: 'secondPoint', width: 80,formatter:function(cellValue,options,rowObject){  
                return '<input type="text" class="form-control" value="'+rowObject.secondPoint+'" id="secondPoint_'+rowObject.id+'"/>';
			} },
			{ label: '第三次领取积分', name: 'thirdPoint', index: 'thirdPoint', width: 80,formatter:function(cellValue,options,rowObject){  
                return '<input type="text" class="form-control" value="'+rowObject.thirdPoint+'" id="thirdPoint_'+rowObject.id+'"/>';
			} },
			{ label: '操作', name: 'id', index: 'id', width: 80,formatter:function(cellValue,options,rowObject){  
                return "<a  class='btn btn-info btn-xs' btnPermission='tbappPoint:update' onclick='vm.updateApp("+rowObject.id+","+rowObject.appid+");'>更新</a>&nbsp;&nbsp;<a btnPermission='tbappPoint:del' class='btn btn-danger btn-xs' onclick='vm.delApp("+rowObject.id+");'>删除</a>";
			} }
        ],
        height: 385,
        rowNum: 10,
		rowList : [10,30,50],
        rownumWidth: 25, 
        autowidth:true,
        multiselect: true,
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
        	$("#jqGrid").closest(".ui-jqgrid-bdiv").css({ "overflow-y" : "scroll" }); 
        }
    });
    vm.loadDevicetype();
});

var vm = new Vue({
	el:'#rrapp',
	data:{
		showList: true
	},
	methods: {
		query: function () {
			vm.reload();
		},
		delApp: function(id){
			confirm('确定要删除选中的应用？', function(){
				var url = "admin/tbapppoint/delete";
				$.get(baseURL + url,{id:id},
						function(r){
					if(r.status == 0){
						alert("操作成功", function(index){
							vm.reload();
						});
					}else{
						alert("操作异常");
					}
				});
				
			});
		},
		updateApp: function(id,appid){
			confirm('确定要更改该应用吗？', function(){
				var url = "admin/tbapppoint/update";
				var firstPoint = $("#firstPoint_"+id).val();
				var secondPoint = $("#secondPoint_"+id).val();
				var thirdPoint = $("#thirdPoint_"+id).val();
				var tbAppPoint = {
						id:id,
						appid:appid,
						firstpoint:firstPoint,
						secondpoint:secondPoint,
						thirdpoint:thirdPoint
				};
				$.ajax({
					type: "POST",
				    url: baseURL + url,
	                contentType: "application/json",
				    data: JSON.stringify(tbAppPoint),
				    success: function(r){
				    	if(r.status == 0){
							alert('操作成功', function(index){
								vm.reload();
							});
						}else{
							alert("操作异常");
						}
					}
				});
				
			});
		},
		reload: function (event) {
			var param = {
					name:$("#name").val(),
					deviceTypeId:$("#deviceTypeId").val(),
					customerId:$("#customerId").val()
			};
			$("#jqGrid").jqGrid('setGridParam',{ 
                page:1,
                postData:param
            }).trigger("reloadGrid");
		},
		/**加载型号*/
		loadDevicetype: function(){
			$.get(baseURL + "devicetype/query",function(r){
				var optionhtml = '<option value="">全部</option>';
		    	for(var i in r.deviceTypeList){
		    		optionhtml += '<option value="'+r.deviceTypeList[i].devicetypeid+'">'+r.deviceTypeList[i].devicetype+'</option>'
				}
		    	$("#deviceTypeId").html(optionhtml);
                vm.loadCustomer();
            });
		},
		/**加载渠道*/
		loadCustomer:function(){
			//全部渠道
			var devicetypeid = $("#deviceTypeId").val();
			if(devicetypeid == null || devicetypeid == ''){
				var optionhtml = '<option value="">全部</option>';
				$.get(baseURL + "customer/query", function(r){
			    	for(var i in r.customers){
			    		optionhtml += '<option value="'+r.customers[i].customerid+'">'+r.customers[i].customername+'</option>'
					}
	            });
				$("#customerId").html(optionhtml);
			}else{
				var devicetypeid = $("#deviceTypeId").val();
				$.get(baseURL + "typecustomermap/info/"+devicetypeid, function(r){
						var optionhtml = '<option value="">全部</option>';
				    	for(var i in r.customerMaps){
				    		optionhtml += '<option value="'+r.customerMaps[i].customerid+'">'+r.customerMaps[i].customername+'</option>'
						}
				    	$("#customerId").html(optionhtml);
		        });
			}
		},
		devidetypeSelect: function(){
			vm.loadCustomer();
		}
		
	}
});

/**批量添加*/
function addBatch(){
	var appIds = getAppSelectedRows();
	if(appIds == null || appIds == undefined || appIds.length < 1){
		alert("请至少选择一条记录");
		return ;
	}
	loading("正在保存，请稍后...");
	$.ajax({
		type: "POST",
		url: baseURL + '/admin/tbapppoint/save',
		data:{
			"appIds":appIds.toString()
		},
		dataType : 'json',
	    success: function(r){
	    	closeLoading();
	    	if(r.status === 0){
	    		alert("操作成功", function(index){
	    			vm.reload();
				});
			}
		},
		error : function(r) {
			alert("操作异常", function(index){
				closeLoading();
			});
		}
	});
}
/**单个添加*/
function add(appId){
	loading("正在保存，请稍后...");
	$.ajax({
		type: "POST",
		url: baseURL + '/admin/tbapppoint/save',
		data:{
			"appIds":appId
		},
		dataType : 'json',
	    success: function(r){
	    	closeLoading();
	    	if(r.status === 0){
	    		alert("操作成功", function(index){
	    			vm.reload();
				});
			}
		},
		error : function(r) {
			alert("操作异常", function(index){
				closeLoading();
			});
		}
	});
}