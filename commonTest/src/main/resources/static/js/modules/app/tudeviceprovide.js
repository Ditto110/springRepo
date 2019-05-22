$(function () {
    $("#jqGrid").jqGrid({
        url: baseURL + 'tudeviceprovide/list',
        datatype: "json",
        colModel: [
			{ label: '序列号', name: 'sn', index: 'sn', width: 80 },
			{ label: '创建时间', name: 'createtime', index: 'createTime', width: 80 },
			{ label: '修改时间', name: 'updatetime', index: 'updateTime', width: 80 },
            { label: '操作', name: 'opt', width:60,
                formatter: function (value, grid, rows, state) {
                    return '<a class="btn btn-default" btnPermission="tudeviceprovide:del" onclick="del('+ rows.id +')">删除</a>';
                }
            }
        ],
		viewrecords: true,
        height: 525,
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
        postData: {
            'uses': '空'
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

    init_upload_com();

});

var vm = new Vue({
	el:'#rrapp',
	data:{
        tab: 'main',
		title: null,

		importUses: '',

        useSelected: '',

        querySn: '',
		queryDeviceId: '',

		useOptions: [
			{ text: '推送规避', value: 'avoid'},
            { text: '精准推送', value: 'precision'},
			{ text: '测试机器', value: 'test'}
		],
		tuDeviceProvide: {}
	},
	watch: {
		useSelected: function (use) {
			vm.reload();
        }
	},
	methods: {
        toMain: function () {
			vm.tab = 'main';
        },
		query: function () {
			vm.reload();
		},
        importExcel: function() {
            if (vm.useSelected === '') {
                alert("请选择用途");
                return;
            }

			vm.tab = 'import';

            vm.importUses = vm.useSelected;
		},
		add: function(){
			if (vm.useSelected === '') {
				alert("请选择用途");
				return;
			}

			vm.tab = 'add';
			vm.title = "新增";
			vm.tuDeviceProvide = {
				uses: vm.useSelected
			};
		},
		update: function (event) {
			var id = getSelectedRow();
			if(id == null){
				return ;
			}
			vm.tab = 'add'
            vm.title = "修改";
            
            vm.getInfo(id)
		},
		saveOrUpdate: function (event) {
			var url = vm.tuDeviceProvide.id == null ? "tudeviceprovide/save" : "tudeviceprovide/update";
			$.ajax({
				type: "POST",
			    url: baseURL + url,
                contentType: "application/json",
			    data: JSON.stringify(vm.tuDeviceProvide),
			    success: function(r){
			    	if(r.status === 0){
						alert('操作成功', function(index){
							vm.reload();
						});
					}else{
						alert(r.msg);
					}
				}
			});
		},
		del: function (event) {
			var ids = getSelectedRows();
			if(ids == null){
				return ;
			}
			
			confirm('确定要删除选中的记录？', function(){
				$.ajax({
					type: "POST",
				    url: baseURL + "tudeviceprovide/delete",
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
		},
		getInfo: function(id){
			$.get(baseURL + "tudeviceprovide/info/"+id, function(r){
                vm.tuDeviceProvide = r.tuDeviceProvide;
            });
		},
		reload: function (event) {
			vm.tab = 'main';
			var page = $("#jqGrid").jqGrid('getGridParam','page');
			$("#jqGrid").jqGrid('setGridParam',{
                postData: {
                    'uses': vm.useSelected,
                    'sn': vm.querySn,
					'deviceid': vm.queryDeviceId
                },
                page:page
            }).trigger("reloadGrid");
		}
	}
});

function init_upload_com(){

    $('#uploadControl').uploadifive({
        'auto'             : true,
        'fileTypeDesc': 'Excel Files',
        'removeCompleted' : true,
        'multi'        : false,
        'buttonText' : '选择Excel文件',
        'fileType': 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'fileSizeLimit' : '50MB',
        'formData'         : {},
        'queueID'          : 'fileQueue',
        'uploadScript'     : baseURL + 'tudeviceprovide/importExcel',
        'onUpload': function () {
            $('#uploadControl').data('uploadifive').settings.formData = {
                'uses': vm.importUses
            };
        },
        'onUploadComplete' : function(file, data) {
            var r = JSON.parse(data);
            if (r.code === 0) {
                vm.reload();
                alert(r.msg);
            } else {
                alert(r.msg);
            }
        }
    });
}

function edit(id) {
    if(id == null){
        return ;
    }
    vm.showList = false;
    vm.title = "修改";

    vm.getInfo(id);
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
            url: baseURL + "tudeviceprovide/delete",
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