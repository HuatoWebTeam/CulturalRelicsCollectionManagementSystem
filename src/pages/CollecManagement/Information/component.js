import React, { Component } from 'react';
import { Row, Col, Form, Input, Upload, Select, Button, message, Modal, Icon, DatePicker } from 'antd';
import { CollectionImgUpload } from './api';
import moment from "moment";
import { relicsYears, relicsCategory, putInCategory, levelInfo, relicsState } from '../../../assets/js/commonFun';
const FormItem = Form.Item;
const Option = Select.Option;


class RelicsInfoDialogApp extends Component {
  state = {
    previewVisible: false, // 预览
    previewImage: "", // 预览的图片url
    fileList: [], // 图片列表
    reset: false
  };

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
    // console.log(file);
    const isLt3M = file.size / 1024 / 1024 < 3;

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
    // console.log(fileList);
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
        if(fileList.length > 0) {
          console.log(fileList[1] === undefined);
          const value = {
            ...values,
            date: values["date"].format("YYYY-MM-DD"),
            Collectionimg1: fileList[0] === undefined ? null : fileList[0].url,
            Collectionimg2: fileList[1] === undefined ? null : fileList[1].url,
            Collectionimg3: fileList[2] === undefined ? null : fileList[2].url
          };
          this.props.submit(value);
        } else {
          message.error('请选择图片');
        }
        
      }
    });
  }

  componentDidUpdate() {
    const { reset } = this.props;
    console.log(this.props);
    if (reset === true) {
      this.setState(
        {
          fileList: [],
          reset: false
        },
        () => {
          this.props.onReset();
        }
      );
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    const { previewVisible, previewImage, fileList } = this.state;

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
                rules: [{ required: true, message: "请输入文物名称" }]
              })(<Input placeholder="请输入文物名称" />)}
            </FormItem>
            <FormItem
              className="form-width50"
              label="入库类型:"
              labelCol={{ span: 8 }}
            >
              {getFieldDecorator("type", {
                initialValue: 1,
                rules: [{ required: true, message: "请选择入库类型" }]
              })(
                <Select>
                  {
                    putInCategory.map((item, idx) =>
                      <Option value={item.key} key={item.key} > { item.value } </Option>
                    )
                  }
                </Select>
              )}
            </FormItem>
            <FormItem
              className="form-width50"
              label="存储位置:"
              labelCol={{ span: 8 }}
            >
              {getFieldDecorator("localtion", {
                rules: [{ required: true, message: "请输入存储位置" }]
              })(<Input placeholder="请输入存储位置" />)}
            </FormItem>
            <FormItem
              className="form-width50"
              label="存台箱号:"
              labelCol={{ span: 8 }}
            >
              {getFieldDecorator("carton", {
                initialValue: 0,
                rules: [{ required: true, message: "请选择存台箱号" }]
              })(
                <Select>
                  <Option value={0}>存台箱号</Option>
                </Select>
              )}
            </FormItem>
            <FormItem
              className="form-width50"
              label="文物编号:"
              labelCol={{ span: 8 }}
            >
              {getFieldDecorator("relicsNum", {
                rules: [{ required: true, message: "请输入文物编号" }]
              })(<Input placeholder="请输入文物编号" />)}
            </FormItem>
            <FormItem
              className="form-width50"
              label="分级信息:"
              labelCol={{ span: 8 }}
            >
              {getFieldDecorator("levelInfo", {
                initialValue: 1,
                rules: [{ required: true, message: "请选择分级信息" }]
              })(
                <Select>
                  {
                    levelInfo.map((item, idx) =>
                      <Option value={item.key} key={item.key} >{ item.value }</Option>
                    )
                  }
                </Select>
              )}
            </FormItem>
            <FormItem
              className="form-width50"
              label="文物数量:"
              labelCol={{ span: 8 }}
            >
              {getFieldDecorator("number", {
                rules: [{ required: true, message: "请输入文物数量" }]
              })(<Input placeholder="请输入文物数量" />)}
            </FormItem>
            <FormItem
              className="form-width50"
              label="文物状态:"
              labelCol={{ span: 8 }}
            >
              {getFieldDecorator("relicsState", {
                initialValue: 1,
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
            </FormItem>
            <FormItem
              className="form-width50"
              label="入馆时间:"
              labelCol={{ span: 8 }}
            >
              {getFieldDecorator("date", {
                initialValue: moment(),
                rules: [{ required: true, message: "请选择入馆时间" }]
              })(<DatePicker format="YYYY-MM-DD" />)}
            </FormItem>
            <FormItem
              className="form-width50"
              label="年代:"
              labelCol={{ span: 8 }}
            >
              {getFieldDecorator("relicsYears", {
                initialValue: 1,
                rules: [{ required: true, message: "请输入文物年代" }]
              })(
                <Select>
                  {
                    relicsYears.map((item, idx) =>
                      <Option value={item.key} key={item.key} >{item.value}</Option>
                    )
                  }
                </Select>
              )}
            </FormItem>
            <FormItem
              className="form-width50"
              label="材质:"
              labelCol={{ span: 8 }}
            >
              {getFieldDecorator("material", {
                rules: [{ required: true, message: "请输入文物材质" }]
              })(<Input placeholder="请输入文物材质" />)}
            </FormItem>
            <FormItem
              className="form-width50"
              label="文物类别:"
              labelCol={{ span: 8 }}
            >
              {getFieldDecorator("category", {
                initialValue: 1,
                rules: [{ required: true, message: "请选择文物类别" }]
              })(
                <Select>
                  {
                    relicsCategory.map((item, idx) =>
                      <Option value={item.key} key={item.key}>{item.value}</Option>
                    )
                  }
                </Select>
              )}
            </FormItem>
            <FormItem
              className="form-width50"
              label="重量:"
              labelCol={{ span: 8 }}
            >
              {getFieldDecorator("weight", {
                rules: [{ required: true, message: "请输入文物重量" }]
              })(<Input placeholder="请输入文物重量" />)}
            </FormItem>
            <FormItem
              className="form-width50"
              label="完整程度:"
              labelCol={{ span: 8 }}
            >
              {getFieldDecorator("howComplete", {
                initialValue: 0,
                rules: [{ required: true, message: "请选择完整程度" }]
              })(
                <Select>
                  <Option value={0}>破损</Option>
                  <Option value={1}>完整</Option>
                </Select>
              )}
            </FormItem>
            <FormItem
              className="form-width50"
              label="尺寸:"
              labelCol={{ span: 8 }}
            >
              {getFieldDecorator("size", {
                rules: [{ required: true, meaage: "请输入文物尺寸" }]
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
const RelicsInfoDialog = Form.create()(RelicsInfoDialogApp);
export default RelicsInfoDialog;