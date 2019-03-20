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

    },
    geturl: function() {
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
export {
    utils
}