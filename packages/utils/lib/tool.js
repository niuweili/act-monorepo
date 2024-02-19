import { onBeforeUpdate, shallowRef } from 'vue';
import lottie from 'lottie-web';
import native, { callJsRegister } from './native';
import { Base64 } from 'js-base64'; // 引入
// import 'vant/es/dialog/style';
import md5 from 'blueimp-md5';
// import { Dialog } from 'vant';
import request from '@skr/act-service';

const script = document.createElement('script');
script.src = 'https://o.alicdn.com/captcha-frontend/aliyunFP/fp.min.js';
document.head.appendChild(script);
//vue3dom获取
export function useRefs() {
    const itemRefs = shallowRef([]);

    function setItemRef(el) {
        if (el && !itemRefs.value.includes(el)) {
            itemRefs.value.push(el);
        }
    }
    onBeforeUpdate(() => {
        itemRefs.value = [];
    });
    return {
        itemRefs,
        setItemRef
    };
}

export function parseTime(time, cFormat) {
    if (arguments.length === 0) {
        return null;
    }
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
    let date;
    if (typeof time === 'object') {
        date = time;
    } else {
        if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
            time = parseInt(time);
        }
        if (typeof time === 'number' && time.toString().length === 10) {
            time = time * 1000;
        }
        date = new Date(time);
    }
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
    };
    const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        let value = formatObj[key];
        // Note: getDay() returns 0 on Sunday
        if (key === 'a') {
            return ['日', '一', '二', '三', '四', '五', '六'][value];
        }
        if (result.length > 0 && value < 10) {
            value = '0' + value;
        }
        return value || 0;
    });
    return time_str;
}
export function isIOS() {
    return /iPhone|iPad|ios/gi.test(window.navigator.userAgent);
}

export function getDateDiff(dateTimeStamp) {
    let minute = 1000 * 60;
    let hour = minute * 60;
    let day = hour * 24;
    let month = day * 30;
    let now = new Date().getTime();
    let diffValue = now - dateTimeStamp;
    if (diffValue < 0) {
        return;
    }
    let monthC = diffValue / month;
    let weekC = diffValue / (7 * day);
    let dayC = diffValue / day;
    let hourC = diffValue / hour;
    let minC = diffValue / minute;
    let result = '';
    if (monthC >= 1) {
        result = '' + parseInt(monthC) + '月前';
    } else if (weekC >= 1) {
        result = '' + parseInt(weekC) + '周前';
    } else if (dayC >= 1) {
        result = '' + parseInt(dayC) + '天前';
    } else if (hourC >= 1) {
        result = '' + parseInt(hourC) + '小时前';
    } else if (minC >= 1) {
        result = '' + parseInt(minC) + '分钟前';
    } else result = '刚刚';
    return result;
}
//节流
export function throttle(fn, delay = 200) {
    let timer = 0;
    return function () {
        if (timer) {
            return;
        }
        timer = setTimeout(() => {
            fn.apply(this, arguments); // 透传 this和参数
            timer = 0;
        }, delay);
    };
}
//节流第一次立刻执行
export function throttleImmediate(fn, wait = 300, isImmediate = true) {
    let timeout = null;
    return (...rest) => {
        // 立即执行
        if (isImmediate) {
            !timeout && fn.call(this, ...rest);
            if (!timeout)
                timeout = setTimeout(function () {
                    clearTimeout(timeout);
                    timeout = null;
                }, wait);
        } else {
            if (!timeout)
                timeout = setTimeout(function () {
                    clearTimeout(timeout);
                    timeout = null;
                    fn.call(this, ...rest);
                }, wait);
        }
    };
}

export function debounce(callback, delay) {
    let timer = null;

    return function () {
        /* eslint-disable */
        const context = this;
        const args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
            callback.apply(context, args);
        }, delay);
    };
}

export function umLog(category, action) {
    _czc && _czc.push(['_trackEvent', category, action]);
}
//获取url参数
export function getUrlParam(name) {
    return (
        decodeURIComponent(
            (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [
                ,
                ''
            ])[1] || ''.replace(/\+/g, '%20')
        ) || null
    ); // eslint-disable-line
}

// 获取URL参数
export const getUrlParams = () =>
    Object.fromEntries(new URLSearchParams(window.location.search).entries());

//跳转用户主页

export const toUserHomePage = (userID) => {
    if (!userID) return;
    window.location.href = `inframeskr://user/otherProfile?userId=${userID}`;
};
//跳转到家族首页
export const toClubHomePage = (clubID) => {
    if (!clubID) return;
    window.location.href = `inframeskr://club/home?clubID=${clubID}`;
};
//window.location.href url跳转
export const locationHref = (url) => {
    const host = location.host;
    if (host.includes('localhost')) {
        window.location.href = url;
        return;
    }
    let href = 'https://act.inframe.mobi';
    if (host === 'test.act.inframe.mobi') {
        href = 'http://test.act.inframe.mobi';
    }
    if (host === 'sandbox.act.inframe.mobi') {
        href = 'http://sandbox.act.inframe.mobi';
    }

    console.log(href + url);
    window.location.href = href + url;
};
//震动
export const playVibrate = (time = 100) => {
    navigator.vibrate =
        navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;
    if (navigator.vibrate) {
        console.log('支持设备震动！');
        navigator.vibrate(time);
    }
};

//lottie
export const initLottie = (dom, path, autoplay = true, loop = true) => {
    const icon = document.querySelector(dom);
    let option = {
        container: icon, // 包含动画的dom元素
        renderer: 'svg', // 渲染出来的是什么格式
        loop, // 循环播放
        autoplay // 自动播放
        //path, // 动画json的路径
        //animationData:loopBg,
    };
    if (typeof path == 'string' && path.indexOf('http') >= 0) {
        option.path = path;
    } else {
        option.animationData = path;
    }
    let a = lottie.loadAnimation(option);

    return a;
};

/**
 * 浮点数相乘
 * @param {number} arg1 乘数
 * @param {number} arg2 乘数
 * @returns {number} 返回计算结果
 */
export function accMul(arg1, arg2) {
    let m = 0;
    const s1 = arg1.toString();
    const s2 = arg2.toString();
    try {
        m += s1.split('.')[1].length;
    } catch (e) {
        // console.log(e)
    }
    try {
        m += s2.split('.')[1].length;
    } catch (e) {
        // console.log(e)
    }
    return (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) / 10 ** m;
}
/**
 * 浮点数相除
 * @param {number} arg1 除数
 * @param {number} arg2 被除数
 * @returns {number} 返回计算结果
 */
export function accDiv(arg1, arg2) {
    if (arg2 === 0) {
        return 0;
    }
    let m = 0;
    const s1 = arg1.toString();
    const s2 = arg2.toString();
    try {
        m -= s1.split('.')[1].length;
    } catch (e) {
        // console.log(e)
    }
    try {
        m += s2.split('.')[1].length;
    } catch (e) {
        // console.log(e)
    }
    return accMul(Number(s1.replace('.', '')) / Number(s2.replace('.', '')), 10 ** m);
}
/**
 * 取倒数第一位小数
 * @param {数字} num
 * @returns
 */
export const toDecimal = (num, len = 1) => {
    if (!num || typeof num !== 'number' || Number.isNaN(num)) return '0.0';
    const nums = (num + '').split('.');
    let res;
    if (nums.length > 1) {
        res = nums[0] + '.' + nums[1].slice(0, len);
        if (`${nums[1]}`.length < len) {
            res += '0'.repeat(len - `${nums[1]}`.length);
        }
    } else {
        res = num + '.' + '0'.repeat(len);
    }
    return res;
};
//头像拼接
export function getAvatarSourceUlr(data, displayType) {
    //displayType=2头像框
    if (Object.keys(data).length > 0) {
        let sourcesJson = {};
        data.forEach((item) => {
            if (item.displayType == displayType) {
                sourcesJson = JSON.parse(item.sourcesJson);
            }
        });

        if (sourcesJson.items) {
            let url = '';
            sourcesJson.items.forEach((item) => {
                if (item.type == 1) {
                    //自动循环播放，type为播放效果
                    url = item.sourceBaseURL + item.wpMURL;
                }
            });
            console.log(url);
            return url;
        } else if (sourcesJson.picURL) {
            console.log(sourcesJson.picURL);
            return sourcesJson.picURL;
        } else {
            return false;
        }
    }
}

/**
 * 图片url链接转base64
 * @param {String} url 图片链接
 * @returns 转base64后的值或者报错信息
 */
export const imgUrlToBase64 = (url) => {
    return new Promise((resolve, reject) => {
        if (!url) {
            reject('请传入url内容');
        }

        if (/\.(png|jpe?g|gif|svg)(\?.*)?$/.test(url)) {
            // 图片地址
            const image = new Image();
            // 设置跨域问题
            image.setAttribute('crossOrigin', 'anonymous');
            // 图片地址
            image.src = url;
            image.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = image.width;
                canvas.height = image.height;
                ctx.drawImage(image, 0, 0, image.width, image.height);
                // 获取图片后缀
                const ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
                // 转base64
                const dataUrl = canvas.toDataURL(`image/${ext}`);
                resolve(dataUrl || '');
            };
        } else {
            // 非图片地址
            reject('非(png/jpe?g/gif/svg等)图片地址');
        }
    });
};

// 求两个数组的不同项
export const arrayDiff = (arr1 = [], arr2 = []) => {
    if (arr1.length === arr2.length) return [];
    let diff = [];

    try {
        arr2.forEach((item) => {
            let isExist = false;
            arr1.forEach((m) => {
                if (item.second == m.second) {
                    isExist = true;
                }
            });
            if (!isExist) {
                diff.push(item);
            }
        });
    } catch (error) {
        console.log(error);
    }

    return diff;
};

// 求概率
const getValueByRatio = (arr) => {
    Array.prototype.sample = function () {
        if (!this.length) return;
        return this[~~(Math.random() * this.length)];
    };
    function random(list) {
        let arr = [];
        list.forEach((e, i) => {
            for (let index = 0; index < e.value; index++) {
                arr.push(e.name);
            }
        });
        let name = arr.sample();
        return list.findIndex((item) => item.name == name);
    }
    let index = random(nameArr);
    return index;
};
// 获取IOS系统版本号
export const getIosVersions = () => {
    const ua = navigator.userAgent.toLowerCase();
    return ua.match(/cpu iphone os (.*?) like mac os/)[1].replace(/_/g, '.');
};

//位数不够补0
export const setZero = (numStr) => {
    numStr = numStr + ''; //转换成字符串
    let strLength = numStr.length;
    let zeroStr = '';
    if (strLength < 8) {
        //不够8位补0
        let n = 8 - strLength;
        for (let i = 0; i < n; i++) {
            zeroStr += '0'; //字符串拼接
        }
    }
    return zeroStr + numStr;
};

/**
 * 跳转到充值页面
 * @param {Number} errCode 错误码，通过错误码判断是否跳转到充值页面，不传直接跳过
 * @param {Object} sceneObj 充值场景
 * @param {Boolean} isClosePage 是否关闭当前页面
 * @param {Function} callBack 购买成功后callBack
 * @returns {null}
 */
export const toRechargePage = (...params) => {
    const errCode = params.filter((item) => typeof item === 'number')[0] || undefined;
    if (errCode && ![8352213, 8352222].includes(errCode)) {
        return;
    }
    const sceneObj = params.filter((item) => item.constructor === Object)[0] || {};
    const isClosePage = params.filter((item) => typeof item === 'boolean')[0] || false;
    native.getAppVersion({}, (res) => {
        const appVersion = isIOS()
            ? res.data.version
            : res.data.version.toString().replace('0', '.');
        if (appVersion >= '3.68') {
            native.gotoRecharge(sceneObj, (payload) => {
                params.forEach((callBack) => {
                    if (typeof callBack === 'function') {
                        callBack(payload);
                    }
                });
            });
        } else {
            isClosePage && native.closePage();
            window.location.href = 'inframeskr://payment/recharge';
        }
    });
};

/**
 * 数字保留N位小数(不四舍五入)
 * @param {Number} num 原数字
 * @param {Number} decimal 保留N位小数
 * @returns 处理完成的结果
 */
export const toFixeds = (num, decimal) => {
    num = num.toString();
    let index = num.indexOf('.');
    if (index !== -1) {
        num = num.substring(0, decimal + index + 1);
    } else {
        num = num.substring(0);
    }
    return parseFloat(num).toFixed(decimal);
};

// 跳转到用户主页
export const toHomePage = (userID) => {
    window.location.href = `inframeskr://user/otherProfile?userId=${userID}`;
};
/**
 *
 * @param {*} url cdn地址
 * @param {*} key
 * @param {*} storeKey
 */
export const setImageUrl = (url, key, storeKey, store) => {
    getH5CacheResourceFromApp(url)
        .then((res) => {
            store.commit(storeKey, {
                key,
                value: res || ''
            });
        })
        .catch((error) => {
            console.log('error', error);
        });
};
export const initCacheSource = (cacheArr = [], store) => {
    for (let i = 0; i < cacheArr.length; i++) {
        const { url, key, storeKey } = cacheArr[i];
        setImageUrl(url, key, storeKey, store);
    }
};
// ios获取资源
const iosGetResourceByBridge = (data = {}, callback, type) => {
    return () => {
        try {
            native.getH5CacheResourceFromApp(data, (res) => {
                let _data = '';
                if (!res.data?.contentData) {
                    return callback(data.url);
                }
                if (type === 'png') {
                    _data = 'data:image/png;base64,' + res.data.contentData;
                } else if (type === 'json') {
                    try {
                        _data = Base64.decode(res.data.contentData);
                    } catch (error) {
                        console.log('error', error);
                    }
                }
                callback(_data);
            });
        } catch (error) {
            console.log('bridge不存在');
            callback(data.url);
        }
    };
};
/**
 * h5资源app缓冲获取 图片/json
 * @param {*} url 资源cdn地址
 */
export const getH5CacheResourceFromApp = (url, type = 'png') => {
    const fromH5 = getUrlParam('source');
    return new Promise((resolve, reject) => {
        try {
            if (isIOS() && !fromH5) {
                // todo ios走bridge方式
                callJsRegister([iosGetResourceByBridge({ url }, resolve, type)]);
                // resolve(url);
            } else {
                resolve(url);
            }
        } catch (error) {
            reject(error);
        }
    });
};
/**
 * h5 app资源缓冲初始化lottie lottie json处理
 * @param {*} dom
 * @param {*} path 资源路径-cdn地址
 * @param {*} autoplay 自动播放动画
 * @param {*} loop 循环播放
 * @returns
 */
export const initLottieEnhanced = (dom, path, autoplay = true, loop = true) => {
    function getInstance(dom, dataOrPath = '', autoplay = true, loop = true, useUrl = false) {
        // console.log('dataOrPath', dataOrPath);
        const icon = document.querySelector(dom);
        let option = {
            container: icon, // 包含动画的dom元素
            renderer: 'svg', // 渲染出来的是什么格式
            loop, // 循环播放
            autoplay // 自动播放
            // animationData: data
        };
        // android直接使用url，ios使用返回的data
        // if (useUrl) option.path = dataOrPath;
        if (dataOrPath.startsWith('http') || useUrl) {
            option.path = dataOrPath;
        } else {
            option.animationData = JSON.parse(dataOrPath);
        }
        let instance = null;
        try {
            instance = lottie.loadAnimation(option);
        } catch (error) {
            console.log('lottie error', error);
        }
        return instance;
        // return lottie.loadAnimation(option);
    }
    return new Promise((resolve, reject) => {
        function _callback(resData) {
            return resolve(getInstance(dom, resData, autoplay, loop));
        }
        if (isIOS()) {
            // todo
            callJsRegister([iosGetResourceByBridge({ url: path }, _callback, 'json')]);
        } else {
            try {
                resolve(getInstance(dom, path, autoplay, loop, true));
            } catch (error) {
                reject(error);
            }
        }
    });
};

//检查h5存储是否可用
export const isLocalStorageAvailable = () => {
    var test = 'test';
    try {
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return;
    } catch (e) {
        // Dialog.alert({
        //     message: '请确保浏览器权限设置中，阻止cookie写入权限为关闭状态后重新进入此页面～'
        // }).then(() => {
        //     // on close
        // });
        return false;
    }
};

function isObject(value) {
    return Object.prototype.toString.call(value) === '[object Object]';
}
// 埋点签名
export const buryMd5Sign = (data) => {
    const temp = Object.keys(data).sort((a, b) => a.localeCompare(b)) || [];
    const str = temp
        .map((item) => {
            const value = isObject(data[item]) ? JSON.stringify(data[item]) : data[item];
            return `${item}=${value}`;
        })
        .join('&');

    return md5(str).toUpperCase();
};
// 关闭页面
export const closePage = () => {
    native.closePage({});
};

export const getDeviceToken = () => {
    let umModule;
    let deviceToken;
    return new Promise((resolve, reject) => {
        // eslint-disable-next-line no-undef
        ALIYUN_FP.use('um', (state, um) => {
            if (state === 'loaded') {
                umModule = um;
                um.init(
                    {
                        appKey: '00aae43b1d89ba6c0c5c6fbdaac62a88',
                        appName: 'act'
                        //endpoints : ['https://cloudauth-device.aliyuncs.com']
                    },
                    (initStats) => {
                        console.log(initStats, 'initStats');
                        if (initStats === 'success') {
                            //如果需要页面init完成就获取token，则在这里获取。
                            deviceToken = umModule.getToken();
                            resolve(deviceToken);
                        } else {
                            reject(initStats, '获取deviceToken失败');
                        }
                    }
                );
            }
        });
    });
};

export const filterApiKey = (data) => {
    const keys = Object.keys(data).sort((a, b) => a.localeCompare(b));
    let str = '';
    keys.forEach((item, index) => {
        if (index !== 0) {
            str += '&';
        }
        str += `${item}=${data[item]}`;
    });
    return md5(str).toUpperCase();
};

// 埋点 pointName: 埋点名称 action: 1:曝光 2:点击 3: 消费 4: 发生 otherParams: 其他参数
export const buryingpoint = (pointName, action, otherParams) => {
    const signData = {
        appSecret: 'skr2020',
        pointName,
        action,
        subjectID: getUrlParam('userID')
    };
    const sign = buryMd5Sign(signData);
    const params = {
        url: '/v1/msbdata/upload-data',
        method: 'post',
        data: {
            pointName,
            action,
            subjectID: getUrlParam('userID'),
            sign,
            ...otherParams
        }
    };
    try {
        request(params, false, false);
    } catch (err) {
        console.log(err);
    }
};
export const testBuryingpoint = (pointName, action, otherParams) => {
    const signData = {
        appSecret: 'skr2020',
        pointName,
        action,
        subjectID: otherParams.subjectID
    };
    const sign = buryMd5Sign(signData);
    const params = {
        url: '/v1/msbdata/upload-data',
        method: 'post',
        data: {
            pointName,
            action,
            // subjectID: getUrlParam('userID'),
            sign,
            ...otherParams
        }
    };
    try {
        request(params, false, false);
    } catch (err) {
        console.log(err);
    }
};
export const getUUID = () => Date.now() + Math.random();
