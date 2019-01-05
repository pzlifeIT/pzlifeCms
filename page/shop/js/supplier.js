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
                str += '<li> \
                <div class = "col-md-2 bot-bor subli" ><span>' + data[i].id + '</span> </div> \
                <div class = "col-md-2 bot-bor subli " ><span> <img class="liimg" src = "http://' + data[i].image + '"\
                alt = "" > </span></div> \
                <div class = "col-md-2 bot-bor subli" ><span>' + data[i].name + ' </span></div> \
                <div class = "col-md-2 bot-bor subli" ><span>' + data[i].tel + '</span></div> \
                <div class = "col-md-2 bot-bor subli desc" ><span>' + data[i].desc + '</span></div> \
                <div class = "col-md-2 bot-bor subli" >\
                <a class="pz-btn btn-amend" href="supplierdetails.html?id=' + data[i].id + '">运费模板</a>\
                    <div class = "pz-btn btn-amend redact" data-id="' + data[i].id + '" > 编辑 </div> \
                <div class = "pz-btn btn-del" data-id="' + data[i].id + '" > 删除 </div> </div></li>'
            }
            this.srlist.innerHTML = str
            this.del()
            this.amend()
        }
        _SR.prototype.getsuppliers = function(o) { //获得供应商列表
            let t = this
            quest.suppliers.getsuppliers({
                data: {
                    page: o.page || 1,
                    pagenum: o.pagenum || 10
                },
                success: function(res) {
                    t.setGlul(res.data)
                    let totle = Math.ceil(parseInt(res.totle) / 10)
                    if (t.totle == totle) return
                    t.totle = totle
                    t.bottompage()
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
            quest.suppliers.getsupplierdata({
                data: {
                    supplierId: t.id
                },
                success: function(res) {
                    t.setData(res.data)
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
            selpicure({
                el: '#selpicure1',
                num: 1,
                images: [img],
                imgChange: function(images) {
                    console.log('images', images[0])
                    t.images = images[0]
                }
            })
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
                quest.suppliers.updateSupplier({
                    data: formData,
                    success: function(res) {
                        t.srcom.classList.add('hide');
                        t.getsuppliers({
                            page: t.page
                        })
                        console.log(res)
                    }
                })
            } else {
                quest.suppliers.addsupplier({
                    data: formData,
                    success: function(res) {
                        t.srcom.classList.add('hide');
                        t.getsuppliers({
                            page: t.page
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
})()