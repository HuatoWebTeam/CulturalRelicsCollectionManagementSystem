import React, { Component } from 'react';

import { Row, Col, Input, Button, message } from 'antd';
import './index.less';
import RelicsDialog from "../Components/RelicsDialog";
import { subStr, howComplete } from '../../assets/js/commonFun';
import { GetStorehouseAndStorage } from "../CollecManagement/Information/api";
import moment from 'moment';
import { CancellationAdd } from './api';
const { TextArea } = Input;

class NewLogout extends Component {
    state = {  
      relicsInfo: {
        Collection_Name: '请选择文物',
      },
      tankInfoList: [],
      date: '',
      userName: '',
      cause: '',
      loading: false
    }
    componentWillMount() {
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
        // 
        // console.log(data)
        this.setState({ tankInfoList: data }, () => {
          console.log('cunchugui')
        });
      });
      let name = JSON.parse(sessionStorage.getItem("UserInfo")).UserName;
      this.setState({ userName: name, date: moment().format('YYYY-MM-DD') });
    }

    //选择文物
    chooseData = (value) => {
      console.log(value);
      const { tankInfoList } = this.state;
      console.log(tankInfoList);
      let name = '';
      if (value[0].StorageId) {
        let stroage = value[0].StorageId.split("--");
        console.log(stroage)
        if (tankInfoList.length > 0) {
          console.log('cunchugui')
          for (let item of tankInfoList) {
            if (stroage[1] === item.value) {
              for (let key of item.children) {
                if (stroage[0] === key.value) {
                  name = item.label + "/" + key.label;
                  break;
                }
              }
            }
          }
        }
      };
      howComplete.map((item) => {
        if (item.key === value[0].Integrity) {
          // console.log(item.value);
          return value[0].Integrity = item.value;
        }
      })
      // console.log(name)
      value[0].StorageId = name;
      this.setState({
        relicsInfo: value[0]
      })
    }
    //提交
    handleSubmit = () => {
      const { relicsInfo, date, userName, cause } = this.state;
      // cause = cause.replace(/ /g, '');
      let logoutCause = cause.replace(/ /g, "");
      if (relicsInfo.Collection_Number) {
        if (cause === "") {
          message.error("请输入注销原因");
        } else {
          this.setState({ loading: true });
          let params = { 
            Cancellation_Reason: cause, 
            Applicant: userName, 
            Application_Time: date, 
            Coll: [{ 
              Collection_Number: relicsInfo.Collection_Number, 
              Collection_State: 19 
            }]
          };
          console.log(params)
          CancellationAdd(params).then(res => {
            this.setState({ loading: false });
            if (res === true) {
              message.success("提交成功");
              this.props.history.push("/App/CollecLogout");
            } else {
              message.error("提交失败");
            }
          });
        }
      } else {
        message.error("请选择注销文物");
      }
    }


    render() {
      const { relicsInfo, date, userName, loading } = this.state;
        return <Row className="main-content">
            <Col className="title" span={24}>
              新建注销单
              <div className="go-back" onClick={() => {
                  this.props.history.goBack();
                }} />
            </Col>
            <Col span={24} className="new-logout-content" style={{padding: '40px 100px'}} >
              <Col span={24} className="table-container">
                <Col className="table-title table-height" span={3}>
                  文物名称
                </Col>
                <Col className="table-content table-height" span={9}>
                  <span className='relicsName' onClick={() => {
                    //   console.log('---')
                      this.refs.relicsDialog.openModal();
                    }}>
                    {relicsInfo.Collection_Name}
                  </span>
                </Col>
                <RelicsDialog chooseData={this.chooseData}
                  title="选择注销文物"
                  radio={true}
                  stat={0}
                  checkedItem={[]}
                  ref="relicsDialog" />
                <Col className="table-title table-height" span={3}>
                  入馆时间
                </Col>
                <Col className="table-content table-height" span={9} >
                  {relicsInfo.Collection_Time ? subStr(relicsInfo.Collection_Time) : ''}
                </Col>
                <Col className="table-title table-height" span={3}>
                  文物图片
                </Col>
                <Col className="table-content table-height" span={9} >
                  {
                  relicsInfo.Collection_img && <img style={{width: '50px', height: '50px'}} src={relicsInfo.Collection_img} alt={relicsInfo.Collection_Name} />
                  }
                </Col>
                <Col className="table-title table-height" span={3}>
                  材质
                </Col>
                <Col className="table-content table-height" span={9} >
                  {relicsInfo.MaterialQuality || ''}
                </Col>
                <Col className="table-title table-height" span={3}>
                  文物编号
                </Col>
                <Col className="table-content table-height" span={9} >
                  {relicsInfo.Collection_Number || ''}
                </Col>
                <Col className="table-title table-height" span={3}>
                  文物年代
                </Col>
                <Col className="table-content table-height" span={9} >
                  {relicsInfo.YearsName || ''}
                </Col>
                <Col className="table-title table-height" span={3}>
                  文物等级
                </Col>
                <Col className="table-content table-height" span={9} >
                  {relicsInfo.GradeName || ''}
                </Col>
                <Col className="table-title table-height" span={3}>
                  完整程度
                </Col>
                <Col className="table-content table-height" span={9} >
                  {relicsInfo.Integrity || ''}
                </Col>
                <Col className="table-title table-height" span={3}>
                  储存位置
                </Col>
                <Col className="table-content table-height" span={9} >
                  {relicsInfo.StorageId || ''}
                </Col>
                <Col className="table-title table-height" span={3}>
                  文物尺寸
                </Col>
                <Col className="table-content table-height" span={9} >
                  {relicsInfo.Size || '' }
                </Col>
                <Col className="table-title table-height" span={3}>
                  文物状态
                </Col>
                <Col className="table-content table-height" span={9} >
                  {relicsInfo.CollStateName || ''}
                </Col>
                <Col className="table-title table-height" span={3}>
                  文物重量
                </Col>
                <Col className="table-content table-height" span={9} >
                  {relicsInfo.Weight || ''}
                </Col>
                <Col className="table-title table-height" span={3}>
                  申请人
                </Col>
                <Col className="table-content table-height" span={9} >
                  {userName}
                </Col>
                <Col className="table-title table-height" span={3}>
                  申请时间
                </Col>
                <Col className="table-content table-height" span={9} >
                  {date}
                </Col>
                <Col className="table-title table-height" span={3}>
                  注销原因
                </Col>
                <Col className="table-content table-height" span={21} >
                  <TextArea onChange={(e) => {
                    console.log(e);
                    e.persist()
                    this.setState({ cause: e.target.value })
                  }} style={{ height: '60px',  }} placeholder='请输入注销原因'  />
                </Col>
              </Col>
              <Col span={24} style={{paddingTop: '20px'}} >
                <Button loading={loading} type='primary' onClick={this.handleSubmit} >提交注销申请</Button>
              </Col>
            </Col>
          </Row>;
    }
}

export default NewLogout;