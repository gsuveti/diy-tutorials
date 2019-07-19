import React from 'react';
import {initBaseAttributes, ProductType, withBaseAttributes} from '@diy-tutorials/diy-tutorials-common';

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
  attributes: withBaseAttributes({
    headline: {type: 'string'},
  }),

  edit: function (props: any) {
    const {setAttributes, attributes} = props;
    const {headline} = attributes;

    initBaseAttributes(props);

    return ([
        <BlockControls key='controls'>

        </BlockControls>,
        <InspectorControls key='inspector'>

        </InspectorControls>,

        <ProductType attributes={attributes}>

          <TextControl
            label="Tip produs"
            key={"headline"}
            value={headline}
            onChange={(value) => {
              setAttributes({headline: value});
            }}/>
        </ProductType>
      ]
    );
  },


  save: function (props: any) {
    const {attributes} = props;

    return (
      <ProductType attributes={attributes}/>
    );
  },
});

