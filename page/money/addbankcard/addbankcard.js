import { app } from '../../../index.js';
import { showToast } from '../../../js/utils.js';

new Vue({
    el: '#app',
    data: {
        modal: false,
        s_abbrev: '',
        s_bank_name: '',
        abbrev: '',
        bank_name: '',
        page: 1,
        page_num: 10,
        total: 0,
        AdminBank: [],
        imgs: {},
        nolink: true,
        id: ''
    },
    mounted() {
        this.setimage('selpicureIcon')
        this.setimage('selpicureBack')
        this.getAdminBank()
    },
    methods: {
        addbank() {
            this.intbankCardInfo()
            this.modal = true
        },
        cancel() {
            this.modal = false
        },
        setimage(el, img) {
            let that = this
            selpicure({
                el: '#' + el,
                num: 5,
                images: [{ image: img }],
                imgChange: function(images) {
                    that.imgs[el] = images[0].image
                }
            })
        },
        getBackcard(id) {
            let arr = this.AdminBank,
                len = arr.length;
            for (let i = 0; i < len; i++) {
                if (id == arr[i].id) {
                    return arr[i]
                }
            }
        },
        edit(id) {
            let that = this
            app.requests({
                url: 'admin/getAdminBank',
                data: {
                    id: id
                },
                success(res) {
                    that.id = id
                    that.setbankCardInfo(res.admin_bank)
                    that.modal = true
                },
                Error(code) {
                    showToast({
                        text: '获取失败'
                    })
                }
            })

        },
        setbankCardInfo(obj = {}) {
            this.abbrev = obj.abbrev
            this.bank_name = obj.bank_name
            document.querySelector('#selpicureIcon').querySelector('img').setAttribute('src', obj.icon_img)
            document.querySelector('#selpicureBack').querySelector('img').setAttribute('src', obj.bg_img)
            let sel = document.querySelector('#status-select')
            sel.setAttribute('data-id', obj.status)
            sel.classList.add('already-select')
            sel.innerHTML = this.getStatus(obj.status)
        },
        intbankCardInfo() {
            this.id = ''
            this.abbrev = ''
            this.bank_name = ''
            document.querySelector('#selpicureIcon').querySelector('img').setAttribute('src', '')
            document.querySelector('#selpicureBack').querySelector('img').setAttribute('src', '')
            let sel = document.querySelector('#status-select')
            sel.setAttribute('data-id', '')
            sel.classList.remove('already-select')
            sel.innerHTML = '请选择(默认停用)'
        },
        editAdminBank() {
            let that = this
            let type = document.querySelector('#status-select').getAttribute('data-id') || '';
            app.requests({
                url: 'admin/editAdminBank',
                data: {
                    id: that.id,
                    abbrev: that.abbrev,
                    bank_name: that.bank_name,
                    icon_img: that.imgs['selpicureIcon'] || '',
                    bg_img: that.imgs['selpicureBack'] || '',
                    status: type,
                },
                success(res) {
                    showToast({
                        type: 'success',
                        text: '修改成功'
                    })
                    that.imgs = {}
                    that.modal = false
                    that.getAdminBank()
                },
                Error(code) {
                    let text = ''
                    switch (parseInt(code)) {
                        case 3001:
                            text = ':status或者status或者id必须为数字'
                            break;
                        case 3002:
                            text = '错误的status'
                            break;
                        case 3003:
                            text = 'id不能为空'
                            break;
                        case 3004:
                            text = '没有更改的资料'
                            break;
                        case 3005:
                            text = '银行英文缩写名和银行全称都不能重复'
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
        upshop(id, status) {
            let that = this,
                st = 0;
            if (status == 1) {
                st = 2
            } else {
                st = 1
            }
            app.requests({
                url: 'admin/editAdminBank',
                data: {
                    id: id,
                    status: st,
                },
                success(res) {
                    showToast({
                        type: 'success',
                        text: '操作成功'
                    })
                    that.getAdminBank()
                },
                Error(code) {
                    let text = ''
                    switch (parseInt(code)) {
                        case 3001:
                            text = 'status或者status或者id必须为数字'
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
        search() {
            this.page = 1
            this.getAdminBank()
        },
        getAdminBank() {
            let that = this
            let status = document.querySelector('#selection1').getAttribute('data-id') || ''
            app.requests({
                url: 'admin/getAdminBank',
                data: {
                    page: that.page || 1,
                    page_num: that.page_num || 10,
                    status: status,
                    abbrev: that.s_abbrev,
                    bank_name: that.s_bank_name
                },
                success(res) {
                    that.AdminBank = res.admin_bank
                    if (that.total == res.total) return
                    that.total = res.total
                    that.setpage()
                },
                Error(code) {
                    let text = ''
                    switch (parseInt(code)) {
                        case 3001:
                            text = 'page或者pageNum或者status必须为数字 '
                            break;
                        case 3002:
                            text = '该用户没有权限'
                            break;
                        case 3003:
                            text = 'start_time时间格式错误'
                            break;
                        case 3004:
                            text = 'end_time时间格式错误'
                            break;
                        case 3005:
                            text = '收款金额必须为数字'
                            break;
                        case 3006:
                            text = '收款金额必须为数字'
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
        getStatus(n = 0) {
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
        verdict() {
            if (this.abbrev == '') {
                showToast({
                    text: '银行英文缩写名不能为空'
                })
                return false
            }
            if (this.bank_name == '') {
                showToast({
                    text: '银行名称不能为空'
                })
                return false
            }
            if (!this.imgs['selpicureIcon']) {
                showToast({
                    text: '请上传银行图标'
                })
                return false
            }
            return true
        },
        submit() {
            let that = this
            console.log(that.id)
            if (that.id) {
                that.editAdminBank()
                return
            }
            if (!that.verdict()) return
            if (!that.nolink) return
            let type = document.querySelector('#status-select').getAttribute('data-id') || '';
            that.nolink = false
            app.requests({
                url: 'admin/addAdminBank',
                data: {
                    abbrev: that.abbrev,
                    bank_name: that.bank_name,
                    icon_img: that.imgs['selpicureIcon'] || '',
                    bg_img: that.imgs['selpicureBack'] || '',
                    status: type,
                },
                success(res) {
                    showToast({
                        type: 'success',
                        text: '添加成功'
                    })
                    that.imgs = {}
                    that.modal = false
                    that.getAdminBank()
                },
                complete() {
                    that.nolink = true
                },
                Error(code) {
                    let text = ''
                    switch (parseInt(code)) {
                        case 3001:
                            text = '状态必须为数字'
                            break;
                        case 3002:
                            text = '错误的状态'
                            break;
                        case 3003:
                            text = '银行英文缩写名和银行全称不能为空'
                            break;
                        case 3004:
                            text = '银行英文缩写名和银行全称不能重复'
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
                total = Math.ceil(parseInt(t.total) / 10)
            pages.init({
                el: '#floorpages',
                pagenumber: total,
                fn: function(n) {
                    t.page = n
                    t.getAdminBank()
                }
            })
        },
    }
})
select({
    el: '#statusid',
    data: [{
        id: 1,
        type_name: '启用'
    }, {
        id: 2,
        type_name: '停用'
    }]
})
select({
    el: '#combobox3',
    data: [{
        id: '',
        type_name: '全部'
    }, {
        id: 1,
        type_name: '启用'
    }, {
        id: 2,
        type_name: '停用'
    }]
})