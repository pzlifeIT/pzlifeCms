;
(function(pz) {
    pz.freight = (function() {
        function _FH(o) {
            this.FhId = pz.geturl().id
            this.id = ''
            this.addfreight = document.querySelector('.addfreight')
            this.eeCancel = document.querySelector('#eeCancel')
            this.eeSave = document.querySelector('#eeSave')
            this.eeAmend = document.querySelector('#eeAmend')
            this.eelist = document.querySelector('#freightlist')
            this.fhsite = document.querySelector('#fhsite')
            this.fhCancelSite = document.querySelector('#fhCancelSite')
            this.fhSaveSite = document.querySelector('#fhSaveSite')
            this.init()
        }
        _FH.prototype.init = function() {
            this.getfreight()
            this.elClick()
            this.addEE()
        }
        _FH.prototype.elClick = function() {
            let t = this
            t.eeCancel.addEventListener('click', function(e) {
                t.eeAmend.classList.add('hide')
            })
            t.fhCancelSite.addEventListener('click', function(e) {
                t.fhsite.classList.add('hide')
            })
            t.eeSave.addEventListener('click', function(e) {
                t.saveEE()
            })
        }
        _FH.prototype.getfreight = function() { //获取供应商快递模板运费列表
            let t = this
            quest.requests({
                url: 'getSupplierFreightdetailList',
                data: {
                    freight_id: t.FhId
                },
                success: function(res) {
                    t.setGlul(res.data)
                }
            })
        }
        _FH.prototype.setGlul = function(data) { //循环出供应商列表
            let len = data.length,
                i,
                str = ''
            for (i = 0; i < len; i++) {
                str += '<li> \
              <div class = "col-md-2 bot-bor subli" ><span>' + data[i].id + '</span> </div> \
              <div class = "col-md-2 bot-bor subli" ><span>' + data[i].price + ' </span></div> \
              <div class = "col-md-2 bot-bor subli" ><span>' + data[i].after_price + '</span></div> \
              <div class = "col-md-3 bot-bor subli" ><span>' + data[i].total_price + '</span></div> \
              <div class = "col-md-3 bot-bor subli" >\
              <div class = "pz-btn btn-amend examine" data-id="' + data[i].id + '" > 地址 </div> \
                  <div class = "pz-btn btn-amend redact" data-id="' + data[i].id + '" > 编辑 </div> \
              <div class = "pz-btn btn-del" data-id="' + data[i].id + '" > 删除 </div> </div></li>'
            }
            this.eelist.innerHTML = str
            this.examine()
            this.del()
            this.amend()
        }
        _FH.prototype.del = function() { //删除
            let dellist = this.eelist.querySelectorAll('.btn-del')
            dellist.forEach(li => {
                li.addEventListener('click', function(e) {
                    let id = li.getAttribute('data-id')

                })
            });
        }
        _FH.prototype.examine = function() { //查看地址
            let t = this,
                dellist = t.eelist.querySelectorAll('.examine')
            dellist.forEach(li => {
                li.addEventListener('click', function(e) {
                    t.id = li.getAttribute('data-id')
                    t.getsize()
                    t.fhsite.classList.remove('hide')
                })
            });
        }
        _FH.prototype.getsize = function() {
            let t = this
            quest.requests({
                url: 'getprovincecitybyfreight',
                data: {
                    freight_id: t.id
                },
                success: function(res) {
                    // t.setData(res.data)
                }
            })
        }
        _FH.prototype.amend = function() { //修改
            let t = this,
                redactlist = t.eelist.querySelectorAll('.redact')
            redactlist.forEach(li => {
                li.addEventListener('click', function(e) {
                    console.log(li.getAttribute('data-id'))
                    t.id = li.getAttribute('data-id')
                    t.getSupplierFreight()
                    t.eeAmend.classList.remove('hide')
                })
            });
        }
        _FH.prototype.getSupplierFreight = function() {
            let t = this
            quest.requests({
                url: 'getSupplierFreight',
                data: {
                    supplierFreightId: t.id
                },
                success: function(res) {
                    // t.setData(res.data)
                    t.eeAmend.classList.remove('hide')
                }
            })
        }
        _FH.prototype.addEE = function() { //添加
            let t = this;
            t.addfreight.addEventListener('click', function(e) {
                t.setData()
                t.eeAmend.classList.remove('hide')
            })
        }
        _FH.prototype.setData = function(data) {
            let t = this,
                fhPrice = document.querySelector('#fhPrice'),
                fhAfter = document.querySelector('#fhAfter'),
                fhTotal = document.querySelector('#fhTotal');
            if (data) {
                t.id = data.id
                fhPrice.value = data.price
                fhAfter.value = data.after_price
                fhTotal.value = data.total_price
            } else {
                t.id = ''
                fhPrice.value = ''
                fhAfter.value = ''
                fhTotal.value = ''
            }
        }
        _FH.prototype.saveEE = function() {
            let t = this,
                fhPrice = document.querySelector('#fhPrice').value,
                fhAfter = document.querySelector('#fhAfter').value,
                fhTotal = document.querySelector('#fhTotal').value;
            if (t.id == '') {
                if (fhPrice == '') return
                if (fhAfter == '') return
                if (fhTotal == '') return
                quest.requests({
                    url: 'addSupplierFreightdetail',
                    data: {
                        freight_id: t.FhId,
                        price: fhPrice,
                        after_price: fhAfter,
                        total_price: fhTotal
                    },
                    success: function(res) {
                        t.getfreight()
                        t.eeAmend.classList.add('hide')
                    }
                })
            } else {
                quest.requests({
                    url: 'updateSupplierFreight',
                    data: {
                        supplier_freight_Id: t.id,
                        stype: eeType,
                        title: eeTitle,
                        desc: eeDesc
                    },
                    success: function(res) {
                        t.getfreight()
                        t.eeAmend.classList.add('hide')
                    }
                })
            }



        }
        return {
            init: function(obj) {
                new _FH(obj);
            }
        }
    })()
})(window.pz)