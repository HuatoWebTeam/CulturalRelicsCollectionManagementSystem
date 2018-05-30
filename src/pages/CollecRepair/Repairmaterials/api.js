import axios from 'axios';

// 修复材料显示
export const Repairmetrial = (params) => {
    return axios.post("/Material/GetMaterialAll", params).then(res => res.data)
}


// 新增/编辑材料
export const Addmetrial = (params) => {
    return axios.post("/Material/AcceptClick?", params).then(res => res.data)
}

// 删除材料
export const Delatemetrial = (params) => {
    return axios.post("/Material/DeleteMaterial?", params).then(res => res.data)
}