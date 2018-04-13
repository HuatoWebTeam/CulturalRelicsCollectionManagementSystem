import React, { Component } from 'react';
import { Row, Col, DatePicker, Button, Table } from 'antd';
import './index.less';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { AccountAll } from './api';
const { RangePicker } = DatePicker;

class CollecAccounts extends Component {
  state = {
    accountData: [],
    pageIndex: 1,
    pageSize: 10,
    total: null,
    date: []
  };
  //
  componentWillMount() {
    let startDate = moment()
      .subtract(6, "days")
      .format("YYYY-MM-DD");
    let endDate = moment().format("YYYY-MM-DD");
    // console.log();
    this.setState(
      {
        date: [startDate, endDate]
      },
      () => {
        this.getAccountsData();
      }
    );
  }

  getAccountsData() {
    const { pageIndex, pageSize, date } = this.state;
    let params = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      beginTime: date[0],
      endTime: date[1]
    };
    console.log(params);
    AccountAll(params).then(res => {
      console.log(res);
      if (res.length > 0) {
        let i = 0;
        for (let item of res) {
          item.key = i;
          i++;
        }
        this.setState({
          accountData: res,
          total: res[0].Count
        });
      } else {
        this.setState({
          accountData: [],
          total: 0
        });
      }
    });
  }
  // 分页
  handlePagination = (page) => {
      this.setState({
          pageIndex: page
      }, () => {
          this.getAccountsData()
      })
  }
  // 禁止选择时间
  disabledDate = current => {
    return current && current > moment().endOf("day");
  };

  // 点击搜索
  searchAccounts = () => {
    this.getAccountsData();
  }
  handleDatepicker = (date, dateString) => {
    console.log(dateString);
    this.setState({
      date: dateString
    });
  };
  render() {
    const { accountData, pageIndex, pageSize, total } = this.state;
    const accountsColumns = [
      {
        title: "时间",
        dataIndex: "Time",
        key: "Time"
      },
      {
        title: "藏品数",
        dataIndex: "CollCount",
        key: "CollCount"
      },
      {
        title: "资料数",
        dataIndex: "MateCount",
        key: "MateCount"
      },
      {
        title: "复制品数",
        dataIndex: "RepCount",
        key: "RepCount"
      },
      {
        title: "仿制品数",
        dataIndex: "ImitCount",
        key: "ImitCount"
      },
      {
        title: "代管数",
        dataIndex: "TubeCount",
        key: "TubeCount"
      },
      {
        title: "外借数",
        dataIndex: "ExteCount",
        key: "ExteCount"
      },
      {
        title: "待入库数",
        dataIndex: "StorCount",
        key: "StorCount"
      },
      {
        title: "待回库数",
        dataIndex: "NumbCount",
        key: "NumbCount"
      }
    ];

    return (
      <Row className="main-content">
        <Col span={24} className="title">
          藏品账目列表
        </Col>
        <Col
          span={24}
          className="accounts-container"
          style={{ padding: "20px 40px 20px 20px" }}
        >
          <Col span={24} className="search-container">
            <RangePicker
              defaultValue={[moment().subtract(6, "days"), moment()]}
              format="YYYY-MM-DD"
              onChange={this.handleDatepicker}
              disabledDate={this.disabledDate}
            />
            <Button type="primary" onClick={this.searchAccounts} >搜索</Button>
          </Col>
          <Col span={24}>
            <Table
              pagination={
                total <= 10
                  ? false
                  : {
                      current: pageIndex,
                      pageSize: pageSize,
                      total: total,
                      onChange: this.handlePagination
                    }
              }
              columns={ accountsColumns }
              dataSource={ accountData }
              bordered
            />
          </Col>
        </Col>
      </Row>
    );
  }
}

export default CollecAccounts;