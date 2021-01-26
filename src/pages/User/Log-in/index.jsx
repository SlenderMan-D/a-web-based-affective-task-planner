import React, { useState } from 'react';
import { Link } from 'react-router-dom'
import { Input, Button } from 'antd'
import axios from 'axios';
import RenderIf from '../../../components/render-if'

import UserHomeImg from '../../../assets/imgs/user-home.jpeg'
import './index.css'

const FormItem = ({ title, onChange, pw }) => (
  <section className='form-item'>
    <span className='form-item-title'>{title}</span>
    {
      pw ?
        <Input.Password onChange={e => onChange(e.target.value)} /> :
        <Input onChange={e => onChange(e.target.value)} />
    }
  </section>
)

export default () => {
  const [username, setUsername] = useState('')
  const [password, setPW] = useState('')
  const [errInfo, setErrInfo] = useState('')

  const handleLogin = () => {
    axios.post('http://localhost:3232/api/user/login', {
      username,
      password
    }).then((res) => {
      if (res.data.code === 200) {
        window.location.href = '/mainPage'
      } else {
        setErrInfo(res.data.msg)
      }
    })
  }
  return (
    <div className='g-login'>
      <img src={UserHomeImg} alt='home' className='home-img' />
      <div className='m-content'>
        <div className='m-form'>
          <h3 className='page-title'>Welcome to Task Planner</h3>
          <RenderIf condition={!!errInfo}>
            <p className='err-info'>{errInfo}</p>
          </RenderIf>
          <FormItem title='Username' onChange={setUsername} />
          <FormItem title='Password' onChange={setPW} pw />
          <div className='log-in'>
            <Button onClick={handleLogin}>Log in</Button>
          </div>
          <div className='m-other'>
            <Link to="/reset">Forget password ?</Link>
            <Link to="/signup">Create Account !</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

