;
(function(pz) {
    pz.acquire = (function() {
        function _AE(o) {
            this.page = 1
            this.totle = 0
            this.init()
        }
        _AE.prototype = {
            init: function() { //进入执行
                this.getBossShareDiamondvip({})
            },
            getBossShareDiamondvip: function(data) {
                let t = this
                quest.requests({
                    url: 'getBossShareDiamondvip',
                    data: {
                        page: data.page || 1,
                        pagenum: data.pagenum || 10
                    },
                    success: function(res) {
                        t.setList(res.data)
                        if (t.totle == res.totle) return
                        t.totle = res.totle
                        t.setpage()
                    },
                    error: function(code) {

                    }
                })
            },
            setpage: function() {
                let t = this,
                    totle = Math.ceil(parseInt(t.totle) / 10)
                pages.init({
                    el: '#floorpages',
                    pagenumber: totle,
                    fn: function(n) {
                        t.page = n
                        t.getBossShareDiamondvip({
                            page: n
                        })
                    }
                })
            },
            setList: function(data) {
                let t = this,
                    len = data.length,
                    i, str = "",
                    btn = ''
                for (i = 0; i < len; i++) {
                    data[i].redmoneyStatusText = t.getRedmoneyStatus(data[i].redmoney_status)
                    data[i].typeText = t.getType(data[i].type)
                    data[i].statusText = t.getStatus(data[i].status)
                    if (data[i].status == 0) {
                        btn = '<div class="pz-btn btn-amend" data-id="' + data[i].id + '" >审核通过</div><div class="pz-btn btn-del" data-id="' + data[i].id + '">审核不通过</div>'
                    } else {
                        btn = ''
                    }
                    str += '<div class="table-tr">'
                    str += '<span class="col-md-1 bot-bor subli">' + (i + 1) + '</span>'
                    str += '<span class="col-md-1 bot-bor subli">' + data[i].linkman + '</span>'
                    str += '<span class="col-md-1 bot-bor subli">' + data[i].shopid + '</span>'
                    str += '<span class="col-md-1 bot-bor subli">' + data[i].stock + '</span>'
                    str += '<span class="col-md-1 bot-bor subli">' + data[i].num + '</span>'
                    str += '<span class="col-md-1 bot-bor subli">' + data[i].coupon_money + '</span>'
                    str += '<span class="col-md-1 bot-bor subli">' + data[i].redmoneyStatusText + '</span>'
                    str += '<span class="col-md-1 bot-bor subli">' + data[i].typeText + '</span>'
                    str += '<span class="col-md-1 bot-bor subli">' + data[i].create_time + '</span>'
                    str += '<span class="col-md-1 bot-bor subli">' + data[i].statusText + '</span>'
                    str += '<span class="col-md-2 bot-bor subli">' + btn + '</span>'
                    str += '</div>'
                }
                document.querySelector('#aelist').innerHTML = str
                this.auditPass()
                this.auditnoPass()
            },
            auditPass: function() {
                let t = this,
                    pass = document.querySelectorAll('.btn-amend')
                pass.forEach(function(li) {
                    li.addEventListener('click', function(e) {
                        let id = li.getAttribute('data-id')
                        t.passBossShareDiamondvip({
                            id: id,
                            status: 1
                        })
                    })
                })
            },
            auditnoPass: function() {
                let t = this,
                    pass = document.querySelectorAll('.btn-del')
                pass.forEach(function(li) {
                    li.addEventListener('click', function(e) {
                        let id = li.getAttribute('data-id')
                        t.passBossShareDiamondvip({
                            id: id,
                            status: 2
                        })
                    })
                })
            },
            passBossShareDiamondvip: function(data) {
                let t = this
                if (data.id == '' || data.id == null) return
                quest.requests({
                    url: 'passBossShareDiamondvip',
                    data: {
                        id: data.id,
                        status: data.status
                    },
                    success: function(res) {
                        t.getBossShareDiamondvip({
                            page: t.page
                        })
                    },
                    error: function(code) {

                    }
                })
            },
            getRedmoneyStatus: function(n) {
                let text = ''
                switch (parseInt(n)) {
                    case 1:
                        text = '直接领取'
                        break;
                    case 2:
                        text = '直接领取'
                        break;
                    default:
                        text = '其他状态'
                        break
                }
                return text
            },
            getType: function(n) {
                let text = ''
                switch (parseInt(n)) {
                    case 1:
                        text = '分享使用'
                        break;
                    case 2:
                        text = '分享使用'
                        break;
                    default:
                        text = '其他状态'
                        break
                }
                return text
            },
            getStatus: function(n) {
                let text = ''
                switch (parseInt(n)) {
                    case 0:
                        text = '申请中'
                        break;
                    case 1:
                        text = '审核通过'
                        break;
                    case 2:
                        text = '不通过'
                        break;
                    case 3:
                        text = '次数已用完'
                        break;
                    default:
                        text = '其他状态'
                        break;
                }
                return text
            },
        }
        return {
            init: function(o) {
                return new _AE(o)
            }
        }
    })()
})(window.pz)