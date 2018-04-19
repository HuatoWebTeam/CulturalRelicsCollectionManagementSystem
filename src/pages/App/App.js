import React, { Component } from 'react';
import { Layout, Menu, Dropdown, Col, Icon, Modal, Form, message } from "antd";
import Routes from '../../Router';
import MenuItem from './MenuItem';
import { menus } from './menus';
// import Cookie from 'js-cookie';
import './App.less';
import { UpdateUserPwd } from '../../axios';
import ChangePwd from './changePwd';
const { Header, Content, Sider } = Layout;
const confirm = Modal.confirm;

const menuName = [{ title: '修改密码', icon: 'setting' }, { title: '退出', icon: 'logout'}];





class AppContent extends Component {
  rootSubmenuKeys = [];
  state = {
    localtionName: "",
    selectOpenKey: "",
    menuMode: "inline",
    openKeys: [],
    UserName: "",
    UserMenu: []
  };
  componentWillMount() {
    console.log(this.props);
    let UserInfo = JSON.parse(sessionStorage.getItem("UserInfo"));

    console.log(UserInfo);
    let menu = UserInfo.UserMenuItem;
    for (let item of menu) {
      for (let value of menus) {
        if (item.ProjectModule_URL === value.key) {
          item.icon = value.icon;
          break;
        }
      }
    }
    this.setState({
      UserName: UserInfo.UserName,
      UserMenu: UserInfo.UserMenuItem
    });

    this.setMenuOpenKey(this.props);
    // this.getLocationName();
    for (let item of this.state.UserMenu) {
      if (item.subnode.length > 0) {
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
  componentWillReceiveProps() {
    console.log(this.props);
    this.setMenuOpenKey(this.props.history);
  }

  getLocationName(keys) {
    // console.log(this.props);
    // console.log(keys)
    const pathname = keys || this.props.location.pathname;
    console.log(menus)
    for (let item of menus) {
      // console.log(item.key);
      // console.log(pathname);
      // console.log(pathname.indexOf(item.key));
      if (item.key === pathname) {
        // console.log("---1");
        if (item.isHidden) {
          this.setState({
            localtionName: item.title,
            selectOpenKey: item.fatherName
          });
          break;
        }
        this.setState({ localtionName: item.title });
        break;
      } else if (pathname.indexOf(item.key) !== -1 ) {
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
          if (pathname.indexOf(name.key) !== -1 && name.isHidden) {
            // console.log("-------------");
            // console.log(name);
            this.setState({
              localtionName: name.title,
              selectOpenKey: name.fatherName,
              openKeys: [item.key]
            });
            break;
          } else if (name.key === pathname) {
            this.setState({
              localtionName: item.title + " > " + name.title,
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
    console.log(pathname);
    if (pathname === "/") {
      pathname = "/App/Home";
    }

    this.setState({ selectOpenKey: pathname });
    this.getLocationName(pathname);
  };
  openMenu = v => {
    console.log(v);
  };
  menuClick = item => {
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

  dropdownChange = ({ key }) => {
    console.log(key);
    if (key === "修改密码") {
      this.setState({
        setPwdVisible: true
      });
    } else {
      this.showConfirm();
    }
  };

  //
  showConfirm = () => {
    const _this = this;
    confirm({
      title: "提示",
      content: "确认退出？",
      onOk() {
        console.log("ok");
        sessionStorage.removeItem("UserInfo");
        setTimeout(() => {
          _this.props.history.push("/login");
        }, 500);
      },
      onCancel() {
        return false;
      }
    });
  };

  handleCancel = () => {
    this.setState({
      oldPassword: null,
      newPassword: null,
      confirmPwd: null,
      setPwdVisible: false
    });
  };

  handleOk = () => {
    console.log("ok");
    console.log(this.refs.changepwd);
    this.refs.changepwd.validateFields((err, value) => {
      if(!err) {
        console.log(value);
        let params = {
          userPwd: {
            UserNewPwd: value.newpwd,
            UserOriginalPwd: value.oldpwd
          }
        }
        UpdateUserPwd(params).then(res => {
          console.log(res);
          let _this = this;
          if(res.State === 1) {
            message.success('修改成功, 请重新登录');
            sessionStorage.removeItem("UserInfo");
            setTimeout(() => {
              _this.props.history.push("/login");
            }, 1000);
          } else if(res.State === 2) {
            this.refs.changepwd.setFields({
              oldpwd: {
                errors: [new Error("原始密码错误")]
              }
            });
          }
        })
        
      }
    });

  };

  render() {
    // console.log(this.props)
    const { UserName, UserMenu, setPwdVisible } = this.state;
    // console.log(UserMenu);
    const dropdownMenu = (
      <Menu className="system-dropdown" onClick={this.dropdownChange}>
        {menuName.map((item, idx) => (
          <Menu.Item key={item.title}>
            <Icon type={item.icon} />
            <span> {item.title} </span>
          </Menu.Item>
        ))}
      </Menu>
    );
    return (
      <Layout style={{ minHeight: "100%" }}>
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
                  <a className="ant-dropdown-link" href="#">
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
          <Modal
            visible={setPwdVisible}
            title="修改密码"
            onCancel={this.handleCancel}
            onOk={this.handleOk}
          >
            <ChangePwd ref="changepwd" />
          </Modal>
        </Header>
        <Layout>
          <Sider>
            <MenuItem
              menus={UserMenu}
              theme="dark"
              mode={this.state.menuMode}
              selectedKeys={[this.state.selectOpenKey]}
              openKeys={this.state.openKeys}
              onClick={this.menuClick}
              onOpenChange={this.onOpenChange}
            />
          </Sider>
          <Content>
            <Col span={24} className="localtion">
              <i className="iconBack localtion" />当前位置：{" "}
              <span className="localtionName">{this.state.localtionName}</span>
            </Col>
            <Col span={24} className="main-container">
              <Routes RouteChange={this.getLocationName} />
            </Col>
          </Content>
        </Layout>
        {/* <Footer>Footer</Footer> */}
      </Layout>
    );
  }
}

const App = Form.create()(AppContent);

export default App;