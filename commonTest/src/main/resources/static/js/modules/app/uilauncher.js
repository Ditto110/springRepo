$(function () {
    $("#jqGrid").jqGrid({
        url: baseURL + 'uilauncher/list',
        datatype: "json",
        colModel: [
            {label: '名称', name: 'names', index: 'names', width: 80},
            {
                label: '状态',
                name: 'status',
                index: 'status',
                width: 80,
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
            {label: '描述', name: 'description', index: 'description', width: 80},
            {label: '修改时间', name: 'updateTime', index: 'updateTime', width: 80},
            {
                label: '型号渠道', width: 120, formatter: function (cellValue, options, rowObject) {
                    var detailHtml = "<a class='btn btn-primary' onclick='vm.showMappingDetail(" + rowObject.id + ");'>&nbsp;详情</a>&nbsp;&nbsp;"
                    var tcmap = [];
                    for (var index in rowObject.tcmap) {
                        tcmap.push(rowObject.tcmap[index].mapString);
                    }
                    var detailObject = {id: rowObject.id, name: rowObject.names, tcmap: tcmap}
                    vm.mappingDetails.push(detailObject);
                    return detailHtml;
                }
            },
            {
                label: '操作', name: 'id', index: 'id', width: 120, formatter: function (cellValue, options, rowObject) {
                    var parameters = cellValue + "_" + rowObject.names;
                    var actionHtml = "<a class='btn btn-primary' btnPermission='uilauncher:firstTitle' onclick='vm.firstTitle(" + rowObject.id + ",\"" + rowObject.names + "\");'>&nbsp;一级标题</a>&nbsp;&nbsp;"
                        + "<a class='btn btn-primary' btnPermission='uilauncher:mapping' onclick='vm.mapping(\"" + parameters + "\")'>&nbsp;型号渠道映射</a>&nbsp;&nbsp;"
                    return actionHtml;
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

    vm.loadqueryItems();
    vm.loadDevicetype();
});

var vm = new Vue({
    el: '#rrapp',
    data: {
        showList: true,
        title: null,
        uiLauncher: {},
        queryParameters: {},
        launcherItems: [],
        mappingDetails: [],
        launcherid: null,
        addOrUpdate: false,
        status: null,
        queryParam: {
            devicetypeList: [],
            customerList: [],
            devicetypeid: "",
            customerid: ""
        },
        originLauncherId: null
    },
    methods: {
        loadqueryItems: function () {
            $.ajax({
                type: "GET",
                url: baseURL + "uilauncher/findAllName",
                contentType: "application/json",
                success: function (r) {
                    if (r.status == 0) {
                        vm.launcherItems = r.result;
                    } else {
                        alert("加载参数查询下拉框信息失败");
                    }
                }
            });
        },
        copy: function () {

            var id = getSelectedRow();
            if (id == null) {
                return;
            }
            vm.originLauncherId = id;
            layer.open({
                type: 2,
                title: '主界面复制',
                shadeClose: true,
                shade: 0.8,
                area: ['80%', '90%'],
                content: '/appstore/admin/app/copylauncher.html'
            });
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
            vm.uiLauncher = {};
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
            var url = vm.uiLauncher.id == null ? "uilauncher/save" : "uilauncher/update";
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.uiLauncher),
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
        del: function (event) {
            var ids = getSelectedRows();
            if (ids == null) {
                return;
            }

            confirm('确定要删除选中的记录？注意模板设计内容也会一起删除', function () {
                $.ajax({
                    type: "POST",
                    url: baseURL + "uilauncher/delete",
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
            $.get(baseURL + "uilauncher/info/" + id, function (r) {
                vm.uiLauncher = r.uiLauncher;
            });
        },
        reload: function (event) {
            vm.showList = true;
            var page = $("#jqGrid").jqGrid('getGridParam', 'page');
            $("#jqGrid").jqGrid('setGridParam', {
                page: page,
                postData: {
                    id: vm.launcherid,
                    status: vm.status,
                    deviceTypeId: vm.queryParam.devicetypeid,
                    customerId: vm.queryParam.customerid
                }
            }).trigger("reloadGrid");
            vm.mappingDetails = [];
        },
        firstTitle: function (id, navTitle) {

            var data = {
                launcherid: id,
                titleLevel: 1
            };

            parent.vm.navTitle2 = navTitle;
            //parent.document.getElementById("nav_title_navTitle_2").innerHTML = navTitle;
            window.location.href = baseURL + "/admin/app/uititle.html?" + $.param(data);
        },
        mapping: function (paramtes) {

            var p = paramtes.split("_");
            relationshipVM.launcherName = p[1];
            relationshipVM.getInfo(p[0]);
            $("#addRelationship").modal("show");
        },
        showMappingDetail: function (id) {
            var resultHtml = "";
            for (var index in vm.mappingDetails) {
                if (id == vm.mappingDetails[index].id) {
                    $("#mappingDetailListName").html(vm.mappingDetails[index].name);
                    vm.mappingDetails[index].tcmap.sort();
                    for (var i in vm.mappingDetails[index].tcmap) {
                        resultHtml += vm.mappingDetails[index].tcmap[i] + "<br/>";
                    }
                }
            }
            $("#mappingDetailList").html(resultHtml);
            $("#showRelationDetail").modal("show");
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
        launcherid: null,
        launcherName: "",
        groupId: "",
        groudItems: []
    },
    methods: {
        getInfo: function (id) {
            relationshipVM.launcherid = id;
            relationshipVM.groupId = "";
            //加载型号树
            $.when(
                $.getJSON(baseURL + "typecustomermap/queryAll"),
                $.getJSON(baseURL + "uilaunchertcmap/findObjectByLauncherid", {launcherid: id})
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
                launcherid: relationshipVM.launcherid
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
                    var node = relationshipVM.launcherid + "_" + newNodes[i].pId + "_" + newNodes[i].id;
                    addNodes.push(node);
                }
                param.addNodes = addNodes.toString();
                param.delNodes = delNodes.toString();
            } else {
                param.groupId = relationshipVM.groupId;
            }
            var url = "uilaunchertcmap/saveinbatch";
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
                    alert("请求失败,请联系管理员");
                }
            });
        }

    }
});