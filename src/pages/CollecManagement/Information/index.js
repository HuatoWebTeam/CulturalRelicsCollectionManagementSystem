import React, { Component } from 'react';

import { Row, Col, Button, Input, Table } from 'antd';
import { GetCollectionData } from './api';
const Search = Input.Search;

class ComplexGeneric extends Component {
    state = {  
        relicsInfoData: [],
        pageIndex: 1,
        pageSize: 10,
        total: 0,
        condition: ''
    }

    componentWillMount() {
        this.getColletionList();
    }
    // 获取数据
    getColletionList () {
        const { pageIndex, pageSize, condition } = this.state;
        let params = {
            PageIndex: pageIndex,
            PageSize: pageSize,
            Condition: condition
        };
        GetCollectionData(params).then(res => {
            console.log(res);
            let data = [];
            for(let item of res.Data) {
                data.push({
                  relicsNum: item.CollectionNumber,
                  relicsImg: item.Collectionimg1,
                  relicsName: item.CollectionName,
                  libraryTime: item.CollectionTime,
                  number: item.Number,
                  levelInfo: item.Grade,
                  material: item.MaterialQuality,
                  years: item.CollectionYears,
                  howComplete: item.Integrity,
                  state: item.CollectionState,
                  category: item.Category,
                  size: item.Size,
                  weight: item.Weight,
                  key: item.CollectionNumber
                });
            }
            this.setState({
                relicsInfoData: data,
                total: res.Total
            })
        })
    }
    // 点击搜索
    onSearchButton =  (value) => {
        console.log(value);
        this.setState({
            condition: value,
            pageIndex: 1
        }, () => {
            this.getColletionList();
        })

    }
    // 分页改变
    paginationChange = (page) => {
        this.setState({
            pageIndex: page
        }, () => {
            this.getColletionList();
        })
    }
    render() {
        const { relicsInfoData, pageIndex, pageSize, total } = this.state;
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
                            placeholder='请输入文物名称'
                            onSearch={ this.onSearchButton }
                            style={{ width: '260px', float: 'right' }}
                         />
                    </Col>
                    <Col span={24} >
                        <Table pagination={{ current: pageIndex, pageSize: pageSize, total: total, onChange: this.paginationChange }} columns={relicInfoColumns} dataSource={relicsInfoData} bordered />
                    </Col>
                </Col>
            </Row>
        );
    }
}

export default ComplexGeneric;