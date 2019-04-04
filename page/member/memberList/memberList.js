import { app } from '../../../index.js';
import { showToast } from '../../../js/utils.js';

new Vue({
    el: '#app',
    data: {
        page: 1,
        pagenum: 10,
        memberList: [],
        mobile: ''
    },
    mounted() {
        this.getmemberList()
    },
    methods: {
        search() {
            this.getmemberList()
        },
        getmemberList() {
            let that = this
            app.requests({
                url: 'User/getUsers',
                data: {
                    page: that.page,
                    pagenum: that.pagenum,
                    mobile: that.mobile
                },
                success(res) {
                    that.memberList = that.dismemberList(res.result);
                    if (that.totle == res.totle) return
                    that.totle = res.totle
                    that.setpage()
                },
                Error(code) {
                    that.memberList = []
                    let text = ''
                    switch (parseInt(code)) {
                        case 3001:
                            text = '手机号格式错误'
                            break;
                        default:
                            text = '意料之外的错误'
                            break;
                    }
                    showToast({
                        text: text
                    })
                }
            })
        },
        dismemberList(data = []) {
            let arr = data,
                len = arr.length;
            for (let i = 0; i < len; i++) {
                arr[i].user_typeText = this.getuser_typeText(arr[i].user_type)
                arr[i].user_identityText = this.getuser_identityText(arr[i].user_identity)
            }
            return arr
        },
        getuser_typeText(n) {
            let text = '';
            switch (parseInt(n)) {
                case 1:
                    text = '普通账户'
                    break;
                case 2:
                    text = '总店账户'
                    break;
            }
            return text
        },
        getuser_identityText(n) {
            let text = '';
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
        setpage: function() {
            let that = this,
                totle = Math.ceil(parseInt(that.totle) / 10)
            pages.init({
                el: '#floorpages',
                pagenumber: totle,
                fn: function(n) {
                    that.page = n
                    that.getmemberList({
                        page: n
                    })
                }
            })
        },
    }
})