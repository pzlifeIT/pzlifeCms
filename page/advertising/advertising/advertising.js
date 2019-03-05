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