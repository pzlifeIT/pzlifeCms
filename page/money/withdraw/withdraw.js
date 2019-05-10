import { app } from '../../../index.js';
import { showToast } from '../../../js/utils.js';

new Vue({
    el: '#app',
    data: {
        modal: false,
        modal1: false,
        page: 1,
        page_num: 10,
        bank_card: '',
        bank_mobile: '',
        user_name: '',
        message: '',
        has_invoice: '',
        no_invoice: '',
        total: 0,
        log_transfer: [],
        id: 0
    },
    mounted() {
        let that = this
        that.getLogTransfer()
        let y = setInterval(function() {
            if (document.querySelector('#reject0')) {
                that.setselect()
                clearInterval(y)
            }
        }, 100)
    },
    methods: {
        addreject(k) {
            let that = this
            if (k == 3) {
                showToast({
                    type: 'warn',
                    text: '最多添加四项'
                })
                return
            }
            this.reject.push('1')
            let n = parseInt(k) + 1
            let t = setInterval(function() {
                if (document.querySelector('#reject' + n)) {
                    that.setselect(n)
                    clearInterval(t)
                }
            }, 100)
        },
        setselect(k = 0) {
            select({
                el: '#reject' + k,
                data: [{
                    id: 'bank_mobile',
                    type_name: '手机号码'
                }, {
                    id: 'user_name',
                    type_name: '真实姓名'
                }, {
                    id: 'bank_card',
                    type_name: '银行卡号'
                }, {
                    id: 'bank_add',
                    type_name: '开户支行'
                }]
            })
        },
        cancel() {
            this.modal = false
        },
        cancel1() {
            this.modal1 = false
            this.has_invoice = ''
            this.no_invoice = ''
        },
        showRation() {
            let that = this
            app.requests({
                url: 'admin/getInvoice',
                success(res) {
                    if (res.invoice) {
                        that.has_invoice = res.invoice.has_invoice
                        that.no_invoice = res.invoice.no_invoice
                    }
                    that.modal1 = true
                },
                Error(code) {
                    showToast({
                        text: '获取失败'
                    })
                }
            })
        },
        disposecard(id, status) {
            let that = this
            switch (parseInt(status)) {
                case 4:
                    that.checkUserBank(id, 4)
                    break;
                case 2:
                    that.checkUserBank(id, 2)
                    break;
                case 5:
                    that.reject = ['1']
                    that.backId = id
                    that.modal = true
                    break;
            }
        },
        checkUserBank(id, status, msg = {}) {
            let that = this
            app.requests({
                url: 'admin/checkUserBank',
                data: {
                    id: id,
                    status: status,
                    message: msg.message || '',
                    error_fields: msg.error_fields || ''
                },
                success(res) {
                    showToast({
                        type: 'success',
                        text: '操作成功'
                    })
                    that.nolink = true
                    that.getLogTransfer()
                },
                Error(code) {
                    let text = ''
                    switch (parseInt(code)) {
                        case 3001:
                            text = 'status必须为数字'
                            break;
                        case 3002:
                            text = '错误的statu'
                            break;
                        case 3003:
                            text = 'id不能为空'
                            break;
                        case 3004:
                            text = 'message不能为空'
                            break;
                        case 3005:
                            text = '错误的请求驳回选项'
                            break;
                        case 3006:
                            text = '已审核的银行卡或者用户停用的银行卡无法再次审核'
                            break;
                        default:
                            text = '意料之外的错误'
                    }
                    showToast({
                        type: 'error',
                        text: text
                    })
                }
            })
        },
        search() {
            this.page = 1
            this.getLogTransfer()
        },
        getLogTransfer() {
            let that = this;
            let invoice = document.querySelector('#selection1').getAttribute('data-id') || '';
            app.requests({
                url: 'admin/getLogTransfer',
                data: {
                    page: that.page || 1,
                    page_num: that.page_num || 10,
                    stype: 2,
                    invoice: invoice || '',
                    bank_card: that.bank_card,
                    bank_mobile: that.bank_mobile,
                    user_name: that.user_name
                },
                success(res) {
                    that.log_transfer = that.dislog_transfer(res.log_transfer)
                    if (that.total == res.total) return
                    that.total = res.total
                    that.setpage()
                },
                Error(code) {
                    let text = ''
                    switch (parseInt(code)) {
                        case 3001:
                            text = '状态必须为数字'
                            break;
                        case 3002:
                            text = '错误的审核类型'
                            break;
                        case 3003:
                            text = '银行卡号输入错误'
                            break;
                        default:
                            text = '意料之外的错误'
                    }
                    showToast({
                        type: 'error',
                        text: text
                    })
                }
            })
        },
        dislog_transfer(data = []) {
            let arr = data,
                len = arr.length
            for (let i = 0; i < len; i++) {
                arr[i].invoiceText = this.getInvoice(arr[i].invoice)
                arr[i].statusText = this.getStatus(arr[i].status)
            }
            return arr
        },
        getInvoice(n) {
            let text = ''
            switch (parseInt(n)) {
                case 1:
                    text = '是'
                    break;
                case 2:
                    text = '否'
                    break;
            }
            return text
        },
        getStatus(n) {
            let text = ''
            switch (parseInt(n)) {
                case 1:
                    text = '待审核'
                    break;
                case 2:
                    text = '审核通过'
                    break;
                case 3:
                    text = '审核不通过'
                    break;
            }
            return text
        },
        subRation() {
            let that = this
            app.requests({
                url: 'admin/editInvoice',
                data: {
                    has_invoice: that.has_invoice,
                    no_invoice: that.no_invoice
                },
                success(res) {
                    showToast({
                        type: 'success',
                        text: '保存成功'
                    })
                    that.no_invoice = ''
                    that.has_invoice = ''
                    that.modal1 = false
                },
                Error(code) {
                    let text = ''
                    switch (parseInt(code)) {
                        case 3001:
                            text = '扣除比例必须为数字'
                            break;
                        case 3002:
                            text = '比率不能超过100'
                            break;
                        default:
                            text = '意料之外的错误'
                    }
                    showToast({
                        text: text
                    })
                }
            })
        },
        submit() {
            this.checkUserTransfer(this.id, 3, this.message)
        },
        showmodal(id) {
            this.id = id
            this.message = ''
            this.modal = true
        },
        checkUserTransfer(id, status, msg = '') {
            let that = this
            app.requests({
                url: 'admin/checkUserCommissionTransfer',
                data: {
                    id: id,
                    status: status,
                    message: msg
                },
                success(res) {
                    showToast({
                        type: 'success',
                        text: '操作成功'
                    })
                    that.modal = false
                    that.getLogTransfer()
                },
                Error(code) {
                    let text = ''
                    switch (parseInt(code)) {
                        case 3001:
                            text = '状态必须为数字'
                            break;
                        case 3002:
                            text = '错误的status'
                            break;
                        case 3003:
                            text = 'id不能为空'
                            break;
                        case 3004:
                            text = '已审核的提现记录无法再次审核'
                            break;
                        case 3006:
                            text = '已审核的银行卡或者用户停用的银行卡无法再次审核'
                            break;
                        case 3007:
                            text = '审核失败'
                            break;
                        default:
                            text = '意料之外的错误'
                    }
                    showToast({
                        type: 'error',
                        text: text
                    })
                }
            })
        },
        setpage: function() {
            let t = this,
                total = Math.ceil(parseInt(t.total) / 10)
            pages.init({
                el: '#floorpages',
                pagenumber: total,
                fn: function(n) {
                    if (t.page == n) return
                    t.page = n
                    t.getLogTransfer()
                }
            })
        },
    }
})

select({
    el: '#combobox3',
    data: [{
        id: '',
        type_name: '全部'
    }, {
        id: 1,
        type_name: '提供'
    }, {
        id: 2,
        type_name: '不提供'
    }]
})