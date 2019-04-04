import { app } from '../../../index.js';
import { showToast } from '../../../js/utils.js';

new Vue({
    el: '#app',
    data: {
        modal: false,
        message: '',
        pwd: '',
        page: 1,
        page_num: 10,
        total: 0,
        AdminRemittance: [],
        nolink: true,
        reject: [{ id: '1' }]
    },
    mounted() {
        this.getAdminRemittance()
        let that = this
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
            if (k == 4) {
                showToast({
                    type: 'warn',
                    text: '最多添加五项'
                })
                return
            }
            this.reject.push({ id: '2' })
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
                    id: 1,
                    type_name: '手机号码'
                }, {
                    id: 2,
                    type_name: '真实姓名'
                }, {
                    id: 3,
                    type_name: '开户银行'
                }, {
                    id: 4,
                    type_name: '银行卡号'
                }, {
                    id: 5,
                    type_name: '开户支行'
                }]
            })
        },
        addMoney() {
            this.modal = true
        },
        cancel() {
            this.modal = false
        },
        auditAdminRemittance(id, status) {
            let that = this
            app.requests({
                url: 'admin/auditAdminRemittance',
                data: {
                    id: id,
                    status: status
                },
                success(res) {
                    showToast({
                        type: 'success',
                        text: '操作成功'
                    })
                    that.getAdminRemittance()
                },
                Error(code) {
                    let text = ''
                    switch (parseInt(code)) {
                        case 3001:
                            text = 'status必须为数字'
                            break;
                        case 3002:
                            text = '没有权限审核'
                            break;
                        case 3003:
                            text = '不存在的记录'
                            break;
                        case 3004:
                            text = '已审核的状态无法再次审核'
                            break;
                        case 3005:
                            text = '空的status'
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
            this.getAdminRemittance()
        },
        getAdminRemittance() {
            let that = this
            let status = document.querySelector('#selection1').getAttribute('data-id') || '',
                stype = document.querySelector('#selection2').getAttribute('data-id') || '';
            app.requests({
                url: 'admin/getAdminRemittance',
                data: {
                    page: that.page || 1,
                    page_num: that.page_num || 10,
                    status: status,
                    stype: stype
                },
                success(res) {
                    that.AdminRemittance = that.disAdminRemittance(res.AdminRemittances)
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
                            text = '该用户没有权限'
                            break;
                        case 3003:
                            text = '不存在的记录'
                            break;
                        case 3004:
                            text = 'start_time时间格式错误'
                            break;
                        case 3005:
                            text = 'end_time时间格式错误'
                            break;
                        case 3006:
                            text = '收款金额必须为数字'
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
        disAdminRemittance(data = []) {
            let arr = data,
                len = arr.length
            for (let i = 0; i < len; i++) {
                arr[i].stypeText = this.getStype(arr[i].stype)
                arr[i].statusText = this.getStatus(arr[i].status)
                arr[i].identity = this.getIdentity(arr[i].user.user_identity)
            }
            return arr
        },
        getStype(n) {
            let text = ''
            switch (parseInt(n)) {
                case 1:
                    text = '商票'
                    break;
                case 2:
                    text = '佣金'
                    break;
                case 3:
                    text = '积分'
                    break;
            }
            return text
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

        verdict(type) {
            if (this.nick_name == '') {
                showToast({
                    text: '用户昵称不能为空'
                })
                return false
            }
            if (this.mobile == '') {
                showToast({
                    text: '用户手机号不能为空'
                })
                return false
            }
            this.mobile = this.mobile.replace(/\s+/g, "");
            if (this.mobile.length > 11) {
                showToast({
                    text: '手机号码大于11位'
                })
                return false
            }
            if (this.credit == '') {
                showToast({
                    text: '充值金额不能为空'
                })
                return false
            }
            if (type == '') {
                showToast({
                    text: '请选择充值类型'
                })
                return false
            }
            return true
        },
        submit() {
            let that = this
            let type = document.querySelector('#selection3').getAttribute('data-id') || '';
            if (!that.verdict(type)) return
            if (!that.nolink) return
            that.nolink = false
            app.requests({
                url: 'admin/adminRemittance',
                data: {
                    nick_name: that.nick_name,
                    stype: type,
                    mobile: that.mobile,
                    credit: that.credit,
                    passwd: that.pwd,
                    message: that.message
                },
                success(res) {
                    showToast({
                        type: 'success',
                        text: '添加成功'
                    })
                },
                Error(code) {
                    that.nolink = true
                    let text = ''
                    switch (parseInt(code)) {
                        case 3001:
                            text = '密码错误'
                            break;
                        case 3002:
                            text = '请输入转入类型'
                            break;
                        case 3003:
                            text = '错误的转账类型'
                            break;
                        case 3004:
                            text = '充值用户不存在'
                            break;
                        case 3005:
                            text = '金额必须为数字'
                            break;
                        case 3006:
                            text = '扣款金额不能大于用户余额(商票)'
                            break;
                        case 3007:
                            text = '充值用户昵称不能为空'
                            break;
                        case 3008:
                            text = '手机号格式错误'
                            break;
                        default:
                            text = '意料之外的错误'
                    }
                    showToast({
                        type: 'error',
                        text: text
                    })
                },
                failed() {
                    that.nolink = true
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
                    t.page = n
                    t.getAdminRemittance()
                }
            })
        },
    }
})