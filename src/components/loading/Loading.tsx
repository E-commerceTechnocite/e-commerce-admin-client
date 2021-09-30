import * as React from 'react';
import './loading.scss'


const Loading: React.FunctionComponent = () => {
  return <div className="lds-ring"><div></div><div></div><div></div><div></div></div>;
};

export default Loading;
