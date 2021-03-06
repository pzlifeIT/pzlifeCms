import { app } from '../../../index.js';
import { showToast } from '../../../js/utils.js';

new Vue({
    el: '#app',
    data: {
        modal: false,
        message: '',
        page: 1,
        page_num: 10,
        bank_card: '',
        bank_mobile: '',
        user_name: '',
        total: 0,
        cardList: [],
        nolink: true,
        reject: ['1'],
        backId: 0
    },
    mounted() {
        let that = this
        that.getUserBank()
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
                    that.modal = false
                    that.getUserBank()
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
            this.getUserBank()
        },
        getUserBank() {
            let that = this;
            let status = document.querySelector('#selection1').getAttribute('data-id') || '';
            app.requests({
                url: 'admin/getUserBank',
                data: {
                    page: that.page || 1,
                    page_num: that.page_num || 10,
                    status: status,
                    bank_card: that.bank_card,
                    bank_mobile: that.bank_mobile,
                    user_name: that.user_name
                },
                success(res) {
                    that.cardList = that.discardList(res.userbank)
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
        discardList(data = []) {
            let arr = data,
                len = arr.length
            for (let i = 0; i < len; i++) {
                arr[i].statusText = this.getStatus(arr[i].status)
                arr[i].identity = this.getIdentity(arr[i].users.user_identity)
            }
            return arr
        },
        getIdentity(n) {
            let text = ''
            switch (parseInt(n)) {
                case 1:
                    text = '普通会员'
                    break;
                case 2:
                    text = '钻石会员'
                    break;
                case 4:
                    text = '合伙人'
                    break;
            }
            return text
        },
        getStatus(n) {
            let text = ''
            switch (parseInt(n)) {
                case 1:
                    text = '待处理'
                    break;
                case 2:
                    text = '启用(审核通过)'
                    break;
                case 3:
                    text = '停用'
                    break;
                case 4:
                    text = '已处理'
                    break;
                case 5:
                    text = '审核不通过'
                    break;
            }
            return text
        },
        submit() {
            let that = this;
            if (!that.nolink) return
            if (that.message == '') {
                showToast({
                    text: '详细描述不能为空'
                })
                return
            }
            let len = that.reject.length,
                fields = '';
            for (let i = 0; i < len; i++) {
                if (document.querySelector('#selectionfor' + i)) {
                    let msg = document.querySelector('#selectionfor' + i).getAttribute('data-id') || '';
                    console.log(document.querySelector('#selectionfor' + i))
                    console.log(msg, '#selectionfor' + i)
                    if (msg == '') {
                        showToast({
                            text: '请选择驳回选项'
                        })
                        return
                    }
                    fields += msg + ','
                }
            }
            fields = fields.replace(/,$/gi, "");
            that.nolink = false
            that.checkUserBank(that.backId, 5, {
                message: that.message,
                error_fields: fields
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
                    t.getUserBank()
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
        type_name: '待处理'
    }, {
        id: 2,
        type_name: '启用(审核通过)'
    }, {
        id: 3,
        type_name: '停用'
    }, {
        id: 4,
        type_name: '已处理'
    }, {
        id: 5,
        type_name: '审核不通过'
    }]
})