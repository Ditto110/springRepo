var vm = new Vue({
    el: '#editCellContentForm',
    data: {
        id: null,
        ui_cell: {},
        templateId: "",
        templateName: null,
        optionalTemplateId: "",
        parametersItems: [],
        items: [],
        chooseApp: false,
        chooseAction: false,
        chooseBroadcast: false,
        chooseUrl: false,
        chooseInstall: false
    },
    methods: {
        addSpareCells: function () {

            layer.open({
                type: 2,
                title: '原子替换项',
                shadeClose: true,
                shade: 0.8,
                area: ['90%', '90%'],
                content: '/appstore/admin/app/sparecells.html?id=' + vm.ui_cell.id + '&titleid=' + vm.ui_cell.titleid
            });

        },
        initParamter: function () {

            vm.initIntentType();
            vm.ui_cell.intentType = null;
            vm.ui_cell.packageName = null;
            vm.ui_cell.className = null;
            vm.ui_cell.action = null;
            vm.ui_cell.uriString = null;
            vm.ui_cell.parameters = null;
            vm.ui_cell.appid = null;
            vm.ui_cell.apkPackageName = null;
            vm.ui_cell.apkVersionName = null;
            vm.ui_cell.apkVersionCode = null;
            vm.ui_cell.apkcdnUrl = null;
            vm.ui_cell.apkSize = null;
            vm.ui_cell.apkName = null;
            vm.ui_cell.apkMd5 = null;
            vm.ui_cell.apkSmallIconPath = null;
            vm.ui_cell.apkBigIconPath = null;

            vm.ui_cell.apkWeiPoint = null;
            vm.ui_cell.apkFileName = null;
            
            $("#apkSmallIconSrc").removeAttr("src");
            $("#apkSmallIconSrc").css("display", "none");

            $("#apkBigIconSrc").removeAttr("src");
            $("#apkBigIconSrc").css("display", "none");

        },
        initIntentType: function () {
            vm.chooseApp = false;
            vm.chooseAction = false;
            vm.chooseBroadcast = false;
            vm.chooseUrl = false;
            vm.chooseInstall = false;
            vm.ui_cell.intentType = null;
        },
        addParameters: function () {

            vm.items.push({
                key: '',
                value: ''
            });

        },
        removeParameters: function (index) {
            vm.items.splice(index, 1);
        },
        selectTemplate: function () {
            // 清除原来参数
            vm.initParamter();
            var templateid = vm.templateId;
            if (templateid != "" && templateid != null) {

                $.ajax({
                    url: baseURL + "uiparameter/info/" + templateid,
                    contentType: "application/json",
                    type: 'post',
                    success: function (data) {
                        if (data.status == 0) {

                            if (data.uiParameter.parameters == null) {
                                vm.items = [];
                            } else {
                                vm.items = JSON.parse(data.uiParameter.parameters);
                            }

                            vm.ui_cell.uriString = data.uiParameter.uriString;
                            vm.ui_cell.intentType = data.uiParameter.intentType;
                            vm.templateName = data.uiParameter.name;

                            if (data.uiParameter.intentType == 'App') {
                                vm.chooseApp = true;
                                vm.chooseAction = false;
                                vm.chooseBroadcast = false;
                                vm.chooseUrl = false;
                                vm.chooseInstall = false;

                                vm.ui_cell.packageName = data.uiParameter.packageName;
                                vm.ui_cell.className = data.uiParameter.className;
                            }

                            if (data.uiParameter.intentType == 'Action') {
                                vm.chooseApp = false;
                                vm.chooseAction = true;
                                vm.chooseBroadcast = false;
                                vm.chooseUrl = false;
                                vm.chooseInstall = true;

                                vm.ui_cell.action = data.uiParameter.action;
                            }

                            if (data.uiParameter.intentType == 'url') {
                                vm.chooseApp = false;
                                vm.chooseAction = false;
                                vm.chooseBroadcast = false;
                                vm.chooseUrl = true;
                                vm.chooseInstall = false;
                            }
                            if (data.uiParameter.intentType == 'Broadcast') {
                                vm.chooseApp = false;
                                vm.chooseAction = false;
                                vm.chooseBroadcast = true;
                                vm.chooseUrl = false;
                                vm.chooseInstall = false;

                                vm.ui_cell.action = data.uiParameter.action;
                            }
                            if (data.uiParameter.intentType == 'install') {
                                vm.chooseApp = false;
                                vm.chooseAction = false;
                                vm.chooseBroadcast = false;
                                vm.chooseUrl = false;
                                vm.chooseInstall = true;

                                vm.ui_cell.appid = data.uiParameter.appid;
                                vm.ui_cell.action = data.uiParameter.action;
                                vm.ui_cell.apkPackageName = data.uiParameter.apkPackageName;
                                /*
                                // 永远取最新的
                                vm.ui_cell.apkVersionName = data.uiParameter.apkVersionName;
                                vm.ui_cell.apkVersionCode = data.uiParameter.apkVersionCode;
                                */

                                vm.ui_cell.apkcdnUrl = data.uiParameter.apkcdnUrl;
                                vm.ui_cell.apkSize = data.uiParameter.apkSize;
                                vm.ui_cell.apkName = data.uiParameter.apkName;
                                vm.ui_cell.apkMd5 = data.uiParameter.apkMd5;
                                vm.ui_cell.apkSmallIconPath = data.uiParameter.apkSmallIconPath;
                                vm.ui_cell.apkBigIconPath = data.uiParameter.apkBigIconPath;
                                vm.ui_cell.apkWeiPoint = data.uiParameter.apkWeiPoint;
                                vm.ui_cell.apkFileName = data.uiParameter.apkFileName;


                                if (data.uiParameter.apkSmallIconPath != null && data.uiParameter.apkSmallIconPath != '') {
                                    $("#apkSmallIconSrc").attr("src", baseURL + '/file/download?fullPath=' + data.uiParameter.apkSmallIconPath);
                                    $("#apkSmallIconSrc").css("display", "block");
                                } else {

                                    $("#apkSmallIconSrc").removeAttr("src");
                                    $("#apkSmallIconSrc").css("display", "none");
                                }

                                if (data.uiParameter.apkBigIconPath != null && data.uiParameter.apkBigIconPath != '') {
                                    $("#apkBigIconSrc").attr("src", baseURL + '/file/download?fullPath=' + data.uiParameter.apkBigIconPath);
                                    $("#apkBigIconSrc").css("display", "block");
                                } else {
                                    $("#apkBigIconSrc").removeAttr("src");
                                    $("#apkBigIconSrc").css("display", "none");
                                }

                                vm.ui_cell.action = data.uiParameter.action;
                            }


                        } else {
                            alert("获取数据出错");
                        }
                    },
                    error: function () {
                        alert("获取数据出错");
                    }
                });


            } else {
                vm.initIntentType();
            }


        },
        saveOrUpdate: function () {

            vm.ui_cell.temp = temp;

            if (vm.items == null || vm.items.length == 0) {
                vm.ui_cell.parameters = null
            } else {
                vm.ui_cell.parameters = JSON.stringify(vm.items);
            }

            if (vm.templateName != null) {
                vm.ui_cell.templateName = vm.templateName;
            }


            $.ajax({
                url: baseURL + "uicell/update" + "?optionalTemplateId=" + vm.optionalTemplateId,
                data: JSON.stringify(vm.ui_cell),
                contentType: "application/json",
                type: 'POST',
                success: function (data) {

                    if (data.status == 0) {
                        $('#addModal').modal('hide');
                        loadView(titleid);
                    } else {
                        alert("保存出错");
                    }
                    main.removeIcon('imageUrlFileSrc', 'noConfirm');
                    main.removeIcon('image2UrlFileSrc', 'noConfirm');
                    main.removeIcon('backgroundUrlSrc', 'noConfirm')
                },
                error: function () {
                    alert("保存出错");
                }
            });

        },
        loadSelectors: function () {
            $.ajax({
                type: "GET",
                url: baseURL + "uiparameter/findAllName",
                contentType: "application/json",
                success: function (r) {
                    if (r.status === 0) {
                        vm.parametersItems = r.result;
                    } else {
                        alert("加载参数查询下拉框信息失败");
                    }
                }
            });
        },
        selectIntentType: function () {
            var intentType = vm.ui_cell.intentType;
            if (intentType == 'App') {
                vm.chooseApp = true;
                vm.chooseAction = false;
                vm.chooseBroadcast = false;
                vm.chooseUrl = false;
                vm.chooseInstall = false;
            }
            if (intentType == 'Action') {
                vm.chooseApp = false;
                vm.chooseAction = true;
                vm.chooseBroadcast = false;
                vm.chooseUrl = false;
                vm.chooseInstall = false;
            }
            if (intentType == 'url') {
                vm.chooseApp = false;
                vm.chooseAction = false;
                vm.chooseBroadcast = false;
                vm.chooseUrl = true;
                vm.chooseInstall = false;
            }
            if (intentType == 'Broadcast') {
                vm.chooseApp = false;
                vm.chooseAction = false;
                vm.chooseBroadcast = true;
                vm.chooseUrl = false;
                vm.chooseInstall = false;
            }
            if (intentType == 'install') {
                vm.chooseApp = false;
                vm.chooseAction = false;
                vm.chooseBroadcast = false;
                vm.chooseUrl = false;
                vm.chooseInstall = true;
            }
        },
        showAppListInfo: function () {
            layer.open({
                type: 2,
                title: '应用列表',
                shadeClose: true,
                shade: 0.8,
                area: ['80%', '90%'],
                content: '/appstore/admin/app/appList.html'
            });

        }

    }
});

var main = {
    uploadCellImgFileCallback: function (file, data) {
        var jsonObj = JSON.parse(data);
        var status = jsonObj.status;
        var msg = jsonObj.msg;
        if (status == 0) {
            var fileName = file.name;
            var filePath = jsonObj.filePath;
            vm.ui_cell.imageUrl = filePath;
            $("#imageUrlFileSrc").attr("src", baseURL + 'file/download?fullPath=' + filePath);
            $("#imageUrlFileSrc").css("display", "block");
            alert('图片：' + fileName + '上传成功');
        } else {
            alert(msg);
        }
    },
    uploadCellImg2FileCallback: function (file, data) {
        var jsonObj = JSON.parse(data);
        var status = jsonObj.status;
        var msg = jsonObj.msg;
        if (status == 0) {
            var fileName = file.name;
            var filePath = jsonObj.filePath;
            vm.ui_cell.image2Url = filePath;
            $("#image2UrlFileSrc").attr("src", baseURL + 'file/download?fullPath=' + filePath);
            $("#image2UrlFileSrc").css("display", "block");
            alert('图片：' + fileName + '上传成功');
        } else {
            alert(msg);
        }
    },
    uploadCellBackgroundUrlFileCallback: function (file, data) {
        var jsonObj = JSON.parse(data);
        var status = jsonObj.status;
        var msg = jsonObj.msg;
        if (status == 0) {
            var fileName = file.name;
            var filePath = jsonObj.filePath;
            vm.ui_cell.backgroundUrl = filePath;
            $("#backgroundUrlSrc").attr("src", baseURL + 'file/download?fullPath=' + filePath);
            $("#backgroundUrlSrc").css("display", "block");
            alert('图片：' + fileName + '上传成功');
        } else {
            alert(msg);
        }
    },
    removeIcon: function (id, confirmStr) {

        if (confirmStr == 'confirm') {
            confirm("确定是否删除？", function () {
                $("#" + id).removeAttr("src");
                $("#" + id).css("display", "none");
                if (id == 'imageUrlFileSrc') {
                    vm.ui_cell.imageUrl = null;
                }
                if (id == 'image2UrlFileSrc') {
                    vm.ui_cell.image2Url = null;
                }
                if (id == 'backgroundUrlSrc') {
                    vm.ui_cell.backgroundUrl = null;
                }
                alert("删除成功！");
            });
        } else {
            $("#" + id).removeAttr("src");
            $("#" + id).css("display", "none");
            if (id == 'imageUrlFileSrc') {
                vm.ui_cell.imageUrl = null;
            }
            if (id == 'image2UrlFileSrc') {
                vm.ui_cell.image2Url = null;
            }
            if (id == 'backgroundUrlSrc') {
                vm.ui_cell.backgroundUrl = null;
            }

        }
    }
};

// 默认
vm.initIntentType();
vm.loadSelectors();

$('#imageUrlFile').uploadifive(uploadCellImgUploadSetting);
$('#image2UrlFile').uploadifive(uploadCellImg2UploadSetting);
$('#backgroundUrlFile').uploadifive(uploadCellBackgroundUrlUploadSetting);


var id = $('#click_grid_stack_temp_id').val();
var temp = $('#click_grid_stack_temp_temp').val();
// 更新数据
$.ajax({
    url: baseURL + "uicell/info/" + id + "/" + temp,
    contentType: "application/json",
    success: function (data) {
        if (data.status == 0) {
            vm.initParamter();
            vm.ui_cell = data.uiCell;
            if (vm.ui_cell.templateName == null || vm.ui_cell.templateName == '') {
                vm.ui_cell.templateName = "没选取";
            }
            if (data.uiCell.parameters == null) {
                vm.items = [];
            } else {
                vm.items = JSON.parse(data.uiCell.parameters);
            }

            if (data.uiCell.intentType == 'App') {
                vm.chooseApp = true;
                vm.chooseAction = false;
                vm.chooseBroadcast = false;
                vm.chooseUrl = false;
                vm.chooseInstall = false;
            }

            if (data.uiCell.intentType == 'Action') {
                vm.chooseApp = false;
                vm.chooseAction = true;
                vm.chooseBroadcast = false;
                vm.chooseUrl = false;
                vm.chooseInstall = false;
            }

            if (data.uiCell.intentType == 'url') {
                vm.chooseApp = false;
                vm.chooseAction = false;
                vm.chooseBroadcast = false;
                vm.chooseUrl = true;
                vm.chooseInstall = false;
            }
            if (data.uiCell.intentType == 'Broadcast') {
                vm.chooseApp = false;
                vm.chooseAction = false;
                vm.chooseBroadcast = true;
                vm.chooseUrl = false;
                vm.chooseInstall = false;
            }
            if (data.uiCell.intentType == 'install') {
                vm.chooseApp = false;
                vm.chooseAction = false;
                vm.chooseBroadcast = false;
                vm.chooseUrl = false;
                vm.chooseInstall = true;

                if (data.uiCell.apkSmallIconPath != null && data.uiCell.apkSmallIconPath != '') {
                    $("#apkSmallIconSrc").attr("src", baseURL + '/file/download?fullPath=' + data.uiCell.apkSmallIconPath);
                    $("#apkSmallIconSrc").css("display", "block");
                } else {

                    $("#apkSmallIconSrc").removeAttr("src");
                    $("#apkSmallIconSrc").css("display", "none");
                }

                if (data.uiCell.apkBigIconPath != null && data.uiCell.apkBigIconPath != '') {
                    $("#apkBigIconSrc").attr("src", baseURL + '/file/download?fullPath=' + data.uiCell.apkBigIconPath);
                    $("#apkBigIconSrc").css("display", "block");
                } else {
                    $("#apkBigIconSrc").removeAttr("src");
                    $("#apkBigIconSrc").css("display", "none");
                }

            }


            if (data.uiCell.imageUrl != null && data.uiCell.imageUrl != '') {
                $("#imageUrlFileSrc").attr("src", baseURL + '/file/download?fullPath=' + vm.ui_cell.imageUrl);
                $("#imageUrlFileSrc").css("display", "block");
            } else {
                $("#imageUrlFileSrc").removeAttr("src");
                $("#imageUrlFileSrc").css("display", "none");
            }

            if (data.uiCell.image2Url != null && data.uiCell.image2Url != '') {
                $("#image2UrlFileSrc").attr("src", baseURL + '/file/download?fullPath=' + vm.ui_cell.image2Url);
                $("#image2UrlFileSrc").css("display", "block");
            } else {
                $("#image2UrlFileSrc").removeAttr("src");
                $("#image2UrlFileSrc").css("display", "none");
            }


            if (data.uiCell.backgroundUrl != null && data.uiCell.backgroundUrl != '') {
                $("#backgroundUrlSrc").attr("src", baseURL + '/file/download?fullPath=' + vm.ui_cell.backgroundUrl);
                $("#backgroundUrlSrc").css("display", "block");
            } else {
                $("#backgroundUrlSrc").removeAttr("src");
                $("#backgroundUrlSrc").css("display", "none");
            }


        } else {
            alert("请求错误");
        }
    },
    error: function () {
        alert("请求错误");
    }
});