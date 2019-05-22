$(function () {

    $("#jqGrid").jqGrid({
        url: baseURL + 'tttcgroup/list',
        datatype: "json",
        colModel: [
			{ label: 'id', name: 'id', index: 'id', width: 60 },
			{ label: '分组名称', name: 'groupname', index: 'groupName', width: 80 },
			{ label: '分组描述', name: 'groupdesc', index: 'groupDesc', width: 80 },
			{ label: '创建时间', name: 'createtime', index: 'createTime', width: 80 },
            { label: '操作', name: 'opt', width:60,
                formatter: function (value, grid, rows, state) {
                    return '<a class="btn btn-default" btnPermission="tttcgroup:update" onclick="config('+ rows.id +')">配置</a>'
						+ '&nbsp;&nbsp;'
						+ '<a class="btn btn-default" btnPermission="tttcgroup:del" onclick="del('+ rows.id +')">删除</a>';
                }
            }
        ],
		viewrecords: true,
        height: 540,
        rowNum: 10,
		rowList : [10,30,50],
        rownumbers: true, 
        rownumWidth: 25, 
        autowidth:true,
        multiselect: true,
        pager: "#jqGridPager",
        jsonReader : {
            root: "page.list",
            page: "page.currPage",
            total: "page.totalPage",
            records: "page.totalCount"
        },
        prmNames : {
            page:"page", 
            rows:"limit", 
            order: "order"
        },
        gridComplete:function(){
        	//隐藏grid底部滚动条
        	$("#jqGrid").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "hidden" }); 
        	//刷新按钮权限
        	refreshBtnPermission();
        }
    });

    $("#dcJqGrid").jqGrid({
        url: baseURL + 'tttcgroup/listGroupMap',
        datatype: "json",
        colModel: [
            {label: '型号名称', name: 'devicetype', index: 'deviceType', width: 80},
            {label: '渠道名称', name: 'customername', index: 'customerName', width: 80},
            {
                label: '操作', name: 'opt', width: 60,
                formatter: function (value, grid, rows, state) {
                    return '<a class="btn btn-default" onclick="delDC(' + rows.id + ')">删除</a>';
                }
            }
        ],
        viewrecords: true,
        height: 450,
        rowNum: 10,
        rowList: [10, 30, 50],
        rownumbers: true,
        rownumWidth: 25,
        autowidth: true,
        multiselect: true,
        pager: "#dcJqGridPager",
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
            var grid = $("#dcJqGrid");
            grid.closest(".ui-jqgrid-bdiv").css({"overflow-x": "hidden"});
            grid.setGridWidth(700);
        }
    });

     dcTree.initTree();

});

toastr.options = {
    closeButton: false,
    debug: false,
    progressBar: false,
    positionClass: "toast-bottom-center",
    onclick: null,
    showDuration: "300",
    hideDuration: "1000",
    timeOut: "1000",
    extendedTimeOut: "1000",
    showEasing: "swing",
    hideEasing: "linear",
    showMethod: "fadeIn",
    hideMethod: "fadeOut"
};

var dcTree = new Vue({
    el:'#dcTree',
    data: {
        rule: {
            zNodes: [],
            oldNodes: []
        },
        ztree: null,
        setting: {
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
        }
    },
    methods: {
        initTree: function () {
            $.when(
                $.getJSON(baseURL + "typecustomermap/queryAll")
            ).done(function (r, result) {
                var customerMaps = r.customerMaps;
                dcTree.rule.oldNodes = result.result;
                var arr = new Array();
                dcTree.zNodes = [{
                    id: 0,
                    pId: 0,
                    name: "全部",
                    type: "all",
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
                            type: "deviceType",
                            file: "core/standardData"
                        };
                        dcTree.zNodes.push(zDevicetypeNode);
                        arr.push(devicetypeid);
                        // for (var j in dcTree.rule.oldNodes) {
                        //     if (dcTree.rule.oldNodes[j].deviceTypeId === devicetypeid) {
                        //         zDevicetypeNode.checked = true;
                        //     }
                        // }
                    }
                    var zCustomerNode = {
                        id: customerid,
                        pId: devicetypeid,
                        name: customername,
                        type: "customer",
                        file: "core/standardData"
                    };
                    dcTree.zNodes.push(zCustomerNode);
                    // for (var j in dcTree.rule.oldNodes) {
                    //     if (dcTree.rule.oldNodes[j].deviceTypeId == devicetypeid && dcTree.rule.oldNodes[j].customerId == customerid) {
                    //         zCustomerNode.checked = true;
                    //         break;
                    //     }
                    // }
                }
                dcTree.ztree = $.fn.zTree.init($("#modelTree"), dcTree.setting, dcTree.zNodes);
                //折叠所有节点
                dcTree.ztree.expandAll(false);
            });
        },
        containNode: function (data, node) {

            for (var i = 0; i < data.length; i++) {
                if (node.type === 'deviceType' && data[i].devicetypeid === node.id) {
                    return true;
                } else if (node.type === 'customer'
                    && data[i].devicetypeid === node.pId
                    && data[i].customerid === node.id) {
                    return true;
                }
            }

            return false;

        },
        fillTree: function (groupId) {
            var params = {
                "groupId": groupId
            };

            $.ajax({
                type: "POST",
                url: baseURL + 'tttcgroup/queryGroupMap',
                contentType: "application/json",
                data: JSON.stringify(params),
                success: function(r){
                    if(r.status === 0){
                        var data = r.data;
                        var nodes = dcTree.zNodes;
                        nodes.forEach(function (node) {
                            node.checked = dcTree.containNode(data, node);
                        });

                        dcTree.ztree = $.fn.zTree.init($("#modelTree"), dcTree.setting, dcTree.zNodes);
                    }else{
                        alert(r.msg);
                    }


                }
            });

        }

    }
});

var vm = new Vue({
    el:'#app',
    data:{

        router: 'mainPage',

        queryGroupName: '',

        // 表示分组的data
        group: {
            id: null,
            userid: '',
            groupname: '',
            groupdesc: '',
            relationList: []
        },

        // select相关的data
        deviceTypeList: [],
        deviceTypeSelected: '',
        customerMaps: [],
        customerSelected: ''
    },
    methods: {
        query: function () {
            vm.reload();
        },
        toMainPage: function () {
            vm.router = 'mainPage';
            vm.reload();
        },
        toAddGroupPage: function () {
            vm.router = 'addGroupPage';
            vm.group = vm.initGroup();
        },
        toConfigRelationPage: function () {
            var id = getSelectedRow();
            config(id);
        },
        saveGroup: function () {
            if (!vm.group.groupname) {
                toastr.error('请填写组名称');
                return;
            }

            $.ajax({
                type: "POST",
                url: baseURL + "tttcgroup/save",
                contentType: "application/json",
                data: JSON.stringify(vm.group),
                success: function(r){
                    if(r.status === 0){
                        vm.toMainPage();
                        toastr.success('操作成功');
                    }else{
                        alert(r.msg);
                    }
                }
            });
        },
        saveGroupRelation: function () {
            var newNodes = dcTree.ztree.getNodesByFilter(function (node) {
                if (node.level == 2 && node.checked == true) {
                    return true;
                }
            });

            if (newNodes.length === 0) {
                alert("请选择关联的型号渠道")
            }

            vm.group.relationList = [];
            newNodes.forEach(function (node) {
                vm.group.relationList.push({
                    devicetypeid: node.pId,
                    customerid: node.id
                });
            });

            $.ajax({
                type: "POST",
                url: baseURL + "tttcgroup/saveGroupMap",
                contentType: "application/json",
                data: JSON.stringify(vm.group),
                success: function(r){
                    if(r.status === 0){
                        vm.reloadDC();
                        toastr.success('操作成功');
                    }else{
                        alert(r.msg);
                    }
                }
            });
        },
        saveOrUpdate: function () {
            var newNodes = ztree.getNodesByFilter(function (node) {
                if (node.level == 2 && node.checked == true) {
                    return true;
                }
            });

            if (!newNodes) {
                alert("请选择关联的型号渠道")
            }

            var url = vm.ttTcgroup.id == null ? "tttcgroup/save" : "tttcgroup/update";

            var dcData = [];
            newNodes.forEach(function (node) {
                dcData.push({
                    devicetypeid: node.pId,
                    customerid: node.id
                });
            });

            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.ttTcgroup),
                success: function(r){
                    if(r.status === 0){
                        alert('操作成功', function(index){
                            vm.reload();
                            vm.showList = true;
                        });
                    }else{
                        alert(r.msg);
                    }
                }
            });
        },
        del: function () {
            var ids = getSelectedRows();
            if(ids == null){
                return ;
            }

            confirm('确定要删除选中的记录？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "tttcgroup/delete",
                    contentType: "application/json",
                    data: JSON.stringify(ids),
                    success: function(r){
                        if(r.status === 0){
                            alert('操作成功', function(index){
                                $("#jqGrid").trigger("reloadGrid");

                            });
                        }else{
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        delDC: function () {
            var grid = $("#dcJqGrid");
            var rowKey = grid.getGridParam("selrow");
            if(!rowKey){
                alert("请选择一条记录");
                return ;
            }

            var ids = grid.getGridParam("selarrrow");
            if(ids == null){
                return;
            }

            confirm('确定要删除选中的记录？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "tttcgroup/deleteGroupMap",
                    contentType: "application/json",
                    data: JSON.stringify(ids),
                    success: function(r){
                        if(r.status === 0){
                            alert('操作成功', function(){
                                vm.reloadDC();
                                dcTree.fillTree(vm.group.id);
                            });
                        }else{
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        reload: function () {
            var grid = $('#jqGrid');
            var page = grid.jqGrid('getGridParam','page');
            grid.jqGrid('setGridParam',{
                postData: {
                    'groupName': vm.queryGroupName
                },
                page: page
            }).trigger("reloadGrid");
        },
        reloadDC: function () {
            var grid = $('#dcJqGrid');
            var page = grid.jqGrid('getGridParam','page');
            grid.jqGrid('setGridParam',{
                postData: {
                    'groupId': vm.group.id
                },
                page: page
            }).trigger("reloadGrid");
        },
        initGroup: function () {
            return {
                id: null,
                userid: '',
                groupname: '',
                groupdesc: '',
                relationList: []
            };
        },
        addRelation: function () {
            var deviceTypeSelect = document.getElementById('deviceTypeSelect');
            var deviceTypeIndex = deviceTypeSelect.selectedIndex;
            if (deviceTypeIndex === -1) {
                alert("请选择关联渠道");
                return;
            }
            var deviceTypId = deviceTypeSelect.options[deviceTypeIndex].value;
            var deviceType = deviceTypeSelect.options[deviceTypeIndex].text;

            var customerSelect = document.getElementById('customerSelect');
            var customerIndex = customerSelect.selectedIndex;
            if (customerIndex === -1) {
                alert("请选择关联渠道");
                return;
            }
            var customerId = customerSelect.options[customerIndex].value;
            var customer = customerSelect.options[customerIndex].text;

            vm.ttTcgroup.relationList.push({devicetypeid: deviceTypId, devicetype: deviceType, customerid: customerId, customername: customer});
        },
        deleteRelation: function (index) {
            vm.ttTcgroup.relationList.splice(index, 1);
        }
    }
});



// var detailPage = new Vue({
//    el: '#detailPage',
//    data: {
//
//    },
//    method: {
//
//    }
// });

function config(id) {
    if(id == null){
        return ;
    }

    vm.router = 'configRelationPage';

    vm.group = vm.initGroup();
    var grid = $('#jqGrid');
    vm.group.id = grid.jqGrid('getCell', id, 'id');
    vm.group.groupname = grid.jqGrid('getCell', id, 'groupname');
    vm.group.groupdesc = grid.jqGrid('getCell', id, 'groupdesc');

    vm.reloadDC();
    dcTree.fillTree(vm.group.id);

}

function initDeviceTypeSelect() {
    $.get(baseURL + "devicetype/query", function (r) {
        if (r.status === 0) {
            vm.deviceTypeList = r.deviceTypeList;
            vm.deviceTypeIdSelected = '';
        } else {
            alert(r.msg);
        }
    });
}

function getGroupData() {
    $.get(baseURL + "tttcgroup/info/" + vm.ttTcgroup.id, function (r) {
        if (r.status === 0) {
            vm.ttTcgroup = r.ttTcgroup;
            if (typeof(vm.ttTcgroup.relationList) === "undefined") {
                vm.ttTcgroup.relationList = [];
            }
        } else {
            alert(r.msg);
        }
    });
}

function detail(id) {
	vm.title = "详情";
	vm.showList = false;
	vm.modeAdd = false;
	vm.modeEdit = false;
    vm.groupReadable = "readonly";
    vm.groupDesReadable = "readonly";

    var grid = $('#jqGrid');
    vm.ttTcgroup.id = grid.jqGrid('getCell', id, 'id');
    vm.ttTcgroup.groupname = grid.jqGrid('getCell', id, 'groupname');

    console.log("groupIdSelected: " + vm.ttTcgroup.id);
    console.log("groupNameSelected: " + vm.ttTcgroup.groupname);

    getGroupData();
}

function del(id) {
    if(id == null){
        return ;
    }

    var ids = [];
    ids.push(id);

    confirm('确定要删除记录？', function(){
        $.ajax({
            type: "POST",
            url: baseURL + "tttcgroup/delete",
            contentType: "application/json",
            data: JSON.stringify(ids),
            success: function(r){
                if(r.status == 0){
                    alert('操作成功', function(index){
                        $("#jqGrid").trigger("reloadGrid");
                    });
                }else{
                    alert(r.msg);
                }
            }
        });
    });
}

function delDC(id) {
    if(id == null){
        return ;
    }

    var ids = [];
    ids.push(id);

    confirm('确定要删除记录？', function(){
        $.ajax({
            type: "POST",
            url: baseURL + "tttcgroup/deleteGroupMap",
            contentType: "application/json",
            data: JSON.stringify(ids),
            success: function(r){
                if(r.status === 0){
                    alert('操作成功', function(index){
                        vm.reloadDC();
                        dcTree.fillTree(vm.group.id);
                    });
                }else{
                    alert(r.msg);
                }
            }
        });
    });
}
