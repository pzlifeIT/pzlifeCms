import { app } from '../../../index.js';
import { showToast } from '../../../js/utils.js';

new Vue({
    el: '#app',
    data: {
        modal: false,
        time: {
            start_time: '',
            stop_time: ''
        },
        title: '',
        page: 1,
        page_num: 10,
        total: 0,
        triggerId: 0,
        TriggerList: []
    },
    mounted() {
        let that = this
        that.getTrigger()
        this.setTime('#start_time', 'start_time')
        this.setTime('#stop_time', 'stop_time')
    },
    methods: {
        setTime(el, name) {
            let that = this
            calender(el).init({
                format: 'yyyy-MM-dd hh:mm:ss'
            }, function(date) {
                this.value = date
                that.time[name] = date
                console.log(that.time[name])
            })
        },
        cancel() {
            this.modal = false
        },
        showmodal() {
            this.modal = true
        },
        search() {
            this.page = 1
            this.getTrigger()
        },
        getTrigger(id = '') {
            let that = this;
            app.requests({
                url: 'ModelMessage/getTrigger',
                data: {
                    page: that.page || 1,
                    page_num: that.page_num || 10,
                    id: id
                },
                success(res) {
                    if (id != '') {
                        that.modal = true
                        let Trigger = res.Trigger || {}
                        that.triggerId = Trigger.id
                        that.title = Trigger.title
                        that.time.start_time = Trigger.start_time
                        that.time.stop_time = Trigger.stop_time
                        return
                    }
                    that.TriggerList = that.disTriggerList(res.Trigger)
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
        disTriggerList(data = []) {
            let len = data.length
            if (len == 0) return []
            for (let i = 0; i < len; i++) {
                data[i].statusText = this.getStatus(data[i].status)
            }
            return data
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
        auditTrigger(id = '', status = 0) {
            let that = this;
            app.requests({
                url: 'ModelMessage/auditTrigger',
                data: {
                    id: id,
                    status: status
                },
                success(res) {
                    showToast({
                        type: 'success',
                        text: '操作成功'
                    })
                    that.getTrigger()
                },
                Error(code) {
                    let text = ''
                    switch (parseInt(code)) {
                        case 3001:
                            text = '状态码为空'
                            break;
                        case 3002:
                            text = '格式错误'
                            break;
                        case 3003:
                            text = '该信息已进行过审核'
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
        submit() {
            let that = this,
                urlText = ''
            if (that.triggerId == 0) {
                urlText = 'ModelMessage/addTrigger'
            } else {
                urlText = 'ModelMessage/editTrigger'
            }
            app.requests({
                url: urlText,
                data: {
                    id: that.triggerId,
                    title: that.title,
                    start_time: that.time.start_time,
                    stop_time: that.time.stop_time
                },
                success(res) {
                    showToast({
                        type: 'success',
                        text: '保存成功'
                    })
                    that.modal = false
                    that.id = 0
                    that.title = ''
                    that.time.start_time = ''
                    that.time.stop_time = ''
                    that.getTrigger()
                },
                Error(code) {
                    let text = ''
                    switch (parseInt(code)) {
                        case 3001:
                            text = '标题不能为空'
                            break;
                        case 3002:
                            text = '时间格式错误'
                            break;
                        case 3003:
                            text = '结束时间不能小于开始时间'
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
                    t.getTrigger()
                }
            })
        },
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
//     }]
// })