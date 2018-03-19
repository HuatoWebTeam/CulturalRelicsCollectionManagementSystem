

export const CLICK_ME = "CLICK_ME";   // 测试
export const EXHIBITIONPAGE = "EXHIBITIONPAGE";  // 藏品展览
export const REPAIRPAGE = "REPAIRPAGE";  // 藏品修复
export const COLLECINFO = "COLLECINFO";  // 藏品管理》信息登记
export const COLLECINFOPAGE = "COLLECINFOPAGE"; // 藏品管理》信息登记  pageindex
export const BILLPAGE = "BILLPAGE";  // 凭证制作
export const PUTINSTORAGEPAGE = "PUTINSTORAGEPAGE";  // 藏品入库
export const OUTBOUNDPAGE = "OUTBOUNDPAGE";  // 藏品入库
export const INVENTORYPAGE = "INVENTORYPAGE"; // 藏品账目
export const SOLICITIONPAGE = "SOLICITIONPAGE";      // 藏品征集
export const WAREHOUSEPAGE = "WAREHOUSEPAGE";  //库房信息
export const TANKINFOPAGE = "TANKINFOPAGE";    // 存储柜信息
export const OPERATIONPAGE = "OPERATIONPAGE";  // 操作日志



export function clickme (data) {
    return {
        type: CLICK_ME,
        payload: data
    }
}
export function exhibitionPage (data) {
    return {
        type: EXHIBITIONPAGE,
        payload: data
    }
}

export function repairPage (data) {
    return {
        type: REPAIRPAGE,
        payload: data
    }
}

export function collectionInfo (data) {
    return {
        type: COLLECINFO,
        payload: data
    }
}
export function collecInfoPage (data) {
    return {
        type: COLLECINFOPAGE,
        payload: data
    }
}
export function billPage (data) {
    return {
        type: BILLPAGE,
        payload: data
    }
}
export function putInStoragePage (data) {
    return {
        type: PUTINSTORAGEPAGE,
        payload: data
    }
}
export function outboundPage (data) {
    return {
        type: OUTBOUNDPAGE,
        payload: data
    }
}
export function inventoryPage (data) {
    return {
        type: INVENTORYPAGE,
        payload: data
    }
}
export function solicitionPage (data) {
    return {
        type: SOLICITIONPAGE,
        payload: data
    }
}
export function warehousePage (data) {
    return {
        type: WAREHOUSEPAGE,
        payload: data
    }
}
export function tankInfoPage (data) {
    return {
        type: TANKINFOPAGE,
        payload: data
    }
}
export function operationPage (data) {
    return {
        type: OPERATIONPAGE,
        payload: data
    }
}