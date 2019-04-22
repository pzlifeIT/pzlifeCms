import { app } from '../index.js';
new Vue({
    el: '#app',
    data: {
        urlList: [{
            name: '权限管理',
            show: false,
            iconPath: 'icon4',
            selectedIconPath: 'icon3',
            _child: [{
                path: 'page/jurisdiction/member/member.html',
                name: '成员管理'
            }]
        }, {
            name: '金额管理',
            show: false,
            iconPath: 'icon6',
            selectedIconPath: 'icon5',
            _child: [{
                path: 'page/money/recharge/recharge.html',
                name: '充值管理'
            }, {
                path: 'page/money/becomeBoss/becomeBoss.html',
                name: '开通boss'
            }, {
                path: 'page/money/upgradeBoss/upgradeBoss.html',
                name: '邀请成为boss'
            }, {
                path: 'page/money/cardbag/cardbag.html',
                name: '卡包'
            }, {
                path: 'page/money/withdraw/withdraw.html',
                name: '佣金提现'
            }, {
                path: 'page/money/bounty/bounty.html',
                name: '奖励金提现'
            }, {
                path: 'page/money/bountyList/bountyList.html',
                name: '奖励金列表'
            }, {
                path: 'page/money/addbankcard/addbankcard.html',
                name: '添加银行'
            }]
        }, {
            name: '会员管理',
            show: false,
            iconPath: 'icon8',
            selectedIconPath: 'icon7',
            _child: [{
                path: 'page/member/memberList/memberList.html',
                name: '会员列表'
            }]
        }, {
            name: '订单',
            show: false,
            iconPath: 'icon10',
            selectedIconPath: 'icon9',
            _child: [{
                path: 'page/order/order/orderlist.html',
                name: '商品订单管理'
            }]
        }, {
            name: '商品管理',
            show: false,
            iconPath: 'icon12',
            selectedIconPath: 'icon11',
            _child: [{
                path: 'page/goods/supplier/supplier.html',
                name: '供应商管理'
            }, {
                path: 'page/goods/goods/goods.html',
                name: '商品库'
            }, {
                path: 'page/goods/goodsclassify/goodsclassify.html',
                name: '商品分类'
            }, {
                path: 'page/goods/size/size.html',
                name: '规格属性'
            }, {
                path: 'page/goods/subject/subject.html',
                name: '专题'
            }]
        }, {
            name: '活动管理',
            show: false,
            iconPath: 'icon14',
            selectedIconPath: 'icon13',
            _child: [{
                path: 'page/diamond/acquire/acquire.html',
                name: 'BOSS分享钻石卡'
            }]
        }, {
            name: '广告位管理',
            show: false,
            iconPath: 'icon16',
            selectedIconPath: 'icon15',
            _child: [{
                path: 'page/advertising/advertising/advertising.html',
                name: '广告位管理'
            }]
        }],
        navList: [{
            name: 'workbench',
            text: '首页',
            show: true,
            index: true
        }],
        iframeList: [{
            name: 'workbench',
            path: 'workbench.html',
            show: true
        }],
        select_menu: false,
        admininfo: {}
    },
    mounted() {
        this.getadmininfo()
    },
    methods: {
        getadmininfo() {
            let that = this;
            app.requests({
                url: "admin/getadmininfo",
                data: {
                    cms_con_id: localStorage.getItem("cms_con_id") || ""
                },
                success(res) {
                    that.admininfo = res.data;
                    localStorage.setItem("admininfo", JSON.stringify(res.data));
                }
            })
        },
        quit() {
            app.globalData.cms_con_id = ''
            localStorage.setItem("cms_con_id", '')
            window.location.href = window.location.origin + '/page/user/login/login.html'
        },
        hideMenu() {
            this.select_menu = false
        },
        showMenu() {
            if (this.select_menu) {
                this.select_menu = false
            } else {
                this.select_menu = true
            }
        },
        changePassword() {
            this.addIframe('修改密码', 'page/user/alterpwd/alterpwd.html')
            this.select_menu = false
        },
        subclick(k) {
            let list = this.urlList,
                len = list.length,
                show = false;
            if (!list[k].show) {
                show = true
            }
            for (let i = 0; i < len; i++) {
                list[i].show = false
            }
            if (show) {
                list[k].show = true
            }
            this.urlList = list
        },
        addIframe(text, name) {
            let pname = name.split('.')[0];
            if (this.isexist(pname)) {
                this.showIframe(pname)
                return
            }
            this.hideIframe()
            let nav = {},
                iframe = {};
            nav = {
                name: pname,
                text: text,
                show: true
            }
            iframe = {
                name: pname,
                path: name,
                show: true
            }
            this.navList.push(nav)
            this.iframeList.push(iframe)
        },
        isexist(name) {
            let nlist = this.navList,
                len = nlist.length;
            for (let i = 0; i < len; i++) {
                if (nlist[i].name === name) {
                    return true
                }
            }
            return false
        },
        showIframe(name) {
            this.hideIframe()
            this.navList = this.disshowIframe(this.navList, name)
            this.iframeList = this.disshowIframe(this.iframeList, name)
        },
        disshowIframe(list, name) {
            let len = list.length;
            for (let i = 0; i < len; i++) {
                if (list[i].name === name) {
                    list[i].show = true
                    break;
                }
            }
            return list
        },
        hideIframe() {
            this.navList = this.dishideIframe(this.navList)
            this.iframeList = this.dishideIframe(this.iframeList)
        },
        dishideIframe(list) {
            let len = list.length;
            for (let i = 0; i < len; i++) {
                list[i].show = false
            }
            return list
        },
        delIframe(name) {
            this.navList = this.disdelIframe(this.navList, name)
            this.iframeList = this.disdelIframe(this.iframeList, name)
        },
        disdelIframe(list, name) {
            let len = list.length;
            for (let i = 0; i < len; i++) {
                if (list[i].name === name) {
                    if (list[i].show) {
                        list = this.delShowIframe(list, i - 1)
                    }
                    list[i].name = ''
                    list[i].del = true
                    break;
                }
            }
            return list
        },
        delShowIframe(list, k) {
            for (let i = k; i > 0; i--) {
                if (!list[i].del) {
                    list[i].show = true
                    break;
                }
            }
            return list
        }
    }
});

(function() {
    // app.getadmininfo(true)
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
                }, 200)

                _this.userstatus.addEventListener('click', function(e) {
                    e.stopPropagation()
                    _this.menutatus.classList.remove('hide')
                })
                document.querySelector('body').onclick = function(e) {
                    _this.menutatus.classList.add('hide')
                }
                document.querySelector('#exitlogin').addEventListener('click', function() {
                    app.globalData.cms_con_id = ''
                    localStorage.setItem("cms_con_id", '')
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
                    clearInterval(s)
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
        // Tab.init()
})()