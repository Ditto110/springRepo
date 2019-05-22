$(function () {


    $("#jqGrid").jqGrid({
        url: baseURL + 'trecommend/list',
        datatype: "json",
        colModel: [        	
        	{label: '统计字段', name: 'operateTitle', index: 'operateTitle', width: 100},
            {label: '项目名称', name: 'name', index: 'name', width: 100},
            {label: '推荐语', name: 'description', index: 'description', width: 100},
            {
                label: '背景图片', name: 'imageUrl', index: 'imageUrl', width: 80,
                formatter: function (cellValue, options, rowObject) {
                    if (cellValue == null || cellValue == '') {
                        return '<font style="color: red">没上传</font>';
                    }
                    var imgUrl = '<img src="' + baseURL + 'file/download?fullPath=' + cellValue + '" style="width:100px;height:80px;"/>';
                    return imgUrl;
                }
            },
            {label: '排序', name: 'sort', index: 'sort', width: 25},
            {
                label: '推荐位用途',
                name: 'uses',
                index: 'uses',
                width: 50,
                formatter: function (cellValue, options, rowObject) {
                    if (cellValue == 'search') {
                        return '搜索推荐位';
                    }
                    if (cellValue == 'detail') {
                        return '详情推荐位';
                    }
                    return "未指定";
                }
            }, {
                label: '状态',
                name: 'status',
                index: 'status',
                width: 45,
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
            {label: '创建时间', name: 'createTime', index: 'createTime', width: 80},
            {label: '修改时间', name: 'updateTime', index: 'updateTime', width: 80},
            {
                label: '操作', name: 'id', index: 'id', width: 120, formatter: function (cellValue, options, rowObject) {
                return "<a class='btn btn-primary' btnPermission='trecommend:mapping' onclick='vm.mapping(\"" + cellValue + "\")'>&nbsp;型号渠道</a> &nbsp;&nbsp;"
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
    $('#recommendImgFile').uploadifive(uploadRecommendImgUploadSetting);

});

var showDetailVM = new Vue({
    el: '#showDetailsInfo',
    data: {
        tRecommend: {},
        chooseAction: true,
//        chooseApp: false,
//        chooseBroadcast: false,
//        chooseUrl: false,
        items: []

    },
    methods: {
        showRelationship: function (id) {
            $.get(baseURL + "trecommend/info/" + id, function (r) {
                    showDetailVM.tRecommend = r.tRecommend;
                    if (r.tRecommend.parameters == null) {
                        showDetailVM.items = [];
                    } else {
                        showDetailVM.items = JSON.parse(r.tRecommend.parameters);
                    }

                    if (r.tRecommend.intentType == 'Action') {
                        showDetailVM.chooseAction = true;
//                        showDetailVM.chooseApp = false;
//                        showDetailVM.chooseBroadcast = false;
//                        showDetailVM.chooseUrl = false;
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
        tRecommend: {},
        chooseAction: true,
//        chooseApp: false,
//        chooseBroadcast: false,
//        chooseUrl: false,
        items: [],
        queryParam: {
            devicetypeList: [],
            customerList: [],
            devicetypeid: "",
            customerid: ""
        },
        addOrUpdate: false
    },
    methods: {
        initParameter: function () {
            vm.tRecommend.className = null;
            vm.tRecommend.intentType = "Action";
            vm.tRecommend.packageName = "com.mipt.store";
            vm.tRecommend.action = "com.mipt.store.intent.APPID";
            vm.tRecommend.uriString = null;
            vm.tRecommend.parameters = null;
            vm.tRecommend.operateTitle = null;
        },
        init: function () {
            vm.chooseAction = true;
//            vm.chooseApp = false;
//            vm.chooseBroadcast = false;
//            vm.chooseUrl = false;
            vm.tRecommend = {};
        },
        mapping: function (id) {
            relationshipVM.getInfo(id);
            $("#addRelationship").modal("show");
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


            var devicetypeid = vm.queryParam.devicetypeid;

            vm.queryParam.customerList = [];
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
        query: function () {
            vm.reload();
        },
        add: function () {
            vm.showList = false;
            vm.title = "新增";
            vm.addOrUpdate = false;
            $("#recommendImgSrc").removeAttr("src");
            $("#recommendImgSrc").css("display", "none");
            vm.init();
            vm.initParameter();
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
            var url = vm.tRecommend.id == null ? "trecommend/save" : "trecommend/update";

            // items 装为 字符串 记录
            if (vm.items == null || vm.items.length == 0) {
                vm.tRecommend.parameters = null;
            } else {
                vm.tRecommend.parameters = JSON.stringify(vm.items);
            }

            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.tRecommend),
                success: function (r) {
                    if (r.status === 0) {
                        alert('操作成功', function (index) {
                            vm.reload();
                        });
                    } else {
                        alert(r.msg);
                    }
                    main.removeIcon('recommendImgSrc', 'unConfirm')
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
                    url: baseURL + "trecommend/delete",
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
                    }
                });
            });
        },
        getInfo: function (id) {
            $.get(baseURL + "trecommend/info/" + id, function (r) {
                vm.tRecommend = r.tRecommend;

                if (vm.tRecommend.imageUrl != null && vm.tRecommend.imageUrl != '') {

                    $("#recommendImgSrc").attr("src", baseURL + '/file/download?fullPath=' + vm.tRecommend.imageUrl);
                    $("#recommendImgSrc").css("display", "block");

                } else {

                    $("#recommendImgSrc").removeAttr("src");
                    $("#recommendImgSrc").css("display", "none");

                }


                if (r.tRecommend.parameters == null) {
                    vm.items = [];
                } else {
                    vm.items = JSON.parse(r.tRecommend.parameters);
                }

                if (r.tRecommend.intentType == 'Action') {
                	vm.chooseAction = true;
//                    vm.chooseApp = false;
//                    vm.chooseBroadcast = false;
//                    vm.chooseUrl = false;
                }

            });
        },
        reload: function (event) {
            vm.showList = true;
            var param = {
                deviceTypeId: vm.queryParam.devicetypeid,
                customerId: vm.queryParam.customerid
            };
            var page = $("#jqGrid").jqGrid('getGridParam', 'page');
            $("#jqGrid").jqGrid('setGridParam', {
                postData: param,
                page: page
            }).trigger("reloadGrid");
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
        trecommendid: null,
        groupId: "",
        groudItems: []
    },
    methods: {
        getInfo: function (id) {
            relationshipVM.trecommendid = id;
            relationshipVM.groupId = "";
            //加载型号树
            $.when(
                $.getJSON(baseURL + "typecustomermap/queryAll"),
                $.getJSON(baseURL + "trecommendtcmap/findObjectByTrecommendid", {trecommendid: id})
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

                }
            });


        },
        saveOrUpdate: function (event) {
            loading("加载中，请稍后...");
            var param = {
                addNodes: "",
                delNodes: "",
                groupId: "",
                trecommendid: relationshipVM.trecommendid
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
                    var node = relationshipVM.trecommendid + "_" + newNodes[i].pId + "_" + newNodes[i].id;
                    addNodes.push(node);
                }
                param.addNodes = addNodes.toString();
                param.delNodes = delNodes.toString();

            } else {
                param.groupId = relationshipVM.groupId;
            }
            var url = "trecommendtcmap/saveinbatch";
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
    uploadRecommendImgFileCallback: function (file, data) {
        var jsonObj = JSON.parse(data);
        var status = jsonObj.status;
        var msg = jsonObj.msg;
        if (status == 0) {
            var fileName = file.name;
            var filePath = jsonObj.filePath;
            vm.tRecommend.imageUrl = filePath;
            $("#recommendImgSrc").attr("src", baseURL + '/file/download?fullPath=' + filePath);
            $("#recommendImgSrc").css("display", "block");
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
                vm.tRecommend.imageUrl = null;
                alert("删除成功！");
            });
        } else {
            $("#" + id).removeAttr("src");
            $("#" + id).css("display", "none");
            vm.tRecommend.imageUrl = null;
        }

    }
};
