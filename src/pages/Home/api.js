import axios from 'axios';


// 最新通知
export const GetToNotice = () => {
    return axios.post("/HomeManage/GetToNotice").then(res => res.data)
}


// 精品数据展示
export const GetFineDisplayData = () => {
    return axios.post("/HomeManage/GetFineDisplayData").then(res => res.data)
}


// // 数据统计展示
// export const GetFineDisplayData = () => {
//     return axios.post('/HomeManage/GetFineDisplayData').then(res => res.data)
// }

