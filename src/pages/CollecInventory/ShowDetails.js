import React, { Component } from 'react';
import { Row, Col, Table } from 'antd';

class ShowDetails extends Component {
    state = {  
        inventDetailsList: []
    }
    render() {
        const { inventDetailsList } = this.state;
        const inventDetailsColumns = [
            {
                title: "文物编号",
                dataIndex: "serialNum",
                key: "serialNum"
            },
            {
                title: "文物图片",
                dataIndex: "img",
                key: "img",
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
                title: "文物名称",
                dataIndex: "name",
                key: "name"
            },
            {
                title: "数量",
                dataIndex: "number",
                key: "number"
            },
            {
                title: "分级信息",
                dataIndex: "levelInfo",
                key: "lavelInfo"
            },
            {
                title: "材质",
                dataIndex: "material",
                key: "material"
            },
            {
                title: "年代",
                dataIndex: "years",
                key: "years"
            },
            {
                title: "完整程度",
                dataIndex: "howComplete",
                key: "howComplete"
            },
            {
                title: "文物状态",
                dataIndex: "relicState",
                key: "relicState",
                render: text => {
                return (
                    <span
                    style={{
                        color:
                        text === "在库"
                            ? "#da6214"
                            : text === "出库" ? "#3065bf" : "#666"
                    }}
                    >
                    {text}
                    </span>
                );
                }
            },
            {
                title: "盘点状态",
                dataIndex: "inventoryState",
                key: "invrntoryState",
                render: text => {
                return (
                    <span
                    style={{
                        color:
                        text === "待盘点"
                            ? "#da6214"
                            : text === "盘点中" ? "#3065bf" : "#666"
                    }}
                    >
                    {text}
                    </span>
                );
                }
            }
        ]
        return <Row className="main-content">
            <Col className="title" span={24}>
              盘点单详情 <div className="go-back" onClick={() => {
                  this.props.history.goBack();
                }} />
            </Col>
            <Col className="" span={24}>
              <Table dataSource={inventDetailsList} columns={inventDetailsColumns} bordered />
            </Col>
          </Row>;
    }
}

export default ShowDetails;