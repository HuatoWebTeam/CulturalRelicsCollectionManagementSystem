import React, { Component } from 'react';
import { Row, Col, Select, DatePicker, Input, Button, Form, Table, message } from 'antd';
import './index.less';
import { InventallApi } from './api';
import { StoreApi } from '../Components/RelicsDialog/api';
import { RangePickerDefault, approveState } from "../../assets/js/commonFun";
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApprovalPassed, ApprovalDenied } from "../../axios";
const Option = Select.Option;
const { RangePicker } = DatePicker;
const Search = Input.Search;
const FormItem = Form.Item;

class CollecInventory extends Component {
  state = {
    inventoryDataList: [],
    pageIndex: 1,
    pageSize: 10,
    total: 0,
    storeList: [],
    storeName: 0,
    date: [],
    format: "YYYY-MM-DD",
    inventNum: ""
  };

  componentWillMount() {
    this.getStoreList();
    const { format } = this.state;
    console.log(RangePickerDefault);
    let defaultDate = [
      RangePickerDefault[0].format(format),
      RangePickerDefault[1].format(format)
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
    const { pageIndex, pageSize, inventNum, date } = this.state;
    let params = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      Inventory_Odd: inventNum,
      beginTime: date[0],
      endTime: date[1]
    };
    InventallApi(params).then(res => {
      console.log(res);
      if (res.length > 0) {
        for (let item of res) {
          item.key = item.Inventory_Odd;
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
  getStoreList() {
    StoreApi().then(res => {
      console.log(res);
      this.setState({
        storeList: res
      });
    });
  }
  // 点击搜索
  queryInventData = () => {
    this.getInventoryList();
  };

  // 搜索框
  searchData = value => {
    this.setState(
      {
        storeName: value,
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
      date: [date[0].format(format), date[1].format(format)]
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
        key: "Inventory_Odd"
      },
      {
        title: "盘点名称",
        dataIndex: "Inventory_Name",
        key: "Inventory_Name"
      },
      {
        title: "时间",
        dataIndex: "Inventory_Time",
        key: "Inventory_Time"
      },
      // {
      //   title: "文物库房",
      //   dataIndex: "Storehouse_Name",
      //   key: "Storehouse_Name"
      // },
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
              {Number(text) === 0 ? "待盘点" : (Number(text) === 1 ? '盘点完成' : '盘点异常')}
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
          return <Link onClick={() => {
                let state = Number(text.DeniedPermission);
                sessionStorage.setItem("anthoityState", state);
              }} to={`/App/ShowDetails/${text.Inventory_Odd}`}>
              详情
            </Link>;
        }
      },
    ];

    return (
      <Row className="main-content">
        <Col span={24} className="title">
          藏品盘点列表
        </Col>
        <Col
          span={24}
          className="inventory-container"
          style={{ padding: "20px 40px 20px 20px" }}
        >
          <Col span={24} style={{ marginBottom: "20px" }}>
            <Col span={24} style={{ paddingBottom: "20px" }}>
              <Button
                type="primary"
                icon="plus"
                onClick={() => {
                  this.props.history.push("/App/NewInventory");
                }}
              >
                新建盘点单
              </Button>
            </Col>
            <Col span={18}>
              <Form layout="inline">
                <FormItem label="文物库房:" className="select-form-item">
                  <Select defaultValue={storeName} onChange={this.selectChange}>
                    <Option value={0}>全部</Option>
                    {storeList.map((item, idx) => (
                      <Option
                        value={item.Storehouse_Id}
                        key={item.Storehouse_Id}
                      >
                        {item.Storehouse_Name}
                      </Option>
                    ))}
                  </Select>
                </FormItem>
                <FormItem>
                  <RangePicker
                    onChange={this.datePickerChange}
                    defaultValue={RangePickerDefault}
                    format="YYYY-MM-DD"
                  />
                </FormItem>
                <FormItem>
                  <Button onClick={this.queryInventData} type="primary">
                    搜索
                  </Button>
                </FormItem>
              </Form>
            </Col>
            <Col span={6}>
              <Search
                placeholder="请输入盘点单号"
                enterButton
                onSearch={this.searchData}
              />
            </Col>
          </Col>
          <Col span={24}>
            <Table
              columns={inventoryColumns}
              dataSource={inventoryDataList}
              bordered
              pagination={{
                current: pageIndex,
                pageSize: pageSize,
                total: total,
                onChange: this.paginationChange
              }}
            />
          </Col>
        </Col>
      </Row>
    );
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
    changePageIndex: args => dispatch({ type: 'INVENTORYPAGE', payload: args })
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(CollecInventory);