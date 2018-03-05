import React, { Component } from 'react';
import { Row, Col, Form, Upload, Icon, Modal, Input, Select, DatePicker, Button, message } from 'antd';
import './index.less';
const FormItem = Form.Item;
const Option = Select.Option;

class AddSilicition extends Component {
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
    // this.setState({fileList});
    console.log(fileList);
  };

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    return (
      <Row className="main-content">
        <Col span={24} className="title">
          添加信息
        </Col>
        <Col span={24} className="addComplexInfo-container">
          <Form layout="inline" style={{ width: "710px" }}>
            <FormItem
              label="文物图片:"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              style={{ width: "100%" }}
            >
              <Upload
                action="//jsonplaceholder.typicode.com/posts/"
                listType="picture-card"
                fileList={fileList}
                beforeUpload={this.beforeUpload}
              >
                {fileList.length >= 3 ? null : uploadButton}
              </Upload>
              <Modal
                visible={previewVisible}
                footer={null}
                onCancel={this.handleCancel}
              >
                <img
                  alt="upload"
                  src={previewImage}
                  style={{ width: "100%" }}
                />
              </Modal>
            </FormItem>
            <FormItem
              label="文物名称"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              className="form-item50"
            >
              <Input />
            </FormItem>
            <FormItem
              label="RFID标签:"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              className="form-item50"
            >
              <Input />
            </FormItem>
            <FormItem
              label="征集时间:"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              className="form-item50"
            >
              <DatePicker />
            </FormItem>
            <FormItem
              label="分级信息:"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              className="form-item50"
            >
              <Select>
                <Option value="0">一级文物</Option>
              </Select>
            </FormItem>
            <FormItem
              label="数量:"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              className="form-item50"
            >
              <Input />
            </FormItem>
            <FormItem
              label="类别:"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              className="form-item50"
            >
              <Select>
                <Option value="0">青铜器</Option>
              </Select>
            </FormItem>
            <FormItem
              label="材质:"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              className="form-item50"
            >
              <Input />
            </FormItem>
            <FormItem
              label="重量:"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              className="form-item50"
            >
              <Input />
            </FormItem>
            <FormItem
              label="尺寸:"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              className="form-item50"
            >
              <Input />
            </FormItem>
            <FormItem style={{ width: "100%" }} wrapperCol={{ offset: 4 }}>
              <Button type="primary">提交</Button>
            </FormItem>
          </Form>
        </Col>
      </Row>
    );
  }
}

export default AddSilicition;