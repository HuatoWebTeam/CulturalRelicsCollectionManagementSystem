import React, { Component } from 'react';
import { Row, Col, Form, Icon, Input, Button  } from 'antd';
// import Cookie from 'js-cookie';
// import { connect } from 'react-redux';
import VerifyCode from "../Components/VerificationCode";
import './index.less';
import { LoginApi, getUserIp } from "./api";
import moment from 'moment';
import { getIp } from '../../assets/js/getIp';

const FormItem = Form.Item;

class LoginForm extends Component {
  state = {
    verCode: '',
    loading: false,
    UserIp: '',
    errorState: null,
    errorText: ''
  };
  componentWillMount() {
    var RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection || window.msRTCPeerConnection;
    
    if (RTCPeerConnection ) {
      getIp(ip => {
        // console.log('-----')
        console.log(ip)
        this.setState({ UserIp: ip });
      });
    } else {
      getUserIp().then(res => {
        // console.log(res)
        var reg = /[^()]+(?=\))/g;
        var result = res.match(reg)
        
        result = JSON.parse(result[0])
        console.log(result.ip);
        this.setState({
          UserIp: result.ip
        })
      });
    }
      
  }
  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFields((err, value) => {
      // console.log(err)
      if(!err) {
        // console.log(value);
        // if (value.verifyCode.toLowerCase() === this.state.verCode) {
          this.setState({ loading: true });
          const { UserIp } = this.state;
          // console.log(UserIp)
          let userInfo = { strUser: value.userName, strPwd: value.password, ip: UserIp };
          let _this = this;
          LoginApi(userInfo)
            .then(res => {
              console.log(res);
              // console.log(value);
              this.setState({ loading: false });
              if (res !== false) {
                // let Token = res[0].Ticket;
                let UserMenuItem = res.MyProperty;
                let UserName = value.userName;
                // Cookie.set("UserInfo", {
                //     UserMenuItem: UserMenuItem, UserName: UserName }, { expires: 0.5 });
                sessionStorage.setItem("UserInfo", JSON.stringify({
                    UserMenuItem: UserMenuItem,
                    UserName: UserName,
                    LoginTime: moment().format()
                }));
                let pushPath = "";
                if (UserMenuItem[0].subnode.length === 0) {
                  pushPath = UserMenuItem[0].ProjectModule_URL;
                } else {
                  pushPath = UserMenuItem[0].subnode[0].Functional__URl;
                }
                setTimeout(() => {
                  // console.log(Cookie.getJSON("UserInfo"));
                  _this.props.history.push(pushPath);
                }, 500);
              } else {
                this.props.form.setFields({
                  userName: {
                    value: value.userName,
                    errors: [new Error("用户名或密码错误")]
                  },
                  password: {
                    value: value.password,
                    errors: [new Error("用户名或密码错误")]
                  }
                });
              }
            })
            .catch(err => {
              _this.setState({ loading: false });
              console.log(err);
            });
        // } else {
        //   this.props.form.setFields({
        //     verifyCode: {
        //       value: value.verifyCode,
        //       errors: [new Error('请输入正确的验证码')]
        //     }
        //   });
        // }
        

      }

    })
  }

  componentDidMount () {
    // console.log(this.refs);
    
  }

  handleVerifyCode = (rule, value, callback) => {
    // console.log(rule, value);
    // console.log(value.length)
    // const { getFieldValue } = this.props.form;
    if(!value) {
      callback('请输入验证码')
    }else if (value && value.toLowerCase() !== this.state.verCode && value.length >= 4) {
      callback('验证码输入错误');
    } else if (value && value.length < 4) {
      callback('验证码输入错误')
    } else {
      callback()
    }
    
  }
  handleUserInfo = (rule, value, callback) => {
    if(!value) {
      callback('请输入用户名');
    } else {
      this.setState({
        errorState: null,
        errorText: ''
      });
      callback();
    }
  }
  handleUserPwdInfo = (rule, value, callback) => {
    // console.log(value)
    if(!value) {
      callback('请输入密码');
    } else {
      this.setState({ errorState: null, errorText: "" });
      callback();
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return <Row className="login-container">
        <Col span={24} className="login-background" />
        <Col span={24} className="login-form">
          <Form onSubmit={this.handleSubmit.bind(this)} className="form-content">
            <FormItem className="form-title">
              <h1>文物藏品综合管理系统</h1>
            </FormItem>
            <FormItem>
              <Col span={24}>
                <h2 style={{ textAlign: "center" }}>用户登录</h2>
              </Col>
            </FormItem>
            <FormItem>
              {getFieldDecorator("userName", {
                rules: [{ validator: this.handleUserInfo }]
              })(<Input onChange={(e) => {
                // console.log(e.target.value)
              }} prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)", fontSize: "18px" }} />} placeholder="请输入用户名" />)}
            </FormItem>
            <FormItem>
              {getFieldDecorator("password", {
                rules: [{ validator: this.handleUserPwdInfo }]
              })(<Input prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)", fontSize: "18px" }} />} type="password" placeholder="请输入密码" />)}
            </FormItem>
            <FormItem>
              {getFieldDecorator("verifyCode", {
                rules: [{ required: true, message: '请输入验证码' }]
              })(<Input placeholder="请输入验证码" prefix={<Icon type="safety" style={{ color: "rgba(0,0,0,.25)", fontSize: "18px" }} />} style={{ width: "50%", marginRight: "15px" }} />)}

              <VerifyCode onChange={value => {
                  // console.log(value);
                  this.setState({ verCode: value.toLowerCase() });
                }} height={40} width={120} />
            </FormItem>
            {/* <FormItem>
              <Input  />
            </FormItem> */}
            <FormItem>
              <Button htmlType="submit" type="primary" loading={this.state.loading} style={{ width: "100%", height: "40px" }}>
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