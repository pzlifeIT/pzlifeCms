;
(function(pz) {
    pz.goodsoperation = (function() {
        function _GO() {
            this.id = pz.geturl().id || ''
            this.addattribute = pz.getEl('.addattribute') //添加规格
            this.attributeNew = pz.getEl('#attributeNew') //规格弹框
            this.cancelNew = pz.getEl('#cancelNew') //隐藏规格弹框
            this.saveNew = pz.getEl('#saveNew') //保存规格添加
            this.amendAttribute = pz.getEl('#amendAttribute') //商品规格弹框
            this.cancelAmend = pz.getEl('#cancelAmend') //隐藏商品规格弹框
            this.saveAmend = pz.getEl('#saveAmend') //保存商品规格
            this.previewphoto = pz.getEl('#previewphoto') //图片预览
            this.addpreview = pz.getEl('.addpreview') //添加商品详情图片
            this.modalContent = pz.getEl('#modalContent') //图片预览
            this.goodSaveNew = pz.getEl('#goodSaveNew') //保存新建商品基本信息
            this.attributeList = pz.getEl('#attributeList') //规格属性列表
            this.goodattributeList = pz.getEl('#goodattributeList') //sku列表
            this.goodImg = '' //产品标题图
            this.images_carousel = []
            this.goodInfo = ''
            this.dataAttr = []
            this.skuid = ''
            this.init()
        }
        _GO.prototype = {
            init: function() {
                this.elClick()
                this.getonegoods()
            },
            getonegoods: function() {
                let t = this
                quest.requests({
                    url: 'getonegoods',
                    data: {
                        id: t.id
                    },
                    success: function(res) {
                        t.goodInfo = res
                        t.isNewAmend(t.goodInfo.goods_data)
                        t.setattributeList(t.goodInfo.spec_attr)
                        t.setgoodattributeList(t.goodInfo.sku)
                    }
                })
            },
            isNewAmend: function(data) { //商品类型:供应商:三级分类:是否已经选择
                if (data.cate_id == 0 || data.cate_id == '') {
                    this.elremovehide('.cateIdNew')
                } else {
                    this.allCateList()
                    this.elremovehide('#cateIdAmend')
                    let cateIdAmend = document.querySelector('#cateIdAmend')
                    cateIdAmend.innerHTML = data.goods_class
                    cateIdAmend.setAttribute('data-id', data.cate_id)
                }
                if (data.supplier_id == 0 || data.supplier_id == '') {
                    this.elremovehide('#supplierIdNew')
                } else {
                    this.getSuppliersAll()
                    this.elremovehide('#supplierIdAmend')
                    let supplierIdAmend = document.querySelector('#supplierIdAmend')
                    supplierIdAmend.innerHTML = data.supplier_name
                    supplierIdAmend.setAttribute('data-id', data.supplier_id)
                }
                if (data.goods_type == 0 || data.goods_type == '') {
                    this.elremovehide('#goodsTypeNew')
                } else {
                    this.elremovehide('#goodsTypeAmend')
                    let type = ''
                    if (data.goods_type == 1) {
                        type = '普通商品'
                    } else {
                        type = '虚拟商品'
                    }
                    let goodsTypeAmend = document.querySelector('#goodsTypeAmend')
                    goodsTypeAmend.innerHTML = type
                    goodsTypeAmend.setAttribute('data-id', data.goods_type)
                }
                this.setList()
            },
            elremovehide: function(el) {
                document.querySelector(el).classList.remove('hide')
            },
            setList: function() {
                let t = this,
                    goodsNameNew = document.querySelector('#goodsNameNew'),
                    goodsSubtitleNew = document.querySelector('#goodsSubtitleNew')
                goodsNameNew.value = t.goodInfo.goods_data.goods_name;
                goodsSubtitleNew.value = t.goodInfo.goods_data.subtitle

                selpicure({
                    el: '#selpicure1',
                    num: 1,
                    images: [t.goodInfo.goods_data.image],
                    imgChange: function(images) {
                        t.goodImg = images[0]
                    }
                })
                selpicure({
                    el: '#selpicure2',
                    num: 5,
                    images: [],
                    multiple: 'multiple',
                    imgChange: function(images) {}
                })
            },
            elClick: function() {
                let t = this
                t.addattribute.addEventListener('click', function(e) {
                    t.attributeNew.classList.remove('hide')
                    t.getspecattr()
                })
                t.cancelNew.addEventListener('click', function(e) {
                    t.attributeNew.classList.add('hide')
                })
                t.saveNew.addEventListener('click', function(e) {
                    t.addgoodsspec()
                })
                t.cancelAmend.addEventListener('click', function(e) {
                    t.amendAttribute.classList.add('hide')
                })
                t.saveAmend.addEventListener('click', function(e) {
                    t.savegoodssku()
                })
                t.previewphoto.addEventListener('click', function(e) {
                    t.previewphoto.classList.add('hide')
                })
                t.addpreview.addEventListener('click', function(e) {
                    t.previewphoto.classList.remove('hide')
                })
                t.modalContent.addEventListener('click', function(e) {
                    window.event ? window.event.cancelBubble = true : e.stopPropagation();
                })
                t.goodSaveNew.addEventListener('click', function(e) {
                    if (t.id == '') {
                        t.saveGoodNew()
                    } else {
                        t.saveGoodAmend()
                    }
                })
            },
            getSuppliersAll: function() { //获取所有供应商
                let t = this
                quest.requests({
                    url: 'getsuppliersall',
                    success: function(res) {
                        select({
                            el: '#supplierIdNew',
                            data: t.disSuppliersAll(res.data)
                        })
                    }
                })
            },
            disSuppliersAll: function(data) { //处理所有供应商
                let len = data.length,
                    i, arr = [],
                    sjson = {}
                for (i = 0; i < len; i++) {
                    sjson = {}
                    sjson.id = data[i].id
                    sjson.type_name = data[i].name
                    arr.push(sjson)
                }
                return arr
            },
            saveGoodAmend: function() { //新建商品
                let t = this,
                    goodsName = pz.getEl('#goodsNameNew').value,
                    goodsSubtitle = pz.getEl('#goodsSubtitleNew').value,
                    goodsType, supplierId, cateId;
                if (t.goodInfo.goods_data.goods_type == 0 || t.goodInfo.goods_data.goods_type == '') {
                    goodsType = pz.getEl('#goodsTypeNew').querySelector('.ant-select-selection').getAttribute('data-id')
                } else {
                    goodsType = document.querySelector('#goodsTypeAmend').getAttribute('data-id')
                }
                if (t.goodInfo.goods_data.supplier_id == 0 || t.goodInfo.goods_data.supplier_id == '') {
                    supplierId = pz.getEl('#supplierIdNew').querySelector('.ant-select-selection').getAttribute('data-id')
                } else {
                    supplierId = document.querySelector('#supplierIdAmend').getAttribute('data-id')

                }
                if (t.goodInfo.goods_data.cate_id == 0 || t.goodInfo.goods_data.cate_id == '') {
                    cateId = pz.getEl('.cateIdNew').getAttribute('data-id')
                } else {
                    cateId = document.querySelector('#cateIdAmend').getAttribute('data-id')
                }
                quest.requests({
                    url: 'saveupdategoods',
                    data: {
                        goods_id: t.id,
                        supplier_id: supplierId,
                        cate_id: cateId,
                        goods_name: goodsName,
                        goods_type: goodsType,
                        subtitle: goodsSubtitle,
                        image: t.goodImg
                    },
                    success: function(res) {
                        alert('修改成功')
                        document.location.reload()
                    }
                })
            },
            saveGoodNew: function() { //修改商品
                let t = this,
                    goodsName = pz.getEl('#goodsNameNew').value,
                    goodsSubtitle = pz.getEl('#goodsSubtitleNew').value,
                    goodsType = pz.getEl('#goodsTypeNew').querySelector('.ant-select-selection').getAttribute('data-id'),
                    supplierId = pz.getEl('#supplierIdNew').querySelector('.ant-select-selection').getAttribute('data-id'),
                    cateId = pz.getEl('.cateIdNew').getAttribute('data-id');
                quest.requests({
                    url: 'saveaddgoods',
                    data: {
                        supplier_id: supplierId,
                        cate_id: cateId,
                        goods_name: goodsName,
                        goods_type: goodsType,
                        subtitle: goodsSubtitle,
                        image: t.goodImg
                    },
                    success: function(res) {}
                })
            },
            allCateList: function() { //获取所有分类
                let t = this
                quest.requests({
                    url: 'allCateList',
                    success: function(res) {
                        pz.multistage.init({
                            el: '.cateIdNew',
                            ellink: '.linkage',
                            data: t.disCateList(res.data)
                        })
                    }
                })
            },
            getspecattr: function() { //
                let t = this
                quest.requests({
                    url: 'getspecattr',
                    data: {
                        cate_id: t.goodInfo.goods_data.cate_id
                    },
                    success: function(res) {
                        t.dataAttr = res.data
                        select({
                            el: '#selattr',
                            name: 'spe_name',
                            data: t.dataAttr
                        })
                        t.setsiteclick()
                    }
                })
            },
            setsiteclick: function() { //点击选择规格
                let t = this,
                    items = document.querySelector('#selattr').querySelectorAll('.as-dropdown-item')
                console.log(items)
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
                let data = this.dataAttr,
                    len = data.length,
                    i, str = []
                console.log(id)
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
                console.log(attrid)
                if (!attrid) return
                quest.requests({
                    url: 'addgoodsspec',
                    data: {
                        goods_id: t.id,
                        attr_id: attrid
                    },
                    success: function(res) {
                        t.attributeNew.classList.add('hide')
                    }
                })
            },
            setattributeList: function(data) {
                let t = this,
                    len = data.length,
                    i, str = ''

                for (i = 0; i < len; i++) {
                    str += '<li>'
                    str += '<span class="col-md-3">' + (i + 1) + '</span>'
                    str += '<span class="col-md-3">' + data[i].spec_name + '</span>'
                    str += '<span class="col-md-3">' + data[i].attr_name + '</span>'
                    str += '<span class="col-md-3"><div class="pz-btn btn-del" data-id="' + data[i].attr_id + '" href="#">删除</div></span>'
                    str += '</li>'
                }
                t.attributeList.innerHTML = str
            },
            setgoodattributeList: function(data) {
                let t = this,
                    len = data.length,
                    len1, i, x, s, str = ''

                for (i = 0; i < len; i++) {
                    len1 = data[i].attr.length;
                    s = '';
                    for (x = 0; x < len1; x++) {
                        s += data[i].attr[x] + ','
                    }
                    s = s.substr(0, s.length - 1);
                    str += '<li>'
                    str += '<span class="col-md-1">' + (i + 1) + '</span>'
                    str += '<span class="col-md-1">' + s + '</span>'
                    str += '<span class="col-md-1"><img src="' + data[i].sku_image + '" /></span>'
                    str += '<span class="col-md-1">' + data[i].stock + '</span>'
                    str += '<span class="col-md-1">' + data[i].market_price + '</span>'
                    str += '<span class="col-md-1">' + data[i].retail_price + '</span>'
                    str += '<span class="col-md-1">' + data[i].cost_price + '</span>'
                    str += '<span class="col-md-1">' + data[i].margin_price + '</span>'
                    str += '<span class="col-md-1">' + data[i].integral_price + '</span>'
                    str += '<span class="col-md-1">' + data[i].integral_active + '</span>'
                    str += '<span class="col-md-1">' + data[i].integral_active + '</span>'
                    str += '<span class="col-md-1"><div class="pz-btn btn-amend" data-id="' + data[i].id + '" >编辑</div></span>'
                    str += '</li>'
                }
                t.goodattributeList.innerHTML = str
                t.amendSku()
            },
            amendSku: function() { //点击保存规格
                let t = this,
                    items = t.goodattributeList.querySelectorAll('.btn-amend');
                console.log(items)
                items.forEach(function(item) {
                    item.addEventListener('click', function(e) {
                        let id = item.getAttribute('data-id')
                        t.skuid = id
                        t.getgoodssku(id)
                            // t.amendAttribute.classList.remove('hide')
                    })
                })
            },
            getgoodssku: function(id) {
                let t = this
                quest.requests({
                    url: 'getgoodssku',
                    data: {
                        sku_id: id
                    },
                    success: function(res) {
                        t.editgoodssku(res.data)
                        t.amendAttribute.classList.remove('hide')
                    }
                })
            },
            editgoodssku: function(data) {
                let t = this,
                    sku_name = document.querySelector('#sku_name'),
                    stock = document.querySelector('#stock'),
                    market_price = document.querySelector('#market_price'),
                    retail_price = document.querySelector('#retail_price'),
                    cost_price = document.querySelector('#cost_price'),
                    margin_price = document.querySelector('#margin_price'),
                    integral_price = document.querySelector('#integral_price'),
                    integral_active = document.querySelector('#integral_active');
                stock.value = data.stock
                market_price.value = data.market_price
                retail_price.value = data.retail_price
                cost_price.value = data.cost_price
                margin_price.value = data.margin_price
                integral_price.value = data.integral_price
                integral_active.value = data.integral_active
            },
            savegoodssku: function() {
                let t = this,
                    stock = document.querySelector('#stock').value,
                    market_price = document.querySelector('#market_price').value,
                    retail_price = document.querySelector('#retail_price').value,
                    cost_price = document.querySelector('#cost_price').value,
                    margin_price = document.querySelector('#margin_price').value,
                    integral_price = document.querySelector('#integral_price').value,
                    integral_active = document.querySelector('#integral_active').value;
                quest.requests({
                    url: 'editgoodssku',
                    data: {
                        sku_id: t.skuid,
                        stock: stock,
                        market_price: market_price,
                        retail_price: retail_price,
                        cost_price: cost_price,
                        margin_price: margin_price,
                        integral_price: integral_price,
                        integral_active: integral_active,
                        sku_image: '',
                    },
                    success: function(res) {

                    }
                })
            },
            disCateList: function(data) { //处理所有分类
                let i,
                    x,
                    y,
                    len = data.length,
                    len1,
                    len2,
                    tier1 = {},
                    tier2 = {},
                    tier3 = {},
                    arr = []
                for (i = 0; i < len; i++) {
                    tier1 = {
                        id: data[i].id,
                        name: data[i].type_name,
                        _child: []
                    }
                    if (data[i].hasOwnProperty('_child')) {
                        len1 = data[i]._child.length
                        for (x = 0; x < len1; x++) {
                            tier2 = {
                                id: data[i]._child[x].id,
                                name: data[i]._child[x].type_name,
                                _child: []
                            }
                            if (data[i]._child[x].hasOwnProperty('_child')) {
                                len2 = data[i]._child[x]._child.length
                                for (y = 0; y < len2; y++) {
                                    tier3 = {
                                        id: data[i]._child[x]._child[y].id,
                                        name: data[i]._child[x]._child[y].type_name
                                    }
                                    tier2._child.push(tier3)
                                }
                            }
                            tier1._child.push(tier2)
                        }
                    }
                    arr.push(tier1)
                }
                return arr
            }
        }
        return {
            init: function(o) {
                return new _GO(o)
            }
        }
    })()
})(window.pz)