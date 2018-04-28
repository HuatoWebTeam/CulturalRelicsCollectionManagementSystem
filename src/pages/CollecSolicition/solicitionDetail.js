import React, { Component } from 'react';

import { Row, Col } from 'antd';
import './index.less';
import { levelInfo, relicsCategory, approveState } from "../../assets/js/commonFun";
import ApproveComponent from "../Components/ApproveComponent";

class SolicitionDetail extends Component {
  state = {
    solicition: null,
    anthorityState: null
  };

  componentWillMount() {
    let solicitionDetail = JSON.parse(sessionStorage.getItem("solicitionText"));
    let state = sessionStorage.getItem("anthoityState");
    this.setState({
      solicition: solicitionDetail,
      anthorityState: Number(state)
    });
  }
  // 改变审批条件状态
  changeAnthority = () => {
    sessionStorage.setItem("anthoityState", 0);
    this.setState({ anthorityState: 0 });
  };

  render() {
    const { solicition, anthorityState } = this.state;
    return <Row className="main-content">
        <Col className="title">
          藏品征集详情
          <div className="go-back" onClick={() => {
              this.props.history.goBack();
            }} />
        </Col>
        <Col span={24} className="solicition-detail" style={{ padding: "20px 40px 20px 20px" }}>
          <Col span={24} className="detail-box" style={{ height: "80px" }}>
            文物图片： <img src={solicition.Collection_img1} style={{ width: "80px", height: "80px" }} alt="img" />
          </Col>
          <Col span={7} className="detail-box">
            文物名称： {solicition.Collection_Name}
          </Col>
          <Col span={17} className="detail-box">
            征集人： {solicition.Solicitation_Name}
          </Col>
          <Col span={7} className="detail-box">
            文物编号： {solicition.Collection_Number}
          </Col>
          <Col span={17} className="detail-box">
            征集时间： {solicition.Solicitation_Time}
          </Col>
          <Col span={7} className="detail-box">
            文物数量： {solicition.Number}
          </Col>
          <Col span={17} className="detail-box">
            身份证号： {solicition.IdentityCard}
          </Col>
          <Col span={7} className="detail-box">
            分级信息： {levelInfo.map((item, key) => Number(solicition.Grade) === item.key && <span
                    key={item.key}
                  >
                    {item.value}
                  </span>)}
          </Col>
          <Col span={17} className="detail-box">
            奖金数额： {solicition.AmountPrize}
          </Col>
          <Col span={7} className="detail-box">
            文物类别： {solicition.MaterialQuality}
          </Col>
          <Col span={17} className="detail-box">
            联系方式： {solicition.Phone}
          </Col>
          <Col span={7} className="detail-box">
            文物材质： {solicition.MaterialQuality}
          </Col>
          <Col span={17} className="detail-box">
            联系地址： {solicition.Site}
          </Col>
          <Col span={7} className="detail-box">
            文物重量: {solicition.Weight}
          </Col>
          <Col span={17} className="detail-box">
            出土信息： {solicition.BeUnearthed}
          </Col>
          <Col span={7} className="detail-box">
            文物尺寸： {solicition.Size}
          </Col>
          <Col span={17} className="detail-box">
            鉴定结果： {solicition.Identification}
          </Col>
        </Col>
        <ApproveComponent anthorityState={anthorityState} paramsId={solicition.Collection_Number} flag={1} changeAnthorityState={this.changeAnthority} />
      </Row>;
  }
}

export default SolicitionDetail;