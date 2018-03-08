import React, { Component } from 'react';
import { Row, Col, Button, message } from 'antd';
import './index.less';
import qs from "qs";
import { InsertCollection } from './api';
import RelicsInfoDialog from "./component";

class AddRelics extends Component {
  state = {};

  formSubmit = (value) => {
    console.log(value);
    let params = {
        collection: {
          CollectionName: value.relicsName,
          ReservoirType: value.type,
          StorageId: value.carton,
          CollectionNumber: value.relicsNum,
          Grade: value.levelInfo,
          Number: value.number,
          CollectionState: value.relicsState,
          CollectionTime: value.date,
          MaterialQuality: value.material,
          Category: value.category,
          Weight: value.weight,
          Integrity: value.howComplete,
          Size: value.size
        }
      };
      let formData = new FormData();
      formData.append("collection", params);
      console.log(formData);
      InsertCollection(qs.stringify(params)).then(res => {
        console.log(res);
      });
  }

  render() {
    return (
      <Row className="main-content">
        <Col span={24} className="title">
          新增藏品
        </Col>
        <Col span={24} style={{ padding: "40px 100px" }} className="add-relics">
          <RelicsInfoDialog submit={this.formSubmit} />
        </Col>
      </Row>
    );
  }
}
export default AddRelics;