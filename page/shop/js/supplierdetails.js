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
                let formData = {}
                formData.name = sdName.value
                formData.tel = sdTel.value
                formData.title = sdTitle.value
                formData.desc = sdDesc.value
                formData.image = this.dataURLtoBlob(this.getBase64Image(this.files[0]))

                // var formData = new FormData();
                // formData.append('name', sdName.value)
                // formData.append('tel', sdTel.value)
                // formData.append('title', sdTitle.value)
                // console.log(sdTel.value.length)
                // formData.append('desc', sdDesc.value)
                // formData.append('image', this.files[0])
                if (this.linkParam.id != undefined) {
                    formData.append('id', this.linkParam.id)
                    quest.suppliers.updateSupplier({
                        data: formData,
                        success: function(res) {
                            console.log(res)
                        }
                    })
                } else {
                    quest.suppliers.addsupplier({
                        data: formData,
                        success: function(res) {
                            console.log(res)
                        }
                    })
                }
            }
            // _SD.prototype.getBase64Image = function(img) {
            //     var canvas = document.createElement("canvas");
            //     canvas.width = img.width;
            //     canvas.height = img.height;
            //     var ctx = canvas.getContext("2d");
            //     ctx.drawImage(img, 0, 0, img.width, img.height);
            //     var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
            //     var dataURL = canvas.toDataURL("image/" + ext);
            //     return dataURL;
            // }
            // _SD.prototype.dataURLtoBlob = function(dataurl) {
            //     var arr = dataurl.split(','),
            //         mime = arr[0].match(/:(.*?);/)[1],
            //         bstr = atob(arr[1]),
            //         n = bstr.length,
            //         u8arr = new Uint8Array(n);
            //     while (n--) {
            //         u8arr[n] = bstr.charCodeAt(n);
            //     }
            //     return new Blob([u8arr], {
            //         type: mime
            //     });
            // }
        return {
            init: function(obj) {
                new _SD(obj);
            }
        }
    })()
})(window.pz)