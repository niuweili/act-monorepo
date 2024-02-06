/**
 * @Author:
 * @Date:   2019/04/17
 * @功能：
 */
/* eslint-disable */
// 注册函数使用
import { ref, watch } from 'vue';
const CALL_JS_CALLBACKS = {};
const REGISTER_CALLBACKS = ref([]);
// 暴露函数方法
const nativeBridge = {
    init(bridge) {
        // this.bridge.init 方法多次调用，只初始化一次，否则会报错
        if (window.initWebViewJavascript) return;
        window.initWebViewJavascript = true;
        this.bridge = bridge;
        this.bridge.init && this.bridge.init();
        this.register();
        // 监听注册回调，等bridge加载完成，再调用函数
        watch(
            REGISTER_CALLBACKS,
            () => {
                for (let i = 0; i < REGISTER_CALLBACKS.value.length; i++) {
                    REGISTER_CALLBACKS.value[i]();
                    REGISTER_CALLBACKS.value[i].finished = true;
                }
            },
            {
                immediate: true,
                deep: true
            }
        );
    },
    register: () => {
        console.log('onGetSongInfo 注册');
        const bridge = nativeBridge.bridge || window.WebViewJavascriptBridge;
        bridge.registerHandler('callJs', function (res, callback) {
            const data = typeof res === 'string' ? JSON.parse(res) : res;
            if (nativeBridge.jsFunc[data.opt]) {
                nativeBridge.jsFunc[data.opt](data, callback);
            } else {
                // todo: 后续需要上报错误信息
                console.error('jsFunc error! data.opt: ', data.opt);
            }
        });

        bridge.registerHandler('pageActive', function (res, callback) {
            console.log('pageActive');
        });
    },
    jsFunc: {
        /**
         * native 条用 js 方法  andriod点了下方返回
         * @param data
         * @param callback
         */
        onBackPressed: function (data, callback) {
            console.log('onBackPressed：', data);
            const opt = data.opt;
            CALL_JS_CALLBACKS[opt] && CALL_JS_CALLBACKS[opt]();
        },

        /**
         * native 条用 js 方法  当前页面激活
         * @param data
         * @param callback
         */
        pageActive: function (data, callback) {
            console.log('pageActive：', data);
            const opt = data.opt;
            CALL_JS_CALLBACKS[opt] && CALL_JS_CALLBACKS[opt]();
        },

        onGetSongInfo: function (data, callback) {
            console.log('onGetSongInfo', data);
            const opt = data.opt;
            CALL_JS_CALLBACKS[opt] && CALL_JS_CALLBACKS[opt](data);
        },

        /**
         * 长链接h5数据同步
         * @param  data
         * @param  callback
         */
        onReceiveRoomH5Msg: (data, callback) => {
            const opt = data.opt;
            CALL_JS_CALLBACKS[opt] && CALL_JS_CALLBACKS[opt](data);
        },

        /**
         * native 获取h5 页面分享信息
         * @param callback
         */
        fetchPageShareInfo: function (data, callback) {
            console.log('fetchPageShareInfo：', data, callback);
            const opt = data.opt;
            CALL_JS_CALLBACKS[opt] && CALL_JS_CALLBACKS[opt](callback);
        }
    },
    /**
     * 调用native的方法
     * @param name
     * @param data
     * @param func
     * @param phase
     * @returns {Promise}
     */
    callNativeFunc: (name, data = {}, func, phase) => {
        return new Promise((resolve, reject) => {
            try {
                console.log('SDK调用开始', name);
                Promise.race([nativeBridge.bridgeHandle(name, data)])
                    .then((response) => {
                        const resData =
                            typeof response === 'string' ? JSON.parse(response) : response;
                        try {
                            // 支持 callback 和 promise
                            if (func) {
                                func(resData)
                                    .then((res) => {
                                        // debug
                                        console.log('回调执行成功', name, res);
                                        resolve(res);
                                    })
                                    .catch((e) => {
                                        console.log('native回调报错', e, name);
                                    });
                            } else {
                                resolve(resData);
                            }
                        } catch (e) {
                            console.log('native回调报错', e, name);
                        }
                    })
                    .catch((e) => {
                        reject(e);
                    });
                // 处理回调参数类型
            } catch (e) {
                // debug
                const data = e.message ? e.message : e;
                console.log('调用SDK出错', name, data);
            }
        });
    },
    bridgeHandle: (name, data = {}) => {
        return new Promise((resolve, reject) => {
            try {
                const bridge = nativeBridge.bridge || window.WebViewJavascriptBridge;
                console.log('bridge', name);
                if (!bridge) return;
                bridge.callHandler('callNative', { opt: name, data: data }, (param) => {
                    console.log('SDK调用成功', name);
                    resolve(param);
                });
            } catch (e) {
                reject(e);
            }
        });
    },
    noSupportVersion() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                reject({ errcode: 999, errmsg: '为保障您的体验，请保持版本为最新' });
            }, 5000);
        });
    }
};

const native = {
    // call js methods
    registerCallJsMethods(opt, cb) {
        CALL_JS_CALLBACKS[opt] = cb;
        console.log(CALL_JS_CALLBACKS, 'CALL_JS_CALLBACKS');
    },

    linkShareToInviteOthers: (data, callback) =>
        nativeBridge.callNativeFunc('linkShareToInviteOthers', data, callback),
    inviteCodeShareToInviteOthers: (data, callback) =>
        nativeBridge.callNativeFunc('inviteCodeShareToInviteOthers', data, callback),
    // call native methods
    share: (data, callback) => nativeBridge.callNativeFunc('share', data, callback),
    bindWeChat: (data, callback) => nativeBridge.callNativeFunc('bindWeChat', data, callback),
    bindQqChat: (data, callback) => nativeBridge.callNativeFunc('bindQqChat', data, callback),
    getAppVersion: (data, callback) => nativeBridge.callNativeFunc('getAppVersion', data, callback),
    getClipboard: (data, callback) => nativeBridge.callNativeFunc('getClipboard', data, callback),
    finish: (data, callback) => nativeBridge.callNativeFunc('finish', data, callback),
    exitAccount: (data, callback) => nativeBridge.callNativeFunc('exitAccount', data, callback),
    teenagerCanUse: (data, callback) =>
        nativeBridge.callNativeFunc('teenagerCanUse', data, callback),
    teenagerSwitch: (data, callback) =>
        nativeBridge.callNativeFunc('teenagerSwitch', data, callback),
    checkCameraPerm: (data, callback) =>
        nativeBridge.callNativeFunc('checkCameraPerm', data, callback),
    getFriendsList: (data, callback) =>
        nativeBridge.callNativeFunc('getFriendsList', data, callback),
    getFriendsListWithKeyword: (data, callback) =>
        nativeBridge.callNativeFunc('getFriendsListWithKeyword', data, callback),
    checkAudioPerm: (data, callback) => {
        const ua = window.navigator.userAgent;
        const isIOS = /iPhone|iPad|ios/gi.test(ua);
        if (isIOS) {
            return Promise.resolve();
        } else {
            return nativeBridge.callNativeFunc('checkAudioPerm', data, callback);
        }
    },
    goBack: (data, cb) => {
        const ua = window.navigator.userAgent;
        if (ua.indexOf('pid') > -1) {
            return nativeBridge.callNativeFunc('back', data, cb);
        } else {
            window.history.back();
        }
    },
    checkWx: (data, callback) => {
        const ua = window.navigator.userAgent;
        if (ua.indexOf('pid') > -1) {
            return nativeBridge.callNativeFunc('checkWx', data, callback);
        } else {
            callback({
                errcode: '0',
                data: {
                    hasWx: true
                }
            });
        }
    },
    jumpWx: (data, callback) => nativeBridge.callNativeFunc('jumpWx', data, callback),
    pay: (data, callback) => nativeBridge.callNativeFunc('payV2', data, callback),
    selectUserFromRelationList: (data, callback) =>
        nativeBridge.callNativeFunc('selectUserFromRelationList', data, callback),
    gotoRecharge: (data, callback) => nativeBridge.callNativeFunc('gotoRecharge', data, callback),
    gotoBindMobile: (data, callback) =>
        nativeBridge.callNativeFunc('gotoBindMobile', data, callback),
    gotoConversation: (data, callback) =>
        nativeBridge.callNativeFunc('gotoConversation', data, callback),
    faceVerify: (data, callback) => nativeBridge.callNativeFunc('faceVerify', data, callback),
    recordSweetCareVoice: (data, callback) =>
        nativeBridge.callNativeFunc('recordSweetCareVoice', data, callback),
    uploadSweetCarePhotos: (data, callback) =>
        nativeBridge.callNativeFunc('uploadSweetCarePhotos', data, callback),
    openWebView: (data, callback) => nativeBridge.callNativeFunc('openWebView', data, callback),
    uploadPhotos: (data, callback) => nativeBridge.callNativeFunc('uploadPhotos', data, callback),
    openXieYiWebView: (data, callback) =>
        nativeBridge.callNativeFunc('openXieYiWebView', data, callback),
    openVipWxPaySuccess: (data, callback) =>
        nativeBridge.callNativeFunc('openVipWxPaySuccess', data, callback),
    playAudio: (data, callback) => nativeBridge.callNativeFunc('playAudio', data, callback), //ios播放音乐
    pauseAudio: (data, callback) => nativeBridge.callNativeFunc('pauseAudio', data, callback), //ios暂停播放
    resumeAudio: (data, callback) => nativeBridge.callNativeFunc('resumeAudio', data, callback), //ios继续播放
    stopPlayAudio: (data, callback) => nativeBridge.callNativeFunc('stopPlayAudio', data, callback), //ios停止播放
    getCurrentUserInfo: (data, callback) =>
        nativeBridge.callNativeFunc('getCurrentUserInfo', data, callback), //获取用户信息
    showToast: (data, callback) => nativeBridge.callNativeFunc('showToast', data, callback),
    configSideSlip: (data, callback) =>
        nativeBridge.callNativeFunc('configSideSlip', data, callback),
    didReceiveCeremonyGift: (data, callback) =>
        nativeBridge.callNativeFunc('didReceiveCeremonyGift', data, callback), //豪礼相送已领取(需要刷新坑位)
    selectSong: (data, callback) => nativeBridge.callNativeFunc('selectSong', data, callback), //选择歌曲上传
    shareToChat: (data, callback) => nativeBridge.callNativeFunc('shareToChat', data, callback), //站内转发H5
    showHalfPayment: (data, callback) =>
        nativeBridge.callNativeFunc('showHalfPayment', data, callback), //站内转发H5
    getH5CacheResourceFromApp: (data, callback) =>
        nativeBridge.callNativeFunc('getH5CacheResourceFromApp', data, callback), //h5 从ios获取缓冲资源
    permissionCheck: (data, callback) =>
        nativeBridge.callNativeFunc('permissionCheck', data, callback), //消费限制
    openSkrKillInviteTeam: (data, callback) =>
        nativeBridge.callNativeFunc('openSkrKillInviteTeam', data, callback) //打开撕歌杀组队弹框
};

/**
 * 启动 bridge 函数
 * @returns {number|*}
 */
export function setupWebViewJavascriptBridge() {
    const callback = (bridge) => {
        console.log('init ios');
        nativeBridge.init(bridge);
    };
    // window.initWebViewJavascript = true;
    if (window.WebViewJavascriptBridge) {
        console.log('ios go');
        return new Promise((resolve, reject) => {
            try {
                callback(WebViewJavascriptBridge);
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }
    if (window.WVJBCallbacks) {
        return new Promise((resolve, reject) => {
            try {
                window.WVJBCallbacks.push(callback);
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    window.WVJBCallbacks = [callback];
    return /iPhone|iPad|ios/gi.test(window.navigator.userAgent)
        ? ojcBridgeLoaded()
        : andBridgeLoaded(callback);
}

/**
 * Ios bridge loaded
 */
function ojcBridgeLoaded() {
    return new Promise((resolve, reject) => {
        try {
            console.log('执行ios');
            let WVJBIframe = document.createElement('iframe');
            WVJBIframe.style.display = 'none';
            WVJBIframe.src = 'https://__bridge_loaded__?t=' + Date.now();
            document.documentElement.appendChild(WVJBIframe);
            setTimeout(function () {
                document.documentElement.removeChild(WVJBIframe);
                WVJBIframe = null;
                resolve();
            }, 1000);
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
}

/**
 * Android bridge loaded
 */
function andBridgeLoaded(callback) {
    return new Promise((resolve, reject) => {
        try {
            if (window.WebViewJavascriptBridge) {
                callback(WebViewJavascriptBridge);
                resolve();
            } else {
                document.addEventListener(
                    'WebViewJavascriptBridgeReady',
                    function () {
                        callback(WebViewJavascriptBridge);
                        resolve();
                    },
                    false
                );
            }
        } catch (error) {
            reject(error);
        }
    });
}
export const callJsRegister = (callback = []) => {
    for (let i = 0; i < REGISTER_CALLBACKS.value.length; i++) {
        const _call = REGISTER_CALLBACKS.value[i];
        if (!_call.finished) callback.unshift(_call);
    }
    REGISTER_CALLBACKS.value = callback;
};
// 启动bridge
setupWebViewJavascriptBridge().then(() => {
    console.log('init bridge完成 native');
});

console.log('native init', Date.now());
export default native;
