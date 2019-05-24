import { app } from '../../../../index.js';
import { showToast, geturl } from '../../../../js/utils.js';

new Vue({
    el: '#app',
    data: {
        goods_data: {},
        images_carousel: [],
        images_detatil: [],
        good_sku: [],
        spec_attr: [],
        subjectList: [],
        id: '',
        goodImg: '',
        setImg: false,
        modal: {
            subject: false,
            amendAttribute: false,
            attribute: false,
            previewphoto: false,
            sortimages: false
        },
        sortorderby: {},
        goodssku: {},
        sku_image: '',
        specattr: [],
        label: '',
        labellist: []
    },
    mounted() {
        this.id = geturl().id || ''
        this.getOneGoods()
        this.goodslabellist()
    },
    methods: {
        cancelmodal(str) {
            this.modal[str] = false
        },
        labelChane() {
            console.log(this.label)
            this.label = this.label.replace(/\s*/g, "")
        },
        addLabel() {
            if (!this.id) {
                showToast({
                    text: '找不到商品'
                })
                return
            }
            if (!this.label) {
                showToast({
                    text: '标签不能为空！'
                })
                return
            }
            let that = this
            app.requests({
                url: 'label/addlabeltogoods',
                data: {
                    goods_id: that.id,
                    label_name: that.label
                },
                success: function(res) {
                    that.label = ""
                    that.goodslabellist()
                },
                Error(code) {
                    let text = '';
                    switch (parseInt(code)) {
                        case 3001:
                            text = '标签名不能为空'
                            break;
                        case 3002:
                            text = '商品id必须为数字'
                            break;
                        case 3003:
                            text = '商品不存在'
                            break;
                        case 3004:
                            text = '标签已关联该商品'
                            break;
                        case 3005:
                            text = '标签长度过长'
                            break;
                        case 3006:
                            text = '添加失败'
                            break;
                        default:
                            text = '意料之外的错误'
                            break;
                    }
                    showToast({
                        text: text
                    })
                }
            })
        },
        dellabel(lid) {
            if (!this.id) {
                showToast({
                    text: '找不到商品'
                })
                return
            }
            let that = this
            app.requests({
                url: 'label/labeldel',
                data: {
                    goods_id: that.id,
                    label_id: lid
                },
                success: function(res) {
                    that.goodslabellist()
                },
                Error(code) {
                    showToast({
                        text: '删除失败'
                    })
                }
            })
        },
        goodslabellist() {
            if (!this.id) return
            let that = this
            app.requests({
                url: 'label/goodslabellist',
                data: {
                    goods_id: that.id
                },
                success: function(res) {
                    that.labellist = res.data || []
                }
            })
        },
        getOneGoods(type = 0) {
            let t = this,
                stype = type;
            if (type == 5) {
                stype = 3
            }
            if (t.id == '') {
                this.getSuppliersAll()
                this.allCateList()
                this.setselpicure('')
                return
            } else {

            }
            t.portgetgood(stype, type)
        },
        getSuppliersAll: function() { //获取所有供应商
            app.requests({
                url: 'suppliers/getsuppliersall',
                success: function(res) {
                    select({
                        el: '#supplierIdNew',
                        name: 'name',
                        data: res.data || []
                    })
                }
            })
        },
        allCateList: function() { //获取所有分类
            app.requests({
                url: 'category/allCateList',
                success: function(res) {
                    pz.multistage.init({
                        el: '.cateIdNew',
                        ellink: '#catelinkage',
                        type: '3',
                        name: 'type_name',
                        data: res.data || []
                    })
                },
                Error(code) {
                    let text = ''
                    switch (parseInt(code)) {
                        case 3001:
                            text = '状态参数错误'
                            break;
                        default:
                            text = '意料之外的错误'
                            break;
                    }
                    showToast({
                        text: text
                    })
                }
            })
        },
        getsupplierfreights: function() { // 获取供应商快递模板列表
            let t = this
            app.requests({
                url: 'suppliers/getsupplierfreights',
                data: {
                    supplierId: t.goods_data.supplier_id
                },
                success: function(res) {
                    select({
                        el: '#freight_id',
                        name: 'title',
                        data: res.data || []
                    })
                },
                Error(code) {
                    showToast({
                        text: '获取失败'
                    })
                }
            })
        },
        portgetgood(stype, type) {
            let t = this
            app.requests({
                url: 'goods/getOneGoods',
                data: {
                    id: t.id,
                    get_type: stype
                },
                success: function(res) {
                    if (type == 1 || type == '') {
                        t.goods_data = res.goods_data;
                        t.goods_data.goodTypeText = t.getGoodTypeText(t.goods_data.goods_type)
                        t.setselpicure(t.goods_data.image)
                        t.getsupplierfreights()
                    }
                    if (type == 2 || type == '') {
                        t.spec_attr = res.spec_attr;
                    }
                    if (type == 3 || type == '') {
                        t.images_carousel = res.images_carousel;
                        t.setbannerimages(t.images_carousel)
                    }
                    if (type == 4 || type == '') {
                        t.good_sku = t.dissku(res.sku);
                    }
                    if (type == 5 || type == '') {
                        t.images_detatil = t.disimages_detatil(res.images_detatil);

                    }
                    t.getgoodssubject(1)
                },
                Error(code) {
                    let text = ''
                    switch (parseInt(code)) {
                        case 3001:
                            text = 'id必须是数字'
                            break;
                        case 3002:
                            text = 'get_type错误'
                            break;
                        default:
                            text = '获取出错'
                            break;
                    }
                    showToast({
                        text: text
                    })
                }
            })
        },
        disimages_detatil(data = []) {
            let len = data.length,
                arr = [];
            for (let i = 0; i < len; i++) {
                if (i % 5 === 0 && i != 0) {
                    arr.push({
                        row: true
                    })
                }
                arr.push(data[i])
            }
            if (len > 0 & len < 5) {
                let l = 5 - len
                for (let i = 0; i < l; i++) {
                    arr.push({ kong: true })
                }
            }
            return arr
        },
        getgoodssku: function(id) { //获取一条sku
            let t = this
            app.requests({
                url: 'goods/getgoodssku',
                data: {
                    sku_id: id
                },
                success: function(res) {
                    t.goodssku = t.disgoodssku(res.data)
                    t.modal.amendAttribute = true
                }
            })
        },
        disgoodssku(data = {}) {
            let t = this,
                attrText = '',
                len1 = data.attr.length;
            for (let x = 0; x < len1; x++) {
                attrText += data.attr[x] + ','
            }
            attrText = attrText.substr(0, attrText.length - 1);
            data.attrText = attrText;
            let freight = document.querySelector('#skuselection');
            if (data.freight_id == 0) {
                freight.setAttribute('data-id', '')
                freight.innerHTML = '请选择'
                freight.classList.remove('already-select')
            } else {
                freight.setAttribute('data-id', data.freight_id)
                freight.innerHTML = data.freight_title
                freight.classList.add('already-select')
            }
            t.sku_image = ''
            selpicure({
                el: '#selpicure3',
                images: [{ image: data.sku_image }],
                imgChange: function(images) {
                    t.sku_image = images[0].image
                }
            })
            return data
        },
        savegoodssku: function(skuid) { //保存sku
            let t = this,
                freight_id = document.querySelector('#skuselection').getAttribute('data-id') || '',
                goodssku = t.goodssku;
            app.requests({
                url: 'goods/editgoodssku',
                data: {
                    sku_id: skuid,
                    stock: goodssku.stock,
                    market_price: goodssku.market_price,
                    retail_price: goodssku.retail_price,
                    cost_price: goodssku.cost_price,
                    margin_price: goodssku.margin_price,
                    integral_price: goodssku.integral_price,
                    // integral_active: integral_active,
                    sku_image: t.sku_image,
                    freight_id: freight_id,
                    weight: goodssku.weight,
                    volume: goodssku.volume,
                },
                success: function(res) {
                    showToast({
                        type: 'success',
                        text: '保存成功'
                    })
                    t.getOneGoods(4)
                    t.modal.amendAttribute = false
                },
                Error(code) {
                    let text = ''
                    switch (parseInt(code)) {
                        case 3001:
                            text = 'id必须为数字'
                            break;
                        case 3002:
                            text = '库存必须为大于或等于0的数字'
                            break;
                        case 3003:
                            text = '价格必须为大于或等于0的数字'
                            break;
                        case 3004:
                            text = '积分必须为大于或等于0的数字'
                            break;
                        case 3005:
                            text = '图片没有上传过'
                            break;
                        case 3006:
                            text = '零售价不能小于成本价'
                            break;
                        case 3007:
                            text = 'sku不存在'
                            break;
                        case 3008:
                            text = '编辑失败'
                            break;
                        case 3009:
                            text = '选择的供应山id有误'
                            break;
                        case 3010:
                            text = '请填写零售价和成本价'
                            break;
                        case 3011:
                            text = '选择重量模版必须填写重量'
                            break;
                        case 3012:
                            text = '选择体积模版必须填写体积'
                            break;
                        case 3013:
                            text = '商品下架才能编辑'
                            break;
                        default:
                            text = '意料之外的错误'
                            break;
                    }
                    showToast({
                        text: text
                    })
                }
            })
        },
        dissku(data = []) {
            let len = data.length,
                len1, i, x, s;
            for (i = 0; i < len; i++) {
                len1 = data[i].attr.length;
                s = '';
                for (x = 0; x < len1; x++) {
                    s += data[i].attr[x] + ','
                }
                s = s.substr(0, s.length - 1);
                data[i].attrText = s
            }
            return data
        },
        setbannerimages: function(data = []) { //轮播图片
            let t = this
            selpicure({
                el: '#selpicure2',
                num: 5,
                images: data,
                field: 'image_path',
                type: 'multiple',
                imgChange: function(images) {
                    t.disgoodsimages(images)
                },
                delImgFn: function(image) {
                    t.delImg(image, 3)
                }
            })
        },
        delImg: function(image, type) { //删除轮播图和详情图接口
            let t = this;
            app.requests({
                url: 'goods/delgoodsimage',
                data: {
                    image_path: image
                },
                success: function(res) {
                    showToast({
                        type: 'success',
                        text: '操作成功'
                    })
                    t.getOneGoods(type)
                },
                Error(code) {
                    let text = ''
                    switch (parseInt(code)) {
                        case 3001:
                            text = '图片不能为空'
                            break;
                        case 3002:
                            text = '图片不存在'
                            break;
                        case 3003:
                            text = '上传失败'
                            break;
                        default:
                            text = '意料之外的错误'
                            break;
                    }
                    showToast({
                        text: text
                    })
                }
            })
        },
        delImg: function(image, type) { //删除轮播图和详情图接口
            let t = this;
            app.requests({
                url: 'goods/delgoodsimage',
                data: {
                    image_path: image
                },
                success: function(res) {
                    showToast({
                        type: 'success',
                        text: '操作成功'
                    })
                    t.getOneGoods(type)
                },
                Error(code) {
                    let text = ''
                    switch (parseInt(code)) {
                        case 3001:
                            text = '图片不能为空'
                            break;
                        case 3002:
                            text = '图片不存在'
                            break;
                        case 3003:
                            text = '上传失败'
                            break;
                        default:
                            text = '意料之外的错误'
                            break;
                    }
                    showToast({
                        text: text
                    })
                }
            })
        },
        disgoodsimages: function(images) { //formdata轮播图
            let len = images.length,
                i, arr = [],
                formData = new FormData();
            formData.append('image_type', 2)
            formData.append('goods_id', this.id)
            for (i = 0; i < len; i++) {
                if (images[i].upload) {
                    formData.append('images[]', images[i].image_path)
                }
            }
            this.uploadgoodsimages(formData, 3)
        },
        addImg() {
            document.querySelector('#imgDetatil').click()
        },
        imgDetatilChange(e) {
            this.uploadmultifile(e.target.files)
        },
        uploadmultifile: function(file) { //多张详情图片上传
            let t = this,
                len = file.length,
                i,
                formdata = new FormData();
            for (i = 0; i < len; i++) {
                formdata.append('images[]', file[i])
            }
            app.requests({
                data: formdata,
                url: 'upload/uploadmultifile',
                success: function(res) {
                    showToast({
                        type: 'success',
                        text: '操作成功'
                    })
                    t.disDetatilimages(res.data)
                    document.querySelector('#imgDetatil').value = ''
                },
                Error(code) {
                    let text = ''
                    switch (parseInt(code)) {
                        case 3001:
                            text = '上传的不是图片'
                            break;
                        case 3002:
                            text = '上传图片不能超过2M'
                            break;
                        case 3003:
                            text = '上传失败'
                            break;
                        case 3004:
                            text = '上传文件不能为空'
                            break;
                        default:
                            text = '意料之外的错误'
                            break;
                    }
                    showToast({
                        text: text
                    })
                }
            })
        },
        disDetatilimages: function(images) { //formData详情图片
            let len = images.length,
                i, arr = [],
                formData = new FormData();
            formData.append('image_type', 1)
            formData.append('goods_id', this.id)
            for (i = 0; i < len; i++) {
                formData.append('images[]', images[i])
            }
            this.uploadgoodsimages(formData, 5)
        },
        uploadgoodsimages: function(formData, type) { //提交商品详情和轮播图
            let t = this
            app.requests({
                url: 'goods/uploadgoodsimages',
                data: formData,
                success: function(res) {
                    showToast({
                        type: 'success',
                        text: '操作成功！'
                    })
                    t.getOneGoods(type)
                },
                complete(res) {
                    if (type == 3 & res.code == '3100') {
                        t.setbannerimages(t.images_carousel)
                    }
                },
                Error(code) {
                    let text = ''
                    switch (parseInt(code)) {
                        case 3001:
                            text = '图片类型有误'
                            break;
                        case 3002:
                            text = '商品id只能是数字'
                            break;
                        case 3003:
                            text = '图片不能空'
                            break;
                        case 3004:
                            text = '商品id不存在'
                            break;
                        case 3005:
                            text = '图片没有上传过'
                            break;
                        case 3006:
                            text = '上传失败'
                            break;
                        default:
                            text = '意料之外的错误'
                            break;
                    }
                    showToast({
                        text: text
                    })
                }
            })
        },
        showSort(image_path, order_by) {
            this.sortorderby.image_path = image_path
            this.sortorderby.order_by = order_by
            this.modal.sortimages = true
        },
        sortImg: function(order_by) { //商品详情图排序
            let t = this;
            app.requests({
                url: 'goods/sortimagedetail',
                data: {
                    image_path: t.sortorderby.image_path,
                    order_by: t.sortorderby.order_by
                },
                success: function(res) {
                    showToast({
                        type: 'success',
                        text: '操作成功！'
                    })
                    t.getOneGoods(5)
                    t.cancelmodal('sortimages')
                },
                Error(code) {
                    let text = ''
                    switch (parseInt(code)) {
                        case 3001:
                            text = '图片不能为空'
                            break;
                        case 3002:
                            text = '图片不存在'
                            break;
                        case 3003:
                            text = '排序字段只能为数字'
                            break;
                        case 3004:
                            text = '上传失败'
                            break;
                        default:
                            text = '意料之外的错误'
                            break;
                    }
                    showToast({
                        text: text
                    })
                }
            })
        },
        delgoodsspec: function(tid) { //删除规格接口
            let t = this;
            app.requests({
                url: 'goods/delgoodsspec',
                data: {
                    goods_id: t.id,
                    attr_id: tid
                },
                success: function(res) {
                    t.getOneGoods(2)
                    t.getOneGoods(4)
                },
                Error(code) {
                    let text = ''
                    switch (parseInt(code)) {
                        case 3001:
                            text = '属性id必须为数字'
                            break;
                        case 3002:
                            text = '商品id必须为数字'
                            break;
                        case 3003:
                            text = '属性不存在'
                            break;
                        case 3004:
                            text = '商品不存在'
                            break;
                        case 3005:
                            text = '规格不能为空'
                            break;
                        case 3006:
                            text = '该商品未绑定这个属性'
                            break;
                        case 3007:
                            text = '提交失败'
                            break;
                        case 3008:
                            text = '没有任何操作'
                            break;
                        case 3009:
                            text = '提交的属性分类和商品分类不同'
                            break;
                        case 3013:
                            text = '商品下架才能删除'
                            break;
                        default:
                            text = '意料之外的错误'
                            break;
                    }
                    showToast({
                        text: text
                    })
                }
            })
        },
        addattribute() {
            let t = this
            if (t.id == '') return
            t.attrinit()
            t.modal.attribute = true
            console.log(t.modal.attribute)
            t.getspecattr()
        },
        attrinit: function() { //添加属性弹框初始化
            let selattr = document.querySelector('#selattr').querySelector('.ant-select-selection'),
                selsite = document.querySelector('#selsite').querySelector('.ant-select-selection')
            selattr.setAttribute('data-id', '')
            selattr.setAttribute('data-value', '')
            selattr.innerHTML = '请选择'
            selattr.classList.remove('already-select')
            selsite.setAttribute('data-id', '')
            selsite.setAttribute('data-value', '')
            selsite.innerHTML = '请选择'
            selsite.classList.remove('already-select')
            select({
                el: '#selsite',
                name: 'attr_name',
                data: []
            })
        },
        getspecattr: function() { //获取一级规格和二级属性
            let t = this
            app.requests({
                url: 'spec/getspecattr',
                data: {
                    cate_id: t.goods_data.cate_id
                },
                success: function(res) {
                    t.specattr = res.data
                    select({
                        el: '#selattr',
                        name: 'spe_name',
                        data: t.specattr
                    })
                    t.setsiteclick()
                },
                Error(code) {
                    let text = ''
                    switch (parseInt(code)) {
                        case 3001:
                            text = '获取失败'
                            break;
                        case 3002:
                            text = '参数错误'
                            break;
                        default:
                            text = '意料之外的错误'
                            break;
                    }
                    showToast({
                        text: text
                    })
                }
            })
        },
        setsiteclick: function() { //点击选择规格
            let t = this,
                items = document.querySelector('#selattr').querySelectorAll('.as-dropdown-item')
            items.forEach(function(item) {
                item.addEventListener('click', function(e) {
                    let id = item.getAttribute(
                        'data-id')
                    select({
                        el: '#selsite',
                        name: 'attr_name',
                        data: t.disspecattr(id)
                    })
                })
            })
        },
        disspecattr: function(id) { //返回属性
            let data = this.specattr,
                len = data.length,
                i, str = []
            for (i = 0; i < len; i++) {
                if (id == data[i].id) {
                    str = data[i].attr
                    break;
                }
            }
            return str
        },
        addgoodsspec: function() { //添加属性
            let t = this,
                attrid = document.querySelector('#selsite').querySelector('.ant-select-selection').getAttribute('data-id')
            if (!attrid) {
                showToast({
                    text: '请选择属性'
                })
                return
            }
            app.requests({
                url: 'addgoodsspec',
                data: {
                    goods_id: t.id,
                    attr_id: attrid
                },
                success: function(res) {
                    showToast({
                        type: 'success',
                        text: '请选择属性'
                    })
                    t.modal.attribute = false
                    t.getOneGoods(2)
                    t.getOneGoods(4)
                },
                Error(code) {
                    let text = ''
                    switch (parseInt(code)) {
                        case 3001:
                            text = '属性id必须为数字'
                            break;
                        case 3002:
                            text = '商品id必须为数字'
                            break;
                        case 3003:
                            text = '属性不存在'
                            break;
                        case 3004:
                            text = '商品不存在'
                            break;
                        case 3005:
                            text = '规格不能为空'
                            break;
                        case 3006:
                            text = '商品已有该规格属性'
                            break;
                        case 3007:
                            text = '提交失败'
                            break;
                        case 3008:
                            text = '没有任何操作'
                            break;
                        case 3009:
                            text = '提交的属性分类和商品分类不同'
                            break;
                        case 3013:
                            text = '商品下架才能编辑'
                            break;
                        default:
                            text = '意料之外的错误'
                            break;
                    }
                    showToast({
                        text: text
                    })
                }
            })
        },
        getgoodssubject: function(type) { //获取商品专题
            let t = this
            app.requests({
                url: 'subject/getgoodssubject',
                data: {
                    goods_id: t.id,
                    stype: type
                },
                success: function(res) {
                    if (type == 1) {
                        t.subjectList = res.data || []
                    } else {
                        t.selgoodssubject(res.data || [])
                    }
                },
                Error: function(code) {
                    showToast({
                        text: '获取失败'
                    })
                }
            })
        },
        selgoodssubject(data) {
            pz.multistage.init({
                el: '#selSubject',
                ellink: '#subjectlinkage',
                name: 'subject',
                type: '3',
                data: data
            })
        },
        delsubject(id) {
            let t = this;
            if (!this.id) {
                showToast({
                    text: '找不到商品'
                })
                return
            }
            app.requests({
                url: 'subject/delgoodssubjectassoc',
                data: {
                    goods_id: t.id,
                    subject_id: id
                },
                success: function(res) {
                    showToast({
                        type: 'success',
                        text: '操作成功！'
                    })
                    t.getgoodssubject(1)
                },
                Error(code) {
                    let text = ''
                    switch (parseInt(code)) {
                        case 3001:
                            text = '商品id必须数字'
                            break;
                        case 3002:
                            text = '专题id必须数字'
                            break;
                        case 3003:
                            text = '商品和专题没有关联'
                            break;
                        case 3004:
                            text = '取消失败'
                            break;
                        default:
                            text = '意料之外的错误'
                            break;
                    }
                    showToast({
                        text: text
                    })
                }
            })
        },
        subjectSave: function() {
            let t = this
            let id = document.querySelector('#selSubject').getAttribute('data-id') || ''
            if (!id) {
                showToast({
                    text: '请选择关联专题'
                })
                return
            }
            app.requests({
                url: 'subject/subjectgoodsassoc',
                data: {
                    goods_id: t.id,
                    subject_id: id
                },
                success: function(res) {
                    showToast({
                        type: 'success',
                        text: '操作成功！'
                    })
                    t.getgoodssubject(1)
                    t.modal.subject = false
                },
                Error(code) {
                    let text = ''
                    switch (parseInt(code)) {
                        case 3001:
                            text = '商品id必须是数字'
                            break;
                        case 3002:
                            text = '专题id必须是数字'
                            break;
                        case 3003:
                            text = '商品不存在'
                            break;
                        case 3004:
                            text = '专题不存在'
                            break;
                        case 3005:
                            text = '已经关联'
                            break;
                        case 3006:
                            text = '保存失败'
                            break;
                        default:
                            text = '意料之外的错误'
                            break;
                    }
                    showToast({
                        text: text
                    })
                }
            })
        },
        addsubject() {
            this.modal.subject = true
            this.getgoodssubject(2)
        },
        refresh() {
            this.modal.previewphoto = true
        },
        saveGood() {
            if (this.id == '') {
                this.saveGoodNew()
            } else {
                this.saveGoodAmend()
            }
        },
        saveGoodNew: function() { //新建商品
            let t = this,
                goodsName = t.goods_data.goods_name,
                goodsSubtitle = t.goods_data.subtitle,
                goodsType = document.querySelector('#goodsType').getAttribute('data-id') || '',
                supplierId = document.querySelector('#supplierId').getAttribute('data-id') || '',
                cateId = document.querySelector('#cateIdNew').getAttribute('data-id') || '';

            app.requests({
                url: 'goods/saveaddgoods',
                data: {
                    supplier_id: supplierId,
                    cate_id: cateId,
                    goods_name: goodsName,
                    goods_type: goodsType,
                    subtitle: goodsSubtitle,
                    image: t.goodImg
                },
                success: function(res) {
                    t.id = res.goods_id
                    location.href = 'goodsoperation.html?id=' + t.id
                    showToast({
                        type: 'success',
                        text: '保存商品成功'
                    })
                },
                Error(code) {
                    let text = ''
                    switch (parseInt(code)) {
                        case 3001:
                            text = '请选择供应商'
                            break;
                        case 3002:
                            text = '请选择分类'
                            break;
                        case 3003:
                            text = '商品名称不能空'
                            break;
                        case 3004:
                            text = '标题图不能空'
                            break;
                        case 3005:
                            text = '请选择商品类型'
                            break;
                        case 3006:
                            text = '商品名称重复'
                            break;
                        case 3007:
                            text = '请选择三级分类'
                            break;
                        case 3008:
                            text = '供应商不存在'
                            break;
                        case 3009:
                            text = '添加失败'
                            break;
                        case 3010:
                            text = '图片没有上传过'
                            break;
                        default:
                            text = '意料之外的错误'
                            break;
                    }
                    showToast({
                        text: text
                    })
                }
            })
        },
        saveGoodAmend: function() { //修改商品
            let t = this,
                goodsName = t.goods_data.goods_name,
                goodsSubtitle = t.goods_data.subtitle,
                cate_id = t.goods_data.cate_id,
                goods_type = t.goods_data.goods_type,
                supplier_id = t.goods_data.supplier_id;
            app.requests({
                url: 'goods/saveupdategoods',
                data: {
                    goods_id: t.id,
                    goods_name: goodsName,
                    supplier_id: supplier_id,
                    cate_id: cate_id,
                    goods_type: goods_type,
                    subtitle: goodsSubtitle,
                    image: t.goodImg
                },
                success: function(res) {
                    showToast({
                        type: 'success',
                        text: '修改成功'
                    })
                    t.getOneGoods(1)
                },
                Error(code) {
                    let text = ''
                    switch (parseInt(code)) {
                        case 3001:
                            text = '供应商id必须是数字'
                            break;
                        case 3002:
                            text = '分类id只能为数字'
                            break;
                        case 3003:
                            text = '商品名称不能空'
                            break;
                        case 3004:
                            text = '标题图不能空'
                            break;
                        case 3005:
                            text = '商品类型只能为数字'
                            break;
                        case 3006:
                            text = '商品名称重复'
                            break;
                        case 3007:
                            text = '提交的分类id不是三级分类'
                            break;
                        case 3008:
                            text = '供应商不存在'
                            break;
                        case 3009:
                            text = '修改失败'
                            break;
                        case 3010:
                            text = '图片没有上传过'
                            break;
                        default:
                            text = '意料之外的错误'
                            break;
                    }
                    showToast({
                        text: text
                    })
                }
            })
        },
        setselpicure(img) {
            if (this.setImg) return
            let t = this
            selpicure({
                el: '#selpicure1',
                images: [{ image: img }],
                imgChange: function(images) {
                    t.goodImg = images[0].image
                }
            })
            t.setImg = true
        },
        getGoodTypeText(n) {
            let text = ''
            switch (parseInt(n)) {
                case 1:
                    text = '普通商品'
                    break;
                case 2:
                    text = '虚拟商品'
                    break;
            }
            return text
        }
    }
});
tab({
    head: '#dlnav',
    con: '.dlnav-con',
    num: 1
});
select({
    el: '#goodsTypeNew',
    data: [{
        id: 1,
        type_name: '普通商品'
    }, {
        id: 2,
        type_name: '虚拟商品'
    }]
});