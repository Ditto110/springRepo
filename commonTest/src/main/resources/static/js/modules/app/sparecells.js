var id = T.p('id');
var titleid = T.p('titleid');
$(function () {
    $("#jqGrid").jqGrid({
        url: baseURL + 'uicell/spareCellList',
        datatype: "json",
        colModel: [
            {label: '应用统计字段', name: 'operateTitle', index: 'operateTitle', width: 100},
            {label: '项目名称', name: 'name', index: 'name', width: 100},
            {label: '推荐语', name: 'description', index: 'description', width: 75},
            {label: '优先级', name: 'indexOfPanel', index: 'indexOfPanel', width: 50},
            {
                label: '跳转类型',
                name: 'intentType',
                index: 'intentType',
                width: 75
            },
            {
                label: '背景图',
                name: 'imageUrl',
                index: 'imageUrl',
                width: 100,
                formatter: function (cellValue, options, rowObject) {
                    if (cellValue == null || cellValue == '') {
                        return '<font style="color: red">没上传</font>';
                    }
                    var imgUrl = '<img src="' + baseURL + 'file/download?fullPath=' + cellValue + '" style="width:100px;height:80px;"/>';
                    return imgUrl;
                }
            },
            {
                label: '露头图', name: 'image2Url', index: 'image2Url', width: 100,
                formatter: function (cellValue, options, rowObject) {
                    if (cellValue == null || cellValue == '') {
                        return '<font style="color: red">没上传</font>';
                    }
                    var imgUrl = '<img src="' + baseURL + 'file/download?fullPath=' + cellValue + '" style="width:100px;height:80px;"/>';
                    return imgUrl;
                }
            },
            {
                label: '配件海报图', name: 'backgroundUrl', index: 'backgroundUrl', width: 100,
                formatter: function (cellValue, options, rowObject) {
                    if (cellValue == null || cellValue == '') {
                        return '<font style="color: red">没上传</font>';
                    }
                    var imgUrl = '<img src="' + baseURL + 'file/download?fullPath=' + cellValue + '" style="width:100px;height:80px;"/>';
                    return imgUrl;
                }
            },
            {
                label: '操作', name: 'id', index: 'id', width: 90,
                formatter: function (value, grid, rows, state) {
                    return "<a class='btn btn-primary' onclick='showDetailVM.showRelationship(\"" + rows.id + "\")'>&nbsp;跳转详情</a>&nbsp;&nbsp;"
                }
            }
        ],
        postData: {parentId: id},
        viewrecords: true,
        height: 280,
        rowNum: 10,
        rowList: [10, 30, 50],
        rownumbers: true,
        rownumWidth: 25,
        autowidth: true,
        multiselect: true,
        pager: "#jqGridPager",
        jsonReader: {
            root: "page.list",
            page: "page.currPage",
            total: "page.totalPage",
            records: "page.totalCount"
        },
        prmNames: {
            page: "page",
            rows: "limit",
            order: "order"
        },
        gridComplete: function () {
            $("#jqGridPager").closest(".ui-jqgrid-bdiv").css({"overflow-x": "hidden"});
        }
    });

});


var vm = new Vue({
    el: '#spareCellsList',
    data: {
        showList: true,
        ui_cell: {},
        templateId: "",
        templateName: null,
        items: [],
        chooseApp: false,
        chooseAction: false,
        chooseBroadcast: false,
        chooseUrl: false,
        chooseInstall: false,
        parametersItems: []
    },
    methods: {
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
        saveOrUpdate: function (event) {
            var url;
            if (vm.ui_cell.id == null) {
                url = "uicell/save";
                vm.ui_cell.parentId = id;
                // 原子替换项标记
                vm.ui_cell.cellLevel = 2;
                vm.ui_cell.titleid = titleid;
            } else {
            	vm.ui_cell.titleid = titleid;            	
                url = "uicell/update";
            }

            if (vm.templateName != null) {
                vm.ui_cell.templateName = vm.templateName;
            }

            if (vm.items == null || vm.items.length == 0) {
                vm.ui_cell.parameters = null
            } else {
                vm.ui_cell.parameters = JSON.stringify(vm.items);
            }
                        
            vm.ui_cell.publish = 1;
            /*            console.log(vm.ui_cell);*/

            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.ui_cell),
                success: function (r) {
                    if (r.status == 0) {
                        alert('操作成功', function (index) {
                            vm.reload();
                        });
                    } else {
                        alert(r.msg);
                    }
                },
                error: function () {
                    alert("请求失败,请联系管理员");
                }
            });
        },
        reload: function (event) {
            vm.showList = true;
            var page = $("#jqGrid").jqGrid('getGridParam', 'page');
            $("#jqGrid").jqGrid('setGridParam', {
                page: page,
                postData: {
                    parentId: id
                }
            }).trigger("reloadGrid");
        },
        init: function () {
            vm.chooseApp = false;
            vm.chooseAction = false;
            vm.chooseBroadcast = false;
            vm.chooseUrl = false;
            vm.chooseInstall = false;
            vm.ui_cell = {};
            vm.items = [];
            vm.templateId = "";
            // 去掉图片预览 防止再次点开残留
            $("#apkSmallIconSrc").removeAttr("src");
            $("#apkSmallIconSrc").css("display", "none");

            $("#apkBigIconSrc").removeAttr("src");
            $("#apkBigIconSrc").css("display", "none");

            main.removeIcon('imageUrlFileSrc', 'noConfirm');
            main.removeIcon('image2UrlFileSrc', 'noConfirm');
            main.removeIcon('backgroundUrlSrc', 'noConfirm');
        },
        initIntentType: function () {
            vm.chooseApp = false;
            vm.chooseAction = false;
            vm.chooseBroadcast = false;
            vm.chooseUrl = false;
            vm.chooseInstall = false;
        },
        add: function () {
            vm.showList = false;
            vm.init();
        },
        initParamter: function () {
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
            
            vm.ui_cell.publish = 1;

            $("#apkSmallIconSrc").removeAttr("src");
            $("#apkSmallIconSrc").css("display", "none");

            $("#apkBigIconSrc").removeAttr("src");
            $("#apkBigIconSrc").css("display", "none");
        },
        selectTemplate: function () {
            var templateid = vm.templateId;
            if (templateid != "" && templateid != null) {

                $.ajax({
                    url: baseURL + "uiparameter/info/" + templateid,
                    contentType: "application/json",
                    type: 'post',
                    success: function (data) {
                        if (data.status == 0) {
                            vm.initParamter()

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
                                vm.chooseInstall = false;

                                vm.ui_cell.action = data.uiParameter.action;
                                
                                //[{key:'', value:''},{key:'', value:''}]
                                //vm.ui_cell.parameters.item.key item.value
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
                                vm.ui_cell.apkVersionName = data.uiParameter.apkVersionName;
                                vm.ui_cell.apkVersionCode = data.uiParameter.apkVersionCode;
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
        del: function () {
            var ids = getSelectedRows();
            if (ids == null) {
                return;
            }
            confirm('确定要删除选中的记录？', function () {
                $.ajax({
                    type: "POST",
                    url: baseURL + "uicell/delete",
                    contentType: "application/json",
                    data: JSON.stringify(ids),
                    success: function (r) {
                        if (r.status == 0) {
                            alert('操作成功', function (index) {
                                $("#jqGrid").trigger("reloadGrid");
                            });
                        } else {
                            alert(r.msg);
                        }
                    },
                    error: function () {
                        alert("请求失败,请联系管理员");
                    }
                });
            });
        },
        update: function () {
            var id = getSelectedRow();
            if (id == null) {
                return;
            }
            vm.init();
            vm.showList = false;
            vm.getInfo(id);
        },
        getInfo: function (id) {
            $.get(baseURL + "uicell/info/" + id, function (data) {
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
            });
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
vm.loadSelectors();


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


$('#imageUrlFile').uploadifive(uploadCellImgUploadSetting);
$('#image2UrlFile').uploadifive(uploadCellImg2UploadSetting);
$('#backgroundUrlFile').uploadifive(uploadCellBackgroundUrlUploadSetting);


var showDetailVM = new Vue({
    el: '#showDetailsInfo',
    data: {
        uiCell: {},
        chooseApp: false,
        chooseAction: false,
        chooseBroadcast: false,
        chooseUrl: false,
        chooseInstall: false,
        items: []

    },
    methods: {
        showRelationship: function (id) {
            $.get(baseURL + "uicell/info/" + id, function (r) {
                    showDetailVM.uiCell = r.uiCell;
                    if (r.uiCell.parameters == null) {
                        showDetailVM.items = [];
                    } else {
                        showDetailVM.items = JSON.parse(r.uiCell.parameters);
                    }
                    if (r.uiCell.intentType == 'App') {
                        showDetailVM.chooseApp = true;
                        showDetailVM.chooseAction = false;
                        showDetailVM.chooseBroadcast = false;
                        showDetailVM.chooseUrl = false;
                        showDetailVM.chooseInstall = false;

                    }

                    if (r.uiCell.intentType == 'Action') {
                        showDetailVM.chooseApp = false;
                        showDetailVM.chooseAction = true;
                        showDetailVM.chooseBroadcast = false;
                        showDetailVM.chooseUrl = false;
                        showDetailVM.chooseInstall = false;
                    }

                    if (r.uiCell.intentType == 'url') {
                        showDetailVM.chooseApp = false;
                        showDetailVM.chooseAction = false;
                        showDetailVM.chooseBroadcast = false;
                        showDetailVM.chooseUrl = true;
                        showDetailVM.chooseInstall = false;
                    }
                    if (r.uiCell.intentType == 'Broadcast') {
                        showDetailVM.chooseApp = false;
                        showDetailVM.chooseAction = false;
                        showDetailVM.chooseBroadcast = true;
                        showDetailVM.chooseUrl = false;
                        showDetailVM.chooseInstall = false;
                    }
                    if (r.uiCell.intentType == 'install') {
                        showDetailVM.chooseApp = false;
                        showDetailVM.chooseAction = false;
                        showDetailVM.chooseBroadcast = false;
                        showDetailVM.chooseUrl = false;
                        showDetailVM.chooseInstall = true;


                        if (r.uiCell.apkSmallIconPath != null && r.uiCell.apkSmallIconPath != '') {
                            $("#showApkSmallIconSrc").attr("src", baseURL + '/file/download?fullPath=' + r.uiCell.apkSmallIconPath);
                            $("#showApkSmallIconSrc").css("display", "block");
                        } else {
                            $("#showApkSmallIconSrc").removeAttr("src");
                            $("#showApkSmallIconSrc").css("display", "none");
                        }

                        if (r.uiCell.apkBigIconPath != null && r.uiCell.apkBigIconPath != '') {
                            $("#showApkBigIconSrc").attr("src", baseURL + '/file/download?fullPath=' + r.uiCell.apkBigIconPath);
                            $("#showApkBigIconSrc").css("display", "block");
                        } else {
                            $("#showApkBigIconSrc").removeAttr("src");
                            $("#showApkBigIconSrc").css("display", "none");
                        }
                    }
                }
            );

            $("#showDetailsInfo").modal("show");
        }
    }
});



