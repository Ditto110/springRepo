$(function () {
    $("#jqGrid").jqGrid({
        url: baseURL + 'uibackground/list',
        datatype: "json",
        colModel: [
            {label: 'id', name: 'id', index: 'id', width: 50, key: true, hidden: true},
            {
                label: '背景图片',
                name: 'imageUrl',
                index: 'imageUrl',
                width: 80,
                formatter: function (cellValue, options, rowObject) {
                    if (cellValue == null || cellValue == '') {
                        return '<font style="color: red">没上传</font>';
                    }
                    var imgUrl = '<img src="' + baseURL + '/file/download?fullPath=' + cellValue + '" style="width:100px;height:80px;"/>';
                    return imgUrl;
                }
            },
            {
                label: '状态',
                name: 'status',
                index: 'status',
                width: 50,
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
            },
            {
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
                label: '操作', name: 'id', index: 'id', width: 80, formatter: function (cellValue, options, rowObject) {
                return "<a class='btn btn-primary' btnPermission='uibackground:mapping' onclick='vm.mapping(\"" + cellValue + "\")'>&nbsp;型号渠道映射</a>"
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
    $('#uiBackgroundFile').uploadifive(uiBackgroundFileUploadSetting);


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
            vm.uiBackground.startTime = startDate.format('YYYY-MM-DD HH:mm:ss');
            vm.uiBackground.endTime = endDate.format('YYYY-MM-DD HH:mm:ss');
        }
    );


});

var vm = new Vue({
    el: '#rrapp',
    data: {
        showList: true,
        title: null,
        queryParam: {
            devicetypeList: [],
            customerList: [],
            devicetypeid: "",
            customerid: ""
        },
        addOrUpdate: false,
        uiBackground: {}
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
            vm.uiBackground = {};
            if (vm.uiBackground.startTime == null) {
                vm.uiBackground.startTime = moment().format("YYYY-MM-DD HH:mm:ss");
            }
            if (vm.uiBackground.endTime == null) {
                vm.uiBackground.endTime = moment().add(1, 'years').format("YYYY-MM-DD HH:mm:ss");
            }
            vm.addOrUpdate = false;
            $("#uiBackgroundPictureSrc").removeAttr("src");
            $("#uiBackgroundPictureSrc").css("display", "none");
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
        saveOrUpdate: function (event) {
            var url = vm.uiBackground.id == null ? "uibackground/save" : "uibackground/update";
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.uiBackground),
                success: function (r) {
                    if (r.status == 0) {
                        alert('操作成功', function (index) {
                            vm.reload();
                        });
                    } else {
                        alert(r.msg);
                    }

                    main.removeIcon('uiBackgroundPictureSrc', 'noConfirm');
                },
                error: function () {
                    alert("请求失败,请联系管理员");
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
                    url: baseURL + "uibackground/delete",
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
            $.get(baseURL + "uibackground/info/" + id, function (r) {
                vm.uiBackground = r.uiBackground;


                if (vm.uiBackground.startTime == null) {
                    vm.uiBackground.startTime = moment().format("YYYY-MM-DD HH:mm:ss");
                }
                if (vm.uiBackground.endTime == null) {
                    vm.uiBackground.endTime = moment().add(1, 'years').format("YYYY-MM-DD HH:mm:ss");
                }

                $('#daterangepicker').data('daterangepicker').setStartDate(vm.uiBackground.startTime);
                $('#daterangepicker').data('daterangepicker').setEndDate(vm.uiBackground.endTime);


                if (vm.uiBackground.imageUrl != null && vm.uiBackground.imageUrl != '') {

                    $("#uiBackgroundPictureSrc").attr("src", baseURL + '/file/download?fullPath=' + vm.uiBackground.imageUrl);
                    $("#uiBackgroundPictureSrc").css("display", "block");

                } else {

                    $("#uiBackgroundPictureSrc").removeAttr("src");
                    $("#uiBackgroundPictureSrc").css("display", "none");

                }


            });
        },
        reload: function (event) {
            vm.showList = true;
            var page = $("#jqGrid").jqGrid('getGridParam', 'page');
            var param = {
                deviceTypeId: vm.queryParam.devicetypeid,
                customerId: vm.queryParam.customerid
            };
            $("#jqGrid").jqGrid('setGridParam', {
                page: page,
                postData: param
            }).trigger("reloadGrid");
        },
        /**加载型号*/
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
        backgroundid: null,
        groupId: "",
        groudItems: []
    },
    methods: {
        getInfo: function (id) {
            relationshipVM.backgroundid = id;
            relationshipVM.groupId = "";
            //加载型号树
            $.when(
                $.getJSON(baseURL + "typecustomermap/queryAll"),
                $.getJSON(baseURL + "uibackgroundtcmap/findObjectByBackgroundid", {backgroundid: id})
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
                backgroundid: relationshipVM.backgroundid
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
                    var node = relationshipVM.backgroundid + "_" + newNodes[i].pId + "_" + newNodes[i].id;
                    addNodes.push(node);
                }
                param.addNodes = addNodes.toString();
                param.delNodes = delNodes.toString();

            } else {
                param.groupId = relationshipVM.groupId;
            }
            var url = "uibackgroundtcmap/saveinbatch";
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

                }
            });
        }

    }
});


var main = {
    uiBackgroundPictureCallback: function (file, data) {
        var jsonObj = JSON.parse(data);
        var status = jsonObj.status;
        var msg = jsonObj.msg;
        if (status == 0) {
            var fileName = file.name;
            var filePath = jsonObj.filePath;
            vm.uiBackground.imageUrl = filePath;
            $("#uiBackgroundPictureSrc").attr("src", baseURL + '/file/download?fullPath=' + filePath);
            $("#uiBackgroundPictureSrc").css("display", "block");
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
                vm.uiBackground.imageUrl = null;
                alert("删除成功！");
            });
        } else {
            $("#" + id).removeAttr("src");
            $("#" + id).css("display", "none");
            vm.uiBackground.imageUrl = null;
        }
    }
};
