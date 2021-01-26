import React, { useState } from 'react';
import { Link } from 'react-router-dom'
import { Input, Button } from 'antd'

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

    const handleReset = () => {
        console.log(email)
    }

    return (
        <div className='g-resetPW'>
            <img src={UserHomeImg} alt='home' className='home-img' />
            <div className='m-content'>
                <div className='m-form'>
                    <h3 className='page-title'>Reset Your Password Here</h3>
                    <h4 className='note-one'>It is really easy to find your password,</h4>
                    <h5 className='note-two'>just tell us your email address.</h5>
                    <FormItem title='Email' onChange={setEmail} />

                    <div className='resetPW'>
                        <Button onClick={handleReset}>send</Button>
                    </div>
                    <div className='m-other'>
                        <Link to="/">back</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
