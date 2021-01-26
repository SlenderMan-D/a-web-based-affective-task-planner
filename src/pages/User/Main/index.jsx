import React, { useState, useEffect, useContext } from 'react';
import 'antd/dist/antd.css';
import { PageHeader, Dropdown } from 'antd'
import { Layout, Menu, Breadcrumb, Icon, message } from 'antd';
import axios from 'axios'

import RenderIf from '../../../components/render-if'
import UserContext from '../../../context/user'
import Task from './components/task'
import Review from './components/review'
import Calendar from './components/calender'
import Home from './components/home'
import { decodeURLParams } from '../../../utils'
import './index.css'

const { Content, Sider } = Layout;

const logOut = () => {
  axios.get('http://localhost:3232/api/user/logout')
    .then((res) => {
      if (res.data.code === 200) {
        window.location = '/login'
      } else {
        message.error('new task failed, please try again later!')
      }
    })
}

const menu = (
  <Menu>
    <Menu.Item key='logout' onClick={logOut}>
      <a target="_blank" rel="noopener noreferrer" >
        logout
      </a>
    </Menu.Item>
  </Menu>
);

export default () => {
  const user = useContext(UserContext);

  useEffect(() => {
    const query = decodeURLParams(window.location.search) || {}
    setActiveKey(query.tab || 'tasks')
  }, [])

  const [activeKey, setActiveKey] = useState('')
  const handleMenu = ({ key }) => {
    window.location.search = `?tab=${key}`
    setActiveKey(key)
  }

  return (
    <Layout>
      <PageHeader
        className='header'
        ghost={false}
        title="Task Plan"
        extra={[
          <Icon type="bell" className='header-icon' key='bell' />,
          <Icon type="question-circle" className='header-icon' key='question' />,
          <Dropdown overlay={menu} key='user'>
            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
              {user.username} <Icon type="down" />
            </a>
          </Dropdown>,
        ]}
      />
      <Layout>
        <Sider width={200} style={{ background: '#fff' }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['tasks']}
            selectedKeys={[activeKey]}
            style={{ height: '100%', borderRight: 0 }}
            onClick={handleMenu}
          >
            <Menu.Item key="home"><Icon type="home" theme="filled" />Home</Menu.Item>
            <Menu.Item key="tasks"><Icon type="file" theme="filled" />Tasks</Menu.Item>
            <Menu.Item key="review"><Icon type="history" />Review</Menu.Item>
            <Menu.Item key="calendar"><Icon type="calendar" theme="filled" />Calendar</Menu.Item>
          </Menu>
        </Sider>

        <Layout style={{ padding: '0 24px 24px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>{user.username}</Breadcrumb.Item>
          </Breadcrumb>
          <Content
            style={{
              background: '#fff',
              padding: 24,
              margin: 0,
              minHeight: 700,
            }}
          >
            <RenderIf condition={activeKey === 'home'}>
              <Home/>
            </RenderIf>
            <RenderIf condition={activeKey === 'tasks'}>
              <Task />
            </RenderIf>
            <RenderIf condition={activeKey === 'review'}>
              <Review />
            </RenderIf>
            <RenderIf condition={activeKey === 'calendar'}>
              <Calendar />
              {/* <Calendar dateCellRender={dateCellRender} monthCellRender={monthCellRender} /> */}
            </RenderIf>
          </Content>
        </Layout>

      </Layout>

    </Layout>

  )
}
