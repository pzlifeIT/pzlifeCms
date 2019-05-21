import { app } from '../../../../index.js';
import { showToast, geturl } from '../../../../js/utils.js';

new Vue({
    el: '#app',
    data: {
        groupId: '',
        peopleList: [],
        modal: false,
        adminList: []
    },
    mounted() {
        this.groupId = geturl().groupId
        this.getpermissionsgroupadmin(this.groupId)
        this.getAdminUsers()
    },
    methods: {
        addMember() {
            this.modal = true
        },
        cancel() {
            this.modal = false
        },
        getpermissionsgroupadmin(group_id = '') {
            let that = this
            app.requests({
                url: 'admin/getpermissionsgroupadmin',
                data: {
                    group_id: group_id
                },
                success(res) {
                    that.peopleList = res.data
                },
                Error(code) {

                }
            })
        },
        deladminpermissions(id = '') {
            let that = this
            app.requests({
                url: 'admin/deladminpermissions',
                data: {
                    del_admin_id: id,
                    group_id: that.groupId
                },
                success(res) {
                    showToast({
                        type: 'success',
                        text: '删除成功'
                    })
                    that.getpermissionsgroupadmin(that.groupId)
                },
                Error(code) {
                    let text = ''
                    switch (parseInt(code)) {
                        case 3001:
                            text = '分组错误'
                            break;
                        case 3003:
                            text = '权限分组不存在'
                            break;
                        case 3004:
                            text = '删除用户不存在'
                            break;
                        case 3005:
                            text = '管理员有误'
                            break;
                        case 3006:
                            text = '删除的管理员不存在'
                            break;
                        case 3007:
                            text = '删除失败'
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
        getAdminUsers() {
            let that = this
            app.requests({
                url: 'admin/getAdminUsers',
                success(res) {
                    that.adminList = res.data
                    select({
                        el: '#combobox3',
                        name: 'admin_name',
                        data: that.disAdminList(res.data)
                    })
                },
                Error(code) {

                }
            })
        },
        disAdminList(data = []) {
            let arr = [],
                len = data.length;
            for (let i = 0; i < len; i++) {
                if (data[i].status == 1) {
                    arr.push(data[i])
                }
            }
            return arr
        },
        delect(id) {

        },
        submit() {
            let that = this,
                adminId = document.querySelector('#selection1').getAttribute('data-id') || '';
            if (adminId == '') {
                showToast({
                    text: '请选择成员'
                })
                return
            }
            app.requests({
                url: 'admin/addadminpermissions',
                data: {
                    group_id: that.groupId,
                    add_admin_id: adminId
                },
                success(res) {
                    showToast({
                        type: 'success',
                        text: '保存成功'
                    })
                    that.reductionSelect()
                    that.modal = false
                    that.getpermissionsgroupadmin(that.groupId)
                },
                Error(code) {
                    let text = ''
                    switch (parseInt(code)) {
                        case 3001:
                            text = '分组错误'
                            break;
                        case 3002:
                            text = '没有权限'
                            break;
                        case 3003:
                            text = '权限分组不存在'
                            break;
                        case 3004:
                            text = '添加用户不存在'
                            break;
                        case 3005:
                            text = '管理员有误'
                            break;
                        case 3006:
                            text = '该成员已存在'
                            break;
                        case 3007:
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
        reductionSelect() {
            let selection = document.querySelector('#selection1')
            selection.setAttribute('data-id', '')
            selection.setAttribute('data-value', '')
            selection.classList.remove('already-select')
            selection.innerHTML = '请选择'
        }
    }
})