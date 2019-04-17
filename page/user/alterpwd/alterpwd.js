import { showToast } from '../../../js/utils.js';
import { app } from '../../../index.js';
(function() {
    let oldpwd = document.querySelector('#oldpwd'),
        newpwd = document.querySelector('#newpwd'),
        confirmpwd = document.querySelector('#confirmpwd'),
        confirm = document.querySelector('#confirm');
    confirm.addEventListener('click', function(e) {

        let oldpwdVal = oldpwd.value || '',
            newpwdVal = newpwd.value || '',
            confirmpwdVal = confirmpwd.value || '';
        console.log(oldpwdVal, newpwdVal, confirmpwdVal);
        let t = verify({
            oldpwdVal: oldpwdVal,
            newpwdVal: newpwdVal,
            confirmpwdVal: confirmpwdVal
        })
        if (!t) return
        app.requests({
            url: 'admin/midifypasswd',
            data: {
                passwd: oldpwdVal,
                new_passwd1: newpwdVal,
                new_passwd2: confirmpwdVal
            },
            success(res) {
                showToast({
                    type: 'success',
                    text: '修改成功,请重新登录'
                })
                setTimeout(function() {
                    if (window.frames.parent) {
                        window.frames.parent.location.href = window.location.origin + "/page/user/login/login.html";
                    } else {
                        window.location.href = window.location.origin + "/page/user/login/login.html";
                    }
                }, 1500)
            },
            Error(code) {
                let text = ''
                switch (parseInt(code)) {
                    case 3001:
                        text = '原密码错误'
                        break;
                    case 3002:
                        text = '密码必须为6-16个字'
                        break;
                    case 3003:
                        text = '原密码不能为空'
                        break;
                    case 3004:
                        text = '密码确认有误'
                        break;
                    case 3005:
                        text = '修改密码失败'
                        break;
                    default:
                        text = '意料之外的错误'
                }
                showToast({
                    text: text
                })
            }
        })
    })

    function verify(vals) {
        if (vals.oldpwdVal == '') {
            showToast({
                text: '原密码不能为空'
            })
            return false
        }
        if (vals.newpwdVal == '') {
            showToast({
                text: '新密码不能为空'
            })
            return false
        }
        if (vals.newpwdVal.length < 6) {
            showToast({
                text: '新密码不能低于6位'
            })
            return false
        }
        if (vals.newpwdVal.length > 16) {
            showToast({
                text: '新密码不能高于16位'
            })
            return false
        }
        if (vals.confirmpwdVal == '') {
            showToast({
                text: '确认密码不能为空'
            })
            return false
        }
        if (vals.newpwdVal != vals.confirmpwdVal) {
            showToast({
                text: '新密码和确认密码不一致'
            })
            return false
        }
        return true
    }
})()