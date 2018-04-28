import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Radio, Modal, Button } from 'antd';
// import classnames from 'classnames';
import FreeScrollBar from 'react-free-scrollbar';
import './Home.less';
// import Cookie from 'js-cookie';
import { Link } from 'react-router-dom'; 
import { GetToNotice, GetFineDisplayData, GetStatisticsData } from "./api";
// import { relative } from 'path';
import LanternSlide from "./Scroller";
const RadioGroup  = Radio.Group;
const RadioButton = Radio.Button;


// 藏品统计
const collStatic = [
  { num: 'NumberOfCollections', title: '藏品数', icon: 'iconBack collection-num', backColor: '#289adb' },
  { num: 'NumberOfLibraries', title: '在库数', icon: 'iconBack in-libray', backColor: '#e6a05b' },
  { num: 'NumberInRepair', title: '待修复数', icon: 'iconBack generic', backColor: '#43b1bb' },
  { num: 'NumberBorrowing', title: '外借数', icon: 'iconBack checked-out', backColor: '#6a8ed8' },
  { num: 'NumberToBeRecorded', title: '待入账数', icon: 'iconBack enter-account',backColor: '#efa256' },
  { num: 'NumberOfLibrariesToBeEntered', title: '待入库数', icon: 'iconBack putin-storage', backColor: '#43b1bb' },
  // { num: 1, title: '待排架数', icon: 'iconBack be-bent', backColor: '#289adb' },
  // { num: 8, title: '待回库数', icon: 'iconBack back-library', backColor: '#6a8ed8' }
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



// 快捷操作
const shortcuts = [
  { title: "藏品登记", icon: "iconBack registration", url: "/App/Information", isHidden: true },
  { title: "藏品入库", icon: "iconBack putinStroage", url: "/App/PutInStorage", isHidden: true },
  { title: "藏品出库", icon: "iconBack putbound", url: "/App/Outbound", isHidden: true },
  { title: "藏品征集", icon: "iconBack solictation", url: "/App/Solicition", isHidden: true },
  { title: "藏品展览", icon: "iconBack exhibition", url: "/App/CollecExhibition", isHidden: true },
  { title: "藏品修复", icon: "iconBack repair", url: "/App/CollecRepair", isHidden: true },
  { title: "藏品注销", icon: "iconBack cancelation", url: "", isHidden: true }
];


class Home extends Component {
  state = {
    collection: collStatic,
    myMatters: {
      type: "todo",
      data: null
    },
    newNotice: [], // 最新通知
    productsList: [], // 精品展示
    slideWidth: null,
    noticeVisible: false,
    noticeDetail: null,
    staticNumber: {
      NumberBorrowing: 0,                // 外借数
      NumberInRepair: 0,                 // 在修复数
      NumberOfCollections: 0,            // 藏品数
      NumberOfLibraries: 0,              // 在库数
      NumberOfLibrariesToBeEntered: 0,   // 待入库数
      NumberToBeRecorded: 0,             // 待入账数
    }
  };
  componentWillMount() {
    let userMenuList = JSON.parse(sessionStorage.getItem("UserInfo"))
      .UserMenuItem;
    // console.log(userMenuList);
    for (let item of userMenuList) {
      for (let value of shortcuts) {
        if (item.subnode.length > 0) {
          for (let childItem of item.subnode) {
            if (childItem.Functional__URl === value.url) {
              value.isHidden = false;
            }
          }
        } else if (item.ProjectModule_URL === value.url) {
          value.isHidden = false;
        }
      }
    }
    this.setState({
      myMatters: {
        type: "todo",
        data: myMattersData[this.state.myMatters.type]
      }
    });
    this.getnewNotice();
    let _this = this;
    // console.log(this.props.location.pathname === "/App/Home");
    window.onresize = () => {
      console.log(this.props);
      console.log(this.props.history.location.pathname === "/App/Home");
      if (this.props.history.location.pathname === "/App/Home") {
        _this.getSlideWidth();
      }
    };
  }

  // 获取数据
  getnewNotice() {
    // 最新通知
    GetToNotice().then(res => {
      console.log(res);
      if (res.Data) {
        this.setState({ newNotice: res.Data });
      }
    });

    // 精品展示
    GetFineDisplayData().then(res => {
      console.log(res);
      let imgArr = [];
      if (res.Data) {
        for (let item of res.Data) {
          imgArr.push({
            relicsImgUrl: item.Collectionimg1,
            relicsName: item.CollectionName,
            key: item.CollectionNumber
          });
        }
      }

      this.setState({
        productsList: imgArr
      });
    });

    // 数据统计
    GetStatisticsData().then(res => {
      console.log("-------");
      console.log(res);
      this.setState({
        staticNumber: res.Data
      })
    });
  }
  componentDidMount() {
    this.getSlideWidth();
  }
  getSlideWidth = () => {
    // console.log('width')
    console.log(this.refs.slideWidth.clientWidth);
    this.setState({ slideWidth: this.refs.slideWidth.clientWidth - 121 });
  };

  // 通知详情

  showNoticeDetail = value => {
    this.setState(
      {
        noticeVisible: true,
        noticeDetail: value
      },
      () => {}
    );
  };
  // 关闭通知弹窗
  closeNoticeDetail = () => {
    this.setState({ noticeDetail: null, noticeVisible: false });
  };
  radioButtonChange(value) {
    console.log(value);
    this.setState({
      myMatters: {
        type: value.target.value,
        data: myMattersData[value.target.value]
      }
    });
  }
  buttonCilck() {
    this.props.changeButtonText("点击了我");
  }
  render() {
    console.log(this.state);
    const {
      collection,
      myMatters,
      newNotice,
      productsList,
      slideWidth,
      noticeVisible,
      noticeDetail,
      staticNumber
    } = this.state;
    return <Row className="home-container">
        <Col span={24} className="home-content">
          <Col span={24} className="home-title back-color-white">
            藏品统计
          </Col>
          <Col span={24} className="collection-static back-color-white">
            <Col span={24} style={{ textAlign: "center", padding: "0 20px" }}>
              {collection.map((item, idx) => (
                <Col
                  span={24 / collection.length}
                  key={idx}
                  style={{
                    textAlign: "center",
                    paddingRight: idx < collection.length - 1 ? "10px" : "0"
                  }}
                >
                  <Col
                    span={24}
                    className="static-content"
                    style={{ backgroundColor: item.backColor }}
                  >
                    <span className={item.icon} />
                    <span className="static-num-title">
                      <span className="static-num">
                        {staticNumber[item.num]}
                      </span>
                      <span className="static-title">{item.title}</span>
                    </span>
                  </Col>
                </Col>
              ))}
            </Col>
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
              <span onClick={() => {
                  this.props.history.push("/App/LatestNotice");
                }} style={{ display: "inline-block", height: "20px", cursor: "pointer" }}>
                更多>>
              </span>
            </Col>
          </Col>
          <Col span={24} className="back-color-white new-notice" style={{ height: "276px" }}>
            {newNotice.map((item, idx) => idx < 6 && <Col onClick={this.showNoticeDetail.bind(this, item)} span={24} key={idx}>
                    <Col span={17} className="notice-title">
                      {item.Notice_Title}
                    </Col>
                    <Col span={6} className="notice-date">
                      {item.Notice_Time}
                    </Col>
                  </Col>)}
            <Modal visible={noticeVisible} onCancel={this.closeNoticeDetail} footer={<Button onClick={this.closeNoticeDetail} type="primary">
                  关闭
                </Button>}>
              {noticeDetail && <Col span={24}>
                  <Col span={24} className="notice-detail-title">
                    <h1>{noticeDetail.Notice_Title}</h1>
                    <span>{noticeDetail.Notice_Time}</span>
                  </Col>
                  <Col span={24} style={{ fontSize: "18px", marginTop: "15px" }}>
                    {noticeDetail.Notice_Desc}
                  </Col>
                </Col>}
            </Modal>
          </Col>
        </Col>
        <Col span={12} className="home-content" style={{ paddingRight: "10px" }}>
          <Col span={24} className="home-title back-color-white">
            快捷操作
          </Col>
          <Col span={24} className="back-color-white shortcuts" style={{ height: "305px" }}>
            {shortcuts.map((item, idx) => !item.isHidden && <Col style={{ textAlign: "center", marginBottom: "20px" }} span={6} key={idx}>
                    <Link to={item.url}>
                      <div className="background">
                        <span className={item.icon} />
                      </div>
                      <div className="short-title">{item.title}</div>
                    </Link>
                  </Col>)}
          </Col>
        </Col>
        <Col span={12} className="home-content" style={{ paddingLeft: "10px" }}>
          <div span={24} style={{ width: "100%" }} className="home-title back-color-white">
            精品展示
          </div>
          <div ref="slideWidth" className="back-color-white products-content" style={{ height: "305px", padding: "20px 60px" }}>
            {/* <Carousel autoplay>
              {productsList.map((item, idx) => (
                <div
                  key={item.relicsName + idx}
                  style={{ position: "relative", width: '210px' }}
                >
                  <div className="carousel-content">
                    <img
                      className="carousel-img"
                      src={item.relicsImgUrl}
                      alt={item.relicsName}
                    />
                  </div>
                </div>
              ))}
            </Carousel> */}
            <LanternSlide width={slideWidth} list={productsList} />
          </div>
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