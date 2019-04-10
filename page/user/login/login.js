import { app } from '../../../index.js';
import { showToast } from '../../../js/utils.js';;
let adminName = document.querySelector('#adminName'),
    password = document.querySelector('#password');
// adminName.addEventListener('keydown', function(e) {
//     sumbit(e)
// })
// password.addEventListener('keydown', function(e) {
//     sumbit(e)
// })

// function sumbit(e) {
//     if (e.keyCode == 13) {
//         document.querySelector('#login').click()
//     }
// }
document.onkeydown = function(e) {
    var ev = document.all ? window.event : e;
    if (ev.keyCode == 13) {
        document.querySelector('#login').click()
    }
}
document.querySelector('#login').addEventListener('click', function(e) {
    let adminNameVal = adminName.value,
        passwordVal = password.value;
    if (!adminNameVal) {
        showToast({
            text: '请输入用户名'
        })
        return
    }
    if (!passwordVal) {
        showToast({
            text: '请输入密码'
        })
        return
    }
    app.requests({
        url: 'admin/login',
        data: {
            admin_name: adminNameVal,
            passwd: passwordVal
        },
        login: true,
        success(res) {
            app.globalData.cms_con_id = res.cms_con_id || ''
            localStorage.setItem("cms_con_id", res.cms_con_id);
            window.location.href = window.location.origin + '/index.html'
        },
        Error(code) {
            switch (parseInt(code)) {
                case 3002:
                    showToast({
                        type: 'error',
                        text: '用户不存在'
                    })
                    break;
                case 3003:
                    showToast({
                        type: 'error',
                        text: '密码错误'
                    })
                    break;
                case 3004:
                    showToast({
                        type: 'error',
                        text: '登录失败'
                    })
                    break;
                default:
                    showToast({
                        type: 'error',
                        text: '意料之外的错误'
                    })
            }

        }
    })
})