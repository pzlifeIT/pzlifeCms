;
(function(pz) {
    pz.goods = (function() {
        function _GD(o) {
            this.goodlist = document.querySelector('#goodlist')
            this.page = 1
            this.totle = 0
            this.init()
        }
        _GD.prototype = {
            init: function() {
                this.getgoodslist({})
            },
            getgoodslist: function(o) {
                let t = this
                quest.requests({
                    url: 'getgoodslist',
                    data: {
                        page: o.page || 1,
                        pagenum: o.pagenum || 10
                    },
                    success: function(res) {
                        t.setGlul(res.data)
                        if (t.totle == res.total) return
                        t.totle = res.total
                        t.setpage()
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
                        t.getgoodslist({
                            page: n
                        })
                    }
                })
            },
            setGlul: function(data) {
                let len = data.length,
                    i, str = ''
                for (i = 0; i < len; i++) {
                    str += '<li><span class="col-md-1 bot-bor subli">' + data[i].id + '</span>'
                    str += '<span class="col-md-2 bot-bor subli">图片</span>'
                    str += '<span class="col-md-1 bot-bor subli">' + data[i].goods_name + '</span>'
                    str += '<span class="col-md-1 bot-bor subli">' + this.getgoods_type(data[i].goods_type) + '</span>'
                    str += '<span class="col-md-2 bot-bor subli">' + data[i].subtitle + '</span>'
                    str += '<span class="col-md-1 bot-bor subli">' + data[i].supplier + '</span>'
                    str += '<span class="col-md-1 bot-bor subli">' + data[i].cate + '</span>'
                    str += '<span class="col-md-1 bot-bor subli"><span class="ant-switch up-down ant-switch-checked"></span></span>'
                    str += '<span class="col-md-2 bot-bor subli"><a class="pz-btn btn-amend" href="goodsoperation.html?id=' + data[i].id + '">编辑</a>\
                    <div class="pz-btn btn-del" href="#">删除</div></span>'
                    str += '</li>'
                }
                this.goodlist.innerHTML = str
            },
            getgoods_type: function(n) {
                if (n = 1) {
                    return '实物商品'
                } else if (n = 2) {
                    return '虚拟商品'
                }
            }
        }
        return {
            init: function(o) {
                return new _GD(o)
            }
        }
    })()
})(window.pz)