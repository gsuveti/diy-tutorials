import React from 'react';

import './product-type.scss';

/* tslint:disable:no-empty-interface */
export interface ProductTypeProps {
  children?: any;
}

export const ProductType = (props: ProductTypeProps) => {
  return (
    <div>
      <p>product-type</p>
      {props.children}
    </div>
  );
};

export default ProductType;
