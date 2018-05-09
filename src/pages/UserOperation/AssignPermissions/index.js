import React, { Component } from 'react';
import { Row, Col, Radio, Checkbox, Button, message, Input, Collapse, Modal } from 'antd';
import { UserAll, UserModAddApi } from './api';
// import Cookie from 'js-cookie';
import { UserModApi } from './api';
import './index.less';
const RadioGroup = Radio.Group;
const Search = Input.Search;
const Panel = Collapse.Panel;
const confirm = Modal.confirm;

class AssignPermissions extends Component {
  state = {
    UserId: 0,
    loginName: "",
    userList: [],
    allUserList: [],
    searchUserList: [],
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
        allUserList: res,
        userList: res
      });
    });
    let UserInfo = JSON.parse(sessionStorage.getItem("UserInfo"));
    console.log(UserInfo);
    let LoginName = UserInfo.UserName;
    // let UserPageALL = UserInfo.UserMenuItem;
    // let menuParams = {
    //   strUser: null,
    //   strPwd: null,
    //   ip: null
    // };
    UserModApi().then(res => {
      console.log(res);
      this.setState({
        pageViewList: res,
        loginName: LoginName
      });
    })
    
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
    let userName = "";
    for (let item of userList) {
      if (userCheck === item.User_Id) {
        userName = item.User_Name;
        break;
      }
    }
    let params = {
      TO__User_Id: userCheck,
      UserName: userName,
      RoleProjecModule_Name: loginName,
      RoleProjectModule_State: 1,
      Functional_Id: assignCheckedList.join(",")
    };
    // let _this = this;
    UserModAddApi(params).then(res => {
      console.log(res);
      if (res === true) {
        if(userName === loginName) {
          this.showConfirm();
        } else {
          message.success("添加成功, 请通知用户重新登录");
        }
        
      } else {
        message.error("添加失败");
      }
    });
  };
  // 搜索用户名
  onSearchUserName = (value) => {
    const { allUserList } = this.state;
    console.log(value);
    let arr = [];
    for(let item of allUserList) {
      if(item.User_Name.indexOf(value) >= 0) {
        arr.push(item);
      }
    };
    this.setState({ userList: arr });
  };

  // 添加成功后，弹窗
  showConfirm = () => {
    let _this = this;
    confirm({
      title: '',
      content: '添加成功，请重新登录！！！',
      onOk () {
        console.log('remove')
        sessionStorage.removeItem("UserInfo");
        setTimeout(() => {
          _this.props.history.push("/login");
        }, 500);
      },
      onCancel() {

      }
    })
  }

  render() {
    const { userList, userCheck, pageViewList, assignCheckedList } = this.state;
    return <Row className="main-content">
        <Col span={24} className="title">
          权限分配设置
        </Col>
        <Col span={5} className="gutter-row assign-content" style={{ paddingRight: "20px" }}>
          <Col span={24} className="assign-title">
            <Col span={24} className="assign-contents">
              <Col span={24} style={{ padding: "0 20px 20px " }}>
                <Search placeholder="请输入用户名" enterButton onSearch={this.onSearchUserName} />
              </Col>
              <Col span={24}>
                <Collapse defaultActiveKey={["1"]}>
                  <Panel header="用户" key="1" style={{ borderRadius: "0" }}>
                    <RadioGroup onChange={this.RadioGroupChange} value={userCheck}>
                      {userList.map((item, idx) => (
                        <Radio value={item.User_Id} key={item.User_Id}>
                          {item.User_Name}
                        </Radio>
                      ))}
                    </RadioGroup>
                  </Panel>
                </Collapse>
              </Col>
            </Col>
          </Col>
        </Col>
        <Col span={19} className="gutter-row-right ">
          <Col span={24} className="container">
            <Col span={24} className="assign-title">
              选择要分配的权限
            </Col>
            <Col span={24} className="assign-contents">
              <Checkbox.Group value={assignCheckedList} onChange={this.checkBoxChange}>
                {pageViewList.map((item, idx) => (item.menusAll.length === 0 ? <Col className="assign-checkbox" span={8} key={item.ProjectModule_Id}>
                        <Checkbox value={Number(item.ProjectModule_Id)}>
                          {item.ProjectModule_Name}
                        </Checkbox>
                      </Col> : <Col span={24} className="child-checkbox" key={item.ProjectModule_Id}>
                        <Col span={24}>
                          <h4>{item.ProjectModule_Name}</h4>
                        </Col>
                        {item.menusAll.map((value, idx) => (
                          <Col
                            span={8}
                            className="assign-checkbox"
                            key={value.Functional_Id}
                          >
                            <Checkbox value={Number(value.Functional_Id)}>
                              {value.Functional_Name}
                            </Checkbox>
                          </Col>
                        ))}
                      </Col>))}
              </Checkbox.Group>
            </Col>
          </Col>
          <Col span={24} style={{ textAlign: "right", paddingRight: "40px", paddingTop: "20px" }}>
            <Button type="primary" onClick={this.userAssignSubmit}>
              提交
            </Button>
          </Col>
        </Col>
      </Row>;
  }
}

export default AssignPermissions;