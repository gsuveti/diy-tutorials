import React from 'react';

import './product-list.scss';
import {serializeAttributes} from '../utils';
import {Block} from '../models/block.model';
import {InnerBlocksContent} from '../inner-blocks-content/inner-blocks-content';
import {ConnectedProduct} from '../product/product';

/* tslint:disable:no-empty-interface */
export interface ProductListProps {
  className?: string;
  attributes?: {};
  children?: any;
  innerBlocks?: Block[];
}

const allowedComponents = {
  'irian/diy-product': ConnectedProduct,
};

export const ProductList = (props: ProductListProps) => {
  const {children, innerBlocks, className, attributes} = props;

  const content = children ?
    children
    :
    <InnerBlocksContent
      innerBlocks={innerBlocks}
      allowedComponents={allowedComponents}

    />
  ;

  return (
    <div className={className}
         data-attributes={serializeAttributes(attributes)}>
      {content}
    </div>
  );
};

