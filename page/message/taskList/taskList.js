import { app } from '../../../index.js';
import { showToast } from '../../../js/utils.js';

new Vue({
    el: '#app',
    data: {
        modal: false,
        page: 1,
        page_num: 10,
        title: '',
        type: '',
        wtype: '',
        mt_id: '',
        trigger_id: '',
        sellocation: '',
        conList: [],
        templateId: ''
    },
    mounted() {
        let that = this
        that.getMessageTemplate()
        that.setType()
        that.setWtype()
        that.setMt()
        that.setTrigger()
    },
    methods: {
        setType() {
            let that = this
            select({
                el: '#combobox1',
                data: [{
                    id: 1,
                    type_name: '所有会员'
                }, {
                    id: 2,
                    type_name: '普通会员'
                }, {
                    id: 3,
                    type_name: '钻石会员'
                }, {
                    id: 4,
                    type_name: '创业店主'
                }, {
                    id: 5,
                    type_name: '合伙人'
                }],
                callback(id, val) {
                    that.type = id
                }
            })
        },
        setWtype() {
            let that = this
            select({
                el: '#combobox1',
                data: [{
                    id: 1,
                    type_name: '订单发货'
                }, {
                    id: 2,
                    type_name: '订单退款'
                }, {
                    id: 3,
                    type_name: '未付款订单提醒'
                }, {
                    id: 4,
                    type_name: '营销类活动'
                }, {
                    id: 5,
                    type_name: '定时任务'
                }, {
                    id: 6,
                    type_name: '生日祝福'
                }, {
                    id: 7,
                    type_name: '提现到账'
                }],
                callback(id, val) {
                    that.wtype = id
                }
            })
        },
        setMt() {
            let that = this
            app.requests({
                url: 'ModelMessage/getMessageTemplateText',
                success(res) {
                    select({
                        el: '#combobox2',
                        data: res.templatetext || [],
                        name: 'value',
                        callback(id, val) {
                            console.log(key, val)
                            that.mt_id = key
                        }
                    })
                }
            })
        },
        setTrigger() {
            let that = this
            app.requests({
                url: 'ModelMessage/getMessageTemplateText',
                success(res) {
                    select({
                        el: '#combobox2',
                        data: res.templatetext || [],
                        name: 'value',
                        id: 'key',
                        callback(id, val) {
                            console.log(id, val)
                            that.trigger_id = id
                            that.intMsg(key)
                        }
                    })
                }
            })
        },
        cancel() {
            this.modal = false
        },
        showmodal(id) {
            this.modal = true
        },

        getMessageTemplate(id = '') {
            let that = this;
            app.requests({
                url: 'ModelMessage/getMessageTemplate',
                data: {
                    page: that.page || 1,
                    page_num: that.page_num || 10,
                    id: id
                },
                success(res) {
                    if (id != '') {
                        that.modal = true
                        let template = res.Trigger || {}
                        that.templateId = template.id
                        that.title = template.title
                        that.type = template.type
                        that.setBox(template.type)
                        return
                    }
                    that.conList = that.disconList(res.MessageTemplate)
                    if (that.total == res.total) return
                    that.total = res.total
                    that.setpage()
                },
                Error(code) {
                    let text = ''
                    switch (parseInt(code)) {
                        case 3001:
                            text = '状态必须为数字'
                            break;
                        case 3002:
                            text = '错误的审核类型'
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
        setBox(type = '') {
            let selection = document.querySelector('#selection1')
            let typeText = this.getType(type)
            selection.setAttribute('data-value', typeText)
            selection.setAttribute('data-id', type)
            if (type == '') {
                selection.innerHTML = '请选择'
                selection.classList.remove('already-select')
            } else {
                selection.innerHTML = typeText
                selection.classList.add('already-select')
            }

        },
        disconList(data = []) {
            let arr = data,
                len = arr.length
            for (let i = 0; i < len; i++) {
                arr[i].statusText = this.getStatus(arr[i].status)
                arr[i].typeText = this.getType(arr[i].type)
            }
            return arr
        },
        getStatus(n) {
            let text = ''
            switch (parseInt(n)) {
                case 1:
                    text = '待启用'
                    break;
                case 2:
                    text = '启用'
                    break;
                case 3:
                    text = '停用'
                    break;
            }
            return text
        },
        getType(n) {
            let text = ''
            switch (parseInt(n)) {
                case 1:
                    text = '短短信'
                    break;
                case 2:
                    text = '长短信'
                    break;
                case 3:
                    text = '彩信'
                    break;
            }
            return text
        },
        auditMessageTemplate(id = '', status = '') {
            let that = this
            app.requests({
                url: 'ModelMessage/auditMessageTemplate',
                data: {
                    status: status,
                    id: id
                },
                success(res) {
                    showToast({
                        type: 'success',
                        text: '操作成功'
                    })
                    that.getMessageTemplate()
                },
                Error(code) {
                    let text = ''
                    switch (parseInt(code)) {
                        case 3001:
                            text = '状态参数错误'
                            break;
                        case 3002:
                            text = '参数错误 '
                            break;
                        case 3003:
                            text = '已经是该状态'
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
        submit() {
            let that = this
            if (that.title == '') {
                showToast({
                    text: '标题不能为空'
                })
                return
            }
            if (that.type == '') {
                showToast({
                    text: '请选择发送类型'
                })
                return
            }
            let urlText = ''
            if (that.templateId == '') {
                urlText = 'ModelMessage/saveMessageTemplate'
            } else {
                urlText = 'ModelMessage/editMessageTemplate'
            }
            app.requests({
                url: urlText,
                data: {
                    title: that.title,
                    type: that.type,
                    id: that.templateId
                },
                success(res) {
                    showToast({
                        type: 'success',
                        text: '操作成功'
                    })
                    that.modal = false
                    that.templateId = ''
                    that.title = ''
                    that.msg = ''
                    that.type = ''
                    that.setBox()
                    that.getMessageTemplate()
                },
                Error(code) {
                    let text = ''
                    switch (parseInt(code)) {
                        case 3001:
                            text = '标题不能为空'
                            break;
                        case 3002:
                            text = '请选择发送类型'
                            break;
                        case 3003:
                            text = '内容模板不能为空'
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
                    t.getMessageTemplate()
                }
            })
        }
    }
})

// select({
//     el: '#combobox3',
//     data: [{
//         id: '',
//         type_name: '全部'
//     }, {
//         id: 1,
//         type_name: '待发放'
//     }, {
//         id: 2,
//         type_name: '已经发放'
//     }, {
//         id: 3,
//         type_name: '取消发放'
//     }],
//      callback(){}
// })