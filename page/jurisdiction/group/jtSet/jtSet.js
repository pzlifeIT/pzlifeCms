import { app } from '../../../../index.js';
import { showToast, geturl } from '../../../../js/utils.js';

new Vue({
    el: '#app',
    data: {
        groupId: '',
        menuList: []
    },
    mounted() {
        this.groupId = geturl().groupId
        this.getpermissionslist(this.groupId)
    },
    methods: {
        selFun(k, k1, k2) {
            let status = this.menuList[k]._child[k1].child[k2].status
            if (status === 1) {
                this.menuList[k]._child[k1].child[k2].status = 0
            } else {
                if (this.menuList[k]._child[k1].status == 0) return
                this.menuList[k]._child[k1].child[k2].status = 1
            }
        },
        showMenu(k, k1) {
            let status = this.menuList[k]._child[k1].status
            if (status === 1) {
                this.menuList[k]._child[k1].status = 0
            } else {
                this.menuList[k]._child[k1].status = 1
            }
        },
        getpermissionslist(group_id = '') {
            let that = this
            app.requests({
                url: 'admin/getpermissionslist',
                data: {
                    group_id: group_id
                },
                success(res) {
                    that.menuList = res.data
                },
                Error(code) {

                }
            })
        },
        addpermissionsgrouppower() {
            let that = this,
                permissions = JSON.stringify(this.dismenuList());
            app.requests({
                url: 'admin/addpermissionsgrouppower',
                data: {
                    group_id: that.groupId,
                    permissions: permissions
                },
                success(res) {
                    showToast({
                        type: 'success',
                        text: '保存成功'
                    })
                    that.getpermissionslist(that.groupId)
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
                            text = '权限分组不能为空'
                            break;
                        case 3005:
                            text = '数据有误'
                            break;
                        case 3006:
                            text = '菜单不存在'
                            break;
                        case 3007:
                            text = '更改失败'
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
        dismenuList() {
            let list = this.menuList,
                permissions = {},
                len = list.length,
                len1 = 0,
                len2 = 0;
            for (let i = 0; i < len; i++) {
                len1 = list[i]._child.length
                for (let x = 0; x < len1; x++) {
                    if (list[i]._child[x].status == 1) {
                        permissions[list[i]._child[x].id] = {}
                        len2 = list[i]._child[x].child.length
                        for (let y = 0; y < len2; y++) {
                            permissions[list[i]._child[x].id][list[i]._child[x].child[y].id] = list[i]._child[x].child[y].status
                        }
                    }
                }
            }
            return permissions
        },
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