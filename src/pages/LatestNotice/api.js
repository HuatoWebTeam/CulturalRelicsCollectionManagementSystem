import axios from 'axios';


// 获取通知
export const NoticeAll = (params) => {
    return axios.post("/Notice/NoticeAll", params).then(res => res.data)
}

// 新增通知
export const NoticeAdd = (params) => {
    return axios.post("/Notice/NoticeAdd", params).then(res => res.data)
}

// 删除通知
export const DeleteNotice = (params) => {
    return axios.post("/Notice/GetDelete", params).then(res => res.data)
}