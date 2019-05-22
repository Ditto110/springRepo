$(function () {
	initTable();
});
function initTable(){
	$("#jqGrid").jqGrid({
        url: baseURL + '/admin/tag/list',
        datatype: "json",
        colModel: [			
			{ label: '序号', name: 'id', index: 'id', width: 40},
			{ label: '标签名称', name: 'name', index: 'name', width: 60},
			{ label: '关联应用数', name: 'appCount', index: 'appCount', width: 60},
			{ label: '搜索推荐', name: 'isSearchRecommend', index: 'isSearchRecommend', width: 60,formatter:function(value,options,row){
				if(value==1){
					return "是(" + row.recommendSort + ")";
				}else if (value==0) {
					return "否";
				}
			}}, 	
			{ label: '编辑时间', name: 'updateTime', index: 'updateTime', width: 60,formatter:function(value,options,row){
				return (moment(value)).format("YYYY-MM-DD HH:mm:ss");
				}},
			{ label: '操作', name: 'id', index: 'id', width: 60,formatter: function(value, options, row){
				return [
					"<button type='button' btnPermission='tbrank:update' class='btn btn-info btn-xs' onclick='vm.update("+row.id+")'>编辑</button>",
					"<button type='button' class='btn btn-info btn-xs' onclick='vm.viewTagApps("+row.id+")'>查看应用</button>",
					"<button type='button' btnPermission='tbrank:del' class='btn btn-danger btn-xs' onclick='vm.del("+row.id+")'>删除</button>"
				].join('  ');
			}}			
        ],
		viewrecords: true,
        height: 450,
        rowNum: 10,
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
        	$("#jqGrid").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "hidden" });
        	//刷新按钮权限
        	// refreshBtnPermission();
        }
    });
}
var vm = new Vue({
	el:'#tag',
	data:{
		showList: true,
		title: null,
        recommendSortShow:false,
		tag:{}
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
        addTag:function(){
            vm.initInfo();
		},
        addTagBatch:function(){
		},
		update:function(id){
            vm.initInfo(id);
		},
		save:function(){
			/*if (!vm.tag.tagCode) {
				alert("请输入标签Code")
				return;
			}*/
			if (!vm.tag.name) {
				alert("请输入标签名称")
				return;
			}
			var url = baseURL + '/admin/tag/save';
			if (vm.tag.id) {
				url = baseURL + '/admin/tag/update';
                vm.tag.updateTime = new Date();
			}
		$.ajax({
			type:"post",
			url:url,
			data:vm.tag,
			success:function(r){
				if (r.status==0) {
					alert("操作成功")
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
	initInfo:function (id) {
        vm.showList = false;
        vm.recommendSortShow = false;
        if (!id){
                vm.title = "新建标签";
            	vm.tag = {};
                vm.tag.isSearchRecommend = 0;
            }else {
        		vm.title = "编辑标签";
            	vm.getInfo(id)

			}
     },
	showRecommendSort:function () {
		if (vm.tag.isSearchRecommend == 1){
            vm.recommendSortShow = true;
        }else {
            vm.recommendSortShow = false;
		}
    },
    viewTagApps:function(id){
            var url = baseURL + "/admin/app/tbTagAppDetail.html?id="+id;
            location.href = url;
     },
	del:function(id){
		confirm('确定删除标签？', function(){
			loading("正在删除，请稍后...");
			$.post(baseURL + '/admin/tag/delete', {"id": id},
				function(r){
					closeLoading();
					if(r.status === 0){
						vm.reload();
					}
				}, "json");
		});
	},
	getInfo:function(id){
        var url = baseURL + '/admin/tag/info/' + id;
		$.ajax({
			type:"get",
			url:url,
			success:function(r){
                if(r.status === 0){
                    vm.tag = r.tag;
                    if (vm.tag.isSearchRecommend == 1){
                        vm.recommendSortShow = true;
                    }else {
                        vm.recommendSortShow = false;
                    }
                }
			}
		})
	}
}});
