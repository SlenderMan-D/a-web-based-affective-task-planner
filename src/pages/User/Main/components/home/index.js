import React, { useState, useRef, Tag, useEffect } from 'react';
import {
  Tabs, Table, Divider,
  DatePicker, Form, Button,
  Modal, Input, Checkbox,
  Rate, Icon
  , message,
  Radio
} from 'antd';
import axios from 'axios'
import moment from 'moment'

import './index.css'

const { confirm } = Modal;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const level = { '-2': 'Terrible', '-1': 'Bad', '0': 'Normal', '1': 'Good', '2': 'Excellent' }

export default () => {
  const [showModel, setShowModel] = useState(false)
  const [reload, setReload] = useState(0)
  const [taskList, setTaskList] = useState([])
  const [current, setCurrent] = useState(1)
  const [total, setTotal] = useState(0)

  const [activeTab, setActiveTab] = useState('todo')
  const formRef = useRef()

  useEffect(() => {
    axios.post('http://localhost:3232/api/task/list', {
      status: activeTab,
      current
    })
      .then((res) => {
        if (res.data.code === 200) {
          setTaskList(res.data.data.list || [])
          setTotal(res.data.data.total || 0)
        }
      })
  }, [activeTab, reload, current])

  const callback = (activeKey) => {
    setActiveTab(activeKey)
    setCurrent(1)
  }
  const newTask = () => {
    setShowModel(true)
  }

  const handlePageChange = (value) => {
    setCurrent(value)
  }

 /*const handleOk = () => {
    formRef.current.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      const newTask = {
        ...fieldsValue,
        startTime: fieldsValue['rangePicker'][0].format('YYYY-MM-DD HH:mm:ss'),
        endTime: fieldsValue['rangePicker'][1].format('YYYY-MM-DD HH:mm:ss'),
        deadLine: fieldsValue['deadLine'].format('YYYY-MM-DD HH:mm:ss'),
        status: 'todo'
      }

      axios.post('http://localhost:3232/api/task/add', newTask)
        .then((res) => {
          if (res.data.code === 200) {
            message.success('new task success')
            setShowModel(false)
            setReload(x => x + 1)
          } else {
            message.error('new task failed, please try again later!')
          }
        })
    })
  }*/

  const handleAction = (record) => {
    let keyWord = 'start',
      params = { status: 'doing' };
    if (record.status === 'doing') {
      keyWord = 'finsh'
      params = {
        status: 'done'
      }
    }
    let feel = 1
    const radioChange = e => {
      feel = e.target.value
    }
    confirm({
      title: `Are you sure ${keyWord} this task?`,
      content: record.status === 'doing' ? (
        <div>
          <Radio.Group onChange={radioChange} >
            <div className='feel'>
              <div className='feel-item'>
                <Icon type="frown" className='frown' />
                <Radio value={-1}>bad</Radio>
              </div>
              <div className='feel-item'>
                <Icon type="meh" className='meh' />
                <Radio value={0}>not bad</Radio>
              </div>
              <div className='feel-item'>
                <Icon type="smile" className='smile' />
                <Radio value={1}>happy</Radio>
              </div>
            </div>
          </Radio.Group>
          <div>
            <span>CL：</span> <Rate value={record.challengeLevel} tooltips={desc} character={<Icon type="caret-up" />} disabled />
          </div>
          <div>
            <span>DL：</span> <span>{record.deadLine}</span>
          </div>
        </div>
      ) : '',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        const reqBody = {
          ...params,
          feel,
          finshedTime: moment().format('YYYY-MM-DD HH:mm:ss'),
          _id: record._id
        }
        if (record.status === 'todo') {
          delete reqBody.feel
          delete reqBody.finshedTime
        }
        axios.post('http://localhost:3232/api/task/updateTask', reqBody).then(res => {
          if (res.data.code === 200) {
            message.success(`${keyWord} task success`)
            setReload(x => x + 1)
          }
        })
      },
    });
  }

  const handleFinsh = () => {

    let feel = 1
    const radioChange = e => {
      feel = e.target.value
    }
    confirm({
      title: `After finish today's plan, what's your feeling?`,
      content: (
        <div>
          <Radio.Group onChange={radioChange} >
            <div className='feel'>
              <div className='feel-item'>
                <Icon type="frown" className='frown' />
                <Radio value={-1}>bad</Radio>
              </div>
              <div className='feel-item'>
                <Icon type="meh" className='meh' />
                <Radio value={0}>not bad</Radio>
              </div>
              <div className='feel-item'>
                <Icon type="smile" className='smile' />
                <Radio value={1}>happy</Radio>
              </div>
            </div>
          </Radio.Group>
        </div>
      ),
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        if (feel === -1) {
          confirm({
            title: `To keep a good mood during working, the suggestion is to modify tomorrow's plan`,
            content: (
              <div>
                {taskList
                  .filter(x => x.status === 'doing' && x.challengeLevel>3 )
                  .map((x, i) => (<p><span>{i + 1}. {x.title}</span></p>))
                }
              </div>
            )
          })
        }
      },
    });
  }

  const handleDelete = (record) => {
    confirm({
      title: `Are you sure delete this task?`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        setTaskList(list => list.filter(x => x._id !== record._id))
      },
    });
  }

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Start Time',
      dataIndex: 'startTime',
      key: 'startTime',
    },
    {
      title: 'End Time',
      dataIndex: 'endTime',
      key: 'endTime',
    },
    {
      title: 'Dead Line',
      key: 'deadLine',
      dataIndex: 'deadLine',
    },
    // {
    //   title: 'Repeat',
    //   key: 'repeat',
    //   dataIndex: 'repeat',
    //   render: (text, record) => <span>{text ? 'YES' : 'NO'}</span>
    // },
    {
      title: 'Challenge Level',
      key: 'challengeLevel',
      dataIndex: 'challengeLevel',
      render: (value) => <Rate value={value} tooltips={desc} character={<Icon type="caret-up" />} disabled />
    },
    {
      title: 'Grade',
      key: 'challengeLevel',
      dataIndex: 'challengeLevel',
      render: (value, item) => {
        if (item.status !== 'done') return null
        return level[item.feel + (moment(item.finshedTime).isBefore(item.daedLine) ? 1 : -1)]
      }
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <span>
          <a onClick={() => handleAction(record)}>{actions[record.status]}</a>
          {actions[record.status] && <Divider type="vertical" />}
          <a onClick={() => handleDelete(record)}>Delete</a>
        </span>
      ),
    },
  ];

  return (
    <div>
      <Tabs
        defaultActiveKey={activeTab}
        activeKey={activeTab}
        onChange={callback}
        tabBarExtraContent={
          activeTab === 'doing' ?
            (<Button type="primary" onClick={handleFinsh} disabled={showModel}>
              FInish Today's Plan
            </Button>)
            : null}>

        <TabPane tab="Daily plan" key="doing">
          <Table columns={columns} dataSource={taskList} pagination={{ total, current, onChange: handlePageChange }} rowKey={row => row._id} />
        </TabPane>

      </Tabs>
      <Modal
        title="finishDailyPlan"
        visible={showModel}
        style={{ width: 800 }}
       // onOk={handleOk}
        onCancel={() => setShowModel(false)}
      >
       <WrappedNewTaskForm ref={formRef} />
      </Modal>
    </div>
  )
}

const NewTaskForm = ({ form: { getFieldDecorator } }) => {
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

  const handleSubmit = e => {
    e.preventDefault();

    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      console.log(fieldsValue)
    })
  }


  return (
    <Form {...formItemLayout} onSubmit={handleSubmit}>
      <Form.Item label="Title">
        {getFieldDecorator('title', {
          rules: [{ type: 'string', required: true, message: 'Please input title!' }],
        })(<Input
          placeholder="Title"
        />)}
      </Form.Item>
      <Form.Item label="RangePicker">
        {getFieldDecorator('rangePicker', {
          rules: [{ type: 'array', required: true, message: 'Please select start time and end time!' }],
        })(<RangePicker showTime />)}
      </Form.Item>
      <Form.Item label="Dead Line">
        {getFieldDecorator('deadLine', {
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