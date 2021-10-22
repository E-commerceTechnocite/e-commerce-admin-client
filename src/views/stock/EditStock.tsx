import * as React from 'react';
import ActionStock from '../../components/stock/ActionStock';

interface IEditStockProps {
}

const EditStock: React.FunctionComponent<IEditStockProps> = (props) => {
  return (
      <div className="edit-stock">
          <ActionStock />
      </div>
  )
};

export default EditStock;
