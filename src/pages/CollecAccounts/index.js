import React, { Component } from 'react';
import { Row, Col, DatePicker, Button } from 'antd';
import './index.less';
import moment from 'moment';
import { subStr } from '../../assets/js/commonFun'
import { AccountAll } from './api';
// 引入主模块
import echarts from 'echarts';
// 引入折线图
import 'echarts/lib/chart/line';
// 引入饼图
import 'echarts/lib/chart/pie';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
const { RangePicker } = DatePicker;

class CollecAccounts extends Component {
  state = {
    accountData: [],
    date: [],
    dateFormat: 'YYYY-MM-DD'
  };
  //
  componentWillMount() {
    const { dateFormat } = this.state;
    let startDate = moment()
      .subtract(6, "days").hour(0).minute(0).second(0).format();
    let endDate = moment().hour(23).minute(59).second(59).format();
    // console.log();
    this.setState(
      {
        date: [startDate, endDate]
      },
      () => {
        this.getAccountsData();
      }
    );
  }

  getAccountsData() {
    const { date } = this.state;
    let params = {
      beginTime: date[0],
      endTime: date[1]
    };
    console.log(params);
    AccountAll(params).then(res => {
      console.log(res);
      let pieData = [
        { name: '征集费用', value: res.ExCount },
        { name: '外展费用', value: res.InCount },
      ];

      let lineChart = [];
      let chartsDate = [];

      let chartsData = res.account;

      //日期
      for (let item of chartsData) {
        chartsDate.push(subStr(item.Time));
      }
      // 
      for (let n = 0; n < 2; n++) {
        lineChart.splice(n, 1, {
          name: n === 0 ? '征集' : '外展',
          type: 'line',
          data: []
        });
        console.log(lineChart);
        for (let i = 0; i < chartsData.length; i++) {
          if (n === 0) {
            lineChart[n].data.push(chartsData[i].Expenditures); 
          } else if (n === 1) {
            lineChart[n].data.push(chartsData[i].Incomes);
          } 
        }
      }
      this.setState({
        pieChartsData: pieData,
        chartsDate: chartsDate,
        data: lineChart,
      }, () => {
        this.setChartsOption();
      });

    });
  }

  setChartsOption() {
    let lineChart = echarts.init(document.getElementById("lineCharts"));
    lineChart.setOption(this.getLineChartOption());
    let pieChart = echarts.init(document.getElementById("pieCharts"));
    pieChart.setOption(this.getPieChartOption());
  }

  getLineChartOption = () => {
    const { chartsDate } = this.state;
    console.log(chartsDate)
    const option = {
      title: {
        text: ""
      },
      tooltip: {
        trigger: "axis"
      },
      legend: {
        data: [ "征集", '外展']
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true
      },
      toolbox: {
        show: false,
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: chartsDate,
        axisLabel: {
          formatter: function (value) {
            // console.log(value)
            var str_before = value.split(' ')[0];
            // var str_after = value.split(' ')[1];
            return str_before;

          }
        }
      },
      yAxis: {
        type: "value",
        name: "数量(件)"
      },
      color: ["#3065bf", "#fabe55", "#ff875c"],
      series: this.state.data
    };

    return option;
  };

  getPieChartOption = () => {
    const { pieChartsData } = this.state;
    return {
      title: {
        text: '',
        subtext: '',
        x: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: {
        orient: 'horizontal',
        bottom: '0',
        data: [ '征集费用', '外展费用']
      },
      color: ["#3065bf", "#fabe55", "#ff875c"],
      series: [
        {
          name: '',
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: pieChartsData,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
  }

  
 
  // 禁止选择时间
  disabledDate = current => {
    return current && current > moment().endOf("day");
  };

  // 点击搜索
  searchAccounts = () => {
    this.getAccountsData();
  }
  handleDatepicker = (date, dateString) => {
    console.log(dateString);
    this.setState({
      date: [
        date[0].hour(0).minute(0).second(0).format(),
        date[1].hour(23).minute(59).second(59).format()
      ]
    });
    // this.setState({
    //   date: [dateString[0], dateString[1]]
    // })
  };
  render() {
    const { pieChartsData } = this.state;

    return (
      <Row className="main-content">
        <Col span={24} className="title">
          藏品账目列表
        </Col>
        <Col
          span={24}
          className="accounts-container"
          style={{ padding: "20px 40px 20px 20px" }}
        >
          <Col span={24} className="search-container">
            <RangePicker
              defaultValue={[moment().subtract(6, "days"), moment()]}
              format="YYYY-MM-DD"
              onChange={this.handleDatepicker}
              disabledDate={this.disabledDate}
            />
            <Button type="primary" onClick={this.searchAccounts} >搜索</Button>
          </Col>
          <Col span={24}>
            <Col span={24}>
              <Col span={16} style={{ textAlign: "center", paddingTop: '40px' }}>
                <div id='lineCharts' style={{ width: "100%", height: "360px" }}  ></div>
                <Col
                  span={24}
                  style={{
                    height: "30px",
                    lineHeight: "30px",
                    background: "#e8eef8"
                  }}
                >
                {
                    pieChartsData && <Col span={24} >
                      <Col span={12}>征集账目： {pieChartsData[0].value} 元</Col>
                      <Col span={12}>外展账目： {pieChartsData[1].value} 元</Col>
                    </Col>
                }
                  
                </Col>
              </Col>
              <Col span={8} style={{ padding: "40px 20px 0 20px" }}>
                <Col span={24} style={{ height: "390px", background: "#e8eef8" }}>
                  <div id='pieCharts' style={{ width: '100%', height: '350px' }} />
                  {/* <ReactEcharts style={{ width: "100%", height: "350px" }} option={this.getPieChartOption()} /> */}
                </Col>
              </Col>
            </Col>
          </Col>
        </Col>
      </Row>
    );
  }
}

export default CollecAccounts;