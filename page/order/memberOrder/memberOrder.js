import { app } from '../../../index.js';
import { showToast } from '../../../js/utils.js';

new Vue({
    el: '#app',
    data: {
        modal: false,
        page: 1,
        page_num: 10,
        bank_card: '',
        bank_mobile: '',
        user_name: '',
        message: '',
        has_invoice: '',
        no_invoice: '',
        total: 0,
        memberOrderList: [],
        id: 0
    },
    mounted() {
        let that = this
        that.getMemberOrders()
    },
    methods: {
        cancel() {
            this.modal = false
        },
        search() {
            this.page = 1
            this.getMemberOrders()
        },
        getMemberOrders() {
            let that = this;
            // let status = document.querySelector('#selection1').getAttribute('data-id') || '';
            app.requests({
                url: 'Order/getMemberOrders',
                data: {
                    page: that.page || 1,
                    page_num: that.page_num || 10
                },
                success(res) {
                    that.memberOrderList = that.dismemberOrderList(res.memberOrderList)
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
        dismemberOrderList(data = []) {
            let arr = data,
                len = arr.length
            for (let i = 0; i < len; i++) {
                arr[i].actypeText = this.getActypeText(arr[i].actype)
                arr[i].userTypeText = this.getTypeText(arr[i].user_type)
                arr[i].payTypetext = this.getPayTypeText(arr[i].pay_type)
                arr[i].fromuser.identityText = this.getIdentityText(arr[i].fromuser.user_identity)
            }
            return arr
        },
        getActypeText(n) {
            let text = ''
            switch (parseInt(n)) {
                case 1:
                    text = '无活动'
                    break;
                case 2:
                    text = '兼职网推'
                    break;
                default:
            }
            return text
        },
        getTypeText(n) {
            let text = ''
            switch (parseInt(n)) {
                case 1:
                    text = '钻石会员'
                    break;
                case 2:
                    text = 'boss'
                    break;
                default:
            }
            return text
        },
        getPayTypeText(n) {
            let text = ''
            switch (parseInt(n)) {
                case 1:
                    text = '支付宝'
                    break;
                case 2:
                    text = '微信'
                    break;
                case 3:
                    text = '银联'
                    break;
                default:
            }
            return text
        },
        getIdentityText(n) {
            let text = ''
            switch (parseInt(n)) {
                case 1:
                    text = '普通会员'
                    break;
                case 2:
                    text = '钻石会员'
                    break;
                case 3:
                    text = '创业店主'
                    break;
                case 4:
                    text = 'boss合伙人'
                    break;
                default:
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
                url: 'admin/checkUserTransfer',
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
                    that.getMemberOrders()
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
                    t.getMemberOrders()
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
        type_name: '待发放'
    }, {
        id: 2,
        type_name: '已经发放'
    }, {
        id: 3,
        type_name: '取消发放'
    }]
})