import { apiurl } from '../config/config.js';
let apiHost = apiurl.apiHost

let Ajax = function(params) {
    // 创建ajax对象
    let xhr = null;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else {
        xhr = new ActiveXObject('Microsoft.XMLHTTP')
    }
    if ('withCredentials' in xhr) {}
    let url = apiHost;
    url += params.url;
    let type = params.type || 'post';
    type = type.toUpperCase();
    // 用于清除缓存
    let random = Math.random();
    params.data = params.data || '';
    if (!(params.data instanceof FormData) & typeof params.data == 'object' & type == 'POST') {
        params.data = JSON.stringify(params.data);
    }
    if (type == 'GET') {
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
            // xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded", "charset=utf-8");
            // xhr.setRequestHeader("Access-Control-Allow-Origin", "*", );
            xhr.setRequestHeader("Content-type", "text/plain", "charset=utf-8");
        }
        xhr.send(params.data);
    }

    // 处理返回数据
    xhr.onreadystatechange = function() {
        // console.log(xhr)
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
let questurl = {
    getOrders: 'Order/getOrders', //获取订单列表
    updateDeliverOrderGoods: 'Order/updateDeliverOrderGoods', //获取订单列表
    getOrderInfo: 'Order/getOrderInfo', //获取订单详情
    deliverOrderGoods: 'Order/deliverOrderGoods', //订单发货
    updateRecommend: 'Recommend/updateRecommend', //修改推荐
    addRecommend: 'Recommend/addRecommend', //添加推荐
    delRecommend: 'Recommend/delRecommend', //添加推荐
    getRecommendId: 'Recommend/getRecommendId', //获取推荐ID
    getRecommend: 'Recommend/getRecommend', //获取推荐信息
    getRecommendInfo: 'Recommend/getRecommendInfo', //获取推荐详情
    getBossShareDiamondvip: 'Rights/getBossShareDiamondvip', //获取合伙人BOSS分享钻石会员机会
    passBossShareDiamondvip: 'Rights/passBossShareDiamondvip', //审核钻石卡分享机会
    creatBossShareDiamondvip: 'Rights/creatBossShareDiamondvip', //创建合伙人BOSS分享钻石会员机会
    updateSupplier: 'suppliers/updateSupplier', //修改供应商
    updateSupplierFreight: 'suppliers/updateSupplierFreight', //修改供应商快递模板
    editsupplierfreightdetail: 'suppliers/editsupplierfreightdetail', //修改供应商快递模板运费
    addsupplier: 'suppliers/addSupplier', //新建供应商
    addsupplierfreight: 'suppliers/addsupplierfreight', //新建供应商快递模板
    addSupplierFreightdetail: 'suppliers/addSupplierFreightdetail', //新增供应商快递模板运费
    updatesupplierfreightarea: 'suppliers/updatesupplierfreightarea', //更新运费模版和市的价格关联
    getsupplierfreights: 'suppliers/getsupplierfreights', //获取供应商快递模板列表
    getSupplierFreightdetailList: 'suppliers/getSupplierFreightdetailList', //获取供应商快递模板运费列表
    getsuppliers: 'suppliers/getSuppliers', //获取供应商列表
    getSupplierFreight: 'suppliers/getSupplierFreight', //获取供应商快递模板
    getSupplierFreightdetail: 'suppliers/getSupplierFreightdetail', //获取供应商快递模板详情
    getSupplierData: 'suppliers/getSupplierData', //获取供应商详情
    getsuppliersall: 'suppliers/getsuppliersall', //获取所有供应商
    stopstartcate: 'category/stopstartcate', //停用/启用分类
    getCateList: 'category/getCateList', //分类列表
    delcategory: 'category/delcategory', //删除分类
    allCateList: 'category/allCateList', //所有商品分类
    saveeditcate: 'category/saveeditcate', //提交编辑
    saveaddcate: 'category/saveaddcate', //添加分类
    getThreeCate: 'category/getThreeCate', //获取三级分类
    addcatepage: 'category/addcatepage', //获取前两级分类
    editcatepage: 'category/editcatepage', //获取需要编辑的分类数据
    updowngoods: 'goods/updowngoods', //删除商品
    saveupdategoods: 'goods/saveupdategoods', //修改商品基础信息
    delgoodsimage: 'goods/delgoodsimage', //修改商品基础信息
    delgoodsspec: 'goods/delgoodsspec', //删除商品的规格属性
    getgoodslist: 'goods/getGoodsList', //商品列表
    uploadgoodsimages: 'goods/uploadgoodsimages', //提交商品详情和轮播图
    saveaddgoods: 'goods/saveAddGoods', //添加商品
    addgoodsspec: 'goods/addgoodsspec', //添加商品的规格属性
    getgoodssku: 'goods/getgoodssku', //获取一个sku信息
    editgoodssku: 'goods/editgoodssku', //获取一个sku信息
    getonegoods: 'goods/getOneGoods', //获取一个商品数据
    sortimagedetail: 'goods/sortimagedetail', //对商品图进行排序
    getProvinceCity: 'provinces/getProvinceCity', //省市列表
    getArea: 'provinces/getArea', //获取区级列表
    getCity: 'provinces/getCity', //获取市级列表
    getprovincecitybyfreight: 'provinces/getprovincecitybyfreight', //获取运费模版的剩余可选省市列表
    saveEditSpecAttr: 'spec/saveEditSpecAttr', //修改属性/规格
    delSpecAttr: 'spec/delSpecAttr', //删除属性/规格
    getSpecList: 'spec/getSpecList', //属性列表
    savespecattr: 'spec/savespecattr', //添加属性/规格
    addAttrPage: 'spec/addAttrPage', //获取一级规格
    getspecattr: 'spec/getspecattr', //获取一级规格和二级属性
    getAttr: 'spec/getAttr', //获取二级属性
    getEditData: 'spec/getEditData', //获取需要编辑的规格/属性数据
    getSms: 'note/getSms', //查询短信记录
    sendSms: 'note/sendSms', //短信验证码发送
    uploadfile: 'upload/uploadfile', //上传单个图片
    uploadmultifile: 'upload/uploadmultifile', //上传单个图片
    editsubject: 'subject/editsubject', //修改专题
    delgoodssubject: 'subject/delgoodssubject', //删除专题
    delgoodssubjectassoc: 'subject/delgoodssubjectassoc', //取消专题商品的关联
    subjectgoodsassoc: 'subject/subjectgoodsassoc', //建立商品专题关系
    getallsubject: 'subject/getallsubject', //所有专题
    addsubject: 'subject/addsubject', //添加专题
    getsubjectdetail: 'subject/getsubjectdetail', //添加专题
    getgoodssubject: 'subject/getgoodssubject' //获取商品专题
}

let request = function(params) {
    params.url = questurl[params.url] || params.url;
    Ajax(params)
}

export {
    request
}


// 


// getProvinceCity({
//     type: 'post',
//     success: function(res) {
//         console.log(res)
//     }
// })