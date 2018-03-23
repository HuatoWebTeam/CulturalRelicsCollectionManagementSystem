import React from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
const { SubMenu } = Menu;

const readerMenuItem = ({ProjectModule_URL, ProjectModule_Name, icon, isHidden, ...props}) => 
    !isHidden && <Menu.Item key={ProjectModule_URL} {...props}>
      <Link to={ProjectModule_URL}>
        {icon && <i className={icon} />}
        <span className="nav-text">{ProjectModule_Name}</span>
      </Link>
    </Menu.Item>;

const renderChildMenuItem = ({Functional_Name, Functional__URl, icon, ...props }) => 
  <Menu.Item key={Functional__URl} {...props} >
    <Link to={Functional__URl} >
      {icon &&  <i className={icon} /> }
      <span className='nav-text' > {Functional_Name} </span>
    </Link>
  </Menu.Item>;

const renderSubMenu = ({ ProjectModule_URL, ProjectModule_Name, icon, subnode, ...props }) => 
  <SubMenu
    key={ProjectModule_URL}
    title={
      <span>
        {icon && <i className={icon} />}
        <span className="nav-text">{ProjectModule_Name}</span>
      </span>
    }
    {...props}
  >
  {subnode && subnode.map(item => renderChildMenuItem(item))}
  </SubMenu>;

  export default ({ menus, ...props }) => <Menu {...props} style={{ background: "none", color: "#fff" }}>
      {menus && menus.map(item => (item.subnode && item.subnode.length > 0 ? renderSubMenu(item) : readerMenuItem(item)))}
    </Menu>;
