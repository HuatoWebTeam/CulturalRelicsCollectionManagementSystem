import React, { Component } from 'react';
import { Row, Col, Table } from 'antd';
import { GetOutTheLibraryDetails } from './api';
import {
  levelInfo,
  relicsYears,
  subStr,
  outboundState
} from "../../../assets/js/commonFun";
import ApproveComponent from "../../Components/ApproveComponent";
import CommonInfoTable from "../../Components/CommonInfoTable";

class OutboundDetails extends Component {
  state = {
    paramsId: "",
    detailsList: [],
    anthorityState: null,
    showDeatil: null
  };

  componentWillMount() {
    let state = sessionStorage.getItem("anthoityState");
    this.setState(
      {
        paramsId: this.props.match.params.id,
        anthorityState: Number(state)
      },
      () => {
        this.GetOutTheLibraryList();
      }
    );
  }

  GetOutTheLibraryList() {
    let params = {
      parameters: {
        Condition: this.state.paramsId
      }
    };
    GetOutTheLibraryDetails(params).then(res => {
      console.log(res);
      let data = res.Data;
      let list = data.ListCollection;
      let detailInfo = {
        Operator: data.Operator, // 操作人
        TheLibraryPurpose: data.TheLibraryPurpose, // 入库详情
        TheLibraryTime: subStr(data.TheLibraryTime), // 入库时间
        TheLibraryNumber: data.TheLibraryNumber, // 入库数量
        TheLibraryState: data.TheLibraryState, // 入库状态
        TheLibraryOdd: data.TheLibraryOdd // 入库单号
      };
      for (let item of list) {
        item.key = item.CollectionNumber;
      }
      this.setState({
        detailsList: list,
        showDeatil: detailInfo
      });
    });
  }
  // 改变审批条件状态
  changeAnthority = () => {
    sessionStorage.setItem("anthoityState", 0);
    this.setState({ anthorityState: 0 });
  };
  render() {
    const { detailsList, paramsId, anthorityState, showDeatil } = this.state;

    return <Row className="main-content">
        <Col span={24} className="title">
          出库单详情
          <div className="go-back" onClick={() => {
              this.props.history.goBack();
            }} />
        </Col>
        <Col span={24} style={{ padding: "20px 40px 20px 20px" }}>
          {showDeatil && <Col span={24} className="number-details">
              <Col span={5} className="text">
                出库单号：{showDeatil.TheLibraryOdd}
              </Col>
              <Col span={17} className="text">
                出库详情：{showDeatil.TheLibraryPurpose}
              </Col>
              <Col span={5} className="text">
                出库时间：{showDeatil.TheLibraryTime}
              </Col>
              <Col span={17} className="text">
                出库数量：{showDeatil.TheLibraryNumber}
              </Col>
              <Col span={5} className="text">
                操作人：{showDeatil.Operator}
              </Col>
              <Col span={17} className="text">
                出库状态：{outboundState.map((item) => {
                  if(Number(showDeatil.TheLibraryState) === item.key) {
                    return <span style={{ color: item.key === 0 ? "#da6214" : item.key === 1 ? "#3065bf" : "red" }}>
                        {item.value}
                      </span>;
                  }
                })
                  }
              </Col>
            </Col>}
          <CommonInfoTable data={detailsList} isPK={true} />
        </Col>
        <Col span={24}>
          <ApproveComponent paramsId={paramsId} anthorityState={anthorityState} flag={3} changeAnthorityState={this.changeAnthority} />
        </Col>
      </Row>;
  }
}

export default OutboundDetails;