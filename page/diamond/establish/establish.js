import { app } from '../../../index.js';
import { showToast } from '../../../js/utils.js';
(function(pz) {
    tab({ head: '#dlnav', con: '.dlnav-con', num: 1 });
    select({ el: '#redmoneyStatus', data: [{ id: 1, type_name: '直接领取' }, { id: 2, type_name: '分享激活后获得' }] });
    select({ el: '#type', data: [{ id: 1, type_name: '分享使用' }, { id: 2, type_name: '绑定二维码链接' }] });
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
                if (mobileText == '') {
                    showToast({
                        text: '会员手机号不能为空'
                    })
                    return
                }
                if (linkmanText == '') {
                    showToast({
                        text: '会员姓名不能为空'
                    })
                    return
                }
                if (stockText == '') {
                    showToast({
                        text: '库存不能为空'
                    })
                    return
                }
                if (couponMoneyText == '') {
                    showToast({
                        text: '被分享用户将获得活动商票不能为空'
                    })
                    return
                }
                if (redmoneyStatus == '' || redmoneyStatus == null) {
                    showToast({
                        text: '请选择商票状态'
                    })
                    return
                }
                if (typeText == '' || redmoneyStatus == null) {
                    showToast({
                        text: '请选择使用类型'
                    })
                    return
                }
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
                app.requests({
                    url: 'Rights/creatBossShareDiamondvip',
                    data: {
                        mobile: data.mobile,
                        linkman: data.linkman,
                        stock: data.stock,
                        coupon_money: data.coupon_money,
                        redmoney_status: data.redmoney_status,
                        type: data.type
                    },
                    success: function(res) {
                        window.location.href = '../acquire/acquire.html'
                    },
                    complete() {
                        t.proceed = true
                    },
                    Error: function(code) {
                        let text = ''
                        switch (parseInt(code)) {
                            case 3001:
                                text = '手机号格式错误'
                                break;
                            case 3002:
                                text = '库存或者被分享用户将获得活动商票必须是数字'
                                break;
                            case 3003:
                                text = '该用户不存在'
                                break;
                            case 3005:
                                text = '超出金额设置范围'
                                break;
                            default:
                                text = '意料之外的错误'
                        }
                        showToast({
                            text: text
                        })
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