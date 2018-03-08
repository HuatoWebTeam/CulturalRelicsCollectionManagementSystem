import axios from 'axios';

 const header = {headers:{'Content-Type':'multipart/form-data'}};

// 藏品信息列表

export const GetCollectionData = (params) => {
    return axios.post("/CollectionManage/GetCollectionData", params).then(res => res.data)
};

// 新增藏品接口
export const InsertCollection = (params) => {
    return axios.post("/CollectionManage/InsertCollection", params, header).then(res => res.data)
}