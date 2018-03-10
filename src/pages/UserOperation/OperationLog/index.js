import React, { Component } from 'react';
import { Row, Col, DatePicker, Button, Table } from 'antd';
const { RangePicker } = DatePicker;

class UserOperation extends Component {
    state = {  
        operationLogList: [
            {
                key: 0,
                operationDate: '2018-03-02',
                userName: '李四',
                operationIp: '192.168.10.0',
                operationType: '添加文物',
                operationLog: '添加普通藏品黑石号文物'
            }
        ]
    }
    render() {
        const { operationLogList } = this.state;
        const operationColumns = [
            {
                title: '操作时间',
                dataIndex: 'operationDate',
                key: 'operationDate'
            },
            {
                title: '用户名',
                dataIndex: 'userName',
                key: 'userName'
            },
            // {
            //     title: '操作IP地址',
            //     dataIndex: 'operationIP',
            //     key: 'operationIP'
            // },
            {
                title: '操作类型',
                dataIndex: 'operationType',
                key: 'operationType'
            },
            {
                title: '日志',
                dataIndex: 'operationLog',
                key: 'operationLog'
            }
        ]
        return (
            <Row className='main-content' >
                <Col span={24} className='title' >
                    操作日志列表
                </Col>
                <Col className='userOperation-container' span={24} style={{padding: '20px 40px 20px 20px'}} >
                    <Col span={24} style={{paddingBottom: '20px'}} >
                        <RangePicker  />
                        <Button type='primary' style={{marginLeft: '20px'}} >搜索</Button>
                    </Col>
                    <Col span={24} >
                        <Table columns={operationColumns} dataSource={operationLogList} bordered />
                    </Col>
                </Col>
            </Row>
        );
    }
}

export default UserOperation;