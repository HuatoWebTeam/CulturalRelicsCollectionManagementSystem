
import axios from 'axios';

// 征集列表

export const SolicallApi = (params) => {
    return axios.post("/Solicitation/SolicallApi", params).then(res =>res.data);
}

// 新增文物
export const SolicAddApi = (params) => {
    return axios.post("/Solicitation/SolicAddApi", params).then(res => res.data)
}