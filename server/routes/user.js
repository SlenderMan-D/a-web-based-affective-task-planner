const express = require('express');
const User = require('../models/User')

const user = express.Router();

// sign up
user.post('/join', (req, res) => {
  let newUserInfo = Object.assign(req.body, { tasks: [] }),
    username = newUserInfo.username,
    email = newUserInfo.email;

  User.find({ username, email }, (err, docs) => {
    if (docs.length > 0) {
      res.send({
        code: 400,
        msg: 'Email or username is invalid or already taken'
      })
    } else {
      req.session.user = newUserInfo;
      const newUser = new User(newUserInfo);
      newUser.save((err) => {
        if (err) throw err;
        res.send({
          code: 200,
          msg: 'join successfully'
        })
      })
    }
  })
})

// login
user.post('/login', (req, res) => {
  let userInfo = req.body,
    data;
  User.find(userInfo, (err, docs) => {
    if (err) throw err;
    else {
      if (docs.length > 0) {
        req.session.user = docs[0],
          data = {
            code: 200,
            msg: 'login successfully'
          }
      } else {
        data = {
          code: 400,
          msg: 'Incorrect username or password.'
        }
      }
      res.send(data);
    }
  })
});

// get user information
user.get('/userInfo', (req, res) => {
  let data;
  if (req.session&&req.session.user) {
    data = {
      data: { username: req.session.user.username },
      code: 200,
      msg: ''
    }
  } else {
    data = {
      code: 400,
      msg: 'user haven not log in'
    }
  }
  res.send(data)
})

// log out
user.get('/logout', (req, res) => {
  req.session.user = null
  res.send({
    code: 200,
    msg: 'log out success'
  })
})

module.exports = user;
