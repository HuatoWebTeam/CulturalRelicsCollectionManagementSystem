import axios from 'axios';


// 藏品展览查询
export const ExhibitionAll = (params) => {
    return axios.post('/Exhibition/ExhibitionAll', params).then(res => res.data)
};


// 展览详情
export const ExhibitionDetailsApi = (params) => {
    return axios.post("/Exhibition/ExhibitionDetails", params).then(res => res.data)
}

// 新增展览清单
export const ExDataAddApp = (params) => {
    return axios.post("/Exhibition/ExDetaAddApp", params).then(res => res.data );
}

