import React, { Component } from "react";
import { Row, Col, Form, Input, Button, message, Table, Cascader } from "antd";
import "./index.less";
import { CollectionCertification } from "./api";
// import { ColleApi } from '../../Components/RelicsDialog/api';
import RelicsDialog from "../../Components/RelicsDialog";
import { howComplete, putInCategory } from "../../../assets/js/commonFun";
import CheckedRelicsInfo from "../../Components/CheckedRelicsInfo";
import { GetStorehouseAndStorage } from "../Information/api";

const FormItem = Form.Item;
// const Option = Select.Option;

class ProductionCertificateApp extends Component {
  state = {
    RelicsList: {},
    RelicsList:{Collection_Name:'请选择文物'},
    relicsNum: null,
    number: null,
    loading: false,
    tankInfoList: [],
    stroageLocaltion: [],
    chooseStroageName: "",
    showErrorText: false
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
      const { stroageLocaltion, chooseStroageName } = this.state;
      if (stroageLocaltion.length > 0 || chooseStroageName !== "") {
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
      } else {
        // message.error('请绑定存储柜信息');
        this.setState({
          showErrorText: true
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
        console.log('shezhicunchugui')
        this.setState({
          stroageLocaltion: [stroage[1], stroage[0]]
        });
      }
      console.log('-----')
      this.setState({
        RelicsList: value[0],
        relicsNum: value[0].Collection_Number,
        number: value[0].Number
      });
    }
  };

  // 级联选择
  cascaderChange = value => {
    console.log(value);
    let id = value[1];
    this.setState({ chooseStroageName: id, stroageLocaltion: value });
  };

  render() {
    // console.log(this.state);
    const {
      RelicsList,
      tankInfoList,
      stroageLocaltion,
      showErrorText
    } = this.state;
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
            <FormItem style={{ width: "100%" }} wrapperCol={{ span: 24 }}>
              <Col span={24}> 
                  <Col span={24} className="relics-detail">
                    <Col span={3} className="relics-box ">
                      文物名称
                    </Col>
                    <Col span={9} className="relics-content relics-title">
                     <span className='relicsName' onClick={() => {
                    //   console.log('---')
                      this.refs.relicsDialog.openModal();
                    }}>
                    {RelicsList.Collection_Name}
                    </span>
                    </Col>
                    <RelicsDialog chooseData={this.chooseData}
                    title="请选择文物"
                    radio={true}
                    stat={0}
                    checkedItem={[]}
                    ref="relicsDialog" />
                    <Col span={3} className="relics-box">
                      RFID
                    </Col>
                    <Col span={9} className="relics-content">
                    <FormItem
                       style={{ width: "50%",top:"15px"}}
                      labelCol={{ span: 3 }}
                       >
                    {getFieldDecorator("rfid", {
                      rules: [{ required: true, message:'请输入RFID编码'}]
                       })(<Input placeholder="请输入RFID编码" />)} 
                       </FormItem>
                    </Col>
                    <Col span={3} className="relics-box">
                      文物图片
                    </Col>
                    <Col span={9} className="relics-img">
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
                    <Col span={3} className="relics-box">
                      材质
                    </Col>
                    <Col span={9} className="relics-content">
                      {RelicsList.MaterialQuality}
                    </Col>
                    <Col span={3} className="relics-box">
                      文物编号
                    </Col>
                    <Col span={9} className="relics-content">
                      {RelicsList.Collection_Number}  
                    </Col>
                    <Col span={3} className="relics-box">
                      年代
                    </Col>
                    <Col span={9} className="relics-content">
                      {RelicsList.YearsName}
                    </Col>
                    <Col span={3} className="relics-box">
                     文物等级
                    </Col>
                    <Col span={9} className="relics-content">
                      {RelicsList.GradeName}
                    </Col>
                    <Col span={3} className="relics-box">
                      完整程度
                    </Col>
                    <Col span={9} className="relics-content">
                      {howComplete.map(item => {
                        if (item.key === Number(RelicsList.Integrity)) {
                          return item.value;
                        }
                      })}
                    </Col>
                    <Col span={3} className="relics-box" style={{ position: 'relative' }} >
                      储存位置
                    </Col>
                    <Col span={9} className="relics-content">
                      {
                        // RelicsList.StorageId == ''
                        <Cascader
                          options={tankInfoList}
                          value={stroageLocaltion}
                          disabled={RelicsList.StorageId !== null}
                          style={{ width: '230px' }}
                          onChange={this.cascaderChange}
                          placeholder="请选择存储柜"
                        />
                      }
                      {
                        showErrorText && <span style={{ color: 'red', position: 'absolute', top: '25px', left: '170px' }} >请选择存储柜信息</span>
                      }
                    </Col>
                    <Col span={3} className="relics-box">
                      文物尺寸
                    </Col>
                    <Col span={9} className="relics-content">
                      {RelicsList.Size}
                    </Col>
                    <Col span={3} className="relics-box">
                      文物状态
                    </Col>
                    <Col span={9} className="relics-content">
                      {RelicsList.CollStateName}
                    </Col>
                    <Col span={3} className="relics-box">
                      文物重量
                    </Col>
                    <Col span={9} className="relics-content">
                      {RelicsList.Weight}
                    </Col>
                    <Col span={3} className="relics-box">
                      文物数量
                    </Col>
                    <Col span={9} className="relics-content">
                      {RelicsList.Number}
                    </Col>
                    <Col span={3} className="relics-box">
                      入馆时间
                    </Col>
                    <Col span={9} className="relics-content">
                      {RelicsList.Collection_Time}
                    </Col>
                    <Col span={3} className="relics-box">
                      入库类型
                    </Col>
                    <Col span={9} className="relics-content">
                      {putInCategory.map(item => {
                        if (item.key === Number(RelicsList.ReservoirType)) {
                          return item.value;
                        }
                      })}
                    </Col>
                    <Col span={3} className="relics-box">
                      文物类别
                    </Col>
                    <Col span={9} className="relics-content">
                      {RelicsList.CategoryName}
                    </Col>
                  </Col>
              </Col>
            </FormItem>
            <FormItem style={{margin:"3px 0 0 0 "}} >
              <Button
                loading={this.state.loading}
                type="primary"
                htmlType="submit"
                style={{width:"120px",height:"36px",fontSize:"16px"}}
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
