import React, { Component } from 'react';
import { Row, Col, Form, Input, Button, message, Table, Cascader } from 'antd';
import './index.less';
import { CollectionCertification } from './api';
// import { ColleApi } from '../../Components/RelicsDialog/api';
import RelicsDialog from "../../Components/RelicsDialog";
import { howComplete, putInCategory } from '../../../assets/js/commonFun';
import CheckedRelicsInfo from "../../Components/CheckedRelicsInfo";
import { GetStorehouseAndStorage } from '../Information/api';

const FormItem = Form.Item;
// const Option = Select.Option;

class ProductionCertificateApp extends Component {
  state = {
    RelicsList: {},
    relicsNum: null,
    number: null,
    loading: false,
    tankInfoList: [],
    stroageLocaltion: [],
    chooseStroageName: ''
  };

  componentWillMount() {
    // this.getRelicsList();
    GetStorehouseAndStorage().then(res => {
      console.log(res);
      let data = [],
        resData = res.Data;
      for (let item of resData) {
        let oneData = {};
        oneData.value = item.StorehouseId;
        oneData.label = item.StorehouseName;
        oneData.children = [];
        for (let childData of item.ListStorage) {
          oneData.children.push({
            value: childData.StorageId,
            label: childData.StorageName
          });
        }
        data.push(oneData);
      }
      // console.log(data)
      this.setState({ tankInfoList: data });
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        this.setState({ loading: true });
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
            Number: this.state.number,
            StorageId: this.state.chooseStroageName
          }
        };
        CollectionCertification(params).then(res => {
          console.log(res);
          this.setState({ loading: false });
          if (res.Msg === "操作成功!") {
            message.success("绑定成功");
            this.props.form.resetFields("rfid");
            this.props.history.goBack();
            this.setState({
              RelicsList: {}
            });
          } else if (res.Msg === "该RFID已使用!") {
            message.error("该RFID已使用");
          } else {
            message.error("绑定失败");
          }
        });
      }
    });
  }

  // 选择文物
  chooseData = value => {
    console.log(value);
    if (value.length > 0) {
      if (value[0].StorageId !== null) {
        let stroage = value[0].StorageId.split("--");
        this.setState({
          stroageLocaltion: [stroage[1], stroage[0]]
        })
      }
      
      this.setState({
        RelicsList: value[0],
        relicsNum: value[0].Collection_Number,
        number: value[0].Number,
      });
    }
  };

  // 级联选择
  cascaderChange = (value) => {
    console.log(value);
    let id = value[1];
    this.setState({ chooseStroageName: id });
  }

  render() {
    console.log(this.state);
    const { RelicsList, tankInfoList, stroageLocaltion } = this.state;
    // console.log(RelicsList === {})
    const { getFieldDecorator } = this.props.form;
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
            <FormItem
              style={{ width: "30%" }}
              label="RFID:"
              labelCol={{ span: 3 }}
            >
              {getFieldDecorator("rfid", {
                rules: [{ required: true, message: "请输入RFID号" }]
              })(<Input />)}
            </FormItem>
            <FormItem style={{ width: "70%" }} label="" labelCol={{ span: 3 }}>
              <Button
                type="button"
                style={{ border: "none", color: "#3065bf" }}
                onClick={() => {
                  this.refs.relicsDialog.openModal();
                  console.log(this.refs.relicsDialog);
                }}
              >
                请选择文物
              </Button>
            </FormItem>
            <FormItem style={{ width: "100%" }} wrapperCol={{ span: 24 }}>
              {/* <CheckedRelicsInfo data={RelicsList} /> */}
              <Col span={24}>
                {RelicsList.Collection_Name && (
                  <Col span={24} className="relics-detail">
                    <Col span={24} className="relics-img">
                      文物图片：
                      {RelicsList.Collection_img && (
                        <img
                          src={ RelicsList.Collection_img }
                          alt={ RelicsList.Collection_Name }
                        />
                      )}
                      {RelicsList.Collectionimg2 && (
                        <img
                          src={RelicsList.Collectionimg2}
                          alt={RelicsList.Collection_Name}
                        />
                      )}
                      {RelicsList.Collectionimg3 && (
                        <img
                          src={RelicsList.Collectionimg3}
                          alt={RelicsList.Collection_Name}
                        />
                      )}
                    </Col>
                    <Col span={7} className="relics-box">
                      文物名称：{RelicsList.Collection_Name}
                    </Col>
                    <Col span={17} className="relics-box">
                      文物状态：{RelicsList.CollStateName}
                    </Col>
                    <Col span={7} className="relics-box">
                      文物编号：{RelicsList.Collection_Number}
                    </Col>
                    <Col span={17} className="relics-box">
                      入库类型：{putInCategory.map(item => {
                        if (item.key === Number(RelicsList.ReservoirType)) {
                          return item.value;
                        }
                      })}
                    </Col>
                    <Col span={7} className="relics-box">
                      存储柜信息：
                      {
                        // RelicsList.StorageId == ''
                        <Cascader
                          options={tankInfoList}
                          defaultValue={stroageLocaltion}
                          disabled={RelicsList.StorageId !== null}
                          style={{ width: '230px' }}
                          onChange={this.cascaderChange}
                          placeholder="请选择存储柜"
                        />
                      }
                    </Col>
                    <Col span={17} className="relics-box">
                      分级信息：{RelicsList.GradeName}
                    </Col>
                    <Col span={7} className="relics-box">
                      文物数量：{RelicsList.Number}
                    </Col>
                    <Col span={17} className="relics-box">
                      文物类别：{RelicsList.CategoryName}
                    </Col>
                    <Col span={7} className="relics-box">
                      文物材质：{RelicsList.MaterialQuality}
                    </Col>
                    <Col span={17} className="relics-box">
                      文物年代：{RelicsList.YearsName}
                    </Col>
                    <Col span={7} className="relics-box">
                      入馆时间：{RelicsList.Collection_Time}
                    </Col>
                    <Col span={17} className="relics-box">
                      文物重量：{RelicsList.Weight}
                    </Col>
                    <Col span={7} className="relics-box">
                      完整程度：{howComplete.map(item => {
                        if (item.key === Number(RelicsList.Integrity)) {
                          return item.value;
                        }
                      })}
                    </Col>
                    <Col span={17} className="relics-box">
                      文物尺寸：{RelicsList.Size}
                    </Col>
                  </Col>
                )}
              </Col>
            </FormItem>

            <FormItem style={{ width: "30%" }} wrapperCol={{ offset: 3 }}>
              <Button
                loading={this.state.loading}
                type="primary"
                htmlType="submit"
              >
                绑定制作
              </Button>
            </FormItem>
          </Form>
          <RelicsDialog
            radio={true}
            stat={1}
            chooseData={this.chooseData}
            checkedItem={[]}
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