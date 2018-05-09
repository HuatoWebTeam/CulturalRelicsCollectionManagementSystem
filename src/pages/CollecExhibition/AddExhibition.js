import React, { Component } from 'react';

import { Row, Col, Form, Input, Select, DatePicker, Button, Table, message, InputNumber } from 'antd';
import './index.less';
import { ExDataAddApp, ExhibitionDetailsApi, ExUpdate } from "./api";
import moment from 'moment';
import RelicsDialog from '../Components/RelicsDialog';
import CheckedRelicsInfo from '../Components/CheckedRelicsInfo';
import { connect } from 'react-redux';
import { RangePickerDefault, levelInfo, relicsYears, exhibitionType } from "../../assets/js/commonFun";

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

class AddExhibitionForm extends Component {
  state = {
    pageTitle: "添加展览清单",
    typeMenu: exhibitionType,
    exhibiDate: [],
    addExhibitionData: [],
    chooseRelicsNum: [],
    isAdduction: true, // true 为内展
    exhibiInfo: {
      ReturnTime: moment().add(7, "days"),
      Exhibition_Contact: null,
      Exhibition_Cost: null,
      Exhibition_Place: null,
      Exhibition_Theme: null,
      exhibitionType: exhibitionType[0].key,
      Person_liable: null,
      date: [moment(), moment().add(6, "days")]
    }, // 展览单信息
    checkInfo: [], // 编辑已有的文物信息
    checkNum: null, // 已有的文物编号
    loading: false
  };

  componentWillMount() {
    const { state, formData } = this.props.componentState;
    console.log(state);
    // let date = [moment(), moment().add(6, 'days')];
    this.setState({
      pageTitle: state ? state : "添加展览清单"
    });
    // let detailData = null;
    if (state) {
      let params = { pageIndex: 1, pageSize: 1000, Exhibition_Odd: formData };
      ExhibitionDetailsApi(params).then(res => {
        console.log(res);
        let list = res[0].exhibit;
        let checkNum = [];
        for (let item of list) {
          (item.key = item.Collection_Number),
            checkNum.push(item.Collection_Number);
        }
        let oddInfo = {
          ReturnTime: moment(res[0].ReturnTime),
          Exhibition_Contact: res[0].Exhibition_Contact,
          Exhibition_Cost: res[0].Exhibition_Cost,
          Exhibition_Place: res[0].Exhibition_Place,
          Exhibition_Theme: res[0].Exhibition_Theme,
          exhibitionType: res[0].Exhibition_Type,
          Person_liable: res[0].Person_liable,
          date: [moment(res[0].StartTine), moment(res[0].EndTime)]
        };

        this.setState({
          exhibiInfo: oddInfo,
          addExhibitionData: list,
          oddId: formData,
          chooseRelicsNum: checkNum,
          checkNum: checkNum
        });
      });
    }
  }
  componentWillUnmount() {
    this.props.changeFormData({
      state: null,
      formData: null
    });
  }

  // 提交表单
  handleSubmit(e) {
    e.preventDefault();
    const { chooseRelicsNum } = this.state;
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        // console.log(fieldsValue);
        this.setState({
          loading: true
        });
        const { state } = this.props.componentState;
        const { checkNum } = this.state;
        const rangeValue = fieldsValue["date"];
        const values = {
          ...fieldsValue,
          date: [
            rangeValue[0].format("YYYY-MM-DD"),
            rangeValue[1].format("YYYY-MM-DD")
          ],
          ReturnTime: fieldsValue["ReturnTime"]
            ? fieldsValue["ReturnTime"].format()
            : "",
          exhibitionType:
            typeof fieldsValue["exhibitionType"] === "number"
              ? fieldsValue["exhibitionType"]
              : fieldsValue["exhibitionType"][0]
        };
        console.log(values);
        console.log(chooseRelicsNum);
        if (chooseRelicsNum.length === 0) {
          message.error("请选择展览文物");
        }
        let thisRelicsNum = chooseRelicsNum.join(",");
        let params = {
          Exhibition_Odd: state ? this.state.oddId : "",
          Exhibition_Theme: values["Exhibition_Theme"],
          Exhibition_Type: values["exhibitionType"],
          StartTine: values["date"][0],
          EndTime: values["date"][1],
          Person_liable: values["Person_liable"],
          Collection_Number: thisRelicsNum,
          Exhibition_Place: values["Exhibition_Place"] || "",
          Exhibition_Contact: values["Exhibition_Contact"] || "",
          ReturnTime: values["ReturnTime"],
          Exhibition_Cost: Number(values["Exhibition_Cost"]) || 0,
          CreationTime: moment().format()
        };
        console.log(params);
        console.log(checkNum);
        if (state) {
          // 选择的
          let chooseReli = params.Collection_Number.split(",");
          params.NowCollection = [];
          for (let item of chooseReli) {
            params.NowCollection.push({ odd: item });
          }
          for (let i = 0; i < checkNum.length; i++) {
            for (let n = 0; n < chooseReli.length; n++) {
              if (checkNum[i] === chooseReli[n]) {
                checkNum.splice(i, 1);
                i--;
                break;
              }
            }
          }
          params.HistoryCollection = [];
          for (let item of checkNum) {
            params.HistoryCollection.push({
              Collection_Number: item,
              Collection_State: 1
            });
          }
          console.log(params);
          ExUpdate(params).then(res => {
            console.log(res);
            this.setState({
              loading: false
            });
            if (res === true) {
              message.success("编辑展览单成功");
              this.props.form.resetFields();
              this.props.history.goBack();
              this.setState({ addExhibitionData: [] });
            } else {
              message.error("编辑展览单失败");
            }
          });
        } else {
          ExDataAddApp(params).then(res => {
            console.log(res);
            this.setState({ loading: false });
            if (res === true) {
              message.success("添加展览单成功");
              this.props.form.resetFields();
              this.props.history.goBack();
              this.setState({ addExhibitionData: [] });
            } else {
              message.error("添加展览单失败");
            }
          });
        }
      }
    });
  }

  chooseData = item => {
    // console.log(item);
    let keys = [];
    for (let value of item) {
      keys.push(value.key);
    }
    this.setState({
      addExhibitionData: item,
      chooseRelicsNum: keys
    });
  };

  // 选择展览类型
  selcectChange = key => {
    // console.log(key);
    if (key === 1) {
      this.setState({
        isAdduction: false
      });
    } else {
      this.setState({
        isAdduction: true
      });
    }
  };

  // 选择时间
  // changeDate (dates, dateString) {
  //   console.log(dates);
  //   console.log(dateString);
  // }
  render() {
    // console.log(this.props);
    const {
      typeMenu,
      addExhibitionData,
      isAdduction,
      pageTitle,
      checkInfo,
      exhibiInfo,
      chooseRelicsNum
    } = this.state;
    console.log(addExhibitionData);
    const { getFieldDecorator } = this.props.form;

    return (
      <Row className="exhibition-container main-content">
        <Col className="title" span={24}>
          {pageTitle}
          <div
            className="go-back"
            onClick={() => {
              this.props.history.goBack();
            }}
          />
        </Col>
        <Col
          span={24}
          className="exhibition-content"
          style={{ marginTop: "20px" }}
        >
          <Col className="exhibition-form-content">
            <Form
              onSubmit={this.handleSubmit.bind(this)}
              layout="inline"
              className="addexhibition-form"
            >
              <Col span={24} style={{ width: "800px" }}>
                <FormItem
                  label="展览主题:"
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                >
                  {getFieldDecorator("Exhibition_Theme", {
                    initialValue: exhibiInfo.Exhibition_Theme,
                    rules: [{ required: true, message: "请输入展览主题" }]
                  })(<Input placeholder="请输入展览主题" />)}
                </FormItem>
                {/* <FormItem label="展览单号:" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                  {getFieldDecorator("exhibitionNum", {
                    rules: [{ required: true, message: "请输入展览单号" }]
                  })(<Input placeholder="请输入展览单号" />)}
                </FormItem> */}
                <FormItem
                  label="展览类型:"
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                >
                  {getFieldDecorator("exhibitionType", {
                    initialValue: exhibiInfo.exhibitionType,
                    rules: [{ required: true, message: "请选择展览类型" }]
                  })(
                    <Select onSelect={this.selcectChange}>
                      {typeMenu.map((item, idx) => (
                        <Option key={item.key} value={item.key}>
                          {item.value}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
                <FormItem
                  label="起止时间:"
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                >
                  {getFieldDecorator("date", {
                    initialValue: exhibiInfo.date,
                    rules: [
                      {
                        type: "array",
                        required: true,
                        message: "请选择起止时间"
                      }
                    ]
                  })(<RangePicker format="YYYY-MM-DD" />)}
                </FormItem>
                <FormItem
                  label="负责人:"
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                >
                  {getFieldDecorator("Person_liable", {
                    initialValue: exhibiInfo.Person_liable,
                    rules: [{ required: true, message: "请输入负责人" }]
                  })(<Input placeholder="请输入负责人" />)}
                </FormItem>
                <FormItem
                  label="归还时间:"
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                >
                  {getFieldDecorator("ReturnTime", {
                    initialValue: exhibiInfo.ReturnTime,
                    rules: [{ required: true, message: "请选择归还时间" }]
                  })(<DatePicker placeholder="请选择归还时间" />)}
                </FormItem>
                {!isAdduction && (
                  <Col span={24}>
                    <FormItem
                      label="外展地点:"
                      labelCol={{ span: 6 }}
                      wrapperCol={{ span: 18 }}
                    >
                      {getFieldDecorator("Exhibition_Place", {
                        initialValue: exhibiInfo.Exhibition_Place,
                        rules: [{ required: true, message: "请输入外展地点" }]
                      })(<Input placeholder="请输入外展地点" />)}
                    </FormItem>
                    <FormItem
                      label="联系方式:"
                      labelCol={{ span: 6 }}
                      wrapperCol={{ span: 18 }}
                    >
                      {getFieldDecorator("Exhibition_Contact", {
                        initialValue: exhibiInfo.Exhibition_Contact,
                        rules: [{ required: true, message: "请输入联系方式" }]
                      })(<Input placeholder="请输入联系方式" />)}
                    </FormItem>
                    <FormItem
                      label="外展经费:"
                      labelCol={{ span: 6 }}
                      wrapperCol={{ span: 18 }}
                    >
                      {getFieldDecorator("Exhibition_Cost", {
                        initialValue: exhibiInfo.Exhibition_Cost,
                        rules: [{ required: true, message: "请输入外展经费" }]
                      })(
                        <InputNumber
                          placeholder="请输入外展经费"
                          style={{ width: "165px" }}
                        />
                      )}
                    </FormItem>
                  </Col>
                )}
              </Col>
              <Col span={24} style={{ padding: "20px 0 20px 95px" }}>
                <Button
                  type="primary"
                  onClick={() => {
                    this.refs.relicsDialog.openModal();
                    this.setState({
                      checkNum: chooseRelicsNum
                    });
                    // console.log(this.refs.relicsDialog);
                  }}
                >
                  选择展览文物
                </Button>
              </Col>
              <Col span={24}>
                <CheckedRelicsInfo data={addExhibitionData} />
              </Col>
              <Col span={24} style={{ padding: "30px 50px" }}>
                <FormItem
                  style={{ float: "right" }}
                  className="right-form-item"
                >
                  <Button
                    loading={this.state.loading}
                    htmlType="submit"
                    type="primary"
                  >
                    提交展览清单
                  </Button>
                </FormItem>
              </Col>
            </Form>
          </Col>
          <RelicsDialog
            stat={0}
            chooseData={this.chooseData}
            checkedItem={addExhibitionData}
            title="选择展览文物"
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
    changeFormData: args => dispatch({ type: "COLLECINFO", payload: args }),
  }
}
const AddExhibition = Form.create()(AddExhibitionForm);
export default connect(mapStateToProps, mapDispatchToProps)(AddExhibition);