import React, { Component } from 'react';
import { Row, Col, Button, Input, Table, message } from 'antd';
import './index.less';
import { SolicallApi } from './api';
import { levelInfo, relicsCategory } from "../../assets/js/commonFun";
import { connect } from 'react-redux';
import { ApprovalPassed, ApprovalDenied } from "../../axios";
const Search = Input.Search;

class CollecSolicition extends Component {
  state = {
    solicitionRelicsList: [],
    pageIndex: 1,
    pageSize: 10,
    total: 0,
    relicsName: ""
  };

  componentWillMount() {
    this.setState(
      {
        pageIndex: this.props.pageIndex
      },
      () => {
        this.getSolicitionlist();
      }
    );
  }
  // 获取征集列表
  getSolicitionlist() {
    const { pageIndex, pageSize, relicsName } = this.state;
    let params = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      Collection_Name: relicsName
    };
    SolicallApi(params).then(res => {
      console.log(res);
      let data = res;
      if (data.length === 0) {
        this.setState({
          total: 0
        });
      } else {
        for (let item of data) {
          item.key = item.Solicitation_Id;
        }
        this.setState({
          solicitionRelicsList: data,
          total: data[0].Count
        });
      }
    });
  }

  // 搜索框
  searchQueryData = value => {
    this.setState(
      {
        relicsName: value
      },
      () => {
        this.getSolicitionlist();
      }
    );
  };
  // 分页改变
  paginationChange = page => {
    this.setState(
      {
        pageIndex: page
      },
      () => {
        this.getSolicitionlist();
        this.props.changePageIndex(page);
      }
    );
  };

  // 点击通过
  clickApprove = item => {
    let params = {
      orderNumber: item,
      flag: 4
    };
    let _this = this;
    ApprovalPassed(params).then(res => {
      console.log(res);
      if (res === true) {
        _this.getInventoryList();
      } else {
        message.error("操作失败");
      }
    });
  };
  // 拒绝
  clickApproveReject = item => {
    let params = {
      orderNumber: item,
      flag: 4
    };
    let _this = this;
    ApprovalDenied(params).then(res => {
      console.log(res);
      if (res === true) {
        _this.getInventoryList();
      } else {
        message.error("操作失败");
      }
    });
  };

  render() {
    const { solicitionRelicsList, pageIndex, pageSize, total } = this.state;
    const solicitionColumns = [
      {
        title: "文物名称",
        dataIndex: "Collection_Name",
        key: "Collection_Name"
      },
      {
        title: "文物图片",
        dataIndex: "Collection_img1",
        key: "Collection_img1",
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
        title: "征集时间",
        dataIndex: "Solicitation_Time",
        key: "Solicitation_Time"
      },
      {
        title: "征集人",
        dataIndex: "Solicitation_Name",
        key: "Solicitation_Name"
      },
      {
        title: "身份证号",
        dataIndex: "IdentityCard",
        key: "IdentityCard",
        
      },
      {
        title: "联系方式",
        dataIndex: "Phone",
        key: "Phone"
      },
      {
        title: "联系地址",
        dataIndex: "Site",
        key: "Site",
      },
      {
        title: "奖金数额",
        dataIndex: "AmountPrize",
        key: "AmountPrize"
      },
      {
        title: "鉴定结果",
        dataIndex: "Identification",
        key: "Identification"
      },
      {
        title: "出土信息",
        dataIndex: "BeUnearthed",
        key: "BeUnearthed"
      },
      ,
      {
        title: "审批",
        dataIndex: "",
        key: "approval",
        render: (text, value, idx) => {
          return (
            <div>
              <Button
                type="primary"
                onClick={this.clickApprove.bind(this, text.Collection_Number)}
                disabled={Number(text.ReceivingPermissions) === 0}
              >
                同意
              </Button>
              <Button
                type="danger"
                onClick={this.clickApproveReject.bind(
                  this,
                  text.Collection_Number
                )}
                disabled={Number(text.DeniedPermission) === 0}
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
          藏品征集列表
        </Col>
        <Col span={24} className="solicition-container">
          <Col span={24}>
            <Button
              type="primary"
              icon="plus"
              onClick={() => {
                this.props.history.push("/App/AddSolicition");
              }}
            >
              添加征集
            </Button>
            <Search
              placeholder="请输入文物名称"
              enterButton
              onSearch={this.searchQueryData}
              style={{ width: "260px", float: "right" }}
            />
          </Col>
          <Col span={24} style={{ paddingTop: "20px" }}>
            <Table
              pagination={{
                current: pageIndex,
                pageSize: pageSize,
                total: total,
                onChange: this.paginationChange
              }}
              columns={solicitionColumns}
              dataSource={solicitionRelicsList}
              bordered
              expandedRowRender={
                record => (
                  <Row>
                    <Col span={4} >
                      <span>分级信息：</span>
                      {
                        levelInfo.map((item, key) => 
                          Number(record.Grade) === item.key && <span key={item.key} >{item.value}</span>
                        )
                      }
                    </Col>
                    <Col span={4} >
                      <span>材质：</span>
                      <span>{record.MaterialQuality}</span>
                    </Col>
                    <Col span={4} >
                      <span>类别：</span>
                      {
                        relicsCategory.map((item) => 
                          Number(record.Solicitation_State) === item.key && <span key={item.key} >{item.value}</span>
                        )
                      }
                    </Col>
                    <Col span={4} >
                      <span>尺寸：</span>
                      <span>{record.Size}</span>
                    </Col>
                    <Col span={4} >
                      <span>重量：</span>
                      <span>{record.Weight}</span>
                    </Col>
                    <Col span={4} >
                      <span>数量：</span>
                      <span>{record.Number}</span>
                    </Col>
                  </Row>
                )
              }
            />
          </Col>
        </Col>
      </Row>
    );
  }
}
// SOLICITIONPAGE
const mapStateToProps = (state, ownProps) => {
  return {
    pageIndex: state.main.solicitionPage
  }
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    changePageIndex: args => dispatch({ type: 'SOLICITIONPAGE', payload: args })
  };
};

export default connect(mapStateToProps, mapDispatchToProps )(CollecSolicition);