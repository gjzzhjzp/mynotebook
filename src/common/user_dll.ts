import ajax from './ajax';
import Taro from '@tarojs/taro';
interface Iuserinfo {
    id: number;
    openid: string;
    username: string
}
interface ILoginResponse {
    code: number;
    data: {
        token: string;
        csrf_token: string;
        userinfo: Iuserinfo;
    };
}
export const login = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const loginRes = await Taro.login();
            const response = await ajax.post('/login', { code: loginRes.code }) as ILoginResponse;

            if (response.code === 200) {
                ajax.appconfig.token = response.data.token;
                ajax.appconfig.csrf_token = response.data.csrf_token;
                ajax.appconfig.userinfo = response.data.userinfo;
                resolve(ajax.appconfig);
            } else {
                reject(new Error('登录失败'));
            }
        } catch (error) {
            reject(error);
        }
    });
}