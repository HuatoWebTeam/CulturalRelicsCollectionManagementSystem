import React, { Component } from 'react';
import { Row, Col, Form, Input, Upload, Cascader, Select, Button, message, Modal, Icon, DatePicker } from 'antd';
import { CollectionImgUpload } from './api';
import moment from "moment";
import { connect } from 'react-redux';
import { GetStorehouseAndStorage } from "./api";
import { relicsYears, relicsCategory, putInCategory, levelInfo, relicsState, howComplete } from '../../../assets/js/commonFun';
const FormItem = Form.Item;
const Option = Select.Option;


class RelicsInfoDialogApp extends Component {
  state = {
    previewVisible: false, // 预览
    previewImage: "", // 预览的图片url
    fileList: [], // 图片列表
    tankInfoList: [], //存台箱号
    relicsCateList: [],
    relicsYearsList: [],
    relicsLevelList: [],
    updateStroRfid: null,
    reset: false,
    formData: {
      relicsName: null,
      type: 1,
      localtion: null,
      carton: null,
      relicsNum: null,
      levelInfo: 1,
      number: null,
      relicsState: 0,
      date: moment(),
      relicsYears: 1,
      material: null,
      category: 1,
      weight: null,
      howComplete: 0,
      size: null
    }
  };
  componentWillMount() {
    const { state, formData } = this.props.componentState;
    let relicsYears = JSON.parse(sessionStorage.getItem("relicsYears"));
    let relicsCateGory = JSON.parse(sessionStorage.getItem("relicsCateGory"));
    let relicsLevel = JSON.parse(sessionStorage.getItem("relicsLevel"));
    this.setState(
      {
        relicsYearsList: relicsYears,
        relicsCateList: relicsCateGory,
        relicsLevelList: relicsLevel
      },
      () => {
        const { relicsYearsList, relicsCateList, relicsLevelList } = this.state;
        this.state.formData.relicsYears = Number(relicsYearsList[0].YearsId);
        this.state.formData.category = Number(relicsCateList[0].CollTypeId);
        this.state.formData.levelInfo = Number(relicsLevelList[0].GradeId);
      }
    );

    console.log(state);
    console.log(formData);
    // let params = {
    //   Condition: '',
    //   PageIndex: 1,
    //   PageSize: 1000
    // }

    GetStorehouseAndStorage().then(res => {
      // console.log("------");
      console.log(res);
      if (res.Data) {
        let data = [],
          resData = res.Data;
        for (let item of resData) {
          let oneData = {};
          oneData.value = item.StorehouseId;
          oneData.label = item.StorehouseName;
          oneData.children = [];
          for (let childData of item.ListStorage) {
            oneData.children.push({
              value: childData.StorageId,
              label: childData.StorageName
            });
          }
          data.push(oneData);
        }
        // console.log(data)
        this.setState({ tankInfoList: data });
        for (let item of data) {
          if (item.children.length > 0) {
            this.state.formData.carton = [item.value, item.children[0].value];
            break;
          }
        }

        console.log(this.state);
        if (state === "编辑藏品") {
          let data = {
            category: Number(formData.category),
            howComplete: Number(formData.howComplete),
            key: formData.key,
            levelInfo: Number(formData.levelInfo),
            date: moment(formData.libraryTime),
            material: formData.material,
            number: Number(formData.number),
            relicsName: formData.relicsName,
            relicsNum: formData.relicsNum,
            size: formData.size,
            relicsState: Number(formData.state),
            weight: formData.weight,
            relicsYears: Number(formData.years),
            type: Number(formData.type),
            carton: formData.carton,
            localtion: formData.localtion
          };
          // this.setState({
          //   updateStroRfid: Number(formData.carton)
          // })
          let fielList = [
            { uid: -1, name: "", status: "done", url: formData.relicsImg1 },
            { uid: -2, name: "", status: "done", url: formData.relicsImg2 },
            { uid: -3, name: "", status: "done", url: formData.relicsImg3 }
          ];
          for (let i = 0; i < fielList.length; i++) {
            if (fielList[i].url === "") {
              fielList.splice(i, 1);
              i--;
            }
          }
          this.setState({ formData: data, fileList: fielList }, () => {
            console.log(this.state);
          });
        }
      }
    });
  }

  componentWillUnmount() {
    this.props.changeFormData({
      state: null,
      formDate: null
    });
  }
  // 点击预览
  handlePreview = file => {
    console.log(file);
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true
    });
  };
  // 上传图片之前的钩子
  beforeUpload = file => {
    // console.log("before");
    console.log(file);
    const isLt3M = file.size / 1024 / 1024 < 3;
    console.log(isLt3M);
    if (!isLt3M) {
      message.error("请选择小于3M的图片!!!");
      return false;
    }

    // console.log(this.state);
    this.uploadImg(file);
    return false;
  };

  // 上传图片
  uploadImg = file => {
    let formData = new FormData();
    formData.append("file", file);
    CollectionImgUpload(formData).then(res => {
      console.log(res);
      if (res.Msg === "文件上传成功!") {
        let fileLists = {
          uid: "-" + new Date().getTime(),
          name: "",
          status: "done",
          url: res.Data
        };
        console.log("success");
        this.setState(({ fileList }) => ({
          fileList: [...fileList, fileLists]
        }));
      } else {
        message.error("上传失败");
      }
    });
  };
  // 选择图片之后
  handleChange = ({ fileList }) => {
    // console.log("change");
    // this.setState({ fileList });
    console.log(fileList);
  };
  handleRemove = file => {
    //   console.log(file);
    //   console.log(this.state.fileList);
    const { fileList } = this.state;
    for (let i = 0; i < fileList.length; i++) {
      if (fileList[i].status === "removed") {
        fileList.splice(i, 1);
      }
    }
    //   console.log(fileList)
    this.setState({
      fileList: fileList
    });
  };

  resetFormFun() {
    this.setState({
      fileList: []
    });
    this.props.form.resetFields();
  }

  // 关闭预览
  handleCancel = () => this.setState({ previewVisible: false });
  // 提交
  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(values);
        const { fileList } = this.state;
        if (fileList.length > 0) {
          const { formData } = this.props.componentState;
          console.log(fileList[1] === undefined);
          const value = {
            ...values,
            relicsState: formData.state || 0,
            date: values["date"].format("YYYY-MM-DD"),
            Collectionimg1: fileList[0] === undefined ? null : fileList[0].url,
            Collectionimg2: fileList[1] === undefined ? null : fileList[1].url,
            Collectionimg3: fileList[2] === undefined ? null : fileList[2].url
          };
          this.props.submit(value);
        } else {
          message.error("请选择图片");
        }
      }
    });
  }
  // 验证
  handleNumber = (rule, value, callback) => {
    if (!value) {
      callback("请输入正确的数量");
    } else if (value && Number(value) === 0) {
      callback("请输入正确的数量");
    } else {
      callback();
    }
  };
  componentDidUpdate() {
    const { reset } = this.props;
    const { state } = this.props.componentState;
    console.log(this.props);
    if (reset === true) {
      if (state !== "编辑藏品") {
        this.setState(
          {
            fileList: [],
            reset: false
          },
          () => {
            this.props.form.resetFields();
            this.props.onReset();
          }
        );
      }
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    const {
      previewVisible,
      previewImage,
      fileList,
      formData,
      tankInfoList,
      relicsYearsList,
      relicsCateList,
      relicsLevelList
    } = this.state;

    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <Row>
        <Col span={24}>
          <Form
            layout="inline"
            style={{ width: "710px" }}
            onSubmit={this.handleSubmit.bind(this)}
          >
            <FormItem
              label="文物图片"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              style={{ width: "100%" }}
            >
              <Upload
                action="/CollectionManage/CollectionImgUpload"
                listType="picture-card"
                fileList={fileList}
                beforeUpload={this.beforeUpload}
                onPreview={this.handlePreview}
                onChange={this.handleChange}
                onRemove={this.handleRemove}
              >
                {fileList.length >= 3 ? null : uploadButton}
              </Upload>
              <Modal
                visible={previewVisible}
                footer={null}
                onCancel={this.handleCancel}
              >
                <img alt="预览" src={previewImage} style={{ width: "100%" }} />
              </Modal>
              <span style={{ color: "#666" }}>
                *上传图片最大不能超过3m,最多可上传3张图片
              </span>
            </FormItem>
            <FormItem
              className="form-width50"
              label="文物名称:"
              labelCol={{ span: 8 }}
            >
              {getFieldDecorator("relicsName", {
                initialValue: formData.relicsName,
                rules: [{ required: true, message: "请输入文物名称" }]
              })(<Input placeholder="请输入文物名称" />)}
            </FormItem>
            <FormItem
              className="form-width50"
              label="入库类型:"
              labelCol={{ span: 8 }}
            >
              {getFieldDecorator("type", {
                initialValue: formData.type,
                rules: [{ required: true, message: "请选择入库类型" }]
              })(
                <Select>
                  {putInCategory.map((item, idx) => (
                    <Option value={item.key} key={item.key}>
                      {" "}
                      {item.value}{" "}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem
              className="form-width50"
              label="存储柜:"
              labelCol={{ span: 8 }}
            >
              {getFieldDecorator("carton", {
                initialValue: formData.carton,
                rules: [{ required: true, message: "请选择存储柜" }]
              })(<Cascader options={tankInfoList} placeholder="请选择" />)}
            </FormItem>
            <FormItem
              className="form-width50"
              label="存储位置:"
              labelCol={{ span: 8 }}
            >
              {getFieldDecorator("localtion", {
                initialValue: formData.localtion,
                rules: [{ required: true, message: "请输入存储位置" }]
              })(<Input placeholder="请输入存储位置" />)}
            </FormItem>

            <FormItem
              className="form-width50"
              label="文物编号:"
              labelCol={{ span: 8 }}
            >
              {getFieldDecorator("relicsNum", {
                initialValue: formData.relicsNum,
                rules: [{ required: true, message: "请输入文物编号" }]
              })(<Input placeholder="请输入文物编号" />)}
            </FormItem>
            <FormItem
              className="form-width50"
              label="分级信息:"
              labelCol={{ span: 8 }}
            >
              {getFieldDecorator("levelInfo", {
                initialValue: formData.levelInfo,
                rules: [{ required: true, message: "请选择分级信息" }]
              })(
                <Select>
                  {relicsLevelList.map((item, idx) => (
                    <Option
                      value={Number(item.GradeId)}
                      key={Number(item.GradeId)}
                    >
                      {item.GradeName}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem
              className="form-width50"
              label="文物数量:"
              labelCol={{ span: 8 }}
            >
              {getFieldDecorator("number", {
                initialValue: formData.number,
                rules: [
                  { required: true, message: "请输入文物数量" },
                  { validator: this.handleNumber }
                ]
              })(<Input placeholder="请输入文物数量" />)}
            </FormItem>
            {/* <FormItem
              className="form-width50"
              label="文物状态:"
              labelCol={{ span: 8 }}
            >
              {getFieldDecorator("relicsState", {
                initialValue: formData.relicsState,
                rules: [{ required: true, message: "请选择文物状态" }]
              })(
                <Select>
                  {
                    relicsState.map((item, idx) =>
                      <Option value={item.key} key={item.key} > {item.value} </Option>
                    )
                  }
                </Select>
              )}
            </FormItem> */}
            <FormItem
              className="form-width50"
              label="入馆时间:"
              labelCol={{ span: 8 }}
            >
              {getFieldDecorator("date", {
                initialValue: formData.date,
                rules: [{ required: true, message: "请选择入馆时间" }]
              })(<DatePicker format="YYYY-MM-DD " />)}
            </FormItem>
            <FormItem
              className="form-width50"
              label="年代:"
              labelCol={{ span: 8 }}
            >
              {getFieldDecorator("relicsYears", {
                initialValue: formData.relicsYears,
                rules: [{ required: true, message: "请选择文物年代" }]
              })(
                <Select>
                  {relicsYearsList.map((item, idx) => (
                    <Option
                      value={Number(item.YearsId)}
                      key={Number(item.YearsId)}
                    >
                      {item.YearsName}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem
              className="form-width50"
              label="材质:"
              labelCol={{ span: 8 }}
            >
              {getFieldDecorator("material", {
                initialValue: formData.material,
                rules: [{ required: true, message: "请输入文物材质" }]
              })(<Input placeholder="请输入文物材质" />)}
            </FormItem>
            <FormItem
              className="form-width50"
              label="文物类别:"
              labelCol={{ span: 8 }}
            >
              {getFieldDecorator("category", {
                initialValue: formData.category,
                rules: [{ required: true, message: "请选择文物类别" }]
              })(
                <Select>
                  {relicsCateList.map(item => (
                    <Option
                      value={Number(item.CollTypeId)}
                      key={Number(item.CollTypeId)}
                    >
                      {item.CollTypeName}
                    </Option>
                  ))}
                </Select>
                // <Input placeholder='请输入文物类别' />
              )}
            </FormItem>
            <FormItem
              className="form-width50"
              label="重量:"
              labelCol={{ span: 8 }}
            >
              {getFieldDecorator("weight", {
                initialValue: formData.weight,
                rules: [{ required: true, message: "请输入文物重量" }]
              })(<Input placeholder="请输入文物重量" />)}
            </FormItem>
            <FormItem
              className="form-width50"
              label="完整程度:"
              labelCol={{ span: 8 }}
            >
              {getFieldDecorator("howComplete", {
                initialValue: formData.howComplete,
                rules: [{ required: true, message: "请选择完整程度" }]
              })(
                <Select>
                  {howComplete.map(item => (
                    <Option value={item.key} key={item.key}>
                      {item.value}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem
              className="form-width50"
              label="尺寸:"
              labelCol={{ span: 8 }}
            >
              {getFieldDecorator("size", {
                initialValue: formData.size,
                rules: [{ required: true, message: "请输入文物尺寸" }]
              })(<Input placeholder="请输入文物尺寸" />)}
            </FormItem>
            <FormItem style={{ width: "100%" }} wrapperCol={{ offset: 4 }}>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
            </FormItem>
          </Form>
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

const RelicsInfoDialog = Form.create()(RelicsInfoDialogApp);
export default connect(mapStateToProps, mapDispatchToProps)(RelicsInfoDialog);