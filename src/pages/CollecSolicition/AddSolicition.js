import React, { Component } from 'react';
import { Row, Col, Form, Upload, Icon, Modal, Input, Select, DatePicker, Button, message } from 'antd';
import './index.less';
import moment from 'moment';
import { CollectionImgUpload } from '../CollecManagement/Information/api';
import { SolicAddApi } from './api';
const FormItem = Form.Item;
const Option = Select.Option;
const {TextArea} = Input;

class AddSilicitionApp extends Component {
  state = {
    previewVisible: false,
    previewImage: "",
    fileList: []
  };

  beforeUpload = file => {
    console.log(file);
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
        const { fileList } = this.state;
        console.log(fieldsValue);
        if(fileList.length > 0) {
          const value = {
            Collection_Number: fieldsValue.relicsNum,
            Collection_Name: fieldsValue.relicsName,
            Grade: fieldsValue.levelInfo,
            Number: Number(fieldsValue.number),
            MaterialQuality: fieldsValue.material,
            Weight: fieldsValue.weight,
            Size: fieldsValue.size,
            Collection_Years: Number(fieldsValue.years),
            BeUnearthed: fieldsValue.unearthedInfo,
            Solicitation_mode:fieldsValue.solicitMethods,
            Integrity: fieldsValue.howComplete,
            Solicitation_State: fieldsValue.category,
            Solicitation_Time: fieldsValue['date'].format('YYYY-MM-DD'),
            Solicitation_img1: fileList[0] === undefined ? null : fileList[0].url,
            Solicitation_img2: fileList[1] === undefined ? null : fileList[1].url,
            Solicitation_img3: fileList[2] === undefined ? null : fileList[2].url
          };
          SolicAddApi(value).then(res => {
            console.log(res);
            if(res === true) {
              message.success('添加成功');
              this.setState({
                fileList: []
              });
              this.props.form.resetFields();
            } else {
              message.error('添加失败');
            }
          })
        } else {
          message.error('请选择图片');
        }
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    return <Row className="main-content">
        <Col span={24} className="title">
          添加征集信息 <div className='go-back' onClick={() => { this.props.history.goBack() }} ></div>
        </Col>
        <Col span={24} className="addSolicition-container">
          <Form layout="inline" onSubmit={this.handleFormSubmit} style={{ width: "100%" }}>
            <FormItem label="文物图片:" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} style={{ width: "100%" }}>
              <Upload action="//jsonplaceholder.typicode.com/posts/" listType="picture-card" beforeUpload={this.beforeUpload} fileList={fileList} onRemove={this.handleRemove}>
                {fileList.length >= 3 ? null : uploadButton}
              </Upload>
              <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                <img alt="upload" src={previewImage} style={{ width: "100%" }} />
              </Modal>
            </FormItem>
            <FormItem label="文物名称" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} className="form-item50">
              {getFieldDecorator("relicsName", {
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
            <FormItem label="文物编号:" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} className="form-item50">
              {getFieldDecorator("relicsNum", {
                rules: [{ required: true, message: "请输入文物编号" }]
              })(<Input placeholder="请输入文物编号" />)}
            </FormItem>
            <FormItem label="分级信息:" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} className="form-item50">
              {getFieldDecorator("levelInfo", {
                initialValue: 0,
                rules: [{ required: true, message: "请选择分级信息" }]
              })(<Select>
                  <Option value={0}>一级文物</Option>
                </Select>)}
            </FormItem>
            <FormItem label="文物年代:" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} className="form-item50">
              {getFieldDecorator("years", {
                initialValue: 0,
                rules: [{ required: true, message: "请输入文物年代" }]
              })(<Select>
                  <Option value={0}>清</Option>
                </Select>)}
            </FormItem>
            <FormItem label="完整程度:" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} className="form-item50">
              {getFieldDecorator("howComplete", {
                initialValue: 0,
                rules: [{ required: true, message: "请输入完整程度" }]
              })(<Select>
                  <Option value={0}>完整</Option>
                </Select>)}
            </FormItem>
            <FormItem label="征集方式:" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} className="form-item50">
              {getFieldDecorator("solicitMethods", {
                initialValue: 0,
                rules: [{ required: true, message: "请祖安泽征集方式" }]
              })(<Select>
                  <Option value={0}>抢</Option>
                </Select>)}
            </FormItem>
            <FormItem label="征集时间:" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} className="form-item50">
              {getFieldDecorator("date", {
                initialValue: moment(),
                rules: [{ required: true, message: "请选择征集时间" }]
              })(<DatePicker format="YYYY-MM-DD" />)}
            </FormItem>
            <FormItem label="数量:" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} className="form-item50">
              {getFieldDecorator("number", {
                rules: [{ required: true, message: "请输入数量" }]
              })(<Input placeholder="请输入数量" />)}
            </FormItem>
            <FormItem label="类别:" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} className="form-item50">
              {getFieldDecorator("category", {
                initialValue: 0,
                rules: [{ required: true, message: "请选择类别" }]
              })(<Select>
                  <Option value={0}>青铜器</Option>
                </Select>)}
            </FormItem>
            <FormItem label="材质:" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} className="form-item50">
              {getFieldDecorator("material", {
                rules: [{ required: true, message: "请输入材质" }]
              })(<Input placeholder="请输入材质" />)}
            </FormItem>
            <FormItem label="出土信息:" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} className="form-item50 unearthed">
              {getFieldDecorator("unearthedInfo", {
                rules: [{ required: true, message: "请输入出土信息" }]
              })(<TextArea />)}
            </FormItem>
            <FormItem label="重量:" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} className="form-item50">
              {getFieldDecorator("weight", {
                rules: [{ required: true, message: "请输入重量" }]
              })(<Input placeholder="请输入重量" />)}
            </FormItem>
            <FormItem label="尺寸:" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} className="form-item50">
              {getFieldDecorator("size", {
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
const AddSilicition = Form.create()(AddSilicitionApp);
export default AddSilicition;