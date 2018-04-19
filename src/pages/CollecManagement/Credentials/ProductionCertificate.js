import React, { Component } from 'react';
import { Row, Col, Form, Input, Button, Select, message, Table } from 'antd';
import './index.less';
import { CollectionCertification } from './api';
import { ColleApi } from '../../Components/RelicsDialog/api';
import RelicsDialog from "../../Components/RelicsDialog";
import { levelInfo, relicsYears, relicsCategory } from '../../../assets/js/commonFun';

const FormItem = Form.Item;
const Option = Select.Option;

class ProductionCertificateApp extends Component {
  state = {
    RelicsList: [],
    relicsNum: null,
    number: null,
  };

  componentWillMount() {
    // this.getRelicsList();
  }

 

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        console.log(fieldsValue.relicsNum);
        const values = {
          ...fieldsValue
        };
        console.log(values);
        // this.props.history.push("/App/Home");
        let params = {
          collection: {
            CollectionNumber: this.state.relicsNum,
            CollectionRfid: values.rfid,
            Number: this.state.number
          }
        };
        CollectionCertification(params).then(res => {
          console.log(res);
          if (res.Msg === "操作成功!") {
            message.success("绑定成功");
            this.props.form.resetFields("rfid");
            this.setState({
              RelicsList: []
            })
          } else {
            message.error("绑定失败");
          }
        });
      }
    });
  }

  // 选择文物
  chooseData = (value) => {
    console.log(value);
    if(value.length > 0) {
      this.setState({
        RelicsList: value,
        relicsNum: value[0].relicsNum,
        number: value[0].number
      });
    }
    
  }

  render() {
    // console.log(this.props);
    const { RelicsList  } = this.state;
    const { getFieldDecorator } = this.props.form;
    const chooseRelicsColumns = [
      {
        title: "文物编号",
        dataIndex: "relicsNum",
        key: "relicsNum"
      },
      {
        title: "储柜RFID",
        dataIndex: "cabinet",
        key: "cabinet"
      },
      {
        title: "文物图片",
        dataIndex: "relicsImg",
        key: "relicsImg",
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
        dataIndex: "relicsName",
        key: "relicsName"
      },
      {
        title: "储存位置",
        dataIndex: "localtion",
        key: "localtion"
      },
      {
        title: "数量",
        dataIndex: "number",
        key: "number"
      },
      {
        title: "分级信息",
        dataIndex: "levelInfo",
        key: "levelInfo",
        render: (text) => {
            for(let item of levelInfo) {
                if(Number(text) === item.key) {
                    return (<span>{item.value}</span>)
                }
            }
        }
      },
      {
        title: "材质",
        dataIndex: "material",
        key: "material"
      },
      {
        title: "年代",
        dataIndex: "years",
        key: "years",
        render:(text) => {
            for(let item of relicsYears) {
                if(Number(text) === item.key) {
                    return (<span>{item.value}</span>)
                }
            } 
        }
      },
      {
        title: "完整程度",
        dataIndex: "howComplete",
        key: "howComplete",
        render: (text) => {
            if(Number(text) === 0) {
                return (<span>完整</span>)
            } else if(Number(text) === 1) {
                return (<span>破损</span>)
            }
        }
      }
    ];
    return (
      <Row className="main-content">
        <Col className="title">
          凭证制作{" "}
          <div
            className="go-back"
            onClick={() => {
              this.props.history.goBack();
            }}
          />
        </Col>
        <Col span={24} className="certificate-form">
          <Form
            layout="inline"
            onSubmit={this.handleSubmit.bind(this)}
            style={{ width: "100%" }}
          >
            <FormItem label="RFID:" labelCol={{ span: 8 }}>
              {getFieldDecorator("rfid", {
                rules: [{ required: true, message: "请输入RFID号" }]
              })(<Input />)}
            </FormItem>
            <FormItem label="" labelCol={{ span: 8 }}>
              <Button
                type="primary"
                onClick={() => {
                  this.refs.relicsDialog.openModal();
                  console.log(this.refs.relicsDialog);
                }}
              >
                请选择文物
              </Button>
            </FormItem>
            <FormItem style={{width: '100%'}} wrapperCol={{span: 24}}>
              <Table bordered dataSource={RelicsList} columns={chooseRelicsColumns} pagination={false}  />
            </FormItem>

            <FormItem style={{ width: "100%" }} wrapperCol={{ offset: 4 }}>
              <Button type="primary" htmlType="submit">
                绑定制作
              </Button>
            </FormItem>
          </Form>
          <RelicsDialog
            radio={true}
            stat={1}
            chooseData={this.chooseData}
            title="选择文物"
            ref="relicsDialog"
          />
        </Col>
      </Row>
    );
  }
}
const ProductionCertificate = Form.create()(ProductionCertificateApp);
export default ProductionCertificate;