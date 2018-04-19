import React, { Component } from 'react';
import { Row, Col, Button, DatePicker, Input, Table, message } from 'antd';
import { Link } from 'react-router-dom';
import './index.less';
import { subStr, exhibitionType, approveState } from "../../assets/js/commonFun";
import moment from 'moment';
import { ExhibitionAll } from './api';
// import Cookie from 'js-cookie';
import { connect } from 'react-redux';
import { ApprovalPassed, ApprovalDenied } from "../../axios";
// import { tableColumns, tableData } from './data';
const { RangePicker } = DatePicker;
const Search  = Input.Search;


class CollecExhibition extends Component {
  state = {
    date: [],
    format: "YYYY-MM-DD",
    pageIndex: 1,
    pageSize: 5,
    total: 0,
    data: []
  };

  componentWillMount() {
    let startDate = moment()
      .subtract(6, "days")
      .format("YYYY-MM-DD");
    let endDate = moment().format("YYYY-MM-DD");
    // console.log();
    this.setState({
      date: [startDate, endDate],
      pageIndex: this.props.pageIndex
    });
  }

  componentDidMount() {
    this.getExhibitionList();
  }

  // 获取藏品展览列表
  getExhibitionList() {
    const { date, pageIndex, pageSize } = this.state;
    // console.log(pageIndex);
    let UserName = JSON.parse(sessionStorage.getItem("UserInfo")).UserName;

    // console.log(UserName);
    let params = {
      strUser: UserName,
      beginTime: date[0],
      endTime: date[1],
      pageIndex: pageIndex,
      pageSize: pageSize
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
            date: subStr(item.StartTine) + " ~ " + subStr(item.EndTime),
            head: item.Person_liable,
            ReceivingPermissions: Number(item.ReceivingPermissions),
            DeniedPermission: Number(item.DeniedPermission),
            StepState: item.StepState
          });
          this.setState({
            data: dataSource
          });
        }
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
      date: dateString
    });
  };
  // 根据日期查询
  dateSearch = () => {
    this.setState({
      pageIndex: 1
    });
    this.getExhibitionList();
  };




  render() {
    // let _this = this;
    const { date, format, pageIndex, pageSize, total, data } = this.state;
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
        key: "type",
        render:(text) => {
          for(let item of exhibitionType) {
            if(item.key === Number(text)) {
              return <span>{item.value}</span>
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
          for(let item of approveState) {
            if(Number(text.StepState) === item.key) {
              return <span style={{color: Number(text.StepState) === 2 ? 'red' : '#666'}} >{item.value}</span>
            }
          }
        }
      },
      
      {
        title: "操作",
        dataIndex: "",
        key: "action",
        render: (text, record, index) => {
          console.log(record);
          
          // return <a href='javascripts:;' name='details'  onClick={_this.checkDetails(index)} >详情+{index}</a>;
          return <Link onClick={() => {
            let state = Number(record.DeniedPermission);
            sessionStorage.setItem('anthoityState', state);
          }} to={`/App/ExhibitionDetails/${text.id}`}>详情</Link>;
        }
      },
    ];
    return (
      <Row className="exhibition-container main-content">
        <Col className="title" span={24}>
          藏品展览
        </Col>
        <Col span={24} className="exhibition-content">
          <Col span={24} className="addexhibition">
            <Button
              type="primary"
              icon="plus"
              onClick={() => {
                this.props.history.push("/App/AddExhibition");
              }}
            >
              添加展览
            </Button>
          </Col>
          <Col span={24} className="search-content">
            <span>选择时间：</span>
            <RangePicker
              defaultValue={[moment(date[0], format), moment(date[1], format)]}
              onChange={this.handleDateChange}
              format="YYYY-MM-DD"
            />
            <Button
              type="primary"
              className=" search-btn"
              onClick={this.dateSearch}
            >
              搜索
            </Button>
            <Search
              className="search-input"
              enterButton
              placeholder="请输入展览主题"
              onSearch={value => console.log(value)}
            />
          </Col>
          <Col span={24} className="exhibition-table">
            <Table
              bordered
              columns={tableColumns}
              dataSource={data}
              pagination={{
                total: total,
                onChange: this.paginationChange,
                current: pageIndex,
                pageSize
              }}
            />
          </Col>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    pageIndex: state.main.exhibitionPage
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    changePageIndex: (args) => dispatch({type: 'EXHIBITIONPAGE', payload: args}),
    changeAuthority: (args) => dispatch({type: 'AUTHORITYSTATE', payload: args})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CollecExhibition);