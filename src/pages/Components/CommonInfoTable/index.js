import React, { Component } from 'react';
import { Col, Table } from 'antd';
import './index.less';
import { levelInfo, relicsYears, howComplete, relicsState, subStr } from "../../../assets/js/commonFun";

class CommonInfoTable extends Component {
    state = {  }
    render() {
        const { data, isPK, pageIndex, pageSize, total } = this.props;
        // console.log(isPK);
        const relicInfoColumns = [
            {
                title: '文物编号',
                dataIndex: isPK ? 'CollectionNumber' : 'Collection_Number',
                width: 200
            },
            {
                title: '文物图片',
                dataIndex: isPK ? 'Collectionimg1' :  'Collection_img',
                width: 100,
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
                key: 'Collection_Name',
                width: 160
            },
            {
                title: '入馆时间',
                dataIndex: isPK ? 'CollectionTime' : 'Collection_Time',
                render: (text) => {
                    // console.log(text)
                    return <span>{subStr(text)}</span>;
                },
                width: 90
            },
            {
                title: '数量',
                dataIndex: 'Number',
                key: 'Number',
            },
            {
                title: '分级信息',
                dataIndex: 'GradeName',
                key: 'GradeName',
                width: 110
            },
            {
                title: '材质',
                dataIndex: 'MaterialQuality',
                key: 'MaterialQuality',
                width: 100
            },
            {
                title: '年代',
                dataIndex: 'YearsName',
                key: 'YearsName',
                width: 100
            },
            {
                title: '完整程度',
                dataIndex: 'Integrity',
                key: 'Integrity',
                width: 90,
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
                width: 110
            },
            {
                title: '文物状态',
                dataIndex: 'CollStateName',
                key: 'CollStateName',
                width: 100
            },
        ]
        return <Col span={24} style={{borderBottom: '1px solid #e8e8e8'}} >
            <Table onScroll={(e) => {
                console.log(e)
            }} 
            scroll={{ y: 440 }} 
            className='common-table'
            dataSource={data} 
            columns={relicInfoColumns} 
            expandedRowRender={(record => 
                <Col span={24}>
                    <Col span={12} >文物尺寸：{record.Size}</Col>
                    <Col span={12}>
                        文物重量：{record.Weight}
                    </Col>
                </Col>
            )}
            bordered 
            pagination={{ 
                current: pageIndex, 
                pageSize: pageSize, 
                total:total, 
                onChange:this.props.changePageindex,
                hideOnSinglePage: true,
                size: 'small'
            }} />
          </Col>;
    }
}

export default CommonInfoTable;