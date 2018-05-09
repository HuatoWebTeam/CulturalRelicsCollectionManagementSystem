import React, { Component } from 'react';
import { Row, Col, Button, DatePicker } from 'antd';
import { DefaultPlayer as Video } from "react-html5video";
import "react-html5video/dist/styles.css";
import './index.less';
import moment from "moment";
import { VideoApi } from './api';
import { RangePickerDefault } from "../../assets/js/commonFun";
const { RangePicker } = DatePicker;


const sintelTrailer =
  "https://download.blender.org/durian/trailer/sintel_trailer-720p.mp4";
const bigBuckBunny =
  "http://download.blender.org/peach/bigbuckbunny_movies/big_buck_bunny_480p_h264.mov";

class ImageManagement extends Component {
  state = {
    videoDataList: [
      {
        ref: "video1",
        src: sintelTrailer,
        date: "2018-03-03 06:26:30"
      },
      {
        ref: "video2",
        src: bigBuckBunny,
        date: "2018-03-03 08:56:36 "
      }
    ],
    defaultDate: [],
    format: 'YYYY-MM-DD',
    videoThimbnail: []
  };

  componentWillMount() {
    const { format } = this.state;
    let date = [RangePickerDefault[0].format(format), RangePickerDefault[1].format(format)];
    this.setState({
      defaultDate: date
    }, () => {
      this.getVideoList();
    })
  }

  getVideoList() {
    const { defaultDate } = this.state;
    let params = {
      beginTime: defaultDate[0],
      endTime: defaultDate[1]
    };
    VideoApi(params).then(res => {
      console.log(res);
    })
  }

  componentDidMount() {
    // this.getVideoThumbnail();
  }

  getVideoThumbnail () {
    let video, output;
    let scale = 0.8;
    let videoList = Object.keys(this.refs);
    let videoThumb = [];
    for(let i = 0; i < videoList.length; i++) {
      console.log(this.refs[videoList[i]].videoEl);
      let singleVideo = this.refs[videoList[i]].videoEl;
      console.log(singleVideo.videoWidth)
      singleVideo.addEventListener('loadeddata', () => {
        let canvas = document.createElement('canvas');
        // canvas.width = singleVideo.videoWidth * scale;
        canvas.width = 200
        // canvas.height = singleVideo.videoHeight * scale;
        canvas.height = 100
        canvas.getContext('2d').drawImage(singleVideo, 0, 0, canvas.width, canvas.height);
        // console.log(canvas.toDataURL('iamge/png'));
        let imageUrl = canvas.toDataURL('iamge/png')
        videoThumb.push(imageUrl)
      })
      
    }
    this.setState({
      videoThimbnail: videoThumb
    })

  }

  rangePickerChange = (date) => {
    console.log(date);
  }

  // 禁止选择时间
  disabledDate = current => {
    return current && current > moment().endOf("day");
  };

  render() {
    const { videoDataList, videoThimbnail } = this.state;
    return (
      <Row className="image-management-container main-content">
        <Col span={24} style={{ paddingBottom: "20px" }}>
          <RangePicker
            onChange={this.rangePickerChange}
            defaultValue={RangePickerDefault}
            format="YYYY-MM-DD"
            disabledDate={this.disabledDate}
          />
          <Button type="primary" style={{ marginLeft: "20px" }}>
            搜索
          </Button>
        </Col>
        <Col span={24}>
          <Row gutter={16}>
            {videoDataList.map((item, idx) => (
              <Col span={6} key={idx}>
                <Col
                  span={24}
                  className={`${idx}`}
                  style={{
                    borderRadius: "5px",
                    overflow: "hidden",
                    border: "1px solid #ccc"
                  }}
                >
                  {/* <img crossOrigin="anonymous" src={videoThimbnail[idx]} key='thumbnail' /> */}
                  <Video
                    ref={item.ref}
                    preload="meta"
                    onLoad={(e) => { console.log('load') }}
                    onPlay={e => {
                      // console.log(e.target);
                      // console.log(this.refs);
                      // console.log(Object.keys(this.refs));
                      let refsArr = Object.keys(this.refs);
                      for (let i = 0; i < refsArr.length; i++) {
                        if (idx !== i) {
                          this.refs[refsArr[i]].videoEl.pause();
                        }
                      }
                      //   this.refs.video2.videoEl.pause();
                    }}
                  >
                    <source src={item.src} type="video/mp4" />
                  </Video>
                  <Col
                    span={24}
                    style={{
                      paddingLeft: "20px",
                      height: "40px",
                      lineHeight: "40px",
                      color: "#666e7b"
                    }}
                  >
                    {item.date}
                  </Col>
                </Col>
              </Col>
            ))}
          </Row>
          {/* <Video autoPlay ref="video1" onPlay={() => {
                  //   this.refs.video2.videoEl.pause();
                }}>
                <source src={sintelTrailer} type="video/mp4" />
                <track label="English" kind="subtitles" srcLang="en" src={vttEn} default />
                <track label="Español" kind="subtitles" srcLang="es" src={vttEs} />
              </Video> */}
        </Col>
      </Row>
    );
  }
}

export default ImageManagement;