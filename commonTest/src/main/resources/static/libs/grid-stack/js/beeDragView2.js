/**
 * 全媒资拖拽控件
 */
(function ($) {
    String.prototype.isInt = function (obj) {
        if (this == "NaN")
            return false;
        return this == parseInt(this).toString();
    };
    $.fn.beeDragView = function (options) {
        var defaults = {
            cellHeight: 40,
            verticalMargin: 15,
            width: 24,
            height: 72,
            float: true,
            animate: true,
            handle: '.item-header',
            dblclickEditUrl: "editPanelData.html",
            dblclickAddUrl: "addPanelData.html",
            resizeCallback: function (el, width, height) {

                var node = el.data('_gridstack_node');

                el.find(".item-header .size-info").html("(" + node.indexOfPanel + "*" + node.widthPX + "*" + node.heightPX + ")");
            },
            removeViewCallback: function (grid, view, node) {
                if (node == undefined) {
                    return;
                }
                if (!confirm("要删除UI板块？")) {
                    return;
                }
                grid.removeWidget(view);
            },
            dragOrResizeCallback: function () {

            },
            ajaxCallback: function (el, data) {
                /*                console.log("ajaxCallback data:");
                 console.log(data);*/
                $("#myModal .modal-content").html(data);
                $("#myModal").modal("show");
                var node = context.getItemLayout(el);
                // console.log(node);
                $("#width").val(node.width);
                $("#height").val(node.height);
                $("#x").val(node.x);
                $("#y").val(node.y);
                if (node.id != null) {
                    $("#id").val(node.id);
                }
                $("#imageUrl").val(node.imageUrl);
                $("#temp").val(node.temp);
            }
        };
        var template = function (node) {

            var content;
            if (node.publish == 1) {
                content = '<div class="grid-stack-item"><div class="grid-stack-item-content"><div class="item-box" ><div class="item-header"><span class="size-info"></span></div><div class="item-content" style="background-image: url(\'' + node.imageUrl + '\');">' + '</div>';

            } else {
                content = '<div class="grid-stack-item"><div class="grid-stack-item-content"><div class="item-box" ><div class="item-header"><span class="size-info"></span></div><div class="item-content" style="background-image: url(\'' + node.imageUrl + '\');"><div class="item-all"> </div>' + '</div>';

            }
            content += ' </div></div></div>';

            return content;
        };
        options = $.extend(defaults, options);

        var data = null;
        if (options.data != undefined) {
            data = options.data;
            delete options.data;
        }
        $(this).gridstack(options);
        grid = $(this).data("gridstack");

        if (data != null) {
            $.each(data, function (i, node) {
                var myNode = {};
                if (node.id != undefined) {
                    myNode.id = node.id;
                }
                if (node.imageUrl != undefined) {
                    myNode.imageUrl = node.imageUrl;
                } else {
                    myNode.imageUrl = "";
                }

                if (node.temp != undefined) {
                    myNode.temp = node.temp;
                }

                myNode.x = node.column;
                myNode.y = node.row;
                myNode.width = node.columnSize;
                myNode.height = node.rowSize;
                myNode.widthPX = node.width;
                myNode.heightPX = node.hight;
                myNode.indexOfPanel = node.indexOfPanel;
                myNode.temp = node.temp;
                grid.addWidget(template(node), myNode);
            });
        }

        var context = {
            grid: grid,
            addWidget: function (node) {
                grid.addWidget(template(node), node);
            },
            checkFillAll: function () {
                var isFillAll = true;
                for (var i = 0; i < grid.opts.width; i++) {
                    for (var n = 0; n < grid.opts.height; n++) {
                        if (grid.isAreaEmpty(i, n, 1, 1)) {
                            isFillAll = false;
                            break;
                        }
                    }
                    if (!isFillAll) {
                        break;
                    }
                }
                return isFillAll;
            },
            getLayout: function () {
                var $this = this;
                var res = _.map($(".grid-stack-item:not(.grid-stack-placeholder)", grid.container), function (el) {
                    el = $(el);
                    return $this.getItemLayout(el);
                });
                return res;
            },
            getItemLayout: function (el) {
                var node = el.data('_gridstack_node');
                if (node == undefined)
                    return node;
                var nodeVal = {
                    id: node.id,
                    row: node.y,
                    column: node.x,
                    rowSize: node.height,
                    columnSize: node.width
                };
                /*                if(node.locked==true){
                 nodeVal.locked=1;
                 }else {
                 nodeVal.locked=0;
                 }*/
                if (node.id == undefined) {
                    nodeVal.id = null;
                }
                var imageUrl = el.data("gs-image");
                var width = el.data("gs-widthPX");
                var height = el.data("gs-heightPX");
                var indexOfPanel = el.data("gs-indexOfPanel");
                var temp = el.data("gs-temp");
                if (imageUrl == undefined) {
                    nodeVal.imageUrl = null;
                } else {
                    nodeVal.imageUrl = imageUrl;
                }
                if (width == undefined) {
                    nodeVal.width = null;
                } else {
                    nodeVal.width = width;
                }
                if (height == undefined) {
                    nodeVal.height = null;
                } else {
                    nodeVal.height = height;
                }
                if (indexOfPanel == undefined) {
                    nodeVal.indexOfPanel = null;
                } else {
                    nodeVal.indexOfPanel = indexOfPanel;
                }
                if (temp == undefined) {
                    nodeVal.temp = 0;
                } else {
                    nodeVal.temp = temp;
                }
                return nodeVal;
            }
        };

        $(this).on("click", ".grid-stack-item .item-footer .menu-item", function () {
            var view = $(this).parents(".grid-stack-item");
            var node = context.getItemLayout(view);
            options.removeViewCallback(grid, view, node);
        });
        $(this).on("dblclick", ".grid-stack-item .item-content", function () {
            var parent = $(this);
            var gridStackItem = $(this).parents(".grid-stack-item");
            context.dblclickItemView = gridStackItem;
            // id 参数
            var id = gridStackItem.data("gs-id");
            var temp = gridStackItem.data("gs-temp");
            var url = null;
            var params = {};
            if (id == undefined) {
                url = options.dblclickAddUrl;
            } else {
                url = options.dblclickEditUrl;
                params.id = id;
                // hard-code TODO
                $('#click_grid_stack_temp_id').val(id);
                $('#click_grid_stack_temp_temp').val(temp);
            }
            $.get(url, params, function (data, status) {
                if (status != "success") {
                    return;
                }
                if (grid.opts.ajaxCallback != undefined && typeof grid.opts.ajaxCallback == "function") {
                    grid.opts.ajaxCallback(parent.parents(".grid-stack-item"), data);
                }
            });

        });
        return context;
    };
})(jQuery);
