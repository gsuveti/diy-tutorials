import React from 'react';
import {ProductRange} from '@diy-tutorials/diy-tutorials-common';

// @ts-ignore
const {TextControl} = wp.components;
// @ts-ignore
const {registerBlockType} = window.wp.blocks;
// @ts-ignore
const {BlockControls, InspectorControls} = window.wp.editor;

console.log("registerBlockType content");

registerBlockType('irian/diy-product-range', {
  title: 'diy-product-range',
  icon: 'slides',
  category: 'common',
  keywords: [],
  attributes: {
    headline: {type: 'string'},
  },

  edit: function (props: any) {
    const {headline, setAttributes} = props;

    return ([
        <BlockControls key='controls'>

        </BlockControls>,
        <InspectorControls key='inspector'>

        </InspectorControls>,
        <ProductRange>

          <TextControl
            label="Gama"
            key={"headline"}
            value={headline}
            onChange={(value) => {
              setAttributes({headline: value});
            }}/>

        </ProductRange>
      ]
    );
  },


  save: function (props: any) {
    return (
      <ProductRange/>
    );
  },
});

