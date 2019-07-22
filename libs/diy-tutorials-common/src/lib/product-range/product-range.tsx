import React from 'react';

import './product-range.scss';
import {serializeAttributes} from '../utils';
import {ConnectedProduct} from '../product/product';
import {InnerBlocksContent} from '../inner-blocks-content/inner-blocks-content';
import {Block} from '../models/block.model';

/* tslint:disable:no-empty-interface */
export interface ProductRangeProps {
  className?: string;
  attributes?: {
    headline: string
    description: string
  };
  children?: any;
  isRenderedInEditor?: boolean;
  innerBlocks?: Block[];
}

const allowedComponents = {
  'irian/diy-product': ConnectedProduct,
};

export const ProductRange = (props: ProductRangeProps) => {
  const {children, innerBlocks, className, attributes, isRenderedInEditor} = props;
  const {headline, description} = attributes;
  const content = children ?
    children
    :
    <InnerBlocksContent
      innerBlocks={innerBlocks}
      allowedComponents={allowedComponents}
    />
  ;

  return (
    <div className={`py-sm`}
         data-attributes={serializeAttributes(attributes)}>

      {
        isRenderedInEditor ? null :
          <div>
            <h4>{headline}</h4>
            <p>{description}</p>
          </div>
      }


      {content}
    </div>
  );
};

export default ProductRange;
