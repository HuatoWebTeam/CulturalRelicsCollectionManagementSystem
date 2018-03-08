import React, { Component } from 'react';
import { Row, Col, DatePicker, Button, Table } from 'antd';
import './index.less';
import moment from 'moment';
import 'moment/locale/zh-cn';
const { RangePicker } = DatePicker;

class CollecAccounts extends Component {
    state = {  
        accountData: [
            {
                key: 0,
                date: '2018-02-27',
                collectionNum: '5810',
                dataNum: 6003,
                replicaNum: 28,
                imitationsNum: 389,
                escrowNum: 12,
                checkedOut: 51,
                stayAccount: 344,
                backLibrary: 51
            }
        ]
    }
    // 禁止选择时间
    disabledDate = (current) => {
        return current && current > moment().endOf('day');
    }
    render() {
        const { accountData } = this.state;
        const accountsColumns = [
            {
                title: '时间',
                dataIndex: 'date',
                key: 'date'
            },
            {
                title: '藏品数',
                dataIndex: 'collectionNum',
                key: 'collectionNum'
            },
            {
                title: '资料数',
                dataIndex: 'dateNum',
                key: 'dataNum'
            },
            {
                title: '复制品数',
                dataIndex: 'replicaNum',
                key: 'replicaNum'
            },
            {
                title: '仿制品数',
                dataIndex: 'imitationsNum',
                key: 'initationsNum'
            },
            {
                title: '代管数',
                dataIndex: 'escrowNum',
                key: 'escrowNum'
            },
            {
                title: '外借数',
                dataIndex: 'checkedOut',
                key: 'checkedOut'
            },
            {
                title: '待入账数',
                dataIndex: 'stayAccount',
                key: 'stayAccount'
            },
            {
                title: '待回库数',
                dataIndex: 'backLibrary',
                key: 'backLibrary'
            }
        ]
        
        return <Row className="main-content">
            <Col span={24} className="title">
              藏品账目列表
            </Col>
            <Col span={24} className="accounts-container">
              <Col span={24} className="search-container">
                <RangePicker defaultValue={[moment().subtract(6, "days"), moment()]} format="YYYY-MM-DD" disabledDate={this.disabledDate} />
                <Button type="primary">搜索</Button>
              </Col>
              <Col span={24}>
                <Table columns={accountsColumns} dataSource={accountData} bordered />
              </Col>
            </Col>
          </Row>;
    }
}

export default CollecAccounts;