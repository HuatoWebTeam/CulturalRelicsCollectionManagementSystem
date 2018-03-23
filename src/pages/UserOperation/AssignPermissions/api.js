
import axios from 'axios';


// 获取用户
export const UserAll = (params) => {
    return axios.post("/Loginfo/UserAll", params).then(res => res.data)
}
//权限配置
export const UserModAddApi = (params) => {
    return axios.post('/Loginfo/UserModAddApi', params).then(res => res.data)
}

//  获取所有模块
export  const UserModApi = (params) => {
    return axios.post("/Loginfo/UserModeApi",  params,  ).then(res => {console.log(res); return res.data} );
}