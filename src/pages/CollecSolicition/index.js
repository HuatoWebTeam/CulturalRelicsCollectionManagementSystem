import React, { Component } from 'react';
import { Row, Col, Button, Input, Table, Form, DatePicker, Select, Modal, message } from 'antd';
import './index.less';
import { SolicallApi, SolicitDelete } from "./api";
import { Link } from 'react-router-dom';
import moment from 'moment';
import { approveState, subStr } from "../../assets/js/commonFun";
import { connect } from 'react-redux';
const Search = Input.Search;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const confirm = Modal.confirm;

class CollecSolicition extends Component {
  state = {
    solicitionRelicsList: [],
    date: [],        // 时间
    category: 0,    // 文物类别
    pageIndex: 1,
    pageSize: 10,
    total: 0,
    relicsName: "",  // 搜索，文物名称
    odd: "",        // 搜索，文物编号
    relicsCateList: []
  };

  componentWillMount() {
    let relicsCateGory = JSON.parse(sessionStorage.getItem("relicsCateGory"));
    let soliOdd = sessionStorage.getItem('soliOdd');
    soliOdd = soliOdd === 'null' ? '' : soliOdd;

    let startDate = moment()
      .subtract(6, "days").hour(0).minute(0).second(0).format();
    let endDate = moment().hour(23).minute(59).second(59).format();
    this.setState(
      {
        date: [startDate, endDate],
        pageIndex: this.props.pageIndex,
        relicsCateList: relicsCateGory,
        odd: soliOdd
      },
      () => {
        this.getSolicitionlist();
      }
    );
  }
  // 获取征集列表
  getSolicitionlist() {
    const { pageIndex, pageSize, relicsName, date, category, odd } = this.state;
    let params = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      Collection_Name: relicsName,
      beginTime: date[0],
      endTime: date[1],
      stat: category,
      odd: odd
    };
    SolicallApi(params).then(res => {
      console.log(res);
      let data = res;
      if (data.length === 0) {
        this.setState({ total: 0, solicitionRelicsList: [] });
      } else {
        for (let item of data) {
          item.key = item.Solicitation_Id;
          item.disabled = Number(item.StepState) === 4
            ? Number(item.FlowState) === 0
              ? true
              : false
            : Number(item.StepState) === 1
              ? Number(item.FlowState) === 1
                ? true
                : false
              : false;
        }
        this.setState({
          solicitionRelicsList: data,
          total: data[0].Count
        });
      }
    });
  }

  // 搜索框
  searchQueryData = value => {
    this.setState(
      {
        relicsName: value
      },
      () => {
        this.getSolicitionlist();
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
        this.getSolicitionlist();
        this.props.changePageIndex(page);
      }
    );
  };

  // 选择时间
  changDate = (date, dateString) => {
    console.log(dateString);
    this.setState({
      date: [
        date[0].hour(0).minute(0).second(0).format(), 
        date[1].hour(23).minute(59).second(59).format()
      ]
    });
  }
  // 选择文物类别

  handleSelect = (key) => {
    this.setState({
      category: key
    })
  }
  // 对话框   // 删除展览单
  showConfirm = text => {
    let _this = this;
    confirm({
      title: "确定删除?",
      content: "",
      onOk() {
        console.log(text);
        let params = { Id: text };
        SolicitDelete(params).then(res => {
          if (res === true) {
            message.success("删除成功");
            _this.getSolicitionlist();
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
    const { solicitionRelicsList, pageIndex, pageSize, total, date, category, relicsCateList } = this.state;
    // const { dateFormat } = this.props;
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
        key: "Solicitation_Time",
        render: text => {
          return <span>{subStr(text)}</span>;
        }
      },
      {
        title: "征集人",
        dataIndex: "Solicitation_Name",
        key: "Solicitation_Name"
      },
      {
        title: "身份证号",
        dataIndex: "IdentityCard",
        key: "IdentityCard"
      },
      {
        title: "联系方式",
        dataIndex: "Phone",
        key: "Phone"
      },
      {
        title: "联系地址",
        dataIndex: "Site",
        key: "Site"
      },
      {
        title: "奖金数额",
        dataIndex: "AmountPrize",
        key: "AmountPrize"
      },
      {
        title: "鉴定结果",
        dataIndex: "Identification",
        key: "Identification"
      },
      {
        title: "出土信息",
        dataIndex: "BeUnearthed",
        key: "BeUnearthed"
      },
      {
        title: "审批状态",
        dataIndex: "",
        key: "approval",
        render: (text, value, idx) => {
          for (let item of approveState) {
            if (Number(text.StepState) === item.key) {
              return (
                <span
                  style={{
                    color: Number(text.StepState) === 2 ? "red" : "#666"
                  }}
                >
                  {item.value}
                </span>
              );
            }
          }
        }
      },
      {
        title: "操作",
        dataIndex: "",
        key: "operation",
        render: (text, record, idx) => {
          // console.log(text)
          return <span>
              <Link onClick={() => {
                  let state = Number(text.DeniedPermission);
                  sessionStorage.setItem("solicitionText", JSON.stringify(text));
                  sessionStorage.setItem("anthoityState", state);
                }} to={`/App/ShowSolicitionDetail`}>
                详情
              </Link>
              <Button  
                type='text' 
                style={{marginLeft: '20px', border: 'none'}} 
                onClick={() => {
                  this.props.changeFormData({
                    state: '编辑征集信息',
                    formData: record
                  });
                  this.props.history.push("/App/AddSolicition");
                }}
              >
                  编辑
              </Button>
              <Button disabled={!record.disabled}
                onClick={this.showConfirm.bind(this, record.Solicitation_Id)}>
                删除
              </Button>
            </span>;
        }
      }
    ];

    return <Row className="main-content">
        <Col span={24} className="title">
          藏品征集列表
        </Col>
        <Col span={24} className="solicition-container">
          <Col span={24}>
            <Col span={4}>
              <Button type="primary" icon="plus" onClick={() => {
                  this.props.history.push("/App/AddSolicition");
                }}>
                添加征集
              </Button>
            </Col>
            <Col span={20}>
              <Form layout="inline" style={{ float: "right" }}>
                <Form.Item label="文物类别:">
                  <Select style={{ width: "150px" }} defaultValue={category} onSelect={this.handleSelect}>
                    <Option value={0}>全部</Option>
                    {relicsCateList.map(item => (
                      <Option key={Number(item.CollTypeId)}>
                        {item.CollTypeName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item label="征集时间:">
                  <RangePicker defaultValue={[moment(date[0]), moment(date[1])]} placeholder="请选择起止时间" onChange={this.changDate} />
                </Form.Item>
                <Form.Item>
                  <Search placeholder="请输入文物名称" enterButton onSearch={this.searchQueryData} style={{ width: "200px" }} />
                </Form.Item>
              </Form>
            </Col>
          </Col>
          <Col span={24} style={{ paddingTop: "20px" }}>
            <Table pagination={{ current: pageIndex, pageSize: pageSize, total: total, onChange: this.paginationChange }} columns={solicitionColumns} dataSource={solicitionRelicsList} bordered />
          </Col>
        </Col>
      </Row>;
  }
}
// SOLICITIONPAGE
const mapStateToProps = (state, ownProps) => {
  return {
    pageIndex: state.main.solicitionPage,
    dateFormat: state.main.dateFormat,
  }
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    changePageIndex: args => dispatch({ type: 'SOLICITIONPAGE', payload: args }),
    changeFormData: args => dispatch({ type: "COLLECINFO", payload: args }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps )(CollecSolicition);