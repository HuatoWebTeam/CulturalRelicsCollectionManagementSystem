import React, { Component } from 'react';
import { Row, Col, Button, Input, Table } from 'antd';
import './index.less';

const Search = Input.Search;

class ComplexGeneric extends Component {
    state = {  
        billData: [
            {
                key: 0,
                rfid: 'DH12354684653',
                relicsImg: require('../../../assets/img/描金彩观音像.jpg'),
                relicsName: '描金彩观音像',
                date: '2018-02-26',
                number: 1,
                levelInfo: '普通藏品',
                material: '陶器',
                years: '唐',
                howComplete: '破损',
                state: '代管文物',
                category: '人物'
            }
        ]
    }

    handleSearch (value) {
        console.log(value);
    }
    render() {
        const { billData } = this.state;
        const billColumns = [
            {
                title: 'RFID号',
                dataIndex: 'rfid',
                key: 'rfid'
            },
            {
                title: '文物图片',
                dataIndex: 'relicsImg',
                key: 'relicaImg',
                render: (text, idx) => {
                    return (
                        <img style={{width: '55px', height: '55px'}}
                        src={text} alt={idx} />
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
                        <Table columns={billColumns} dataSource={billData}  bordered />
                    </Col>
                </Col>
            </Row>
        );
    }
}

export default ComplexGeneric;