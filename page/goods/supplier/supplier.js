import { app } from '../../../index.js';
import { showToast } from '../../../js/utils.js';
(function() {
    pz.supplier = (function() {
        function _SR(o) {
            this.srlist = document.querySelector('#supplierslist')
            this.srSave = document.querySelector('#srSave')
            this.srCancel = document.querySelector('#srCancel')
            this.addsupplier = document.querySelector('.addsupplier')
            this.srcom = document.querySelector('#srcom')
            this.page = parseInt(localStorage.getItem("supplierList")) || 1
            this.totle = 0
            this.supplierName = ''
            this.images = ''
            this.id = ''
            this.init()
        }
        _SR.prototype.init = function() { //初始化
            this.elclick()
            this.getsuppliers({
                page: this.page
            })
            this.saveClick()
            this.hidemodal()
            this.addsr()
        }
        _SR.prototype.elclick = function() {
            let t = this
            document.querySelector('#search').onclick = function(e) {
                t.supplierName = document.querySelector('#suppliername').value
                localStorage.setItem("supplierList", 1)
                t.page = 1
                t.getsuppliers({
                    page: 1,
                    search: true
                })
            }
        }
        _SR.prototype.setGlul = function(data) { //循环出供应商列表
            let len = data.length,
                i,
                str = ''
            for (i = 0; i < len; i++) {
                str += '<div class="table-tr"> \
                <div class = "col-md-2 bot-bor subli" ><span>' + data[i].id + '</span> </div> \
                <div class = "col-md-1 bot-bor subli " ><span> <img class="liimg" src = "' + data[i].image + '"\
                alt = "" > </span></div> \
                <div class = "col-md-2 bot-bor subli" ><span>' + data[i].name + ' </span></div> \
                <div class = "col-md-2 bot-bor subli" ><span>' + data[i].title + ' </span></div> \
                <div class = "col-md-1 bot-bor subli" ><span>' + data[i].tel + '</span></div> \
                <div class = "col-md-2 bot-bor subli desc" ><span>' + data[i].desc + '</span></div> \
                <div class = "col-md-2 bot-bor subli" >\
                <a class="pz-btn btn-amend" href="expressage/expressage.html?id=' + data[i].id + '">快递模板</a>\
                    <div class = "pz-btn btn-amend redact" data-id="' + data[i].id + '" > 编辑 </div> \
                <div class = "pz-btn btn-del" data-id="' + data[i].id + '" > 删除 </div> </div></div>'
            }
            this.srlist.innerHTML = str
            this.del()
            this.amend()
        }
        _SR.prototype.getsuppliers = function(o) { //获得供应商列表
            let t = this
            app.requests({
                url: 'suppliers/getsuppliers',
                data: {
                    page: o.page || 1,
                    pagenum: o.pagenum || 10,
                    supplierName: t.supplierName
                },
                success: function(res) {
                    localStorage.setItem("supplierList", o.page)
                    t.setGlul(res.data || [])
                    if (o.search) { t.bottompage() }
                    let totle = Math.ceil(parseInt(res.totle) / 10)
                    if (t.totle == totle) return
                    t.totle = totle
                    t.bottompage()
                },
                Error(code) {
                    let text = ''
                    switch (parseInt(code)) {
                        case 3002:
                            text = '页码和查询条数只能是数字'
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
        }
        _SR.prototype.del = function() { //删除
            let dellist = this.srlist.querySelectorAll('.btn-del')
            dellist.forEach(li => {
                li.addEventListener('click', function(e) {
                    let id = li.getAttribute('data-id')
                })
            });
        }
        _SR.prototype.amend = function() { //修改
            let t = this,
                redactlist = t.srlist.querySelectorAll('.redact')
            redactlist.forEach(li => {
                li.addEventListener('click', function(e) {
                    t.id = li.getAttribute('data-id')
                    t.getsupplierdata()
                    t.srcom.classList.remove('hide')

                })
            });
        }
        _SR.prototype.addsr = function() { //添加
            let t = this;
            console.log(t.addsupplier)
            t.addsupplier.addEventListener('click', function(e) {
                t.setData()
                t.srcom.classList.remove('hide')
            })
        }
        _SR.prototype.saveClick = function() { //保存
            let t = this
            t.srSave.addEventListener('click', function(e) {
                t.saveSupplier()
            })
        }
        _SR.prototype.bottompage = function() { //底部导航
            let t = this
            pages.init({
                el: '#floorpages',
                pagenumber: t.totle,
                fn: function(n) {
                    t.page = n
                    t.getsuppliers({
                        page: n
                    })
                }
            })
        }
        _SR.prototype.hidemodal = function() {
            let t = this;
            t.srCancel.addEventListener('click', function(e) {
                t.srcom.classList.add('hide')
            })
        }
        _SR.prototype.getsupplierdata = function() { //获取供应商详情
            let t = this
            app.requests({
                url: 'suppliers/getsupplierdata',
                data: {
                    supplierId: t.id
                },
                success: function(res) {
                    t.setData(res.data || [])
                },
                Error(code) {
                    let text = ''
                    switch (parseInt(code)) {
                        case 3002:
                            text = '供应商ID只能是数字'
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
        }
        _SR.prototype.setData = function(data) { //数据显示
            let sdName = document.querySelector('#srName'),
                sdTel = document.querySelector('#srTel'),
                sdTitle = document.querySelector('#srTitle'),
                sdDesc = document.querySelector('#srDesc');

            if (typeof data == 'undefined') {
                this.id = ''
                sdName.value = ''
                sdTel.value = ''
                sdTitle.value = ''
                sdDesc.value = ''
                this.setImg()
                return
            }
            sdName.value = data.name
            sdTel.value = data.tel
            sdTitle.value = data.title
            sdDesc.value = data.desc
            this.setImg(data.image)
        }
        _SR.prototype.setImg = function(img) { //显示图片
            let t = this
            t.images = ''
            selpicure({
                el: '#selpicure1',
                num: 1,
                images: [{ image: img }],
                imgChange: function(images) {
                    t.images = images[0].image
                }
            })
        }
        _SR.prototype.codeError = function(code) {

        }
        _SR.prototype.saveSupplier = function() {
            let sdName = document.querySelector('#srName'),
                sdTel = document.querySelector('#srTel'),
                sdTitle = document.querySelector('#srTitle'),
                sdDesc = document.querySelector('#srDesc'),
                sdImg = document.querySelector('#imgFile'),
                formData = {},
                t = this;
            formData.name = sdName.value
            formData.tel = sdTel.value
            formData.title = sdTitle.value
            formData.desc = sdDesc.value
            formData.image = this.images
            if (formData.name == '') {
                showToast({
                    text: '前端供应商名称不能为空'
                })
                return
            }
            if (formData.tel == '') {
                showToast({
                    text: '供应商客服不能为空'
                })
                return
            }
            if (formData.title == '') {
                showToast({
                    text: '后端供应商名称不能为空'
                })
                return
            }
            if (formData.desc == '') {
                showToast({
                    text: '描述不能为空'
                })
                return
            }
            if (t.id != '') {
                formData.id = this.id
                app.requests({
                    url: 'suppliers/updatesupplier',
                    data: formData,
                    success: function(res) {
                        showToast({
                            type: 'success',
                            text: '操作成功'
                        })
                        t.srcom.classList.add('hide');
                        t.getsuppliers({
                            page: t.page
                        })
                    },
                    Error: function(code) {
                        let type = ''
                        switch (parseInt(code)) {
                            case 3001:
                                type = '手机号码格式错误'
                                break;
                            case 3002:
                                type = '提交数据不完整'
                                break;
                            case 3003:
                                type = '供应商ID必须是数字'
                                break;
                            case 3004:
                                type = '更新失败'
                                break;
                            case 3005:
                                type = '图片没有上传过'
                                break;
                            case 3006:
                                type = '供应商id不存在'
                                break;
                            case 3007:
                                type = '供应商名称不能重复'
                                break;
                            default:
                                type = '操作失败'
                                break;
                        }
                        showToast({
                            text: type
                        })
                    }
                })
            } else {
                app.requests({
                    url: 'suppliers/addsupplier',
                    data: formData,
                    success: function(res) {
                        showToast({
                            type: 'success',
                            text: '操作成功'
                        })
                        t.srcom.classList.add('hide');
                        t.getsuppliers({
                            page: t.page
                        })
                    },
                    Error(code) {
                        let text = ''
                        switch (parseInt(code)) {
                            case 3001:
                                text = '手机号码格式错误'
                                break;
                            case 3002:
                                text = '提交数据不完整'
                                break;
                            case 3003:
                                text = '未选择图片'
                                break;
                            case 3004:
                                text = '添加失败'
                                break;
                            case 3005:
                                text = '图片没有上传过'
                                break;
                            case 3006:
                                text = '供应商名字不能重复'
                                break;
                            default:
                                text = ''
                                break;
                        }
                        showToast({
                            text: text
                        })
                    }
                })
            }
        }
        return {
            init: function(obj) {
                new _SR(obj);
            }
        }
    })()
    pz.supplier.init({})
})()