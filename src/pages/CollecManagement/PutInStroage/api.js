import axios from 'axios';

// 藏品入库信息
export const GetEntryTheLibraryData = (params) => {
    return axios.post('/CollectionManage/GetEntryTheLibraryData', params).then(res => res.data)
}


// 新增入库
export const InsertInTheLibrary = (params) => {
    return axios.post("/CollectionManage/InsertInTheLibrary", params).then(res => res.data)
}


// 删除出入库
export const DeleteInTheLibrary = (params) => {
    return axios.post("/CollectionManage/DeleteInTheLibrary", params).then(res => res.data)
}