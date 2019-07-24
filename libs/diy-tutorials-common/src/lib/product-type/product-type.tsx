import React from 'react';

import './product-type.scss';
import {serializeAttributes} from '../utils';

/* tslint:disable:no-empty-interface */
export interface ProductTypeProps {
  children?: any;
  attributes?: {
    headline: string;
    sections: string;
  };
}

export const ProductType = (props: ProductTypeProps) => {
  const {attributes, children} = props;

  return (
    <div data-attributes={serializeAttributes(attributes)}>
      {children}
    </div>
  );
};

export default ProductType;
