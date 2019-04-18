window.pages = (function() {
    function _page(obj) {
        this.floorpages = doc.querySelector(obj.el)
        if (!this.floorpages) {
            console.log('无此控件', this.floorpages)
            return
        }
        this.num = obj.pagenumber || 1
        this.current = obj.current || 1 //当前页面页码
        this.fn = obj.fn
        this.floorpages.innerHTML = "<span  id=\"firstprev\"  class=\"din fl\">首页</span><span  id=\"prev\" class=\"din fl\">上一页</span><ul class=\"fg-list din fl\" id=\"fglist\"></ul><span class=\"din fl\" id=\"next\" >下一页</span><span class=\"din fl\" id=\"lastnext\">尾页</span>"
        this.init()
    }
    _page.prototype.init = function() {
        this.firstprev = this.floorpages.querySelector('#firstprev')
        this.prev = this.floorpages.querySelector('#prev')
        this.next = this.floorpages.querySelector('#next')
        this.lastnext = this.floorpages.querySelector('#lastnext')
        this.fglist = this.floorpages.querySelector('#fglist')
        this.start = 1 //页码开始值
        this.pagelen = 5 //页码长度
        if (this.num <= this.pagelen) {
            this.pagelen = this.num
        }
        this.bind()
    }
    _page.prototype.bind = function() {
        // this.setli()
        // this.setcolor()
        this.setstart()
        this.setcurrent()
        this.spanclick()

    }
    _page.prototype.spanclick = function() {
        let that = this
        that.firstprev.addEventListener('click', function(e) {
            if (that.current == 1) return
            that.current = 1
            that.setstart()
        })
        that.prev.addEventListener('click', function(e) {
            if (that.current == 1) return
            that.current--;
            that.setstart()
        })
        that.next.addEventListener('click', function(e) {
            if (that.current == that.num) return
            that.current++;
            that.setstart()
        })
        that.lastnext.addEventListener('click', function(e) {
            if (that.current == that.num) return
            that.current = that.num
            that.setstart()
        })
    }
    _page.prototype.setcurrent = function() { //设置当前页面页码
        let that = this,
            lis = this.fglist.querySelectorAll('li')
        lis.forEach(function(li) {
            li.addEventListener('click', function(e) {
                that.current = parseInt(li.getAttribute('data-page'))
                that.setstart()

            })
        })
    }
    _page.prototype.setstart = function() { //设置页码开始值
        // if (this.num <= this.pagelen) return
        console.log(this.current)
        if (this.current <= 4) {
            this.start = 1
        } else if ((this.current + 2) >= this.num) {
            this.start = this.num - 4
        } else {
            this.start = this.current - 2
        }
        this.setli()
        this.setcolor()
        if (typeof this.fn == 'function') {
            this.fn(this.current)
        }
    }
    _page.prototype.setcolor = function() { //选中当前页码
        let that = this,
            lis = this.fglist.querySelectorAll('li')
        lis.forEach(function(li) {
            li.classList.remove('active')
            if (that.current == li.getAttribute('data-page')) {
                li.classList.add('active')
            }
        })
    }

    _page.prototype.setli = function() {
        let lihtml = '',
            n = this.start,
            len = n + this.pagelen
        for (let i = n; i < len; i++) {
            lihtml += '<li data-page=\"' + i + '\">' + i + '</li>'
        }
        this.fglist.innerHTML = lihtml
        this.setcurrent()
    }
    return {
        init: function(obj) {
            new _page(obj)
        }
    }
})()