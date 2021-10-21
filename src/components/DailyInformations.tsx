import * as React from "react";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const items = {
  hidden: { opacity: 0, y: 0, scale: 0.5 },
  show: { opacity: 1, y: 0, scale: 1 },
};

const DailyInformations: React.FunctionComponent = () => {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="daily-information"
    >
      <motion.div variants={items} className="informationItem">
        <div className="informationContainer">
          <h4>Sales</h4>
          <p className="price">10321351 €</p>
        </div>
        <div>
          <i className="fas fa-coins" />
        </div>
      </motion.div>
      <motion.div variants={items} className="informationItem">
        <div className="informationContainer">
          <h4>Transaction</h4>
          <p className="price">658</p>
        </div>
        <div>
          <i className="fas fa-wallet" />
        </div>
      </motion.div>
      <motion.div variants={items} className="informationItem">
        <div className="informationContainer">
          <h4>Users</h4>
          <p className="price">1345</p>
        </div>
        <div>
          <i className="fas fa-users" />
        </div>
      </motion.div>
      <motion.div variants={items} className="informationItem">
        <div className="informationContainer">
          <h4>New Users</h4>
          <p className="price">45</p>
        </div>
        <div>
          <i className="fas fa-user-plus" />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DailyInformations;
