import React from 'react';
import {initBaseAttributes, ProductType, withBaseAttributes} from '@diy-tutorials/diy-tutorials-common';
import i18n from './i18n/i18n';

// @ts-ignore
const {TextControl, SelectControl} = wp.components;
// @ts-ignore
const {registerBlockType} = window.wp.blocks;
// @ts-ignore
const {BlockControls, InspectorControls, InnerBlocks} = window.wp.editor;
// @ts-ignore
const {withSelect} = window.wp.data;

console.log("registerBlockType content");

registerBlockType('irian/diy-product-type', {
  title: i18n.productType.title,
  icon: 'excerpt-view',
  category: 'common',
  keywords: [],
  attributes: withBaseAttributes({
    headline: {type: 'string'},
  }),

  edit: withSelect((select, ownProps) => {
    return {};
  })((props: any) => {
    const {setAttributes, attributes} = props;
    const {headline, sections} = attributes;

    initBaseAttributes(props);

    const ALLOWED_BLOCKS = [
      'irian/diy-display-condition'];

    return ([
        <BlockControls key='controls'>

        </BlockControls>,
        <InspectorControls key='inspector'>

        </InspectorControls>,

        <ProductType attributes={attributes}>
          <div>
            <p className={'block-title'}>{i18n.productType.title}</p>
            <TextControl
              label="Tip produs"
              key={"headline"}
              value={headline}
              onChange={(value) => {
                setAttributes({headline: value});
              }}/>
            <InnerBlocks key={"innerBlocks"}
                         allowedBlocks={ALLOWED_BLOCKS}/>
          </div>
        </ProductType>
      ]
    );
  }),


  save: function (props: any) {
    const {attributes} = props;

    return (
      <ProductType attributes={attributes}>
        <InnerBlocks.Content/>
      </ProductType>
    );
  },
});

