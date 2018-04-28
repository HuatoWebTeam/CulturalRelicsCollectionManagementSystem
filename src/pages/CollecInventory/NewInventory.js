import React, { Component } from 'react';
import { Row, Col, Button, Form, Table, Input, DatePicker, message } from 'antd';
import './index.less';
import moment from 'moment';
import { connect } from 'react-redux';
import RelicsDialog from "../Components/RelicsDialog";
import CheckedRelicsInfo from "../Components/CheckedRelicsInfo";
import { levelInfo } from "../../assets/js/commonFun";
import { InventoryAdd, InvenDataAll, InventUpdate } from "./api"; 
const FormItem = Form.Item;
const { RangePicker } = DatePicker;

class NewInventoryApp extends Component {
  state = {
    date: [moment().hour(0).minute(0).second(0), moment().hour(23).minute(59).second(0)],
    chooseInventoryRelics: [],
    chooseRelicsNum: [],
    pageTitle: '新建盘点单',
    number: null,
    dateFormat: "YYYY-MM-DD",
    inventInfo: {
      InventoryMan: null,
      Inventory_Name: null,
      Inventory_Cycle: null,
      Inventory_Cycle: 0,
      date: [moment().hour(0).minute(0).second(0), moment().hour(23).minute(59).second(0)]
    }, 
  };

  componentWillMount() {
    const { state, formData } = this.props.componentState;
    if (state) {
      let params = {
        Exhibition_Odd: formData,
        pageIndex: 1,
        pageSize: 1000
      }
      InvenDataAll(params).then(res => {
        console.log(res);
        let list = res[0].exhibit;
        for(let item of list) {
          item.key = item.Collection_Number;
        }
        let inventInfo = {
          InventoryMan: res[0].InventoryMan,
          Inventory_Name: res[0].Inventory_Name,
          Inventory_Cycle: res[0].Inventory_Cycle,
          date: [moment(res[0].Inventory_BegTime), moment(res[0].Inventory_EndTime)]
        }
        this.setState({
          inventInfo: inventInfo,
          chooseInventoryRelics: list
        })
      })
    }
  }
  // 提交
  formSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        // const {  }
        console.log(fieldsValue);
        const { chooseRelicsNum, number, inventInfo } = this.state;
        if (chooseRelicsNum.length === 0) {
          message.error("请选择盘点文物");
        }
        
        const { state, formData } = this.props.componentState;
        let value = {
          ...fieldsValue,
          // date: fieldsValue["date"].format("YYYY-MM-DD"),
          date: [fieldsValue['inventRangeDate'][0].format(), fieldsValue['inventRangeDate'][1].format()]
        };
        let params = {
          Inventory_Odd: state ? formData : '',   // 编辑盘点单号
          InventoryMan: value.InventoryMan,   // 盘点人 
          Inventory_Time: moment().format(),      // 盘点创建时间  当前时间
          // Inventory_Odd: value.inventNum,     // 盘点单号
          Inventory_Name: value.Inventory_Name,      // 盘点名称
          Collection_Number: chooseRelicsNum.join(","),  // 选择文物编号
          Inventory_Number: number,               // 文物数量
          Inventory_Cycle: inventInfo.Inventory_Cycle,            // 盘点周期
          Inventory_BegTime: value.date[0],       // 盘点开始时间
          Inventory_EndTime: value.date[1],       // 盘点结束时间

        };
        console.log(params)
        if(state) {
          InventUpdate(params).then(res => {
            console.log(res);
            if (res === true) {
              this.setState({ chooseRelicsNum: [] }, () => {
                this.props.form.resetFields();
                message.success("编辑盘点单成功");
                this.props.history.goBack();
                this.setState({ chooseInventoryRelics: [] });
                this.refs.relicsDialog.resetTableCheck();
              });
            } else {
              message.error("编辑盘点单失败");
            }
          })
        } else {
          InventoryAdd(params).then(res => {
            console.log(res);
            if (res === true) {
              this.setState({ chooseRelicsNum: [] }, () => {
                this.props.form.resetFields();
                message.success("新建盘点单成功");
                this.props.history.goBack();
                this.setState({ chooseInventoryRelics: [] });
                this.refs.relicsDialog.resetTableCheck();
              });
            } else {
              message.error("新建盘点单失败");
            }
          });
        }
        
      }
    });
  };

  // 选择盘点文物
  chooseData = value => {
    console.log(value);
    let keys = [];
    // let data = [];
    let number = 0;
    for (let item of value) {
      keys.push(item.key);
      number = number + Number(item.number);
    }
    this.setState({
      chooseRelicsNum: keys,
      chooseInventoryRelics: value,
      number: number
    });
  };

  // 选择起止时间
  handleDateRange = (date, dateString) => {
    console.log(date);
    // this.setState({
    //   date: date
    // })
    // this.props.form.setFieldsValue("inventRangeDate", date);
    let startDate = date[0], endDate = date[1];
    let stepDate = endDate;
    startDate.hour(0).minute(0).second(0);
    stepDate.hour(23).minute(59).second(0);
    // console.log(moment(startDate).format());
    // console.log(moment(stepDate).format());
    let dateDiff = moment(stepDate).diff( startDate, 'hours');
    this.state.inventInfo.Inventory_Cycle = Math.ceil(dateDiff/24)
    
    console.log(Math.ceil(dateDiff/24))
  }

  render() {
    const { chooseInventoryRelics, dateFormat, date, inventInfo } = this.state;
    const { getFieldDecorator } = this.props.form;
   

    return (
      <Row className="main-content">
        <Col span={24} className="title">
          新建盘点单{" "}
          <div
            className="go-back"
            onClick={() => {
              this.props.history.goBack();
            }}
          />
        </Col>
        <Col span={24} className="newInventory-container">
          <Form layout="inline" onSubmit={this.formSubmit}>
            <Col span={24} style={{ width: "850px" }}>
              {/* <FormItem
                label="创建时间:"
                labelCol={{ span: 8 }}
                className="form-width50"
              >
                {getFieldDecorator("date", {
                  initialValue: moment(),
                  rules: [{ required: true, message: "请选择盘点时间" }]
                })(<DatePicker format={dateFormat} />)}
              </FormItem> */}
              <FormItem
                label="盘点人:"
                labelCol={{ span: 6 }}
                className="form-width50"
              >
                {getFieldDecorator("InventoryMan", {
                  initialValue: inventInfo.InventoryMan,
                  rules: [{ required: true, message: "请输入盘点人" }]
                })(<Input placeholder="请输入盘点人" />)}
              </FormItem>
              <FormItem
                label="盘点名称:"
                labelCol={{ span: 8 }}
                className="form-width50"
              >
                {getFieldDecorator("Inventory_Name", {
                  initialValue: inventInfo.Inventory_Name,
                  rules: [{ required: true, message: "请输入盘点名称" }]
                })(<Input placeholder="请输入盘点名称" />)}
              </FormItem>
              <FormItem
                label="盘点起止时间:"
                labelCol={{ span: 6 }}
                className="form-width50"
              >
                {getFieldDecorator("inventRangeDate", {
                  initialValue: inventInfo.date,
                  rules: [{ required: true, message: "请选择盘点起止时间" }]
                })(
                  <RangePicker
                    onChange={this.handleDateRange}
                    placeholder="请选择盘点起止时间"
                    format='YYYY-MM-DD'
                  />
                )}
              </FormItem>
              <FormItem
                label="盘点周期:"
                labelCol={{ span: 8 }}
                className="form-width50"
              >
                <Input disabled value={inventInfo.Inventory_Cycle + ' 天'} placeholder="请选择盘点起止时间" />
              </FormItem>
              <Col span={24} style={{ padding: "20px 70px" }}>
                <Button
                  type="primary"
                  onClick={() => {
                    this.refs.relicsDialog.openModal();
                  }}
                >
                  选择盘点文物
                </Button>
              </Col>
            </Col>
            <Col span={24}>
            <CheckedRelicsInfo data={chooseInventoryRelics} />
              {/* <Table
                columns={inventoryColumns}
                dataSource={chooseInventoryRelics}
                bordered
                pagination={false}
              /> */}
            </Col>
            <Col span={24} style={{ padding: "20px 40px" }}>
              <Button
                type="primary"
                htmlType="submit"
                style={{ float: "right" }}
              >
                提交盘点单
              </Button>
            </Col>
          </Form>
          <RelicsDialog
            chooseData={this.chooseData}
            title="选择盘点文物"
            stat={0}
            checkedItem={chooseInventoryRelics}
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
const NewInventory = Form.create()(NewInventoryApp);
export default connect(mapStateToProps, mapDispatchToProps)(NewInventory);