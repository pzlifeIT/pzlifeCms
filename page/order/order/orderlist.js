;
(function(pz) {
    pz.order = (function() {
        function _OL(o) {
            this.orderlist = document.querySelector('#orderlist')
            this.page = 1
            this.totle = 0
            this.init()
        }
        _OL.prototype = {
            init: function() {
                this.getorderlist({})
            },
            getorderlist: function(o) {
                let t = this
                quest.requests({
                    url: 'getOrders',
                    data: {
                        page: o.page || 1,
                        pagenum: o.pagenum || 10
                    },
                    success: function(res) {
                        t.setList(res.order_list)
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
                    pagenumber: totle,
                    fn: function(n) {
                        t.page = n
                        console.log(n)
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
                    str += '<span class=" col-md-2 bot-bor subli">' + data[i].order_status_text + '</span>'
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


})(window.pz)