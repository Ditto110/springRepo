$(function () {
    $("#listGrid").jqGrid({
        url:baseURL+ "admin/job/list",
        datatype:"json",
        colModel:[
            {label:"业务ID",name:"id",index:"id"},
            {label:"业务名称",name:"jobName",index:"jobName"},
            {label:"日志格式",name:"jobSubject",index:"jobSubject"},
            {label:"描述",name:"desc",index:"desc"},
            {label:"操作",name:"id",index:"id",formatter(value,Object,row){
                return [
                    "<button type='button' class='btn btn-info btn-xs'  onclick='productVM.addOrUpdate(" + value + ")'>修改</button>",
                    "<button type='button' class='btn btn-danger btn-xs' onclick='productVM.delete(" + value + ")'>删除</button>"
                ].join(" ")
                }}
        ],
        viewrecords: true,
        height: 500,
        rowNum: 10,
        rowList : [10,30,50],
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
            //隐藏grid垂直滚动条
            $("#jqGrid").closest(".ui-jqgrid-bdiv").css({ "overflow-y" : "scroll" });
        }
    })
});

var vm = new Vue({
    el:'#jobList',
    data:{
        showList:true
    }
})