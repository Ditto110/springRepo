var tagId = T.p('id');
$(function () {
    initTable();
    vm.loadDevicetype2();
	skyworthbox.initApplist();
});

function initTable(){
	var classid = $('#tdclass').val();
	$("#jqGrid").jqGrid({
        url: baseURL + '/admin/tagApp/list?tagId='+tagId,
        datatype: "json",
        colModel: [			
			{ label: 'appID', name: 'appId', index: 'appId', width: 30},
            { label: '名称', name: 'name', index: 'name', width: 60},
            { label: '图片', name: 'iconPath', index: 'iconPath', width: 80,formatter: function(value, options, row){
                    var	imgUrl = '<img src="'+baseURL + '/file/download?fullPath='+ value +'" style="width:50px;height:25px;"/>';
                    return imgUrl;
                }},
            { label: '分类', name: 'classInfo', index: 'classInfo', width: 60,formatter:function(value,Object,row){
                    var fClass = "";
                    var sClass = "";
                $.each(value,function () {
                        if (this.classlevel == 1){
                            fClass += this.classname;
                        } else if (this.classlevel ==2){
                            sClass += this.classname;
                            sClass +=" "
                        }
                    })
                    return sClass+"|"+fClass;
                }},
            { label: '包名', name: 'packageName', index: 'packageName', width: 60},
            /*{ label: '排序', name: 'name', index: 'name', width: 60},*/
            { label: '下载次数', name: 'visualDownloadNum', index: 'visualDownloadNum', width: 60},
            { label: '操作', name: 'id', index: 'id', width: 60,formatter: function(value, options, row){
				return [
					/*"<button type='button' btnPermission='tbrank:tbrankmapp:update' class='btn btn-info btn-xs' onclick='update("+row.appId+")'>修改</button>",*/
					"<button type='button' btnPermission='tbrank:tbrankmapp:del' class='btn btn-danger btn-xs' onclick='del("+row.appId+")'>删除</button>"
				].join('');
			}}			
        ],
        viewrecords: true,
        multiselect: false,
        height: 450,
        rowNum: 10,
        rowList : [10,30,50],
        rownumbers: false,
        rownumWidth: 60,
        autowidth:true,
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
        	/*$("#jqGrid").jqGrid('setLabel','rn', '排序', {'text-align':'center'},'');*/
        	// refreshBtnPermission();
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
		},
		reload: function (event) {
			var devicetypeid2 = $('#devicetypeid2').val();
			var customerid2 = $('#customerid2').val();
			vm.showList = true;
			var page = $("#jqGrid").jqGrid('getGridParam','page');
			$("#jqGrid").jqGrid('setGridParam',{
				postData:{
		        	'devicetypeId':devicetypeid2,
		        	'customerId':customerid2
		        },
                page:page
            }).trigger("reloadGrid");
		},
		back:function(){
			var url = baseURL + "/admin/app/tbtag.html";
			location.href = url; 
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
		}
	}
});
function add(appid){
	loading("正在保存，请稍后...");
	$.ajax({
		type: "POST",
		url: baseURL + '/admin/tagApp/save',
		data:{
			"appId":appid,
			'tagId':tagId
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

function addBatch(){
	loading("正在保存，请稍后...");
	var appid = $("#appJqGrid").jqGrid("getGridParam","selrow");
	if (appid == null) {
		alert("请选择需要添加的应用");
		return;
	}
	var appIds = $("#appJqGrid").jqGrid("getGridParam","selarrrow");
	confirm("请确认需要批量添加的应用!!!",function(){
		var ids = appIds.join(",");
		$.ajax({
			type:"post",
			url:baseURL + '/admin/tagApp/saveBatch',
			data:{"tagId":tagId,"appIds":ids},
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
	loading("正在修改，请稍后...");
	var visualDownloadNum = $("#num"+appId).val();
	$.ajax({
		type: "POST",
		url: baseURL + '/admin/tbRankApp/update',
		data:{
			'visualDownloadNum':visualDownloadNum,
			'appId':appId
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
	confirm('确定标签下应用?', function(){
		loading("正在删除，请稍后...");
		$.post(baseURL + '/admin/tagApp/delete', {"appId": appId,"tagId":tagId},
			function(r){
				closeLoading();
				if(r.status === 0){
					vm.reload();
				}
			}, "json");
	});
}

