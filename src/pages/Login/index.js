import React, { Component } from 'react';
import { Form, Icon, Input, Button  } from 'antd';

const FormItem = Form.Item;

class LoginForm extends Component {
  state = {};
  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFields((err, value) => {
      if(!err) {
        console.log(value);
        this.props.history.push('/App/Home');
      }
    })
  }
  render() {
    console.log(this.props);
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit.bind(this)}>
        <FormItem>
          {getFieldDecorator("userName", {
            rules: [{ required: true, message: "请输入用户名" }]
          })(<Input placeholder="用户名" />)}
        </FormItem>
        <FormItem>
          {getFieldDecorator("password", {
            rules: [{ required: true, message: "请输入密码" }]
          })(<Input type="password" placeholder="密码" />)}
        </FormItem>
        <FormItem>
          <Button htmlType="submit" type="primary">
            登录
          </Button>
        </FormItem>
      </Form>
    );
  }
}
const Login = Form.create()(LoginForm);
export default Login;