import { app } from '../../../../index.js';
import { showToast, geturl } from '../../../../js/utils.js';

new Vue({
    el: '#app',
    data: {
        goodId: '',
        goodList: [],
        modal: false,
        offlineId: '',
        offlineInfo: {},
        id: 0,
        total: 0,
        page: 1
    },
    mounted() {
        this.setTime('#start_time', 'start_time')
        this.setTime('#stop_time', 'stop_time')
        this.offlineId = geturl().offlineId
        this.getGoodList()
        this.getOfflineInfo()
    },
    methods: {
        cancel() {
            this.modal = false
        },
        showModal() {
            this.modal = true
            this.goodId = ''
            this.id = ''
        },
        setTime(el, name) {
            let that = this
            calender(el).init({
                format: 'yyyy-MM-dd hh:mm:ss'
            }, function(date) {
                this.value = date
                that.offlineInfo[name] = date
            })
        },
        getGoodInfo(id, goodid) {
            this.id = id
            this.goodId = goodid
            this.modal = true
        },
        getOfflineInfo() {
            let that = this
            app.requests({
                url: 'OfflineActivities/getOfflineActivities',
                data: {
                    id: that.offlineId
                },
                success(res) {
                    that.offlineInfo = res.result || {}
                    let image_path = res.result.image_path
                    that.offlineInfo.image_path = ''
                    selpicure({
                        el: '#selpicure1',
                        images: [{ image: image_path }],
                        imgChange: function(images) {
                            that.offlineInfo.image_path = images[0].image;
                        }
                    })

                },
                Error(code) {
                    showToast({
                        text: '获取出错'
                    })
                }
            })
        },
        offlineSumbit() {
            let that = this
            if (!that.offlineInfo.title) {
                showToast({
                    text: '请输入标题'
                })
                return
            }
            if (!that.offlineInfo.start_time) {
                showToast({
                    text: '请选择开始时间'
                })
                return
            }
            if (!that.offlineInfo.stop_time) {
                showToast({
                    text: '请选择结束时间'
                })
                return
            }
            app.requests({
                url: 'OfflineActivities/updateOfflineActivities',
                data: that.offlineInfo,
                success(res) {
                    showToast({
                        type: 'success',
                        text: '保存成功'
                    })
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
                    that.getOfflineInfo()
                }
            })
        },
        getGoodList() {
            let that = this
            app.requests({
                url: 'OfflineActivities/getOfflineActivitiesGoods',
                data: {
                    active_id: that.offlineId,
                    page: that.page,
                    pagenum: 10
                },
                success(res) {
                    that.goodList = that.disGoodList(res.result) || []
                    if (that.total == res.total) return
                    that.total = res.total
                    that.setpage()
                },
                Error(code) {
                    let text = ''
                    switch (parseInt(code)) {
                        case 3000:
                            text = '该活动不存在'
                            break;
                        case 3001:
                            text = '该活动已过期'
                            break;
                        case 3002:
                            text = '商品已下架或者不存在'
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
        disGoodList(data = []) {
            let len = data.length;
            if (len === 0) return
            for (let i = 0; i < len; i++) {
                data[i].statusText = this.getStatus(data[i].goods.status)
            }
            return data
        },
        getStatus(n) {
            if (n == 1) {
                return '上架中'
            } else {
                return '已下架'
            }
        },
        goodSubmit() {
            let that = this
            if (!that.goodId) {
                showToast({
                    text: '请输入商品id'
                })
                return
            }
            if (that.id) {
                this.updateOfflineGood()
            } else {
                this.addOfflineGood()
            }
        },
        addOfflineGood() {
            let that = this
            app.requests({
                url: 'OfflineActivities/addOfflineActivitiesGoods',
                data: {
                    active_id: that.offlineId,
                    goods_id: that.goodId
                },
                success(res) {
                    showToast({
                        type: 'success',
                        text: '添加成功'
                    })
                    that.modal = false
                    that.getGoodList()
                },
                Error(code) {
                    let text = ''
                    switch (parseInt(code)) {
                        case 3000:
                            text = '该活动不存在'
                            break;
                        case 3001:
                            text = '该活动已过期'
                            break;
                        case 3002:
                            text = '商品已下架或者不存在'
                            break;
                        case 3003:
                            text = '商品已存在'
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
        updateOfflineGood() {
            let that = this
            app.requests({
                url: 'OfflineActivities/updateOfflineActivitiesGoods',
                data: {
                    active_id: that.offlineId,
                    goods_id: that.goodId,
                    id: that.id
                },
                success(res) {
                    showToast({
                        type: 'success',
                        text: '修改成功'
                    })
                    that.modal = false

                    that.getGoodList()
                },
                Error(code) {
                    let text = ''
                    switch (parseInt(code)) {
                        case 3000:
                            text = '该活动不存在'
                            break;
                        case 3001:
                            text = '该活动已过期'
                            break;
                        case 3002:
                            text = '商品已下架或者不存在'
                            break;
                        case 3003:
                            text = '商品已存在'
                            break;
                        case 3004:
                            text = '商品id不规范'
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