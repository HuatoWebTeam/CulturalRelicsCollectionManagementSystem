import React, { Component } from 'react';
import { Row, Col, Button, Form, Table, Input, DatePicker } from 'antd';
import './index.less';
const FormItem = Form.Item;

class NewInventory extends Component {
    state = {  
      chooseInventoryRelics: [
        {
          key: 0,
          date: '2018-02-28',
          relicsWarehouse: '库房 1',
          relicsName: '云纹扁足鼎',
          relicsNumber:1,
          type: '青铜',
          levelInfo: '普通藏品',
          inventoryPeople: '李四'
        }
      ]
    }
    render() {
      const { chooseInventoryRelics } = this.state;
      const inventoryColumns = [
        {
          title: '时间',
          dataIndex: 'date',
          key: 'date'
        },
        {
          tutle: '文物库房',
          dataIndex: 'relicsWarehouse',
          key: 'relicsWarehpuse'
        },
        {
          title: '文物名称',
          dataIndex: 'relicsName',
          key: 'relicsName'
        },
        {
          title: '文物数量',
          dataIndex: 'relicsNumber',
          key: 'relicsNumber'
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
        }
      ]

        return <Row className="main-content">
            <Col span={24} className="title">
              新建盘点单
            </Col>
            <Col span={24} className="newInventory-container">
              <Form layout="inline">
                <Col span={24} style={{ width: "710px" }}>
                  <FormItem label="盘点时间:" className="form-width50" >
                    <DatePicker />
                  </FormItem>
                  <FormItem label="盘点人:" className="form-width50" >
                    <Input placeholder='请输入盘点人' />
                  </FormItem>
                  <Col span={24} style={{ padding: "20px 70px" }}>
                    <Button type="primary">选择盘点文物</Button>
                  </Col>
                </Col>
                <Col span={24} >
                  <Table columns={inventoryColumns} dataSource={chooseInventoryRelics} bordered pagination={false} />
                </Col>
                <Col span={24} style={{padding: '20px 40px'}} >
                  <Button type='primary' style={{float: 'right'}} >提交盘点单</Button>
                </Col>
              </Form>
            </Col>
          </Row>;
    }
}

export default NewInventory;