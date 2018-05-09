import React, { Component } from 'react';
import { Row, Col } from 'antd';
import { CollectAll } from './api';
import './index.less';
import { putInCategory, relicsState, howComplete } from '../../../assets/js/commonFun';
import { GetStorehouseAndStorage } from "../Information/api";

class CredentialDetail extends Component {
  state = {
    odd: "",
    relicsInfo: {},
    tankInfoList: [],
    tankDetails: ''
  };

  componentWillMount() {
    console.log(this.props);
    const odd = this.props.match.params.id;
    this.getCasaderData();
    this.setState(
      {
        odd: odd
      },
      () => {
        const { odd } = this.state;
        let params = {
          Collection_Number: odd
        };
        CollectAll(params).then(res => {
          console.log(res);
          const { tankInfoList } = this.state;
          let stroage = res[0].StorageId.split('-');
            let name = '';
          if (tankInfoList.length > 0) {
              for(let item of tankInfoList) {
                  if(stroage[0] === item.value) {
                      for(let key of item.children) {
                        if(stroage[1] === key.value) {
                            name = item.label + '/' + key.label;
                            break;
                        }
                      }
                  }
              }
          }
          this.setState({
            relicsInfo: res[0],
            tankDetails: name
          });
        });
      }
    );
  }

  getCasaderData = () => {
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
        const { relicsInfo } = this.state;
        let name = '';
        if (relicsInfo.StorageId){
            let stroage = relicsInfo.StorageId.split("-");
            if (data.length > 0) {
              for (let item of data) {
                if (stroage[0] === item.value) {
                  for (let key of item.children) {
                    if (stroage[1] === key.value) {
                      name = item.label + "/" + key.label;
                      break;
                    }
                  }
                }
              }
            }
        }
      // console.log(data)
      this.setState({ tankInfoList: data, tankDetails: name });
    });
  };

  render() {
      const { relicsInfo, tankDetails } = this.state;
    return (
      <Row className="main-content">
        <Col span={24} className="title">
          文物详情
          <div
            className="go-back"
            onClick={() => {
              this.props.history.goBack();
            }}
          />
        </Col>
        <Col span={24} style={{ padding: "20px 40px 20px 20px" }}>
          {relicsInfo !== {} && (
            <Col span={24} className="relics-detail">
              <Col span={24} className="relics-img">
                文物图片：
                {relicsInfo.Collectionimg1 && (
                  <img
                    src={relicsInfo.Collectionimg1}
                    alt={relicsInfo.CollectionName}
                  />
                )}
                {relicsInfo.Collectionimg2 && (
                  <img
                    src={relicsInfo.Collectionimg2}
                    alt={relicsInfo.CollectionName}
                  />
                )}
                {relicsInfo.Collectionimg3 && (
                  <img
                    src={relicsInfo.Collectionimg3}
                    alt={relicsInfo.CollectionName}
                  />
                )}
              </Col>
              <Col span={7} className="relics-box">
                {" "}
                文物名称：{relicsInfo.CollectionName}{" "}
              </Col>
              <Col span={17} className="relics-box">
                {" "}
                文物编号：{relicsInfo.CollectionNumber}{" "}
              </Col>
              <Col span={7} className="relics-box">
                {" "}
                文物等级：{relicsInfo.GradeName}{" "}
              </Col>
              <Col span={17} className="relics-box">
                {" "}
                文物数量：{relicsInfo.Number}{" "}
              </Col>
              <Col span={7} className="relics-box">
                {" "}
                文物类别：{relicsInfo.CategoryName}{" "}
              </Col>
              <Col span={17} className="relics-box">
                {" "}
                文物材质：{relicsInfo.MaterialQuality}{" "}
              </Col>
              <Col span={7} className="relics-box">
                {" "}
                文物年代：{relicsInfo.YearsName}{" "}
              </Col>
              <Col span={17} className="relics-box">
                {" "}
                文物尺寸：{relicsInfo.Size}{" "}
              </Col>
              <Col span={7} className="relics-box">
                {" "}
                完整程度：{howComplete.map(item => {
                  if (item.key === Number(relicsInfo.Integrity)) {
                    return item.value;
                  }
                })}{" "}
              </Col>
              <Col span={17} className="relics-box">
                {" "}
                文物重量：{relicsInfo.Weight}{" "}
              </Col>
              <Col span={7} className="relics-box">
                {" "}
                文物RFID：{relicsInfo.CollectionRfid}{" "}
              </Col>
              <Col span={17} className="relics-box">
                {" "}
                入库类型：{putInCategory.map(item => {
                  if (item.key === Number(relicsInfo.ReservoirType)) {
                    return item.value;
                  }
                })}{" "}
              </Col>
              <Col span={7} className="relics-box">
                            {/* {relicsInfo.StorageId} */}
                    存储柜编号：{tankDetails}{" "}
              </Col>
              <Col span={17} className="relics-box">
                {" "}
                文物状态：{relicsInfo.CollStateName}{" "}
              </Col>
            </Col>
          )}
        </Col>
      </Row>
    );
  }
}

export default CredentialDetail;