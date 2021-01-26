import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Calendar } from 'antd';
import moment from 'moment'

import './index.css'

const colors = {
  '-2': '#ff0000',
  '-1': '#faad14',
  '0': '#928d8d',
  '1': '#84e284',
  '2': '#008000'
}

const feel = {
  '-2': 'Sad',
  '-1': 'Normal',
  '0': 'No task finished today',
  '1': 'Good',
  '2': 'Happy'
}

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
  const getMonthLit = () => {
    const currentMonth = moment().month();
    const pre1Month = moment().month(currentMonth - 1).startOf('month')
    const pre2Month = moment().month(currentMonth - 2).startOf('month')
    return [pre2Month, pre1Month, moment()]
  }

  const [taskList, setTaskList] = useState([])
  const [monthList, setMonthList] = useState(getMonthLit())

  useEffect(() => {
    axios.post('http://localhost:3232/api/task/queryByDate', {
      status: 'done',
      start: moment().month(moment().month() - 2).startOf('month').format('YYYY-MM-DD'),
      end: moment().endOf('month').format('YYYY-MM-DD'),
    })
      .then((res) => {
        if (res.data.code === 200) {
          setTaskList(res.data.data.list || [])
        }
      })
  }, [])


  function renderCell(date) {
    const grade = getDayTask(date, taskList)
      .reduce((total, current) =>{
        if(current.finshedTime===current.deadLine) { return total + current.feel }else{
        return  total + current.feel + (moment(current.finshedTime).isBefore(current.deadLine) ? 1 : -1)}
      },0)
    let color = colors[grade]
    if (grade > 2) {
      color = colors['2']
    } else if (grade < -2) {
      color = colors['-2']
    }

    return (<div className='calendar-grade' style={{ backgroundColor: color }}></div>)
  }
  return (
    <div>
      <div style={{
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center',
        marginBottom: 30
      }}>
        {
          Object.keys(colors).map(key => (
            <div>
              <p style={{
                backgroundColor: colors[key],
                width: 20,
                height: 20,
                margin: '0 30px',
              }}></p>
              <p>{feel[key]}</p>
            </div>
          ))
        }
      </div>
      <div className='site-calendar-demo-card'>
        <div className='calendar-item'>
          <Calendar
            fullscreen={false}
            defaultValue={monthList[0]}
            dateFullCellRender={renderCell}
            headerRender={noop}
          />
        </div>
        <div className='calendar-item'>
          <Calendar
            fullscreen={false}
            defaultValue={monthList[1]}
            dateFullCellRender={renderCell}
            headerRender={noop}
          />
        </div>
        <div className='calendar-item'>
          <Calendar
            fullscreen={false}
            defaultValue={monthList[2]}
            dateFullCellRender={renderCell}
            headerRender={noop}
          />
        </div>
      </div>
    </div>
  )
}

export default Review