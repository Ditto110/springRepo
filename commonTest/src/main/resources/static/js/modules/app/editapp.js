$(function(){

    $("#allTagsId").on("change","input",function(){
        var tagsArray = vm.tagSelected.split(",");
        if (this.checked){
            tagsArray.push(this.value)
        } else {
            var tIndex = tagsArray.indexOf(this.value);
            tagsArray.splice(tIndex,1);
        }
        if (tagsArray.join(",").startsWith(",")){
            vm.tagSelected = tagsArray.join(",").substr(1);
        } else {
            vm.tagSelected = tagsArray.join(",")
        }
    })

})
var vm = new Vue({
	el:'#rrapp',
	data:{
		showList: true,
		showLastVersion:true,
		showMinVersion:true,
		showMaxVersion:true,
		title: null,
        tagSelected:"",
        tagSearchKey:"",
		tbApp: {
			startlevel:1,
            autoUpdate:1,
			safecert:0,
			review:0,
			beecoin:0,
			weicoin:0,
			visualdownloadnum:0,
			upnum:0,
			classIds:[],
			appVersionEntity:{},
			tag:""
		},
		tbClass:{
			firstClassList:[],
			secondClassList:[],
			secondClassId:[],
			firstClassId:-1
		},
		tbAppVersion: {
			upgradetype:0,
			upgradeall:1
		},
		other:{
			controlstyle:[]
		}
	},
	methods: {
		//应用添加
		add: function(){
			queryVM.showList =false;
			vm.showList = false;
			vm.showLastVersion = true;
			vm.showMinVersion = true;
			vm.showMaxVersion = true;
			vm.title = "新增";
			main.updateType = 0;
			vm.tbApp = {
				startlevel:1,
                autoUpdate:1,
				safecert:0,
				review:0,
				beecoin:0,
				weicoin:0,
				visualdownloadnum:0,
				upnum:0,
				classIds:[],
				appVersionEntity:{},
				tag:""
			};
			vm.tbClass={
				firstClassList:[],
				secondClassList:[],
				secondClassId:[],
				firstClassId:-1
				
			};
			vm.tbAppVersion={
				upgradetype:0,
				upgradeall:1
			};
			vm.other={
					controlstyle:[]
			};
			$("#apkName").text("");
			$("#iconSrc").hide();
			$("#iconSrc").attr("src","");
			$("#siconSrc").hide();
			$("#siconSrc").attr("src","");
			$("#biconSrc").hide();
			$("#biconSrc").attr("src","");
			$("#bgiconSrc").hide();
			$("#bgiconSrc").attr("src","");
			$("#preiconUL").empty();
			vm.loadFirstClass();
		},
        addTags:function(){
            $('#tagModal').modal('show');
            vm.tagSearchKey = "";
            vm.initTagsForModel();
		},
		//应用修改
		update: function (id) {
			queryVM.showList =false;
			vm.showList = false;
			vm.showLastVersion = true;
            vm.title = "修改";
            main.updateType = 1;
            vm.getInfo(id,0);
            vm.loadFirstClass();
		},
		//应用升级
		upgrade: function (id) {
			main.updateType = 2;
			queryVM.showList =false;
			vm.showList = false;
			vm.showLastVersion = false;
            vm.title = "升级";
            vm.getInfo(id,0);
            vm.loadFirstClass();
		},
		//老版本应用修改
		updateOldApp: function (id,versionId) {
			vm.showList = false;
			vm.showLastVersion = true;
            vm.title = "修改";
            main.updateType = 1;
            vm.getInfo(id,versionId);
            vm.loadFirstClass();
		},
		saveOrUpdate: function () {
			if(vm.tbAppVersion.apkpath == "" || vm.tbAppVersion.apkpath == null || vm.tbAppVersion.apkpath == undefined){
				alert("请上传APK应用");
				return ;
			}
			if(vm.tbApp.name == "" || vm.tbApp.name == null){
				alert("请填写应用名称");
				return;
			}
			if(vm.tbClass.secondClassId.length == 0){
				alert("请选择应用二级分类");
				return;
			}
			if(vm.tbClass.firstClassId == -1){
				alert("请选择应用一级分类");
				return;
			}
			if(vm.tbAppVersion.upgradeall == 0 && !isUnsignedNumeric(vm.tbAppVersion.minversion)){
				alert("请填写最低升级版本号");
				return;
			}
			if(vm.tbAppVersion.upgradeall == 0 && !isUnsignedNumeric(vm.tbAppVersion.maxversion)){
				alert("请填写最高升级版本号");
				return;
			}
			if(vm.tbAppVersion.upgradeall == 0 && vm.tbAppVersion.minversion > vm.tbAppVersion.maxversion){
				alert("最低版本号不能大于最高版本号");
				return;
			}
			if(!isUnsignedNumeric(vm.tbApp.beecoin)){
				alert("蜜币必须为整数");
				return;
			}
			if(!isUnsignedNumeric(vm.tbApp.weicoin)){
				alert("维币必须为整数");
				return;
			}
			if(!isUnsignedNumeric(vm.tbApp.visualdownloadnum)){
				alert("虚拟次数必须为整数");
				return;
			}
			loading("加载中，请稍后...");
			vm.tbApp.classIds = [];
			vm.tbApp.classIds = vm.tbClass.secondClassId;
			vm.tbApp.classIds.push(vm.tbClass.firstClassId);
			var controlstyle = vm.other.controlstyle;
			vm.tbApp.controlstyle = controlstyle.toString();
			main.saveOrder();
			if(main.preiconPaths.length > 0){
				vm.tbApp.preiconPaths = main.preiconPaths;
			}
			vm.tbApp.appVersionEntity = vm.tbAppVersion;
			var url = "/admin/tbapp/save";
			if(main.updateType == 1){
				url = "/admin/tbapp/update";
			}else if(main.updateType == 2){
				url = "/admin/tbapp/upgrade";
			}
			$.ajax({
				type: "POST",
			    url: baseURL + url,
                contentType: "application/json",
			    data: JSON.stringify(vm.tbApp),
			    success: function(r){
			    	if(r.status === 0){
						alert(r.msg, function(index){
							closeLoading();
							queryVM.reload();
						});
					}else{
						alert(r.msg, function(index){
							closeLoading();
						});
						
					}
				},
				error : function(r) {
					alert(r.msg, function(index){
						closeLoading();
					});
				}
			});
		},
        saveTags:function(){
			if (vm.tagSelected.startsWith(",")){
                vm.tbApp.tag = vm.tagSelected.substr(1);
            }else {
                vm.tbApp.tag = vm.tagSelected;
			}
		},
		//应用删除
		delMulti:function(){
			var ids = getSelectedRows();
			if(ids == null){
				return ;
			}
			vm.del(ids);
		},
		del: function (ids) {
			confirm('确定要删除选中的记录？', function(){
				$.ajax({
					type: "POST",
				    url: baseURL + "/admin/tbapp/delete",
                    contentType: "application/json",
				    data: JSON.stringify(ids),
				    success: function(r){
						if(r.code == 0){
							alert('删除成功', function(index){
								queryVM.reload();
							});
						}else{
							alert(r.msg);
						}
					}
				});
			});
		},
		//获取历史版本
		listOldAppVersion: function (appid,appversionid) {
			window.location.href = baseURL + "/admin/app/oldappversion.html?appversionid="+appversionid+"&appid="+appid;
		},
		getInfo: function(id,versionId){
			$.ajax({
				type: "POST",
			    url: baseURL + "/admin/tbapp/info",
			    data: {"id":id,"versionId":versionId},
			    async:false, 
			    success: function(r){
			    	vm.tbApp = r.tbApp;
	                //应用操作方式
	                var controlstyles = vm.tbApp.controlstyle;
	                var controlstyleArr = controlstyles.split(",");
	                var arr = new Array();
	                for(var i in controlstyleArr){
	                	arr.push(controlstyleArr[i]);
	                }
	                vm.other.controlstyle = arr;
	                main.packagename = r.tbApp.packagename;
	                main.versioncode = r.appVersionEntity.versioncode;
	                vm.upgradeallStatus(r.appVersionEntity.upgradeall);
	                vm.tbAppVersion = r.appVersionEntity;
	                //升级
	                if(main.updateType == 2){
	                	$("#lastversion").val(r.appVersionEntity.versionname);
	                	vm.tbApp.packagename = "";
	                    vm.tbApp.minsdkversion = "";
	                    vm.tbAppVersion.versioncode = "";
	                    vm.tbAppVersion.versionname = "";
	                    vm.tbAppVersion.apkpath = "";
	                    $("#apkName").text("");
	                }else{ //更新
	                    $("#apkName").text(r.appVersionEntity.apkname);
	                }
	                
	                //应用类型
	                vm.tbClass.firstClassId=r.firstClassId;
	                vm.tbClass.secondClassId=r.secondClassId;
	                //图标
	                $("#iconSrc").show();
	                $("#iconSrc").attr("src",baseURL + '/file/download?fullPath='+vm.tbApp.iconpath);

	                //大小图片展示
	                $("#siconSrc").show();
	                $("#siconSrc").attr("src",baseURL + '/file/download?fullPath='+vm.tbApp.siconpath);

	                $("#biconSrc").show();
	                $("#biconSrc").attr("src",baseURL + '/file/download?fullPath='+vm.tbApp.biconpath);

	                $("#bgiconSrc").show();
	                $("#bgiconSrc").attr("src",baseURL + '/file/download?fullPath='+vm.tbApp.bgiconpath);

	                
	                //应用截图展示
	                $("#preiconUL").empty();
	                var preiconHtml = "";
	                var preiconList = r.preiconList;
	                for(var i in preiconList){
	                	var id = preiconList[i].id;
	                	var filePath = preiconList[i].picture;
	                	preiconHtml += "<li style='float:left;' id='preicon_"+id+"'><a href='#' title='拖动图片排序' style='cursor: pointer;' >"
	                			    +"<img class='preiconClass' preiconPath='"+filePath+"' src='"+baseURL + "/file/download?fullPath="+filePath+"' width='80' height='60'/></a> " 
			 						+"<br/><br/><input type='button' onclick='javascript:main.removePreicon("+id+")' class='btn btn-danger btn-xs' value='删除'/></li>";
	                }
	                $("#preiconUL").append(preiconHtml);
				}
			});
			
		},
		/**加载一级分类*/
		loadFirstClass: function(){
			vm.tbClass.firstClassList = [];
			$.ajax({
				type: "POST",
			    url: baseURL + "/admin/tbclass/queryClassByParams",
			    datatype: "json",
			    data: {classlevel:1},
			    async:false, 
			    success: function(r){
			    	for(var i in r.tbClassList){
						var firstClass = {};
						firstClass.classId = r.tbClassList[i].id;
						firstClass.className = r.tbClassList[i].classname;
						vm.tbClass.firstClassList.push(firstClass);
					}
	                vm.loadSecondClass();
			    }
			});
		},
		/**加载二级分类*/
		loadSecondClass: function(){
			var	parentclassid = vm.tbClass.firstClassId;
			vm.tbClass.secondClassList = [];
			$.ajax({
				type: "POST",
			    url: baseURL + "/admin/tbclass/queryClassByParams",
			    datatype: "json",
			    data: {parentclassid:parentclassid,classlevel:2},
			    async:false, 
			    success: function(r){
			    	for(var i in r.tbClassList){
						var secondClass = {};
						secondClass.classId = r.tbClassList[i].id;
						secondClass.className = r.tbClassList[i].classname;
						vm.tbClass.secondClassList.push(secondClass);
					}
			    }
			});
		},
		upgradeallSelect: function(event){
			var value = event.target.value;
			vm.upgradeallStatus(value);
		},
		upgradeallStatus:function(value){
			if(value==0){
				vm.showMinVersion = false;
				vm.showMaxVersion = false;
			}else{
				vm.showMinVersion = true;
				vm.showMaxVersion = true;
			}
		},
		firstClassIdSelect :function(){
			vm.loadSecondClass();
		},
		queryFirstClassIdSelect :function(){
			vm.loadSecondClass();
		},
		/**批量上架*/
		batchPublish:function(){
			var ids = getSelectedRows();
			if(ids == null){
				return ;
			}
			confirm('确定要发布选中的应用？', function(){
				$.ajax({
					type: "POST",
				    url: baseURL + "/admin/tbapp/batchPublish",
                    contentType: "application/json",
				    data: JSON.stringify(ids),
				    success: function(r){
						if(r.code == 0){
							alert(r.msg, function(index){
								queryVM.reload();
							});
						}else{
							alert(r.msg);
						}
					}
				});
			});
		},
		/**批量下架*/
		batchUnpublish:function(){
			var ids = getSelectedRows();
			if(ids == null){
				return ;
			}
			confirm('确定要下架选中的应用？', function(){
				$.ajax({
					type: "POST",
				    url: baseURL + "/admin/tbapp/batchUnpublish",
                    contentType: "application/json",
				    data: JSON.stringify(ids),
				    success: function(r){
						if(r.code == 0){
							alert(r.msg, function(index){
								queryVM.reload();
							});
						}else{
							alert(r.msg);
						}
					}
				});
			});
		},
        initTagsForModel:function(){
            //初始化弹框中的标签列表
            var tagSearchKey = vm.tagSearchKey;
            $.ajax({
                type: "get",
                async: false,
                data: {name: tagSearchKey},
                url: baseURL + "/admin/tag/listForModel",
                success: function (r) {
                    if (r.status != "0") {
                        alert("获取标签数据失败.")
                    } else {
                        var tagList = r.tagList;
                        var length = tagList.length;
                        var html = "<tr>"
                        for (var i = 0; i < length; i++) {
                            var tag = tagList[i];
                            html += "<td style=\"width: 110px\"><input type=\"checkbox\" id=\""+tag.id+"\" class=\"allTags\" value=\""+tag.name+"\" tagId = \"1\"/><label for=\""+tag.id+"\">"+tag.name+"</label></td>"
                            if ((i + 1) % 5 == 0) {
                                html += "</tr><tr>"
                            }
                        }
                        html += "</tr>"
                        $("#allTagsId").html(html);
                    }
                }
            });
			//初始化标签列表的状态
            var tagsArray = vm.tbApp.tag.split(",");
            vm.tagSelected = tagsArray.join(",");
            var allTags = $(".allTags");
            $.each(allTags,function () {
                var tag = this;
                $.each(tagsArray,function () {
                    if ( tag.value == this) {
                        tag.checked = true;
                        return false;
                    }else {
                        tag.checked = false;
                    }
                })
            })
        }
	}
});

var main = {
		updateType: 0, //0表示增加应用操作；1表示更新应用操作；2表示升级应用操作
		packagename:"",
		versioncode:"",
		preiconPaths : {},
		init: function(){
			$('.form_date').datetimepicker({
		        language:  'zh-CN',
		        weekStart: 1,
		        todayBtn:  1,
		    	autoclose: 1,
		    	todayHighlight: 1,
		    	startView: 2,
		    	minView: 2,
		    	forceParse: 0
		    });
			//文件初始化
		    $('#apkFile').uploadifive(apkUploadSetting);
		    $('#iconFile').uploadifive(iconUploadSetting);
		    $('#siconFile').uploadifive(siconUploadSetting);
		    $('#biconFile').uploadifive(biconUploadSetting);
		    $('#bgiconFile').uploadifive(bgiconUploadSetting);
		    $('#preiconFile').uploadifive(preiconUploadSetting);
		    //图片拖拽
		    $("#preiconUL").dragsort({ dragSelector: "li", dragBetween: true, dragEnd: main.saveOrder, placeHolderTemplate: "<li></li>" });
		},
		appCallback : function(file,data){
			var jsonObj = JSON.parse(data);
	   		 var status = jsonObj.status;
	   		 var msg = jsonObj.msg;
	   		 if(status == 0){
	   			 	var fileName = file.name;
	   			 	alert('应用：' + fileName + '上传成功');
	   				var filePath = jsonObj.filePath;
	   				vm.tbAppVersion.apkpath = filePath;
	   				$("#apkName").text(fileName);
	   				vm.tbApp.packagename = jsonObj.packageName;
	   				vm.tbAppVersion.versioncode =  jsonObj.versionCode;
	   				vm.tbAppVersion.versionname = jsonObj.versionName;
	   				vm.tbApp.minsdkversion = jsonObj.minSdkVersion;
	   				$("#packageName").val(jsonObj.packageName);
	   				$("#versionCode").val(jsonObj.versionCode);
	   				$("#versionName").val(jsonObj.versionName);
	   				$("#minSdkVersion").val(jsonObj.minSdkVersion);
	   		 }else if(status=1){
	   			 alert(msg);
	   		 }else if(status==2){
	   			 alert(msg);
	   		 }
		},
		iconCallback : function(file,data){
			var jsonObj = JSON.parse(data);
	   		 var status = jsonObj.status;
	   		 var msg = jsonObj.msg;
	   		 if(status == 0){
	   			 	var fileName = file.name;
	   			 	var filePath = jsonObj.filePath;
	   			 	vm.tbApp.iconpath = filePath;
	   			 	$("#iconSrc").attr("src",baseURL + '/file/download?fullPath='+filePath);
	   			 	$("#iconSrc").css("display","block");
	   			 	alert('图片：' + fileName + '上传成功');
	   		 }else if(status=1){
	   			 alert(msg);
	   		 }else if(status==2){
	   			 alert(msg);
	   		 }
		},
		siconCallback : function(file,data){
			var jsonObj = JSON.parse(data);
	   		 var status = jsonObj.status;
	   		 var msg = jsonObj.msg;
	   		 if(status == 0){
	   			 	var fileName = file.name;
	   			 	var filePath = jsonObj.filePath;
	   			 	vm.tbApp.siconpath = filePath;
	   			 	$("#siconSrc").attr("src",baseURL + '/file/download?fullPath='+filePath);
	   			 	$("#siconSrc").css("display","block");
	   			 	alert('图片：' + fileName + '上传成功');
	   		 }else if(status=1){
	   			 alert(msg);
	   		 }else if(status==2){
	   			 alert(msg);
	   		 }
		},
		biconCallback : function(file,data){
			var jsonObj = JSON.parse(data);
	   		 var status = jsonObj.status;
	   		 var msg = jsonObj.msg;
	   		 if(status == 0){
	   			 	var fileName = file.name;
	   			 	var filePath = jsonObj.filePath;
	   			 	vm.tbApp.biconpath = filePath;
	   			 	$("#biconSrc").attr("src",baseURL + '/file/download?fullPath='+filePath);
	   			 	$("#biconSrc").css("display","block");
	   			 	alert('图片：' + fileName + '上传成功');
	   		 }else if(status=1){
	   			 alert(msg);
	   		 }else if(status==2){
	   			 alert(msg);
	   		 }
		},
		bgiconCallback : function(file,data){
			var jsonObj = JSON.parse(data);
	   		 var status = jsonObj.status;
	   		 var msg = jsonObj.msg;
	   		 if(status == 0){
	   			 	var fileName = file.name;
	   			 	var filePath = jsonObj.filePath;
	   			 	vm.tbApp.bgiconpath = filePath;
	   			 	$("#bgiconSrc").attr("src",baseURL + '/file/download?fullPath='+filePath);
	   			 	$("#bgiconSrc").css("display","block");
	   			 	alert('图片：' + fileName + '上传成功');
	   		 }else if(status=1){
	   			 alert(msg);
	   		 }else if(status==2){
	   			 alert(msg);
	   		 }
		},
		preiconCallback : function(file,data){
			var jsonObj = JSON.parse(data);
	   		 var status = jsonObj.status;
	   		 var msg = jsonObj.msg;
	   		 if(status == 0){
	   			 	var fileName = file.name;
	   			 	var filePath = jsonObj.filePath;
	   			 	var time = Math.uuidFast();
	   			 	console.log("time:"+time);
	   			 	var img = "<li style='float:left;' id='preicon_"+time+"'><a href='#' title='拖动图片排序' style='cursor: pointer;' >"
	   			 			+"<img class='preiconClass' preiconPath='"+filePath+"' src='"+baseURL + "/file/download?fullPath="+filePath+"' width='80' height='60'/></a>" 
	   			 			+"<br/><br/><input type='button' onclick='javascript:main.removePreicon(\""+time+"\")' class='btn btn-danger btn-xs' value='删除'></li>";   
	   			 	$("#preiconUL").append(img);
	   			 	alert('图片：' + fileName + '上传成功');
	   			 	main.saveOrder();
	   		 }else if(status=1){
	   			 alert(msg);
	   		 }else if(status==2){
	   			 alert(msg);
	   		 }
		},
		removePreicon:function (id){
			 confirm("确定是否删除？",function(){
				   $("#preicon_"+id).remove();
				   alert("删除成功！");
			 });
		},
		removeicon:function (){
			 confirm("确定是否删除？",function(){
				   $("#iconSrc").attr("src","");
				   $("#iconSrc").css("display","none");
				   vm.tbApp.iconpath = "";
				   alert("删除成功！");
			 });
		},
		removeSicon:function (){
			 confirm("确定是否删除？",function(){
				   $("#siconSrc").attr("src","");
				   $("#siconSrc").css("display","none");
				   vm.tbApp.siconpath = "";
				   alert("删除成功！");
			 });
		},
		removeBicon:function (){
			 confirm("确定是否删除？",function(){
				   $("#biconSrc").attr("src","");
				   $("#biconSrc").css("display","none");
				   vm.tbApp.biconpath = "";
				   alert("删除成功！");
			 });
		},
		removeBgicon:function (){
			 confirm("确定是否删除？",function(){
				   $("#bgiconSrc").attr("src","");
				   $("#bgiconSrc").css("display","none");
				   vm.tbApp.bgiconpath = "";
				   alert("删除成功！");
			 });
		},
		/**应用截图拖拽排序*/ 
		saveOrder: function () {
			 main.preiconPaths = [];
		     $(".preiconClass").each(function(){
		    	 var preiconPath = $(this).attr("preiconPath");
		    	 main.preiconPaths.push(preiconPath);
		     });
		 },

};
