
import axios from 'axios';

axios.defaults.baseURL = '/';

// //  审批通过数据接口
export const ApprovalPassed = (params) => {
    return axios.post("/ApprovalFunctionManage/ApprovalPassed", params).then(res => res.data)
}

// 审批拒绝接口
export const ApprovalDenied = (params) => {
    return axios.post("/ApprovalFunctionManage/ApprovalDenied", params).then(res => res.data)
}

// 修改密码
export const UpdateUserPwd = (params) => {
    return axios.post("/UserManage/UpdateUserPwd", params).then(res => res.data)
}

// 审批详情
export const GetApprovalDetails = () => {
    return axios.post("/GetApprovalDeta/GetApprovalDetails").then(res => res.data)
}

// 获取文物年代
export const GetBasicDataOfTheAge = () => {
    return axios.post("/BasicData/GetBasicDataOfTheAge").then(res => res.data);
}
// 获取文物类别
export const GetBasicDataOfTypeOfCulturalRelic = () => {
    return axios.post("/BasicData/GetBasicDataOfTypeOfCulturalRelic").then(res => res.data)
}

// 获取文物分级信息
export const GetGradedInformationBaseData = () =>{
    return axios.post("/BasicData/GetGradedInformationBaseData").then(res => res.data);
}


// 归还按钮
export const ReturnAdd = (params) => {
    return axios.post("Return/ReturnAdd", params).then(res => res.data)
}