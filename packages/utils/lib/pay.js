import native from '@/utils/native';
import request from '@/service/request';
import store from '@/store/index';
import { Toast } from 'vant';
import 'vant/es/toast/style';
import { isIOS, getUrlParam } from '@/utils/tool';

class Payment {
    constructor(option) {
        const defaultOption = {
            sessionOrderIDKey: 'wonderOrderID', // 订单ID存储在sessionStorage中的key
            goodsCategory: 0, // 直购场景
            isClosePage: false, // 是否关闭当前页面，一帮在弹框购买下使用
            successText: '购买成功~', // 支付成功提示文案(默认为购买成功)
            // 创建订单参数
            goodsInfo: {
                productID: '',
                goodsID: 0,
                price: 0,
                type: 1
            }, // 支付商品信息
            aliPay: false, // 是否支持支付宝支付
            isAliPay: false, // 当前选择是支付宝还是微信支付
            index: 1, // 控制停止轮询查询订单状态
            timer: 0, // 中断查询状态
            goodsListUrl: '/v2/honor/goods-list', // 获取商品列表接口(默认)
            goodsListParams: {}, // 获取商品列表接口参数(如果商品列表接口不是默认的，需要传入该参数)
            getGoodsInfoCallBack: () => {}, // 获取商品列表回调
            pollingCallBack: () => {} // 充值成功后回调轮询
        };

        this.options = {
            ...defaultOption,
            ...option
        };

        this.getGoodsInfoList();
    }

    /* changeGoodsInfo = (goodsInfo) => {
        this.options.goodsInfo = goodsInfo;
    }; */

    syncPromise = () => {
        return new Promise((resolve) => {
            setTimeout(async () => {
                console.log(`第 ${this.options.index} 次请求`);
                const flag = await this.options.pollingCallBack();
                console.log('flag', flag);
                if (flag) {
                    resolve(false);
                    return;
                }
                resolve(this.options.index < 5 ? true : false);
                this.options.index++;
            }, 50);
        });
    };

    pollingPromise = () => {
        return new Promise((resolve) => {
            this.options.timer = setTimeout(async () => {
                const result = await this.syncPromise();
                resolve(result);
            }, 1000);
        });
    };

    startPolling = async () => {
        // 清除进行中的轮询，重新开启计时轮询
        clearTimeout(this.options.timer); // !!! 注意：清除计时器后，会导致整个 async/await 链路中断，若计时器的位置下方还存在代码，将不会执行。
        this.options.index = 1;
        store.commit('common/updateLoading', true);
        // 立刻执行一次异步请求
        let needPolling = await this.syncPromise();
        // 根据异步请求结果，判断是否需要开启计时轮询
        while (needPolling) {
            needPolling = await this.pollingPromise();
        }
        console.log('轮询请求处理完成！'); // 若异步请求被 clearTimeout(timer)，这里不会被执行打印输出。
        store.commit('common/updateLoading', false);
    };

    // 获取商品列表
    getGoodsInfoList = async () => {
        /*      native.registerCallJsMethods('pageActive', () => {
            setTimeout(() => {
                this.startPolling();
            }, 2000);
        }); */
        let params = {
            goodsCategory: this.options.goodsCategory
        };
        if (
            this.options.goodsListUrl !== '/v2/honor/goods-list' &&
            !Object.keys(this.options.goodsListParams).length
        ) {
            throw new Error('请传入获取商品列表接口参数');
        }
        if (this.options.goodsListUrl !== '/v2/honor/goods-list') {
            delete params.goodsCategory;
            params = {
                ...this.options.goodsListParams
            };
        }

        const payload = {
            url: this.options.goodsListUrl,
            method: 'get',
            params
        };
        try {
            const res = await request(payload);
            this.options.getGoodsInfoCallBack(res);
        } catch (err) {
            console.log(err);
        }
    };

    // 创建订单,开始支付
    createOrder = (goodsInfo, isAliPay = false) => {
        this.options.isAliPay = isAliPay;
        this.options.goodsInfo = goodsInfo;
        isIOS() ? this.getAppVersion() : this.androidPay();
    };
    // 3.88以上版本支持goodsCategory
    getAppVersion = () => {
        native.getAppVersion({}, (res) => {
            const appVersion = res.data.version.toString().split('.');
            console.log('appVersion', appVersion[1], res.data.version);
            if ((appVersion[1] >= 88 && appVersion[0] >= 3) || appVersion[0] >= 4) {
                this.iosPay();
            } else {
                return Toast('请将app升级到最新版本后再购买');
            }
        });
    };
    // ios支付
    iosPay = () => {
        store.commit('common/updateLoading', true);
        try {
            native
                .pay({ ...this.options.goodsInfo })
                .then((res) => {
                    switch (res.errcode) {
                        case 0:
                            if (this.options.isClosePage) {
                                setTimeout(() => {
                                    Toast(this.options.successText);
                                    store.commit('common/updateLoading', false);
                                    setTimeout(() => {
                                        native.closePage();
                                    }, 500);
                                }, 3000);
                            } else {
                                this.startPolling();
                            }
                            break;
                        case -1:
                            this.androidPay();
                            store.commit('common/updateLoading', false);
                            break;
                        default:
                            Toast(res.errmsg || '支付异常，请稍后再试');
                            store.commit('common/updateLoading', false);
                            break;
                    }
                })
                .catch((e) => {
                    store.commit('common/updateLoading', false);
                    Toast(e.errmsg || '支付异常，请稍后再试');
                });
        } catch (err) {
            store.commit('common/updateLoading', false);
            console.log(err);
        }
    };

    // 判断是否安装微信，安装微信正常支付，未安装微信提示安装微信
    androidPay = () => {
        // 如果当前支持支付宝支付并且选择的是支付宝
        if (this.options.aliPay && this.options.isAliPay) {
            this.dueOrder();
        } else {
            native.checkWx({}, (res) => {
                if (res.errcode === '0') {
                    const hasWx = res.data.hasWx;
                    hasWx ? this.dueOrder() : Toast('请安装微信，以免影响您支付');
                }
                return Promise.resolve();
            });
        }
    };

    // 安卓支付
    dueOrder = async () => {
        native.jumpWx();
        console.log(this.options, 'this.options.goodsInfo');
        const params = {
            url: !this.options.aliPay
                ? '/v2/honor/wx-order'
                : this.options.isAliPay
                ? '/v2/honor/ali-order'
                : '/v2/honor/wx-order',
            method: 'put',
            data: {
                ...this.options.goodsInfo
            }
        };
        try {
            const res = await request(params, false);
            const { mWebURL, orderID } = res.data;
            sessionStorage.setItem(`${this.options.sessionOrderIDKey}`, orderID);
            window.location.href = mWebURL;
        } catch (err) {
            Toast(err.errmsg);
        }
    };
    // 停止订单查询
    stopOrderQuery = () => {
        sessionStorage.removeItem(`${this.options.sessionOrderIDKey}`);
    };
    // 订单查询
    orderQuery = async () => {
        const orderID = sessionStorage.getItem(`${this.options.sessionOrderIDKey}`);
        console.log('orderID', orderID, this.options.sessionOrderIDKey);
        if (!orderID) {
            this.stopOrderQuery();
            return;
        }
        const params = {
            url: '/v2/honor/wx-query',
            method: 'put',
            data: {
                orderID,
                userID: parseInt(getUrlParam('userID'))
            }
        };
        try {
            const res = await request(params);
            if (res.data.status === 8) {
                if (this.options.isClosePage) {
                    Toast(this.options.successText);
                    setTimeout(() => {
                        native.closePage();
                    }, 500);
                } else {
                    this.startPolling();
                }
                this.stopOrderQuery();
            } else if (res.data.status === 7) {
                Toast('您的订单正在支付，请稍后刷新当前页面查看～');
                this.stopOrderQuery();
            } else {
                this.stopOrderQuery();
            }
        } catch (err) {
            if (err.errno === 8422006) {
                this.stopOrderQuery();
                return;
            }
            Toast(err.errmsg);
        }
    };
}

export default Payment;
