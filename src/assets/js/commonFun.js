
import moment from 'moment';


export const RangePickerDefault = [moment()
           .subtract(6, "days"), moment()];


// 截取时间，
export const subStr = (str) => {
    // console.log(str);
    let date_before =  str.split(' ')[0];
    // let date_after = str
    // console.log(date_before)
    return date_before;
}

//文物年代
export const relicsYears = [
    { value: '新石器时代', key: 1 },
    { value: '商周', key: 2 },
    { value: '春秋战国', key: 3 },
    { value: '秦汉', key: 4 },
    { value: '魏晋南北朝', key: 5 },
    { value: '隋唐五代', key: 6 },
    { value: '宋代', key: 7 },
    { value: '辽金', key: 8 },
    { value: '元代', key: 9 },
    { value: '明代', key: 10 },
    { value: '清代', key: 11 },
    { value: '民国时期', key: 12 },
    { value: '近代', key: 13 },
    { value: '现代', key: 14 }
];

// 文物类别
// export const relicsCategory = [
//     { value: '玉器', key: 1 },
//     { value: '瓷器', key: 2 },
//     { value: '陶器', key: 3 },
//     { value: '青铜器', key: 4 },
//     { value: '漆器', key: 5 },
//     { value: '书画', key: 6 },
//     { value: '民俗', key: 7 },
//     { value: '金银器', key: 8 },
//     { value: '织绣', key: 9 },
//     { value: '紫砂', key: 10 },
//     { value: '甲骨', key: 11 },
//     { value: '善本书', key: 12 }
// ];


// 入库类型
export const putInCategory = [
    { value: '发掘', key: 1 },
    { value: '采集', key: 2 },
    { value: '收购', key: 3 },
    { value: '拨交', key: 4 },
    { value: '交换', key: 5 },
    { value: '拣选', key: 6 },
    { value: '捐赠', key: 7 },
    { value: '旧藏', key: 8 }
];

// 分级信息
export const levelInfo = [
    { value: '一级文物', key: 1 },
    { value: '二级文物', key: 2 },
    { value: '三级藏品', key: 3 },
    { value: '普通藏品', key: 4 }
];

// 文物状态

export const relicsState = [
    { value: '待入库', key: 0 },
    { value: '在库', key: 1 },
    { value: '修复中', key: 2 },
    { value: '展览中', key: 3 },
    { value: '外借出库', key: 4 },
    { value: '盘点异常', key: 5 },
    { value: '外借入库', key: 6 },
    { value: '退还', key: 7 },
    { value: '待盘点', key: 8 },
    { value: '待展览', key: 9 },
    { value: '待修复', key: 10 },
    { value: '修复异常', key: 11 },
    { value: '展览异常', key: 12 },
    { value: '修复入库', key: 13 },
    { value: '展览入库', key: 14 },
    { value: '出库展览中', key: 15 },
    { value: '出库修复中', key: 16 },
    { value: '入库异常', key: 17 },
    { value: '入库中', key: 18 },
    { value: '待注销', key: 19 },
    { value: '已注销', key: 20 }

]

// 完整程度
export const howComplete = [
    { value: '完整', key: 0 },
    { value: '破损', key: 1 }
]

// 展览类型
export const exhibitionType = [
    {
        key: 0,
        value: "内展"
      },
      {
        key: 1,
        value: "外展"
      }
]
// 展览状态
export const exhibiState = [
    { key: 0, value: '待展览' },
    { key: 1, value: '出库中' },
    { key: 2, value: '出库展览中' },
    { key: 3, value: '入库中' },
    { key: 4, value: '展览完成' }
]

// 审批状态
export const approveState = [
    { key: 1, value: '未结正常' },
    { key: 2, value: '未结异常' },
    { key: 3, value: '已结案' },
    { key: 4, value: '拒绝' }
]


// 盘点状态
export const inventState = [
    { key: 0, value: '待盘点' },
    { key: 4, value: '盘点中' },
    { key: 1, value: '盘点完成' },
    { key: 2, value: '盘点异常' },
]


// 修复状态
export const repairState = [
    { key: 0, value: '待修复' },
    { key: 1, value: '出库修复中' },
    { key: 2, value: '修复完成' },
    { key: 3, value: '修复异常' },
    { key: 4, value: '入库中' }
]


// 出库状态

export const outboundState = [
    { key: 0, value: '待出库' },
    { key: 1, value: '出库完成' },
    { key: 2, value: '出库异常' },
    { key: 3, value: '删除' }
]

// 入库状态
export const putinState = [
    { key: 0, value: '待入库' },
    { key: 1, value: '入库完成' },
    { key: 2, value: '入库异常' },
    { key: 3, value: '删除' }
]

// 入库类型
export const putinType = [
    { key: 2, value: '信息登记' },
    { key: 1, value: '征集' }, 
    { key: 3, value: '展览归还', isHidden: true },
    { key: 4, value: '修复归还', isHidden: true },
    { key: 5, value: '自定义归还' }
]