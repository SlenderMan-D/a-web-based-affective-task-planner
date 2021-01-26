const express = require('express');
const moment =require('moment')
const Tasks = require('../models/Tasks')
const utils = require('../utils/index')


const task = express.Router();

task.post('/add', (req, res) => {
  const userId = req.session.user._id
  const newTask = new Tasks({userId,deleteAtCalender:false, ...req.body,createTime:moment().format('YYYY-MM-DD HH:mm:ss') });
  newTask.save((err) => {
    if (err) throw err;
    res.send({
      code: 200,
      msg: 'add task successfully'
    })
  })
})

task.post('/list', async (req, res) => {
  if(!req.session || !req.session.user) return
  const userId = req.session.user._id
  const { status, current } = req.body

  const query = Tasks.find({userId, status });
  const total = await query.count();
  const data = await query
    .find()
    .skip((current - 1) * 10)
    .limit(10)

  return res.json({ code: 200, msg: 'get the list success', data: { list: data }, total })
})

task.post('/updateTask', async (req, res) => {
  const { status, finshedTime, feel, _id,...others } = req.body
  Tasks.findByIdAndUpdate(_id,
    utils.removeEmpty({ status, finshedTime, feel,...others }),
    (err, ret) => {
      if (err) {
        res.send({ code: 400, msg: 'update failed', })
      } else {
        res.send({ code: 200, msg: 'update success', })
      }
    })
})

task.post('/deleteTask', async (req, res) => {
  const { _id } = req.body
  Tasks.deleteOne({ _id }, (err, ret) => {
    if (err) {
      res.send({ code: 400, msg: 'delete failed', })
    } else {
      res.send({ code: 200, msg: 'delete success', })
    }
  })
})

task.post('/queryByDate', async (req, res) => {
  const userId = req.session.user._id
  const { start, end, status } = req.body

  const query = Tasks.find(utils.removeEmpty({ userId, status, finshedTime: { $gte: start, $lt: end } }));
  const data = await query.find()

  return res.json({ code: 200, msg: 'get list success', data: { list: data } })
})

task.post('/queryByDate/home', async (req, res) => {
  const userId = req.session.user._id
  const { start, end, status } = req.body

  const query = Tasks.find(utils.removeEmpty({ 
    userId, 
    status,
    endTime:{ $lt: end }, 
    startTime: { $gte: start } 
  }));
  const data = await query.find()

  return res.json({ code: 200, msg: 'get list success', data: { list: data } })
})


task.post('/queryByDate/calender', async (req, res) => {
  const userId = req.session.user._id
  const { start, end, status } = req.body

  const query = Tasks.find(utils.removeEmpty({userId, status, createTime: { $gte: start, $lt: end } }));
  const data = await query.find()

  return res.json({ code: 200, msg: 'get list success', data: { list: data } })
})

module.exports = task;