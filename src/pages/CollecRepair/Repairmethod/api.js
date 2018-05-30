import axios from 'axios';

// 修复方法列表
export const GetMethodAll = (params) => {
    return axios.post("/RepairMethod/GetMethodAll", params).then(res => res.data)
}


// 新增/编辑 修复方法
export const AcceptClick = (params) => {
    return axios.post("/RepairMethod/AcceptClick", params).then(res => res.data)
}

// 删除方法
export const DeleteMethod = (params) => {
    return axios.post("/RepairMethod/DeleteMethod", params).then(res => res.data)
}