import React, { Component } from 'react';
import { Row, Col, Table } from 'antd';
import { InvenDataAll } from './api';
import { levelInfo, relicsYears, relicsState, inventState, subStr } from "../../assets/js/commonFun";
import ApproveComponent from "../Components/ApproveComponent";
import CommonInfoTable from "../Components/CommonInfoTable";

class ShowDetails extends Component {
  state = {
    inventDetailsList: [],
    inventNum: "",
    inventDetail: null,
    pageIndex: 1,
    pageSize: 1000,
    total: 0,
    anthorityState: null
  };
  componentWillMount() {
    console.log(this.props);
    let state = sessionStorage.getItem("anthoityState");
    this.setState(
      {
        inventNum: this.props.match.params.id,
        anthorityState: Number(state)
      },
      () => {
        this.getInventDetailsList();
      }
    );
  }

  getInventDetailsList() {
    const { pageIndex, pageSize, inventNum } = this.state;
    let params = {
      Exhibition_Odd: inventNum,
      pageIndex: pageIndex,
      pageSize: pageSize
    };
    InvenDataAll(params).then(res => {
      console.log(res);
      if (res.length !== 0) {
        let listData = res[0].exhibit;
        for (let item of listData) {
          item.key = item.Collection_Number;
        }
        let detailInfo = {
          InventoryMan: res[0].InventoryMan,     // 盘点人
          Inventory_Name: res[0].Inventory_Name,  // 盘点名称
          Inventory_Number:res[0].Inventory_Number,  // 盘点数量
          Inventory_Cycle: res[0].Inventory_Cycle,    // 盘点周期
          Inventory_BegTime: subStr(res[0].Inventory_BegTime),  // 盘点开始日期
          Inventory_EndTime: subStr(res[0].Inventory_EndTime),   // 盘点结束日期
          Inventory_State: res[0].Inventory_State,      // 盘点状态

        };

        this.setState({
          inventDetail: detailInfo,
          inventDetailsList: listData
        });
      }
    });
  }

  // 分页改变
  paginationChange = page => {
    this.setState(
      {
        pageIndex: page
      },
      () => {
        this.getInventDetailsList();
      }
    );
  };

  // 改变审批条件状态
  changeAnthority = () => {
    sessionStorage.setItem("anthoityState", 0);
    this.setState({ anthorityState: 0 });
  };

  render() {
    const { inventDetail, inventDetailsList, inventNum, anthorityState } = this.state;

    return <Row className="main-content">
        <Col className="title" span={24}>
          盘点单详情 <div className="go-back" onClick={() => {
              this.props.history.goBack();
            }} />
        </Col>
        <Col span={24} style={{ padding: "20px 40px 20px 20px" }}>
          {inventDetail && <Col span={24} className="number-details">
              <Col className="text" span={7}>
                盘点名称：{inventDetail.Inventory_Name}
              </Col>
              <Col className="text" span={7}>
                盘点人：{inventDetail.InventoryMan}
              </Col>
              <Col className="text" span={7}>
                盘点数量：{inventDetail.Inventory_Number}
              </Col>
              <Col className="text" span={7}>
                盘点周期：{inventDetail.Inventory_Cycle} 天
              </Col>
              <Col className="text" span={7}>
                盘点开始日期：{inventDetail.Inventory_BegTime}
              </Col>
              <Col className="text" span={7}>
                盘点结束日期：{inventDetail.Inventory_EndTime}
              </Col>
              <Col className="text" span={7}>
                盘点状态：{inventState.map(item => {
                  if (item.key === Number(inventDetail.Inventory_State)) {
                    return <span
                        style={{
                          color:
                            Number(inventDetail.Inventory_State) === 2
                              ? "red"
                              : "#333"
                        }}
                      >
                        {item.value}
                      </span>;
                  }
                })}
              </Col>
            </Col>}
          <Col span={24}>
          <CommonInfoTable data={inventDetailsList} />
            {/* <Table pagination={false //
              } dataSource={inventDetailsList} columns={inventDetailsColumns} bordered /> */}
          </Col>
        </Col>
        <ApproveComponent 
          anthorityState={anthorityState} 
          paramsId={inventNum} 
          flag={4} 
          changeAnthorityState={this.changeAnthority} 
        />
      </Row>;
  }
}

export default ShowDetails;