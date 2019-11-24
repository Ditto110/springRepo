var basePath = rootBasePath();
//生成菜单
var menuItem = Vue.extend({
    name: 'menu-item',
    props: {item: {}, index: 0},
    template: [
        '<li :class="{active: (index === 0)}">',
        '<a v-if="item.children!=null" href="javascript:;">',
        '<i class="fa fa-angle-left"></i>',
        '<span>{{item.text}}</span>',
        '</a>',
        '<ul v-if="item.children!=null" class="treeview-menu">',
        '<menu-item :item="item" :index="index" v-for="(item, index) in item.children"></menu-item>',
        '</ul>',
        '<a v-if="item.children == null" :href="\'#\'+basePath+item.attributes.url"  @click="vm.updateNav">' +
        '<i class="fa fa-circle-o"></i> {{item.text}}' +
        '</a>',
        '</li>'
    ].join('')
});

//iframe自适应
$(window).on('resize', function () {
    var $content = $('.content');
    $content.height($(this).height() - 120);
    $content.find('iframe').each(function () {
        $(this).height($content.height());
    });
}).resize();

//注册菜单组件
Vue.component('menuItem', menuItem);

var vm = new Vue({
    el: '#rrapp',
    data: {
        user: {},
        menuList: {},
        main: "main.html",
        password: '',
        newPassword: '',
        navTitle: "欢迎页",
        navTitle2: "",
        navTitle3: ""
    },
    methods: {
        getMenuList: function () {
            var timesInfo = new Date().getTime();
            var loadUrl = baseURL + "adminInfo/getLeftPrivilegeTreeBySystemID?t=" + timesInfo;
            $.getJSON(loadUrl, function (r) {
                // console.log("r11 : " + r.msg);
                var menuObj = JSON.parse(r.msg);
                vm.menuList = menuObj[0].child;
                window.permissions = r.permissions;
            });
        },
        getUser: function () {
            $.getJSON(baseURL + "sys/user/info", function (r) {
                vm.user = r.user;
            });
        },
        updatePassword: function () {
            layer.open({
                type: 1,
                skin: 'layui-layer-molv',
                title: "修改密码",
                area: ['550px', '270px'],
                shadeClose: false,
                content: jQuery("#passwordLayer"),
                btn: ['修改', '取消'],
                btn1: function (index) {
                    var data = "password=" + vm.password + "&newPassword=" + vm.newPassword;
                    $.ajax({
                        type: "POST",
                        url: baseURL + "sys/user/password",
                        data: data,
                        dataType: "json",
                        success: function (r) {
                            if (r.code == 0) {
                                layer.close(index);
                                layer.alert('修改成功', function () {
                                    location.reload();
                                });
                            } else {
                                layer.alert(r.msg);
                            }
                        }
                    });
                }
            });
        },
        logout: function () {
            //删除本地token
//            localStorage.removeItem("token");
            //跳转到登录页面
//            location.href = baseURL + 'login.html';
//            location.href = "http://192.168.52.13:2727/casv2/logout";
        },
        donate: function () {
            layer.open({
                type: 2,
                title: false,
                area: ['806px', '467px'],
                closeBtn: 1,
                shadeClose: false,
                content: ['http://cdn.renren.io/donate.jpg', 'no']
            });
        },
        updateNav:function () {
            vm.navTitle2 = "";
            vm.navTitle3 = "";
        }
    },
    created: function () {
        this.getMenuList();
        this.getUser();
    },
    updated: function () {
        //路由
        var router = new Router();
        routerList(router, vm.menuList);
        router.start();
    }
});


function routerList(router, menuList) {
    // console.log("routerList menuList : "+JSON.stringify(menuList));
    for (var index = 0; index < menuList.length; index++) {
        // var menu = menuList[key];
        var menu = menuList[index];
        /*   console.log("routerList menu : "+JSON.stringify(menu));*/
        if (menu.children && menu.children.length > 0) {
            routerList(router, menu.children);
        } else {
            // console.log("menu.attributes : "+JSON.stringify(menu.attributes));
            if (menu.attributes && menu.attributes.url != "#") {
                /* console.log("routerList add : "+'#' + menu.attributes.url);*/
                router.add('#' + basePath + menu.attributes.url, function () {
                    var url = window.location.hash;
                    //替换iframe的url
                    vm.main = url.replace('#', '');
                    // console.log("vm.main : "+vm.main)
                    //导航菜单展开
                    $(".treeview-menu li").removeClass("active");
                    $(".sidebar-menu li").removeClass("active");
                    $("a[href='" + url + "']").parents("li").addClass("active");
                    vm.navTitle = $("a[href='" + url + "']").text();
                });
            }

        }
    }
}


