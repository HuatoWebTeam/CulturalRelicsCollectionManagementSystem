import React, { Component } from 'react';
import { Row, Col, Table } from 'antd';
import './index.less';
import { GetEntryTheLibraryData } from './api';
import { levelInfo, relicsYears, relicsCategory } from "../../../assets/js/commonFun";


class ComplexGeneric extends Component {
    state = {  
        putinData: [],
        pageIndex: 1,
        pageSize: 10,
        total: 0
    }

    componentWillMount() {
        this.getPutInList();
    }

    getPutInList() {
        const { pageIndex, pageSize } = this.state;

        let params = {
            parameters: {
                PageIndex: pageIndex,
                PageSize: pageSize
            }
            
        };
        console.log(params)
        GetEntryTheLibraryData(params).then(res => {
            console.log(res);
            let data = [];
            for(let item of res.Data) {
                data.push({
                    key: item.CollectionNumber,
                    relicsNum: item.CollectionNumber,
                    rfid: item.CollectionRfid,
                    relicsImg: item.Collectionimg1,
                    relicsName: item.CollectionName,
                    date: item.CollectionTime,
                    localtion: item.StorageId,
                    number: item.Number,
                    levelInfo: item.Grade,
                    material: item.MaterialQuality,
                    years: item.CollectionYears,
                    howComplete: item.Integrity,
                    state: item.CollectionState,
                    category: item.Category,
                    operation: item.UserName
                })
            };
            this.setState({
                putinData:data,
                total: res.Total
            })
        })
    }

    // 改变分页
    paginationChange = (page) => {
        this.setState({
            pageIndex: page
        }, () => {
            this.getPutInList();
        })
    }

    render() {
        const { putinData, pageIndex, pageSize, total } = this.state;
        const putinColumns = [
            {
                title: '文物编号',
                dataIndex: 'relicsNum',
                key: 'relicsNum'
            },
            {
                title: '储柜RFID',
                dataIndex: 'rfid',
                key: 'rfid'
            },
            {
                title: '文物图片',
                dataIndex: 'relicsImg',
                key: 'relicsImg',
                render: (text, idx) => {
                    return (
                        <img src={text} alt={idx} style={{width: '55px', height: '55px'}} />
                    )
                }
            },
            {
                title: '文物名称',
                dataIndex: 'relicsName',
                key: 'relicsName'
            },
            {
                title: '入库时间',
                dataIndex: 'date',
                key: 'date'
            },
            {
                title: '储存位置',
                dataIndex: 'localtion',
                key: 'localtion'
            },
            {
                title: '数量',
                dataIndex: 'number',
                key: 'number'
            },
            {
                title: '分级信息',
                dataIndex: 'levelInfo',
                key: 'levelInfo',
                render: (text) => {
                    for(let item of levelInfo) {
                        if(Number(text) === item.key) {
                            return (<span>{item.value}</span>)
                        }
                    }
                }
            },
            {
                title: '材质',
                dataIndex: 'material',
                key: 'material'
            },
            {
                title: '年代',
                dataIndex: 'years',
                key: 'years',
                render:(text) => {
                    for(let item of relicsYears) {
                        if(Number(text) === item.key) {
                            return (<span>{item.value}</span>)
                        }
                    } 
                }
            },
            {
                title: '完整程度',
                dataIndex: 'howComplete',
                key: 'howComplete',
                render: (text) => {
                    if(Number(text) === 0) {
                        return (<span>完整</span>)
                    } else if(Number(text) === 1) {
                        return (<span>破损</span>)
                    }
                }
            },
            {
                title: '状态',
                dataIndex: 'state',
                key: 'state'
            },
            {
                title: '类别',
                dataIndex: 'category',
                key: 'category',
                render: (text) => {
                    for(let item of relicsCategory) {
                        if(Number(text) === item.key) {
                            return (<span>{item.value}</span>)
                        }
                    }
                }
            },
            {
                title: '操作人',
                dataIndex: 'operation',
                key: 'operation'
            }
        ]
        return (
            <Row className='main-content' >
                <Col span={24} className='title' >藏品入库信息</Col>
                <Col span={24} className='putin-stroage-content' >
                    <Table pagination={{ current: pageIndex, pageSize: pageSize, total: total, onChange: this.paginationChange }} columns={putinColumns} dataSource={putinData} bordered  />
                </Col>
            </Row>
        );
    }
}

export default ComplexGeneric;