import React, { Component } from 'react';
import { Row, Col, Form, Button, Input, Table, Select, DatePicker, message } from 'antd';
import './index.less';
import moment from 'moment';
import RelicsDialog from "../../Components/RelicsDialog";
import { levelInfo, relicsYears } from '../../../assets/js/commonFun';
import { InsertOutTheLibrary } from './api';
const FormItem = Form.Item;
const Option = Select.Option;

class NewOutboundApp extends Component {
  state = {
    newOutboundData: [],
    format: "YYYY-MM-DD"
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, value) => {
      if (!err) {
        console.log(value);
        const { newOutboundData, format } = this.state;
        if (newOutboundData.length > 0) {
          let values = {
            ...value,
            outboundDate: value["outboundDate"].format(format),
            outboundType:
              typeof value["outboundType"] === "number"
                ? value["outboundType"]
                : value["outboundType"][0]
          };
          let relicsInfo = [];
          for (let item of newOutboundData) {
            relicsInfo.push({
              CollectionNumber: item.relicsNum,
              Number: item.number
            });
          }
          console.log(values);
          let params = {
            outTheLibrary: {
              OutPurpose: values.outboundPurposes,
              OutType: values.outboundType,
              OutDateTime: values.outboundDate,
              OutUserName: values.outboundPeople,
              ListCollection: relicsInfo
            }
          };
          console.log(params);
          InsertOutTheLibrary(params).then(res => {
            console.log(res);
            if (res.Msg === "操作成功!") {
              message.success("新建出库单成功");
              this.props.form.resetFields();
              this.setState({
                newOutboundData: []
              });
            } else {
              message.error("新建出库单失败");
            }
          });
        } else {
          message.error("请选择出库文物");
        }
      }
    });
  };
  chooseDataList = value => {
    console.log(value);
    // for(let item of value) {

    // }
    this.setState({
      newOutboundData: value
    });
  };

  render() {
    const { newOutboundData } = this.state;
    const { getFieldDecorator } = this.props.form;
    const OutboundType = [
      {
        key: 4,
        value: '外借'
      },
      {
        key: 7,
        value: '退还'
      }
    ]
    const newOutboundColumns = [
      {
        title: "文物RFID",
        dataIndex: "relicsNum",
        key: "relicsNum"
      },
      {
        title: "储柜RFID",
        dataIndex: "rfid",
        key: "rfid"
      },
      {
        title: "文物图片",
        dataIndex: "relicsImg",
        key: "relicsImg",
        render: (text, idx) => {
          return (
            <img
              alt={idx}
              src={text}
              style={{ width: "55px", height: "55px" }}
            />
          );
        }
      },
      {
        title: "文物名称",
        dataIndex: "relicsName",
        key: "relicsName"
      },
      {
        title: "储存位置",
        dataIndex: "localtion",
        key: "localtion"
      },
      {
        title: "数量",
        dataIndex: "number",
        key: "number"
      },
      {
        title: "分级信息",
        dataIndex: "levelInfo",
        key: "levelInfo",
        render: (text) => {
            for(let item of levelInfo) {
                if(Number(text) === item.key) {
                    return (<span>{item.value}</span>)
                }
            }
        }
      },
      {
        title: "材质",
        dataIndex: "material",
        key: "material"
      },
      {
        title: "年代",
        dataIndex: "years",
        key: "years",
        render: (text) => {
            for(let item of relicsYears) {
                if(Number(text) === item.key) {
                    return (<span>{item.value}</span>)
                }
            }
        }
      },
      {
        title: "完整程度",
        dataIndex: "howComplete",
        key: "howComplete",
        render: (text) => {
            if(Number(text) === 0) {
                return (<span>完整</span>)
            } else if(Number(text) === 1) {
                return (<span>破损</span>)
            }
        }
      }
    ];

    return (
      <Row className="main-content">
        <Col span={24} className="title">
          新建出库单{" "}
          <div
            className="go-back"
            onClick={() => {
              this.props.history.goBack();
            }}
          />
        </Col>
        <Col span={24} className="newOutbound-container">
          <Form layout="inline" onSubmit={this.handleSubmit}>
            <Col span={24} className="form-top">
              <FormItem
                label="出库用途:"
                labelCol={{ span: 6 }}
                className="form-item50"
              >
                {getFieldDecorator("outboundPurposes", {
                  initialValue: null,
                  rules: [{ required: true, message: "请输入出库用途" }]
                })(
                  <Input  />
                )}
              </FormItem>
              <FormItem
                label="出库类型:"
                labelCol={{ span: 6 }}
                className="form-item50"
              >
                {getFieldDecorator("outboundType", {
                  initialValue: [4],
                  rules: [{ required: true, message: "请选择出库类型" }]
                })(
                  <Select>
                    {
                      OutboundType.map((item) => 
                        <Option key={item.key} value={item.key} >{item.value}</Option>
                      )
                    }
                  </Select>
                )}
              </FormItem>
              <FormItem
                label="出库时间:"
                labelCol={{ span: 6 }}
                className="form-item50"
              >
                {getFieldDecorator("outboundDate", {
                  initialValue: moment(),
                  rules: [{ required: true, message: "请选择出库时间" }]
                })(<DatePicker format="YYYY-MM-DD" />)}
              </FormItem>
              <FormItem
                label="操作人:"
                labelCol={{ span: 6 }}
                className="form-item50"
              >
                {getFieldDecorator("outboundPeople", {
                  initialValue: null,
                  rules: [{ required: true, message: "请输入操作人" }]
                })(<Input placeholder="请输入操作人" />)}
              </FormItem>
              <Button
                type="primary"
                onClick={() => {
                  this.refs.relicsDialog.openModal();
                }}
                style={{ marginLeft: "90px", marginBottom: "20px" }}
              >
                选择出库文物
              </Button>
            </Col>
            <Col span={24}>
              <Table
                columns={newOutboundColumns}
                dataSource={newOutboundData}
                pagination={false}
                bordered
              />
            </Col>
            <Col span={24}>
              <FormItem className="submitBtn">
                <Button type="primary" htmlType="submit">
                  提交出库单
                </Button>
              </FormItem>
            </Col>
          </Form>
        </Col>
        <Col span={24}>
          <RelicsDialog
            chooseData={this.chooseDataList}
            title="新建出库单"
            ref="relicsDialog"
            stat={0}
          />
        </Col>
      </Row>
    );
  }
}
const NewOutbound = Form.create()(NewOutboundApp);
export default NewOutbound;