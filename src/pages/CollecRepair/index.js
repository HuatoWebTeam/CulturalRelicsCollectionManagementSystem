import React, { Component } from 'react';
import { Row, Col, Button, Input, Table, Select, DatePicker, Form } from 'antd';
import './index.less';
import { RepairApi } from './api';
import { RangePickerDefault, levelInfo, approveState, subStr, repairState } from "../../assets/js/commonFun";
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { ReturnAdd } from '../../axios';
import moment from 'moment';
const Search = Input.Search;
const Option = Select.Option;
const { RangePicker } = DatePicker;


class CollecRepair extends Component {
  state = {
    repairData: [],
    pageIndex: 1,
    pageSize: 10,
    total: 0,
    repairStateNum: 10,
    date: [],
    SearchName: ""
  };

  componentWillMount() {
    let defaultDate = [
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
        date: defaultDate,
        pageIndex: this.props.pageIndex
      },
      () => {
        this.getRepairList();
      }
    );
  }

  getRepairList = () => {
    const {
      pageIndex,
      pageSize,
      SearchName,
      date,
      repairStateNum
    } = this.state;
    let params = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      Repair_Id: SearchName,
      Repair_State: repairStateNum,
      beginTime: date[0],
      endTime: date[1],
      datetime: moment().format()
    };
    RepairApi(params).then(res => {
      console.log(res);

      if (res.length === 0) {
        this.setState({
          total: 0
        });
      } else {
        for (let i = 0; i < res.length; i++) {
          res[i].key = res[i].Repair_Id;
        }

        this.setState({
          repairData: res,
          total: res[0].count
        });
      }
    });
  };

  paginationChange = pageIndex => {
    // console.log(pageIndex);
    this.setState(
      {
        pageIndex: pageIndex
      },
      () => {
        this.getRepairList();
        this.props.changePageIndex(pageIndex);
      }
    );
  };

  searchButton = value => {
    console.log("search");
    this.setState(
      {
        pageIndex: 1,
        SearchName: value
      },
      () => {
        this.getRepairList();
      }
    );
  };

  //
  selectChange = value => {
    this.setState({
      repairStateNum: value
    });
  };

  //
  datePickerChange = date => {
    console.log(date);
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
  //  归还按钮
  returnButton = value => {
    console.log(value);
    let UserName = JSON.parse(sessionStorage.getItem("UserInfo")).UserName;
    let type = "";
    for (let item of repairState) {
      if (Number(value.type) === item.key) {
        type = item.value;
      }
    }
    console.log(UserName);
    let params = {
      TheLibrary_Purpose: '由修复单' + value.Repair_Id + '生成的修复入库单',
      TheLibrary_Time: moment().format("YYYY-MM-DD"),
      name: UserName,
      odd: value.Repair_Id,
      ReturnType: 1,
      ReturnTime: value.ReturnTime,
      TheLibrary_Type: 4,      
    };
    ReturnAdd(params).then(res => {
      console.log(res);
      if (res === true) {
        this.getRepairList();
      }
    });
  };

  render() {
    const { pageIndex, total, pageSize, repairStateNum } = this.state;
    const repairList = [
      {
        title: "修复单号",
        dataIndex: "Repair_Id",
        key: "Repair_Id"
      },
      {
        title: "申请时间",
        dataIndex: "Repair_Time",
        key: "Repair_Time",
        render: text => {
          return <span>{subStr(text)}</span>;
        }
      },
      {
        title: "申请人",
        dataIndex: "Repair_Applicant",
        key: "Repair_Applicant"
      },
      {
        title: "修复方法",
        dataIndex: "Repair_Method",
        key: "Repair_Method"
      },
      {
        title: "修复日期",
        dataIndex: "Repair_BegTime",
        render: (text, record) => {
          return (
            <span>
              {subStr(record.Repair_BegTime) +
                " ~ " +
                subStr(record.Repair_EndTime)}
            </span>
          );
        }
      },
      {
        title: "修复周期",
        dataIndex: "Repair_cycle",
        key: "Repair_cycle",
        render: text => {
          return <span>{text + " 天"}</span>;
        }
      },
      {
        title: "修复人",
        dataIndex: "Repair_Restorer",
        key: "Repair_Restorer"
      },
      {
        title: "审批状态",
        dataIndex: "",
        key: "approval",
        render: (text, value, idx) => {
          for (let item of approveState) {
            if (Number(text.StepState) === item.key) {
              return (
                <span
                  style={{
                    color: Number(text.StepState) === 2 ? "red" : "#666"
                  }}
                >
                  {item.value}
                </span>
              );
            }
          }
        }
      },
      {
        title: "修复状态",
        dataIndex: "Repair_State",
        key: "Repair_State",
        render: text => {
          for (let item of repairState) {
            if (Number(text) === item.key) {
              return (
                <span
                  style={{
                    color: Number(text) === 3 ? "red" : "#333"
                  }}
                >
                  {item.value}
                </span>
              );
            }
          }
        }
      },
      {
        title: "操作",
        dataIndex: "",
        key: "operation",
        render: (text, record, idx) => {
          // console.log(text)
          return (
            <span>
              <Button style={{ border: 'none', marginRight: '10px' }}
                onClick={() => {
                  this.props.changeFormData({
                    state: "编辑修复单",
                    formData: record.Repair_Id
                  });
                  this.props.history.push("/App/NewRepairList");
                }}
              >
                编辑
              </Button>
              <Link
                onClick={() => {
                  let state = Number(record.DeniedPermission);
                  sessionStorage.setItem("anthoityState", state);
                }}
                to={`/App/RepairDetails/${text.Repair_Id}`}
              >
                详情
              </Link>
              <Button
                type="text"
                disabled={record.StepState === 3 ? (record.Repair_State === 2 ? true : false) : true }
                style={{ marginLeft: "10px", border: "none" }}
                onClick={this.returnButton.bind(this, record)}
              >
                归还
              </Button>
            </span>
          );
        }
      }
    ];
    // console.log(this.state)
    return (
      <Row className="main-content">
        <Col className="title">藏品修复列表</Col>
        <Col className="list-content">
          <Col className="seach-container">
            <Col span={4}>
              <Button
                type="primary"
                icon="plus"
                onClick={() => {
                  this.props.history.push("/App/NewRepairList");
                }}
              >
                新建修复单
              </Button>
            </Col>
            <Col span={20}>
              <Form layout="inline" style={{ float: "right" }}>
                <Form.Item label="修复状态:">
                  <Select
                    defaultValue={repairStateNum}
                    onChange={this.selectChange}
                    style={{ width: "165px" }}
                  >
                    <Option value={10}>全部</Option>
                    {repairState.map(item => (
                      <Option key={item.key} value={item.key}>
                        {item.value}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item label="修复单日期:">
                  <RangePicker
                    onChange={this.datePickerChange}
                    defaultValue={RangePickerDefault}
                    format="YYYY-MM-DD"
                  />
                </Form.Item>
                <Form.Item>
                  <Search
                    placeholder="请输入修复单号"
                    onSearch={this.searchButton}
                    enterButton
                  />
                </Form.Item>
              </Form>
            </Col>
          </Col>
          <Col>
            <Table
              pagination={{
                current: pageIndex,
                pageSize: pageSize,
                total: total,
                onChange: this.paginationChange
              }}
              bordered
              columns={repairList}
              dataSource={this.state.repairData}
            />
          </Col>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    pageIndex: state.main.repairPage
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    changePageIndex: args => dispatch({ type: "REPAIRPAGE", payload: args }),
    changeFormData: args => dispatch({ type: "COLLECINFO", payload: args })
  };
};

export default  connect(mapStateToProps, mapDispatchToProps)(CollecRepair);