import axios from 'axios';

// 藏品入库信息
export const GetEntryTheLibraryData = (params) => {
    return axios.post('/CollectionManage/GetEntryTheLibraryData', params).then(res => res.data)
}