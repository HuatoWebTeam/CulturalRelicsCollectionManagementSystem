import React, { Component } from 'react';
import { Row, Col, Button, DatePicker, Input, Table } from 'antd';
import { Link } from 'react-router-dom';
import './index.less';
// import { tableColumns, tableData } from './data';
const { RangePicker } = DatePicker;
const Search  = Input.Search;


class CollecExhibition extends Component {
  state = {};



  dataSoure = [
    {
      id: 4564531,
      theme: "展馆文物会展",
      date: "2015-23-56",
      type: "内管",
      head: "李四",
      key: 1
    },{
      id: 4564531,
      theme: "展馆文物会展",
      date: "2015-23-56",
      type: "内管",
      head: "李四",
      key: 0
    }
  ];


  render() {
    // let _this = this;

    const tableColumns = [
      {
        title: "展览单号",
        dataIndex: "id",
        key: "id"
      },
      {
        title: "展览主题",
        dataIndex: "theme",
        key: "theme"
      },
      {
        title: "起止时间",
        dataIndex: "date",
        key: "date"
      },
      {
        title: "展览类型",
        dataIndex: "type",
        key: "type"
      },
      {
        title: "负责人",
        dataIndex: "head",
        key: "head"
      },
      {
        title: "操作",
        dataIndex: "",
        key: "action",
        render: (text, record, index) => {
          // console.log(text, record);
          // return <a href='javascripts:;' name='details'  onClick={_this.checkDetails(index)} >详情+{index}</a>;
          return <Link to={`/App/ExhibitionDetails/${index}`} >详情</Link>
        }
      }
    ];
    return <Row className="exhibition-container main-content">
        <Col className="title" span={24}>
          藏品展览
        </Col>
        <Col span={24} className="exhibition-content">
          <Col span={24} className="addexhibition">
            <Button 
            type="primrary" 
            icon="plus"
            onClick={() => { this.props.history.push('/App/AddExhibition') }}  >
              添加展览
            </Button>
          </Col>
          <Col span={24} className="search-content">
            <span>选择时间：</span>
            <RangePicker  />
            <Button type="primrary" className=" search-btn">
              搜索
            </Button>
            <Search className="search-input" enterButton onSearch={value => console.log(value)} />
          </Col>
          <Col span={24} className="exhibition-table">
            <Table bordered columns={tableColumns} dataSource={this.dataSoure} />
          </Col>
        </Col>
      </Row>;
  }
}

export default CollecExhibition;