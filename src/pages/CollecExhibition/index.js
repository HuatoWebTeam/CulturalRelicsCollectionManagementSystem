import React, { Component } from 'react';
import { Row, Col, Button, DatePicker, Input, Table, Select, Form, message, Modal } from 'antd';
import Link from 'react-router-dom/Link';
import './index.less';
import { subStr, exhibitionType, approveState, exhibiState } from "../../assets/js/commonFun";
import moment from 'moment';
import { ExhibitionAll, DeleteExhibit } from "./api";
// import Cookie from 'js-cookie';
import { connect } from 'react-redux';
import { ReturnAdd } from '../../axios';
// import { tableColumns, tableData } from './data';
const { RangePicker } = DatePicker;
const Search  = Input.Search;
const Option = Select.Option;
const confirm = Modal.confirm;


class CollecExhibition extends Component {
  state = {
    date: [],
    format: null,
    pageIndex: 1,
    pageSize: 10,
    total: 0,
    data: [],
    searchType: 10,
    searchName: ""
  };

  componentWillMount() {
    const { dateFormat } = this.props;
    let startDate = moment()
      .subtract(6, "days").hour(0).minute(0).second(0).format();
    let endDate = moment().hour(23).minute(59).second(0).format();
    // console.log();
    this.setState({
      date: [startDate, endDate],
      format: dateFormat,
      pageIndex: this.props.pageIndex
    });
  }

  componentDidMount() {
    this.getExhibitionList();
  }

  // 获取藏品展览列表
  getExhibitionList() {
    const { date, pageIndex, pageSize, searchName, searchType } = this.state;
    // console.log(pageIndex);
    let UserName = JSON.parse(sessionStorage.getItem("UserInfo")).UserName;

    // console.log(UserName);
    let params = {
      strUser: UserName,
      beginTime: date[0],
      endTime: date[1],
      pageIndex: pageIndex,
      pageSize: pageSize,
      theme: searchName,
      Exhibition_Type: searchType,
    };

    ExhibitionAll(params).then(res => {
      console.log(res);
      if (res.length > 0) {
        this.setState({ total: res[0].Count });
        let dataSource = [];
        for (let item of res) {
          dataSource.push({
            key: item.Exhibition_Odd,
            id: item.Exhibition_Odd,
            theme: item.Exhibition_Theme,
            type: item.Exhibition_Type,
            date:
              subStr(item.StartTine) + " ~ " + subStr(item.EndTime),
            head: item.Person_liable,
            ReceivingPermissions: Number(item.ReceivingPermissions),
            DeniedPermission: Number(item.DeniedPermission),
            StepState: item.StepState,
            CreationTime: subStr(item.CreationTime),
            ExhibitionState: item.Exhibition_State,
            ReturnTime: item.ReturnTime,
            RkOdd: item.RkOdd,
            CkOdd: item.CkOdd,
            FlowState: item.FlowState,
            DisplayState: item.DisplayState,
            disabled:
              Number(item.StepState) === 4
                ? Number(item.FlowState) === 0
                  ? true
                  : false
                : Number(item.StepState) === 1
                  ? Number(item.FlowState) === 1
                    ? true
                    : false
                  : false
          });
          console.log('----')
          console.log(item.RkOdd !== '');
          console.log('---')
          console.log(item.CkOdd !== '');
          
        }
        this.setState({
          data: dataSource
        });
      } else {
        this.setState({ total: 0, data: [] });
      }
    });
  }
  // 选择页码
  paginationChange = page => {
    // console.log(page);
    this.setState(
      {
        pageIndex: page
      },
      () => {
        this.getExhibitionList();
        this.props.changePageIndex(page);
      }
    );
  };
  // 选择日期
  handleDateChange = (date, dateString) => {
    // console.log(dateString);
    this.setState({
      date: [
        date[0].hour(0).minute(0).second(0).format(), 
        date[1].hour(23).minute(59).second(0).format()
      ]
    });
  };
  // 根据日期查询
  dateSearch = () => {
    this.setState({
      pageIndex: 1
    });
    this.getExhibitionList();
  };

  // 选择展览类型
  handleSelectChange = (key) =>{
    this.setState({
      searchType: key
    })
  }

  // 查询
  searchData = value => {
    this.setState(
      {
        searchName: value
      },
      () => {
        this.getExhibitionList();
      }
    );
  };

  //  归还按钮
  returnButton = (value) => {
    console.log(value);
    let UserName = JSON.parse(sessionStorage.getItem('UserInfo')).UserName;
    let type = value.type === 0 ? 2 : 0;
    let theme = value.type === 0 ? '内展' : '外展';
    
    console.log(UserName)
    let params = {
      TheLibrary_Purpose: '由展览单' + value.id + '生成的' + theme + '入库单',
      TheLibrary_Time: moment().format('YYYY-MM-DD'),
      name: UserName,
      odd: value.id,
      ReturnType: type,
      ReturnTime: value.ReturnTime,
      TheLibrary_Type: 3,
    };
    ReturnAdd(params).then(res => {
      console.log(res);
      if(res === true) {
        this.getExhibitionList()
      }
    })
  }

    // 对话框   // 删除展览单
  showConfirm = text => {
    let _this = this;
    confirm({
      title: "确定删除?",
      content: "",
      onOk() {
        // console.log(text);
        let params = { odd: text };
        DeleteExhibit(params).then(res => {
          console.log(res)
          if (res === true) {
            message.success("删除成功");
            _this.getExhibitionList();
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
    // let _this = this;
    const {
      date,
      format,
      pageIndex,
      pageSize,
      total,
      data,
      searchType
    } = this.state;
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
        title: "创建时间",
        dataIndex: "CreationTime"
      },
      {
        title: "起止时间",
        dataIndex: "date",
        key: "date"
      },
      {
        title: "展览类型",
        dataIndex: "type",
        key: "type",
        render: text => {
          for (let item of exhibitionType) {
            if (item.key === Number(text)) {
              return <span>{item.value}</span>;
            }
          }
        }
      },
      {
        title: "负责人",
        dataIndex: "head",
        key: "head"
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
                    color: Number(text.StepState) === 2 || Number(text.StepState) === 4 ? "red" : "#666"
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
        title: '展览单状态',
        dataIndex: 'ExhibitionState',
        render: (text) => {
          for(let item  of exhibiState) {
            if(text === item.key) {
              return <span>{item.value}</span>
            }
          }
        }
      },
      {
        title: "操作",
        dataIndex: "",
        key: "action",
        render: (text, record, index) => {
          // console.log(record);

          // return <a href='javascripts:;' name='details'  onClick={_this.checkDetails(index)} >详情+{index}</a>;
          return <span>
              <Button type='text' 
                style={{border: 'none', marginRight: '10px'}}
                disabled={!record.disabled}
                onClick={() => {
                  this.props.changeFormData({state: '编辑展览清单', formData: record.id});
                  this.props.history.push("/App/AddExhibition");
                }}
              >
                编辑
              </Button>
              <Link onClick={() => {
                  let state = Number(record.DeniedPermission);
                  sessionStorage.setItem("anthoityState", state);
                }} to={`/App/ExhibitionDetails/${text.id}`}>
                详情
              </Link>
              <Button type='text' 
                disabled={record.StepState === 3 ? (record.ExhibitionState === 4 ? true : false) : true }
                style={{marginLeft: '10px', border: 'none'}}
                onClick={this.returnButton.bind(this,record)} >
                  归还
              </Button>
              {
                record.RkOdd !== ''
                  ? <Link disabled={record.RkOdd === ''} style={{marginLeft: '10px', border: 'none'}} to={`/App/PutInDetails/${record.RkOdd}`} >查看入库单</Link>
                  : <Link disabled={record.CkOdd === ''} style={{marginLeft: '10px', border: 'none'}} to={`/App/OutboundDetails/${record.CkOdd}`}  >查看出库单</Link> 
                  
              }
              <Button style={{ marginLeft: '10px', border: 'none' }}
                disabled={!record.disabled}
                onClick={this.showConfirm.bind(this, record.id)} >
                删除
              </Button>
            </span>;
        }
      }
    ];
    return <Row className="exhibition-container main-content">
        <Col className="title" span={24}>
          藏品展览
        </Col>
        <Col span={24} className="exhibition-content">
          <Col span={24} className="addexhibition">
            <Col span={3}>
              <Button type="primary" icon="plus" onClick={() => {
                  this.props.history.push("/App/AddExhibition");
                }}>
                添加展览
              </Button>
            </Col>
            <Col span={21}>
              <Form layout="inline" style={{ float: "right" }}>
                <Form.Item label="展览类型">
                  <Select style={{ width: "165px", marginRight: "20px" }} defaultValue={searchType} onSelect={this.handleSelectChange}>
                    <Option value={10}>全部</Option>
                    {exhibitionType.map(item => (
                      <Option value={item.key} key={item.key}>
                        {item.value}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item label="起止日期">
                  <RangePicker 
                  defaultValue={[moment(date[0], format), moment(date[1], format)]} 
                  onChange={this.handleDateChange} format="YYYY-MM-DD" />
                </Form.Item>
                <Form.Item>
                  <Search 
                  className="search-input" enterButton 
                  placeholder="请输入展览主题" 
                  onSearch={this.searchData} />
                </Form.Item>
              </Form>
            </Col>
          </Col>
          <Col span={24} className="exhibition-table">
            <Table bordered columns={tableColumns} dataSource={data} pagination={{ total: total, onChange: this.paginationChange, current: pageIndex, pageSize }} />
          </Col>
        </Col>
      </Row>;
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    pageIndex: state.main.exhibitionPage,
    dateFormat: state.main.dateFormat,
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    changePageIndex: (args) => dispatch({type: 'EXHIBITIONPAGE', payload: args}),
    changeAuthority: (args) => dispatch({type: 'AUTHORITYSTATE', payload: args}),
    changeFormData: args => dispatch({ type: "COLLECINFO", payload: args }),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CollecExhibition);