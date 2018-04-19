import React, { Component } from 'react';
import { Row, Col, Form, Input, DatePicker, Table, Button, message } from 'antd';
import './index.less';
import moment from 'moment';
import RelicsDialog from '../Components/RelicsDialog';
import { RepairAddApi } from './api';
import { levelInfo } from "../../assets/js/commonFun";


const FormItem = Form.Item;
const { TextArea } = Input;
class NewRepairListApp extends Component {
    state = {  
        repairListData: [ ],
        chooseRelicsNum: []
    }

    formSubmit (e) {
        e.preventDefault();
        this.props.form.validateFields((err, fieldsValue) => {
            if(!err) {
                const values = {
                    ...fieldsValue,
                    'date': fieldsValue['date'].format('YYYY-MM-DD HH:mm:ss')
                }
                console.log(values);
                console.log(this.state.chooseRelicsNum);
                const { chooseRelicsNum } = this.state;
                let params = {
                  Repair_Time: values.date,
                  Repair_Applicant: values.head,
                  Repair_Method: values.repairPlan,
                  Collection_Number: chooseRelicsNum.join(','),
                  Repair_Result: values.repairResult,
                  Repair_cycle: values.repairCalce,
                  Repair_Restorer: values.repairPeople
                }
                RepairAddApi(params).then(res => {
                  console.log(res);
                  if(res === true) {
                    message.success('新建修复单成功');
                    this.props.form.resetFields();
                    this.setState({
                      repairListData: []
                    })
                  } else {
                    message.error('新建修复单失败');
                  }
                })
            }
        });
    }

    chooseData = (item) => {
      console.log(item);
      let data= [];
      let chooseRelicsNum = []
      for(let value of item) {
        chooseRelicsNum.push(value.key);
        data.push({
          key: value.key,
          relicsNum: value.key,
          relicsImg: value.relicsImg,
          relicsName: value.relicsName,
          number: value.number,
          levelInfo: value.levelInfo,
          material: value.material
        })
      }
      this.setState({
        repairListData: data,
        chooseRelicsNum: chooseRelicsNum
      })
    }

    render() {
        const { repairListData } = this.state;
        const { getFieldDecorator } = this.props.form;
        const repairListColumns = [
            // {
            //     title: '申请时间',
            //     dataIndex: 'date',
            //     key: 'date'
            // },
            // {
            //     title: '申请人',
            //     dataIndex: 'applicant',
            //     key: 'applicant'
            // },
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
                key: 'levelInfo',
                render: (text) => {
                    for(let item of levelInfo) {
                        if(Number(text) === item.key) {
                            return (<span>{item.value}</span>)
                        }
                    }
                }
            },
            {
                title: '材质',
                dataIndex: 'material',
                key: 'material'
            },
            // {
            //     title: '修复方案',
            //     dataIndex: 'repairMethod',
            //     key: 'repairMethod'
            // },
            // {
            //     title: '预期修复结果',
            //     dataIndex: 'repairResult',
            //     key: 'repairResult'
            // }
        ]

        return <Row className="main-content">
            <Col span={24} className="title">
              新建修复单 <div className="go-back" onClick={() => {
                  this.props.history.goBack();
                }} />
            </Col>
            <Col span={24} className="new-repair-container">
              <Form onSubmit={this.formSubmit.bind(this)} layout="inline">
                <Col span={24} style={{ width: "730px" }}>
                  <FormItem label="申请时间:" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} style={{ width: "50%" }}>
                    {getFieldDecorator("date", {
                      initialValue: moment(),
                      rules: [
                        { required: true, message: "请选择申请时间" }
                      ]
                    })(<DatePicker format="YYYY-MM-DD" placeholder="请选择时间" />)}
                  </FormItem>
                  <FormItem label="申请人:" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} style={{ width: "50%" }}>
                    {getFieldDecorator("head", {
                      rules: [
                        { required: true, message: "请输入申请人" }
                      ]
                    })(<Input placeholder="请输入申请人" />)}
                  </FormItem>
                  <FormItem label="修复方案:" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} style={{ width: "50%" }}>
                    {getFieldDecorator("repairPlan", {
                      rules: [
                        { required: true, message: "请输入修复方案" }
                      ]
                    })(<Input placeholder="请输入修复方案" />)}
                  </FormItem>
                  <FormItem label="修复周期:" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} style={{ width: "50%" }}>
                    {getFieldDecorator("repairCalce", {
                      rules: [
                        { required: true, message: "请输入修复周期" }
                      ]
                    })(<Input placeholder="请输入修复周期" />)}
                  </FormItem>
                  <FormItem label="修复人:" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} style={{ width: "50%" }}>
                    {getFieldDecorator("repairPeople", {
                      rules: [
                        { required: true, message: "请输入修复人" }
                      ]
                    })(<Input placeholder="请输入修复人" />)}
                  </FormItem>
                  <FormItem label="预期修复结果:" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} style={{ width: "100%" }}>
                    {getFieldDecorator("repairResult", {
                      rules: [
                        {
                          required: true,
                          message: "请输入预期修复结果"
                        }
                      ]
                    })(<TextArea />)}
                  </FormItem>
                </Col>
                <Col span={24} style={{ marginBottom: "20px", marginLeft: "121px" }}>
                  <Button type="primary" onClick={() => {
                      this.refs.relicsDialog.openModal();
                    }}>
                    选择修复文物
                  </Button>
                </Col>
                <Col span={24}>
                  <Table columns={repairListColumns} dataSource={repairListData} bordered pagination={false} />
                </Col>
                <Col span={24} style={{ padding: "20px 0" }}>
                  <Button type="primary" htmlType="submit" style={{ float: "right" }}>
                    提交修复单
                  </Button>
                </Col>
              </Form>
              <RelicsDialog stat={0} chooseData={this.chooseData} title="选择修复文物" ref="relicsDialog" />
            </Col>
          </Row>;
    }
}
const NewRepairList = Form.create()(NewRepairListApp);
export default NewRepairList;