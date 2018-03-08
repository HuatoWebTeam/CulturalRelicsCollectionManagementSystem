import React, { Component } from 'react';

import { Row, Col, Form, Input, Select, DatePicker, Button, Table, Modal, message } from 'antd';
import './index.less';
import { ExDataAddApp, } from "./api";
import RelicsDialog from '../Components/RelicsDialog';
import moment from 'moment';
import { RangePickerDefault } from '../../assets/js/commonFun';
const FormItem = Form.Item;
const Search = Input.Search;
const Option = Select.Option;
const { RangePicker } = DatePicker;

class AddExhibitionForm extends Component {
  state = {
    typeMenu: [
      {
        key: 0,
        value: "内展"
      },
      {
        key: 1,
        value: "外展"
      }
    ],
    addExhibitionData: [ ],
    chooseRelicsNum: []
  };

  componentWillMount(){
    // console.log(RangePickerDefault);
  }

  // 提交表单
  handleSubmit(e) {
    e.preventDefault();
    const { chooseRelicsNum } = this.state;
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        // console.log(fieldsValue);
        const rangeValue = fieldsValue["date"];
        const values = {
          ...fieldsValue,
          date: [
            rangeValue[0].format("YYYY-MM-DD"),
            rangeValue[1].format("YYYY-MM-DD")
          ],
          exhibitionType: typeof fieldsValue['exhibitionType'] === 'number' ? fieldsValue['exhibitionType'] : fieldsValue['exhibitionType'][0]
        };
        console.log(values);
        console.log(chooseRelicsNum);
        if(chooseRelicsNum.length === 0) {
          message.error('请选择展览文物')
        };
        let thisRelicsNum = chooseRelicsNum.join(',')
        let params = {
          Exhibition_Odd: values['exhibitionNum'],
          Exhibition_Theme: values['exhibitionTheme'],
          Exhibition_Type: values['exhibitionType'],
          StartTine: values['date'][0],
          EndTime: values['date'][1],
          Person_liable: values['head'],
          Collection_Number: thisRelicsNum
        };
        console.log(params);
        ExDataAddApp(params).then(res => {
          console.log(res);
          if(res === true) {
            message.success('添加展览清单成功')
          } else {
            message.error('添加展览清单失败')
          }
        })
      }
    });
  }

  chooseData = (item) => {
    // console.log(item);
    let keys = [];
    for(let value of item ){
      keys.push(value.key);
    }
    this.setState({
      addExhibitionData: item,
      chooseRelicsNum: keys
    });
  }

  // 选择时间
  // changeDate (dates, dateString) {
  //   console.log(dates);
  //   console.log(dateString);
  // }
  render() {
    // console.log(this.props);
    const {
      typeMenu,
      addExhibitionData
      
    } = this.state;
    const { getFieldDecorator } = this.props.form;
    const chooseRelicsData = [
      // {
      //   title: "展览主题",
      //   dataIndex: "theme",
      //   key: "theme"
      // },
      // {
      //   title: "起止时间",
      //   dataIndex: "date",
      //   key: "date"
      // },
      // {
      //   title: "展览类型",
      //   dataIndex: "type",
      //   key: "type"
      // },
      {
        title: "文物编号",
        dataIndex: "rfid",
        key: "serialNum"
      },
      {
        title: "文物图片",
        dataIndex: "relicsImg",
        key: "relicsImg",
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
        dataIndex: "relicsName",
        key: "relicsName"
      },
      {
        title: "数量",
        dataIndex: "number",
        key: "number"
      },
      {
        title: "分级信息",
        dataIndex: "levelInfo",
        key: "lavelInfo"
      },
      {
        title: "材质",
        dataIndex: "material",
        key: "material"
      },
      {
        title: "年代",
        dataIndex: "years",
        key: "years"
      },
      {
        title: "完整程度",
        dataIndex: "howComplete",
        key: "howComplete"
      },
      // {
      //   title: "负责人",
      //   dataIndex: "head",
      //   key: "head"
      // }
    ];
    
    return <Row className="exhibition-container main-content">
        <Col className="title" span={24}>
          添加展览清单
        </Col>
        <Col span={24} className="exhibition-content" style={{ marginTop: "20px" }}>
          <Col className="exhibition-form-content">
            <Form onSubmit={this.handleSubmit.bind(this)} layout="inline" className="addexhibition-form">
              <Col span={24} style={{ width: "800px" }}>
                <FormItem label="展览主题:" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                  {getFieldDecorator("exhibitionTheme", {
                    rules: [{ required: true, message: "请输入展览主题" }]
                  })(<Input placeholder="请输入展览主题" />)}
                </FormItem>
                <FormItem label="展览单号:" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                  {getFieldDecorator("exhibitionNum", {
                    rules: [{ required: true, message: "请输入展览单号" }]
                  })(<Input placeholder="请输入展览单号" />)}
                </FormItem>
                <FormItem label="展览类型:" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                  {getFieldDecorator("exhibitionType", {
                    initialValue: [typeMenu[0].key],
                    rules: [{ required: true, message: "请输入展览主题" }]
                  })(<Select>
                      {typeMenu.map((item, idx) => (
                        <Option key={item.key} value={item.key}>
                          {item.value}
                        </Option>
                      ))}
                    </Select>)}
                </FormItem>
                <FormItem label="起止时间:" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                  {getFieldDecorator("date", {
                    initialValue: RangePickerDefault,
                    rules: [
                      {
                        type: "array",
                        required: true,
                        message: "请选择起止时间"
                      }
                    ]
                  })(<RangePicker format="YYYY-MM-DD" />)}
                </FormItem>
                <FormItem label="负责人:" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                  {getFieldDecorator("head", {
                    rules: [{ required: true, message: "请输入负责人" }]
                  })(<Input placeholder="请输入负责人" />)}
                </FormItem>
              </Col>
              <Col span={24} style={{ padding: "20px 0 20px 95px" }}>
                <Button type="primary" onClick={() => {
                    this.refs.relicsDialog.openModal();
                    console.log(this.refs.relicsDialog);
                  }}>
                  选择展览文物
                </Button>
              </Col>
              <Col span={24}>
                <Table pagination={false} bordered columns={chooseRelicsData} dataSource={addExhibitionData} />
              </Col>
              <Col span={24} style={{ padding: "30px 50px" }}>
                <FormItem style={{ float: "right" }} className="right-form-item">
                  <Button htmlType="submit" type="primary">
                    提交展览清单
                  </Button>
                </FormItem>
              </Col>
            </Form>
          </Col>
          <RelicsDialog chooseData={this.chooseData} title="选择展览文物" ref="relicsDialog" />
          {/* <Table bordered columns={relicDetails} dataSource={this.dataSoure} /> */}
        </Col>
      </Row>;
  }
}
const AddExhibition = Form.create()(AddExhibitionForm);
export default AddExhibition;