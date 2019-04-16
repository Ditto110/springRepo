var vm = new Vue({
     el:'#defineProduct',
     data:{
         showList: true,
         VIPType_show:true,
         title:"",
         product:{
             productName:"",
             vipList:[]
         }
     },
     methods:{
         firstLvel_productTypeChange:function(){
             var v = $("#firstLevel_productType").val()
             if (v == 2 ){
                 vm.product.thirdProductId = "";
                 vm.VIPType_show = false;
                 $("#product_avail").html("<option value=\"1\">每月一次购买</option>")
                 vm.product.avail = "1";
             }else{
                 vm.VIPType_show = true;
                 $("#product_avail").html("<option value=\"0\">首次购买</option>")
                 vm.product.avail = "0";
                 $.ajax({
                     type:"get",
                     url:baseURL + "admin/thirdPart/getVipProductList",
                     data:"",
                     async:false,
                     success:function(r){
                        if (r.status !==0){
                            alert("获取VIP 产品列表失败");
                        } else{
                            vm.product.vipList = r.VIPProductList;
                        }
                     }
                 })
             }
         },
         SingleProductIDInput:function(){
            if (!vm.isNumber(vm.product.thirdProductId)){
                alert("请输入正确的单片ID，只能是数字 ")
            }
            $.ajax({
                type:"get",
                url:baseURL + "admin/thirdPart/getSingleProdcutInfo",
                data:{videoId: vm.product.thirdProductId},
                async:false,
                success:function (r) {
                    if (r.status !== 0){
                        alert(r.msg);
                    } else{
                        var parseRe = JSON.parse(r.productInfo);
                        if (parseRe.status === 0){
                            vm.product.thirdProductId = parseRe.data.videoId;
                            vm.product.productName = parseRe.data.name;
                        }else {
                            alert(parseRe.msg)
                        }
                    }
                }
            })
         },
         VIPProductInput:function(){
            var vipProductId = vm.product.VIPType;
            vm.product.productName = $("#secondLevel_productType option:selected").html();
            vm.product.vipType = $("#secondLevel_productType option:selected").attr("vipType");
         },
         save: function(){
             if (vm.product.type ==2 ){
                 if (!vm.product.thirdProductId){
                     alert("请输入单片ID")
                     return;
                 }
                 vm.product.vipType = 1001; //设置单片的vipType
             }else{ //如果是VIP会员需要将从第三方获取到的产品ID 复制到thirdProductId
                vm.product.thirdProductId = vm.product.VIPThirdProductId;
                 if (!vm.product.thirdProductId){
                     alert("请选择VIP产品类型")
                     return;
                 }
             }

             if (!vm.isNumber(vm.product.point)){
                 alert("输入的积分只能是数字，请重新确认");
                 return;
             }

             if (!vm.product.publish){
                 alert("请选择发布状态.");
                 return;
             }
             if (!vm.product.avail){
                 alert("请选择时效限制.");
                 return;
             }

             var url = baseURL + "admin/product/update"
             if (!vm.product.id){
                 url = baseURL + "admin/product/save"
             }

            $.ajax({
                type:"post",
                url:url,
                contentType:"application/json",
                data:JSON.stringify(vm.product),
                success:function(r){
                    if (r.status==0){
                        alert("添加产品成功")
                    } else{
                        alert("添加产品失败")
                    }
                    window.location.href = baseURL + "admin/job/tbJobList.html";
                }
            })
         },
         back:function(){
             window.location.href = baseURL + "admin/job/tbJobList.html";
         },
         validateParam:function () {
            if (!vm.isNumber(vm.product.point)){
                alert("输入的积分只能是数字，请重新确认");
                return;
            }
         },
         isNumber:function(value) {
            var patrn = /^[0-9]*$/;
            if (patrn.exec(value) == null || value == "") {
                return false
            } else {
                return true
            }
         }
     }
 })