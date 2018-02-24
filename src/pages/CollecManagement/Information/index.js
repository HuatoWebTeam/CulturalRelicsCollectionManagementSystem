import React, { Component } from 'react';

import { Row, Col, Button, Input, Table } from 'antd';
const Search = Input.Search;

class ComplexGeneric extends Component {
    state = {  
        relicsInfoData: [
            {
                relicsNum: 'CP0135',
                relicsImg: require('../../../assets/img/描金彩观音像.jpg'),
                relicsName: '描金彩观音像',
                libraryTime: '2010-25-56',
                number: 1,
                levelInfo: '普通藏品',
                material: '陶器',
                years: '唐',
                howComplete: '破损',
                state: '代管文物',
                category: '动物',
                size: 140,
                weight: '6Kg'
            }
        ]
    }

    // 点击搜索
    onSearchButton (value) {
        console.log(value)
    }
    render() {
        const { relicsInfoData } = this.state;
        const relicInfoColumns = [
            {
                title: '文物编号',
                dataIndex: 'relicsNum',
                key: 'relicsNum'
            },
            {
                title: '文物图片',
                dataIndex: 'relicsImg',
                key: 'relicsImg',
                render: (text, record, index) => {
                    // console.log(text,record, index)
                    return (
                        <img
                            style={{ width: "55px", height: "55px" }}
                            src={text}
                            alt={index}
                        />
                    );
                }
            },
            {
                title: '文物名称',
                dataIndex: 'relicsName',
                key: 'relicsName'
            },
            {
                title: '入馆时间',
                dataIndex: 'libraryTime',
                key: 'libraryTime'
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
                title: '年代',
                dataIndex: 'years',
                key: 'years'
            },
            {
                title: '完整程度',
                dataIndex: 'howComplete',
                key: 'howComplete'
            },
            {
                title: '状态',
                dataIndex: 'state',
                key: 'state'
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
            }
        ]

        return (
            <Row className='main-content' >
                <Col className='title' span={24} >
                    藏品信息列表
                </Col>
                <Col span={24} className='' >
                    <Col span={24} style={{padding: '20px 40px 20px 20px'}} >
                        <Button type='primary' icon='plus' onClick={() => { this.props.history.push('/App/AddRelics') }} >新增藏品</Button>
                        <Search 
                            enterButton
                            onSearch={ this.onSearchButton }
                            style={{ width: '260px', float: 'right' }}
                         />
                    </Col>
                    <Col span={24} >
                        <Table columns={relicInfoColumns} dataSource={relicsInfoData} bordered />
                    </Col>
                </Col>
            </Row>
        );
    }
}

export default ComplexGeneric;