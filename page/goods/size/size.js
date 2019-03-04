;
(function(pz) {
    pz.size = (function() {
        function _SE(o) {
            this.sizelist = document.querySelector('#sizelist');
            this.cancelNew = document.querySelector('#cancelNew')
            this.saveNew = document.querySelector('#saveNew')
            this.cancelcompile = document.querySelector('#cancelcompile')
            this.savecompile = document.querySelector('#savecompile')
            this.compileSize = document.querySelector('#compileSize')
            this.compileNew = document.querySelector('#compileNew')
            this.addsize = document.querySelector('.addsize')
            this.id = ''
            this.page = 1
            this.total = 0
            this.init()
        }
        _SE.prototype.init = function() {
            this.getSpecList()
            this.cancelModal()
            this.allCateList()
        }
        _SE.prototype.cancelModal = function() { //隐藏弹框
            let t = this
            t.cancelNew.addEventListener('click', function(e) {
                t.compileNew.classList.add('hide')
            })
            t.cancelcompile.addEventListener('click', function(e) {
                t.compileSize.classList.add('hide')
            })
            t.addsize.addEventListener('click', function(e) {
                t.compileNew.classList.remove('hide')
            })
            t.savecompile.onclick = function(e) {
                t.compileSave()
            }
            t.saveNew.addEventListener('click', function(e) {
                t.newSave()
            })
        }
        _SE.prototype.compileSave = function() { //保存修改
            let t = this,
                name = document.querySelector('#sizeName').value;
            quest.requests({
                data: {
                    id: t.id,
                    sa_name: name,
                    type: 1
                },
                url: 'saveEditSpecAttr',
                success: function(res) {
                    t.getSpecList()
                    t.compileSize.classList.add('hide')
                },
                Error(code) {
                    switch (parseInt(code)) {
                        case 3001:
                            alert('保存失败')
                            break;
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
        _SE.prototype.newSave = function() { //保存新建
            let t = this,
                name = document.querySelector('#newName').value;
            id = document.querySelector('.multistage').getAttribute('data-id');
            if (!name) return
            if (!id) return
            quest.requests({
                data: {
                    top_id: id,
                    sa_name: name,
                    type: 1
                },
                url: 'savespecattr',
                success: function(res) {
                    t.getSpecList()
                    t.compileNew.classList.add('hide')
                }
            })
        }
        _SE.prototype.getSpecList = function(data) { //获取规格列表
            let t = this
            data = data || ''
            quest.requests({
                data: {
                    page: data.page || 1,
                    page_num: data.page_num || 10
                },
                url: 'getSpecList',
                success: function(res) {
                    t.setGlul(res.data)
                    console.log(res.total)
                    if (t.total == res.total) return
                    t.total = res.total
                    t.setpage()
                }
            })
        }
        _SE.prototype.setpage = function() {
            let t = this,
                total = Math.ceil(parseInt(t.total) / 10)
            pages.init({
                el: '#floorpages',
                pagenumber: total,
                fn: function(n) {
                    t.page = n
                    t.getSpecList({
                        page: n
                    })
                }
            })
        }
        _SE.prototype.setGlul = function(data) { //循环出规格列表
            let len = data.length,
                i,
                str = ''
            for (i = 0; i < len; i++) {
                str += '<div class="table-tr"> \
              <div class = "col-md-3 bot-bor subli" ><span>' + (i + 1) + '</span> </div> \
              <div class = "col-md-3 bot-bor subli" ><span>' + data[i].category + ' </span></div> \
              <div class = "col-md-3 bot-bor subli" ><span>' + data[i].spe_name + '</span></div> \
              <div class = "col-md-3 bot-bor subli" >\
              <a class = "pz-btn btn-amend" \
              href = "attribute/attribute.html?id=' + data[i].id + '" > 查看属性 </a> \
                  <a class = "pz-btn btn-amend seamend" \
              href = "javascript:;" data-id="' + data[i].id + '" > 编辑 </a> \
              <a class = "pz-btn btn-del" data-id="' + data[i].id + '" href = "#" > 删除 </a> </div></div>'
            }
            this.sizelist.innerHTML = str
            this.delSize()
            this.amendSize()
        }
        _SE.prototype.amendSize = function() { //编辑点击
            let amends = document.querySelectorAll('.seamend'),
                t = this;
            amends.forEach(function(li) {
                li.addEventListener('click', function(e) {
                    let id = li.getAttribute('data-id')
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
            quest.requests({
                data: {
                    id: id,
                    type: 1
                },
                url: 'delSpecAttr',
                success: function(res) {
                    t.getSpecList()
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
        _SE.prototype.getEditData = function(id) { //获取需要编辑的规格
            let t = this
            quest.requests({
                data: {
                    id: id,
                    type: 1
                },
                url: 'getEditData',
                success: function(res) {
                    t.compileSize.classList.remove('hide')
                    t.id = res.spec.id
                    document.querySelector('#sizeName').value = res.spec.spe_name
                }
            })
        }
        _SE.prototype.allCateList = function() { //获取所有分类
            let t = this
            quest.requests({
                url: 'allCateList',
                success: function(res) {
                    pz.multistage.init({
                        el: '.multistage',
                        ellink: '.linkage',
                        type: '3',
                        data: t.disCateList(res.data)
                    })
                },
                Error(code) {
                    switch (parseInt(code)) {
                        case 3001:
                            alert('状态参数错误')
                            break;
                        default:
                            alert('意料之外的错误')
                            break;
                    }
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
})(window.pz)