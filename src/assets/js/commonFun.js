
import moment from 'moment';


export const RangePickerDefault = [moment()
           .subtract(6, "days"), moment()];


// 截取时间，
export const subStr = (str) => {
    let date_before =  str.split('\n')[0];
    // let date_after = str
    return date_before;
}

// 文物年代
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

export const relicsCateGory = [
    { value: '玉器', key: 1 },
    { value: '瓷器', key: 2 },
    { value: '陶器', key: 3 },
    { value: '青铜器', key: 4 },
    { value: '漆器', key: 5 },
    { value: '书画', key: 6 },
    { value: '民俗', key: 7 },
    { value: '金银器', key: 8 },
    { value: '织绣', key: 9 },
    { value: '紫砂', key: 10 },
    { value: '甲骨', key: 11 },
    { value: '善本书', key: 12 }
]