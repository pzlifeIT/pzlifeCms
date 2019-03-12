;
(function() {
    pz.supplier = (function() {
        function _SR(o) {
            this.srlist = document.querySelector('#supplierslist')
            this.srSave = document.querySelector('#srSave')
            this.srCancel = document.querySelector('#srCancel')
            this.addsupplier = document.querySelector('.addsupplier')
            this.srcom = document.querySelector('#srcom')
            this.page = 1
            this.totle = 0
            this.images = ''
            this.id = ''
            this.init()
        }
        _SR.prototype.init = function() { //初始化
            this.getsuppliers({
                page: this.page
            })
            this.saveClick()
            this.hidemodal()
            this.addsr()
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
            quest.requests({
                url: 'getsuppliers',
                data: {
                    page: o.page || 1,
                    pagenum: o.pagenum || 10
                },
                success: function(res) {
                    t.setGlul(res.data || [])
                    let totle = Math.ceil(parseInt(res.totle) / 10)
                    if (t.totle == totle) return
                    t.totle = totle
                    t.bottompage()
                },
                Error(code) {
                    switch (parseInt(code)) {
                        case 3002:
                            alert('页码和查询条数只能是数字')
                            break;
                        default:
                            alert('意料之外的错误')
                            break;
                    }
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
            quest.requests({
                url: 'getSupplierData',
                data: {
                    supplierId: t.id
                },
                success: function(res) {
                    t.setData(res.data || [])
                },
                Error(code) {
                    switch (parseInt(code)) {
                        case 3002:
                            alert('供应商ID只能是数字')
                            break;
                        default:
                            alert('意料之外的错误')
                            break;
                    }
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
            if (t.id != '') {
                formData.id = this.id
                quest.requests({
                    url: 'updateSupplier',
                    data: formData,
                    success: function(res) {
                        t.srcom.classList.add('hide');
                        t.getsuppliers({
                            page: t.page
                        })
                    },
                    Error: function(code) {
                        switch (parseInt(code)) {
                            case 3001:
                                alert('手机号码格式错误')
                                break;
                            case 3002:
                                alert('提交数据不完整')
                                break;
                            case 3003:
                                alert('供应商ID必须是数字')
                                break;
                            case 3004:
                                alert('更新失败')
                                break;
                            case 3005:
                                alert('图片没有上传过')
                                break;
                            case 3006:
                                alert('供应商id不存在')
                                break;
                            case 3007:
                                alert('供应商名称不能重复')
                                break;
                            default:
                                break;
                        }
                    }
                })
            } else {
                quest.requests({
                    url: 'addsupplier',
                    data: formData,
                    success: function(res) {
                        t.srcom.classList.add('hide');
                        t.getsuppliers({
                            page: t.page
                        })
                    },
                    Error(code) {
                        switch (parseInt(code)) {
                            case 3001:
                                alert('手机号码格式错误')
                                break;
                            case 3002:
                                alert('提交数据不完整')
                                break;
                            case 3003:
                                alert('未选择图片')
                                break;
                            case 3004:
                                alert('添加失败')
                                break;
                            case 3005:
                                alert('图片没有上传过')
                                break;
                            case 3006:
                                alert('供应商名字不能重复')
                                break;
                            default:
                                break;
                        }
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
})()