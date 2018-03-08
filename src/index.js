import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Main from './Main';
import { Provider } from "react-redux";
import store from "./Redux";
import registerServiceWorker from './registerServiceWorker';
import { LocaleProvider } from 'antd';
import zhCN from "antd/lib/locale-provider/zh_CN";
import './axios/index';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

ReactDOM.render(
  <Provider store={store} >
    <LocaleProvider locale={zhCN}>
      <Main />
    </LocaleProvider>
    
  </Provider>,
  document.getElementById("root")
);
registerServiceWorker();
