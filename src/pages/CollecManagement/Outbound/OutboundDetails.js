import React, { Component } from 'react';
import { Row, Col, Table } from 'antd';
import { GetOutTheLibraryDetails } from './api';
import { levelInfo, relicsYears } from "../../../assets/js/commonFun";
import ApproveComponent from "../../Components/ApproveComponent";

class OutboundDetails extends Component {
  state = {
    paramsId: "",
    detailsList: [],
    anthorityState: null
  };

  componentWillMount() {
    let state = sessionStorage.getItem("anthoityState");
    this.setState(
      {
        paramsId: this.props.match.params.id,
        anthorityState: Number(state)
      },
      () => {
        this.GetOutTheLibraryList();
      }
    );
  }

  GetOutTheLibraryList() {
    let params = {
      parameters: {
        Condition: this.state.paramsId
      }
    };
    GetOutTheLibraryDetails(params).then(res => {
      console.log(res);
      let list = res.Data.ListCollection;
      for (let item of list) {
        item.key = item.CollectionNumber;
      }
      this.setState({
        detailsList: list
      });
    });
  }
  // 改变审批条件状态
  changeAnthority = () => {
    sessionStorage.setItem("anthoityState", 0);
    this.setState({ anthorityState: 0 });
  };
  render() {
    const { detailsList, paramsId, anthorityState } = this.state;
    const detailColumns = [
      {
        title: "文物编号",
        dataIndex: "CollectionNumber",
        key: "CollectionNumber"
      },
      {
        title: "文物图片",
        dataIndex: "Collectionimg1",
        key: "Collectionimg1",
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
        dataIndex: "CollectionName",
        key: "CollectionName"
      },
      {
        title: "数量",
        dataIndex: "Number",
        key: "Number"
      },
      // {
      //   title: "分级信息",
      //   dataIndex: "Grade",
      //   key: "Grade",
      //   render: text => {
      //     for (let item of levelInfo) {
      //       if (Number(text) === item.key) {
      //         return <span>{item.value}</span>;
      //         // break;
      //       }
      //     }
      //   }
      // },
      {
        title: "材质",
        dataIndex: "MaterialQuality",
        key: "MaterialQuality"
      },
      // {
      //   title: "文物状态",
      //   dataIndex: "CollectionState",
      //   key: "CollectionState",
      //   render: text => {
      //     return (
      //       <span
      //         style={{
      //           color:
      //             text === "在库"
      //               ? "#e15d05"
      //               : text === "出库"
      //                 ? "#3065bf"
      //                 : "#666"
      //         }}
      //       >
      //         {" "}
      //         {text}{" "}
      //       </span>
      //     );
      //   }
      // }
    ];
    return (
      <Row className="main-content">
        <Col span={24} className="title">
          出库单详情
          <div
            className="go-back"
            onClick={() => {
              this.props.history.goBack();
            }}
          />
        </Col>
        <Col span={24} style={{ padding: "20px 40px 20px 20px" }}>
          <Table
            pagination={false}
            dataSource={detailsList}
            columns={detailColumns}
            bordered
          />
        </Col>
        <Col span={24} >
          {anthorityState === 1 && (
            <ApproveComponent
              paramsId={paramsId}
              flag={3}
              changeAnthorityState={this.changeAnthority}
            />
          )}
        </Col>
      </Row>
    );
  }
}

export default OutboundDetails;