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
                document.querySelector('#addbanner').onclick = function(e) {
                    t.templateId = 1
                    t.agadd.classList.remove('hide')
                }
                document.querySelector('#addIcon').onclick = function(e) {
                    t.templateId = 2
                    t.agadd.classList.remove('hide')
                }
                document.querySelector('#addActivity').onclick = function(e) {
                    t.templateId = 3
                    t.agadd.classList.remove('hide')
                }

                document.querySelector('#addrecommend1').onclick = function(e) {
                    t.templateId = 4
                }
                document.querySelector('#addweek').onclick = function(e) {
                    t.templateId = 5
                }
                document.querySelector('#addrecommend2').onclick = function(e) {
                    t.templateId = 6
                }
                document.querySelector('#addrecommend3').onclick = function(e) {
                    t.templateId = 7
                }
                document.querySelector('#addrecommend4').onclick = function(e) {
                    t.templateId = 8
                }
                document.querySelector('#addrecommend5').onclick = function(e) {
                    t.templateId = 9
                }
                document.querySelector('#addProject').onclick = function(e) {
                    t.templateId = 10
                }
                document.querySelector('#cancelNew').onclick = function(e) {
                    t.agadd.classList.add('hide')
                }
                document.querySelector('#saveNew').onclick = function(e) {

                }
                document.querySelector('#bannerSave').onclick = function(e) {

                }
                document.querySelector('#iconSave').onclick = function(e) {

                }
                document.querySelector('#activitySave').onclick = function(e) {
                    t.getInfo({

                    })
                }
                document.querySelector('#weekSave').onclick = function(e) {

                }
                document.querySelector('#projectSave').onclick = function(e) {

                }
            },
            getInfo(data) {
                let tit = ddocument.querySelector('#' + data.name + 'Tit'),
                    sort = ddocument.querySelector('#' + data.name + 'Sort'),
                    jump_type = '',
                    jump_content = '',
                    image_path = '';
                if (data.re) {
                    jump_type = 1
                    jump_content = document.querySelector('#' + data.name + 'Id')
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