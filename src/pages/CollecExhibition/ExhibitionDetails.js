import React, { Component } from 'react';
import { Row, Col, Table } from 'antd';
// import { relicDetails } from './data';
import './index.less';
import { ExhibitionDetailsApi } from './api';
import { levelInfo, relicsYears } from '../../assets/js/commonFun';
import ApproveComponent from '../Components/ApproveComponent';


class ExhibitionDetails extends Component {
  state = {
    id: null,
    pageIndex: 1,
    pageSize: 1000,
    total: 0,
    data: [],
    anthorityState: null
  };

  componentWillMount() {
    // console.log(this.props);

    this.setState({
      id: this.props.match.params.id
    });
  }
  componentDidMount() {
    this.getDetailsList();
    let state = sessionStorage.getItem("anthoityState");
    // console.log(state);
    this.setState({
        anthorityState: Number(state)
    });
  }

  getDetailsList() {
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
    });
  }

  paginationChange(page) {
    this.setState({
      pageIndex: page
    });
    this.getDetailsList();
  }
  // 改变审批条件状态
  changeAnthority = () => {
    sessionStorage.setItem("anthoityState", 0);
    this.setState({ anthorityState: 0 });
  }

  render() {
    const { total, pageSize, pageIndex, data, id, anthorityState } = this.state;
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
        key: "lavelInfo",
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
        dataIndex: "material",
        key: "material"
      },
      {
        title: "年代",
        dataIndex: "years",
        key: "years",
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
        dataIndex: "howComplete",
        key: "howComplete",
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
        dataIndex: "relicState",
        key: "relicState",
        render: text => {
          return (
            <span
              style={{
                color:
                  text === "在库"
                    ? "#da6214"
                    : text === "出库"
                      ? "#3065bf"
                      : "#666"
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
                  text === 0
                    ? "#da6214"
                    : text === 1
                      ? "#3065bf"
                      : "#666"
              }}
            >
              {text === 0 ? '待展览' : (text === 1 ? '展览完成' : '展览异常')}
            </span>
          );
        }
      }
    ];
    return (
      <Row className="exhibition-container main-content">
        <Col className="title" span={24}>
          藏品展览详情{" "}
          <div
            className="go-back"
            onClick={() => {
              this.props.history.goBack();
            }}
          />
        </Col>
        <Col
          span={24}
          className="exhibition-content"
          style={{ marginTop: "20px" }}
        >
          <Table
            pagination={false}
            bordered
            columns={relicDetails}
            dataSource={data}
          />
        </Col>
        {anthorityState === 1 && (
          <ApproveComponent
            paramsId={id}
            flag={5}
            changeAnthorityState={this.changeAnthority}
          />
        )}
      </Row>
    );
  }
}

export default ExhibitionDetails;