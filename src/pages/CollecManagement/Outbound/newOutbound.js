import React, { Component } from 'react';
import { Row, Col, Form, Button, Input, Table, Select, DatePicker } from 'antd';
import './index.less';
const FormItem = Form.Item;
const Option = Select.Option;

class NewOutboundApp extends Component {
    state = {  
        newOutboundData: [
            {
                key: 0,
                relicsNum: 'CHO46843',
                rfid: 'DH146543',
                relicsImg: require('../../../assets/img/描金彩观音像.jpg'),
                relicsName: '描金彩观音像',
                localtion: '库房 1',
                number: 1,
                levelInfo: '普通藏品',
                material: '陶器',
                years: '唐',
                howComplete: '破损'
            }
        ]
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, value) => {
          if (!err) {
            console.log(value);
            // this.props.history.push("/App/Home");
          }
        });
    }

    render() {
        const { newOutboundData } = this.state;
        const { getFieldDecorator } = this.props.form;
        const newOutboundColumns = [
            {
                title: '文物RFID',
                dataIndex: 'relicsNum',
                key: 'relicsNum'
            },
            {
                title: '储柜RFID',
                dataIndex: 'rfid',
                key: 'rfid'
            },
            {
                title: '文物图片',
                dataIndex: 'relicsImg',
                key: 'relicsImg',
                render: (text, idx) => {
                    return (
                        <img alt={idx} src={text} style={{width: '55px', height: '55px'}} />
                    )
                }
            },
            {
                title: '文物名称',
                dataIndex: 'relicsName',
                key: 'relicsName'
            },
            {
                title: '储存位置',
                dataIndex: 'localtion',
                key: 'localtion'
            },
            {
                title: '数量',
                dataIndex: 'number',
                key: 'number'
            },
            {
                title: '分级信息',
                dataIndex: 'levelInfo',
                key: 'levelInfo'
            },
            {
                title: '材质',
                dataIndex: 'material',
                key: 'material'
            },
            {
                title: '年代',
                dataIndex: 'years',
                key: 'years'
            },
            {
                title: '完整程度',
                dataIndex: 'howComplete',
                key: 'howComplete'
            }
        ]

        return <Row className="main-content">
            <Col span={24} className="title">
              新建出库单
            </Col>
            <Col span={24} className="newOutbound-container">
              <Form layout="inline" onSubmit={this.handleSubmit}>
                <Col span={24} className="form-top">
                  <FormItem label="出库用途:" labelCol={{ span: 6 }} className="form-item50">
                    {getFieldDecorator("outboundPurposes", {
                      rules: [
                        { required: true, message: "请输入出库用途" }
                      ]
                    })(<Input />)}
                  </FormItem>
                  <FormItem label="出库类型:" labelCol={{ span: 6 }} className="form-item50">
                    {getFieldDecorator("outboundPurposes", {
                      rules: [
                        { required: true, message: "请选择出库类型" }
                      ]
                    })(<Select>
                        <Option value="0">陈列</Option>
                      </Select>)}
                  </FormItem>
                  <FormItem label="出库时间:" labelCol={{ span: 6 }} className="form-item50">
                    {getFieldDecorator("outboundPurposes", {
                      rules: [
                        { required: true, message: "请选择出库时间" }
                      ]
                    })(<DatePicker />)}
                  </FormItem>
                  <FormItem label="操作人:" labelCol={{ span: 6 }} className="form-item50">
                    {getFieldDecorator("outboundPurposes", {
                      rules: [
                        { required: true, message: "请输入操作人" }
                      ]
                    })(<Input />)}
                  </FormItem>
                  <Button type="primary" style={{ marginLeft: "90px", marginBottom: '20px' }}>
                    选择出库文物
                  </Button>
                </Col>
                <Col span={24}>
                  <Table columns={newOutboundColumns} dataSource={newOutboundData} pagination={false} bordered />
                </Col>
                <Col span={24}>
                  <FormItem  className='submitBtn' >
                    <Button type="primary" htmlType="submit"  >
                      提交出库单
                    </Button>
                  </FormItem>
                </Col>
              </Form>
            </Col>
          </Row>;
    }
}
const NewOutbound = Form.create()(NewOutboundApp);
export default NewOutbound;