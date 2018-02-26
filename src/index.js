import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Main from './Main';
import { Provider } from "react-redux";
import store from "./Redux";
import registerServiceWorker from './registerServiceWorker';
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
// import 'moment/local/zh-cn';

ReactDOM.render(
  <Provider store={store} >
    <LocaleProvider locale={zh_CN}>
      <Main />
    </LocaleProvider>
    
  </Provider>,
  document.getElementById("root")
);
registerServiceWorker();
