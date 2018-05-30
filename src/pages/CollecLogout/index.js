import React, { Component } from "react";

import { Row, Col, Button, Form, Modal, DatePicker, Input, Table, message } from "antd";
import "./index.less";
import { Link } from 'react-router-dom';
import { RangePickerDefault, approveState, subStr, howComplete, logoutState } from "../../assets/js/commonFun";
import moment from 'moment';
import { CancellationAll, CancellationDelete } from "./api";
import { connect } from 'react-redux';
const { RangePicker } = DatePicker;
const { Search } = Input;
const confirm = Modal.confirm;

class CollecLogout extends Component {
  state = {
    logoutList: [],
    date: [],
    relicsName: "",
    pageIndex: 1,
    pageSize: 10,
    total: 0
  };
  componentWillMount() {
    let date = [
      RangePickerDefault[0]
        .hour(0)
        .minute(0)
        .second(0)
        .format(),
      RangePickerDefault[1]
        .hour(23)
        .minute(59)
        .second(59)
        .format()
    ];
    this.setState(
      {
        date: date
      },
      () => {
        this.getLogoutList();
      }
    );
  }

  // 请求列表
  getLogoutList = () => {
    const { date, relicsName, pageIndex, pageSize } = this.state;
    let params = {
      beginTime: date[0],
      endTime: date[1],
      CollName: relicsName,
      pageIndex: pageIndex,
      pageSize: pageSize
    };
    CancellationAll(params).then(res => {
      console.log(res);
      if (res.length > 0) {
        for (let item of res) {
          item.key = item.Cancellation_Odd;
          item.disabled =
            Number(item.StepState) === 4
              ? Number(item.Step) === 0
                ? true
                : false
              : Number(item.StepState) === 1
                ? Number(item.Step) === 1
                  ? true
                  : false
                : false;
        }
        this.setState({
          logoutList: res,
          total: res[0].cou
        });
      } else {
        this.setState({
          logoutList: [],
          total: 0
        });
      }
    });
  };

  searchData = value => {
    console.log(value);
    this.setState(
      {
        relicsName: value
      },
      () => {
        this.getLogoutList();
      }
    );
  };
  // 选择时间
  datePickerChange = date => {
    // console.log(date);
    const { format } = this.state;
    this.setState({
      date: [
        date[0]
          .hour(0)
          .minute(0)
          .second(0)
          .format(),
        date[1]
          .hour(23)
          .minute(59)
          .second(59)
          .format()
      ]
    });
  };
  // Fenye
  pageationChange = page => {
    this.setState(
      {
        pageIndex: page
      },
      () => {
        this.getLogoutList();
      }
    );
  };
  // 对话框   // 删除注销单
  showConfirm = (text, number) => {
    let _this = this;
    confirm({
      title: "确定删除?",
      content: "",
      onOk() {
        // console.log(text);
        let params = { Odd: text, Number: number };
        CancellationDelete(params).then(res => {
          if (res === true) {
            message.success("删除成功");
            _this.getLogoutList();
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
  render() {
    const { logoutList, date, pageIndex, pageSize, total } = this.state;
    const columns = [
      {
        title: "注销单号",
        dataIndex: "Cancellation_Odd",
        key: "Cancellation_Odd"
      },
      {
        title: "文物名称",
        dataIndex: "Collection_Name",
        key: "Collection_Name"
      },
      {
        title: "文物图片",
        dataIndex: "Collection_img1",
        key: "Collection_img1",
        render: text => {
          return (
            <img
              style={{ width: "55px", height: "55px" }}
              src={text}
              alt="img"
            />
          );
        }
      },
      {
        title: "文物等级",
        dataIndex: "Grade_Nmae",
        key: "Grade_Nmae"
      },
      {
        title: "材质",
        dataIndex: "MaterialQuality",
        key: "MaterialQuality"
      },
      {
        title: "完整程度",
        dataIndex: "Integrity",
        key: "Integrity",
        render: text => {
          for (let item of howComplete) {
            if (Number(text) === item.key) {
              return <span>{item.value}</span>;
            }
          }
        }
      },
      {
        title: "注销时间",
        dataIndex: "Application_Time",
        key: "Application_Time",
        render: text => {
          return subStr(text);
        }
      },
      {
        title: "申请人",
        dataIndex: "Applicant",
        key: "Applicant"
      },
      {
        title: "注销原因",
        dataIndex: "Cancellation_Reason",
        key: "Cancellation_Reason"
      },
      {
        title: "审批状态",
        dataIndex: "StepState",
        key: "StepState",
        render: text => {
          for (let item of approveState) {
            if (Number(text) === item.key) {
              return item.value;
            }
          }
        }
      },
      {
        title: '注销状态',
        dataIndex: 'Cancellation_State',
        render: (text) => {
          for (let item of logoutState) {
            if(Number(text) === item.key) {
              return item.value;
            }
          }
        }
      },
      {
        title: "操作",
        dataIndex: "",
        key: "operation",
        render: text => {
          return (
            <span>
              <Link
                onClick={() => {
                  sessionStorage.setItem("logoutText", JSON.stringify(text));
                }}
                to={`/App/LogoutDetail/${text.Cancellation_Odd}`}
              >
                详情
              </Link>
              <Button 
                type='button'
                disabled={!text.CkOdd}
                style={{ border: 'none', marginLeft: '10px'}}
                onClick={() => {
                  this.props.history.push(`/App/OutboundDetails/${text.CkOdd}`);
                }}
                 >
                查看出库单
              </Button>
              <Button
                disabled={!text.disabled}
                type="button"
                style={{ border: "none", marginLeft: "10px" }}
                onClick={this.showConfirm.bind(this, text.Cancellation_Odd, text.Collection_Number)}
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
          藏品注销单列表
        </Col>
        <Col
          className="logout-list-content"
          span={24}
          style={{ padding: "20px 40px 20px 20px" }}
        >
          <Col span={24} className="" style={{ marginBottom: "20px" }}>
            <Col span={4}>
              <Button
                type="primary"
                icon="plus"
                onClick={() => {
                  this.props.history.push("/App/NewLogout");
                }}
              >
                新建注销单
              </Button>
            </Col>
            <Col span={20}>
              <Form layout="inline" style={{ float: "right" }}>
                <Form.Item label="选择注销日期:">
                  <RangePicker
                    onChange={this.datePickerChange}
                    defaultValue={RangePickerDefault}
                  />
                </Form.Item>
                <Form.Item>
                  <Search
                    placeholder="请输入文物名称"
                    enterButton
                    onSearch={this.searchData}
                  />
                </Form.Item>
              </Form>
            </Col>
          </Col>
          <Col span={24}>
            <Table
              pagination={{
                current: pageIndex,
                pageSize: pageSize,
                total: total,
                onChange: this.pageationChange
              }}
              dataSource={logoutList}
              columns={columns}
              bordered
            />
          </Col>
        </Col>
      </Row>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
    pageIndex: state.main.inventoryPage
  };
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    changePageIndex: args => dispatch({ type: "INVENTORYPAGE", payload: args }),
    changeFormData: args => dispatch({ type: "COLLECINFO", payload: args })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CollecLogout);
