import { app } from '../../../index.js';
import { showToast } from '../../../js/utils.js';

new Vue({
    el: '#app',
    data: {
        modal: false,
        s_nick_name: '',
        s_mobile: '',
        nick_name: '',
        mobile: '',
        money: '',
        message: '',
        page: 1,
        page_num: 10,
        total: 0,
        openbosslist: [],
        nolink: true
    },
    mounted() {
        this.getopenbosslist()
    },
    methods: {
        addMoney() {
            this.modal = true
        },
        cancel() {
            this.modal = false
        },
        search() {
            this.page = 1
            this.getopenbosslist()
        },
        getopenbosslist() {
            let that = this
            app.requests({
                url: 'admin/getopenbosslist',
                data: {
                    page: that.page || 1,
                    page_num: that.page_num || 10,
                    mobile: that.s_mobile,
                    nick_name: that.s_nick_name
                },
                success(res) {
                    that.openbosslist = res.data
                    if (that.total == res.total) return
                    that.total = res.total
                    that.setpage()
                },
                Error(code) {
                    let text = ''
                    switch (parseInt(code)) {
                        case 3001:
                            text = '手机格式有误'
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
        verdict() {
            if (this.nick_name == '') {
                showToast({
                    text: '开通账号昵称不能为空'
                })
                return false
            }
            if (this.mobile == '') {
                showToast({
                    text: '开通账号手机号不能为空'
                })
                return false
            }
            this.mobile = this.mobile.replace(/\s+/g, "");
            if (this.mobile.length > 11) {
                showToast({
                    text: '开通账号手机号码大于11位'
                })
                return false
            }
            return true
        },
        submit() {
            let that = this
            if (!that.verdict()) return
            if (!that.nolink) return
            that.nolink = false
            app.requests({
                url: 'admin/openboss',
                data: {
                    nick_name: that.nick_name,
                    mobile: that.mobile,
                    money: that.money,
                    message: that.message
                },
                success(res) {
                    showToast({
                        type: 'success',
                        text: '添加成功'
                    })
                    that.nolink = true
                    that.modal = false
                    that.nick_name = ''
                    that.money = ''
                    that.mobile = ''
                    that.getopenbosslist()
                },
                Error(code) {
                    that.nolink = true
                    let text = ''
                    switch (parseInt(code)) {
                        case 3001:
                            text = '密码错误'
                            break;
                        case 3002:
                            text = '账号昵称不能未空'
                            break;
                        case 3003:
                            text = '金额必须为数字'
                            break;
                        case 3004:
                            text = '扣除金额不能是负数'
                            break;
                        case 3005:
                            text = '没有操作权限'
                            break;
                        case 3006:
                            text = '用户不存在'
                            break;
                        case 3007:
                            text = '该用户已经是boss'
                            break;
                        case 3008:
                            text = '开通失败'
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
                    if (t.page == n) return
                    t.page = n
                    t.getopenbosslist()
                }
            })
        },
    }
})