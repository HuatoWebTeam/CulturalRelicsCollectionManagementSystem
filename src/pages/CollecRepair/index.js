import React, { Component } from 'react';
import { Row, Col, Button, Input, Table } from 'antd';
import './index.less';
import { RepairApi } from './api';
import { levelInfo, approveState } from "../../assets/js/commonFun";
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
const Search = Input.Search;


class CollecRepair extends Component {

    state = {  
        repairData: [],
        pageIndex: 1,
        pageSize: 10,
        total: 0,
        SearchName: ''
    }

    componentWillMount() {
        this.setState({
            pageIndex:this.props.pageIndex
        }, () => {
            this.getRepairList();
        })
        
    }

    getRepairList =  () => {
        const { pageIndex, pageSize, SearchName } = this.state;
        let params = {
            pageIndex: pageIndex,
            pageSize: pageSize,
            Repair_Id: SearchName
        };
        RepairApi(params).then(res => {
            console.log(res);
            
            if(res.length === 0) {
                this.setState({
                    total: 0
                });
            } else {
                for(let i = 0; i < res.length; i++) {
                    res[i].key = res[i].Repair_Id;
                }

                this.setState({
                    repairData: res,
                    total: res[0].count
                });
            }
        })
    }

    paginationChange = (pageIndex) => {
        // console.log(pageIndex);
        this.setState({
            pageIndex: pageIndex
        }, () => {
            this.getRepairList();
            this.props.changePageIndex(pageIndex)
        });
        
    }

    searchButton (value) {
        console.log('search');
        this.setState({
            pageIndex: 1,
            SearchName: value
        }, () => {
            this.getRepairList();
        })
    }


    render () {
        const { pageIndex, total, pageSize } = this.state;
        const repairList = [
            {
                title: '修复单号',
                dataIndex: 'Repair_Id',
                key: 'Repair_Id'
            },
            {
                title: '申请时间',
                dataIndex: 'Repair_Time',
                key: 'Repair_Time'
            },
            {
                title: '申请人',
                dataIndex: 'Repair_Applicant',
                key: 'Repair_Applicant'
            },
            {
                title: '修复方法',
                dataIndex: 'Repair_Method',
                key: 'Repair_Method'
            },
            {
                title: '修复周期',
                dataIndex: 'Repair_cycle',
                key: 'Repair_cycle'
            },
            {
                title: '修复人',
                dataIndex: 'Repair_Restorer',
                key: 'Repair_Restorer'
            },
            {
                title: '修复状态',
                dataIndex: 'Repair_State',
                key: 'Repair_State',
                render: (text) => {
                    return <span 
                    style={{
                        color: Number(text) === 2 ? 'red' : '#666'
                    }} >
                        {Number(text) === 0 ? "待修复" : (Number(text) === 1 ? '修复完成' : '修复异常')}
                        </span>;
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
                title: '操作',
                dataIndex: '',
                key: 'operation',
                render: (text, record, idx) => {
                // console.log(text)
                return <Link onClick={() => {
                            let state = Number(record.DeniedPermission);
                            sessionStorage.setItem('anthoityState', state);}} 
                            to={`/App/RepairDetails/${text.Repair_Id}`}>
                        详情
                    </Link>;
                }
            },
        ]
        // console.log(this.state)
        return <Row className="main-content">
            <Col className="title">藏品修复列表</Col>
            <Col className="list-content">
              <Col className='seach-container' >
                <Button type="primary" icon="plus" onClick={() => { this.props.history.push('/App/NewRepairList') }} >
                  新建修复单
                </Button>
                <Search
                 placeholder='请输入修复单号'
                 onSearch={this.searchButton}
                 enterButton ></Search>
              </Col>
              <Col>
                <Table pagination={{ current: pageIndex, pageSize: pageSize, total: total, onChange: this.paginationChange }} bordered columns={repairList} dataSource={this.state.repairData}  />
              </Col>
            </Col>
          </Row>;
    }
}

const mapStateToProps = (state, ownProps) => {
  return {
    pageIndex: state.main.repairPage
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    changePageIndex: args => dispatch({ type: "REPAIRPAGE", payload: args })
  };
};

export default  connect(mapStateToProps, mapDispatchToProps)(CollecRepair);