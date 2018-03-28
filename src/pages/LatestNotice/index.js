import React, { Component } from 'react';
import { Row, Col, Table, Button, message, Modal, Form, Input } from "antd";
import { NoticeAll, NoticeAdd, DeleteNotice } from "./api";
import moment from 'moment';
const FormItem = Form.Item;
const { TextArea } = Input;

class LatestNoticeApp extends Component {
  state = {
    noticeList: [],
    pageIndex: 1,
    pageSize: 10,
    total: 0,
    visible: false
  };

  componentWillMount() {
    this.getNoticeList();
  }
    // 获取通知列表
  getNoticeList() {
    const { pageIndex, pageSize } = this.state;
    let params = {
      pageIndex: pageIndex,
      pageSize: pageSize
    };
    NoticeAll(params).then(res => {
      console.log(res);
      // let listData = []
      if (res.length > 0) {
        let count = res[0].count;
        for (let item of res) {
          item.key = item.Notice_Id;
        }
        this.setState({
          total: count,
          noticeList: res
        });
      } else {
        this.setState({
          total: 0,
          noticeList: []
        });
      }
    });
  }

  // 删除通知
  deleteNoticeFun = (id) => {
      let params = {
          Id: id
      };
      DeleteNotice(params).then(res => {
          console.log(res);
          if(res === true) {
              message.success('删除成功');
              this.getNoticeList();
          } else {
              message.error('删除失败');
          }
      })
  }
  // 分页改变
  paginationChange = (page) => {
      this.setState({
          pageIndex: page
      }, () => {
          this.getNoticeList()
      })
  }
    // 弹框确认
  handleOk = () => {
      console.log('ok');
      this.props.form.validateFields((err, value) => {
          if(!err) {
              console.log(value);
              let UserName = JSON.parse(sessionStorage.getItem("UserInfo")).UserName;
              let values = {
                  ...value,
                  User_Name: UserName,
                  Notice_Time: moment().format()
              }
              console.log(values);
              NoticeAdd(values).then(res => {
                  console.log(res)
              })
              this.setState({ visible: false });
          }
      } )
      
  }
    // 弹框取消
  handleCancel = () =>{
      console.log('cancel');
      this.setState({ visible: false });
  }

  render() {
    const { noticeList, pageIndex, pageSize, total, visible } = this.state;
    const { getFieldDecorator } = this.props.form;
    const noticeColumns = [
      {
        title: "标题",
        dataIndex: "Notice_Title",
        key: "Notice_Title",
        width: 180
      },
      {
        title: "详情",
        dataIndex: "Notice_Desc",
        key: "Notice_Desc"
      },
      {
        title: "发布人",
        dataIndex: "User_Name",
        key: "User_Name",
        width: 180
      },
      {
        title: "发布时间",
        dataIndex: "Notice_Time",
        key: "Notice_Time",
        width: 180
      },
       {
           title: '操作',
           dataIndex: '',
           key: 'operation',
           render:(text) => {
            //    console.log(text);
               return <Button onClick={this.deleteNoticeFun.bind(this, text.Notice_Id)} type="danger">
                   删除
                 </Button>;
           }
       }
    ];
    return <Row className="main-content">
        <Col span={24} className="title">
          最新通知
        </Col>
        <Col span={24} style={{ padding: "20px" }}>
          <Col span={24} style={{ paddingBottom: "20px" }}>
            <Button onClick={() => {
                this.setState({ visible: true });
              }} type="primary" icon="plus">
              添加通知
            </Button>
          </Col>
          <Col span={24}>
            <Table dataSource={noticeList} columns={noticeColumns} bordered pagination={{ current: pageIndex, pageSize: pageSize, total: total, onChange: this.paginationChange }} />
          </Col>
          <Modal visible={visible} onOk={this.handleOk} onCancel={this.handleCancel}>
            <Form>
              <FormItem label="通知标题:">
                {getFieldDecorator("Notice_Title", {
                  rules: [{ required: true, message: "请输入通知标题" }]
                })(<Input placeholder="请输入通知标题" />)}
              </FormItem>
              <FormItem label="通知详情:">
                {getFieldDecorator("Notice_Desc", {
                  rules: [{ required: true, message: "请输入通知详情" }]
                })(<TextArea placeholder="请输入通知详情" />)}
              </FormItem>
            </Form>
          </Modal>
        </Col>
      </Row>;
  }
}

const LatestNotice = Form.create()(LatestNoticeApp);

                                                                                                                                   
export default LatestNotice;