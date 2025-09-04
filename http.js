var urls = `https://m1.apifoxmock.com/m1/620884-0-default/`

/**
 * 供外部post请求调用
 */
function post(url, params, onSuccess, onFailed, noLoad, version) {
    request(urls + url, params, "POST", onSuccess, onFailed, noLoad);
}

/**
 * 供外部get请求调用
 */
function get(url, params, onSuccess, onFailed) {
    request(url, params, "GET", onSuccess, onFailed);
}

/**
 * function: 封装网络请求
 * @url URL地址
 * @params 请求参数
 * @method 请求方式：GET/POST
 * @onSuccess 成功回调
 * @onFailed  失败回调
 */

function request(url, params, method, onSuccess, onFailed, extra = {}) {
    // 2021-06-02 兼容处理 noLoad参数
    var noLoad = (typeof (extra.noLoad) == "undefined") ? false : extra.noLoad
    var version = (typeof (extra.version) == "undefined") ? 1 : extra.version
    var noLoad = (typeof (extra) === "boolean") ? extra : noLoad

    if (!noLoad) {
        wx.showLoading({
            title: "正在加载中...",
            mask: true
        })
    }
    wx.request({
        url: urls + url,
        data: dealParams(params),
        method: method,
        header: {
            'content-type': 'application/x-www-form-urlencoded',
            'token': wx.getStorageSync("token") || '',
            'Accept': `application/prs.Ly.v${version}+json`,
            'os': 'store',
            'lat': wx.getStorageSync("Location").latitude || '',
            'lng': wx.getStorageSync("Location").longitude || '',
            'adcode': wx.getStorageSync("ad_info").adcode || '',
        },
        success: function (res) {
            if (!noLoad) {
                wx.hideLoading();
            }
            // if (res.data) {
            onSuccess(res);
            return
            /** start 根据需求 接口的返回状态码进行处理 */
            if (res.data.code == 0) {
                onSuccess(res.data); //request success
            } else {
                onFailed(res.data.msg, res.data.data); //request failed
            }
            /** end 处理结束*/
            // }
        },
        fail: function (error) {
            console.log('超时？');

            console.log(error);

            onFailed(""); //failure for other reasons
        }
    })
}

/**
 * function: 根据需求处理请求参数：添加固定参数配置等
 * @params 请求参数
 */
function dealParams(params) {
    // console.log("请求参数:", params)
    return params;
}

function requestPromise(url, params = {}, extra = {}) {
    // 2021-06-02 兼容处理 noLoad参数
    var noLoad = (typeof (extra.noLoad) == "undefined") ? false : extra.noLoad
    var version = (typeof (extra.version) == "undefined") ? 1 : extra.version
    var noLoad = (typeof (extra) === "boolean") ? extra : noLoad

    if (!noLoad) {
        wx.showLoading({
            title: "正在加载中...",
            mask: true
        })
    }
    return new Promise((resolve, reject) => {
        wx.request({
            method: 'post',
            url: urls + url,
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'token': wx.getStorageSync("token") || '',
                'Accept': `application/prs.Ly.v${version}+json`,
                'os': 'store',
                'lat': wx.getStorageSync("Location").latitude || '',
                'lng': wx.getStorageSync("Location").longitude || '',
                'adcode': wx.getStorageSync("ad_info").adcode || ''
            },
            data: dealParams(params),
            success(res) {
                if (!noLoad) {
                    wx.hideLoading();
                }
                if (res.data) {
                    resolve(res.data)
                    // if (res.data.code === 0) {
                    //     resolve(res.data)
                    // } else {
                    //     reject(res)
                    // }
                }
            },
            fail(err) {
                console.log('Request Error', err);
                if (!noLoad) {
                    wx.hideLoading();
                }
                reject(err)
            }
        })
    })
}

// 1.通过module.exports方式提供给外部调用
module.exports = {
    postRequest: post,
    getRequest: get,
    request: requestPromise
}