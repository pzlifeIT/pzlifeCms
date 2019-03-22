import { app } from '../../../index.js';
import { showToast } from '../../../js/utils.js';

new Vue({
    el: '#app',
    data: {
        modal: false,
        username: '',
        pwd: ''
    },
    mounted() {
        console.log(app)
    },
    methods: {
        addMember() {
            this.modal = true
        },
        cancel() {
            this.modal = false
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
                    that.modal = false
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