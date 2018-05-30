import axios from 'axios';

// 新建注销单
export const CancellationAdd = (params) => {
    return axios.post("/Cancellation/CancellationAdd", params).then(res => res.data)
}

// 注销单列表
export const CancellationAll = (params) => {
    return axios.post("/Cancellation/CancellationAll", params).then(res => res.data)
}

// 删除注销单
export const CancellationDelete = (params) => {
    return axios.post("/Cancellation/CancellationDelete", params).then(res => res.data)
}