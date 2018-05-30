import React, { Component } from "react";
import { Row, Col, Input, Upload, Modal, Icon, message, Button, Table } from "antd";
import "./index.less";
import { CollectionImgUpload } from "../../CollecManagement/Information/api";
import { Repairmetrial } from "../Repairmaterials/api";
import { AcceptClick } from './api';
import { connect } from 'react-redux';
const { TextArea, Search } = Input;

class NewRepairMethod extends Component {
  state = {
    title: '',
    info: {
      methodName: null,
      submitName: null,
      repairCourse: null,
      repairResult: null,
    },
    beforeRepair: [], // 默认的修复前图片列表
    beforeRepairUrl: null, // 选择的图片url
    afterRepair: [],
    afterRepairUrl: null,
    previewVisible: false, // 打开预览
    previewImage: "", // 预览的图片地址
    loading: false,
    pageIndex: 1,
    pageSize: 10,
    total: 0,
    searchName: "",
    chooseMaterVisible: false, // 选择材料弹窗
    materialList: [], // 选择材料列表
    allMaterialList: [],
    selectedRowKeys: [], // 默认选择的材料
    chooseMaterName: "点击选择修复材料" // 选择的材料名称
  };

  componentWillMount() {
    const { state, formData } = this.props.componentState;
    console.log(state);
    console.log(formData);
    this.getMaterialsList();
    if (state) {
      let beforeImg = [{ uid: -1, status: "done", url: formData.Material_SketchMap }];
      let afterImg = [{ uid: -2, status: "done", url: formData.Material_SketchMaps }];

      this.setState({
        title: state,
        info: {
          methodName: formData.Method_Name,
          submitName: formData.Material_Submitter,
          repairCourse: formData.Method_Process,
          repairResult: formData.Material_Result
        },
        beforeRepair: beforeImg,
        beforeRepairUrl: formData.Material_SketchMap,
        afterRepair: afterImg,
        afterRepairUrl: formData.Material_SketchMaps,
        chooseMaterName: formData.Material_Name,
        selectedRowKeys: formData.Material_Name.split(',')
      });
    } else {
      let userName = JSON.parse(sessionStorage.getItem("UserInfo")).UserName;
      this.state.info.submitName = userName;
    }
  }

  // 提交
  submit = () => {
    const {
      info,
      beforeRepairUrl,
      afterRepairUrl,
      chooseMaterName
    } = this.state;
    if (!info.methodName) {
      message.error("请输入修复方法名称");
      return;
    }
    if (!info.repairCourse) {
      message.error("请输入修复过程描述");
      return;
    }
    if (!info.repairResult) {
      message.error("请输入修复结果描述");
      return;
    }
    if (!beforeRepairUrl) {
      message.error("请选择修复前图片");
      return;
    }
    if (!afterRepairUrl) {
      message.error("请选择修复后图片");
      return;
    }
    if (chooseMaterName === "点击选择修复材料") {
      message.error("请选择修复材料");
      return;
    }
    const { state, formData } = this.props.componentState;
    let params = {
      Method_Name: info.methodName,
      Method_Process: info.repairCourse,
      Material_Result: info.repairResult,
      Material_Submitter: info.submitName,
      Material_SketchMap: beforeRepairUrl,
      Material_SketchMaps: afterRepairUrl,
      Method_Id: state ? formData.Method_Id : null,
      Material_Name: chooseMaterName,
      Key: state ? 1 : 0
    };
    AcceptClick(params).then(res => {
      console.log(res);
      if(res === 'True') {
        if(state) {
          message.success('编辑成功');
          this.props.history.push("/App/Repairmethod");
          return ;
        }
        message.success('新增成功');
        this.props.history.push("/App/Repairmethod");
      } else {
        if(state) {
          message.error('编辑失败');
          return;
        }
        message.error('新增失败')
      }
    });
  };

  // 选择修复前图片
  beforeRepairUpload = file => {
    console.log(file);
    // this.setState({
    //   beforeRepair: [file]
    // })
    var formData = new FormData();
    formData.append("file", file);
    CollectionImgUpload(formData).then(res => {
      console.log(res);
      if (res.Msg === "文件上传成功!") {
        this.setState({
          beforeRepairUrl: res.Data
        });
      } else {
        message.error("图片上传失败，请重新选择");
      }
    });
    return false;
  };

  // 选择修复后图片
  afterRepairUpload = file => {
    console.log(file);
    // this.setState({
    //   beforeRepair: [file]
    // })
    var formData = new FormData();
    formData.append("file", file);
    CollectionImgUpload(formData).then(res => {
      console.log(res);
      if (res.Msg === "文件上传成功!") {
        this.setState({ afterRepairUrl: res.Data });
      } else {
        message.error("图片上传失败，请重新选择");
      }
    });
    return false;
  };

  // 关闭预览弹窗
  handleCancel = () => this.setState({ previewVisible: false });
  // 打开预览弹窗
  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true
    });
  };
  // 选择图片
  handleChange = ({ fileList }) => this.setState({ beforeRepair: fileList });
  // 删除图片时触发
  onRemoveBefore = () => {
    this.setState({
      beforeRepairUrl: null
    });
    return true;
  };
  onRemoveAfter = () => {
    this.setState({
      afterRepairUrl: null
    });
    return true;
  };
  handleAfterChange = ({ fileList }) =>
    this.setState({ afterRepair: fileList });
  // 搜索修复材料名称
  getSearchMaterList = value => {
    this.setState(
      {
        searchName: value,
        pageIndex: 1
      },
      () => {
        this.getMaterialsList();
      }
    );
  };
  // 改变分页
  paginationChange = page => {
    this.setState(
      {
        pageIndex: page
      },
      () => {
        this.getMaterialsList();
      }
    );
  };
  // 选择材料
  getMaterialsList = () => {
    const { pageIndex, pageSize, searchName, allMaterialList } = this.state;
    let params = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      Name: searchName
    };
    Repairmetrial(params).then(res => {
      console.log(res);
      if (res.length === 0) {
        this.setState({
          materialList: [],
          total: 0
        });
        return;
      }
      for (let item of res) {
        item.key = item.Material_Name;
      }
      // var hash = {};
      // let newList = allMaterialList.concat(res);
      // newList = newList.reduce(function(item, next) {
      //   hash[next.Material_Id]
      //     ? ""
      //     : (hash[next.Material_Id] = true && item.push(next));
      //   return item;
      // }, []);
      this.setState({
        materialList: res,
        total: res[0].cou,
        // allMaterialList: newList
      });
    });
  };
  // 选择材料 点击确定
  handleModalOk = e => {
    console.log(e);
    const { allMaterialList, selectedRowKeys } = this.state;
    // let matername = [];
    // for (let item of selectedRowKeys) {
    //   for (let value of allMaterialList) {
    //     if (item === value.Material_Id) {
    //       matername.push(value.Material_Name);
    //     }
    //   }
    // }
    this.setState({
      chooseMaterVisible: false,
      chooseMaterName: selectedRowKeys.join(",")
    });
  };
  // 选择材料点击取消
  handleModalCancel = e => {
    // console.log(e);
    this.setState({
      chooseMaterVisible: false
    });
  };

  // 选择材料时触发
  onSelectChange = selected => {
    // const { selectedRowKeys } = this.state;
    this.setState(
      {
        selectedRowKeys: selected
      },
      () => {
        console.log("选择之后");
        console.log(this.state.selectedRowKeys);
      }
    );
  };
  render() {
    const {
      title,
      info,
      beforeRepair,
      afterRepair,
      previewImage,
      previewVisible,
      loading,
      chooseMaterVisible,
      materialList,
      defaultMaterList,
      pageIndex,
      pageSize,
      total,
      selectedRowKeys,
      chooseMaterName
    } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };
    const columns = [
      {
        title: "材料名称",
        dataIndex: "Material_Name"
      },
      {
        title: "材料属性",
        dataIndex: "Material_Attribute"
      },
      {
        title: "材料用途",
        dataIndex: "Material_Purpose"
      }
    ];
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <Row className="main-content">
        <Col span={24} className="title">
          {title}
          <div
            className="go-back"
            onClick={() => {
              this.props.history.goBack();
            }}
          />
        </Col>
        <Col className="new-repair-method" style={{padding: '40px 100px'}} span={24}>
          <Col
            span={24}
            style={{
              borderTop: "1px solid #d8d8d8",
              borderLeft: "1px solid #d8d8d8"
            }}
          >
            <Col span={4} className="table-label height100">
              修复方法名称
            </Col>
            <Col span={8} className="table-content height100">
              <TextArea
                defaultValue={info.methodName}
                onChange={e => {
                  this.state.info.methodName = e.target.value;
                }}
                style={{ height: "100px" }}
                placeholder="请输入方法名称"
              />
            </Col>
            <Col span={4} className="table-label height100">
              方法提交人
            </Col>
            <Col span={8} className="table-content height100">
              {info.submitName}
            </Col>
            <Col span={4} className="table-label height200">
              修复过程描述
            </Col>
            <Col span={8} className="table-content height200">
              <TextArea
                defaultValue={info.repairCourse}
                style={{ height: "200px" }}
                onChange={e => {
                  this.state.info.repairCourse = e.target.value;
                }}
                placeholder="请输入修复过程描述"
              />
            </Col>
            <Col span={4} className="table-label height200">
              修复结果描述
            </Col>
            <Col span={8} className="table-content height200">
              <TextArea
                defaultValue={info.repairResult}
                onChange={e => {
                  this.state.info.repairResult = e.target.value;
                }}
                style={{ height: "200px" }}
                placeholder="请输入修复结果描述"
              />
            </Col>
            <Col
              span={4}
              className="table-label height200"
              style={{ height: "150px", lineHeight: "150px" }}
            >
              修复前图片
            </Col>
            <Col
              span={8}
              className="table-content "
              style={{ padding: "20px", height: "150px" }}
            >
              <Upload
                action="//jsonplaceholder.typicode.com/posts/"
                listType="picture-card"
                fileList={beforeRepair}
                beforeUpload={this.beforeRepairUpload}
                onPreview={this.handlePreview}
                onChange={this.handleChange}
                onRemove={this.onRemoveBefore}
              >
                {beforeRepair.length >= 1 ? null : uploadButton}
              </Upload>
            </Col>
            <Col
              span={4}
              className="table-label height200"
              style={{ height: "150px", lineHeight: "150px" }}
            >
              修复后图片
            </Col>
            <Col
              span={8}
              className="table-content height200"
              style={{ padding: "20px", height: "150px" }}
            >
              <Upload
                action="//jsonplaceholder.typicode.com/posts/"
                listType="picture-card"
                fileList={afterRepair}
                beforeUpload={this.afterRepairUpload}
                onPreview={this.handlePreview}
                onChange={this.handleAfterChange}
                onRemove={this.onRemoveAfter}
              >
                {afterRepair.length >= 1 ? null : uploadButton}
              </Upload>
            </Col>
            <Col span={24}>
              <Col span={4} className="table-label height100">
                修复材料
              </Col>
              <Col
                span={20}
                className="table-content height100"
                style={{ textAlign: "left", paddingLeft: "20px" }}
              >
                <span
                  onClick={() => {
                    this.setState({
                      chooseMaterVisible: true
                    });
                  }}
                  style={{ cursor: "pointer", color: "#3065bf" }}
                >
                  {chooseMaterName}
                </span>
              </Col>
            </Col>

            <Modal
              visible={previewVisible}
              footer={null}
              onCancel={this.handleCancel}
            >
              <img alt="example" style={{ width: "100%" }} src={previewImage} />
            </Modal>
          </Col>
          <Modal
            title={[
              <Col span={24} style={{ height: "30px" }}>
                <h3 style={{ display: "inline-block" }}>请选择修复材料</h3>
                <Search
                  onSearch={this.getSearchMaterList}
                  enterButton
                  placeholder="请输入修复方法名称"
                  style={{
                    width: "240px",
                    float: "right",
                    marginRight: "20px"
                  }}
                />
              </Col>
            ]}
            className="repair-method"
            visible={this.state.chooseMaterVisible}
            onOk={this.handleModalOk}
            onCancel={this.handleModalCancel}
          >
            <Table
              pagination={
                total <= 10
                  ? false
                  : {
                      current: pageIndex,
                      pageSize: pageSize,
                      total: total,
                      onChange: this.paginationChange
                    }
              }
              rowSelection={rowSelection}
              dataSource={materialList}
              columns={columns}
              bordered
            />
          </Modal>
          <Col span={24} style={{ paddingTop: "20px" }}>
            <Button type="primary" loading={loading} onClick={this.submit}>
              提交
            </Button>
          </Col>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    componentState: state.main.collectionInfoData
  };
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    changeFormData: args => dispatch({ type: "COLLECINFO", payload: args })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NewRepairMethod);
