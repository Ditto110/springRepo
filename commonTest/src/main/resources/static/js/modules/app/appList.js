$(function () {

    $("#appJqGrid").jqGrid({
        url: baseURL + 'admin/tbapp/list',
        datatype: "json",
        colModel: [
            {label: '应用名称', name: 'name', index: 'name', width: 100},
            {label: '应用包名', name: 'packagename', index: 'packagename', width: 150},
            {label: '应用积分值', name: 'weiPoint', index: 'weiPoint', width: 50},
            {
                label: '操作', name: 'opt', width: 100,
                formatter: function (value, grid, rows, state) {
                    return "<a class='btn btn-primary' onclick='appListVM.setAppInfo(" + JSON.stringify(rows) + ")'>&nbsp;选择</a>&nbsp;&nbsp;"
                }
            }
        ],
        viewrecords: true,
        height: 500,
        rowNum: 10,
        rowList: [10, 30, 50],
        rownumbers: true,
        rownumWidth: 25,
        autowidth: true,
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

    appListVM.initDeviceTypeSelect();

});


var appListVM = new Vue({
        el: '#getAppListInfo',
        data: {
            queryAddAppName: null,

            deviceTypeList: [],
            deviceTypeSelected: '',
            customerMaps: [],
            customerSelected: ''
        },
        methods: {
            queryAppList: function () {
                var grid = $("#appJqGrid");
                var page = grid.jqGrid('getGridParam', 'page');
                grid.jqGrid('setGridParam', {
                    postData: {
                        'appName': appListVM.queryAddAppName,
                        'deviceTypeId': appListVM.deviceTypeSelected,
                        'customerId': appListVM.customerSelected
                    },
                    page: page
                }).trigger("reloadGrid");

            },
            getAppVersionInfo: function (id) {

                layer.open({
                    type: 2,
                    title: '应用版本信息',
                    shadeClose: true,
                    shade: 0.8,
                    area: ['100%', '100%'],
                    content: '/appstore/admin/app/appVersionList.html?id=' + id
                });

            },
            setAppInfo: function (row) {
                if (parent.vm.ui_cell) {
                    parent.vm.ui_cell.apkPackageName = row.packagename;
                    parent.vm.ui_cell.apkSmallIconPath = row.siconpath;
                    parent.vm.ui_cell.apkBigIconPath = row.biconpath;
                    parent.vm.ui_cell.apkVersionName = row.appVersionEntity.versionname;
                    parent.vm.ui_cell.apkVersionCode = row.appVersionEntity.versioncode;
                    parent.vm.ui_cell.apkcdnUrl = row.appVersionEntity.apkcdnurl;
                    parent.vm.ui_cell.apkSize = row.appVersionEntity.apksize;
                    parent.vm.ui_cell.apkName = row.appVersionEntity.apkname;
                    parent.vm.ui_cell.apkMd5 = row.appVersionEntity.apkmd5;
                    parent.vm.ui_cell.appid = row.id;

                    var params = parent.vm.items;
                    for (var index in params) {
                        if (params[index].key == "packageName") {
                            params[index].value = row.packagename;
                        }
                    }
                    parent.vm.ui_cell.apkWeiPoint = row.weiPoint;
                    parent.vm.ui_cell.apkFileName = row.appVersionEntity.apkname;

                    if (row.siconpath != null && row.siconpath != '') {
                        parent.$("#apkSmallIconSrc").attr("src", baseURL + '/file/download?fullPath=' + row.siconpath);
                        parent.$("#apkSmallIconSrc").css("display", "block");
                    } else {
                        parent.$("#apkSmallIconSrc").removeAttr("src");
                        parent.$("#apkSmallIconSrc").css("display", "none");
                    }

                    if (row.biconpath != null && row.biconpath != '') {
                        parent.$("#apkBigIconSrc").attr("src", baseURL + '/file/download?fullPath=' + row.biconpath);
                        parent.$("#apkBigIconSrc").css("display", "block");
                    } else {
                        parent.$("#apkBigIconSrc").removeAttr("src");
                        parent.$("#apkBigIconSrc").css("display", "none");
                    }
                    parent.vm.$forceUpdate();
                }
                if (parent.vm.uiStartPicture) {
                    parent.vm.items = [{
                        key: 'appID',
                        value: row.id
                    }];
                    parent.vm.uiStartPicture.intentType = "Action";
                    parent.vm.uiStartPicture.action = "com.mipt.store.intent.APPID";
                    parent.vm.uiStartPicture.packageName = "com.mipt.store";
                }


                parent.layer.closeAll();
            },
            destroyItself: function () {
                //当你在iframe页面关闭自身时
                var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                parent.layer.close(index); //再执行关闭
            }
            ,
            initDeviceTypeSelect: function () {
                $.get(baseURL + "devicetype/query", function (r) {
                    if (r.status === 0) {
                        var deviceTypeList = r.deviceTypeList;
                        var all = {
                            devicetypeid: '',
                            devicetype: '全部'
                        };
                        deviceTypeList.unshift(all);
                        appListVM.deviceTypeList = deviceTypeList;
                        appListVM.deviceTypeSelected = '';
                    } else {
                        alert(r.msg);
                    }
                });
            }
            ,
            initCustomerSelectByDeviceTypeId: function (deviceTypeId) {
                if (!deviceTypeId) {
                    var customerMaps = [];
                    var all = {customerid: '', customername: '全部'};
                    customerMaps.unshift(all);
                    appListVM.customerMaps = customerMaps;
                    appListVM.customerSelected = '';
                } else {
                    $.get(baseURL + "typecustomermap/info/" + deviceTypeId, function (r) {
                        var customerMaps = r.customerMaps;
                        var all = {customerid: '', customername: '全部'};
                        customerMaps.unshift(all);
                        appListVM.customerMaps = customerMaps;
                        appListVM.customerSelected = '';
                    });
                }
            }
        },
        watch: {
            deviceTypeSelected: function (deviceTypeId) {
                appListVM.initCustomerSelectByDeviceTypeId(deviceTypeId);
            }
        }
    })
;