var copyVM = new Vue({
    el: '#copy_launcher_page',
    data: {
        uiLauncher: {}
    },
    methods: {
        save: function () {
            var url = "uilauncher/copy";
            copyVM.uiLauncher.id = parent.vm.originLauncherId;
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(copyVM.uiLauncher),
                success: function (r) {
                    if (r.status == 0) {
                        alert('复制完成', function (index) {
                            copyVM.back();
                            parent.vm.reload();
                        });
                    } else {
                        alert(r.msg);
                    }
                },
                error: function () {
                    alert("请求失败,请联系管理员");
                    closeLoading();
                }
            });

        },
        back: function () {
            var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
            parent.layer.close(index); //再执行关闭
        }

    }
});
