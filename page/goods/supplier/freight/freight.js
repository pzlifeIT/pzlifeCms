import { app } from '../../../../index.js';;
(function(pz) {
    pz.freight = (function() {
        function _FH(o) {
            this.FhId = pz.geturl().id
            this.mode = pz.geturl().mode
            console.log(this.mode)
            this.id = ''
            this.addfreight = document.querySelector('.addfreight')
            this.eeCancel = document.querySelector('#eeCancel')
            this.eeSave = document.querySelector('#eeSave')
            this.eeAmend = document.querySelector('#eeAmend')
            this.eelist = document.querySelector('#freightlist')
            this.fhsite = document.querySelector('#fhsite')
            this.fhCancelSite = document.querySelector('#fhCancelSite')
            this.fhSaveSite = document.querySelector('#fhSaveSite')
            this.listProvince = document.querySelector('#listProvince')
            this.site = []
            this.init()
        }
        _FH.prototype.init = function() {
            this.getfreight()
            this.elClick()
            this.addEE()
            this.setMode()
        }
        _FH.prototype.setMode = function() {
            let freightMode = document.querySelector('#freightMode')
            if (this.mode == 1) {
                freightMode.innerHTML = '件'
            } else if (this.mode == 2) {
                freightMode.innerHTML = 'kg'
            } else if (this.mode == 3) {
                freightMode.innerHTML = 'm³'
            }
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
            t.fhSaveSite.addEventListener('click', function(e) {
                t.saveSite()
            })
        }
        _FH.prototype.getfreight = function() { //获取供应商快递模板运费列表
            let t = this
            app.requests({
                url: 'getSupplierFreightdetailList',
                data: {
                    freight_id: t.FhId
                },
                success: function(res) {
                    t.setGlul(res.data)
                },
                Error(code) {
                    switch (parseInt(code)) {
                        case 3002:
                            alert('供应商快递模板ID和页码和每页条数只能是数字')
                            break;
                        default:
                            alert('意料之外的错误')
                            break;
                    }
                }
            })
        }

        _FH.prototype.setGlul = function(data) { //循环出供应商列表
            let len = data.length,
                i,
                str = ''
            for (i = 0; i < len; i++) {
                str += '<div class="table-tr"> \
              <div class = "col-md-2 bot-bor subli" ><span>' + data[i].id + '</span> </div> \
              <div class = "col-md-2 bot-bor subli" ><span>' + data[i].unit_price + ' </span></div> \
              <div class = "col-md-2 bot-bor subli" ><span>' + data[i].price + ' </span></div> \
              <div class = "col-md-2 bot-bor subli" ><span>' + data[i].after_price + '</span></div> \
              <div class = "col-md-2 bot-bor subli" ><span>' + data[i].total_price + '</span></div> \
              <div class = "col-md-2 bot-bor subli" >\
              <div class = "pz-btn btn-amend examine" data-id="' + data[i].id + '" > 地址 </div> \
                  <div class = "pz-btn btn-amend redact" data-id="' + data[i].id + '" > 编辑 </div> \
              <div class = "pz-btn btn-del" data-id="' + data[i].id + '" > 删除 </div> </div></div>'
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
            app.requests({
                url: 'getprovincecitybyfreight',
                data: {
                    freight_id: t.FhId,
                    freight_detail_id: t.id
                },
                success: function(res) {
                    t.site = res.data
                    t.disSite()
                }
            })
        }
        _FH.prototype.disSite = function() {
            let sdata = this.site,
                len = sdata.length,
                len1, i, y, p = 0,
                c = 0;
            for (i = 0; i < len; i++) {
                len1 = sdata[i]._child.length
                c = 0
                for (y = 0; y < len1; y++) {
                    if (sdata[i]._child[y].status == 2) {
                        c++
                    }
                }
                if (c == len1) {
                    sdata[i].status = 2
                } else if (c > 0) {
                    sdata[i].status = 3
                } else {
                    sdata[i].status = 1
                }
            }
            this.site = sdata
            this.setSiteHtml(this.site)
        }
        _FH.prototype.setSiteHtml = function(data) {
            let t = this,
                len = data.length,
                len1, x, y, str = '',
                pcol = '',
                ccol = ''
            for (i = 0; i < len; i++) {
                pcol = ''
                if (data[i].status == 2) {
                    pcol = 'active'
                } else if (data[i].status == 3) {
                    pcol = 'cur'
                }
                str += '<li class="li-province ' + pcol + ' p' + data[i].id + ' " data-id="' + data[i].id + '" >'
                str += '<div class="li-pro-div">'
                str += '<span class="sel-box"></span>'
                str += '<span class="set-text">' + data[i].area_name + '</span>'
                str += '</div>'
                str += '<ul class="list-city">'
                len1 = data[i]._child.length
                for (y = 0; y < len1; y++) {
                    ccol = ''
                    if (data[i]._child[y].status == 2) {
                        ccol = 'active'
                    }
                    str += '<li class="li-city ' + ccol + '  c' + data[i]._child[y].id + '  " data-id="' + data[i]._child[y].id + '">'
                    str += '<span class="sel-box-city"></span>'
                    str += '<span class="set-text-city">' + data[i]._child[y].area_name + '</span>'
                    str += '</li>'
                }
                str += '</ul>'
                str += '</div>'
            }
            t.listProvince.innerHTML = str
            t.liclick()
        }
        _FH.prototype.setprovince = function(id, n) {
            let sdata = this.site,
                len = sdata.length,
                len1, i, y, pel = document.querySelector('.p' + id);
            for (i = 0; i < len; i++) {
                len1 = sdata[i]._child.length
                if (sdata[i].id == id) {
                    for (y = 0; y < len1; y++) {
                        sdata[i]._child[y].status = n
                    }
                    sdata[i].status = n
                    break;
                }
            }
            let cels = pel.querySelectorAll('.li-city');
            if (n == 1) {
                pel.classList.remove('active')
            }
            if (n == 2) {
                pel.classList.add('active')
            }
            pel.classList.remove('cur')
            cels.forEach(function(cel) {
                if (n == 2) {
                    cel.classList.add('active')
                }
                if (n == 1) {
                    cel.classList.remove('active')
                }

            })
            this.site = sdata
        }
        _FH.prototype.setcity = function(tid, id, n) {
            let sdata = this.site,
                len = sdata.length,
                len1, i, y, p = 0,
                c = 0,
                cel = document.querySelector('.c' + id);
            pel = document.querySelector('.p' + tid)
            if (n == 1) {
                cel.classList.remove('active')
            }
            if (n == 2) {
                cel.classList.add('active')
            }
            for (i = 0; i < len; i++) {
                len1 = sdata[i]._child.length;
                c = 0;
                if (sdata[i].id == tid) {
                    for (y = 0; y < len1; y++) {
                        if (sdata[i]._child[y].id == id) {
                            sdata[i]._child[y].status = n;
                        }
                        if (sdata[i]._child[y].status == 2) {
                            c++;
                        }
                    }
                    if (c == len1) {
                        sdata[i].status = 2;
                        pel.classList.remove('cur')
                        pel.classList.add('active')
                    } else if (c > 0) {
                        sdata[i].status = 3;
                        pel.classList.add('cur')
                        pel.classList.remove('active')
                    } else {
                        sdata[i].status = 1;
                        pel.classList.remove('cur')
                        pel.classList.remove('active')
                    }
                    break;
                }

            }
            this.site = sdata;
        }
        _FH.prototype.saveSite = function() {
            let t = this,
                sdata = t.site,
                len = sdata.length,
                len1, i, y, str = '';
            for (i = 0; i < len; i++) {
                len1 = sdata[i]._child.length;
                for (y = 0; y < len1; y++) {
                    if (sdata[i]._child[y].status == 2) {
                        str += sdata[i]._child[y].id + ','
                    }
                }
            }
            str = str.substr(0, str.length - 1);
            app.requests({
                url: 'updatesupplierfreightarea',
                data: {
                    city_id_str: str,
                    freight_detail_id: t.id
                },
                success: function(res) {
                    t.fhsite.classList.add('hide')
                }
            })
        }
        _FH.prototype.liclick = function() {
            let t = this,
                liprovinces = t.listProvince.querySelectorAll('.li-province')
            liprovinces.forEach(function(lip) {
                let lid = lip.querySelector('.li-pro-div'),
                    lics = lip.querySelectorAll('.li-city'),
                    tid = lip.getAttribute('data-id');
                lid.addEventListener('click', function(e) {
                    if (lip.classList.contains('active')) {
                        t.setprovince(tid, 1)
                    } else {
                        t.setprovince(tid, 2)
                    }
                })
                lics.forEach(function(lic) {
                    lic.addEventListener('click', function(el) {
                        let id = lic.getAttribute('data-id')
                        if (lic.classList.contains('active')) {
                            t.setcity(tid, id, 1)
                        } else {
                            t.setcity(tid, id, 2)
                        }
                    })
                })
            })
        }
        _FH.prototype.amend = function() { //修改
            let t = this,
                redactlist = t.eelist.querySelectorAll('.redact')
            redactlist.forEach(li => {
                li.addEventListener('click', function(e) {
                    t.id = li.getAttribute('data-id')
                    t.getSupplierFreight()
                    t.eeAmend.classList.remove('hide')
                })
            });
        }
        _FH.prototype.getSupplierFreight = function() {
            let t = this
            app.requests({
                url: 'getSupplierFreightdetail',
                data: {
                    sfd_id: t.id
                },
                success: function(res) {
                    t.setData(res.data)
                    t.eeAmend.classList.remove('hide')
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
            countPinkage = document.querySelector('#countPinkage');
            if (data) {
                t.id = data.id
                fhPrice.value = data.price
                fhAfter.value = data.after_price
                fhTotal.value = data.total_price
                countPinkage.value = data.unit_price
            } else {
                t.id = ''
                fhPrice.value = ''
                fhAfter.value = ''
                fhTotal.value = ''
                countPinkage.value = ''
            }
        }
        _FH.prototype.saveEE = function() {
            let t = this,
                fhPrice = document.querySelector('#fhPrice').value,
                fhAfter = document.querySelector('#fhAfter').value,
                fhTotal = document.querySelector('#fhTotal').value;
            countPinkage = document.querySelector('#countPinkage').value;
            if (t.id == '') {
                if (fhPrice == '') return
                if (fhAfter == '') return
                if (fhTotal == '') return
                if (countPinkage == '') return
                app.requests({
                    url: 'addSupplierFreightdetail',
                    data: {
                        freight_id: t.FhId,
                        price: fhPrice,
                        after_price: fhAfter,
                        total_price: fhTotal,
                        unit_price: countPinkage
                    },
                    success: function(res) {
                        t.getfreight()
                        t.eeAmend.classList.add('hide')
                    }
                })
            } else {
                app.requests({
                    url: 'editsupplierfreightdetail',
                    data: {
                        freight_detail_id: t.id,
                        price: fhPrice,
                        after_price: fhAfter,
                        total_price: fhTotal,
                        unit_price: countPinkage
                    },
                    success: function(res) {
                        t.getfreight()
                        t.eeAmend.classList.add('hide')
                    },
                    Error(code) {
                        switch (parseInt(code)) {
                            case 3001:
                                alert('运费模版Id错误')
                                break;
                            case 3002:
                                alert('价格只能是数字')
                                break;
                            case 3003:
                                alert('运费详情不存在')
                                break;
                            default:
                                alert('意料之外的错误')
                                break;
                        }
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
    pz.freight.init()
})(window.pz)