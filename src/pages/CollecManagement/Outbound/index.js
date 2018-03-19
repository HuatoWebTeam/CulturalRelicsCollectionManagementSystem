import React, { Component } from 'react';
import { Row, Col, Button, Input, DatePicker, Table } from 'antd';
import './index.less';
// import moment from 'moment';
import { RangePickerDefault, levelInfo, relicsYears, relicsCategory } from '../../../assets/js/commonFun';
import { GetOutTheLibraryData } from './api';
import { connect } from 'react-redux';

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
        console.log(item);
        data.push({
          key: item.OutNumber,
          outboundNum: item.OutNumber,
          relicsNum: item.CollectionNumber,
          rfid: item.CollectionRfid,
          relicsImg: item.Collectionimg1,
          relicsName: item.CollectionName,
          date: item.CollectionTime,
          localtion: item.StorageId,
          number: item.Number,
          levelInfo: item.Grade,
          material: item.MaterialQuality,
          years: item.CollectionYears,
          howComplete: item.Integrity,
          state: item.CollectionState,
          category: item.Category,
          operation: item.UserName,
          size: item.Size,
          weight: item.Weight
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
        title: "文物编号",
        dataIndex: "relicsNum",
        key: "relicsNum"
      },
      {
        title: "文物图片",
        dataIndex: "relicsImg",
        key: "relicsImg",
        render: (text, idx) => {
          return (
            <img
              alt={idx}
              src={text}
              style={{ width: "55px", height: "55px" }}
            />
          );
        }
      },
      {
        title: "文物名称",
        dataIndex: "relicsName",
        key: "relicsName"
      },
      {
        title: "出库时间",
        dataIndex: "date",
        key: "date"
      },
      {
        title: "数量",
        dataIndex: "number",
        key: "number"
      },
      {
        title: "分级信息",
        dataIndex: "levelInfo",
        key: "levelInfo",
        render: text => {
          for (let item of levelInfo) {
            if (Number(text) === item.key) {
              return <span>{item.value}</span>;
            }
          }
        }
      },
      {
        title: "材质",
        dataIndex: "material",
        key: "material"
      },
      {
        title: "年代",
        dataIndex: "years",
        key: "years",
        render: text => {
          for (let item of relicsYears) {
            if (Number(text) === item.key) {
              return <span>{item.value}</span>;
            }
          }
        }
      },
      {
        title: "完整程度",
        dataIndex: "howComplete",
        key: "howComplete",
        render: text => {
          if (Number(text) === 0) {
            return <span>完整</span>;
          } else if (Number(text) === 1) {
            return <span>破损</span>;
          }
        }
      },
      {
        title: "状态",
        dataIndex: "state",
        key: "state"
      },
      {
        title: "类别",
        dataIndex: "category",
        key: "category",
        render: text => {
          for (let item of relicsCategory) {
            if (Number(text) === item.key) {
              return <span>{item.value}</span>;
            }
          }
        }
      },
      {
        title: "尺寸",
        dataIndex: "size",
        key: "size"
      },
      {
        title: "重量",
        dataIndex: "weight",
        key: "weight"
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