$(function () {
	initTable();
});

//---------- 初始化列表 ---------
function initTable(){
	var classid = $('#tdclass').val();
	$("#jqGrid").jqGrid({
        url: baseURL + '/admin/tbRank/list',
        datatype: "json",
        colModel: [			
			{ label: 'ID', name: 'id', index: 'id', width: 40}, 			
			{ label: '榜单名称', name: 'name', index: 'name', width: 60}, 			
			{ label: '排序', name: 'sort', index: 'sort', width: 30,formatter:function(value,options,row){
				var html = "<input type = 'text' size = '3' value = '" + value + "' id = 'sort_"+row.id+"'></input>"
				return html;
			}}, 	
			{ label: '一级分类', name: 'firstClassName', index: 'firstClassName', width: 40},
			{ label: '二级分类', name: 'subClassName', index: 'subClassName', width: 60},
			{ label: '是否显示', name: 'display', index: 'display', width: 40,formatter:function(value,options,row){
				if(value==1){
					return "是";
				}else if (value==0) {
					return "否";
				}
			}}, 	
			{ label: '编辑时间', name: 'updateTime', index: 'updateTime', width: 60}, 	
			{ label: '操作', name: 'id', index: 'id', width: 60,formatter: function(value, options, row){
				return [
					"<button type='button' btnPermission='tbrank:update' class='btn btn-info btn-xs' onclick='update("+row.id+")'>修改</button>",
					"<button type='button' class='btn btn-info btn-xs' onclick='check("+row.id +")'>管理</button>",
					"<button type='button' btnPermission='tbrank:del' class='btn btn-danger btn-xs' onclick='del("+row.id+")'>删除</button>"
				].join('  ');
			}}			
        ],
		viewrecords: false,
        height: 450,
        rowNum: 30,
		rowList : [10,30,50],
        rownumbers: false, 
        rownumWidth: 25, 
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
        	//刷新按钮权限
        	refreshBtnPermission();
        },
        postData:{
        	'classid':classid
        }
    });
}
var vm = new Vue({
	el:'#rrank',
	data:{
		showList: true,
		title: null,
		BGPictitle:"",
		BGPicMan_showList:false,
		rank:{
			display:0,
			subClassList:[]
		}
	},
	methods: {
		query: function () {
			vm.reload();
		},
		reload: function (event) {
			var classid = $('#tdclass').val();
			vm.showList = true;
			var page = 1;
			$("#jqGrid").jqGrid('setGridParam',{
				postData:{
		        	'classid':classid
		        },
                page:page
            }).trigger("reloadGrid");
		},
		createRank:function(){
			initInfo("");
		},
		rankBGPic:function(){
            location.href = baseURL + "/admin/app/tbrank_BGPic.html";
		},
		save:function(){
			var param = vm.rank;
			var firstClass = $("#first_class").val();
            var subClass = $("#sub_class").val().join(",");

			if (param.rankName == "") {
				alert("请输入排行榜名称")
				return;
			}
			if (firstClass ==-1) {
				alert("请选择一级分类")
				return;
			}
			if (subClass == "null") {
				alert("请选择二级分类")
				return;
			}
            param.firstClass = firstClass;
            param.subClass = subClass;
			param.customerId = $("#customerId").val();
			var url = baseURL + '/admin/tbRank/save';
			if (param.id) {
				url = baseURL + '/admin/tbRank/update';
			}
			
		$.ajax({
			type:"post",
			url:url,
			data:param,
			success:function(r){
				if (r.status==0) {
					vm.reload();
				}else if (r.status==1) {
					alert(r.msg);
				} 
			},
			error:function(){
				closeLoading();
			}
		});
	},
	saveOrder:function(){
		var arr = new Array();
		$("input[id*='sort_']").each(function(){
			arr.push(this.value+"_"+this.id)
		})
		var url = baseURL + "/admin/tbRank/saveSort"
		$.get(url, {"rankSortId":arr.join(",")},function(data){
			if(data.status === 0){
				alert("修改成功");
			}else {
				alert("修改失败");
			}
			vm.reload();	//重新加载列表
		});
	}}
});

function check(id){
    location.href =  baseURL + "/admin/app/tbrankDetail.html?id="+id;
}

function update(id){
	vm.showList = false;
	vm.title = "编辑排行榜";
	initInfo(id);	
}

function initInfo(id){	
	var url = baseURL + '/admin/tbclass/listByClassLevel';
	$.get(url,{'classLevel':1},function(r){
		var content = "<option value = '-1'>全部</option>";
		for ( var i in r.data) {
			content +='<option value="'+r.data[i].classid+'">'+r.data[i].classname+'</option>';
		}
		$("#first_class").html(content);
		loadSubClass();
		if (id !=='') {
			queryRankInfo(id);
		}else {
			vm.showList = false;
			vm.title = "新建榜单";
			vm.rank.display = 1;
			vm.rank.id = "";
			vm.rank.rankName = "";
			vm.rank.rankCount = "10";
			$("#first_class").val(-1);
			$("#sub_class").val(-1);
		}
	});
}

function queryRankInfo(id){
	$.ajax({
		type: "POST",
		url: baseURL + '/admin/tbRank/rankInfo',
		data:{
			'id':id
		},
		dataType : 'json',
	    success: function(r){
	    	closeLoading();
	    	if(r.status === 0){
                vm.rank = r.rankInfo;
                vm.rank.rankName = r.rankInfo.name;
                $("#first_class").val(vm.rank.firstClass);
	    		var subClass = vm.rank.subClass;
	    		loadSubClass(subClass.split(","));	//加载二级分类
	    	}
		}
	});
}

function del(id){
	confirm('确定删除排行榜？', function(){
		loading("正在删除，请稍后...");
		$.post(baseURL + '/admin/tbRank/delete', {"id": id},
			function(r){
				closeLoading();
				if(r.status === 0){
					vm.reload();
				}
			}, "json");
	});
}

function loadSubClass(subClass){
	var url = baseURL + '/admin/tbclass/listByClassLevel';
	var param = {'classLevel':2,"parentClassId":$("#first_class").val()};
	var content = "<option value = '-1'>全部</option>"
	$.get(url,param,function(r){
		for ( var i in r.data) {
			content +='<option value="'+r.data[i].classid+'">'+r.data[i].classname+'</option>';
		};
		$("#sub_class").html(content);
		if (subClass && subClass.length!=0) {
			$("#sub_class").val(subClass);
		}
	});
}