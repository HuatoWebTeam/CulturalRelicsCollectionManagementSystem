import React, { Component } from 'react';
import { Col, Form, Select, Modal, Table, Input } from 'antd';
import { StoreApi, ColleApi } from './api';
import { relicsState } from '../../../assets/js/commonFun';
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
    pageIndex: 1,
    pageSize: 10,
    total: null,
    allRelicsList: [],
    searchRelicsData: [],
    selectedRowKeys: [],
    relicsCateList: [],
    relicsYearsList: [],
    relicsLevelList: [],
  };

  componentWillMount() {
    console.log("willMount");
    console.log(this.props);
    let relicsYears = JSON.parse(sessionStorage.getItem("relicsYears"));
    let relicsCateGory = JSON.parse(sessionStorage.getItem("relicsCateGory"));
    let relicsLevel = JSON.parse(sessionStorage.getItem("relicsLevel"));

    let checkNum = this.props.checkedItem;
    this.setState({
      relicsYearsList: relicsYears,
      relicsCateList: relicsCateGory,
      relicsLevelList: relicsLevel,
      modalTitle: this.props.title,
      selectedRowKeys: checkNum
    });
    StoreApi().then(res => {
      // console.log(res);
      this.setState({
        relicsStoreList: res
      });
    });
    this.searchModalData();
  }
  componentWillReceiveProps(nextProps) {
    console.log("propsChange");
    console.log(nextProps);
    // const { searchRelicsData } = this.state;
    // console.log(searchRelicsData)
    let item = nextProps.checkedItem;
    
    this.setState(
      {
        selectedRowKeys: item
      },
      () => {
        console.log(this.state);
      }
    );
  }

  componentWillUnmount() {
    this.setState({ searchRelicsData: [], selectedRowKeys: [] });
  }

  // 打开弹框
  openModal = () => {
    const { chooseCollRelics } = this.state;
    this.setState({ chooseCollRelics: !chooseCollRelics });
  };
  //  弹窗搜索按钮
  chooseDataSearch = value => {
    // console.log(value);
    this.setState(
      {
        searchName: value,
        searchRelicsData: [],
        pageIndex: 1,
      },
      () => {
        this.searchModalData();
      }
    );
  };

  searchModalData = () => {
    const { searchStore, searchCategory, searchName, pageIndex, pageSize } = this.state;
    console.log(this.props);
    const { Table, Odd } = this.props;
    console.log(Table !== null)
    let params = {
      StoreId: searchStore,
      Type: searchCategory,
      CollName: searchName,
      stat: this.props.stat,
      pageIndex: pageIndex,
      pageSize: pageSize,
      Table: Table,
      Odd: Odd ? Odd : ''
    };
    // console.log(params);
    ColleApi(params).then(res => {
      console.log(res);
      const { searchRelicsData, allRelicsList } = this.state;
      // let data = [];
      let len = res[0] ? res[0].Count : 0;
      for (let item of res) {
        item.key = item.Collection_Number;
      }
      res = searchRelicsData.concat(res);
      console.log(res);
      if(res.length === 0) {
        this.setState({
          total: 0,
          searchRelicsData: res
        })
      }
      var hash = {};
      let newList = allRelicsList.concat(res);
      // newList = Array.from(new Set(newList));
      newList = newList.reduce(function(item, next) {
        hash[next.Collection_Number] ? "" : (hash[next.Collection_Number] = true && item.push(next));
        return item;
      }, []);
      console.log(newList);
      this.setState(
        {
          total: len,
          allRelicsList: newList
        },
        () => {
          this.setState({
            searchRelicsData: res
          });
        }
      );
      
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
    const { allRelicsList, selectedRowKeys } = this.state;
    let chooseData = [];
    for (let item of selectedRowKeys) {
      // console.log(item);
      for (let value of allRelicsList) {
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
  // 选择
  onSelectChange = selected => {
    // const { selectedRowKeys } = this.state;
    this.setState({ 
      selectedRowKeys: selected
    }, () => {
      console.log('选择之后');
      console.log(this.state.selectedRowKeys)
    });
  };

  // 分页
  pageationChange = (index) => {
    this.setState(
      {
        pageIndex: index,
        searchRelicsData: []
      },
      () => {
        this.searchModalData();
      }
    );
  }

  render() {
    const {
      chooseCollRelics,
      relicsStoreList,
      searchRelicsData,
      modalTitle,
      searchStore,
      searchCategory,
      selectedRowKeys,
      relicsCateList,
      pageIndex,
      pageSize,
      total,
    } = this.state;
    // checkbox
    const rowSelection = {
      selectedRowKeys,
      type: this.props.radio ? "radio" : "checkbox",
      onChange: this.onSelectChange
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
      // {
      //   title: "储存位置",
      //   dataIndex: "Storage_Position"
      // },
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
        render: text => {
          if (Number(text) === 0) {
            return <span>完整</span>;
          } else if (Number(text) === 1) {
            return <span>破损</span>;
          }
        },
        width: 66
      },
      {
        title: "文物状态",
        dataIndex: "CollStateName",
        key: "CollStateName",
        width: 66
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
                {relicsStoreList.length > 0 &&
                  relicsStoreList.map((item, idx) => (
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
                {relicsCateList.map((item, idx) => (
                  <Option
                    value={Number(item.CollTypeId)}
                    key={Number(item.CollTypeId)}
                  >
                    {item.CollTypeName}
                  </Option>
                ))}
              </Select>
            </FormItem>
            <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
              <Search
                placeholder="请输入文物名称"
                onSearch={this.chooseDataSearch}
                enterButton
              />
            </FormItem>
          </Form>
          <Col span={24}>
            <Table
              rowSelection={rowSelection}
              dataSource={searchRelicsData}
              columns={chooseRelicsColumns}
              pagination={{ current: pageIndex, pageSize: pageSize, total: total, onChange: this.pageationChange }}
              bordered
              scroll={{ x: 1150, y: 360 }}
            />
          </Col>
        </Col>
      </Modal>
    );
  }
}

export default RelicsDialog;