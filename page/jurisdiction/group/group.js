import { app } from '../../../index.js';
import { showToast } from '../../../js/utils.js';

new Vue({
    el: '#app',
    data: {
        modal: false,
        modal1: false,
        groupname: '',
        content: '',
        admingroup: [],
        groupInfo: {}
    },
    mounted() {
        this.getadmingroup()
    },
    methods: {
        gojtSet(groupId) {
            window.location.href = 'jtSet/jtSet.html?groupId=' + groupId
        },
        gopeople(groupId) {
            window.location.href = 'peoplemanagement/peoplemanagement.html?groupId=' + groupId
        },
        addMember() {
            this.modal = true
        },
        cancel() {
            this.modal = false
        },
        cancel1() {
            this.modal1 = false
        },
        compile(id = '') {
            let that = this
            if (!that.groupInfo.group_name) {
                showToast({
                    text: '请输入组名称'
                })
                return
            }
            app.requests({
                url: 'admin/editpermissionsgroup',
                data: {
                    group_id: that.groupInfo.id,
                    group_name: that.groupInfo.group_name,
                    content: that.groupInfo.content
                },
                success(res) {
                    showToast({
                        type: 'success',
                        text: '修改成功'
                    })
                    that.modal1 = false
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
                        text: text
                    })
                }
            })
        },
        getgroupinfo(id = '') {
            if (id == '') {
                showToast({
                    type: 'warn',
                    text: '未选取组'
                })
                return
            }
            let that = this;
            app.requests({
                url: 'admin/getgroupinfo',
                data: {
                    group_id: id
                },
                success(res) {
                    that.modal1 = true
                    that.groupInfo = res.data || {}
                },
                Error(code) {

                }
            })
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