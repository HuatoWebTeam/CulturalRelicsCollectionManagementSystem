import React, { Component } from 'react';
import { Row, Col, Button, Table, Modal, Form, Input } from 'antd';
import './index.less';
const FormItem = Form.Item;
const { TextArea } = Input;

class WarehouseManage extends Component {
  state = {
    warehouseList: [
      {
        key: 0,
        number: "01",
        warehouseName: "库房 1",
        describe: "fSFJdfhkdluigt"
      }
    ],
    modalVisible: false,
    modalTitle: "新增库房",
    isAdd: false,
    warehouseNameValue: "",
    describeValue: ""
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      modalVisible: false
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      modalVisible: false
    });
  };

  addWarehouse = () => {
    this.setState({
      modalVisible: true,
      isAdd: true,
      modalTitle: "新增库房",
      warehouseNameValue: "",
      describeValue: ""
    });
  };

  editorWarehouse = record => {
    console.log(record);
    this.setState({
        isAdd: false,
        modalVisible: true,
        modalTitle: '编辑库房',
        warehouseNameValue: record.warehouseName,
        describeValue: record.describe
    })
  };

  render() {
    const {
        isAdd,
      warehouseList,
      modalVisible,
      modalTitle,
      warehouseNameValue,
      describeValue
    } = this.state;
    const warehousColumns = [
      {
        title: "序号",
        dataIndex: "number",
        key: "number"
      },
      {
        title: "库房名称",
        dataIndex: "warehouseName",
        key: "warehouseName"
      },
      {
        title: "描述",
        dataIndex: "describe",
        key: "describe"
      },
      {
        title: "操作",
        dataIndex: "",
        key: "operation",
        render: (text, record, idx) => {
          return <Button onClick={(event) => {event.persist(); this.editorWarehouse(record)}} style={{ color: "#3065bf" }}>
              编辑
            </Button>;
        }
      }
    ];

    return <Row className="main-content">
        <Col span={24} className="title">
          库房管理列表
        </Col>
        <Col span={24} className="warehouseInfo-container">
          <Col span={24} style={{ paddingBottom: "20px" }}>
            <Button type="primary" icon="plus" onClick={this.addWarehouse}>
              新增库房
            </Button>
          </Col>
          <Col span={24}>
            <Table columns={warehousColumns} dataSource={warehouseList} bordered />
          </Col>
          <Col span={24}>
            <Modal className='warehouse-modal' title={modalTitle} onOk={this.handleOk} onCancel={this.handleCancel} visible={modalVisible}>
              <Form layout="inline">
                <FormItem  labelCol={{ span: 4 }} wrapperCol={{ span: 16 }} label="库房名称:">
                  <Input value={isAdd ? '' : warehouseNameValue} />
                </FormItem>
                <FormItem  labelCol={{ span: 4 }} wrapperCol={{ span: 16 }} label="描述:">
                  <TextArea value={isAdd ? '' : describeValue} />
                </FormItem>
                <FormItem wrapperCol={{ offset: 4 }} >
                  <Button type='primary' >提交</Button>
                </FormItem>
              </Form>
            </Modal>
          </Col>
        </Col>
      </Row>;
  }
}

export default WarehouseManage;