import React, { Component } from 'react';
import { Row, Col, Table, Form, Button,Input, Modal, message } from 'antd';
import './index.less';
import { connect } from 'react-redux';
import { Repairmetrial,  Addmetrial, Delatemetrial } from "./api";

const FormItem = Form.Item;
const { Search } = Input;
const { TextArea } = Input;
const confirm = Modal.confirm;
class RepairMaterials extends Component{

    state ={
        materiallist:[],
        visible: false,
        Material_Id:"",
        materialName:"",
        modalTitle: "新增修复材料",
        describle:"",
        name:"",
        pageIndex: 1,
        pageSize: 10,
        total:0,
        isAdd:false,
    };
    

    componentWillMount() {
        this.getmaterialList();
    };
    
    
    // 请求材料列表
    getmaterialList=()=>{
        const {pageIndex, pageSize,name}=this.state
        let params={
            pageIndex:pageIndex,
            pageSize:pageSize,
            Name:name,
        }
        Repairmetrial(params).then(res=>{
            console.log(res)
            if(res.length>0){
                for(let item of res){
                    item.key = item.Material_Id
                }
                this.setState({
                    materiallist:res,
                    total:res[0].cou,
                })
            }else{
                this.setState({
                    meteriallist:[],
                    total:0
                })
            }
        })
    };

    // 编辑材料
    editorMaterial=record =>{
        this.props.form.resetFields();
        console.log(record);
        this.setState({
            visible:true,
            modalTitle:"编辑材料",
            materialNameValue:record.Material_Name,
            materialpurposeValue:record.Material_Purpose,
            materialattributeValue:record.Material_Attribute,
            materialidValue:record.Material_Id,
            isAdd:false,
        })
    }

    // 搜索框
    searchData = value =>{
        console.log(value)
        this.setState({
            pageIndex:1,
            name:value
        },
        ()=>{
            this.getmaterialList();
            console.log(value)
        }
        )
    }

    // 删除材料
    showConfirm = text =>{
        let _this=this
        console.log(text)
        confirm({
            title:"确定删除？",
            content:"",
            onOk(){
                console.log(text)
                let params={
                    Id:text
                };
                Delatemetrial(params).then(res=>{
                    console.log(res);
                    if(res==="True"){
                        message.success("删除成功");
                        _this.getmaterialList();
                    }else{
                        message.error("删除失败")
                    }
                })
        
            },
            onCancel(){
                console.log('cancle')
            }
        })
    }
    
    // 分页改变
    pageationChange = page => {
        console.log(page)
        this.setState(
          {
            pageIndex: page,
          },
          () => {
            this.getmaterialList();
            // this.props.changePageIndex(page);
          }
        );
    };

    // 新增材料
    Addmaterial=()=>{
        this.props.form.resetFields();
        this.setState({
            isAdd: true,
            modalTitle:"新增修复材料",
            materialNameValue: "",
            materialpurposeValue: "",
            materialattributeValue:"",
            visible:true,
    });
    };
    

    handleOK=(e)=>{
        console.log(e);
        const {
            isAdd,
            materialNameValue,
            materialpurposeValue,
            materialattributeValue,
            materialidValue,
            Key,
        }=this.state;
        this.props.form.validateFields((err,fieldsValue)=>{
            if(!err){
                console.log('--------------')
                console.log(isAdd)
                if(!isAdd){
                    let params ={
                        Material_Name: materialNameValue,
                        Material_Attribute: materialattributeValue,
                        Material_Purpose:materialpurposeValue,
                        Material_Id:materialidValue,
                        Key:1
                    };
                    Addmetrial(params).then(res=>{
                        console.log(res);
                        if(res ==="材料编辑成功"){
                            message.success("编辑成功");
                            this.getmaterialList();
                            this.setState({visible:false});
                        }else{
                            message.error("编辑失败")
                        }
                    });
                }else{
                    let params ={
                        Material_Name: materialNameValue,
                        Material_Attribute: materialattributeValue,
                        Material_Purpose:materialpurposeValue,
                        Key:0
                    };
                    Addmetrial(params).then(res=>{
                        console.log(res);
                        if(res ==="材料新增成功"){
                            message.success("新增成功");
                            this.getmaterialList();
                            this.setState({visible:false})
                        }else if(res=="当前材料已存在") {
                            message.error("当前材料已存在")
                        }else{
                            message.error("新增失败")
                        }
                    })
                }
            }
        })
    }

    handleCancel=(e)=>{
        console.log(e);
        this.setState({
            visible:false
        })
    }
    render(){
        const {
            materiallist,
            pageIndex,
            pageSize, 
            total,
            isAdd,
            modalTitle,
            materialNameValue,
            materialpurposeValue,
            materialattributeValue
        }=this.state;
        const { getFieldDecorator } = this.props.form;
        const columns=[
            {
                title:"材料名称",
                dataIndex:"Material_Name",
                key:"Material_Name"
            },
            {
                title:"材料属性",
                dataIndex:"Material_Attribute",
                key:"Material_Attribute"
            },
            {
                title:"材料用途",
                dataIndex:"Material_Purpose",
                key:"Material_Purpose"
            },
            {
                title:"操作",
                dataIndex:"",
                key:"operation",
                render:(text,record)=>{
                    return(
                        <span><Button onClick={event=>{
                            console.log('thank')
                            this.editorMaterial(record);
                        }}>编辑</Button>
                        <Button
                            // disabled={!text.disabled}
                            type="button"
                            style={{ border: "none", marginLeft: "10px" }}
                            onClick={this.showConfirm.bind(this,record.Material_Id)}
                        >
                            删除
                        </Button>
                        </span>
                    )
                }
            }
        ];
        return (
            <Row className="main-content">
                <Col span={24} className="title">修复材料列表</Col>
                <Col className="meterial-list-content"
                     span={24}
                     style={{padding:"20px 40px 20px 20px"}}   
                >
                    <Col span={24} className="" style={{marginBottom:"20px"}}>
                        <Col span={4}>
                            <Button type="primary"
                                    icon="plus"
                                    onClick={this.Addmaterial 
                                    }>
                                    新增修复材料
                            </Button>
                        </Col>
                        <Col span={16}></Col>
                        <Col span={4}>
                        <Form>
                            <Form.Item>
                                <Search 
                                placeholder="请输入材料名称"
                                enterButton
                                onSearch={this.searchData}
                                />
                            </Form.Item>
                        </Form>
                        </Col>
                    </Col>
                    <Col span={24}>
                        <Table
                            pagination={{
                            current: pageIndex,
                            pageSize:10,
                            total: total,
                            onChange: this.pageationChange
                            }}
                            dataSource={ materiallist}
                            columns={columns}
                            bordered
                        />
                    </Col>
                    <Col span={24}>
                        <Modal title="Basic Modal"
                            className="material-modal"
                            title={modalTitle}
                            visible={this.state.visible}
                            onOk={this.handleOK}
                            onCancel={this.handleCancel}
                        >
                        <Form >
                            <FormItem labelCol={{span:4}}
                                      wrapperCol={{span:16}}
                                      label="材料名称:"  
                            >
                            {getFieldDecorator("materialName",{
                                initialValue: isAdd ? "" :materialNameValue,
                                rules:[{required:true, message:"请输入材料名称"}]
                            })(
                                <Input 
                                onChange={value =>{
                                    this.setState({
                                        materialNameValue:value.target.value
                                    });
                                }}/>
                            )
                            }</FormItem>
                            <FormItem labelCol={{span:4}}
                                    wrapperCol={{span:16}}
                                    label="材料用途:">
                                {getFieldDecorator("materialpurpose",{
                                    initialValue:isAdd? "" :materialpurposeValue,
                                    rules:[{required:true, message:"请输入材料用途"}]
                                })(
                                    <Input 
                                    onChange={value=>{
                                        this.setState({
                                            materialpurposeValue:value.target.value
                                        });
                                    }}
                                    />
                                )}
                            </FormItem>
                            <FormItem labelCol={{span:4}}
                                    wrapperCol={{span:16}}
                                    label="材料属性:">
                                {getFieldDecorator("materialattribute",{
                                    initialValue:isAdd? "" :materialattributeValue,
                                    rules:[{required:true, message:"请输入材料属性"}]
                                })(
                                    <TextArea 
                                    onChange={value=>
                                        this.setState({
                                            materialattributeValue:value.target.value
                                        })
                                    }
                                    />
                                )}
                            </FormItem>
                        </Form>
                        </Modal>
                    </Col>
                </Col>

            </Row>
        );
    }
}


const RepairMaterialss = Form.create()(RepairMaterials);
export default RepairMaterialss;