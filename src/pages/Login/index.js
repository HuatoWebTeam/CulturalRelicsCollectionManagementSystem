import React, { Component } from 'react';
import { Row, Col, Form, Icon, Input, Button  } from 'antd';
import axios from 'axios';
import Cookie from 'js-cookie';
import { connect } from 'react-redux';
import VerifyCode from "../Components/VerificationCode";
import './index.less';
import { LoginApi } from './api';

const FormItem = Form.Item;

class LoginForm extends Component {
  state = {
    ticket: 'AA43366BEA188F0C9B00907E9E22660603D6829EAE36C82B64719F5779D958EB27575838ADA2CF99CE98713D875EA3008E13A4420DED98CE357FA41EB14516BEB084BD6F08E915E3403C8D2602681018DF8CA43C01F3D997F39776F9F910A9E0FAB843BFF7D4E02302F61CC329A9DE8E',
    verCode: '',
    loading: false
  };
  handleSubmit (e) {
    e.preventDefault();
    
    this.props.form.validateFields((err, value) => {
      if(!err) {
        console.log(value);
        this.setState({loading: true});
        let userInfo = { strUser: value.userName, strPwd: value.password }

        LoginApi(userInfo).then(res => {
          console.log(res);
          console.log(value);
          this.setState({loading:false});
          let Token = res[0].Ticket;
          let UserMenuItem = res[0].MyProperty;
          let UserName = value.userName;
          Cookie.set("UserInfo", {
            Token: Token,
            UserMenuItem: UserMenuItem,
            UserName: UserName
          });
          // Cookie.set('UserName', UserName);
          let userAuth = JSON.stringify({ name: value.userName });
            sessionStorage.setItem("user", userAuth);
            this.props.history.push("/App/Home");
            console.log(Cookie.getJSON('UserInfo'));
            // console.log(Cookie.getJSON("UserName"));
        }).catch(err => {
          this.setState({loading:false});
          console.log(err);
        })
        // axios
        //   .get("/Loginfo/Login", { params: { strUser: "admin", strPwd: "admin" } }, )
        //   .then(res => {
        //     console.log(res);
        //     // this.props.history.push("/App/Home");
            
        //     let userAuth = JSON.stringify({ name: value.userName });
        //     sessionStorage.setItem("user", userAuth);
        //     this.props.history.push("/App/Home");
        //   })
        //   .catch(err => {
        //     console.log(err);
        //   });
        

      }

    })
  }

  componentDidMount () {
    console.log(this.refs);
    
  }

  handleVerifyCode = (rule, value, callback) => {
    // console.log(rule, value);
    const { getFieldValue } = this.props.form;
    if (value.toLowerCase() !== this.state.verCode) {
      callback('验证码输入错误');
    };
    callback();
  }

  render() {
    // console.log(this.props);
    const { getFieldDecorator } = this.props.form;
    return <Row className="login-container">
        <Col span={24} className="login-background" />
        <Col span={24} className="login-form">
          <Form onSubmit={this.handleSubmit.bind(this)}>
            <FormItem>
              <Col span={24}>
                <h2 style={{ textAlign: "center" }}>用户登录</h2>
              </Col>
            </FormItem>
            <FormItem>
              {getFieldDecorator("userName", {
                rules: [{ required: true, message: "请输入用户名" }]
              })(<Input prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)", fontSize: "18px" }} />} placeholder="请输入用户名" />)}
            </FormItem>
            <FormItem>
              {getFieldDecorator("password", {
                rules: [{ required: true, message: "请输入密码" }]
              })(<Input prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)", fontSize: "18px" }} />} type="password" placeholder="请输入密码" />)}
            </FormItem>
            <FormItem>
              {getFieldDecorator("verifyCode", {
                rules: [
                  {
                    validator: this.handleVerifyCode
                  }
                ]
              })(<Input placeholder="请输入验证码" prefix={<Icon type="safety" style={{ color: "rgba(0,0,0,.25)", fontSize: "18px" }} />} style={{ width: "50%", marginRight: "15px" }} />)}

              <VerifyCode onChange={value => {
                  console.log(value);
                  this.setState({ verCode: value.toLowerCase() });
                }} height={40} width={120} />
            </FormItem>
            <FormItem>
              <Button htmlType="submit" type="primary" style={{ width: "100%", height: "40px" }}>
                登录
              </Button>
            </FormItem>
          </Form>
        </Col>
      </Row>;
  }
}
const Login = Form.create()(LoginForm);



export default Login;