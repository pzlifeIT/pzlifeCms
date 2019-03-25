import { app } from '../index.js';;
(function() {
    app.getadmininfo()
    var Tab = (function() {
        function _Tab() {
            this.sidebar = document.querySelector('#sidebar');
            this.content = document.querySelector('#content');
            this.userstatus = document.querySelector('#userstatus');
            this.username = document.querySelector('#username');
            this.menutatus = document.querySelector('#dropdown-menu');
            this.tabLis = this.sidebar.querySelectorAll('.sb_li');
            this.subUls = this.sidebar.querySelectorAll('.sb_sub_list');
            this.titul = document.querySelector('.r_tit_ul');
            this.menuli = this.menutatus.querySelectorAll('.menu-li')
            this.init();
        }
        _Tab.prototype.init = function() {
            this.bind();
            this.workbench()
        }
        _Tab.prototype.bind = function() {
            var _this = this;
            let st = setInterval(function() {
                console.log(app.globalData.admininfo.admin_name)
                if (app.globalData.admininfo.admin_name) {
                    _this.username.innerHTML = app.globalData.admininfo.admin_name
                    if (app.globalData.admininfo.stype == 1) {
                        _this.userstatus.innerHTML = '管理员'
                    } else if (app.globalData.admininfo.stype == 2) {
                        _this.userstatus.innerHTML = '超级管理员'
                    }
                    clearInterval(st)
                }
            }, 1000)

            _this.userstatus.addEventListener('click', function(e) {
                e.stopPropagation()
                _this.menutatus.classList.remove('hide')
            })
            document.querySelector('body').onclick = function(e) {
                _this.menutatus.classList.add('hide')
            }
            document.querySelector('#exitlogin').addEventListener('click', function() {
                app.globalData.cms_con_id = ''
                window.location.href = window.location.origin + '/page/user/login/login.html'
            })
            _this.tabLis.forEach(function(tabLi) {
                let a = tabLi.querySelector('.sb_tit')
                a.addEventListener('click', function(e) {
                    let t = _this.hasactive(tabLi)
                    _this.setsbli()
                    if (t) return
                    tabLi.classList.add('active')
                })
            });
            this.menuli.forEach(function(li) {
                li.addEventListener('click', function(e) {
                    let url = li.getAttribute("data-url"),
                        name = li.getAttribute("data-name"),
                        urlname = _this.getUrl(url)
                    _this.setiframe(url, urlname)
                    _this.setli(name, urlname)
                    _this.hideIframe(urlname)
                    _this.settit(urlname)
                    _this.titleli()
                })
            });
            _this.subUls.forEach(function(subul) {
                let lis = subul.querySelectorAll('li')
                lis.forEach(function(li) {
                    li.addEventListener('click', function(e) {
                        let url = li.getAttribute("data-url"),
                            name = li.getAttribute("data-name"),
                            urlname = _this.getUrl(url)
                        _this.setiframe(url, urlname)
                        _this.setli(name, urlname)
                        _this.hideIframe(urlname)
                        _this.settit(urlname)
                        _this.titleli()
                    })
                })
            })
        }
        _Tab.prototype.workbench = function() {
            let _this = this,
                that = this
            that.wbs = ''
            let s = setInterval(function() {
                that.wbs = document.getElementById('workbench').contentWindow.document.querySelectorAll('.wb-li')
                if (that.wbs.length > 0) {
                    that.wbs.forEach(function(li) {
                        li.addEventListener('click', function(e) {
                            let url = li.getAttribute("data-url"),
                                name = li.getAttribute("data-name")
                            if (!url) return
                            if (!name) return
                            let urlname = _this.getUrl(url)
                            _this.setiframe(url, urlname)
                            _this.setli(name, urlname)
                            _this.hideIframe(urlname)
                            _this.settit(urlname)
                            _this.titleli()
                        })
                    })
                }
            }, 100)

        }
        _Tab.prototype.hasactive = function(li) { //是否已经有active
            if (li.classList.contains('active')) {
                return true
            } else {
                return false
            }
        }

        _Tab.prototype.setsbli = function() { //去除所有的active
            var _this = this;
            _this.tabLis.forEach(function(tabLi) {
                tabLi.classList.remove('active')
            })
        }

        _Tab.prototype.settit = function(name) { //选中的导航标签设置active
            let _this = this
            let titli = _this.titul.querySelectorAll('.r_tit_li')
            titli.forEach(function(li) {
                let liname = li.getAttribute("name")
                if (liname == name) {
                    li.classList.add('active')
                } else {
                    li.classList.remove('active')
                }
            })
        }

        _Tab.prototype.titleli = function() { //点击导航标签选中iframe
            let _this = this
            let titli = _this.titul.querySelectorAll('.r_tit_li')
            titli.forEach(function(li) {
                let name = li.getAttribute("name")
                li.addEventListener('click', function(e) {
                    _this.hideIframe(name)
                    _this.settit(name)
                })
                let i = li.querySelector('i')
                if (!i) return
                i.addEventListener('click', function(e) {
                    e.stopPropagation()
                    let brother = ''
                    if (li.nextSibling) {
                        brother = li.nextSibling.getAttribute("name")
                    } else {
                        brother = li.previousElementSibling.getAttribute("name")
                    }
                    _this.clearli(name)
                    _this.cleariframe(name)
                    _this.hideIframe(brother)
                    _this.settit(brother)
                })
            })
        }
        _Tab.prototype.clearli = function(name) { //清除标题
            if (!this.exist('.r_tit_li', name)) return
            let li = this.titul.querySelector("li[name='" + name + "']")
            li.parentNode.removeChild(li)
        }

        _Tab.prototype.cleariframe = function(name) {
            if (!this.exist('.J_iframe', name)) return
            let iframe = this.content.querySelector(".J_iframe[name='" + name + "']")
            iframe.parentNode.removeChild(iframe)
        }

        _Tab.prototype.setli = function(name, urlname) { //添加标题头
            if (this.exist('.r_tit_li', urlname)) return
            this.titul.innerHTML += '<li class="r_tit_li" name="' + urlname + '">' + name + '<i></i></li>'
        }

        _Tab.prototype.setiframe = function(url, urlname) { //清除iframe
            if (this.exist('.J_iframe', urlname)) return
            this.content.innerHTML += '<iframe class="J_iframe" name="' + urlname + '" width="100%" height="100%" src="' + url + '" frameborder="0" seamless></iframe>'
        }

        _Tab.prototype.getUrl = function(url) {
            let urls = url.split('.')
            return urls[0]
        }

        _Tab.prototype.exist = function(ca, name) { //根据查看控件是否已经存在
            let lis = document.querySelectorAll(ca),
                t = false;
            lis.forEach(function(li) {
                if (name == li.getAttribute('name')) {
                    t = true
                    return t
                }
            })
            return t
        }

        _Tab.prototype.hideIframe = function(name) { //隐藏未选中的iframe
            let lis = document.querySelectorAll('.J_iframe'),
                that = this
            lis.forEach(function(li) {
                if (name == li.getAttribute('name')) {
                    li.style.display = 'block'
                    if (name == 'workbench') {
                        that.workbench()
                    }
                } else {
                    li.style.display = 'none'
                }
            })
        }
        return {
            init: function() {
                new _Tab()
            }
        }
    })()
    Tab.init()
})()