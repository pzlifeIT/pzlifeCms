import { app } from '../../../index.js';
import { showToast } from '../../../js/utils.js';

new Vue({
    el: '#app',
    data: {
        modal: false,
        sup_name: '',
        suplist: [],
        mobile: '',
        page:1,
        total: 0
    },
    mounted() {
        this.supplieradminlist()
    },
    methods: {
        addMember() {
            this.modal = true
        },
        cancel() {
            this.modal = false
        },
        supplieradminlist() {
            let that = this
            app.requests({
                url: 'suppliers/supplieradminlist',
                data: {
                  page:that.page
                },
                success(res) {
                    that.suplist = res.data || [];
                    if (that.total == res.total) return
                    that.total = res.total
                    that.setpage()
                },
                Error(code) {

                }
            })
        },
        disadminUserList(data = []) {
            let arr = data,
                len = arr.length
            for (let i = 0; i < len; i++) {
                arr[i].stypeText = this.getstype(arr[i].stype)
                arr[i].statusText = this.getstatus(arr[i].status)
            }
            return arr
        },
        getstype(n) {
            let text = ''
            switch (parseInt(n)) {
                case 1:
                    text = '管理员'
                    break;
                case 2:
                    text = '超级管理员'
                    break;
            }
            return text
        },
        getstatus(n) {
            let text = ''
            switch (parseInt(n)) {
                case 1:
                    text = '启用'
                    break;
                case 2:
                    text = '停用'
                    break;
            }
            return text
        },
        verdict(type) {
            if (this.sup_name == '') {
                showToast({
                    text: '供应商登录账号不能为空'
                })
                return false
            }
            if (this.mobile == '') {
                showToast({
                    text: '手机号不能为空'
                })
                return false
            }
            return true
        },
        submit() {
            let that = this
            if (!that.verdict()) return
            app.requests({
                url: 'suppliers/addsupplieradmin',
                data: {
                    sup_name: that.sup_name,
                    mobile: that.mobile
                },
                success(res) {
                    showToast({
                        type: 'success',
                        text: '添加成功'
                    })
                    that.sup_name = ''
                    that.mobile = ''
                    that.modal = false
                    that.supplieradminlist()
                },
                Error(code) {
                    let text = ''
                    switch (parseInt(code)) {
                        case 3001:
                            text = '账号不能为空'
                            break;
                        case 3002:
                            text = '供应商不存在'
                            break;
                        case 3003:
                            text = '账号名称已存在'
                            break;
                        case 3004:
                            text = '未注册用户不能添加'
                            break;
                        case 3006:
                            text = '添加失败'
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
                  t.supplieradminlist()
              }
          })
      }
    }
})