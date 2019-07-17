import React from 'react';

import './product.scss';

/* tslint:disable:no-empty-interface */
export interface ProductProps {
  children?: any
}

export const Product = (props: ProductProps) => {
  const {children} = props;

  return (
    <div>
      {children}
    </div>
  );
};
