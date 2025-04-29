
import Taro from '@tarojs/taro';
const wx_getSetting = (ids) => {
    return new Promise((r, j) => {

        Taro.getSetting({
            withSubscriptions: true,
            success(res) {
                console.log(res);
                if (res.subscriptionsSetting.mainSwitch) { // 用户打开了订阅消息总开关
                    if (res.subscriptionsSetting.itemSettings) { // 用户同意总是保持是否推送消息的选择, 这里表示以后不会再拉起推送消息的授权
                        const moIdState = res.subscriptionsSetting.itemSettings[ids]; // 用户同意的消息模板id
                        console.log('订阅了永久的', moIdState);
                        if (moIdState === 'accept') {
                            r(true);
                        } else if (moIdState === 'reject') {
                            r(false);
                        } else if (moIdState === 'ban') {
                            r(false);
                        }
                    } else {
                        r(false);
                    }
                } else {
                    // 用户没有打开订阅消息总开关
                    r(false);
                }
            },
        });
    });
}
const requestSubscribeMessage = (tmplIds: string[]): Promise<Boolean> => {
    return new Promise((resolve) => {
        Taro.requestSubscribeMessage({
            tmplIds: tmplIds,
            entityIds: [],
            success(res) {
                console.log('开启成功', res, tmplIds);
                // 检查每个模板ID的状态
                const allAccepted = tmplIds.every(id => res[id] === 'accept');
                resolve(allAccepted);
            },
            fail(res) {
                console.log('开启失败', res);
                resolve(false);
            },
        });
    });
}
const checkSubscribe = async (tmplIds: string[]): Promise<string[]> => {
    try {
        const res = await Taro.getSetting({ withSubscriptions: true });
        if (res.subscriptionsSetting?.mainSwitch) { // 用户打开了订阅消息总开关
            if (res.subscriptionsSetting.itemSettings) { // 用户已设置订阅消息
                // 检查所有模板ID是否都被接受
                const acceptedIds = tmplIds.filter(id =>
                    res.subscriptionsSetting.itemSettings[id] === 'accept'
                );
                return acceptedIds;
            }
        }
        return []; // 用户未打开总开关或未设置订阅消息
    } catch (error) {
        console.error('检测订阅状态失败:', error);
        return []; // 用户未打开总开关或未设置订阅消息
    }
};
export default {
    checkSubscribe,
    wx_getSetting,
    requestSubscribeMessage
}