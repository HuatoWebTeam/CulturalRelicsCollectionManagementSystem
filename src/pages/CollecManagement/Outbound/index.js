import React, { Component } from 'react';
import { Row, Col, Button, Input, DatePicker, Table, message } from 'antd';
import './index.less';
// import moment from 'moment';
import { RangePickerDefault, levelInfo, relicsYears, relicsCategory } from '../../../assets/js/commonFun';
import { GetOutTheLibraryData } from './api';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { ApprovalPassed, ApprovalDenied } from '../../../axios';

const Search = Input.Search;
const { RangePicker } = DatePicker;

class ComplexGeneric extends Component {
  state = {
    outboundData: [],
    pageIndex: 1,
    pageSize: 10,
    total: 0,
    date: [],
    condition: ""
  };

  componentWillMount() {
    this.setState(
      {
        pageIndex: this.props.pageIndex
      },
      () => {
        this.getOutboundList();
      }
    );
  }

  getOutboundList() {
    const { pageIndex, pageSize, date, condition } = this.state;
    let params = {
      parameters: {
        Condition: condition,
        StaDate: date[0],
        EndDate: date[1],
        PageIndex: pageIndex,
        PageSize: pageSize
      }
    };
    GetOutTheLibraryData(params).then(res => {
      console.log(res);
      let data = [];
      for (let item of res.Data) {
        // console.log(item);
        data.push({
          key: item.TheLibraryOdd,
          outboundNum: item.TheLibraryOdd,
          relicsNum: item.TheLibraryPurpose,
          date: item.TheLibraryTime,
          number: item.TheLibraryNumber,
          operationPeople: item.Operator,
          ReceivingPermissions: item.ReceivingPermissions,
          DeniedPermission: item.DeniedPermission
        });
      }
      this.setState({
        outboundData: data,
        total: res.Total
      });
    });
  }

  rangePickerChange = value => {
    // console.log(value);
    let format = "YYYY-MM-DD";
    let date = [value[0].format(format), value[1].format(format)];
    // console.log(date);
    this.setState({
      date: date
    });
  };

  handleSearch(e) {
    console.log(e);
    this.setState(
      {
        condition: e,
        pageIndex: 1
      },
      () => {
        this.getOutboundList();
      }
    );
  }
  paginationChange = (page) => {
      this.setState({
          pageIndex: page
      }, () => {
          this.getOutboundList();
          this.props.changePageIndex(page);
      })
  }

  // 点击通过
  clickApprove = (item) => {
    let params = {
      orderNumber: item,
      flag: 3
    };
    let _this = this;
    ApprovalPassed(params).then(res => {
      console.log(res);
      if(res === true) {
        _this.getOutboundList();
      } else {
        message.error('操作失败');
      }
    })
  }
  // 拒绝
  clickApproveReject = (item) => {
    let params = {
      orderNumber: item,
      flag: 3
    }
    let _this = this;
    ApprovalDenied(params).then(res => {
      console.log(res);
      if (res === true) {
        _this.getOutboundList();
      } else {
        message.error("操作失败");
      }
    })
  }

  render() {
    const { outboundData, pageIndex, pageSize, total } = this.state;
    const outboundColumns = [
      {
        title: "出库单号",
        key: "outboundNum",
        dataIndex: "outboundNum"
      },
      {
        title: "出库用途",
        dataIndex: "relicsNum",
        key: "relicsNum"
      },
      {
        title: '出库数量',
        dataIndex: 'number',
        key: 'number'
      },
      {
        title: "出库时间",
        dataIndex: "date",
        key: "date"
      },
      {
        title: '操作人',
        dataIndex: 'operationPeople',
        key: 'operationPeople'
      },
      {
        title: '操作',
        dataIndex:'',
        key: 'operation',
        render:(text, value) => {
          
          return <Link
              to={`/App/OutboundDetails/${text.outboundNum}`}
            >
              详情
            </Link>;
        }
      },
      {
        title: '审批',
        dataIndex: '',
        key: 'approval',
        render:(text, value, idx) => {
          return (<div>
              <Button type="primary" onClick={this.clickApprove.bind(this, text.outboundNum )} disabled={text.ReceivingPermissions === 0}>
                同意
              </Button>
              <Button type="danger" onClick={this.clickApproveReject.bind(this, text.outboundNum)} disabled={text.DeniedPermission === 0} style={{ marginLeft: "10px" }}>
                拒绝
              </Button>
          </div>);
        }
      }
      
      
    ];

    return (
      <Row className="main-content">
        <Col span={24} className="title">
          藏品出库信息
        </Col>
        <Col span={24} className="outbound-container">
          <Col span={24}>
            <Col span={24}>
              <Button
                type="primary"
                icon="plus"
                onClick={() => {
                  this.props.history.push("/App/NewOutbound");
                }}
              >
                新建出库单
              </Button>
            </Col>
            <Col span={24} style={{ padding: "20px 0" }}>
              <RangePicker
                defaultValue={RangePickerDefault}
                format="YYYY-MM-DD"
                onChange={this.rangePickerChange}
              />
              <Button type="primary" style={{ marginLeft: "20px" }}>
                搜索
              </Button>
              <Search
                enterButton
                onSearch={this.handleSearch}
                style={{ float: "right", width: "260px" }}
              />
            </Col>
            <Col span={24}>
              <Table
                pagination={{
                  current: pageIndex,
                  pageSize: pageSize,
                  total: total,
                  onChange: this.paginationChange
                }}
                columns={outboundColumns}
                dataSource={outboundData}
                bordered
              />
            </Col>
          </Col>
        </Col>
      </Row>
    );
  }
}
// OUTBOUNDPAGE 
const mapStateToProps = (state, ownProps) => {
  return {
    pageIndex: state.main.outboundPage
  };
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    changePageIndex: args =>
      dispatch({ type: "OUTBOUNDPAGE", payload: args })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ComplexGeneric);