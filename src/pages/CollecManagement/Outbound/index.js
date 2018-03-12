import React, { Component } from 'react';
import { Row, Col, Button, Input, DatePicker, Table } from 'antd';
import './index.less';
// import moment from 'moment';
import { RangePickerDefault } from '../../../assets/js/commonFun';
import { GetOutTheLibraryData } from './api';
const Search = Input.Search;
const { RangePicker } = DatePicker;

class ComplexGeneric extends Component {
    state = {  
        outboundData: [],
        pageIndex: 1,
        pageSize: 10,
        total: 0,
        date: [],
        condition: ''
    }

    componentWillMount() {
        this.getOutboundList();
    }

    getOutboundList () {
        const { pageIndex, pageSize, date, condition } = this.state;
        let params = {
            parameters:{
                Condition: condition,
                StaDate: date[0],
                EndDate: date[1],
                PageIndex: pageIndex,
                PageSize: pageSize
            }
        }
        GetOutTheLibraryData(params).then(res => {
            console.log(res);
            let data = [];
            for(let item of res.Data) {
                console.log(item);
                data.push({
                    key: item.CollectionNumber,
                    outboundNum: null,
                    relicsNum: item.CollectionNumber,
                    rfid: item.CollectionRfid,
                    relicsImg: item.Collectionimg1,
                    relicsName: item.CollectionName,
                    date: item.OutDateTime,
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
            }
            this.setState({
                outboundData:data,
                total: res.Total
            })
        })
    }

    rangePickerChange = (value) => {
        // console.log(value);
        let format = 'YYYY-MM-DD';
        let date = [value[0].format(format), value[1].format(format)]
        // console.log(date);
        this.setState({
            date: date
        });
    }

    handleSearch (e) {
        console.log(e);
        this.setState({
            condition: e,
            pageIndex: 1
        }, () => {
            this.getOutboundList();
        } )
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
                  <RangePicker defaultValue={RangePickerDefault} format='YYYY-MM-DD' onChange={this.rangePickerChange} />
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