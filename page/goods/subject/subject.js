import { app } from '../../../index.js';
import { showToast } from '../../../js/utils.js';
(function(pz) {
    pz.subject = (function() {
        function _ST() {
            this.subjectcompile = document.querySelector('#subjectcompile'); //修改弹框
            this.classadd = document.querySelector('#classadd'); //新建弹框
            // this.addbtn = document.querySelector('#addbtn'); //新建专题
            this.nameNew = document.querySelector('#nameNew'); //新建分类名称
            this.combobox_class = document.querySelector('#combobox_class'); //二级专题
            this.getalllist = document.querySelector('#getalllist') //专题列表
            this.id = '';
            this.status = '1'
            this.newImg = ''
            this.amendImg = ''
            this.init();
        }
        _ST.prototype = {
            init: function() {
                this.wapper(this.subjectcompile)
                this.wapper(this.subjectcompile)
                this.getallsubject()
                this.elclick()
            },
            elclick: function() {
                let t = this;
                // 新建专题
                document.querySelector('.addsubject').addEventListener('click', function(e) {
                    t.gettwocategory()
                    t.classadd.classList.remove('hide')
                });
                //取消新建
                document.querySelector('#cancelNew').addEventListener('click', function(e) {
                    t.classadd.classList.add('hide')
                })
                document.querySelector('#saveNew').addEventListener('click', function(e) {
                        t.savenew()
                    })
                    //取消新建
                document.querySelector('#cancelAmend').addEventListener('click', function(e) {
                        t.subjectcompile.classList.add('hide')
                    })
                    //保存修改
                document.querySelector('#saveAmend').addEventListener('click', function(e) {
                    t.getsubjectAmend()
                });
                selpicure({
                    el: '#selpicure1',
                    images: [],
                    imgChange: function(images) {
                        t.newImg = images[0].image;
                    }
                })
            },
            getallsubject: function() { //获取所有专题
                let t = this
                app.requests({
                    url: 'subject/getallsubject',
                    data: {
                        stype: 1
                    },
                    success: function(res) {
                        t.setglul(t.dissubject(res.data || []))
                    },
                    Error: function(code) {
                        showToast({
                            text: '获取失败'
                        })
                    }
                })
            },
            setglul: function(data) { //主题输出
                let str = '',
                    i = 0,
                    ullist = data,
                    len = ullist.length;
                for (i = 0; i < len; i++) {
                    if (ullist[i].tier == 2) {
                        ullist[i].subject = '&emsp;&emsp;&emsp;├&nbsp;' + ullist[i].subject
                    } else if (ullist[i].tier == 3) {
                        ullist[i].subject = '&emsp;&emsp;&emsp;&emsp;&emsp;├&nbsp;' + ullist[i].subject
                    } else {
                        ullist[i].subject = '├&nbsp;' + ullist[i].subject
                    }
                    str += ' <div class="table-tr">\
              <span class="col-md-1 bot-bor subli">' + ullist[i].id + '</span>\
              <span class="col-md-2 bot-bor subli"><image class="stImg" src="' + ullist[i].subject_image + '"/></span>\
              <span class="col-md-1 bot-bor subli">' + ullist[i].pid + '</span>\
              <span class="col-md-2 bot-bor subli tl ">' + ullist[i].subject + '</span>\
              <span class="col-md-1 bot-bor subli">' + ullist[i].tier + '</span>\
              <span class="col-md-1 bot-bor subli">' + ullist[i].order_by + '</span>\
              <span class="col-md-2 bot-bor subli">\
                <div data-id="' + ullist[i].id + '" data-status="' + ullist[i].status + '" class="ant-switch stop-open "></div>\
              </span>\
              <span class="col-md-2 bot-bor subli">\
              <a class="pz-btn btn-amend " data-id="' + ullist[i].id + '">编辑</a></span>\
          </div>'
                };
                this.getalllist.innerHTML = str
                this.compileSubject()
                this.stopOpen()
            },
            compileSubject: function() { //点击编辑
                let t = this,
                    amends = this.getalllist.querySelectorAll('.btn-amend')
                amends.forEach(function(li) {
                    li.addEventListener('click', function(e) {
                        t.subjectcompile.classList.remove('hide')
                        t.id = li.getAttribute('data-id')
                        t.subjectDetail(t.id)
                    })
                })
            },
            subjectDetail: function(id) { //获取专题详细信息
                let t = this
                app.requests({
                    url: 'subject/getsubjectdetail',
                    data: {
                        subject_id: id
                    },
                    success: function(res) {
                        t.subjectAmend(res.data)
                    },
                    Error(code) {
                        let text = ''
                        switch (parseInt(code)) {
                            case 3001:
                                text = 'id必须数字'
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
            subjectAmend: function(data) { //专题编辑
                let t = this,
                    name = document.querySelector('#amendName'),
                    group = document.querySelector('#amendGroup'),
                    order = document.querySelector('#amendOrder');
                name.value = data.subject;
                order.value = data.order_by;
                let wrappers = group.querySelectorAll('.ant-radio-wrapper')
                wrappers.forEach(function(li) {
                    let status = li.getAttribute('data-status')
                    li.classList.remove('ant-radio-checked')
                    if (status == data.status) {
                        li.classList.add('ant-radio-checked')
                    }
                })
                this.amendImg = ''

                selpicure({
                    el: '#selpicure2',
                    images: [{ image: data.subject_image }],
                    imgChange: function(images) {
                        t.amendImg = images[0].image;
                    }
                })
            },
            getsubjectAmend: function() {
                let name = document.querySelector('#amendName'),
                    group = document.querySelector('#amendGroup'),
                    order = document.querySelector('#amendOrder'),
                    data = {};
                data.subject = name.value;
                data.order_by = order.value;
                let wrappers = group.querySelectorAll('.ant-radio-wrapper')
                wrappers.forEach(function(li) {
                    let status = li.getAttribute('data-status')
                    if (li.classList.contains('ant-radio-checked')) {
                        data.status = status
                    }
                })
                data.id = this.id
                data.image = this.amendImg
                this.editsubject(data)
            },
            stopOpen: function() { //专题上下架
                let t = this,
                    so = this.getalllist.querySelectorAll('.stop-open')
                so.forEach(function(sub) {
                    if (sub.getAttribute('data-status') == 1) {
                        sub.classList.add('ant-switch-checked')
                    }
                    sub.addEventListener('click', function(e) {
                        let type = sub.getAttribute('data-status'),
                            id = sub.getAttribute('data-id'),
                            status = ''
                        if (type == 1) {
                            status = 2
                        } else {
                            status = 1
                        }
                        t.editsubject({
                            id: id,
                            status: status
                        })
                    })
                })
            },
            editsubject: function(data) { //修改专题
                let t = this
                app.requests({
                    url: 'subject/editsubject',
                    data: {
                        id: data.id,
                        subject: data.subject || '',
                        status: data.status || '',
                        image: data.image || '',
                        order_by: data.order_by || ''
                    },
                    success: function(res) {
                        showToast({
                            type: 'success',
                            text: '操作成功'
                        })
                        t.subjectcompile.classList.add('hide')
                        t.getallsubject()
                    },
                    Error(code) {
                        let text = ''
                        switch (parseInt(code)) {
                            case 3001:
                                text = '状态有误'
                                break;
                            case 3002:
                                text = 'id只能为数字'
                                break;
                            case 3003:
                                text = '排序只能是数字'
                                break;
                            case 3004:
                                text = '专题不存在'
                                break;
                            case 3005:
                                text = '专题名已存在'
                                break;
                            case 3006:
                                text = '图片没有上传过'
                                break;
                            case 3007:
                                text = '没提交要修改的内容'
                                break;
                            case 3008:
                                text = '保存失败'
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
            dissubject: function(data) { //整理专题列表
                if (!data) return
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
            },
            gettwocategory: function() { //获取选择的专题
                let t = this;
                t.newImg = '';
                t.combobox_class.setAttribute('data-id', '');
                t.combobox_class.innerHTML = '请选择';
                t.nameNew.value = '';
                selpicure({
                    el: '#selpicure1',
                    images: [],
                    imgChange: function(images) {
                        t.newImg = images[0].image;
                    }
                })
                app.requests({
                    url: 'getallsubject',
                    data: {
                        stype: 2
                    },
                    success: function(res) {
                        t.stMultistage(t.distwocategory(res.data || []))
                    },
                    Error: function(res) {
                        t.stMultistage(t.distwocategory([]))
                    }
                })
            },
            stMultistage: function(data) { //选择专题
                pz.multistage.init({
                    el: '#combobox_class',
                    ellink: '.linkage',
                    name: 'subject',
                    data: data
                })
            },
            distwocategory: function(data) { //添加顶级分类
                data.unshift({
                    id: '0',
                    subject: '顶级分类'
                })
                return data
            },
            savenew: function() { //保存新建
                let t = this,
                    subject = t.nameNew.value,
                    pid = t.combobox_class.getAttribute('data-id');
                app.requests({
                    url: 'subject/addsubject',
                    data: {
                        pid: pid,
                        subject: subject,
                        status: t.status,
                        image: t.newImg
                    },
                    success: function(res) {
                        showToast({
                            type: 'success',
                            text: '操作成功'
                        })
                        t.getallsubject()
                        t.classadd.classList.add('hide')
                    },
                    Error(code) {
                        let text = ''
                        switch (parseInt(code)) {
                            case 3001:
                                text = '状态有误'
                                break;
                            case 3002:
                                text = 'pid只能为数字'
                                break;
                            case 3003:
                                text = '专题名不能为空'
                                break;
                            case 3004:
                                text = 'pid查不到上级专题'
                                break;
                            case 3005:
                                text = '专题名已存在'
                                break;
                            case 3006:
                                text = '图片没有上传过'
                                break;
                            case 3007:
                                text = '保存失败'
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
            wapper: function(o, type) { //状态点击选择
                let t = this,
                    ws = o.querySelectorAll('.ant-radio-wrapper');
                ws.forEach(function(li) {
                    let i = li.getAttribute('data-status')
                    li.classList.remove('ant-radio-checked')
                    if (i == t.status) {
                        li.classList.add('ant-radio-checked')
                    }
                    if (!type) {
                        li.addEventListener('click', function(e) {
                            t.status = li.getAttribute('data-status')
                            t.wapper(o, true)
                        })
                    }

                })
            }
        }
        return {
            init: function(obj) {
                new _ST(obj);
            }
        }
    })()
    pz.subject.init()
})(window.pz)