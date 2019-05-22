$(function () {
    $("#jqGrid").jqGrid({
        url: baseURL + 'tuappsprovide/list',
        datatype: "json",
        colModel: [
            {label: '应用名称', name: 'appname', index: 'appName' },
            {label: '应用包名', name: 'packagename', index: 'packageName' },
            {
                label: '是否发布', name: 'hide', index: 'hide', width: '80px',
                formatter: function (value, grid, rows, state) {
                    if (value === 0) {
                        return '<span class="label label-success">已发布</span>';
                    } else {
                        return '<span class="label label-danger">未发布</span>'
                    }
                }
            },
            {
                label: '投放的型号渠道', name: 'dc',
                formatter: function (value, grid, rows, state) {
                    return '<a class="btn btn-default btn-sm" data-toggle="modal" data-target="#dcModal" data-id="' + rows.id + '" data-act="detail">查看</a>'
                        + '&nbsp;'
                        + '<a class="btn btn-default btn-sm" data-toggle="modal" data-target="#dcModal" data-id="' + rows.id + '" data-act="edit">配置</a>';
                }
            },
            { label: '最大安装数', name: 'maxinstall', index: 'maxInstall', editable:true, editrules:{number:true}, width: '80px' },
            { label: '已安装数', name: 'countofinstall', index: 'countOfInstall', width: '80px' },
            {
                label: '是否限制安装数', name: 'numberlimit', index: 'numberLimit', width: '100px', editable:true,
                edittype:'select',editoptions:{value:{0:'不限制', 1:'限制'}},
                formatter: function (value, grid, rows, state) {
                    console.log(value);
                    if (value == 0) {
                        return '<span class="label label-success">不限制</span>'
                    } else {
                        return '<span class="label label-danger">限制</span>';
                    }
                }
            },
            {
                label: '图片', name: 'pic',
                formatter: function (value, grid, rows, state) {
                    return '<a class="btn btn-default btn-sm" data-toggle="modal" data-target="#picModal" data-id="' + rows.id + '" data-act="detail">查看</a>'
                        + '&nbsp;'
                        + '<a class="btn btn-default btn-sm" data-toggle="modal" data-target="#picModal" data-id="' + rows.id + '" data-act="push">上传</a>';
                }
            },
            {
                label: '排序', name: 'sort', index: 'sort', width: '60px', editable:true, editrules:{number:true},
                formatter: function (value, grid, rows, state) {
                    return value == null ? 0 : value;
                }
            },
            {
                label: '最近下载时间', name: 'taskcompletetime',
                formatter: function (value, grid, rows) {
                    if (value == null) {
                        return '应用暂未被下载安装'
                    }
                    return value;
                }
            },
            {
                label: '操作', name: 'opt',
                formatter: function (value, grid, rows, state) {

                    var pbtn = rows.hide === 0 ? '<a class="btn btn-danger btn-sm" btnPermission="tuappsprovide:cancelPublish" onclick="cancelPublish(' + rows.id + ')">取消</a>'
                        : '<a class="btn btn-success btn-sm" data-toggle="modal" btnPermission="tuappsprovide:publish" data-target="#publishModal" data-id="' + rows.id + '">发布</a>';

                    return pbtn
                        + '&nbsp;'
                        + '<a class="btn btn-default btn-sm" data-toggle="modal" data-target="#ottDescModal" data-id="' + rows.id + '">推荐语</a>'
                        + '<a class="btn btn-default btn-sm" btnPermission="tuappsprovide:del" onclick="del(' + rows.id + ')">删除</a>';
                }
            }
        ],
        viewrecords: true,
        height: 380,
        rowNum: 10,
        rowList: [10, 30, 50],
        rownumbers: true,
        rownumWidth: 25,
        autowidth: true,
        multiselect: true,
        cellEdit: true,
        cellsubmit: 'clientArray',
        pager: "#jqGridPager",
        afterSaveCell : function(rowid,name,val,iRow,iCol) {
            var appsProvide;

            if (name === 'sort') {
                appsProvide = {
                    id: rowid,
                    sort: val
                };
            } else if (name === 'maxinstall') {
                appsProvide = {
                    id: rowid,
                    maxinstall: val
                }
            } else if (name === 'numberlimit') {
                appsProvide = {
                    id: rowid,
                    numberlimit: val
                }
            }

            if (appsProvide) {
                $.ajax({
                    type: "POST",
                    url: baseURL + "tuappsprovide/update",
                    contentType: "application/json",
                    data: JSON.stringify(appsProvide),
                    success: function (r) {
                        if (r.status !== 0) {
                            alert(r.msg);
                        }
                    }
                });
            }

        },
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
        postData: {
            'uses': -1
        },
        gridComplete: function () {
            $("#jqGrid").closest(".ui-jqgrid-bdiv").css({"overflow-x": "hidden"});
          //刷新按钮权限
            refreshBtnPermission();
        }
    });

    $("#appJqGrid").jqGrid({
        url: baseURL + '/admin/tbapp/list',
        datatype: "json",
        colModel: [
            { label: '应用ID', name: 'id', index: 'id', width: 30, key: true },
            { label: '名称', name: 'name', index: 'name', width: 50},
            { label: '一级分类', name: 'classList', index: 'classList', width: 30 ,formatter:function(cellValue,options,rowObject){
                    var classList = rowObject.classList;
                    for(var i in classList){
                        if(classList[i].classlevel == 1){
                            return classList[i].classname;
                        }
                    }
                    return "";
                }},
            { label: '二级分类', name: 'classList', index: 'classList', width: 30 ,formatter:function(cellValue,options,rowObject){
                    var classNames = "";
                    var classList = rowObject.classList;
                    for(var i in classList){
                        if(classList[i].classlevel == 2){
                            classNames += classList[i].classname;
                            if(i < classList.length - 1){
                                classNames += "\n";
                            }
                        }
                    }
                    return classNames;
                }},
            { label: '最新版本', name: 'appVersionEntity.versionname', index: 'versionname', width: 30 },
            { label: '发布状态', name: 'appVersionEntity.publish', index: 'publish', width: 30 ,formatter:function(cellValue,options,rowObject){
                    if(cellValue == 1){
                        return "上架";
                    }else{
                        return "下架";
                    }
                } },
            { label: '应用包名', name: 'packagename', index: 'packagename', width: 30 },
            { label: '操作', name: 'id', index: 'id', width: 30,formatter: function(cellValue,options,rowObject){
                    var actionHtml = "<a class='btn btn-default btn-sm' btnPermission='tuappsprovide:add' onclick='add("+rowObject.id+");'>添加</a>";
                    return actionHtml;
                } }
        ],
        viewrecords: true,
        height: 380,
        rowNum: 10,
        rowList : [10,30,50],
        rownumWidth: 25,
        autowidth:true,
        multiselect: true,
        pager: "#appJqGridPager",
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
            var grid = $("#appJqGrid");
            grid.closest(".ui-jqgrid-bdiv").css({"overflow-x": "hidden"});
          //刷新按钮权限
    		refreshBtnPermission();
        }
    });

    $("#dcJqGrid").jqGrid({
        url: baseURL + 'appsprovidemap/list',
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
        height: 200,
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
            grid.setGridWidth(572);
        }
    });

    $("#publishDcJqGrid").jqGrid({
        url: baseURL + 'appsprovidemap/list',
        datatype: "json",
        colModel: [
            {label: '型号名称', name: 'devicetype', index: 'deviceType', width: 80},
            {label: '渠道名称', name: 'customername', index: 'customerName', width: 80}
        ],
        viewrecords: true,
        height: 200,
        rowNum: 10,
        rowList: [10, 30, 50],
        rownumbers: true,
        rownumWidth: 25,
        autowidth: true,
        multiselect: true,
        pager: "#publishDcJqGridPager",
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
            var grid = $("#publishDcJqGrid");
            grid.closest(".ui-jqgrid-bdiv").css({"overflow-x": "hidden"});
            grid.setGridWidth(572);
        }
    });

    $('#dcModal').on('show.bs.modal', function (event) {
        dcModal.initTree();

        var button = $(event.relatedTarget);
        var id = button.data('id');
        var act = button.data('act');

        dcModal.appsProvideSelectId = id;

        var grid = $('#jqGrid');
        dcModal.labelAppName = grid.jqGrid('getCell', id, 'appname');
        dcModal.labelPackage = grid.jqGrid('getCell', id, 'packagename');

        dcModal.queryDeviceType = '';
        dcModal.queryCustomer = '';

        var hide = grid.jqGrid('getCell', id, 'hide');
        var pbtn = '<span class="label label-success">已发布</span>';
        if (act === "edit" && hide === pbtn) {
            dcModal.allowEdit = false;
            return;
        }

        dcModal.allowEdit = true;
        var dcGrid = $('#dcJqGrid');
        var page = dcGrid.jqGrid('getGridParam', 'page');

        if (act === "edit") {
            dcModal.labelTitle = "配置";
            dcModal.inEdit = true;
        } else {
            dcModal.labelTitle = "查看";
            dcModal.inEdit = false;
        }
        jQuery("#dcJqGrid").setGridParam({
            postData: {
                'provideid': dcModal.appsProvideSelectId,
                'deviceType': dcModal.queryDeviceType,
                'customerName': dcModal.queryCustomer
            },
            page: page
        }).showCol("opt").trigger("reloadGrid");
    });

    $('#publishModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget);
        var id = button.data('id');
        var grid = $('#publishDcJqGrid');
        var page = grid.jqGrid('getGridParam', 'page');

        grid.setGridParam({
            postData: {
                'provideid': id
            },
            page: page
        }).hideCol("opt").trigger("reloadGrid");

        $.get(baseURL + "tuappsprovide/info/" + id, function (r) {
            publishModal.appsProvide = r.tuAppsProvide;
        });
    });

    $('#updateModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget);
        var id = button.data('id');

        $.get(baseURL + "tuappsprovide/info/" + id, function (r) {
            updateModal.appsProvide = r.tuAppsProvide;
            // updateModal.maxInstall = r.tuAppsProvide.maxinstall;
            // updateModal.isLimitSelected = r.tuAppsProvide.numberlimit;
        });

        // updateModal.appsProvideSelectId = id;
    });

    $('#picModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget);
        var id = button.data('id');
        picModal.picPushId = id;

        var act = button.data('act');
        var grid = $('#jqGrid');
        picModal.labelAppNamePic = grid.jqGrid('getCell', id, 'appname');
        picModal.labelPackagePic = grid.jqGrid('getCell', id, 'packagename');

        $.get(baseURL + "tuappsprovide/info/" + id, function(r){
            if (r.code === 0) {
                picModal.picUrl = baseURL + 'file/download?fullPath=' + r.tuAppsProvide.picurl;
            } else {
                alert(r.msg);
            }
        });

        if (act === 'push') {
            picModal.labelTitlePic = "上传";
            picModal.inPicPush = true;
        } else {
            picModal.labelTitlePic = "查看";
            picModal.inPicPush = false;
        }

    });

    $('#ottDescModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget);
        var id = button.data('id');

        $.get(baseURL + "tuappsprovide/info/" + id, function (r) {
            ottDescModal.appsProvide = r.tuAppsProvide;
        });
    });

    init_upload_com();
    init_bind_event();

    appGrid.initDeviceTypeSelect();
});

var mainGrid = new Vue({
    el: '#mainGrid',
    data: {
        appUsesSelectOptions: [
            {value: 'rough', text: '粗犷推送'},
            {value: 'ott', text: 'ott大师推送'},
            {value: 'hot_search', text: '热搜应用'},
            {value: 'must_install', text: '装机必备'},
            {value: 'enter_recommend', text: '进入时推荐'},
            {value: 'exit_recommend', text: '退出时推荐'},
            {value: 'hotkey_recommend', text: '热键推送应用'},
            {value: 'cpa', text: 'CPA推荐'}
        ],
        appUsesSelected: '',
        queryAppName: '',
        queryAppPackage: ''
    },
    methods: {
        query: function () {
            mainGrid.reload();
        },
        del: function(id) {
            if (id == null) {
                return;
            }
            var ids = [];
            ids.push(id);
            confirm('确定要删除记录？', function () {
                $.ajax({
                    type: "POST",
                    url: baseURL + "tuappsprovide/delete",
                    contentType: "application/json",
                    data: JSON.stringify(ids),
                    success: function (r) {
                        if (r.status === 0) {
                            alert('操作成功', function () {
                                $("#jqGrid").trigger("reloadGrid");
                            });
                        } else {
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        delBatch: function () {
            var ids = getSelectedRows();

            if (ids == null) {
                return;
            }
            confirm('确定要删除选中的记录？', function () {
                $.ajax({
                    type: "POST",
                    url: baseURL + "tuappsprovide/delete",
                    contentType: "application/json",
                    data: JSON.stringify(ids),
                    success: function (r) {
                        if (r.status === 0) {
                            alert('操作成功', function () {
                                $("#jqGrid").trigger("reloadGrid");
                            });
                        } else {
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        reload: function () {
            var grid = $("#jqGrid");
            var page = grid.jqGrid('getGridParam', 'page');
            grid.jqGrid('setGridParam', {
                postData: {
                    'uses': mainGrid.appUsesSelected,
                    'packageName': mainGrid.queryAppPackage,
                    'name': mainGrid.queryAppName
                },
                page: page
            }).trigger("reloadGrid");
        }
    },
    watch: {
        appUsesSelected: function () {
            mainGrid.reload();
        }
    }
});

var appGrid = new Vue({
    el: '#appGrid',
    data: {
        deviceTypeList: [],
        deviceTypeSelected: '',
        customerMaps: [],
        customerSelected: '',
        queryAddAppName: ''
    },
    methods: {
        addBatch: function () {
            if (mainGrid.appUsesSelected === '') {
                alert("必须选择应用的用途");
                return;
            }

            var grid = $("#appJqGrid");
            var rowKey = grid.getGridParam("selrow");
            if (!rowKey) {
                alert("请选择至少一条需要添加的应用");
                return;
            }

            var ids = grid.getGridParam("selarrrow");
            var addData = [];
            ids.forEach(function (value) {
                addData.push({
                    appid: value, uses: mainGrid.appUsesSelected
                });
            });

            $.ajax({
                type: "POST",
                url: baseURL + "tuappsprovide/save",
                contentType: "application/json",
                data: JSON.stringify(addData),
                success: function (r) {
                    if (r.status === 0) {
                        alert('操作成功', function () {
                            mainGrid.reload();
                        });
                    } else {
                        alert(r.msg);
                    }
                }
            });
        },
        add: function (id) {
            if (id == null) {
                return;
            }
            if (mainGrid.appUsesSelected === '') {
                alert("必须选择应用的用途");
                return;
            }
            var addData = [];
            addData.push({
                appid: id,
                uses: mainGrid.appUsesSelected
            });
            $.ajax({
                type: "POST",
                url: baseURL + "tuappsprovide/save",
                contentType: "application/json",
                data: JSON.stringify(addData),
                success: function (r) {
                    if (r.status === 0) {
                        alert('操作成功', function (index) {
                            mainGrid.reload();
                        });
                    } else {
                        alert(r.msg);
                    }
                }
            });
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
            $("#appJqGrid").jqGrid('setGridParam',{
                page:page,
                postData: queryParam
            }).trigger("reloadGrid");
        },
        initDeviceTypeSelect: function() {
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
        initCustomerSelectByDeviceTypeId: function(deviceTypeId) {
            if (!deviceTypeId) {
                var customerMaps = [];
                var all = { customerid: '', customername: '全部' };
                customerMaps.unshift(all);
                appGrid.customerMaps = customerMaps;
                appGrid.customerSelected = '';
            } else {
                $.get(baseURL + "typecustomermap/info/" + deviceTypeId, function (r) {
                    var customerMaps = r.customerMaps;
                    var all = { customerid: '', customername: '全部' };
                    customerMaps.unshift(all);
                    appGrid.customerMaps = customerMaps;
                    appGrid.customerSelected = '';
                });
            }
        }
    },
    watch: {
    deviceTypeSelected: function (deviceTypeId) {
        appGrid.initCustomerSelectByDeviceTypeId(deviceTypeId);
    }
}
});

var updateModal = new Vue({
    el: '#updateModal',
    data: {
        isShowSelected: 0,
        isLimitList: [
            {text: '不限制', value: 0},
            {text: '限制', value: 1}
        ],
        isLimitSelected: 0,

        appsProvide: {}
    },
    methods: {
        update: function () {
            $.ajax({
                type: "POST",
                url: baseURL + "tuappsprovide/update",
                contentType: "application/json",
                data: JSON.stringify(updateModal.appsProvide),
                success: function (r) {
                    if (r.status === 0) {
                        alert('操作成功', function () {
                            mainGrid.reload();
                        });
                    } else {
                        alert(r.msg);
                    }
                }
            });
        }
    }
});

var publishModal = new Vue({
    el: '#publishModal',
    data: {
        appsProvide: {}
    },
    methods: {
        publish: function () {
            publishModal.appsProvide.hide = 0;
            $.ajax({
                type: "POST",
                url: baseURL + "tuappsprovide/update",
                contentType: "application/json",
                data: JSON.stringify(publishModal.appsProvide),
                success: function (r) {
                    if (r.status === 0) {
                        alert('操作成功', function () {
                            mainGrid.reload();
                        });
                    } else {
                        alert(r.msg);
                    }
                }
            });
        },
        cancelPublish: function (id) {
            var tuAppsProvide = {};
            tuAppsProvide.id = id;
            tuAppsProvide.hide = 1;
            $.ajax({
                type: "POST",
                url: baseURL + "tuappsprovide/update",
                contentType: "application/json",
                data: JSON.stringify(tuAppsProvide),
                success: function (r) {
                    if (r.status === 0) {
                        alert('操作成功', function () {
                            mainGrid.reload();
                        });
                    } else {
                        alert(r.msg);
                    }
                }
            });
        }
    }
});

var picModal = new Vue({
    el: '#picModal',
    data: {
        picUrl: '',
        picPushId: '',
        labelAppNamePic: '',
        labelTitlePic: '',
        labelPackagePic: '',
        inPicPush: ''
    }
});

var ottDescModal = new Vue({
    el: '#ottDescModal',
    data: {
        appsProvide: {}
    },
    methods: {
        saveDesc: function () {
            $.ajax({
                type: "POST",
                url: baseURL + "tuappsprovide/update",
                contentType: "application/json",
                data: JSON.stringify(ottDescModal.appsProvide),
                success: function (r) {
                    if (r.status === 0) {
                        alert('操作成功', function () {
                            mainGrid.reload();
                        });
                    } else {
                        alert(r.msg);
                    }
                }
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
var dcModal = new Vue({
    el: '#dcModal',
    data: {
        rule: {
            zNodes: [],
            oldNodes: []
        },

        labelTitle: '',
        labelAppName: '',
        labelPackage: '',
        queryDeviceType: '',
        queryCustomer: '',
        appsProvideSelectId: '',

        allowEdit: true,
        inEdit: true,

        startpictureid: null,
        groupId: "",
        groudItems: []
    },
    methods: {
        initTree: function () {
            $.when(
                $.getJSON(baseURL + "typecustomermap/queryAll")
            ).done(function (r, result) {
                var customerMaps = r.customerMaps;
                dcModal.rule.oldNodes = result.result;
                var arr = new Array();
                dcModal.zNodes = [{
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
                        dcModal.zNodes.push(zDevicetypeNode);
                        arr.push(devicetypeid);
                        for (var j in dcModal.rule.oldNodes) {
                            if (dcModal.rule.oldNodes[j].deviceTypeId === devicetypeid) {
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
                    dcModal.zNodes.push(zCustomerNode);
                    for (var j in dcModal.rule.oldNodes) {
                        if (dcModal.rule.oldNodes[j].deviceTypeId == devicetypeid && dcModal.rule.oldNodes[j].customerId == customerid) {
                            zCustomerNode.checked = true;
                            break;
                        }
                    }
                }
                ztree = $.fn.zTree.init($("#modelTree"), setting, dcModal.zNodes);
                //折叠所有节点
                ztree.expandAll(false);

            });
        },
        query: function () {
            dcModal.reload();
        },
        reload: function () {
            var grid = $("#dcJqGrid");
            var page = grid.jqGrid('getGridParam', 'page');
            grid.jqGrid('setGridParam', {
                postData: {
                    'provideid': dcModal.appsProvideSelectId,
                    'deviceType': dcModal.queryDeviceType,
                    'customerName': dcModal.queryCustomer
                },
                page: page
            }).trigger("reloadGrid");
        },
        add: function () {

            var newNodes = ztree.getNodesByFilter(function (node) {
                if (node.level == 2 && node.checked == true) {
                    return true;
                }
            });

            if (!newNodes) {
                alert("请选择关联的型号渠道")
            }

            loading("加载中,请稍后...");

            var dcData = [];
            newNodes.forEach(function (node) {
                dcData.push({
                    provideid: dcModal.appsProvideSelectId,
                    devicetypeid: node.pId,
                    customerid: node.id
                });
            });

            $.ajax({
                type: "POST",
                url: baseURL + "appsprovidemap/save",
                contentType: "application/json",
                data: JSON.stringify(dcData),
                success: function (r) {
                    if (r.status === 0) {
                        dcModal.reload();
                    } else {
                        alert(r.msg);
                    }
                    closeLoading();
                }
            });

        },
        del: function () {
            var ids = this.getSelectedRowsDC();
            if (ids == null) {
                return;
            }

            confirm('确定要删除选中的记录？', function () {
                $.ajax({
                    type: "POST",
                    url: baseURL + "appsprovidemap/delete",
                    contentType: "application/json",
                    data: JSON.stringify(ids),
                    success: function (r) {
                        if (r.status === 0) {
                            alert('操作成功', function (index) {
                                $("#dcJqGrid").trigger("reloadGrid");
                            });
                        } else {
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        getSelectedRowsDC: function () {
            var grid = $("#dcJqGrid");
            var rowKey = grid.getGridParam("selrow");
            if (!rowKey) {
                alert("请选择一条记录");
                return;
            }

            return grid.getGridParam("selarrrow");
        }
    }
});

function add(id) {
    appGrid.add(id);
}

function del(id) {
    mainGrid.del(id);
}

function delDC(id) {
    if (id == null) {
        return;
    }

    var ids = [];
    ids.push(id);
    confirm('确定要删除记录？', function () {
        $.ajax({
            type: "POST",
            url: baseURL + "appsprovidemap/delete",
            contentType: "application/json",
            data: JSON.stringify(ids),
            success: function (r) {
                if (r.status === 0) {
                    alert('操作成功', function (index) {
                        $("#dcJqGrid").trigger("reloadGrid");
                    });
                } else {
                    alert(r.msg);
                }
            }
        });
    });
}

function init_upload_com(){
    $('#uploadControl').uploadifive({
        'auto': false,
        'fileTypeDesc': 'Image Files',
        'removeCompleted': true,
        'multi': false,
        'buttonText': '选择图片文件',
        'fileSizeLimit': '25MB',
        'fileType': 'image/*',
        'formData': {},
        'queueID': 'fileQueue',
        'uploadScript': baseURL + 'tuappsprovide/uploadPic',
        'onUploadComplete': function(file, data) {
            var r = JSON.parse(data);
            if (r.code === 0) {
                picModal.picUrl = baseURL + 'file/download?fullPath=' + r.picUrl;
            } else {
                alert(r.msg);
            }
        }
    });
}

function init_bind_event(){
    $("#uploadBtn").click(function(){
        var selectedFiles = $("#fileQueue").children().length;
        if(selectedFiles === 0){
            alert("请选择要上传的图片文件");
            return;
        }

        var uploadControl = $('#uploadControl');
        uploadControl.data('uploadifive').settings.formData = {
            'id': picModal.picPushId
        };

        uploadControl.uploadifive('upload');
    });

    $("#cancelBtn").click(function(){
        $('#uploadControl').uploadifive('clearQueue')
    });
}

function cancelPublish(id) {
    publishModal.cancelPublish(id);
}

function test() {

    var oldNodes = dcModal.rule.oldNodes;

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
        var node = newNodes[i].pId + "_" + newNodes[i].id;
        addNodes.push(node);
    }

    console.log(addNodes);
    console.log(delNodes);
}
