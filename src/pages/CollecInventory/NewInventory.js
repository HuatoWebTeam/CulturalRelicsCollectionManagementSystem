import React, { Component } from 'react';
import { Row, Col, Button, Form, Table, Input, DatePicker, message } from 'antd';
import './index.less';
import moment from 'moment';
import RelicsDialog from "../Components/RelicsDialog";
import { levelInfo } from "../../assets/js/commonFun";
import { InventoryAdd } from './api'; 
const FormItem = Form.Item;

class NewInventoryApp extends Component {
  state = {
    chooseInventoryRelics: [],
    chooseRelicsNum: [],
    number: null
  };
  // 提交
  formSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        console.log(fieldsValue);
        const { chooseRelicsNum, number } = this.state;
        if(chooseRelicsNum.length === 0 ){
          message.error('请选择盘点文物');
        }
        let value = {
          ...fieldsValue,
          'date': fieldsValue['date'].format('YYYY-MM-DD')
        };
        let params = {
          InventoryMan: value.inventPeople,
          Inventory_Time: value.date,
          Inventory_Odd: value.inventNum,
          Inventory_Name: value.inventName,
          Collection_Number: chooseRelicsNum.join(','),
          Inventory_Number: number
        };
        InventoryAdd(params).then(res => {
          console.log(res);
          if(res === true) {
            this.setState(
              {
                chooseRelicsNum: []
              },
              () => {
                this.props.form.resetFields();
                message.success("新建盘点单成功");
                this.setState({
                  chooseInventoryRelics: []
                })
                this.refs.relicsDialog.resetTableCheck();
              }
            );
          } else {
            message.error('新建盘点单失败')
          }
          
        })

      }
    });
  };

  // 选择盘点文物
  chooseData  = (value) => {
    console.log(value);
    let keys = [];
    // let data = [];
    let number = 0;
    for(let item of value) {
      keys.push(item.key);
      number = number + Number(item.number)
    }
    this.setState({
      chooseRelicsNum: keys,
      chooseInventoryRelics: value,
      number: number
    })
  }

  render() {
    const { chooseInventoryRelics } = this.state;
    const { getFieldDecorator } = this.props.form;
    const inventoryColumns = [
      {
        title: "文物编码",
        dataIndex: "relicsNum",
        key: "relicsNum"
      },
      {
        title: "文物名称",
        dataIndex: "relicsName",
        key: "relicsName"
      },
      {
        title: "文物位置",
        dataIndex: "localtion",
        key: "localtion"
      },
      {
        title: "文物数量",
        dataIndex: "number",
        key: "number"
      },
      {
        title: "文物材质",
        dataIndex: "material",
        key: "material"
      },
      {
        title: "分级信息",
        dataIndex: "levelInfo",
        key: "levelInfo",
        render:(text) => {
            for(let item of levelInfo) {
                if(Number(text) === item.key) {
                    return (<span>{item.value}</span>)
                }
            }
        }
      },
      // {
      //   title: "盘点人",
      //   dataIndex: "inventoryPeople",
      //   key: "inventoryPeople"
      // }
    ];

    return (
      <Row className="main-content">
        <Col span={24} className="title">
          新建盘点单 <div className='go-back' onClick={() => { this.props.history.goBack() }} ></div>
        </Col>
        <Col span={24} className="newInventory-container">
          <Form layout="inline" onSubmit={this.formSubmit}>
            <Col span={24} style={{ width: "710px" }}>
              <FormItem
                label="盘点时间:"
                labelCol={{ span: 8 }}
                className="form-width50"
              >
                {getFieldDecorator("date", {
                  initialValue: moment(),
                  rules: [{ required: true, message: "请选择盘点时间" }]
                })(<DatePicker format="YYYY-MM-DD" />)}
              </FormItem>
              <FormItem
                label="盘点人:"
                labelCol={{ span: 8 }}
                className="form-width50"
              >
                {getFieldDecorator("inventPeople", {
                  rules: [{ required: true, message: "请输入盘点人" }]
                })(<Input placeholder="请输入盘点人" />)}
              </FormItem>
              {/* <FormItem
                label="盘点单号:"
                labelCol={{ span: 8 }}
                className="form-width50"
              >
                {getFieldDecorator("inventNum", {
                  rules: [{ required: true, message: "请输入盘点单号" }]
                })(<Input placeholder="请输入盘点单号" />)}
              </FormItem> */}
              <FormItem
                label="盘点名称:"
                labelCol={{ span: 8 }}
                className="form-width50"
              >
                {getFieldDecorator("inventName", {
                  rules: [{ required: true, message: "请输入盘点名称" }]
                })(<Input placeholder="请输入盘点名称" />)}
              </FormItem>
              <Col span={24} style={{ padding: "20px 70px" }}>
                <Button
                  type="primary"
                  onClick={() => {
                    this.refs.relicsDialog.openModal();
                  }}
                >
                  选择盘点文物
                </Button>
              </Col>
            </Col>
            <Col span={24}>
              <Table
                columns={inventoryColumns}
                dataSource={chooseInventoryRelics}
                bordered
                pagination={false}
              />
            </Col>
            <Col span={24} style={{ padding: "20px 40px" }}>
              <Button
                type="primary"
                htmlType="submit"
                style={{ float: "right" }}
              >
                提交盘点单
              </Button>
            </Col>
          </Form>
          <RelicsDialog
            chooseData={this.chooseData}
            title="选择盘点文物"
            stat={0}
            ref="relicsDialog"
          />
        </Col>
      </Row>
    );
  }
}
const NewInventory = Form.create()(NewInventoryApp);
export default NewInventory;