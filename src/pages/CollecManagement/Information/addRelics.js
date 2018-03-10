import React, { Component } from 'react';
import { Row, Col, Button, message } from 'antd';
import './index.less';
import qs from "qs";
import { InsertCollection } from './api';
import RelicsInfoDialog from "./component";

class AddRelics extends Component {
  state = {
    reset: false,
  };
  componentDidMount() {
    
    console.log(this.refs.relicsInfo);
  }
  formSubmit = (value) => {
    console.log(value);
    let params = {
        collection: {
          CollectionName: value.relicsName,
          ReservoirType: value.type,
          StorageId: value.carton,
          CollectionNumber: value.relicsNum,
          Grade: value.levelInfo,
          Number: Number(value.number),
          CollectionState: value.relicsState,
          CollectionTime: value.date,
          MaterialQuality: value.material,
          Category: value.category,
          Weight: value.weight,
          Integrity: value.howComplete,
          Size: value.size,
          StoreId: Number(value.localtion),
          Collectionimg1: value.Collectionimg1,
          Collectionimg2: value.Collectionimg2,
          Collectionimg3: value.Collectionimg3
        }
      };
      // let formData = new FormData();
      // formData.append("collection", params);
      console.log(params);
      InsertCollection(params).then(res => {
        console.log(res);
        if(res.Msg === "操作成功!") {
          message.success('操作成功');
          this.setState({
            reset: true
          })
          this.refs.relicsInfo.resetFields();
        } else {
          message.error('操作失败')
        }
      });
  }

  render() {
    const { reset } = this.state;
    return (
      <Row className="main-content">
        <Col span={24} className="title">
          新增藏品
        </Col>
        <Col span={24} style={{ padding: "40px 100px" }} className="add-relics">
          <RelicsInfoDialog onReset={() => { this.setState({reset: false}) }} reset={reset} submit={this.formSubmit} ref='relicsInfo' />
        </Col>
      </Row>
    );
  }
}
export default AddRelics;