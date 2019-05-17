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
        task_id: '',
        taskList: []
    },
    mounted() {
        let that = this
        that.getMessageTask()
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
                el: '#combobox2',
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
                url: 'ModelMessage/getMessageTemplate',
                data: {
                    all: 1
                },
                success(res) {
                    select({
                        el: '#combobox3',
                        data: res.MessageTemplate || [],
                        name: 'title',
                        callback(id, val) {
                            that.mt_id = id
                        }
                    })
                }
            })
        },
        setTrigger() {
            let that = this
            app.requests({
                url: 'ModelMessage/getTrigger',
                data: {
                    all: 1
                },
                success(res) {
                    select({
                        el: '#combobox4',
                        data: res.Trigger || [],
                        name: 'title',
                        callback(id, val) {
                            that.trigger_id = id
                        }
                    })
                }
            })
        },
        cancel() {
            this.modal = false
        },
        showmodal(id) {
            this.title = ''
            this.task_id = ''
            this.type = ''
            this.wtype = ''
            this.mt_id = ''
            this.trigger_id = ''
            this.setBox('#selection1')
            this.setBox('#selection2')
            this.setBox('#selection3')
            this.setBox('#selection4')
            this.modal = true
        },
        getMessageTask(id = '') {
            let that = this;
            app.requests({
                url: 'ModelMessage/getMessageTask',
                data: {
                    page: that.page || 1,
                    page_num: that.page_num || 10,
                    id: id
                },
                success(res) {
                    if (id != '') {
                        that.modal = true
                        let task = res.messagetask || {}
                        that.task_id = task.id
                        that.title = task.title
                        that.type = task.type
                        that.wtype = task.wtype
                        that.mt_id = task.messagetemplate.id
                        that.trigger_id = task.messagetrigger.id
                        that.setBox('#selection1', task.type, '', 'type')
                        that.setBox('#selection2', task.wtype, '', 'wtype')
                        that.setBox('#selection3', task.messagetemplate.id, task.messagetemplate.title)
                        that.setBox('#selection4', task.messagetrigger.id, task.messagetrigger.title)
                        return
                    }
                    that.taskList = that.distaskList(res.messagetask)
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
        setBox(el = '', k = '', val = '', field = '') {
            if (el == '') return
            let selection = document.querySelector(el)
            if (val == '' & k != '') {
                if (field == 'wtype') {
                    val = this.getWtype(k)
                } else if (field == 'type') {
                    val = this.getType(k)
                }
            }
            selection.setAttribute('data-value', val)
            selection.setAttribute('data-id', k)
            if (val == '' & k == '') {
                selection.innerHTML = '请选择'
                selection.classList.remove('already-select')
            } else {
                selection.innerHTML = val
                selection.classList.add('already-select')
            }

        },
        distaskList(data = []) {
            let arr = data,
                len = arr.length
            for (let i = 0; i < len; i++) {
                arr[i].wtypeText = this.getWtype(arr[i].wtype)
                arr[i].typeText = this.getType(arr[i].type)
                arr[i].statusText = this.getStatus(arr[i].status)
            }
            return arr
        },
        getWtype(n) {
            let text = ''
            switch (parseInt(n)) {
                case 1:
                    text = '订单发货'
                    break;
                case 2:
                    text = '订单退款'
                    break;
                case 3:
                    text = '未付款订单提醒'
                    break;
                case 4:
                    text = '营销类活动'
                    break;
                case 5:
                    text = '定时任务'
                    break;
                case 6:
                    text = '生日祝福'
                    break;
                case 7:
                    text = '提现到账'
                    break;
            }
            return text
        },
        getType(n) {
            let text = ''
            switch (parseInt(n)) {
                case 1:
                    text = '所有会员'
                    break;
                case 2:
                    text = '普通会员'
                    break;
                case 3:
                    text = '钻石会员'
                    break;
                case 4:
                    text = '创业店主'
                    break;
                case 5:
                    text = '合伙人'
                    break;
            }
            return text
        },
        getStatus(n) {
            let text = ''
            switch (parseInt(n)) {
                case 1:
                    text = '待启用'
                    break;
                case 2:
                    text = '启用中'
                    break;
                case 3:
                    text = '停用中'
                    break;
            }
            return text
        },
        auditMessageTask(id = '', status = '') {
            let that = this
            app.requests({
                url: 'ModelMessage/auditMessageTask',
                data: {
                    status: status,
                    id: id
                },
                success(res) {
                    showToast({
                        type: 'success',
                        text: '操作成功'
                    })
                    that.getMessageTask()
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
                            text = '短信模板未启或者不存在'
                            break;
                        case 3005:
                            text = '触发其未启用或者不存在'
                            break;
                        case 3008:
                            text = '存在已启用的同类模板任务'
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
                    text: '请选择发送人群'
                })
                return
            }
            if (that.wtype == '') {
                showToast({
                    text: '请选择任务类型'
                })
                return
            }
            if (that.mt_id == '') {
                showToast({
                    text: '请选择消息模板'
                })
                return
            }
            if (that.trigger_id == '') {
                showToast({
                    text: '请选择触发器'
                })
                return
            }
            let urlText = ''
            if (that.task_id == '') {
                urlText = 'ModelMessage/saveMessageTask'
            } else {
                urlText = 'ModelMessage/editMessageTask'
            }
            app.requests({
                url: urlText,
                data: {
                    wtype: that.wtype,
                    type: that.type,
                    mt_id: that.mt_id,
                    trigger_id: that.trigger_id,
                    title: that.title,
                    MessageTask_id: that.task_id
                },
                success(res) {
                    showToast({
                        type: 'success',
                        text: '操作成功'
                    })
                    that.modal = false
                    that.getMessageTask()
                },
                Error(code) {
                    if (that.task_id == '') {
                        that.saveMessageTaskErrot(code)
                    } else {
                        that.editMessageTaskErrot(code)
                    }
                }
            })
        },
        saveMessageTaskErrot(code) {
            let text = ''
            switch (parseInt(code)) {
                case 3001:
                    text = '标题不能为空'
                    break;
                case 3002:
                    text = '请选择消息模板或触发器'
                    break;
                case 3003:
                    text = '请选择任务类型'
                    break;
                case 3004:
                    text = '该短信模板未启用或者不存在'
                    break;
                case 3005:
                    text = '该触发器未启用或者不存在'
                    break;
                case 3006:
                    text = '存在已启用的同类模板任务'
                    break;
                default:
                    text = '意料之外的错误'
            }
            showToast({
                type: 'error',
                text: text
            })
        },
        editMessageTaskErrot(code) {
            let text = ''
            switch (parseInt(code)) {
                case 3001:
                    text = '标题不能为空'
                    break;
                case 3002:
                    text = '请选择消息模板或触发器'
                    break;
                case 3003:
                    text = '请选择任务类型'
                    break;
                case 3004:
                    text = '该短信模板未启用或者不存在'
                    break;
                case 3005:
                    text = '该触发器未启用或者不存在'
                    break;
                case 3006:
                    text = '该消息任务不存在'
                    break;
                case 3007:
                    text = '启用中无法修改'
                    break;
                case 3008:
                    text = '存在已启用的同类模板任务'
                    break;
                default:
                    text = '意料之外的错误'
            }
            showToast({
                type: 'error',
                text: text
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
                    t.getMessageTask()
                }
            })
        }
    }
})