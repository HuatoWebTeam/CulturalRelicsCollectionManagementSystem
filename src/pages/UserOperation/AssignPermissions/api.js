
import axios from 'axios';


// 获取用户
export const UserAll = (params) => {
    return axios.post("/Loginfo/UserAll", params).then(res => res.data)
}
//权限配置
export const UserModAddApi = (params) => {
    return axios.post('/Loginfo/UserModAddApi', params).then(res => res.data)
}