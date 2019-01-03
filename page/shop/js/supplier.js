;
(function() {
    pz.supplier = (function() {
        function _SR(o) {
            this.srlist = document.querySelector('#supplierslist')
            this.totle = 0
            this.init()
        }
        _SR.prototype.init = function() { //初始化
            this.getsuppliers({})
        }
        _SR.prototype.setGlul = function(data) { //循环出供应商列表
            let len = data.length,
                i,
                str = ''
            for (i = 0; i < len; i++) {
                str += '<li> \
                <div class = "col-md-2 bot-bor subli" ><span>' + data[i].id + '</span> </div> \
                <div class = "col-md-2 bot-bor subli " ><span> <img class="liimg" src = "' + data[i].image + '"\
                alt = "" > </span></div> \
                <div class = "col-md-2 bot-bor subli" ><span>' + data[i].name + ' </span></div> \
                <div class = "col-md-2 bot-bor subli" ><span>' + data[i].tel + '</span></div> \
                <div class = "col-md-2 bot-bor subli desc" ><span>' + data[i].desc + '</span></div> \
                <div class = "col-md-2 bot-bor subli" >\
                    <a class = "pz-btn btn-amend" \
                href = "supplierdetails.html?id=' + data[i].id + '" > 编辑 </a> \
                <a class = "pz-btn btn-del" data-id="' + data[i].id + '" href = "#" > 删除 </a> </div></li>'
            }
            this.srlist.innerHTML = str
            this.del()
        }
        _SR.prototype.getsuppliers = function(o) { //获得供应商列表
            let t = this
            quest.suppliers.getsuppliers({
                data: {
                    page: o.page || 1,
                    pagenum: o.pagenum || 10
                },
                success: function(res) {
                    t.setGlul(res.data)
                    let totle = Math.ceil(parseInt(res.totle) / 10)
                    if (t.totle == totle) return
                    t.totle = totle
                    t.page()
                }
            })
        }

        _SR.prototype.del = function() {
            let dellist = this.srlist.querySelectorAll('.btn-del')
            dellist.forEach(li => {
                li.addEventListener('click', function(e) {
                    let id = li.getAttribute('data-id')
                    console.log(id)
                })
            });
        }
        _SR.prototype.page = function() {
            let t = this
            pages.init({
                el: '#floorpages',
                pagenumber: t.totle,
                fn: function(n) {
                    t.getsuppliers({
                        page: n
                    })
                }
            })
        }
        return {
            init: function(obj) {
                new _SR(obj);
            }
        }
    })()
})()