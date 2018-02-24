import React, { Component } from 'react';

import { Row, Col, Button, Input, Table } from 'antd';
import './index.less';
const Search = Input.Search;


class CollecRepair extends Component {

    state = {  
        repairData: [
            {
                repairOrder: 'FADGFAGR435',
                applyTime: '2018-02-24',
                applicant: '李四',
                relicsNumber: 'CP006',
                relicsImg: require('../../assets/img/描金彩观音像.jpg'),
                relicsName: '描金彩观音像',
                number: 1,
                classification: '普通成品',
                material: '陶器',
                repairMethods: '补缺',
                repairCycle: '一个月',
                repairMan: '王五',
                relicsState: '在库',
                repairState: '待修复',
                key: 0
            },
            {
                repairOrder: 'FADGFAGR435',
                applyTime: '2018-02-24',
                applicant: '李四',
                relicsNumber: 'CP006',
                relicsImg: require('../../assets/img/描金彩观音像.jpg'),
                relicsName: '描金彩观音像',
                number: 1,
                classification: '普通成品',
                material: '陶器',
                repairMethods: '补缺',
                repairCycle: '一个月',
                repairMan: '王五',
                relicsState: '入库',
                repairState: '已修复',
                key: 1
            },
            {
                repairOrder: 'FADGFAGR435',
                applyTime: '2018-02-24',
                applicant: '李四',
                relicsNumber: 'CP006',
                relicsImg: require('../../assets/img/描金彩观音像.jpg'),
                relicsName: '描金彩观音像',
                number: 1,
                classification: '普通成品',
                material: '陶器',
                repairMethods: '补缺',
                repairCycle: '一个月',
                repairMan: '王五',
                relicsState: '出库',
                repairState: '修复中',
                key: 2
            },
            {
                repairOrder: 'FADGFAGR435',
                applyTime: '2018-02-24',
                applicant: '李四',
                relicsNumber: 'CP006',
                relicsImg: require('../../assets/img/描金彩观音像.jpg'),
                relicsName: '描金彩观音像',
                number: 1,
                classification: '普通成品',
                material: '陶器',
                repairMethods: '补缺',
                repairCycle: '一个月',
                repairMan: '王五',
                relicsState: '在库',
                repairState: '修复异常',
                key: 3
            }

        ]
    }

    searchButton () {
        console.log('search')
    }


    render () {

        const repairList = [
            {
                title: '修复单号',
                dataIndex: 'repairOrder',
                key: 'repairOrder'
            },
            {
                title: '申请时间',
                dataIndex: 'applyTime',
                key: 'applyTime'
            },
            {
                title: '申请人',
                dataIndex: 'applicant',
                key: 'applicant'
            },
            {
                title: '文物编号',
                dataIndex: 'relicsNumber',
                key: 'relicsNumber'
            },
            {
                title: '文物图片',
                dataIndex: 'relicsImg',
                key: 'relicsImg',
                render: (text, index) => {
                    return <img style={{width: '55px', height: '55px'}} src={text}  alt={index} />
                }
            },
            {
                title: '文物名称',
                dataIndex: 'relicsName',
                key: 'relicsName'
            },
            {
                title: '数量',
                dataIndex: 'number',
                key: 'number'
            },
            {
                title: '分级信息',
                dataIndex: 'classification',
                key: 'classification'
            },
            {
                title: '材质',
                dataIndex: 'material',
                key: 'material'
            },
            {
                title: '修复方法',
                dataIndex: 'repairMethods',
                key: 'repairMethods'
            },
            {
                title: '修复周期',
                dataIndex: 'repairCycle',
                key: 'repairCycle'
            },
            {
                title: '修复人',
                dataIndex: 'repairMan',
                key: 'repairMan'
            },
            {
                title: '文物状态',
                dataIndex: 'relicsState',
                key: 'relicsState',
                render: (text) => {
                    return <span style={{
                        color: text === '在库' ? '#e15d05' : ( text === '出库' ? '#3065bf' : '#666')
                    }} > {text} </span>
                }
            },
            {
                title: '修复状态',
                dataIndex: 'repairState',
                key: 'repairState',
                render:(text) => {
                    return <span style={{
                        color: text === '待修复' ? '#e15d05' : ( text === '修复中' ? '#3065bf' : (text === '已修复' ? '#666' : 'red'))
                    }} > {text} </span>
                }
            }
        ]
        console.log(this.state)
        return <Row className="main-content">
            <Col className="title">藏品修复列表</Col>
            <Col className="list-content">
              <Col className='seach-container' >
                <Button type="primary" icon="plus" onClick={() => { this.props.history.push('/App/NewRepairList') }} >
                  新建修复单
                </Button>
                <Search
                 onSearch={this.searchButton}
                 enterButton ></Search>
              </Col>
              <Col>
                <Table bordered columns={repairList} dataSource={this.state.repairData}  />
              </Col>
            </Col>
          </Row>;
    }
}

export default CollecRepair;