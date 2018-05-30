import React, { Component } from "react";

import { Col, Row, Button, Input, Table, message, Modal } from "antd";
import { GetMethodAll, DeleteMethod } from "./api";
import { connect } from 'react-redux';
const { Search } = Input;
const confirm = Modal.confirm;

class RepairMethod extends Component {
  state = {
    pageIndex: 1,
    pageSize: 10,
    total: 0,
    searchName: "",
    methodList: []
  };
  componentWillMount() {
    let page = this.props.pageIndex;
    this.setState(
      {
        pageIndex: page
      },
      () => {
        this.getRepairMethod();
      }
    );
  }

  getRepairMethod = () => {
    const { pageIndex, pageSize, searchName } = this.state;
    let params = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      Name: searchName
    };
    GetMethodAll(params).then(res => {
      console.log(res);
      if (res.length === 0) {
        this.setState({
          methodList: [],
          total: 0
        });
        return;
      }
      for (let item of res) {
        item.key = item.Method_Id;
      }
      this.setState({
        methodList: res,
        total: res[0].cou
      });
    });
  };
  // 对话框   // 删除
  showConfirm = id => {
    let _this = this;
    confirm({
      title: "确定删除?",
      content: "",
      onOk() {
        // console.log(text);
        let params = {
          Id: id
        };
        DeleteMethod(params).then(res => {
          if (res === "True") {
            message.success("删除成功");
            _this.getRepairMethod();
          } else {
            message.error("删除失败");
          }
        });
      },
      onCancel() {
        console.log("Cancel");
      }
    });
  };


  // 搜索
  searchData = value => {
    this.setState(
      {
        pageIndex: 1,
        searchName: value
      },
      () => {
        this.getRepairMethod();
      }
    );
  };

  // 改变分页
  paginationChange = page => {
    this.setState(
      {
        pageIndex: page
      },
      () => {
        this.getRepairMethod();
        this.props.changePageIndex(page);
      }
    );
  };

  render() {
    const { pageIndex, pageSize, total, methodList } = this.state;
    const columns = [
      {
        title: "修复方法名称",
        dataIndex: "Method_Name"
      },
      {
        title: "使用修复材料",
        dataIndex: "Material_Name"
      },
      {
        title: "参考示意图",
        dataIndex: "img",
        render: (text, record) => {
          return (
            <span>
              <img
                src={record.Material_SketchMap}
                alt="修复前"
                style={{ width: "50px", height: "50px", marginRight: "20px" }}
              />
              <img
                src={record.Material_SketchMaps}
                alt="修复后"
                style={{ width: "50px", height: "50px" }}
              />
            </span>
          );
        }
      },
      {
        title: "提交人",
        dataIndex: "Material_Submitter"
      },
      {
        title: "操作",
        dataIndex: "operation",
        render: (text, record) => {
          return (
            <span>
              <Button
                type="button"
                style={{ border: "none", marginRight: "10px" }}
                onClick={() => {
                  this.props.changeFormData({
                    state: "编辑修复方法",
                    formData: record
                  });
                  this.props.history.push("/App/NewRepairMethod");
                }}
              >
                编辑
              </Button>
              <Button
                type="button"
                onClick={this.showConfirm.bind(this, record.Method_Id)}
                style={{ border: "none" }}
              >
                删除
              </Button>
            </span>
          );
        }
      }
    ];

    return (
      <Row className="main-content">
        <Col span={24} className="title">
          修复方法
        </Col>
        <Col
          span={24}
          class="repair-method"
          style={{ padding: "20px 40px 20px 20px" }}
        >
          <Col span={24}>
            <Button
              type="primary"
              onClick={() => {
                this.props.history.push("/App/NewRepairMethod");
              }}
              icon="plus"
            >
              新增修复方法
            </Button>
            <Search
              placeholder="请输入修复方法名称"
              onSearch={this.searchData}
              enterButton
              style={{ float: "right", width: "240px" }}
            />
          </Col>
          <Col span={24} style={{ paddingTop: "20px" }}>
            <Table
              dataSource={methodList}
              columns={columns}
              expandedRowRender={record => (
                <Col span={24} style={{ textAlign: "left" }}>
                  <p>修复过程描述：{record.Method_Process}</p>
                  <p>修复结果描述：{record.Material_Result}</p>
                </Col>
              )}
              bordered
              pagination={{
                current: pageIndex,
                pageSize: pageSize,
                total: total,
                onChange: this.paginationChange
              }}
            />
          </Col>
        </Col>
      </Row>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
    pageIndex: state.main.repairMethodPage
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    changePageIndex: (args) => dispatch({ type: 'REPAIRMETHODPAGE', payload: args }),
    changeFormData: args => dispatch({ type: "COLLECINFO", payload: args }),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RepairMethod);
