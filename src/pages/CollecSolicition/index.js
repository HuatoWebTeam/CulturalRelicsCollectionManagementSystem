import React, { Component } from 'react';
import { Row, Col, Button, Input, Table } from 'antd';
import './index.less';
const Search = Input.Search;

class CollecSolicition extends Component {
    state = {  
        solicitionRelicsList: [
            {
                key: 0,
                relicsName: '青铜雕像',
                relicsImg: require('../../assets/img/描金彩观音像.jpg'),
                solicitionDate: '2018-02-28',
                number: 1,
                levelInfo: '普通藏品',
                material: '青铜',
                category: '青铜器',
                size: 202,
                weight: '11Kg',
                unearthedInfo: '吉林东部区遗址点挖掘'
            }
        ]
    }
    render() {
        const { solicitionRelicsList } = this.state;
        const solicitionColumns = [
            {
                title: '文物名称',
                dataIndex: 'relicsName',
                key: 'relicsName'
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
                title: '征集时间',
                dataIndex: 'solicitionDate',
                key: 'solicitionDate'
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
                title: '出土信息',
                dataIndex: 'unearthedInfo',
                key: 'unearthedInfo'
            }
        ]

        return (
            <Row className='main-content' >
                <Col span={24} className='title' >藏品征集列表</Col>
                <Col span={24} className='solicition-container' >
                    <Col span={24} >
                        <Button type='primary' icon='plus' onClick={() => { this.props.history.push("/App/AddSolicition"); }} >添加征集</Button>
                        <Search enterButton style={{width: '260px', float: 'right'}} />
                    </Col>
                    <Col span={24} style={{paddingTop: '20px'}} >
                        <Table columns={solicitionColumns} dataSource={solicitionRelicsList} bordered />
                    </Col>
                </Col>
            </Row>
        );
    }
}

export default CollecSolicition;