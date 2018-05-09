import React, { Component } from 'react';
import { Row, Col, Table } from 'antd';
import { GetOutTheLibraryDetails } from "../Outbound/api";
import { relicsYears, subStr, putinState } from "../../../assets/js/commonFun";
import ApproveComponent from "../../Components/ApproveComponent";
import CommonInfoTable from "../../Components/CommonInfoTable";

class PutInDetails extends Component {
  state = {
    paramsId: null,
    detailsList: [],
    anthorityState: null,
    showDeatil: null,
  };

  componentWillMount() {
    this.setState(
      {
        paramsId: this.props.match.params.id,
      },
      () => {
        this.getPutInDetail();
      }
    );
  }

  getPutInDetail() {
    let params = { parameters: { Condition: this.state.paramsId } };
    GetOutTheLibraryDetails(params).then(res => {
      console.log(res);
      let data = res.Data;
      let list = data.ListCollection;
      let detailInfo = {
        Operator: data.Operator,         // 操作人
        TheLibraryPurpose: data.TheLibraryPurpose,    // 入库详情
        TheLibraryTime: subStr(data.TheLibraryTime),  // 入库时间
        TheLibraryNumber: data.TheLibraryNumber,      // 入库数量
        TheLibraryState: data.TheLibraryState,        // 入库状态
        TheLibraryOdd: data.TheLibraryOdd,            // 入库单号
      }
      for (let item of list) {
        item.key = item.CollectionNumber;
      }
      this.setState({
        detailsList: list,
        showDeatil: detailInfo,
        anthorityState: Number(data.DeniedPermission)
      });
    });
  }
  // 改变审批条件状态
  changeAnthority = () => {
    this.setState({ anthorityState: 0 });
  };

  render() {
    const { detailsList, paramsId, anthorityState, showDeatil } = this.state;
    console.log(detailsList)
    return <Row className="main-content">
        <Col span={24} className="title">
          藏品入库详情
          <div className="go-back" onClick={() => {
              this.props.history.goBack();
            }} />
        </Col>
        <Col span={24} style={{ padding: "20px 40px 20px 20px" }}>
          {showDeatil && <Col span={24} className="number-details">
              <Col span={5} className="text">
                入库单号：{showDeatil.TheLibraryOdd}
              </Col>
              <Col span={17} className="text">
                入库详情：{showDeatil.TheLibraryPurpose}
              </Col>
              <Col span={5} className="text">
                入库时间：{showDeatil.TheLibraryTime}
              </Col>
              <Col span={17} className="text">
                入库数量：{showDeatil.TheLibraryNumber}
              </Col>
              <Col span={5} className="text">
                操作人：{showDeatil.Operator}
              </Col>
              <Col span={17} className="text">
                入库状态：{putinState.map((item) => {
                      if(Number(showDeatil.TheLibraryState) === item.key) {
                        return <span
                        key={item.key}
                            style={{
                              color:
                                item.key === 0
                                  ? "#da6214"
                                  : item.key === 1
                                    ? "#3065bf"
                                    : "red"
                            }}
                          >
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
        {
          showDeatil && <ApproveComponent 
            oddName={showDeatil.TheLibraryPurpose ||''} 
            paramsId={paramsId} 
            anthorityState={anthorityState} 
            flag={2} 
            changeAnthorityState={this.changeAnthority} 
          />
        }
          
        </Col>
      </Row>;
  }
}

export default PutInDetails;