import React from 'react';

import './product-type.scss';
import {serializeAttributes} from '../utils';

/* tslint:disable:no-empty-interface */
export interface ProductTypeProps {
  children?: any;
  attributes?: any;
}

export const ProductType = (props: ProductTypeProps) => {
  const {attributes} = props;

  return (
    <div data-attributes={serializeAttributes(attributes)}>
      {props.children}
    </div>
  );
};

export default ProductType;
