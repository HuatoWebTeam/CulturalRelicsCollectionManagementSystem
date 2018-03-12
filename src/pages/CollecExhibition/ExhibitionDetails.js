import React, { Component } from 'react';
import { Row, Col, Table } from 'antd';
// import { relicDetails } from './data';
import './index.less';
import { ExhibitionDetailsApi } from './api';

class ExhibitionDetails extends Component {
  state = {
    id: null,
    pageIndex: 1,
    pageSize: 10,
    total: 0,
    data: []
  };

  componentWillMount() {
    console.log(this.props);
    this.setState({
      id: this.props.match.params.id
    });
  }
  componentDidMount() {
    this.getDetailsList();

  }
  getDetailsList () {
    const { pageIndex, id, pageSize } = this.state;
    let params = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      Exhibition_Odd: id
    };
    ExhibitionDetailsApi(params).then(res => {
      console.log(res);
      if (res.length > 0) {
        this.setState({ total: res[0].Count });
        let dataSource = [];
        for (let item of res) {
          dataSource.push({
            key: item.Collection_Number,
            serialNum: item.Collection_Number,
            img: item.Collection_img,
            name: item.Collection_Name,
            number: item.Number,
            levelInfo: item.Grade,
            material: item.MaterialQuality,
            years: item.Collection_Years,
            howComplete: item.Integrity,
            relicState: item.Collection_State,
            exhibitionState: item.ExhibitionState
          });
          this.setState({ data: dataSource });
        }
      } else {
        this.setState({ total: 0 });
      }
      
      
      


    })
    
  };

  paginationChange (page) {
    this.setState({
      pageIndex: page
    });
    this.getDetailsList()
  }
  dataSoure = [
    {
      serialNum: "CPOhkjfg213",
      img: require("../../assets/img/描金彩观音像.jpg"),
      name: "描金彩观音像",
      number: 1,
      levelInfo: "普通藏品",
      material: "陶器",
      years: "唐",
      howComplete: "破损",
      relicState: "在库",
      exhibitionState: "待展览",
      key: 0
    },
    {
      serialNum: "CPOhkjfg213",
      img: require("../../assets/img/描金彩观音像.jpg"),
      name: "描金彩观音像",
      number: 1,
      levelInfo: "普通藏品",
      material: "陶器",
      years: "唐",
      howComplete: "破损",
      relicState: "出库",
      exhibitionState: "展览中",
      key: 2
    },
    {
      serialNum: "CPOhkjfg213",
      img: require("../../assets/img/描金彩观音像.jpg"),
      name: "描金彩观音像",
      number: 1,
      levelInfo: "普通藏品",
      material: "陶器",
      years: "唐",
      howComplete: "破损",
      relicState: "入库",
      exhibitionState: "展览结束",
      key: 1
    }
  ];

  render() {
    const { total, pageSize, pageIndex, data } = this.state;
    const relicDetails = [
      {
        title: "文物编号",
        dataIndex: "serialNum",
        key: "serialNum"
      },
      {
        title: "文物图片",
        dataIndex: "img",
        key: "img",
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
        dataIndex: "name",
        key: "name"
      },
      {
        title: "数量",
        dataIndex: "number",
        key: "number"
      },
      {
        title: "分级信息",
        dataIndex: "levelInfo",
        key: "lavelInfo"
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
        title: "文物状态",
        dataIndex: "relicState",
        key: "relicState",
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
        title: "展览状态",
        dataIndex: "exhibitionState",
        key: "exhibitionState",
        render: text => {
          return (
            <span
              style={{
                color:
                  text === "待展览"
                    ? "#da6214"
                    : text === "展览中" ? "#3065bf" : "#666"
              }}
            >
              {text}
            </span>
          );
        }
      }
    ];
    return (
      <Row className="exhibition-container main-content">
        <Col className="title" span={24}>
          藏品展览详情 <div className='go-back' onClick={() => { this.props.history.goBack() }} ></div>
        </Col>
        <Col span={24} className="exhibition-content" style={{marginTop: '20px'}} >
          <Table pagination={{ total: total, pageSize: pageSize, current: pageIndex, onChange: this.paginationChange }} bordered columns={relicDetails} dataSource={data} />
        </Col>
      </Row>
    );
  }
}

export default ExhibitionDetails;