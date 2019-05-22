var topicSel = T.p('id');
$(function () {
	skyworthbox.initApplist();
	initAlbumMapList();
    showUpdate();
    vm.loadDevicetype2();
});

function initAlbumMapList(){
	$("#appmapGrid").jqGrid({
        url: baseURL + '/admin/albumappmap/list',
        datatype: "json",
        postData:{
        	'albumid':topicSel
        },
        colModel: [
			{ label: 'appID', name: 'id', index: 'id', width: 40, key: true },
			{ label: '图片', name: 'siconpath', index: 'siconpath', width: 35,formatter: function(value, options, row){
				return "<img src='"+value+"' width='25px' height='25px'>";
			}}, 			
			{ label: '分类', name: 'classList', index: 'classList', width: 100 ,formatter: function(value, options, row){
				if(value != null && value != ''){
					var classNames = "";
					for(var o in value){
						classNames =  classNames + "|" + value[o].classname ;
					}
					classNames = classNames.substring(1);
					return classNames;
				}else{
					return '';
				}
			}},
			{ label: '名称', name: 'name', index: 'name', width: 60 },
			{ label: '排序', name: 'totalnum', index: 'totalnum', width: 40 ,formatter: function(value, options, row){
				return "<input id='"+row.id+"Sort' value='0' size='2' />";
			}},
			{ label: '虚拟下载次数', name: 'visualdownloadnum', index: 'visualdownloadnum', width: 80 },
			{ label: '发布状态', name: 'appVersionEntity', index: 'appVersionEntity', width: 60 ,formatter: function(value, options, row){
				if(value != null && value.publish != null && value.publish == 1){
					return '发布';
				}else{
					return '下架';
				}
			}},
            { label: '更新时间', name: 'updatetime', index: 'updateTime', width: 80 },
			{ label: '操作', name: 'updatetime', index: 'updateTime', width: 80,formatter: function(value, options, row){
				return [
					"<button type='button' btnPermission='album:albumappmap:save' class='btn btn-info btn-xs' onclick='vm.update("+row.id+")'>保存</button>",
					"<button type='button' btnPermission='album:albumappmap:del' class='btn btn-danger btn-xs' onclick='vm.delAppMap("+row.id+")'>删除</button>"
				].join('');
			}}
        ],
		viewrecords: true,
        height: 500,
        rowNum: 10,
		rowList : [10,30,50],
        rownumbers: false, 
        rownumWidth: 25, 
        autowidth:true,
        multiselect: true,
        pager: "#appmapGridPager",
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
        	$("#appmapGrid").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "hidden" });
        	//刷新按钮权限
        	refreshBtnPermission();
        },
        loadComplete:function(){
        	initAlbumMapSort();
        }
    });
}
function initAlbumMapSort(){
	$.ajax({
		type: "POST",
		url: baseURL + '/admin/albumappmap/listAlbumMapSort',
		data:{
			'albumid':topicSel
		},
		dataType : 'json',
	    success: function(r){
	    	if(r.status === 0){
	    		var data = r.data;
	    		for (var i = 0; i < data.length; i++) {
	    			$('#'+(data[i].appid+'Sort')).val(data[i].sort);
				}
			}
		}
	});
}

var vm = new Vue({
	el:'#rrapp',
	data:{
		showList: true,
        showUpdate:false,
		title: null,
		albumAppMap: {}
	},
	methods: {
		query: function () {
			vm.reload();
		},
		update: function (id) {
			var sort = $('#'+id+'Sort').val();
			vm.albumAppMap.sort = sort;
			vm.albumAppMap.appid = id;
			vm.albumAppMap.albumid = topicSel;
			$.ajax({
				type: "POST",
			    url: baseURL + "/admin/albumappmap/update",
        	    contentType: "application/json",
    		    data: JSON.stringify(vm.albumAppMap),
			    success: function(r){
			    	if(r.status === 0){
						alert('操作成功');
						vm.reload();
					}else{
						alert(r.msg);
					}
				}
			});
		},
		delAppMap: function (id) {
			vm.albumAppMap.appid = id;
			vm.albumAppMap.albumid = topicSel;
			confirm('确定删除专题应用？', function(){
				$.ajax({
					type: "POST",
				    url: baseURL + "/admin/albumappmap/delAppMap",
				    contentType: "application/json",
	    		    data: JSON.stringify(vm.albumAppMap),
				    success: function(r){
				    	if(r.status === 0){
							alert('操作成功',function(){
								vm.reload();
							});
						}else{
							alert(r.msg);
						}
					}
				});
			});
		},
		del: function (event) {
			confirm('确定清空专题应用？', function(){
				$.ajax({
					type: "POST",
					url: baseURL + "/admin/albumappmap/delete/"+topicSel,
					dataType : 'json',
					success: function(r){
						if(r.status === 0){
							alert('操作成功',function(){
								vm.reload();
							});
						}else{
							alert(r.msg);
						}
					}
				});
			});
		},
		clearAll:function(){
			vm.albumAppMap.albumid = topicSel;
			var id =  $("#appmapGrid").jqGrid("getGridParam","selrow");
			if (!id) {
				alert("请至少选择一条记录...");
				return;
			}
			var ids = $("#appmapGrid").jqGrid("getGridParam","selarrrow");
			confirm('确定清除所选专题应用？', function(){
				$.ajax({
					type: "POST",
					url: baseURL + "/admin/albumappmap/clearAll",
					dataType : 'json',
					data:{"album":topicSel,"ids":JSON.stringify(ids)},
					success: function(r){
						if(r.status === 0){
							alert('操作成功',function(){
								vm.reload();
							});
						}else{
							alert(r.msg);
						}
					}
				});
			});
		},
		back:function(){
			window.history.back(-1);
		},
		reload: function (event) {
			vm.showList = true;
			var page = $("#appmapGrid").jqGrid('getGridParam','page');
			$("#appmapGrid").jqGrid('setGridParam',{
				postData:{
                    'deviceTypeId':$('#devicetypeid2').val(),
                    'customerId':$('#customerid2').val(),
                    'albumid':topicSel,
                    'appName':$("#albumAppName").val()
		        },
                page:page
            }).trigger("reloadGrid");
		},
        refresh:function(){
            var url = baseURL + '/admin/albumappmap/refreshAlbumLatestApp';
            $.get(url,{"albumid":topicSel},function (r) {
                if(r.status !== 0){
                    alert("更新失败");
                }else {
                    alert("更新成功");
                    vm.reload()
                }
            })
        },
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

function add(id){
	vm.albumAppMap.sort = 0;
	vm.albumAppMap.appid = id;
	vm.albumAppMap.albumid = topicSel;
	loading("正在添加，请稍后...");
	$.ajax({
		type: "POST",
	    url: baseURL + "/admin/albumappmap/save",
	    contentType: "application/json",
	    data: JSON.stringify(vm.albumAppMap),
	    success: function(r){
	    	closeLoading();
	    	if(r.status === 0){
	    		alert('操作成功',function(){
					vm.reload();
				});
			}else{
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
	vm.albumAppMap.sort = 0;
	vm.albumAppMap.albumid = topicSel;
	var appid = $("#appJqGrid").jqGrid("getGridParam","selrow");
	if (appid == null) {
		alert("请选择需要添加的应用");
		return;
	}
	var appIds = $("#appJqGrid").jqGrid("getGridParam","selarrrow");
	var ids = JSON.stringify(appIds);
	confirm("请确认需要批量添加的应用!!!",function(){
		$.ajax({
			type:"post",
			url:baseURL + '/admin/albumappmap/saveBatch',
			dateType:"json",
			data:{"album":topicSel,"ids":ids},
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

function showUpdate() {
	//跟新功能只对zxyy 专题开放
    if (topicSel.toLowerCase() !== "zxyy"){
        return;
    }
    vm.showUpdate = true;
    initSwitch();
}

function initSwitch(){
    var url = baseURL + '/admin/albumappmap/queryAutoUpdateInfo';
    $.get(url, {"albumid": topicSel}, function (r) {
        if (r.status === 0) {
            if (r.autoUpdateInfo.autoUpdate === 1) {
                $("#autoUpdate").bootstrapSwitch('state', true);
            } else {
                $("#autoUpdate").bootstrapSwitch('state', false);
            }
            $("#autoUpdateTime").html(r.autoUpdateInfo.lastupdatetime);
        }
    });
    $("#autoUpdate").bootstrapSwitch({
        onSwitchChange : function(event, state) {
            refreshAutoUpdateState(state);
        }
    });
}

function refreshAutoUpdateState(state) {
    var autoUpdate = 0;
    if (state) {
        autoUpdate = 1;
    }
    var url = baseURL + '/admin/albumappmap/enableAutoupdate';
   	$.get(url,{"autoUpdate":autoUpdate,"albumid":topicSel},function (r) {
        if (r.status!==0) {
            alert("操作失败");
        }
   	})
}
