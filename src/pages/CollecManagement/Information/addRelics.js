import React, { Component } from 'react';
import { Row, Col, message } from 'antd';
import './index.less';
import { InsertCollection, UpdateCollection } from "./api";
import RelicsInfoDialog from "./component";
import { connect } from 'react-redux';

class AddRelics extends Component {
  state = {
    reset: false,
    pageTitle: '',
    loading: false
  };
  componentWillMount() {
    this.setState({
      pageTitle: this.props.title || '新增藏品'
    })
  }
  componentDidMount() {
    console.log(this.refs.relicsInfo);
  }
  formSubmit = (value) => {
    console.log(value);
      this.setState({ loading: true });
      let params = {
        collection: {
          CollectionName: value.relicsName,
          ReservoirType: value.type,
          StorageId: value.carton[1],
          // CollectionNumber: value.relicsNum,
          Grade: value.levelInfo,
          CollectionYears: Number(value.relicsYears),
          Number: Number(value.number),
          CollectionState: value.relicsState,
          CollectionTime: value.date,
          MaterialQuality: value.material,
          Category: value.category,
          Weight: value.weight,
          Integrity: value.howComplete,
          Size: value.size,
          CollectionPosition: value.localtion,
          Collectionimg1: value.Collectionimg1,
          Collectionimg2: value.Collectionimg2,
          Collectionimg3: value.Collectionimg3
        }
      };
      console.log(params);
      const { pageTitle } = this.state;
      let _this = this;
      if(pageTitle === '新增藏品') {
        InsertCollection(params).then(res => {
          console.log(res);
          this.setState({ loading: false });
          if (res.Msg === "操作成功!") {
            message.success("操作成功");
            _this.setState({ reset: true });
            console.log(_this.refs);
            this.props.history.goBack();
            // _this.refs.relicsInfo.resetFields();
          } else {
            message.error("操作失败");
          }
        });
      } else {
        UpdateCollection(params).then(res => {
          console.log(res);
          this.setState({ loading: false });
          if (res.Msg === "操作成功!") {
            message.success("操作成功");
            _this.setState({ reset: true });
            this.props.history.goBack();
            // console.log(_this.refs)
            // _this.refs.relicsInfo.resetFields();
          } else {
            message.error("操作失败");
          }
        });
      }
      
  }

  render() {
    const { reset, pageTitle, loading } = this.state;
    return (
      <Row className="main-content">
        <Col span={24} className="title">
          {pageTitle} <div className='go-back' onClick={() => { this.props.history.goBack() }} ></div>
        </Col>
        <Col span={24} style={{ padding: "40px 100px" }} className="add-relics">
          <RelicsInfoDialog loading={loading} onReset={() => { this.setState({reset: false}) }} reset={reset} submit={this.formSubmit} ref='relicsInfo' />
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    title: state.main.collectionInfoData.state
  };
};

export default connect(mapStateToProps)(AddRelics);