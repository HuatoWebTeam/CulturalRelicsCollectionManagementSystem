import React, { Component } from 'react';
import { Modal, Form, Input, } from 'antd';

class ChangePwdApp extends Component {
  state = {
    oldPassword: null,
    newPassword: null,
    confirmPwd: null,
    errorState: null, // 原始密码错误状态
    errorText: null,
    confirmState: null, // 确认密码错误
    confirmState: null,
    confirmDirty: false
  };

  handleConfirmBlur = e => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };
  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue("newpwd")) {
      callback("两次输入的密码不同!");
    } else {
      callback();
    }
  };
  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(["conrimpwd"], { force: true });
    }
    callback();
  };

  render() {
    const { errorState, errorText, confirmState, confirmText } = this.state;
    // console.log(this.props);
    const { getFieldDecorator } = this.props.form;
    return (
      <Form>
        <Form.Item
          label="原始密码:"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
        >
          {getFieldDecorator("oldpwd", {
            rules: [{ required: true, message: "请输入原始密码" }]
          })(<Input placeholder="请输入原始密码" />)}
        </Form.Item>
        <Form.Item
          label="新密码:"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
        >
          {getFieldDecorator("newpwd", {
            rules: [
              { required: true, message: "请输入新密码" },
              {
                validator: this.validateToNextPassword
              }
            ]
          })(
            <Input type='password' onBlur={this.handleConfirmBlur} placeholder="请输入新密码" />
          )}
        </Form.Item>
        <Form.Item
          label="确认密码:"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
        >
          {getFieldDecorator("conrimpwd", {
            rules: [
              { required: true, message: "请确认密码" },
              {
                validator: this.compareToFirstPassword
              }
            ]
          })(<Input type='password' placeholder="请确认新密码" />)}
        </Form.Item>
      </Form>
    );
  }
}

const ChangePwd = Form.create()(ChangePwdApp);

export default ChangePwd;