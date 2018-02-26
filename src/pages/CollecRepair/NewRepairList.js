import React, { Component } from 'react';
import { Row, Col, Form, Input, DatePicker, Table, Button } from 'antd';
import './index.less';

const FormItem = Form.Item;
const { TextArea } = Input;
class NewRepairListApp extends Component {
    state = {  
        repairListData: [
            {
                key: 0,
                date: '2018-02-26',
                applicant: '李四',
                relicsNum: 'CP1546',
                relicsImg: require('../../assets/img/描金彩观音像.jpg'),
                relicsName: '描金彩观音像',
                number: 1,
                levelInfo: '普通藏品',
                material: '陶器',
                repairMethod: '补缺',
                repairResult: '看不见明显缺损'
            }
        ]
    }

    formSubmit (e) {
        e.preventDefault();
        this.props.form.validateFields((err, fieldsValue) => {
            if(!err) {
                const values = {
                    ...fieldsValue,
                    'date': fieldsValue['date'].format('YYYY-MM-DD')
                }
                console.log(values);
            }
        });
    }

    render() {
        const { repairListData } = this.state;
        const { getFieldDecorator } = this.props.form;
        const repairListColumns = [
            {
                title: '申请时间',
                dataIndex: 'date',
                key: 'date'
            },
            {
                title: '申请人',
                dataIndex: 'applicant',
                key: 'applicant'
            },
            {
                title: '文物编号',
                dataIndex: 'relicsNum',
                key: 'relicsNum'
            },
            {
                title: '文物图片',
                dataIndex: 'relicsImg',
                key: 'relicsImg',
                render: (text, index) => {
                    return (
                        <img 
                        style={{width: '55px', height: '55px'}}
                        src={text}
                        alt={index} />
                    )
                }
            },
            {
                title: '文物名称',
                dataIndex: 'relicsName',
                key: 'relicsName'
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
                title: '修复方法',
                dataIndex: 'repairMethod',
                key: 'repairMethod'
            },
            {
                title: '预期修复结果',
                dataIndex: 'repairResult',
                key: 'repairResult'
            }
        ]

        return <Row className="main-content">
            <Col span={24} className="title">
              新建修复单
            </Col>
            <Col span={24} className="new-repair-container">
              <Form onSubmit={this.formSubmit.bind(this)} layout="inline">
                <Col span={24} style={{width: '730px'}} >
                    <FormItem label="申请时间:" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} style={{ width: "50%" }}>
                        {getFieldDecorator("date", {
                            rules: [
                            { required: true, message: "请选择申请时间" }
                            ]
                        })(<DatePicker placeholder='请选择时间' />)}
                    </FormItem>
                    <FormItem label="申请人:" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} style={{ width: "50%" }}>
                        {getFieldDecorator("head", {
                            rules: [{ required: true, message: "请输入申请人" }]
                        })(<Input placeholder="请输入申请人" />)}
                    </FormItem>
                    <FormItem label="修复方案:" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} style={{ width: "100%" }}>
                        {getFieldDecorator("repairPlan", {
                            rules: [
                            { required: true, message: "请输入修复方案" }
                            ]
                        })(<TextArea />)}
                    </FormItem>
                    <FormItem label="预期修复结果:" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} style={{ width: "100%" }}>
                        {getFieldDecorator("repairResult", {
                            rules: [
                            { required: true, message: "请输入预期修复结果" }
                            ]
                        })(<TextArea />)}
                    </FormItem>
                </Col>
                <Col span={24} >
                    <Table columns={repairListColumns} dataSource={repairListData} bordered pagination={false} />
                </Col>
                <Col span={24} style={{padding: '20px 0'}} >
                    <Button type='primary' htmlType='submit' style={{float: 'right'}} >提交修复单</Button>
                </Col>
              </Form>
            </Col>
          </Row>;
    }
}
const NewRepairList = Form.create()(NewRepairListApp);
export default NewRepairList;