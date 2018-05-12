import React, { Component } from 'react';
import { Row, Col, Form, Upload, Icon, Modal, Input, InputNumber, Select, DatePicker, Button, message } from 'antd';
import './index.less';
import moment from 'moment';
import { connect } from 'react-redux';
import { CollectionImgUpload } from '../CollecManagement/Information/api';
import { SolicAddApi, SolicitUpdate } from "./api";
import { levelInfo, relicsCategory, relicsYears, howComplete } from "../../assets/js/commonFun";
import { fromJS } from 'immutable';
const FormItem = Form.Item;
const Option = Select.Option;
const {TextArea} = Input;

class AddSilicitionApp extends Component {
  state = {
    pageTitle: '添加征集信息',
    previewVisible: false,
    previewImage: "",
    fileList: [],
    id: null,
    relicsCateList: [],
    relicsYearsList: [],
    relicsLevelList: [],
    formData: null,
    loading: false
  };
  // 替换图片地址
  formatSub = (value) => {
    // console.log(value);
    var s = value ? value.substring(0, value.indexOf("/CollectionFile/")) : null
    // console.log(s)
    // console.log(value.replace(s, ''));
    return value ? value.replace(s, "") : null;
  }

  componentWillMount() {
    const { state, formData } = this.props.componentState;
    console.log(state)
    console.log(formData)
    let relicsYears = JSON.parse(sessionStorage.getItem("relicsYears"));
    let relicsCateGory = JSON.parse(sessionStorage.getItem("relicsCateGory"));
    let relicsLevel = JSON.parse(sessionStorage.getItem("relicsLevel"));

    let data = {
      AmountPrize: state ? formData.AmountPrize : null,
      BeUnearthed: state ? formData.BeUnearthed: null,
      Collection_Name: state ? formData.Collection_Name : null,
      Collection_Number: state ? formData.Collection_Number : null,
      Grade: state ? Number(formData.Grade) : Number(relicsLevel[0].GradeId),
      Identification: state ? formData.Identification : null,
      IdentityCard: state ? formData.IdentityCard : null,
      Collection_Years: state ? Number(formData.Collection_Years) : Number(relicsYears[0].YearsId),
      MaterialQuality: state ? formData.MaterialQuality : null,
      Integrity: state ? Number(formData.Integrity) : 0,
      Solicitation_mode: state ? formData.Solicitation_mode : null,
      Number: state ? formData.Number : null,
      Phone: state ? formData.Phone : null,
      Site: state ? formData.Site : null,
      Size: state ? formData.Size : null,
      Solicitation_Name: state ? formData.Solicitation_Name : null,
      Solicitation_State: state ? Number(formData.Solicitation_State) : Number(relicsCateGory[0].CollTypeId),
      Solicitation_Time: state ? formData.Solicitation_Time : moment(),
      Weight: state ? formData.Weight : null
    };
    if(state) {
      let fielList = [{ uid: -1, name: "", status: "done", url: formData.Collection_img1 }, { uid: -2, name: "", status: "done", url: formData.Collection_img2 }, { uid: -3, name: "", status: "done", url: formData.Collection_img3 }];
      for (let i = 0; i < fielList.length; i++) {
        console.log(fielList[i])
        if (!fielList[i].url) {
          fielList.splice(i, 1);
          i--;
        }
      };
      this.setState({
        fileList: fielList
      })
    }

    this.setState({
      formData: data,
      id: state ? formData.Solicitation_Id : null,
      pageTitle: state ? state : '添加征集信息',
      relicsCateList: relicsCateGory,
      relicsYearsList: relicsYears,
      relicsLevelList: relicsLevel
    });
    
  }

  componentWillUnmount() {
    this.props.changeFormData({
      state: null,
      formDate: null
    })
  }

  beforeUpload = file => {
    console.log(JSON.stringify(file));
    const isLt3M = file.size / 1024 / 1024 < 3;

    if (!isLt3M) {
      message.error("请选择小于3M的图片!!!");
      return false;
    }
    this.uploadImg(file);
    return false;
  };
  // 上传图片
  uploadImg = file => {
    let formData = new FormData();
    formData.append("file", file);
    CollectionImgUpload(formData).then(res => {
      console.log(res);
      if (res.Msg === "文件上传成功!") {
        let fileLists = {
          uid: "-" + new Date().getTime(),
          name: "",
          status: "done",
          url: res.Data
        };
        console.log("success");
        this.setState(({ fileList }) => ({
          fileList: [...fileList, fileLists]
        }));
      } else {
        message.error("上传失败");
      }
    });
  };
  // 移除图片
  handleRemove = file => {
    //   console.log(file);
    //   console.log(this.state.fileList);
    const { fileList } = this.state;
    for (let i = 0; i < fileList.length; i++) {
      if (fileList[i].status === "removed") {
        fileList.splice(i, 1);
      }
    }
    //   console.log(fileList)
    this.setState({
      fileList: fileList
    });
  };

  // 关闭预览
  handleCancel = () => this.setState({ previewVisible: false });

  // 打开预览
  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true
    });
  };

  //
  handleChange = ({ fileList }) => {
    // this.setState({fileList})
    console.log(fileList);
  };

  handleFormSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        this.setState({ loading: true });
        const { fileList } = this.state;
        console.log(fieldsValue);
        if (fileList.length > 0) {
          const value = {
            Solicitation_Name: fieldsValue.Solicitation_Name,
            IdentityCard: fieldsValue.IdentityCard,
            Site: fieldsValue.Site,
            Phone: fieldsValue.Phone,
            AmountPrize: fieldsValue.AmountPrize,
            Identification: fieldsValue.Identification,
            // Collection_Number: fieldsValue.Collection_Number,
            Collection_Name: fieldsValue.Collection_Name,
            Grade: fieldsValue.Grade,
            Number: Number(fieldsValue.Number),
            MaterialQuality: fieldsValue.MaterialQuality,
            Weight: fieldsValue.Weight,
            Size: fieldsValue.Size,
            Collection_Years: Number(fieldsValue.Collection_Years),
            BeUnearthed: fieldsValue.BeUnearthed,
            Solicitation_mode: fieldsValue.Solicitation_mode,
            Integrity: fieldsValue.Integrity,
            Solicitation_State: fieldsValue.Solicitation_State,
            Solicitation_Time: fieldsValue["Solicitation_Time"].format("YYYY-MM-DD"),
            Solicitation_img1:
              fileList[0] === undefined ? null : this.formatSub(fileList[0].url),
            Solicitation_img2:
              fileList[1] === undefined ? null : this.formatSub(fileList[1].url),
            Solicitation_img3:
              fileList[2] === undefined ? null : this.formatSub(fileList[2].url)
          };
          const { state, formDate } = this.props.componentState;
          if(state) {
            value.Solicitation_Id = this.state.id;
            SolicitUpdate(value).then(res => {
              console.log(res);
              this.setState({ loading: false });
              if (res === true) {
                message.success("添加成功");
                this.setState({ fileList: [] });
                this.props.form.resetFields();
                this.props.history.goBack();
              } else {
                message.error("添加失败");
              }
            })
          } else {
            SolicAddApi(value).then(res => {
              console.log(res);
              this.setState({ loading: false });
              if (res === true) {
                message.success("添加成功");
                this.setState({ fileList: [] });
                this.props.form.resetFields();
                this.props.history.goBack();
              } else {
                message.error("添加失败");
              }
            });
          }
          
        } else {
          message.error("请选择图片");
        }
      }
    });
  };
  // 禁止选择时间
  disabledDate = current => {
    return current && current > moment().endOf("day");
  };
  // 验证
  handleNumber = (rule, value, callback) => {
    if (!value) {
      callback("请输入正确的数量");
    } else if (value && Number(value) <= 0) {
      callback("请输入正确的数量");
    } else {
      callback();
    }
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { 
      pageTitle,
      previewVisible, 
      previewImage, 
      fileList, 
      relicsCateList,
      relicsYearsList, 
      relicsLevelList,
      formData
    } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    return <Row className="main-content">
        <Col span={24} className="title">
          {pageTitle}
          <div className="go-back" onClick={() => {
              this.props.history.goBack();
            }} />
        </Col>
        <Col span={24} className="addSolicition-container">
          <Form layout="inline" onSubmit={this.handleFormSubmit} style={{ width: "100%" }}>
            <FormItem label="文物图片:" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} style={{ width: "100%" }}>
              <Upload action="//jsonplaceholder.typicode.com/posts/" 
                listType="picture-card" 
                beforeUpload={this.beforeUpload} 
                fileList={fileList}
                onPreview={this.handlePreview}
                onRemove={this.handleRemove}>
                {fileList.length >= 3 ? null : uploadButton}
              </Upload>
              <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                <img alt="upload" src={previewImage} style={{ width: "100%" }} />
              </Modal>
            </FormItem>
            <FormItem label="征集人:" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} className="form-item50">
              {getFieldDecorator("Solicitation_Name", {
                initialValue: formData.Solicitation_Name,
                rules: [{ required: true, message: "请输入征集人" }]
              })(<Input placeholder="请输入征集人" />)}
            </FormItem>
            <FormItem label="身份证号码:" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} className="form-item50">
              {getFieldDecorator("IdentityCard", {
                initialValue: formData.IdentityCard,
                rules: [{ required: true, message: "请输入身份证号码" }]
              })(<Input placeholder="请输入身份证号码" />)}
            </FormItem>
            <FormItem label="联系电话:" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} className="form-item50">
              {getFieldDecorator("Phone", {
                initialValue: formData.Phone,
                rules: [{ required: true, message: "请输入联系电话" }]
              })(<Input placeholder="请输入联系电话" />)}
            </FormItem>
            <FormItem label="联系地址:" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} className="form-item50">
              {getFieldDecorator("Site", {
                initialValue: formData.Site,
                rules: [{ required: true, message: "请输入联系地址" }]
              })(<Input placeholder="请输入联系地址" />)}
            </FormItem>
            <FormItem label="鉴定结果:" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} className="form-item50">
              {getFieldDecorator("Identification", {
                initialValue: formData.Identification,
                rules: [{ required: true, message: "请输入鉴定结果" }]
              })(<Input placeholder="请输入鉴定结果" />)}
            </FormItem>
            <FormItem label="奖金数额:" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} className="form-item50">
              {getFieldDecorator("AmountPrize", {
                initialValue: formData.AmountPrize,
                rules: [{ required: true, message: "请输入奖金数额" }]
              })(<InputNumber style={{ width: "100%" }} step={100} placeholder="请输入奖金数额" />)}
            </FormItem>
            <FormItem label="文物名称:" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} className="form-item50">
              {getFieldDecorator("Collection_Name", {
                initialValue: formData.Collection_Name,
                rules: [{ required: true, message: "请输入文物名称" }]
              })(<Input placeholder="请输入文物名称" />)}
            </FormItem>
            {/* <FormItem
              label="征集文物ID:"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              className="form-item50"
            >
              {getFieldDecorator("soliciRelicsId", {
                rules: [{ required: true, message: "请输入征集文物ID" }]
              })(<Input placeholder="请输入征集文物ID" />)}
            </FormItem> */}
            {/* <FormItem
              label="文物编号:"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              className="form-item50"
            >
              {getFieldDecorator("Collection_Number", {
                initialValue: formData.Collection_Number,
                rules: [{ required: true, message: "请输入文物编号" }]
              })(<Input placeholder="请输入文物编号" />)}
            </FormItem> */}
            <FormItem label="分级信息:" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} className="form-item50">
              {getFieldDecorator("Grade", {
                initialValue: formData.Grade,
                rules: [{ required: true, message: "请选择分级信息" }]
              })(<Select>
                  {relicsLevelList.map(item => (
                    <Option
                      value={Number(item.GradeId)}
                      key={Number(item.GradeId)}
                    >
                      {item.GradeName}
                    </Option>
                  ))}
                </Select>)}
            </FormItem>
            <FormItem label="文物年代:" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} className="form-item50">
              {getFieldDecorator("Collection_Years", {
                initialValue: formData.Collection_Years,
                rules: [{ required: true, message: "请输入文物年代" }]
              })(<Select>
                  {relicsYearsList.map(item => (
                    <Option value={Number(item.YearsId)} key={item.YearsId}>
                      {item.YearsName}
                    </Option>
                  ))}
                </Select>)}
            </FormItem>
            <FormItem label="完整程度:" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} className="form-item50">
              {getFieldDecorator("Integrity", {
                initialValue: formData.Integrity,
                rules: [{ required: true, message: "请输入完整程度" }]
              })(<Select>
                  {howComplete.map(item => (
                    <Option value={item.key} key={item.key}>
                      {item.value}
                    </Option>
                  ))}
                </Select>)}
            </FormItem>
            <FormItem label="征集方式:" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} className="form-item50">
              {getFieldDecorator("Solicitation_mode", {
                initialValue: formData.Solicitation_mode,
                rules: [{ required: true, message: "请选择征集方式" }]
              })(<Input placeholder="请输入征集方式" />)}
            </FormItem>
            <FormItem label="征集时间:" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} className="form-item50">
              {getFieldDecorator("Solicitation_Time", {
                initialValue: moment(formData.Solicitation_Time),
                rules: [{ required: true, message: "请选择征集时间" }]
              })(<DatePicker format="YYYY-MM-DD" disabledDate={this.disabledDate} />)}
            </FormItem>
            <FormItem label="数量:" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} className="form-item50">
              {getFieldDecorator("Number", {
                initialValue: formData.Number,
                rules: [{ validator: this.handleNumber }]
              })(<InputNumber style={{ width: "100%" }} placeholder="请输入数量" />)}
            </FormItem>
            <FormItem label="文物类别:" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} className="form-item50">
              {getFieldDecorator("Solicitation_State", {
                initialValue: formData.Solicitation_State,
                rules: [{ required: true, message: "请选择类别" }]
              })(<Select>
                  {relicsCateList.map(item => (
                    <Option
                      key={Number(item.CollTypeId)}
                      value={Number(item.CollTypeId)}
                    >
                      {item.CollTypeName}
                    </Option>
                  ))}
                </Select>)}
            </FormItem>
            <FormItem label="材质:" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} className="form-item50">
              {getFieldDecorator("MaterialQuality", {
                initialValue: formData.MaterialQuality,
                rules: [{ required: true, message: "请输入材质" }]
              })(<Input placeholder="请输入材质" />)}
            </FormItem>
            <FormItem label="出土信息:" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} className="form-item50 unearthed">
              {getFieldDecorator("BeUnearthed", {
                initialValue: formData.BeUnearthed,
                rules: [{ required: true, message: "请输入出土信息" }]
              })(<TextArea />)}
            </FormItem>
            <FormItem label="重量:" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} className="form-item50">
              {getFieldDecorator("Weight", {
                initialValue: formData.Weight,
                rules: [{ required: true, message: "请输入重量" }]
              })(<Input placeholder="请输入重量" />)}
            </FormItem>
            <FormItem label="尺寸:" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} className="form-item50">
              {getFieldDecorator("Size", {
                initialValue: formData.Size,
                rules: [{ required: true, message: "请输入尺寸" }]
              })(<Input placeholder="请输入尺寸" />)}
            </FormItem>
            <FormItem style={{ width: "100%" }} wrapperCol={{ offset: 4 }}>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
            </FormItem>
          </Form>
        </Col>
      </Row>;
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
const AddSilicition = Form.create()(AddSilicitionApp);
export default connect(mapStateToProps, mapDispatchToProps)(AddSilicition);