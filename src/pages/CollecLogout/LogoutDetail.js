import React, { Component } from "react";

import { Row, Col } from "antd";
import { connect } from "react-redux";
import { subStr, howComplete } from "../../assets/js/commonFun";
import ApproveComponent from "../Components/ApproveComponent";

class LogoutDetail extends Component {
  state = {
    detailInfo: null
  };
  componentWillMount() {
    let item = JSON.parse(sessionStorage.getItem("logoutText"));
    //DeniedPermission
    this.setState({
      detailInfo: item,
      anthorityState: Number(item.DeniedPermission)
    });
  }
    // 改变审批条件状态
    changeAnthority = () => {
        sessionStorage.setItem("anthoityState", 0);
        this.setState({ anthorityState: 0 });
    };

  render() {
      const { detailInfo, anthorityState } = this.state;
    return (
      <Row className="main-content">
        <Col className="title" span={24}>
          注销单详情
          <div
            className="go-back"
            onClick={() => {
              this.props.history.goBack();
            }}
          />
        </Col>
        <Col span={24} style={{ padding: "20px 40px 20px 20px" }}>
          {detailInfo && (
            <Col span={24} className="table-container">
              <Col className="table-title table-height" span={3}>
                文物名称
              </Col>
              <Col className="table-content table-height" span={5}>
                {detailInfo.Collection_Name}
              </Col>
              <Col className="table-title table-height" span={3}>
                入馆时间
              </Col>
              <Col className="table-content table-height" span={5}>
                {subStr(detailInfo.Collection_Time)}
              </Col>
              <Col className="table-title table-height" span={3}>
                储存位置
              </Col>
              <Col className="table-content table-height" span={5}>
                {detailInfo.Storehouse_Name + '/' + detailInfo.Storage_Name}
              </Col>
              <Col className="table-title table-height" span={3}>
                文物图片
              </Col>
              <Col className="table-content table-height" span={5}>
                <img
                  style={{ width: "50px", height: "50px" }}
                  src={detailInfo.Collection_img1}
                />
              </Col>
              <Col className="table-title table-height" span={3}>
                文物材质
              </Col>
              <Col className="table-content table-height" span={5}>
                {detailInfo.MaterialQuality}
              </Col>
              <Col className="table-title table-height" span={3}>
                文物尺寸
              </Col>
              <Col className="table-content table-height" span={5}>
                {detailInfo.Size}
              </Col>
              <Col className="table-title table-height" span={3}>
                文物编号
              </Col>
              <Col className="table-content table-height" span={5}>
                {detailInfo.Collection_Number}
              </Col>
              <Col className="table-title table-height" span={3}>
                文物年代
              </Col>
              <Col className="table-content table-height" span={5}>
                {detailInfo.Years_Name}
              </Col>
              <Col className="table-title table-height" span={3}>
                文物重量
              </Col>
              <Col className="table-content table-height" span={5}>
                {detailInfo.Weight}
              </Col>
              <Col className="table-title table-height" span={3}>
                文物等级
              </Col>
              <Col className="table-content table-height" span={5}>
                {detailInfo.Grade_Nmae}
              </Col>
              <Col className="table-title table-height" span={3}>
                完整程度
              </Col>
              <Col className="table-content table-height" span={5}>
                {
                    howComplete.map((item) => {
                        if(item.key === Number(detailInfo.Integrity)) {
                            return item.value;
                        }
                    })
                }
              </Col>
              <Col className="table-title table-height" span={3}>
                文物状态
              </Col>
              <Col className="table-content table-height" span={5}>
                {detailInfo.CollState_Name}
              </Col>
              <Col className="table-title table-height" span={3}>
                申请人
              </Col>
              <Col className="table-content table-height" span={5}>
                {detailInfo.Applicant}
              </Col>
              <Col className="table-title table-height" span={3}>
                申请时间
              </Col>
              <Col className="table-content table-height" span={5}>
                {subStr(detailInfo.Application_Time)}
              </Col>
              <Col className="table-title table-height" span={3}>
                注销原因
              </Col>
              <Col className="table-content table-height" span={5}>
                {detailInfo.Cancellation_Reason}
              </Col>
            </Col>
          )}
        </Col>
        <ApproveComponent 
            oddName={''} 
            anthorityState={anthorityState} 
            paramsId={detailInfo.Cancellation_Odd} 
            flag={7} 
            changeAnthorityState={this.changeAnthority} 
        />
      </Row>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
    pageIndex: state.main.inventoryPage
  };
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    changePageIndex: args => dispatch({ type: "INVENTORYPAGE", payload: args }),
    changeFormData: args => dispatch({ type: "COLLECINFO", payload: args })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LogoutDetail);
