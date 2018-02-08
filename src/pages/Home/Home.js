import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Radio } from 'antd';
import classnames from 'classnames';
import FreeScrollBar from 'react-free-scrollbar';
import './Home.less';
const RadioGroup  = Radio.Group;
const RadioButton = Radio.Button;


// 藏品统计
const collStatic = [
  { num: 548, title: '藏品数', icon: 'iconBack collection-num', backColor: '#289adb' },
  { num: 63, title: '复仿制数', icon: 'iconBack generic', backColor: '#43b1bb' },
  { num: 632, title: '外借数', icon: 'iconBack checked-out', backColor: '#6a8ed8' },
  { num: 456, title: '待入账数', icon: 'iconBack enter-account',backColor: '#efa256' },
  { num: 963, title: '待入库数', icon: 'iconBack putin-storage', backColor: '#43b1bb' },
  { num: 1, title: '待排架数', icon: 'iconBack be-bent', backColor: '#289adb' },
  { num: 0, title: '在库数', icon: 'iconBack in-libray', backColor: '#e6a05b' },
  { num: 8, title: '待回库数', icon: 'iconBack back-library', backColor: '#6a8ed8' }
]

// 我的事项
const myMattersData = {
  todo: [
    { name: "商品出库", id: "jhiagdf", date: "2717-12-23 15:36" },
    { name: "商品出库", id: "jhiagdf", date: "2717-12-23 15:36" },
    { name: "商品出库", id: "jhiagdf", date: "2717-12-23 15:36" },
    { name: "商品出库", id: "jhiagdf", date: "2717-12-23 15:36" },
    { name: "商品出库", id: "jhiagdf", date: "2717-12-23 15:36" },
    { name: "商品出库", id: "jhiagdf", date: "2717-12-23 15:36" },
    { name: "商品出库", id: "jhiagdf", date: "2717-12-23 15:36" },
    { name: "商品出库", id: "jhiagdf", date: "2717-12-23 15:36" }
  ],
  dealtIn: [
    { name: "办理中", id: "jhiagdf", date: "2717-12-23 15:36" },
    { name: "办理中", id: "jhiagdf", date: "2717-12-23 15:36" },
    { name: "办理中", id: "jhiagdf", date: "2717-12-23 15:36" },
    { name: "办理中", id: "jhiagdf", date: "2717-12-23 15:36" },
    { name: "办理中", id: "jhiagdf", date: "2717-12-23 15:36" },
    { name: "办理中", id: "jhiagdf", date: "2717-12-23 15:36" }
  ],
  transferred: [
    { name: "办结", id: "jhiagdf", date: "2717-12-23 15:36" },
    { name: "办结", id: "jhiagdf", date: "2717-12-23 15:36" },
    { name: "办结", id: "jhiagdf", date: "2717-12-23 15:36" },
    { name: "办结", id: "jhiagdf", date: "2717-12-23 15:36" }
  ]
};

// 新通知
const newNotice = [
  { count: 1, detail: '111111111', date: '2018-12-13' },
  { count: 2, detail: '222222', date: '2018-03-05' }
]

// 快捷操作
const shortcuts = [
  { title: "藏品登记", icon: "iconBack registration", url: "" },
  { title: "藏品入库", icon: "iconBack putinStroage", url: "" },
  { title: '藏品出库', icon: 'iconBack putbound', url: '' },
  { title: '藏品征集', icon: 'iconBack solictation', url: '' },
  { title: '藏品展览', icon: 'iconBack exhibition', url: '' },
  { title: '藏品修复', icon: 'iconBack repair', url: '' },
  { title: '藏品注销', icon: 'iconBack cancelation', url: '' }
];


class Home extends Component {
  state = { 
    collection: collStatic,
    myMatters: {
      type: 'todo',
      data: null
    }
   }
  componentWillMount () {
    this.setState({
      myMatters:{
        type: 'todo',
        data: myMattersData[this.state.myMatters.type]
      }
    })
  }
  radioButtonChange (value) {
    console.log(value);
    this.setState({
      myMatters: {
        type: value.target.value,
        data: myMattersData[value.target.value]
      }
    })
  }
  buttonCilck () {
    this.props.changeButtonText('点击了我')
  }
  render() {
    console.log(this.state);
    const { collection, myMatters } = this.state;
    return <Row className="home-container">
        <Col span={24} className="home-content">
          <Col span={24} className="home-title back-color-white">
            藏品统计
          </Col>
          <Col span={24} className="collection-static back-color-white">
            <Row type="flex" justify="space-around" gutter={20} style={{ textAlign: "center", padding: "0 20px" }}>
              {collection.map((item, idx) => (
                <Col
                  span={24 / collection.length}
                  key={idx}
                  style={{ textAlign: "center" }}
                >
                  <Col
                    span={24}
                    className="static-content"
                    style={{ backgroundColor: item.backColor }}
                  >
                    <span className={item.icon} />
                    <span className="static-num-title">
                      <span className="static-num">{item.num}</span>
                      <span className="static-title">{item.title}</span>
                    </span>
                  </Col>
                </Col>
              ))}
            </Row>
          </Col>
        </Col>
        <Col span={12} className="home-content" style={{ paddingRight: "10px" }}>
          <Col span={24} className="home-title back-color-white">
            <div style={{ float: "left" }}>我的事项</div>
            <div style={{ float: "right" }}>
              <RadioGroup className="myRadioGroup" onChange={this.radioButtonChange.bind(this)} defaultValue={myMatters.type}>
                <RadioButton value="todo">待办</RadioButton>
                <RadioButton value="dealtIn">办理中</RadioButton>
                <RadioButton value="transferred">办结</RadioButton>
              </RadioGroup>
            </div>
          </Col>
          <Col span={24} className="back-color-white my-matters">
            <FreeScrollBar className="my-vertical-track" style={{ width: "100%", height: "276px" }}>
              {myMatters.data.map((item, idx) => (
                <Col span={24} key={idx} className="lineContent">
                  <Col span={8} className="matters">
                    {item.name}
                  </Col>
                  <Col span={8} className="matters">
                    {item.id}
                  </Col>
                  <Col span={8} className="matters">
                    {item.date}
                  </Col>
                </Col>
              ))}
            </FreeScrollBar>
          </Col>
        </Col>
        <Col span={12} className="home-content" style={{ paddingLeft: "10px" }}>
          <Col span={24} className="home-title back-color-white">
            <Col span={20}>最新通知</Col>
            <Col span={4} style={{ fontSize: "16px", color: "#666" }}>
              更多>
            </Col>
          </Col>
          <Col span={24} className="back-color-white new-notice" style={{ height: "276px" }}>
            {newNotice.map((item, idx) => <Col span={24} key={idx}>
                <Col span={19} className="notice-title">
                  {" "}
                  {item.detail}{" "}
                </Col>
                <Col span={5} className="notice-date">
                  {" "}
                  {item.date}{" "}
                </Col>
              </Col>)}
          </Col>
        </Col>
        <Col span={12} className="home-content" style={{ paddingRight: "10px" }}>
          <Col span={24} className="home-title back-color-white">
            快捷操作
          </Col>
          <Col span={24} className="back-color-white shortcuts">
            {shortcuts.map((item, idx) => <Col style={{ textAlign: 'center', marginBottom: '20px' }} span={6} key={idx}>
                <div className='background' >
                  <span className={item.icon} />
                </div>
                <div className='short-title' >{item.title}</div>
              </Col>)}
          </Col>
        </Col>
        <Col span={12} className="home-content" style={{ paddingLeft: "10px" }}>
          <Col span={24} className="home-title back-color-white">
            精品展示
          </Col>
          <Col span={24} className="back-color-white" style={{ height: '305px' }}>
            1
          </Col>
        </Col>
      </Row>;
      // <div>
      //   <Button type='primary' onClick={this.buttonCilck.bind(this)} >{ this.props.buttonText }</Button>
      // </div>
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    buttonText: state.main.buttonText
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    changeButtonText: (args) => dispatch({type: 'CLICK_ME', payload: args})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)