$(function () {
    $("#appJqGrid").jqGrid({
        url: baseURL + '/admin/tbapp/list',
        datatype: "json",
        colModel: [
            {label: '应用ID', name: 'id', index: 'id', width: 30, key: true},
            {label: '名称', name: 'name', index: 'name', width: 50},
            {
                label: '图片',
                name: 'siconpath',
                index: 'siconpath',
                width: 40,
                formatter: function (cellValue, options, rowObject) {
                    var imgUrl = '<img src="' + baseURL + '/file/download?fullPath=' + rowObject.siconpath + '" style="width:50px;height:25px;"/>';
                    return imgUrl;
                }
            },
            {label: '最新版本', name: 'appVersionEntity.versionname', index: 'versionname', width: 30},
            {
                label: '发布状态',
                name: 'appVersionEntity.publish',
                index: 'publish',
                width: 30,
                formatter: function (cellValue, options, rowObject) {
                    if (cellValue == 1) {
                        return "上架";
                    } else {
                        return "下架";
                    }
                }
            },
            {label: '应用包名', name: 'packagename', index: 'packagename', width: 30},
            {
                label: '操作', name: 'opt', index: 'opt', width: 30, formatter: function (cellValue, options, rowObject) {
                    var actionHtml = "<a class='btn btn-default btn-sm' onclick='appGrid.add2AppList(" + rowObject.id + ");'>添加</a>";
                    return actionHtml;
                }
            }
        ],
        viewrecords: true,
        height: 380,
        rowNum: 10,
        rowList: [10, 30, 50],
        rownumWidth: 25,
        autowidth: true,
        multiselect: true,
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
            var grid = $("#appJqGrid");
            grid.closest(".ui-jqgrid-bdiv").css({"overflow-x": "hidden"});
        }
    });

    $("#addAppJqGrid").jqGrid({
        datatype: "local",
        data: appGrid.appList,
        colModel: [
            {label: '应用ID', name: 'appid', index: 'appid', width: 120, key: true},
            {label: '名称', name: 'name', index: 'name', width: 120},
            {
                label: '操作', name: 'opt',
                formatter: function (value, grid, rows, state) {
                    return '<a class="btn btn-default btn-sm" onclick="appGrid.deleteFromAppList(' + rows.appid + ')">删除</a>';
                }
            }
        ],
        viewrecords: true,
        height: 380,
        rowNum: 100,
        rowList: [100],
        rownumbers: true,
        rownumWidth: 25,
        autowidth: true,
        multiselect: true,
        cellEdit: true,
        cellsubmit: 'clientArray',
        pager: "#addAppJqGridPager",
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
            $("#addAppJqGrid").closest(".ui-jqgrid-bdiv").css({"overflow-x": "hidden"});
        }
    });

    $("#addSnnoJqGrid").jqGrid({
        datatype: "local",
        data: snnoGrid.snList,
        colModel: [
            {label: 'sn号', name: 'sn', index: 'sn', width: 120, key: true},
            {
                label: '操作', name: 'opt',
                formatter: function (value, grid, rows, state) {
                    return '<a class="btn btn-default btn-sm" onclick="snnoGrid.deleteFromSnList(\'' + rows.sn + '\')">删除</a>';
                }
            }
        ],
        viewrecords: true,
        height: 380,
        rowNum: 100,
        rowList: [100],
        rownumbers: true,
        rownumWidth: 25,
        autowidth: true,
        multiselect: true,
        cellEdit: true,
        cellsubmit: 'clientArray',
        pager: "#addSnnoJqGridPager",
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
            $("#addSnnoJqGrid").closest(".ui-jqgrid-bdiv").css({"overflow-x": "hidden"});
        }
    });

    appGrid.initDeviceTypeSelect();
    init_upload_com();
});


var precisionPushGrid = new Vue({
    el: '#precisionPushGrid',
    data: {
        pushName: ''
    }
});

var appGrid = new Vue({
    el: '#appGrid',
    data: {
        deviceTypeList: [],
        deviceTypeSelected: '',
        customerMaps: [],
        customerSelected: '',
        queryAddAppName: '',
        appList: []
    },
    methods: {
        addBatch: function () {
            var grid = $("#appJqGrid");
            var rowKey = grid.getGridParam("selrow");
            if (!rowKey) {
                alert("请选择至少一条需要添加的应用");
                return;
            }

            var ids = grid.getGridParam("selarrrow");
            ids.forEach(function (id) {
                var value = grid.getRowData(id);
                var isExist = false;
                for (var index in appGrid.appList) {
                    if (appGrid.appList[index].appid == id) {
                        isExist = true;
                    }
                }
                if (!isExist) {
                    appGrid.appList.push({
                        appid: value.id,
                        name: value.name,
                    });
                }
                if (precisionPushGrid.pushName == "") {
                    precisionPushGrid.pushName = appGrid.appList[0].name
                }
            });
            appGrid.reloadAppList();
        },
        query: function () {
            appGrid.reload();
        },
        reload: function () {
            var queryParam = {
                appName: appGrid.queryAddAppName,
                deviceTypeId: appGrid.deviceTypeSelected,
                customerId: appGrid.customerSelected
            };
            var page = 1;
            $("#appJqGrid").jqGrid('setGridParam', {
                page: page,
                postData: queryParam
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
                    appGrid.deviceTypeList = deviceTypeList;
                    appGrid.deviceTypeSelected = '';
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
                appGrid.customerMaps = customerMaps;
                appGrid.customerSelected = '';
            } else {
                $.get(baseURL + "typecustomermap/info/" + deviceTypeId, function (r) {
                    var customerMaps = r.customerMaps;
                    var all = {customerid: '', customername: '全部'};
                    customerMaps.unshift(all);
                    appGrid.customerMaps = customerMaps;
                    appGrid.customerSelected = '';
                });
            }
        },
        add2AppList: function (id) {
            if (id == null) {
                return;
            }
            var obj = $("#appJqGrid").jqGrid('getRowData', id);
            for (var index in appGrid.appList) {
                // check if exist
                if (appGrid.appList[index].appid == obj.id) {
                    alert("该应用已存在");
                    return;
                }
            }
            appGrid.appList.push({
                appid: obj.id,
                name: obj.name,
            });
            if (precisionPushGrid.pushName == "") {
                precisionPushGrid.pushName = appGrid.appList[0].name
            }
            appGrid.reloadAppList();
        },
        deleteFromAppList: function (selectedId) {
            for (var index in appGrid.appList) {
                if (appGrid.appList[index].appid == selectedId) {
                    appGrid.appList.splice(index, 1);
                    appGrid.reloadAppList();
                    break;
                }
            }
        },
        reloadAppList: function () {
            $("#addAppJqGrid").jqGrid('setGridParam', {
                data: appGrid.appList,
            }).trigger("reloadGrid");
        }
    },
    watch: {
        deviceTypeSelected: function (deviceTypeId) {
            appGrid.initCustomerSelectByDeviceTypeId(deviceTypeId);
        }
    }
});

var snnoGrid = new Vue({
    el: '#snnoGrid',
    data: {
        inputSn: '',
        snList: []
    },
    methods: {
        addSn: function () {
            if (snnoGrid.inputSn.length != 22) {
                alert("sn位数不对，请确认！");
                return;
            }

            for (var index in snnoGrid.snList) {
                // check if exist
                if (snnoGrid.snList[index].sn == snnoGrid.inputSn) {
                    alert("该sn已存在");
                    return;
                }
            }
            snnoGrid.snList.push({
                sn: snnoGrid.inputSn,
            });
            snnoGrid.inputSn = '';
            snnoGrid.reloadSnList();
        },
        reloadSnList: function () {
            $("#addSnnoJqGrid").jqGrid('setGridParam', {
                data: snnoGrid.snList,
            }).trigger("reloadGrid");
        },
        deleteFromSnList: function (sn) {
            console.log(sn);
            for (var index in snnoGrid.snList) {
                if (snnoGrid.snList[index].sn == sn) {
                    snnoGrid.snList.splice(index, 1);
                    snnoGrid.reloadSnList();
                    break;
                }
            }
        }
    },
});

function publishPush() {
    if (snnoGrid.snList.length == 0) {
        alert("sn列表为空");
        return;
    }
    if (appGrid.appList.length == 0) {
        alert("应用列表为空");
        return;
    }
    var postData = {
        name: precisionPushGrid.pushName,
        snList: snnoGrid.snList,
        appList: appGrid.appList,
    }
    $.ajax({
        type: "POST",
        url: baseURL + "appprecisionpush/save",
        contentType: "application/json",
        data: JSON.stringify(postData),
        success: function (r) {
            if (r.status !== 0) {
                alert(r.msg);
            } else {
                alert("发布成功");
                window.location.href = "appprecisionpush.html";
            }
        }
    });
}

function importFromText() {
    var selectedFile = document.getElementById("files").files[0];//获取读取的File对象
    var name = selectedFile.name;//读取选中文件的文件名
    var size = selectedFile.size;//读取选中文件的大小
    console.log("文件名:" + name + "大小：" + size);

    var reader = new FileReader();//这里是核心！！！读取操作就是由它完成的。
    reader.readAsText(selectedFile);//读取文件的内容

    reader.onload = function () {
        var lines = this.result.split("\r\n");
        var failedCount = 0;
        var successCount = 0;
        var existCount = 0;
        var failedMsg = "";
        var isExist = false;
        for (var i = 0; i < lines.length; i++) {
            if (lines[i].length == 22) {
                isExist = false;
                for (var index in snnoGrid.snList) {
                    // check if exist
                    if (snnoGrid.snList[index].sn == lines[i]) {
                        existCount++;
                        failedMsg += "重复:[" + i + "]" + lines[i] + "<br/>";
                        isExist = true;
                        break;
                    }
                }

                if (!isExist) {
                    successCount++;
                    snnoGrid.snList.push({
                        sn: lines[i],
                    });
                }
            } else if (lines[i].length != 0) {
                failedCount++;
                failedMsg += "错误:[" + i + "]" + lines[i] + "<br/>";
            }
        }
        alert('批量添加完成，成功:' + successCount + '失败:' + failedCount + '重复:' + existCount + '<br/>' + '错误列表' + failedMsg);

        // clean reload
        snnoGrid.reloadSnList();
    };
}

function init_upload_com() {
    $('#uploadControl').uploadifive({
        'auto': true,
        'fileTypeDesc': 'Excel Files',
        'removeCompleted': true,
        'multi': false,
        'buttonText': '选择Excel文件',
        'fileType': 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'fileSizeLimit': '50MB',
        'formData': {},
        'queueID': 'fileQueue',
        'uploadScript': baseURL + 'appprecisionpush/importExcel',
        'onUpload': function () {
        },
        'onUploadComplete': function (file, data) {
            var r = JSON.parse(data);
            if (r.code === 0) {
                $('#excelDialog').modal('hide')
                var lines = r.data;
                var failedCount = 0;
                var successCount = 0;
                var existCount = 0;
                var failedMsg = "";
                for (var i = 0; i < lines.length; i++) {
                    if (lines[i].sn.length == 22) {
                        var isExist = false;
                        for (var index in snnoGrid.snList) {
                            // check if exist
                            if (snnoGrid.snList[index].sn == lines[i].sn) {
                                existCount++;
                                failedMsg += "重复:[" + (i + 1) + "]" + lines[i].sn + "<br/>";
                                isExist = true;
                                break;
                            }
                        }

                        if (!isExist) {
                            successCount++;
                            snnoGrid.snList.push({
                                sn: lines[i].sn,
                            });
                        }
                    } else if (lines[i].sn.length != 0) {
                        failedCount++;
                        failedMsg += "错误:[" + i + "]" + lines[i].sn + "<br/>";
                    }
                }
                alert('批量添加完成，成功:' + successCount + '失败:' + failedCount + '重复:' + existCount + '<br/>' + '错误列表' + failedMsg);
                // clean reload
                snnoGrid.reloadSnList();
            } else {
                alert(r.msg);
            }
        }
    });
}