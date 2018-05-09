import React, { Component } from 'react';
import { Row, Col, Table, Button, Modal, message } from 'antd';
import { Link } from 'react-router-dom';
import './index.less';
import { GetEntryTheLibraryData, DeleteInTheLibrary } from "./api";
import { connect } from 'react-redux';
import { approveState, subStr, putinState } from "../../../assets/js/commonFun";
const confirm = Modal.confirm;

class ComplexGeneric extends Component {
  state = {
    putinData: [],
    pageIndex: 1,
    pageSize: 10,
    total: 0
  };

  componentWillMount() {
    this.setState(
      {
        pageIndex: this.props.pageIndex
      },
      () => {
        this.getPutInList();
      }
    );
  }

  getPutInList() {
    const { pageIndex, pageSize } = this.state;

    let params = {
      parameters: {
        PageIndex: pageIndex,
        PageSize: pageSize
      }
    };
    console.log(params);
    let UserName = JSON.parse(sessionStorage.getItem("UserInfo")).UserName;
    GetEntryTheLibraryData(params).then(res => {
      console.log(res);
      let data = res.Data;
      for (let item of data) {
        item.key = item.TheLibraryOdd;
        item.showDeleteBtn = UserName === item.Operator;
        
        if(Number(item.State) === 1 || Number(item.State) === 2) {
          item.editable = Number(item.StepState) === 4 ? (Number(item.FlowState) === 0 ? true : false) : (Number(item.StepState) === 1 ? (Number(item.FlowState) === 1 ? true : false) : false);
        } else {
          item.editable = false;
        }
      }
      this.setState({
        putinData: data,
        total: res.Total
      });
    });
  }

  // 改变分页
  paginationChange = page => {
    this.setState(
      {
        pageIndex: page
      },
      () => {
        this.getPutInList();
        this.props.changePageIndex(page);
      }
    );
  };

  // 对话框
  showConfirm = (value) => {
    let _this = this;
    confirm({
      title: '确定删除?',
      content: '',
      onOk() {
        console.log(value);
        let params = {
          parameters: {
            Condition: value
          }
        };
        DeleteInTheLibrary(params).then(res => {
          console.log(res)
          if ( res.Msg === "操作成功!" ) {
            message.success('删除成功');
            _this.getPutInList();
          } else {
            message.error('删除失败')
          }
        })
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }


  render() {
    const { putinData, pageIndex, pageSize, total } = this.state;
    const putinColumns = [
      {
        title: "入库单号",
        dataIndex: "TheLibraryOdd",
        key: "TheLibraryOdd"
      },
      {
        title: "入库详情",
        dataIndex: "TheLibraryPurpose",
        key: "TheLibraryPurpose"
      },
      {
        title: "入库时间",
        dataIndex: "TheLibraryTime",
        key: "TheLibraryTime",
        render:(text) => {
          return <span>{subStr(text)}</span>;
        }
      },
      {
        title: "入库数量",
        dataIndex: "TheLibraryNumber",
        key: "TheLibraryNumber"
      },
      {
        title: "操作人",
        dataIndex: "Operator",
        key: "Operator"
      },
      {
        title: '入库单状态',
        dataIndex: 'TheLibraryState',
        key: 'TheLibraryState',
        render: (text) => {
          for(let item of putinState) {
            if(Number(text) === item.key) {
              return <span style={{
                color:
                  Number(text) === 0
                    ? "#da6214"
                    : (Number(text) === 1
                      ? "#3065bf"
                      : "red")
              }} >{item.value}</span>
            }
          }
         
        }
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
          // console.log(record);
          
          // return <a href='javascripts:;' name='details'  onClick={_this.checkDetails(index)} >详情+{index}</a>;
          return <span>
              <Link onClick={() => {
                  let state = Number(record.DeniedPermission);
                  sessionStorage.setItem("anthoityState", state);
                }} to={`/App/PutInDetails/${text.TheLibraryOdd}`}>
                详情
              </Link>
              <Button 
                style={{ marginLeft: '10px', border: 'none' }}
                disabled={!record.editable}
                onClick={this.showConfirm.bind(this, record.TheLibraryOdd)}
              >
                删除
              </Button>
            </span>;
        }
      },
    ];
    return <Row className="main-content">
        <Col span={24} className="title">
          藏品入库信息
        </Col>
        <Col span={24} className="putin-stroage-content">
          <Col span={24} style={{ paddingBottom: '20px' }} >
            <Button 
              type="primary" icon='plus'
              onClick={() => {
                this.props.history.push("/App/NewPutInStroage");
              }} >
              新增入库
            </Button>
          </Col>
          <Col span={24} >
            <Table 
              pagination={{ current: pageIndex, pageSize: pageSize, total: total, onChange: this.paginationChange }} 
              columns={putinColumns} 
              dataSource={putinData} bordered 
            />
          </Col>
          
        </Col>
      </Row>;
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    pageIndex: state.main.putInPage
  };
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    changePageIndex: args => dispatch({ type: "PUTINSTORAGEPAGE", payload: args })
  };
};

export default connect(mapStateToProps, mapDispatchToProps) (ComplexGeneric);