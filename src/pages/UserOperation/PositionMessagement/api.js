import axios from 'axios';

// 新增职位
export const AddRoleData = (params) => {
    return axios.post('/UserManage/AddRoleData', params).then(res => res.data)
}


// 编辑职位
export const UpdateRoleData = (params) => {
    return axios.post('/UserManage/UpdateRoleData', params).then(res => res.data)
}

// 删除接口
export const DeleteRoleData = (params) => {
    return axios.post('/UserManage/DeleteRoleData', params).then(res => res.data)
}



