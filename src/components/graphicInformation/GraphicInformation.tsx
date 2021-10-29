import * as React from 'react'
import './GraphicInformation.scss'
import { motion } from 'framer-motion'

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

const GraphicInformation: React.FunctionComponent = () => {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="graphic-information"
    >
      <motion.div variants={items} className="graphicItem"></motion.div>
      <motion.div variants={items} className="graphicItem"></motion.div>
    </motion.div>
  )
}
export default GraphicInformation
