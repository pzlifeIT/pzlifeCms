import { app } from '../../../index.js';
import { showToast } from '../../../js/utils.js';

new Vue({
    el: '#app',
    data: {
        modal: false,
        groupname: '',
        content: '',
        admingroup: []
    },
    mounted() {
        this.getadmingroup()
    },
    methods: {
        gojtSet(groupId) {
            window.location.href = 'jtSet/jtSet.html?groupId=' + groupId
        },
        addMember() {
            this.modal = true
        },
        cancel() {
            this.modal = false
        },
        getadmingroup() {
            let that = this
            app.requests({
                url: 'admin/getadmingroup',
                success(res) {
                    that.admingroup = res.data
                },
                Error(code) {

                }
            })
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
        submit() {
            let that = this
            if (!that.groupname) {
                showToast({
                    text: '请输入组名称'
                })
                return
            }
            app.requests({
                url: 'admin/addpermissionsgroup',
                data: {
                    group_name: that.groupname,
                    content: that.content
                },
                success(res) {
                    showToast({
                        type: 'success',
                        text: '添加成功'
                    })
                    that.group_name = ''
                    that.content = ''
                    that.modal = ''
                    that.getadmingroup()
                },
                Error(code) {
                    let text = ''
                    switch (parseInt(code)) {
                        case 3001:
                            text = '分组名称错误'
                            break;
                        case 3002:
                            text = '没有权限'
                            break;
                        case 3003:
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