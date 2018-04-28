import React, { Component } from 'react';
import { Row, Col, Radio, Button, message, Input, Collapse, Select } from 'antd';
import '../AssignPermissions/index.less';
import './index.less';
import { GetRoleData, GetProcessData, UpdateProcessData, GetProcessStepData } from "./api";
const RadioGroup = Radio.Group;
const Search = Input.Search;
const Panel = Collapse.Panel;
const Option = Select.Option;


class WorkflowConfig extends Component {
  state = {
    workflowList: [],
    allWorkList: [],
    checkWork: "",
    peopleCount: 1,
    peopleArray: [1],
    peopleList: [],
    selectCheckList: []
  };

  componentWillMount() {
    this.getRoleDataList();
  }

  getRoleDataList() {
    // 获取角色

    GetRoleData().then(res => {
      console.log(res);
      if (res.Data.length > 0) {
        this.setState({
          peopleList: res.Data,
          selectCheckList: [res.Data[0].RoleName]
        });
      } else {
        this.setState({ peopleList: [] });
      }
    });
    // 获取流程功能
    GetProcessData().then(res => {
      console.log(res);
      if (res.Data.length > 0) {
        this.setState({
          workflowList: res.Data,
          allWorkList: res.Data
        });
      } else {
        this.setState({
          workflowList: []
        });
      }
    });
  }
  // 单选框 事件
  RadioGroupChange = e => {
    console.log(e);
    let params ={
      parameters: {
        Condition: e.target.value
      }
    }
    GetProcessStepData(params).then(res => {
      console.log(res);
      let stepList = res.Data;
      
      if(stepList.length === 0) {  // 还未分配审核人
        this.setState({
          peopleCount: 1,
          peopleArray: [1],
          peopleList: [],
          selectCheckList: []
        }, () => {
        this.getRoleDataList()
      });
      } else { // 已经有的审核人
        let stepArr = []; // 对应peopleArray
        let checkSelect = []; // 对应 selectCheckList
        for (let item of stepList) {
          stepArr.push(Number(item.ProcessStepSequence));
          checkSelect.push(item.ApprovalPerson);
        }
        this.setState(
          {
            peopleCount: stepList.length,
            peopleArray: stepArr,
            selectCheckList: checkSelect
          }
        );
      }
    })
    this.setState({
      checkWork: e.target.value
    });
  };

  // select

  handleSelect = (idx, value) => {
    console.log(idx, value);
    const { selectCheckList } = this.state;
    selectCheckList[idx] = value;
    this.setState(
      {
        selectCheckList: selectCheckList
      },
      () => {
        console.log(this.state);
      }
    );
  };
  //添加审核人
  AddVerifier = () => {
    const { peopleCount, peopleArray, selectCheckList, peopleList } = this.state;
    let count = peopleCount;
    console.log(count);
    count = count+1;
    console.log(count)
    selectCheckList[count - 1] = peopleList[0].RoleName;
    this.setState(
      {
        peopleCount: count,
        peopleArray: [...peopleArray, count],
        selectCheckList: selectCheckList
      },
      () => {
        console.log(this.state);
      }
    );
  }
  // 移除审核人
  removeVerifier = (idx) => {
    console.log(idx);
    const { peopleCount, peopleArray, selectCheckList } = this.state;
    // console.log()
    let peopleNum = peopleArray;
    peopleNum.splice(peopleArray.length - 1, 1);
    let selectList = selectCheckList;
    selectList.splice(idx, 1);
    this.setState({
      peopleCount: peopleCount - 1,
      peopleArray: peopleNum,
      selectCheckList: selectList
    });
  }

  // 搜索按钮
  onSearchUserName = value => {
    const { allWorkList } = this.state;
    let arr = [];
    for (let item of allWorkList) {
      if (item.ProcessName.indexOf(value) >= 0) {
        arr.push(item);
      }
    }
    this.setState({
      workflowList: arr
    });
  };
  // 提交
  userAssignSubmit = () => {
    const { checkWork, allWorkList, selectCheckList } = this.state;
    if(checkWork === "") {
      message.error('请选择流程功能')
    } else {
      let processName = '';
      for(let item of allWorkList) {
        if(item.ProcessID === checkWork) {
          processName = item.ProcessName;
          break;
        }
      }
      let stepList = [];
      for(let i = 0; i < selectCheckList.length; i++) {
        stepList.push({
          ProcessStepSequence: i + 1,
          ApprovalPerson: selectCheckList[i]
        });
      }
      let params = {
        wfProcess:{
          ProcessID: checkWork,
          ProcessName: processName,
          ListProcessStep: stepList
        }
      };
      UpdateProcessData(params).then(res => {
        console.log(res);
        if(res.Msg === "操作成功!") {
          message.success('提交成功');
          this.setState({
            allWorkList: [],
            checkWork: "",
            peopleCount: 1,
            peopleArray: [1],
            peopleList: [],
            selectCheckList: []
          },() => {
            this.getRoleDataList()
          });
          
        } else {
          message.error('提交失败')
        }
      })
    }
  };
  render() {
    const {
      workflowList,
      checkWork,
      peopleArray,
      peopleList,
      selectCheckList
    } = this.state;
    console.log(peopleList);
    return <Row className="main-content workflow-container">
        <Col className="title" span={24}>
          流程配置
        </Col>
        <Col span={5} className="gutter-row assign-content " style={{ paddingRight: "20px" }}>
          <Col span={24} className="assign-title">
            <Col span={24} className="assign-contents">
              <Col span={24} style={{ padding: "0 20px 20px " }}>
                <Search placeholder="请输入功能名称" enterButton onSearch={this.onSearchUserName} />
              </Col>
              <Col span={24}>
                <Collapse defaultActiveKey={["1"]}>
                  <Panel header="流程功能" key="1" style={{ borderRadius: "0" }}>
                    <RadioGroup onChange={this.RadioGroupChange} value={checkWork}>
                      {workflowList.map(item => (
                        <Radio value={item.ProcessID} key={item.ProcessID}>
                          {item.ProcessName}
                        </Radio>
                      ))}
                    </RadioGroup>
                  </Panel>
                </Collapse>
              </Col>
            </Col>
          </Col>
        </Col>
        <Col span={19} className="gutter-row-right ">
          <Col span={24} className="container">
            <Col span={24} className="assign-title">
              选择审核人
            </Col>
            <Col span={24} className="now-workflow">
              当前流程： {workflowList.map(item => item.ProcessID === checkWork && <span
                      key={item}
                    >
                      {item.ProcessName}
                    </span>)}
            </Col>
            <Col span={24} className="assign-contents">
              <Button type="primary" icon="plus" onClick={this.AddVerifier}>
                添加审核人
              </Button>
            </Col>
            <Col span={24}>
              {peopleArray.map((item, idx) => (
                <Col
                  span={24}
                  key={item}
                  style={{ padding: "20px", paddingTop: "0" }}
                >
                  <span>审核人{idx + 1} : </span>
                  <Select
                    style={{ width: "150px" }}
                    value={selectCheckList[idx]}
                    onSelect={this.handleSelect.bind(this, idx)}
                  >
                    {peopleList.map(value => (
                      <Option value={value.RoleName} key={value.RoleId}>
                        {value.RoleName}
                      </Option>
                    ))}
                  </Select>
                  <Button style={{marginLeft: '20px'}} type="primary" onClick={this.removeVerifier.bind(this, idx)}>
                    移除审核人
                  </Button>
                </Col>
              ))}
            </Col>
          </Col>
          <Col span={24} style={{ textAlign: "right", paddingRight: "40px", paddingTop: "20px" }}>
            <Button type="primary" onClick={this.userAssignSubmit}>
              提交
            </Button>
          </Col>
        </Col>
      </Row>;
  }
}

export default WorkflowConfig;