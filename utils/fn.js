var config = {
    // domain: 'https://m1.apifoxmock.com/m1/620884-0-default/'
    domain: ''
}
export default {
    data: {
        touch: {
            startX: 0,
            startY: 0,
        }
    },
    /** 生成uuid
     * @param {number} len - 指定长度
     * @param {number} radix - 基数
     */
    uuid(len, radix) {
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        let uuid = [];
        let i;
        radix = radix || chars.length;
        if (len) {
            for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
        } else {
            let r;

            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';

            for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | Math.random() * 16;
                    uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                }
            }
        }

        return uuid.join('');
    },
    /**  类型检测 */
    typeOf(o) {
        const _toString = Object.prototype.toString;
        const _type = {
            'undefined': 'undefined',
            'number': 'number',
            'boolean': 'boolean',
            'string': 'string',
            '[object Function]': 'function',
            '[object RegExp]': 'regexp',
            '[object Array]': 'array',
            '[object Error]': 'error',
            '[object Set]': 'set',
            '[object Map]': 'map',
        };
        return _type[typeof o] || _type[_toString.call(o)] || (o ? 'object' : 'null')
    },
    /** 获取长度 */
    length(d) {
        const t = this.typeOf(d);
        return (t == 'undefined' || t == 'error' || t == 'null') && 0 || (t == 'boolean' || t == 'regexp' || t == 'function') && 1 || (t == 'string' || t == 'array') && d.length || (t == 'number') && d.toString().length || (t == 'object') && Object.keys(d).length || 0
    },
    /***  对象值长度 */
    valueLength(o) {
        const l = Object.values(o);
        let cum = 0;
        for (let i = 0, j = l.length; i < j; i++) {
            if (l[i])
                cum++;
        }
        return cum;
    },
    /** 对象的深层复刻 */
    copyData(o) {
        const _o = this.typeOf(o) === 'object' ? {} : this.typeOf(o) === 'array' ? [] : o;
        if (_o === o) return _o;
        for (const i in o) {
            if (Object.prototype.hasOwnProperty.call(o, i)) { //不能把原型链上的一起拷贝了
                const _type = this.typeOf(o[i]);
                _o[i] = (_type === 'object' || _type === 'array') && this.copyData(o[i]) || o[i];
            }
        }
        return _o;
    },
    /** 删除对象空值 */
    delObjectVoidValue(o) {
        let _a = Object.keys(o);
        for (let i = _a.length; i--;) {
            if (!_a[i])
                delete o[_a[i]]
        }
        return o;
    },
    /**  本地 get */
    _get(domain, url, data, noShowloading = !1) {
        !noShowloading && this.showLoading();
        return new Promise((resolve, reject) =>
            wx.request({
                url: domain + url,
                data: data,
                header: {
                    "content-type": "application/json",
                },
                method: "GET",
                timeout: 10000,
                dataType: "json",
                success: (res) => {
                    // console.log('get', new Date().toLocaleString(), url, data, res.data);
                    if (!res?.data?.success)
                        this.getDataErr(url, res?.data?.message?.toString() + ',' + res?.data?.code);
                    !noShowloading && this.hideLoad();
                    resolve(res?.data);
                },
                fail: (err) => {
                    this.getDataErr(url, err, 'get');
                    !noShowloading && this.hideLoad();
                    reject(err);
                }
            })
        )
    },
    /**  输入框设置数据 
     *      ！！！！！！ 
     * 
     *          注意，该方法使用需要 call ，并且 本方法内使用 this 须谨慎
     * 
     *      ！！！！！！
     */
    setData(e) {
        let data = {};
        data[e.currentTarget.dataset.name] = e.detail.value;
        this.setData(data);
    },
    /***  一般 get 请求 */
    get(url, data, _a = !1) {
        return this._get(config.domain, url, data, _a);
    },
    /** 内部SSE POST请求  */
    _ssePost(domain, url, data, header = '', ) {
        if (header == 'json')
            header = 'application/json',
            data = JSON.stringify(data);
        else
            header = 'application/x-www-form-urlencoded';
        return wx.request({
            url: domain + url,
            data,
            header: {
                "Content-Type": header,
            },
            enableChunked: true,
            method: "POST",
        })
    },
    /** 内部 post  */
    _post(domain, url, data, header = '', noShowloading = !1) {
        !noShowloading && this.showLoading();
        if (header == 'json')
            header = 'application/json',
            data = JSON.stringify(data);
        else
            header = 'application/x-www-form-urlencoded';
        return new Promise((resolve, reject) =>
            wx.request({
                url: domain + url,
                data,
                header: {
                    "Content-Type": header,
                },
                timeout: 20000,
                method: "POST",
                success: (res) => {
                    !noShowloading && this.hideLoad();
                    if (!res.data.success) {
                        let message = res.data.message;
                        message = !message ? '' : typeof message == 'string' ? message : message.toString();
                        this.getDataErr(url, message + ',' + res.data.code);
                    } else {
                        // if (url != 'sysWxLog/saveLog')
                        // console.log('post', new Date().toLocaleString(), url, data, res.data);
                    }
                    resolve(res.data);
                },
                fail: (err) => {
                    !noShowloading && this.hideLoad();
                    this.getDataErr(url, err, 'post');
                    reject(err);
                }
            })
        )
    },
    /** 普通 post 请求  */
    post(url, data, header, _a = !1) {
        return this._post(config.domain, url, data, header, _a);
    },
    // 支付 post 请求接口
    payPost(url, data, header, _a = !0) {
        return this._post(config.payDomin, url, data, header, _a);
    },

    /*** 通过身份证号获取性别 */
    idCardForSex(code) {
        return code.length == 18 && (code.substring(16, 17) % 2 == 0 ? 2 : 1) || (code.substring(14) % 2 == 0 ? 2 : 1);
    },
    /** 展示 loading 状态，禁止穿透 */
    showLoading() {
        wx.showLoading({
            title: '请稍等',
            mask: true
        });
    },
    /** 隐藏 load  界面 */
    hideLoad() {
        wx.hideLoading();
    },
    /**  showToast 再封装   
     *   d,time,fn  皆可以省略或选择性省略 
     *   * */
    showInfo(msg, d = 0, time = 2345, fc = null) {
        let icon = ['success', 'error', 'loading', 'none'];
        if (typeof d == 'function') fc = d, time = 2345, d = 0;
        else if (typeof time == 'function') {
            if (d > 400) fc = (typeof time == 'function' ? time : null), time = d, d = 0;
            else fc = (typeof time == 'function' ? time : null), time = 2345;
        }
        try {
            setTimeout(() =>
                wx.showToast({
                    title: msg,
                    icon: icon[d],
                    mask: true,
                    duration: time,
                    complete: () => setTimeout(() => this.callBack(fc), time)
                }), 200);
        } catch (err) {
            setTimeout(() => this.callBack(fc), time);
        }
    },
    /** 倒计时去往页面 */
    showTimeOutGoTo(n, url, message = '') {
        if (!n)
            this[url != '/pages/home/homeHome/homeHome' && url != '/pages/message/messageHome/messageHome' && url != '/pages/user/userHome/userHome' ? 'reTo' : 'rlTo'](url);
        else
            this.showInfo(`${n} 秒后将跳转至${message}`, 3, 1020, () => this.showTimeOutGoTo(--n, url, message));
    },
    /*** 封装 showModel
     * 
     */
    showIKnow(title, content, successFn = null, confirmText = '已知晓', cancelFn = null, cancelText = '取消') {
        if (successFn == null)
            cancelText = '';
        if (!confirmText)
            confirmText = "已知晓";
        wx.showModal({
            showCancel: !cancelText ? false : true,
            cancelText,
            cancelColor: '#888888',
            title,
            content,
            confirmText,
            success: (res) => {
                if (res.confirm)
                    this.callBack(successFn);
                else if (res.cancel)
                    this.callBack(cancelFn);
            },
            fail: (err) => {
                this.callBack(cancelFn);
            }
        });
    },
    /** px 转换为 rpx */
    pxTRpx(n) {
        return n * 750 / config.windowWidth;
    },
    /** 预览图片或视频 ，需要设置 data-type 设置 type ，通过 src 设置预览地址 */
    previewMedia(e) {
        setTimeout(() => {
            let type = this.dataSet(e, 'type');
            wx.previewMedia({
                current: 0, // 当前显示图片的http链接
                sources: [{
                    url: this.dataSet(e, 'src'),
                    type
                }],
                showmenu: true
            });
        }, 200);
    },
    /** 回调 */
    callBack(fnCallBack) {
        if (this.typeOf(fnCallBack) == 'function')
            fnCallBack()
    },
    /** 获取 url */
    _UToU(o) {
        return this.typeOf(o) != 'string' ? this.dataSet(o, 'u') : o;
    },
    getDataErr(url, err) {
        return
        console.log(err.toString());
        if (url != 'sysWxLog/saveLog' && url != 'sysWxLog/saveModel')
            this.post('sysWxLog/saveLog', {
                wxUserId: config.userid,
                interfaceName: url,
                errorMessage: err.toString()
            }, 'json', true).finally(() =>
                console.log(`\n\n err \n api : ${url}\n\n ${err} \n\n err \n\n\n`))
    },
    dataSet(e, u) {
        return e.currentTarget.dataset[u];
    },

    //多图上传
    multipleUpload(imageList, url, formData = {}) {
        return Promise.all(imageList.map((image, index) => {
            return new Promise((resolve, reject) => {
                console.log('上传 =>', image)
                wx.uploadFile({
                    url: config.domain + url,
                    filePath: image.thumb,
                    name: 'file',
                    header: {
                        'token': wx.getStorageSync('token'),
                        'contentType': 'application/json'
                    },
                    formData: formData,
                    success: function (res) {
                        resolve(JSON.parse(res.data).data.path);
                    },
                    fail: function (err) {
                        console.log('upload error', err);
                        reject(new Error('failed to upload file'));
                    }
                });
            });
        }));
    },

    debounceFunction(callback, coolingTime = 800) {
        let isCooling = false; // 闭包变量，用于记录是否处于冷却状态
        return function (...args) {
            if (isCooling) {
                return; // 如果处于冷却状态，直接返回，不执行回调
            }
            isCooling = true; // 设置为冷却状态
            callback.apply(this, args); // 执行回调函数
            setTimeout(() => {
                isCooling = false; // 冷却时间结束后重置状态
            }, coolingTime);
        };
    },

};