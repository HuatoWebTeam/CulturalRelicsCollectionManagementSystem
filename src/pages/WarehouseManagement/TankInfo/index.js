import React, { Component } from 'react';
import { Row, Col, Button, Table, Modal, Form, Input, Select, message } from 'antd';
import './index.less';
import {
  GetStorageeManageData,
  InsertStorage,
  UpdateStorage,
  DeleteStorage
} from "../api";
import { StoreApi } from '../../Components/RelicsDialog/api'
import { connect } from 'react-redux';
const FormItem = Form.Item;
const Option = Select.Option;

class TankInfoApp extends Component {
  state = {
    warehouseList: [],
    tnakInfoList: [],
    tanknModalTitle: "添加存储柜信息",
    StorageId: "",
    isAdd: false,
    tankVisible: false,
    tankForm: {
      tankName: "",
      rfid: "",
      tankNum: "",
      tankLocaltion: ""
    },
    pageIndex: 1,
    pageSize: 10,
    total: 0,
    searchcondition: ""
  };

  componentWillMount() {
    this.setState(
      {
        pageIndex: this.props.pageIndex
      },
      () => {
        this.getStoageList();
        this.getWarehouseList();
      }
    );
  }

  addTankInfo = () => {
    this.setState({
      tanknModalTitle: "添加存储柜信息",
      tankVisible: true,
      isAdd: true
    });
  };
  editorTankInfo = record => {
    console.log(record);
    this.setState(
      {
        tanknModalTitle: "编辑存储柜信息",
        StorageId: record.StorageId,
        tankForm: {
          rfid: record.StorageRfid,
          tankName: record.StorageName,
          warehouseName: record.StorehouseId,
          tankNum: record.StorageNumber,
          tankLocaltion: record.StoragePosition
        },
        isAdd: false
      },
      () => {
        console.log(this.state);
        this.setState({ tankVisible: true });
      }
    );
  };

  // 获取库房
  getWarehouseList() {
    StoreApi().then(res => {
      console.log(res);
      this.setState({
        warehouseList: res
      });
    });
  }
  // 获取存储柜信息
  getStoageList = () => {
    const { pageIndex, pageSize, searchcondition } = this.state;
    let params = {
      Condition: searchcondition,
      PageIndex: pageIndex,
      PageSize: pageSize
    };
    GetStorageeManageData(params).then(res => {
      console.log(res);

      let data = res.Data;
      if (data.length) {
        for (let item of data) {
          item.key = item.StorageId;
        }
        this.setState({
          tnakInfoList: data,
          total: res.Total
        });
      } else {
        this.setState({ tnakInfoList: [], total: 0 });
      }
    });
  };
  handleOk = e => {
    // console.log(e);
    const { isAdd, StorageId } = this.state;
    this.props.form.validateFields((err, value) => {
      console.log(value);
      if (!err) {
        if (isAdd) {
          let params = {
            StorageName: value.tankName,
            StorageRfid: value.rfid,
            StorageNumber: value.tankNum,
            StoragePosition: value.tankLocaltion,
            StorehouseId: value.warehouseName
          };
          InsertStorage(params).then(res => {
            console.log(res);
            if (res.Msg === "操作成功!") {
              message.success("新增成功");
              this.setState({ tankVisible: false });
              this.props.form.resetFields();
              this.getStoageList();
            } else if (res.Msg === "存在重复的序列号,操作终止!") {
              message.error("存储柜编号重复");
            } else {
              message.error("新增失败");
            }
          });
        } else {
          let params = {
            StorageId: StorageId,
            StorageName: value.tankName,
            StorageRfid: value.rfid,
            StorageNumber: value.tankNum,
            StoragePosition: value.tankLocaltion,
            StorehouseId: value.warehouseName
          };

          UpdateStorage(params).then(res => {
            console.log(res);
            if (res.Msg === "操作成功!") {
              message.success("编辑成功");
              this.setState({ tankVisible: false });
              this.props.form.resetFields();
              this.getStoageList();
            } else {
              message.error("编辑失败");
            }
          });
        }
        //
      }
    });
  };

  handleCancel = e => {
    // console.log(e);
    this.setState({ tankVisible: false });
  };

  paginationChange = page => {
    this.setState(
      {
        pageIndex: page
      },
      () => {
        this.getStoageList();
        this.props.changePageIndex(page);
      }
    );
  };

  // 删除存储柜
  deleteStorage = (record) => {
    console.log(record);
    let params = { parameters: { Condition: Number(record.StorageId) } };
    DeleteStorage(params).then(res => {
      console.log(res);
      if(res.Msg === "操作成功!") {
        message.success('删除成功');
        this.getStoageList()
      } else {
        message.error('删除失败')
      }
    })
    
  }

  render() {
    const {
      warehouseList,
      tnakInfoList,
      tankVisible,
      tankForm,
      isAdd,
      tanknModalTitle,
      pageIndex,
      pageSize,
      total
    } = this.state;
    const { getFieldDecorator } = this.props.form;
    const tankInfoColumns = [
      {
        title: "序号",
        dataIndex: "StorageId",
        key: "StorageId"
      },
      {
        title: "存储柜名称",
        dataIndex: "StorageName",
        key: "StorageName"
      },
      {
        title: "RFID",
        dataIndex: "StorageRfid",
        key: "StorageRfid"
      },
      {
        title: "存储柜编号",
        dataIndex: "StorageNumber",
        key: "StorageNumber"
      },
      {
        title: "存储柜位置",
        dataIndex: "StoragePosition",
        key: "StoragePosition"
      },
      {
        title: "操作",
        dataIndex: "",
        key: "operation",
        render: (text, record, idx) => {
          return (
            <span>
              <Button
                style={{ color: "#3065bf" }}
                onClick={event => {
                  event.persist();
                  this.editorTankInfo(record);
                }}
              >
                编辑
              </Button>
              <Button
                type="primary"
                style={{ marginLeft: "20px" }}
                onClick={this.deleteStorage.bind(this, record)}
              >
                删除
              </Button>
            </span>
          );
        }
      }
    ];

    return (
      <Row className="main-content">
        <Col span={24} className="title">
          存储柜信息
        </Col>
        <Col span={24} className="tankInfo-container" style={{padding: '20px 40px 20px 20px'}} >
          <Col span={24} style={{ paddingBottom: "20px" }}>
            <Button type="primary" icon="plus" onClick={this.addTankInfo}>
              新增存储柜
            </Button>
          </Col>
          <Col span={24}>
            <Table
              pagination={{
                current: pageIndex,
                total: total,
                pageSize: pageSize,
                onChange: this.paginationChange
              }}
              columns={tankInfoColumns}
              dataSource={tnakInfoList}
              bordered
            />
          </Col>
          <Col span={24}>
            <Modal
              className="tankInfo-modal"
              visible={tankVisible}
              title={tanknModalTitle}
              width="710px"
              onOk={this.handleOk}
              onCancel={this.handleCancel}
              footer={[
                <Button key="back" onClick={this.handleCancel}>
                  取消
                </Button>,
                <Button key="submit" type="primary" onClick={this.handleOk}>
                  确定
                </Button>
              ]}
            >
              <Form layout="inline">
                <FormItem
                  label="库房:"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                >
                  {getFieldDecorator("warehouseName", {
                    initialValue: isAdd ? 0 : Number(tankForm.warehouseName),
                    rules: [{ required: true, message: "请选择库房" }]
                  })(
                    <Select style={{ width: "100%" }}>
                      <Option value={0}>全部</Option>
                      {warehouseList.length > 0 &&
                        warehouseList.map((item, idx) => (
                          <Option
                            value={item.Storehouse_Id}
                            key={item.Storehouse_Id}
                          >
                            {item.Storehouse_Name}
                          </Option>
                        ))}
                    </Select>
                  )}
                </FormItem>
                <FormItem
                  label="RFID:"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                >
                  {getFieldDecorator("rfid", {
                    initialValue: isAdd ? "" : tankForm.rfid,
                    rules: [{ required: true, message: "请输入RFID" }]
                  })(<Input />)}
                </FormItem>
                <FormItem
                  label="存储柜名称:"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                >
                  {getFieldDecorator("tankName", {
                    initialValue: isAdd ? "" : tankForm.tankName,
                    rules: [{ required: true, message: "请输入存储柜名称" }]
                  })(<Input />)}
                </FormItem>
                <FormItem
                  label="存储柜编号:"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                >
                  {getFieldDecorator("tankNum", {
                    initialValue: isAdd ? "" : tankForm.tankNum,
                    rules: [{ required: true, message: "请输入存储柜编号" }]
                  })(<Input />)}
                </FormItem>
                <FormItem
                  label="具体位置:"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                >
                  {getFieldDecorator("tankLocaltion", {
                    initialValue: isAdd ? "" : tankForm.tankLocaltion,
                    rules: [{ required: true, message: "请输入具体位置" }]
                  })(<Input />)}
                </FormItem>
              </Form>
            </Modal>
          </Col>
        </Col>
      </Row>
    );
  }
}
const TankInfo = Form.create()(TankInfoApp);

const mapStateToProps = (state, ownProps) => {
  return {
    pageIndex: state.main.tankInfoPage
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    changePageIndex: args => dispatch({ type: "TANKINFOPAGE", payload: args })
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(TankInfo);