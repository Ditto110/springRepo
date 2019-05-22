$(function() {
	$("#jqGrid").jqGrid({
			url : baseURL + 'stat/installLogList',
			datatype : "json",
			colModel : [
					{
						label : '产品SN',
						name : 'sn',
						index : 'sn',
						width : 30
					},
					{
						label : '应用名称',
						name : 'appname',
						index : 'appname',
						width : 40
					},
					{
						label : '渠道',
						name : 'customerid',
						index : 'customerid',
						width : 40
					},
					{
						label : '机型',
						name : 'deviceType',
						index : 'deviceType',
						width : 30
					},
					{
						label : '版本',
						name : 'versionname',
						index :'versionname',
						width : 30
					},
					{
						label : '安装类型',
						name : 'source',
						index : 'source',
						width : 30
					},
					{
						label : '应用分类',
						name : 'classId',
						index : 'classId',
						width : 30
					},
					{
						label : '安装时间',
						name : 'createtime',
						index : 'createtime',
						width : 30
					},
					{
						label : '操作',
						name : 'appid',
						index : 'appid',
						width : 18,
						key : true,
						formatter : function(cellValue, options,
								rowObject) {
							var actionHtml = "<a class='btn btn-primary' onclick='vm.del("
									+ cellValue
									+ ");'>&nbsp;删除</a>";
							return actionHtml;
						}
					} ],
			viewrecords : true,
			height : 500,
			rowNum : 10,
			rowList : [ 10, 30, 50 ],
			rownumWidth : 40,
			autowidth : true,
			multiselect : true,
			pager : "#jqGridPager",
			jsonReader : {
				root : "page.list",
				page : "page.currPage",
				total : "page.totalPage",
				records : "page.totalCount"
			},
			prmNames : {
				page : "page",
				rows : "limit",
				order : "order"
			},
			gridComplete : function() {
	
			}
		});
    vm.loadDevicetype();
    vm.loadClassTypeList();
	$('.form_date').datetimepicker({
		language : 'zh-CN',
		weekStart : 1,
		todayBtn : 1,
		autoclose : 1,
		todayHighlight : 1,
		startView : 2,
		minView : 2,
		forceParse : 0
	});
});

var vm = new Vue({
	el : '#rrapp',
	data : {
		showList : true,
		tbApp : {
			startlevel : 1,
			safecert : 0,
			review : 0,
			beecoin : 0,
			weicoin : 0,
			controlstyle : [],
			visualdownloadnum : 0,
			upnum : 0,
			classIds : [],
			appVersionEntity : {}
		},
		tbClass : {
			firstClassList : [],
			secondClassList : [],
			secondClassId : []
		},
		tbAppVersion : {
			upgradetype : 0,
			upgradeall : 1
		},
		queryParam : {
			customerList : [],
			deviceTypeList:[],
			classTypeList:[]
		}
	},
	methods : {
		query : function() {
			vm.reload();
		},
		excelExport : function(event) {
			var customerId = $("#customerId").val();
			var deviceType = $("#deviceType").val();
			var APKsource=$("#APKsource").val();
			var classId=$("#classId").val();
			var deviceId=$("#deviceId").val();
			var sn=$("#sn").val();
			var versionName=$("#versionName").val();
			var appName=$("#appName").val();
			var startDate=$("#startDate").val();
			var endDate=$("#endDate").val();
			window.location.href = "/appstore/stat/exportInstallLog?appName="
				+ appName
				+ "&&sn="
				+ sn
				+ "&&customerId="
				+ customerId
				+ "&&deviceType="
				+ deviceType
				+ "&&APKsource="
				+ APKsource
				+ "&&startDate="
				+ startDate
				+ "&&endDate="
				+ endDate
				+ "&&classId="
				+ classId
				+ "&&versionName" + versionName;
		},
		del : function(event) {
			var ids = getSelectedRows();
			if (ids == null) {
				return;
			}
			confirm('确定要删除选中的记录？', function() {
				$.ajax({
					type : "POST",
					url : baseURL + 'stat/delInstallLog',
					contentType : "application/json",
					data : JSON.stringify(ids),
					success : function(r) {
						if (r.code == 0) {
							alert('操作成功', function(index) {
								vm.reload();
							});
						} else {
							alert(r.msg);
						}
					}
				});
			});
		},
		reload : function(event) {
			var queryParam = {
					customerId:$("#customerId").val(),
					deviceType:$("#deviceType").val(),
					APKsource:$("#APKsource").val(),
					classId:$("#classId").val(),
					deviceId:$("#deviceId").val(),
					classId:$("#classId").val(),
					versionName:$("#versionName").val(),
					appName:$("#appName").val(),
					startDate:$("#startDate").val(),
					endDate:$("#endDate").val()
			};
			vm.showList = true;
//			var page = $("#jqGrid").jqGrid('getGridParam', 'page');
			var page = 1;
			$("#jqGrid").jqGrid('setGridParam', {
				page : page,
				postData : queryParam
			}).trigger("reloadGrid");
		},
		/**加载型号*/
		loadDevicetype: function(){
			$.get(baseURL + "devicetype/queryDeviceTypeinfo",function(r){
				var pre = "<option value='-1'>全部</option>";
				//拼接下拉菜单分组
				var groupInnner = "";
				for(var i in r.groupTypeList){
					groupInnner +="<option value = 'gp"+r.groupTypeList[i].id+"'>"+r.groupTypeList[i].groupname+"</option>";
				}
				$("#modelGroup").html(groupInnner);
				var optionhtml = pre;
		    	for(var i in r.deviceTypeList){
		    		optionhtml += '<option value="'+r.deviceTypeList[i].devicetypeid+'">'+r.deviceTypeList[i].devicetype+'</option>'
				}
		    	$("#modelSingle").html(optionhtml);
		    	$(".selectpicker" ).selectpicker('refresh');
                vm.loadCustomer();
            });
		},
		/**加载渠道*/
		loadCustomer:function(){
			var devicetypeid = $("#deviceType").val()==""?-1:$("#deviceType").val();
			$.get(baseURL + "typecustomermap/info/"+devicetypeid, function(r){
					var pre = "<option value='-1'>全部</option>";
					var optionhtml = pre;
			    	for(var i in r.customerMaps){
			    		optionhtml += '<option value="'+r.customerMaps[i].customerid+'">'+r.customerMaps[i].customername+'</option>'
					}
			    	$("#customerId").html(optionhtml);
	        });
			
		},
		devidetypeSelect: function(){
			vm.loadCustomer();
		},
		loadClassTypeList: function(){
			$.get(baseURL + "stat/queryClassTypeList",function(data){
				for (var i = 0; i < data.length; i++) {
					var classType = {};
					classType.classId = data[i].id;
					classType.className = data[i].classname;
					vm.queryParam.classTypeList.push(classType);
				}
			});
		}
	}
});
