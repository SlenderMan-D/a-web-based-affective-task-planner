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
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPW] = useState('')
  const [errInfo, setErrInfo] = useState('')

  const handleSignup = () => {
    axios.post('http://localhost:3232/api/user/join', {
      email,
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
    <div className='g-Signup'>
      <img src={UserHomeImg} alt='home' className='home-img' />
      <div className='m-content'>
        <div className='m-form'>
          <h3 className='page-title'>Create Your Account Here</h3>
          <RenderIf condition={!!errInfo}>
            <p className='err-info'>{errInfo}</p>
          </RenderIf>
          <FormItem title='Email' onChange={setEmail} />
          <FormItem title='Username' onChange={setUsername} />
          <FormItem title='Password' onChange={setPW} pw />

          <div className='signUp'>
            <Button onClick={handleSignup}>Sign up</Button>
          </div>
          <div className='m-other'>
            <Link to="/">back</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
