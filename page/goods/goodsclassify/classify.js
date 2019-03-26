import { app } from '../../../index.js';
import { showToast } from '../../../js/utils.js';
(function(win) {

    pz.goodsclassify = (function() {
        function _GC() {
            this.classcompile = document.querySelector('#classcompile');
            this.classadd = document.querySelector('#classadd');
            this.selClass = document.querySelector('#selClass')
            this.id = ''
            this.status = '1'
            this.init();
        }
        _GC.prototype.init = function() {
            this.getcatelist();
            this.savecompile();
            this.hidenew(this.classcompile);
            this.hidenew(this.classadd);
            this.wapper(this.classcompile)
            this.wapper(this.classadd)
            this.elclick()
        }
        _GC.prototype.elclick = function() {
            let t = this
            document.querySelector('#saveNew').onclick = function(e) {
                t.savenew()
            }
            document.querySelector('#addbtn').onclick = function(e) {
                t.gettwocategory()
                t.selClass.setAttribute('data-id', '')
                t.selClass.innerHTML = '请选择'
                t.caname = ''
                t.showel(t.classadd)
            }
        }
        _GC.prototype.getcatelist = function() { //数据循环到页面
            let t = this
            app.requests({
                data: {
                    type: 3
                },
                url: 'category/allCateList',
                success: function(res) {
                    t.setglul(res.data);
                    t.comp()
                },
                Error(code) {
                    showToast({
                        text: '获取失败'
                    })
                }
            });
        }

        _GC.prototype.gettwocategory = function() {
            let t = this;
            app.requests({
                url: 'category/addcatepage',
                success: function(res) {
                    pz.multistage.init({
                        el: '#selClass',
                        ellink: '.linkage',
                        name: 'type_name',
                        data: distwocategory(res.data || [])
                    })
                },
                Error(code) {
                    showToast({
                        text: '获取失败'
                    })
                }
            })
        }
        _GC.prototype.savenew = function() {
            let t = this,
                params = {};
            console.log(document.querySelector('#nameNew').value)
            params.type_name = document.querySelector('#nameNew').value
            params.pid = document.querySelector('#selClass').getAttribute('data-id')
            params.status = t.status
            t.saveaddcate({
                data: params,
                success: function(res) {
                    t.getcatelist();
                    t.hideel(t.classadd)
                }
            })
        }
        _GC.prototype.savecompile = function() {
            let t = this,
                amend = t.classcompile.querySelector('.btn-amend')
            amend.addEventListener('click', function(e) {
                let params = {}
                params.id = t.id
                params.type_name = t.classcompile.querySelector('#classname').value
                app.requests({
                    url: 'category/saveeditcate',
                    data: params,
                    success: function(res) {
                        showToast({
                            type: 'success',
                            text: '操作成功！'
                        })
                        t.getcatelist();
                        t.hideel(t.classcompile)
                    },
                    Error(code) {
                        let text = ''
                        switch (parseInt(code)) {
                            case 3001:
                                text = '保存失败'
                                break;
                            case 3002:
                                text = 'id必须为数字'
                                break;
                            case 3003:
                                text = '状态参数有误'
                                break;
                            case 3004:
                                text = '分类id不存在'
                                break;
                            case 3005:
                                text = '该分类名称已经存在'
                                break;
                            case 3006:
                                text = '图片没有上传过'
                                break;
                            case 3007:
                                text = '没提交要修改的内容'
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
            })
        }
        _GC.prototype.hidenew = function(o) {
            let t = this,
                cancel = o.querySelector('.btn-cancel')
            cancel.addEventListener('click', function(e) {
                t.hideel(o)
            })
        }
        _GC.prototype.showel = function(el) { //显示添加分类
            el.classList.remove('hide')
        }
        _GC.prototype.hideel = function(el) {
            el.classList.add('hide')
        }
        _GC.prototype.comp = function() { //点击编辑
            let t = this,
                coms = document.querySelector('#classifylist').querySelectorAll('.btn-amend');
            coms.forEach(function(li) {
                    li.addEventListener('click', function(e) {
                        t.classcompile.classList.remove('hide')

                        t.id = li.getAttribute('data-id')
                        t.classifydetail()
                    })
                })
                // this.classcompile.classList.remove('hide')
        }
        _GC.prototype.wapper = function(o) { //状态点击选择
            let t = this,
                ws = o.querySelectorAll('.ant-radio-wrapper');
            ws.forEach(function(li) {
                li.addEventListener('click', function(e) {
                    t.status = li.getAttribute('data-status')
                    t.forwapper(o)
                })
            })
        }
        _GC.prototype.forwapper = function(o) { //状态显示
            let ws = o.querySelectorAll('.ant-radio-wrapper'),
                t = this;
            ws.forEach(function(li) {
                let i = li.getAttribute('data-status')
                li.classList.remove('ant-radio-checked')
                if (i == t.status) {
                    li.classList.add('ant-radio-checked')
                }
            })
        }
        _GC.prototype.classifydetail = function() { //获取分类详细信息
            let t = this
            app.requests({
                url: 'category/editcatepage',
                data: {
                    id: t.id
                },
                success: function(res) {
                    t.setdetail(res)
                },
                Error(code) {
                    let text = ''
                    switch (parseInt(code)) {
                        case 3002:
                            text = '参数错误'
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
        }
        _GC.prototype.saveaddcate = function(p) { //添加分类
            let t = this
            app.requests({
                url: 'category/saveaddcate',
                data: p.data,
                success: function(res) {
                    showToast({
                        type: 'success',
                        text: '操作成功！'
                    })
                    p.success(res)
                },
                Error(code) {
                    let text = ''
                    switch (parseInt(code)) {
                        case 3001:
                            text = '保存失败'
                            break;
                        case 3002:
                            text = '分类名称不能为空'
                            break;
                        case 3003:
                            text = '图片没有上传过'
                            break;
                        case 3004:
                            text = '状态参数有误'
                            break;
                        case 3005:
                            text = '该分类名称已经存在'
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
        }
        _GC.prototype.setdetail = function(res) { //分类赋值
            let superior = document.querySelector('#superior'),
                classname = document.querySelector('#classname');
            classname.value = res.cate_data.type_name
            if (res.cate_data.pid == 0) {
                superior.parentNode.classList.add('hide')
            } else {
                superior.innerHTML = res.cate_list.type_name
            }
            this.status = res.cate_data.status
            this.forwapper(this.classcompile)
        }
        _GC.prototype.setglul = function(data) {
            let ul = document.querySelector('#classifylist')
            let str = '',
                i = 0,
                ullist = discategory(data),
                len = ullist.length;
            for (i = 0; i < len; i++) {
                if (ullist[i].tier == 2) {
                    ullist[i].type_name = '&emsp;&emsp;&emsp;├&nbsp;' + ullist[i].type_name
                } else if (ullist[i].tier == 3) {
                    ullist[i].type_name = '&emsp;&emsp;&emsp;&emsp;&emsp;├&nbsp;' + ullist[i].type_name
                } else {
                    ullist[i].type_name = '├&nbsp;' + ullist[i].type_name
                }
                str += ' <div class="table-tr">\
            <span class="col-md-2 bot-bor subli">' + ullist[i].id + '</span>\
            <span class="col-md-2 bot-bor subli">' + ullist[i].pid + '</span>\
            <span class="col-md-2 bot-bor subli tl ">' + ullist[i].type_name + '</span>\
            <span class="col-md-2 bot-bor subli">' + ullist[i].tier + '</span>\
            <span class="col-md-2 bot-bor subli">\
              <div data-id="' + ullist[i].id + '" data-status="' + ullist[i].status + '" class="ant-switch stop-open "></div>\
            </span>\
            <span class="col-md-2 bot-bor subli">\
            <a class="pz-btn btn-amend " data-id="' + ullist[i].id + '">编辑</a></span>\
        </div>'
            };
            ul.innerHTML = str
            this.stopOpen()
        }

        _GC.prototype.stopOpen = function() {
            let ul = document.querySelector('#classifylist')
            let so = ul.querySelectorAll('.stop-open')
            let t = this
            so.forEach(function(sub) {
                if (sub.getAttribute('data-status') == 1) {
                    sub.classList.add('ant-switch-checked')
                }
                sub.addEventListener('click', function(e) {
                    let type = sub.getAttribute('data-status'),
                        id = sub.getAttribute('data-id'),
                        gtype = ''
                    if (type == 1) {
                        gtype = 2
                    } else {
                        gtype = 1
                    }
                    app.requests({
                        url: 'category/stopstartcate',
                        data: {
                            id: id,
                            type: gtype
                        },
                        success: function() {
                            t.getcatelist()
                        },
                        Error(code) {
                            let text = ''
                            switch (parseInt(code)) {
                                case 3001:
                                    text = '停用失败'
                                    break;
                                case 3002:
                                    text = '参数错误'
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
                })
            })
        }
        return {
            init: function(obj) {
                new _GC(obj);
            }
        }
    })()

    pz.goodsclassify.init()

    function distwocategory(data) {
        data.unshift({
            id: '0',
            tier: '1',
            type_name: '顶级分类'
        })
        return data
    }

    function discategory(data) {
        let i,
            x,
            y,
            len = data.length,
            len1,
            len2,
            arr = []
        for (i = 0; i < len; i++) {
            arr.push(data[i])
            if (data[i].hasOwnProperty('_child')) {
                len1 = data[i]._child.length
                for (x = 0; x < len1; x++) {
                    arr.push(data[i]._child[x])
                    if (data[i]._child[x].hasOwnProperty('_child')) {
                        len2 = data[i]._child[x]._child.length
                        for (y = 0; y < len2; y++) {
                            arr.push(data[i]._child[x]._child[y])
                        }
                    }
                }
            }
        }
        return arr
    }

    // pz.classifydetail = function() {
    //     let param = geturl()
    //     quest.editcatepage({
    //         data: {
    //             id: param.id
    //         },
    //         success: function(res) {
    //             setglul(res.data)
    //         }
    //     })
    // }


})(window)