import React, { Component } from 'react';
import { Row, Col, Steps, Radio, Input, Button } from 'antd';
const Step = Steps.Step;
const RadioGroup = Radio.Group;
const { TextArea }  = Input;

class ApproveComponent extends Component {
  state = {
    radioValue: 0,
    approveText: ""
  };

  radioChange = e => {
    console.log(e.target);
    this.setState({
      radioValue: e.target.value
    });
  };
  
  areaTextChange = e => {
    console.log(e.target.value);
    this.setState({
      approveText: e.target.value
    });
  };

  render() {
    const { radioValue, approveText } = this.state;
    return (
      <Row>
        <Col span={24} className="approve-container">
          <Col span={24} className="approve-detail">
            <Col span={24} className="approve-title">
              审批详情
            </Col>
            <Col span={24} className="approve-content">
              <Col span={24} style={{ paddingBottom: "20px" }}>
                流程信息
              </Col>
              <Steps size="small" current={1}>
                <Step title="Finished" />
                <Step title="In Progress" />
                <Step title="Waiting" />
              </Steps>
              <Col span={24} style={{ paddingTop: "40px" }}>
                <Col span={24} style={{ paddingBottom: "20px" }}>
                  审批信息
                </Col>
                <Col span={24}>文员张某 同意 展览单申请</Col>
              </Col>
            </Col>
          </Col>
          <Col
            span={24}
            className="approve-detail"
            style={{ marginTop: "20px" }}
          >
            <Col span={24} className="approve-title">
              审批操作
            </Col>
            <Col span={24} className="approve-content">
              <Col span={24}>
                <RadioGroup onChange={this.radioChange} value={radioValue}>
                  <Radio value={0}>同意</Radio>
                  <Radio value={1}>拒绝</Radio>
                  <Radio value={2}>退回</Radio>
                </RadioGroup>
                <Col span={24} style={{ padding: "20px 0 20px 0" }}>
                  <TextArea
                    onChange={this.areaTextChange}
                    value={approveText}
                    style={{ width: "620px", minHeight: "100px" }}
                  />
                </Col>
                <Col>
                  <Button type="primary">提交</Button>
                </Col>
              </Col>
            </Col>
          </Col>
        </Col>
      </Row>
    );
  }
}

export default ApproveComponent;