import React, { Component } from 'react';
import { Row, Col, Form, Input, Upload, Modal, Icon, Select, Button, message, DatePicker } from 'antd';
import './index.less';
const FormItem = Form.Item;
const Option = Select.Option;

class AddRelicsApp extends Component {
    state = {  
        previewVisible: false,   // 预览
        previewImage: '',        // 预览的图片url
        fileList: [],            // 图片列表
    }

    // 点击预览
    handlePreview = (file) => {
        console.log(file);
        this.setState({
          previewImage: file.url || file.thumbUrl,
          previewVisible: true
        });
    }
    // 上传图片之前的钩子
    beforeUpload = (file) => {
        console.log(file);
        const isLt3M = file.size / 1024 /1024 < 3;
        
        if(!isLt3M) {
            message.error('请选择小于3M的图片!!!');
            return false;
            
        }
        const render = new FileReader();
        render.readAsDataURL(file);
        render.onload = (e) => {
          file.url = e.target.result;
          this.setState(({fileList}) => ({
            fileList: [...fileList, file],
          }))
        }
        console.log(this.state);
        return true;
    }
    // 选择图片之后
    handleChange = ({fileList}) => {
      // this.setState({fileList});
      console.log(fileList);
      };

    // 关闭预览
    handleCancel = () => this.setState({ previewVisible: false});
    // 提交
    handleSubmit (e) {
        e.preventDefault();
        this.props.form.validateFields((err, value) => {
          if (!err) {
            console.log(value);
            // this.props.history.push("/App/Home");
          }
        });
    }

    render() {

        const { getFieldDecorator } = this.props.form;
        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
            <div>
                <Icon type='plus' />
                <div className='ant-upload-text' >Upload</div>
            </div>
        );
        return <Row className="main-content">
            <Col span={24} className="title">
              新增藏品
            </Col>
            <Col span={24} style={{ padding: "40px 100px" }} className="add-relics">
              <Form layout="inline" style={{ width: "710px" }} onSubmit={this.handleSubmit.bind(this)}>
                <FormItem label="文物图片" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} style={{ width: "100%" }}>
                  <Upload action="//jsonplaceholder.typicode.com/posts/" listType="picture-card" fileList={fileList} beforeUpload={this.beforeUpload} onPreview={this.handlePreview} onChange={this.handleChange}>
                    {fileList.length >= 3 ? null : uploadButton}
                  </Upload>
                  <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="预览" src={previewImage} style={{ width: "100%" }} />
                  </Modal>
                  <span style={{ color: "#666" }}>
                    *上传图片最大不能超过3m,最多可上传3张图片
                  </span>
                </FormItem>
                <FormItem className="form-width50" label="文物名称:" labelCol={{ span: 8 }}>
                  {getFieldDecorator("relicsName", {
                    rules: [
                      { required: true, message: "请输入文物名称" }
                    ]
                  })(<Input placeholder="请输入文物名称" />)}
                </FormItem>
                <FormItem className="form-width50" label="入库类型:" labelCol={{ span: 8 }}>
                  {getFieldDecorator("type", {
                    initialValue: 0,
                    rules: [
                      { required: true, message: "请选择文物类型" }
                    ]
                  })(<Select>
                      <Option value={0}>新增入库</Option>
                    </Select>)}
                </FormItem>
                <FormItem className="form-width50" label="RFID标签:" labelCol={{ span: 8 }}>
                  {getFieldDecorator("rfid", {
                    rules: [
                      { required: true, message: "请输入RFID标签" }
                    ]
                  })(<Input placeholder="请输入RFID标签" />)}
                </FormItem>
                <FormItem className="form-width50" label="存台箱号:" labelCol={{ span: 8 }}>
                  {getFieldDecorator("carton", {
                    initialValue: 0,
                    rules: [
                      { required: true, message: "请选择存台箱号" }
                    ]
                  })(<Select>
                      <Option value={0}>新增入库</Option>
                    </Select>)}
                </FormItem>
                <FormItem className="form-width50" label="文物编号:" labelCol={{ span: 8 }}>
                  {getFieldDecorator("relicsNum", {
                    rules: [
                      { required: true, message: "请输入文物编号" }
                    ]
                  })(<Input placeholder="请输入文物编号" />)}
                </FormItem>
                <FormItem className="form-width50" label="分级信息:" labelCol={{ span: 8 }}>
                  {getFieldDecorator("levalInfo", {
                    initialValue: 0,
                    rules: [
                      { required: true, message: "请选择分级信息" }
                    ]
                  })(<Select>
                      <Option value={0}>普通藏品</Option>
                      <Option value={1}>一级文物</Option>
                    </Select>)}
                </FormItem>
                <FormItem className="form-width50" label="文物数量:" labelCol={{ span: 8 }}>
                  {getFieldDecorator("number", {
                    rules: [
                      { required: true, message: "请输入文物数量" }
                    ]
                  })(<Input placeholder="请输入文物数量" />)}
                </FormItem>
                <FormItem className="form-width50" label="文物状态:" labelCol={{ span: 8 }}>
                  {getFieldDecorator("relicsState", {
                    initialValue: 0,
                    rules: [
                      { required: true, message: "请选择文物状态" }
                    ]
                  })(<Select>
                      <Option value={0}>馆内自藏品</Option>
                      <Option value={1}>新增入库</Option>
                    </Select>)}
                </FormItem>
                <FormItem className="form-width50" label="入馆时间:" labelCol={{ span: 8 }}>
                  {getFieldDecorator("date", {
                    rules: [
                      { required: true, message: "请选择入馆时间" }
                    ]
                  })(<DatePicker />)}
                </FormItem>
                <FormItem className="form-width50" label="年代:" labelCol={{ span: 8 }}>
                  {getFieldDecorator("relicsYears", {
                    initialValue: 0,
                    rules: [
                      { required: true, message: "请选择文物年代" }
                    ]
                  })(<Select>
                      <Option value={0}>唐</Option>
                      <Option value={1}>宋</Option>
                    </Select>)}
                </FormItem>
                <FormItem className="form-width50" label="材质:" labelCol={{ span: 8 }}>
                  {getFieldDecorator("material", {
                    rules: [
                      { required: true, message: "请输入文物材质" }
                    ]
                  })(<Input placeholder="请输入文物材质" />)}
                </FormItem>
                <FormItem className="form-width50" label="类别:" labelCol={{ span: 8 }}>
                  {getFieldDecorator("category", {
                    initialValue: 0,
                    rules: [
                      { required: true, message: "请选择文物类别" }
                    ]
                  })(<Select>
                      <Option value={0}>新增入库</Option>
                    </Select>)}
                </FormItem>
                <FormItem className="form-width50" label="重量:" labelCol={{ span: 8 }}>
                  {getFieldDecorator("weight", {
                    rules: [
                      { required: true, message: "请输入文物重量" }
                    ]
                  })(<Input placeholder="请输入文物重量" />)}
                </FormItem>
                <FormItem className="form-width50" label="完整程度:" labelCol={{ span: 8 }}>
                  {getFieldDecorator("howComplete", {
                    initialValue: 0,
                    rules: [
                      { required: true, message: "请选择完整程度" }
                    ]
                  })(<Select>
                      <Option value={0}>破损</Option>
                      <Option value={1}>完整</Option>
                    </Select>)}
                </FormItem>
                <FormItem className="form-width50" label="尺寸:" labelCol={{ span: 8 }}>
                  {getFieldDecorator("size", {
                    rules: [
                      { required: true, meaage: "请输入文物尺寸" }
                    ]
                  })(<Input placeholder='请输入文物尺寸' />)}
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
const AddRelics = Form.create()(AddRelicsApp);
export default AddRelics;