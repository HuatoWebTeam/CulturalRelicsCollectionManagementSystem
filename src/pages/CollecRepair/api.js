import axios from 'axios';

// 藏品修复单显示
export const RepairApi = (params) => {
    return axios.post('/Repair/RepairApi', params).then(res => res.data)
}


// 新增藏品修复单
export const RepairAddApi =  (params) => {
    return axios.post('/Repair/RepairAddApi', params).then(res => res.data)
}

// 修复详情
export const RepDatall = (params) => {
    return axios.post("/Repair/RepDatall", params).then(res => res.data)
}

//  编辑
export const RepairUpdate = (params) => {
    return axios.post("/Repair/RepUpdate", params).then(res => res.data);
}

// 删除修复单
export const DeleteRepair = (params) => {
    return axios.post("/Repair/DeleteRepair", params).then(res => res.data)
}