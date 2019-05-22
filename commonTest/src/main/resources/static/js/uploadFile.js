
var apkUploadSetting = {
        'fileObjName':'apkFile',
        'progressData' : 'percentage',
        'removeCompleted': true,
        'auto':true,
        'buttonText': '请选择应用',
        'fileSizeLimit' : '500MB',
        'uploadScript' : '/appstore/file/uploadApk',
        'onUploadComplete' : function(file, data) {
        		//回调
        		main.appCallback(file,data);
		 },
		 'onUpload':function(file) {
			 	//0表示增加应用操作；1表示更新应用操作；2表示升级应用操作
			 	var param = {'updateType':main.updateType};
	    	  	if(main.updateType == 1 || main.updateType == 2){
		     	    param = {updateType:main.updateType,oldVersionCode:main.versioncode,oldPackageName:main.packagename};
	    	  	}
	    		$(this).data('uploadifive').settings.formData  = param;
	       }
};

/**上传应用图标*/
var iconUploadSetting = {
		//文件ID
		'fileObjName':'iconFile',
		//进度条
        'progressData' : 'percentage',
        'removeCompleted': true,
        'auto':true,
        'buttonCursor':'hand',
        'buttonText': '请选择图标',
        //文件类型
        'fileType'   : ['image/*'],
        'fileSizeLimit' : '10MB',
        'uploadScript' : '/appstore/file/uploadIcon',
        'onUploadComplete' : function(file, data) {
        	main.iconCallback(file,data);
        }
};
/**上传应用小图标*/
var siconUploadSetting = {
		//文件ID
		'fileObjName':'iconFile',
		//进度条
        'progressData' : 'percentage',
        'removeCompleted': true,
        'auto':true,
        'buttonCursor':'hand',
        'buttonText': '请选择小图标',
        //文件类型
        'fileType'   : ['image/*'],
        'fileSizeLimit' : '10MB',
        'uploadScript' : '/appstore/file/uploadIcon',
        'onUploadComplete' : function(file, data) {
        	main.siconCallback(file,data);
        }
};

/**上传应用大图标*/
var biconUploadSetting = {
		//文件ID
		'fileObjName':'iconFile',
		//进度条
        'progressData' : 'percentage',
        'removeCompleted': true,
        'auto':true,
        'buttonCursor':'hand',
        'buttonText': '请选择大图标',
        //文件类型
        'fileType'   : ['image/*'],
        'fileSizeLimit' : '10MB',
        'uploadScript' : '/appstore/file/uploadIcon',
        'onUploadComplete' : function(file, data) {
        	main.biconCallback(file,data);
        }
};

/**上传应用背景图标*/
var bgiconUploadSetting = {
		//文件ID
		'fileObjName':'iconFile',
		//进度条
        'progressData' : 'percentage',
        'removeCompleted': true,
        'auto':true,
        'buttonCursor':'hand',
        'buttonText': '请选择背景图标',
        //文件类型
        'fileType'   : ['image/*'],
        'fileSizeLimit' : '10MB',
        'uploadScript' : '/appstore/file/uploadIcon',
        'onUploadComplete' : function(file, data) {
        	main.bgiconCallback(file,data);
        }
};

/**上传应用截图*/
var preiconUploadSetting = {
		//文件ID
		'fileObjName':'iconFile',
		//进度条
        'progressData' : 'percentage',
        'removeCompleted': true,
        'auto':true,
        'buttonCursor':'hand',
        'buttonText': '请选择预览图标',
        //文件类型
        'fileType'   : ['image/*'],
        'fileSizeLimit' : '10MB',
        'uploadScript' : '/appstore/file/uploadIcon',
        'onUploadComplete' : function(file, data) {
        	main.preiconCallback(file,data);
        }
};

/**上传启动图片*/
var uiStartPictureFileUploadSetting = {
		//文件ID
		'fileObjName':'uiStartPictureFile',
		//进度条
        'progressData' : 'percentage',
        'removeCompleted': true,
        'auto':true,
        'buttonCursor':'hand',
        'buttonText': '请选择启动图片',
        //文件类型
        'fileType'   : ['image/*'],
        'fileSizeLimit' : '20MB',
        'uploadScript' : '/appstore/file/uploadUiStartPicture',
        'onUploadComplete' : function(file, data) {
        	main.uiStartPictureCallback(file,data);
        }
};
/**上传背景图片*/
var uiBackgroundFileUploadSetting = {
		//文件ID
		'fileObjName':'uiBackgroundFile',
		//进度条
        'progressData' : 'percentage',
        'removeCompleted': true,
        'auto':true,
        'buttonCursor':'hand',
        'buttonText': '请选择背景图片',
        //文件类型
        'fileType'   : ['image/*'],
        'fileSizeLimit' : '20MB',
        'uploadScript' : '/appstore/file/uploadUiBackgroundFile',
        'onUploadComplete' : function(file, data) {
        	main.uiBackgroundPictureCallback(file,data);
        }
};

/**上传焦点图片*/
var uiTitleIconFocusUploadSetting = {
		//文件ID
		'fileObjName':'uiTitleIconFocus',
		//进度条
        'progressData' : 'percentage',
        'removeCompleted': true,
        'auto':true,
        'buttonCursor':'hand',
        'buttonText': '请选择焦点图片',
        //文件类型
        'fileType'   : ['image/*'],
        'fileSizeLimit' : '10MB',
        'uploadScript' : '/appstore/file/uploadUiTitleIconFocus',
        'onUploadComplete' : function(file, data) {
        	main.uiTitleIconFocusCallback(file,data);
        }
};

/**上传无焦点图片*/
var uiTitleIconUnfocusUploadSetting = {
		//文件ID
		'fileObjName':'uiTitleIconUnfocus',
		//进度条
        'progressData' : 'percentage',
        'removeCompleted': true,
        'auto':true,
        'buttonCursor':'hand',
        'buttonText': '请选择无择焦点图片',
        //文件类型
        'fileType'   : ['image/*'],
        'fileSizeLimit' : '10MB',
        'uploadScript' : '/appstore/file/uploadUiTitleIconUnfocus',
        'onUploadComplete' : function(file, data) {
        	main.uiTitleIconUnfocusCallback(file,data);
        }
};
/**选择选中样式图片*/
var uiTitleIconSelectedUploadSetting = {
		//文件ID
		'fileObjName':'uiTitleIconSelected',
		//进度条
        'progressData' : 'percentage',
        'removeCompleted': true,
        'auto':true,
        'buttonCursor':'hand',
        'buttonText': '请选择选中样式图片',
        //文件类型
        'fileType'   : ['image/*'],
        'fileSizeLimit' : '10MB',
        'uploadScript' : '/appstore/file/uploadUiTitleIconSelected',
        'onUploadComplete' : function(file, data) {
        	main.uiTitleIconSelectedCallback(file,data);
        }
};

/**上传应用详情推荐位图片*/
var uploadRecommendImgUploadSetting = {
		//文件ID
		'fileObjName':'recommendImgFile',
		//进度条
        'progressData' : 'percentage',
        'removeCompleted': true,
        'auto':true,
        'buttonCursor':'hand',
        'buttonText': '推荐位图片',
        //文件类型
        'fileType'   : ['image/*'],
        'fileSizeLimit' : '10MB',
        'uploadScript' : '/appstore/file/uploadRecommendImgFile',
        'onUploadComplete' : function(file, data) {
        	main.uploadRecommendImgFileCallback(file,data);
        }
};

// 模板图片
var uploadCellImgUploadSetting = {
    //文件ID
    'fileObjName':'imageUrlFile',
    //进度条
    'progressData' : 'percentage',
    'removeCompleted': true,
    'auto':true,
    'buttonCursor':'hand',
    'buttonText': '背景图',
    //文件类型
    'fileType'   : ['image/*'],
    'fileSizeLimit' : '10MB',
    'uploadScript' : '/appstore/file/uploadCellImgFile',
    'onUploadComplete' : function(file, data) {
        main.uploadCellImgFileCallback(file,data);
    }
};

// 模板露头图
var uploadCellImg2UploadSetting = {
    //文件ID
    'fileObjName':'image2UrlFile',
    //进度条
    'progressData' : 'percentage',
    'removeCompleted': true,
    'auto':true,
    'buttonCursor':'hand',
    'buttonText': '露头图',
    //文件类型
    'fileType'   : ['image/*'],
    'fileSizeLimit' : '10MB',
    'uploadScript' : '/appstore/file/uploadCellImg2File',
    'onUploadComplete' : function(file, data) {
        main.uploadCellImg2FileCallback(file,data);
    }
};


// uicell 背景图
var uploadCellBackgroundUrlUploadSetting = {
    //文件ID
    'fileObjName':'backgroundUrlFile',
    //进度条
    'progressData' : 'percentage',
    'removeCompleted': true,
    'auto':true,
    'buttonCursor':'hand',
    'buttonText': '配件海报图',
    //文件类型
    'fileType'   : ['image/*'],
    'fileSizeLimit' : '10MB',
    'uploadScript' : '/appstore/file/uploadCellBackgroundFile',
    'onUploadComplete' : function(file, data) {
        main.uploadCellBackgroundUrlFileCallback(file,data);
    }
};


