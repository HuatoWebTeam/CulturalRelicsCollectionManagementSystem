import React, { Component } from 'react';
import { Row, Col, Button, DatePicker } from 'antd';
import { DefaultPlayer as Video } from "react-html5video";
import "react-html5video/dist/styles.css";
import './index.less';
const { RangePicker } = DatePicker;


const sintelTrailer =
  "https://download.blender.org/durian/trailer/sintel_trailer-720p.mp4";
const bigBuckBunny =
  "http://download.blender.org/peach/bigbuckbunny_movies/big_buck_bunny_480p_h264.mov";

class ImageManagement extends Component {
    state = {  
        videoDataList: [
            {
                ref: 'video1',
                src: sintelTrailer,
                date: '2018-03-03 06:26:30'
            },
            {
                ref: 'video2',
                src: bigBuckBunny,
                date: '2018-03-03 08:56:36 '
            }
        ]
    }
    render() {
        const { videoDataList } = this.state;
        return <Row className="image-management-container main-content">
            <Col span={24} style={{ paddingBottom: "20px" }}>
              <RangePicker />
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
                      style={{
                        borderRadius: "5px",
                        overflow: "hidden",
                        border: '1px solid #ccc'
                      }}
                    >
                      <Video
                        ref={item.ref}
                        onPlay={(e) => {
                          // console.log(e.target);
                          // console.log(this.refs);
                          // console.log(Object.keys(this.refs));
                          let refsArr = Object.keys(this.refs);
                          for(let i = 0; i < refsArr.length; i++) {
                            if(idx !== i) {
                              this.refs[refsArr[i]].videoEl.pause();
                            }
                          }
                          //   this.refs.video2.videoEl.pause();
                        }}
                      >
                        <source src={item.src} type="video/mp4" />
                      </Video>
                      <Col span={24} style={{ paddingLeft: '20px', height: '40px', lineHeight: '40px', color: '#666e7b'}} >
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
          </Row>;
    }
}

export default ImageManagement;