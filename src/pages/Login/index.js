import React, { Component } from 'react';
import { Form, Icon, Input, Button  } from 'antd';

const FormItem = Form.Item;

class Login extends Component {
    state = {  }
    render() {
        console.log(this.props)
        return (
           <Form onSubmit={this.handleSubmit} >
                
           </Form> 
        );
    }
}

export default Login;