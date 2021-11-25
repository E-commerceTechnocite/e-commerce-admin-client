import { motion } from 'framer-motion';
import * as React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Granted from '../Granted';
import Legend from '../legend/legend';
import Pagination from '../pagination/Pagination';

interface IOrdersProps {
}

const Orders: React.FunctionComponent<IOrdersProps> = (props) => {
  const [orders, setOrders] = useState([])
  const [meta, setMeta] = useState()
  const deleteOrders = (id: string) => {
    return
  }
  
  return (
    <>
      {/* {orders && meta && ( */}
        <div className="users">
          <div className="top-container">
          </div>
          <div className="user-list">
            <div className="legend">
              <span></span>
              <Legend uri={`/users`} name={`Username`} search={`username`} />
              <Legend uri={`/users`} name={`Role`} search={`role.name`} />
              <Legend uri={`/users`} name={`Email`} search={`email`} />
            </div>
            <motion.div
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.01,
                  },
                },
              }}
              initial="hidden"
              animate="show"
            >
              {orders?.map((order, index) => {
                return (
                  <motion.div
                    variants={{
                      hidden: { opacity: 0 },
                      show: { opacity: 1 },
                    }}
                    className="user"
                    key={index}
                  >
                    <span>{order.reference}</span>
                    <span>{order.price}</span>
                    <span>{order.status}</span>
                    <button type="button">Details</button>
                    <Granted permissions={['d:user']}>
                        <button
                          className="delete"
                          onClick={() => deleteOrders(order.id)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                    </Granted>
                  </motion.div>
                )
              })}
            </motion.div>
            {meta && <Pagination meta={meta} uri="/users?page=" />}
          </div>
        </div>
      {/* )} */}
    </>
  )
};

export default Orders;

