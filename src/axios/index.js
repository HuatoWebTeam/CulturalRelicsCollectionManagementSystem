
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