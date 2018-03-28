import axios from 'axios';


// 获取角色数据
export const GetRoleData = () => {
    return axios.post('/ProcessConfigurationManage/GetRoleData').then(res => res.data)
}

// 获取配置数据接口
export const GetProcessData = () => {
    return axios.post('/ProcessConfigurationManage/GetProcessData').then(res => res.data)
}

// 跟新流程配置
export const UpdateProcessData = (params) => {
    return axios.post("/ProcessConfigurationManage/UpdateProcessData", params).then(res => res.data)
}

// 获取流程审核人
export const GetProcessStepData = (params) => {
    return axios.post("/ProcessConfigurationManage/GetProcessStepData", params).then(res =>res.data)
}