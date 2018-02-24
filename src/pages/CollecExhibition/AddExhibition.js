import React, { Component } from 'react';

import { Row, Col } from 'antd';
import './index.less';

class AddExhibition extends Component {
    state = {  }
    render() {
        return <Row className="exhibition-container main-content">
            <Col className="title" span={24}>
              添加展览清单
            </Col>
            <Col span={24} className="exhibition-content" style={{ marginTop: "20px" }}>
              {/* <Table bordered columns={relicDetails} dataSource={this.dataSoure} /> */}
            </Col>
          </Row>;
    }
}

export default AddExhibition;