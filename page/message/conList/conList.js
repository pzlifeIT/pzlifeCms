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
        template: '',
        msg: '',
        msgoutput: '',
        mtTextJson: {},
        sellocation: '',
        conList: [],
        templateId: ''
    },
    mounted() {
        let that = this
        that.getMessageTemplate()
        that.setStatus()
        that.getMessageTemplateText()
    },
    methods: {
        setStatus() {
            let that = this
            select({
                el: '#combobox1',
                data: [{
                    id: 1,
                    type_name: '短短信'
                }, {
                    id: 2,
                    type_name: '长短信'
                }, {
                    id: 3,
                    type_name: '彩信'
                }],
                callback(id, val) {
                    that.type = id
                }
            })
        },
        redactBlur(e) {
            this.sellocation = this.$refs.redact.selectionStart
        },
        changeRedact() {
            this.setmsgoutput(this.msg)
        },
        intMsg(key) {
            let t1 = this.msg.substring(0, this.sellocation)
            let t2 = this.msg.substring(this.sellocation, this.msg.length)
            this.msg = t1 + key + t2
            this.setmsgoutput(this.msg)
        },
        setmsgoutput(msg) {
            let that = this
            this.msgoutput = msg.replace(/\{{2}\[.*?\]\}{2}/g, function(t, s) {
                return '<' + that.mtTextJson[t] + '>'
            })
        },
        cancel() {
            this.modal = false
        },
        showmodal(id) {
            this.templateId = ''
            this.title = ''
            this.msg = ''
            this.type = ''
            this.setBox()
            this.modal = true
        },
        getMessageTemplateText() {
            let that = this
            app.requests({
                url: 'ModelMessage/getMessageTemplateText',
                success(res) {
                    that.distemplatetext(res.templatetext)
                    select({
                        el: '#combobox2',
                        data: res.templatetext || [],
                        name: 'value',
                        id: 'key',
                        callback(key, val) {
                            that.intMsg(key)
                        }
                    })
                }
            })
        },
        distemplatetext(data = []) {
            let len = data.length
            for (let i = 0; i < len; i++) {
                this.mtTextJson[data[i].key] = data[i].value
            }
            console.log(this.mtTextJson)
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
                        that.msg = template.template
                        that.setmsgoutput(that.msg)
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
                        case 3004:
                            text = '存在已启用的消息任务，无法停用'
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
            if (that.msg == '') {
                showToast({
                    text: '内容模板不能为空'
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
                    template: that.msg,
                    id: that.templateId
                },
                success(res) {
                    showToast({
                        type: 'success',
                        text: '操作成功'
                    })
                    that.modal = false
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
                        case 3004:
                            text = '结束时间不能小于开始时间'
                            break;
                        case 3005:
                            text = '启用中无法修改'
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