import React, { Component } from 'react';
import { Row, Col, Button, Input, Table, message } from 'antd';
import './index.less';
import { GetCollectionCertificationData, UpdateCollectionRfId } from "./api";
import { connect } from 'react-redux';
import { levelInfo, relicsYears, howComplete, relicsState } from "../../../assets/js/commonFun";

const Search = Input.Search;
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
    cacheData: [],
    condition: "",
    pageIndex: 1,
    pageSize: 10,
    total: 0,
  };

  componentWillMount() {
    this.setState(
      {
        pageIndex: this.props.pageIndex
      },
      () => {
        this.getCredentialsList();
      }
    );
  }

  getCredentialsList() {
    const { condition, pageIndex, pageSize } = this.state;

    let params = {
      parameters: {
        Condition: condition,
        PageIndex: pageIndex,
        PageSize: pageSize
      }
    };
    GetCollectionCertificationData(params).then(res => {
      console.log(res);
      let data = res.Data;
      for (let item of data) {
        item.key = item.CollectionNumber;
      }
      this.cacheData = data.map(item => ({ ...item }));
      this.setState({
        data: data,
        total: res.Total
      },);
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

  handleSearch(value) {
    console.log(value);
    this.setState(
      {
        condition: value,
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
        }
        UpdateCollectionRfId(params).then(res => {
            console.log(res)
            if (res.Msg === "操作成功!") {
              delete target.editable;
              this.setState({ data: newData });
              this.cacheData = newData.map(item => ({ ...item }));
              message.success("编辑成功！");
            } else {
              message.error("编辑失败！");
            }
        })
      
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
    const { data, pageIndex, pageSize, total } = this.state;
    const billColumns = [
      {
        title: "RFID号",
        dataIndex: "CollectionRfid",
        key: "CollectionRfid",
        render: (text, record) => this.renderColumns(text, record, 'CollectionRfid'),
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
        key: "CollectionTime"
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
        dataIndex: "CollectionState",
        key: "CollectionState",
        render: (text) => {
          for(let item of relicsState) {
              if(Number(text) === item.key) {
                  return (<span style={{color: Number(text) === 5 ? 'red' : '#666'}} >{item.value}</span>)
              }
          }
        }
      },
      {
        title: "文物类别",
        dataIndex: "Category",
        key: "Category",
      },
      {
          title: '操作',
          dataIndex: 'operation',
          render: (text, record) => {
              const { editable } = record;
              return <div className="editable-row-operaions">
                  {editable ? <span>
                      <a onClick={() => this.save(record.key)}>
                        保存
                      </a>
                      <a style={{marginLeft: '10px'}} onClick={() => this.cancel(record.key)}>
                        取消
                      </a>
                    </span> : <a
                      onClick={() => this.edit(record.key)}
                    >
                      编辑
                    </a>}
                </div>;
          }
      }
    ];
    return (
      <Row className="main-content">
        <Col span={24} className="title">
          凭证信息列表
        </Col>
        <Col span={24} className="bill-container">
          <Col span={24} className="search-content">
            <Button
              type="primary"
              icon="plus"
              onClick={() => {
                this.props.history.push("/App/ProductionCertificate");
              }}
            >
              制作凭证
            </Button>
            <Search
              style={{ width: "260px", float: "right" }}
              enterButton
              onSearch={this.handleSearch}
            />
          </Col>
          <Col span={24}>
            <Table
              pagination={{
                current: pageIndex,
                pageSize: pageSize,
                total: total,
                onChange: this.paginationChange
              }}
              columns={billColumns}
              dataSource={data}
              bordered
            />
          </Col>
        </Col>
      </Row>
    );
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