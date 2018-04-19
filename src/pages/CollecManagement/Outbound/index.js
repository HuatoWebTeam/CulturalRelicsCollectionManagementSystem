import React, { Component } from 'react';
import { Row, Col, Button, Input, DatePicker, Table } from 'antd';
import './index.less';
// import moment from 'moment';
import { RangePickerDefault, approveState } from '../../../assets/js/commonFun';
import { GetOutTheLibraryData } from './api';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

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
          DeniedPermission: item.DeniedPermission,
          StepState: item.StepState
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
      // {
      //   title: '出库单状态',
      //   dataIndex: ''
      // }
      {
        title: '审批状态',
        dataIndex: '',
        key: 'approval',
        render:(text, value, idx) => {
          // console.log(text)
          for(let item of approveState) {
            if(Number(text.StepState) === item.key) {
              return <span style={{color: Number(text.StepState) === 2 ? 'red' : '#666'}} >{item.value}</span>
            }
          }
        }
      },
      {
        title: '操作',
        dataIndex:'',
        key: 'operation',
        render:(text, value) => {
          
          return <Link onClick={() => {
                let state = Number(text.DeniedPermission);
                sessionStorage.setItem("anthoityState", state);
              }} to={`/App/OutboundDetails/${text.outboundNum}`}>
              详情
            </Link>;
        }
      },
      
      
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