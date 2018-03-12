import React, { Component } from 'react';
import { Row, Col, Button, Input, Table } from 'antd';
import './index.less';
import { SolicallApi } from './api';
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
    this.getSolicitionlist();
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
          total: data[0].count
        });
      }
    });
  }

  // 搜索框
  searchQueryData = (value) => {
      this.setState({
          relicsName: value
      }, () => {
          this.getSolicitionlist();
      })
  }
  // 分页改变
  paginationChange = page => {
    this.setState(
      {
        pageIndex: page
      },
      () => {
        this.getSolicitionlist();
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
        title: "数量",
        dataIndex: "Number",
        key: "Number"
      },
      {
        title: "分级信息",
        dataIndex: "Grade",
        key: "Grade"
      },
      {
        title: "材质",
        dataIndex: "MaterialQuality",
        key: "MaterialQuality"
      },
      {
        title: "类别",
        dataIndex: "Solicitation_State",
        key: "Solicitation_State"
      },
      {
        title: "尺寸",
        dataIndex: "Size",
        key: "Size"
      },
      {
        title: "重量",
        dataIndex: "Weight",
        key: "Weight"
      },
      {
        title: "出土信息",
        dataIndex: "BeUnearthed",
        key: "BeUnearthed"
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
                onchenge: this.paginationChange
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

export default CollecSolicition;