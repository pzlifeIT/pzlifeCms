import { app, requests } from '../../../index.js';;
(function(pz) {
    select({ el: '#combobox1', data: [{ id: 1, type_name: '已上架' }, { id: 2, type_name: '已下架' }, { id: '', type_name: '不限制' }] })
    pz.goods = (function() {
        function _GD(o) {
            this.goodlist = document.querySelector('#goodlist')
            this.page = parseInt(localStorage.getItem("goodList")) || 1
            this.elgoodName = document.querySelector('#goodName')
            this.elsuppliername = document.querySelector('#suppliername')
            this.elsupplier_title = document.querySelector('#supplier_title')
            this.elstatus = document.querySelector('#combobox1').querySelector('.ant-select-selection')
            this.totle = 0
            this.goodName = ''
            this.supplier_name = ''
            this.status = ""
            this.supplier_title = ""
            this.init()
        }
        _GD.prototype = {
            init: function() {
                this.elclick()
                this.getgoodslist({
                    page: this.page
                })
            },
            elclick() {
                let t = this
                document.querySelector('#search').onclick = function(e) {
                    t.goodName = t.elgoodName.value
                    t.supplier_name = t.elsuppliername.value
                    t.supplier_title = t.elsupplier_title.value
                    t.status = t.elstatus.getAttribute('data-id') || ''
                    localStorage.setItem("goodList", 1)
                    t.page = 1
                    t.getgoodslist({
                        page: 1,
                        search: true
                    })
                }
            },
            getgoodslist: function(o) {
                let t = this
                requests({
                    url: 'getgoodslist',
                    data: {
                        page: o.page || 1,
                        pagenum: o.pagenum || 10,
                        goods_name: t.goodName || '',
                        supplier_name: t.supplier_name || '',
                        status: t.status || '',
                        supplier_title: t.supplier_title || ''
                    },
                    success: function(res) {
                        localStorage.setItem("goodList", o.page)
                        t.setGlul(res.data)
                        if (o.search) { t.setpage() }
                        if (t.totle == res.total) return
                        t.totle = res.total
                        t.setpage()
                    },
                    Error(code) {
                        switch (parseInt(code)) {
                            case 3001:
                                alert('page只能为数字')
                                break;
                            case 3002:
                                alert('page_num只能为数字')
                                break;
                            case 3003:
                                alert('goods_id只能为数字')
                                break;
                            case 3004:
                                alert('上下架状态参数有误')
                                break;
                            case 3005:
                                alert('商品属性参数有误')
                                break;
                            default:
                                alert('意料之外的错误')
                                break;

                        }
                    }
                })
            },
            setpage: function() {
                let t = this,
                    totle = Math.ceil(parseInt(t.totle) / 10)
                pages.init({
                    el: '#floorpages',
                    current: this.page,
                    pagenumber: totle,
                    fn: function(n) {
                        if (t.page == n) return
                        t.page = n
                        t.getgoodslist({
                            page: n
                        })
                    }
                })
            },
            setGlul: function(data) {
                if (!data) return
                if (data.length < 1) return
                let len = data.length,
                    i, str = '',
                    checked = ''
                for (i = 0; i < len; i++) {
                    checked = ''
                    if (data[i].status == 1) {
                        checked = 'ant-switch-checked'
                    }
                    str += '<div class="table-tr"><span class="col-md-1 bot-bor subli">' + data[i].id + '</span>'
                    str += '<span class="col-md-1 bot-bor subli"><img class="stImg" src="' + data[i].image + '" /></span>'
                    str += '<span class="col-md-1 bot-bor subli">' + data[i].goods_name + '</span>'
                    str += '<span class="col-md-1 bot-bor subli">' + this.getgoods_type(data[i].goods_type) + '</span>'
                    str += '<span class="col-md-2 bot-bor subli">' + data[i].subtitle + '</span>'
                    str += '<span class="col-md-1 bot-bor subli">' + data[i].supplier + '</span>'
                    str += '<span class="col-md-1 bot-bor subli">' + data[i].supplier_title + '</span>'
                    str += '<span class="col-md-1 bot-bor subli">' + data[i].cate + '</span>'
                    str += '<span class="col-md-1 bot-bor subli"><span class="ant-switch up-down ' + checked + '" data-id="' + data[i].id + '" data-type="' + data[i].status + '" ></span></span>'
                    str += '<span class="col-md-2 bot-bor subli"><a class="pz-btn btn-amend" href="goodsoperation/goodsoperation.html?id=' + data[i].id + '">编辑</a>\
                    <div class="pz-btn btn-del" href="#">删除</div></span>'
                    str += '</div>'
                }
                this.goodlist.innerHTML = str
                this.updowngoods()
            },
            updowngoods: function() { //商品上下架
                let t = this,
                    lis = t.goodlist.querySelectorAll('.up-down')
                lis.forEach(function(li) {
                    li.addEventListener('click', function(e) {
                        let id = li.getAttribute('data-id'),
                            type = li.getAttribute('data-type')
                        if (type == 1) {
                            t.portupdowngoods(id, 2)
                        } else {
                            t.portupdowngoods(id, 1)
                        }
                    })
                })
            },
            portupdowngoods: function(id, type) { //商品上下架接口
                let t = this
                requests({
                    url: 'updowngoods',
                    data: {
                        id: id,
                        type: type
                    },
                    success: function(res) {
                        t.getgoodslist({
                            page: t.page
                        })
                    },
                    Error(code) {
                        switch (parseInt(code)) {
                            case 3001:
                                alert('商品不存在')
                                break;
                            case 3002:
                                alert('参数必须是数字')
                                break;
                            case 3003:
                                alert('没有可售库存')
                                break;
                            case 3004:
                                alert('请填写零售价')
                                break;
                            case 3005:
                                alert('请填写成本价')
                                break;
                            case 3006:
                                alert('没有详情图')
                                break;
                            case 3007:
                                alert('没有轮播图')
                                break;
                            case 3008:
                                alert('上下架失败')
                                break;
                            default:
                                alert('意料之外的错误')
                                break;
                        }
                    }
                })
            },
            getgoods_type: function(n) {
                if (n = 1) {
                    return '实物商品'
                } else if (n = 2) {
                    return '虚拟商品'
                }
            }
        }
        return {
            init: function(o) {
                return new _GD(o)
            }
        }
    })()
    pz.goods.init()
})(window.pz)