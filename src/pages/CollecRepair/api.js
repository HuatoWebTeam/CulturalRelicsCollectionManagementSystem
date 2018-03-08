import axios from 'axios';

// 藏品修复单显示
export const RepairApi = (params) => {
    return axios.post('/Repair/RepairApi', params).then(res => res.data)
}


// 新增藏品修复单
export const RepairAddApi =  (params) => {
    return axios.post('/Repair/RepairAddApi', params).then(res => res.data)
}