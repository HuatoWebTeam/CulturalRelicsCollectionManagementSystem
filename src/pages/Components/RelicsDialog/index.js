import React, { Component } from 'react';
import { Col, Form, Select, Modal, Table, Input } from 'antd';
import { StoreApi, ColleApi } from './api';
import { levelInfo, relicsYears, relicsCategory, relicsState } from '../../../assets/js/commonFun';
const FormItem = Form.Item;
const Option = Select.Option;
const { Search } = Input;


class RelicsDialog extends Component {
  state = {
    chooseCollRelics: false,
    modalTitle: null,
    relicsStoreList: [],
    searchStore: 0,
    searchCategory: "全部",
    searchName: "",
    searchRelicsData: [],
    selectedRowKeys: []
  };

  componentWillMount() {
    console.log(this.props);
    this.setState({ modalTitle: this.props.title });
    StoreApi().then(res => {
      // console.log(res);
      this.setState({
        relicsStoreList: res
      });
    });
    this.searchModalData();
  }
  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    const { searchRelicsData } = this.state;
    // console.log(searchRelicsData)
    let item = nextProps.checkedItem;
    // console.log(item)
    let keys = [];
    for(let value of item) {
      keys.push(value.Collection_Number);
    }
    let data = searchRelicsData.concat(item);
    // console.log(data)
    this.setState({
      searchRelicsData: data,
      selectedRowKeys: keys,
    }, () => {
      console.log(this.state)
    })
  }

  componentWillUnmount() {
    this.setState({
      searchRelicsData: []
    })
  }

  // 打开弹框
  openModal = () => {
    const { chooseCollRelics } = this.state;
    this.setState({ chooseCollRelics: !chooseCollRelics });
  };
  //  弹窗搜索按钮
  chooseDataSearch = value => {
    // console.log(value);
    this.setState({
      searchName: value
    }, () => {
      this.searchModalData();
    });
    
  };

  searchModalData = () => {
    const { searchStore, searchCategory, searchName } = this.state;
    let params = {
      StoreId: searchStore,
      Type: searchCategory,
      CollName: searchName,
      stat: this.props.stat
    };
    // console.log(params);
    ColleApi(params).then(res => {
      console.log(res);
      const { searchRelicsData } = this.state;
      let data = [];
      for (let item of res) {
        
          item.key = item.Collection_Number;
        
      }
      this.setState({
        searchRelicsData: res.concat(searchRelicsData)
      });
    });
  };

  handleCancel = () => {
    this.openModal();
    this.setState({
      checkBoxArr: []
    });
  };
  handleOk = () => {
    this.openModal();
    // console.log(this.state.checkBoxArr);
    // console.log('-------')
    const { searchRelicsData, selectedRowKeys } = this.state;
    let chooseData = [];
    for (let item of selectedRowKeys) {
      // console.log(item);
      for (let value of searchRelicsData) {
        // console.log(value);
        if (item === value.key) {
          chooseData.push(value);
          break;
        }
      }
    }
    console.log(chooseData);
    this.props.chooseData(chooseData);
  };

  resetTableCheck = () => {
    this.setState({ selectedRowKeys: [] });
  };

  onSelectChange = selectedRowKeys => {
    
    this.setState({ selectedRowKeys });
  }

  render() {
    const {
      chooseCollRelics,
      relicsStoreList,
      searchRelicsData,
      modalTitle,
      searchStore,
      searchCategory,
      selectedRowKeys
    } = this.state;
    // checkbox
    const rowSelection = {
      selectedRowKeys,
      type: this.props.radio ? 'radio' : 'checkbox',
      onChange: this.onSelectChange,
    };
    // console.log(this.props)
    const chooseRelicsColumns = [
      {
        title: "文物编号",
        dataIndex: "Collection_Number",
        width: 118
      },
      {
        title: "储柜RFID",
        dataIndex: "Storage_RFID",
        width: 230
      },
      {
        title: "文物图片",
        dataIndex: "Collection_img",
        render: (text, record, index) => {
          // console.log(text,record, index)
          return (
            <img
              style={{ width: "55px", height: "55px" }}
              src={text}
              alt={index}
            />
          );
        },
        width: 94
      },
      {
        title: "文物名称",
        dataIndex: "Collection_Name",
        width: 156
      },
      {
        title: "储存位置",
        dataIndex: "Storage_Position",
      },
      {
        title: "数量",
        dataIndex: "Number",
        width: 52
      },
      {
        title: "分级信息",
        dataIndex: "GradeName",
        width: 99
      },
      {
        title: "材质",
        dataIndex: "MaterialQuality",
        width: 66
      },
      {
        title: "年代",
        dataIndex: "YearsName",
        width: 66
      },
      {
        title: "完整程度",
        dataIndex: "Integrity",
        render: (text) => {
            if(Number(text) === 0) {
                return (<span>完整</span>)
            } else if(Number(text) === 1) {
                return (<span>破损</span>)
            }
        },
        width: 66
      },
      {
          title: '文物状态',
          dataIndex: 'Collection_State',
          key: 'Collection_State',
          render: (text) => {
              for(let item of relicsState) {
                  if(Number(text) === item.key) {
                      return (<span style={{color: Number(text) === 5 ? 'red' : '#666'}} >{item.value}</span>)
                  }
              }
          },
          width: 66
      },
    ];
    return (
      <Modal
        visible={chooseCollRelics}
        title={modalTitle}
        onCancel={this.handleCancel}
        onOk={this.handleOk}
        width="1260px"
        bodyStyle={{
          height: "570px",
          overflowY: "hidden"
        }}
      >
        <Col span={24} className="chooseRelics-modal">
          <Form layout="inline" style={{ width: "100%", marginBottom: "20px" }}>
            <FormItem
              label="文物库房:"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
            >
              <Select
                defaultValue={searchStore}
                onSelect={value => {
                  this.setState({ searchStore: value });
                }}
              >
                <Option value={0}>全部</Option>
                {relicsStoreList.length > 0 && relicsStoreList.map((item, idx) => (
                  <Option value={item.Storehouse_Id} key={item.Storehouse_Id}>
                    {item.Storehouse_Name}
                  </Option>
                ))}
              </Select>
            </FormItem>
            <FormItem
              label="文物类别:"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
            >
            {/* <Input placeholder='请输入文物类别' 
              value={searchCategory} 
              onChange={(e) => {
                this.setState({
                  searchCategory: e.target.value
                })
              }} /> */}
              <Select
                defaultValue={searchCategory}
                onSelect={value => {
                  this.setState({ searchCategory: value });
                }}
              >
                <Option value="全部">全部</Option>
                {relicsCategory.map((item, idx) => (
                  <Option value={item.key} key={item.key}>
                    {item.value}
                  </Option>
                ))}
              </Select>
            </FormItem>
            <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
              <Search placeholder='请输入文物名称' onSearch={this.chooseDataSearch} enterButton />
            </FormItem>
          </Form>
          <Col span={24}>
            <Table
              rowSelection={rowSelection}
              dataSource={searchRelicsData}
              columns={chooseRelicsColumns}
              pagination={false}
              bordered
              scroll={{ x: 1150, y: 407}}
            />
          </Col>
        </Col>
      </Modal>
    );
  }
}

export default RelicsDialog;