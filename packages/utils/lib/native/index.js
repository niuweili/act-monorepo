/**
 * native 方法集合
 * @Date 2019/01/17
 */
export { callJsRegister } from './native';
let NativeSDK = {};

// if (process.client) {
NativeSDK = require('./native').default;
// window.onpageshow = () => {
//   // 启动bridge
//   console.log('pageshow -> 初始化 native');
//   NativeSDK = require('./native').default;
// }
// }
const native = {
    registerCallJsMethods: (opt, callback) => NativeSDK.registerCallJsMethods(opt, callback),
    linkShareToInviteOthers: (data, callback) => NativeSDK.linkShareToInviteOthers(data, callback),
    inviteCodeShareToInviteOthers: (data, callback) =>
        NativeSDK.inviteCodeShareToInviteOthers(data, callback),
    /* 微信分享 */
    share: (data, callback) => NativeSDK.share(data, callback),
    /* 绑定微信授权 */
    bindWeChat: (data, callback) => NativeSDK.bindWeChat(data, callback),
    /* 绑定QQ授权 */
    bindQqChat: (data, callback) => NativeSDK.bindQqChat(data, callback),
    /* 获取App版本 */
    getAppVersion: (data, callback) => NativeSDK.getAppVersion(data, callback),
    /* 获取粘贴板内容 */
    getClipboard: (data, callback) => NativeSDK.getClipboard(data, callback),
    /* 关闭当前网页 */
    closePage: (data, callback) => NativeSDK.finish(data, callback),
    /* 检查摄像头权限 */
    checkCameraPerm: (data, callback) => NativeSDK.checkCameraPerm(data, callback),
    /* 检查话筒权限 */
    checkAudioPerm: (data, callback) => NativeSDK.checkAudioPerm(data, callback),
    /* 路由回退 */
    goBack: (data, callback) => NativeSDK.goBack(data, callback),
    /* 退出登录 */
    exitAccount: (data, callback) => NativeSDK.exitAccount(data, callback),
    /* 青少年模式输入密码 */
    teenagerCanUse: (data, callback) => NativeSDK.teenagerCanUse(data, callback),
    /* 青少年模式修改密码 */
    teenagerSwitch: (data, callback) => NativeSDK.teenagerSwitch(data, callback),
    /* 检查微信 */
    checkWx: (data, callback) => NativeSDK.checkWx(data, callback),
    /* 获取用户好友列表 */
    getFriendsList: (data, callback) => NativeSDK.getFriendsList(data, callback),
    /* 根据关键字搜索用户好友列表 */
    getFriendsListWithKeyword: (data, callback) =>
        NativeSDK.getFriendsListWithKeyword(data, callback),
    /* 微信支付环境重置 ios */
    jumpWx: (data, callback) => {
        NativeSDK.jumpWx(data, callback);
    },
    /* IOS支付 */
    pay: (data, callback) => NativeSDK.pay(data, callback),
    /* 打开通讯录 */
    selectUserFromRelationList: (data, callback) =>
        NativeSDK.selectUserFromRelationList(data, callback),
    /* 打开充值页面 */
    gotoRecharge: (data, callback) => NativeSDK.gotoRecharge(data, callback),
    /* 打开手机绑定页面 */
    gotoBindMobile: (data, callback) => NativeSDK.gotoBindMobile(data, callback),
    /* 打开消息界面 */
    gotoConversation: (data, callback) => NativeSDK.gotoConversation(data, callback),
    /* 开通vip微信支付成功安卓 */
    openVipWxPaySuccess: (data, callback) => NativeSDK.openVipWxPaySuccess(data, callback),

    /* 打开新网页 */
    openPage: (url) => {
        const ua = window.navigator.userAgent;
        let targetUrl = url;
        // if (ua.indexOf('pid') > -1) {
        if (/iPhone|iPad|ios/gi.test(ua)) {
            targetUrl = `inframeskr://web/fullScreen?&showShare=1&url=${url}@@title=1`;
        }
        window.location.href = targetUrl;
    },
    faceVerify: (data, callback) => NativeSDK.faceVerify(data, callback),
    recordSweetCareVoice: (data, callback) => NativeSDK.recordSweetCareVoice(data, callback),
    uploadSweetCarePhotos: (data, callback) => NativeSDK.uploadSweetCarePhotos(data, callback),
    openWebView: (data, callback) => NativeSDK.openWebView(data, callback),
    uploadPhotos: (data, callback) => NativeSDK.uploadPhotos(data, callback),
    openXieYiWebView: (data, callback) => NativeSDK.openXieYiWebView(data, callback),
    playAudio: (data, callback) => NativeSDK.playAudio(data, callback), //ios播放音乐
    pauseAudio: (data, callback) => NativeSDK.pauseAudio(data, callback), //ios暂停播放
    resumeAudio: (data, callback) => NativeSDK.resumeAudio(data, callback), //ios继续播放
    stopPlayAudio: (data, callback) => NativeSDK.stopPlayAudio(data, callback), //ios停止播放
    getCurrentUserInfo: (data, callback) => NativeSDK.getCurrentUserInfo(data, callback), //获取用户信息
    showToast: (data, callback) => NativeSDK.showToast(data, callback),
    didReceiveCeremonyGift: (data, callback) => NativeSDK.didReceiveCeremonyGift(data, callback), //豪礼相送已领取(需要刷新坑位)
    selectSong: (data, callback) => NativeSDK.selectSong(data, callback), //选择歌曲上传
    shareToChat: (data, callback) => NativeSDK.shareToChat(data, callback), //站内转发H5
    showHalfPayment: (data, callback) => NativeSDK.showHalfPayment(data, callback), //唤起原生充值页面
    getH5CacheResourceFromApp: (data, callback) =>
        NativeSDK.getH5CacheResourceFromApp(data, callback), // h5 从ios获取缓冲资源
    permissionCheck: (data, callback) => NativeSDK.permissionCheck(data, callback), //消费限制
    openSkrKillInviteTeam: (data, callback) => NativeSDK.openSkrKillInviteTeam(data, callback) //打开撕歌杀组队弹框
};

export default native;
