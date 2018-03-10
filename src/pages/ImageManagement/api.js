
import axios from 'axios';

// 影响管理
export const VideoApi = (params) => {
    return axios.post('/Video/VideoApi', params).then(res => res.data)
}