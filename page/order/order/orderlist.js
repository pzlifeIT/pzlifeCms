import { app } from '../../../index.js';;
console.log('运行了');
(function(pz) {
    select({
        el: '#order_status',
        data: [{
            id: 1,
            type_name: '待付款'
        }, {
            id: 2,
            type_name: '取消订单'
        }, {
            id: 3,
            type_name: '订单已关闭'
        }, {
            id: 4,
            type_name: '订单已付款'
        }, {
            id: 5,
            type_name: '订单已发货'
        }, {
            id: 6,
            type_name: '订单已收货'
        }, {
            id: 7,
            type_name: '待评价'
        }, {
            id: 8,
            type_name: '退款申请确认'
        }, {
            id: 9,
            type_name: '订单退款中'
        }, {
            id: 10,
            type_name: '退款成功'
        }]
    })
    pz.order = (function() {
        function _OL(o) {
            this.orderlist = document.querySelector('#orderlist')
            this.elorder_status = document.querySelector('#order_status').querySelector('.ant-select-selection')
            this.order_status = ''
            this.page = parseInt(localStorage.getItem("orderList")) || 1
            this.totle = 0
            this.orderArr = []
            this.init()
        }
        _OL.prototype = {
            init: function() {
                this.elclick()
                this.getorderlist({
                    page: this.page
                })
            },
            elclick() {
                let t = this
                document.querySelector('#ordersearch').onclick = function(e) {
                    t.order_status = t.elorder_status.getAttribute('data-id') || ''
                    localStorage.setItem("orderList", 1)
                    t.page = 1
                    t.getorderlist({
                        page: 1,
                        search: true
                    })
                }
            },
            getorderlist: function(o) {
                let t = this
                app.requests({
                    url: 'getOrders',
                    data: {
                        page: o.page || 1,
                        pagenum: o.pagenum || 10,
                        order_status: t.order_status || ''
                    },
                    success: function(res) {
                        localStorage.setItem("orderList", o.page)
                        t.orderArr = res.order_list
                        t.setList(res.order_list || [])
                        if (o.search) { t.setpage() }
                        if (t.totle == res.totle) return
                        t.totle = res.totle
                        t.setpage()
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
            },
            setpage: function() {
                let t = this,
                    totle = Math.ceil(parseInt(t.totle) / 10)
                pages.init({
                    el: '#floorpages',
                    current: t.page,
                    pagenumber: totle,
                    fn: function(n) {
                        if (t.page == n) return
                        t.page = n
                        t.getorderlist({
                            page: n
                        })
                    }
                })
            },
            setList: function(data) {
                let len = data.length,
                    i, str = '';
                for (i = 0; i < len; i++) {
                    data[i].order_status_text = this.getStatusText(data[i].order_status)
                    str += '<div class="table-tr">'
                    str += '<span class=" col-md-2 bot-bor subli">' + data[i].order_no + '</span>'
                    str += '<span class=" col-md-1 bot-bor subli">' + data[i].nick_name + '</span>'
                    str += '<span class=" col-md-1 bot-bor subli">' + data[i].order_money + '</span>'
                    str += '<span class=" col-md-1 bot-bor subli">' + data[i].deduction_money + '</span>'
                    str += '<span class=" col-md-1 bot-bor subli">' + data[i].pay_money + '</span>'
                    str += '<span class=" col-md-1 bot-bor subli">' + data[i].goods_money + '</span>'
                    str += '<span class=" col-md-1 bot-bor subli">' + data[i].discount_money + '</span>'
                    str += '<span class=" col-md-1 bot-bor subli">' + data[i].third_money + '</span>'
                    str += '<span class=" col-md-1 bot-bor subli">' + data[i].order_status_text + '</span>'
                    str += '<span class=" col-md-2 bot-bor subli"><a class="pz-btn btn-amend" href="orderdetails/orderdetails.html?id=' + data[i].id + '">查看</a>\</span>'
                    str += '</div>'
                }
                this.orderlist.innerHTML = str
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
                return new _OL(o)
            }
        }
    })()
    pz.order.init()

})(window.pz)