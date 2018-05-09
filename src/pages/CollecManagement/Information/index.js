import React, { Component } from 'react';

import { Row, Col, Button, Input, Table, Form, DatePicker, Select, message, Modal } from "antd";
import { GetCollectionData, DeleteCollection } from "./api";
import { levelInfo, relicsYears, howComplete, relicsState, subStr } from "../../../assets/js/commonFun";
// import RelicsInfoDialog from './component';
import moment from 'moment';
import { connect } from 'react-redux';
const Search = Input.Search;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const confirm = Modal.confirm;

class ComplexGeneric extends Component {
  state = {
    relicsInfoData: [],
    date: [], // 时间
    searchCategory: 0, // 文物类别
    searchYears: 0, // 文物年代
    pageIndex: 1,
    pageSize: 10,
    total: 0,
    condition: "",
    relicsYears: [],
    relicsCateGory: [],
    format: "YYYY-MM-DD HH:mm:ss"
  };

  componentWillMount() {
    const { dateFormat } = this.props;
    let startDate = moment()
      .subtract(6, "days")
      .hour(0)
      .minute(0)
      .second(0)
      .format();
    let endDate = moment()
      .hour(23)
      .minute(59)
      .second(59)
      .format();
    let relicsYears = JSON.parse(sessionStorage.getItem("relicsYears"));
    let relicsCateGory = JSON.parse(sessionStorage.getItem("relicsCateGory"));
    this.setState(
      {
        relicsYears: relicsYears,
        relicsCateGory: relicsCateGory,
        date: [startDate, endDate],
        pageIndex: this.props.pageIndex
      },
      () => {
        this.getColletionList();
      }
    );
  }
  // 获取数据
  getColletionList() {
    const {
      pageIndex,
      pageSize,
      condition,
      date,
      searchCategory,
      searchYears,
      format
    } = this.state;
    let params = {
      PageIndex: pageIndex,
      PageSize: pageSize,
      Condition: condition,
      StaDate: moment(date[0]).format(format),
      EndDate: moment(date[1]).format(format),
      Type: searchCategory,
      Years: searchYears
    };
    GetCollectionData(params).then(res => {
      console.log(res);
      let data = [];
      if (res.Data) {
        for (let item of res.Data) {
          data.push({
            relicsNum: item.CollectionNumber,
            relicsImg1: item.Collectionimg1,
            relicsImg2: item.Collectionimg2,
            relicsImg3: item.Collectionimg3,
            relicsName: item.CollectionName,
            libraryTime: item.CollectionTime,
            number: item.Number,
            levelInfo: item.Grade,
            levelName: item.GradeName,
            material: item.MaterialQuality,
            years: item.CollectionYears,
            yearsName: item.YearsName,
            howComplete: item.Integrity,
            CollStateName: item.CollStateName,
            category: item.Category,
            categoryName: item.CategoryName,
            size: item.Size,
            weight: item.Weight,
            key: item.CollectionNumber,
            type: item.ReservoirType,
            carton: item.StorageId.split("-"),
            localtion: item.CollectionPosition
          });
        }
        this.setState({
          relicsInfoData: data,
          total: res.Total
        });
      } else {
        this.setState({
          relicsInfoData: [],
          total: 0
        });
      }
    });
  }
  // 点击搜索
  onSearchButton = value => {
    console.log(value);
    this.setState(
      {
        condition: value,
        pageIndex: 1
      },
      () => {
        this.getColletionList();
      }
    );
  };
  // 分页改变
  paginationChange = page => {
    this.setState(
      {
        pageIndex: page
      },
      () => {
        this.getColletionList();
        this.props.changePageIndex(page);
      }
    );
  };



  // 选择shijian
  changDate = date => {
    this.setState({
      date: [
        date[0]
          .hour(0)
          .minute(0)
          .second(0)
          .format(),
        date[1]
          .hour(23)
          .minute(59)
          .second(59)
          .format()
      ]
    });
  };

  // 对话框
  showConfirm = text => {
    let _this = this;
    confirm({
      title: "确定删除?",
      content: "",
      onOk() {
        // console.log(text);
        let params = { parameters: { Condition: text.relicsNum } };

        DeleteCollection(params).then(res => {
          console.log(res);
          if (res.Msg === "操作成功!") {
            message.success("删除成功");
            _this.getColletionList();
          } else {
            message.error("删除失败");
          }
        });
      },
      onCancel() {
        console.log("Cancel");
      }
    });
  };
  render() {
    const {
      relicsInfoData,
      pageIndex,
      pageSize,
      total,
      date,
      searchCategory,
      searchYears,
      relicsCateGory,
      relicsYears
    } = this.state;
    const { dateFormat } = this.props;
    const relicInfoColumns = [
      {
        title: "文物编号",
        dataIndex: "relicsNum",
        key: "relicsNum"
      },
      {
        title: "文物图片",
        dataIndex: "relicsImg1",
        key: "relicsImg1",
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
        dataIndex: "relicsName",
        key: "relicsName"
      },
      {
        title: "入馆时间",
        dataIndex: "libraryTime",
        key: "libraryTime",
        render: text => {
          return <span>{subStr(text)}</span>;
        }
      },
      {
        title: "数量",
        dataIndex: "number",
        key: "number"
      },
      {
        title: "分级信息",
        dataIndex: "levelName"
      },
      {
        title: "材质",
        dataIndex: "material",
        key: "material"
      },
      {
        title: "年代",
        dataIndex: "yearsName"
      },
      {
        title: "完整程度",
        dataIndex: "howComplete",
        key: "howComplete",
        render: text => {
          for (let item of howComplete) {
            if (Number(text) === item.key) {
              return <span>{item.value}</span>;
            }
          }
        }
      },
      {
        title: "文物类别",
        dataIndex: "categoryName"
      },
      {
        title: "尺寸",
        dataIndex: "size",
        key: "size",
        width: 100
      },
      {
        title: "重量",
        dataIndex: "weight",
        key: "weight"
      },
      {
        title: "文物状态",
        dataIndex: "CollStateName",
        key: "CollStateName",
      },
      {
        title: "编辑",
        dataIndex: "",
        key: "operation",
        render: (text, record) => {
          return (
            <span>
              <Button
                type="button"
                onClick={() => {
                  this.props.changeFormData({
                    state: "编辑藏品",
                    formData: record
                  });
                  this.props.history.push("/App/AddRelics");
                }}
              >
                编辑
              </Button>
              <Button
                type="button"
                style={{ marginLeft: "10px", border: 'none' }}
                onClick={this.showConfirm.bind(this, record)}
              >
                删除
              </Button>
            </span>
          );
        }
      }
    ];

    return (
      <Row className="main-content">
        <Col className="title" span={24}>
          藏品信息列表
        </Col>
        <Col
          span={24}
          className="info-content"
          style={{ padding: "20px 40px 20px 20px" }}
        >
          <Col span={24} style={{ paddingBottom: "20px" }}>
            <Col span={3}>
              <Button
                type="primary"
                icon="plus"
                onClick={() => {
                  this.props.changeFormData({
                    state: "新增藏品",
                    formData: {}
                  });
                  this.props.history.push("/App/AddRelics");
                }}
              >
                新增藏品
              </Button>
            </Col>
            <Col span={21}>
              <Form layout="inline" style={{ float: "right" }}>
                <Form.Item label="文物类别:">
                  <Select
                    style={{ width: "100px" }}
                    defaultValue={searchCategory}
                    onSelect={key => {
                      this.setState({ searchCategory: key });
                    }}
                  >
                    <Option value={0}>全部</Option>
                    {relicsCateGory.map(item => (
                      <Option key={Number(item.CollTypeId)}>
                        {item.CollTypeName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item label="文物年代:">
                  <Select
                    style={{ width: "100px" }}
                    defaultValue={searchYears}
                    onSelect={key => {
                      this.setState({ searchYears: key });
                    }}
                  >
                    <Option value={0}>全部</Option>
                    {relicsYears.map(item => (
                      <Option key={Number(item.YearsId)}>
                        {item.YearsName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item label="起止时间:">
                  <RangePicker
                    defaultValue={[moment(date[0]), moment(date[1])]}
                    placeholder="请选择起止时间"
                    onChange={this.changDate}
                  />
                </Form.Item>
                <Form.Item>
                  <Search
                    placeholder="请输入文物名称或文物编号"
                    enterButton
                    onSearch={this.onSearchButton}
                    style={{ width: "240px" }}
                  />
                </Form.Item>
              </Form>
            </Col>
          </Col>
          <Col span={24}>
            <Table
              pagination={{
                current: pageIndex,
                pageSize: pageSize,
                total: total,
                onChange: this.paginationChange
              }}
              columns={relicInfoColumns}
              dataSource={relicsInfoData}
              bordered
            />
          </Col>
        </Col>
      </Row>
    );
  }
}
// COLLECINFO
const mapStateToProps = (state, ownProps) => {
  return {
    pageIndex: state.main.collecInfoPage,
    dateFormat: state.main.dateFormat,
  }
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    changeFormData: args => dispatch({ type: "COLLECINFO", payload: args }),
    changePageIndex: args => dispatch({ type: 'COLLECINFOPAGE', payload: args })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ComplexGeneric);