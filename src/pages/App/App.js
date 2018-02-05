import React, { Component } from 'react';
import { Layout } from "antd";
import Routes from '../../Router';
import MenuItem from './MenuItem';
import { menus } from './menus'
import './App.less'
const { Header, Content, Footer, Sider } = Layout;


class App extends Component {

  rootSubmenuKeys = [];
  state = {
    selectOpenKey: "",
    menuMode: "inline",
    openKeys: []
  };
  componentWillMount () {
    for(let item of menus ) {
      if(item.sub) {
        this.rootSubmenuKeys.push(item.key);
      }
    }
    console.log(this.rootSubmenuKeys)
  }
  componentDidMount() {
    console.log(this.props);
    this.setMenuOpenKey(this.props);
    // window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    console.log("卸载");
  }
  //
  setMenuOpenKey = props => {
    let { pathname } = props.location;
    console.log(pathname);
    if (pathname === "/") {
      pathname = "/App/Home";
    }

    this.setState({ selectOpenKey: pathname });
  };
  openMenu = v => {
    console.log(v);
  };
  menuClick = (item, key, selectdKeys) => {
    // console.log(item, key, selectdKeys);
    this.setState({ selectOpenKey: item.key });
  };
  onOpenChange = openKeys => {
    // console.log(openKeys);
    const latestOpenKey = openKeys.find(
      key => this.state.openKeys.indexOf(key) === -1
    );
    // console.log(latestOpenKey);
    if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.setState({ openKeys });
    } else {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : []
      });
    }
  };
  render() {
    console.log(this.props);
    return (
      <Layout style={{ minHeight: "100%" }}>
        <Header>Header</Header>
        <Layout>
          <Sider>
            <MenuItem
              menus={menus}
              theme="dark"
              mode={this.state.menuMode}
              selectedKeys={[this.state.selectOpenKey]}
              openKeys={this.state.openKeys}
              onClick={this.menuClick}
              onOpenChange={this.onOpenChange}
            />
          </Sider>
          <Content>
            <Routes />
          </Content>
        </Layout>
        <Footer>Footer</Footer>
      </Layout>
    );
  }
}

export default App;