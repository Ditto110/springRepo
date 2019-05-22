$(function() {
	$("#jqGrid").jqGrid(
		{
			url : baseURL + 'stat/errorLogList',
			datatype : "json",
			colModel : [
					/*{
						label : '序列号sn',
						name : 'sn',
						index : 'sn',
						width : 30
					},
					{
						label : '设备ID',
						name : 'deviceid',
						index : 'deviceid',
						width : 30
					},*/
					{
						label : 'Mac地址',
						name : 'mac',
						index : 'mac',
						width : 30
					},
					{
						label : '渠道',
						name : 'customerid',
						index : 'customerid',
						width : 30
					},
					{
						label : '机型',
						name : 'devicetypeid',
						index : 'devicetypeid',
						width : 30
					},
					{
						label : '错误信息',
						name : 'errorType',
						index : 'errorType',
						width : 60
					},
					{
						label : '文件路径',
						name : 'filepath',
						index : 'filepath',
						width : 60,formatter: function(value, options,rowObject) {
							var actionHtml = "<a href = '"+value+"'>点击下载文件</a>";
							return actionHtml;
					}},
					{
						label : '时间',
						name : 'createtime',
						index : 'createtime',
						width : 30
					},
					{
						label : '操作',
						name : 'id',
						index : 'id',
						width : 18,
						key : true,
						formatter : function(cellValue, options,
								rowObject) {
							var actionHtml = "<a class='btn btn-primary' btnPermission='logError:del' onclick='vm.del("
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
				//刷新按钮权限
				refreshBtnPermission();
			}
		});
	vm.loadDevicetype();
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
			devicetypeList : [],
			customerList : [],
			devicetypeid : -1,
			customerid : -1,
			firstClassList : [],
			secondClassList : [],
			firstClassId : -1,
			secondClassId : -1,
			publish : -1
		}
	},
	methods : {
		query : function() {
			vm.reload();
		},
		excelExport : function(event) {
			var queryParam = {
					sn : $("#sn").val(),
					deviceid : $("#deviceid").val(),
					mac : $("#mac").val(),
					customerId : $("#customerId").val(),
					deviceType : $("#deviceType").val(),
					startDate : $("#startDate").val()==""?null:$("#startDate").val(),
					endDate : $("#endDate").val()==""?null:$("#endDate").val()
				};
			//前端
			var url = baseURL + 'stat/exportErrorList';
			var data = "";
			data += "Mac地址\t渠道\t机型\t错误信息\t文件路径\t时间";
			data += "\n";
			var fileName ="错误日志";
			$.get(url, queryParam, function(response) {
				var resp = response.list;
				for (var i = 0; i < resp.length; i++) {
					data += resp[i].mac + "\t";
					data += resp[i].customerid + "\t";
					data += resp[i].devicetypeid + "\t";
					data += resp[i].errorType + "\t";
					data += resp[i].filepath + "\t";
					data += resp[i].createtime + "\t";
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
					url : baseURL + 'stat/delErrorLog',
					contentType : "application/json",
					data : JSON.stringify(ids),
					success : function(r) {
						if (r.status == 0) {
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
				sn : $("#sn").val(),
				deviceid : $("#deviceid").val(),
				mac : $("#mac").val(),
				customerId : $("#customerId").val(),
				deviceType : $("#deviceType").val(),
				startDate : $("#startDate").val()==""?null:$("#startDate").val(),
				endDate : $("#endDate").val()==""?null:$("#endDate").val()
			};
			vm.showList = true;
			var page = $("#jqGrid").jqGrid('getGridParam', 'page');
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
			debugger
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
		}
	}
});
