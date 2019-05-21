import { app } from '../index.js';
new Vue({
    el: '#app',
    data: {
        menuList: [],
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
        this.getmenuList()
    },
    methods: {
        getmenuList() {
            let that = this;
            app.requests({
                url: "admin/cmsmenu",
                success(res) {
                    that.menuList = that.addshow(res.data)
                }
            })
        },
        addshow(data = []) {
            let arr = data,
                len = arr.length;
            for (let i = 0; i < len; i++) {
                arr[i].show = false
            }
            return arr
        },
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
            let list = this.menuList,
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
            this.menuList = list
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
            for (let i = k; i >= 0; i--) {
                if (!list[i].del) {
                    list[i].show = true
                    break;
                }
            }
            return list
        }
    }
});