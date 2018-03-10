import React, { Component } from 'react';
import { Row, Col, DatePicker, Button, Table } from 'antd';
import moment from 'moment';
import { RangePickerDefault } from '../../../assets/js/commonFun';
import { LoginfoDesc } from './api'; 
const { RangePicker } = DatePicker;

class UserOperation extends Component {
  state = {
    operationLogList: [],
    formmat: "YYYY-MM-DD",
    defaultValue: [],
    pageIndex: 1,
    pageSize: 10,
    total: 0
  };

  componentWillMount() {
    const { formmat } = this.state;
    let date = [
      RangePickerDefault[0].format(formmat),
      RangePickerDefault[1].format(formmat)
    ];
    this.setState({
      defaultValue: date
    }, () => {
      this.getOperationList();
    });
  }

  //获取数据
  getOperationList() {
    const { defaultValue, pageIndex, pageSize } = this.state;
    let params = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      beginTime: defaultValue[0],
      endTime: defaultValue[1]
    };
    LoginfoDesc(params).then(res => {
      console.log(res);
      if(res.length > 0) {
        for (let item of res) {
          item.key = item.Log_Id;
        };
        this.setState({
          operationLogList: res,
          total: res[0].Count
        })

      } else {
        this.setState({
          total: 0,
        })
      }
      
    });
  }

  rangePickerChange = date => {
    console.log(date);
    const { formmat } = this.state;
    this.setState(
      {
        defaultValue: [date[0].format(formmat), date[1].format(formmat)]
      },
      () => {
        this.getOperationList();
      }
    );
  };

  // 分页改变
  paginationChange = (page) => {
    this.setState({
      pageIndex: page
    }, () => {
      this.getOperationList();
    })
  }

  render() {
    const {
      operationLogList,
      defaultValue,
      formmat,
      pageIndex,
      pageSize,
      total
    } = this.state;
    const operationColumns = [
      {
        title: "操作时间",
        dataIndex: "Log_Time",
        key: "Log_Time"
      },
      {
        title: "用户名",
        dataIndex: "Log_Name",
        key: "Log_Name"
      },
      {
          title: '操作IP地址',
          dataIndex: 'Log_Ip',
          key: 'Log_Ip'
      },
      {
        title: "操作类型",
        dataIndex: "Log_Type",
        key: "Log_Type"
      },
      {
        title: "操作详情",
        dataIndex: "Log_Desc",
        key: "Log_Desc"
      }
    ];
    return (
      <Row className="main-content">
        <Col span={24} className="title">
          操作日志列表
        </Col>
        <Col
          className="userOperation-container"
          span={24}
          style={{ padding: "20px 40px 20px 20px" }}
        >
          <Col span={24} style={{ paddingBottom: "20px" }}>
            <RangePicker
              defaultValue={RangePickerDefault}
              format={formmat}
              onChange={this.rangePickerChange}
            />
            <Button type="primary" style={{ marginLeft: "20px" }}>
              搜索
            </Button>
          </Col>
          <Col span={24}>
            <Table
              columns={operationColumns}
              dataSource={operationLogList}
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

export default UserOperation;