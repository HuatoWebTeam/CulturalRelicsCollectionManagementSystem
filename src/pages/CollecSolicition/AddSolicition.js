import React, { Component } from 'react';
import { Row, Col, Form, Upload, Icon, Modal, Input, Select, DatePicker, Button, message } from 'antd';
import './index.less';
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
    const render = new FileReader();
    render.readAsDataURL(file);
    render.onload = e => {
      file.url = e.target.result;
      this.setState(({ fileList }) => ({
        fileList: [...fileList, file]
      }));
    };
    console.log(this.state);
    return true;
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
          添加征集信息
        </Col>
        <Col span={24} className="addSolicition-container">
          <Form layout="inline" style={{ width: "710px" }}>
            <FormItem label="文物图片:" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} style={{ width: "100%" }}>
              <Upload action="//jsonplaceholder.typicode.com/posts/" listType="picture-card" beforeUpload={this.beforeUpload} fileList={fileList}>
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
                rules: [{ required: true, message: "请选择征集时间" }]
              })(<DatePicker />)}
            </FormItem>
            <FormItem label="分级信息:" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} className="form-item50">
              {getFieldDecorator("levelInfo", {
                initialValue: 0,
                rules: [{ required: true, message: "请选择分级信息" }]
              })(<Select>
                  <Option value={0}>一级文物</Option>
                </Select>)}
            </FormItem>
            <FormItem label="数量:" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} className="form-item50">
              {getFieldDecorator("number", {
                rules: [{ required: true, message: "请输入数量" }]
              })(<Input />)}
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
              })(<Input />)}
            </FormItem>
            <FormItem label="出土信息:" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} className="form-item50 unearthed">
              {getFieldDecorator("unearthedInfo", {
                rules: [{ required: true, message: "请输入出土信息" }]
              })(<TextArea />)}
            </FormItem>
            <FormItem label="重量:" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} className="form-item50">
              {getFieldDecorator("weight", {
                rules: [{ required: true, message: "请输入重量" }]
              })(<Input />)}
            </FormItem>
            <FormItem label="尺寸:" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} className="form-item50">
              {getFieldDecorator("size", {
                rules: [{ required: true, message: "请输入尺寸" }]
              })(<Input />)}
            </FormItem>
            <FormItem style={{ width: "100%" }} wrapperCol={{ offset: 4 }}>
              <Button type="primary" htmlType='submit' >提交</Button>
            </FormItem>
          </Form>
        </Col>
      </Row>;
  }
}
const AddSilicition = Form.create()(AddSilicitionApp);
export default AddSilicition;