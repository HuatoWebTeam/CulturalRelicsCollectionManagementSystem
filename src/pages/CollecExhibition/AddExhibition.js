import React, { Component } from 'react';

import { Row, Col, Form, Input, Select, DatePicker, Button, Table } from 'antd';
import './index.less';
const FormItem = Form.Item;
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
    addExhibitionData: [
      {
        theme: '馆内文物会展',
        date: '2018-02-23---2018-02-24',
        type: '内展',
        serialNum: 'CP0006',
        relicsImg: require('../../assets/img/描金彩观音像.jpg'),
        name: '描金彩观音像',
        number: 1,
        levelInfo: '普通藏品',
        material: '陶器',
        years: '唐',
        howComplete: '破损',
        head: '李四',
        key: 0
      }
    ]
  };


  // 提交表单
  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, value) => {
      if (!err) {
        console.log(value);
        // this.props.history.push("/App/Home");
      }
    });
  }

  // 选择时间
  changeDate (dates, dateString) {
    console.log(dates);
    console.log(dateString);
  }
  render() {
    console.log(this.props);
    const { typeMenu, addExhibitionData } = this.state;
    const { getFieldDecorator  } = this.props.form;
    const chooseRelicsData = [
        {
          title: '展览主题',
          dataIndex: 'theme',
          key: 'theme'
        },
        {
          title: '起止时间',
          dataIndex: 'date',
          key: 'date'
        },
        {
          title: '展览类型',
          dataIndex: 'type',
          key: 'type'
        },
        {
          title: "文物编号",
          dataIndex: "serialNum",
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
          dataIndex: "name",
          key: "name"
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
        {
          title: "负责人",
          dataIndex: "head",
          key: "head"
        }
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
                <FormItem label="展览类型:" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                  {getFieldDecorator("exhibitionType", {
                    initialValue: [typeMenu[0].value],
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
                    rules: [
                      {
                        type: "array",
                        required: true,
                        message: "请选择起止时间"
                      }
                    ]
                  })(<RangePicker onChange={this.changeDate} />)}
                </FormItem>
                <FormItem label="负责人:" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                  {getFieldDecorator("head", {
                    rules: [{ required: true, message: "请输入负责人" }]
                  })(<Input placeholder="请输入负责人" />)}
                </FormItem>
              </Col>
              <Col span={24} style={{ padding: "20px 0 20px 95px" }}>
                <Button type="primary">选择展览文物</Button>
              </Col>
              <Col span={24}>
                <Table pagination={false} bordered columns={chooseRelicsData} dataSource={addExhibitionData} />
              </Col>
              <Col span={24} style={{ padding: "30px 50px" }}>
                <FormItem style={{ float: "right" }} className='right-form-item' >
                  <Button htmlType="submit" type="primary">
                    提交展览清单
                  </Button>
                </FormItem>
              </Col>
            </Form>
          </Col>
          {/* <Table bordered columns={relicDetails} dataSource={this.dataSoure} /> */}
        </Col>
      </Row>;
  }
}
const AddExhibition = Form.create()(AddExhibitionForm);
export default AddExhibition;