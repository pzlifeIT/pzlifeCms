import { app } from '../../../index.js';
import { showToast, downloadIamge } from '../../../js/utils.js';

new Vue({
    el: '#app',
    data: {
        offline: {},
        offlineId: '',
        offlineTitle: '',
        modal: false,
        qrcodeModal: false,
        download: false,
        qrCodePath: '',
        offlineList: [],
        total: 0,
        page: 1,
        pid: ''
    },
    mounted() {
        this.setTime('#start_time', 'start_time')
        this.setTime('#stop_time', 'stop_time')
        this.getOfflineList()
    },
    methods: {
        cancel() {
            this.modal = false
        },
        showModal() {
            this.modal = true
            let that = this
            selpicure({
                el: '#selpicure1',
                images: [],
                imgChange: function(images) {
                    that.offline.image_path = images[0].image;
                }
            })
        },
        setTime(el, name) {
            let that = this
            calender(el).init({
                format: 'yyyy-MM-dd hh:mm:ss'
            }, function(date) {
                this.value = date
                that.offline[name] = date
                console.log(that.offline[name])
            })
        },
        showqrcodeModal(id, tit) {
            this.offlineId = id
            this.offlineTitle = tit
            this.qrcodeModal = true
            this.download = false
            this.pid = ''
        },
        qrcodecancel() {
            this.offlineId = ''
            this.offlineTitle = ''
            this.qrcodeModal = false
        },
        getQRcode() {
            let that = this
            if (that.pid == '') {
                showToast({
                    text: '分享者id不能为空'
                })
                return
            }
            app.requests({
                url: 'OfflineActivities/resetOfflineActivitiesQrcode',
                data: {
                    id: that.offlineId,
                    uid: that.pid
                },
                type: 'GET',
                success(res) {
                    that.qrCodePath = res.Qrcode
                    that.download = true
                },
                Error(code) {
                    let text = ''
                    switch (parseInt(code)) {
                        case 3001:
                            text = 'con_id长度只能是28位'
                            break;
                        case 3002:
                            text = '分享者id不能为空'
                            break;
                        case 3003:
                            text = 'scene不能为空'
                            break;
                        case 3004:
                            text = '获取access_token失败'
                            break;
                        case 3005:
                            text = '未获取到access_token'
                            break;
                        case 3006:
                            text = '生成二维码失败'
                            break;
                        case 3007:
                            text = 'scene最大长度32'
                            break;
                        case 3008:
                            text = 'page不能为空'
                            break;
                        case 3009:
                            text = '微信错误'
                            break;
                        case 30011:
                            text = '上传失败'
                            break;
                        case 30012:
                            text = '该会员不存在'
                            break;
                        default:
                            text = '意料之外的错误'
                            break;
                    }
                    showToast({
                        text: text
                    })
                }
            })
        },
        qrCodeDownload() {
            downloadIamge(this.qrCodePath, this.offlineTitle)
        },
        getOfflineList() {
            let that = this
            app.requests({
                url: 'OfflineActivities/getOfflineActivities',
                data: {
                    page: that.page,
                    pagenum: 10
                },
                success(res) {
                    that.offlineList = res.result || []
                    if (that.total == res.total) return
                    that.total = res.total
                    that.setpage()
                },
                Error(code) {
                    showToast({
                        text: '获取失败'
                    })
                }
            })
        },
        goGoods(id) {
            window.location.href = 'goods/goods.html?offlineId=' + id
        },
        submit() {
            let that = this
            if (!that.offline.title) {
                showToast({
                    text: '请输入标题'
                })
                return
            }
            if (!that.offline.start_time) {
                showToast({
                    text: '请选择开始时间'
                })
                return
            }
            if (!that.offline.stop_time) {
                showToast({
                    text: '请选择结束时间'
                })
                return
            }
            if (!that.offline.image_path) {
                showToast({
                    text: '请上传图片'
                })
                return
            }
            app.requests({
                url: 'OfflineActivities/addOfflineActivities',
                data: that.offline,
                success(res) {
                    showToast({
                        type: 'success',
                        text: '添加成功'
                    })
                    that.modal = false
                    that.offline = {}
                    that.getOfflineList()
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
                        case 3004:
                            text = '请上传图片'
                            break;
                        default:
                            text = '意料之外的错误'
                            break;
                    }
                    showToast({
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
        }
    }
})