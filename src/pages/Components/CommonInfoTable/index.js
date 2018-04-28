import React, { Component } from 'react';
import { Col, Table } from 'antd';

import { levelInfo, relicsYears, howComplete, relicsState, subStr } from "../../../assets/js/commonFun";

class CommonInfoTable extends Component {
    state = {  }
    render() {
        const { data, isPK } = this.props;
        // console.log(isPK);
        const relicInfoColumns = [
            {
                title: '文物编号',
                dataIndex: isPK ? 'CollectionNumber' : 'Collection_Number',
            },
            {
                title: '文物图片',
                dataIndex: isPK ? 'Collectionimg1' :  'Collection_img',
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
                dataIndex: isPK ? 'CollectionName' : 'Collection_Name',
                key: 'Collection_Name'
            },
            {
                title: '入馆时间',
                dataIndex: isPK ? 'CollectionTime' : 'Collection_Time',
                render: (text) => {
                    // console.log(text)
                    return <span>{subStr(text)}</span>;
                }
            },
            {
                title: '数量',
                dataIndex: 'Number',
                key: 'Number'
            },
            {
                title: '分级信息',
                dataIndex: 'GradeName',
                key: 'GradeName',
            },
            {
                title: '材质',
                dataIndex: 'MaterialQuality',
                key: 'MaterialQuality'
            },
            {
                title: '年代',
                dataIndex: 'YearsName',
                key: 'YearsName',
            },
            {
                title: '完整程度',
                dataIndex: 'Integrity',
                key: 'Integrity',
                render: (text) => {
                    for(let item of howComplete) {
                        if(Number(text) === item.key) {
                            return (<span>{item.value}</span>)
                        }
                    }
                }
            },
            {
                title: '文物类别',
                dataIndex: 'CategoryName',
                key: 'CategoryName',
            },
            {
                title: '尺寸',
                dataIndex: 'Size',
                key: 'Size'
            },
            {
                title: '重量',
                dataIndex: 'Weight',
                key: 'Weight'
            },
            {
                title: '文物状态',
                dataIndex: isPK ? 'CollectionState' : 'Collection_State',
                key: 'Collection_State',
                render: (text) => {
                    for(let item of relicsState) {
                        if(Number(text) === item.key) {
                            return (<span style={{color: Number(text) === 5 ? 'red' : '#666'}} >{item.value}</span>)
                        }
                    }
                }
            },
        ]
        return (
            <Col span={24} >
                <Table dataSource={data} columns={relicInfoColumns} bordered pagination={false}  />
            </Col>
        );
    }
}

export default CommonInfoTable;