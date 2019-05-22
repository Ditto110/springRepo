$(function () {
    $("#jqGrid").jqGrid({
        url: baseURL + '/admin/album/list',
        datatype: "json",
        colModel: [			
			{ label: '专题ID', name: 'id', index: 'id', width: 30, key: true },
			{ label: '专题标识码', name: 'albumid', index: 'albumid', width: 50 }, 			
			{ label: '专题名称', name: 'name', index: 'name', width: 80 }, 			
			{ label: '专题合集', name: 'albumlevel', index: 'albumlevel', width: 60 ,formatter: function(value, options, row){
				return (value == 1 ? "专题合集" : "普通专题");
			}}, 			
			{ label: '专题背景图片', name: 'backimage', index: 'backimage', width: 60,formatter: function(value, options, row){
				return "<img src='"+value+"' width='80px' height='50px'>";
			}}, 			
			{ label: '专题图片', name: 'image', index: 'image', width: 60,formatter: function(value, options, row){
				return "<img src='"+value+"' width='80px' height='50px'>";
			}}, 			
			{ label: '排序', name: 'sort', index: 'sort', width: 25,formatter:function(value,options,row){
				return "<input type = 'text' id='sort"+row.id+"' value ='"+value+"' size='1'/>";
			}}, 			
			{ label: '修改时间', name: 'updatetime', index: 'updatetime', width: 80 }, 			
			{ label: '操作', name: 'createTime', index: 'createTime', width: 80,formatter: function(value, options, row){
				var btnName = '进入专辑';
				if(row.albumlevel == 1){
					btnName = '查看合集';
				}
				return [
					"<button type='button' btnPermission='album:update' class='btn btn-info btn-xs' onclick='update("+row.id+","+row.albumlevel+")'>修改</button>",
					"<button type='button' btnPermission='album:del' class='btn btn-danger btn-xs' onclick='del("+row.id+")'>删除</button>",
					"<button type='button' class='btn btn-danger btn-xs' onclick='vm.albumappmap(\""+row.albumid+"\","+row.albumlevel+")'>"+btnName+"</button>"
				].join('');
			}}			
        ],
		viewrecords: true,
        height: 450,
        rowNum: 10,
		rowList : [10,30,50],
        rownumbers: false, 
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
        	$("#jqGrid").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "hidden" }); 
        	//刷新按钮权限
        	refreshBtnPermission();
        }
    });
});

var vm = new Vue({
	el:'#rrapp',
	data:{
		showList: true,
		title: null,
		album: {},
		detail:{}
	},
	methods: {
		query: function () {
			vm.reload();
		},
		add_album: function(){
			vm.album = {};
			vm.album.albumlevel = 2;
			vm.album.source = 0;
			vm.initParent('');
			vm.title = "新增专题";
			vm.detail.name = "专题名称";
			vm.detail.code = "专题标识码";
	        $("#albumBackimage_img").prop("src","");
			$("#albumBackimage_img").css("display","none");
			$("#albumImage_img").prop("src","");
			$("#albumImage_img").css("display","none");
			$("#parentDiv").css("display","block");
			
			$("#albumImage").val("");
	        $("#albumBackimage").val("");
		},
		add_albumBox: function(){
			vm.album = {};
			vm.album.albumlevel = 1;
			vm.album.source = 0;
			vm.initParent('');
			vm.detail.name = "合集名称";
			vm.detail.code = "合集标识码";
			vm.title = "新增合集";
			$("#albumBackimage_img").prop("src","")
			$("#albumBackimage_img").css("display","none");
			$("#albumImage_img").prop("src","")
			$("#albumImage_img").css("display","none");
			$("#parentDiv").css("display","none");
			
	        $("#albumImage").val("");
	        $("#albumBackimage").val("");
		},
		saveOrUpdate: function (event) {
			var url = vm.album.id == null ? "/admin/album/save" : "/admin/album/update";
			var sort = $("#sort").val();
			vm.album.sort = sort;
			var albumImage = $('#albumImage').val();
			vm.album.image = albumImage;
			var albumBackimage = $('#albumBackimage').val();
			vm.album.backimage = albumBackimage;
			var oldAlbumid = $("#oldAlbumid").val();
			vm.album.oldAlbumid = oldAlbumid;
			var parent = $('#parent').val();
			vm.album.parentid = parent;
			var validating = vm.validating();
			if(!vm.validating()){
				return ;
			}
			$.ajax({
				type: "POST",
			    url: baseURL + url,
                contentType: "application/json",
			    data: JSON.stringify(vm.album),
			    success: function(r){
			    	if(r.status === 0){
						alert('操作成功', function(index){
							vm.reload();
						});
					}else{
						alert(r.msg);
					}
				}
			});
		},
		reload: function (id) {
			vm.showList = true;
			var page = $("#jqGrid").jqGrid('getGridParam','page');
			var albumLevel = (id=="")?$("#albumLevel").val():"";
			
			$("#jqGrid").jqGrid('setGridParam',{
				postData:{
		        	'parentid':id,
		        	'albumLevel':albumLevel
		        },
                page:page
            }).trigger("reloadGrid");
		},
		validating : function(event){
			var name = vm.album.name;
			var albumid = vm.album.albumid;
			if(typeof(name) == 'undefined' || name == ''){
				alert("专辑名称不能为空!");
				return false;
			}
			if(typeof(albumid) == 'undefined' || name == ''){
				alert("专辑标识码不能为空!");
				return false;
			}
			return true;
		},
		checkAlbuml : function(event){
			// --------- 点击checkbox事件 ---------
			var albumLevel = vm.album.albumLevel;
			if(albumLevel){
				$("#parent").val('');
				$("#parentDiv").hide(); 
			}else{
				$("#parentDiv").show();
			}
		},
		albumappmap : function(id,albumlevel){
			if(albumlevel == 1){
				vm.reload(id);
				$("#jqGrid").jqGrid("clearGridData");
			}else{
				// --------- 跳转专题应用 ---------
				var source = T.p('source');
				window.location.href = baseURL+"/admin/app/albumappmap.html?source="+source+"&id="+id;
			}
		},
		backto:function(){
			window.location.href = baseURL+"/admin/app/album.html";
		},
		saveOrder:function(){
			var albumId = $("#jqGrid").jqGrid("getGridParam","selrow");
			if (!albumId) {
				alert("请选择需要编辑的专辑");
				return;
			}
			var albumIds = $("#jqGrid").jqGrid("getGridParam","selarrrow");
			var arr = new Array();
			for ( var i in albumIds) {
				var id = albumIds[i];
				var obj = new Object();
				obj.albumId = id;
				obj.sort = $("#sort"+id).val();
				arr.push(obj);
			};
			$.get(baseURL + "/admin/album/saveSort", {"albumIds":JSON.stringify(arr)},function(data){
				if(data.status === 0){
					alert("修改成功");
				}else {
					alert("修改失败");
				}
			});
			vm.reload();	//重新加载列表
		},
		initParent : function(id){
			vm.showList = false;
			$.get(baseURL + "/admin/album/listParent", function(r){
				if(r.status === 0){
		    		var parent=$('#parent');
		    		parent.empty();
					var data = r.data;
					parent.append('<option value="">不选择</option>');
					for(var i in data){
						parent.append('<option value="'+data[i].albumid+'">'+data[i].name+'</option>');
					}
					if(id != ''){
						getInfo(id);
					}
				}else{
					alert(r.msg);
				}
		    });
		}
	}
});
function update(id,albumlevel) {
	vm.initParent(id);
	if (albumlevel==2) {
		vm.title = "修改专题";
		vm.detail.name = "专题名称";
		vm.detail.code = "专题标识码";
		
	}else if (albumlevel==1) {
		vm.title = "修改合集";
		vm.detail.name = "合集名称";
		vm.detail.code = "合集标识码";
	}
    $('#albumBackimage').val('');
    $('#albumImage').val('');
}
function getInfo(id){
	$.get(baseURL + "/admin/album/info/"+id, function(r){
        vm.album = r.album;
        $("#albumBackimage_img").prop("src",r.album.backimage)
		$("#albumBackimage_img").css("display","block");
		$("#albumImage_img").prop("src",r.album.image)
		$("#albumImage_img").css("display","block");
		$("#oldAlbumid").val(vm.album.albumid);
        if(vm.album.albumlevel == 1){
        	vm.album.albumLevel = true;
        }else{
        	vm.album.albumLevel = false;
        }
        if(vm.album.sort != null){
        	$('#sort').val(vm.album.sort);
        }
        if(vm.album.parentid != null){
        	$('#parent').val(vm.album.parentid);
        }
        vm.checkAlbuml();
    });
}
function del(id) {
	confirm('确定要删除选中的记录？', function(){
		$.ajax({
			type: "POST",
		    url: baseURL + "/admin/album/delete/"+id,
            contentType: "application/json",
		    success: function(r){
				if(r.status == 0){
					alert('操作成功', function(index){
						vm.reload();
					});
				}else{
					alert(r.msg);
				}
			}
		});
	});
}
var backimageUploadSetting = {
	'fileObjName':'backimageFile', // file id
    'progressData' : 'percentage',
    'removeCompleted': true,
    'auto':true,
    'buttonCursor':'hand',
    'buttonText': '背景图',
 //       'fileType'   : ['image/*','video/*'],
    'fileSizeLimit' : '10MB',  
    'uploadScript' : baseURL+'/file/picUpload?filename=backimageFile',
    'onUploadComplete' : function(file, data) { 
    	var jsonObj = JSON.parse(data);
    	var status = jsonObj.status;
    	var msg = jsonObj.msg;
    	if(status == 0){
    		alert('上传图片成功');
    		var filePath = jsonObj.filePath;
    		$('#albumBackimage').val(filePath);
    		var backimgPath = jsonObj.imgPath;
    		$("#albumBackimage_img").prop("src",backimgPath)
    		$("#albumBackimage_img").css("display","block");
    	}else if(status=1){
    		alert(msg);
    	}else if(status==2){
    		alert(msg);
    	}
	}
};	   
$('#backimageFile').uploadifive(backimageUploadSetting);

var imageUploadSetting = {
		'fileObjName':'imageFile', // file id
		'progressData' : 'percentage',
		'removeCompleted': true,
		'auto':true,
		'buttonCursor':'hand',
		'buttonText': '封面',
		//       'fileType'   : ['image/*','video/*'],
		'fileSizeLimit' : '10MB',  
		'uploadScript' : baseURL+'/file/picUpload?filename=imageFile',
		'onUploadComplete' : function(file, data) { 
			var jsonObj = JSON.parse(data);
			var status = jsonObj.status;
			var msg = jsonObj.msg;
			if(status == 0){
				alert('上传图片成功');
				var filePath = jsonObj.filePath;
				var imgPath = jsonObj.imgPath;
				$('#albumImage').val(filePath);
				$("#albumImage_img").prop("src",imgPath)
				$("#albumImage_img").css("display","block");
			}else if(status=1){
				alert(msg);
			}else if(status==2){
				alert(msg);
			}
		}
};	   
$('#imageFile').uploadifive(imageUploadSetting);