
import axios from 'axios';

// 统计分析数据
export const GetStatisticalAnalysisData = (params) => {
    return axios.post('/StatisticalAnalysisManage/GetStatisticalAnalysisData', params).then(res => res.data)
}