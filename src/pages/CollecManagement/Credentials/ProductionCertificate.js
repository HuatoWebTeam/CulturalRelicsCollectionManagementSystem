import React, { Component } from 'react';
import { Row, Col, Form, Input, Select, DatePicker, Button } from 'antd';
import './index.less';
import { CollectionCertification } from './api';
const FormItem = Form.Item;
const Option = Select.Option;

class ProductionCertificateApp extends Component {
    state = {  }

    handleSubmit (e) {
       e.preventDefault();
       this.props.form.validateFields((err, fieldsValue) => {
         if (!err) {
           const values = { ...fieldsValue, 'date': fieldsValue['date'].format("YYYY-MM-DD") };
           console.log(values);
           // this.props.history.push("/App/Home");
           let params = {
             collection: {
               CollectionNumber: values.relicsNum,
               CollectionRfid: values.rfid,
               Number: values.number
             }
           }
           CollectionCertification(params).then(res => {
             console.log(res);
           })
         }
       });
    }

    render() {
        // console.log(this.props);
        const { getFieldDecorator } = this.props.form;
        return <Row className="main-content">
            <Col className="title">
              凭证制作 <div className='go-back' onClick={() => { this.props.history.goBack() }} ></div>
              
            </Col>
            <Col span={24} className="certificate-form">
              <Form layout="inline" onSubmit={this.handleSubmit.bind(this)} style={{ width: "710px" }}>
                <FormItem label="RFID:" labelCol={{ span: 8 }}>
                  {getFieldDecorator("rfid", {
                    rules: [{ required: true, message: "请输入RFID号" }]
                  })(<Input />)}
                </FormItem>
                {/* <FormItem label="文物名称:" labelCol={{ span: 8 }}>
                  {getFieldDecorator("relicsName", {
                    rules: [
                      { required: true, message: "请输入文物名称" }
                    ]
                  })(<Input />)}
                </FormItem> */}
                <FormItem label="文物编号:" labelCol={{ span: 8 }}>
                  {getFieldDecorator("relicsNum", {
                    rules: [
                      { required: true, message: "请输入文物编号" }
                    ]
                  })(<Input />)}
                </FormItem>
                <FormItem label="文物数量:" labelCol={{ span: 8 }}>
                  {getFieldDecorator("number", {
                    rules: [
                      { required: true, message: "请输入文物数量" }
                    ]
                  })(<Input />)}
                </FormItem>
                {/* <FormItem label="分级信息:" labelCol={{ span: 8 }}>
                  {getFieldDecorator("levelInfo", {
                    rules: [
                      { required: true, message: "请选择分级信息" }
                    ]
                  })(<Select>
                      <Option value="0">新增入库</Option>
                    </Select>)}
                </FormItem>
                <FormItem label="文物状态:" labelCol={{ span: 8 }}>
                  {getFieldDecorator("relicsState", {
                    rules: [
                      { required: true, message: "请选择文物状态" }
                    ]
                  })(<Input />)}
                </FormItem>
                <FormItem label="入馆时间:" labelCol={{ span: 8 }}>
                  {getFieldDecorator("date", {
                    rules: [{ required: true, message: "请选择时间" }]
                  })(<DatePicker />)}
                </FormItem>
                <FormItem label="年代:" labelCol={{ span: 8 }}>
                  {getFieldDecorator("years", {
                    rules: [{ required: true, message: "请选择年代" }]
                  })(<Input />)}
                </FormItem>
                <FormItem label="材质:" labelCol={{ span: 8 }}>
                  {getFieldDecorator("material", {
                    rules: [{ required: true, message: "请输入材质" }]
                  })(<Input />)}
                </FormItem>
                <FormItem label="类别:" labelCol={{ span: 8 }}>
                  {getFieldDecorator("categoey", {
                    rules: [{ required: true, message: "请选择类别" }]
                  })(<Input />)}
                </FormItem>
                <FormItem label="重量:" labelCol={{ span: 8 }}>
                  {getFieldDecorator("weight", {
                    rules: [{ required: true, message: "请输入重量" }]
                  })(<Input />)}
                </FormItem>
                <FormItem label="完整程度:" labelCol={{ span: 8 }}>
                  {getFieldDecorator("howComplete", {
                    rules: [
                      { required: true, message: "请选择完整程度" }
                    ]
                  })(<Input />)}
                </FormItem>
                <FormItem label="尺寸:" labelCol={{ span: 8 }}>
                  {getFieldDecorator("size", {
                    rules: [{ required: true, message: "请输入尺寸" }]
                  })(<Input />)}
                </FormItem> */}
                <FormItem style={{ width: "100%" }} wrapperCol={{ offset: 4 }}>
                  <Button type="primary" htmlType="submit">
                    绑定制作
                  </Button>
                </FormItem>
              </Form>
            </Col>
          </Row>;
    }
}
const ProductionCertificate = Form.create()(ProductionCertificateApp);
export default ProductionCertificate;