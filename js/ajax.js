;
(function() {

    window.quest = function() {

    }
    window.quest = quest.prototype

    quest.Ajax = function(params) {
        // 创建ajax对象
        let xhr = null;
        if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        } else {
            xhr = new ActiveXObject('Microsoft.XMLHTTP')
        }
        if ('withCredentials' in xhr) {}
        let url = 'http://wwwapi.pzlife.vip/'
        url += params.url
        let type = params.type || 'post'
        type = type.toUpperCase();
        // 用于清除缓存
        let random = Math.random();
        params.data = params.data || ''
        if (!(params.data instanceof FormData) & typeof params.data == 'object') {
            let str = '';
            for (let key in params.data) {
                str += key + '=' + params.data[key] + '&';
            }
            params.data = str.replace(/&$/, '');
        }

        if (type == 'GET') {
            if (params.data) {
                xhr.open('GET', url + '?' + params.data, true);
            } else {
                xhr.open('GET', url + '?t=' + random, true);
            }
            xhr.send();

        } else if (type == 'POST') {
            xhr.open('POST', url, true);

            if (params.data instanceof FormData) {
                // xhr.setRequestHeader("Content-type", "multipart/form-data;");
            } else {
                xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded", "charset=utf-8");
            }
            xhr.send(params.data);
        }

        // 处理返回数据
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    params.success(JSON.parse(xhr.responseText));
                } else {
                    if (typeof params.failed == 'function') {
                        params.failed(xhr.status);
                    }
                }
            }
        }
    }
    quest.questurl = {
        updateSupplier: 'admin/suppliers/updateSupplier', //修改供应商
        updateSupplierFreight: 'admin/suppliers/updateSupplierFreight', //修改供应商快递模板
        addSupplier: 'admin/suppliers/addSupplier', //新建供应商
        addsupplierfreight: 'admin/suppliers/addsupplierfreight', //新建供应商快递模板
        addSupplierFreightdetail: 'admin/suppliers/addSupplierFreightdetail', //新增供应商快递模板运费
        updatesupplierfreightarea: 'admin/suppliers/updatesupplierfreightarea', //更新运费模版和市的价格关联
        getsupplierfreights: 'admin/suppliers/getsupplierfreights', //获取供应商快递模板列表
        getSupplierFreightdetailList: 'admin/suppliers/getSupplierFreightdetailList', //获取供应商快递模板运费列表
        getSuppliers: 'admin/suppliers/getSuppliers', //获取供应商列表
        getSupplierFreight: 'admin/suppliers/getSupplierFreight', //获取供应商快递模板
        getSupplierFreightdetail: 'admin/suppliers/getSupplierFreightdetail', //获取供应商快递模板详情
        getSupplierData: 'admin/suppliers/getSupplierData', //获取供应商详情
        getsuppliersall: 'admin/suppliers/getsuppliersall', //获取所有供应商
        stopStartCate: 'admin/category/stopStartCate', //停用/启用分类
        getCateList: 'admin/category/getCateList', //分类列表
        delcategory: 'admin/category/delcategory', //删除分类
        allCateList: 'admin/category/allCateList', //所有商品分类
        saveeditcate: 'admin/category/saveeditcate', //提交编辑
        saveaddcate: 'admin/category/saveaddcate', //添加分类
        getThreeCate: 'admin/category/getThreeCate', //获取三级分类
        addCatePage: 'admin/category/addCatePage', //获取前两级分类
        editcatepage: 'admin/category/editcatepage', //获取需要编辑的分类数据
        delGoods: 'admin/goods/delGoods', //删除商品
        saveupdategoods: 'admin/goods/saveupdategoods', //删除商品
        getgoodslist: 'admin/goods/getGoodsList', //商品列表
        saveaddgoods: 'admin/goods/saveAddGoods', //添加商品
        addgoodsspec: 'admin/goods/addgoodsspec', //添加商品的规格属性
        getgoodssku: 'admin/goods/getgoodssku', //获取一个sku信息
        editgoodssku: 'admin/goods/editgoodssku', //获取一个sku信息
        getonegoods: 'admin/goods/getOneGoods', //获取一个商品数据
        getProvinceCity: 'admin/provinces/getProvinceCity', //省市列表
        getArea: 'admin/provinces/getArea', //获取区级列表
        getCity: 'admin/provinces/getCity', //获取市级列表
        getprovincecitybyfreight: 'admin/provinces/getprovincecitybyfreight', //获取运费模版的剩余可选省市列表
        saveEditSpecAttr: 'admin/spec/saveEditSpecAttr', //修改属性/规格
        delSpecAttr: 'admin/spec/delSpecAttr', //删除属性/规格
        getSpecList: 'admin/spec/getSpecList', //属性列表
        savespecattr: 'admin/spec/savespecattr', //添加属性/规格
        addAttrPage: 'admin/spec/addAttrPage', //获取一级规格
        getspecattr: 'admin/spec/getspecattr', //获取一级规格和二级属性
        getAttr: 'admin/spec/getAttr', //获取二级属性
        getEditData: 'admin/spec/getEditData', //获取需要编辑的规格/属性数据
        loginUserByOpenid: 'index/user/loginUserByOpenid', //通过openid获取uid和手机号
        getUser: 'index/user/getUser', //通过uid获取用户信息
        getSms: 'admin/note/getSms', //查询短信记录
        sendSms: 'admin/note/sendSms', //短信验证码发送
        uploadfile: 'admin/upload/uploadfile' //上传单个图片

    }

    quest.requests = function(params) {
        let t = this
        if (!t.questurl[params.url]) return
        t.Ajax({
            data: params.data || '',
            url: t.questurl[params.url],
            success: function(res) {
                if (res.code == '200') {
                    params.success(res)
                }
            }
        })
    }
    quest.getcatelist = function(params) { //分类列表
        this.Ajax({
            data: params.data,
            url: 'admin/category/getcatelist',
            success: function(res) {
                if (res.code == '200') {
                    params.success(res)
                }
            }
        })
    }
    quest.addcatepage = function(params) { //获取前两级分类
        this.Ajax({
            data: params.data,
            url: 'admin/category/addcatepage',
            success: function(res) {
                if (res.code == '200') {
                    params.success(res)
                }
            }
        })
    }
    quest.saveeditcate = function(params) { //提交编辑
        this.Ajax({
            data: params.data,
            url: 'admin/category/saveeditcate',
            success: function(res) {
                if (res.code == '200') {
                    params.success(res)
                }
            }
        })
    }
    quest.stopstartcate = function(params) { //停用/启用分类
        this.Ajax({
            data: params.data,
            url: 'admin/category/stopstartcate',
            success: function(res) {
                if (res.code == '200') {
                    params.success(res)
                }
            }
        })
    }
    quest.saveaddcate = function(params) { //添加分类
        this.Ajax({
            data: params.data,
            url: 'admin/category/saveaddcate',
            success: function(res) {
                if (res.code == '200') {
                    params.success(res)
                }
            }
        })
    }
    quest.editcatepage = function(params) { //编辑分类页面
        this.Ajax({
            data: params.data,
            url: 'admin/category/editcatepage',
            success: function(res) {
                if (res.code == '200') {
                    params.success(res)
                }
            }
        })
    }

    quest.getProvinceCity = function(params) {
        this.Ajax({
            url: 'admin/index/getProvinceCity',
            success: function(res) {
                if (res.code == '200') {
                    params.success(res)
                }
            }
        })
    }
    quest.suppliers = {
        updateSupplier: function(params) {
            quest.Ajax({
                data: params.data || '',
                url: 'admin/suppliers/updateSupplier',
                success: function(res) {
                    if (res.code == '200') {
                        params.success(res)
                    }
                }
            })
        },
        addsupplier: function(params) { //
            quest.Ajax({
                data: params.data || '',
                url: 'admin/suppliers/addsupplier',
                success: function(res) {
                    if (res.code == '200') {
                        params.success(res)
                    }
                }
            })
        },
        addsupplierfreight: function(params) {
            quest.Ajax({
                url: 'admin/suppliers/addsupplierfreight',
                success: function(res) {
                    if (res.code == '200') {
                        params.success(res)
                    }
                }
            })
        },
        getsuppliers: function(params) {
            quest.Ajax({
                data: params.data || '',
                url: 'admin/suppliers/getsuppliers',
                success: function(res) {
                    if (res.code == '200') {
                        params.success(res)
                    }
                }
            })
        },
        getsupplierfreights: function() {
            quest.Ajax({
                url: 'admin/suppliers/getsupplierfreights',
                success: function(res) {
                    if (res.code == '200') {
                        params.success(res)
                    }
                }
            })
        },
        getsupplierfreightdetail: function() {
            quest.Ajax({
                url: 'admin/suppliers/getsupplierfreightdetail',
                success: function(res) {
                    if (res.code == '200') {
                        params.success(res)
                    }
                }
            })
        },
        getsupplierdata: function(params) { //获取供应商详情
            quest.Ajax({
                data: params.data || '',
                url: 'admin/suppliers/getsupplierdata',
                success: function(res) {
                    if (res.code == '200') {
                        params.success(res)
                    }
                }
            })
        }
    }

})()



// 

function gparse(data) {
    return JSON.parse(data)
}

// getProvinceCity({
//     type: 'post',
//     success: function(res) {
//         console.log(res)
//     }
// })