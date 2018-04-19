import React, { Component } from 'react';
import { Row, Col, Button, Input, Table } from 'antd';
import './index.less';
import { SolicallApi } from './api';
import { Link } from 'react-router-dom';
import { approveState } from "../../assets/js/commonFun";
import { connect } from 'react-redux';
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
      {
        title: "审批状态",
        dataIndex: "",
        key: "approval",
        render: (text, value, idx) => {
          for(let item of approveState) {
            if(Number(text.StepState) === item.key) {
              return <span style={{color: Number(text.StepState) === 2 ? 'red' : '#666'}} >{item.value}</span>
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
          return <Link onClick={() => {
                let state = Number(text.DeniedPermission);
                sessionStorage.setItem("solicitionText", JSON.stringify(text));
                sessionStorage.setItem("anthoityState", state);
              }} to={`/App/ShowSolicitionDetail`}>
              详情
            </Link>;
        }
      },
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