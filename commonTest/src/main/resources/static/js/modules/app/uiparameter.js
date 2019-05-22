$(function () {
    $("#jqGrid").jqGrid({
        url: baseURL + 'uiparameter/list',
        datatype: "json",
        colModel: [
            {label: '参数模板名称', name: 'name', index: 'name', width: 120},
            {label: '跳转类型', name: 'intentType', index: 'intentType', width: 80},
            {label: '创建时间', name: 'createTime', index: 'createTime', width: 90},
            {label: '更新时间', name: 'updateTime', index: 'updateTime', width: 90},
            {
                label: '操作', name: 'id', index: 'id', width: 50, formatter: function (cellValue, options, rowObject) {
                return "<a class='btn btn-primary' onclick='showDetailVM.showRelationship(\"" + cellValue + "\")'>&nbsp;跳转详情</a>&nbsp;&nbsp;"
            }
            }
        ],
        viewrecords: true,
        height: 385,
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
            //隐藏grid底部滚动条
            $("#jqGrid").closest(".ui-jqgrid-bdiv").css({"overflow-x": "hidden"});
        }
    });
    vm.loadqueryItems();

    vm.initDeviceTypeSelect();


    $("#appJqGrid").jqGrid({
        url: baseURL + 'admin/tbapp/list',
        datatype: "json",
        colModel: [
            {label: '应用名称', name: 'name', index: 'name', width: 100},
            {label: '应用包名', name: 'packagename', index: 'packagename', width: 100},
            {
                label: '操作', name: 'opt', width: 60,
                formatter: function (value, grid, rows, state) {
                    return '<a class="btn btn-primary" data-toggle="modal" data-target="#getAppVersionInfo" data-id="' + rows.id + '">版本选择</a>'
                }
            }
        ],
        viewrecords: true,
        height: 280,
        rowNum: 10,
        rowList: [10, 30, 50],
        rownumbers: true,
        rownumWidth: 25,
        autowidth: false,
        multiselect: false,
        pager: "#appJqGridPager",
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
            $("#appJqGrid").closest(".ui-jqgrid-bdiv").css({"overflow-x": "hidden"});
        }
    });


    $("#jqAppVersionInfoGrid").jqGrid({
        url: baseURL + 'admin/tbapp/versionList',
        datatype: "json",
        colModel: [
            {label: '文件名称', name: 'apkName', index: 'apkName', width: 100},
            {label: '应用包名', name: 'apkPackageName', index: 'apkPackageName', width: 220},
            {label: '版本名称', name: 'apkVersionName', index: 'apkVersionName', width: 75},
            {label: '版本号', name: 'apkVersionCode', index: 'apkVersionCode', width: 75},
            {label: '下载地址', name: 'apkcdnUrl', index: 'apkcdnUrl', width: 280},
            {
                label: '小图标',
                name: 'siconpath',
                index: 'siconpath',
                width: 100,
                formatter: function (cellValue, options, rowObject) {
                    if (cellValue == null) {
                        return '<font style="color: red">不存在</font>';
                    } else {
                        var imgUrl = '<img src="' + baseURL + '/file/download?fullPath=' + cellValue + '" style="width:50px;height:25px;"/>';
                        return imgUrl;
                    }

                }
            },
            {
                label: '大图标',
                name: 'biconpath',
                index: 'biconpath',
                width: 100,
                formatter: function (cellValue, options, rowObject) {
                    if (cellValue == null) {
                        return '<font style="color: red">不存在</font>';
                    } else {
                        var imgUrl = '<img src="' + baseURL + '/file/download?fullPath=' + cellValue + '" style="width:50px;height:25px;"/>';
                        return imgUrl;
                    }
                }
            },
            {
                label: '操作', name: 'opt', width: 90,
                formatter: function (value, grid, rows, state) {

                    return "<a class='btn btn-primary' onclick=setInstallAppInfo(" + JSON.stringify(rows) + ")>选择</a>"
                }
            }
        ],
        viewrecords: true,
        height: 280,
        rowNum: 10,
        rowList: [10, 30, 50],
        rownumbers: true,
        rownumWidth: 25,
        autowidth: true,
        multiselect: false,
        pager: "#jqAppVersionInfoGridPager",
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
            $("#jqAppVersionInfoGrid").closest(".ui-jqgrid-bdiv").css({"overflow-x": "hidden"});
        }
    });

    $('#getAppVersionInfo').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget);
        var id = button.data('id');
        var param = {appid: id};
        vm.appid = id;
        var grid = $("#jqAppVersionInfoGrid");
        var page = grid.jqGrid('getGridParam', 'page');
        grid.jqGrid('setGridParam', {
            postData: param,
            page: page
        }).trigger("reloadGrid");

    });

});


function setInstallAppInfo(row) {

    vm.uiParameter.apkPackageName = row.apkPackageName;
    vm.uiParameter.apkVersionName = row.apkVersionName;
    vm.uiParameter.apkVersionCode = row.apkVersionCode;
    vm.uiParameter.apkcdnUrl = row.apkcdnUrl;
    vm.uiParameter.apkSize = row.apkSize;
    vm.uiParameter.apkName = row.apkName;
    vm.uiParameter.apkMd5 = row.apkMd5;
    vm.uiParameter.apkSmallIconPath = row.siconpath;
    vm.uiParameter.apkBigIconPath = row.biconpath;

    $("#chooseInstall_apkPackageName").val(row.apkPackageName);
    $("#chooseInstall_apkVersionName").val(row.apkVersionName);
    $("#chooseInstall_apkVersionCode").val(row.apkVersionCode);
    $("#chooseInstall_apkcdnUrl").val(row.apkcdnUrl);
    $("#chooseInstall_apkSize").val(row.apkSize);
    $("#chooseInstall_apkName").val(row.apkName);
    $("#chooseInstall_apkMd5").val(row.apkMd5);

    if (row.siconpath != null && row.siconpath != '') {
        $("#apkSmallIconSrc").attr("src", baseURL + '/file/download?fullPath=' + row.siconpath);
        $("#apkSmallIconSrc").css("display", "block");
    } else {

        $("#apkSmallIconSrc").removeAttr("src");
        $("#apkSmallIconSrc").css("display", "none");
    }

    if (row.biconpath != null && row.biconpath != '') {
        $("#apkBigIconSrc").attr("src", baseURL + '/file/download?fullPath=' + row.biconpath);
        $("#apkBigIconSrc").css("display", "block");
    } else {
        $("#apkBigIconSrc").removeAttr("src");
        $("#apkBigIconSrc").css("display", "none");
    }

    vm.uiParameter.appid = vm.appid;

    $('#getAppVersionInfo').modal('hide')

}


var vm = new Vue({
    el: '#rrapp',
    data: {
        showList: true,
        title: null,
        chooseApp: false,
        chooseAction: false,
        chooseBroadcast: false,
        chooseUrl: false,
        chooseInstall: false,
        uiParameter: {},
        items: [],
        queryItems: [],
        queryId: null,

        queryAddAppName: null,
        deviceTypeList: [],
        deviceTypeSelected: '',
        customerMaps: [],
        customerSelected: '',

        appid: null
    },
    methods: {
        initChooseType: function () {
            vm.chooseApp = false;
            vm.chooseAction = false;
            vm.chooseBroadcast = false;
            vm.chooseUrl = false;
            vm.chooseInstall = false
        },
        initParameter: function () {

            vm.uiParameter.packageName = null;
            vm.uiParameter.className = null;
            vm.uiParameter.action = null;
            vm.uiParameter.uriString = null;
            vm.uiParameter.parameters = null;
            vm.uiParameter.appid = null;
            vm.uiParameter.apkPackageName = null;
            vm.uiParameter.apkVersionName = null;
            vm.uiParameter.apkVersionCode = null;
            vm.uiParameter.apkcdnUrl = null;
            vm.uiParameter.apkSize = null;
            vm.uiParameter.apkName = null;
            vm.uiParameter.apkMd5 = null;
            vm.uiParameter.apkSmallIconPath = null;
            vm.uiParameter.apkBigIconPath = null;

            $("#apkSmallIconSrc").removeAttr("src");
            $("#apkSmallIconSrc").css("display", "none");

            $("#apkBigIconSrc").removeAttr("src");
            $("#apkBigIconSrc").css("display", "none");


        },
        query: function () {
            vm.reload();
        },
        loadqueryItems: function () {

            $.ajax({
                type: "GET",
                url: baseURL + "uiparameter/findAllName",
                contentType: "application/json",
                success: function (r) {
                    if (r.status == 0) {
                        vm.queryItems = r.result;
                    } else {
                        alert("加载参数查询下拉框信息失败");
                    }
                }
            });

        },
        selectIntentType: function () {
            vm.initParameter();
            var intentType = vm.uiParameter.intentType;

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
        add: function () {
            vm.showList = false;
            vm.title = "新增";
            vm.uiParameter = {};
            vm.items = [];
            vm.initChooseType();
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
        update: function (event) {
            var id = getSelectedRow();
            if (id == null) {
                return;
            }
            vm.showList = false;
            vm.title = "修改";

            vm.getInfo(id)
        },
        saveOrUpdate: function (event) {
            var url = vm.uiParameter.id == null ? "uiparameter/save" : "uiparameter/update";

            if (!vm.chooseInstall) {
                vm.uiParameter.appid = null;
            }

            // items 装为 字符串 记录
            if (vm.items == null || vm.items.length == 0) {
                vm.uiParameter.parameters = null;
            } else {
                vm.uiParameter.parameters = JSON.stringify(vm.items);
            }

            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.uiParameter),
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
                    alert("请求异常，请联系管理员");
                }
            });
        },
        del: function (event) {
            var ids = getSelectedRows();
            if (ids == null) {
                return;
            }

            confirm('确定要删除选中的记录？', function () {
                $.ajax({
                    type: "POST",
                    url: baseURL + "uiparameter/delete",
                    contentType: "application/json",
                    data: JSON.stringify(ids),
                    success: function (r) {
                        if (r.status == 0) {
                            alert('操作成功', function (index) {
                                $("#jqGrid").trigger("reloadGrid");
                            });
                            // 重新加载下拉框
                            vm.loadqueryItems();
                        } else {
                            alert(r.msg);
                        }
                    },
                    error: function () {
                        alert("请求异常，请联系管理员");
                    }
                });
            });
        },
        getInfo: function (id) {
            $.get(baseURL + "uiparameter/info/" + id, function (r) {
                vm.uiParameter = r.uiParameter;
                if (r.uiParameter.parameters == null) {
                    vm.items = [];
                } else {
                    vm.items = JSON.parse(r.uiParameter.parameters);
                }
                if (r.uiParameter.intentType == 'App') {
                    vm.chooseApp = true;
                    vm.chooseAction = false;
                    vm.chooseBroadcast = false;
                    vm.chooseUrl = false;
                    vm.chooseInstall = false;
                }

                if (r.uiParameter.intentType == 'Action') {
                    vm.chooseApp = false;
                    vm.chooseAction = true;
                    vm.chooseBroadcast = false;
                    vm.chooseUrl = false;
                    vm.chooseInstall = false;
                }

                if (r.uiParameter.intentType == 'url') {
                    vm.chooseApp = false;
                    vm.chooseAction = false;
                    vm.chooseBroadcast = false;
                    vm.chooseUrl = true;
                    vm.chooseInstall = false;
                }
                if (r.uiParameter.intentType == 'Broadcast') {
                    vm.chooseApp = false;
                    vm.chooseAction = false;
                    vm.chooseBroadcast = true;
                    vm.chooseUrl = false;
                    vm.chooseInstall = false;
                }
                if (r.uiParameter.intentType == 'install') {
                    vm.chooseApp = false;
                    vm.chooseAction = false;
                    vm.chooseBroadcast = false;
                    vm.chooseUrl = false;
                    vm.chooseInstall = true;
                }
            });
        },
        reload: function (event) {
            vm.showList = true;
            var params = {id: vm.queryId};
            var page = 1;
            $("#jqGrid").jqGrid('setGridParam', {
                page: page,
                postData: params
            }).trigger("reloadGrid");
        },
        queryAppList: function () {

            var grid = $("#appJqGrid");
            var page = grid.jqGrid('getGridParam', 'page');
            grid.jqGrid('setGridParam', {
                postData: {
                    'appName': vm.queryAddAppName,
                    'deviceTypeId': vm.deviceTypeSelected,
                    'customerId': vm.customerSelected
                },
                page: page
            }).trigger("reloadGrid");

        },
        initDeviceTypeSelect: function () {
            $.get(baseURL + "devicetype/query", function (r) {
                if (r.status === 0) {
                    var deviceTypeList = r.deviceTypeList;
                    var all = {
                        devicetypeid: '',
                        devicetype: '全部'
                    };
                    deviceTypeList.unshift(all);
                    vm.deviceTypeList = deviceTypeList;
                    vm.deviceTypeSelected = '';
                } else {
                    alert(r.msg);
                }
            });
        },
        initCustomerSelectByDeviceTypeId: function (deviceTypeId) {
            if (!deviceTypeId) {
                var customerMaps = [];
                var all = {customerid: '', customername: '全部'};
                customerMaps.unshift(all);
                vm.customerMaps = customerMaps;
                vm.customerSelected = '';
            } else {
                $.get(baseURL + "typecustomermap/info/" + deviceTypeId, function (r) {
                    var customerMaps = r.customerMaps;
                    var all = {customerid: '', customername: '全部'};
                    customerMaps.unshift(all);
                    vm.customerMaps = customerMaps;
                    vm.customerSelected = '';
                });
            }
        }
    },
    watch: {
        deviceTypeSelected: function (deviceTypeId) {
            vm.initCustomerSelectByDeviceTypeId(deviceTypeId);
        }
    }
});


var showDetailVM = new Vue({
    el: '#showDetailsInfo',
    data: {
        uiParameter: {},
        chooseApp: false,
        chooseAction: false,
        chooseBroadcast: false,
        chooseUrl: false,
        chooseInstall: false,
        items: []

    },
    methods: {
        showRelationship: function (id) {
            $.get(baseURL + "uiparameter/info/" + id, function (r) {
                    showDetailVM.uiParameter = r.uiParameter;
                    if (r.uiParameter.parameters == null) {
                        showDetailVM.items = [];
                    } else {
                        showDetailVM.items = JSON.parse(r.uiParameter.parameters);
                    }
                    if (r.uiParameter.intentType == 'App') {
                        showDetailVM.chooseApp = true;
                        showDetailVM.chooseAction = false;
                        showDetailVM.chooseBroadcast = false;
                        showDetailVM.chooseUrl = false;
                        showDetailVM.chooseInstall = false;

                    }

                    if (r.uiParameter.intentType == 'Action') {
                        showDetailVM.chooseApp = false;
                        showDetailVM.chooseAction = true;
                        showDetailVM.chooseBroadcast = false;
                        showDetailVM.chooseUrl = false;
                        showDetailVM.chooseInstall = false;
                    }

                    if (r.uiParameter.intentType == 'url') {
                        showDetailVM.chooseApp = false;
                        showDetailVM.chooseAction = false;
                        showDetailVM.chooseBroadcast = false;
                        showDetailVM.chooseUrl = true;
                        showDetailVM.chooseInstall = false;
                    }
                    if (r.uiParameter.intentType == 'Broadcast') {
                        showDetailVM.chooseApp = false;
                        showDetailVM.chooseAction = false;
                        showDetailVM.chooseBroadcast = true;
                        showDetailVM.chooseUrl = false;
                        showDetailVM.chooseInstall = false;
                    }
                    if (r.uiParameter.intentType == 'install') {
                        showDetailVM.chooseApp = false;
                        showDetailVM.chooseAction = false;
                        showDetailVM.chooseBroadcast = false;
                        showDetailVM.chooseUrl = false;
                        showDetailVM.chooseInstall = true;

                        if (r.uiParameter.apkSmallIconPath != null && r.uiParameter.apkSmallIconPath != '') {
                            $("#showApkSmallIconSrc").attr("src", baseURL + '/file/download?fullPath=' + r.uiParameter.apkSmallIconPath);
                            $("#showApkSmallIconSrc").css("display", "block");
                        } else {
                            $("#showApkSmallIconSrc").removeAttr("src");
                            $("#showApkSmallIconSrc").css("display", "none");
                        }

                        if (r.uiParameter.apkBigIconPath != null && r.uiParameter.apkBigIconPath != '') {
                            $("#showApkBigIconSrc").attr("src", baseURL + '/file/download?fullPath=' + r.uiParameter.apkBigIconPath);
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
