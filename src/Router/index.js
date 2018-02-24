import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
/**
 * 异步加载组件
 */

import asyncComponent from '../pages/Components/AsyncComponent';

// import Home from '../pages/Home/Home';
// import About from '../pages/About/About';

const Home = asyncComponent(() => import('../pages/Home/Home'));              // 首页
const About = asyncComponent(() => import('../pages/About/About'));           // 关于
const CollecExhibition = asyncComponent(() => import('../pages/CollecExhibition'));                         // 藏品展览
const ExhibitionDetails = asyncComponent(() => import('../pages/CollecExhibition/ExhibitionDetails'));     // 藏品展览详情
const AddExhibition = asyncComponent(() => import('../pages/CollecExhibition/AddExhibition'));              // 添加展览    
const CollecRepair = asyncComponent(() => import('../pages/CollecRepair'));                                 // 修复    
const NewRepairList = asyncComponent(() => import('../pages/CollecRepair/NewRepairList'));                                 // 新建修复
const Information = asyncComponent(() => import('../pages/CollecManagement/Information'));                  // 信息登记
const Bill = asyncComponent(() => import('../pages/CollecManagement/Bill'));                                // 凭证制作
const PutInStroage = asyncComponent(() => import('../pages/CollecManagement/PutInStroage'));                // 入库
const Outbount = asyncComponent(() => import('../pages/CollecManagement/Outbound'));                        // 出库
const Accounts = asyncComponent(() => import('../pages/CollecAccounts'));                                   // 藏品账目
const Inventory = asyncComponent(() => import('../pages/CollecInventory'));                                 // 藏品盘点
const Solicition = asyncComponent(() => import('../pages/CollecSolicition'));                               // 藏品征集
const ComlexInfo = asyncComponent(() => import('../pages/ComplexGenericManage/ComplexInfo'));               // 复仿制---信息登记
const ComlexPutIn = asyncComponent(() => import('../pages/ComplexGenericManage/ComplexPutIn'));             // 入库
const ComlexOutbound = asyncComponent(() => import('../pages/ComplexGenericManage/ComplexOutbound'));       // 出库
const ImageManagement = asyncComponent(() => import('../pages/ImageManagement'));                           // 图像管理
const WarehouseInfo = asyncComponent(() => import('../pages/WarehouseManagement/WarehouseInfo'));           // 库房信息维护
const TankInfo = asyncComponent(() => import('../pages/WarehouseManagement/TankInfo'));                     // 存储柜信息维护
const StatisicalAnalysis = asyncComponent(() => import('../pages/StatisicalAnalysis'));                     // 统计分析
const OperationLog = asyncComponent(() => import('../pages/UserOperation/OperationLog'));                   // 操作日志


class Routes extends Component {
    
    render() {
        console.log(this.props)
        return <Switch>
            <Route exact path="/App/Home" state={{ title: "首页" }} component={Home} />
            <Route exact path="/App/CollecExhibition" component={CollecExhibition} />
            <Route exact path="/App/ExhibitionDetails/:id" component={ExhibitionDetails} />
            <Route exact path="/App/AddExhibition" component={AddExhibition} />
            <Route exact path="/App/CollecRepair" component={CollecRepair} />
            <Route exact path="/App/NewRepairList" component={NewRepairList} />
            <Route exact path="/App/Information" component={Information} />
            <Route exact path="/App/Bill" component={Bill} />
            <Route exact path="/App/PutInStorage" component={PutInStroage} />
            <Route exact path="/App/Outbound" component={Outbount} />
            <Route exact path="/App/Accounts" component={Accounts} />
            <Route exact path="/App/Inventory" component={Inventory} />
            <Route exact path="/App/Solicition" component={Solicition} />
            <Route exact path="/App/ComplexInfo" component={ComlexInfo} />
            <Route exact path="/App/ComplexPutIn" component={ComlexPutIn} />
            <Route exact path="/App/ComplexOutbound" component={ComlexOutbound} />
            <Route exact path="/App/ImageManagement" component={ImageManagement} />
            <Route exact path="/App/WarehouseInfo" component={WarehouseInfo} />
            <Route exact path="/App/TankInfo" component={TankInfo} />
            <Route exact path="/App/StatisicalAnalysis" component={StatisicalAnalysis} />
            <Route exact path="/App/OperationLog" component={OperationLog} />
            <Route exact path="/App/About" component={About} />
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