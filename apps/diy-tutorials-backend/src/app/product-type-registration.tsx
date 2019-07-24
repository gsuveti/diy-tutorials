import React from 'react';
import {initBaseAttributes, ProductType, withBaseAttributes} from '@diy-tutorials/diy-tutorials-common';

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
  title: 'Tip de produs',
  icon: 'excerpt-view',
  category: 'common',
  keywords: [],
  attributes: withBaseAttributes({
    headline: {type: 'string'},
    sections: {type: 'string', default: "[]"},
  }),

  edit: withSelect((select, ownProps) => {
    const {getSectionOptions} = select("diy-tutorial");

    return {
      sectionOptions: getSectionOptions()
    };
  })((props: any) => {
    const {setAttributes, attributes, sectionOptions} = props;
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

