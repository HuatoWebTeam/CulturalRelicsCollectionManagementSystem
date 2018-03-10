import React, { Component } from 'react';
import { Row, Col, Radio, Checkbox, Button, message } from 'antd';
import { UserAll, UserModAddApi } from './api';
import Cookie from 'js-cookie';
import './index.less';
const RadioGroup = Radio.Group;

class AssignPermissions extends Component {
  state = {
    UserId: 0,
    loginName: '',
    userList: [],
    userCheck: null,
    pageViewList: [],
    assignCheckedList: []
  };

  componentWillMount() {
    this.getUserList();
  }

  getUserList() {
    // 传入0 是获取全部用户 , 传入用户id 是获取对应的权限
    const { UserId } = this.state;
    let params = {
      User_Id: UserId
    };
    UserAll(params).then(res => {
      console.log(res);
      this.setState({
        userList: res
      });
    });
    let UserInfo = Cookie.getJSON("UserInfo");
    console.log(UserInfo);
    let LoginName = UserInfo.UserName;
    let UserPageALL = UserInfo.UserMenuItem;
    this.setState({
      pageViewList: UserPageALL,
      loginName: LoginName
    });
  }

  // 获取用户权限
  getUserAssign() {
    const { userCheck } = this.state;
    let params = {
      User_Id: userCheck
    };
    UserAll(params).then(res => {
      console.log(res);
      let data = [];
      for (let item of res) {
        data.push(item.Functional_Id);
      }
      this.setState({
        assignCheckedList: data
      });
    });
  }

  // radio改变
  RadioGroupChange = value => {
    this.setState(
      {
        userCheck: value.target.value
      },
      () => {
        this.getUserAssign();
      }
    );
  };

  // checkbox改变

  checkBoxChange = checkedList => {
    console.log(checkedList);
    this.setState({
      assignCheckedList: checkedList
    });
  };

  // 提交
  userAssignSubmit = () => {
    const { userList, userCheck, assignCheckedList, loginName } = this.state;
    let userName = '';
    for(let item of userList) {
      if(userCheck === item.User_Id) {
        userName = item.User_Name;
        break;
      }
    }
    let params = {
      TO__User_Id: userCheck,
      UserName: userName,
      RoleProjecModule_Name: loginName,
      RoleProjectModule_State: 1,
      Functional_Id: assignCheckedList.join(',')
    }
    UserModAddApi(params).then(res => {
      console.log(res)
      if(res === true) {
        message.success('添加成功')
      } else {
        message.error('添加失败')
      }
    })

  }

  render() {
    const { userList, userCheck, pageViewList, assignCheckedList } = this.state;
    return (
      <Row className="main-content">
        <Col span={24} className="title">
          权限分配
        </Col>
        <Col
          span={12}
          className="gutter-row assign-content"
          style={{ borderRight: "2px solid #ccc" }}
        >
          <Col span={24} className="assign-title">
            选择用户
          </Col>
          <Col span={24} className="assign-content">
            <RadioGroup onChange={this.RadioGroupChange} value={userCheck}>
              {userList.map((item, idx) => (
                <Radio value={item.User_Id} key={item.User_Id}>
                  {item.User_Name}
                </Radio>
              ))}
            </RadioGroup>
          </Col>
        </Col>
        <Col span={12} className="gutter-row assign-content">
          <Col span={24} className="assign-title">
            选择要分配的权限
          </Col>
          <Col span={24} className="assign-content">
            <Checkbox.Group
              value={assignCheckedList}
              onChange={this.checkBoxChange}
            >
              {pageViewList.map(
                (item, idx) =>
                  item.subnode.length === 0 ? (
                    <Col
                      className="assign-checkbox"
                      span={8}
                      key={item.ProjectModule_Id}
                    >
                      <Checkbox value={item.ProjectModule_Id}>
                        {item.ProjectModule_Name}
                      </Checkbox>
                    </Col>
                  ) : (
                    <Col span={24} key={item.ProjectModule_Id}>
                      <Col span={24}>
                        <h3>{item.ProjectModule_Name}</h3>
                      </Col>
                      {item.subnode.map((value, idx) => (
                        <Col
                          span={8}
                          className="assign-checkbox"
                          key={value.Functional_Id}
                        >
                          <Checkbox value={value.Functional_Id}>
                            {value.Functional_Name}
                          </Checkbox>
                        </Col>
                      ))}
                    </Col>
                  )
              )}
            </Checkbox.Group>
            <Col span={24} style={{ textAlign: "right", paddingRight: "40px" }}>
              <Button type="primary" onClick={this.userAssignSubmit}>
                提交
              </Button>
            </Col>
          </Col>
        </Col>
      </Row>
    );
  }
}

export default AssignPermissions;