import React from 'react';
import {ProductType} from '@diy-tutorials/diy-tutorials-common';
import {ProductWpContext} from './product-wp-context';

// @ts-ignore
const {TextControl} = wp.components;
// @ts-ignore
const {registerBlockType} = window.wp.blocks;
// @ts-ignore
const {BlockControls, InspectorControls, InnerBlocks} = window.wp.editor;

console.log("registerBlockType content");

registerBlockType('irian/diy-product-type', {
  title: 'diy-product-type',
  icon: 'slides',
  category: 'common',
  keywords: [],
  attributes: {},

  edit: function (props: any) {
    const ALLOWED_BLOCKS = ['irian/diy-product'];


    function getTemplate(size) {
      return new Array(size).fill(['irian/diy-product']);
    }

    return ([
        <BlockControls key='controls'>

        </BlockControls>,
        <InspectorControls key='inspector'>

        </InspectorControls>,

        <ProductType>
          <ProductWpContext.Consumer key={'index'}>
            {({productRangeList = []}: { productRangeList: any[] }) => (
              <InnerBlocks allowedBlocks={ALLOWED_BLOCKS}
                           template={getTemplate(productRangeList.length)}
              />
            )}
          </ProductWpContext.Consumer>

        </ProductType>
      ]
    );
  },


  save: function (props: any) {
    return (
      <ProductType>
        <InnerBlocks.Content/>
      </ProductType>
    );
  },
});

