import axios from 'axios';

// 藏品出库列表



export const GetOutTheLibraryData = (params) => {
    return axios.post('/CollectionManage/GetOutTheLibraryData', params).then(res => res.data)
}