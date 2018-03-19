import React, { Component } from 'react';
import { Row, Col, Form, Icon, Input, Button  } from 'antd';
import Cookie from 'js-cookie';
// import { connect } from 'react-redux';
import VerifyCode from "../Components/VerificationCode";
import './index.less';
import { LoginApi, getUserIp } from "./api";
import { getIp } from '../../assets/js/getIp';

const FormItem = Form.Item;

class LoginForm extends Component {
  state = {
    verCode: '',
    loading: false,
    UserIp: ''
  };
  componentWillMount() {
    var RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection || window.msRTCPeerConnection;
    
    if (RTCPeerConnection) {
      getIp(ip => {
        this.setState({ UserIp: ip });
      });
    } else {
      getUserIp().then(res => {
        // console.log(res)
        var reg = /[^\(\)]+(?=\))/g;
        var result = res.match(reg)
        
        result = JSON.parse(result[0])
        // console.log(result.ip);
        this.setState({
          UserIp: result.ip
        })
      });
    }
      
  }
  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFields((err, value) => {
      if(!err) {
        console.log(value);
        this.setState({loading: true});
        const { UserIp } = this.state;
        console.log(UserIp)
        let userInfo = { strUser: value.userName, strPwd: value.password, ip: UserIp }

        LoginApi(userInfo).then(res => {
          console.log(res);
          // console.log(value);
          this.setState({loading:false});
          let Token = res[0].Ticket;
          let UserMenuItem = res[0].MyProperty;
          let UserName = value.userName;
          Cookie.set("UserInfo", {
            Token: Token,
            UserMenuItem: UserMenuItem,
            UserName: UserName
          }, {
            expires: 0.5
          });
          // Cookie.set('UserName', UserName);
          // let userAuth = JSON.stringify({ name: value.userName });
            // sessionStorage.setItem("user", userAuth);
            this.props.history.push("/App/Home");
            // console.log(Cookie.getJSON('UserInfo'));
            // console.log(Cookie.getJSON("UserName"));
        }).catch(err => {
          this.setState({loading:false});
          console.log(err);
        })

      }

    })
  }

  componentDidMount () {
    console.log(this.refs);
    
  }

  handleVerifyCode = (rule, value, callback) => {
    // console.log(rule, value);
    // const { getFieldValue } = this.props.form;
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