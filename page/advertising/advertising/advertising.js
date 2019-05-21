import { app } from '../../../index.js';
import { showToast } from '../../../js/utils.js';
(function(pz) {
    tab({ head: '#dlnav', con: '.dlnav-con', num: 1 });
    select({ el: '#agaddType', data: [{ id: 1, type_name: '专题' }, { id: 21, type_name: '商品图片' }, { id: 22, type_name: '商品信息' }, { id: 3, type_name: '跳转路径' }] });
    select({
        el: '#projectType2',
        data: [{
            id: 1,
            type_name: '专题'
        }, { id: 22, type_name: '商品信息' }, { id: 3, type_name: '跳转路径' }]
    })
    pz.advertising = (function() {
        function _AG(o) {
            this.agadd = document.querySelector('#agadd')
            this.projectadd = document.querySelector('#projectadd')
            this.ids = []
            this.selArr = []
            this.recommends = []
            this.templateId = ''
            this.agImage = ''
            this.type1Img = ''
            this.type2Img = ''
            this.type1Id = ''
            this.type2Id = ''
            this.init()
        }
        _AG.prototype = {
            init: function() { //进入执行
                this.elclick()
                this.getRecommend()
            },
            elclick: function() {
                let t = this
                document.querySelector('#agaddcancel').onclick = function(e) {
                    t.agadd.classList.add('hide')
                }
                document.querySelector('#agaddSave').onclick = function(e) {
                    t.gettype1()
                }
                document.querySelector('#reloadBtn').onclick = function(e) {
                    t.resetRecommend()
                }
                document.querySelector('#projectCancel').onclick = function(e) {
                    t.projectadd.classList.add('hide')
                }
                document.querySelector('#addprojectSave').onclick = function(e) {
                    t.gettype2()
                }
                document.querySelector('#addproject').onclick = function(e) {
                    t.templateId = 10;
                    t.type2Id = ''
                    t.projectadd.classList.remove('hide')
                    t.showtype2({})
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
                    name: 'week',
                    week: true
                }, {
                    model_id: 6,
                    name: 'recommend2',
                    re: true
                }, {
                    model_id: 7,
                    name: 'recommend3',
                    re: true,
                    img: true
                }, {
                    model_id: 8,
                    name: 'recommend4',
                    re: true,
                    img: true
                }, {
                    model_id: 9,
                    name: 'recommend5',
                    re: true
                }, {
                    model_id: 10,
                    name: 'project',
                    noadd: true
                }];
                let len = arr.length,
                    i;
                for (i = 0; i < len; i++) {
                    (function(info) {

                        let elSave = document.querySelector('#' + info.name + 'Save');
                        elSave.onclick = function(e) {
                            t.getmodelInfo({
                                model_id: info.model_id,
                                name: info.name,
                                re: info.re || false,
                                img: info.img
                            })
                        }
                    })(arr[i])
                    select({
                        el: '#' + arr[i].name + 'Show',
                        data: [{
                            id: 1,
                            type_name: '显示'
                        }, {
                            id: 2,
                            type_name: '不显示'
                        }]
                    })
                    if (arr[i].noadd) { continue };
                    (function(info) {
                        let elAdd = document.querySelector('#add' + info.name)
                        elAdd.onclick = function(e) {
                            t.templateId = info.model_id;
                            t.type1Id = ''
                            t.agadd.classList.remove('hide')
                            t.showtype1({
                                week: info.week || false
                            })
                        }
                    })(arr[i])
                }
            },
            resetRecommend() {
                app.requests({
                    url: 'Recommend/resetRecommend',
                    success(res) {
                        showToast({
                            type: 'success',
                            text: '刷新成功'
                        })
                    },
                    Error(code) {
                        showToast({
                            text: '刷新失败'
                        })
                    }
                })
            },
            showtype1(data) {
                let t = this
                document.querySelector('#agaddTit').value = data.title || ''
                document.querySelector('#agaddSort').value = data.model_order || '';
                document.querySelector('#agaddContent').value = data.jump_content || '';
                let selection = document.querySelector('#agaddType').querySelector('.ant-select-selection')
                if (data.week) {
                    document.querySelector('#weekcontrol').classList.remove('hide')
                    document.querySelector('#agaddWeek').value = data.show_days || ''
                } else {
                    document.querySelector('#weekcontrol').classList.add('hide')
                }
                if (data.type) {
                    selection.setAttribute('data-id', data.type)
                    selection.classList.add('already-select')
                    selection.innerHTML = t.gettypeText(data.type)
                } else {
                    selection.classList.remove('already-select')
                    selection.setAttribute('data-id', '')
                    selection.innerHTML = '请选择'
                }
                this.settype1images({
                    img: data.image_path || ''
                })
            },
            showtype2(data) {
                let t = this
                select({
                    el: '#projectSuberior',
                    data: t.selArr
                })
                if (data.type) {
                    document.querySelector('#projectaddId').classList.add('hide');
                    let selection = document.querySelector('#projectSuberior').querySelector('.ant-select-selection')
                    selection.setAttribute('data-id', '')
                    selection.setAttribute('data-value', '')
                    selection.innerHTML = '请选择'
                } else {
                    document.querySelector('#projectaddId').classList.remove('hide')
                }
                document.querySelector('#projectTit2').value = data.title || ''
                document.querySelector('#projectSort2').value = data.model_order || ''
                document.querySelector('#projectContent2').value = data.jump_content || '';
                let selection = document.querySelector('#projectType2').querySelector('.ant-select-selection')
                if (data.type) {
                    selection.setAttribute('data-id', data.type)
                    selection.classList.add('already-select')
                    selection.innerHTML = t.gettypeText(data.type)
                } else {
                    selection.classList.remove('already-select')
                    selection.setAttribute('data-id', '')
                    selection.innerHTML = '请选择'
                }
                this.settype2images({
                    img: data.image_path || ''
                })
            },

            gettype1() {
                let t = this,
                    data = {};
                data.title = document.querySelector('#agaddTit').value;
                data.model_order = document.querySelector('#agaddSort').value;
                data.show_days = document.querySelector('#agaddWeek').value;
                let type = document.querySelector('#agaddType').querySelector('.ant-select-selection').getAttribute('data-id');
                let typeId = t.gettypeId(type);
                data.jump_content = document.querySelector('#agaddContent').value
                data.tier = 2
                data.jump_type = typeId.jump
                data.show_type = typeId.show
                if (data.show_type == 2) {
                    data.show_data = typeId.show
                }
                data.model_id = t.templateId
                data.parent_id = t.ids[parseInt(t.templateId) - 1]
                data.image_path = t.type1Img
                    // if (data.model_id == 7 || data.model_id == 8) {
                    //     data.image_path = t.agImage
                    // } else {
                    //     data.image_path = t.type1Img
                    // }
                data.id = t.type1Id
                if (t.type1Id) {
                    data.uploadtype = 'update'
                } else {
                    data.uploadtype = 'add'
                }
                t.addRecommend(data)
            },
            gettype2() {
                let t = this,
                    data = {},
                    suberiorid = [],
                    suberior = document.querySelector('#projectSuberior').querySelector('.ant-select-selection').getAttribute('data-id') || ''
                if (suberior.indexOf(',') != -1) {
                    suberiorid = suberior.split(',')
                }
                data.title = document.querySelector('#projectTit2').value
                data.model_order = document.querySelector('#projectSort2').value;
                let type = document.querySelector('#projectType2').querySelector('.ant-select-selection').getAttribute('data-id'),
                    typeId = t.gettypeId(type)
                data.jump_content = document.querySelector('#projectContent2').value
                data.tier = suberiorid[0]
                data.jump_type = typeId.jump
                data.show_type = typeId.show
                data.show_data = typeId.show
                data.model_id = '10'
                data.parent_id = suberiorid[1]
                data.image_path = t.type2Img
                data.id = t.type2Id
                if (t.type2Id) {
                    data.uploadtype = 'update'
                    data.tier = ''
                } else {
                    data.uploadtype = 'add'
                }
                data.project = true
                t.addRecommend(data)
            },
            getRecommend(data) {
                let t = this
                app.requests({
                    url: 'Recommend/getRecommend',
                    success(res) {
                        // t.ids = res.recommends_ids || []
                        t.disRecommend(res.recommends || [])
                    },
                    Error(code) {
                        showToast({
                            text: '获取失败'
                        })
                    }
                })
            },
            disRecommend(data = []) {
                let arr = data,
                    len = arr.length,
                    i, x, info, recommends = {};
                let list = [{
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
                        re: true,
                        img: true
                    }, {
                        model_id: 8,
                        name: 'recommend4',
                        re: true,
                        img: true
                    }, {
                        model_id: 9,
                        name: 'recommend5',
                        re: true
                    }, {
                        model_id: 10,
                        name: 'project'
                    }],
                    len1 = list.length,
                    tf;
                for (x = 0; x < len1; x++) {
                    info = {}
                    tf = false
                    for (i = 0; i < len; i++) {
                        if (list[x].model_id == arr[i].model_id) {
                            recommends[info.text] = arr[i]
                            info = arr[i]
                            tf = true
                        }
                    }
                    this.ids.push(info.id || '')
                    if (x == 9 & tf) {
                        this.setselArr(info.son)
                        info.son = this.disInfo(info.son)
                    }
                    this.setpageRecommend(info, list[x], tf)
                }
                this.recommends = recommends
            },
            disInfo(data) {
                if (data.length < 1) return
                let len = data.length,
                    i, x, arr = [],
                    len1;
                for (i = 0; i < len; i++) {
                    len1 = data[i].third.length
                    arr.push(data[i])
                    for (x = 0; x < len1; x++) {
                        arr.push(data[i].third[x])
                    }
                }
                return arr
            },
            setselArr(data) {
                // if (data.length < 1) return
                let len = data.length,
                    i, arr = [];
                for (i = 0; i < len; i++) {
                    if (data[i].tier == 2) {
                        arr.push({
                            id: '3,' + data[i].id,
                            type_name: data[i].title
                        })
                    }
                }
                arr.unshift({
                    id: '2,' + this.ids[9],
                    type_name: '顶级分类'
                })
                this.selArr = arr;
            },
            setpageRecommend(data, list, tf) { //
                let selection, t = this;
                if (list.img) {
                    this.setimages({
                        el: '#' + list.name + 'Img',
                        img: data.image_path || '',
                        name: list.name
                    })
                }
                if (!tf) return
                document.querySelector('#' + list.name + 'Tit').value = data.title
                document.querySelector('#' + list.name + 'Sort').value = data.model_order
                if (list.re) {
                    document.querySelector('#' + list.name + 'Id').value = data.jump_content
                }
                selection = document.querySelector('#' + list.name + 'Show').querySelector('.ant-select-selection')
                selection.setAttribute('data-id', data.is_show)
                selection.classList.add('already-select')
                if (data.is_show == 1) {
                    selection.innerHTML = '显示'
                } else {
                    selection.innerHTML = '不显示'
                }
                t.setImgList(data.son, list.name)
            },
            setImgList(data, name) {
                if (!data) return
                if (data.length < 1) return
                let t = this,
                    len = data.length,
                    i, str = '';
                for (i = 0; i < len; i++) {
                    let typeText = t.gettypeText(t.gettypeEid(data[i].jump_type, data[i].show_type))
                    str += '<div class="table-tr">'
                    str += '<span class="col-md-1 bot-bor subli">' + data[i].id + '</span>'
                    str += '<span class="col-md-2 bot-bor subli"><image class="stImg" src="' + data[i].image_path + '"/></span>'
                    str += '<span class="col-md-2 bot-bor subli">' + data[i].title + '</span>'
                    if (data[i].model_id == 5) {
                        str += '<span class="col-md-1 bot-bor subli">' + data[i].show_days + '</span>'
                        str += '<span class="col-md-1 bot-bor subli">' + typeText + '</span>'
                    } else if (data[i].model_id == 10) {
                        str += '<span class="col-md-1 bot-bor subli">' + data[i].tier + '--' + data[i].parent_id + '</span>'
                        str += '<span class="col-md-1 bot-bor subli">' + typeText + '</span>'
                    } else {
                        str += '<span class="col-md-2 bot-bor subli">' + typeText + '</span>'
                    }

                    str += '<span class="col-md-2 bot-bor subli">' + data[i].jump_content + '</span>'
                    str += '<span class="col-md-1 bot-bor subli">' + data[i].model_order + '</span>'
                    str += '<span class="col-md-2 bot-bor subli"><div class="pz-btn btn-amend" data-id="' + data[i].id + '" data-model="' + data[i].model_id + '">编辑</div>\
                    <div class="pz-btn btn-del" data-id="' + data[i].id + '" data-model="' + data[i].model_id + '">删除</div></span></span>'
                    str += '</div>'
                }
                document.querySelector('#' + name + 'list').innerHTML = str
                t.btnamend(name)
                t.btndel(name)
            },
            btndel(name) {
                let t = this,
                    namends = document.querySelector('#' + name + 'list').querySelectorAll('.btn-del')
                namends.forEach(function(li) {
                    li.addEventListener('click', function(e) {
                        let id = li.getAttribute('data-id')
                        t.templateId = li.getAttribute('data-model')
                        t.delRecommend(id)
                    })
                })
            },
            btnamend(name) {
                let t = this,
                    namends = document.querySelector('#' + name + 'list').querySelectorAll('.btn-amend');
                namends.forEach(function(li) {
                    li.addEventListener('click', function(e) {
                        let id = li.getAttribute('data-id')
                        t.templateId = li.getAttribute('data-model')
                        t.getRecommendInfo1(id)
                    })
                })
            },
            delRecommend(id) {
                let t = this
                app.requests({
                    url: 'Recommend/delRecommend',
                    data: { id: id },
                    success(res) {
                        // t.getRecommendInfo1(id)3
                        showToast({
                            type: 'success',
                            text: '删除成功'
                        })
                        t.getRecommendInfo({
                            id: t.ids[parseInt(t.templateId) - 1],
                            model_id: t.templateId
                        })
                    },
                    Error(code) {
                        if (code == 3002) {
                            showToast({
                                text: '请先删除下级推荐'
                            })
                        } else {
                            showToast({
                                text: '删除失败'
                            })
                        }
                    }
                })
            },
            getRecommendInfo1(id = '') {
                let t = this
                app.requests({
                    url: 'Recommend/getRecommendInfo',
                    data: { id: id },
                    success(res) {
                        if (t.templateId == 10) {
                            t.type2Id = res.recommends_info.id
                            console.log(t.type2Id)
                            t.projectadd.classList.remove('hide')
                            t.showtype2(t.distype1Info(res.recommends_info))

                        } else {
                            t.type1Id = res.recommends_info.id
                            t.showtype1(t.distype1Info(res.recommends_info))
                            t.agadd.classList.remove('hide')
                        }
                    },
                    Error(code) {
                        showToast({
                            text: '获取失败'
                        })
                    }
                })
            },

            distype1Info(data) {
                let valarr = data,
                    t = this,
                    type = t.gettypeEid(valarr.jump_type, valarr.show_type),
                    typeContent = t.gettypeText(type);
                valarr.type = type
                valarr.typeContent = typeContent
                if (valarr.model_id == 5) {
                    valarr.week = true
                }

                return valarr
            },
            getmodelText(n) {
                let info = {}
                switch (parseInt(n)) {
                    case 1:
                        info = {
                            text: 'banner',
                        }
                        break;
                    case 2:
                        info = {
                            text: 'icon',
                        }
                        break;
                    case 3:
                        info = {
                            text: 'activity',
                        }
                        break;
                    case 4:
                        info = {
                            text: 'recommend1',
                            re: true
                        }
                        break;
                    case 5:
                        info = {
                            text: 'week'
                        }
                        break;
                    case 6:
                        info = {
                            text: 'recommend2',
                            re: true,
                        }
                        break;
                    case 7:
                        info = {
                            text: 'recommend3',
                            re: true,
                            img: true
                        }
                        break;
                    case 8:
                        info = {
                            text: 'recommend4',
                            re: true,
                            img: true
                        }
                        break;
                    case 9:
                        info = {
                            text: 'recommend5',
                            re: true
                        }
                        break;
                    case 10:
                        info = {
                            text: 'project'
                        }
                        break;
                    default:
                        info = {}
                        break;
                }
                return info
            },
            getmodelInfo(data) {
                console.log(data)
                let t = this,
                    tit = document.querySelector('#' + data.name + 'Tit').value,
                    sort = document.querySelector('#' + data.name + 'Sort').value,
                    is_show = document.querySelector('#' + data.name + 'Show').querySelector('.ant-select-selection').getAttribute('data-id') || 1,
                    jump_type = '',
                    jump_content = '',
                    image_path = '';
                if (data.re) {
                    jump_type = 1
                    jump_content = document.querySelector('#' + data.name + 'Id').value
                }
                if (data.img) {
                    // imgInp = document.querySelector('#' + data.name + 'Img')
                    // ulli = imgInp.querySelectorAll('li')[0]
                    // if (ulli) {
                    //     image_path = ulli.querySelector('img').getAttribute('src')
                    // }
                    image_path = t.agImage
                }
                let id = t.ids[parseInt(data.model_id) - 1] || '',
                    uploadtype = '';
                if (id) {
                    uploadtype = 'update'
                } else {
                    uploadtype = 'add'
                }
                this.addRecommend({
                    uploadtype: uploadtype,
                    id: id,
                    model_id: data.model_id,
                    title: tit,
                    model_order: sort,
                    jump_type: jump_type,
                    jump_content: jump_content,
                    image_path: image_path,
                    is_show: is_show,
                    tier: 1
                })
            },
            addRecommend: function(data) {
                let t = this,
                    params = {
                        id: data.id || '',
                        model_id: data.model_id || '',
                        title: data.title || '',
                        image_path: data.image_path || '',
                        parent_id: data.parent_id || '',
                        jump_type: data.jump_type || '',
                        jump_content: data.jump_content || '',
                        show_type: data.show_type || '',
                        show_data: data.show_data || '',
                        show_days: data.show_days || '',
                        is_show: data.is_show || '',
                        tier: data.tier || '',
                        model_order: data.model_order || '',
                        model_son_order: data.model_son_order || ''
                    },
                    url = '';
                if (data.uploadtype === 'update') {
                    url = 'Recommend/updateRecommend'
                } else if (data.uploadtype === 'add') {
                    url = 'Recommend/addRecommend'
                }
                app.requests({
                    url: url,
                    data: params,
                    success(res) {
                        showToast({
                            type: 'success',
                            text: '操作成功'
                        })
                        if (data.tier == 1 & data.uploadtype === 'add') {
                            t.ids[parseInt(data.model_id) - 1] = res.add_id || ''
                        }
                        if (data.tier == 2) {
                            t.agadd.classList.add('hide')
                        }
                        if (data.project) {
                            t.projectadd.classList.add('hide')
                        }
                        t.getRecommendInfo({
                            id: t.ids[parseInt(data.model_id) - 1],
                            model_id: data.model_id
                        })
                        t.type1Img = ''
                        t.type2Img = ''
                    },
                    Error(code) {
                        let text = ''
                        switch (parseInt(code)) {
                            case 3001:
                            case 3002:
                            case 3006:
                            case 3007:
                            case 3008:
                            case 3011:
                            case 3013:
                                text = '添加失败'
                                break;
                            case 3003:
                                text = '信息未填写完整'
                                break;
                            case 3004:
                                text = '请上传图片(选择商品图片)'
                                break;
                            case 3005:
                                text = '未设置显示星期'
                                break;
                            case 3009:
                                text = '超出添加数量'
                                break;
                            case 3010:
                                text = '图片没有上传'
                                break;
                            case 3012:
                                text = '上级未选择'
                                break;
                            case 3011:
                                text = '添加失败'
                                break;
                            case 3013:
                                text = '添加内容模板与父级模板不一致'
                                break;
                            default:
                                text = '意料之外的错误'
                                break;
                        }
                        showToast({
                            text: text
                        })
                    }
                })
            },
            getRecommendInfo(data = {}) {
                let t = this
                app.requests({
                    url: 'Recommend/getRecommendInfo',
                    data: { id: data.id },
                    success(res) {
                        if (data.model_id == 10) {
                            let son = t.disInfo(res.recommends_info.son)
                            t.setImgList(son, t.getmodelText(data.model_id).text)
                            t.setselArr(res.recommends_info.son)
                        } else {
                            t.setImgList(res.recommends_info.son, t.getmodelText(data.model_id).text)
                        }
                    },
                    Error(code) {
                        showToast({
                            text: '获取出错'
                        })
                    }
                })
            },
            setimages(data) {
                let t = this
                selpicure({
                    el: data.el,
                    images: [{ image: data.img }],
                    imgChange: function(images) {
                        console.log(images)
                        t.agImage = images[0].image
                    }
                })
            },
            settype1images(data) {
                let t = this
                selpicure({
                    el: '#agaddImg',
                    images: [{ image: data.img || '' }],
                    imgChange: function(images) {
                        t.type1Img = images[0].image
                    }
                })
            },
            settype2images(data) {
                let t = this
                selpicure({
                    el: '#projectImg',
                    images: [{ image: data.img || '' }],
                    imgChange: function(images) {
                        t.type2Img = images[0].image
                    }
                })
            },
            gettypeText(n) {
                let text = ''
                switch (parseInt(n)) {
                    case 1:
                        text = '专题'
                        break;
                    case 21:
                        text = '商品图片'
                        break;
                    case 22:
                        text = '商品信息'
                        break;
                    case 3:
                        text = '跳转路径'
                        break;
                    default:
                        text = '请选择'
                        break;
                }
                return text
            },
            gettypeEid(jid, sid) {
                jid = parseInt(jid),
                    sid = parseInt(sid)
                if (jid === 1) {
                    return 1
                } else if (jid === 2 & sid === 1) {
                    return 21
                } else if (jid === 2 & sid === 2) {
                    return 22
                } else if (jid === 3) {
                    return 3
                }
            },
            gettypeId(n) {
                let type = {}
                switch (parseInt(n)) {
                    case 1:
                        type = {
                            jump: 1,
                            show: ''
                        }
                        break;
                    case 21:
                        type = {
                            jump: 2,
                            show: 1
                        }
                        break;
                    case 22:
                        type = {
                            jump: 2,
                            show: 2
                        }
                        break;
                    case 3:
                        type = {
                            jump: 3,
                            show: ''
                        }
                        break;
                    default:
                        type = {
                            jump: 1,
                            show: ''
                        }
                        break;
                }
                return type
            }
        }

        return {
            init: function(o) {
                return new _AG(o)
            }
        }
    })()
    pz.advertising.init()
})(window.pz)