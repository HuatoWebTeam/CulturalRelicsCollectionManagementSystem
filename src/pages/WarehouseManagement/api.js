import axios from 'axios';

// 库房信息列表
export const GetStorehouseManageData = (params) => {
    return axios.post("/WarehouseManage/GetStorehouseManageData", params).then(res => res.data)
}

// 编辑库房信息

export const UpdateStorehouse = (params) => {
    return axios.post("/WarehouseManage/UpdateStorehouse", params).then(res => res.data)
}

// 新增库房
export const InsertStorehouse = (params) => {
    return axios.post("/WarehouseManage/InsertStorehouse", params).then(res => res.data)
}


// 存储柜信息
// 存储柜信息列表
export const GetStorageeManageData = (params) => {
    return axios.post("/WarehouseManage/GetStorageeManageData", params).then(res => res.data)
}