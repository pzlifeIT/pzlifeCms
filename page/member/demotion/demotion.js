import { app } from '../../../index.js';
import { showToast } from '../../../js/utils.js';

new Vue({
    el: '#app',
    data: {
        modal: false,
        showList: false,
        list: [],
        mobile: '',
        message: '',
        user_identity: '',
        page: 1,
        page_num: 10,
        totle: 0,
        demotionList: [],
        nolink: true
    },
    mounted() {
        this.getdemotionList()
    },
    methods: {
        showmodal() {
            let that = this
            that.modal = true
            that.mobile = ''
            that.message = ''
            that.user_identity = ''
            setTimeout(function() {
                that.setIdentity()
            }, 500)
        },
        hidemodal() {
            this.modal = false
        },
        lookList(list = [], k) {
            this.showList = true
            this.list = list
        },
        hideList(list, k) {
            this.showList = false
            this.list = []
        },
        setIdentity() {
            let that = this
            select({
                el: '#combobox2',
                data: [{
                    id: 1,
                    type_name: '普通会员'
                }, {
                    id: 2,
                    type_name: '钻石会员'
                }],
                callback(id, val) {
                    that.user_identity = id
                }
            })
        },
        getdemotionList() {
            let that = this
            app.requests({
                url: 'user/userdemotionlist',
                data: {
                    page: that.page,
                    page_num: that.page_num
                },
                success(res) {
                    that.demotionList = that.disdemotionList(res.data)
                    if (that.totle == res.totle) return
                    that.totle = res.totle
                    that.setpage()
                },
                Error(code) {
                    showToast({
                        text: '获取失败'
                    })
                }
            })
        },
        disdemotionList(data = []) {
            let arr = data,
                len = arr.length;
            if (len === 0) { return arr }
            for (let i = 0; i < len; i++) {
                arr[i].after_identity_text = this.getIdentity(arr[i].after_identity)
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
                case 3:
                    text = '创业店主'
                    break;
                case 4:
                    text = '合伙人'
                    break;
            }
            return text
        },
        verdict(type) {
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
            if (this.user_identity == '') {
                showToast({
                    text: '请选择降级身份'
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
                url: 'user/userdemotion',
                data: {
                    content: that.message,
                    user_identity: that.user_identity,
                    mobile: that.mobile
                },
                success(res) {
                    showToast({
                        type: 'success',
                        text: '操作成功'
                    })
                    that.modal = false

                },
                complete() {
                    that.nolink = true
                },
                Error(code) {
                    let text = ''
                    switch (parseInt(code)) {
                        case 3001:
                            text = '手机格式有误'
                            break;
                        case 3002:
                            text = '只能降级为钻石或普通会员 '
                            break;
                        case 3003:
                            text = '只有boss可以降级'
                            break;
                        case 3004:
                            text = '有未完成订单'
                            break;
                        case 3006:
                            text = '修改失败(商票)'
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
                totle = Math.ceil(parseInt(t.totle) / 10)
            pages.init({
                el: '#floorpages',
                pagenumber: totle,
                fn: function(n) {
                    t.page = n
                    t.getAdminRemittance()
                }
            })
        },
    }
})