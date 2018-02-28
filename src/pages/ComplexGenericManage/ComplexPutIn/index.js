import React, { Component } from 'react';
import { Row, Col, Table } from "antd";
import './index.less'

class ComplexGeneric extends Component {
  state = {
    putinData: [
      {
        key: 0,
        relicsNum: "CP12345",
        rfid: "fgaf4556",
        relicsImg: require("../../../assets/img/描金彩观音像.jpg"),
        relicsName: "描金彩观音像",
        date: "2018-02-24",
        localtion: "库房1 ",
        number: 1,
        levelInfo: "普通藏品",
        material: "陶器",
        years: "唐",
        howComplete: "破损",
        state: "在库",
        category: "艺术",
        operation: "李四"
      }
    ]
  };
  render() {
    const { putinData } = this.state;
    const putinColumns = [
      {
        title: "文物编号",
        dataIndex: "relicsNum",
        key: "relicsNum"
      },
      {
        title: "储柜RFID",
        dataIndex: "rfid",
        key: "rfid"
      },
      {
        title: "文物图片",
        dataIndex: "relicsImg",
        key: "relicsImg",
        render: (text, idx) => {
          return (
            <img
              src={text}
              alt={idx}
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
        title: "入库时间",
        dataIndex: "date",
        key: "date"
      },
      {
        title: "储存位置",
        dataIndex: "localtion",
        key: "localtion"
      },
      {
        title: "数量",
        dataIndex: "number",
        key: "number"
      },
      {
        title: "分级信息",
        dataIndex: "levelInfo",
        key: "levelInfo"
      },
      {
        title: "材质",
        dataIndex: "material",
        key: "material"
      },
      {
        title: "年代",
        dataIndex: "years",
        key: "years"
      },
      {
        title: "完整程度",
        dataIndex: "howComplete",
        key: "howComplete"
      },
      {
        title: "状态",
        dataIndex: "state",
        key: "state"
      },
      {
        title: "类别",
        dataIndex: "category",
        key: "category"
      },
      {
        title: "操作人",
        dataIndex: "operation",
        key: "operation"
      }
    ];
    return (
      <Row className="main-content">
        <Col span={24} className="title">
          藏品入库信息
        </Col>
        <Col span={24} className="putin-stroage-content">
          <Table columns={putinColumns} dataSource={putinData} bordered />
        </Col>
      </Row>
    );
  }
}

export default ComplexGeneric;