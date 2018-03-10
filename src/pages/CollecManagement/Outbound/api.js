import axios from 'axios';

// 藏品出库列表



export const GetOutTheLibraryData = (params) => {
    return axios.post('/CollectionManage/GetOutTheLibraryData', params).then(res => res.data)
}

// 新建出库单

export const InsertOutTheLibrary = (params) => {
    return axios.post("/CollectionManage/InsertOutTheLibrary", params).then(res => res.data)
}