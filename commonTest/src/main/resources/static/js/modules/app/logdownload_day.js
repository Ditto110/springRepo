$(function() {
	$("#jqGrid").jqGrid({
		url : baseURL + 'stat/dayDownloadList',
		datatype : "json",
		colModel : [
		/* {label : '产品SN',	name : 'sn',index : 'sn',width : 30,key : true},*/ 
		{label : '应用名称',name : 'appname',index : 'appname',width : 30},
		{ label: '应用分类', name: 'classId', index: 'classId', width: 20 }, 
		{label : '渠道',name : 'customerid',index : 'customerid',width : 30}, 
		{label : '机型',name : 'devicetype',index : 'devicetype',width : 30}, 
		{label : '版本',name : 'versionname',index : 'versionname',width : 30},
		{ label: '安装类型', name: 'installType', index: 'installType', width: 20 }, 			
		{ label: '安装来源', name: 'source', index: 'source', width: 30 }, 			
		{ label: '安装方式', name: 'uses', index: 'uses', width: 25 }, 			
		{ label: '安装状态', name: 'flag', index: 'flag', width: 20 }, 			
		{ label: '安装时间', name: 'createtime', index: 'createtime', width: 40 }, 			
		{label : '下载次数 /次',name : 'countofevent',index : 'countofevent',width : 30
		} ],
		viewrecords : true,
		height : 500,
		rowNum : 10,
		rowList : [ 10, 30, 50 ],
		rownumWidth : 25,
		autowidth : true,
		multiselect : false,
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
    vm.loadSourceUses_level1();
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

var vm = new Vue(
		{
			el : '#rrapp',
			data : {
				showList : true,
				showLastVersion : true,
				showMinVersion : true,
				showMaxVersion : true,
				title : null,
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
				excelExport: function () {
					var queryParam = {
						startDate:$("#startDate").val(),
						endDate:$("#endDate").val(),
						deviceType:$("#deviceType").val(),
						customerId:$("#customerId").val(),
						classId:$("#classId").val(),
						appName:$("#appName").val(),
						versionName:$("#versionName").val(),
						installType:$("#installType").val(),
						uses:$("#uses").val(),
						source:$("#source").val(),
						flag:$("#flag").val(),
						deviceId:$("#deviceId").val()};
					//前端
					var url = baseURL + 'stat/exportDownloadDayExcel';
					var data = "";
					data += "应用名称\t应用分类\t渠道\t机型\t版本\t安装类型\t安装方式\t安装来源\t安装状态\t安装时间\t下载次数\t";
					data += "\n";
					var fileName ="下载统计";
					$.get(url, queryParam, function(response) {
						var resp = response.list;
						for (var i = 0; i < resp.length; i++) {
							data += resp[i].appname + "\t";
							data += resp[i].classId + "\t";
							data += resp[i].customerid + "\t";
							data += resp[i].devicetype + "\t";
							data += resp[i].versionname + "\t";
							data += resp[i].installType + "\t";
							data += resp[i].uses + "\t";
							data += resp[i].source + "\t";
							data += resp[i].flag + "\t";
							data += resp[i].createtime + "\t";
							data += resp[i].countofevent + "\t";
							data += "\n";
						}
						var BB = self.Blob;
						saveAs(new BB(
								[data], 
								{type : "text/plain;charset=utf8"}),fileName+".xlsx");
					});
				},
				del : function(event) {
					var ids = getSelectedRows();
					if (ids == null) {
						return;
					}
					confirm('确定要删除选中的记录？', function() {
						$.ajax({
							type : "POST",
							url : baseURL + "/admin/tbapp/delete",
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
						startDate : $("#startDate").val(),
						endDate : $("#endDate").val(),
						deviceType : $("#deviceType").val(),
						customerId : $("#customerId").val(),
						classId:$("#classId").val(),
						appName : $("#appName").val(),
						versionName : $("#versionName").val(),
						installType:$("#installType").val(),
						uses:$("#uses").val(),
						source : $("#source").val(),
						flag : $("#flag").val(),
						deviceId : $("#deviceId").val()
					};
					vm.showList = true;
					var page = 1;
//					var page = $("#jqGrid").jqGrid('getGridParam', 'page');
					$("#jqGrid").jqGrid('setGridParam', {
						page : page,
						postData : queryParam
					}).trigger("reloadGrid");
				},
				sumCount:function(){
					var queryParam = {
							startDate : $("#startDate").val(),
							endDate : $("#endDate").val(),
							deviceType : $("#deviceType").val(),
							customerId : $("#customerId").val(),
							classId:$("#classId").val(),
							appName : $("#appName").val(),
							versionName : $("#versionName").val(),
							installType:$("#installType").val(),
							uses:$("#uses").val(),
							source : $("#source").val(),
							flag : $("#flag").val(),
							deviceId : $("#deviceId").val(),
							page :0,
							limit :0
						};
					$.get(baseURL + "stat/queryDownloadSum",queryParam,function(data){
						$("#douwnloadSum").val(data.count);
					})
				},
				sumCountClear:function(){
					$("#douwnloadSum").val(0);
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
					$.get(baseURL + "/admin/tbclass/queryClassByParams",function(resp){
						var data = resp.tbClassList;
						for (var i = 0; i < data.length; i++) {
							var classType = {};
							classType.classId = data[i].id;
							classType.className = data[i].classname;
							vm.queryParam.classTypeList.push(classType);
						}
					});
				},
				loadSourceUses_level1:function(){
					$.get(baseURL + "/admin/tbappsourceusesmap/listSource",{level:1},function(data){
						var html = "<option value = '-1'>全部</option>";
						var resp = JSON.parse(data)
						for (var i = 0; i < resp.length; i++) {
							html += "<option value = '"+resp[i].mapcode+"_"+resp[i].id+"'>" + resp[i].maptype + "</option>";
						}
						$("#source").html(html);
					});
				},
				loadSourceUses_level2:function(){
					var uses = $("#source").val();
					var parentId = uses.substring(uses.lastIndexOf("_")+1);
					$.get(baseURL + "/admin/tbappsourceusesmap/listSource",{level:2,parentId:parentId},function(data){
						var html = "<option value = '-1'>全部</option>";
						var resp = JSON.parse(data)
						for (var i = 0; i < resp.length; i++) {
							html += "<option value = '"+resp[i].mapcode+"'>" + resp[i].maptype + "</option>";
						}
						$("#uses").html(html);
					});
				}
			}
		});
