var launcherid = T.p('launcherid');
var titleLevel = T.p('titleLevel');
var parentId = T.p('parentId');
var navTitle;
// console.log(titleLevel);
if (titleLevel == 1) {
    navTitle = "主界面>一级标题";
}
// document.getElementById("nav_title_navTitle").innerHTML = navTitle;
if (titleLevel == 2) {
    navTitle = "主界面>一级标题>二级标题";
}


/*console.log(launcherid);
 console.log(titleLevel);
 console.log(parentId);*/

$(function () {
    // 一级标题
    if (titleLevel == 1) {
        $("#jqGrid").jqGrid({
            url: baseURL + 'uititle/list',
            datatype: "json",
            colModel: [
                {label: '标题名称', name: 'name', index: 'name', width: 50},
                {
                    label: '焦点图片',
                    name: 'iconfocus',
                    index: 'iconfocus',
                    width: 85,
                    formatter: function (cellValue, options, rowObject) {
                        if (cellValue == null || cellValue == '') {
                            return '<font style="color: red">没上传</font>';
                        }
                        return '<img src="' + baseURL + '/file/download?fullPath=' + cellValue + '" style="width:100px;height:80px;"/>';
                    }
                },
                {
                    label: '无焦点图片',
                    name: 'iconunfocus',
                    index: 'iconunfocus',
                    width: 85,
                    formatter: function (cellValue, options, rowObject) {
                        if (cellValue == null || cellValue == '') {
                            return '<font style="color: red">没上传</font>';
                        }
                        return '<img src="' + baseURL + '/file/download?fullPath=' + cellValue + '" style="width:100px;height:80px;"/>';
                    }
                }, {
                    label: '选中图片',
                    name: 'iconselected',
                    index: 'iconselected',
                    width: 85,
                    formatter: function (cellValue, options, rowObject) {
                        if (cellValue == null || cellValue == '') {
                            return '<font style="color: red">没上传</font>';
                        }
                        return '<img src="' + baseURL + '/file/download?fullPath=' + cellValue + '" style="width:100px;height:80px;"/>';
                    }
                },
                {label: '排序', name: 'sort', index: 'sort', width: 30},
                {
                    label: '状态',
                    name: 'status',
                    index: 'status',
                    width: 55,
                    formatter: function (cellValue, options, rowObject) {
                        if (cellValue == 1) {
                            return '<font style="color: red">正在编辑</font>';
                        }
                        if (cellValue == 2) {
                            return '<font style="color: cornflowerblue">编辑完成</font>';
                        }
                        if (cellValue == 3) {
                            return '<font style="color: blue">已发布</font>';
                        }
                        // if status == 4
                        if (cellValue == 4) {
                            return '<font style="color: orangered">待重新发布</font>';
                        }
                        return '<font style="color: #ff7022">未指定</font>';
                    }
                },
                {label: '描述', name: 'description', index: 'description', width: 90},
                {
                    label: '修改时间', name: 'updateTime', index: 'updateTime', width: 68,
                    formatter: function (cellValue, options, rowObject) {
                        return (moment(cellValue)).format("YYYY-MM-DD HH:mm:ss");
                    }
                },
                {
                    label: '操作',
                    name: 'id',
                    index: 'id',
                    width: 140,
                    formatter: function (cellValue, options, rowObject) {
                        var attachment = "";
                        if (rowObject.status == 4) {
                            attachment = "<a class='btn btn-primary' btnPermission='uititle:publish' onclick='vm.publishUititle(" + rowObject.id + ");'>&nbsp;发布标题</a>&nbsp;&nbsp;"
                        }
                        return attachment + "<a class='btn btn-primary' onclick='vm.secondTitle(" + rowObject.id + ",\"" + rowObject.name + "\");'>&nbsp;二级标题</a>&nbsp;&nbsp;"

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
            postData: {
                launcherid: launcherid,
                titleLevel: titleLevel,
                parentId: parentId
            },
            gridComplete: function () {
                //隐藏grid底部滚动条
                $("#jqGrid").closest(".ui-jqgrid-bdiv").css({"overflow-x": "hidden"});
                //刷新按钮权限
                refreshBtnPermission();
            }
        });


        $('#uiTitleIconUnfocus').uploadifive(uiTitleIconUnfocusUploadSetting);
        $('#uiTitleIconFocus').uploadifive(uiTitleIconFocusUploadSetting);
        $('#uiTitleIconSelected').uploadifive(uiTitleIconSelectedUploadSetting);

    } else {
        // 二级标题
        $("#jqGrid").jqGrid({
            url: baseURL + 'uititle/list',
            datatype: "json",
            colModel: [
                {label: '统计字段', name: 'operateTitle', index: 'operateTitle', width: 100},
                {label: '标题名称', name: 'name', index: 'name', width: 100},
                {
                    label: '模板名称',
                    name: 'uiTemplateName',
                    index: 'uiTemplateName',
                    width: 50,
                },
                {label: '排序', name: 'sort', index: 'sort', width: 25},
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
                            return '<font style="color: blue">已发布</font>';
                        }
                        // if status == 4
                        if (cellValue == 4 || cellValue == 5 || cellValue == 6) {
                            return '<font style="color: orangered">待重新发布</font>';
                        }
                        return '<font style="color: #ff7022">未指定</font>'
                    }
                },
                {label: '描述', name: 'description', index: 'description', width: 100},
                {
                    label: '修改时间',
                    name: 'updateTime',
                    index: 'updateTime',
                    width: 60,
                    formatter: function (cellValue, options, rowObject) {
                        return (moment(cellValue)).format("YYYY-MM-DD HH:mm:ss");
                    }
                },
                {
                    label: '操作',
                    name: 'id',
                    index: 'id',
                    width: 160,
                    formatter: function (cellValue, options, rowObject) {
                        // var result = "<a class='btn btn-primary' onclick='vm.createTemplate(" + rowObject.id + "," + rowObject.templateId + ");'>&nbsp;编辑模板</a>&nbsp;&nbsp;"
                        var result = "<a class='btn btn-primary' btnPermission='uititle:template:update' onclick='vm.edit(" + rowObject.id + "," + rowObject.templateId + "," + rowObject.status + ");'>&nbsp;编辑模板</a>&nbsp;&nbsp;"
                        if (rowObject.status == 4 || rowObject.status == 6) {
                            result = result + "<a class='btn btn-primary' btnPermission='uititle:publish:title' onclick='vm.publishUititle(" + rowObject.id + ");'>&nbsp;发布标题</a>&nbsp;&nbsp;"
                        }
                        if (rowObject.status == 5 || rowObject.status == 6) {
                            result = result + "<a class='btn btn-primary' btnPermission='uititle:publish:content' onclick='vm.publishUiCells(" + rowObject.id + ");'>&nbsp;发布内容</a>&nbsp;&nbsp;"
                        }
                        return result;
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
            fixed: true,
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
                launcherid: launcherid,
                titleLevel: titleLevel,
                parentId: parentId
            },
            gridComplete: function () {
                //隐藏grid底部滚动条
                $("#jqGrid").closest(".ui-jqgrid-bdiv").css({"overflow-x": "hidden"});
                //刷新按钮权限
                refreshBtnPermission();
            }
        });
    }

});

var vm = new Vue({
    el: '#rrapp',
    data: {
        showList: true,
        title: null,
        uiTitle: {},
        navTitle: navTitle,
        launcherid: launcherid,
        titleLevel: titleLevel,
        parentId: parentId,
        templateItems: [],
        showStatus: false,
        needPublish: false,
        showTemplateSelect: true,
        showTemplateName: "未选定",
        status: null
    },
    methods: {
        query: function () {
            vm.reload();
        },
        loadtemplateItems: function () {
            $.ajax({
                type: "GET",
                url: baseURL + "uipaneltemplate/queryAllNames",
                contentType: "application/json",
                success: function (r) {
                    if (r.status == 0) {
                        vm.templateItems = r.data;
                    } else {
                        alert("加载模板下拉框信息失败");
                    }
                }
            });

        },
        backward: function () {
            parent.vm.navTitle3 = "";
            //parent.document.getElementById("nav_title_navTitle_2").innerHTML = "";
            history.back(-1);
        },
        publishUititle: function (id) {
            confirm('确定要发布此标题？', function () {
                $.ajax({
                    type: "POST",
                    url: baseURL + "uititle/publishUiTitle",
                    data: {id: id},
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
                        alert("发送请求失败");
                    }
                });
            })

        },
        publishUiCells: function (id) {

            var data = {'id': id};
            confirm('确定要发布编辑的内容？', function () {
                $.ajax({
                    type: "POST",
                    url: baseURL + "uititle/publishUiCells",
                    data: data,
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
                        alert("发送请求失败");
                    }
                });
            })
        },
        add: function () {
            vm.loadtemplateItems();
            vm.showList = false;
            vm.showStatus = false;
            vm.needPublish = false;
            vm.uiTitle = {};
            if (titleLevel == 1) {
                vm.title = "新增一级标题";
                vm.titleLevel = 1;

                $("#uiTitleIconSelectedSrc").removeAttr("src");
                $("#uiTitleIconSelectedSrc").css("display", "none");


                $("#uiTitleIconUnfocusSrc").removeAttr("src");
                $("#uiTitleIconUnfocusSrc").css("display", "none");

                $("#uiTitleIconFocusSrc").removeAttr("src");
                $("#uiTitleIconFocusSrc").css("display", "none");


            } else {
                vm.title = "新增二级标题";
                vm.titleLevel = 2;
                vm.showTemplateSelect = true;
            }
        },
        update: function (event) {
            var id = getSelectedRow();
            if (id == null) {
                return;
            }

            vm.showStatus = true;

            vm.loadtemplateItems();
            vm.showList = false;
            if (titleLevel == 1) {
                vm.title = "修改一级标题";
            } else {
                vm.title = "修改二级标题";
            }

            vm.getInfo(id)
        },
        saveOrUpdate: function (event) {
            vm.uiTitle.parentId = parentId;
            vm.uiTitle.launcherid = launcherid;
            vm.uiTitle.titleLevel = titleLevel;
            if (vm.status > 3) {
                vm.uiTitle.status = vm.status;
            }
            var data = JSON.stringify(vm.uiTitle);
            var url = vm.uiTitle.id == null ? "uititle/save" : "uititle/update";

            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: data,
                success: function (r) {
                    if (r.status == 0) {
                        alert('操作成功', function (index) {
                            vm.reload();
                        });
                    } else {
                        alert(r.msg);
                    }
                    // 一级标题
                    if (vm.uiTitle.titleLevel == 1) {
                        main.removeIcon('uiTitleIconFocusSrc', 'noConfirm');
                        main.removeIcon('uiTitleIconUnfocusSrc', 'noConfirm');
                        main.removeIcon('uiTitleIconSelectedSrc', 'noConfirm')
                    }
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
                    url: baseURL + "uititle/delete",
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
        publish: function () {
            var ids = getSelectedRows();
            if (ids == null) {
                return;
            }

            confirm('确定要发布选中的记录？', function () {
                $.ajax({
                    type: "POST",
                    url: baseURL + "uititle/publish",
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
            $.get(baseURL + "uititle/info/" + id, function (r) {
                vm.uiTitle = r.uiTitle;
                vm.status = r.uiTitle.status;
                if (vm.uiTitle.status > 3) {
                    vm.needPublish = true;
                } else {
                    vm.needPublish = false;
                }

                if (vm.uiTitle.templateId != null && vm.uiTitle.templateId != '') {
                    vm.showTemplateSelect = false;
                } else {
                    vm.showTemplateSelect = true;
                }

                vm.showTemplateName = "未选定";
                for (var i in vm.templateItems) {
                    if (vm.templateItems[i].id == vm.uiTitle.templateId) {
                        vm.showTemplateName = vm.templateItems[i].name;
                        break;
                    }
                }

                // 一级标题初始化上传图片样式
                if (vm.uiTitle.titleLevel == 1) {
                    // uiTitleIconSelectedSrc
                    if (vm.uiTitle.iconselected != null && vm.uiTitle.iconselected != '') {

                        $("#uiTitleIconSelectedSrc").attr("src", baseURL + '/file/download?fullPath=' + vm.uiTitle.iconselected);
                        $("#uiTitleIconSelectedSrc").css("display", "block");

                    } else {

                        $("#uiTitleIconSelectedSrc").removeAttr("src");
                        $("#uiTitleIconSelectedSrc").css("display", "none");

                    }

                    // uiTitleIconUnfocusSrc
                    if (vm.uiTitle.iconunfocus != null && vm.uiTitle.iconunfocus != '') {

                        $("#uiTitleIconUnfocusSrc").attr("src", baseURL + '/file/download?fullPath=' + vm.uiTitle.iconunfocus);
                        $("#uiTitleIconUnfocusSrc").css("display", "block");

                    } else {

                        $("#uiTitleIconUnfocusSrc").removeAttr("src");
                        $("#uiTitleIconUnfocusSrc").css("display", "none");

                    }

                    //uiTitleIconFocusSrc
                    if (vm.uiTitle.iconfocus != null && vm.uiTitle.iconfocus != '') {

                        $("#uiTitleIconFocusSrc").attr("src", baseURL + '/file/download?fullPath=' + vm.uiTitle.iconfocus);
                        $("#uiTitleIconFocusSrc").css("display", "block");

                    } else {

                        $("#uiTitleIconFocusSrc").removeAttr("src");
                        $("#uiTitleIconFocusSrc").css("display", "none");

                    }
                }


            });
        },
        reload: function (event) {
            vm.showList = true;
            vm.chooseTemplateTag = false;
            var page = $("#jqGrid").jqGrid('getGridParam', 'page');
            $("#jqGrid").jqGrid('setGridParam', {
                page: page
            }).trigger("reloadGrid");
        },
        secondTitle: function (id, navTitle) {

            var data = {
                parentId: id,
                titleLevel: 2,
                launcherid: launcherid

            };

            parent.vm.navTitle3 = navTitle;
            window.location.href = baseURL + "/admin/app/uititle.html?" + $.param(data);
        },
        edit: function (id, templateId, status) {
            var data = {
                // 根据 titleid 查找 cells
                titleid: id,
                titleLevel: 2,
                launcherid: launcherid,
                templateId: templateId
            };
            window.location.href = baseURL + "/admin/app/createTemplate.html?" + $.param(data);
        },
        createTemplate: function (id, templateId) {
            var data = {
                // 根据 titleid 查找 cells
                titleid: id,
                titleLevel: 2,
                launcherid: launcherid,
                templateId: templateId
            };
            window.location.href = baseURL + "/admin/app/createTemplate.html?" + $.param(data);
        }
    }
});

var main = {
    uiTitleIconFocusCallback: function (file, data) {
        var jsonObj = JSON.parse(data);
        var status = jsonObj.status;
        var msg = jsonObj.msg;
        if (status == 0) {
            var fileName = file.name;
            var filePath = jsonObj.filePath;
            vm.uiTitle.iconfocus = filePath;
            $("#uiTitleIconFocusSrc").attr("src", baseURL + '/file/download?fullPath=' + filePath);
            $("#uiTitleIconFocusSrc").css("display", "block");
            alert('图片：' + fileName + '上传成功');
        } else {
            alert(msg);
        }
    },
    uiTitleIconUnfocusCallback: function (file, data) {
        var jsonObj = JSON.parse(data);
        var status = jsonObj.status;
        var msg = jsonObj.msg;
        if (status == 0) {
            var fileName = file.name;
            var filePath = jsonObj.filePath;
            vm.uiTitle.iconunfocus = filePath;
            $("#uiTitleIconUnfocusSrc").attr("src", baseURL + '/file/download?fullPath=' + filePath);
            $("#uiTitleIconUnfocusSrc").css("display", "block");
            alert('图片：' + fileName + '上传成功');
        } else {
            alert(msg);
        }
    },
    uiTitleIconSelectedCallback: function (file, data) {
        var jsonObj = JSON.parse(data);
        var status = jsonObj.status;
        var msg = jsonObj.msg;
        if (status == 0) {
            var fileName = file.name;
            var filePath = jsonObj.filePath;
            vm.uiTitle.iconselected = filePath;
            $("#uiTitleIconSelectedSrc").attr("src", baseURL + '/file/download?fullPath=' + filePath);
            $("#uiTitleIconSelectedSrc").css("display", "block");
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
                if (id == 'uiTitleIconSelectedSrc') {
                    vm.uiTitle.iconselected = null;
                }
                if (id == 'uiTitleIconUnfocusSrc') {
                    vm.uiTitle.iconunfocus = null;
                }
                if (id == 'uiTitleIconFocusSrc') {
                    vm.uiTitle.iconfocus = null;
                }
                alert("删除成功！");
            });
        } else {
            $("#" + id).removeAttr("src");
            $("#" + id).css("display", "none");
            if (id == 'uiTitleIconSelectedSrc') {
                vm.uiTitle.iconselected = null;
            }
            if (id == 'uiTitleIconUnfocusSrc') {
                vm.uiTitle.iconunfocus = null;
            }
            if (id == 'uiTitleIconFocusSrc') {
                vm.uiTitle.iconfocus = null;
            }

        }

    }
};