import React, { Component } from 'react';
import { Layout, Menu, Dropdown, Col } from "antd";
import Routes from '../../Router';
import MenuItem from './MenuItem';
import { menus } from './menus';
import Cookie from 'js-cookie';
import './App.less'
const { Header, Content, Sider } = Layout;

const menuName = ['退出'];

const dropdownMenu = (
  <Menu>
    {
      menuName.map((item, idx) => 
        <Menu.Item key={idx} >
          {item}
        </Menu.Item>
      )
    }
  </Menu>
)

class App extends Component {

  rootSubmenuKeys = [];
  state = {
    localtionName: '',
    selectOpenKey: "",
    menuMode: "inline",
    openKeys: [],
    UserName: '',
    UserMenu: []
  };
  componentWillMount () {
    let UserInfo = Cookie.getJSON('UserInfo');
    let menu = UserInfo.UserMenuItem;
    for(let item of menu) {
      for(let value of menus) {
        if(item.ProjectModule_URL === value.key) {
          item.icon = value.icon;
          break;
        }
      }
    }
    this.setState({
      UserName: UserInfo.UserName,
      UserMenu: UserInfo.UserMenuItem
    })

    this.setMenuOpenKey(this.props);
    this.getLocationName();
    for(let item of this.state.UserMenu ) {
      if(item.subnode.length > 0) {
        this.rootSubmenuKeys.push(item.key);
      }
    }
    
    // console.log(this.rootSubmenuKeys)
  }
  componentDidMount() {
    // console.log(this.props);
    
    // window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    console.log("卸载");
  }

  getLocationName (keys) {
    console.log(this.props);
    const pathname = keys || this.props.location.pathname;
    for (let item of menus) {
      // console.log(item.key);
      // console.log(pathname);
      if (item.key === pathname) {
        console.log('---1')
        if(item.isHidden) {
          this.setState({
            localtionName: item.title,
            selectOpenKey: item.fatherName
          });
          break;
        } 
        this.setState({ localtionName: item.title });
        break;
      } else if (pathname.indexOf(item.key) !== -1) {
        // console.log(item);
        this.setState({
          localtionName: item.title,
          selectOpenKey: item.fatherName
        });
        break;
      } else if (item.sub) {
        // console.log('----2');
        for (let name of item.sub) {
          // console.log(name);
          // console.log(pathname);
          if (name.key === pathname && name.isHidden) {
            // console.log("-------------");
            // console.log(name);
            this.setState({
              localtionName: name.title,
              selectOpenKey: name.fatherName,
              openKeys: [item.key]
            })
            break;
          } else if (name.key === pathname ) {
            this.setState({ 
              localtionName: item.title + ' > ' + name.title,
              openKeys: [item.key]
            });
            break;
          }
        }
      } 
    }
  }
  //
  setMenuOpenKey = props => {
    let { pathname } = props.location;
    // console.log(pathname);
    if (pathname === "/") {
      pathname = "/App/Home";
    }

    this.setState({ selectOpenKey: pathname });
  };
  openMenu = v => {
    console.log(v);
  };
  menuClick = (item) => {
    console.log(item);
    this.getLocationName(item.key);
    this.setState({ selectOpenKey: item.key });
  };
  onOpenChange = openKeys => {
    console.log(openKeys);
    const latestOpenKey = openKeys.find(
      key => this.state.openKeys.indexOf(key) === -1
    );
    console.log(latestOpenKey);
    if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.setState({ openKeys });
    } else {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : []
      });
    }
  };

  

  render() {
    const { UserName, UserMenu } = this.state;
    console.log(UserMenu);
    return <Layout style={{ minHeight: "100%" }}>
        <Header>
          <div className="logoContainer">
            <div className="logo iconBack" />
            <div className="systemName iconBack" />
          </div>
          <div className="systemDropdown">
            <div className="content">
              <div className="noticeIcon iconBack" />
              <div className="dropdownContainer">
                <Dropdown overlay={dropdownMenu} trigger={["click"]}>
                  <a className="ant-dropdown-link" href="javascript:;">
                    <i className="iconBack userIcon" />
                    <span className="userName">
                      <span style={{ lineHeight: "20px" }}>欢迎登录，</span>
                      <span style={{ lineHeight: "20px" }}>{UserName}</span>
                    </span>
                    <i className="iconBack dropdownIcon" />
                  </a>
                </Dropdown>
              </div>
            </div>
          </div>
        </Header>
        <Layout>
          <Sider>
            <MenuItem menus={UserMenu} theme="dark" mode={this.state.menuMode} selectedKeys={[this.state.selectOpenKey]} openKeys={this.state.openKeys} onClick={this.menuClick} onOpenChange={this.onOpenChange} />
          </Sider>
          <Content>
            <Col span={24} className="localtion">
              <i className="iconBack localtion" />当前位置： <span className="localtionName">
                {this.state.localtionName}
              </span>
            </Col>
            <Col span={24} className="main-container">
              <Routes RouteChange={this.getLocationName} />
            </Col>
          </Content>
        </Layout>
        {/* <Footer>Footer</Footer> */}
      </Layout>;
  }
}

export default App;