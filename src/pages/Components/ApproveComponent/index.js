import React, { Component } from 'react';
import { Row, Col, Steps, Radio, Input, Button, message } from 'antd';
import { GetApprovalDetails, ApprovalPassed, ApprovalDenied } from "./api";
const Step = Steps.Step;
const RadioGroup = Radio.Group;
const { TextArea }  = Input;

class ApproveComponent extends Component {
  state = {
    radioValue: 0,
    approveText: "",
    approveSteps: [], // 步骤条
    currentState: null, // 当前步骤
    approveRemark: []  // 审批备注
  };

  componentWillMount() {
    console.log(this.props);
    this.getApproveState();
  }

  getApproveState() {
    const params = {
      parameters: {
        Condition: this.props.paramsId
      }
    };
    GetApprovalDetails(params).then(res => {
      console.log(res);
      if (res.Data) {
        let data = res.Data;
        let appData = [];
        for (let item of data.ListWfProcessStep) {
          appData.push({
            key: item.ProcessStepSequence,
            value: item.ApprovalPerson
          });
        }
        this.setState({
          approveSteps: appData,
          currentState: Number(data.Step),
          approveRemark: data.ListWfAddRemark.reverse()
        });
      }
    });
  }

  radioChange = e => {
    console.log(e.target);
    this.setState({
      radioValue: e.target.value
    });
  };

  areaTextChange = e => {
    // console.log(e.target.value);
    this.setState({
      approveText: e.target.value
    });
  };
  // 提交审批
  approveSubmit = () => {
    const { radioValue, approveText } = this.state;
    console.log(radioValue, approveText, this.props.flag);
    let params = {
      orderNumber: this.props.paramsId,
      flag: this.props.flag,
      remarks: approveText
    }
    // let _this = this;
    if(radioValue === 0) {
      // 0是同意  1是拒绝
      ApprovalPassed(params).then(res => {
        console.log(res)
        if (res === true) {
          message.success('操作成功！')
          console.log(this.props)
          this.props.changeAnthorityState();
        } else {
          message.error("操作失败");
        }
      })
    } else {
      ApprovalDenied(params).then(res => {
        console.log(res)
        if (res === true) {
          message.success('操作成功！')
          console.log(this.props)
          this.props.changeAnthorityState();
        } else {
          message.error("操作失败");
        }
      })
    }
  }

  render() {
    const { radioValue, approveText, approveSteps, currentState, approveRemark } = this.state;
    return <Row>
        <Col span={24} className="approve-container">
          <Col span={24} className="approve-detail">
            <Col span={24} className="approve-title">
              审批详情
            </Col>
            <Col span={24} className="approve-content">
              <Col span={24} style={{ paddingBottom: "20px" }}>
                流程信息
              </Col>
              <Steps size="small" current={currentState + 1}>
                {approveSteps.map(item => (
                  <Step title={item.value} key={item.key} />
                ))}
              </Steps>
              <Col span={24} style={{ paddingTop: "40px" }}>
                <Col span={24} style={{ paddingBottom: "20px" }}>
                  审批信息
                </Col>
                <Col span={24}>
                  {approveRemark.map(item => <Col span={24} key={item.Id}>
                      <Col span={15}>
                        {item.UserCode + "  " + item.Description}
                      </Col>
                      <Col style={{color: '#666'}} span={9}>{item.AddTime}</Col>
                    </Col>)}
                </Col>
              </Col>
            </Col>
          </Col>
          <Col span={24} className="approve-detail" style={{ marginTop: "20px" }}>
            <Col span={24} className="approve-title">
              审批操作
            </Col>
            <Col span={24} className="approve-content">
              <Col span={24}>
                <RadioGroup onChange={this.radioChange} value={radioValue}>
                  <Radio value={0}>同意</Radio>
                  <Radio value={1}>拒绝</Radio>
                  {/* <Radio value={2}>退回</Radio> */}
                </RadioGroup>
                <Col span={24} style={{ padding: "20px 0 20px 0" }}>
                  <TextArea onChange={this.areaTextChange} value={approveText} style={{ width: "620px", minHeight: "100px" }} />
                </Col>
                <Col>
                  <Button type="primary" onClick={this.approveSubmit}>
                    提交
                  </Button>
                </Col>
              </Col>
            </Col>
          </Col>
        </Col>
      </Row>;
  }
}

export default ApproveComponent;