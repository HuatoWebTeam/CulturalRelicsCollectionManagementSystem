

import axios from 'axios';

// 凭证信息
export const GetCollectionCertificationData = (params) => {
    return axios.post("/CollectionManage/GetCollectionCertificationData", params).then(res => res.data)
}


// 凭证制作
export const CollectionCertification = (params) => {
    return axios.post("/CollectionManage/CollectionCertification", params).then(res => res.data);
}

// 修改rfid
export const UpdateCollectionRfId = (params) => {
    return axios.post("/CollectionManage/UpdateCollectionRfId", params).then(res => res.data)
}

// 文物详情
export const CollectAll = (params) => {
    return axios.post("Solicitation/CollectAll", params).then(res => res.data)
}