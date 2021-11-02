import * as React from 'react';
import CustomersList from '../../components/customers/CustomersList';

interface ICustomersProps {
}

const Customers: React.FunctionComponent<ICustomersProps> = (props) => {
  return <CustomersList />
};

export default Customers;
