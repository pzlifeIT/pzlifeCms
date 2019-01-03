;
(function(pz) {
    pz.supplierdetails = (function() {
        function _SD(o) {
            this.linkParam = pz.geturl()
            this.sdSave = document.querySelector('#sdSave')
            this.files = ''
            this.init()
        }
        _SD.prototype.init = function() {
            this.getsupplierdata()
            this.saveClick()
        }
        _SD.prototype.getsupplierdata = function() { //获取供应商详情
            let t = this
            console.log(t.linkParam.id)
            if (t.linkParam.id == undefined || t.linkParam.id == '') {
                t.setImg('')
                return
            }
            quest.suppliers.getsupplierdata({
                data: {
                    supplierId: t.linkParam.id
                },
                success: function(res) {
                    t.setData(res.data)
                }
            })
        }
        _SD.prototype.setData = function(data) { //数据显示
            let sdName = document.querySelector('#sdName')
            let sdTel = document.querySelector('#sdTel')
            let sdTitle = document.querySelector('#sdTitle')
            let sdDesc = document.querySelector('#sdDesc')
            sdName.value = data.name
            sdTel.value = data.tel
            sdTitle.value = data.title
            sdDesc.value = data.desc
            this.setImg(data.image)
        }
        _SD.prototype.setImg = function(img) { //显示图片
            console.log('img', img)
            let t = this
            selpicure({
                el: '#selpicure1',
                num: 1,
                images: [{
                    image: img
                }],
                imgChange: function(files) {
                    t.files = files
                }
            })
        }

        _SD.prototype.saveClick = function() {
            let t = this
            t.sdSave.addEventListener('click', function(e) {
                t.saveSupplier()
            })
        }

        _SD.prototype.saveSupplier = function() {
            let sdName = document.querySelector('#sdName'),
                sdTel = document.querySelector('#sdTel'),
                sdTitle = document.querySelector('#sdTitle'),
                sdDesc = document.querySelector('#sdDesc'),
                sdImg = document.querySelector('#imgFile')
            let data = {}
            if (this.linkParam.id != undefined) {
                data.id = this.linkParam.id
            }
            console.log(sdImg.files)
                // data.tel = sdTel.value
                // data.name = sdName.value
                // data.title = sdTitle.value
                // data.desc = sdDesc.value
            var formData = new FormData();
            formData.append('tel', sdTel.value)
            formData.append('name', sdName.value)
            formData.append('title', sdTitle.value)
            formData.append('desc', sdDesc.value)
            formData.append('image', this.files[0])
            console.log()
            quest.suppliers.updateSupplier({
                data: formData.append,
                success: function(res) {
                    console.log(res)
                }
            })
        }

        return {
            init: function(obj) {
                new _SD(obj);
            }
        }
    })()
})(window.pz)