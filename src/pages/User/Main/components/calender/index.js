import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import {
  Calendar, Badge, Modal, Icon, Button,
  Form, Input, DatePicker, Rate, message
} from 'antd';
import moment from 'moment'
import RenderIf from '../../../../../components/render-if'

import './index.css'

const { RangePicker } = DatePicker;
const { confirm } = Modal;

const noop = ({ value }) => {
  const current = value.clone();
  const localeData = value.localeData();
  return (
    <div className='calendar-header'>
      {localeData.monthsShort(current)}
    </div>
  )
}

const getDayTask = (day, taskList) => {
  return taskList.filter(item => day.isSame(item.finshedTime, 'day'))
}

const Review = () => {
  const [taskList, setTaskList] = useState([])
  const [month, setMonth] = useState(moment().month())
  const [editTask, setEditTask] = useState(null)
  const [showModel, setShowModel] = useState(false)
  const [reload, setReload] = useState(0)

  const formRef = useRef()

  const handleChange = (e) => {
    setMonth(e.month())
  }

  useEffect(() => {
    axios.post('http://localhost:3232/api/task/queryByDate/calender', {
      // status: 'done',
      start: moment().month(month).startOf('month').format('YYYY-MM-DD'),
      end: moment().month(month).endOf('month').format('YYYY-MM-DD'),
    })
      .then((res) => {
        if (res.data.code === 200) {
          setTaskList((res.data.data.list || []).filter(x=>!x.deleteAtCalender))
        }
      })
  }, [month])

  const showTask = (task) => {
    const feels = {
      '-1': <Icon type="frown" className='frown' />,
      '0': <Icon type="meh" className='meh' />,
      '1': <Icon type="smile" className='smile' />
    }

    const handleEdit = () => {
      setShowModel(true)
      setEditTask(task)
    }

    const handleDelete=()=>{
      confirm({
        title: `Are you sure delete this task from calender?`,
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        onOk() {
          axios.post('http://localhost:3232/api/task/updateTask', { _id: task._id,deleteAtCalender:true }).then(res => {
            if (res.data.code === 200) {
              message.success(`delete task success`)
              setReload(x => x + 1)
            }
          })
        },
      });
    }

    confirm({
      title: 'Task Detial',
      icon: null,
      cancelText: null,
      content: (
        <div>
          <p className='task-detial-item'><span>title:</span>{task.title}</p>
          <p className='task-detial-item'><span>startTime:</span>{task.startTime}</p>
          <p className='task-detial-item'><span>endTime:</span>{task.endTime}</p>
          <p className='task-detial-item'><span>status:</span>{task.status}</p>
          <RenderIf condition={task.status === 'done'}>
            <p className='task-detial-item'><span>finshedTime:</span>{task.finshedTime}</p>
            <p className='task-detial-item'><span>feel:</span>{feels[task.feel]}</p>
          </RenderIf>
          <RenderIf condition={task.status !== 'done'}>
            <Button style={{
              marginRight: 10
            }} onClick={handleEdit}>edit</Button>
            <Button onClick={handleDelete}>delete</Button>
          </RenderIf>
        </div>),
    });
  }


  function renderCell(date) {

    const statusMap = {
      '-1': 'error',
      '0': 'warning',
      '1': 'success'
    }
    const list = getDayTask(date, taskList)
    return (
      <div className='task-list'>
        {list.slice(0, 5).map(x => <span key={x._id} onClick={() => showTask(x)}><Badge status={statusMap[x.feel] || 'processing'} text={x.title} /></span>)}
        {list.length > 6 && '...'}
      </div>
    )
  }

  const handleOk = () => {
    formRef.current.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      const newTask = {
        ...editTask,
        ...fieldsValue,
        startTime: fieldsValue['rangePicker'][0].format('YYYY-MM-DD HH:mm:ss'),
        endTime: fieldsValue['rangePicker'][1].format('YYYY-MM-DD HH:mm:ss'),
        deadLine: fieldsValue['deadLine'].format('YYYY-MM-DD HH:mm:ss'),
      }

      axios.post('http://localhost:3232/api/task/updateTask', newTask)
        .then((res) => {
          if (res.data.code === 200) {
            message.success('update task success')
            setShowModel(false)
            setReload(x => x + 1)
          } else {
            message.error('new task failed, please try again later!')
          }
        })
    })
  }

  return (
    <div className='site-calendar-demo-card'>
      <div className='calendar-item'>
        <Calendar
          fullscreen={true}
          dateCellRender={renderCell}
          onChange={handleChange}
        // headerRender={noop}
        />
      </div>
      <Modal
        title="Edit Task"
        visible={showModel}
        style={{ width: 800 }}
        onOk={handleOk}
        onCancel={() => setShowModel(false)}
      >
        <WrappedNewTaskForm ref={formRef} initData={editTask} />
      </Modal>
    </div>)
}

const NewTaskForm = ({ form: { getFieldDecorator }, initData }) => {
  const formItemLayout = {
    labelCol: {
      xs: { span: 6 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 16 },
      sm: { span: 16 },
    },
  };

  return (
    <Form {...formItemLayout} >
      <Form.Item label="Title">
        {getFieldDecorator('title', {
          rules: [{ type: 'string', required: true, message: 'Please input title!' }],
          initialValue: initData.title
        })(<Input
          placeholder="Title"
        />)}
      </Form.Item>
      <Form.Item label="RangePicker">
        {getFieldDecorator('rangePicker', {
          initialValue: [moment(initData.startTime), moment(initData.endTime)],
          rules: [{ type: 'array', required: true, message: 'Please select start time and end time!' }],
        })(<RangePicker />)}
      </Form.Item>
      <Form.Item label="Dead Line">
        {getFieldDecorator('deadLine', {
          initialValue: moment(initData.deadLine),
          rules: [{ type: 'object', required: true, message: 'Please select dead line!' }],
        })(
          <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />,
        )}
      </Form.Item>
      {/* <Form.Item label="Repeat">
        {getFieldDecorator('repeat', {
          rules: [{ type: 'boolean', message: 'Please select repeat or not!' }],
        })(
          <Checkbox />,
        )}
      </Form.Item> */}
      <Form.Item label="Challenge Level">
        {getFieldDecorator('challengeLevel', {
          initialValue: initData.challengeLevel,
          rules: [{ type: 'number', required: true, message: 'Please select challenge level!' }],
        })(
          <Rate tooltips={desc} character={<Icon type="caret-up" />} />
        )}
      </Form.Item>
    </Form>
  );
}

const desc = ['very ease', 'ease', 'mid', 'hard', 'very hard'];
const actions = {
  todo: 'Start',
  doing: 'Finish',
  done: ''
}

const WrappedNewTaskForm = Form.create({ name: 'newTask' })(NewTaskForm);

export default Review