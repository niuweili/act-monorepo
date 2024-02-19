import axios from 'axios';
// import store from '@/store/index';
// import { Toast } from 'vant';
// import 'vant/es/toast/style';

import { getUrlParam } from '@skr/act-utils/lib/tool';
const env = process.env.envMode || process.env.NODE_ENV;
console.log(env, 'env');

let deviceIdString;
let deviceId = '';
let host = window.location.host;
try {
    deviceIdString = window.navigator.userAgent.match(/pid\/[A-Z0-9]+/g);
    if (deviceIdString) {
        if (host == 'test.act.inframe.mobi' || host == 'act.inframe.mobi') {
            deviceId = deviceIdString[0] && deviceIdString[0].replace('pid/', '');
            deviceId = deviceId || getUrlParam('userID');
        }
    } else {
        deviceId = getUrlParam('userID');
    }
} catch (e) {
    console.error(e);
}
axios.defaults.headers['Content-Type'] = 'application/json; charset=UTF-8';
axios.defaults.headers['Inframe-Client-ID'] = deviceId;
export default function request(options, isShowLoading = true, controlLoading = true) {
    return new Promise((resolve, reject) => {
        // 创建axios实例
        const service = axios.create({
            // axios中请求配置有baseURL选项，表示请求URL公共部分
            baseURL: process.env.VUE_APP_baseUrl, //baseURL 将会被加在 url 前面。
            // 超时
            timeout: 20000,
            withCredentials: true // 是否允许带cookie这些
        });
        // request拦截器
        service.interceptors.request.use(
            async (config) => {
                // controlLoading && store.commit('common/updateLoading', isShowLoading);
                switch (config.method) {
                    case 'get':
                        config.params = config.params; // eslint-disable-line
                        break;
                    case 'post':
                        config.headers['Content-Type'] = 'application/json; charset=UTF-8'; // application/x-www-form-urlencoded; charset=UTF-8
                        // config.data = qs.stringify(config.data);
                        break;
                    default:
                }
                return config;
            },
            (error) => {
                // store.commit('common/updateLoading', false);
                Promise.reject(error);
            } // 请求拦截器的报错处理
        );

        // 响应拦截器
        service.interceptors.response.use(
            (res) => {
                const handleErrCode = res.data.errno;
                if (!handleErrCode) {
                    resolve(res.data);
                } else {
                    reject(res.data);
                }
                // controlLoading && store.commit('common/updateLoading', false);
            },
            (error) => {
                console.log('err' + error);
                // controlLoading && store.commit('common/updateLoading', false);
                let { message } = error;
                if (message == 'Network Error') {
                    message = '网络异常，请检查网络';
                } else if (message.includes('timeout')) {
                    message = '系统接口请求超时，请检查网络';
                } else if (message.includes('Request failed with status code')) {
                    message = `系统接口${message.substr(message.length - 3)}异常`;
                }
                // Toast(message);
                error.errmsg = message;
                return reject(error);
            }
        );
        service(options);
    });
}
