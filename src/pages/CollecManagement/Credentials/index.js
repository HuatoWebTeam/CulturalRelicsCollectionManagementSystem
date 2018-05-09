import React, { Component } from 'react';
import { Row, Col, Button, Input, Table, message, Form, Select, DatePicker } from 'antd';
import './index.less';
import { GetCollectionCertificationData, UpdateCollectionRfId } from "./api";
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import moment from 'moment';
import { levelInfo, relicsYears, howComplete, relicsState, subStr } from "../../../assets/js/commonFun";
const { RangePicker } = DatePicker;
const Search = Input.Search;
const Option = Select.Option;

const EditableCell = ({ editable, value, onChange }) => (
  <div>
    {editable ? (
      <Input
        style={{ margin: "-5px 0" }}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    ) : (
      value
    )}
  </div>
);

class ComplexGeneric extends Component {
  state = {
    data: [],
    date: [], // 时间
    searchCategory: 0, // 文物类别
    searchYears: 0, // 文物年代
    cacheData: [],
    condition: "",
    pageIndex: 1,
    pageSize: 10,
    total: 0,
    relicsYears: [],
    relicsCateGory: [],
    format: "YYYY-MM-DD HH:mm:ss"
  };

  componentWillMount() {
    let startDate = moment().subtract(6, "days").hour(0).minute(0).second(0).format();
    let endDate = moment().hour(23).minute(59).second(59).format();
    let relicsYears = JSON.parse(sessionStorage.getItem("relicsYears"));
    let relicsCateGory = JSON.parse(sessionStorage.getItem("relicsCateGory"));
    this.setState(
      {
        date: [startDate, endDate],
        relicsCateGory: relicsCateGory,
        relicsYears: relicsYears,
        pageIndex: this.props.pageIndex
      },
      () => {
        this.getCredentialsList();
      }
    );
  }

  getCredentialsList() {
    const { condition, pageIndex, pageSize, date, searchCategory, searchYears, format } = this.state;

    let params = {
      parameters: {
        Condition: condition,
        PageIndex: pageIndex,
        PageSize: pageSize,
        StaDate: moment(date[0]).format(format),
        EndDate: moment(date[1]).format(format),
        Type: searchCategory,
        Years: searchYears
      }
    };
    GetCollectionCertificationData(params).then(res => {
      console.log(res);
      let data = res.Data || [];
      for (let item of data) {
        item.key = item.CollectionNumber;
      }
      this.cacheData = data.map(item => ({ ...item }));
      this.setState({
        data: data,
        total: res.Total
      });
    });
  }

  paginationChange = page => {
    console.log(page);
    this.setState(
      {
        pageIndex: page
      },
      () => {
        this.getCredentialsList();
        this.props.changePageIndex(page);
      }
    );
  };

  handleSearch = (value) => {
    console.log(value);
    this.setState(
      {
        condition: value = value.replace(/ /g, ''),
        pageIndex: 1
      },
      () => {
        this.getCredentialsList();
      }
    );
  }

  // 编辑表格
  renderColumns(text, record, column) {
    return (
      <EditableCell
        editable={record.editable}
        value={text}
        onChange={value => this.handleChange(value, record.key, column)}
      />
    );
  }
  handleChange(value, key, column) {
    const newData = [...this.state.data];
    const target = newData.filter(item => key === item.key)[0];
    if (target) {
      target[column] = value;
      this.setState({ data: newData });
    }
  }
  edit(key) {
    const newData = [...this.state.data];
    const target = newData.filter(item => key === item.key)[0];
    if (target) {
      target.editable = true;
      this.setState({ data: newData });
    }
  }
  save(key) {
    const newData = [...this.state.data];
    const target = newData.filter(item => key === item.key)[0];
    if (target) {
      console.log(target);
      let params = {
        collection: {
          CollectionNumber: target.CollectionNumber,
          CollectionRfid: target.CollectionRfid
        }
      };
      UpdateCollectionRfId(params).then(res => {
        console.log(res);
        if (res.Msg === "操作成功!") {
          delete target.editable;
          this.setState({ data: newData });
          this.cacheData = newData.map(item => ({ ...item }));
          message.success("编辑成功！");
        } else if (res.Msg === "该RFID已使用!") {
          message.error("该RFID已使用");
        } else {
          message.error("编辑失败！");
        }
      });
    }
  }
  cancel(key) {
    const newData = [...this.state.data];
    const target = newData.filter(item => key === item.key)[0];
    if (target) {
      Object.assign(target, this.cacheData.filter(item => key === item.key)[0]);
      delete target.editable;
      this.setState({ data: newData });
    }
  }
  render() {
    const {
      data,
      pageIndex,
      pageSize,
      total,
      date,
      searchCategory,
      searchYears,
      relicsCateGory,
      relicsYears
    } = this.state;
    const billColumns = [
      {
        title: "RFID号",
        dataIndex: "CollectionRfid",
        key: "CollectionRfid",
        render: (text, record) =>
          this.renderColumns(text, record, "CollectionRfid")
      },
      {
        title: "文物图片",
        dataIndex: "Collectionimg1",
        key: "Collectionimg1",
        render: (text, idx) => {
          return (
            <img
              style={{ width: "55px", height: "55px" }}
              src={text}
              alt={idx}
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
        title: "入馆时间",
        dataIndex: "CollectionTime",
        key: "CollectionTime",
        render: text => {
          return <span>{subStr(text)}</span>;
        }
      },
      {
        title: "数量",
        dataIndex: "Number",
        key: "Number"
      },
      {
        title: "分级信息",
        dataIndex: "GradeName",
      },
      {
        title: "文物类别",
        dataIndex: "CategoryName",
      },
      {
        title: "材质",
        dataIndex: "MaterialQuality",
        key: "MaterialQuality"
      },
      {
        title: "年代",
        dataIndex: "YearsName",
      },
      {
        title: "完整程度",
        dataIndex: "Integrity",
        key: "Integrity",
        render: text => {
          for (let item of howComplete) {
            if (Number(text) === item.key) {
              return <span>{item.value}</span>;
            }
          }
        }
      },
      {
        title: "文物状态",
        dataIndex: "CollStateName",
        key: "CollStateName",
      },
      {
        title: "操作",
        dataIndex: "operation",
        render: (text, record) => {
          const { editable } = record;
          return (
            <div className="editable-row-operaions">
              {editable ? (
                <span>
                  <Button onClick={() => this.save(record.CollectionNumber)}>保存</Button>
                  <Button
                    style={{ marginLeft: "10px" }}
                    onClick={() => this.cancel(record.CollectionNumber)}
                  >
                    取消
                  </Button>
                </span>
              ) : (
                  <Button type='button' onClick={() => this.edit(record.CollectionNumber)}>编辑</Button>
              )}
              <Link style={{marginLeft: '15px'}} to={`/App/CredentialDetails/${record.CollectionNumber}`} >详情</Link>
            </div>
          );
        }
      }
    ];
    return <Row className="main-content">
        <Col span={24} className="title">
          凭证信息列表
        </Col>
        <Col span={24} className="bill-container">
          <Col span={24} className="search-content">
            <Col span={3}>
              <Button type="primary" icon="plus" onClick={() => {
                  this.props.history.push("/App/ProductionCertificate");
                }}>
                制作凭证
              </Button>
            </Col>
            <Col span={21}>
              <Form layout="inline" style={{ float: "right" }}>
                <Form.Item label="文物类别:">
                  <Select style={{ width: "100px" }} defaultValue={searchCategory} onSelect={key => {
                      this.setState({ searchCategory: key });
                    }}>
                    <Option value={0}>全部</Option>
                    {relicsCateGory.map(item => (
                      <Option key={Number(item.CollTypeId)}>
                        {item.CollTypeName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item label="文物年代:">
                  <Select style={{ width: "100px" }} defaultValue={searchYears} onSelect={key => {
                      this.setState({ searchYears: key });
                    }}>
                    <Option value={0}>全部</Option>
                    {relicsYears.map(item => (
                      <Option key={Number(item.YearsId)}>
                        {item.YearsName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item label="起止时间:">
                  <RangePicker defaultValue={[moment(date[0]), moment(date[1])]} placeholder="请选择起止时间" onChange={this.changDate} />
                </Form.Item>
                <Form.Item label={null}>
                  <Search style={{ width: "240px" }} enterButton placeholder="请输入文物名称" onSearch={this.handleSearch} />
                </Form.Item>
              </Form>
            </Col>
          </Col>
          <Col span={24}>
            <Table pagination={{ current: pageIndex, pageSize: pageSize, total: total, onChange: this.paginationChange }} columns={billColumns} dataSource={data} bordered />
          </Col>
        </Col>
      </Row>;
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    pageIndex: state.main.billPage
  }
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    changePageIndex: args => dispatch({ type: 'BILLPAGE', payload: args })
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ComplexGeneric);