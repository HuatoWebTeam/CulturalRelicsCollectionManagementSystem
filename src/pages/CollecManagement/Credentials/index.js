import React, { Component } from 'react';
import { Row, Col, Button, Input, Table } from 'antd';
import './index.less';
import { GetCollectionCertificationData } from "./api";
import { levelInfo, relicsYears, relicsCategory } from "../../../assets/js/commonFun";

const Search = Input.Search;

class ComplexGeneric extends Component {
    state = {  
        billData: [ ],
        condition: '',
        pageIndex: 1,
        pageSize: 10,
        total: 0
    }

    componentWillMount() {
        this.getCredentialsList();
    }

    getCredentialsList() {
        const { condition, pageIndex, pageSize } = this.state;

        let params = {
            parameters: {
                Condition: condition,
                PageeIndex: pageIndex,
                PageSize: pageSize
            }
        };
        GetCollectionCertificationData(params).then(res => {
            console.log(res);
            let data = res.Data;
            for(let item of data) {
                item.key = item.CollectionNumber;
            };
            this.setState({
                billData: data,
                total: res.Total
            })
        })
    }

    paginationChange = (page) => {
        this.setState({
            pageIndex: page
        }, () => {
            this.getCredentialsList();
        })
    }

    handleSearch (value) {
        console.log(value);
        this.setState({
            condition: value,
            pageIndex: 1
        }, () => {
            this.getCredentialsList();
        })
    }
    render() {
        const { billData, pageIndex, pageSize, total } = this.state;
        const billColumns = [
            {
                title: 'RFID号',
                dataIndex: 'CollectionRfid',
                key: 'CollectionRfid'
            },
            {
                title: '文物图片',
                dataIndex: 'Collectionimg1',
                key: 'Collectionimg1',
                render: (text, idx) => {
                    return (
                        <img style={{width: '55px', height: '55px'}}
                        src={text} alt={idx} />
                    )
                }
            },
            {
                title: '文物名称',
                dataIndex: 'CollectionName',
                key: 'CollectionName'
            },
            {
                title: '入馆时间',
                dataIndex: 'CollectionTime',
                key: 'CollectionTime'
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
                dataIndex: 'MaterialQuality',
                key: 'MaterialQuality'
            },
            {
                title: '年代',
                dataIndex: 'CollectionYears',
                key: 'CollectionYears',
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
                dataIndex: 'Integrity',
                key: 'Integrity',
                render: (text) => {
                    if(Number(text) === 0) {
                        return (<span>完整</span>)
                    } else if (Number(text) === 1) {
                        return (<span>破损</span>)
                    }
                }
            },
            {
                title: '状态',
                dataIndex: 'CollectionState',
                key: 'CollectionState'
            },
            {
                title: '类别',
                dataIndex: 'Category',
                key: 'Category',
                render:(text) => {
                    for(let item of relicsCategory ) {
                        if(Number(text) === item.key) {
                            return (<span>{item.value}</span>)
                        }
                    }
                }
            }

        ]
        return (
            <Row className='main-content' >
                <Col span={24} className='title' >凭证信息列表</Col>
                <Col span={24} className='bill-container' >
                    <Col span={24} className='search-content' >
                        <Button type='primary' icon='plus'
                         onClick={() => { this.props.history.push('/App/ProductionCertificate') }} >
                            制作凭证
                        </Button>
                        <Search 
                         style={{width: '260px', float: 'right'}}
                         enterButton
                         onSearch={this.handleSearch}
                         />
                    </Col>
                    <Col span={24} >
                        <Table pagination={{ current: pageIndex, pageSize: pageSize, total: total, onChange: this.paginationChange  }} columns={billColumns} dataSource={billData}  bordered />
                    </Col>
                </Col>
            </Row>
        );
    }
}

export default ComplexGeneric;