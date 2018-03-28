import axios from 'axios';

// 获取用户列表
export const GetUserManageData = (params) => {
    return axios.post("/UserManage/GetUserManageData", params).then(res =>res.data)
}


// 新增用户
export const InsertUserManageData = (params) => {
    return axios.post("/UserManage/InsertUserManageData", params).then(res => res.data)
}


// 编辑用户
export const UpdateUserManageData = (params) => {
    return axios.post("/UserManage/UpdateUserManageData", params).then(res => res.data)
}