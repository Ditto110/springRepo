$(function () {

    $("#jqGrid").jqGrid({
        url: baseURL + 'tuappsprovide2/list',
        datatype: "json",
        colModel: [
            { label: '应用ID', name: 'appid', index: 'appid' },
            { label: '应用名称', name: 'appname', index: 'appName' },
            { label: '应用包名', name: 'packagename', index: 'packageName' },
            {
                label: '是否发布', name: 'hide', index: 'hide',
                formatter: function (value, grid, rows, state) {
                    if (value === 0) {
                        return '<span class="label label-success">已发布</span>';
                    } else {
                        return '<span class="label label-danger">未发布</span>'
                    }
                }
            },
            {
                label: '排序', name: 'sort', index: 'sort',
                formatter: function (value, options, row) {
                	return "<input id='"+row.id+"Sort' value='"+row.sort+"' size='4' />";
                }
            },
            {
                label: '图片', name: 'pic',
                formatter: function (value, grid, rows, state) {
                    return '<a class="btn btn-default btn-sm" data-toggle="modal" data-target="#pic" data-id="' + rows.id + '" data-act="detail">查看</a>';
                }
            },
            {
                label: '操作', name: 'opt',
                formatter: function (value, grid, rows, state) {
                	var result = '<a class="btn btn-default btn-sm" btnPermission="tuappsprovide2:del" onclick="del(' + rows.id + ')">删除</a>'
                				+ '<a class="btn btn-default btn-sm" btnPermission="tuappsprovide2:update" onclick="update(' + rows.id + ')">更新</a>';
                    return result;
                }
            }
        ],
        viewrecords: true,
        height: 360,
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
            "uses": -1
        },
        gridComplete: function () {
            var grid = $("#jqGrid");
            grid.closest(".ui-jqgrid-bdiv").css({"overflow-x": "hidden"});
            grid.setGridWidth(1400);
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
            { label: '图片', name: 'siconpath', index: 'siconpath', width: 40,formatter: function(cellValue,options,rowObject){
                    var	imgUrl = '<img src="'+baseURL + '/file/download?fullPath='+ rowObject.siconpath+'" style="width:50px;height:25px;"/>';
                    return imgUrl;
                } },
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
                    var actionHtml = "<a class='btn btn-default btn-sm' btnPermission='tuappsprovide2:add' onclick='add("+rowObject.id+");'>添加</a>";
                    return actionHtml;
                } }
        ],
        viewrecords: true,
        height: 360,
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
            grid.setGridWidth(1400);
            //刷新按钮权限
            refreshBtnPermission();
        }
    });

    $('#pic').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget);
        var id = button.data('id');

        var grid = $('#jqGrid');
        vm.labelAppNamePic = grid.jqGrid('getCell', id, 'appname');
        vm.labelPackagePic = grid.jqGrid('getCell', id, 'packagename');

        $.get(baseURL + "tuappsprovide/info/" + id, function(r){
            if (r.code === 0) {
                vm.picUrl = baseURL + 'file/download?fullPath=' + r.tuAppsProvide.picurl;
            } else {
                alert(r.msg);
            }
        });

        vm.labelTitlePic = "查看";

    });

    initDeviceTypeSelect();

    initDeviceTypeSelect4App();

});

var vm = new Vue({
    el: '#rrapp',
    data: {
        tab: 'firstStep',

        deviceTypeList: [],
        deviceTypeSelected: {},
        customerMaps: [],
        customerSelected: {},

        deviceTypeList4App: [],
        deviceTypeSelected4App: {},
        customerMaps4App: [],
        customerSelected4App: {},

        queryAppName: '',
        queryAppPackage: '',

        queryAddAppName: '',

        picUrl: '',
        labelTitlePic: '',
        labelAppNamePic: '',
        labelPackagePic: '',

        // select相关的data
        appUsesSelectOptions: [
            {value: 'hot_search', text: '热搜应用'},
            {value: 'must_install', text: '装机必备'},
            {value: 'enter_recommend', text: '进入时推荐'},
            {value: 'exit_recommend', text: '退出时推荐'},
            {value: 'hotkey_recommend', text: '热键推送应用'},
            {value: 'cpa', text: 'CPA推荐'}
        ],

        appUsesSelected: {}

    },
    watch: {
        deviceTypeSelected: function (deviceType) {
            initCustomerSelectByDeviceTypeId(deviceType.devicetypeid);
        },
        deviceTypeSelected4App: function (deviceType) {
            initCustomerSelect4AppByDeviceTypeId(deviceType.devicetypeid);
        }
    },
    methods: {
        nextStep: function () {
            if (!vm.appUsesSelected) {
                alert("请选择用途");
                return;
            }
            if (!vm.deviceTypeSelected) {
                alert("请选择型号");
                return;
            }
            if (!vm.customerSelected) {
                alert("请选择渠道");
                return;
            }

            vm.tab = "secondStep";
            vm.reload();
        },
        preStep: function () { {}
          vm.tab = "firstStep";
        },
        query: function () {
            vm.reload();
        },
        queryAppList: function () {
            vm.reloadAppList();
        },
        add: function () {
            var grid = $("#appJqGrid");
            var rowKey = grid.getGridParam("selrow");
            if (!rowKey) {
                alert("请选择至少一条需要添加的应用");
                return;
            }

            var ids = grid.getGridParam("selarrrow");

            var appProvideList = [];
            ids.forEach(function (value, index, array) {
                appProvideList.push({appid: value, uses: vm.appUsesSelected.value});
            });

            var appProvideWithDC = {
                deviceTypeId: vm.deviceTypeSelected.devicetypeid,
                customerId: vm.customerSelected.customerid,
                appProvideList: appProvideList
            };

            $.ajax({
                type: "POST",
                url: baseURL + "tuappsprovide2/save",
                contentType: "application/json",
                data: JSON.stringify(appProvideWithDC),
                success: function (r) {
                    if (r.status === 0) {
                        alert('操作成功', function (index) {
                            vm.reload();
                        });
                    } else {
                        alert(r.msg);
                    }
                }
            });
        },
        del: function () {
            var ids = getSelectedRows();
            if (ids == null) {
                return;
            }

            var appProvideList = [];
            ids.forEach(function (provideId) {
                appProvideList.push({
                    id: provideId
                });
            });

            var appProvideWithDC = {
                deviceTypeId: vm.deviceTypeSelected.devicetypeid,
                customerId: vm.customerSelected.customerid,
                appProvideList: appProvideList
            };

            confirm('确定要删除选中的记录？', function () {
                $.ajax({
                    type: "POST",
                    url: baseURL + "tuappsprovide2/delete",
                    contentType: "application/json",
                    data: JSON.stringify(appProvideWithDC),
                    success: function (r) {
                        if (r.status === 0) {
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
        reload: function () {
          var queryParam = {
            appName: vm.queryAppName,
            appPackage: vm.queryAppPackage,
            uses: vm.appUsesSelected.value,
            deviceTypeId: vm.deviceTypeSelected.devicetypeid,
            customerId: vm.customerSelected.customerid
          };
          console.log(queryParam);
          var page = 1;
            $("#jqGrid").jqGrid('setGridParam',{
                page:page,
                postData: queryParam
            }).trigger("reloadGrid");
        },
        reloadAppList: function () {
            var queryParam = {
                appName: vm.queryAddAppName,
                deviceTypeId: vm.deviceTypeSelected4App.devicetypeid,
                customerId: vm.customerSelected4App.customerid
            };
            var page = 1;
            $("#appJqGrid").jqGrid('setGridParam',{
                page:page,
                postData: queryParam
            }).trigger("reloadGrid");
        }
    }
});

function initDeviceTypeSelect() {
    $.get(baseURL + "devicetype/query", function (r) {
        if (r.status === 0) {
            vm.deviceTypeList = r.deviceTypeList;
        } else {
            alert(r.msg);
        }
    });
}

function initDeviceTypeSelect4App() {
    $.get(baseURL + "devicetype/query", function (r) {
        if (r.status === 0) {
            var deviceTypeList = r.deviceTypeList;
            var all = { devicetypeid: '', devicetype: '全部' };
            deviceTypeList.unshift(all);
            vm.deviceTypeList4App = deviceTypeList;
            vm.deviceTypeIdSelected = '';
        } else {
            alert(r.msg);
        }
    });
}

function initCustomerSelectByDeviceTypeId(deviceTypeId) {
    $.get(baseURL + "typecustomermap/info/" + deviceTypeId, function (r) {
        if (r.status === 0) {
            vm.customerMaps = r.customerMaps;
            vm.customerSelected = '';
        } else {
            alert(r.msg);
        }
    });
}

function initCustomerSelect4AppByDeviceTypeId(deviceTypeId) {
    if (!deviceTypeId) {
        var customerMaps = [];
        var all = { customerid: '', customername: '全部' };
        customerMaps.unshift(all);
        vm.customerMaps4App = customerMaps;
        vm.customerSelected4App = '';
    } else {
        $.get(baseURL + "typecustomermap/info/" + deviceTypeId, function (r) {
            var customerMaps = r.customerMaps;
            var all = { customerid: '', customername: '全部' };
            customerMaps.unshift(all);
            vm.customerMaps4App = customerMaps;
            vm.customerSelected4App = '';
        });
    }
}

function add(id) {
    if (id == null) {
        return;
    }
    var appProvideList = [];
    appProvideList.push({
        appid: id,
        uses: vm.appUsesSelected.value
    });
    var appProvideWithDC = {
        deviceTypeId: vm.deviceTypeSelected.devicetypeid,
        customerId: vm.customerSelected.customerid,
        appProvideList: appProvideList
    };
    $.ajax({
        type: "POST",
        url: baseURL + "tuappsprovide2/save",
        contentType: "application/json",
        data: JSON.stringify(appProvideWithDC),
        success: function (r) {
            if (r.status === 0) {
                alert('操作成功', function (index) {
                    vm.reload();
                });
            } else {
                alert(r.msg);
            }
        }
    });
}

function del(provideId) {
    if (provideId == null) {
        return;
    }

    var appProvideList = [];
    appProvideList.push({
        id: provideId
    });
    var appProvideWithDC = {
        deviceTypeId: vm.deviceTypeSelected.devicetypeid,
        customerId: vm.customerSelected.customerid,
        appProvideList: appProvideList
    };

    confirm('确定要删除记录？', function () {
        $.ajax({
            type: "POST",
            url: baseURL + "tuappsprovide2/delete",
            contentType: "application/json",
            data: JSON.stringify(appProvideWithDC),
            success: function (r) {
                if (r.status === 0) {
                    alert('操作成功', function (index) {
                        $("#jqGrid").trigger("reloadGrid");
                    });
                } else {
                    alert(r.msg);
                }
            }
        });
    });
}

//修改排序
function update(provideId) {
    if (provideId == null) {
        return;
    }
    
    confirm('确定要保存记录？', function () {
    	var sort = $('#'+provideId+'Sort').val();
    	$.get(baseURL + "tuappsprovide2/update",{sort:sort,provideId:provideId},function(r){
    		if (r.status === 0) {
                alert('操作成功', function (index) {
                    $("#jqGrid").trigger("reloadGrid");
                });
            } else {
                alert(r.msg);
            }
    	});
    });
}
