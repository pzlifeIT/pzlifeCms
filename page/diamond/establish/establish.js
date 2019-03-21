import { requests } from '../../../js/ajax.js';;
(function(pz) {
    pz.establish = (function() {
        function _EH(o) {
            this.mobile = document.querySelector('#mobile')
            this.linkman = document.querySelector('#linkman')
            this.stock = document.querySelector('#stock')
            this.couponMoney = document.querySelector('#couponMoney')
            this.redmoneyStatus = document.querySelector('#redmoneyStatus')
            this.type = document.querySelector('#type')
            this.proceed = true
            this.init()
        }
        _EH.prototype = {
            init: function() { //进入执行
                this.elclick()
                    // this.getBossShareDiamondvip({})
            },
            elclick: function() {
                let t = this
                document.querySelector('#saveNew').onclick = function() {
                    t.getdata()
                }
            },
            getdata: function() {
                let t = this
                if (!t.proceed) return
                let mobileText = t.mobile.value,
                    linkmanText = t.linkman.value,
                    stockText = t.stock.value,
                    couponMoneyText = t.couponMoney.value,
                    redmoneyStatusText = t.redmoneyStatus.querySelector('.ant-select-selection').getAttribute('data-id'),
                    typeText = t.type.querySelector('.ant-select-selection').getAttribute('data-id')
                if (mobileText == '') return
                if (linkmanText == '') return
                if (stockText == '') return
                if (couponMoneyText == '') return
                if (redmoneyStatus == '' || redmoneyStatus == null) return
                if (typeText == '' || redmoneyStatus == null) return
                t.creatBossShareDiamondvip({
                    mobile: mobileText,
                    linkman: linkmanText,
                    stock: stockText,
                    coupon_money: couponMoneyText,
                    redmoney_status: redmoneyStatusText,
                    type: typeText
                })
            },
            creatBossShareDiamondvip: function(data) {
                let t = this
                t.proceed = false
                requests({
                    url: 'creatBossShareDiamondvip',
                    data: {
                        mobile: data.mobile,
                        linkman: data.linkman,
                        stock: data.stock,
                        coupon_money: data.coupon_money,
                        redmoney_status: data.redmoney_status,
                        type: data.type
                    },
                    success: function(res) {
                        t.proceed = true
                        window.location.href = '../acquire/acquire.html'
                    },
                    error: function(code) {

                    }
                })
            }
        }
        return {
            init: function(o) {
                return new _EH(o)
            }
        }
    })()
    pz.establish.init()
})(window.pz)