const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  id: String,
  userId: String,
  title: String,
  startTime: String,
  endTime: String,
  deadLine: String,
  repeat: Boolean,
  challengeLevel: Number,
  status: String,
  finshedTime: String,
  feel: Number,
  createTime:String,
  deleteAtCalender:Boolean
});

const Tasks = mongoose.model("tasks", TaskSchema, 'tasks');

module.exports = Tasks