import React, { Component } from 'react';
import { Row, Col, Table, message, Button } from 'antd';
import './index.less';
import { GetEntryTheLibraryData } from './api';
import { connect } from 'react-redux';
import { levelInfo, relicsYears, relicsCategory } from "../../../assets/js/commonFun";
import { ApprovalPassed, ApprovalDenied } from "../../../axios";

class ComplexGeneric extends Component {
  state = {
    putinData: [],
    pageIndex: 1,
    pageSize: 10,
    total: 0
  };

  componentWillMount() {
    this.setState(
      {
        pageIndex: this.props.pageIndex
      },
      () => {
        this.getPutInList();
      }
    );
  }

  getPutInList() {
    const { pageIndex, pageSize } = this.state;

    let params = {
      parameters: {
        PageIndex: pageIndex,
        PageSize: pageSize
      }
    };
    console.log(params);
    GetEntryTheLibraryData(params).then(res => {
      console.log(res);
      let data = res.Data;
      for (let item of data) {
        item.key = item.TheLibraryOdd;
      }
      this.setState({
        putinData: data,
        total: res.Total
      });
    });
  }

  // 改变分页
  paginationChange = page => {
    this.setState(
      {
        pageIndex: page
      },
      () => {
        this.getPutInList();
        this.props.changePageIndex(page);
      }
    );
  };

  // 点击通过
  clickApprove = item => {
    let params = {
      orderNumber: item,
      flag: 2
    };
    let _this = this;
    ApprovalPassed(params).then(res => {
      console.log(res);
      if (res === true) {
        _this.getPutInList();
      } else {
        message.error("操作失败");
      }
    });
  };
  // 拒绝
  clickApproveReject = item => {
    let params = {
      orderNumber: item,
      flag: 2
    };
    let _this = this;
    ApprovalDenied(params).then(res => {
      console.log(res);
      if (res === true) {
        _this.getPutInList();
      } else {
        message.error("操作失败");
      }
    });
  };

  render() {
    const { putinData, pageIndex, pageSize, total } = this.state;
    const putinColumns = [
      {
        title: "入库单号",
        dataIndex: "TheLibraryOdd",
        key: "TheLibraryOdd"
      },
      {
        title: "入库详情",
        dataIndex: "TheLibraryPurpose",
        key: "TheLibraryPurpose"
      },
      {
        title: "入库时间",
        dataIndex: "TheLibraryTime",
        key: "TheLibraryTime"
      },
      {
        title: "入库数量",
        dataIndex: "TheLibraryNumber",
        key: "TheLibraryNumber"
      },
      {
        title: "操作人",
        dataIndex: "Operator",
        key: "Operator"
      },
      {
        title: "审批",
        dataIndex: "",
        key: "approval",
        render: (text, value, idx) => {
          return (
            <div>
              <Button
                type="primary"
                onClick={this.clickApprove.bind(this, text.TheLibraryOdd)}
                disabled={text.ReceivingPermissions === 0}
              >
                同意
              </Button>
              <Button
                type="danger"
                onClick={this.clickApproveReject.bind(this, text.TheLibraryOdd)}
                disabled={text.DeniedPermission === 0}
                style={{ marginLeft: "10px" }}
              >
                拒绝
              </Button>
            </div>
          );
        }
      }
    ];
    return (
      <Row className="main-content">
        <Col span={24} className="title">
          藏品入库信息
        </Col>
        <Col span={24} className="putin-stroage-content">
          <Table
            pagination={{
              current: pageIndex,
              pageSize: pageSize,
              total: total,
              onChange: this.paginationChange
            }}
            columns={putinColumns}
            dataSource={putinData}
            bordered
          />
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    pageIndex: state.main.putInPage
  };
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    changePageIndex: args => dispatch({ type: "PUTINSTORAGEPAGE", payload: args })
  };
};

export default connect(mapStateToProps, mapDispatchToProps) (ComplexGeneric);