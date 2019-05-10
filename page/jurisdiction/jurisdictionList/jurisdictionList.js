import { app } from '../../../../index.js';
import { showToast, geturl } from '../../../../js/utils.js';

new Vue({
    el: '#app',
    data: {
        menuSubId: '',
        menuSub: {},
        menuId: '',
        menuName: '',
        menuList: [],
        modal: {
            updateFun: false,
            updateMenu: false,
            addFun: false
        },
        fun: {}
    },
    mounted() {
        this.getpermissionsapi()
    },
    methods: {
        cancel(con) {
            this.modal[con] = false
        },
        showupdateMenu(id, name) {
            this.menuId = id
            this.menuName = name
            this.modal['updateMenu'] = true
        },
        editmenu() {
            let that = this;
            if (!that.menuId) {
                showToast({
                    text: '未选择菜单'
                })
                return
            }
            if (!that.menuName) {
                showToast({
                    text: '菜单不能为空'
                })
                return
            }
            app.requests({
                url: 'admin/editmenu',
                data: {
                    id: that.menuId,
                    name: that.menuName
                },
                success(res) {
                    showToast({
                        type: 'success',
                        text: '保存成功'
                    })
                    that.menuId = ''
                    that.menuName = ''
                    that.modal['updateMenu'] = false
                    that.getpermissionsapi()
                },
                Error(code) {
                    let text = ''
                    switch (parseInt(code)) {
                        case 3001:
                            text = '菜单有误'
                            break;
                        case 3002:
                            text = '菜单不存在'
                            break;
                        case 3003:
                            text = '修改失败'
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
        getpermissionsapione(id = '') {
            let that = this;
            app.requests({
                url: 'admin/getpermissionsapione',
                data: {
                    id: id
                },
                success(res) {
                    that.fun = res.data || {}
                    console.log(that.modal)
                    that.modal['updateFun'] = true
                },
                Error(code) {
                    let text = ''
                    switch (parseInt(code)) {
                        case 3001:
                            text = '接口有误'
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
        getpermissionsapi() {
            let that = this;
            app.requests({
                url: 'admin/getpermissionsapi',
                success(res) {
                    that.menuList = res.data || []
                },
                Error(code) {}
            })
        },
        sumbit() {
            let that = this;
            if (!that.fun.id) {
                showToast({
                    text: '未获取到功能'
                })
                return
            }
            if (!that.fun.cn_name) {
                showToast({
                    text: '权限名称不能为空'
                })
                return
            }
            app.requests({
                url: 'admin/editpermissionsapi',
                data: {
                    id: that.fun.id,
                    cn_name: that.fun.cn_name,
                    content: that.fun.content
                },
                success(res) {
                    showToast({
                        type: 'success',
                        text: '保存成功'
                    })
                    that.modal['updateFun'] = false
                    that.getpermissionsapi()
                },
                Error(code) {
                    let text = ''
                    switch (parseInt(code)) {
                        case 3001:
                            text = '接口有误'
                            break;
                        case 3004:
                            text = '权限名称不能为空'
                            break
                        case 3005:
                            text = '接口不存在'
                            break;
                        case 3007:
                            text = '修改失败'
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
        showaddFun(id = '') {
            this.modal['addFun'] = true
            this.menuSubId = id
        },
        judge(stype = '') {
            if (!this.menuSubId) {
                showToast({
                    text: '未获取到功能'
                })
                return true
            }
            if (!stype) {
                showToast({
                    text: '接口类型不能为空'
                })
                return true
            }
            if (!this.menuSub.api_name) {
                showToast({
                    text: '接口url不能为空'
                })
                return true
            }
            return false
        },
        addpermissionsapi() {
            let that = this;
            let stype = document.querySelector('#selection').getAttribute('data-id') || '';
            if (that.judge(stype)) return
            app.requests({
                url: 'admin/addpermissionsapi',
                data: {
                    menu_id: that.menuSubId,
                    api_name: that.menuSub.api_name,
                    stype: stype,
                    cn_name: that.menuSub.cn_name,
                    content: that.menuSub.content
                },
                success(res) {
                    showToast({
                        type: 'success',
                        text: '保存成功'
                    })
                    that.modal['addFun'] = false
                    that.intmenuSub()
                    that.getpermissionsapi()
                },
                Error(code) {
                    let text = ''
                    switch (parseInt(code)) {
                        case 3001:
                            text = '接口有误'
                            break;
                        case 3004:
                            text = '权限名称不能为空'
                            break
                        case 3005:
                            text = '接口不存在'
                            break;
                        case 3007:
                            text = '修改失败'
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
        intmenuSub() {
            this.menuSub = {}
            let selection = document.querySelector('#selection')
            selection.setAttribute('data-id', '')
            selection.setAttribute('data-value', '')
            selection.classList.remove('already-select')
            selection.innerHTML = '请选择'
        }
    }
})
select({
    el: '#combobox',
    data: [{
        id: 1,
        type_name: '增'
    }, {
        id: 2,
        type_name: '删'
    }, {
        id: 3,
        type_name: '改'
    }]
})