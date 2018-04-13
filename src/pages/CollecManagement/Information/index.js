import React, { Component } from 'react';

import { Row, Col, Button, Input, Table, Modal } from 'antd';
import { GetCollectionData } from './api';
import { levelInfo, relicsYears, relicsCategory, howComplete } from "../../../assets/js/commonFun";
import RelicsInfoDialog from './component';
import { connect } from 'react-redux';
const Search = Input.Search;

class ComplexGeneric extends Component {
    state = {  
        relicsInfoData: [],
        pageIndex: 1,
        pageSize: 10,
        total: 0,
        condition: ''
    }

    componentWillMount() {
        this.setState({
            pageIndex: this.props.pageIndex
        }, () => {
            this.getColletionList();
        })
        
    }
    // 获取数据
    getColletionList () {
        const { pageIndex, pageSize, condition } = this.state;
        let params = {
            PageIndex: pageIndex,
            PageSize: pageSize,
            Condition: condition
        };
        GetCollectionData(params).then(res => {
            console.log(res);
            let data = [];
            for(let item of res.Data) {
                data.push({
                  relicsNum: item.CollectionNumber,
                  relicsImg1: item.Collectionimg1,
                  relicsImg2: item.Collectionimg2,
                  relicsImg3: item.Collectionimg3,
                  relicsName: item.CollectionName,
                  libraryTime: item.CollectionTime,
                  number: item.Number,
                  levelInfo: item.Grade,
                  material: item.MaterialQuality,
                  years: item.CollectionYears,
                  howComplete: item.Integrity,
                  state: item.CollectionState,
                  category: item.Category,
                  size: item.Size,
                  weight: item.Weight,
                  key: item.CollectionNumber,
                  localtion: null
                });
            }
            this.setState({
                relicsInfoData: data,
                total: res.Total
            })
        })
    }
    // 点击搜索
    onSearchButton =  (value) => {
        console.log(value);
        this.setState({
            condition: value,
            pageIndex: 1
        }, () => {
            this.getColletionList();
        })

    }
    // 分页改变
    paginationChange = (page) => {
        this.setState({
            pageIndex: page
        }, () => {
            this.getColletionList();
            this.props.changePageIndex(page);
        })
    }
    render() {
        const { relicsInfoData, pageIndex, pageSize, total } = this.state;
        const relicInfoColumns = [
            {
                title: '文物编号',
                dataIndex: 'relicsNum',
                key: 'relicsNum'
            },
            {
                title: '文物图片',
                dataIndex: 'relicsImg1',
                key: 'relicsImg1',
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
                title: '文物名称',
                dataIndex: 'relicsName',
                key: 'relicsName'
            },
            {
                title: '入馆时间',
                dataIndex: 'libraryTime',
                key: 'libraryTime'
            },
            {
                title: '数量',
                dataIndex: 'number',
                key: 'number'
            },
            {
                title: '分级信息',
                dataIndex: 'levelInfo',
                key: 'levelInfo',
                render:(text) => {
                    for(let item of levelInfo) {
                        if(Number(text) === item.key) {
                            return (<span>{item.value}</span>)
                        }
                    }
                }
            },
            {
                title: '材质',
                dataIndex: 'material',
                key: 'material'
            },
            {
                title: '年代',
                dataIndex: 'years',
                key: 'years',
                render:(text) => {
                    for(let item of relicsYears) {
                        if(Number(text) === item.key) {
                            return (<span>{item.value}</span>)
                        }
                    }
                }
            },
            {
                title: '完整程度',
                dataIndex: 'howComplete',
                key: 'howComplete',
                render: (text) => {
                    for(let item of howComplete) {
                        if(Number(text) === item.key) {
                            return (<span>{item.value}</span>)
                        }
                    }
                }
            },
            {
                title: '文物状态',
                dataIndex: 'state',
                key: 'state',
                render: (text) => {
                    return (
                        <span
                            style={{
                                color: Number(text) === 3 ? 'red' : '#666'
                            }}
                        >{ Number(text) === 0 ? '新增入库' : (Number(text) === 1 ? '新增出库' : (Number(text) === 2 ? '在库' : '异常')) }</span>
                    )
                }
            },
            {
                title: '类别',
                dataIndex: 'category',
                key: 'category',
                render:(text) => {
                    for(let item of relicsCategory) {
                        if(Number(text) === item.key) {
                            return (<span>{item.value}</span>)
                        }
                    }
                }
            },
            {
                title: '尺寸',
                dataIndex: 'size',
                key: 'size'
            },
            {
                title: '重量',
                dataIndex: 'weight',
                key: 'weight'
            },
            {
                title: '编辑',
                dataIndex: '',
                key: 'operation',
                render: (text, record) => {
                    return (
                        <Button type='primary' onClick={
                            () => {
                                this.props.changeFormData({state: '编辑藏品', formData: record});
                                this.props.history.push('/App/AddRelics');
                            }
                        } >编辑</Button>
                    )
                }
            }
        ]

        return <Row className="main-content">
            <Col className="title" span={24}>
              藏品信息列表
            </Col>
            <Col span={24} className="info-content" style={{ padding: "20px 40px 20px 20px" }}>
              <Col span={24} style={{paddingBottom: '20px'}} >
                <Button type="primary" icon="plus" onClick={() => {
                    this.props.changeFormData({state: '新增藏品', formData:{}})
                    this.props.history.push("/App/AddRelics");
                  }}>
                  新增藏品
                </Button>
                <Search enterButton placeholder="请输入文物名称" onSearch={this.onSearchButton} style={{ width: "260px", float: "right" }} />
              </Col>
              <Col span={24}>
                <Table pagination={{ current: pageIndex, pageSize: pageSize, total: total, onChange: this.paginationChange }} columns={relicInfoColumns} dataSource={relicsInfoData} bordered />
              </Col>
            </Col>
          </Row>;
    }
}
// COLLECINFO
const mapStateToProps = (state, ownProps) => {
  return {
    pageIndex: state.main.collecInfoPage
  }
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    changeFormData: args => dispatch({ type: "COLLECINFO", payload: args }),
    changePageIndex: args => dispatch({ type: 'COLLECINFOPAGE', payload: args })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ComplexGeneric);