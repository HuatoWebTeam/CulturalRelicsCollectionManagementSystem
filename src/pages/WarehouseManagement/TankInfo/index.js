import React, { Component } from 'react';
import { Row, Col, Button, Table, Modal, Form, Input, Select } from 'antd';
import './index.less';
const FormItem = Form.Item;
const Option = Select.Option;

class TankInfo extends Component {
  state = {
    tnakInfoList: [
      {
        number: "01",
        tankName: "秦朝书画",
        rfid: "DH1354654+645+",
        tankNum: "CG46843",
        tankLocaltion: "10排3列"
      }
    ],
    tanknModalTitle: "添加存储柜信息",
    isAdd: false,
    tankVisible: false,
    tankForm: {
      tankName: "",
      rfid: "",
      tankNum: "",
      tankLocaltion: ""
    }
  };

  addTankInfo = () => {
    this.setState({
      isAdd: true,
      tanknModalTitle: '添加存储柜信息',
      tankVisible: true
    });
  };
  editorTankInfo = (record) => {
      console.log(record);
      this.setState({
          isAdd: false,
          tankVisible: true,
          tanknModalTitle: '编辑存储柜信息',
          tankForm: {
              rfid: record.rfid,
              tankName: record.tankName,
              tankNum: record.tankNum,
              tankLocaltion: record.tankLocaltion
          }
      })
  }

  handleOk = (e) => {
      console.log(e);
      this.setState({
          tankVisible:false
      });
  }

  handleCancel = e => {
      console.log(e);
      this.setState({ tankVisible: false });
  }

  render() {
    const {
      tnakInfoList,
      tankVisible,
      tankForm,
      isAdd,
      tanknModalTitle
    } = this.state;
    const tankInfoColumns = [
      {
        title: "序号",
        dataIndex: "number",
        key: "number"
      },
      {
        title: "存储柜名称",
        dataIndex: "tankName",
        key: "tankName"
      },
      {
        title: "RFID",
        dataIndex: "rfid",
        key: "rfid"
      },
      {
        title: "存储柜编号",
        dataIndex: "tankNum",
        key: "tankNum"
      },
      {
        title: "存储柜位置",
        dataIndex: "tankLocaltion",
        key: "tankLocaltion"
      },
      {
        title: "操作",
        dataIndex: "",
        key: "operation",
        render: (text, record, idx) => {
          return (
            <Button
              style={{ color: "#3065bf" }}
              onClick={event => {
                event.persist();
                this.editorTankInfo(record);
              }}
            >
              编辑
            </Button>
          );
        }
      }
    ];

    return <Row className="main-content">
        <Col span={24} className="title">
          存储柜信息
        </Col>
        <Col span={24} className="tankInfo-container">
          <Col span={24} style={{ paddingBottom: "20px" }}>
            <Button type="primary" icon="plus" onClick={this.addTankInfo}>
              新增存储柜
            </Button>
          </Col>
          <Col span={24}>
            <Table columns={tankInfoColumns} dataSource={tnakInfoList} bordered />
          </Col>
          <Col span={24}>
            <Modal className="tankInfo-modal" visible={tankVisible} title={tanknModalTitle} width="710px" onOk={this.handleOk} onCancel={this.handleCancel}>
              <Form layout="inline">
                <FormItem label="库房:" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                  <Select style={{ width: "100%" }}>
                    <Option value="0">库房1</Option>
                  </Select>
                </FormItem>
                <FormItem label="RFID:" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                  <Input value={isAdd ? "" : tankForm.rfid} />
                </FormItem>
                <FormItem label="存储柜名称:" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                  <Input value={isAdd ? "" : tankForm.tankName} />
                </FormItem>
                <FormItem label="存储柜编号:" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                  <Input value={isAdd ? "" : tankForm.tankNum} />
                </FormItem>
                <FormItem label="具体位置:" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                  <Input value={isAdd ? "" : tankForm.tankLocaltion} />
                </FormItem>
              </Form>
            </Modal>
          </Col>
        </Col>
      </Row>;
  }
}

export default TankInfo;