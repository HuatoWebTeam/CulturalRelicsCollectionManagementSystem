import React, { Component } from 'react';
import { Col, Table } from 'antd';
import { relicsState } from '../../../assets/js/commonFun';

class CheckedRelicsInfo extends Component {
    state = {  }
    render() {
        const { data } = this.props;
        const chooseRelicsColumns = [
            {
                title: "文物编号",
                dataIndex: "Collection_Number",
                width: 118
            },
            // {
            //     title: "储柜RFID",
            //     dataIndex: "Storage_RFID",
            // },
            {
                title: "文物图片",
                dataIndex: "Collection_img",
                render: (text, record, index) => {
                // console.log(text,record, index)
                    return (
                        <img
                        style={{ width: "55px", height: "55px" }}
                        src={text}
                        alt={index}
                        />
                    );
                },
            },
            {
                title: "文物名称",
                dataIndex: "Collection_Name",
            },
            // {
            //     title: "储存位置",
            //     dataIndex: "Storage_Position",
            // },
            {
                title: "数量",
                dataIndex: "Number",
            },
            {
                title: "分级信息",
                dataIndex: "GradeName",
            },
            {
                title: '文物类别',
                dataIndex: 'CategoryName'
            },
            {
                title: "材质",
                dataIndex: "MaterialQuality",
            },
            {
                title: "年代",
                dataIndex: "YearsName",
            },
            {
                title: "完整程度",
                dataIndex: "Integrity",
                render: (text) => {
                    if(Number(text) === 0) {
                        return (<span>完整</span>)
                    } else if(Number(text) === 1) {
                        return (<span>破损</span>)
                    }
                },
            },
            {
                title: '文物状态',
                dataIndex: 'Collection_State',
                key: 'Collection_State',
                render: (text) => {
                    for(let item of relicsState) {
                        if(Number(text) === item.key) {
                            return (<span style={{color: Number(text) === 5 ? 'red' : '#666'}} >{item.value}</span>)
                        }
                    }
                },
            },
            ];
        return (
            <Col span={24} >
                <Table dataSource={data} columns={chooseRelicsColumns} pagination={false}  bordered  />
            </Col>
        );
    }
}

export default CheckedRelicsInfo;