import axios from 'axios';
import qs from 'qs'

 const header = qs.stringify({'headers':{'Content-Type':'multipart/form-data'}});

// 藏品信息列表

export const GetCollectionData = (params) => {
    return axios.post("/CollectionManage/GetCollectionData", params).then(res => res.data)
};

// 新增藏品接口
export const InsertCollection = (params) => {
    return axios.post("/CollectionManage/InsertCollection", params, header).then(res => res.data)
}

/// 上传图片
export const CollectionImgUpload = (params) => {
    return axios.post('/CollectionManage/CollectionImgUpload', params, header).then(res => res.data)
}

// 编辑文物信息 
export const UpdateCollection = (params) => {
    return axios.post("/CollectionManage/UpdateCollection", params).then(res => res.data)
}

// 获取 存储柜 级联信息
export const GetStorehouseAndStorage = () => {
    return axios.post("/WarehouseManage/GetStorehouseAndStorage").then(res => res.data)
}

// 删除藏品
export const DeleteCollection = (params) => {
    return axios.post("/CollectionManage/DeleteCollection", params).then(res => res.data)
}