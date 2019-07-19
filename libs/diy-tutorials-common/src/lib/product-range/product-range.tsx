import React from 'react';

import './product-range.scss';
import {serializeAttributes} from '../utils';

/* tslint:disable:no-empty-interface */
export interface ProductRangeProps {
  children?: any;
  attributes?: any;
}

export const ProductRange = (props: ProductRangeProps) => {
  const {attributes} = props;

  return (
    <div data-attributes={serializeAttributes(attributes)}>
      {props.children}
    </div>
  );
};

export default ProductRange;
