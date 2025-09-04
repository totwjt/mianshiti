// index.js

// mock
// const mock = true
// const getList = 'https://m1.apifoxmock.com/m1/620884-0-default/topic/getList'

import {
    getList,
    submit,
} from '../../api/mianshi.js'

Page({

    /**
     * 页面的初始数据
     */
    data: {
        active: 1,
        loading: false,
        list: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        this.list()
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    },

    async list() {
        try {
            const data = await getList()
            console.log(data);
            let list = [...this.data.list, ...data]
            let count = list.length
            this.setData({
                list,
                loading: false,
                count
            })
        } catch (error) {
            console.log(error);
        }
    },

    // 下拉刷新方法
    async onRefresh() {
        // this.data.queryParams.page = 1; // 重置页码
        this.setData({
            loading: true,
            list: []
        });
        this.list();
        wx.showToast({
            title: '下拉刷新',
        })
    },

    // 上拉加载更多方法
    async onLoadMore() {
        // if (!this.data.hasMore) return;
        // this.data.queryParams.page += 1; // 增加页码
        this.list();
    },

    change(e) {
        this.setData({
            active: e.detail.index
        })
    },

    goto() {
        wx.navigateTo({
            url: '/pages/info/info',
        })
    }
})