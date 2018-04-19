import React, { Component } from 'react';
import { Row, Col, Table } from 'antd';
import { InvenDataAll } from './api';
import { levelInfo, relicsYears, relicsState } from "../../assets/js/commonFun";
import ApproveComponent from "../Components/ApproveComponent";

class ShowDetails extends Component {
  state = {
    inventDetailsList: [],
    inventNum: "",
    pageIndex: 1,
    pageSize: 1000,
    total: 0,
    anthorityState: null
  };
  componentWillMount() {
    console.log(this.props);
    let state = sessionStorage.getItem("anthoityState");
    this.setState(
      {
        inventNum: this.props.match.params.id,
        anthorityState: Number(state)
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
  paginationChange = page => {
    this.setState(
      {
        pageIndex: page
      },
      () => {
        this.getInventDetailsList();
      }
    );
  };

  // 改变审批条件状态
  changeAnthority = () => {
    sessionStorage.setItem("anthoityState", 0);
    this.setState({ anthorityState: 0 });
  };

  render() {
    const { inventDetailsList, pageIndex, pageSize, total, inventNum, anthorityState } = this.state;
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
        render: (text) => {
          for(let item of relicsState) {
              if(Number(text) === item.key) {
                  return (<span style={{color: Number(text) === 5 ? 'red' : '#666'}} >{item.value}</span>)
              }
          }
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
                  text === 0
                    ? "#da6214"
                    : text === 1
                      ? "#3065bf"
                      : "#666"
              }}
            >
              {text === 0 ? '待盘点' : (text === 1 ? '盘点完成' : '盘点异常')}
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
        <Col span={24} style={{ padding: "20px 40px 20px 20px" }}>
          <Table
            //
            pagination={false}
            dataSource={inventDetailsList}
            columns={inventDetailsColumns}
            bordered
          />
        </Col>
        {anthorityState === 1 && (
          <ApproveComponent
            paramsId={inventNum}
            flag={4}
            changeAnthorityState={this.changeAnthority}
          />
        )}
      </Row>
    );
  }
}

export default ShowDetails;