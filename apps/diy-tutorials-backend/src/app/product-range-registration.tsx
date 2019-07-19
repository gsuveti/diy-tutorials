import React from 'react';
import {initBaseAttributes, ProductRange, withBaseAttributes} from '@diy-tutorials/diy-tutorials-common';

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
        <ProductRange attributes={attributes}>

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
    const {attributes} = props;

    return (
      <ProductRange attributes={attributes}/>
    );
  },
});

