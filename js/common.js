;
(function(win, doc) {
    win.pz = function() {

    }
    win.pz = pz.prototype
    pz.geturl = function() {
        let href = location.href,
            list = {}
        if (href.indexOf('?') != -1) {
            let params = href.split('?')[1]
            if (params.indexOf('&') != -1) {
                let arr = params.split('&'),
                    len = arr.length
                for (let i = 0; i < len; i++) {
                    if (arr[i].indexOf('=') != -1) {
                        let l = arr[i].split('=')
                        list[l[0]] = l[1]
                    }
                }
            } else if (params.indexOf('=') != -1) {
                let arr = params.split('=')
                list[arr[0]] = arr[1]
            }
        }
        return list
    }
    window.pages = (function() {
        function _page(obj) {
            this.floorpages = doc.querySelector(obj.el)
            this.num = obj.pagenumber
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
            this.current = 1 //当前页面页码
            this.start = 1 //页码开始值
            this.pagelen = 5 //页码长度
            if (this.num <= this.pagelen) {
                this.pagelen = this.num
            }
            this.bind()
        }
        _page.prototype.bind = function() {
            this.setli()
            this.setcolor()
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
            if (this.num <= this.pagelen) return
            if (this.current <= 3) {
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
    window.tab = (function() {
        function B(obj) {
            this.lis = doc.querySelector(obj.head).querySelectorAll('li')
            this.con = doc.querySelectorAll(obj.con)
            this.num = obj.num || 1
            this.init()
        };
        B.prototype = {
            init: function() {
                this.liclick();
                this.setactive(this.lis, this.num)
                this.setactive(this.con, this.num)
            },
            liclick: function() {
                let t = this,
                    i = 0;
                t.lis.forEach(function(li) {
                    i++;
                    (function(i) {
                        li.addEventListener('click', function(e) {
                            t.setactive(t.lis, i)
                            t.setactive(t.con, i)
                        })
                    }(i));
                })
            },
            setactive: function(obj, n) {
                let arr = obj,
                    i = 0;

                arr.forEach(function(li) {
                    i++;
                    li.classList.remove('active');
                    (function(i) {
                        if (i == n) {
                            li.classList.add('active');
                        }
                    }(i));
                })
            }
        }

        function c(o) {
            return new B(o)
        };
        return c
    })()
    window.select = (function() {
        function D(o) {
            this.box = doc.querySelector(o.el)
            this.box.innerHTML += '<div class="as-dropdown"><ul class="as-dropdown-menu"></ul></div>'
            this.menu = this.box.querySelector('.as-dropdown')
            this.select = this.box.querySelector('.ant-select')
            this.selection = this.box.querySelector('.ant-select-selection')
            this.data = o.data
            this.init()
        }
        D.prototype = {
            init: function() {
                this.dopen()
                this.setmenustyle()
                this.setitems()

            },
            setitems: function() { //循环出下拉框
                let str = '',
                    len = this.data.length,
                    menulist = this.menu.querySelector('ul')
                for (let i = 0; i < len; i++) {
                    if (this.data.tier == 2) {
                        this.data[i].type_name = '&nbsp;&nbsp;' + this.data[i].type_name
                    } else if (this.data.tier == 3) {
                        this.data[i].type_name = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + this.data[i].type_name
                    }
                    str += '<li class="as-dropdown-item" data-id="' + this.data[i].id + '" data-value="' + this.data[i].type_name + '" >' + this.data[i].type_name + '</li>'
                }
                menulist.innerHTML = str
                this.itemclick()
            },
            itemclick: function() { //下拉框点击事件
                let t = this,
                    lis = t.menu.querySelectorAll('li'),
                    sel = t.selection,
                    body = doc.querySelector('body')

                body.addEventListener('click', function(e) {
                    if (t.select.classList.contains('ant-select-open')) {
                        t.showmenu()
                    }
                })
                lis.forEach(function(li) {
                    li.addEventListener('click', function(e) {
                        e.stopPropagation()
                        let value = li.getAttribute('data-value'),
                            id = li.getAttribute('data-id')
                        sel.setAttribute('data-value', value)
                        sel.setAttribute('data-id', id)
                        sel.innerHTML = value
                        sel.classList.add('already-select')
                        t.showmenu()

                    })
                })
            },
            dopen: function() { //选择框点击
                let t = this,
                    top = t.menu.offsetTop,
                    body = doc.querySelector('body')
                t.select.addEventListener('click', function(e) {
                    e.stopPropagation()
                        // t.menu.style.top = top - body.scrollTop + 'px'
                    t.menu.style.top = t.box.getBoundingClientRect().top + t.box.offsetHeight + 'px'
                    t.showmenu()
                    t.setmenustyle()
                })
            },
            setmenustyle: function() { //设置下拉框的宽度和位置
                let t = this,
                    top = t.menu.offsetTop,
                    body = doc.querySelector('body')
                    // t.menu.style.top = top - body.scrollTop + 'px'
                t.menu.style.top = t.box.getBoundingClientRect().top + t.box.offsetHeight + 'px'
                t.menu.style.width = this.box.offsetWidth + 'px'
                body.addEventListener('scroll', function(e) {
                    if (!t.menu.classList.contains('active')) return
                        // top = t.menu.offsetTop
                    t.menu.style.top = t.box.getBoundingClientRect().top + t.box.offsetHeight + 'px'
                })
            },
            showmenu: function() {
                let sel = this.select,
                    menus = this.menu
                if (sel.classList.contains('ant-select-open')) {
                    sel.classList.remove('ant-select-open')
                    menus.classList.remove('active')
                } else {
                    sel.classList.add('ant-select-open')
                    menus.classList.add('active')
                }
            }
        };

        function d(o) {
            return new D(o)
        };
        return d
    })()
    window.selpicure = (function() {
        function S(o) {
            this.picures = doc.querySelector(o.el)
            this.num = o.num
            this.imglist = o.images
            this.images = []
            this.files = []
            this.imgChange = o.imgChange
            this.init()
        }
        S.prototype.init = function() {
            this.picures.innerHTML += '<ul class="picurelist"></ul><input class="file" accept="image/*" type="file" name="" id="imgFile">'
            this.file = this.picures.querySelector('.file')
            this.selfile = this.picures.querySelector('.selfile')
            this.list = this.picures.querySelector('.picurelist')
            this.bind()
        }
        S.prototype.bind = function() {
            this.filechange()
            this.disposeimg(this.imglist)
        }
        S.prototype.disposeimg = function(images) { //默认显示图片
            if (!(images instanceof Array)) return
            if (images) return
            let len = images.length,
                i
            for (i = 0; i < len; i++) {
                this.images.push(images[i].image)
            }
            this.showImg()
        }
        S.prototype.filechange = function(e) {
            let t = this
            t.selfile.addEventListener('click', function(e) {
                t.file.click()
            })
            t.file.addEventListener('change', function(e) {
                if (t.file.files.length < 1) return
                if (t.num == 1) {
                    t.files = []
                }
                t.disposefiles(t.file.files)
                t.imgChange(t.file.files)
            })
        }
        S.prototype.disposefiles = function(files) {
            let len3 = files.length
            for (let y = 0; y < len3; y++) {
                this.files.push(files[y])
            }
            this.disposeimages()
        }
        S.prototype.disposeimages = function() {
            let len = this.files.length
            this.images = []
            for (let i = 0; i < len; i++) {
                this.images.push(this.getObjectURL(this.files[i]))
            }
            this.showImg()
        }
        S.prototype.showImg = function() {
            let str = '',
                len = this.images.length
            for (let i = 0; i < len; i++) {
                str += '<li><img src="' + this.images[i] + '" alt=""></li>'
            }
            this.list.innerHTML = str
        }
        S.prototype.getObjectURL = function(file) {
            var url = null
            if (window.createObjectURL != undefined) { // basic  
                url = window.createObjectURL(file)
            } else if (window.URL != undefined) { // mozilla(firefox)  
                url = window.URL.createObjectURL(file)
            } else if (window.webkitURL != undefined) { // webkit or chrome  
                url = window.webkitURL.createObjectURL(file)
            }
            return url
        }

        function s(o) {
            return new S(o)
        }
        return s
    }())
    pz.multistage = (function() {
        function _ME(o) {
            this.el = document.querySelector(o.el)
            this.ellink = document.querySelector(o.ellink)
            this.data = o.data
            this.init()
        }
        _ME.prototype.init = function() {
            this.setlist(this.data)
            this.elclick()
            this.place()
        }
        _ME.prototype.elclick = function() {
            let t = this
            t.el.addEventListener('click', function(e) {
                e.stopPropagation()
                if (t.ellink.classList.contains('hide')) {
                    t.place()
                    t.ellink.classList.remove('hide')
                } else {

                    t.ellink.classList.add('hide')
                }

            })
            document.querySelector('body').addEventListener('click', function(e) {
                t.ellink.classList.add('hide')
            })
            t.ellink.addEventListener('click', function(e) {
                e.stopPropagation()
            })
        }
        _ME.prototype.place = function() {
            let rect = this.el.getBoundingClientRect()
            this.ellink.style.top = rect.top + rect.height + 'px'
            this.ellink.style.left = rect.left + 'px'
        }
        _ME.prototype.setlist = function(data) { //循环输出数据
            let str = '',
                len = data.length,
                len1, len2, i, x, y
            for (i = 0; i < len; i++) {
                str += '<div class="one-li">'
                str += '<span class="one-text le-text" data-id="' + data[i].id + '" >' + data[i].name + '</span>'
                if (data[i].hasOwnProperty('_child')) {
                    len1 = data[i]._child.length
                    str += '<div class="le-two">'
                    for (x = 0; x < len1; x++) {
                        str += '<div class="two-li">'
                        str += '<span class="two-text le-text" data-id="' + data[i]._child[x].id + '" >' + data[i]._child[x].name + '</span>'
                        if (data[i]._child[x].hasOwnProperty('_child')) {
                            len2 = data[i]._child[x]._child.length
                            str += '<div class="le-three">'
                            for (y = 0; y < len2; y++) {
                                str += '<div class="">'
                                str += '<span class="le-text noafter" data-id="' + data[i]._child[x]._child[y].id + '" >' + data[i]._child[x]._child[y].name + '</span>'
                                str += '</div>'
                            }
                            str += '</div>'
                        }
                        str += '</div>'
                    }
                    str += '</div>'
                }
                str += '</div>'
            }
            this.ellink.innerHTML = str;
            this.clicksel()
        }
        _ME.prototype.clicksel = function() {
            let t = this,
                sels = t.ellink.querySelectorAll('.noafter');
            sels.forEach(function(li) {
                li.addEventListener('click', function(e) {
                    t.el.setAttribute('data-id', li.getAttribute('data-id'))
                    t.el.innerHTML = li.innerHTML
                    t.ellink.classList.add('hide')
                })
            })
        }
        return {
            init: function(o) {
                new _ME(o)
            }
        }
    })()
})(window, document)