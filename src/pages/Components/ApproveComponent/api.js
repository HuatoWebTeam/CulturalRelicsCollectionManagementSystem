import axios from 'axios';


// 审批历史记录
export const GetApprovalDetails = (params) => {
    return axios.post("/GetApprovalDeta/GetApprovalDetails", params).then(res => res.data)
}

// //  审批通过数据接口
export const ApprovalPassed = (params) => {
    return axios.post("/ApprovalFunctionManage/ApprovalPassed", params).then(res => res.data)
}

// 审批拒绝接口
export const ApprovalDenied = (params) => {
    return axios.post("/ApprovalFunctionManage/ApprovalDenied", params).then(res => res.data)
}