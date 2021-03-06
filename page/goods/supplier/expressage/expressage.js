import { app } from '../../../../index.js';
import { showToast, geturl } from '../../../../js/utils.js';
(function(pz) {
    select({
        el: '#EEcombobox',
        data: [{
            id: 1,
            type_name: '件数'
        }, {
            id: 2,
            type_name: '重量'
        }, {
            id: 3,
            type_name: '体积'
        }]
    })
    pz.expressage = (function() {
        function _EE(o) {
            this.supplierId = geturl().id
            this.id = ''
            this.addfreight = document.querySelector('.addfreight')
            this.eeCancel = document.querySelector('#eeCancel')
            this.eeSave = document.querySelector('#eeSave')
            this.eeAmend = document.querySelector('#eeAmend')
            this.EEcombobox = document.querySelector('#EEcombobox')
            this.eelist = document.querySelector('#eelist')
            this.init()
        }
        _EE.prototype.init = function() {
            this.getfreight()
            this.elClick()
            this.addEE()
        }
        _EE.prototype.elClick = function() {
            let t = this
            t.eeCancel.addEventListener('click', function(e) {
                t.eeAmend.classList.add('hide')
            })
            t.eeSave.addEventListener('click', function(e) {
                t.saveEE()
            })
        }
        _EE.prototype.getfreight = function() { //获取供应商快递模板
            let t = this
            app.requests({
                url: 'suppliers/getsupplierfreights',
                data: {
                    supplierId: t.supplierId
                },
                success: function(res) {
                    t.setGlul(res.data || [])
                },
                Error(code) {
                    showToast({
                        text: '获取失败'
                    })
                }
            })
        }
        _EE.prototype.setGlul = function(data = []) { //循环出供应商列表
            let len = data.length,
                i,
                str = '';
            if (len == 0) return
            for (i = 0; i < len; i++) {
                str += '<div class="table-tr"> \
              <div class = "col-md-2 bot-bor subli" ><span>' + data[i].id + '</span> </div> \
              <div class = "col-md-2 bot-bor subli" ><span>' + pz.getPriceType(data[i].stype) + ' </span></div> \
              <div class = "col-md-2 bot-bor subli" ><span>' + data[i].title + '</span></div> \
              <div class = "col-md-3 bot-bor subli desc" ><span>' + data[i].desc + '</span></div> \
              <div class = "col-md-3 bot-bor subli" >\
              <a class="pz-btn btn-amend" href="../freight/freight.html?id=' + data[i].id + '&mode=' + data[i].stype + '">运费模板</a>\
                  <div class = "pz-btn btn-amend redact" data-id="' + data[i].id + '" > 编辑 </div> \
              </div>'
                str += '</div>'
            }
            this.eelist.innerHTML = str
            this.del()
            this.amend()
        }
        _EE.prototype.del = function() { //删除
            let dellist = this.eelist.querySelectorAll('.btn-del')
            dellist.forEach(li => {
                li.addEventListener('click', function(e) {
                    let id = li.getAttribute('data-id')

                })
            });
        }
        _EE.prototype.amend = function() { //修改
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
        _EE.prototype.getSupplierFreight = function() {
            let t = this
            app.requests({
                url: 'suppliers/getSupplierFreight',
                data: {
                    supplierFreightId: t.id
                },
                success: function(res) {
                    t.setData(res.data)
                    t.eeAmend.classList.remove('hide')
                },
                Error(code) {
                    showToast({
                        text: '获取供应商快递模板列表失败'
                    })
                }
            })
        }
        _EE.prototype.addEE = function() { //添加
            let t = this;
            t.addfreight.addEventListener('click', function(e) {
                t.setData()
                t.eeAmend.classList.remove('hide')
            })
        }
        _EE.prototype.setData = function(data) {
            let t = this,
                eeType = t.EEcombobox.querySelector('.ant-select-selection'),
                eeTitle = document.querySelector('#eeTitle'),
                eeDesc = document.querySelector('#eeDesc');
            if (data) {
                t.id = data.id
                eeType.classList.add('already-select')
                eeType.setAttribute('data-id', data.stype)
                let type = t.getPriceType(data.stype)
                eeType.setAttribute('data-value', type)
                eeType.innerHTML = type
                eeTitle.value = data.title
                eeDesc.value = data.desc
            } else {
                t.id = ''
                eeType.classList.remove('already-select')
                eeType.setAttribute('data-id', '')
                eeType.setAttribute('data-value', '')
                eeType.innerHTML = '请选择'
                eeTitle.value = ''
                eeDesc.value = ''
            }
        }
        _EE.prototype.getPriceType = function(n) {
            let data = {
                '1': '件数',
                '2': '重量',
                '3': '体积'
            }
            return data[n]
        }
        _EE.prototype.saveEE = function() {
            let t = this,
                eeType = t.EEcombobox.querySelector('.ant-select-selection').getAttribute('data-id') || '',
                eeTitle = document.querySelector('#eeTitle').value,
                eeDesc = document.querySelector('#eeDesc').value;
            if (eeType == '') {
                showToast({
                    text: '请选择计价方式'
                })
                return
            }
            if (eeTitle == '') {
                showToast({
                    text: '标题不能为空'
                })
                return
            }
            if (t.id == '') {
                app.requests({
                    url: 'suppliers/addsupplierfreight',
                    data: {
                        supplierId: t.supplierId,
                        stype: eeType,
                        title: eeTitle,
                        desc: eeDesc
                    },
                    success: function(res) {
                        showToast({
                            type: 'success',
                            text: '操作成功'
                        })
                        t.getfreight()
                        t.eeAmend.classList.add('hide')
                    },
                    Error(code) {
                        let text = ''
                        switch (parseInt(code)) {
                            case 3001:
                                text = '供应商id必须是数字'
                                break;
                            case 3002:
                                text = '供应商ID只能是数字'
                                break;
                            case 3003:
                                text = '标题和详情不能为空'
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
            } else {
                app.requests({
                    url: 'suppliers/updateSupplierFreight',
                    data: {
                        supplier_freight_Id: t.id,
                        stype: eeType,
                        title: eeTitle,
                        desc: eeDesc
                    },
                    success: function(res) {
                        showToast({
                            type: 'success',
                            text: '操作成功'
                        })
                        t.getfreight()
                        t.eeAmend.classList.add('hide')
                    },
                    Error(code) {
                        let text = ''
                        switch (parseInt(code)) {
                            case 3001:
                                text = '供应商模版id必须是数字'
                                break;
                            case 3002:
                                text = '计价方式选择有误'
                                break;
                            case 3003:
                                text = '标题和详情不能为空'
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



        }
        return {
            init: function(obj) {
                new _EE(obj);
            }
        }
    })()
    pz.expressage.init()
})(window.pz)