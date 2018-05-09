import React, { Component } from 'react';
import { Row, Col, Table } from 'antd';
import { levelInfo, relicsState, subStr, repairState } from "../../assets/js/commonFun";
import { RepDatall } from './api';
import ApproveComponent from "../Components/ApproveComponent";
import CommonInfoTable from '../Components/CommonInfoTable';


class RepairDetails extends Component {
  state = {
    pageIndex: 1,
    pageSize: 1000,
    total: 0,
    repairNum: "",
    repairDetailList: [],
    anthorityState: null,
    detailInfo: {}
  };

  componentWillMount() {
    // console.log(state);
    this.setState({
      repairNum: this.props.match.params.id,
    }, () => {
      this.getRepairDetailList()
    });
  }

  getRepairDetailList() {
    const { pageIndex, pageSize, repairNum } = this.state;
    let params = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      Exhibition_Odd: repairNum
    };
    RepDatall(params).then(res => {
      console.log(res);
      if (res.length !== 0) {
        let listData = res[0].exhibit;
        let listDetail = {
          Repair_Applicant: res[0].Repair_Applicant,    // 申请人
          Repair_Time: res[0].Repair_Time,              // 申请时间
          Repair_Restorer: res[0].Repair_Restorer,      // 修复人
          Repair_Method: res[0].Repair_Method,          // 修复方法
          Repair_Range: subStr(res[0].Repair_BegTime) + ' ~ ' + subStr(res[0].Repair_EndTime),    // 起止日期
          Repair_Result: res[0].Repair_Result,          // 预期修复结果
          Repair_State: res[0].Repair_State,            // 修复状态
          ReturnTime: subStr(res[0].ReturnTime),                // 归还时间

        };
        for (let item of listData) {
          item.key = item.Collection_Number;
        }
        this.setState({
          repairDetailList: listData,
          detailInfo: listDetail,
          anthorityState: Number(res[0].DeniedPermission)
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
        this.getRepairDetailList();
      }
    );
  };
  // 改变审批条件状态
  changeAnthority = () => {
    this.setState({ anthorityState: 0 });
  };

  render() {
    const { repairDetailList, anthorityState, repairNum, detailInfo } = this.state;
    return <Row className="main-content">
        <Col span={24} className="title">
          修复单详情
          <div className="go-back" onClick={() => {
              this.props.history.goBack();
            }} />
        </Col>
        <Col span={24} style={{ padding: "20px 40px 20px 20px" }}>
          {detailInfo && <Col span={24} className="number-details">
              <Col className="text" span={7}>
                申请人：{detailInfo.Repair_Applicant}
              </Col>
              <Col className="text" span={7}>
                申请时间：{detailInfo.Repair_Time}
              </Col>
              <Col className="text" span={7}>
                修复人：{detailInfo.Repair_Restorer}
              </Col>
              <Col className="text" span={7}>
                修复方法：{detailInfo.Repair_Method}
              </Col>
              <Col className="text" span={7}>
                起止日期：{detailInfo.Repair_Range}
              </Col>
              <Col className="text" span={7}>
                归还日期：{detailInfo.ReturnTime}
              </Col>
              <Col className="text" span={7}>
                预期修复结果：{detailInfo.Repair_Result}
              </Col>
              <Col className="text" span={7}>
                修复状态：{repairState.map(item => {
                  if (Number(detailInfo.Repair_State) === item.key) {
                    return <span
                        key={item.key}
                        style={{
                          color:
                            Number(detailInfo.Repair_State) === 3
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
          <CommonInfoTable data={repairDetailList} />
        </Col>
        <ApproveComponent oddName={'此修复单'} paramsId={repairNum} anthorityState={anthorityState} flag={6} changeAnthorityState={this.changeAnthority} />
      </Row>;
  }
}

export default RepairDetails;