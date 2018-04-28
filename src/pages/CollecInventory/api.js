
import axios from 'axios';

// 盘点单显示
export const InventallApi = (params) => {
    return axios.post('/Inventory/InventallApi', params).then(res => res.data)
}

// 新建盘点单
export const InventoryAdd = (params) => {
    return axios.post("/Inventory/InventoryAdd", params).then(res => res.data)
}

// 藏品盘点  详情
export const InvenDataAll = (params) => {
    return axios
      .post("/Inventory/InvenDataAll", params)
      .then(res => res.data);
}

// 编辑
export const InventUpdate = (params) =>{
    return axios.post("/Inventory/InventUpdate", params).then(res => res.data)
}