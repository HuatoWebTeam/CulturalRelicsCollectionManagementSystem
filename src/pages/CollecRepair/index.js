import React, { Component } from 'react';
import { Row, Col, Button, Input, Table } from 'antd';
import './index.less';
import { RepairApi } from './api';
import { levelInfo } from '../../assets/js/commonFun';
import { Link } from 'react-router-dom';
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
        this.getRepairList();
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
        console.log(pageIndex);
        this.setState({
            pageIndex: pageIndex
        }, () => {
            this.getRepairList();
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
                render:(text) => {
                    return <span style={{
                        color: text === '待修复' ? '#e15d05' : ( text === '修复中' ? '#3065bf' : (text === '已修复' ? '#666' : 'red'))
                    }} > {text} </span>
                }
            },
            {
                title: '操作',
                dataIndex: '',
                key: 'operation',
                render: (text, croed, idx) => {
                // console.log(text)
                return <Link to={`/App/RepairDetails/${text.Repair_Id}`}>
                    详情
                    </Link>;
                }
            }
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

export default CollecRepair;