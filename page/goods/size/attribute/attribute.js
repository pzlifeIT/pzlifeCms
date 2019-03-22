import { app } from '../../../../index.js';;
(function(pz) {
    pz.size = (function() {
        function _SE(o) {
            this.abName = document.querySelector('#abName');
            this.abCancel = document.querySelector('#abCancel');
            this.abSave = document.querySelector('#abSave');
            this.abcompile = document.querySelector('#abcompile');
            this.addattribute = document.querySelector('.addattribute');
            this.ablist = document.querySelector('#ablist');
            this.topId = pz.geturl().id
            this.id = '';
            this.init();
        }
        _SE.prototype.init = function() {
            this.getattributeList();
            this.cancelModal();
        }
        _SE.prototype.cancelModal = function() { //隐藏弹框
            let t = this
            t.addattribute.addEventListener('click', function(e) {
                t.id = '';
                document.querySelector('#abName').value = '';
                t.abcompile.classList.remove('hide');
            })
            t.abCancel.addEventListener('click', function(e) {
                t.abcompile.classList.add('hide');
            })
            t.abSave.addEventListener('click', function(e) {
                if (t.id == '') {
                    t.savenew();
                } else {
                    t.saveAb();
                }
            })
        }
        _SE.prototype.saveAb = function() { //保存修改
            let t = this,
                name = document.querySelector('#abName').value;
            app.requests({
                data: {
                    id: t.id,
                    sa_name: name,
                    type: 2
                },
                url: 'saveEditSpecAttr',
                success: function(res) {
                    t.getattributeList()
                    t.abcompile.classList.add('hide')
                }
            })
        }
        _SE.prototype.savenew = function() { //保存新建
            let t = this,
                name = document.querySelector('#abName').value;
            console.log(name)
            app.requests({
                data: {
                    top_id: t.topId,
                    sa_name: name,
                    type: 2
                },
                url: 'savespecattr',
                success: function(res) {
                    t.getattributeList()
                    t.abcompile.classList.add('hide')
                },
                Error(code) {
                    switch (parseInt(code)) {
                        case 3002:
                            alert('参数错误')
                            break;
                        default:
                            alert('意料之外的错误')
                            break;
                    }
                }
            })
        }
        _SE.prototype.getattributeList = function() { //获取规格列表
            let t = this
            app.requests({
                data: {
                    spec_id: t.topId
                },
                url: 'getAttr',
                success: function(res) {
                    t.setGlul(res.attr, res.spec_name)
                }
            })
        }
        _SE.prototype.setGlul = function(data, name) { //循环出规格列表
            let len = data.length,
                i,
                str = ''
            for (i = 0; i < len; i++) {
                str += '<div class="table-tr"> \
              <div class = "col-md-3 bot-bor subli" ><span>' + (i + 1) + '</span> </div> \
              <div class = "col-md-3 bot-bor subli" ><span>' + name + ' </span></div> \
              <div class = "col-md-3 bot-bor subli" ><span>' + data[i].attr_name + '</span></div> \
              <div class = "col-md-3 bot-bor subli" >\
                  <a class = "pz-btn btn-amend seamend" \
              href = "javascript:;" data-id="' + data[i].id + '" > 编辑 </a> \
              <a class = "pz-btn btn-del" data-id="' + data[i].id + '" href = "#" > 删除 </a> </div></div>'
            }
            this.ablist.innerHTML = str
            this.delSize()
            this.amendSize()
        }
        _SE.prototype.amendSize = function() { //编辑点击
            let amends = document.querySelectorAll('.seamend'),
                t = this;
            amends.forEach(function(li) {
                li.addEventListener('click', function(e) {
                    let id = li.getAttribute('data-id')
                    console.log(id)
                    t.getEditData(id)
                })
            })
        }
        _SE.prototype.delSize = function() { //删除点击
            let dels = document.querySelectorAll('.btn-del'),
                t = this;
            dels.forEach(function(li) {
                li.addEventListener('click', function(e) {
                    let id = li.getAttribute('data-id')
                        // t.delSpecAttr(id)
                })
            })
        }
        _SE.prototype.delSpecAttr = function(id) { //删除规格
            let t = this
            app.requests({
                data: {
                    id: id,
                    type: 2
                },
                url: 'delSpecAttr',
                success: function(res) {
                    t.getattributeList()
                },
                Error(code) {
                    switch (parseInt(code)) {
                        case 3002:
                            alert('参数错误')
                            break;
                        case 3003:
                            alert('无法删除')
                            break;
                        default:
                            alert('意料之外的错误')
                            break;
                    }
                }
            })
        }
        _SE.prototype.getEditData = function(id) { //获取需要编辑的属性
            let t = this
            app.requests({
                data: {
                    id: id,
                    type: 2
                },
                url: 'getEditData',
                success: function(res) {
                    t.abcompile.classList.remove('hide')
                    t.id = res.attr.id
                    document.querySelector('#abName').value = res.attr.attr_name
                }
            })
        }
        _SE.prototype.disCateList = function(data) {
            let i,
                x,
                y,
                len = data.length,
                len1,
                len2,
                tier1 = {},
                tier2 = {},
                tier3 = {},
                arr = []
            for (i = 0; i < len; i++) {
                tier1 = {
                    id: data[i].id,
                    name: data[i].type_name,
                    _child: []
                }
                if (data[i].hasOwnProperty('_child')) {
                    len1 = data[i]._child.length
                    for (x = 0; x < len1; x++) {
                        tier2 = {
                            id: data[i]._child[x].id,
                            name: data[i]._child[x].type_name,
                            _child: []
                        }
                        if (data[i]._child[x].hasOwnProperty('_child')) {
                            len2 = data[i]._child[x]._child.length
                            for (y = 0; y < len2; y++) {
                                tier3 = {
                                    id: data[i]._child[x]._child[y].id,
                                    name: data[i]._child[x]._child[y].type_name
                                }
                                tier2._child.push(tier3)
                            }
                        }
                        tier1._child.push(tier2)
                    }
                }
                arr.push(tier1)
            }
            return arr
        }
        return {
            init: function(o) {
                return new _SE(o)
            }
        }
    })()
    pz.size.init()
})(window.pz)