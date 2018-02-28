import React, { Component } from 'react';
import { Row, Col, Select, DatePicker, Input, Button, Form, Table } from 'antd';
import './index.less';
const Option = Select.Option;
const { RangePicker } = DatePicker;
const Search = Input.Search;
const FormItem = Form.Item;

class CollecInventory extends Component {
    state = {  
        inventoryDataList: [
            {
                key: 0,
                inventoryNum: 'PD464321',
                date: '2018-02-27',
                relicsWarehouse: '库房1',
                relicsName: '描金彩观音像',
                number: 1,
                type: '陶器',
                levelInfo: '普通藏品',
                inventoryPeople: '李四',
                state: '待盘点'
            }
        ]
    }
    render() {
        const { inventoryDataList } = this.state;
        const inventoryColumns = [
            {
                title: '盘点单号',
                dataIndex: 'inventoryNum',
                key: 'inventoryNum'
            },
            {
                title: '时间',
                dataIndex: 'date',
                key: 'date'
            },
            {
                title: '文物库房',
                dataIndex: 'relicsWarehouse',
                key: 'relicsWarehouse'
            },
            {
                title: '文物名称',
                dataIndex: 'relicsName',
                key: 'relicsName'
            },
            {
                title: '文物数量',
                dataIndex: 'number',
                key: 'number'
            },
            {
                title: '类型',
                dataIndex: 'type',
                key: 'type'
            },
            {
                title: '分级信息',
                dataIndex: 'levelInfo',
                key: 'levelInfo'
            },
            {
                title: '盘点人',
                dataIndex: 'inventoryPeople',
                key: 'inventoryPeople'
            },
            {
                title: '状态',
                dataIndex: 'state',
                key: 'state'
            }
        ]

        return (
            <Row className='main-content' >
                <Col span={24} className='title' >
                    藏品盘点列表
                </Col>
                <Col span={24} className='inventory-container' >
                    <Col span={24} style={{marginBottom: '20px'}} >
                        <Col span={24} style={{paddingBottom: '20px'}} >
                            <Button type='primary' icon='plus' onClick={() => { this.props.history.push("/App/NewInventory"); }} >新建盘点单</Button>
                        </Col>
                        <Col span={18} >
                            <Form layout='inline' >
                                <FormItem label='文物库房:' className='select-form-item' >
                                    <Select>
                                        <Option value='0' >全部</Option>
                                    </Select>
                                </FormItem>
                                <FormItem>
                                    <RangePicker/>
                                </FormItem>
                                <FormItem>
                                    <Button type='primary' >搜索</Button>
                                </FormItem>
                            </Form>
                        </Col>
                        <Col span={6} >
                            <Search enterButton />
                        </Col>
                    </Col>
                    <Col span={24} >
                        <Table columns={inventoryColumns} dataSource={inventoryDataList} bordered />
                    </Col>
                </Col>
            </Row>
        );
    }
}

export default CollecInventory;