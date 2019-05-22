$(function () {
    $("#jqGrid").jqGrid({
        url: baseURL + 'uistartpicture/list',
        datatype: "json",
        colModel: [
        	{label: 'id', name: 'id', index: 'id', width: 50, key: true, hidden: true},
            {label: '统计字段', name: 'operateTitle', index: 'operateTitle', width: 30},
            {
                label: '图片',
                name: 'imageUrl',
                index: 'imageUrl',
                width: 70,
                formatter: function (cellValue, options, rowObject) {
                    if (cellValue == null || cellValue == '') {
                        return '<font style="color: red">没上传</font>';
                    }
                    var imgUrl = '<img src="' + baseURL + '/file/download?fullPath=' + cellValue + '" style="width:100px;height:80px;"/>';
                    return imgUrl;
                }
            },
            {label: '倒计时', name: 'countTime', index: 'countTime', width: 30},
            {
                label: '状态',
                name: 'status',
                index: 'status',
                width: 40,
                formatter: function (cellValue, options, rowObject) {
                    if (cellValue == 1) {
                        return '<font style="color: red">正在编辑</font>';
                    }
                    if (cellValue == 2) {
                        return '<font style="color: cornflowerblue">编辑完成</font>';
                    }
                    if (cellValue == 3) {
                        return '<font style="color: blue">发布</font>';
                    }
                    return '<font style="color: #ff7022">未指定</font>';
                }
            }, {
                label: '开始时间',
                name: 'startTime',
                index: 'startTime',
                width: 75,
                formatter: function (cellValue, options, rowObject) {
                    if (cellValue == null) {
                        return '<font style="color: red">没指定</font>';
                    }
                    return cellValue;

                }
            },
            {
                label: '结束时间', name: 'endTime', index: 'endTime', width: 75,
                formatter: function (cellValue, options, rowObject) {
                    if (cellValue == null) {
                        return '<font style="color: red">没指定</font>';
                    }

                    return cellValue;

                }
            },
            {label: '创建时间', name: 'createTime', index: 'createTime', width: 75},
            {label: '更新时间', name: 'updateTime', index: 'updateTime', width: 75},
            {
                label: '跳转类型',
                name: 'intentType',
                index: 'intentType',
                width: 40
            },
            {
                label: '操作', name: 'id', index: 'id', width: 100, formatter: function (cellValue, options, rowObject) {
                return "<a class='btn btn-primary' btnPermission='uistartpicture:mapping' onclick='vm.mapping(\"" + cellValue + "\")'>&nbsp;型号渠道</a> &nbsp;&nbsp;"
                    + "<a class='btn btn-primary' onclick='showDetailVM.showRelationship(\"" + cellValue + "\")'>&nbsp;跳转详情</a>&nbsp;&nbsp;"
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
          //刷新按钮权限
            refreshBtnPermission();
        }
    });
    vm.loadDevicetype();
    $('#uiStartPictureFile').uploadifive(uiStartPictureFileUploadSetting);


    $('#daterangepicker').daterangepicker({
            forceUpdate: true,
            "timePicker": true,
            "timePicker24Hour": true,
            "timePickerSeconds": true,
            "locale": {
                "format": "YYYY-MM-DD HH:mm:ss",
                "separator": " 到 ",
                "applyLabel": "应用",
                "cancelLabel": "取消",
                "daysOfWeek": [
                    "日",
                    "一",
                    "二",
                    "三",
                    "四",
                    "五",
                    "六"
                ],
                "monthNames": [
                    "一月",
                    "二月",
                    "三月",
                    "四月",
                    "五月",
                    "六月",
                    "七月",
                    "八月",
                    "九月",
                    "十月",
                    "十一月",
                    "十二月"
                ],
                "firstDay": 1
            }
        },
        function (startDate, endDate, period) {
            vm.uiStartPicture.startTime = startDate.format('YYYY-MM-DD HH:mm:ss');
            vm.uiStartPicture.endTime = endDate.format('YYYY-MM-DD HH:mm:ss');
        }
    );
});


var showDetailVM = new Vue({
    el: '#showDetailsInfo',
    data: {
        uiStartPicture: {},
        chooseApp: false,
        chooseAction: false,
        items: []

    },
    methods: {
        showRelationship: function (id) {
            $.get(baseURL + "uistartpicture/info/" + id, function (r) {
                    showDetailVM.uiStartPicture = r.uiStartPicture;
                    if (r.uiStartPicture.parameters == null) {
                        showDetailVM.items = [];
                    } else {
                        showDetailVM.items = JSON.parse(r.uiStartPicture.parameters);
                    }
                    if (r.uiStartPicture.intentType == 'App') {
                        showDetailVM.chooseApp = true;
                        showDetailVM.chooseAction = false;

                    }

                    if (r.uiStartPicture.intentType == 'Action') {
                        showDetailVM.chooseApp = false;
                        showDetailVM.chooseAction = true;
                    }
                }
            );

            $("#showDetailsInfo").modal("show");

        }
    }
});


var vm = new Vue({
    el: '#rrapp',
    data: {
        showList: true,
        title: null,
        addOrUpdate: false,
        queryParam: {
            devicetypeList: [],
            customerList: [],
            devicetypeid: "",
            customerid: ""
        },
        uiStartPicture: {},
        items: [{
            key: 'packageName',
            value: ''
        }]

    },
    methods: {
        query: function () {
            vm.reload();
        },
        mapping: function (id) {
            relationshipVM.getInfo(id);
            $("#addRelationship").modal("show");
        },
        add: function () {
            var now = moment();
            $('#daterangepicker').data('daterangepicker').setStartDate(now.format("YYYY-MM-DD HH:mm:ss"));
            $('#daterangepicker').data('daterangepicker').setEndDate(now.add(1, 'years').format("YYYY-MM-DD HH:mm:ss"));

            vm.showList = false;
            vm.title = "新增";
            vm.uiStartPicture = {};
            vm.uiStartPicture.startTime = moment().format("YYYY-MM-DD HH:mm:ss");
            vm.uiStartPicture.endTime = moment().add(1, 'years').format("YYYY-MM-DD HH:mm:ss");
            vm.addOrUpdate = false;
            vm.items = [{
                key: 'packageName',
                value: ''
            }];
            vm.uiStartPicture.intentType = "Action";
            vm.uiStartPicture.action = "com.mipt.store.intent.APPID";
            vm.uiStartPicture.packageName = "com.mipt.store";
            $("#uiStartPictureSrc").removeAttr("src");
            $("#uiStartPictureSrc").css("display", "none");
        },
        update: function (event) {
            var id = getSelectedRow();
            if (id == null) {
                return;
            }
            vm.showList = false;
            vm.title = "修改";
            vm.addOrUpdate = true;

            vm.getInfo(id)
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
        saveOrUpdate: function (event) {

            var url = vm.uiStartPicture.id == null ? "uistartpicture/save" : "uistartpicture/update";

            // items 装为 字符串 记录
            if (vm.items == null || vm.items.length == 0) {
                vm.uiStartPicture.parameters = null;
            } else {
                vm.uiStartPicture.parameters = JSON.stringify(vm.items);
            }


            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.uiStartPicture),
                success: function (r) {
                    if (r.status == 0) {
                        alert('操作成功', function (index) {
                            vm.reload();
                        });
                    } else {
                        alert(r.msg);
                    }
                    // 修改或者新增成功之后删除 图片预览
                    main.removeIcon('uiStartPictureSrc', 'noConfirm')
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
                    url: baseURL + "uistartpicture/delete",
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
        getInfo: function (id) {
            $.get(baseURL + "uistartpicture/info/" + id, function (r) {
                vm.uiStartPicture = r.uiStartPicture;

                if (vm.uiStartPicture.imageUrl != null && vm.uiStartPicture.imageUrl != '') {
                    $("#uiStartPictureSrc").attr("src", baseURL + '/file/download?fullPath=' + vm.uiStartPicture.imageUrl);
                    $("#uiStartPictureSrc").css("display", "block");
                } else {
                    $("#uiStartPictureSrc").removeAttr("src");
                    $("#uiStartPictureSrc").css("display", "none");
                }

                if (r.uiStartPicture.parameters == null) {
                    vm.items = [];
                } else {
                    vm.items = JSON.parse(r.uiStartPicture.parameters);
                }

                if (vm.uiStartPicture.startTime == null) {
                    vm.uiStartPicture.startTime = moment().format("YYYY-MM-DD HH:mm:ss");
                }
                if (vm.uiStartPicture.endTime == null) {
                    vm.uiStartPicture.endTime = moment().add(1, 'years').format("YYYY-MM-DD HH:mm:ss");
                }

                $('#daterangepicker').data('daterangepicker').setStartDate(vm.uiStartPicture.startTime);
                $('#daterangepicker').data('daterangepicker').setEndDate(vm.uiStartPicture.endTime);

            });
        },
        reload: function (event) {
            vm.showList = true;
            var page = $("#jqGrid").jqGrid('getGridParam', 'page');
            var params = {
                deviceTypeId: vm.queryParam.devicetypeid,
                customerId: vm.queryParam.customerid
            };

            $("#jqGrid").jqGrid('setGridParam', {
                page: page,
                postData: params
            }).trigger("reloadGrid");
        }, /**加载型号*/
        loadDevicetype: function () {
            $.get(baseURL + "devicetype/query", function (r) {
                vm.queryParam.devicetypeList = [];
                for (var i in r.deviceTypeList) {
                    var deviceType = {};
                    deviceType.devicetype = r.deviceTypeList[i].devicetype;
                    deviceType.devicetypeid = r.deviceTypeList[i].devicetypeid;
                    vm.queryParam.devicetypeList.push(deviceType);
                }
                vm.loadCustomer();
            });
        },
        /**加载渠道*/
        loadCustomer: function () {

            vm.queryParam.customerList = [];
            var devicetypeid = vm.queryParam.devicetypeid;
            //全部渠道
            if (devicetypeid == "") {
                $.get(baseURL + "customer/query", function (r) {
                    for (var i in r.customers) {
                        var customer = {};
                        customer.customerid = r.customers[i].customerid;
                        customer.customername = r.customers[i].customername;
                        vm.queryParam.customerList.push(customer);
                    }
                });
            } else {
                $.get(baseURL + "typecustomermap/info/" + devicetypeid, function (r) {
                    for (var i in r.customerMaps) {
                        var customer = {};
                        customer.customerid = r.customerMaps[i].customerid;
                        customer.customername = r.customerMaps[i].customername;
                        vm.queryParam.customerList.push(customer);
                    }
                });
            }
        },
        devidetypeSelect: function (event) {
            vm.loadCustomer();
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


var setting = {
    data: {
        simpleData: {
            enable: true,
            idKey: "id",
            pIdKey: "pId",
            rootPId: -1
        },
        key: {
            url: "nourl"
        }
    },
    check: {
        enable: true,
        nocheckInherit: true
    }
};
var ztree;
var relationshipVM = new Vue({
    el: '#addRelationship',
    data: {
        rule: {
            zNodes: [],
            oldNodes: []
        },
        startpictureid: null,
        groupId: "",
        groudItems: []
    },
    methods: {
        getInfo: function (id) {
            relationshipVM.startpictureid = id;
            relationshipVM.groupId = "";
            //加载型号树
            $.when(
                $.getJSON(baseURL + "typecustomermap/queryAll"),
                $.getJSON(baseURL + "uistartpicturetcmap/findObjectByStartpictureid", {startpictureid: id})
            ).done(function (r, result) {
                var customerMaps = r[0].customerMaps;
                relationshipVM.rule.oldNodes = result[0].result;
                var arr = new Array();
                relationshipVM.zNodes = [{
                    id: 0,
                    pId: 0,
                    name: "全部",
                    open: true
                }];
                for (var i in customerMaps) {
                    var devicetypeid = customerMaps[i].devicetypeid;
                    var devicetype = customerMaps[i].devicetype;
                    var customerid = customerMaps[i].customerid;
                    var customername = customerMaps[i].customername;
                    if (!isInArray(arr, devicetypeid)) {
                        var zDevicetypeNode = {
                            id: devicetypeid,
                            pId: 0,
                            name: devicetype,
                            file: "core/standardData"
                        };
                        relationshipVM.zNodes.push(zDevicetypeNode);
                        arr.push(devicetypeid);
                        for (var j in relationshipVM.rule.oldNodes) {
                            if (relationshipVM.rule.oldNodes[j].deviceTypeId == devicetypeid) {
                                zDevicetypeNode.checked = true;
                            }
                        }
                    }
                    var zCustomerNode = {
                        id: customerid,
                        pId: devicetypeid,
                        name: customername,
                        file: "core/standardData"
                    };
                    relationshipVM.zNodes.push(zCustomerNode);
                    for (var j in relationshipVM.rule.oldNodes) {
                        if (relationshipVM.rule.oldNodes[j].deviceTypeId == devicetypeid && relationshipVM.rule.oldNodes[j].customerId == customerid) {
                            zCustomerNode.checked = true;
                            break;
                        }
                    }
                }
                ztree = $.fn.zTree.init($("#modelTree"), setting, relationshipVM.zNodes);
                //折叠所有节点
                ztree.expandAll(false);
            });


            // 加载分组信息

            $.ajax({
                type: "GET",
                url: baseURL + "tttcgroup/queryAllObjectList",
                success: function (r) {
                    if (r.status == 0) {
                        relationshipVM.groudItems = r.result;
                    } else {
                        alert("加载分组信息下拉框失败");
                    }

                },
                error: function () {
                    alert("请求失败,请联系管理员");
                }
            });


        },
        saveOrUpdate: function (event) {
            loading("加载中，请稍后...");

            var param = {
                addNodes: "",
                delNodes: "",
                groupId: "",
                startpictureid: relationshipVM.startpictureid
            };

            if (relationshipVM.groupId == "") {
                var delNodes = [];
                var addNodes = [];
                var newNodes = ztree.getNodesByFilter(function (node) {
                    if (node.level == 2 && node.checked == true) {
                        return true;
                    }
                });
                var oldNodes = relationshipVM.rule.oldNodes;


                for (var i in oldNodes) {
                    var exit = false;
                    for (var j in newNodes) {
                        if (newNodes[j].pId == oldNodes[i].deviceTypeId && newNodes[j].id == oldNodes[i].customerId) {
                            exit = true;
                            break;
                        }
                    }
                    if (!exit) {
                        delNodes.push(oldNodes[i].id);
                    }
                }

                // pId ==> deviceTypeId
                // id  ==> customerId
                for (var i in newNodes) {
                    var node = relationshipVM.startpictureid + "_" + newNodes[i].pId + "_" + newNodes[i].id;
                    addNodes.push(node);
                }
                param.addNodes = addNodes.toString();
                param.delNodes = delNodes.toString();
            } else {
                param.groupId = relationshipVM.groupId;
            }
            var url = "uistartpicturetcmap/saveinbatch";
            $.ajax({
                type: "POST",
                url: baseURL + url,
                dataType: "json",
                data: param,
                success: function (r) {
                    if (r.status == 0) {
                        alert('提交成功', function (index) {
                            closeLoading();
                            $('#addRelationship').modal('hide')
                            vm.reload();
                        });
                    } else {
                        alert(r.msg);
                        closeLoading();
                    }
                },
                error: function () {
                    closeLoading();
                    alert("请求失败,请联系管理员");
                }
            });
        }

    }
});


var main = {
    uiStartPictureCallback: function (file, data) {
        var jsonObj = JSON.parse(data);
        var status = jsonObj.status;
        var msg = jsonObj.msg;
        if (status == 0) {
            var fileName = file.name;
            var filePath = jsonObj.filePath;
            vm.uiStartPicture.imageUrl = filePath;
            $("#uiStartPictureSrc").attr("src", baseURL + '/file/download?fullPath=' + filePath);
            $("#uiStartPictureSrc").css("display", "block");
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
                vm.uiStartPicture.imageUrl = null;
                alert("删除成功！");
            });
        } else {
            $("#" + id).removeAttr("src");
            $("#" + id).css("display", "none");
            vm.uiStartPicture.imageUrl = null;
        }

    }
};
