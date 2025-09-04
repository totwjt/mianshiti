// pages/info/info.js

import {
    submit
} from '../../api/mianshi.js'

Page({

    /**
     * 页面的初始数据
     */
    data: {
        title: "星巴克咖啡商谈细节",
        detail: "",
        nextTime: "",
        nextDetail: "",
        show: false
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

    onDisplay() {
        this.setData({
            show: true
        });
    },
    onClose() {
        this.setData({
            show: false
        });
    },
    formatDate(date) {
        date = new Date(date);
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.toLocaleTimeString()}`;
    },
    onConfirm(event) {
        this.setData({
            show: false,
            nextTime: this.formatDate(event.detail),
        });
    },

    async submit() {
        if (!this.data.title) {
            wx.showToast({
                icon: 'error',
                title: '主题必填',
            })
            return
        }

        if (!this.data.detail || !this.data.nextDetail) {
            wx.showToast({
                icon: 'error',
                title: '沟通详情必填',
            })
            return
        }

        try {
            const {
                code
            } = await submit({
                title: this.data.title,
                detail: this.data.detail,
                nextTime: this.data.nextTime,
                nextDetail: this.data.nextDetail,
            })

            if (code === 0) {
                wx.showToast({
                    title: '提交成功',
                }).then(_ => {
                    wx.navigateBack()
                })
            }
        } catch (error) {
            console.log(error);
        }
    },
    cancel() {
        wx.navigateBack()
    },
})