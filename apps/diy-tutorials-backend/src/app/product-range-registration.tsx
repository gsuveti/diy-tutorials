import React from 'react';
import {initBaseAttributes, ProductRange, withBaseAttributes} from '@diy-tutorials/diy-tutorials-common';
import i18n from './i18n/i18n';

// @ts-ignore
const {TextControl, TextareaControl} = wp.components;
// @ts-ignore
const {registerBlockType} = window.wp.blocks;
// @ts-ignore
const {BlockControls, InspectorControls, InnerBlocks} = window.wp.editor;

console.log("registerBlockType content");

registerBlockType('irian/diy-product-range', {
  title: i18n.productRange.title,
  icon: 'GP',
  category: 'common',
  keywords: [],
  attributes: withBaseAttributes({
    headline: {type: 'string'},
    description: {type: 'string'},
    imageUrl: {type: 'string'},
  }),

  edit: function (props: any) {
    const {setAttributes, attributes, className} = props;
    const {headline, description, imageUrl} = attributes;

    initBaseAttributes(props);
    const ALLOWED_BLOCKS = [
      'irian/diy-product'];

    return ([
        <BlockControls key='controls'>

        </BlockControls>,
        <InspectorControls key='inspector'>

        </InspectorControls>,
        <ProductRange
          attributes={attributes}
          isRenderedInEditor={true}>
          <p className={'block-title'}>{i18n.productRange.title}</p>
          <TextControl
            label="Gama"
            key={"headline"}
            value={headline}
            onChange={(value) => {
              setAttributes({headline: value});
            }}/>
            <TextControl
            label="URL Imagine"
            key={"imageUrl"}
            value={imageUrl}
            onChange={(value) => {
              setAttributes({imageUrl: value});
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
      <ProductRange
        attributes={attributes}
        isRenderedInEditor={true}>
        <InnerBlocks.Content/>
      </ProductRange>
    );
  },
});

