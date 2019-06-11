import { app } from '../../../index.js';
import { showToast } from '../../../js/utils.js';

new Vue({
    el: '#app',
    data: {
        winnerList: [],
        total: 0,
        page: 1
    },
    mounted() {
        this.getWinnerList();
    },
    methods: {
        getWinnerList() {
            let that = this
            app.requests({
                url: 'OfflineActivities/getWinnerList',
                data: {
                    page: that.page,
                    pagenum: 10
                },
                success(res) {
                    that.winnerList = that.disWinnerList(res.WinnerList)
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
        disWinnerList(data = []) {
            let arr = data,
                len = arr.length;
            if (len === 0) return arr;
            for (let i = 0; i < len; i++) {
                arr[i].statusText = this.getStatusText(arr[i].status)
            }
            return arr
        },
        getStatusText(n = 0) {
            let text = '';
            switch (parseInt(n)) {
                case 1:
                    text = '未领取';
                    break;
                case 2:
                    text = '已领取';
                    break;
            }
            return text
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
                    t.getWinnerList()
                }
            })
        }
    }
})