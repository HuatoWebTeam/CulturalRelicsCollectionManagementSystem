

import axios from 'axios';

// 凭证信息
export const GetCollectionCertificationData = (params) => {
    return axios.post("/CollectionManage/GetCollectionCertificationData", params).then(res => res.data)
}


// 凭证制作
export const CollectionCertification = (params) => {
    return axios.post("/CollectionManage/CollectionCertification", params).then(res => res.data);
}