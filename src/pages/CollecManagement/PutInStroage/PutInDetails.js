import React, { Component } from 'react';
import { Row, Col, Table } from 'antd';
import { GetOutTheLibraryDetails } from "../Outbound/api";
import { relicsYears } from "../../../assets/js/commonFun";
import ApproveComponent from "../../Components/ApproveComponent";

class PutInDetails extends Component {
  state = {
    paramsId: null,
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
        this.getPutInDetail();
      }
    );
  }

  getPutInDetail() {
    let params = { parameters: { Condition: this.state.paramsId } };
    GetOutTheLibraryDetails(params).then(res => {
      console.log(res);
      let list = res.Data.ListCollection;
      for (let item of list) {
        item.key = item.CollectionNumber;
      }
      this.setState({ detailsList: list });
    });
  }
  // 改变审批条件状态
  changeAnthority = () => {
    sessionStorage.setItem("anthoityState", 0);
    this.setState({ anthorityState: 0 });
  };

  render() {
    const { detailsList, paramsId, anthorityState } = this.state;
    const columns = [
      {
        title: "文物编号",
        dataIndex: "CollectionNumber",
        key: "CollectionNumber"
      },
      {
        title: "文物图片",
        dataIndex: "Collectionimg1",
        key: "Collectionimg1",
        render: text => {
          return (
            <img
              src={text}
              alt={text}
              style={{ width: "55px", height: "55px" }}
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
        title: "文物年代",
        dataIndex: "CollectionYears",
        key: "CollectionYears",
        render: text => {
          for (let item of relicsYears) {
            if (Number(text) === item.key) {
              return <span>{item.value}</span>;
            }
          }
        }
      },
      {
        title: '数量',
        dataIndex: 'Number',
        key: 'Number'
      },
      {
        title: "文物材质",
        dataIndex: "MaterialQuality",
        key: "MaterialQuality"
      }
    ];
    return <Row className="main-content">
        <Col span={24} className="title">
          藏品入库详情
          <div
            className="go-back"
            onClick={() => {
              this.props.history.goBack();
            }}
          />
        </Col>
        <Col span={24} style={{ padding: "20px 40px 20px 20px" }}>
          <Table dataSource={detailsList} columns={columns} pagination={false} bordered />
        </Col>
        <Col span={24}>
          {anthorityState === 1 && (
            <ApproveComponent
              paramsId={paramsId}
              flag={2}
              changeAnthorityState={this.changeAnthority}
            />
          )}
        </Col>
      </Row>;
  }
}

export default PutInDetails;