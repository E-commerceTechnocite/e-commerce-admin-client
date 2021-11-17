import * as React from 'react'
import './GraphicInformation.scss'
import { motion } from 'framer-motion'
import {Line, Bar} from 'react-chartjs-2'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    delay: 0.2,
    transition: {
      staggerChildren: 0.05,
    },
  },
}

const items = {
  hidden: { opacity: 0, y: 0 },
  show: { opacity: 1, y: 0 },
}

const salesState = {
  labels: ['June','July','August','September','October','November'],
  datasets: [
    {
      label: 'Sales', 
      fill: false,
      backgroundColor: '#5a77e0',
      borderColor: 'rgba(0,0,0,1)',
      borderWidth: 1,
      data:[
        901840,
        811840,
        981880,
        575600,
        745000,
        880000,
      ]
    }
  ]
}

const salesOptions = {
  plugins: {
    title: { 
        display: true,
        text: "Sales per month",
        font: {
          size: 14
        },
        padding: 15
    },
    legend: {
      display: false,
      position: 'right',
      labels:{
          fontColor:'#000'
      }
    }
  }
}

const usersState = {
  labels: ['June','July','August','September','October','November'],
  datasets: [
    {
      label: 'New users',
      barPercentage: 0.4,
      backgroundColor: '#5a77e0',
      borderColor: 'rgba(0,0,0,1)',
      borderWidth: 1,
      hoverBackgroundColor: [
        '#5a77e0',
        '#5a77e0',
        '#5a77e0',
        '#5a77e0',
        '#5a77e0',
        '#5a77e0'
      ],
      data: [65, 59, 76, 46, 51, 62]
    }
  ]
}

const usersOptions = {
  plugins: {
    title: { 
        display: true,
        text: "New users per month",
        font: {
          size: 14
        },
        padding: 15
    },
    legend: {
      display: false,
      position:'right',
      labels:{
          fontColor:'#000'
      }
    }
  }
}

const GraphicInformation: React.FunctionComponent = () => {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="graphic-information"
    >
      <motion.div variants={items} className="graphicItem">
          <Line 
            data={salesState}
            // options={salesOptions}
          />
      </motion.div>
      <motion.div variants={items} className="graphicItem">
          <Bar
            data={usersState}
            // options={usersOptions}
          />
      </motion.div>
    </motion.div>
  )
}
export default GraphicInformation
