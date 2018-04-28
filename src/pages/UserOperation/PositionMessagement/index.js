import React, { Component } from 'react';

import { Row, Col, Table, Input, message, Button } from 'antd';
import { GetRoleData } from "../WorkflowConfig/api";
import { AddRoleData, UpdateRoleData, DeleteRoleData } from "./api";

// 编辑单元格
const EditableCell = ({ editable, value, onChange }) => (
  <div>
    {editable ? (
      <Input
        style={{ margin: "-5px 0" }}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    ) : (
      value
    )}
  </div>
);

class PositionMessage extends Component {
  state = {
    data: [],
    addRoleName: null // 新增的职位名称
  };

  componentWillMount() {
    this.getRoleDataList();
  }
  getRoleDataList() {
    GetRoleData().then(res => {
      console.log(res);
      if (res.Data) {
        this.setState({
          data: res.Data.map(item => ({ ...item, key: item.RoleId }))
        });
        this.cacheData = res.Data.map(item => ({ ...item }));
      }
    });
  }
  renderColumns(text, record, column) {
    return (
      <EditableCell
        editable={record.editable}
        value={text}
        onChange={value => this.handleChange(value, record.key, column)}
      />
    );
  }
  handleChange(value, key, column) {
    const newData = [...this.state.data];
    const target = newData.filter(item => key === item.key)[0];
    if (target) {
      target[column] = value;
      this.setState({ data: newData });
    }
  }
  edit(key) {
    const newData = [...this.state.data];
    const target = newData.filter(item => key === item.key)[0];
    if (target) {
      target.editable = true;
      this.setState({ data: newData });
    }
  }
  save(key) {
    const newData = [...this.state.data];
    const target = newData.filter(item => key === item.key)[0];
    if (target) {
      console.log(target);
      let params = {
        roleTable: {
          RoleId: target.RoleId,
          RoleName: target.RoleName
        }
      };
      UpdateRoleData(params).then(res => {
        console.log(res);
        if(res.Msg === "操作成功!") {
          message.success('编辑成功');
          delete target.editable;
          this.setState({ data: newData });
          this.cacheData = newData.map(item => ({ ...item }));
          this.getRoleDataList();
        } else if (res.Msg === "职位已存在！") {
          message.error("职位已存在");
        } else {
          message.error('编辑失败')
        }
      });
        
    }
  }
  cancel(key) {
    const newData = [...this.state.data];
    const target = newData.filter(item => key === item.key)[0];
    if (target) {
      Object.assign(target, this.cacheData.filter(item => key === item.key)[0]);
      delete target.editable;
      this.setState({ data: newData });
    }
  }

  //输入框事件
  inputChange = e => {
    this.setState({ addRoleName: e.target.value });
  };

  // 添加职位、
  postPositionInfo = () => {
    const { addRoleName } = this.state;
    let params = {
      RoleName: addRoleName
    };
    AddRoleData(params).then(res => {
      console.log(res);
      if (res.Msg === "操作成功!") {
        message.success("新增职位成功");
        this.getRoleDataList();
        this.setState({
          addRoleName: null
        });
      } else if (res.Msg === "职位已存在！") {
        message.error("该职位已存在");
      } else {
        message.error("新增职位失败");
      }
    });
  };

  // 删除职位
  deletePosition = (key) => {
    let params = {
      RoleId: Number(key)
    }
    DeleteRoleData(params).then(res => {
      console.log(res);
      if(res.Msg === "操作成功!") {
        message.success('删除成功');
        this.getRoleDataList();
      } else {
        message.error('删除失败')
      }
    })
  }

  render() {
    const { data } = this.state;
    const columns = [
      {
        title: "职位",
        dataIndex: "RoleName",
        key: "RoleName",
        render: (text, record) => this.renderColumns(text, record, "RoleName")
      },
      {
        title: "操作",
        dataIndex: "operation",
        key: "operation",
        render: (text, record) => {
          const { editable } = record;
          return (
            <div className="editable-row-operations">
              {editable ? (
                <span>
                  <a onClick={() => this.save(record.key)}>保存</a>
                  {/* <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.key)}>
                        <a>Cancel</a>
                    </Popconfirm> */}
                  <a
                    onClick={() => this.cancel(record.key)}
                    style={{ marginLeft: "10px" }}
                  >
                    取消
                  </a>
                </span>
              ) : (
                <span>
                  <a onClick={() => this.edit(record.key)}>编辑</a>
                  <a style={{marginLeft: '20px'}} onClick={() => this.deletePosition(record.key)}>删除</a>
                </span>
              )}
            </div>
          );
        }
      }
    ];
    return (
      <Row className="main-content">
        <Col className="title">职位管理</Col>
        <Col span={24} style={{ padding: "20px" }}>
          <Col span={12} style={{ display: "table-cell" }}>
            <Table
              dataSource={data}
              columns={columns}
              pagination={false}
              bordered
            />
          </Col>
          <Col
            span={12}
            style={{
              paddingLeft: "20px",
              height: "100%",
              display: "table-cell"
            }}
          >
            <Col
              span={24}
              style={{ border: "1px solid #e8e8e8", height: "216px" }}
            >
              <Col
                span={24}
                style={{
                  height: "54px",
                  lineHeight: "54px",
                  textAlign: "center",
                  background: "#fafafa"
                }}
              >
                新增职位
              </Col>
              <Col span={24} style={{ padding: "10px 20px " }}>
                <span>职位名称：</span>
                <Input
                  style={{ width: "200px" }}
                  onChange={this.inputChange}
                  placeholder="请输入职位名称"
                />
              </Col>
              <Col span={24} style={{ padding: "30px 20px " }}>
                <Button type="primary" onClick={this.postPositionInfo}>
                  提交
                </Button>
              </Col>
            </Col>
          </Col>
        </Col>
      </Row>
    );
  }
}

export default PositionMessage;