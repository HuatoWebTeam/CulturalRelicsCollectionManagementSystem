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