import React from 'react';

import './product-range.scss';

/* tslint:disable:no-empty-interface */
export interface ProductRangeProps {
  children?: any;
}

export const ProductRange = (props: ProductRangeProps) => {
  return (
    <div>
      {props.children}
    </div>
  );
};

export default ProductRange;
