$(function () {
    $("#jqGrid").jqGrid({
        url: baseURL + 'uipaneltemplate/list',
        datatype: "json",
        colModel: [
            {label: '模板名称', name: 'name', index: 'name', width: 50},
            {
                label: '模板Id',
                name: 'uiTemplateId',
                index: 'uiTemplateId',
                width: 60,
                formatter: function (cellValue, options, rowObject) {
                    return "模板" + cellValue;
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
            {label: '描述', name: 'description', index: 'description', width: 90},
            {label: '模板作者', name: 'author', index: 'author', width: 60},
            {label: '创建时间', name: 'createTime', index: 'createTime', width: 80},
            {label: '修改时间', name: 'updateTime', index: 'updateTime', width: 80},
            {
                label: '操作', name: 'id', index: 'id', width: 60, formatter: function (cellValue, options, rowObject) {
                var actionHtml = "<a class='btn btn-primary' btnPermission='uipaneltemplate:drawPannel' onclick='vm.drawPannel(" + rowObject.id + ")'>&nbsp;编辑模板</a>&nbsp;&nbsp;"
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
    vm.loadSelector();
});

var vm = new Vue({
    el: '#rrapp',
    data: {
        showList: "init",
        title: null,
        templateItems: [],
        queryId: "",
        addOrUpdate: false,
        uiPanelTemplate: {}
    },
    methods: {
        query: function () {
            vm.reload();
        },
        loadSelector: function () {
            $.ajax({
                type: "GET",
                url: baseURL + "uipaneltemplate/querySearchNames",
                contentType: "application/json",
                success: function (r) {
                    if (r.status == 0) {
                        vm.templateItems = r.data;
                    } else {
                        alert("加载模板下拉框信息失败");
                    }
                },
                error: function () {
                    alert("请求异常，请联系管理员");
                }
            });
        },
        add: function () {
            vm.showList = "updateOrSave";
            vm.title = "新增";
            vm.uiPanelTemplate = {};
            vm.addOrUpdate = false;
        },
        update: function (event) {

            var id = getSelectedRow();
            if (id == null) {
                return;
            }
            vm.showList = "updateOrSave";
            vm.title = "修改";
            vm.addOrUpdate = true;
            vm.getInfo(id)
        },
        saveOrUpdate: function (event) {
            var url = vm.uiPanelTemplate.id == null ? "uipaneltemplate/save" : "uipaneltemplate/update";
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.uiPanelTemplate),
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
                    url: baseURL + "uipaneltemplate/delete",
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
                        alert("请求异常，请联系管理员");
                    }

                });
            });
        },
        getInfo: function (id) {
            $.get(baseURL + "uipaneltemplate/info/" + id, function (r) {
                vm.uiPanelTemplate = r.uiPanelTemplate;
            });
        },
        reload: function (event) {
            vm.showList = "init";
            var page = $("#jqGrid").jqGrid('getGridParam', 'page');
            $("#jqGrid").jqGrid('setGridParam', {
                page: page,
                postData: {id: vm.queryId}
            }).trigger("reloadGrid");
        },
        drawPannel: function (id) {
            var data = {
                panelid: id
            };
            window.location.href = baseURL + "/admin/app/drawpanel.html?" + $.param(data);

        }
    }
});