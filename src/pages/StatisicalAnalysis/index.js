import React, { Component } from 'react';
import { Row, Col, Button, DatePicker } from 'antd';
import './index.less';
import ReactEcharts from 'echarts-for-react';
const { RangePicker } = DatePicker;



class Statisical extends Component {
  state = {
    data: [
      {
        name: "入库",
        type: "line",
        stack: "总量",
        data: [120, 132, 101, 134, 90, 230, 210]
      },
      {
        name: "出库",
        type: "line",
        stack: "总量",
        data: [220, 182, 191, 234, 290, 330, 310]
      },
      {
        name: "征集",
        type: "line",
        stack: "总量",
        data: [150, 232, 201, 154, 190, 330, 410]
      }
    ],
    chartLineWidth: 2
  };

  getLineChartOption = () => {
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
        data: [
          "2017-10-12",
          "2017-10-13",
          "2017-10-14",
          "2017-10-15",
          "2017-10-16",
          "2017-10-17",
          "2017-10-18"
        ]
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
            name: '入库',
            type: 'pie',
            radius : '55%',
            center: ['50%', '60%'],
            data:[
                {value:335, name:'入库'},
                {value:310, name:'出库'},
                {value:234, name:'征集'},
            ],
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
    const { data, chartLineWidth } = this.state;

    return <Row className="main-content">
        <Col span={24} className="title">
          统计分析图表
        </Col>
        <Col span={24} className="statisical-container">
          <Col span={24} style={{ paddingBottom: "20px" }}>
            <RangePicker />
            <Button type="primary" style={{ marginLeft: "20px" }}>
              查询
            </Button>
          </Col>
          <Col span={24}>
            <Col span={16} style={{ textAlign: "center" }}>
              <ReactEcharts style={{ width: "100%", height: "400px" }} option={this.getLineChartOption()} />
              <Col span={24} style={{ height: "30px", lineHeight: "30px", background: "#e8eef8" }}>
                <Col span={8}>入库总数： 4568件</Col>
                <Col span={8}>入库总数： 4568件</Col>
                <Col span={8}>入库总数： 4568件</Col>
              </Col>
            </Col>
            <Col span={8} style={{ padding: "40px 20px 0 20px" }}>
              <Col span={24} style={{ height: "390px", background: "#e8eef8" }}>
                <ReactEcharts style={{ width: "100%", height: "350px" }} option={this.getPieChartOption()} />
              </Col>
            </Col>
          </Col>
        </Col>
      </Row>;
  }
}

export default Statisical;