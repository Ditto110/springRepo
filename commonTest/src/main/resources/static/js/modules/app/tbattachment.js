$(function () {
	initTable();
});

//---------- 初始化列表 ---------
function initTable(){
	var classid = $('#tdclass').val();
	$("#jqGrid").jqGrid({
        url: baseURL + '/admin/tbAttach/list',
        datatype: "json",
        colModel: [			
			{ label: 'ID', name: 'id', index: 'id', width: 80}, 			
			{ label: '名称', name: 'name', index: 'name', width: 60}, 			
			{ label: '配件code', name: 'code', index: 'code', width: 60}, 			
			{ label: '背景图片', name: 'backimage', index: 'backimage', width: 80,formatter: function(value, options, row){
				return "<img src='"+value+"' width='80px' height='50px'>";
			}}, 	
			{ label: '封面图片', name: 'image', index: 'image', width: 80,formatter: function(value, options, row){
				return "<img src='"+value+"' width='80px' height='50px'>";
			}}, 	
			{ label: '是否右侧展示', name: 'alignRight', index: 'alignRight', width: 80,formatter: function(value, options, row){
				if (value==0) {
					return "是";
				} else {
					return "否";
				}
			}}, 	
			{ label: '操作', name: 'id', index: 'id', width: 60,formatter: function(value, options, row){
				return [
					"<button type='button' btnPermission='tbattachment:view' class='btn btn-info btn-xs' onclick='check("+row.id+")'>查看</button>",
					"<button type='button' btnPermission='tbattachment:update' onclick='update("+row.id+")'>修改</button>",
					"<button type='button' btnPermission='tbattachment:del' onclick='del("+row.id+")'>删除</button>"
				].join('');
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
		attach:{}
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
		createAttach:function(){
			vm.showList = false;
			vm.title = "创建配件";
			vm.attach = {};
			vm.attach.alignRight = 1;
			vm.attach.source = 0;
			$("#attachBackimage").css("display","none");
			$("#attachimage").css("display","none");
		},
		save:function(){
			var param = {
				id:vm.attach.id,
				name:vm.attach.name,
				code:vm.attach.code,
				alignRight:vm.attach.alignRight,
				image:vm.attach.image,
				backimage:vm.attach.backimage,
			};
			if (!param.name) {
				alert("请输入配件名称")
				return;
			}else if (!param.code) {
				alert("请输入配件code")
				return;
			}else if (!param.backimage) {
				alert("请上传背景图片")
				return;
			}else if (!param.image) {
				alert("请上传封面图片")
				return;
			} 
			var url = baseURL + '/admin/tbAttach/save';
			if (param.id) {
				url = baseURL + '/admin/tbAttach/update';
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
	}}
});

function check(id){
	var url = baseURL + "/admin/app/tbattachmentDetail.html?id="+id;
	location.href = url;
}

function update(id){
	vm.showList = false;
	vm.title = "编辑配件信息";
	queryInfo(id);
}
function queryInfo(id){
	$.ajax({
		type: "POST",
		url: baseURL + '/admin/tbAttach/info',
		data:{
			'id':id
		},
		dataType : 'json',
	    success: function(r){
	    	closeLoading();
	    	if(r.status === 0){
	    		vm.attach = r.tbAttach;
	    		$("#attachimage").prop("src",vm.attach.image);
				$("#attachimage").css("display","block");
				$("#attachBackimage").prop("src",vm.attach.backimage);
				$("#attachBackimage").css("display","block");
	    	}
		}
	});
}

function del(id){
	confirm('确定删除配件？', function(){
		loading("正在删除，请稍后...");
		$.post(baseURL + '/admin/tbAttach/delete', {"id": id},
			function(r){
				closeLoading();
				if(r.status === 0){
					vm.reload();
				}
			}, "json");
	});
}
//上传封面图片
var attachImage = {
		'fileObjName':'attachImageFile', // file id
		'progressData' : 'percentage',
		'removeCompleted': true,
		'auto':true,
		'buttonCursor':'hand',
		'buttonText': '封面图片',
		//       'fileType'   : ['image/*','video/*'],
		'fileSizeLimit' : '10MB',  
		'uploadScript' : baseURL+'/file/picUpload?filename=attachImageFile',
		'onUploadComplete' : function(file, data) { 
			var jsonObj = JSON.parse(data);
			var status = jsonObj.status;
			var msg = jsonObj.msg;
			vm.attach.image = "";
			if(status == 0){
				alert('上传图片成功');
				var imgname = jsonObj.filePath;
				var imgPath = jsonObj.imgPath;
				vm.attach.image = imgname;
				vm.attach.imagePath = imgPath;
				$("#attachimage").prop("src",imgPath);
				$("#attachimage").css("display","block");
			}else if(status==1){
				alert(msg);
			}else if(status==2){
				alert(msg);
			}
		}	
};
$('#attachImageFile').uploadifive(attachImage);
var attachBackimage = {
		'fileObjName':'attachBackimageFile', // file id
		'progressData' : 'percentage',
		'removeCompleted': true,
		'auto':true,
		'buttonCursor':'hand',
		'buttonText': '背景图',
		//       'fileType'   : ['image/*','video/*'],
		'fileSizeLimit' : '10MB',  
		'uploadScript' : baseURL+'/file/picUpload?filename=attachBackimageFile',
		'onUploadComplete' : function(file, data) { 
			var jsonObj = JSON.parse(data);
			var status = jsonObj.status;
			var msg = jsonObj.msg;
			vm.attach.backimage = "";
			if(status == 0){
				alert('上传图片成功');
				var imgname = jsonObj.filePath;
				var imgPath = jsonObj.imgPath;
				vm.attach.backimage = imgname;
				$("#attachBackimage").prop("src",imgPath);
				$("#attachBackimage").css("display","block");
			}else if(status==1){
				alert(msg);
			}else if(status==2){
				alert(msg);
			}
		}	
};
$('#attachBackimageFile').uploadifive(attachBackimage);
