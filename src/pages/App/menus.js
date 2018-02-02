export  const menus = [
    { key: '/Home', title: '首页', icon: '' },
    { key: '/CollectionExhibition', title: '藏品展览', icon: '' },
    { key: '/CollectionRepair', title: '藏品修复', icon: '' },
    { key: '/CollectionManagement', title: '藏品管理', icon: '', sub: [
        { key: '/Information', title: '信息登记', icon: '' },
        { key: '/Bill', title: '凭证制作', icon: '' },
        { key: '/PutInStorage', title: '藏品入库', icon: '' },
        { key: '/Outbound', title: '藏品出库', icon: '' }
    ]},
    { key:'/Accounts', title: '藏品账目', icon: '' },
    { key: '/Inventory', title: '藏品盘点', icon: '' },
    { key: '/Solicitation', title: '藏品征集', icon: '' },
    { key: '/ComplexGeneric', title: '复仿制管理', icon: '', sub: [
        { key: '/ComplexInfo', title: '信息登记', icon: '' },
        { key: '/ComplexPutIn', title: '藏品入库', icon: '' },
        { key: '/ComplexOutbound', title: '藏品出库', icon: '' }
    ]},
    { key: '/ImageManagement', title: '影像管理', icon: '' },
    { key: '/Warehouse', title: '库房管理', icon: '', sub: [
        { key: '/WarehouseInfo', title: '库房信息维护', icon: '' },
        { key: '/TankInfo', title: '存储柜信息维护', icon: '' }
    ] },
    { key: '/StatiaticalAnalysis', title: '统计分析', icon: '' },
    { key: '/UserManagement', title: '用户操作管理', icon: '', sub: [
        { key: 'OperationLog', title: '操作日志', icon: '' }
    ]},
    { key: '/About', title: '关于我们', icon: '',sub:[ 
        { key: '/About', title: 'about', icon: '' }
    ] }
]