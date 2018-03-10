

import axios from 'axios';

// 操作日志
export const LoginfoDesc = (params) =>{
    return axios.post('/Loginfo/LoginfoDesc', params).then(res => res.data)
}