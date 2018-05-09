import React, { Component } from 'react';
import { Row, Col, Select, DatePicker, Input, Button, Form, Table, Modal, message } from 'antd';
import './index.less';
import { InventallApi, DeleteInventory } from "./api";
import { StoreApi } from '../Components/RelicsDialog/api';
import { RangePickerDefault, approveState, subStr, inventState } from "../../assets/js/commonFun";
import { Link } from 'react-router-dom';
import moment from 'moment';
import { connect } from 'react-redux';
const Option = Select.Option;
const { RangePicker } = DatePicker;
const Search = Input.Search;
const FormItem = Form.Item;
const confirm = Modal.confirm;

class CollecInventory extends Component {
  state = {
    inventoryDataList: [],
    pageIndex: 1,
    pageSize: 10,
    total: 0,
    storeList: [],
    storeName: 10,
    date: [],
    format: "YYYY-MM-DD",
    inventNum: ""
  };

  componentWillMount() {
    // this.getStoreList();
    const { format } = this.state;
    console.log(RangePickerDefault);
    let defaultDate = [
      RangePickerDefault[0].hour(0).minute(0).second(0).format(),
      RangePickerDefault[1].hour(23).minute(59).second(59).format()
    ];
    this.setState(
      {
        date: defaultDate,
        pageIndex: this.props.pageIndex
      },
      () => {
        this.getInventoryList();
      }
    );
  }

  getInventoryList() {
    const { pageIndex, pageSize, inventNum, date, storeName } = this.state;
    let params = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      Inventory_State: storeName,
      Inventory_Odd: inventNum,
      datetime: moment().format(),
      beginTime: date[0],
      endTime: date[1]
    };
    InventallApi(params).then(res => {
      console.log(res);
      if (res.length > 0) {
        for (let item of res) {
          item.key = item.Inventory_Odd;
          item.disabled = Number(item.StepState) === 4 ? (Number(item.FlowState) === 0 ? true : false) : Number(item.StepState) === 1 ? (Number(item.FlowState) === 1 ? true : false) : false;
        }
        this.setState({
          inventoryDataList: res,
          total: res[0].count
        });
      } else {
        this.setState({
          total: 0
        });
      }
    });
  }

  // 获取库房
  // getStoreList() {
  //   StoreApi().then(res => {
  //     console.log(res);
  //     this.setState({
  //       storeList: res
  //     });
  //   });
  // }
  // 点击搜索
  queryInventData = () => {
    this.getInventoryList();
  };

  // 搜索框
  searchData = value => {
    this.setState(
      {
        inventNum: value,
        pageIndex: 1
      },
      () => {
        this.getInventoryList();
      }
    );
  };
  // 分页改变
  paginationChange = page => {
    this.setState(
      {
        pageIndex: page
      },
      () => {
        this.getInventoryList();
        this.props.changePageIndex(page);
      }
    );
  };
  selectChange = value => {
    this.setState({
      storeName: value
    });
  };

  datePickerChange = date => {
    console.log(date);
    const { format } = this.state;
    this.setState({
      date: [
        date[0].hour(0).minute(0).second(0).format(), 
        date[1].hour(23).minute(59).second(59).format()
      ]
    });
  };
  // 对话框   // 删除展览单
  showConfirm = text => {
    let _this = this;
    confirm({
      title: "确定删除?",
      content: "",
      onOk() {
        // console.log(text);
        let params = { odd: text };
        DeleteInventory(params).then(res => {
          if (res === true) {
            message.success("删除成功");
            _this.getInventoryList();
          } else {
            message.error("删除失败");
          }
        });
      },
      onCancel() {
        console.log("Cancel");
      }
    });
  };

  render() {
    const {
      inventoryDataList,
      storeList,
      storeName,
      pageIndex,
      pageSize,
      total
    } = this.state;
    const inventoryColumns = [
      {
        title: "盘点单号",
        dataIndex: "Inventory_Odd",
      },
      {
        title: "盘点名称",
        dataIndex: "Inventory_Name",
      },
      {
        title: "盘点日期",
        dataIndex: "Inventory_Time",
        render: (text, recond) => {
          return <span>{subStr(recond.Inventory_BegTime) +' ~ ' +  subStr(recond.Inventory_EndTime)}</span>;
        }
      },
      {
        title: "盘点周期",
        dataIndex: "Inventory_Cycle",
        render: (text) =>{
          return <span>{text + '天'}</span>
        }
      },
      // {
      //   title: "文物名称",
      //   dataIndex: "Collection_Name",
      //   key: "Collection_Name"
      // },
      {
        title: "盘点数量",
        dataIndex: "Number",
        key: "Number"
      },
      // {
      //   title: "类型",
      //   dataIndex: "Category",
      //   key: "Category"
      // },
      // {
      //   title: "分级信息",
      //   dataIndex: "Grade",
      //   key: "Grade"
      // },
      {
        title: "盘点人",
        dataIndex: "InventoryMan",
        key: "InventoryMan"
      },
      {
        title: "盘点状态",
        dataIndex: "Inventory_State",
        key: "Inventory_State",
        render: (text) => {
          return <span 
          style={{
            color: Number(text) === 2 ? 'red' : '#666'
          }} >
              {
                inventState.map((item) => {
                  if (Number(text) === item.key) {
                    return item.value;
                  }
                }
                  
                )
              }
            </span>;
        }
      },
      {
        title: "审批状态",
        dataIndex: "",
        key: "approval",
        render: (text, value, idx) => {
          for(let item of approveState) {
            if(Number(text.StepState) === item.key) {
              return <span style={{color: Number(text.StepState) === 2 ? 'red' : '#666'}} >{item.value}</span>
            }
          }
        }
      },
      {
        title: "操作",
        dataIndex: "",
        key: "operation",
        render: (text, record, idx) => {
          // console.log(text)
          return <span>
              <Button
                style={{ border: 'none', marginLeft: '10px' }}
                disabled={!record.disabled}
                onClick={() => {
                  this.props.changeFormData({
                    state: "编辑盘点单",
                    formData: record.Inventory_Odd
                  });
                  this.props.history.push("/App/NewInventory");
                }}
              >
                编辑
              </Button>
              <Link onClick={() => {
                  let state = Number(text.DeniedPermission);
                  sessionStorage.setItem("anthoityState", state);
                }} to={`/App/ShowDetails/${text.Inventory_Odd}`}>
                详情
              </Link>
              <Button style={{ marginLeft: '10px', border: 'none' }}
                disabled={!record.disabled}
                onClick={this.showConfirm.bind(this, record.Inventory_Odd)} >
                删除
              </Button>
            </span>; 
        }
      },
    ];

    return <Row className="main-content">
        <Col span={24} className="title">
          藏品盘点列表
        </Col>
        <Col span={24} className="inventory-container" style={{ padding: "20px 40px 20px 20px" }}>
          <Col span={24} style={{ marginBottom: "20px" }}>
            <Col span={4} style={{ paddingBottom: "20px" }}>
              <Button type="primary" icon="plus" onClick={() => {
                  this.props.history.push("/App/NewInventory");
                }}>
                新建盘点单
              </Button>
            </Col>
            <Col span={20}>
              <Form layout="inline" style={{float: 'right'}} >
                <FormItem label="盘点状态:" className="select-form-item">
                  <Select defaultValue={storeName} onChange={this.selectChange}>
                    <Option value={10}>全部</Option>
                    {inventState.map((item, idx) => (
                      <Option value={item.key} key={item.key}>
                        {item.value}
                      </Option>
                    ))}
                  </Select>
                </FormItem>
                <FormItem label="盘点单日期：">
                  <RangePicker onChange={this.datePickerChange} defaultValue={RangePickerDefault} format="YYYY-MM-DD" />
                </FormItem>
                <FormItem>
                  <Search placeholder="请输入盘点单号" enterButton onSearch={this.searchData} />
                </FormItem>
              </Form>
            </Col>
          </Col>
          <Col span={24}>
            <Table columns={inventoryColumns} dataSource={inventoryDataList} bordered pagination={{ current: pageIndex, pageSize: pageSize, total: total, onChange: this.paginationChange }} />
          </Col>
        </Col>
      </Row>;
  }
}
// INVENTORYPAGE
const mapStateToProps = (state, ownProps) => {
  return {
    pageIndex: state.main.inventoryPage
  }
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    changePageIndex: args => dispatch({ type: 'INVENTORYPAGE', payload: args }),
    changeFormData: args => dispatch({ type: "COLLECINFO", payload: args })
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(CollecInventory);