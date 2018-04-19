import React, { Component } from 'react';
import { Col, Form, Select, Modal, Table, Input } from 'antd';
import { StoreApi, ColleApi } from './api';
import { levelInfo, relicsYears, relicsCategory } from '../../../assets/js/commonFun';
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
    // console.log(this.props);
    this.setState({ modalTitle: this.props.title });
    StoreApi().then(res => {
      // console.log(res);
      this.setState({
        relicsStoreList: res
      });
    });
    this.searchModalData();
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
      let data = [];
      for (let item of res) {
        data.push({
          key: item.Collection_Number,
          relicsNum: item.Collection_Number,
          cabinet: item.Storage_RFID,
          relicsImg: item.Collection_img,
          relicsName: item.Collection_Name,
          localtion: item.Storage_Position,
          number: item.Number,
          levelInfo: item.Grade,
          material: item.MaterialQuality,
          years: item.Collection_Years,
          howComplete: item.Integrity
        });
      }
      this.setState({
        searchRelicsData: data
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
      type:this.props.radio ? 'radio' : 'checkbox',
      onChange: this.onSelectChange,
    };
    console.log(this.props)
    const chooseRelicsColumns = [
      {
        title: "文物编号",
        dataIndex: "relicsNum",
        key: "relicsNum"
      },
      {
        title: "储柜RFID",
        dataIndex: "cabinet",
        key: "cabinet"
      },
      {
        title: "文物图片",
        dataIndex: "relicsImg",
        key: "relicsImg",
        render: (text, record, index) => {
          // console.log(text,record, index)
          return (
            <img
              style={{ width: "55px", height: "55px" }}
              src={text}
              alt={index}
            />
          );
        }
      },
      {
        title: "文物名称",
        dataIndex: "relicsName",
        key: "relicsName"
      },
      {
        title: "储存位置",
        dataIndex: "localtion",
        key: "localtion"
      },
      {
        title: "数量",
        dataIndex: "number",
        key: "number"
      },
      {
        title: "分级信息",
        dataIndex: "levelInfo",
        key: "levelInfo",
        render: (text) => {
            for(let item of levelInfo) {
                if(Number(text) === item.key) {
                    return (<span>{item.value}</span>)
                }
            }
        }
      },
      {
        title: "材质",
        dataIndex: "material",
        key: "material"
      },
      {
        title: "年代",
        dataIndex: "years",
        key: "years",
        render:(text) => {
            for(let item of relicsYears) {
                if(Number(text) === item.key) {
                    return (<span>{item.value}</span>)
                }
            } 
        }
      },
      {
        title: "完整程度",
        dataIndex: "howComplete",
        key: "howComplete",
        render: (text) => {
            if(Number(text) === 0) {
                return (<span>完整</span>)
            } else if(Number(text) === 1) {
                return (<span>破损</span>)
            }
        }
      }
    ];
    return (
      <Modal
        visible={chooseCollRelics}
        title={modalTitle}
        onCancel={this.handleCancel}
        onOk={this.handleOk}
        width="1260px"
        bodyStyle={{
          height: "540px",
          overflowY: "auto"
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
              label="文物分类:"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
            >
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
              onRow= {(record) => {
                return {
                  onClick:() => {
                    console.log('---点击table')
                    console.log(record)
                  }
                }
                
              }}
              onSelect={(selectKey) => {
                console.log(selectKey)
              }}
            />
          </Col>
        </Col>
      </Modal>
    );
  }
}

export default RelicsDialog;