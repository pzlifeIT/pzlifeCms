;
(function(pz) {
    pz.advertising = (function() {
        function _AG(o) {
            this.agadd = document.querySelector('#agadd')
            this.templateId = ''
            this.agImage = ''
            this.init()
        }
        _AG.prototype = {
            init: function() { //进入执行
                this.elclick()
            },
            elclick: function() {
                let t = this
                document.querySelector('#cancelNew').onclick = function(e) {
                    t.agadd.classList.add('hide')
                }
                document.querySelector('#saveNew').onclick = function(e) {

                }
                let arr = [{
                    model_id: 1,
                    name: 'banner'
                }, {
                    model_id: 2,
                    name: 'icon'
                }, {
                    model_id: 3,
                    name: 'activity'
                }, {
                    model_id: 4,
                    name: 'recommend1',
                    re: true
                }, {
                    model_id: 5,
                    name: 'week'
                }, {
                    model_id: 6,
                    name: 'recommend2',
                    re: true
                }, {
                    model_id: 7,
                    name: 'recommend3',
                    re: true
                }, {
                    model_id: 8,
                    name: 'recommend4',
                    re: true
                }, {
                    model_id: 9,
                    name: 'recommend5',
                    re: true
                }, {
                    model_id: 10,
                    name: 'project',
                    noadd: true
                }]
                arr.forEach(function(li) {
                    let elSave = document.querySelector('#' + li.name + 'Save')
                    elSave.onclick = function(e) {
                        t.getmodelInfo({
                            model_id: li.model_id,
                            name: li.name,
                            re: li.re || false
                        })
                    }
                    if (li.noadd) continue
                    let elAdd = document.querySelector('#add' + li.name)
                    elAdd.onclick = function(e) {
                        t.templateId = 1
                        t.agadd.classList.remove('hide')
                    }
                })
            },
            getmodelInfo(data) {
                let tit = document.querySelector('#' + data.name + 'Tit').value,
                    sort = document.querySelector('#' + data.name + 'Sort').value,
                    jump_type = '',
                    jump_content = '',
                    image_path = '';
                if (data.re) {
                    jump_type = 1
                    jump_content = document.querySelector('#' + data.name + 'Id').value
                    image_path = ''
                }
                this.addRecommend({
                    model_id: data.model_id,
                    title: tit,
                    model_order: sort,
                    jump_type: jump_type,
                    jump_content: jump_content,
                    image_path: image_path
                })
            },
            addRecommend: function(data) {
                let t = this,
                    params = {
                        model_id: data.model_id || '',
                        title: data.title || '',
                        image_path: data.image_path || '',
                        parent_id: data.parent_id || '',
                        jump_type: data.jump_type || '',
                        jump_content: data.jump_content || '',
                        show_type: data.show_type || '',
                        show_data: data.show_data || '',
                        show_days: data.show_days || '',
                        tier: data.tier || '',
                        model_order: data.model_order || '',
                        model_son_order: data.model_son_order || ''
                    }
                quest.requests({
                    url: 'addRecommend',
                    data: params,
                    success(res) {

                    },
                    error(code) {

                    }
                })
            },
            setimages() {
                let t = this,
                    img = ''
                selpicure({
                    el: '#selpicure1',
                    images: [{ image: img }],
                    imgChange: function(images) {
                        t.agImage = images[0].image
                    }
                })
            }
        }

        return {
            init: function(o) {
                return new _AG(o)
            }
        }
    })()
})(window.pz)