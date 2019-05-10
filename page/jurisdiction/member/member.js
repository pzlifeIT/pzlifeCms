import { app } from '../../../index.js';
import { showToast } from '../../../js/utils.js';

new Vue({
    el: '#app',
    data: {
        modal: false,
        username: '',
        pwd: '',
        adminUserList: []
    },
    mounted() {
        this.getAdminUsers()
    },
    methods: {
        addMember() {
            this.modal = true
        },
        cancel() {
            this.modal = false
        },
        getAdminUsers() {
            let that = this
            app.requests({
                url: 'admin/getAdminUsers',
                data: {},
                success(res) {
                    that.adminUserList = that.disadminUserList(res.data)
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
            if (this.username == '') {
                showToast({
                    text: '用户名不能为空'
                })
                return false
            }
            if (this.pwd.length < 6 & this.pwd.length > 0) {
                showToast({
                    text: '密码必须大于6个字'
                })
                return false
            }
            if (this.pwd.length > 16) {
                showToast({
                    text: '密码必须小于16个字'
                })
                return false
            }
            if (type == '') {
                showToast({
                    text: '请选择管理员类型'
                })
                return false
            }
            return true
        },
        submit() {
            let that = this
            let type = document.querySelector('#selection').getAttribute('data-id') || '';
            if (!that.verdict(type)) return
            app.requests({
                url: 'admin/addadmin',
                data: {
                    admin_name: that.username,
                    passwd: that.pwd,
                    stype: type
                },
                success(res) {
                    showToast({
                        type: 'success',
                        text: '添加成功'
                    })
                    that.username = ''
                    that.pwd = ''
                    that.modal = false
                    that.getAdminUsers()
                },
                Error(code) {
                    let text = ''
                    switch (parseInt(code)) {
                        case 3001:
                            text = '账号不能为空'
                            break;
                        case 3002:
                            text = '密码必须为6-16个字'
                            break;
                        case 3003:
                            text = '只有root账户可以添加超级管理员'
                            break;
                        case 3004:
                            text = '该账号已存在'
                            break;
                        case 3005:
                            text = '没有操作权限'
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
        }
    }
})
select({
    el: '.combobox',
    data: [{
        id: 1,
        type_name: '管理员'
    }, {
        id: 2,
        type_name: '超级管理员'
    }]
})