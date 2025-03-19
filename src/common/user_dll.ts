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
export const getCategories = () => {
    return new Promise(async (resolve, reject) => {
        ajax.get('/category/get').then(res => {
            console.log("res", res);
            let categories={};
            let categories_obj={};
            if (res.code == 200) {
                categories['0'] = res.data.filter(item => {
                    if(item.type==0){
                        return true;
                    }
                })
                categories['1'] = res.data.filter(item => {
                    if(item.type==1){
                        return true;
                    }
                })
                
                res.data.forEach(item => {
                    categories_obj[item.value] = item.name;
                });
            }
            resolve({
                categories,
                categories_obj
            })
        })
    })
}