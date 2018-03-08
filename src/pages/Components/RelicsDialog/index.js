import React, { Component } from 'react';
import { Col, Form, Select, Modal, Table, Input } from 'antd';
import { StoreApi, ColleApi } from './api';
const FormItem = Form.Item;
const Option = Select.Option;
const { Search } = Input;


class RelicsDialog extends Component {
  state = {
    chooseCollRelics: false,
    modalTitle: null,
    relicsStoreList: [],
    searchStore: 0,
    searchCategory: 0,
    searchName: "",
    searchRelicsData: [],
    checkBoxArr: []
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
    });
    this.searchModalData();
  };

  searchModalData = () => {
    const { searchStore, searchCategory, searchName } = this.state;
    let params = {
      StoreId: searchStore,
      Type: searchCategory,
      CollName: searchName
    };
    // console.log(params);
    ColleApi(params).then(res => {
      // console.log(res);
      let data = [];
      for (let item of res) {
        data.push({
          key: item.Collection_Number,
          rfid: item.Collection_RFID,
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
    })
  };
  handleOk = () => {
    this.openModal();
    // console.log(this.state.checkBoxArr);
    // console.log('-------')
    const { searchRelicsData, checkBoxArr } = this.state;
    let chooseData = [];
    for(let item of checkBoxArr) {
      // console.log(item);
      for(let value of searchRelicsData) {
        // console.log(value);
        if(item === value.key) {
          
          chooseData.push(value);
          break;
        }
      }
    }
    console.log(chooseData)
    this.props.chooseData(chooseData);

  };

  // checkbox
  rowSelection = {
    onChange: selectedRowKeys => {
      // console.log(selectedRowKeys);
      this.setState({
        checkBoxArr: selectedRowKeys
      })
    }
  };
  render() {
    const {
      chooseCollRelics,
      relicsStoreList,
      searchRelicsData,
      modalTitle
    } = this.state;
    const chooseRelicsColumns = [
      {
        title: "文物RFID",
        dataIndex: "rfid",
        key: "rfid"
      },
      {
        title: "储柜RFID",
        dataIndex: "cabinet",
        key: "cabinet"
      },
      {
        title: "文物图片",
        dataIndex: "relicsImg",
        key: "relicsImg"
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
        key: "levelInfo"
      },
      {
        title: "材质",
        dataIndex: "material",
        key: "material"
      },
      {
        title: "年代",
        dataIndex: "years",
        key: "years"
      },
      {
        title: "完整程度",
        dataIndex: "howComplete",
        key: "howComplete"
      }
    ];
    return (
      <Modal
        visible={chooseCollRelics}
        title={modalTitle}
        onCancel={this.handleCancel}
        onOk={this.handleOk}
        width="1260px"
      >
        <Col span={24} className="chooseRelics-modal">
          <Form layout="inline" style={{ width: "100%", marginBottom: "20px" }}>
            <FormItem
              label="文物库房:"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
            >
              <Select
                defaultValue={0}
                onSelect={value => {
                  this.setState({ searchStore: value });
                }}
              >
                <Option value={0}>全部</Option>
                {relicsStoreList.map((item, idx) => (
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
                defaultValue={0}
                onSelect={value => {
                  this.setState({ searchCategory: value });
                }}
              >
                <Option value={0}>全部</Option>
                {relicsStoreList.map((item, idx) => (
                  <Option value={item.Storehouse_Id} key={item.Storehouse_Id}>
                    {item.Storehouse_Name}
                  </Option>
                ))}
              </Select>
            </FormItem>
            <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
              <Search onSearch={this.chooseDataSearch} enterButton />
            </FormItem>
          </Form>
          <Col span={24}>
            <Table
              rowSelection={this.rowSelection}
              dataSource={searchRelicsData}
              columns={chooseRelicsColumns}
              pagination={false}
              bordered
            />
          </Col>
        </Col>
      </Modal>
    );
  }
}

export default RelicsDialog;