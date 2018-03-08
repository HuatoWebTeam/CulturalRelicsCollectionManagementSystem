import axios from 'axios';

// 弹窗库房
export const StoreApi = () => {
    return axios.post("/Exhibition/StoreApi").then(res => res.data)
}

// 藏品文物选择
export const ColleApi = (params) => {
    return axios.post("/Exhibition/ColleApi", params).then(res => res.data)
}