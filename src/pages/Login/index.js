import React, { Component } from 'react';
import { Form, Icon, Input, Button  } from 'antd';
import axios from 'axios';
import VerifyCode from "../Components/VerificationCode";

const FormItem = Form.Item;

class LoginForm extends Component {
  state = {
    ticket: 'AA43366BEA188F0C9B00907E9E22660603D6829EAE36C82B64719F5779D958EB27575838ADA2CF99CE98713D875EA3008E13A4420DED98CE357FA41EB14516BEB084BD6F08E915E3403C8D2602681018DF8CA43C01F3D997F39776F9F910A9E0FAB843BFF7D4E02302F61CC329A9DE8E'
  };
  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFields((err, value) => {
      if(!err) {
        console.log(value);
        axios.get('/api/User/LoginfoDesc', { headers: { 'Authorization': 'BasicAuth ' + this.state.ticket }}).then((res) => {
          console.log(res);
          this.props.history.push("/App/Home");
        }).catch((err) => { console.log(err) })
        
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
          <VerifyCode/>
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