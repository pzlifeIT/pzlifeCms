var utils = {
    showLoading() {

    },
    tableToExcel(Data) {
        let str = '<tr>\
              <td>购买商品数量</td>\
              <td>商品名称</td>\
              <td>规格</td>\
              <td>商品图片</td>\
              <td>收货方联系人</td>\
              <td>收货方电话</td>\
              <td>详细地址</td>\
              <td>订单号</td>\
              <td>留言</td>\
              <td>供应商名称</td>\
              <td>发件人姓名</td>\
              <td>发件人电话</td>\
        </tr>'; //循环遍历，每行加入tr标签，每个单元格加td标签      
        for (let i = 0; i < Data.length; i++) {
            str += '<tr>';
            for (let item in Data[i]) { //增加\t为了不让表格显示科学计数法或者其他格式   
                str += `<td>${ Data[i][item] + '\t'}</td>`;
            }
            str += `<td>品质生活广场</td>`;
            str += `<td>15502123212</td>`;
            str += '</tr>';
        } //Worksheet名      
        let worksheet = 'Sheet1'
        let uri = 'data:application/vnd.ms-excel;base64,'; //下载的表格模板数据     
        let template = `<html xmlns:o="urn:schemas-microsoft-com:office:office"       xmlns:x="urn:schemas-microsoft-com:office:excel"       xmlns="http://www.w3.org/TR/REC-html40">      <head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>        <x:Name>${worksheet}</x:Name>        <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>        </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->   </head><style type="text/css">table td {border: 1px solid #000000;width: 200px;height: 30px;text-align: center;background-color: #4f891e;color: #ffffff;}</style><body ><table class="excelTable">{table}</table></body></html>';
        <body><table>${str}</table></body></html>`; //下载模板      
        window.location.href = uri + window.btoa(unescape(encodeURIComponent(template)))
    }
}
let geturl = function() {
    let href = location.href,
        list = {}
    if (href.indexOf('?') != -1) {
        let params = href.split('?')[1]
        if (params.indexOf('&') != -1) {
            let arr = params.split('&'),
                len = arr.length
            for (let i = 0; i < len; i++) {
                if (arr[i].indexOf('=') != -1) {
                    let l = arr[i].split('=')
                    list[l[0]] = l[1]
                }
            }
        } else if (params.indexOf('=') != -1) {
            let arr = params.split('=')
            list[arr[0]] = arr[1]
        }
    }
    return list
}
let showToast = function(obj = {}) { //提示信息
    let body = document.querySelector('body'),
        ran = parseInt(Math.random() * 100000000),
        div = document.createElement("div");
    obj.type = obj.type || 'error'
    obj.text = obj.text || ''
    div.setAttribute("id", "st" + ran);
    div.setAttribute("class", "showToast " + obj.type);
    div.innerHTML = '<span class="text din fl">' + obj.text + '</span>';
    body.appendChild(div);
    setTimeout(function() {
        body.removeChild(document.querySelector('#st' + ran));
    }, 2000)
}
let loading = function() { //载入loading
    let body = document.querySelector('body'),
        div = document.createElement("div");
    div.setAttribute("id", "loadingId");
    div.setAttribute("class", "loading");
    div.innerHTML = '<div class="loadEffect"> <span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div><p>加载中</p>';
    body.appendChild(div);
}
let hideloading = function() {
    if (document.querySelector('#loadingId')) {
        document.querySelector('body').removeChild(document.querySelector('#loadingId'))
    }
}

function dataURLtoFile(dataurl, filename) { //将base64转换为文件
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}

function imageDeal(files, returnBase64) {
    //获取file，转成base64	
    var file = files;
    //取传入的第一个文件	
    if (undefined == file) { //如果未找到文件，结束函数，跳出		
        return;
    }
    if (file.size <= 1048576) {
        returnBase64(file)
        return
    }
    var r = new FileReader();
    r.readAsDataURL(file);
    r.onload = function(e) {
        var base64 = e.target.result;
        var bili = 1.5;
        console.log("压缩前：" + base64.length);
        suofang(base64, bili, returnBase64);
    }
}

function suofang(base64, bili, callback) {
    console.log("执行缩放程序,bili=" + bili); //处理缩放，转格式	
    var _img = new Image();
    _img.src = base64;
    _img.onload = function() {
        var _canvas = document.createElement("canvas");
        var w = this.width / bili;
        var h = this.height / bili;
        _canvas.setAttribute("width", w);
        _canvas.setAttribute("height", h);
        _canvas.getContext("2d").drawImage(this, 0, 0, w, h);
        var base64 = _canvas.toDataURL("image/jpeg");
        _canvas.toBlob(function(blob) {
            if (blob.size > 1024 * 1024) {
                suofang(base64, bili, callback);
            } else {
                let m = parseInt(Math.random() * 100000)
                let file = dataURLtoFile(base64, m + '.jpg')
                callback(blob, file);
            }
        }, "image/jpeg");
    }
}
export {
    showToast,
    loading,
    hideloading,
    imageDeal,
    geturl
}