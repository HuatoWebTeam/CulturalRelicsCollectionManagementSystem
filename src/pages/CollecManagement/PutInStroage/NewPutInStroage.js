import React, { Component } from "react";
import {
  Row,
  Col,
  Form,
  Button,
  Input,
  Table,
  Select,
  DatePicker,
  message
} from "antd";
import "../Outbound/index.less";
import moment from "moment";
import RelicsDialog from "../../Components/RelicsDialog";
import { levelInfo, relicsYears, putinType } from "../../../assets/js/commonFun";
import { InsertInTheLibrary } from "./api";
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

class NewPutinStroageApp extends Component {
  state = {
    newOutboundData: [],
    format: "YYYY-MM-DD",
    date: []
  };
  // .hour(0).minute(0).second(0)
  componentWillMount() {
    let date = [moment(), moment().add(6, "days")];
    this.setState({
      date: date
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, value) => {
      if (!err) {
        console.log(value);
        const { newOutboundData, format } = this.state;
        if (newOutboundData.length > 0) {
          let values = {
            ...value,
            outboundDate: [value["outboundDate"][0].format('YYYY-MM-DD'), value["outboundDate"][1].format('YYYY-MM-DD')],
            outboundType:
              typeof value["outboundType"] === "number"
                ? value["outboundType"]
                : value["outboundType"][0]
          };
          let relicsInfo = [];
          for (let item of newOutboundData) {
            relicsInfo.push({
              CollectionNumber: item.Collection_Number,
              Number: item.Number
            });
          }
          console.log(values);
          let UserName = JSON.parse(sessionStorage.getItem("UserInfo"))
            .UserName;
          let params = {
            outTheLibrary: {
              OutPurpose: values.outboundPurposes,
              OutType: values.outboundType,
              OutDateTime: moment().format('YYYY-MM-DD'),
              OutUserName: UserName,
              OutDateTimeSta: values.outboundDate[0],
              OutDateTimeEnd: values.outboundDate[1],
              ListCollection: relicsInfo
            }
          };
          console.log(params);
          InsertInTheLibrary(params).then(res => {
            console.log(res);
            if (res.Msg === "操作成功!") {
              message.success("新建入库单成功");
              this.props.form.resetFields();
              this.props.history.goBack();
              this.setState({ newOutboundData: [] });
            } else {
              message.error("新建入库单失败");
            }
          });
        } else {
          message.error("请选择入库文物");
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

  // 选择时间
  handleRangePicker = date => {
    this.setState({
      date:date
    })
  };

  render() {
    const { newOutboundData, date } = this.state;
    const { getFieldDecorator } = this.props.form;
    
    const newOutboundColumns = [
      {
        title: "文物编号",
        dataIndex: "Collection_Number"
      },
      {
        title: "文物图片",
        dataIndex: "Collection_img",
        render: (text, record, index) => {
          // console.log(text,record, index)
          return (
            <img
              style={{ width: "55px", height: "55px" }}
              src={text}
              alt={index}
            />
          );
        }
      },
      {
        title: "文物名称",
        dataIndex: "Collection_Name"
      },
      {
        title: "数量",
        dataIndex: "Number"
      },
      {
        title: "分级信息",
        dataIndex: "Grade",
        render: text => {
          for (let item of levelInfo) {
            if (Number(text) === item.key) {
              return <span>{item.value}</span>;
            }
          }
        }
      },
      {
        title: "材质",
        dataIndex: "MaterialQuality"
      },
      {
        title: "年代",
        dataIndex: "Collection_Years"
      },
      {
        title: "完整程度",
        dataIndex: "Integrity",
        render: text => {
          if (Number(text) === 0) {
            return <span>完整</span>;
          } else if (Number(text) === 1) {
            return <span>破损</span>;
          }
        }
      }
    ];

    return <Row className="main-content">
        <Col span={24} className="title">
          新建入库单
          <div className="go-back" onClick={() => {
              this.props.history.goBack();
            }} />
        </Col>
        <Col span={24} className="newOutbound-container">
          <Form layout="inline" onSubmit={this.handleSubmit}>
            <Col span={24} className="form-top">
              <FormItem label="入库说明:" labelCol={{ span: 7 }} className="form-item50">
                {getFieldDecorator("outboundPurposes", {
                  initialValue: null,
                  rules: [{ required: true, message: "请输入入库说明" }]
                })(<Input placeholder="请输入入库说明" />)}
              </FormItem>
              <FormItem label="入库类型:" labelCol={{ span: 7 }} className="form-item50">
                {getFieldDecorator("outboundType", {
                  initialValue: [2],
                  rules: [{ required: true, message: "请选择入库类型" }]
                })(<Select>
                    {putinType.map(item => (
                      !item.isHidden && <Option key={item.key} value={item.key}>
                        {item.value}
                      </Option>
                    ))}
                  </Select>)}
              </FormItem>
              <FormItem label="入库起止日期:" labelCol={{ span: 7 }} className="form-item50">
                {getFieldDecorator("outboundDate", {
                  initialValue: date,
                  rules: [{ required: true, message: "请选择入库起止日期" }]
                })(<RangePicker format="YYYY-MM-DD" onChange={this.handleRangePicker} />)}
              </FormItem>
              {/* <FormItem
                label="操作人:"
                labelCol={{ span: 6 }}
                className="form-item50"
              >
                {getFieldDecorator("outboundPeople", {
                  initialValue: null,
                  rules: [{ required: true, message: "请输入操作人" }]
                })(<Input placeholder="请输入操作人" />)}
              </FormItem> */}
              <Col span={24}>
                <Button type="primary" onClick={() => {
                    this.refs.relicsDialog.openModal();
                  }} style={{ marginLeft: "90px", marginBottom: "20px" }}>
                  选择入库文物
                </Button>
              </Col>
            </Col>
            <Col span={24}>
              <Table columns={newOutboundColumns} dataSource={newOutboundData} pagination={false} bordered />
            </Col>
            <Col span={24}>
              <FormItem className="submitBtn">
                <Button type="primary" htmlType="submit">
                  提交入库单
                </Button>
              </FormItem>
            </Col>
          </Form>
        </Col>
        <Col span={24}>
          <RelicsDialog chooseData={this.chooseDataList} title="新建入库单" checkedItem={[]} ref="relicsDialog" stat={2} />
        </Col>
      </Row>;
  }
}
const NewPutinStroage = Form.create()(NewPutinStroageApp);
export default NewPutinStroage;
