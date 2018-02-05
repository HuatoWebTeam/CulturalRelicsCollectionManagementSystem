export  const menus = [
    { key: '/App/Home', title: '首页', icon: '' },
    { key: '/App/CollectionExhibition', title: '藏品展览', icon: '' },
    { key: '/App/CollectionRepair', title: '藏品修复', icon: '' },
    { key: 'CollectionManagement', title: '藏品管理', icon: '', sub: [
        { key: '/App/Information', title: '信息登记', icon: '' },
        { key: '/App/Bill', title: '凭证制作', icon: '' },
        { key: '/App/PutInStorage', title: '藏品入库', icon: '' },
        { key: '/App/Outbound', title: '藏品出库', icon: '' }
    ]},
    { key:'/App/Accounts', title: '藏品账目', icon: '' },
    { key: '/App/Inventory', title: '藏品盘点', icon: '' },
    { key: '/App/Solicitation', title: '藏品征集', icon: '' },
    { key: 'ComplexGeneric', title: '复仿制管理', icon: '', sub: [
        { key: '/App/ComplexInfo', title: '信息登记', icon: '' },
        { key: '/App/ComplexPutIn', title: '藏品入库', icon: '' },
        { key: '/App/ComplexOutbound', title: '藏品出库', icon: '' }
    ]},
    { key: '/App/ImageManagement', title: '影像管理', icon: '' },
    { key: 'Warehouse', title: '库房管理', icon: '', sub: [
        { key: '/App/WarehouseInfo', title: '库房信息维护', icon: '' },
        { key: '/App/TankInfo', title: '存储柜信息维护', icon: '' }
    ] },
    { key: '/App/StatiaticalAnalysis', title: '统计分析', icon: '' },
    { key: 'UserManagement', title: '用户操作管理', icon: '', sub: [
        { key: '/App/OperationLog', title: '操作日志', icon: '' }
    ]},
    { key: 'About', title: '关于我们', icon: '',sub:[ 
        { key: '/App/About', title: 'about', icon: '' }
    ] }
]