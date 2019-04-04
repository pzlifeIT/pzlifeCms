import { app } from '../../../../index.js';
import { showToast } from '../../../../js/utils.js';
(function(pz) {
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
    })
    pz.goodsoperation = (function() {
        function _GO() {
            this.id = pz.geturl().id || ''
            this.attributeNew = pz.getEl('#attributeNew') //规格弹框
            this.amendAttribute = pz.getEl('#amendAttribute') //商品规格弹框
            this.previewphoto = pz.getEl('#previewphoto') //图片预览
            this.attributeList = pz.getEl('#attributeList') //规格属性列表
            this.goodattributeList = pz.getEl('#goodattributeList') //sku列表
            this.subjectlist = pz.getEl('#subjectlist') //专题列表
            this.freight = pz.getEl('#freight_id') //sku列表

            this.imgDetatil = pz.getEl('#imgDetatil') //添加详情图片
            this.imagesDetatil = pz.getEl('#imagesDetatil') //详情图列表
            this.subjectNew = pz.getEl('#subjectNew') //专题弹窗
            this.preview = pz.getEl('#preview') //预览图片
            this.previewbanner = pz.getEl('#previewbanner') //预览轮播图片
            this.sortimages = document.querySelector('#sortimages')
            this.sortval = document.querySelector('#sortval')
            this.goodImg = '' //产品标题图
            this.sku_image = '' //产品规格图
            this.images_carousel = []
            this.goodInfo = {}
            this.dataAttr = []
            this.skuid = ''
            this.sortImgpath = ''
            this.init()
        }
        _GO.prototype = {
            init: function() { //进入执行
                this.elClick()
                this.getonegoods()
            },
            getonegoods: function(type) { //获取一个商品数据
                let t = this,
                    get_type = type || '',
                    gtype = get_type
                if (get_type == 5) {
                    gtype = 3
                }
                if (t.id == '') {
                    t.isNewAmend({
                        cate_id: '',
                        supplier_id: '',
                        goods_type: '',
                        goods_name: '',
                    })
                    return
                }

                app.requests({
                    url: 'goods/getOneGoods',
                    data: {
                        id: t.id,
                        get_type: gtype
                    },
                    success: function(res) {
                        if (get_type == 1 || get_type == '') {
                            t.goodInfo.goods_data = res.goods_data;
                            t.isNewAmend(t.goodInfo.goods_data)
                        }
                        if (get_type == 2 || get_type == '') {
                            t.goodInfo.spec_attr = res.spec_attr;
                            t.setattributeList(t.goodInfo.spec_attr)
                        }
                        if (get_type == 3 || get_type == '') {
                            t.goodInfo.images_carousel = res.images_carousel;
                            t.setimages(t.goodInfo.images_carousel)
                        }
                        if (get_type == 4 || get_type == '') {
                            t.goodInfo.sku = res.sku;
                            t.setgoodattributeList(t.goodInfo.sku)
                        }
                        if (get_type == 5 || get_type == '') {
                            t.goodInfo.images_detatil = res.images_detatil;
                            t.previewDetatil(t.goodInfo.images_detatil)
                            t.setImgsDetatil(t.goodInfo.images_detatil)
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
                                text = '意料之外的错误'
                                break;
                        }
                        showToast({
                            text: text
                        })
                    }
                })
            },
            isNewAmend: function(data) { //商品类型:供应商:三级分类:是否已经选择
                if (data.cate_id == 0 || data.cate_id == '') {
                    this.allCateList()
                    this.elremovehide('.cateIdNew')
                } else {
                    this.elremovehide('#cateIdAmend')
                    let cateIdAmend = document.querySelector('#cateIdAmend')
                    cateIdAmend.innerHTML = data.goods_class
                    cateIdAmend.setAttribute('data-id', data.cate_id)
                }
                if (data.supplier_id == 0 || data.supplier_id == '') {
                    this.getSuppliersAll()
                    this.elremovehide('#supplierIdNew')
                } else {
                    this.getsupplierfreights()
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
            elremovehide: function(el) { //显示控件
                document.querySelector(el).classList.remove('hide')
            },
            getsupplierfreights: function() { // 获取供应商快递模板列表
                let t = this
                app.requests({
                    url: 'suppliers/getsupplierfreights',
                    data: {
                        supplierId: t.goodInfo.goods_data.supplier_id
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
            setImgsDetatil: function(data) { //详情图输出
                let t = this,
                    len = data.length,
                    i, str = ""
                for (i = 0; i < len; i++) {
                    if ((i % 5) == 0) {
                        str += '<span class="table-row"></span>'
                    }
                    str += '<div class="pl-li table-cell">'
                    str += '<img class="pl-image" src="' + data[i].image_path + '" alt="">'
                    str += '<div class="hierarchy">' + data[i].order_by + '</div>'
                    str += '<div class="pl-manage"><input class="imgDel" type="button" data-image="' + data[i].image_path + '" value="删除"><input type="button" class="imgsort" data-image="' + data[i].image_path + '" data-orderby="' + data[i].order_by + '" value="编辑"></div>'
                    str += '</div>'
                }
                if (len < 5 && len != 0) {
                    let len1 = 5 - len;
                    for (let y = 0; y < len1; y++) {
                        str += '<div class="pl-li table-cell"></div>'
                    }
                }
                t.imagesDetatil.innerHTML = str
                t.delImgsDetatil()
                t.imgsort()
            },
            imgsort: function() {
                let t = this,
                    lis = t.imagesDetatil.querySelectorAll('.pl-li')
                lis.forEach(function(li) {
                    let imgsort = li.querySelector('.imgsort')
                    if (!imgsort) return
                    imgsort.addEventListener('click', function(e) {
                        let image = imgsort.getAttribute('data-image'),
                            orderby = imgsort.getAttribute('data-orderby')
                        t.sortval.value = orderby
                        t.sortImgpath = image
                        t.sortimages.classList.remove('hide')
                            // t.sortImg(image, 5)
                    })
                })
            },

            sortImg: function(order_by) { //商品详情图排序
                let t = this;
                app.requests({
                    url: 'goods/sortimagedetail',
                    data: {
                        image_path: t.sortImgpath,
                        order_by: order_by
                    },
                    success: function(res) {
                        showToast({
                            type: 'success',
                            text: '操作成功！'
                        })
                        t.getonegoods(5)
                        t.sortimages.classList.add('hide')
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
            previewDetatil: function(data) { //预览图片
                console.log(data)
                let t = this,
                    len = data.length,
                    i, str = ""
                for (i = 0; i < len; i++) {
                    str += '<img src="' + data[i].image_path + '" alt="">'
                }
                t.preview.innerHTML = str
            },
            delImgsDetatil: function() { //删除详情图片
                let t = this,
                    lis = t.imagesDetatil.querySelectorAll('.pl-li')
                lis.forEach(function(li) {
                    let imgDel = li.querySelector('.imgDel')
                    if (!imgDel) return
                    imgDel.addEventListener('click', function(e) {
                        let image = imgDel.getAttribute('data-image')
                        t.delImg(image, 5)
                    })
                })
            },
            setimages: function(data) { //轮播图片
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
                        t.getonegoods(type)
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
                        t.getonegoods(type)
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
            setList: function() { //商品名称，标题，图片显示
                let t = this,
                    goodsNameNew = document.querySelector('#goodsNameNew'),
                    goodsSubtitleNew = document.querySelector('#goodsSubtitleNew'),
                    img = '';
                if (t.id != '') {
                    goodsNameNew.value = t.goodInfo.goods_data.goods_name;
                    goodsSubtitleNew.value = t.goodInfo.goods_data.subtitle
                    img = t.goodInfo.goods_data.image
                }

                selpicure({
                    el: '#selpicure1',
                    images: [{ image: img }],
                    imgChange: function(images) {
                        t.goodImg = images[0].image
                    }
                })

            },
            elClick: function() { //控件点击
                let t = this
                    //添加规格
                document.querySelector('.addattribute').addEventListener('click', function(e) {
                    if (t.id == '') return
                    t.attrinit()
                    t.attributeNew.classList.remove('hide')
                    t.getspecattr()
                });
                //隐藏规格弹框
                document.querySelector('#cancelNew').addEventListener('click', function(e) {
                    t.attributeNew.classList.add('hide')
                });
                document.querySelector('#cancelSort').onclick = function(e) {
                    t.sortimages.classList.add('hide')
                };
                document.querySelector('#saveSort').onclick = function(e) {
                    let sortNum = t.sortval.value
                    if (sortNum == '') {
                        showToast({
                            text: '请填写排序'
                        })
                        return
                    }
                    t.sortImg(sortNum)
                };
                //保存规格添加
                document.querySelector('#saveNew').addEventListener('click', function(e) {
                    t.addgoodsspec()
                });
                //隐藏商品规格弹框
                document.querySelector('#cancelAmend').addEventListener('click', function(e) {
                    t.amendAttribute.classList.add('hide')
                });
                //保存商品规格
                document.querySelector('#saveAmend').addEventListener('click', function(e) {
                    t.savegoodssku()
                });
                t.previewphoto.addEventListener('click', function(e) {
                    t.previewphoto.classList.add('hide')
                });
                //添加商品详情图片
                document.querySelector('#addpreview').addEventListener('click', function(e) {
                    t.previewphoto.classList.remove('hide')
                });
                //图片预览
                document.querySelector('#modalContent').addEventListener('click', function(e) {
                    window.event ? window.event.cancelBubble = true : e.stopPropagation();
                });
                //保存新建商品基本信息
                document.querySelector('#goodSaveNew').addEventListener('click', function(e) {
                        if (t.id == '') {
                            t.saveGoodNew()
                        } else {
                            t.saveGoodAmend()
                        }
                    })
                    //sku列表
                document.querySelector('.addImg').addEventListener('click', function(e) {
                    t.imgDetatil.click()
                })
                t.imgDetatil.addEventListener('change', function(e) {
                    t.uploadmultifile(t.imgDetatil.files)
                })
                document.querySelector('.addsubject').addEventListener('click', function(e) {
                    let sel = document.querySelector('#selSubject')
                    sel.setAttribute('data-id', '')
                    sel.innerHTML = '请选择'
                    t.subjectNew.classList.remove('hide')
                    t.getgoodssubject(2)
                })
                document.querySelector('#cancelSubject').addEventListener('click', function(e) {
                    t.subjectNew.classList.add('hide')
                })
                document.querySelector('#saveSubject').onclick = function(e) {
                    let id = document.querySelector('#selSubject').getAttribute('data-id')
                    t.subjectSave(id)
                }
            },
            subjectSave: function(id) {
                let t = this
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
                        t.subjectNew.classList.add('hide')
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
                            t.setgoodssubject(res.data || [])
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
            selgoodssubject: function(data) { //可选专题列表
                pz.multistage.init({
                    el: '#selSubject',
                    ellink: '#subjectlinkage',
                    name: 'subject',
                    type: '3',
                    data: data
                })
            },
            setgoodssubject: function(data) { //关联列表输出
                let len = data.length,
                    i, str = ""
                for (i = 0; i < len; i++) {
                    str += '<li>'
                    str += '<span class="col-md-1">' + (i + 1) + '</span>'
                    str += '<span class="col-md-3">' + data[i].subject_tier1 + '</span>'
                    str += '<span class="col-md-3">' + data[i].subject_tier2 + '</span>'
                    str += '<span class="col-md-3">' + data[i].subject + '</span>'
                    str += '<span class="col-md-2"><div class="pz-btn btn-del" data-id="' + data[i].id + '">删除</div></span>'
                    str += '</li>'
                }
                this.subjectlist.innerHTML = str
                this.delsubject()
            },
            delsubject: function() {
                if (this.id == '') return
                let t = this,
                    delels = this.subjectlist.querySelectorAll('.btn-del');
                delels.forEach(function(el) {
                    el.addEventListener('click', function(e) {
                        let id = el.getAttribute('data-id')
                        t.delgoodssubjectassoc(id)
                    })
                })
            },
            delgoodssubjectassoc: function(id) {
                let t = this
                if (this.id == '') return
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
                            case 3005:
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
            },
            getSuppliersAll: function() { //获取所有供应商
                let t = this
                app.requests({
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
                app.requests({
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
                        showToast({
                            type: 'success',
                            text: '修改成功'
                        })
                        t.getonegoods(1)
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
            saveGoodNew: function() { //修改商品
                let t = this,
                    goodsName = pz.getEl('#goodsNameNew').value,
                    goodsSubtitle = pz.getEl('#goodsSubtitleNew').value,
                    goodsType = pz.getEl('#goodsTypeNew').querySelector('.ant-select-selection').getAttribute('data-id'),
                    supplierId = pz.getEl('#supplierIdNew').querySelector('.ant-select-selection').getAttribute('data-id'),
                    cateId = pz.getEl('.cateIdNew').getAttribute('data-id');
                app.requests({
                    url: 'saveaddgoods',
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
                                text = '供应商id必须是数字'
                                break;
                            case 3002:
                                text = '供应商id必须是数字'
                                break;
                            case 3003:
                                text = '供应商id必须是数字'
                                break;
                            case 3004:
                                text = '供应商id必须是数字'
                                break;
                            case 3005:
                                text = '供应商id必须是数字'
                                break;
                            case 3006:
                                text = '供应商id必须是数字'
                                break;
                            case 3007:
                                text = '供应商id必须是数字'
                                break;
                            case 3008:
                                text = '供应商id必须是数字'
                                break;
                            case 3009:
                                text = '供应商id必须是数字'
                                break;
                            case 3010:
                                text = '供应商id必须是数字'
                                break;
                            default:
                                text = '供应商id必须是数字'
                                break;
                        }
                        showToast({
                            text: text
                        })
                    }
                })
            },
            allCateList: function() { //获取所有分类
                let t = this
                app.requests({
                    url: 'allCateList',
                    success: function(res) {
                        pz.multistage.init({
                            el: '.cateIdNew',
                            ellink: '#catelinkage',
                            type: '3',
                            name: 'type_name',
                            data: res.data
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
            getspecattr: function() { //获取一级规格和二级属性
                let t = this
                app.requests({
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
                    },
                    Error(code) {
                        let text = ''
                        switch (parseInt(code)) {
                            case 3001:
                                text = '保存失败'
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
                let data = this.dataAttr,
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
                if (!attrid) return
                app.requests({
                    url: 'addgoodsspec',
                    data: {
                        goods_id: t.id,
                        attr_id: attrid
                    },
                    success: function(res) {
                        t.attributeNew.classList.add('hide')
                        t.getonegoods(2)
                        t.getonegoods(4)
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
            setattributeList: function(data) { //规格循环输出
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
                t.delattributeli()
            },
            delattributeli: function() { //删除规格
                let t = this,
                    items = t.attributeList.querySelectorAll('.btn-del');
                items.forEach(function(item) {
                    item.addEventListener('click', function(e) {
                        let id = item.getAttribute('data-id')
                        t.delgoodsspec(id)
                    })
                })
            },
            delgoodsspec: function(tid) { //删除规格接口
                let t = this
                app.requests({
                    url: 'delgoodsspec',
                    data: {
                        goods_id: t.id,
                        attr_id: tid
                    },
                    success: function(res) {
                        t.getonegoods(2)
                        t.getonegoods(4)
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
            setgoodattributeList: function(data) { //sku 输出
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
                    str += '<span class="col-md-05">' + (i + 1) + '</span>'
                    str += '<span class="col-md-1 sizeauto">' + s + '</span>'
                    str += '<span class="col-md-1"><img class="attrImg" src="' + data[i].sku_image + '" /></span>'
                    str += '<span class="col-md-05">' + data[i].stock + '</span>'
                    str += '<span class="col-md-1">' + data[i].market_price + '</span>'
                    str += '<span class="col-md-1">' + data[i].retail_price + '</span>'
                    str += '<span class="col-md-1">' + data[i].cost_price + '</span>'
                    str += '<span class="col-md-1">' + data[i].margin_price + '</span>'
                    str += '<span class="col-md-1">' + data[i].integral_price + '</span>'
                        // str += '<span class="col-md-05">' + data[i].integral_active + '</span>'
                    str += '<span class="col-md-1">' + data[i].weight + '</span>'
                    str += '<span class="col-md-1">' + data[i].volume + '</span>'
                    str += '<span class="col-md-1">' + data[i].freight_title + '</span>'
                    str += '<span class="col-md-1"><div class="pz-btn btn-amend" data-id="' + data[i].id + '" >编辑</div></span>'
                    str += '</li>'
                }
                t.goodattributeList.innerHTML = str
                t.amendSku()
            },
            amendSku: function() { //点击保存规格
                let t = this,
                    items = t.goodattributeList.querySelectorAll('.btn-amend');
                items.forEach(function(item) {
                    item.addEventListener('click', function(e) {
                        let id = item.getAttribute('data-id')
                        t.skuid = id
                        t.getgoodssku(id)
                            // t.amendAttribute.classList.remove('hide')
                    })
                })
            },
            getgoodssku: function(id) { //获取一条sku
                let t = this
                app.requests({
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
            editgoodssku: function(data) { //编辑sku
                let t = this,
                    sku_name = document.querySelector('#sku_name'),
                    stock = document.querySelector('#stock'),
                    market_price = document.querySelector('#market_price'),
                    retail_price = document.querySelector('#retail_price'),
                    cost_price = document.querySelector('#cost_price'),
                    margin_price = document.querySelector('#margin_price'),
                    integral_price = document.querySelector('#integral_price'),
                    // integral_active = document.querySelector('#integral_active'),
                    weight = document.querySelector('#weight'),
                    volume = document.querySelector('#volume'),
                    freight_id = t.freight.querySelector('.ant-select-selection'),
                    len1 = data.attr.length,
                    x,
                    attr = '';
                for (x = 0; x < len1; x++) {
                    attr += data.attr[x] + ','
                }
                attr = attr.substr(0, attr.length - 1);
                sku_name.innerHTML = attr
                stock.value = data.stock
                market_price.value = data.market_price
                retail_price.value = data.retail_price
                cost_price.value = data.cost_price
                margin_price.value = data.margin_price
                integral_price.value = data.integral_price
                    // integral_active.value = data.integral_active
                weight.value = data.weight
                volume.value = data.volume
                t.sku_image = ''
                if (data.freight_id == 0) {
                    freight_id.setAttribute('data-id', '')
                    freight_id.innerHTML = '请选择'
                    freight_id.classList.remove('already-select')
                } else {
                    freight_id.setAttribute('data-id', data.freight_id)
                    freight_id.innerHTML = data.freight_title
                    freight_id.classList.add('already-select')
                }
                // t.getsupplierfreights()
                selpicure({
                    el: '#selpicure3',
                    images: [{ image: data.sku_image }],
                    imgChange: function(images) {
                        t.sku_image = images[0].image
                    }
                })
            },
            savegoodssku: function() { //保存sku
                let t = this,
                    stock = document.querySelector('#stock').value,
                    market_price = document.querySelector('#market_price').value,
                    retail_price = document.querySelector('#retail_price').value,
                    cost_price = document.querySelector('#cost_price').value,
                    margin_price = document.querySelector('#margin_price').value,
                    integral_price = document.querySelector('#integral_price').value,
                    // integral_active = document.querySelector('#integral_active').value,
                    weight = document.querySelector('#weight').value,
                    volume = document.querySelector('#volume').value,
                    freight_id = t.freight.querySelector('.ant-select-selection').getAttribute('data-id');
                app.requests({
                    url: 'goods/editgoodssku',
                    data: {
                        sku_id: t.skuid,
                        stock: stock,
                        market_price: market_price,
                        retail_price: retail_price,
                        cost_price: cost_price,
                        margin_price: margin_price,
                        integral_price: integral_price,
                        // integral_active: integral_active,
                        sku_image: t.sku_image,
                        freight_id: freight_id,
                        weight: weight,
                        volume: volume,
                    },
                    success: function(res) {
                        t.getonegoods(4)
                        t.amendAttribute.classList.add('hide')
                    },
                    error(code) {
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
    pz.goodsoperation.init()
})(window.pz)