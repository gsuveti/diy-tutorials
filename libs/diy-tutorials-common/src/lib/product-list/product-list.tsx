import React from 'react';

import './product-list.scss';

/* tslint:disable:no-empty-interface */
export interface ProductListProps {
  children?:any;
}

export const ProductList = (props: ProductListProps) => {
  return (
    <div>
      <p>product-list</p>
      {props.children}
    </div>
  );
};

