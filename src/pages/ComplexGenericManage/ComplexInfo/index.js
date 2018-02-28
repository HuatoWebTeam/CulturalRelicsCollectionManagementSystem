import React, { Component } from 'react';
import { Row, Col, Button, Input, Table } from 'antd';
import './index.less';
const Search = Input.Search;

class ComplexGeneric extends Component {
    state = {  
        complexInfoList: [
            {
                key: 0,
                relicsNum: 'CP45354',
                relicsImg: require('../../../assets/img/描金彩观音像.jpg'),
                relicsName: '描金彩观音像',
                date: '2018-02-28',
                source: '抢',
                number: 1,
                levelInfo: '普通藏品',
                material: '陶器',
                category: '艺术',
                carton: 'M1245',
                size: '140',
                weight: '6Kg',
                describe: '此文物完全符合描述'
            }
        ]
    }
    render() {
        const { complexInfoList } = this.state;
        const complexInfoColumns = [
            {
                title: '文物编号',
                dataIndex: 'relicsNum',
                key: 'relicsNum'
            },
            {
                title: '文物图片',
                dataIndex: 'relicsImg',
                key: 'relicsImg',
                render: (text, idx) => {
                    return (
                        <img alt={idx} src={text} style={{width: '55px', height: '55px'}} />
                    )
                }
            },
            {
                title: '文物名称',
                dataIndex: 'relicsName',
                key: 'relicsName'
            },
            {
                title: '入馆时间',
                dataIndex: 'date',
                key: 'date'
            },
            {
                title: '来源',
                dataIndex: 'source',
                key: 'source'
            },
            {
                title: '数量',
                dataIndex: 'number',
                key: 'number'
            },
            {
                title: '分级信息',
                dataIndex: 'levelInfo',
                key: 'levelInfo'
            },
            {
                title: '材质',
                dataIndex: 'material',
                key: 'material'
            },
            {
                title: '类别',
                dataIndex: 'category',
                key: 'category'
            },
            {
                title: '存台箱号',
                dataIndex: 'carton',
                key: 'carton'
            },
            {
                title: '尺寸',
                dataIndex: 'size',
                key: 'size'
            },
            {
                title: '重量',
                dataIndex: 'weight',
                key: 'weight'
            },
            {
                title: '鉴定描述',
                dataIndex: 'describe',
                key: 'describe'
            }
        ]
        return (
            <Row className='main-content' >
                <Col span={24} className='title' >复仿制品信息</Col>
                <Col span={24} className='complexInfo-container' >
                    <Col span={24} style={{paddingBottom: '20px'}} >
                        <Button type='primary' icon='plus' onClick={() => { this.props.history.push("/App/AddComplexInfo"); }} >新增信息</Button>
                        <Search
                            enterButton
                            style={{float: 'right', width:'260px'}}
                        />
                    </Col>
                    <Col span={24} >
                        <Table columns={complexInfoColumns} dataSource={complexInfoList} bordered />
                    </Col>
                </Col>
            </Row>
        );
    }
}

export default ComplexGeneric;