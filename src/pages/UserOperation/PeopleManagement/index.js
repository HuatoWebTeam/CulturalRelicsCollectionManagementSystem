import React, { Component } from 'react';
import { Row, Col, Button, Table, Modal, Form, Input, Select, message } from 'antd';
import './index.less';
import { GetUserManageData, InsertUserManageData, UpdateUserManageData } from "./api";
import { GetRoleData } from '../WorkflowConfig/api';
const Option = Select.Option;

class PeopleManagementApp extends Component {
  state = {
    visible: false,
    modalTitle: "添加成员",
    peopleForm: {
      username: "",
      position: "",
      phone: null,
      password: "",
      useMember: 1
    },
    pageIndex: 1,
    pageSize: 10,
    total: 0,
    condition: "",
    userListTable: [],
    roleList: [],
    userId: null,
    isAdd: true // true 表示添加 ，false 表示编辑
  };
  componentWillMount() {
    this.getUserList();
  }

  // 获取用户列表
  getUserList() {
    const { pageIndex, pageSize, condition } = this.state;
    let params = {
      Condition: condition,
      PageIndex: pageIndex,
      PageSize: pageSize
    };
    GetUserManageData(params).then(res => {
      console.log(res);
      let userlist = res.Data;
      for (let item of userlist) {
        item.key = item.UserId;
      }
      this.setState({
        total: res.Total,
        userListTable: userlist
      });
    });
    GetRoleData().then(res => {
      console.log(res);
      this.setState({
        roleList: res.Data,
        peopleForm: {
          position: res.Data.length > 0 ? res.Data[0].RoleId : null,
          username: "",
          phone: null,
          password: "",
          useMember: 1
        }
      });
    });
  }
  // 点击添加成员
  addUserInfo = () => {
    const { roleList } = this.state;
    this.setState({
      visible: true,
      isAdd: true,
      modalTitle: '添加成员',
      peopleForm: {
        position: roleList.length > 0 ? roleList[0].RoleId : null,
        username: "",
        phone: null,
        password: "",
        useMember: 1
      }
    });
  };

  // 点击编辑函数
  updateUserInfo = value => {
    console.log(value);
    this.setState({
      visible: true,
      userId: value.UserId,
      modalTitle: '编辑成员',
      peopleForm: {
        username: value.UserName,
        position: value.RoleId,
        phone: value.UserPhone,
        password: value.UserPwd,
        useMember: Number(value.UserState)
      },
      isAdd: false,
      confirmDirty: false
    });
  };
  // 弹窗确定
  handleOk = () => {
    this.props.form.validateFields((err, value) => {
      if (!err) {
        console.log(value);
        const { isAdd } = this.state;
        if (isAdd) {
          let params = {
            UserName: value.username,
            UserPwd: value.password,
            UserPhone: value.phone,
            RoleId: value.position,
            UserState: value.state
          };
          InsertUserManageData(params).then(res => {
            console.log(res);
            if (res.State === 1) {
              message.success("添加成功");
              this.props.form.resetFields();
              this.setState({ visible: false });
              this.getUserList();
            } else if (res.State === 2) {
              message.error("用户名重复");
            }
          });
        } else {
          let params = {
            UserName: value.username,
            UserPwd: value.password,
            UserPhone: value.phone,
            RoleId: value.position,
            UserState: value.state,
            UserId: this.state.userId
          };
          UpdateUserManageData(params).then(res => {
            console.log(res);
            if (res.State === 1) {
              message.success("编辑成功");
              this.props.form.resetFields();
              this.setState({ visible: false });
              this.getUserList();
            } else if (res.State === 2) {
              message.error("用户名重复");
            }
          });
        }
      }
    });
    // this.setState({
    //   visible: false
    // });
  };

  // 弹窗取消
  handleCancel = () => {
    // const { roleList } = this.state;
    this.setState({
      visible: false
    });
    this.props.form.resetFields();
  };

  // 验证规则
  validatePhone = (rule, value, callback) => {
    if (
      value &&
      !/^(13[0-9]|14[5|7|9]|15[0|1|2|3|5|6|7|8|9]|16[6]|17[0|6|7|8]|18[0|1|2|3|4|5|6|7|8|9])\d{8}$/.test(
        value
      )
    ) {
      callback(new Error("请输入正确的联系电话"));
    }
    callback();
  };
  // 确认密码
  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    console.log(value);
    if (value && value !== form.getFieldValue("password")) {
      callback("两次输入的密码不同!");
    } else if (!this.state.isAdd && value === "") {
      callback();
    } else {
      callback();
    }
  };
  // 密码
  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(["confirm"], { force: true });
    }
    callback();
  };

  handleConfirmBlur = e => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  render() {
    const {
      visible,
      modalTitle,
      userListTable,
      peopleForm,
      roleList,
      isAdd
    } = this.state;
    const { getFieldDecorator } = this.props.form;
    const userColumns = [
      {
        title: "用户名",
        dataIndex: "UserName",
        key: "UserName"
      },
      {
        title: "职务",
        dataIndex: "RoleName",
        key: "RoleName"
      },
      {
        title: "联系方式",
        dataIndex: "UserPhone",
        key: "UserPhone"
      },
      {
        title: "用户状态",
        dataIndex: "UserState",
        key: "UserState",
        render: text => {
          // console.log(text)
          return <span>{Number(text) === 1 ? "启用" : "停用"}</span>;
        }
      },
      {
        title: "操作",
        dataIndex: "",
        key: "operation",
        render: text => {
          // console.log(text);
          return (
            <Button
              type="primary"
              onClick={this.updateUserInfo.bind(this, text)}
            >
              编辑
            </Button>
          );
        }
      }
    ];
    return (
      <Row className="main-content">
        <Col span={24} className="title">
          人员管理
        </Col>
        <Col span={24} style={{ padding: "20px" }}>
          <Col span={24} style={{ paddingBottom: "20px" }}>
            <Button type="primary" icon="plus" onClick={this.addUserInfo}>
              添加人员
            </Button>
          </Col>
          <Col span={24}>
            <Table dataSource={userListTable} columns={userColumns} bordered />
          </Col>
          <Modal
            onCancel={this.handleCancel}
            onOk={this.handleOk}
            visible={visible}
            title={modalTitle}
            className="people-content"
          >
            <Form layout="inline">
              <Form.Item
                label="用户名:"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 13 }}
              >
                {getFieldDecorator("username", {
                  initialValue: peopleForm.username,
                  rules: [{ required: true, message: "请输入用户名" }]
                })(<Input disabled={!isAdd} placeholder="请输入用户名" />)}
              </Form.Item>
              <Form.Item
                label="职位:"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 13 }}
              >
                {getFieldDecorator("position", {
                  initialValue: peopleForm.position,
                  rules: [{ required: true, message: "请选择用户职位" }]
                })(
                  <Select>
                    {roleList.map(item => (
                      <Option key={item.RoleId}> {item.RoleName}</Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
              <Form.Item
                label="电话:"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 13 }}
              >
                {getFieldDecorator("phone", {
                  initialValue: peopleForm.phone,
                  rules: [
                    { required: true, message: "请输入联系电话" },
                    {
                      validator: this.validatePhone
                    }
                  ]
                })(<Input placeholder="请输入联系电话" />)}
              </Form.Item>
              <Form.Item
                label="密码:"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 13 }}
              >
                {getFieldDecorator("password", {
                  initialValue: peopleForm.password,
                  rules: [
                    { required: true, message: "请输入密码" },
                    { validator: this.validateToNextPassword }
                  ]
                })(
                  <Input
                    onBlur={this.handleConfirmBlur}
                    disabled={!isAdd}
                    type="password"
                    placeholder="请输入密码"
                  />
                )}
              </Form.Item>
              <Form.Item
                label="确认密码:"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 13 }}
              >
                {getFieldDecorator("confirm", {
                  rules: [{ validator: this.compareToFirstPassword }]
                })(
                  <Input
                    disabled={!isAdd}
                    type="password"
                    placeholder="请输入确认密码"
                  />
                )}
              </Form.Item>
              <Form.Item
                label="成员状态:"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 13 }}
              >
                {getFieldDecorator("state", {
                  initialValue: peopleForm.useMember,
                  rules: [{ required: true, message: "请选择成员状态" }]
                })(
                  <Select>
                    <Option value={1}>启用成员</Option>
                    <Option value={0}>停用成员</Option>
                  </Select>
                )}
              </Form.Item>
            </Form>
          </Modal>
        </Col>
      </Row>
    );
  }
}
const PeopleManagement = Form.create()(PeopleManagementApp);
export default PeopleManagement;