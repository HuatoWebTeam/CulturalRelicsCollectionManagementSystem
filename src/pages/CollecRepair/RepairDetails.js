import React, { Component } from 'react';
import { Row, Col, Table } from 'antd';
import { levelInfo, relicsYears } from "../../assets/js/commonFun";
import { RepDatall } from './api';

class RepairDetails extends Component {
  state = {
    pageIndex: 1,
    pageSize: 10,
    total: 0,
    repairNum: "",
    repairDetailList: []
  };

  componentWillMount() {
    this.setState(
      {
        repairNum: this.props.match.params.id
      },
      () => {
        this.getRepairDetailList();
      }
    );
  }

  getRepairDetailList() {
    const { pageIndex, pageSize, repairNum } = this.state;
    let params = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      Exhibition_Odd: repairNum
    };
    RepDatall(params).then(res => {
      console.log(res);
      if (res.length === 0) {
        this.setState({
          total: 0
        });
      } else {
        for (let item of res) {
          item.key = item.Collection_Number;
        }
        this.setState({
          total: res[0].Count,
          repairDetailList: res
        });
      }
    });
  }
  // 分页改变
  paginationChange = (page) => {
      this.setState({
          pageIndex: page
      }, () => {
          this.getRepairDetailList();
      })
  }

  render() {
    const { pageIndex, pageSize, total, repairDetailList } = this.state;
    const repairColumns = [
      {
        title: "文物编号",
        dataIndex: "Collection_Number",
        key: "Collection_Number"
      },
      {
        title: "文物图片",
        dataIndex: "Collection_img",
        key: "Collection_img",
        render: (text, index) => {
          return (
            <img
              style={{ width: "55px", height: "55px" }}
              src={text}
              alt={index}
            />
          );
        }
      },
      {
        title: "文物名称",
        dataIndex: "Collection_Name",
        key: "Collection_Name"
      },
      {
        title: "数量",
        dataIndex: "Number",
        key: "Number"
      },
      {
        title: "分级信息",
        dataIndex: "Grade",
        key: "Grade",
        render: text => {
          for (let item of levelInfo) {
            if (Number(text) === item.key) {
              return <span>{item.value}</span>;
              // break;
            }
          }
        }
      },
      {
        title: "材质",
        dataIndex: "MaterialQuality",
        key: "MaterialQuality"
      },
      {
        title: "文物状态",
        dataIndex: "Collection_State",
        key: "Collection_State",
        render: text => {
          return (
            <span
              style={{
                color:
                  text === "在库"
                    ? "#e15d05"
                    : text === "出库" ? "#3065bf" : "#666"
              }}
            >
              {" "}
              {text}{" "}
            </span>
          );
        }
      }
    ];
    return (
      <Row className="main-content">
        <Col span={24} className="title">
          修复单详情{" "}
          <div
            className="go-back"
            onClick={() => {
              this.props.history.goBack();
            }}
          />
        </Col>
        <Col span={24} style={{ padding: "20px 40px 20px 20px" }}>
          <Table
            pagination={{
              current: pageIndex,
              pageSize: pageSize,
              total: total,
              onChange: this.paginationChange
            }}
            dataSource={repairDetailList}
            columns={repairColumns}
            bordered
          />
        </Col>
      </Row>
    );
  }
}

export default RepairDetails;