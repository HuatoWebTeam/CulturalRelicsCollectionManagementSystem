import React, { Component } from 'react';
import { Row, Col, Button, DatePicker } from 'antd';
import './index.less';
// 引入主模块
import echarts from 'echarts';
// 引入折线图
import 'echarts/lib/chart/line';
// 引入饼图
import 'echarts/lib/chart/pie';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';

import ReactEcharts from 'echarts-for-react';
import { RangePickerDefault, subStr } from '../../assets/js/commonFun';
import { GetStatisticalAnalysisData } from './api';
const { RangePicker } = DatePicker;



class Statisical extends Component {
  state = {
    data: [],
    pieChartData:[],
    date: RangePickerDefault,
    chartsDate: [],
    pieChartsData: [],
    chartLineWidth: 2,
    format: 'YYYY-MM-DD',
    allData: {}
  };

  componentWillMount() {
    console.log(this.state);
    const { date, format } = this.state;
    console.log(date[0].format(format));
    this.setState({
      date: [date[0].format(format), date[1].format(format)]
    }, () => {
        this.getChartsData();
    })
  }


  setChartsOption() {
    let lineChart = echarts.init(document.getElementById("lineCharts"));
    lineChart.setOption(this.getLineChartOption());
    let pieChart = echarts.init(document.getElementById("pieCharts"));
    pieChart.setOption(this.getPieChartOption());
  }

  getChartsData () {
    const { date } =this.state; 
    let params = {
        StaDate: date[0],
        EndDate: date[1]
      }
      GetStatisticalAnalysisData(params).then(res => {
        console.log(res);
        let pieData = [
          { name: '入库', value: res.Data.StorageNumber },
          { name: '出库', value: res.Data.OutNumber },
          { name: '征集', value: res.Data.CallNumber }
        ];
        let lineChart = [];
        let chartsDate = [];
        
        let chartsData = res.Data.ListIntermediateTable;
        for(let item of chartsData) {
          chartsDate.push(subStr(item.DateTime));
        }
        for(let n = 0; n < 3; n++) {
          lineChart.splice(n, 1, {
            name: n === 0 ? '入库' : (n === 1 ? '出库' : '征集'),
            type: 'line',
            data: []
          });
          console.log(lineChart);
          for (let i = 0; i < chartsData.length; i++) {
            if(n === 0) {
              lineChart[n].data.push(chartsData[i].StorageNumber);
            } else if(n === 1) {
              lineChart[n].data.push(chartsData[i].OutNumber);
            } else {
              lineChart[n].data.push(chartsData[i].CallNumber);
            }
          } 
        }
        this.setState({
          pieChartsData: pieData,
          chartsDate: chartsDate,
          data: lineChart,
          allData: {
            StorageNumber: res.Data.StorageNumber,
            OutNumber: res.Data.OutNumber,
            CallNumber: res.Data.CallNumber
          }
        }, () =>{
          this.setChartsOption();
        });
        

      })
  }

  getLineChartOption = () => {
    const { chartsDate, data } = this.state;
    console.log(chartsDate)
    const option = {
      title: {
        text: ""
      },
      tooltip: {
        trigger: "axis"
      },
      legend: {
        data: ["入库", "出库", "征集"]
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
          formatter: function(value) {
            // console.log(value)
            var str_before = value.split(' ')[0];
            var str_after = value.split(' ')[1];
            return  str_before;
            
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
    return  {
    title : {
        text: '',
        subtext: '',
        x:'center'
    },
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient: 'horizontal',
        bottom: '0',
        data: ['入库','出库','征集']
    },
    color: ["#3065bf", "#fabe55", "#ff875c"],
    series : [
        {
            name: '',
            type: 'pie',
            radius : '55%',
            center: ['50%', '60%'],
            data:pieChartsData,
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

  render() {
    const { allData } = this.state;

    return <Row className="main-content">
        <Col span={24} className="title">
          统计分析图表
        </Col>
        <Col span={24} className="statisical-container">
          <Col span={24} style={{ paddingBottom: "20px" }}>
            <RangePicker defaultValue={RangePickerDefault} format="YYYY-MM-DD" />
            <Button type="primary" style={{ marginLeft: "20px" }}>
              查询
            </Button>
          </Col>
          <Col span={24}>
            <Col span={16} style={{ textAlign: "center" }}>
              <div id='lineCharts' style={{ width: "100%", height: "400px" }}  ></div>
              {/* <ReactEcharts style={{ width: "100%", height: "400px" }} option={this.getLineChartOption()} /> */}
              <Col span={24} style={{ height: "30px", lineHeight: "30px", background: "#e8eef8" }}>
                <Col span={8}>入库总数： {allData.StorageNumber}件</Col>
                <Col span={8}>出库总数： {allData.OutNumber}件</Col>
                <Col span={8}>征集总数： {allData.CallNumber}件</Col>
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
      </Row>;
  }
}

export default Statisical;