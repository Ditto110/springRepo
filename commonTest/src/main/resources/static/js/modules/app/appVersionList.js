var id = T.p('id');
$(function () {
    $("#jqAppVersionInfoGrid").jqGrid({
        url: baseURL + 'admin/tbapp/versionList',
        datatype: "json",
        colModel: [
            {label: '文件名称', name: 'apkName', index: 'apkName', width: 100},
            {label: '应用包名', name: 'apkPackageName', index: 'apkPackageName', width: 220},
            {label: '版本名称', name: 'apkVersionName', index: 'apkVersionName', width: 75},
            {label: '版本号', name: 'apkVersionCode', index: 'apkVersionCode', width: 75},
            {label: '下载地址', name: 'apkcdnUrl', index: 'apkcdnUrl', width: 280},
            {
                label: '小图标',
                name: 'siconpath',
                index: 'siconpath',
                width: 100,
                formatter: function (cellValue, options, rowObject) {
                    if (cellValue == null) {
                        return '<font style="color: red">不存在</font>';
                    } else {
                        var imgUrl = '<img src="' + baseURL + '/file/download?fullPath=' + cellValue + '" style="width:50px;height:25px;"/>';
                        return imgUrl;
                    }

                }
            },
            {
                label: '大图标',
                name: 'biconpath',
                index: 'biconpath',
                width: 100,
                formatter: function (cellValue, options, rowObject) {
                    if (cellValue == null) {
                        return '<font style="color: red">不存在</font>';
                    } else {
                        var imgUrl = '<img src="' + baseURL + '/file/download?fullPath=' + cellValue + '" style="width:50px;height:25px;"/>';
                        return imgUrl;
                    }
                }
            },
            {
                label: '操作', name: 'opt', width: 90,
                formatter: function (value, grid, rows, state) {
                    return "<a class='btn btn-primary' onclick=appVersionListVM.setInstallAppInfo(" + JSON.stringify(rows) + ")>选择</a>"
                }
            }
        ],
        postData: {appid: id},
        viewrecords: true,
        height: 280,
        rowNum: 10,
        rowList: [10, 30, 50],
        rownumbers: true,
        rownumWidth: 25,
        autowidth: true,
        multiselect: false,
        pager: "#jqAppVersionInfoGridPager",
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
            $("#jqAppVersionInfoGrid").closest(".ui-jqgrid-bdiv").css({"overflow-x": "hidden"});
        }
    });

});


var appVersionListVM = new Vue({
    el: '#getAppVersionInfo',
    methods: {
        setInstallAppInfo: function (row) {

            parent.parent.vm.ui_cell.apkPackageName = row.apkPackageName;
            parent.parent.vm.ui_cell.apkVersionName = row.apkVersionName;
            parent.parent.vm.ui_cell.apkVersionCode = row.apkVersionCode;
            parent.parent.vm.ui_cell.apkcdnUrl = row.apkcdnUrl;
            parent.parent.vm.ui_cell.apkSize = row.apkSize;
            parent.parent.vm.ui_cell.apkName = row.apkName;
            parent.parent.vm.ui_cell.apkMd5 = row.apkMd5;
            parent.parent.vm.ui_cell.appid = id;
            parent.parent.vm.ui_cell.apkSmallIconPath = row.siconpath;
            parent.parent.vm.ui_cell.apkBigIconPath = row.biconpath;
            
            parent.parent.vm.ui_cell.apkWeiPoint = row.weiPoint;
            parent.parent.vm.ui_cell.apkFileName = row.apkFileName;

            if (row.siconpath != null && row.siconpath != '') {
                parent.parent.$("#apkSmallIconSrc").attr("src", baseURL + '/file/download?fullPath=' + row.biconpath);
                parent.parent.$("#apkSmallIconSrc").css("display", "block");
            } else {

                parent.parent.$("#apkSmallIconSrc").removeAttr("src");
                parent.parent.$("#apkSmallIconSrc").css("display", "none");
            }

            if (row.biconpath != null && row.biconpath != '') {
                parent.parent.$("#apkBigIconSrc").attr("src", baseURL + '/file/download?fullPath=' + row.siconpath);
                parent.parent.$("#apkBigIconSrc").css("display", "block");
            } else {
                parent.parent.$("#apkBigIconSrc").removeAttr("src");
                parent.parent.$("#apkBigIconSrc").css("display", "none");
            }

            parent.parent.layer.closeAll();


        }
    }
});

