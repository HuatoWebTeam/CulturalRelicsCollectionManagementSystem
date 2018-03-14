import React, { Component } from 'react';
import { Row, Col, Table } from 'antd';
import { InvenDataAll } from './api';
import { levelInfo, relicsYears } from "../../assets/js/commonFun";

class ShowDetails extends Component {
  state = {
    inventDetailsList: [],
    inventNum: "",
    pageIndex: 1,
    pageSize: 10,
    total: 0
  };
  componentWillMount() {
    console.log(this.props);
    this.setState(
      {
        inventNum: this.props.match.params.id
      },
      () => {
        this.getInventDetailsList();
      }
    );
  }

  getInventDetailsList() {
    const { pageIndex, pageSize, inventNum } = this.state;
    let params = {
      Exhibition_Odd: inventNum,
      pageIndex: pageIndex,
      pageSize: pageSize
    };
    InvenDataAll(params).then(res => {
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
          inventDetailsList: res
        });
      }
    });
  }

  // 分页改变
  paginationChange = (page) => {
      this.setState({
          pageIndex: page
      }, () => {
          this.getInventDetailsList();
      })
  }

  render() {
    const { inventDetailsList, pageIndex, pageSize, total } = this.state;
    const inventDetailsColumns = [
      {
        title: "文物编号",
        dataIndex: "Collection_Number",
        key: "Collection_Number"
      },
      {
        title: "文物图片",
        dataIndex: "Collection_img",
        key: "Collection_img",
        render: (text, record, index) => {
          // console.log(text,record, index)
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
          // console.log(text);
          for (let item of levelInfo) {
            if (Number(text) === item.key) {
              return <span>{item.value}</span>;
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
        title: "年代",
        dataIndex: "Collection_Years",
        key: "Collection_Years",
        render: text => {
          // console.log(text);
          for (let item of relicsYears) {
            if (Number(text) === item.key) {
              return <span>{item.value}</span>;
            }
          }
        }
      },
      {
        title: "完整程度",
        dataIndex: "Integrity",
        key: "Integrity",
        render: text => {
          if (text === 0) {
            return <span>完整</span>;
          } else if (text === 1) {
            return <span>破损</span>;
          }
        }
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
                    ? "#da6214"
                    : text === "出库" ? "#3065bf" : "#666"
              }}
            >
              {text}
            </span>
          );
        }
      },
      {
        title: "盘点状态",
        dataIndex: "ExhibitionState",
        key: "ExhibitionState",
        render: text => {
          return (
            <span
              style={{
                color:
                  text === "待盘点"
                    ? "#da6214"
                    : text === "盘点中" ? "#3065bf" : "#666"
              }}
            >
              {text}
            </span>
          );
        }
      }
    ];
    return (
      <Row className="main-content">
        <Col className="title" span={24}>
          盘点单详情{" "}
          <div
            className="go-back"
            onClick={() => {
              this.props.history.goBack();
            }}
          />
        </Col>
        <Col className="" span={24}>
          <Table
            pagination={{
              current: pageIndex,
              pageSize: pageSize,
              total: total,
              onChange: this.paginationChange
            }}
            dataSource={inventDetailsList}
            columns={inventDetailsColumns}
            bordered
          />
        </Col>
      </Row>
    );
  }
}

export default ShowDetails;