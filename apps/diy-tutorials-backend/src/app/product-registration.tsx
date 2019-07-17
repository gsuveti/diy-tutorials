import React from 'react';
import {Product} from '@diy-tutorials/diy-tutorials-common';

// @ts-ignore
const {TextControl} = wp.components;
// @ts-ignore
const {registerBlockType} = window.wp.blocks;
// @ts-ignore
const {BlockControls, InspectorControls, InnerBlocks} = window.wp.editor;

console.log("registerBlockType content");

registerBlockType('irian/diy-product', {
  title: 'diy-product',
  icon: 'slides',
  category: 'common',
  keywords: [],
  attributes: {},

  edit: function (props: any) {

    const BLOCKS_TEMPLATE = [
      ['core/heading', {placeholder: 'Content header', level: 4, content: "Product"}],
      ['core/image', {}]
    ];


    return ([
        <BlockControls key='controls'>

        </BlockControls>,
        <InspectorControls key='inspector'>


        </InspectorControls>,
        <Product>
          <InnerBlocks
            template={BLOCKS_TEMPLATE}/>
        </Product>
      ]
    );
  },


  save: function (props: any) {
    return (
      <Product>
        <InnerBlocks.Content></InnerBlocks.Content>
      </Product>
    );
  },
});

