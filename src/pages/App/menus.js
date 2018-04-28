export  const menus = [
    { key: '/App/Home', title: '首页', icon: 'iconBack home', sub: [], isHidden: false },
    { key: '/App/CollecExhibition', title: '藏品展览', icon: 'iconBack exhibition', isHidden: false, sub: [] },
    { key: '/App/ExhibitionDetails', title: '藏品展览 > 详情', isHidden: true, fatherName: '/App/CollecExhibition', sub: [] },
    { key: '/App/AddExhibition', title: '藏品展览 > 添加展览', isHidden: true, fatherName: '/App/CollecExhibition', sub: [] },
    { key: '/App/CollecRepair', title: '藏品修复', icon: 'iconBack repair', sub: [], isHidden: false },
    { key: '/App/NewRepairList', title: '藏品修复 > 新建修复单', isHidden: true, fatherName: '/App/CollecRepair', sub: [] },
    { key: '/App/RepairDetails', title: '藏品修复 > 修复单详情', isHidden: true, fatherName: '/App/CollecRepair', sub: [] },
    { key: 'CollectionManagement', title: '藏品管理', icon: 'iconBack collection', sub: [
        { key: '/App/Information', title: '信息登记', icon: 'nullIcon' },
        { key: '/App/AddRelics', title: '藏品管理 > 信息登记 > 新增藏品', isHidden: true, fatherName: '/App/Information' },
        { key: '/App/Credentials', title: '凭证制作', icon: 'nullIcon' },
        { key: '/App/ProductionCertificate', title: '藏品管理 > 凭证制作', isHidden: true, fatherName: '/App/Credentials' },
        { key: '/App/PutInStorage', title: '藏品入库', icon: 'nullIcon' },
        { key: '/App/NewPutInStroage', title: '藏品入库 > 新建入库单', isHidden: true, icon: 'nullIcon', fatherName: '/App/PutInStorage' },
        { key: '/App/PutInDetails', title: '藏品入库 > 入库详情', isHidden: true, icon: 'nullIcon', fatherName: '/App/PutInStorage' },
        { key: '/App/Outbound', title: '藏品出库', icon: 'nullIcon' },
        { key: '/App/NewOutbound', title: '藏品管理 > 藏品出库 > 新建出库单', isHidden: true, fatherName: '/App/Outbound' },
        { key: "/App/OutboundDetails", title: '藏品管理 > 藏品出库 > 出库详情', isHidden: true, fatherName: '/App/Outbound' }
    ]},
    { key:'/App/Accounts', title: '藏品账目', icon: 'iconBack accounts', sub: [], isHidden: false },
    { key: '/App/Inventory', title: '藏品盘点', icon: 'iconBack inventory', sub: [], isHidden: false },
    { key: '/App/NewInventory', title: '新建盘点单', isHidden: true, fatherName: '/App/Inventory', sub: [] },
    { key: '/App/ShowDetails', title: '盘点单详情', isHidden: true, fatherName: '/App/Inventory', sub: [] },
    { key: '/App/Solicition', title: '藏品征集', icon: 'iconBack solicition', sub: [] },
    { key: '/App/AddSolicition', title: '藏品征集 > 添加藏品征集', isHidden: true, fatherName: '/App/Solicition', sub: [] },
    { key: '/App/ShowSolicitionDetail', title: '藏品征集 > 藏品征集详情', isHidden: true, fatherName: '/App/Solicition', sub: [] },
    // { key: 'ComplexGeneric', title: '复仿制管理', icon: 'iconBack complexgeneric', sub: [
    //     { key: '/App/ComplexInfo', title: '信息登记', icon: 'nullIcon' },
    //     { key: '/App/AddComplexInfo', title: '复仿制管理 > 信息登记 > 添加信息', isHidden: true, fatherName: '/App/ComplexInfo' },
    //     { key: '/App/ComplexPutIn', title: '藏品入库', icon: 'nullIcon' },
    //     { key: '/App/ComplexOutbound', title: '藏品出库', icon: 'nullIcon' },
    //     { key: '/App/NewComplexOutbound', title: '复仿制管理 > 藏品出库 > 新建出库单', isHidden: true, fatherName: '/App/ComplexOutbound' }
    // ]},
    { key: '/App/ImageManagement', title: '影像管理', icon: 'iconBack image', sub: [], isHidden: false },
    { key: 'WarehouseManagement', title: '库房管理', icon: 'iconBack warehouse', sub: [
        { key: '/App/WarehouseInfo', title: '库房信息维护', icon: 'nullIcon' },
        { key: '/App/TankInfo', title: '存储柜信息维护', icon: 'nullIcon' }
    ] },
    { key: '/App/StatisicalAnalysis', title: '统计分析', icon: 'iconBack statisic', sub: [], isHidden: false },
    { key: 'UserManagement', title: '用户管理', icon: 'iconBack user', sub: [
        { key: '/App/OperationLog', title: '操作日志', icon: 'nullIcon' },
        { key: '/App/AssignPermisssions', title: '权限分配', icon: 'nullIcon' },
        { key: '/App/WorkflowConfig', title: '流程配置', icon: 'nullIcon' },
        { key: "/App/PeopleManagement", title: '人员管理', icon: 'nullIcon' },
        { key: '/App/PositionMessagement', title: '职位管理', icon: 'nullIcon' }
    ]},
    { key: "/App/LatestNotice", title: '通知管理', icon: 'notification', sub: [], isHidden: false }

]