import { app } from '../../../../index.js';
import { showToast } from '../../../../js/utils.js';
(function(pz) {
    tab({
        head: '#dlnav',
        con: '.dlnav-con',
        num: 1
    })
    pz.orderdetail = (function() {
        function _OD(o) {
            this.id = pz.geturl().id || ''
            this.orderlist = document.querySelector('#orderlist')
            this.ExpressList = [
                { id: 'shunfeng', type_name: '顺丰速运' },
                { id: 'zhongtong', type_name: '中通快递' },
                { id: 'shentong', type_name: '申通快递' },
                { id: 'yunda', type_name: '韵达快递' },
                { id: 'tiantian', type_name: '天天快递' },
                { id: 'huitongkuaidi', type_name: '百世快递' },
                { id: 'ems', type_name: 'EMS' },
                { id: 'youshuwuliu', type_name: '优速物流' },
                { id: 'kuayue', type_name: '跨越速运' },
                { id: 'debangwuliu', type_name: '德邦物流' },
                { id: 'yuantong', type_name: '圆通速递' },
                { id: 'zhaijibian', type_name: '黑猫宅急便(宅急便)' },
                { id: 'ane66', type_name: '安能快递' },
                { id: 'youzhengguonei', type_name: '中国邮政' },
                { id: 'rufengda', type_name: '如风达' },
                { id: 'wanxiangwuliu', type_name: '万象物流' },
                { id: 'SJPS', type_name: '商家派送' }
            ]
            this.init()
        }
        _OD.prototype = {
            init: function() {
                this.getorderdetail()
            },
            getorderdetail: function() {
                let t = this
                app.requests({
                    url: 'Order/getOrderInfo',
                    data: {
                        id: t.id
                    },
                    success: function(res) {
                        t.disdetail(res)
                    },
                    Error(code) {
                        let text = ''
                        switch (parseInt(code)) {
                            case 3002:
                                text = '订单ID只能是数字'
                                break;
                            default:
                                text = '意料之外的错误'
                                break;
                        }
                        showToast({
                            text: '操作失败'
                        })
                    }
                })
            },
            disdetail: function(data) {
                this.setbasic(data.order_info)
                this.setgoodlist(data.order_pack)
                this.setlogistics(data.order_child, data.has_deliver_goods)
                this.setnogoodsnum(data.no_deliver_goods_num)
            },
            setnogoodsnum: function(n) {
                document.querySelector('#no_deliver_goods_num').innerHTML = n
            },
            setlogistics: function(data, goods) {
                let len = data.length,
                    len2 = goods.length,
                    i, x, y, len1, str = '',
                    t, deliver;
                for (i = 0; i < len; i++) {
                    len1 = data[i].order_goods.length
                    for (x = 0; x < len1; x++) {
                        t = false;
                        deliver = {
                            express_name: '请选择',
                            express_no: ''
                        }
                        for (y = 0; y < len2; y++) {
                            if (data[i].order_goods[x].id == goods[y].goods.id) {
                                t = true
                                deliver = goods[y].goods.express
                                deliver.css = 'already-select'
                                continue;
                            }
                        }
                        str += '<div class="logistics-sub din fl" id="logistics' + data[i].order_goods[x].id + '">'
                        str += '<div class="ls-li">\
                            <span class="ls-li-name">商品名称：</span>\
                            <span class="name-text" data-id="' + data[i].order_goods[x].id + '">' + data[i].order_goods[x].id + '-' + data[i].order_goods[x].goods_name + '</span></div>'
                        str += '<div class="ls-li"><span class="ls-li-name">快递公司：</span><div class="combobox din" id="combobox' + data[i].order_goods[x].id + '"><div class="ant-select"><div class="ant-select-selection ' + deliver.css + '" data-id="' + deliver.express_key + '">' + deliver.express_name + '</div><span class="ant-select-arrow"></span></div></div></div>'
                        str += '<div class="ls-li">\
                        <span class="ls-li-name">快递单号：</span>\
                        <input class="ls-odd" type="text" value="' + deliver.express_no + '" placeholder="快递单号"></div>'
                        str += '<input type="button" class="pz-btn btn-amend ls-btn fl" value="发货" data-id="logistics' + data[i].order_goods[x].id + '" data-t="' + t + '" >'
                            // str += '<input type="button" class="pz-btn btn-amend ls-amend fl" value="修改" data-t="' + t + '" data-id="logistics' + data[i].order_goods[x].id + '"></div>'
                        str += '</div>'
                    }
                }
                document.querySelector('#logistics').innerHTML = str
                this.logisticscompany(data)
                this.shipmentsbtn()
                    // this.amend()
            },
            shipmentsbtn: function() {
                let that = this,
                    lsbtn = document.querySelectorAll('.ls-btn')
                lsbtn.forEach(function(ls) {
                    ls.addEventListener('click', function(e) {
                        let id = ls.getAttribute('data-id'),
                            tr = document.querySelector('#' + id)
                        let goods_id = tr.querySelector('.name-text').getAttribute('data-id'),
                            express_key = tr.querySelector('.ant-select-selection').getAttribute('data-id'),
                            express_no = tr.querySelector('.ls-odd').value
                        let orderjson = {
                            order_goods_id: goods_id,
                            express_no: express_no,
                            express_key: express_key,
                            id: id
                        }
                        if (ls.getAttribute('data-t') == 'true') {
                            that.updateDeliverOrderGoods(orderjson)
                        } else {
                            that.deliverOrderGoods(orderjson)
                        }

                    })
                })
            },
            updateDeliverOrderGoods: function(data) {
                let that = this
                app.requests({
                    url: 'Order/updateDeliverOrderGoods',
                    data: {
                        order_goods_id: data.order_goods_id,
                        express_no: data.express_no,
                        express_key: data.express_key
                    },
                    success: function(res) {
                        showToast({
                            type: 'success',
                            text: '操作成功'
                        })
                    },
                    Error(code) {
                        let text = ''
                        switch (parseInt(code)) {
                            case 3005:
                                text = '商品已发货'
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
            deliverOrderGoods: function(data) {
                let that = this
                app.requests({
                    url: 'Order/deliverOrderGoods',
                    data: {
                        order_goods_id: data.order_goods_id,
                        express_no: data.express_no,
                        express_key: data.express_key
                    },
                    success: function(res) {
                        showToast({
                            type: 'success',
                            text: '发货成功'
                        })
                        document.querySelector('#' + data.id + '').querySelector('.btn-amend').setAttribute('data-t', 'true')
                        that.setnogoodsnum(res.no_deliver_goods.length)
                    },
                    Error(code) {
                        let text = ''
                        switch (parseInt(code)) {
                            case 3005:
                                text = '商品已发货'
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
            logisticscompany: function(data) {
                let len = data.length,
                    i, x, len1, str = '';
                for (i = 0; i < len; i++) {
                    len1 = data[i].order_goods.length
                    for (x = 0; x < len1; x++) {
                        select({
                            el: '#combobox' + data[i].order_goods[x].id,
                            data: this.ExpressList
                        })
                    }
                }
            },
            setgoodlist: function(data) {
                let len = data.length,
                    i, x, len1, str = '';
                for (i = 0; i < len; i++) {
                    len1 = data[i].order_goods.length
                    for (x = 0; x < len1; x++) {
                        str += '<div class="table-tr">'
                        str += '<span class="col-md-2 bot-bor subli">' + data[i].order_goods[x].goods_name + '</span>'
                        str += '<span class="col-md-2 bot-bor subli">' + data[i].order_goods[x].sku_json + '</span>'
                        str += '<span class="col-md-2 bot-bor subli">' + data[i].order_goods[x].goods_price + '</span>'
                        str += '<span class="col-md-2 bot-bor subli">' + data[i].order_goods[x].goods_num + '</span>'
                        str += '<span class="col-md-2 bot-bor subli">' + data[i].order_goods[x].integral + '</span>'
                        str += '<span class="col-md-2 bot-bor subli">' + data[i].order_goods[x].margin_price + '</span>'
                        str += '</div>'
                    }
                }
                document.querySelector('#goodlist').innerHTML = str
            },
            setbasic: function(data) {
                document.querySelector('#order_no').innerHTML = data.order_no
                document.querySelector('#create_time').innerHTML = data.create_time
                document.querySelector('#order_money').innerHTML = data.order_money
                document.querySelector('#deduction_money').innerHTML = data.deduction_money
                document.querySelector('#pay_money').innerHTML = data.pay_money
                document.querySelector('#goods_money').innerHTML = data.goods_money
                document.querySelector('#discount_money').innerHTML = data.discount_money
                document.querySelector('#express_money').innerHTML = data.express_money
                document.querySelector('#pay_type').innerHTML = this.getpaytype(data.pay_type)
                document.querySelector('#third_money').innerHTML = data.third_money
                document.querySelector('#third_pay_type').innerHTML = this.getthirdpaytype(data.third_pay_type)
                document.querySelector('#order_status').innerHTML = this.getStatusText(data.order_status)
                document.querySelector('#linkman').innerHTML = data.linkman
                document.querySelector('#linkphone').innerHTML = data.linkphone
                document.querySelector('#address').innerHTML = data.province_name + ' ' + data.city_name + ' ' + data.area_name + ' ' + data.address
                document.querySelector('#message').innerHTML = data.message
            },
            getpaytype: function(n) {
                let str = ''
                switch (parseInt(n)) {
                    case 1:
                        str = '第三方支付'
                        break;
                    case 2:
                        str = '商票'
                        break;
                    default:
                        str = '意料之外的状态'
                        break;
                }
                return str
            },
            getthirdpaytype: function(n) {
                let str = ''
                switch (parseInt(n)) {
                    case 1:
                        str = '支付宝'
                        break;
                    case 2:
                        str = '微信'
                        break;
                    case 2:
                        str = '银联'
                        break;
                    default:
                        str = '意料之外的状态'
                        break;
                }
                return str
            },
            getStatusText: function(n) {
                let str = ''
                switch (parseInt(n)) {
                    case 1:
                        str = '待付款'
                        break;
                    case 2:
                        str = '订单已取消'
                        break;
                    case 3:
                        str = '订单已关闭'
                        break;
                    case 4:
                        str = '已付款'
                        break;
                    case 5:
                        str = '已发货'
                        break;
                    case 6:
                        str = '已收货'
                        break;
                    case 7:
                        str = '待评价'
                        break;
                    case 8:
                        str = '退款申请确认'
                        break;
                    case 9:
                        str = '退款中'
                        break;
                    case 10:
                        str = '退款成功'
                        break;
                    default:
                        str = '意料之外的状态'
                        break;
                }
                return str
            }
        }
        return {
            init: function(o) {
                return new _OD(o)
            }
        }
    })()
    pz.orderdetail.init()
})(window.pz)