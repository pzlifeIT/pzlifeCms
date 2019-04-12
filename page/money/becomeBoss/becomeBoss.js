import { app } from '../../../index.js';
import { showToast } from '../../../js/utils.js';

new Vue({
    el: '#app',
    data: {
        modal: false,
        modal1: false,
        page: 1,
        page_num: 10,
        refe_uname: '',
        target_uname: '',
        target_nickname: '',
        target_mobile: '',
        target_idcard: '',
        total: 0,
        shopApplyList: []
    },
    mounted() {
        let that = this
        that.getShopApplyList()
    },
    methods: {
        cancel() {
            this.modal = false
        },
        auditShopApply(id, status) {
            let that = this
            app.requests({
                url: 'Rights/auditShopApply',
                data: {
                    id: id,
                    status: status
                },
                success(res) {
                    showToast({
                        type: 'success',
                        text: '操作成功'
                    })
                    that.getShopApplyList()
                },
                Error(code) {
                    let text = ''
                    switch (parseInt(code)) {
                        case 3001:
                            text = 'status必须为数字'
                            break;
                        case 3002:
                            text = 'id为空'
                            break;
                        case 3003:
                            text = '传入status错误'
                            break;
                        case 3004:
                            text = '错误的申请状态'
                            break;
                        case 3005:
                            text = '已审核的无法再次进行相同的审核结果'
                            break;
                        case 3006:
                            text = '审核失败'
                            break;
                        case 3007:
                            text = '没有操作权限'
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
            this.getShopApplyList()
        },
        getShopApplyList() {
            let that = this;
            let target_sex = document.querySelector('#selection1').getAttribute('data-id') || '';
            let status = document.querySelector('#selection2').getAttribute('data-id') || '';
            app.requests({
                url: 'Rights/getShopApplyList',
                data: {
                    page: that.page || 1,
                    page_num: that.page_num || 10,
                    refe_uname: that.refe_uname,
                    target_uname: that.target_uname,
                    target_nickname: that.target_nickname,
                    target_mobile: that.target_mobile,
                    target_idcard: that.target_idcard,
                    status: status,
                    target_sex: target_sex
                },
                success(res) {
                    that.shopApplyList = that.disshopApplyList(res.data)
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
        disshopApplyList(data = []) {
            let arr = data,
                len = arr.length
            for (let i = 0; i < len; i++) {
                arr[i].target_sexText = this.gettarget_sexText(arr[i].target_sex)
                arr[i].statusText = this.getStatus(arr[i].status)
            }
            return arr
        },
        gettarget_sexText(n) {
            let text = ''
            switch (parseInt(n)) {
                case 1:
                    text = '男'
                    break;
                case 2:
                    text = '女'
                    break;
            }
            return text
        },
        getStatus(n) {
            let text = ''
            switch (parseInt(n)) {
                case 1:
                    text = '提交申请中'
                    break;
                case 2:
                    text = '财务审核通过'
                    break;
                case 3:
                    text = '经理审核通过'
                    break;
                case 4:
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
                    that.getShopApplyList()
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
                    t.getShopApplyList()
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
        type_name: '男'
    }, {
        id: 2,
        type_name: '女'
    }]
})
select({
    el: '#combobox4',
    data: [{
        id: '',
        type_name: '全部'
    }, {
        id: 1,
        type_name: '提交申请中'
    }, {
        id: 2,
        type_name: '财务审核通过'
    }, {
        id: 3,
        type_name: '经理审核通过'
    }, {
        id: 4,
        type_name: '审核不通过'
    }]
})