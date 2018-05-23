import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
/**
 * 异步加载组件
 */

import asyncComponent from '../pages/Components/AsyncComponent';

// import Home from '../pages/Home/Home';
// import About from '../pages/About/About';

const Home = asyncComponent(() => import('../pages/Home/Home'));              // 首页
// const About = asyncComponent(() => import('../pages/About/About'));           // 关于
const CollecExhibition = asyncComponent(() => import('../pages/CollecExhibition'));                         // 藏品展览
const ExhibitionDetails = asyncComponent(() => import('../pages/CollecExhibition/ExhibitionDetails'));     // 藏品展览详情
const AddExhibition = asyncComponent(() => import('../pages/CollecExhibition/AddExhibition'));              // 添加展览    
const CollecRepair = asyncComponent(() => import('../pages/CollecRepair'));                                 // 修复    
const NewRepairList = asyncComponent(() => import('../pages/CollecRepair/NewRepairList'));                  // 新建修复 
const RepairDetails = asyncComponent(() =>
  import("../pages/CollecRepair/RepairDetails")
);                  // 修复单详情
const Information = asyncComponent(() => import('../pages/CollecManagement/Information'));                  // 信息登记
const AddRelics = asyncComponent(() => import('../pages/CollecManagement/Information/addRelics'));          // 新增藏品
const Credentials = asyncComponent(() => import('../pages/CollecManagement/Credentials'));                  // 凭证信息列表
const CredentialDetails = asyncComponent(() => import('../pages/CollecManagement/Credentials/CredentialDetails'));                  // 文物详情
const ProductionCertificate = asyncComponent(() => import('../pages/CollecManagement/Credentials/ProductionCertificate'));   // 凭证制作
const PutInStroage = asyncComponent(() => import('../pages/CollecManagement/PutInStroage'));                // 入库
const NewPutInStroage = asyncComponent(() => import('../pages/CollecManagement/PutInStroage/NewPutInStroage'));                // 新增入库
const PutInDetails = asyncComponent(() => import('../pages/CollecManagement/PutInStroage/PutInDetails'));                // 入库详情
const Outbound = asyncComponent(() => import('../pages/CollecManagement/Outbound'));                        // 出库
const NewOutbound = asyncComponent(() => import('../pages/CollecManagement/Outbound/newOutbound'));         // 新建出库
const OutboundDetails = asyncComponent(() => import('../pages/CollecManagement/Outbound/OutboundDetails')); // 出库详情
const Accounts = asyncComponent(() => import('../pages/CollecAccounts'));                                   // 藏品账目
const Inventory = asyncComponent(() => import('../pages/CollecInventory'));                                 // 藏品盘点
const NewInventory = asyncComponent(() => import('../pages/CollecInventory/NewInventory'));                 // 新建盘点
const ShowDetails = asyncComponent(() => import('../pages/CollecInventory/ShowDetails'));                   // 盘点详情
const Solicition = asyncComponent(() => import('../pages/CollecSolicition'));                               // 藏品征集
const AddSolicition = asyncComponent(() => import('../pages/CollecSolicition/AddSolicition'));                 // 添加藏品征集
const SolicitionDetail = asyncComponent(() => import('../pages/CollecSolicition/solicitionDetail'));                 // 藏品征集详情
const ComlexInfo = asyncComponent(() => import('../pages/ComplexGenericManage/ComplexInfo'));               // 复仿制---信息登记
const AddComplexInfo = asyncComponent(() => import('../pages/ComplexGenericManage/ComplexInfo/AddComplexInfo'));  // 复仿制---信息登记--添加信息
const ComlexPutIn = asyncComponent(() => import('../pages/ComplexGenericManage/ComplexPutIn'));             // 入库
const ComlexOutbound = asyncComponent(() => import('../pages/ComplexGenericManage/ComplexOutbound'));       // 出库
const NewComplexOutbound = asyncComponent(() => import('../pages/ComplexGenericManage/ComplexOutbound/NewComplexOutbound'));  // 新建出库
const ImageManagement = asyncComponent(() => import('../pages/ImageManagement'));                           // 图像管理
const WarehouseInfo = asyncComponent(() => import('../pages/WarehouseManagement/WarehouseInfo'));           // 库房信息维护
const TankInfo = asyncComponent(() => import('../pages/WarehouseManagement/TankInfo'));                     // 存储柜信息维护
const StatisicalAnalysis = asyncComponent(() => import('../pages/StatisicalAnalysis'));                     // 统计分析
const OperationLog = asyncComponent(() => import('../pages/UserOperation/OperationLog'));                   // 操作日志
const AssignPermissions = asyncComponent(() => import('../pages/UserOperation/AssignPermissions'));         // 权限分配
const LatestNotice = asyncComponent(() => import('../pages/LatestNotice'));                     // 最新通知
const WorkflowConfig = asyncComponent(() => import('../pages/UserOperation/WorkflowConfig'))  // 流程配置
const PeopleManagement = asyncComponent(() => import('../pages/UserOperation/PeopleManagement'))  // 人员管理
const PositionMessagement = asyncComponent(() => import('../pages/UserOperation/PositionMessagement'))  // 职位管理
const CollecLogout = asyncComponent(() => import("../pages/CollecLogout"));  // 藏品注销单列表
const NewLogout = asyncComponent(() => import("../pages/CollecLogout/NewLogout"));  // 新建注销单
const LogoutDetail = asyncComponent(() => import("../pages/CollecLogout/LogoutDetail"));  // 注销单详情



class Routes extends Component {
    
    render() {
        // console.log(this.props)
        return <Switch>
            <Route exact path="/App/Home" state={{ title: "首页" }} component={Home} />
            <Route exact path="/App/CollecExhibition" component={CollecExhibition} />
            <Route exact path="/App/ExhibitionDetails/:id" component={ExhibitionDetails} />
            <Route exact path="/App/AddExhibition" component={AddExhibition} />
            <Route exact path="/App/CollecRepair" component={CollecRepair} />
            <Route exact path="/App/NewRepairList" component={NewRepairList} />
            <Route exact path="/App/RepairDetails/:id" component={RepairDetails} />
            <Route exact path="/App/Information" component={Information} />
            <Route exact path="/App/AddRelics" component={AddRelics} />
            <Route exact path="/App/Credentials" component={Credentials} />
            <Route exact path="/App/CredentialDetails/:id" component={CredentialDetails} />
            <Route exact path="/App/ProductionCertificate" component={ProductionCertificate} />
            <Route exact path="/App/PutInStorage" component={PutInStroage} />
            <Route exact path="/App/NewPutInStroage" component={NewPutInStroage} />
            <Route exact path="/App/PutInDetails/:id" component={PutInDetails} />
            <Route exact path="/App/Outbound" component={Outbound} />
            <Route exact path="/App/NewOutbound" component={NewOutbound} />
            <Route exact path="/App/OutboundDetails/:id" component={OutboundDetails} />
            <Route exact path="/App/Accounts" component={Accounts} />
            <Route exact path="/App/Inventory" component={Inventory} />
            <Route exact path="/App/NewInventory" component={NewInventory} />
            <Route exact path="/App/ShowDetails/:id" component={ShowDetails} />
            <Route exact path="/App/Solicition" component={Solicition} />
            <Route exact path="/App/AddSolicition" component={AddSolicition} />
            <Route exact path="/App/ShowSolicitionDetail" component={SolicitionDetail} />
            <Route exact path="/App/ComplexInfo" component={ComlexInfo} />
            <Route exact path="/App/AddComplexInfo" component={AddComplexInfo} />
            <Route exact path="/App/ComplexPutIn" component={ComlexPutIn} />
            <Route exact path="/App/ComplexOutbound" component={ComlexOutbound} />
            <Route exact path="/App/NewComplexOutbound" component={NewComplexOutbound} />
            <Route exact path="/App/ImageManagement" component={ImageManagement} />
            <Route exact path="/App/WarehouseInfo" component={WarehouseInfo} />
            <Route exact path="/App/TankInfo" component={TankInfo} />
            <Route exact path="/App/StatisicalAnalysis" component={StatisicalAnalysis} />
            <Route exact path="/App/OperationLog" component={OperationLog} />
            <Route exact path="/App/AssignPermisssions" component={AssignPermissions} />
            <Route exact path="/App/PeopleManagement" component={PeopleManagement} />
            <Route exact path="/App/LatestNotice" component={LatestNotice} />
            <Route exact path="/App/WorkflowConfig" component={WorkflowConfig} />
            <Route exact path="/App/PositionMessagement" component={PositionMessagement} />
            <Route exact path="/App/CollecLogout" component={CollecLogout} />
            <Route exact path="/App/NewLogout" component={NewLogout} />
            <Route exact path="/App/LogoutDetail/:id" component={LogoutDetail} />
            <Route render={() => <Redirect to="/App/Home" />} />
          </Switch>;
    }
}
// const Routes = [
//     { 
//         path: '/',
//         con
//     }
// ]

export default Routes;