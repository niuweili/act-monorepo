import request from './request';
import { getUrlParam, buryMd5Sign } from '../utils/tool';
export const getInfo = () => {
    return request({
        url: '/v1/mstask/activity-reward-status',
        method: 'get',
        params: {
            userID: 1007254,
            activityCategory: 91
        }
    });
};

export const getAward = () => {
    return request({
        url: '/v1/mstask/activity-reward-achieve',
        method: 'post',
        data: {
            activityCategory: 91,
            rewardID: 0,
            action: 4,
            platform: 10
        }
    });
};

export const gamePermission = (permissionCheckScene) => {
    return request({
        url: '/v1/kconf/permission-check',
        method: 'put',
        data: {
            permissionCheckScene,
            userID: getUrlParam('userID') - 0
        }
    });
};

// nacos平台获取配置
export const getNacosConfig = (dataId) => {
    const timeMs = Date.now();
    const data = {
        dataId,
        group: 'skrweb',
        namespaceId: 'namespace_web',
        timeMs,
        apiSecret: 'skr2020'
    };

    const params = {
        url: '/v1/kconf/config',
        method: 'post',
        data: {
            dataId,
            group: 'skrweb',
            namespaceId: 'namespace_web',
            timeMs,
            sign: buryMd5Sign(data)
        }
    };
    return request(params);
};
