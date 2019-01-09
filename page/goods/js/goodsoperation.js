;
(function() {
    console.log(22222)
    pz.goodsoperation = (function() {
        function _GO() {
            this.addattribute = pz.getEl('.addattribute')
            this.attributeNew = pz.getEl('#attributeNew')
            this.cancelNew = pz.getEl('#cancelNew')
            this.saveNew = pz.getEl('#saveNew')
            this.amendAttribute = pz.getEl('#amendAttribute')
            this.cancelAmend = pz.getEl('#cancelAmend')
            this.saveAmend = pz.getEl('#saveAmend')
            this.previewphoto = pz.getEl('#previewphoto')
            this.addpreview = pz.getEl('.addpreview')
            this.modalContent = pz.getEl('#modalContent')
            this.init()
        }
        _GO.prototype = {
            init: function() {
                this.allCateList()
                this.elClick()
            },
            elClick: function() {
                let t = this
                console.log(t.cancelNew)
                t.addattribute.addEventListener('click', function(e) {
                    t.attributeNew.classList.remove('hide')
                })
                t.cancelNew.addEventListener('click', function(e) {
                    t.attributeNew.classList.add('hide')
                })
                t.saveNew.addEventListener('click', function(e) {

                })
                t.cancelAmend.addEventListener('click', function(e) {
                    t.amendAttribute.classList.remove('hide')
                })
                t.saveAmend.addEventListener('click', function(e) {

                })
                t.previewphoto.addEventListener('click', function(e) {
                    t.previewphoto.classList.add('hide')
                })
                t.addpreview.addEventListener('click', function(e) {
                    t.previewphoto.classList.remove('hide')
                })
                t.modalContent.addEventListener('click', function(e) {
                    window.event ? window.event.cancelBubble = true : e.stopPropagation();
                })
            },
            allCateList: function() { //获取所有分类
                let t = this
                quest.requests({
                    url: 'allCateList',
                    success: function(res) {
                        pz.multistage.init({
                            el: '.multistage',
                            ellink: '.linkage',
                            data: t.disCateList(res.data)
                        })
                    }
                })
            },
            disCateList: function(data) {
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
        }
        return {
            init: function(o) {
                return new _GO(o)
            }
        }
    })()
})()