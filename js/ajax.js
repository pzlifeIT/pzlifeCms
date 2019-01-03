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
        if ('withCredentials' in xhr) { console.log(xhr) }
        let url = 'http://wwwapi.pzlife.vip/'
        url += params.url
        let type = params.type || 'post'
        type = type.toUpperCase();
        // 用于清除缓存
        let random = Math.random();
        params.data = params.data || ''
        if (typeof params.data == 'object') {
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
            // 如果需要像 html 表单那样 POST 数据，请使用 setRequestHeader() 来添加 http 头。
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
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
        addsupplier: function() { //
            quest.Ajax({
                url: 'admin/suppliers/addsupplier',
                success: function(res) {
                    if (res.code == '200') {
                        params.success(res)
                    }
                }
            })
        },
        addsupplierfreight: function() {
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