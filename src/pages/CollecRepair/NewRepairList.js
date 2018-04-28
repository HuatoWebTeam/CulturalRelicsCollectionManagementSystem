import React, { Component } from 'react';
import { Row, Col, Form, Input, DatePicker, Table, Button, message } from 'antd';
import './index.less';
import moment from 'moment';
import { connect } from 'react-redux';
import RelicsDialog from '../Components/RelicsDialog';
import CheckedRelicsInfo from "../Components/CheckedRelicsInfo";
import { RepairAddApi, RepDatall, RepairUpdate } from "./api";
import { levelInfo } from "../../assets/js/commonFun";
const { RangePicker } = DatePicker;

const FormItem = Form.Item;
const { TextArea } = Input;
class NewRepairListApp extends Component {
  state = {
    repairListData: [],
    pageTitle: '新建修复单',
    chooseRelicsNum: [],
    inventDays: 1,
    repairInfo: {
      Repair_Applicant: null, // 申请人
      Repair_Method: null, // 修复方法
      Repair_Result: null, // 修复玉器结果
      Repair_Restorer: null, // 修复人
      Repair_cycle: 1,    // 修复周期
      ReturnTime: moment(),   // 归还时间
      repairRangeDate: [moment().hour(0).minute(0).second(0), moment().hour(23).minute(59).second(0)]
    },
    date: [
      moment().hour(0).minute(0).second(0),
      moment().hour(23).minute(59).second(0)
    ]
  };
  
  componentWillMount() {
    const { state, formData } = this.props.componentState;
    this.state.pageTitle = state ? state : '新建修复单';
    if ( state ) {
      let params = {
        pageIndex: 1,
        pageSize: 1000,
        Exhibition_Odd: formData
      };
      RepDatall(params).then(res => {
        console.log(res);
        let list = res[0].exhibit;
        for(let item of list) {
          item.key = item.Collection_Number;
        }
        let data = {
          Repair_Applicant: res[0].Repair_Applicant,
          Repair_Method: res[0].Repair_Method,
          Repair_Restorer: res[0].Repair_Restorer,
          Repair_Result: res[0].Repair_Result,
          Repair_cycle: res[0].Repair_cycle,
          ReturnTime: moment(res[0].ReturnTime),
          repairRangeDate: [moment(res[0].Repair_BegTime), moment(res[0].Repair_EndTime)]
        }
        this.setState({
          repairInfo: data,
          repairListData: list
        })
      })
    }
  }

  formSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        const values = {
          ...fieldsValue
        };
        console.log(values);
        console.log(this.state.chooseRelicsNum);
        const { state, formData } = this.props.componentState;
        const { chooseRelicsNum, repairInfo } = this.state;
        let params = {
          Repair_Id: formData,
          Repair_Time: moment().format(),
          Repair_Applicant: values.Repair_Applicant,
          Repair_Method: values.Repair_Method,
          Collection_Number: chooseRelicsNum.join(","),
          Repair_Result: values.Repair_Result,
          Repair_cycle: repairInfo.Repair_cycle,
          Repair_Restorer: values.Repair_Restorer,
          Repair_BegTime: values.repairRangeDate[0].format(),
          Repair_EndTime: values.repairRangeDate[1].format(),
          ReturnTime: values.ReturnTime.format()
        };
        if( state ) {
          RepairUpdate(params).then(res => {
            console.log(res);
            if (res === true) {
              message.success("编辑修复单成功");
              this.props.form.resetFields();
              this.props.history.goBack();
              this.setState({ repairListData: [] });
            } else {
              message.error("编辑修复单失败");
            }
          })
        } else {
          RepairAddApi(params).then(res => {
            console.log(res);
            if (res === true) {
              message.success("新建修复单成功");
              this.props.form.resetFields();
              this.props.history.goBack();
              this.setState({ repairListData: [] });
            } else {
              message.error("新建修复单失败");
            }
          });
        }
        
      }
    });
  }

  chooseData = item => {
    console.log(item);
    let data = [];
    let chooseRelicsNum = [];
    for (let value of item) {
      chooseRelicsNum.push(value.key);
    }
    this.setState({
      repairListData: item,
      chooseRelicsNum: chooseRelicsNum
    });
  };

  // 选择起止时间
  handleDateRange = (date, dateString) => {
    console.log(date);
    // this.setState({
    //   date: date
    // })
    // this.props.form.setFieldsValue("inventRangeDate", date);
    let startDate = date[0],
      endDate = date[1];
    let stepDate = endDate;
    startDate
      .hour(0)
      .minute(0)
      .second(0);
    stepDate
      .hour(23)
      .minute(59)
      .second(0);
    // console.log(moment(startDate).format());
    // console.log(moment(stepDate).format());
    let dateDiff = moment(stepDate).diff(startDate, "hours");
    this.state.repairInfo.Repair_cycle = Math.ceil(dateDiff / 24);

    console.log(Math.ceil(dateDiff / 24));
  };

  render() {
    const { repairListData, inventDays, date, repairInfo,pageTitle } = this.state;
    const { getFieldDecorator } = this.props.form;


    return (
      <Row className="main-content">
        <Col span={24} className="title">
          {pageTitle}
          <div
            className="go-back"
            onClick={() => {
              this.props.history.goBack();
            }}
          />
        </Col>
        <Col span={24} className="new-repair-container">
          <Form onSubmit={this.formSubmit.bind(this)} layout="inline">
            <Col span={24} style={{ width: "730px" }}>
              {/* <FormItem label="申请时间:" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} style={{ width: "50%" }}>
                    {getFieldDecorator("date", {
                      initialValue: moment(),
                      rules: [
                        { required: true, message: "请选择申请时间" }
                      ]
                    })(<DatePicker format="YYYY-MM-DD" placeholder="请选择时间" />)}
                  </FormItem> */}
              <FormItem
                label="申请人:"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ width: "50%" }}
              >
                {getFieldDecorator("Repair_Applicant", {
                  initialValue: repairInfo.Repair_Applicant,
                  rules: [{ required: true, message: "请输入申请人" }]
                })(<Input placeholder="请输入申请人" />)}
              </FormItem>
              <FormItem
                label="修复方案:"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ width: "50%" }}
              >
                {getFieldDecorator("Repair_Method", {
                  initialValue: repairInfo.Repair_Method,
                  rules: [{ required: true, message: "请输入修复方案" }]
                })(<Input placeholder="请输入修复方案" />)}
              </FormItem>
              <FormItem
                label="修复人:"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ width: "50%" }}
              >
                {getFieldDecorator("Repair_Restorer", {
                  initialValue: repairInfo.Repair_Restorer,
                  rules: [{ required: true, message: "请输入修复人" }]
                })(<Input placeholder="请输入修复人" />)}
              </FormItem>
              <FormItem
                label="修复起止日期:"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ width: "50%" }}
              >
                {getFieldDecorator("repairRangeDate", {
                  initialValue: repairInfo.repairRangeDate,
                  rules: [
                    {
                      required: true,
                      message: "请选择修复起止日期"
                    }
                  ]
                })(
                  <RangePicker
                    onChange={this.handleDateRange}
                    format="YYYY-MM-DD"
                    placeholder="请选择修复起止日期"
                  />
                )}
              </FormItem>
              <FormItem
                label="修复周期:"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ width: "50%" }}
              >
                {getFieldDecorator("Repair_cycle", {
                  initialValue: repairInfo.Repair_cycle + " 天",
                  rules: [
                    {
                      required: true,
                      message: "请选择修复起止日期"
                    }
                  ]
                })(<Input disabled placeholder="请选择修复起止日期" />)}
              </FormItem>
              <FormItem
                label="归还日期:"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ width: "50%" }}
              >
                {getFieldDecorator("ReturnTime", {
                  initialValue: repairInfo.ReturnTime,
                  rules: [
                    {
                      required: true,
                      message: "请选择归还日期"
                    }
                  ]
                })(<DatePicker placeholder="请选择归还日期" />)}
              </FormItem>
              <FormItem
                label="预期修复结果:"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
                style={{ width: "100%" }}
              >
                {getFieldDecorator("Repair_Result", {
                  initialValue: repairInfo.Repair_Result,
                  rules: [
                    {
                      required: true,
                      message: "请输入预期修复结果"
                    }
                  ]
                })(<TextArea />)}
              </FormItem>
            </Col>
            <Col
              span={24}
              style={{ marginBottom: "20px", marginLeft: "121px" }}
            >
              <Button
                type="primary"
                onClick={() => {
                  this.refs.relicsDialog.openModal();
                }}
              >
                选择修复文物
              </Button>
            </Col>
            <Col span={24}>
            <CheckedRelicsInfo data={repairListData} />
              {/* <Table
                columns={repairListColumns}
                dataSource={repairListData}
                bordered
                pagination={false}
              /> */}
            </Col>
            <Col span={24} style={{ padding: "20px 0" }}>
              <Button
                type="primary"
                htmlType="submit"
                style={{ float: "right" }}
              >
                提交修复单
              </Button>
            </Col>
          </Form>
          <RelicsDialog
            stat={0}
            chooseData={this.chooseData}
            checkedItem={repairListData}
            title="选择修复文物"
            ref="relicsDialog"
          />
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    componentState: state.main.collectionInfoData
  };
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    changeFormData: args => dispatch({ type: "COLLECINFO", payload: args })
  };
};
const NewRepairList = Form.create()(NewRepairListApp);
export default connect(mapStateToProps, mapDispatchToProps)(NewRepairList);