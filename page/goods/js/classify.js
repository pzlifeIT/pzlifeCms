;
(function(win) {

    pz.goodsclassify = (function() {
        function _GC() {
            this.classcompile = document.querySelector('#classcompile');
            this.classadd = document.querySelector('#classadd');
            this.id = ''
            this.status = '启用'
            this.init();
        }
        _GC.prototype.init = function() {
            this.getcatelist();
        }
        _GC.prototype.getcatelist = function() { //数据循环到页面
            let t = this
            quest.getcatelist({
                data: {
                    type: 3
                },
                success: function(res) {
                    setglul(res.data);

                    t.comp()
                }
            });
        }
        _GC.prototype.comp = function() { //点击编辑
            let t = this,
                coms = document.querySelector('#classifylist').querySelectorAll('.btn-amend');
            coms.forEach(function(li) {
                    li.addEventListener('click', function(e) {
                        t.classcompile.classList.remove('hide')
                        t.wapper(t.classcompile)
                        t.id = li.getAttribute('data-id')
                        t.classifydetail()
                    })
                })
                // this.classcompile.classList.remove('hide')
        }
        _GC.prototype.wapper = function(o) {
            let t = this,
                ws = o.querySelectorAll('.ant-radio-wrapper');
            ws.forEach(function(li) {
                console.log(li.getAttribute('data-status'))
                li.addEventListener('click', function(e) {
                    t.status = li.getAttribute('data-status')
                    t.forwapper(o)
                })
            })
        }
        _GC.prototype.forwapper = function(o) {
            let ws = o.querySelectorAll('.ant-radio-wrapper'),
                t = this;
            ws.forEach(function(li) {
                let i = li.getAttribute('data-status')
                console.log(i == t.status)
                li.classList.remove('ant-radio-checked')
                if (i == t.status) {
                    li.classList.add('ant-radio-checked')
                }
            })
        }
        _GC.prototype.classifydetail = function() {
            let t = this
            quest.editcatepage({
                data: {
                    id: t.id
                },
                success: function(res) {
                    t.setdetail(res)
                }
            })
        }
        _GC.prototype.setdetail = function(res) {
            let superior = document.querySelector('#superior'),
                classname = document.querySelector('#classname');
            classname.value = res.cate_data.type_name
            if (res.cate_data.pid == 0) {
                console.log(superior.parentNode)
                superior.parentNode.classList.add('hide')
            } else {
                superior.innerHTML = res.cate_list.type_name
            }
            this.status = res.cate_data.status
            this.forwapper(this.classcompile)
        }
        return {
            init: function(obj) {
                new _GC(obj);
            }
        }
    })()

    function setglul(data) {
        let ul = document.querySelector('#classifylist')
        let str = '',
            i = 0,
            ullist = disul(data),
            len = ullist.length;
        console.log(ullist);
        for (i = 0; i < len; i++) {
            str += ' <li>\
          <span class="col-md-2 bot-bor subli">' + ullist[i].id + '</span>\
          <span class="col-md-2 bot-bor subli">' + ullist[i].pid + '</span>\
          <span class="col-md-2 bot-bor subli">' + ullist[i].type_name + '</span>\
          <span class="col-md-2 bot-bor subli">' + ullist[i].tier + '</span>\
          <span class="col-md-2 bot-bor subli">\
            <span class="ant-switch stop-open ant-switch-checked"></span>\
          </span>\
          <span class="col-md-2 bot-bor subli">\
          <a class="pz-btn btn-amend " data-id="' + ullist[i].id + '">编辑</a></span>\
      </li>'
        };
        ul.innerHTML = str
    }

    function disul(data) {
        let i,
            x,
            y,
            len = data.length,
            len1,
            len2
        arr = []
        for (i = 0; i < len; i++) {
            arr.push(data[i])
            if (data[i]._child) {
                len1 = data[i]._child.length
                for (x = 0; x < len1; x++) {
                    arr.push(data[i]._child[x])
                    if (data[i]._child[x]._child) {
                        len1 = data[i]._child.length
                        for (y = 0; y < len1; y++) {
                            arr.push(data[i]._child[x]._child[y])
                        }
                    }
                }
            }

        }
        return arr
    }

    pz.classifydetail = function() {
        console.log(location.href)
        let param = geturl()
        quest.editcatepage({
            data: {
                id: param.id
            },
            success: function(res) {
                setglul(res.data)
            }
        })
    }

    function geturl() {
        let href = location.href,
            list = {}
        if (href.indexOf('?')) {
            let params = href.split('?')[1]
            if (params.indexOf('&')) {
                let arr = params.split('&'),
                    len = arr.length
                for (let i = 0; i < len; i++) {
                    if (arr[i].indexOf('=')) {
                        let l = arr[i].split('=')
                        list[l[0]] = l[1]
                    }
                }
                console.log(arr)
            } else if (params.indexOf('=')) {
                let arr = params.split('=')
                list[arr[0]] = arr[1]
            }
        }
        return list
    }
})(window)