import React, { Component } from 'react';
import { Row, Col, Button, Table, Modal, Form, Input, message } from 'antd';
import './index.less';
import {
  GetStorehouseManageData,
  UpdateStorehouse,
  InsertStorehouse
} from "../api";
import { connect } from 'react-redux';
const FormItem = Form.Item;
const { TextArea } = Input;

class WarehouseManageApp extends Component {
  state = {
    warehouseList: [ ],
    modalVisible: false,
    modalTitle: "新增库房",
    isAdd: false,
    chooseWarehouseId: null,
    warehouseNameValue: "",
    describeValue: "",
    searchName: '',
    pageIndex: 1,
    pageSize: 10,
    total: 0
  };

  componentWillMount() {
    this.setState({
      pageIndex: this.props.pageIndex
    }, () => {
      this.getWraehousrList();
    })
    
  }

  handleOk = () => {
    const { isAdd, warehouseNameValue, describeValue, chooseWarehouseId } = this.state;
    console.log(this.state);
    // console.log(e.target)
    this.props.form.validateFields((err, fieldsValue) => {
      // console.log(err)
      if(!err) {
        if (!isAdd) {
          console.log(fieldsValue);
          let params = { StorehouseId: chooseWarehouseId, StorehouseName: warehouseNameValue, StorehouseDescribe: describeValue };
          UpdateStorehouse(params).then(res => {
            console.log(res);
            if (res.Msg === "操作成功!") {
              message.success("编辑成功");
              this.getWraehousrList();
              this.setState({ modalVisible: false });
            } else {
              message.error("编辑失败");
            }
          });
        } else {
          let params = {
            StorehouseName: warehouseNameValue,
            StorehouseDescribe: describeValue
          };
          InsertStorehouse(params).then(res => {
            console.log(res);
            if (res.Msg === "操作成功!") {
              message.success("新增成功");
              this.getWraehousrList();
              this.setState({ modalVisible: false });
            } else {
              message.error("新增失败");
            }
          })

        }
      }
      
    })
    
    
    

  };

  handleCancel = e => {
    
    
    this.setState({
      modalVisible: false
    });
  };

  addWarehouse = () => {
    this.props.form.resetFields();
    this.setState({
      isAdd: true,
      modalTitle: "新增库房",
      warehouseNameValue: "",
      describeValue: "",
      modalVisible: true
    });
  };
  // 分页改变
  paginationChange = (page) => {
    this.setState({
      pageIndex: page
    }, () => {
      this.getWraehousrList();
      this.props.changePageIndex(page)
    })
  }

  getWraehousrList = () => {
    const { pageIndex, pageSize, searchName } = this.state;
    let params = {
      Condition: searchName,
      PageIndex: pageIndex,
      PageSize: pageSize
    }
    GetStorehouseManageData(params).then(res => {
      console.log(res);
      let data = [];
      for(let item of res.Data) {
        data.push({
          key: item.StorehouseId,
          number: item.StorehouseId,
          warehouseName: item.StorehouseName,
          describe: item.StorehouseDescribe
        });
      }
      this.setState({ warehouseList: data, total: res.Total });
    })
  }

  editorWarehouse = record => {
    
    this.props.form.resetFields();
    console.log(record);
    this.setState({
      modalVisible: true,
      modalTitle: "编辑库房",
      warehouseNameValue: record.warehouseName,
      describeValue: record.describe,
      isAdd: false
    });
  };

  render() {
    const {
        isAdd,
      warehouseList,
      modalVisible,
      modalTitle,
      warehouseNameValue,
      describeValue,
      pageIndex,
      pageSize,
      total
    } = this.state;
    
    const { getFieldDecorator } = this.props.form;
    const warehousColumns = [
      {
        title: "序号",
        dataIndex: "number",
        key: "number"
      },
      {
        title: "库房名称",
        dataIndex: "warehouseName",
        key: "warehouseName"
      },
      {
        title: "描述",
        dataIndex: "describe",
        key: "describe"
      },
      {
        title: "操作",
        dataIndex: "",
        key: "operation",
        render: (text, record, idx) => {
          return <Button onClick={(event) => {event.persist(); this.setState({chooseWarehouseId: record.number }); this.editorWarehouse(record)}} style={{ color: "#3065bf" }}>
              编辑
            </Button>;
        }
      }
    ];

    return <Row className="main-content">
        <Col span={24} className="title">
          库房管理列表
        </Col>
        <Col span={24} className="warehouseInfo-container">
          <Col span={24} style={{ paddingBottom: "20px" }}>
            <Button type="primary" icon="plus" onClick={this.addWarehouse}>
              新增库房
            </Button>
          </Col>
          <Col span={24}>
            <Table pagination={{ current: pageIndex, pageSize: pageSize, total: total, onChange: this.paginationChange }} columns={warehousColumns} dataSource={warehouseList} bordered />
          </Col>
          <Col span={24}>
            <Modal className="warehouse-modal" title={modalTitle} onOk={this.handleOk} onCancel={this.handleCancel} visible={modalVisible}>
              <Form layout="inline">
                <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 16 }} label="库房名称:">
                  {getFieldDecorator("warehouseName", {
                    initialValue: isAdd ? "" : warehouseNameValue,
                    rules: [{ required: true, message: "请输入库房名称" }]
                  })(<Input  onChange={value => {
                        this.setState({
                          warehouseNameValue: value.target.value
                        });
                      }} />)}
                </FormItem>
                <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 16 }} label="描述:">
                  {getFieldDecorator("warehousrDescribe", {
                    initialValue:  isAdd ? "" : describeValue ,
                    rules: [{ required: true, message: "请输入库房描述" }]
                  })(<TextArea  onChange={value => this.setState(
                          { describeValue: value.target.value }
                        )} />)}
                </FormItem>
                {/* <FormItem wrapperCol={{ offset: 4 }} >
                  <Button type='primary' >提交</Button>
                </FormItem> */}
              </Form>
            </Modal>
          </Col>
        </Col>
      </Row>;
  }
}
const WarehouseManage = Form.create()(WarehouseManageApp);
const mapStateToProps = (state, ownProps) => {
  return {
    pageIndex: state.main.warehousePage
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    changePageIndex: args => dispatch({ type: "WAREHOUSEPAGE", payload: args })
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(WarehouseManage);