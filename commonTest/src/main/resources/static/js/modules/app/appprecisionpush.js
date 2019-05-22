$(function () {
    $("#jqGrid").jqGrid({
        url: baseURL + 'appprecisionpush/list',
        datatype: "json",
        colModel: [
            {label: '推送计划名', name: 'name', index: 'name'},
            {label: '创建时间', name: 'createTime', index: 'createTime'},
            {
                label: '状态', name: 'status', index: 'status',
                formatter: function (value, grid, rows, state) {
                    if (rows.status == 0) {
                        return "发布";
                    } else if (rows.status == 2) {
                        return "暂停发布";
                    }
                }
            },
            {
                label: '操作', name: 'opt',
                formatter: function (value, grid, rows, state) {
                    var pbtn = "";
                    if (rows.status == 2) {
                        pbtn += '<a class="btn btn-primary btn-sm" onclick="mainGrid.updateStatus(' + rows.id + ',0)">发布</a>';
                    } else if (rows.status == 0) {
                        pbtn += '<a class="btn btn-warning btn-sm" onclick="mainGrid.updateStatus(' + rows.id + ',2)">暂停发布</a>';
                    }
                    pbtn += '&nbsp;<a class="btn btn-success btn-sm" data-toggle="modal" data-target="#mapGridModal" data-id="' + rows.id + '" data-act="info">查看</a>';
                    pbtn += '&nbsp;<a class="btn btn-default btn-sm" onclick="mainGrid.del(' + rows.id + ')">删除</a>'
                    return pbtn;
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
        }
    });
});

var mainGrid = new Vue({
    el: '#mainGrid',
    data: {
        queryName: '',
    },
    methods: {
        query: function () {
            mainGrid.reload();
        },
        view: function (id) {
            var grid = $("#jqGrid");
            grid.jqGrid('setGridParam', {
                postData: {
                    'id': id
                },
                page: 1
            }).trigger("reloadGrid");
        },
        del: function (id) {
            if (id == null) {
                return;
            }
            var ids = [];
            ids.push(id);
            confirm('确定要删除记录？', function () {
                $.ajax({
                    type: "POST",
                    url: baseURL + "appprecisionpush/delete",
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
                    url: baseURL + "appprecisionpush/delete",
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
                    'name': mainGrid.queryName
                },
                page: page
            }).trigger("reloadGrid");
        },
        updateStatus: function (id, status) {
            var grid = $("#mapGrid");

            var ids = grid.getGridParam("selarrrow");
            if (ids == null) {
                return;
            }
            confirm('确定要更新选中的记录？', function () {
                $.ajax({
                    type: "GET",
                    url: baseURL + "appprecisionpush/updateStatus",
                    contentType: "application/json",
                    data: {"appPrecisionPushId": id, "status": status},
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
        }
    }
});

var mapGridVM = new Vue({
    el: '#mapGridModal',
    data: {
        id: '',
        sn: '',
        count: '0',
    },
    methods: {
        query: function () {
            mapGridVM.reload();
        },
        del: function (id) {
            if (id == null) {
                return;
            }
            var ids = [];
            ids.push(id);
            confirm('确定要删除记录？', function () {
                $.ajax({
                    type: "POST",
                    url: baseURL + "appprecisionpush/deleteMapItem",
                    contentType: "application/json",
                    data: JSON.stringify(ids),
                    success: function (r) {
                        if (r.status === 0) {
                            alert('操作成功', function () {
                                $("#mapGrid").trigger("reloadGrid");
                            });
                        } else {
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        delBatch: function () {
            var grid = $("#mapGrid");
            var rowKey = grid.getGridParam("selrow");
            if (!rowKey) {
                alert("请选择一条记录");
                return;
            }

            var ids = grid.getGridParam("selarrrow");
            if (ids == null) {
                return;
            }
            confirm('确定要删除选中的记录？', function () {
                $.ajax({
                    type: "POST",
                    url: baseURL + "appprecisionpush/deleteMapItem",
                    contentType: "application/json",
                    data: JSON.stringify(ids),
                    success: function (r) {
                        if (r.status === 0) {
                            alert('操作成功', function () {
                                $("#mapGrid").trigger("reloadGrid");
                            });
                        } else {
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        reload: function () {
            var grid = $("#mapGrid");
            grid.jqGrid('setGridParam', {
                postData: {
                    'appPrecisionPushId': mapGridVM.id,
                    'sn': mapGridVM.sn
                },
                page: 1
            }).trigger("reloadGrid");
            $.ajax({
                type: "GET",
                url: baseURL + "appprecisionpush/infoCount",
                contentType: "application/json",
                data: {"appPrecisionPushId": mapGridVM.id, "sn": mapGridVM.sn},
                success: function (r) {
                    mapGridVM.count = "已安装:" + r.installCount + " 总计:" + r.allCount;
                }
            });
        }
    }
});

$("#mapGrid").jqGrid({
    url: baseURL + 'appprecisionpush/info',
    datatype: "json",
    colModel: [
        {label: 'Sn', name: 'sn', index: 'sn', width: 200},
        {label: '应用', name: 'appName', index: 'appName'},
        {
            label: '状态', name: 'status', index: 'status', width: 70,
            formatter: function (value, grid, rows, state) {
                if (value == 0) {
                    return "未安装";
                } else if (value == 1) {
                    return "已安装";
                } else if (value == 2) {
                    return "已暂停";
                }
            }
        },
        {
            label: '操作', name: 'opt',
            formatter: function (value, grid, rows, state) {
                return '<a class="btn btn-default btn-sm" onclick="mapGridVM.del(' + rows.id + ')">删除</a>';
            }
        }
    ],
    viewrecords: true,
    width: 300,
    height: 380,
    rowNum: 10,
    rowList: [10, 30, 50],
    rownumbers: true,
    rownumWidth: 25,
    autowidth: true,
    shrinkToFit: true,
    multiselect: true,
    cellEdit: true,
    cellsubmit: 'clientArray',
    pager: "#mapGridPager",
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
        $("#jqGrid").closest(".ui-jqgrid-bdiv").css({"overflow-x": "hidden"});
    }
});

$('#mapGridModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget);
    var id = button.data('id');

    mapGridVM.id = id;
    mapGridVM.sn = '';

    mapGridVM.reload();
});
