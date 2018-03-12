import React, { Component } from 'react';

import { Row, Col, Button, Input, Table } from 'antd';
import './index.less';
import { RepairApi } from './api';
import { levelInfo } from '../../assets/js/commonFun';
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
        const { pageIndex, total } = this.state;
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
                title: '文物编号',
                dataIndex: 'Collection_Number',
                key: 'Collection_Number'
            },
            {
                title: '文物图片',
                dataIndex: 'Collection_img',
                key: 'Collection_img',
                render: (text, index) => {
                    return <img style={{width: '55px', height: '55px'}} src={text}  alt={index} />
                }
            },
            {
                title: '文物名称',
                dataIndex: 'Collection_Name',
                key: 'Collection_Name'
            },
            {
                title: '数量',
                dataIndex: 'Number',
                key: 'Number'
            },
            {
                title: '分级信息',
                dataIndex: 'Grade',
                key: 'Grade',
                render:(text) => {
                    for(let item of levelInfo) {
                        if(Number(text) === item.key) {
                            return (<span>{item.value}</span>);
                            // break;
                        }
                    }
                }
            },
            {
                title: '材质',
                dataIndex: 'MaterialQuality',
                key: 'MaterialQuality'
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
                title: '文物状态',
                dataIndex: 'Collection_State',
                key: 'Collection_State',
                render: (text) => {
                    return <span style={{
                        color: text === '在库' ? '#e15d05' : ( text === '出库' ? '#3065bf' : '#666')
                    }} > {text} </span>
                }
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
                <Table pagination={{ current: pageIndex, total: total, onChange: this.paginationChange }} bordered columns={repairList} dataSource={this.state.repairData}  />
              </Col>
            </Col>
          </Row>;
    }
}

export default CollecRepair;