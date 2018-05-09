import React, { Component } from "react";
import { Row, Col, Table } from "antd";
// import { relicDetails } from './data';
import "./index.less";
import { ExhibitionDetailsApi } from "./api";
import {
  levelInfo,
  relicsYears,
  exhibiState,
  relicsState,
  howComplete,
  exhibitionType,
  subStr
} from "../../assets/js/commonFun";
import ApproveComponent from "../Components/ApproveComponent";
import CommonInfoTable from "../Components/CommonInfoTable";

class ExhibitionDetails extends Component {
  state = {
    id: null,
    pageIndex: 1,
    pageSize: 1000,
    total: 0,
    data: [],
    anthorityState: null,
    detailInfo: null
  };

  componentWillMount() {
    // console.log(this.props);

    this.setState({
      id: this.props.match.params.id
    });
  }
  componentDidMount() {
    this.getDetailsList();
    // let state = sessionStorage.getItem("anthoityState");
    // // console.log(state);
    // this.setState({
    //   anthorityState: Number(state)
    // });
  }

  getDetailsList() {
    const { pageIndex, id, pageSize } = this.state;
    let params = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      Exhibition_Odd: id
    };
    ExhibitionDetailsApi(params).then(res => {
      console.log(res);
      if (res.length > 0) {
        this.setState({ total: res[0].Count });
        let dataSource = {
          Exhibition_Theme: res[0].Exhibition_Theme, // 展览主题
          Exhibition_Type: res[0].Exhibition_Type, // 展览类型
          Exhibition_Range:
            subStr(res[0].StartTine) + " ~ " + subStr(res[0].EndTime), // 展览起止时间
          Exhibition_Contact: res[0].Exhibition_Contact, // 联系方式
          Person_liable: res[0].Person_liable, // 负责人
          Exhibition_Place: res[0].Exhibition_Place, // 展览地点
          Exhibition_Cost: res[0].Exhibition_Cost, // 外展经费
          CreationTime: subStr(res[0].CreationTime), // 创建时间
          ReturnTime: subStr(res[0].ReturnTime), // 归还时间
          Exhibition_State: res[0].Exhibition_State // 展览状态
        };
        let listData = res[0].exhibit;
        for (let item of listData) {
          item.key = item.Collection_Number;
        }
        this.setState({
          data: listData,
          detailInfo: dataSource,
          anthorityState: Number(res[0].DeniedPermission)
        });
      } else {
        this.setState({
          total: 0,
          anthorityState: 0
        });
      }
    });
  }

  paginationChange(page) {
    this.setState({
      pageIndex: page
    });
    this.getDetailsList();
  }
 // 改变审批条件状态
  changeAnthority = () => {
    this.setState({ anthorityState: 0 });
  };

  render() {
    const { data, id, anthorityState, howComplete, detailInfo } = this.state;

    return (
      <Row className="exhibition-container main-content">
        <Col className="title" span={24}>
          藏品展览详情{" "}
          <div
            className="go-back"
            onClick={() => {
              this.props.history.goBack();
            }}
          />
        </Col>
        <Col
          span={24}
          className="exhibition-content"
          style={{ marginTop: "20px" }}
        >
          {detailInfo && (
            <Col span={24} className="number-details">
              <Col className="text" span={7}>
                展览主题：{detailInfo.Exhibition_Theme}
              </Col>
              <Col className="text" span={7}>
                展览类型：{exhibitionType.map(item => {
                  if (Number(detailInfo.Exhibition_Type) === item.key) {
                    return item.value;
                  }
                })}
              </Col>
              <Col className="text" span={7}>
                展览日期：{detailInfo.Exhibition_Range}
              </Col>
              <Col className="text" span={7}>
                负责人：{detailInfo.Person_liable}
              </Col>
              <Col className="text" span={7}>
                创建时间：{detailInfo.CreationTime}
              </Col>
              <Col className="text" span={7}>
                归还时间：{detailInfo.ReturnTime}
              </Col>
              {Number(detailInfo.Exhibition_Type) === 1 && (
                <Col span={24}>
                  <Col className="text" span={7}>
                    外展地点： {detailInfo.Exhibition_Place}
                  </Col>
                  <Col className="text" span={7}>
                    联系方式： {detailInfo.Exhibition_Contact}
                  </Col>
                  <Col className="text" span={7}>
                    外展经费： {detailInfo.Exhibition_Cost}
                  </Col>
                </Col>
              )}
              <Col className="text" span={7}>
                展览状态：{exhibiState.map(item => {
                  if (Number(detailInfo.Exhibition_State) === item.key) {
                    return item.value;
                  }
                })}
              </Col>
            </Col>
          )}
          <CommonInfoTable data={data} />
        </Col>
        {
          detailInfo && <ApproveComponent
            paramsId={id}
            anthorityState={anthorityState}
            flag={5}
            oddName={detailInfo.Exhibition_Theme || ''}
            changeAnthorityState={this.changeAnthority}
          />
        }
        
      </Row>
    );
  }
}

export default ExhibitionDetails;
