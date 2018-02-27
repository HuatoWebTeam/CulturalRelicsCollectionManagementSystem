import React, { Component } from 'react';
import { Row, Col, Button, Input, DatePicker, Table } from 'antd';
import './index.less';
const Search = Input.Search;
const { RangePicker } = DatePicker;

class ComplexGeneric extends Component {
    state = {  
        outboundData: [
            {
                outboundNum: 'CK1756321',
                relicsNum: 'Cp156',
                relicsImg: require('../../../assets/img/描金彩观音像.jpg'),
                relicsName: '描金彩观音像',
                years: '唐',
                number: 1,
                date: '2018-02-26',
                levelInfo: '普通藏品',
                material: '陶器',
                howComplete: '破损',
                state: '在库',
                category: '艺术',
                size: '140',
                weight: '6Kg',
                key: 0
            }
        ]
    }

    handleSearch (e) {
        console.log(e)
    }

    render() {
        const { outboundData } = this.state;
        const outboundColumns = [
            {
                title:'出库单号',
                key: 'outboundNum',
                dataIndex: 'outboundNum'
            },
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
                title: '出库时间',
                dataIndex: 'date',
                key: 'date'
            },
            {
                title: '数量',
                dataIndex:'number',
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
                dataIndex:'category',
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

        return <Row className="main-content">
            <Col span={24} className="title">
              藏品出库信息
            </Col>
            <Col span={24} className="outbound-container">
              <Col span={24}>
                <Col span={24}>
                  <Button type="primary" icon="plus" onClick={() => { this.props.history.push("/App/NewOutbound"); }} >
                    新建出库单
                  </Button>
                </Col>
                <Col span={24} style={{ padding: "20px 0" }}>
                  <RangePicker />
                  <Button type="primary" style={{ marginLeft: "20px" }}>
                    搜索
                  </Button>
                  <Search enterButton onSearch={this.handleSearch} style={{ float: "right", width: "260px" }} />
                </Col>
                <Col span={24} >
                    <Table columns={outboundColumns} dataSource={outboundData} bordered  />
                </Col>
              </Col>
            </Col>
          </Row>;
    }
}

export default ComplexGeneric;