import React from 'react';
import {initBaseAttributes, ProductRange, withBaseAttributes} from '@diy-tutorials/diy-tutorials-common';

// @ts-ignore
const {TextControl, TextareaControl} = wp.components;
// @ts-ignore
const {registerBlockType} = window.wp.blocks;
// @ts-ignore
const {BlockControls, InspectorControls, InnerBlocks} = window.wp.editor;

console.log("registerBlockType content");

registerBlockType('irian/diy-product-range', {
  title: 'diy-product-range',
  icon: 'slides',
  category: 'common',
  keywords: [],
  attributes: withBaseAttributes({
    headline: {type: 'string'},
    description: {type: 'string'},
  }),

  edit: function (props: any) {
    const {setAttributes, attributes} = props;
    const {headline, description} = attributes;

    initBaseAttributes(props);
    const ALLOWED_BLOCKS = [
      'irian/diy-product'];

    return ([
        <BlockControls key='controls'>

        </BlockControls>,
        <InspectorControls key='inspector'>

        </InspectorControls>,
        <ProductRange attributes={attributes}
                      isRenderedInEditor={true}>
          <TextControl
            label="Gama"
            key={"headline"}
            value={headline}
            onChange={(value) => {
              setAttributes({headline: value});
            }}/>
          <TextareaControl
            label="Description"
            key={"description"}
            value={description}
            onChange={(value) => {
              setAttributes({description: value});
            }}/>
          <InnerBlocks allowedBlocks={ALLOWED_BLOCKS}
          />
        </ProductRange>
      ]
    );
  },


  save: function (props: any) {
    const {attributes} = props;

    return (
      <ProductRange attributes={attributes}>
        <InnerBlocks.Content/>
      </ProductRange>
    );
  },
});

