var utils = {
    showToast(obj) {
        if (!obj) {
            obj = {}
        }
        let parms = {
            type: obj.type || 'success',
            text: obj.text || '成功'
        }
        let body = document.querySelector('body'),
            ran = parseInt(Math.random() * 100000000);
        let str = '<div id="st' + ran + '" class="showToast ' + parms.type + '"><span class="text">' + parms.text + '</span></div>'
        body.innerHTML += str
        setTimeout(function() {
            body.removeChild(document.querySelector('#st' + ran));
        }, 2000)
        console.log(parseInt(Math.random() * 100000000000))
    },
    showLoading() {

    }
}