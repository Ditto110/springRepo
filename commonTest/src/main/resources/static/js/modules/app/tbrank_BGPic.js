$(function () {
	initTable();
});
//---------- 初始化列表 ---------
function initTable(){
	$("#jqGrid").jqGrid({
        url: baseURL + 'admin/tbrankbg/list',
        datatype: "json",
        colModel: [			
			{ label: 'ID', name: 'id', index: 'id', width: 40}, 			
			{ label: '图片路径', name: 'path', index: 'path', width: 60,formatter:function(value,options,row){
				var img = "<img src='"+value+"' width='60px' height= '60px'>"
				return img;
			}}, 			
			{ label: '编辑时间', name: 'updatetime', index: 'updatetime', width: 60}, 	
			{ label: '操作', name: 'id', index: 'id', width: 60,formatter: function(value, options, row){
				return [
					"<button type='button' btnPermission='tbrank:tbrank_BGPic:update' class='btn btn-info btn-xs' onclick='update("+row.id+")'>修改</button>",
					"<button type='button' btnPermission='tbrank:tbrank_BGPic:del' class='btn btn-danger btn-xs' onclick='del("+row.id+")'>删除</button>"
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
        }
    });
}
var vm = new Vue({
	el:'#rrank',
	data:{
		showList: true,
		title: null,
		BGPic:{
			source:0,
			path:""
		}
	},
	methods: {
		query: function () {
			vm.reload();
		},
		reload: function (event) {
			vm.showList = true;
			var page = 1;
			$("#jqGrid").jqGrid('setGridParam',{
				postData:{},
                page:page
            }).trigger("reloadGrid");
		},
		addBGPic:function(){
			vm.showList = false;
			vm.title = "增加背景图片";
			vm.BGPic.path = "";
			vm.BGPic.id = null;
			$("#rankBackimage_img").prop("src","");
			$("#rankBackimage_img").css("display","none");
		},
		saveOrUpdate:function(){
			var param = vm.BGPic;
			if (!param.path) {
				alert("请上传排行榜背景图")
				return;
			}
			var url = baseURL;
			if (param.id != null) {
				url += "/admin/tbrankbg/update";
			} else {
				url += "/admin/tbrankbg/save";
			};
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
		
		back:function(){
			var url = baseURL + "/admin/app/tbrank.html";
			location.href = url; 
		}}
});
function update(id){
	vm.showList = false;
	vm.title = "排行榜背景图";
	$.ajax({
		type:"get",
		url:baseURL + "admin/tbrankbg/info/"+id,
		success:function(data){
			if (data.status==0) {
				var imgPath = data.tbRankBg.path;
				vm.BGPic = data.tbRankBg;
				$("#rankBackimage_img").attr("src",imgPath);
				$("#rankBackimage_img").css("display","block");
			}
		}
	})
}

function del(id){
	confirm('确定删除此背景图?', function(){
		loading("正在删除，请稍后...");
		$.post(baseURL + '/admin/tbrankbg/delete/'+id,
			function(r){
				closeLoading();
				if(r.status === 0){
					vm.reload();
				}
			}, "json");
	});
}

var rankBGPic = {
		'fileObjName':'rankBGPic', // file id
		'progressData' : 'percentage',
		'removeCompleted': true,
		'auto':true,
		'buttonCursor':'hand',
		'buttonText': '排行榜背景图',
		//       'fileType'   : ['image/*','video/*'],
		'fileSizeLimit' : '10MB',  
		'uploadScript' : baseURL+'/file/picUpload?filename=rankBGPic',
		'onUploadComplete' : function(file, data) { 
			var jsonObj = JSON.parse(data);
			var status = jsonObj.status;
			var msg = jsonObj.msg;
			if(status == 0){
				alert('上传图片成功');
				var filePath = jsonObj.filePath;
				var imgPath = jsonObj.imgPath;
				vm.BGPic.path = filePath;
				$('#rankBackimage').val(filePath);
				$("#rankBackimage_img").attr("src",imgPath);
				$("#rankBackimage_img").css("display","block");
			}else if(status==1){
				alert(msg);
			}else if(status==2){
				alert(msg);
			}
		}	
};
$('#rankBGPic').uploadifive(rankBGPic);
